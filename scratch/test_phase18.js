/**
 * NEXVION AI — Phase 18 Automated Verification Test Suite
 * Tests Real Firebase Data Repositories, Environment Configuration,
 * All 18 Collection Repositories, State Management (Loading, Empty, Error, Retry,
 * Permission-Denied), Pagination, 30-Cap Invariant, Waitlists, Security & REST APIs.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');

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
  console.log('🧪 RUNNING PHASE 18 VERIFICATION SUITE: FIREBASE REPOSITORIES');
  console.log('================================================================\n');

  // --- 1. Environment & Configuration Verification ---
  console.log('--- 1. Testing Firebase Environment & Config ---');
  const envPath = path.join(__dirname, '../.env');
  assert(fs.existsSync(envPath), '.env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  assert(envContent.includes('FIREBASE_API_KEY='), '.env declares FIREBASE_API_KEY');
  assert(envContent.includes('FIREBASE_PROJECT_ID=nexvion-ai'), '.env declares FIREBASE_PROJECT_ID=nexvion-ai');
  assert(envContent.includes('FIREBASE_AUTH_DOMAIN='), '.env declares FIREBASE_AUTH_DOMAIN');
  assert(envContent.includes('FIREBASE_STORAGE_BUCKET='), '.env declares FIREBASE_STORAGE_BUCKET');
  assert(envContent.includes('FIREBASE_APP_ID='), '.env declares FIREBASE_APP_ID');

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

  // Verify Firebase config validator
  const fbConfigValidation = services.validateFirebaseConfig();
  assert(fbConfigValidation.configured === true, 'Firebase configuration successfully validated');
  assert(fbConfigValidation.projectId === 'nexvion-ai', 'Firebase project ID is nexvion-ai');
  assert(fbConfigValidation.missingFields.length === 0, 'No missing Firebase configuration fields');

  // --- 2. Repository State Tracking (Loading, Empty, Error, Retry, Permission-Denied) ---
  console.log('\n--- 2. Testing Repository State Management & Pagination ---');
  const courseState = services.getRepositoryState('courses');
  assert(typeof courseState === 'object', 'Repository state object retrieved for courses');
  assert(courseState.loading === false, 'Initial state is not loading');
  assert(courseState.error === null, 'Initial state has no error');

  // Test state transitions
  services.setRepositoryLoading('courses', true);
  assert(services.getRepositoryState('courses').loading === true, 'Loading state transition recorded');

  services.store.setRepositoryError('courses', 'Permission denied on courses collection', true);
  const errState = services.getRepositoryState('courses');
  assert(errState.loading === false, 'Error clears loading state');
  assert(errState.error.includes('Permission denied'), 'Error message recorded');
  assert(errState.permissionDenied === true, 'permissionDenied flag set correctly');

  // Test retry mechanism
  await services.retryRepository('courses');
  const retriedState = services.getRepositoryState('courses');
  assert(retriedState.permissionDenied === false, 'Retry resets permissionDenied state');
  assert(retriedState.error === null, 'Retry clears error state');

  // Test pagination on queryRepository
  const paginatedCourses = await services.queryRepository('courses', { limit: 2, page: 1 });
  assert(Array.isArray(paginatedCourses), 'queryRepository returns array');
  assert(paginatedCourses.length <= 2, 'Limit enforced on query results');
  assert(typeof paginatedCourses.pagination === 'object', 'Pagination metadata attached');
  assert(paginatedCourses.pagination.limit === 2, 'Pagination limit recorded');
  assert(paginatedCourses.pagination.page === 1, 'Pagination page recorded');

  // --- 3. Testing Courses Repository ---
  console.log('\n--- 3. Testing Courses Repository ---');
  const allCourses = await services.courseRepository.findAll();
  assert(Array.isArray(allCourses) && allCourses.length >= 4, 'courseRepository.findAll returns all 4 tracks');
  const foundCourse = await services.courseRepository.findById('ai-foundations');
  assert(foundCourse && foundCourse.id === 'ai-foundations', 'courseRepository.findById retrieves correct course');
  const newCourse = await services.courseRepository.create({
    title: 'Reinforcement Learning in Production',
    courseNumber: 'AI-501',
    level: 'Advanced'
  });
  assert(newCourse && newCourse.id.startsWith('course-'), 'courseRepository.create assigns valid ID');
  const updatedCourse = await services.courseRepository.update(newCourse.id, { description: 'Updated RL course description' });
  assert(updatedCourse.description === 'Updated RL course description', 'courseRepository.update persists change');

  // --- 4. Testing Tiers Repository ---
  console.log('\n--- 4. Testing Tiers Repository ---');
  const allTiers = await services.tierRepository.findAll();
  assert(Array.isArray(allTiers) && allTiers.length === 4, 'tierRepository.findAll returns 4 official tiers');
  const foundationsTier = await services.tierRepository.findById('ai-foundations');
  assert(foundationsTier && foundationsTier.name.includes('AI Foundations'), 'tierRepository.findById retrieves tier');
  assert(foundationsTier.priceDisplay === 'FREE', 'AI Foundations tier is officially FREE');

  // --- 5. Testing Batches Repository (Strict 30-Cap Invariant & Waitlists) ---
  console.log('\n--- 5. Testing Batches Repository (Strict 30-Cap Invariant & Waitlists) ---');
  const allBatches = await services.batchRepository.findAll();
  assert(Array.isArray(allBatches) && allBatches.length >= 6, 'batchRepository.findAll returns cohorts');
  allBatches.forEach(b => {
    assert(b.capacity === 30, `Batch ${b.name} capacity strictly equals 30`);
    assert(b.enrolledCount <= 30, `Batch ${b.name} enrolledCount does not exceed 30`);
  });

  const newBatch = await services.batchRepository.create({
    name: 'Neural Systems Batch Zeta',
    courseId: 'course-ai-foundations',
    enrolledCount: 50 // Attempting to exceed 30
  });
  assert(newBatch.capacity === 30, 'New batch capacity capped at 30');
  assert(newBatch.enrolledCount === 30, 'Over-capacity enrollment clamped to 30');
  assert(newBatch.status === 'FULL', 'Full batch marked as FULL');

  // --- 6. Testing Students Repository ---
  console.log('\n--- 6. Testing Students Repository ---');
  const students = await services.studentRepository.findAll();
  assert(Array.isArray(students) && students.length >= 10, 'studentRepository.findAll retrieves directory');
  const singleStudent = await services.studentRepository.findById('stu-101');
  assert(singleStudent && singleStudent.id === 'stu-101', 'studentRepository.findById retrieves student');
  const noteResult = await services.studentRepository.addNote('stu-101', 'Reviewed thesis proposal on sparse autoencoders.', 'Dr. Vance', 'High');
  assert(noteResult && noteResult.text.includes('sparse autoencoders'), 'studentRepository.addNote records note');

  // --- 7. Testing Enrollments Repository ---
  console.log('\n--- 7. Testing Enrollments Repository ---');
  const enrollments = await services.enrollmentRepository.findAll();
  assert(Array.isArray(enrollments) && enrollments.length >= 12, 'enrollmentRepository.findAll retrieves enrollments');
  const newEnr = await services.enrollmentRepository.create({
    studentId: 'stu-102',
    studentName: 'Julian Vance',
    courseId: 'course-ai-builder',
    tierId: 'ai-builder',
    batchId: 'batch-builder-prime'
  });
  assert(newEnr && newEnr.id.startsWith('enr-'), 'enrollmentRepository.create generates enrollment ID');
  assert(newEnr.status === 'Pending', 'Initial enrollment status is Pending');

  // --- 8. Testing Content Repository (Classes, Modules, Lessons, Videos, Resources) ---
  console.log('\n--- 8. Testing Content Repository ---');
  const classes = await services.contentRepository.getClasses();
  assert(Array.isArray(classes) && classes.length >= 5, 'contentRepository.getClasses returns classes');
  const modules = await services.contentRepository.getModules();
  assert(Array.isArray(modules) && modules.length >= 4, 'contentRepository.getModules returns modules');
  const lessons = await services.contentRepository.getLessons();
  assert(Array.isArray(lessons) && lessons.length >= 4, 'contentRepository.getLessons returns lessons');
  const videos = await services.contentRepository.getVideos();
  assert(Array.isArray(videos) && videos.length >= 4, 'contentRepository.getVideos returns video assets');
  const resources = await services.contentRepository.getResources();
  assert(Array.isArray(resources) && resources.length >= 4, 'contentRepository.getResources returns resources');

  // --- 9. Testing Project Repository (Projects, Assignments, Submissions) ---
  console.log('\n--- 9. Testing Project Repository ---');
  const projects = await services.projectRepository.getProjects();
  assert(Array.isArray(projects) && projects.length >= 4, 'projectRepository.getProjects returns projects');
  const assignments = await services.projectRepository.getAssignments();
  assert(Array.isArray(assignments) && assignments.length >= 4, 'projectRepository.getAssignments returns assignments');
  const submissions = await services.projectRepository.getSubmissions();
  assert(Array.isArray(submissions) && submissions.length >= 6, 'projectRepository.getSubmissions returns submissions');

  // --- 10. Testing Announcements Repository ---
  console.log('\n--- 10. Testing Announcements Repository ---');
  const announcements = await services.announcementsRepository.findAll();
  assert(Array.isArray(announcements) && announcements.length >= 4, 'announcementsRepository.findAll returns items');
  const newAnnouncement = await services.announcementsRepository.save({
    title: 'Autumn Hackathon 2026',
    category: 'Event',
    priority: 'High',
    status: 'Draft'
  });
  assert(newAnnouncement && newAnnouncement.id.startsWith('anc-'), 'announcementsRepository.save creates announcement');
  const publishedAnc = await services.announcementsRepository.publish(newAnnouncement.id);
  assert(publishedAnc.status === 'Published', 'announcementsRepository.publish updates status to Published');
  const clonedAnc = await services.announcementsRepository.duplicate(publishedAnc.id);
  assert(clonedAnc.title.includes('(Copy)'), 'announcementsRepository.duplicate clones announcement');
  const archivedAnc = await services.announcementsRepository.archive(clonedAnc.id);
  assert(archivedAnc.status === 'Archived', 'announcementsRepository.archive archives announcement');

  // --- 11. Testing Notifications Repository ---
  console.log('\n--- 11. Testing Notifications Repository ---');
  const notifications = await services.notificationRepository.findAll();
  assert(Array.isArray(notifications), 'notificationRepository.findAll returns delivery records');
  const testNotif = await services.notificationRepository.sendTest({
    title: 'Test Broadcast Alert',
    message: 'Testing Firebase notification sync',
    targetAudience: 'All students'
  });
  assert(testNotif && testNotif.success === true, 'notificationRepository.sendTest sends notification');

  // --- 12. Testing Payments Repository & Permission Isolation ---
  console.log('\n--- 12. Testing Payments Repository & Permission Isolation ---');
  // Analyst should be denied payment ledger access
  services.store.setCurrentRole('Analyst');
  let paymentDenied = false;
  try {
    await services.paymentRepository.findAll();
  } catch (e) {
    paymentDenied = true;
  }
  assert(paymentDenied, 'Analyst role blocked from accessing payment repository');

  // Finance Manager should be granted access
  services.store.setCurrentRole('Finance Manager');
  const payments = await services.paymentRepository.findAll();
  assert(Array.isArray(payments) && payments.length >= 10, 'Finance Manager retrieves payment records');
  const singlePayment = await services.paymentRepository.findById('pay-7001');
  assert(singlePayment && singlePayment.id === 'pay-7001', 'paymentRepository.findById retrieves payment');

  // --- 13. Testing Certificates Repository ---
  console.log('\n--- 13. Testing Certificates Repository ---');
  services.store.setCurrentRole('Super Admin');
  const certs = await services.certificateRepository.findAll();
  assert(Array.isArray(certs) && certs.length >= 6, 'certificateRepository.findAll returns certificates');
  const singleCert = await services.certificateRepository.findById('cert-8001');
  assert(singleCert && singleCert.verificationId === 'NEX-FND-2026-0042', 'certificateRepository.findById retrieves certificate');

  // --- 14. Testing Support Tickets Repository ---
  console.log('\n--- 14. Testing Support Tickets Repository ---');
  const adminTickets = await services.supportRepository.findAll({}, null, true);
  assert(Array.isArray(adminTickets) && adminTickets.length >= 3, 'supportRepository.findAll returns tickets for admin');
  assert(Array.isArray(adminTickets[0].internalNotes), 'Internal notes visible to admin');

  // Student isolation & note privacy
  const studentTickets = await services.supportRepository.findAll({}, 'stu-102', false);
  studentTickets.forEach(t => {
    assert(t.studentId === 'stu-102' || t.studentEmail === 'stu-102', 'Student receives only their own tickets');
    assert(t.internalNotes === undefined, 'Internal notes strictly stripped in student view');
  });

  // --- 15. Testing Audit Repository ---
  console.log('\n--- 15. Testing Audit Repository ---');
  const auditLogs = await services.auditRepository.findAll();
  assert(Array.isArray(auditLogs) && auditLogs.length >= 10, 'auditRepository.findAll returns audit logs');
  const newAudit = services.auditRepository.log('SYSTEM_TEST', 'Test', 'Automated Verification');
  assert(newAudit && newAudit.id.startsWith('aud-'), 'auditRepository.log generates valid audit record');

  // --- 16. Testing Settings Repository ---
  console.log('\n--- 16. Testing Settings Repository ---');
  const settings = await services.settingsRepository.get();
  assert(typeof settings === 'object', 'settingsRepository.get returns settings object');
  assert(settings.enrollmentRules !== undefined, 'Settings contains enrollmentRules');

  // Attempting to exceed 30 capacity in settings must throw
  let rejectedBatchRule = false;
  try {
    await services.settingsRepository.save({ batchRules: { maxBatchCapacity: 45 } });
  } catch (e) {
    rejectedBatchRule = true;
  }
  assert(rejectedBatchRule, 'Settings rejected maxBatchCapacity exceeding 30-cap invariant');

  // --- 17. Live HTTP Server Testing ---
  console.log('\n--- 17. Testing Live Server API Endpoints ---');
  const serverModule = require('../server.js');
  await new Promise(r => setTimeout(r, 600));

  function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: 'localhost',
        port: 3000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      const req = http.request(opts, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  // 17.1 Test GET /api/firebase/config
  const fbConfigRes = await makeRequest('GET', '/api/firebase/config');
  assert(fbConfigRes.status === 200, 'GET /api/firebase/config returns 200');
  assert(fbConfigRes.data.configured === true, 'Live server confirms Firebase configured: true');
  assert(fbConfigRes.data.projectId === 'nexvion-ai', 'Live server reports projectId: nexvion-ai');

  // 17.2 Test GET /api/firebase/status
  const fbStatusRes = await makeRequest('GET', '/api/firebase/status');
  assert(fbStatusRes.status === 200, 'GET /api/firebase/status returns 200');
  assert(fbStatusRes.data.status === 'active', 'Live server reports status: active');
  assert(Array.isArray(fbStatusRes.data.collections) && fbStatusRes.data.collections.length === 20, 'All 20 collections registered');

  console.log('\n================================================================');
  console.log(`🎉 ALL PHASE 18 VERIFICATION TESTS PASSED (${passedTests}/${totalTests})`);
  console.log('================================================================\n');

  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ TEST RUNNER ERROR:', err);
  process.exit(1);
});
