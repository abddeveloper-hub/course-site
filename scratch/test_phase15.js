/**
 * NEXVION AI — Phase 15 Automated Verification Test Suite
 * Tests Secure Certificate Eligibility, Issuance, Revocation,
 * Public Verification, RBAC Security, Audit Trail, and Real-Time Notifications.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const { spawn } = require('child_process');

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
  console.log('🧪 RUNNING PHASE 15 VERIFICATION SUITE: SECURE CERTIFICATES');
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
  assert(!!services.certificateRepository, 'certificateRepository available on services');

  const certRepo = services.certificateRepository;

  // 1. Ineligible Student Calculation (Milestones incomplete)
  console.log('\n--- 1. Testing Ineligible Student Calculation ---');
  // Create student with 0 progress
  const ineligStudent = await services.studentRepository.create({
    name: 'Novice Applicant',
    email: 'novice@synthetic.nexus',
    enrolledCourse: 'course-ai-foundations',
    progressPercent: 10,
    completedClasses: 1,
    completedModules: 0
  });

  const ineligCalc = await certRepo.calculateEligibility({
    studentId: ineligStudent.id,
    courseId: 'course-ai-foundations'
  });
  assert(ineligCalc.eligible === false, 'Student with incomplete milestones calculated as ineligible');
  assert(ineligCalc.status === 'Not eligible', 'Status is "Not eligible"');
  assert(ineligCalc.requirements.courseCompletion.met === false, 'Course completion requirement unmet');

  // 2. Client-submitted percentage bypass prevention
  console.log('\n--- 2. Testing Client-submitted Percentage Bypass Prevention ---');
  // Client claims 100% completion in request, but verified backend records show incomplete
  const fraudCalc = await certRepo.calculateEligibility({
    studentId: ineligStudent.id,
    courseId: 'course-ai-foundations',
    clientClaimedProgress: 100 // Should be completely ignored by backend calculation
  });
  assert(fraudCalc.eligible === false, 'Backend calculation ignores client-claimed completion percentages');

  // 3. Eligible Student Calculation & Pending Approval
  console.log('\n--- 3. Testing Eligible Student & Pending Approval State ---');
  // Create student who completed all curriculum requirements
  const eligibleStudent = await services.studentRepository.create({
    name: 'Valeria Solis',
    email: 'v.solis@synthetic.nexus',
    enrolledCourse: 'course-ai-foundations',
    progressPercent: 100,
    completedClasses: 8,
    completedModules: 5
  });

  // Add approved capstone submission
  await services.saveSubmission({
    studentId: eligibleStudent.id,
    studentName: 'Valeria Solis',
    title: 'Autonomous Multi-Agent Capstone',
    type: 'Project',
    status: 'Approved',
    gradeScore: 95
  });

  // Add lab assignments
  await services.saveSubmission({
    studentId: eligibleStudent.id,
    studentName: 'Valeria Solis',
    title: 'Lab 1: Prompt Chaining',
    type: 'Assignment',
    status: 'Approved'
  });
  await services.saveSubmission({
    studentId: eligibleStudent.id,
    studentName: 'Valeria Solis',
    title: 'Lab 2: Vector Retrieval',
    type: 'Assignment',
    status: 'Approved'
  });

  const eligCalc = await certRepo.calculateEligibility({
    studentId: eligibleStudent.id,
    courseId: 'course-ai-foundations'
  });
  assert(eligCalc.eligible === true, 'All academic milestones satisfied');
  assert(eligCalc.academicRequirementsMet === true, 'Academic requirements verified');
  assert(eligCalc.status === 'Pending approval', 'Status is "Pending approval" prior to manual sign-off');
  assert(eligCalc.requirements.manualApproval.met === false, 'Manual approval is marked pending');

  // 4. Paid Tier Eligibility requires Payment Completion
  console.log('\n--- 4. Testing Paid Tier Payment Prerequisite ---');
  const paidTierStudent = await services.studentRepository.create({
    name: 'Darius Vance',
    email: 'darius.vance@synthetic.nexus',
    enrolledCourse: 'course-ai-builder',
    progressPercent: 100,
    completedClasses: 12,
    completedModules: 8
  });
  // Without payment record:
  const unpaidCalc = await certRepo.calculateEligibility({
    studentId: paidTierStudent.id,
    courseId: 'course-ai-builder'
  });
  assert(unpaidCalc.requirements.paymentCompletion.met === false, 'Paid course requires tuition clearance');
  assert(unpaidCalc.eligible === false, 'Student with unpaid tuition is not eligible');

  // Add paid transaction record
  await services.savePayment({
    studentId: paidTierStudent.id,
    studentName: 'Darius Vance',
    courseId: 'course-ai-builder',
    tierId: 'ai-builder',
    amount: 149,
    status: 'Paid',
    verificationStatus: 'Verified',
    transactionRef: 'NEX-TX-PAY-CERT-01'
  });

  // Add submissions for Darius
  await services.saveSubmission({
    studentId: paidTierStudent.id,
    title: 'Builder Capstone',
    type: 'Project',
    status: 'Approved',
    gradeScore: 90
  });
  await services.saveSubmission({
    studentId: paidTierStudent.id,
    title: 'Lab Sprint A',
    type: 'Assignment',
    status: 'Approved'
  });
  await services.saveSubmission({
    studentId: paidTierStudent.id,
    title: 'Lab Sprint B',
    type: 'Assignment',
    status: 'Approved'
  });

  const paidCalc = await certRepo.calculateEligibility({
    studentId: paidTierStudent.id,
    courseId: 'course-ai-builder'
  });
  assert(paidCalc.requirements.paymentCompletion.met === true, 'Tuition payment cleared from backend payment ledger');
  assert(paidCalc.eligible === true, 'Paid course eligibility unlocked after verified payment');

  // 5. Directorate Approval Workflow
  console.log('\n--- 5. Testing Directorate Approval Workflow ---');
  // Use existing pending certificate: cert-8002
  const approvedCert = await certRepo.approve('cert-8002', 'Dr. Kenneth Vance', 'Academic rigor verified.');
  assert(approvedCert && approvedCert.status === 'Approved', 'Certificate status updated to Approved');
  assert(approvedCert.requirements.manualApproval.met === true, 'Directorate sign-off recorded as met');
  assert(approvedCert.approvedBy === 'Dr. Kenneth Vance', 'Approver name preserved');

  // Verify notification triggered to student
  const studentInbox = await services.getStudentInbox('stu-102');
  assert(studentInbox.some(m => m.title.includes('Certificate Approved')), 'Approval triggered notification to student inbox');

  // 6. Certificate Issuance & Tamper-Proof ID Generation
  console.log('\n--- 6. Testing Certificate Issuance & ID Generation ---');
  const issuedCert = await certRepo.issue('cert-8002', {
    signatory: 'Dr. Evelyn Vance & Dr. Kenneth Vance'
  });
  assert(issuedCert && issuedCert.status === 'Issued', 'Certificate status updated to Issued');
  assert(!!issuedCert.verificationId && issuedCert.verificationId.startsWith('NEX-'), 'Tamper-proof verification ID assigned');
  assert(!issuedCert.verificationId.includes('Unissued'), 'Unissued placeholder replaced');
  assert(!!issuedCert.issueDate, 'Official issueDate stamped');
  assert(issuedCert.issuingOrganization === 'NEXVION AI Academy', 'Issuing organization stamped');
  assert(!!issuedCert.verificationUrl, 'Verification URL registered');

  // 7. Duplicate Issuance Prevention (Idempotency)
  console.log('\n--- 7. Testing Duplicate Issuance Prevention ---');
  const dupIssue = await certRepo.issue('cert-8002');
  assert(dupIssue && dupIssue.duplicate === true, 'Duplicate issuance request identified and handled idempotently');
  assert(dupIssue.status === 'Issued', 'Certificate remains in Issued state without re-generating ID');

  // 8. Cannot Issue Unapproved Certificate
  console.log('\n--- 8. Testing Invariant: Unapproved Certificate Cannot Be Issued ---');
  // Create an unapproved certificate candidate
  sandbox.window.NexvionServices.store.state.certificates.push({
    id: 'cert-unapproved-test',
    studentId: 'stu-unappr',
    studentName: 'Incomplete Candidate',
    courseTitle: 'AI Foundations',
    status: 'Pending approval',
    requirements: { manualApproval: { met: false } }
  });
  let issueBlocked = false;
  try {
    await certRepo.issue('cert-unapproved-test');
  } catch (err) {
    issueBlocked = true;
    assert(err.message.includes('must be Approved before issuance'), 'Issuance blocked with expected prerequisite error');
  }
  assert(issueBlocked === true, 'Unapproved certificate issuance strictly blocked');

  // 9. Unauthorized Role Issuance Protection
  console.log('\n--- 9. Testing Unauthorized Role RBAC Protection ---');
  // Temporarily switch role to Student Manager (which cannot issue accredited certificates)
  const prevRole = sandbox.window.NexvionServices.store.getCurrentRole();
  sandbox.window.NexvionServices.store.setCurrentRole('Student Manager');
  let unauthBlocked = false;
  try {
    await certRepo.issue('cert-8001');
  } catch (err) {
    unauthBlocked = true;
    assert(err.message.includes('Unauthorized role cannot issue certificates'), 'Unauthorized role error thrown');
  }
  assert(unauthBlocked === true, 'Unauthorized role blocked from issuing certificates');
  sandbox.window.NexvionServices.store.setCurrentRole(prevRole);

  // 10. Certificate Revocation & Historical Preservation
  console.log('\n--- 10. Testing Certificate Revocation ---');
  const revokedCert = await certRepo.revoke(
    'cert-8001',
    'Honor code violation during academic review',
    'Compliance Directorate'
  );
  assert(revokedCert && revokedCert.status === 'Revoked', 'Certificate status updated to Revoked');
  assert(revokedCert.revocation && revokedCert.revocation.reason.includes('Honor code violation'), 'Revocation reason preserved');
  assert(!!revokedCert.revocation.revokedAt, 'Revocation timestamp preserved');
  assert(revokedCert.verificationId === 'NEX-FND-2026-0042', 'Historical verification ID preserved for auditability');

  // Verify revocation notification to student
  const rohanInbox = await services.getStudentInbox('stu-106');
  assert(rohanInbox.some(m => m.title.includes('Certificate Notice: Credential Revoked')), 'Revocation notification delivered to student');

  // 11. Public Verification (Safe Metadata Only)
  console.log('\n--- 11. Testing Public Verification (Safe Public Metadata) ---');
  // 11.1 Valid Issued Certificate
  const validPub = await certRepo.verifyPublic(issuedCert.verificationId);
  assert(validPub.valid === true, 'Valid issued certificate passes public verification');
  assert(validPub.status === 'Issued', 'Public status is Issued');
  assert(validPub.studentName === 'Amara Valen', 'Student name is returned for public verification');
  assert(validPub.courseName.includes('AI Foundations'), 'Course name is returned');
  assert(validPub.studentEmail === undefined, 'Private student email is NOT exposed in public verification');
  assert(validPub.internalNotes === undefined, 'Internal notes are NOT exposed in public verification');

  // 11.2 Revoked Certificate
  const revokedPub = await certRepo.verifyPublic('NEX-FND-2026-0042');
  assert(revokedPub.valid === false, 'Revoked certificate is marked valid: false');
  assert(revokedPub.revoked === true, 'Revoked certificate is marked revoked: true');
  assert(revokedPub.status === 'Revoked', 'Status is Revoked');
  assert(!!revokedPub.revocationReason, 'Revocation notice is displayed');

  // 11.3 Invalid / Non-existent Certificate ID
  const invalidPub = await certRepo.verifyPublic('NEX-FAKE-9999');
  assert(invalidPub.valid === false, 'Invalid ID returns valid: false');
  assert(invalidPub.found === false, 'Invalid ID returns found: false');

  // 12. Student Scoped Retrieval
  console.log('\n--- 12. Testing Student-Scoped Retrieval ---');
  const studentCerts = await certRepo.getStudentCertificates('stu-102');
  assert(studentCerts.length >= 1, 'Student retrieves their certificates');
  assert(studentCerts.every(c => c.studentId === 'stu-102'), 'Only student-owned certificates returned');

  // 13. Audit Logging
  console.log('\n--- 13. Testing Audit Logging ---');
  const auditLogs = await services.getAuditLogs();
  assert(auditLogs.some(l => l.action.includes('Approved Certificate Eligibility')), 'Approval logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Issued Certificate Credential')), 'Issuance logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Revoked Certificate Credential')), 'Revocation logged in audit trail');

  // 14. Live Server Endpoints Integration
  console.log('\n--- 14. Testing Live Server Certificate Endpoints ---');
  const TEST_PORT = 3105;
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
    // 14.1 GET /api/certificates (Admin list)
    const adminCerts = await makeRequest('GET', '/api/certificates', {
      'x-admin-role': 'Super Admin'
    });
    assert(adminCerts.status === 200, 'GET /api/certificates returns 200 for Super Admin');
    assert(adminCerts.body.certificates.length >= 2, 'Certificates list returned');

    // 14.2 GET /api/certificates (Unauthorized guest)
    const unauthCerts = await makeRequest('GET', '/api/certificates', {
      'x-admin-role': 'Guest'
    });
    assert(unauthCerts.status === 403, 'GET /api/certificates without admin or studentId returns 403');

    // 14.3 POST /api/certificates/calculate-eligibility
    const eligReq = await makeRequest('POST', '/api/certificates/calculate-eligibility', {}, {
      studentId: 'stu-106',
      courseId: 'course-ai-foundations'
    });
    assert(eligReq.status === 200, 'POST /api/certificates/calculate-eligibility returns 200');
    assert(eligReq.body.academicRequirementsMet === true, 'Academic requirements verified server-side');

    // 14.4 POST /api/certificates/approve (Unauthorized role blocked)
    const unauthApprove = await makeRequest('POST', '/api/certificates/approve', {
      'x-admin-role': 'Unauthorized Guest'
    }, {
      certificateId: 'cert-8002'
    });
    assert(unauthApprove.status === 403, 'Unauthorized approval blocked with 403');

    // 14.5 POST /api/certificates/approve (Authorized Academic Director)
    const authApprove = await makeRequest('POST', '/api/certificates/approve', {
      'x-admin-role': 'Academic Director'
    }, {
      certificateId: 'cert-8002',
      approver: 'Academic Director Dr. Vance'
    });
    assert(authApprove.status === 200, 'Authorized approval processed with 200');
    assert(authApprove.body.certificate.status === 'Approved', 'Status updated to Approved on server');

    // 14.6 POST /api/certificates/issue
    const issueReq = await makeRequest('POST', '/api/certificates/issue', {
      'x-admin-role': 'Academic Director'
    }, {
      certificateId: 'cert-8002'
    });
    assert(issueReq.status === 200, 'Certificate issuance returns 200');
    assert(issueReq.body.certificate.status === 'Issued', 'Status updated to Issued on server');

    // 14.7 POST /api/certificates/issue (Idempotent duplicate check)
    const dupIssueReq = await makeRequest('POST', '/api/certificates/issue', {
      'x-admin-role': 'Academic Director'
    }, {
      certificateId: 'cert-8002'
    });
    assert(dupIssueReq.status === 200, 'Duplicate issuance request returns 200');
    assert(dupIssueReq.body.duplicate === true, 'Duplicate issuance flagged as duplicate');

    // 14.8 POST /api/certificates/revoke
    const revokeReq = await makeRequest('POST', '/api/certificates/revoke', {
      'x-admin-role': 'Super Admin'
    }, {
      certificateId: 'cert-8001',
      reason: 'Academic audit revocation'
    });
    assert(revokeReq.status === 200, 'Certificate revocation returns 200');
    assert(revokeReq.body.certificate.status === 'Revoked', 'Status updated to Revoked on server');

    // 14.9 GET /api/certificates/verify/:id (Public valid verification)
    const pubValid = await makeRequest('GET', '/api/certificates/verify/NEX-FND-2026-0042');
    assert(pubValid.status === 200, 'Public verification API returns 200');
    assert(pubValid.body.revoked === true, 'Revoked status recognized publicly');
    assert(pubValid.body.studentEmail === undefined, 'No private student email leaked');

    // 14.10 GET /verify-certificate/:certificateId static page routing
    const verifyPage = await makeRequest('GET', '/verify-certificate/NEX-FND-2026-0042');
    assert(verifyPage.status === 200, 'GET /verify-certificate/:id serves 200');
    assert(typeof verifyPage.body === 'string' && verifyPage.body.includes('Certificate Verification'), 'verify-certificate.html page returned');

  } finally {
    serverProcess.kill();
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL PHASE 15 VERIFICATION TESTS PASSED (${passedTests}/${totalTests})`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
  process.exit(1);
});
