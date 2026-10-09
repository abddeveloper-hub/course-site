/**
 * NEXVION AI — Phase 16 Automated Verification Test Suite
 * Tests Backend Support Desk, Ticket Isolation, Internal Note Privacy,
 * Ticket Lifecycle Workflows, Audit Logging, and Server-Side Analytics Telemetry.
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
  console.log('🧪 RUNNING PHASE 16 VERIFICATION SUITE: BACKEND SUPPORT & ANALYTICS');
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
  assert(!!services.supportRepository, 'supportRepository available on services');
  assert(!!services.analyticsRepository, 'analyticsRepository available on services');

  const supportRepo = services.supportRepository;
  const analyticsRepo = services.analyticsRepository;

  // 1. Support Ticket Creation & Normalization
  console.log('\n--- 1. Testing Support Ticket Creation & Validation ---');
  const createdTicket = await supportRepo.create({
    studentId: 'stu-103',
    studentName: 'Julian Mercer',
    studentEmail: 'julian.m@matrix-sys.io',
    subject: 'Seat assignment inquiry for AI Creator Cohort Delta',
    category: 'Enrollment',
    priority: 'High',
    message: 'Could you confirm when the next available seat activates?',
    attachments: [
      {
        fileName: 'enrollment_receipt.pdf',
        fileUrl: 'https://storage.nexvion.ai/support/enrollment_receipt.pdf',
        fileSize: 104200,
        uploadedAt: new Date().toISOString()
      }
    ]
  });

  assert(!!createdTicket.id, 'Ticket assigned unique ID');
  assert(createdTicket.ticketRef.startsWith('SUP-2026-'), 'Ticket assigned canonical SUP-2026 reference');
  assert(createdTicket.category === 'Enrollment', 'Ticket category is Enrollment');
  assert(createdTicket.priority === 'High', 'Ticket priority is High');
  assert(createdTicket.status === 'Open', 'Initial ticket status is Open');
  assert(createdTicket.messages.length === 1, 'Initial conversation message preserved');
  assert(createdTicket.attachments.length === 1, 'Attachment metadata recorded');

  // 2. Student Ticket Isolation
  console.log('\n--- 2. Testing Student Ticket Isolation ---');
  const julianTickets = await supportRepo.getStudentTickets('stu-103');
  assert(julianTickets.length >= 1, 'Julian retrieves his tickets');
  assert(julianTickets.every(t => t.studentId === 'stu-103'), 'Julian cannot see other students tickets');

  const otherStudentTickets = await supportRepo.getStudentTickets('stu-105');
  assert(otherStudentTickets.every(t => t.studentId === 'stu-105'), 'Soraya only retrieves her tickets');

  let accessBlocked = false;
  try {
    // Julian attempting to query Soraya's ticket (tic-902) directly
    await supportRepo.findById('tic-902', 'stu-103', false);
  } catch (err) {
    accessBlocked = true;
    assert(err.message.includes('Access denied'), 'Unauthorized ticket access blocked with access denied error');
  }
  assert(accessBlocked === true, 'Cross-student ticket inspection strictly blocked');

  // 3. Internal Note Privacy
  console.log('\n--- 3. Testing Internal Note Privacy (Zero Leakage to Students) ---');
  // Staff adds internal note to ticket
  await supportRepo.addInternalNote(createdTicket.id, 'Candidate is priority #1 on waitlist. Check cohort seat count tomorrow.', 'Sarah Al-Mansoor');

  // Admin view: internalNotes is visible
  const adminViewTicket = await supportRepo.findById(createdTicket.id, null, true);
  assert(Array.isArray(adminViewTicket.internalNotes) && adminViewTicket.internalNotes.length >= 1, 'Internal notes visible to staff in admin view');
  assert(adminViewTicket.internalNotes.some(n => n.text.includes('priority #1 on waitlist')), 'Internal note text preserved for staff');

  // Student view: internalNotes is completely stripped
  const studentViewTicket = await supportRepo.findById(createdTicket.id, 'stu-103', false);
  assert(studentViewTicket.internalNotes === undefined, 'internalNotes property is strictly absent in student view');

  const studentListTickets = await supportRepo.getStudentTickets('stu-103');
  assert(studentListTickets.every(t => t.internalNotes === undefined), 'All tickets in student queries have internal notes scrubbed');

  // 4. Ticket Assignment & Status Transitions
  console.log('\n--- 4. Testing Ticket Assignment & Lifecycle Transitions ---');
  const assigned = await supportRepo.assignTicket(createdTicket.id, 'Sarah Al-Mansoor', 'sarah.m@nexvion.ai');
  assert(assigned.assignedAdmin === 'Sarah Al-Mansoor', 'Assigned admin updated');
  assert(assigned.status === 'In progress', 'Status transitioned from Open to In progress upon assignment');

  // Priority change
  const priorityUpdated = await supportRepo.changePriority(createdTicket.id, 'Urgent');
  assert(priorityUpdated.priority === 'Urgent', 'Ticket priority updated to Urgent');

  // Staff reply
  const replied = await supportRepo.reply(createdTicket.id, 'Seat #1 is reserved for your cohort. Will confirm by Friday.', 'Sarah Al-Mansoor', true);
  assert(replied.messages.length >= 2, 'Message thread appended');
  assert(replied.status === 'Waiting for student', 'Status transitioned to Waiting for student after staff reply');

  // Student reply
  const studentReplied = await supportRepo.reply(createdTicket.id, 'Thank you so much! Awaiting Friday update.', 'Julian Mercer', false);
  assert(studentReplied.status === 'In progress', 'Status transitioned back to In progress after student reply');

  // 5. Ticket Resolution, Reopening, and Closing
  console.log('\n--- 5. Testing Ticket Resolution & Reopening ---');
  const resolved = await supportRepo.resolve(createdTicket.id, 'Cohort seat confirmed and admitted from waitlist.', 'Sarah Al-Mansoor');
  assert(resolved.status === 'Resolved', 'Ticket status updated to Resolved');
  assert(!!resolved.resolutionDetails, 'Resolution details attached');
  assert(resolved.resolutionDetails.resolvedBy === 'Sarah Al-Mansoor', 'Resolver name recorded');

  // Reopen
  const reopened = await supportRepo.reopen(createdTicket.id, 'Student had follow-up question on schedule.', 'Julian Mercer');
  assert(reopened.status === 'In progress', 'Ticket reopened to In progress');

  // Close
  const closed = await supportRepo.close(createdTicket.id, 'Sarah Al-Mansoor');
  assert(closed.status === 'Closed', 'Ticket closed');

  // 6. Audit Trail for Support Operations
  console.log('\n--- 6. Testing Audit Trail Logging ---');
  const auditLogs = await services.getAuditLogs();
  assert(auditLogs.some(l => l.action.includes('Created Support Ticket')), 'Ticket creation logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Assigned Support Ticket')), 'Ticket assignment logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Changed Ticket Priority')), 'Priority change logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Resolved Support Ticket')), 'Ticket resolution logged in audit trail');
  assert(auditLogs.some(l => l.action.includes('Closed Support Ticket')), 'Ticket closure logged in audit trail');

  // 7. Server-Side Analytics Aggregation
  console.log('\n--- 7. Testing Server-Side Analytics Telemetry ---');
  const analyticsData = await analyticsRepo.getAnalytics({}, 'Super Admin');
  assert(!!analyticsData.overview, 'Overview KPIs generated');
  assert(analyticsData.overview.totalStudents >= 10, 'Total students counted');
  assert(analyticsData.overview.activeCourses >= 1, 'Active courses counted');
  assert(Array.isArray(analyticsData.coursePopularity), 'Course popularity list calculated');
  assert(Array.isArray(analyticsData.tierDistribution), 'Tier distribution calculated');
  assert(Array.isArray(analyticsData.batchCapacityUtilization), 'Batch capacity utilization calculated');

  // Invariant validation: 30-Cap per batch
  assert(analyticsData.batchCapacityUtilization.every(b => b.capacity === 30), 'Platform invariant: Batch capacity fixed at 30 across all cohorts');

  // Educational completion telemetry
  assert(!!analyticsData.projectCompletion, 'Project completion telemetry generated');
  assert(!!analyticsData.assignmentSubmissions, 'Assignment submissions telemetry generated');
  assert(!!analyticsData.certificateEligibility, 'Certificate eligibility aggregation generated');
  assert(!!analyticsData.supportVolume, 'Support volume telemetry generated');

  // 8. Analytics Role-Based Financial Restriction
  console.log('\n--- 8. Testing Financial Telemetry Role-Based Masking ---');
  // 8.1 Analyst role: Finance data is restricted
  const analystMetrics = await analyticsRepo.getAnalytics({}, 'Analyst');
  assert(analystMetrics.paymentSummary.restricted === true, 'Financial ledger is restricted for Analyst role');
  assert(analystMetrics.paymentSummary.totalRevenue === undefined, 'totalRevenue is withheld from Analyst role');

  // 8.2 Finance Manager role: Full financial metrics available
  const financeMetrics = await analyticsRepo.getAnalytics({}, 'Finance Manager');
  assert(financeMetrics.paymentSummary.restricted === false, 'Financial ledger unlocked for Finance Manager');
  assert(typeof financeMetrics.paymentSummary.totalRevenue === 'number', 'totalRevenue is aggregated for Finance Manager');

  // 9. Analytics Filtering
  console.log('\n--- 9. Testing Analytics Dataset Filters ---');
  const filteredAnalytics = await analyticsRepo.getAnalytics({
    courseId: 'course-ai-foundations'
  }, 'Super Admin');
  assert(filteredAnalytics.coursePopularity.every(c => c.courseId === 'course-ai-foundations'), 'Course filter narrows course popularity metrics');

  // 10. Live HTTP Server Support & Analytics Endpoints
  console.log('\n--- 10. Testing Live Server Support & Analytics REST Endpoints ---');
  const TEST_PORT = 3106;
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
    // 10.1 GET /api/support/tickets (Admin list)
    const adminTicketsReq = await makeRequest('GET', '/api/support/tickets', {
      'x-admin-role': 'Super Admin'
    });
    assert(adminTicketsReq.status === 200, 'GET /api/support/tickets returns 200 for Super Admin');
    assert(adminTicketsReq.body.tickets.length >= 3, 'Admin retrieves full ticket list');
    assert(adminTicketsReq.body.tickets.some(t => Array.isArray(t.internalNotes)), 'Internal notes visible to admin');

    // 10.2 GET /api/support/tickets (Student-scoped & notes stripped)
    const studentTicketsReq = await makeRequest('GET', '/api/support/tickets?studentId=stu-103', {
      'x-student-id': 'stu-103'
    });
    assert(studentTicketsReq.status === 200, 'GET /api/support/tickets returns 200 for Student query');
    assert(studentTicketsReq.body.tickets.every(t => t.studentId === 'stu-103'), 'Student receives only their tickets');
    assert(studentTicketsReq.body.tickets.every(t => t.internalNotes === undefined), 'Internal notes stripped for student request');

    // 10.3 POST /api/support/tickets (Create ticket)
    const createReq = await makeRequest('POST', '/api/support/tickets', {}, {
      subject: 'Lab environment GPU quota allocation',
      category: 'Technical issue',
      priority: 'Normal',
      studentId: 'stu-105',
      studentName: 'Soraya Chen',
      message: 'Need additional compute quota for training checkpoint.'
    });
    assert(createReq.status === 201, 'POST /api/support/tickets returns 201 Created');
    assert(createReq.body.ticket.subject === 'Lab environment GPU quota allocation', 'Ticket created on live server');

    // 10.4 POST /api/support/tickets/assign
    const assignReq = await makeRequest('POST', '/api/support/tickets/assign', {
      'x-admin-role': 'Student Manager'
    }, {
      ticketId: createReq.body.ticket.id,
      adminName: 'DevOps Support'
    });
    assert(assignReq.status === 200, 'POST /api/support/tickets/assign returns 200');
    assert(assignReq.body.ticket.assignedAdmin === 'DevOps Support', 'Ticket assigned on live server');

    // 10.5 POST /api/support/tickets/note (Student blocked, admin allowed)
    const unauthNoteReq = await makeRequest('POST', '/api/support/tickets/note', {
      'x-admin-role': 'Student'
    }, {
      ticketId: createReq.body.ticket.id,
      text: 'Unauthorized note attempt'
    });
    assert(unauthNoteReq.status === 403, 'Unauthorized student cannot add internal note (403)');

    const authNoteReq = await makeRequest('POST', '/api/support/tickets/note', {
      'x-admin-role': 'Super Admin'
    }, {
      ticketId: createReq.body.ticket.id,
      text: 'Allocated 20 additional GPU hours.'
    });
    assert(authNoteReq.status === 200, 'Authorized internal note returns 200');

    // 10.6 POST /api/support/tickets/resolve
    const resolveReq = await makeRequest('POST', '/api/support/tickets/resolve', {
      'x-admin-role': 'Super Admin'
    }, {
      ticketId: createReq.body.ticket.id,
      resolutionNotes: 'GPU hours provisioned.'
    });
    assert(resolveReq.status === 200, 'POST /api/support/tickets/resolve returns 200');
    assert(resolveReq.body.ticket.status === 'Resolved', 'Ticket status updated to Resolved on server');

    // 10.7 GET /api/analytics (Live server analytics endpoint)
    const analyticsLiveReq = await makeRequest('GET', '/api/analytics', {
      'x-admin-role': 'Analyst'
    });
    assert(analyticsLiveReq.status === 200, 'GET /api/analytics returns 200');
    assert(!!analyticsLiveReq.body.overview, 'Overview telemetry returned by live server');
    assert(analyticsLiveReq.body.paymentSummary.restricted === true, 'Live endpoint masks financials for Analyst role');

    // 10.8 GET /api/analytics (Finance role gets revenue totals)
    const financeLiveReq = await makeRequest('GET', '/api/analytics', {
      'x-admin-role': 'Finance Manager'
    });
    assert(financeLiveReq.status === 200, 'GET /api/analytics returns 200 for Finance Manager');
    assert(financeLiveReq.body.paymentSummary.restricted === false, 'Live endpoint exposes revenue totals for Finance Manager');

  } finally {
    serverProcess.kill();
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL PHASE 16 VERIFICATION TESTS PASSED (${passedTests}/${totalTests})`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
  process.exit(1);
});
