/**
 * ==============================================================================
 * NEXVION AI — Firebase Cloud Functions (v2)
 * ==============================================================================
 * Secure Server-Side Push Notification Dispatcher
 * Automatically triggers whenever a new notification record is created in Firestore.
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

// Initialize Firebase Admin SDK
initializeApp();

const db = getFirestore();

/**
 * sendNotification
 * Triggers on: /notifications/{notificationId}
 */
exports.sendNotification = onDocumentCreated(
  "notifications/{notificationId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const notice = snapshot.data();
    if (!notice) return;

    // Avoid duplicate dispatch if already processed by this Cloud Function
    if (notice.dispatchedAt) {
      return;
    }

    // 1. Verify creator authorization (Admin or authorized system trigger)
    const creatorId = notice.createdBy;
    const isSystemTrigger = !creatorId ||
      creatorId === "system" ||
      creatorId === "admin" ||
      creatorId.includes("System") ||
      creatorId.includes("Scheduler") ||
      creatorId.includes("Automation") ||
      creatorId.includes("Directorate");

    if (!isSystemTrigger && creatorId) {
      try {
        const adminDoc = await db.collection("adminUsers").doc(creatorId).get();
        const userDoc = await db.collection("users").doc(creatorId).get();

        const isAuthorizedAdmin =
          (adminDoc.exists && ["Owner", "Super Admin", "Student Manager", "Content Manager"].includes(adminDoc.data().role)) ||
          (userDoc.exists && userDoc.data().role === "admin");

        if (!isAuthorizedAdmin && (adminDoc.exists || userDoc.exists)) {
          console.warn(`[Functions] Rejected notification: creator ${creatorId} lacks admin privileges.`);
          await snapshot.ref.update({
            status: "rejected",
            error: "Unauthorized creator role",
            dispatchedAt: new Date().toISOString()
          });
          return;
        }
      } catch (authCheckErr) {
        console.warn("[Functions] Admin role verification notice:", authCheckErr.message);
      }
    }

    const title = notice.title;
    const body = notice.body || notice.message;
    if (!title || !body) {
      console.warn("[Functions] Notification missing required title or body payload.");
      return;
    }

    // 2. Query target device push tokens
    let tokens = [];

    if (notice.target === "user" && notice.targetUserId) {
      // Target specific student
      try {
        const userDevices = await db
          .collection("users")
          .doc(notice.targetUserId)
          .collection("devices")
          .get();
        userDevices.forEach((doc) => {
          const t = doc.data().token;
          if (typeof t === "string" && t) tokens.push(t);
        });
      } catch (err) {
        console.warn("[Functions] Could not read user devices:", err.message);
      }

      try {
        const directTokens = await db
          .collection("deviceTokens")
          .where("userId", "==", notice.targetUserId)
          .get();
        directTokens.forEach((doc) => {
          const t = doc.data().token;
          if (typeof t === "string" && t) tokens.push(t);
        });
      } catch (err) {
        console.warn("[Functions] Could not query deviceTokens for user:", err.message);
      }
    } else {
      // Broadcast to all registered devices (target: 'all' or default)
      try {
        const devices = await db.collectionGroup("devices").get();
        devices.forEach((doc) => {
          const t = doc.data().token;
          if (typeof t === "string" && t) tokens.push(t);
        });
      } catch (err) {
        console.warn("[Functions] collectionGroup(devices) query note:", err.message);
      }

      try {
        const globalTokens = await db.collection("deviceTokens").get();
        globalTokens.forEach((doc) => {
          const t = doc.data().token;
          if (typeof t === "string" && t) tokens.push(t);
        });
      } catch (err) {
        console.warn("[Functions] deviceTokens collection query note:", err.message);
      }
    }

    // Deduplicate tokens
    tokens = [...new Set(tokens.filter((t) => typeof t === "string" && t.length > 20))];

    if (tokens.length === 0) {
      console.log("[Functions] No active push tokens registered. Completed with count 0.");
      await snapshot.ref.update({
        status: "sent",
        sentCount: 0,
        failedCount: 0,
        note: "No device tokens found",
        dispatchedAt: new Date().toISOString()
      });
      return;
    }

    let sent = 0;
    let failed = 0;
    const invalidTokens = [];

    // 3. Dispatch in multicast batches (FCM limit: 500 tokens per batch)
    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);

      try {
        const response = await getMessaging().sendEachForMulticast({
          tokens: batch,
          notification: {
            title: title,
            body: body
          },
          data: {
            url: notice.url || notice.deepLink || "./dashboard.html",
            type: notice.type || "announcement",
            notificationId: event.params.notificationId || ""
          },
          webpush: {
            headers: {
              Urgency: "high"
            },
            notification: {
              title: title,
              body: body,
              icon: "https://nexvion-ai.web.app/icons/icon-192.png",
              badge: "https://nexvion-ai.web.app/icons/icon-192.png",
              requireInteraction: true,
              silent: false
            },
            fcmOptions: {
              link: notice.url || notice.deepLink || "./dashboard.html"
            }
          }
        });

        sent += response.successCount;
        failed += response.failureCount;

        // Collect expired or invalid tokens for automatic cleanup & log failures
        if (response.failureCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const code = resp.error ? resp.error.code : "";
              const msg = resp.error ? resp.error.message : "";
              console.error(`[Functions] FCM token failure at index ${idx}: [${code}] ${msg}`);
              if (
                code === "messaging/registration-token-not-registered" ||
                code === "messaging/invalid-registration-token"
              ) {
                invalidTokens.push(batch[idx]);
              }
            }
          });
        }
      } catch (batchErr) {
        console.error("[Functions] Error dispatching multicast batch:", batchErr);
        failed += batch.length;
      }
    }

    // 4. Clean up invalid tokens
    if (invalidTokens.length > 0) {
      console.log(`[Functions] Pruning ${invalidTokens.length} expired or unregistered tokens.`);
      for (const badToken of invalidTokens) {
        db.collection("deviceTokens")
          .doc(encodeURIComponent(badToken))
          .delete()
          .catch(() => {});
      }
    }

    // 5. Update Firestore notification record with final delivery stats
    await snapshot.ref.update({
      status: "sent",
      deliveryStatus: "Sent",
      sentCount: sent,
      failedCount: failed,
      dispatchedAt: new Date().toISOString()
    });

    console.log(`[Functions] Notification dispatched successfully. Sent: ${sent}, Failed: ${failed}.`);
  }
);
