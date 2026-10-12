/**
 * ============================================================================
 * NEXVION AI — Admin Authentication Guard & Session Manager
 * ============================================================================
 * Loaded BEFORE admin-services.js and admin-app.js.
 *
 * Responsibilities:
 *  1. Check for a valid Firebase session OR a demo-mode session token.
 *  2. Redirect unauthenticated visitors to /admin-login.html immediately.
 *  3. Expose window.NexvionAuth so the app can read current user info.
 *  4. Provide a logout() helper that clears auth and redirects to login.
 *  5. Gracefully handle missing Firebase (local/demo mode).
 * ============================================================================
 */
(function () {
  'use strict';

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
    authDomain: "nexvion-ai.firebaseapp.com",
    projectId: "nexvion-ai",
    storageBucket: "nexvion-ai.firebasestorage.app",
    messagingSenderId: "916097030104",
    appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad",
    measurementId: "G-Q09E6TX5XJ"
  };

  var LOGIN_URL = '/admin-login.html';

  // --------------------------------------------------------------------------
  // Public API surface
  // --------------------------------------------------------------------------
  var NexvionAuth = {
    currentUser: null,
    isDemo: false,
    isReady: false,

    logout: function () {
      sessionStorage.removeItem('nexvion_admin_auth');
      if (window._nexvionFirebaseAuth) {
        window._nexvionFirebaseAuth.signOut().catch(function () {});
      }
      window.location.replace(LOGIN_URL);
    },

    // Returns a display name for the topbar
    getDisplayName: function () {
      if (this.currentUser) {
        return this.currentUser.displayName || this.currentUser.email || 'Admin';
      }
      return 'Admin';
    },

    // Returns the current user's email
    getEmail: function () {
      return this.currentUser ? (this.currentUser.email || '') : '';
    }
  };

  window.NexvionAuth = NexvionAuth;

  // --------------------------------------------------------------------------
  // Helper: redirect to login
  // --------------------------------------------------------------------------
  function redirectToLogin() {
    window.location.replace(LOGIN_URL);
  }

  // --------------------------------------------------------------------------
  // Check demo-mode session (no Firebase)
  // --------------------------------------------------------------------------
  function checkDemoSession() {
    try {
      var raw = sessionStorage.getItem('nexvion_admin_auth');
      if (raw) {
        var session = JSON.parse(raw);
        // Session expires after 8 hours
        if (session && session.mode === 'demo' && (Date.now() - session.timestamp) < 8 * 60 * 60 * 1000) {
          NexvionAuth.currentUser = {
            email: session.email || 'demo@nexvion.local',
            displayName: session.displayName || 'Demo Admin',
            uid: 'demo-uid',
            role: session.role || 'Super Admin'
          };
          NexvionAuth.isDemo = true;
          NexvionAuth.isReady = true;
          showAdminPortal();
          return true;
        } else {
          // Expired
          sessionStorage.removeItem('nexvion_admin_auth');
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // Make the portal visible after auth check passes
  // --------------------------------------------------------------------------
  function showAdminPortal() {
    // Remove the auth-loading overlay if present
    var overlay = document.getElementById('authLoadingOverlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '0';
      setTimeout(function () { if (overlay.parentElement) overlay.parentElement.removeChild(overlay); }, 300);
    }
    // Update topbar user info if the DOM is ready
    updateTopbarUser();
  }

  // --------------------------------------------------------------------------
  // Update topbar with user name/email (called after DOM ready)
  // --------------------------------------------------------------------------
  function updateTopbarUser() {
    function doUpdate() {
      var nameEl    = document.getElementById('admCurrentUserName');
      var emailEl   = document.getElementById('admCurrentUserEmail');
      var demoBadge = document.getElementById('admDemoBadge');
      var avatarEl  = document.getElementById('admUserAvatar');

      var displayName = NexvionAuth.getDisplayName();
      var email       = NexvionAuth.getEmail();

      if (nameEl)  nameEl.textContent  = displayName;
      if (emailEl) emailEl.textContent = email || (NexvionAuth.isDemo ? 'Demo Mode' : '');
      if (demoBadge) demoBadge.style.display = NexvionAuth.isDemo ? 'inline-flex' : 'none';

      // Set avatar initials from name
      if (avatarEl) {
        var parts = displayName.replace('@', ' ').split(/[\s.]+/).filter(Boolean);
        var initials = parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : displayName.slice(0, 2).toUpperCase();
        avatarEl.textContent = initials;
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doUpdate);
    } else {
      doUpdate();
    }
  }

  // --------------------------------------------------------------------------
  // Firebase-backed auth check
  // --------------------------------------------------------------------------
  function initFirebaseAuth() {
    try {
      if (typeof firebase === 'undefined' || !firebase.initializeApp) {
        throw new Error('Firebase SDK not loaded');
      }

      // Avoid double initialization
      var app;
      try {
        app = firebase.app();
      } catch (e) {
        app = firebase.initializeApp(FIREBASE_CONFIG);
      }

      var auth = app.auth ? app.auth() : firebase.auth();
      window._nexvionFirebaseAuth = auth;

      // onAuthStateChanged is the single source of truth
      auth.onAuthStateChanged(function (user) {
        if (user) {
          NexvionAuth.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email,
            emailVerified: user.emailVerified
          };
          NexvionAuth.isDemo  = false;
          NexvionAuth.isReady = true;
          showAdminPortal();
        } else {
          // No Firebase user — check demo session
          if (!checkDemoSession()) {
            redirectToLogin();
          }
        }
      });

    } catch (e) {
      console.warn('[NexvionAuth] Firebase unavailable:', e.message);
      // Fall back to demo session check
      if (!checkDemoSession()) {
        redirectToLogin();
      }
    }
  }

  // --------------------------------------------------------------------------
  // Boot sequence
  // --------------------------------------------------------------------------
  // First, check if there is a valid demo session (instant, no network)
  // If yes, allow portal immediately. If no, init Firebase auth.
  if (checkDemoSession()) {
    // Already authenticated in demo mode
  } else {
    // Try Firebase
    initFirebaseAuth();
  }

})();
