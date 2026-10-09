/**
 * Comprehensive Validation Test Suite for Phase 11 Backend Integration
 */
const assert = require('assert');

// Mock browser globals for Node test environment
global.window = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  location: { replace() {} },
  NexvionAuth: {
    currentUser: { displayName: 'Lead Test Administrator', email: 'test.admin@nexvion.ai', role: 'Super Admin' },
    getDisplayName() { return 'Lead Test Administrator'; },
    getEmail() { return 'test.admin@nexvion.ai'; }
  }
};
global.self = global.window;

// Load NexvionServices
const NexvionServices = require('../js/admin-services.js');

async function runTests() {
  console.log('--- STARTING PHASE 11 VALIDATION SUITE ---');

  // ==========================================
  // 1. COURSE MANAGEMENT WORKFLOWS
  // ==========================================
  console.log('\n[1] Testing Course Management Workflows...');
  const newCourse = await NexvionServices.saveCourse({
    title: 'Advanced Autonomous Agents',
    courseNumber: '05',
    tierId: 'ai-creator',
    tierName: 'AI Creator',
    shortDescription: 'Deep dive into multi-agent frameworks and autonomous decision loops.'
  });
  assert(newCourse.id, 'Course ID should be generated');
  assert.strictEqual(newCourse.title, 'Advanced Autonomous Agents');
  console.log('✓ Course created:', newCourse.id);

  // Edit course
  const updatedCourse = await NexvionServices.saveCourse({
    id: newCourse.id,
    title: 'Advanced Autonomous Agent Swarms'
  });
  assert.strictEqual(updatedCourse.title, 'Advanced Autonomous Agent Swarms');
  console.log('✓ Course edited');

  // Publish / Unpublish / Archive
  const published = await NexvionServices.publishCourse(newCourse.id);
  assert.strictEqual(published.status, 'Published');
  assert.strictEqual(published.visibility, 'Public');
  console.log('✓ Course published');

  const unpublished = await NexvionServices.unpublishCourse(newCourse.id);
  assert.strictEqual(unpublished.status, 'Draft');
  assert.strictEqual(unpublished.visibility, 'Internal');
  console.log('✓ Course unpublished to draft');

  const archived = await NexvionServices.archiveCourse(newCourse.id);
  assert.strictEqual(archived.status, 'Archived');
  console.log('✓ Course archived');

  // Assign tier
  const tierAssigned = await NexvionServices.assignCourseTier(newCourse.id, 'ai-architect');
  assert.strictEqual(tierAssigned.tierId, 'ai-architect');
  assert.strictEqual(tierAssigned.tierName, 'AI Architect');
  console.log('✓ Tier assigned to course');

  // Configure certificate requirements
  const certReqs = await NexvionServices.configureCertificateRequirements(newCourse.id, {
    minAttendance: 85,
    minAssignmentScore: 75,
    capstoneApproved: true
  });
  assert.strictEqual(certReqs.certificateRequirements.minAttendance, 85);
  console.log('✓ Certificate requirements configured');

  // Course modules & classes
  const courseMods = await NexvionServices.getCourseModules('ai-foundations');
  assert(Array.isArray(courseMods), 'Course modules should be an array');
  const courseClasses = await NexvionServices.getCourseClasses('ai-foundations');
  assert(Array.isArray(courseClasses), 'Course classes should be an array');
  console.log(`✓ Retrieved ${courseMods.length} modules and ${courseClasses.length} classes for foundations course`);

  // ==========================================
  // 2. BATCH MANAGEMENT & 30-STUDENT HARD CAP
  // ==========================================
  console.log('\n[2] Testing Batch Management & 30-Student Cap...');

  const batch = await NexvionServices.saveBatch({
    name: 'Autonomous Cohort Zeta',
    courseId: newCourse.id,
    courseTitle: newCourse.title,
    instructor: 'Dr. Sarah Connor',
    enrolledCount: 29,
    waitlistCount: 0
  });
  assert(batch.id, 'Batch ID should be generated');
  assert.strictEqual(batch.capacity, 30, 'Batch capacity must strictly be 30');
  assert.strictEqual(batch.enrolledCount, 29);
  console.log('✓ Cohort batch created with 29/30 capacity');

  // Edit batch dates and schedule
  await NexvionServices.setBatchDates(batch.id, '2026-11-01', '2026-12-15');
  await NexvionServices.setBatchSchedule(batch.id, 'Mon & Thu 18:00 - 20:00 UTC');
  const batchAfterDates = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchAfterDates.startDate, '2026-11-01');
  assert.strictEqual(batchAfterDates.schedule, 'Mon & Thu 18:00 - 20:00 UTC');
  console.log('✓ Batch dates and schedule updated');

  // Add 30th student (should succeed, reaching exactly 30)
  const student30 = await NexvionServices.saveStudent({
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    enrolledCourseId: newCourse.id,
    enrolledCourseTitle: newCourse.title
  });
  await NexvionServices.addBatchStudent(batch.id, student30.id);
  const batchFilled = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchFilled.enrolledCount, 30, 'Batch should have exactly 30 enrolled');
  assert.strictEqual(batchFilled.status, 'FULL', 'Batch status should be FULL');
  console.log('✓ 30th student added successfully. Batch is now FULL (30/30).');

  // Add 31st student -> MUST BE REJECTED OR PLACED ON WAITLIST (Capacity limit)
  const student31 = await NexvionServices.saveStudent({
    name: 'Elena Rostova-Guest',
    email: 'elena.guest@example.com',
    enrolledCourseId: newCourse.id,
    enrolledCourseTitle: newCourse.title
  });
  let capExceeded = false;
  try {
    await NexvionServices.addBatchStudent(batch.id, student31.id);
  } catch (err) {
    capExceeded = true;
    console.log('✓ 31st student addition blocked with expected error:', err.message);
  }
  assert(capExceeded, 'Adding 31st student must throw error');

  const batchAfter31st = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchAfter31st.enrolledCount, 30, 'Enrolled count MUST NOT exceed 30');
  assert.strictEqual(batchAfter31st.waitlistCount, 1, 'Waitlist count must increment to 1');
  console.log('✓ Invariant validated: Enrolled count remained 30, student routed to waitlist #1.');

  // Check waitlist
  const waitlist = await NexvionServices.getBatchWaitlist(batch.id);
  assert.strictEqual(waitlist.length, 1);
  assert.strictEqual(waitlist[0].studentId, student31.id);
  assert.strictEqual(waitlist[0].status, 'Waitlisted');
  console.log('✓ Waitlist query verified');

  // Remove a student -> ensures historical enrollment is preserved
  await NexvionServices.removeBatchStudent(batch.id, student30.id, 'Relocation schedule conflict');
  const batchAfterRemoval = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchAfterRemoval.enrolledCount, 29, 'Batch enrolled count decremented to 29');

  // Verify historical enrollment was NOT deleted
  const history = await NexvionServices.getEnrollmentHistory(student30.id);
  assert(history.length > 0, 'Historical enrollment record must be preserved');
  console.log('✓ Historical enrollment preserved upon student removal. History entries:', history.length);

  // Now admit student from waitlist into the newly opened seat
  await NexvionServices.moveWaitlistToBatch(batch.id, student31.id);
  const batchAfterAdmit = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchAfterAdmit.enrolledCount, 30, 'Enrolled count back to 30');
  assert.strictEqual(batchAfterAdmit.waitlistCount, 0, 'Waitlist count decremented to 0');
  console.log('✓ Waitlisted student admitted into freed seat (30/30).');

  // Complete batch
  await NexvionServices.completeBatch(batch.id);
  const batchCompleted = await NexvionServices.getBatchById(batch.id);
  assert.strictEqual(batchCompleted.status, 'COMPLETED');
  console.log('✓ Batch completed successfully');

  // ==========================================
  // 3. ENROLLMENT WORKFLOWS & STATE TRANSITIONS
  // ==========================================
  console.log('\n[3] Testing Enrollment Management Workflows...');

  const studentNew = await NexvionServices.saveStudent({
    name: 'Nadia Thorne',
    email: 'nadia.t@example.com',
    enrolledCourseId: 'ai-foundations',
    enrolledCourseTitle: 'AI Foundations: Zero to AI Native'
  });

  const enrollment = await NexvionServices.saveEnrollment({
    studentId: studentNew.id,
    studentName: studentNew.name,
    studentEmail: studentNew.email,
    courseId: 'ai-foundations',
    courseTitle: 'AI Foundations: Zero to AI Native',
    batchId: 'foundations-batch-01',
    batchName: 'Foundations Cohort Alpha'
  });
  assert.strictEqual(enrollment.status, 'Pending');
  console.log('✓ Enrollment submitted in Pending state');

  // Approve enrollment
  const approved = await NexvionServices.approveEnrollment(enrollment.id);
  assert.strictEqual(approved.status, 'Approved');
  assert(approved.decidedBy, 'DecidedBy metadata must be recorded');
  assert(approved.decidedAt, 'DecidedAt metadata must be recorded');
  console.log('✓ Enrollment approved with audit metadata');

  // Change course
  const courseChanged = await NexvionServices.changeEnrollmentCourse(enrollment.id, 'ai-builder');
  assert.strictEqual(courseChanged.courseId, 'ai-builder');
  assert.strictEqual(courseChanged.status, 'Pending');
  console.log('✓ Enrollment course changed; reset to Pending for new cohort assignment');

  // Move to waitlist
  const waitlisted = await NexvionServices.moveEnrollmentToWaitlist(enrollment.id);
  assert.strictEqual(waitlisted.status, 'Waitlisted');
  console.log('✓ Enrollment moved to Waitlist');

  // Reject enrollment
  const rejected = await NexvionServices.rejectEnrollment(enrollment.id, 'Prerequisite verification pending');
  assert.strictEqual(rejected.status, 'Rejected');
  assert.strictEqual(rejected.rejectionReason, 'Prerequisite verification pending');
  console.log('✓ Enrollment rejected with recorded reason');

  // Complete enrollment
  const completedEnr = await NexvionServices.completeEnrollment(enrollment.id);
  assert.strictEqual(completedEnr.status, 'Completed');
  console.log('✓ Enrollment completed');

  // ==========================================
  // 4. STUDENT RECORD DETAILS
  // ==========================================
  console.log('\n[4] Testing Student Detail Records...');
  const allStudents = await NexvionServices.getStudents();
  assert(allStudents.length > 0, 'Students should exist in directory');
  const stuId = allStudents[0].id;
  const stu = await NexvionServices.getStudentById(stuId);
  assert(stu, 'Student record should exist');
  const stuClasses = await NexvionServices.getStudentClasses(stuId);
  const stuProjects = await NexvionServices.getStudentProjects(stuId);
  const stuAssignments = await NexvionServices.getStudentAssignments(stuId);
  const stuPayments = await NexvionServices.getStudentPayments(stuId);
  const stuCerts = await NexvionServices.getStudentCertificates(stuId);
  const stuTickets = await NexvionServices.getStudentSupportTickets(stuId);
  const stuTimeline = await NexvionServices.getStudentActivityTimeline(stuId);

  assert(Array.isArray(stuClasses), 'Classes should be array');
  assert(Array.isArray(stuProjects), 'Projects should be array');
  assert(Array.isArray(stuAssignments), 'Assignments should be array');
  assert(Array.isArray(stuPayments), 'Payments placeholder should be array');
  assert(Array.isArray(stuCerts), 'Certificates placeholder should be array');
  assert(Array.isArray(stuTickets), 'Support history should be array');
  assert(Array.isArray(stuTimeline), 'Activity timeline should be array');
  console.log(`✓ Student details verified: ${stuClasses.length} classes, ${stuProjects.length} projects, ${stuAssignments.length} assignments, ${stuTimeline.length} timeline events`);

  // ==========================================
  // 5. CONTENT MANAGEMENT CRUD
  // ==========================================
  console.log('\n[5] Testing Content Management CRUD...');
  const newMod = await NexvionServices.saveModule({
    courseId: 'ai-foundations',
    courseTitle: 'AI Foundations',
    title: 'Transformer Architecture Foundations',
    classesCount: 3
  });
  assert(newMod.id);
  console.log('✓ Module created:', newMod.id);

  const newCls = await NexvionServices.saveClass({
    courseId: 'ai-foundations',
    moduleId: newMod.id,
    title: 'Self-Attention and Positional Encodings',
    duration: '90 mins'
  });
  assert(newCls.id);
  console.log('✓ Class created:', newCls.id);

  const newLsn = await NexvionServices.saveLesson({
    classId: newCls.id,
    title: 'Visualizing Scaled Dot-Product Attention',
    duration: '25 mins'
  });
  assert(newLsn.id);
  console.log('✓ Lesson created:', newLsn.id);

  const newVid = await NexvionServices.saveVideo({
    title: 'Attention Visualizer Demo Walkthrough',
    duration: '14:20',
    videoUrl: 'https://cdn.nexvion.ai/videos/attention-viz.mp4'
  });
  assert(newVid.id);
  console.log('✓ Video metadata recorded:', newVid.id);

  const newRes = await NexvionServices.saveResource({
    title: 'Transformer Math Cheatsheet (PDF)',
    type: 'PDF Guide',
    fileSize: '4.2 MB'
  });
  assert(newRes.id);
  console.log('✓ Resource recorded:', newRes.id);

  const newPrj = await NexvionServices.saveProject({
    courseId: 'ai-foundations',
    title: 'Building a Miniature Transformer from Scratch'
  });
  assert(newPrj.id);
  console.log('✓ Project created:', newPrj.id);

  const newAsg = await NexvionServices.saveAssignment({
    courseId: 'ai-foundations',
    title: 'Implement Multi-Head Attention Function'
  });
  assert(newAsg.id);
  console.log('✓ Assignment created:', newAsg.id);

  // ==========================================
  // 6. ROLE PERMISSIONS MATRIX VERIFICATION
  // ==========================================
  console.log('\n[6] Testing Role Permissions Matrix...');
  NexvionServices.setCurrentRole('Owner');
  assert(NexvionServices.hasPermission('manage_courses'), 'Owner has manage_courses');
  assert(NexvionServices.hasPermission('manage_admins'), 'Owner has manage_admins');

  NexvionServices.setCurrentRole('Content Manager');
  assert(NexvionServices.hasPermission('manage_courses'), 'Content Manager has manage_courses');
  assert(!NexvionServices.hasPermission('manage_admins'), 'Content Manager must NOT have manage_admins');
  assert(!NexvionServices.hasPermission('view_payments'), 'Content Manager must NOT have view_payments');

  NexvionServices.setCurrentRole('Student Manager');
  assert(NexvionServices.hasPermission('manage_students'), 'Student Manager has manage_students');
  assert(NexvionServices.hasPermission('manage_batches'), 'Student Manager has manage_batches');
  assert(!NexvionServices.hasPermission('manage_courses'), 'Student Manager must NOT have manage_courses');

  NexvionServices.setCurrentRole('Analyst');
  assert(NexvionServices.hasPermission('view_analytics'), 'Analyst has view_analytics');
  assert(!NexvionServices.hasPermission('manage_students'), 'Analyst must NOT have manage_students');
  console.log('✓ Role permission matrix strictly validated');

  // ==========================================
  // 7. SEED INITIAL DATA & PRICE VERIFICATION
  // ==========================================
  console.log('\n[7] Testing Migration / Seeding & Official Tiers...');
  const tiers = await NexvionServices.getTiers();
  assert.strictEqual(tiers.length, 4, 'Must have exactly 4 official tiers');
  
  const t1 = tiers.find(t => t.id === 'ai-foundations');
  const t2 = tiers.find(t => t.id === 'ai-builder');
  const t3 = tiers.find(t => t.id === 'ai-creator');
  const t4 = tiers.find(t => t.id === 'ai-architect');

  assert.strictEqual(t1.priceDisplay, 'FREE', 'AI Foundations must be FREE');
  assert.strictEqual(t2.priceDisplay, 'PRICE COMING SOON', 'AI Builder must be PRICE COMING SOON');
  assert.strictEqual(t3.priceDisplay, 'PRICE COMING SOON', 'AI Creator must be PRICE COMING SOON');
  assert.strictEqual(t4.priceDisplay, 'PRICE COMING SOON', 'AI Architect must be PRICE COMING SOON');
  console.log('✓ Official tier pricing strictly matches requirement:');
  console.log('   - AI Foundations: FREE');
  console.log('   - AI Builder: PRICE COMING SOON');
  console.log('   - AI Creator: PRICE COMING SOON');
  console.log('   - AI Architect: PRICE COMING SOON');

  // Test seedInitialData
  const seedResult = await NexvionServices.seedInitialData(false);
  assert(seedResult.status, 'Seed result should return status');
  console.log('✓ seedInitialData helper executed with result:', seedResult.status);

  console.log('\n======================================================');
  console.log('🎉 ALL PHASE 11 VALIDATION TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('\n❌ VALIDATION TEST FAILED:', err);
  process.exit(1);
});
