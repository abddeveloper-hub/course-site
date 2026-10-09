/**
 * NEXVION AI — Phase 14 Automated Verification Test Suite
 * Tests Real Notification Delivery Infrastructure:
 * Device Registration (Android/Web/Desktop), Granular Preferences, Lifecycle Triggers,
 * Scheduling, Idempotency, Inbox Management, Delivery History, and RBAC Security.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING PHASE 14 VERIFICATION SUITE: REAL NOTIFICATION DELIVERY');
  console.log('================================================================\n');

  // Setup mock sandbox environment
  const mockLocalStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  };

  const sandbox = {
    window: {},
    console: console,
    localStorage: mockLocalStorage,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Date: Date,
    Math: Math,
    JSON: JSON
  };
  sandbox.window = sandbox;
  sandbox.window.localStorage = mockLocalStorage;

  // Load admin-services.js into sandbox
  const code = fs.readFileSync(path.join(__dirname, '../js/admin-services.js'), 'utf8');
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const services = sandbox.window.NexvionServices;
  assert(!!services, 'NexvionServices initialized on window');
  assert(!!services.notificationDeliveryService, 'notificationDeliveryService available on services');

  const notifService = services.notificationDeliveryService;

  // 1. Android token registration
  console.log('\n--- 1. Testing Android Device Token Registration ---');
  const androidReg = await notifService.registerDeviceToken({
    userId: 'student-android-1',
    token: 'fcm-android-token-xyz-101',
    platform: 'android',
    deviceModel: 'Samsung Galaxy Tab S9',
    appVersion: '2.4.0'
  });
  assert(androidReg && androidReg.success === true, 'Android device registered successfully');
  assert(androidReg.device.platform === 'android', 'Platform is recorded as android');
  assert(!!androidReg.device.lastSeenAt, 'lastSeenAt timestamp is recorded');

  // 2. Browser token registration & Multiple devices per user
  console.log('\n--- 2. Testing Browser Token Registration & Multiple Devices ---');
  const browserReg = await notifService.registerDeviceToken({
    userId: 'student-android-1',
    token: 'fcm-browser-token-abc-202',
    platform: 'web',
    deviceModel: 'Chrome 128 / Windows',
    appVersion: 'web-1.0'
  });
  assert(browserReg && browserReg.success === true, 'Browser device registered successfully');

  const userDevices = await notifService.getUserDevices('student-android-1');
  assert(userDevices.length >= 2, 'User has multiple devices registered (Android + Web)');
  assert(userDevices.some(d => d.platform === 'android') && userDevices.some(d => d.platform === 'web'), 'Both Android and Web tokens exist for the same student');

  // 3. Token refresh
  console.log('\n--- 3. Testing Token Refresh ---');
  const refreshed = await notifService.registerDeviceToken({
    userId: 'student-android-1',
    token: 'fcm-browser-token-abc-202', // same token re-registered
    platform: 'web',
    deviceModel: 'Chrome 129 Updated'
  });
  assert(refreshed && refreshed.success === true, 'Token refresh handled cleanly without duplicate entries');
  const updatedDevices = await notifService.getUserDevices('student-android-1');
  assert(updatedDevices.filter(d => d.token === 'fcm-browser-token-abc-202').length === 1, 'Token refresh does not create duplicate token records');

  // 4. Token removal / cleanup
  console.log('\n--- 4. Testing Device Removal ---');
  const unreg = await notifService.unregisterDeviceToken('fcm-browser-token-abc-202');
  assert(unreg && unreg.success === true, 'Unregistered browser token successfully');
  const devicesAfterUnreg = await notifService.getUserDevices('student-android-1');
  assert(!devicesAfterUnreg.some(d => d.token === 'fcm-browser-token-abc-202'), 'Unregistered token no longer active for user');

  // 5. Disabled notification preferences
  console.log('\n--- 5. Testing Granular Notification Preferences ---');
  await notifService.updateUserPreferences('student-pref-test', {
    announcements: false,
    newClasses: true,
    pushEnabled: true
  });
  const prefs = await notifService.getUserPreferences('student-pref-test');
  assert(prefs.announcements === false, 'Announcements preference successfully set to false');
  assert(prefs.newClasses === true, 'New classes preference remains true');

  // Register device for student-pref-test
  await notifService.registerDeviceToken({
    userId: 'student-pref-test',
    token: 'token-pref-student-999',
    platform: 'android'
  });

  // Sending an announcement to this student
  const annDispatch = await notifService.sendNotification({
    title: 'Important Announcement',
    message: 'Testing opt-out preferences',
    type: 'Announcement',
    userId: 'student-pref-test',
    sentBy: 'Super Admin'
  });
  assert(annDispatch.status === 'Sent', 'Dispatch completed with opt-out preference evaluation');

  // 6. New announcement trigger
  console.log('\n--- 6. Testing New Announcement Trigger ---');
  const pubResult = await services.publishAnnouncement({
    title: 'Phase 14 Notification System Online',
    content: 'Full push and inbox notifications are now live across all platforms.',
    targetAudience: 'All Enrolled Students'
  });
  assert(!!pubResult, 'Announcement published successfully');
  const history = await notifService.getDeliveryHistory();
  const annNotif = history.find(n => n.title.includes('Phase 14 Notification System Online'));
  assert(!!annNotif, 'Announcement publish triggered automated notification record');
  assert(annNotif.type === 'Announcement', 'Notification record marked with Announcement type');

  // 7. New class trigger
  console.log('\n--- 7. Testing New Class Notification Trigger ---');
  const newClass = await services.saveClass({
    id: `cls-test-${Date.now()}`,
    title: 'Advanced Neural Architectures',
    courseId: 'c1',
    status: 'Published'
  });
  assert(!!newClass, 'Class created successfully');
  const history2 = await notifService.getDeliveryHistory();
  const classNotif = history2.find(n => n.title.includes('Advanced Neural Architectures'));
  assert(!!classNotif, 'Creating a class triggered New Class notification');
  assert(classNotif.type === 'New class', 'Notification has New class type');

  // 8. Class reminder trigger
  console.log('\n--- 8. Testing Class Reminder Trigger ---');
  const reminderNotif = await notifService.triggerClassNotification(newClass, 'reminder', 'in 15 minutes');
  assert(!!reminderNotif, 'Reminder notification triggered');
  assert(reminderNotif.record.type === 'Class reminder', 'Reminder type is Class reminder');
  assert(reminderNotif.record.message.includes('in 15 minutes'), 'Reminder message includes scheduled time');

  // 9. Enrollment update triggers (create, approve, reject, complete)
  console.log('\n--- 9. Testing Enrollment Lifecycle Triggers ---');
  const newEnrollment = await services.enrollmentRepository.create({
    studentId: 'std-test-notif',
    studentName: 'Zara Chen',
    courseId: 'c1',
    courseTitle: 'Deep Learning Specialization'
  });
  assert(!!newEnrollment, 'Enrollment created');

  const history3 = await notifService.getDeliveryHistory();
  assert(history3.some(n => n.title.includes('Enrollment Application Received')), 'Enrollment submission triggered notification');

  await services.enrollmentRepository.approve(newEnrollment.id);
  const history4 = await notifService.getDeliveryHistory();
  assert(history4.some(n => n.title.includes('Enrollment Approved')), 'Enrollment approval triggered notification');

  await services.enrollmentRepository.complete(newEnrollment.id);
  const history5 = await notifService.getDeliveryHistory();
  assert(history5.some(n => n.title.includes('Course Completed')), 'Enrollment completion triggered notification');

  // 10. Waitlist update triggers (moveToWaitlist, admitFromWaitlist)
  console.log('\n--- 10. Testing Waitlist Notification Triggers ---');
  const existingBatches = await services.getBatches();
  const testBatch = (existingBatches && existingBatches.length > 0)
    ? existingBatches[0]
    : await services.batchRepository.create({ name: 'Alpha Cohort', enrolledCount: 5, capacity: 30 });

  const waitlistEnr = await services.enrollmentRepository.create({
    studentId: 'std-wait-01',
    studentName: 'Marcus Aurelius',
    courseId: 'c1',
    courseTitle: 'Deep Learning Specialization',
    batchId: testBatch.id,
    batchName: testBatch.name
  });
  await services.moveEnrollmentToWaitlist(waitlistEnr.id);
  const history6 = await notifService.getDeliveryHistory();
  assert(history6.some(n => n.title.includes('Waitlist Placement')), 'Waitlist placement triggered notification');

  await services.admitFromWaitlist(waitlistEnr.id);
  const history7 = await notifService.getDeliveryHistory();
  assert(history7.some(n => n.title.includes('Seat Offered from Waitlist')), 'Admitting from waitlist triggered notification');

  // 11. Invalid token cleanup
  console.log('\n--- 11. Testing Invalid Token Cleanup ---');
  await notifService.registerDeviceToken({
    userId: 'student-cleanup-test',
    token: 'bad-expired-token-001',
    platform: 'android'
  });
  const cleanupRes = await notifService.cleanupInvalidTokens(['bad-expired-token-001']);
  assert(cleanupRes && cleanupRes.success === true, 'cleanupInvalidTokens executed successfully');
  const activeAfterCleanup = await notifService.getUserDevices('student-cleanup-test');
  assert(!activeAfterCleanup.some(d => d.token === 'bad-expired-token-001'), 'Invalid token removed during cleanup');

  // 12. Duplicate notification prevention (Idempotency)
  console.log('\n--- 12. Testing Duplicate Notification Prevention (Idempotency) ---');
  const idempotencyKey = `idem-test-key-${Date.now()}`;
  const firstSend = await notifService.sendNotification({
    title: 'Unique Security Alert',
    message: 'System maintenance scheduled.',
    idempotencyKey,
    sentBy: 'Security Officer'
  });
  assert(firstSend && firstSend.status === 'Sent', 'First send dispatches successfully');

  const duplicateSend = await notifService.sendNotification({
    title: 'Unique Security Alert',
    message: 'System maintenance scheduled.',
    idempotencyKey,
    sentBy: 'Security Officer'
  });
  assert(duplicateSend.duplicate === true, 'Second send with same idempotencyKey flagged as duplicate');
  assert(duplicateSend.idempotent === true, 'Idempotent response returned without duplicate dispatch');

  // 13. Scheduled notification & Cancellation
  console.log('\n--- 13. Testing Scheduled Notification & Cancellation ---');
  const futureDate = new Date(Date.now() + 86400000).toISOString();
  const schedNotif = await notifService.scheduleNotification({
    title: 'Upcoming Hackathon',
    message: 'Starts tomorrow at 10 AM UTC.',
    scheduledFor: futureDate,
    audience: 'All Enrolled Students',
    sentBy: 'Community Manager'
  });
  assert(schedNotif && schedNotif.status === 'Scheduled', 'Notification scheduled with Scheduled status');
  assert(!!schedNotif.scheduledFor, 'scheduledFor timestamp stored correctly');

  const cancelResult = await notifService.cancelScheduledNotification(schedNotif.id);
  assert(cancelResult && cancelResult.success === true, 'Scheduled notification cancelled successfully');
  const historyAfterCancel = await notifService.getDeliveryHistory();
  const cancelledRecord = historyAfterCancel.find(n => n.id === schedNotif.id);
  assert(cancelledRecord && cancelledRecord.status === 'Cancelled', 'Status updated to Cancelled');

  // 14. Failed delivery metrics recording
  console.log('\n--- 14. Testing Failed Delivery Metrics Recording ---');
  const failTest = await notifService.sendNotification({
    title: 'Simulated Delivery Failure',
    message: 'Testing error resilience',
    simulateFailure: true,
    sentBy: 'QA Tester'
  });
  assert(failTest.status === 'Failed' || failTest.status === 'Partially delivered', 'Recorded non-success delivery status');
  assert(failTest.failureCount > 0, 'Failure count is tracked');
  assert(!!failTest.errorSummary, 'Error summary is captured');

  // 15. Student Inbox operations (getInbox, markRead, markAllRead, deepLink)
  console.log('\n--- 15. Testing Student Inbox Operations ---');
  const targetUser = 'student-inbox-user-1';
  await notifService.sendNotification({
    title: 'Certificate Ready: AI Specialist',
    message: 'Your certificate is ready for download.',
    type: 'Certificate update',
    userId: targetUser,
    deepLink: 'certificates.html?id=cert-123',
    sentBy: 'Certification Office'
  });

  const inbox = await notifService.getInbox(targetUser);
  assert(inbox.length >= 1, 'Notification delivered to student inbox');
  const certMsg = inbox.find(m => m.type === 'Certificate update');
  assert(certMsg && certMsg.read === false, 'New inbox message arrives unread');
  assert(certMsg.deepLink === 'certificates.html?id=cert-123', 'Deep link preserved in inbox message');

  const markRes = await notifService.markInboxAsRead(targetUser, certMsg.id);
  assert(markRes && markRes.success === true, 'markInboxAsRead executed successfully');
  const inboxAfterMark = await notifService.getInbox(targetUser);
  const updatedCert = inboxAfterMark.find(m => m.id === certMsg.id);
  assert(updatedCert && updatedCert.read === true, 'Inbox message marked as read');

  await notifService.sendNotification({
    title: 'System Notice 1',
    message: 'Notice body 1',
    userId: targetUser
  });
  await notifService.sendNotification({
    title: 'System Notice 2',
    message: 'Notice body 2',
    userId: targetUser
  });
  const markAllRes = await notifService.markAllInboxAsRead(targetUser);
  assert(markAllRes && markAllRes.success === true, 'markAllInboxAsRead executed successfully');
  const inboxAfterMarkAll = await notifService.getInbox(targetUser);
  assert(inboxAfterMarkAll.every(m => m.read === true), 'All inbox messages marked as read');

  // 16. Security & Device Token Privacy
  console.log('\n--- 16. Testing Device Token Privacy & Scoping ---');
  await notifService.registerDeviceToken({
    userId: 'student-private-a',
    token: 'token-secret-a',
    platform: 'web'
  });
  await notifService.registerDeviceToken({
    userId: 'student-private-b',
    token: 'token-secret-b',
    platform: 'android'
  });

  const devicesUserA = await notifService.getUserDevices('student-private-a');
  assert(devicesUserA.length === 1 && devicesUserA[0].token === 'token-secret-a', 'User A only retrieves User A tokens');
  assert(!devicesUserA.some(d => d.token === 'token-secret-b'), 'User A cannot access User B device tokens');

  // 17. Live HTTP Server Endpoints Verification
  console.log('\n--- 17. Testing Live Server Notification Endpoints ---');
  const http = require('http');
  const { spawn } = require('child_process');
  const TEST_PORT = 3099;

  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 700));

  function makeRequest(method, pathName, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: pathName,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      const req = http.request(opts, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      });
      req.on('error', reject);
      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      req.end();
    });
  }

  try {
    // 17.1 POST /api/notifications/devices/register
    const regRes = await makeRequest('POST', '/api/notifications/devices/register', {}, {
      userId: 'http-student-1',
      token: 'tok-http-android-555',
      platform: 'android',
      deviceModel: 'Pixel 8 Pro'
    });
    assert(regRes.status === 200, 'POST /api/notifications/devices/register returns 200');
    assert(regRes.body.success === true, 'Device registered via REST API');

    // 17.2 GET /api/notifications/devices
    const getDevs = await makeRequest('GET', '/api/notifications/devices?userId=http-student-1');
    assert(getDevs.status === 200, 'GET /api/notifications/devices returns 200');
    assert(getDevs.body.devices.length >= 1, 'Devices listed for requesting user');

    // 17.3 POST /api/notifications/preferences & GET
    const setPref = await makeRequest('POST', '/api/notifications/preferences', {}, {
      userId: 'http-student-1',
      preferences: { announcements: false, newClasses: true }
    });
    assert(setPref.status === 200, 'POST /api/notifications/preferences returns 200');

    const getPref = await makeRequest('GET', '/api/notifications/preferences?userId=http-student-1');
    assert(getPref.status === 200, 'GET /api/notifications/preferences returns 200');
    assert(getPref.body.preferences.announcements === false, 'Updated preference persisted');

    // 17.4 POST /api/notifications/send (RBAC rejection)
    const unauthSend = await makeRequest('POST', '/api/notifications/send', {
      'x-admin-role': 'Unauthorized Guest'
    }, {
      title: 'Malicious Broadcast',
      message: 'Should be rejected'
    });
    assert(unauthSend.status === 403, 'POST /api/notifications/send unauthorized role returns 403');

    // 17.5 POST /api/notifications/send (Authorized Super Admin)
    const authSend = await makeRequest('POST', '/api/notifications/send', {
      'x-admin-role': 'Super Admin'
    }, {
      title: 'Global Semester Welcome',
      message: 'Welcome all students to the AI engineering semester.',
      audience: 'All Enrolled Students',
      idempotencyKey: 'http-idem-key-100',
      type: 'Announcement'
    });
    assert(authSend.status === 200, 'Authorized notification send returns 200');
    assert(authSend.body.status === 'Sent', 'Status is Sent');

    // 17.6 POST /api/notifications/send (Idempotency duplicate)
    const dupSend = await makeRequest('POST', '/api/notifications/send', {
      'x-admin-role': 'Super Admin'
    }, {
      title: 'Global Semester Welcome',
      message: 'Welcome all students to the AI engineering semester.',
      idempotencyKey: 'http-idem-key-100'
    });
    assert(dupSend.status === 200, 'Idempotent duplicate send returns 200');
    assert(dupSend.body.duplicate === true, 'Flagged as duplicate idempotently');

    // 17.7 GET /api/notifications/inbox
    const inboxRes = await makeRequest('GET', '/api/notifications/inbox?userId=stu-nx-8821');
    assert(inboxRes.status === 200, 'GET /api/notifications/inbox returns 200');
    assert(Array.isArray(inboxRes.body.inbox), 'Inbox is returned as array');

    // 17.8 POST /api/notifications/inbox/mark-read
    const markReadRes = await makeRequest('POST', '/api/notifications/inbox/mark-read', {}, {
      userId: 'stu-nx-8821',
      markAll: true
    });
    assert(markReadRes.status === 200, 'Mark all as read returns 200');

    // 17.9 POST /api/notifications/devices/cleanup-invalid
    const cleanupRes = await makeRequest('POST', '/api/notifications/devices/cleanup-invalid', {
      'x-admin-role': 'Super Admin'
    }, {
      invalidTokens: ['tok-http-android-555']
    });
    assert(cleanupRes.status === 200, 'Invalid token cleanup returns 200');

    // 17.10 GET /api/notifications/history
    const histRes = await makeRequest('GET', '/api/notifications/history', {
      'x-admin-role': 'Super Admin'
    });
    assert(histRes.status === 200, 'GET /api/notifications/history returns 200');
    assert(histRes.body.history.length >= 1, 'Delivery history contains dispatches');

  } finally {
    serverProcess.kill();
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL PHASE 14 VERIFICATION TESTS PASSED (${passedTests}/${totalTests})`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
  process.exit(1);
});
