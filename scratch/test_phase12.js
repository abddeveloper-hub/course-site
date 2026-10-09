/**
 * NEXVION AI — Phase 12 Automated Verification Test Suite
 * Tests Secure File & Content Storage, Video Management, and Student Submissions
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
  console.log('🧪 RUNNING PHASE 12 VERIFICATION SUITE');
  console.log('================================================================\n');

  // 1. Setup mock browser environment
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
    JSON: JSON,
    Blob: class MockBlob {
      constructor(parts, opts = {}) {
        this.size = parts.reduce((acc, p) => acc + (typeof p === 'string' ? p.length : 0), 0);
        this.type = opts.type || '';
      }
    }
  };
  sandbox.window = sandbox;
  sandbox.window.localStorage = mockLocalStorage;

  // Read admin-services.js into sandbox
  const code = fs.readFileSync(path.join(__dirname, '../js/admin-services.js'), 'utf8');
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const services = sandbox.window.NexvionServices;
  assert(!!services, 'NexvionServices initialized on window');
  assert(!!services.storageRepository, 'storageRepository available on services');

  // -------------------------------------------------------------------------
  // Test 1: File Validation (MIME & Size Limits)
  // -------------------------------------------------------------------------
  console.log('\n--- 1. File Validation Engine ---');
  const validPdf = { name: 'handout.pdf', size: 1024 * 1024, type: 'application/pdf' };
  assert(services.validateStorageFile(validPdf, 'RESOURCES') === true, 'Valid PDF resource accepted');

  let rejectedType = false;
  try {
    services.validateStorageFile({ name: 'malicious.exe', size: 1024, type: 'application/x-msdownload' }, 'RESOURCES');
  } catch (err) {
    rejectedType = true;
  }
  assert(rejectedType, 'Invalid resource file type (.exe) correctly rejected');

  let rejectedSize = false;
  try {
    services.validateStorageFile({ name: 'huge_book.pdf', size: 60 * 1024 * 1024, type: 'application/pdf' }, 'RESOURCES');
  } catch (err) {
    rejectedSize = true;
  }
  assert(rejectedSize, 'Resource exceeding 50 MB limit correctly rejected');

  let rejectedCoverSize = false;
  try {
    services.validateStorageFile({ name: 'huge_cover.jpg', size: 10 * 1024 * 1024, type: 'image/jpeg' }, 'COVERS');
  } catch (err) {
    rejectedCoverSize = true;
  }
  assert(rejectedCoverSize, 'Cover image exceeding 5 MB limit correctly rejected');

  // -------------------------------------------------------------------------
  // Test 2: Resource Upload, Replacement, Deletion, and Enrolled Download
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Resource Management ---');
  let progressCalled = false;
  const uploadResult = await services.uploadResource({
    file: { name: 'machine-learning-notes.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' },
    courseId: 'ai-foundations',
    moduleId: 'mod-101',
    lessonId: 'les-201',
    title: 'Machine Learning Foundations Lecture Guide',
    type: 'PDF Guide',
    onProgress: (prog) => { progressCalled = true; }
  });

  assert(!!uploadResult.resource.id, 'Resource record created with unique ID');
  assert(uploadResult.resource.courseId === 'ai-foundations', 'Resource associated with course');
  assert(progressCalled, 'Upload progress callback successfully triggered');
  assert(uploadResult.metadata.version === 1, 'Initial metadata version is 1');
  assert(uploadResult.metadata.visibility === 'Enrolled', 'Resource visibility is Enrolled');

  // Replace resource
  const replaceResult = await services.replaceResource(uploadResult.resource.id, {
    file: { name: 'machine-learning-notes-v2.pdf', size: 2.5 * 1024 * 1024, type: 'application/pdf' }
  });
  assert(replaceResult.id === uploadResult.resource.id, 'Replaced resource preserves ID');
  const updatedMeta = await services.getFileMetadata(uploadResult.metadata.id);
  assert(updatedMeta.version === 2, 'Resource metadata version incremented to 2 on replacement');

  // Test authorized vs unauthorized download by enrollment
  // stu-106 is enrolled in ai-foundations; stu-101 is enrolled in ai-builder
  const authDownload = await services.downloadResource(uploadResult.resource.id, 'stu-106');
  assert(authDownload.downloadCount === 1, 'Enrolled student download permitted and count incremented');

  let unauthorizedDownload = false;
  try {
    await services.downloadResource(uploadResult.resource.id, 'stu-101'); // stu-101 enrolled in ai-builder
  } catch (err) {
    unauthorizedDownload = true;
  }
  assert(unauthorizedDownload, 'Unenrolled student download blocked with access denied');

  // Soft delete / archive resource
  const delSuccess = await services.deleteResource(uploadResult.resource.id);
  assert(delSuccess === true, 'Resource successfully archived');
  let downloadArchived = false;
  try {
    await services.downloadResource(uploadResult.resource.id, 'stu-106');
  } catch (err) {
    downloadArchived = true;
  }
  assert(downloadArchived, 'Archived resource download blocked to preserve data safety');

  // -------------------------------------------------------------------------
  // Test 3: Video Management & Authorized Streaming
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Video Management ---');
  const video = await services.uploadVideo({
    file: { name: 'lecture_01_intro.mp4', size: 25 * 1024 * 1024, type: 'video/mp4' },
    thumbnailFile: { name: 'thumb_01.jpg', size: 500 * 1024, type: 'image/jpeg' },
    courseId: 'ai-foundations',
    moduleId: 'mod-101',
    title: 'Introduction to Generative Transformers',
    description: 'Foundations lecture 1 recording',
    duration: '52:14'
  });

  assert(!!video.id, 'Video asset created with ID');
  assert(video.status === 'ready', 'Video initialized with ready status');
  assert(video.visibility === 'EnrolledOnly', 'Video marked EnrolledOnly');

  // Status transitions
  const updatedVideoStatus = await services.updateVideoStatus(video.id, 'processing');
  assert(updatedVideoStatus.status === 'processing', 'Video status updated to processing');
  await services.updateVideoStatus(video.id, 'ready');

  // Preview check by enrolled student
  const preview = await services.previewVideo(video.id, 'stu-106');
  assert(preview.id === video.id, 'Enrolled student receives video preview stream');

  // Preview check by unenrolled student
  let unenrolledVideoBlocked = false;
  try {
    await services.previewVideo(video.id, 'stu-101');
  } catch (err) {
    unenrolledVideoBlocked = true;
  }
  assert(unenrolledVideoBlocked, 'Unenrolled student blocked from video stream preview');

  // Video archival
  await services.archiveVideo(video.id);
  let archivedPreviewBlocked = false;
  try {
    await services.previewVideo(video.id, 'stu-106');
  } catch (err) {
    archivedPreviewBlocked = true;
  }
  assert(archivedPreviewBlocked, 'Archived video playback blocked');

  // -------------------------------------------------------------------------
  // Test 4: Student Project & Assignment Submissions
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Student Submissions & Admin Review Workflow ---');
  const subFile = { name: 'project_submission.zip', size: 4 * 1024 * 1024, type: 'application/zip' };
  const sub = await services.uploadSubmission({
    studentId: 'stu-test-77',
    studentName: 'Amina Al-Mansoor',
    assignmentId: 'asg-801',
    courseId: 'ai-foundations',
    file: subFile,
    notes: 'Completed system prompt optimization tests and evaluation logs.',
    deadline: new Date(Date.now() + 86400000).toISOString() // Tomorrow
  });

  assert(!!sub.id, 'Submission created with unique ID');
  assert(sub.version === 1, 'Initial submission version is 1');
  assert(sub.status === 'Submitted', 'Initial submission status is Submitted');

  // Replace submission before deadline
  const replacedSub = await services.replaceSubmission(sub.id, {
    file: { name: 'project_submission_revised.zip', size: 4.2 * 1024 * 1024, type: 'application/zip' },
    notes: 'Updated prompt with JSON Schema validation guardrails.'
  });
  assert(replacedSub.version === 2, 'Submission deliverable version incremented to 2');
  assert(replacedSub.fileName === 'project_submission_revised.zip', 'Updated filename recorded');

  // Download submission authorization:
  // 1. Owner student can download
  const ownerDl = await services.downloadSubmission(sub.id, 'stu-test-77', false);
  assert(ownerDl.fileName === replacedSub.fileName, 'Submitting student can download their own deliverable');

  // 2. Different student is BLOCKED
  let crossStudentBlocked = false;
  try {
    await services.downloadSubmission(sub.id, 'stu-other-99', false);
  } catch (err) {
    crossStudentBlocked = true;
  }
  assert(crossStudentBlocked, 'Cross-student submission download blocked with access denied');

  // 3. Admin CAN download
  const adminDl = await services.downloadSubmission(sub.id, null, true);
  assert(adminDl.fileName === replacedSub.fileName, 'Administrator can download student submission');

  // Admin Review Workflow:
  // Grade submission with feedback and internal note
  const graded = await services.gradeSubmission(sub.id, {
    score: 95,
    feedback: 'Superb work on structured output prompts and system instruction design.',
    internalNote: 'Candidate showed high proficiency with markdown and reasoning scaffolds.',
    reviewer: 'Chief Faculty Lead'
  });
  assert(graded.score === 95, 'Grade score recorded');
  assert(graded.status === 'Reviewed', 'Status set to Reviewed');
  assert(graded.internalReviewerNote.includes('markdown and reasoning'), 'Internal reviewer note recorded');

  // Modification locked once graded
  let replaceGradedBlocked = false;
  try {
    await services.replaceSubmission(sub.id, {
      file: { name: 'late_change.zip', size: 1024, type: 'application/zip' }
    });
  } catch (err) {
    replaceGradedBlocked = true;
  }
  assert(replaceGradedBlocked, 'Replacement locked after formal evaluation');

  // Return for revision workflow
  const revisionSub = await services.returnSubmissionForRevision(sub.id, 'Please add unit tests for adversarial prompts.', 'Mentor requested edge test coverage.', 'Faculty Advisor');
  assert(revisionSub.status === 'Returned for revision', 'Status updated to Returned for revision');

  // Approve completion workflow
  const approvedSub = await services.approveSubmissionCompletion(sub.id, 'All requirements completed with distinction.', 'Final graduation credit awarded.', 'Faculty Dean', 100);
  assert(approvedSub.status === 'Approved', 'Status updated to Approved');
  assert(approvedSub.score === 100, 'Score finalized to 100');

  // -------------------------------------------------------------------------
  // Test 5: Firestore File Metadata Consistency
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Firestore Metadata Tracking ---');
  const allMetadata = await services.getAllFileMetadata();
  assert(Array.isArray(allMetadata) && allMetadata.length >= 3, 'File metadata collection populated with records');
  const sampleMeta = allMetadata[0];
  assert(!!sampleMeta.fileName, 'Metadata contains fileName');
  assert(!!sampleMeta.storagePath, 'Metadata contains storagePath');
  assert(sampleMeta.version >= 1, 'Metadata contains version');
  assert(!!sampleMeta.visibility, 'Metadata contains visibility');
  assert(!!sampleMeta.uploadedAt, 'Metadata contains uploadedAt');

  // -------------------------------------------------------------------------
  // Test 6: Security Rules Configuration Check
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Security Rules Validation ---');
  const storageRules = fs.readFileSync(path.join(__dirname, '../storage.rules'), 'utf8');
  assert(storageRules.includes('rules_version = \'2\';'), 'storage.rules specifies version 2');
  assert(storageRules.includes('match /submissions/{studentId}/{submissionId}/{fileName}'), 'storage.rules includes student submissions match');
  assert(storageRules.includes('match /courses/{courseId}/covers/{fileName}'), 'storage.rules includes covers match');
  assert(storageRules.includes('match /courses/{courseId}/resources/{fileName}'), 'storage.rules includes resources match');
  assert(storageRules.includes('match /courses/{courseId}/videos/{videoId}/{fileName}'), 'storage.rules includes videos match');
  assert(storageRules.includes('allow delete: if false;'), 'storage.rules blocks submission deletion');

  const firebaseJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../firebase.json'), 'utf8'));
  assert(firebaseJson.storage && firebaseJson.storage.rules === 'storage.rules', 'firebase.json declares storage.rules');

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n💥 TEST RUN FAILED:', err);
  process.exit(1);
});
