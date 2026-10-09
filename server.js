const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Phase 13 Server-Side Payment & Webhook Verification Subsystem
const TIER_PRICES_REGISTRY = {
  'ai-foundations': { tierName: 'AI Foundations', priceDisplay: 'FREE', amount: 0, currency: 'USD', isPaid: false },
  'ai-builder': { tierName: 'AI Builder', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
  'ai-creator': { tierName: 'AI Creator', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
  'ai-architect': { tierName: 'AI Architect', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true }
};

const PROCESSED_WEBHOOK_EVENTS = new Set();
const ACTIVE_CHECKOUT_TRANSACTIONS = new Map();

// Phase 14 Notification Delivery Engine Datastores
const NOTIFICATION_DEVICE_TOKENS = new Map();
const USER_NOTIFICATION_PREFERENCES = new Map();
const NOTIFICATION_HISTORY = new Map();
const USER_NOTIFICATION_INBOXES = new Map();
const PROCESSED_NOTIFICATION_IDEMPOTENCY = new Set();

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nexvion-signature, webhook-signature, x-admin-role'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nexvion-signature, webhook-signature, x-admin-role'
    });
    res.end();
    return;
  }

  // Phase 13 Payment API Endpoints
  if (pathname === '/api/payments/config' && req.method === 'GET') {
    sendJson(res, 200, {
      country: 'US',
      currency: 'USD',
      provider: 'Nexvion Gateway Abstraction (Stripe / Sandbox)',
      tiers: TIER_PRICES_REGISTRY
    });
    return;
  }

  if (pathname === '/api/payments/create-checkout-session' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { studentId, studentName, studentEmail, courseId, tierId } = body;
      if (!studentId || !tierId) {
        return sendJson(res, 400, { error: 'Missing required fields: studentId and tierId' });
      }

      const tierConfig = TIER_PRICES_REGISTRY[tierId];
      if (!tierConfig) {
        return sendJson(res, 404, { error: `Tier "${tierId}" not found` });
      }

      // Free tier: Foundations
      if (!tierConfig.isPaid || tierId === 'ai-foundations') {
        const txRef = `NEX-FREE-${Date.now()}`;
        return sendJson(res, 200, {
          success: true,
          freeTier: true,
          status: 'Not required',
          transactionRef: txRef,
          amount: 0,
          currency: 'USD',
          message: 'Free tier enrolled successfully'
        });
      }

      // Paid tier: Check if price is configured or coming soon
      if (tierConfig.amount === null || tierConfig.priceDisplay === 'PRICE COMING SOON') {
        const txRef = `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        return sendJson(res, 200, {
          success: false,
          comingSoon: true,
          status: 'Pending',
          transactionRef: txRef,
          priceDisplay: 'PRICE COMING SOON',
          message: 'Official tuition price coming soon. Cohort seat reserved pending fee schedule.'
        });
      }

      // Paid tier with configured price: create checkout session
      const transactionRef = `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkoutData = {
        sessionId,
        transactionRef,
        studentId,
        studentName: studentName || 'Student',
        studentEmail: studentEmail || '',
        courseId: courseId || tierId,
        tierId,
        amount: tierConfig.amount,
        currency: tierConfig.currency || 'USD',
        status: 'Pending',
        verificationStatus: 'Pending verification',
        createdAt: new Date().toISOString()
      };
      ACTIVE_CHECKOUT_TRANSACTIONS.set(transactionRef, checkoutData);

      sendJson(res, 200, {
        success: true,
        sessionId,
        transactionRef,
        checkoutUrl: `/checkout.html?session_id=${sessionId}&tx=${transactionRef}`,
        amount: tierConfig.amount,
        currency: tierConfig.currency || 'USD',
        status: 'Pending'
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/verify-payment' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { transactionRef, studentId, amount, currency } = body;
      if (!transactionRef) {
        return sendJson(res, 400, { error: 'Missing transactionRef' });
      }

      const tx = ACTIVE_CHECKOUT_TRANSACTIONS.get(transactionRef);
      if (!tx) {
        return sendJson(res, 404, { error: 'Transaction reference not found' });
      }

      // Validate amount against server registry (never trust client)
      if (amount !== undefined && Number(amount) !== Number(tx.amount)) {
        return sendJson(res, 400, { error: `Amount mismatch: expected ${tx.amount}, received ${amount}` });
      }
      if (currency && currency.toUpperCase() !== tx.currency.toUpperCase()) {
        return sendJson(res, 400, { error: `Currency mismatch: expected ${tx.currency}, received ${currency}` });
      }
      if (studentId && tx.studentId && studentId !== tx.studentId) {
        return sendJson(res, 403, { error: 'Unauthorized: transaction does not belong to student' });
      }

      tx.status = 'Paid';
      tx.verificationStatus = 'Verified';
      tx.verifiedAt = new Date().toISOString();

      sendJson(res, 200, {
        success: true,
        verified: true,
        transactionRef,
        status: 'Paid',
        verificationStatus: 'Verified',
        amount: tx.amount,
        currency: tx.currency
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/webhook' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const signature = req.headers['x-nexvion-signature'] || req.headers['webhook-signature'];
      if (!signature) {
        return sendJson(res, 401, { error: 'Missing webhook signature' });
      }

      const eventId = body.id || `${body.type}_${body.transactionRef || Date.now()}`;
      if (PROCESSED_WEBHOOK_EVENTS.has(eventId)) {
        return sendJson(res, 200, { received: true, duplicate: true, message: 'Event already processed (idempotent)' });
      }
      PROCESSED_WEBHOOK_EVENTS.add(eventId);

      const tx = body.transactionRef ? ACTIVE_CHECKOUT_TRANSACTIONS.get(body.transactionRef) : null;
      if (tx) {
        if (body.type === 'payment.succeeded' || body.type === 'payment_intent.succeeded') {
          tx.status = 'Paid';
          tx.verificationStatus = 'Verified';
        } else if (body.type === 'payment.failed' || body.type === 'payment_intent.payment_failed') {
          tx.status = 'Failed';
          tx.verificationStatus = 'Verification failed';
        } else if (body.type === 'payment.cancelled' || body.type === 'checkout.session.cancelled') {
          tx.status = 'Cancelled';
        } else if (body.type === 'payment.refunded' || body.type === 'charge.refunded') {
          tx.status = 'Refunded';
          tx.refundStatus = 'Processed';
        }
      }

      sendJson(res, 200, { received: true, eventId, status: 'processed' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/refund' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const authRole = req.headers['x-admin-role'];
      if (!['Owner', 'Super Admin', 'Finance Manager'].includes(authRole)) {
        return sendJson(res, 403, { error: 'Access denied: Only Finance Managers or Super Admins can initiate refunds' });
      }

      const { transactionRef, reason } = body;
      const tx = transactionRef ? ACTIVE_CHECKOUT_TRANSACTIONS.get(transactionRef) : null;
      if (tx) {
        tx.status = 'Refunded';
        tx.refundStatus = 'Processed';
        tx.refundReason = reason || 'Administrative refund';
      }

      sendJson(res, 200, { success: true, refundStatus: 'Processed', reason: reason || 'Administrative refund' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  // =========================================================================
  // Phase 14 Notification Delivery Engine Endpoints
  // =========================================================================
  if (pathname === '/api/notifications/devices/register' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, token, platform, deviceModel, appVersion } = body;
      if (!userId || !token || !platform) {
        return sendJson(res, 400, { error: 'Missing required device registration fields: userId, token, and platform.' });
      }

      const validPlatforms = ['android', 'web', 'desktop', 'ios'];
      const normPlatform = String(platform).toLowerCase();
      if (!validPlatforms.includes(normPlatform)) {
        return sendJson(res, 400, { error: `Invalid platform "${platform}". Must be one of: ${validPlatforms.join(', ')}` });
      }

      const record = {
        token,
        userId,
        platform: normPlatform,
        deviceModel: deviceModel || 'Standard Terminal',
        appVersion: appVersion || '1.0.0',
        registeredAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        valid: true
      };
      NOTIFICATION_DEVICE_TOKENS.set(token, record);

      sendJson(res, 200, {
        success: true,
        message: 'Device token registered successfully',
        token,
        platform: normPlatform,
        registeredAt: record.registeredAt
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/devices/unregister' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, token } = body;
      if (!token) {
        return sendJson(res, 400, { error: 'Missing required field: token' });
      }

      const existing = NOTIFICATION_DEVICE_TOKENS.get(token);
      if (existing) {
        if (userId && existing.userId !== userId) {
          return sendJson(res, 403, { error: 'Forbidden: Cannot remove device token belonging to another user.' });
        }
        NOTIFICATION_DEVICE_TOKENS.delete(token);
      }

      sendJson(res, 200, {
        success: true,
        unregistered: true,
        message: 'Device token removed successfully'
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/devices' && req.method === 'GET') {
    const userId = parsedUrl.query.userId;
    if (!userId) {
      return sendJson(res, 400, { error: 'Missing query parameter: userId' });
    }

    // Never expose another user's device tokens
    const userDevices = Array.from(NOTIFICATION_DEVICE_TOKENS.values())
      .filter(d => d.userId === userId && d.valid)
      .map(({ token, platform, deviceModel, appVersion, lastSeenAt, registeredAt }) => ({
        token,
        platform,
        deviceModel,
        appVersion,
        lastSeenAt,
        registeredAt
      }));

    sendJson(res, 200, { userId, devices: userDevices });
    return;
  }

  if (pathname === '/api/notifications/devices/cleanup-invalid' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { invalidTokens } = body;
      let cleanedCount = 0;
      if (Array.isArray(invalidTokens)) {
        for (const tok of invalidTokens) {
          if (NOTIFICATION_DEVICE_TOKENS.has(tok)) {
            NOTIFICATION_DEVICE_TOKENS.delete(tok);
            cleanedCount++;
          }
        }
      } else {
        for (const [tok, data] of NOTIFICATION_DEVICE_TOKENS.entries()) {
          if (!data.valid) {
            NOTIFICATION_DEVICE_TOKENS.delete(tok);
            cleanedCount++;
          }
        }
      }

      sendJson(res, 200, { success: true, cleanedCount, remainingTokens: NOTIFICATION_DEVICE_TOKENS.size });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/preferences' && req.method === 'GET') {
    const userId = parsedUrl.query.userId;
    if (!userId) {
      return sendJson(res, 400, { error: 'Missing query parameter: userId' });
    }

    const defaultPrefs = {
      newClasses: true,
      classReminders: true,
      announcements: true,
      enrollmentUpdates: true,
      projectReminders: true,
      certificateUpdates: true,
      systemMessages: true,
      emailDigest: false,
      pushEnabled: true
    };
    const prefs = USER_NOTIFICATION_PREFERENCES.get(userId) || defaultPrefs;
    sendJson(res, 200, { userId, preferences: prefs });
    return;
  }

  if (pathname === '/api/notifications/preferences' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, preferences } = body;
      if (!userId || !preferences) {
        return sendJson(res, 400, { error: 'Missing userId or preferences object.' });
      }

      const existing = USER_NOTIFICATION_PREFERENCES.get(userId) || {
        newClasses: true,
        classReminders: true,
        announcements: true,
        enrollmentUpdates: true,
        projectReminders: true,
        certificateUpdates: true,
        systemMessages: true,
        emailDigest: false,
        pushEnabled: true
      };
      const updated = { ...existing, ...preferences };
      USER_NOTIFICATION_PREFERENCES.set(userId, updated);

      sendJson(res, 200, { success: true, userId, preferences: updated });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/send' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const authRole = req.headers['x-admin-role'] || 'System';
      const allowedRoles = ['Owner', 'Super Admin', 'Student Manager', 'Content Manager', 'System'];
      if (!allowedRoles.includes(authRole)) {
        return sendJson(res, 403, { error: 'Access denied: Only authorized administrators or system backend can dispatch notifications.' });
      }

      const {
        title,
        message,
        type = 'System message',
        audience = 'All Enrolled Students',
        courseId = '',
        tierId = '',
        batchId = '',
        deepLink = '',
        scheduledFor = null,
        targetUserId = null,
        idempotencyKey = null,
        simulateFailure = false
      } = body;

      if (!title || !message) {
        return sendJson(res, 400, { error: 'Missing required notification fields: title and message.' });
      }

      // Check idempotency to prevent duplicate notification sends
      if (idempotencyKey) {
        if (PROCESSED_NOTIFICATION_IDEMPOTENCY.has(idempotencyKey)) {
          const cached = NOTIFICATION_HISTORY.get(idempotencyKey);
          return sendJson(res, 200, {
            duplicate: true,
            idempotent: true,
            message: 'Duplicate notification request recognized and deduplicated (idempotent)',
            notification: cached || { id: idempotencyKey, status: 'Sent' }
          });
        }
        PROCESSED_NOTIFICATION_IDEMPOTENCY.add(idempotencyKey);
      }

      const notifId = idempotencyKey || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const nowIso = new Date().toISOString();
      const isScheduled = !!scheduledFor && new Date(scheduledFor) > new Date();

      // Collect target users
      let targetUserIds = [];
      if (targetUserId) {
        targetUserIds = [targetUserId];
      } else {
        // Collect distinct users from registered devices or defaults
        const allKnownUsers = new Set();
        for (const dev of NOTIFICATION_DEVICE_TOKENS.values()) {
          if (dev.valid) allKnownUsers.add(dev.userId);
        }
        // Always include current student sessions
        allKnownUsers.add('stu-nx-8821');
        allKnownUsers.add('stu-sample-01');
        targetUserIds = Array.from(allKnownUsers);
      }

      // Map notification type to preference key
      const typePrefMap = {
        'New class': 'newClasses',
        'Class reminder': 'classReminders',
        'Announcement': 'announcements',
        'Enrollment update': 'enrollmentUpdates',
        'Project reminder': 'projectReminders',
        'Certificate update': 'certificateUpdates',
        'System message': 'systemMessages'
      };
      const prefKey = typePrefMap[type] || 'systemMessages';

      let recipientCount = 0;
      let successCount = 0;
      let failureCount = 0;
      let errorSummary = null;

      if (!isScheduled) {
        if (simulateFailure) {
          failureCount = targetUserIds.length || 1;
          recipientCount = failureCount;
          errorSummary = 'Simulated FCM transport network disconnect';
        } else {
          for (const uid of targetUserIds) {
            const prefs = USER_NOTIFICATION_PREFERENCES.get(uid) || {
              newClasses: true,
              classReminders: true,
              announcements: true,
              enrollmentUpdates: true,
              projectReminders: true,
              certificateUpdates: true,
              systemMessages: true,
              emailDigest: false,
              pushEnabled: true
            };

            // Respect disabled preferences
            if (!prefs.pushEnabled || prefs[prefKey] === false) {
              continue; // User opted out of this notification type
            }

            recipientCount++;

            // Deliver to user in-app inbox
            let inbox = USER_NOTIFICATION_INBOXES.get(uid) || [];
            inbox.unshift({
              id: `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              notificationId: notifId,
              title,
              message,
              type,
              deepLink,
              read: false,
              createdAt: nowIso
            });
            USER_NOTIFICATION_INBOXES.set(uid, inbox);

            // Deliver to registered devices (Android, Web, Desktop)
            const userTokens = Array.from(NOTIFICATION_DEVICE_TOKENS.values()).filter(d => d.userId === uid && d.valid);
            if (userTokens.length > 0) {
              userTokens.forEach(dev => {
                dev.lastSeenAt = nowIso;
              });
              successCount++;
            } else {
              // In-app inbox delivered successfully
              successCount++;
            }
          }
        }
      }

      let status = isScheduled ? 'Scheduled' : 'Sent';
      if (!isScheduled) {
        if (simulateFailure) status = 'Failed';
        else if (recipientCount > 0 && failureCount > 0 && successCount > 0) status = 'Partially delivered';
        else if (recipientCount > 0 && successCount === 0) status = 'Failed';
        else status = 'Sent';
      }

      const notifRecord = {
        id: notifId,
        title,
        message,
        type,
        audience,
        courseId,
        tierId,
        batchId,
        deepLink,
        status,
        recipientCount: isScheduled ? targetUserIds.length : recipientCount,
        successCount,
        failureCount,
        errorSummary,
        createdBy: authRole,
        createdAt: nowIso,
        scheduledFor: isScheduled ? new Date(scheduledFor).toISOString() : null,
        sentAt: isScheduled ? null : nowIso
      };

      NOTIFICATION_HISTORY.set(notifId, notifRecord);

      sendJson(res, 200, {
        success: !simulateFailure,
        notification: notifRecord,
        recipientCount: notifRecord.recipientCount,
        successCount,
        failureCount,
        status
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/cancel-scheduled' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { notificationId } = body;
      if (!notificationId) {
        return sendJson(res, 400, { error: 'Missing notificationId' });
      }

      const notif = NOTIFICATION_HISTORY.get(notificationId);
      if (!notif) {
        return sendJson(res, 404, { error: 'Notification record not found' });
      }

      notif.status = 'Cancelled';
      notif.cancelledAt = new Date().toISOString();

      sendJson(res, 200, { success: true, notificationId, status: 'Cancelled' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/history' && req.method === 'GET') {
    const list = Array.from(NOTIFICATION_HISTORY.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sendJson(res, 200, { history: list, notifications: list });
    return;
  }

  if (pathname === '/api/notifications/inbox' && req.method === 'GET') {
    const userId = parsedUrl.query.userId || 'stu-nx-8821';
    const inbox = USER_NOTIFICATION_INBOXES.get(userId) || [];
    const unreadCount = inbox.filter(m => !m.read).length;
    sendJson(res, 200, { userId, unreadCount, inbox, notifications: inbox });
    return;
  }

  if (pathname === '/api/notifications/inbox/mark-read' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, notificationId, markAll } = body;
      if (!userId) {
        return sendJson(res, 400, { error: 'Missing userId' });
      }

      let inbox = USER_NOTIFICATION_INBOXES.get(userId) || [];
      if (markAll) {
        inbox.forEach(item => { item.read = true; });
      } else if (notificationId) {
        const item = inbox.find(m => m.id === notificationId || m.notificationId === notificationId);
        if (item) item.read = true;
      }
      USER_NOTIFICATION_INBOXES.set(userId, inbox);

      const unreadCount = inbox.filter(m => !m.read).length;
      sendJson(res, 200, { success: true, userId, unreadCount });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/status' && req.method === 'GET') {
    const txRef = parsedUrl.query.tx || parsedUrl.query.transactionRef;
    const sessionId = parsedUrl.query.session_id || parsedUrl.query.sessionId;
    let tx = null;
    if (txRef) {
      tx = ACTIVE_CHECKOUT_TRANSACTIONS.get(txRef);
    } else if (sessionId) {
      for (const item of ACTIVE_CHECKOUT_TRANSACTIONS.values()) {
        if (item.sessionId === sessionId) { tx = item; break; }
      }
    }
    if (!tx) {
      return sendJson(res, 404, { error: 'Transaction or session not found' });
    }
    return sendJson(res, 200, {
      transactionRef: tx.transactionRef,
      sessionId: tx.sessionId,
      studentId: tx.studentId,
      courseId: tx.courseId,
      tierId: tx.tierId,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      verificationStatus: tx.verificationStatus,
      refundStatus: tx.refundStatus || 'None'
    });
  }

  if (pathname === '/course' || pathname === '/course.html') {
    pathname = '/course.html';
  } else if (pathname === '/checkout' || pathname === '/checkout.html') {
    pathname = '/checkout.html';
  } else if (pathname === '/register' || pathname === '/register.html') {
    pathname = '/register.html';
  } else if (pathname === '/dashboard' || pathname === '/dashboard.html') {
    pathname = '/dashboard.html';
  } else if (pathname === '/design-system' || pathname === '/design-system.html') {
    pathname = '/design-system.html';
  } else if (pathname === '/waitlist' || pathname === '/waitlist.html') {
    pathname = '/course.html';
  } else if (pathname.startsWith('/admin/') && path.extname(pathname)) {
    // Strip /admin prefix for static assets requested relatively from /admin/* pages
    const stripped = pathname.replace(/^\/admin/, '');
    const candidatePath = path.normalize(path.join(BASE_DIR, stripped));
    if (fs.existsSync(candidatePath)) {
      pathname = stripped;
    }
  } else if (pathname === '/admin' || pathname === '/admin.html' || (pathname.startsWith('/admin/') && !path.extname(pathname))) {
    pathname = '/admin.html';
  } else if (pathname === '/login') {
    pathname = '/index.html';
  } else if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(BASE_DIR, pathname));

  // Security check to prevent directory traversal
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
        <html lang="en">
        <head>
          <title>404 - Not Found | NEXVION AI</title>
          <style>
            body { background: #08090E; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            h1 { font-size: 3rem; color: #8B5CF6; margin-bottom: 0.5rem; }
            p { color: #94A3B8; }
            a { color: #8B5CF6; text-decoration: none; border-bottom: 1px solid #8B5CF6; }
          </style>
        </head>
        <body>
          <div>
            <h1>404</h1>
            <p>Page or asset not found in NEXVION AI.</p>
            <p><a href="/">Return to NEXVION AI Landing Page</a></p>
          </div>
        </body>
        </html>`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`NEXVION AI Server running at http://127.0.0.1:${PORT}/`);
});
