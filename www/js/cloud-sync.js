/**
 * NEXVION AI / Synthetic Systems Academy — Cloud Sync Engine
 * Automatically recovers and synchronizes offline/previously saved mobile registrations
 * from localStorage directly to Cloud Firestore.
 */

(function () {
  'use strict';

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
    authDomain: "nexvion-ai.firebaseapp.com",
    projectId: "nexvion-ai",
    storageBucket: "nexvion-ai.firebasestorage.app",
    messagingSenderId: "916097030104",
    appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad",
    measurementId: "G-Q09E6TX5XJ"
  };

  let dbInstance = null;
  let isSyncing = false;

  function initFirebase() {
    if (typeof firebase === 'undefined') return null;
    try {
      let app;
      try {
        app = firebase.app();
      } catch (noApp) {
        app = firebase.initializeApp(window.firebaseConfig || FIREBASE_CONFIG);
      }
      if (!dbInstance) {
        dbInstance = app.firestore ? app.firestore() : firebase.firestore();
      }
      return dbInstance;
    } catch (e) {
      console.warn('[CloudSync] Firebase initialization notice:', e.message);
      return null;
    }
  }

  function getLocalUser() {
    try {
      const raw = localStorage.getItem('nexvion_current_user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.email || parsed.fullName || parsed.name)) {
        return parsed;
      }
    } catch (e) {}
    return null;
  }

  function getLocalUsersList() {
    try {
      const raw = localStorage.getItem('nexvion_registered_users');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  }

  function normalizeStudentProfile(raw) {
    const studentId = raw.studentId || raw.id || `NX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullName = raw.fullName || raw.name || 'Academy Student';
    const email = (raw.email || '').trim().toLowerCase();
    const courseId = raw.enrolledCourseId || raw.courseId || 'ai-foundations';
    const courseTitle = raw.enrolledCourse || raw.enrolledCourseTitle || raw.courseTitle || 'AI Foundations: Zero to AI Native';

    return {
      id: studentId,
      studentId: studentId,
      userId: raw.userId || `nx_usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: fullName,
      fullName: fullName,
      email: email,
      phone: raw.phone || '',
      dateOfBirth: raw.dateOfBirth || '',
      country: raw.country || 'Global',
      state: raw.state || '',
      city: raw.city || '',
      educationLevel: raw.educationLevel || '',
      institution: raw.institution || '',
      course: raw.course || '',
      yearOfStudy: raw.yearOfStudy || '',
      background: raw.background || '',
      aiExperience: raw.aiExperience || 'Complete Beginner',
      interests: Array.isArray(raw.interests) ? raw.interests : ['AI Fundamentals', 'Generative AI'],
      learningGoal: raw.learningGoal || '',
      referralSource: raw.referralSource || '',
      projectGoal: raw.projectGoal || '',
      enrolledCourseId: courseId,
      enrolledCourseTitle: courseTitle,
      tierId: raw.tierId || courseId,
      tierName: raw.tierName || courseTitle,
      batchId: raw.batchId || raw.batch || '',
      batchName: raw.batchName || raw.batch || 'Unassigned',
      enrollmentStatus: raw.enrollmentStatus || 'Pending',
      progressPercent: raw.progressPercent || 0,
      paymentStatus: raw.paymentStatus || 'Not required',
      certificateStatus: raw.certificateStatus || 'Not eligible',
      role: 'student',
      createdAt: raw.createdAt || new Date().toISOString(),
      joinDate: raw.joinDate || new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      internalNotesList: raw.internalNotesList || [],
      syncedToFirebase: true,
      syncedAt: new Date().toISOString()
    };
  }

  function normalizeEnrollmentRecord(student) {
    const enrId = `enr-${student.studentId.replace(/^NX-/, '').replace(/[^a-zA-Z0-9]/g, '')}`;
    return {
      id: enrId,
      studentId: student.studentId,
      studentName: student.fullName,
      email: student.email,
      courseId: student.enrolledCourseId || 'ai-foundations',
      courseTitle: student.enrolledCourseTitle || 'AI Foundations: Zero to AI Native',
      tierId: student.tierId || 'ai-foundations',
      tierName: student.tierName || 'AI Foundations',
      batchId: student.batchId || '',
      batchName: student.batchName || 'Unassigned',
      status: student.enrollmentStatus || 'Pending',
      paymentStatus: student.paymentStatus || 'Not required',
      submittedAt: student.createdAt || new Date().toISOString(),
      history: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          actionBy: 'Cloud Auto-Sync',
          note: 'Mobile registration synchronized into Cloud Firestore.'
        }
      ]
    };
  }

  async function syncStudentToFirebase(student) {
    const db = initFirebase();
    if (!db) {
      throw new Error('Firebase Firestore not ready');
    }

    const cleanStudent = normalizeStudentProfile(student);
    const cleanEnr = normalizeEnrollmentRecord(cleanStudent);

    // 1. Write Student Document
    await db.collection('students').doc(cleanStudent.studentId).set(cleanStudent, { merge: true });

    // 2. Write Enrollment Document
    await db.collection('enrollments').doc(cleanEnr.id).set(cleanEnr, { merge: true });

    return { student: cleanStudent, enrollment: cleanEnr };
  }

  async function checkCloudUpdatesForStudent(localUser) {
    const db = initFirebase();
    if (!db || !localUser) return;
    try {
      const studentId = localUser.studentId || localUser.id;
      let cloudDoc = null;
      if (studentId) {
        const snap = await db.collection('students').doc(studentId).get();
        if (snap.exists) cloudDoc = snap.data();
      }
      if (!cloudDoc && localUser.email) {
        const qSnap = await db.collection('students').where('email', '==', localUser.email.toLowerCase()).limit(1).get();
        if (!qSnap.empty) cloudDoc = qSnap.docs[0].data();
      }
      if (cloudDoc) {
        let changed = false;
        if (cloudDoc.batchName && cloudDoc.batchName !== 'Unassigned' && cloudDoc.batchName !== localUser.batch) {
          localUser.batch = cloudDoc.batchName;
          localUser.batchName = cloudDoc.batchName;
          localUser.batchId = cloudDoc.batchId;
          changed = true;
        }
        if (cloudDoc.enrollmentStatus && cloudDoc.enrollmentStatus !== localUser.enrollmentStatus) {
          localUser.enrollmentStatus = cloudDoc.enrollmentStatus;
          changed = true;
        }
        if (changed) {
          localStorage.setItem('nexvion_current_user', JSON.stringify(localUser));
          console.log('[CloudSync] Synced updated cohort assignment from cloud:', cloudDoc.batchName);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('nexvion:student-updated', { detail: localUser }));
          }
        }
      }
    } catch (e) {
      console.warn('[CloudSync] Check cloud updates notice:', e.message);
    }
  }

  async function performAutoSync(force) {
    if (isSyncing) return;
    const currentUser = getLocalUser();
    if (!currentUser) return;

    // Check if cloud has updated cohort or batch assignment
    if (currentUser.syncedToFirebase && !force) {
      renderSyncBadge('synced', currentUser);
      checkCloudUpdatesForStudent(currentUser);
      return;
    }

    // Check online status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      renderSyncBadge('offline', currentUser);
      return;
    }

    isSyncing = true;
    renderSyncBadge('syncing', currentUser);

    try {
      const result = await syncStudentToFirebase(currentUser);

      // Save back updated student with syncedToFirebase = true
      localStorage.setItem('nexvion_current_user', JSON.stringify(result.student));

      // Update in registered users list
      const list = getLocalUsersList();
      const existingIdx = list.findIndex(u => u.email === result.student.email || u.studentId === result.student.studentId);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], syncedToFirebase: true, studentId: result.student.studentId };
      } else {
        list.push({
          id: result.student.id,
          studentId: result.student.studentId,
          userId: result.student.userId,
          name: result.student.fullName,
          fullName: result.student.fullName,
          email: result.student.email,
          createdAt: result.student.createdAt,
          syncedToFirebase: true
        });
      }
      localStorage.setItem('nexvion_registered_users', JSON.stringify(list));

      // Also ensure Admin Portal local store has it if admin visits on this device
      try {
        const adminStorageKey = 'nexvion_admin_production_data_v10_pristine_clean';
        const adminDataStr = localStorage.getItem(adminStorageKey);
        const adminData = adminDataStr ? JSON.parse(adminDataStr) : {};
        if (!Array.isArray(adminData.students)) adminData.students = [];
        if (!Array.isArray(adminData.enrollments)) adminData.enrollments = [];

        if (!adminData.students.some(s => s.email === result.student.email || s.id === result.student.studentId)) {
          adminData.students.unshift(result.student);
        }
        if (!adminData.enrollments.some(e => e.email === result.enrollment.email || e.id === result.enrollment.id)) {
          adminData.enrollments.unshift(result.enrollment);
        }
        localStorage.setItem(adminStorageKey, JSON.stringify(adminData));
      } catch (admErr) {}

      console.log('[CloudSync] Successfully synchronized student profile to Firebase Firestore:', result.student.email);
      renderSyncBadge('synced', result.student);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nexvion:cloud-synced', { detail: result }));
      }
    } catch (err) {
      console.warn('[CloudSync] Sync attempt paused (will retry):', err.message);
      renderSyncBadge('retry', currentUser);
    } finally {
      isSyncing = false;
    }
  }

  function renderSyncBadge(state, user) {
    let container = document.getElementById('nexvion-cloud-sync-status');
    if (!container) {
      // Look for suitable anchor in Topbar or Success View
      const targetAnchor = document.querySelector('.topbar-user') || 
                           document.querySelector('.student-card-badge') ||
                           document.querySelector('.brand-tag') ||
                           document.querySelector('.register-nav-actions');

      if (!targetAnchor) return;

      container = document.createElement('div');
      container.id = 'nexvion-cloud-sync-status';
      container.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.6875rem;
        padding: 3px 8px;
        border-radius: 999px;
        letter-spacing: 0.04em;
        transition: all 0.3s ease;
        margin-left: 8px;
        cursor: pointer;
      `;
      targetAnchor.parentNode.insertBefore(container, targetAnchor.nextSibling);

      container.addEventListener('click', () => {
        performAutoSync(true);
      });
    }

    if (state === 'synced') {
      container.style.background = 'rgba(16, 185, 129, 0.12)';
      container.style.color = '#10B981';
      container.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      container.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>CLOUD SYNCED</span>
      `;
      container.title = 'Account secured in Firebase Cloud. Click to re-verify.';
    } else if (state === 'syncing') {
      container.style.background = 'rgba(59, 130, 246, 0.12)';
      container.style.color = '#60A5FA';
      container.style.border = '1px solid rgba(59, 130, 246, 0.3)';
      container.innerHTML = `
        <svg class="cloud-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        <span>SYNCING...</span>
      `;
    } else if (state === 'offline') {
      container.style.background = 'rgba(245, 158, 11, 0.12)';
      container.style.color = '#F59E0B';
      container.style.border = '1px solid rgba(245, 158, 11, 0.3)';
      container.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>OFFLINE SAVED</span>
      `;
      container.title = 'Saved locally on mobile. Will auto-sync to Firebase when online.';
    } else {
      container.style.background = 'rgba(239, 68, 68, 0.12)';
      container.style.color = '#F87171';
      container.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      container.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>SYNC PENDING (TAP)</span>
      `;
      container.title = 'Click to sync with Firebase Cloud';
    }
  }

  // Inject rotation keyframe if needed
  if (!document.getElementById('cloud-sync-keyframes')) {
    const style = document.createElement('style');
    style.id = 'cloud-sync-keyframes';
    style.textContent = `
      @keyframes cloudRotate { to { transform: rotate(360deg); } }
      .cloud-spin { animation: cloudRotate 1s linear infinite; }
    `;
    document.head.appendChild(style);
  }

  // Public API
  window.NexvionCloudSync = {
    syncNow: () => performAutoSync(true),
    getLocalUser: getLocalUser,
    isSynced: () => {
      const u = getLocalUser();
      return !!(u && u.syncedToFirebase);
    }
  };

  // Auto-run on document ready and online reconnection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => performAutoSync(false), 800);
    });
  } else {
    setTimeout(() => performAutoSync(false), 800);
  }

  window.addEventListener('online', () => {
    console.log('[CloudSync] Connection restored — initiating cloud sync');
    performAutoSync(true);
  });
})();
