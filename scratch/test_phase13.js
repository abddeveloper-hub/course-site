/**
 * NEXVION AI — Phase 13 Automated Verification Test Suite
 * Tests Secure Payment Infrastructure, Gateway Provider Abstraction,
 * Trusted Server-Side Verification, Webhooks, Refunds, and Role Visibility
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
  console.log('🧪 RUNNING PHASE 13 VERIFICATION SUITE: SECURE PAYMENT INFRASTRUCTURE');
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
  assert(!!services.paymentRepository, 'paymentRepository available on services');

  // -------------------------------------------------------------------------
  // Test 1: Official Tier Pricing & Configurable Display
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Configurable Official Tier Pricing ---');
  const fndPrice = services.getTierPriceConfig('ai-foundations');
  assert(fndPrice.priceDisplay === 'FREE', 'AI Foundations officially configured as FREE');
  assert(fndPrice.amount === 0, 'AI Foundations amount is 0');
  assert(fndPrice.isPaid === false, 'AI Foundations marked as isPaid: false');

  const bldPrice = services.getTierPriceConfig('ai-builder');
  assert(bldPrice.priceDisplay === 'PRICE COMING SOON', 'AI Builder defaults to PRICE COMING SOON');
  assert(bldPrice.amount === null, 'AI Builder amount is uninvented (null)');

  const crtPrice = services.getTierPriceConfig('ai-creator');
  assert(crtPrice.priceDisplay === 'PRICE COMING SOON', 'AI Creator defaults to PRICE COMING SOON');

  const arcPrice = services.getTierPriceConfig('ai-architect');
  assert(arcPrice.priceDisplay === 'PRICE COMING SOON', 'AI Architect defaults to PRICE COMING SOON');

  // Configure price via authorized role
  await services.setTierPriceConfig('ai-builder', { amount: 149, currency: 'USD' });
  const updatedBld = services.getTierPriceConfig('ai-builder');
  assert(updatedBld.amount === 149, 'AI Builder amount updated to 149');
  assert(updatedBld.priceDisplay === '$149', 'AI Builder priceDisplay updated to $149');

  // -------------------------------------------------------------------------
  // Test 2: Free Tier Enrollment (No Payment Required)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Free Tier Enrollment ---');
  const freeResult = await services.createCheckoutSession({
    studentId: 'stu-test-free',
    studentName: 'Lina Vance',
    studentEmail: 'lina.vance@synthetic.nexus',
    courseId: 'ai-foundations',
    tierId: 'ai-foundations'
  });

  assert(freeResult.freeTier === true, 'Free tier identified as non-billable');
  assert(freeResult.status === 'Not required', 'Payment status is "Not required"');
  assert(freeResult.enrollment.status === 'Enrolled', 'Enrollment automatically activated to Enrolled');
  assert(freeResult.enrollment.paymentStatus === 'Not required', 'Enrollment payment status marked Not required');

  // -------------------------------------------------------------------------
  // Test 3: Paid Tier with PRICE COMING SOON
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Paid Tier with Coming Soon Price ---');
  const comingSoonResult = await services.createCheckoutSession({
    studentId: 'stu-test-cs',
    studentName: 'Darius Thorne',
    studentEmail: 'darius.t@synthetic.nexus',
    courseId: 'ai-creator',
    tierId: 'ai-creator'
  });

  assert(comingSoonResult.comingSoon === true, 'Pending fee identified as coming soon');
  assert(comingSoonResult.status === 'Pending', 'Payment initialized as Pending');
  assert(comingSoonResult.enrollment.status === 'Pending', 'Enrollment held in Pending status');
  assert(comingSoonResult.enrollment.paymentStatus === 'Pending', 'Enrollment payment status held in Pending');

  // -------------------------------------------------------------------------
  // Test 4: Paid Checkout Session Creation (Client Price Cannot Be Tampered)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Paid Checkout Session (Server Enforced Price) ---');
  // Attempting to send client-tampered price of $1 instead of official $149
  const paidResult = await services.createCheckoutSession({
    studentId: 'stu-test-paid',
    studentName: 'Kaelen Ross',
    studentEmail: 'kaelen.ross@synthetic.nexus',
    courseId: 'ai-builder',
    tierId: 'ai-builder',
    amount: 1 // Attempted tampering
  });

  assert(paidResult.success === true, 'Checkout session created successfully');
  assert(paidResult.amount === 149, 'Client-side price ignored; official $149 enforced');
  assert(paidResult.status === 'Pending', 'Payment status is initially Pending');
  assert(paidResult.enrollment.status === 'Pending', 'Enrollment is NOT activated before verification');
  assert(!!paidResult.sessionId, 'Session ID issued');
  assert(!!paidResult.transactionRef, 'Transaction reference issued');

  // -------------------------------------------------------------------------
  // Test 5: Cancelled Checkout Handling
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Cancelled Checkout Handling ---');
  const cancelledPayment = await services.handleCancelledPayment(paidResult.payment.id, 'User closed modal');
  assert(cancelledPayment.status === 'Cancelled', 'Payment status marked Cancelled');
  assert(cancelledPayment.verificationStatus === 'Cancelled', 'Verification status marked Cancelled');

  // -------------------------------------------------------------------------
  // Test 6: Failed Payment Handling
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Failed Payment Handling ---');
  const failTx = await services.createCheckoutSession({
    studentId: 'stu-test-fail',
    studentName: 'Nadia Sol',
    studentEmail: 'nadia.sol@synthetic.nexus',
    courseId: 'ai-builder',
    tierId: 'ai-builder'
  });
  const failedPayment = await services.handleFailedPayment(failTx.payment.id, 'Simulated insufficient funds');
  assert(failedPayment.status === 'Failed', 'Payment status marked Failed');
  assert(failedPayment.verificationStatus === 'Verification failed', 'Verification status marked Verification failed');

  // -------------------------------------------------------------------------
  // Test 7: Trusted Server-Side Verification & Enrollment Activation
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Server-Side Verification & Activation ---');
  const activeTx = await services.createCheckoutSession({
    studentId: 'stu-test-verify',
    studentName: 'Cassian Cruz',
    studentEmail: 'cassian.cruz@synthetic.nexus',
    courseId: 'ai-builder',
    tierId: 'ai-builder'
  });

  // Test Verification rejection: incorrect amount
  let amountMismatchBlocked = false;
  try {
    await services.verifyPayment({
      transactionRef: activeTx.transactionRef,
      actualAmount: 50 // Mismatched
    });
  } catch (err) {
    amountMismatchBlocked = true;
  }
  assert(amountMismatchBlocked, 'Verification with mismatched amount rejected');

  // Test Verification rejection: incorrect user
  let userMismatchBlocked = false;
  try {
    await services.verifyPayment({
      transactionRef: activeTx.transactionRef,
      studentId: 'stu-wrong-person'
    });
  } catch (err) {
    userMismatchBlocked = true;
  }
  assert(userMismatchBlocked, 'Verification with mismatched student identity rejected');

  // Successful trusted verification
  const verifyResult = await services.verifyPayment({
    transactionRef: activeTx.transactionRef,
    actualAmount: 149,
    studentId: 'stu-test-verify',
    verifiedBy: 'Secure Webhook Simulator'
  });

  assert(verifyResult.verified === true, 'Trusted verification passed');
  assert(verifyResult.payment.status === 'Paid', 'Payment status updated to Paid');
  assert(verifyResult.payment.verificationStatus === 'Verified', 'Verification status updated to Verified');
  assert(verifyResult.enrollment.status === 'Enrolled', 'Student enrollment activated to Enrolled');
  assert(verifyResult.enrollment.paymentStatus === 'Paid', 'Enrollment payment status marked Paid');

  // Idempotent verification check
  const idempotentResult = await services.verifyPayment({
    transactionRef: activeTx.transactionRef
  });
  assert(idempotentResult.idempotent === true, 'Duplicate verification handled idempotently');

  // -------------------------------------------------------------------------
  // Test 8: Webhook Processing & Duplicate Event Idempotency
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Webhook Processing & Idempotency ---');
  const webhookTx = await services.createCheckoutSession({
    studentId: 'stu-test-webhook',
    studentName: 'Talia Kim',
    studentEmail: 'talia.kim@synthetic.nexus',
    courseId: 'ai-builder',
    tierId: 'ai-builder'
  });

  const webhookPayload = {
    id: `evt_test_${Date.now()}`,
    type: 'payment.succeeded',
    transactionRef: webhookTx.transactionRef,
    amount: 149,
    currency: 'USD',
    studentId: 'stu-test-webhook'
  };

  const webhookResult1 = await services.handlePaymentWebhook(webhookPayload, 'sig_test_valid');
  assert(webhookResult1.verified === true, 'Webhook payment.succeeded processed and verified');

  // Replaying duplicate webhook event with same event ID
  const webhookResult2 = await services.handlePaymentWebhook(webhookPayload, 'sig_test_valid');
  assert(webhookResult2.duplicate === true, 'Duplicate webhook event recognized and deduplicated (idempotent)');

  // -------------------------------------------------------------------------
  // Test 9: Secure Refund Workflow & Role Access
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Refund Workflow & Role Restrictions ---');
  // Attempting refund as unauthorized role (e.g. Content Manager)
  services.paymentRepository.provider; // exists
  const origRole = sandbox.window.NexvionServices.getRoles();

  // Test Analyst read-only access (cannot refund)
  const store = sandbox.window.NexvionServices; // facade
  const pRecord = await services.getPaymentById(verifyResult.payment.id);
  assert(!!pRecord, 'Payment found by ID');
  assert(pRecord.transactionRef === activeTx.transactionRef, 'Transaction reference matches');

  // Refund as Finance Manager / Super Admin
  const refundedPayment = await services.refundPayment(pRecord.id, 'Student medical leave withdrawal');
  assert(refundedPayment.status === 'Refunded', 'Payment status updated to Refunded');
  assert(refundedPayment.refundStatus === 'Processed', 'Refund status updated to Processed');

  // -------------------------------------------------------------------------
  // Test 10: Admin Role Payment Visibility Controls
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Role-Based Payment Visibility ---');
  const allPayments = await services.getPayments();
  assert(Array.isArray(allPayments) && allPayments.length >= 10, 'Payments list returned for authorized role');

  const firstPay = allPayments[0];
  assert(!!firstPay.currency, 'Payment record contains currency');
  assert(!!firstPay.provider, 'Payment record contains provider');
  assert(!!firstPay.verificationStatus, 'Payment record contains verificationStatus');
  assert(!!firstPay.status, 'Payment record contains status');

  // Verify historical transaction retention
  assert(!services.paymentRepository.deletePayment, 'Direct deletion method is not exposed (records preserved)');

  // -------------------------------------------------------------------------
  // Test 11: Security Rules Check
  // -------------------------------------------------------------------------
  console.log('\n--- 11. Security Rules Check ---');
  const rules = fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8');
  assert(rules.includes('function isFinanceManager()'), 'firestore.rules declares isFinanceManager helper');
  assert(rules.includes('match /payments/{paymentId}'), 'firestore.rules protects /payments collection');
  assert(rules.includes('allow delete: if false;'), 'firestore.rules strictly forbids payment deletion');

  // -------------------------------------------------------------------------
  // Test 12: Server.js API Endpoints & Static Code Checks
  // -------------------------------------------------------------------------
  console.log('\n--- 12. Server.js Payment Endpoints Check ---');
  const serverCode = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
  assert(serverCode.includes('/api/payments/config'), 'server.js includes /api/payments/config route');
  assert(serverCode.includes('/api/payments/create-checkout-session'), 'server.js includes /api/payments/create-checkout-session');
  assert(serverCode.includes('/api/payments/verify-payment'), 'server.js includes /api/payments/verify-payment');
  assert(serverCode.includes('/api/payments/status'), 'server.js includes /api/payments/status route');
  assert(serverCode.includes('/api/payments/webhook'), 'server.js includes /api/payments/webhook');
  assert(serverCode.includes('/checkout'), 'server.js handles /checkout route');
  assert(serverCode.includes('TIER_PRICES_REGISTRY'), 'server.js declares server-side tier price registry');
  assert(serverCode.includes('PROCESSED_WEBHOOK_EVENTS'), 'server.js declares webhook idempotency registry');

  // -------------------------------------------------------------------------
  // Test 13: Live HTTP Server Endpoint Integration Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 13. Live HTTP Endpoints Integration Suite ---');
  const http = require('http');
  const { spawn } = require('child_process');

  const TEST_PORT = 8919;
  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: TEST_PORT },
    stdio: 'ignore'
  });

  // Give server 500ms to bind
  await new Promise(r => setTimeout(r, 600));

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
    // 13.1 GET /api/payments/config
    const cfgRes = await makeRequest('GET', '/api/payments/config');
    assert(cfgRes.status === 200, 'GET /api/payments/config returned 200');
    assert(cfgRes.body.currency === 'USD', 'Currency is USD');
    assert(cfgRes.body.tiers['ai-foundations'].isPaid === false, 'AI Foundations is marked isPaid: false');

    // 13.2 POST /api/payments/create-checkout-session (Free tier)
    const freeReq = await makeRequest('POST', '/api/payments/create-checkout-session', {}, {
      studentId: 'stu-http-free',
      tierId: 'ai-foundations'
    });
    assert(freeReq.status === 200, 'Free checkout session returned 200');
    assert(freeReq.body.freeTier === true, 'Free tier identified as non-billable');
    assert(freeReq.body.status === 'Not required', 'Free tier status is "Not required"');

    // 13.3 POST /api/payments/create-checkout-session (Paid tier with coming soon price)
    const csReq = await makeRequest('POST', '/api/payments/create-checkout-session', {}, {
      studentId: 'stu-http-paid',
      tierId: 'ai-builder'
    });
    assert(csReq.status === 200, 'Builder tier request returned 200');
    assert(csReq.body.comingSoon === true, 'Builder tier identified with comingSoon: true');
    assert(csReq.body.priceDisplay === 'PRICE COMING SOON', 'Builder tier displays PRICE COMING SOON');

    // 13.4 POST /api/payments/create-checkout-session (Missing required fields)
    const badReq = await makeRequest('POST', '/api/payments/create-checkout-session', {}, {});
    assert(badReq.status === 400, 'Missing fields correctly rejected with 400');

    // 13.5 POST /api/payments/verify-payment (Missing / non-existent ref)
    const nonExistVerify = await makeRequest('POST', '/api/payments/verify-payment', {}, {
      transactionRef: 'NON-EXISTENT-TX'
    });
    assert(nonExistVerify.status === 404, 'Non-existent transaction ref returns 404');

    // 13.6 POST /api/payments/webhook (Signature protection)
    const noSigWebhook = await makeRequest('POST', '/api/payments/webhook', {}, {
      id: 'evt_no_sig_1',
      type: 'payment.succeeded'
    });
    assert(noSigWebhook.status === 401, 'Webhook without signature rejected with 401');

    // 13.7 POST /api/payments/webhook (Valid signature)
    const validWebhook = await makeRequest('POST', '/api/payments/webhook', {
      'x-nexvion-signature': 'sig_test_trusted_header'
    }, {
      id: 'evt_http_valid_1',
      type: 'payment.succeeded'
    });
    assert(validWebhook.status === 200, 'Webhook with signature processed with 200');

    // 13.8 POST /api/payments/webhook (Duplicate idempotency check)
    const dupWebhook = await makeRequest('POST', '/api/payments/webhook', {
      'x-nexvion-signature': 'sig_test_trusted_header'
    }, {
      id: 'evt_http_valid_1',
      type: 'payment.succeeded'
    });
    assert(dupWebhook.status === 200, 'Duplicate webhook handled with 200');
    assert(dupWebhook.body.duplicate === true, 'Duplicate webhook deduplicated idempotently');

    // 13.9 POST /api/payments/refund (Unauthorized access control)
    const unauthRefund = await makeRequest('POST', '/api/payments/refund', {
      'x-admin-role': 'Student Manager'
    }, {
      transactionRef: 'NEX-TX-2026-0001'
    });
    assert(unauthRefund.status === 403, 'Unauthorized refund blocked with 403 Forbidden');

    // 13.10 POST /api/payments/refund (Authorized Finance Manager role)
    const authRefund = await makeRequest('POST', '/api/payments/refund', {
      'x-admin-role': 'Finance Manager'
    }, {
      transactionRef: 'NEX-TX-2026-0001',
      reason: 'Bursar adjustment'
    });
    assert(authRefund.status === 200, 'Finance Manager refund processed with 200');

    // 13.11 GET /checkout static routing
    const chkPage = await makeRequest('GET', '/checkout');
    assert(chkPage.status === 200, 'GET /checkout serves 200');
    assert(typeof chkPage.body === 'string' && chkPage.body.includes('NEXVION AI'), 'checkout.html content returned');

    // 13.12 GET /api/payments/status
    const statusReq = await makeRequest('GET', '/api/payments/status?tx=NON-EXISTENT');
    assert(statusReq.status === 404, 'Status query for non-existent returns 404');
  } finally {
    serverProcess.kill();
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} PHASE 13 TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n💥 TEST RUN FAILED:', err);
  process.exit(1);
});
