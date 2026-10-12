/**
 * ==============================================================================
 * NEXVION AI — Client Push Notifications Controller
 * ==============================================================================
 * Manages Web Push permissions, FCM device token generation, Firestore device
 * registration, OS-level Desktop Notifications (Windows 11 / Mac / Android),
 * and foreground message dispatching.
 */

(function () {
  'use strict';

  // Public VAPID Key (Firebase Cloud Messaging Web Push Certificate)
  const VAPID_KEY = (typeof window !== 'undefined' && window.VAPID_PUBLIC_KEY && window.VAPID_PUBLIC_KEY !== 'YOUR_PUBLIC_VAPID_KEY')
    ? window.VAPID_PUBLIC_KEY
    : "BJuxiPU55m5rguhim06cFOT8CrPXfo4cUQ6UERVHl0LVJKXuo05KYpPK0jSVvqJ6MkPonQe6KTSJDrQSMh_QlF0";

  let messagingInstance = null;
  let isRegistering = false;

  // Initialize Firebase Messaging Service
  function getMessaging() {
    if (messagingInstance) return messagingInstance;
    if (typeof firebase === 'undefined' || !firebase.messaging) {
      console.warn('[Notifications] Firebase messaging SDK not loaded yet.');
      return null;
    }
    try {
      if (typeof firebase.messaging.isSupported === 'function' && !firebase.messaging.isSupported()) {
        console.warn('[Notifications] Web push notifications are not supported in this browser.');
        return null;
      }
      messagingInstance = firebase.messaging();
      return messagingInstance;
    } catch (e) {
      console.warn('[Notifications] Failed to initialize messaging:', e.message);
      return null;
    }
  }

  // Get current active student or persistent guest identifier
  function getCurrentUser() {
    // 1. Check live Firebase Auth user
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      const fbUser = firebase.auth().currentUser;
      return {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Student',
        source: 'firebase_auth'
      };
    }

    // 2. Check authenticated student profile in localStorage
    try {
      const raw = localStorage.getItem('nexvion_current_user');
      if (raw) {
        const student = JSON.parse(raw);
        const uid = student.userId || student.studentId || student.id || student.uid;
        if (uid) {
          return {
            uid: uid,
            email: student.email || '',
            displayName: student.fullName || student.name || 'Student',
            source: 'local_storage'
          };
        }
      }
    } catch (e) {}

    // 3. Fallback guest profile so visitors & non-logged in users can also enable alerts
    let guestUid = localStorage.getItem('nexvion_guest_device_uid');
    if (!guestUid) {
      guestUid = 'guest_' + Math.random().toString(36).substring(2, 10);
      try {
        localStorage.setItem('nexvion_guest_device_uid', guestUid);
      } catch (e) {}
    }

    return {
      uid: guestUid,
      email: 'guest@nexvion.ai',
      displayName: 'Guest Student',
      source: 'guest_device'
    };
  }

  // Update all notification button & status text elements on the page
  function updateUIStatus(state, message) {
    const buttons = document.querySelectorAll('#enableNotifications, .btn-enable-push');
    const statusEls = document.querySelectorAll('#notificationStatus, .push-notification-status');

    buttons.forEach((btn) => {
      if (state === 'granted') {
        btn.textContent = '✓ Notifications Active';
        btn.classList.add('btn-active-push');
        btn.style.opacity = '0.9';
        btn.setAttribute('aria-pressed', 'true');
      } else if (state === 'loading') {
        btn.textContent = 'Enabling...';
        btn.setAttribute('disabled', 'true');
      } else if (state === 'denied') {
        btn.textContent = 'Blocked in Browser';
        btn.setAttribute('disabled', 'true');
      } else {
        btn.textContent = 'Enable Notifications';
        btn.removeAttribute('disabled');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    statusEls.forEach((el) => {
      if (message) {
        el.textContent = message;
      } else if (state === 'granted') {
        el.textContent = 'Notifications are active on this Windows device.';
      } else if (state === 'denied') {
        el.textContent = 'Notifications blocked. Check browser address bar settings.';
      } else {
        el.textContent = 'Notifications are not enabled yet.';
      }
    });
  }

  // Register device token into Firestore
  async function saveDeviceToken(user, token) {
    if (typeof firebase === 'undefined') return;

    let app;
    try {
      app = firebase.app();
    } catch (noApp) {
      if (window.firebaseConfig) {
        app = firebase.initializeApp(window.firebaseConfig);
      }
    }

    const db = (app && app.firestore) ? app.firestore() : (firebase.firestore ? firebase.firestore() : null);
    if (!db) return;

    const tokenDocId = encodeURIComponent(token);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    // 1. Save in /users/{userId}/devices/{token}
    try {
      await db
        .collection('users')
        .doc(user.uid)
        .collection('devices')
        .doc(tokenDocId)
        .set({
          token: token,
          platform: 'web',
          userAgent: navigator.userAgent || 'web-browser',
          displayName: user.displayName || '',
          email: user.email || '',
          updatedAt: timestamp
        }, { merge: true });
      console.log('[Notifications] Registered device under /users/' + user.uid + '/devices');
    } catch (err) {
      console.warn('[Notifications] Could not save under /users/devices:', err.message);
    }

    // 2. Save in /deviceTokens/{token}
    try {
      await db
        .collection('deviceTokens')
        .doc(tokenDocId)
        .set({
          tokenId: tokenDocId,
          userId: user.uid,
          token: token,
          platform: 'web',
          valid: true,
          email: user.email || '',
          updatedAt: timestamp
        }, { merge: true });
      console.log('[Notifications] Registered device under /deviceTokens');
    } catch (err) {
      console.warn('[Notifications] Could not save under /deviceTokens:', err.message);
    }

    try {
      localStorage.setItem('nexvion_fcm_token', token);
    } catch (e) {}
  }

  /**
   * Universal OS-level Desktop Notification Dispatcher
   * Displays actual Windows 11 / Mac / Android system toast banners outside the browser.
   */
  async function displaySystemNotification(title, options = {}) {
    if (!('Notification' in window)) {
      console.warn('[Notifications] Notifications API not supported.');
      return false;
    }
    if (Notification.permission !== 'granted') {
      console.warn('[Notifications] Notification permission not granted:', Notification.permission);
      return false;
    }

    let iconUrl;
    try {
      iconUrl = new URL('icons/icon-192.png', window.location.href).href;
    } catch (e) {
      iconUrl = './icons/icon-192.png';
    }

    const finalOptions = {
      body: options.body || 'You have a new update from NEXVION AI.',
      icon: options.icon || iconUrl,
      badge: options.badge || iconUrl,
      requireInteraction: options.requireInteraction !== undefined ? options.requireInteraction : true,
      renotify: options.renotify !== undefined ? options.renotify : true,
      tag: options.tag || ('nexvion-' + Date.now()),
      data: options.data || { url: './dashboard.html' }
    };

    // Primary: ServiceWorkerRegistration.showNotification (standard for Windows 10/11 & Android PWA)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && typeof reg.showNotification === 'function') {
          await reg.showNotification(title, finalOptions);
          console.log('[Notifications] System notification dispatched via ServiceWorkerRegistration.');
          return true;
        }
      } catch (swErr) {
        console.warn('[Notifications] ServiceWorker showNotification error, falling back:', swErr);
      }
    }

    // Secondary: window.Notification (standard desktop browser constructor)
    try {
      const notif = new Notification(title, finalOptions);
      notif.onclick = function () {
        try {
          window.focus();
        } catch (e) {}
        if (finalOptions.data && finalOptions.data.url) {
          window.location.href = finalOptions.data.url;
        }
        notif.close();
      };
      console.log('[Notifications] System notification dispatched via window.Notification.');
      return true;
    } catch (winErr) {
      console.warn('[Notifications] window.Notification error:', winErr);
    }

    return false;
  }

  // Core Enable Notifications Action
  async function enableNotifications() {
    if (isRegistering) return;

    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      updateUIStatus('unsupported', 'This browser does not support web push notifications.');
      return;
    }

    const user = getCurrentUser();

    try {
      isRegistering = true;
      updateUIStatus('loading', 'Requesting notification permission...');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        updateUIStatus('denied', 'Notifications were blocked. Check browser address bar settings.');
        return;
      }

      // Clean up any stale standalone 'sw.js' registrations to prevent collisions
      try {
        const existingRegs = await navigator.serviceWorker.getRegistrations();
        for (const r of existingRegs) {
          if (r.active && r.active.scriptURL && r.active.scriptURL.endsWith('/sw.js')) {
            console.log('[Notifications] Replacing legacy sw.js with unified firebase-messaging-sw.js');
            await r.unregister();
          }
        }
      } catch (e) {}

      // Register the unified Service Worker
      const swUrl = './firebase-messaging-sw.js';
      const worker = await navigator.serviceWorker.register(swUrl, { scope: './' });
      await navigator.serviceWorker.ready;

      const messaging = getMessaging();
      if (!messaging) {
        throw new Error('Firebase Messaging could not be initialized.');
      }

      // Request FCM push token
      const tokenOptions = { serviceWorkerRegistration: worker };
      if (VAPID_KEY && VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY') {
        tokenOptions.vapidKey = VAPID_KEY;
      }

      let token = null;
      try {
        token = await messaging.getToken(tokenOptions);
      } catch (tokenErr) {
        console.warn('[Notifications] getToken attempt warning:', tokenErr.message);
      }

      if (token) {
        console.log('[Notifications] FCM Push Token successfully retrieved:', token);
        await saveDeviceToken(user, token);
      }

      updateUIStatus('granted', 'Notifications enabled successfully!');
      if (typeof window.showToast === 'function') {
        window.showToast('Push notifications enabled successfully! ✨');
      }

      // Immediately fire a confirmation desktop notification so user sees it right away
      displaySystemNotification('⚡ NEXVION AI Notifications Active', {
        body: 'Success! You will now receive alerts outside the browser on Windows.',
        tag: 'welcome-notif'
      });
    } catch (error) {
      console.error('[Notifications] Notification setup failed:', error);
      updateUIStatus('error', 'Could not enable notifications. Please try again.');
    } finally {
      isRegistering = false;
    }
  }

  // Setup Foreground Message Listener
  function initForegroundListener() {
    const messaging = getMessaging();
    if (!messaging) return;

    messaging.onMessage((payload) => {
      console.log('[Notifications] Received foreground message:', payload);

      const title = (payload.notification && payload.notification.title) ||
                    (payload.data && payload.data.title) ||
                    'NEXVION AI';

      const body = (payload.notification && payload.notification.body) ||
                   (payload.data && payload.data.body) ||
                   (payload.data && payload.data.message) ||
                   'You have a new update.';

      const url = (payload.data && payload.data.url) ||
                  (payload.data && payload.data.deepLink) ||
                  './dashboard.html';

      // 1. In-page UI updates
      const statusEls = document.querySelectorAll('#notificationStatus, .push-notification-status');
      statusEls.forEach((el) => {
        el.textContent = `${title}: ${body}`;
      });

      if (typeof window.showToast === 'function') {
        window.showToast(`${title}: ${body}`);
      }

      if (typeof window.renderNotifications === 'function') {
        window.renderNotifications();
      }

      // 2. CRITICAL FIX: Display OS Desktop Notification so it pops up outside the browser!
      displaySystemNotification(title, {
        body: body,
        tag: 'fcm-' + Date.now(),
        data: { url: url }
      });
    });
  }

  // Initialize Page Interactivity
  function init() {
    if (!('Notification' in window)) {
      updateUIStatus('unsupported', 'Push notifications not supported on this device.');
      return;
    }

    // Bind click handlers to notification enable buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('#enableNotifications, .btn-enable-push');
      if (target) {
        e.preventDefault();
        enableNotifications();
      }
    });

    // Check current browser permission state
    if (Notification.permission === 'granted') {
      updateUIStatus('granted', 'Notifications are enabled on this device.');
      const user = getCurrentUser();
      if (user) {
        const messaging = getMessaging();
        if (messaging && VAPID_KEY && VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY') {
          navigator.serviceWorker.ready.then((worker) => {
            messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: worker })
              .then((token) => {
                if (token) saveDeviceToken(user, token);
              })
              .catch(() => {});
          });
        }
      }
    } else if (Notification.permission === 'denied') {
      updateUIStatus('denied', 'Notifications blocked in browser site settings.');
    } else {
      updateUIStatus('default', 'Notifications are not enabled yet.');
    }

    initForegroundListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Test Outside App Push Notification
   * Supports immediate trigger or delayed countdown (so user can minimize browser first).
   */
  async function sendTestAlert(delaySeconds = 0) {
    if (!('Notification' in window)) {
      alert('Your browser does not support desktop notifications.');
      return;
    }

    if (Notification.permission === 'denied') {
      alert(
        '⚠️ Notifications are BLOCKED in your browser site settings.\n\n' +
        'To fix:\n' +
        '1. Click the tune/padlock icon on the left side of the address bar (next to http://...)\n' +
        '2. Change "Notifications" from "Block" to "Allow"\n' +
        '3. Refresh the page.'
      );
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Please allow notification permission to test desktop popups.');
        return;
      }
    }

    if (delaySeconds > 0) {
      if (typeof window.showToast === 'function') {
        window.showToast(`⏱️ Alert in ${delaySeconds}s! Minimize your browser NOW to see it outside!`, 'info');
      }

      setTimeout(async () => {
        const ok = await displaySystemNotification('⚡ NEXVION AI Push Alert', {
          body: 'Success! You are outside the browser and desktop notifications are working!',
          tag: 'test-delayed-' + Date.now()
        });
        if (!ok && typeof window.showToast === 'function') {
          window.showToast('Could not display toast. Check Windows "Do not disturb" in bottom-right taskbar.', 'warning');
        }
      }, delaySeconds * 1000);
      return;
    }

    // Immediate test
    const ok = await displaySystemNotification('⚡ NEXVION AI Push Test', {
      body: 'Success! Push notifications are working outside the browser on Windows!',
      tag: 'test-immediate-' + Date.now()
    });

    if (ok) {
      if (typeof window.showToast === 'function') {
        window.showToast('🔔 Notification sent! Check the bottom-right corner of Windows.');
      }
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('Could not display. Check Windows 11 Focus Assist / Do Not Disturb.', 'warning');
      }
    }
  }

  /**
   * Windows 11 Desktop Troubleshooting Modal / Guide
   */
  function showWindowsFixGuide() {
    const modalId = 'windowsNotifGuideModal';
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div style="background:#0F172A;border:1px solid rgba(127,82,255,0.4);border-radius:12px;max-width:540px;width:100%;padding:24px;color:#F8FAFC;font-family:sans-serif;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="margin:0;font-size:1.15rem;font-weight:700;color:#FFFFFF;display:flex;align-items:center;gap:8px;">
              <span>🪟 Windows 11 Notification Fix Guide</span>
            </h3>
            <button onclick="document.getElementById('${modalId}').style.display='none'" style="background:none;border:none;color:#94A3B8;font-size:1.4rem;cursor:pointer;padding:0 6px;">✕</button>
          </div>
          <p style="font-size:0.875rem;color:#CBD5E1;margin-bottom:16px;line-height:1.5;">
            If notifications work inside the app but do <strong>not</strong> pop up on your Windows desktop, Windows 11 is suppressing banner toasts:
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;font-size:0.825rem;color:#E2E8F0;">
            <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #7F52FF;">
              <strong>1. Turn OFF Windows 11 "Do not disturb"</strong><br>
              <span style="color:#94A3B8;">Click the clock/date in the bottom-right taskbar (or press <code>Win + N</code>). If the bell icon has a moon or says "Do not disturb", click to turn it <strong>OFF</strong>.</span>
            </div>
            <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #06B6D4;">
              <strong>2. Enable Browser in Windows Settings</strong><br>
              <span style="color:#94A3B8;">Open Windows <strong>Settings → System → Notifications</strong>. Make sure "Notifications" is <strong>ON</strong>, and verify that <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> is toggled <strong>ON</strong> with "Show banners" checked.</span>
            </div>
            <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #10B981;">
              <strong>3. Allow Notifications in Browser Address Bar</strong><br>
              <span style="color:#94A3B8;">Click the tune/padlock icon on the left of your URL bar (next to http://localhost...), click <strong>Permissions</strong>, and ensure <strong>Notifications</strong> is set to <strong>Allow</strong>.</span>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
            <button onclick="window.NexvionNotifications && window.NexvionNotifications.sendTestAlert(0); document.getElementById('${modalId}').style.display='none';" style="background:#7F52FF;color:#FFF;border:none;padding:8px 16px;border-radius:6px;font-size:0.85rem;font-weight:600;cursor:pointer;">
              🔔 Test Notification Now
            </button>
            <button onclick="document.getElementById('${modalId}').style.display='none'" style="background:rgba(255,255,255,0.1);color:#CBD5E1;border:none;padding:8px 16px;border-radius:6px;font-size:0.85rem;cursor:pointer;">
              Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
  }

  // Global exposure
  window.NexvionNotifications = {
    enable: enableNotifications,
    sendTestAlert: sendTestAlert,
    displaySystemNotification: displaySystemNotification,
    showWindowsFixGuide: showWindowsFixGuide,
    getStatus: () => (typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'),
    getMessaging: getMessaging,
    getCurrentUser: getCurrentUser
  };
})();
