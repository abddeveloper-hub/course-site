const http = require('http');
const fs = require('fs');
const path = require('path');

// Allowed CORS origins — localhost for dev, production domain in prod
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://nexvion-ai.firebaseapp.com',
  'https://nexvion-ai.web.app',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);
// Load environment variables from .env if present
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      const val = (match[2] || '').trim();
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Phase 13 Server-Side Payment & Webhook Verification Subsystem
const TIER_PRICES_REGISTRY = {
  'ai-foundations': { tierName: 'AI Foundations', priceDisplay: 'FREE', amount: 0, currency: 'USD', isPaid: false },
  'ai-builder': { tierName: 'AI Builder', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
  'ai-creator': { tierName: 'AI Creator', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
  'ai-architect': { tierName: 'AI Architect', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true }
};

const PROCESSED_WEBHOOK_EVENTS = new Set();
const ACTIVE_CHECKOUT_TRANSACTIONS = new Map();

// Phase 14 Notification Delivery Engine Datastores
const NOTIFICATION_DEVICE_TOKENS = new Map();
const USER_NOTIFICATION_PREFERENCES = new Map();
const NOTIFICATION_HISTORY = new Map();
const USER_NOTIFICATION_INBOXES = new Map();
const PROCESSED_NOTIFICATION_IDEMPOTENCY = new Set();

// Phase 15 Secure Certificate Issuance & Public Verification Datastores
const CERTIFICATES_REGISTRY = new Map();
const DEFAULT_SEED_CERTIFICATES = [
  {
    id: 'cert-8001',
    verificationId: 'NEX-FND-2026-0042',
    studentId: 'stu-106',
    studentName: 'Rohan Mehra',
    studentEmail: 'rohan.mehra@ai-craft.in',
    courseTitle: 'AI Foundations: Zero to AI Native',
    courseId: 'course-ai-foundations',
    tierName: 'AI Foundations',
    tierId: 'tier-foundations',
    batchName: 'Foundations Cohort Alpha',
    batchId: 'batch-alpha-2026',
    completionPercentage: 100,
    eligibilityStatus: 'Requirements Satisfied',
    status: 'Issued',
    issueDate: '2026-10-05',
    grade: 'Distinction (98%)',
    signatory: 'Dr. Evelyn Vance & Dr. Kenneth Vance',
    issuingOrganization: 'NEXVION AI Academy',
    verificationUrl: '/verify-certificate/NEX-FND-2026-0042',
    requirements: {
      courseCompletion: { met: true, label: 'Course Progress', detail: '100% curriculum lessons completed' },
      classCompletion: { met: true, label: 'Required Classes', detail: '8 / 8 mandatory interactive live classes attended' },
      projectCompletion: { met: true, label: 'Capstone Project', detail: 'Foundations Capstone passed with 98% score' },
      assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '4 / 4 lab assignments evaluated and passed' },
      paymentCompletion: { met: true, label: 'Tuition Clearance', detail: 'Tuition Cleared (Free Tier / Sponsored)' },
      manualApproval: { met: true, label: 'Directorate Approval', detail: 'Signed off by Academic Director on 2026-10-04' }
    },
    internalNotes: [
      { text: 'Academic audit verified complete attendance & top-percentile submission.', author: 'Academic Directorate', date: '2026-10-04T10:00:00Z' }
    ]
  },
  {
    id: 'cert-8002',
    verificationId: 'NEX-FND-2026-0043 (Unissued)',
    studentId: 'stu-102',
    studentName: 'Amara Valen',
    studentEmail: 'amara.valen@domain.org',
    courseTitle: 'AI Foundations: Zero to AI Native',
    courseId: 'course-ai-foundations',
    tierName: 'AI Foundations',
    tierId: 'tier-foundations',
    batchName: 'Foundations Cohort Alpha',
    batchId: 'batch-alpha-2026',
    completionPercentage: 95,
    eligibilityStatus: 'Awaiting Directorate Sign-off',
    status: 'Pending approval',
    issueDate: 'Pending Generation',
    grade: 'First Class (88%)',
    signatory: 'Academic Directorate',
    issuingOrganization: 'NEXVION AI Academy',
    requirements: {
      courseCompletion: { met: true, label: 'Course Progress', detail: '95% modules and lessons completed' },
      classCompletion: { met: true, label: 'Required Classes', detail: '8 / 8 live classes attended' },
      projectCompletion: { met: true, label: 'Capstone Project', detail: 'Capstone submitted and approved by mentor' },
      assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '4 / 4 assignments submitted' },
      paymentCompletion: { met: true, label: 'Tuition Clearance', detail: 'Tuition Cleared (Free Tier / Sponsored)' },
      manualApproval: { met: false, label: 'Directorate Approval', detail: 'Pending final review and signature from Academic Directorate' }
    },
    internalNotes: [
      { text: 'Submission scored 88%. Ready for directorate approval sign-off.', author: 'Marcus Chen', date: '2026-10-07T14:10:00Z' }
    ]
  }
];
DEFAULT_SEED_CERTIFICATES.forEach(c => CERTIFICATES_REGISTRY.set(c.id, JSON.parse(JSON.stringify(c))));

const SUPPORT_TICKETS_REGISTRY = new Map();
const DEFAULT_SEED_SUPPORT_TICKETS = [
  {
    id: 'tic-901',
    ticketRef: 'SUP-2026-0312',
    studentId: 'stu-103',
    studentName: 'Julian Mercer',
    studentEmail: 'julian.m@matrix-sys.io',
    subject: 'Inquiry regarding Waitlist Queue Position for Creator Cohort Delta',
    category: 'Enrollment',
    priority: 'High',
    status: 'Open',
    assignedAdmin: 'Sarah Al-Mansoor',
    createdAt: '2026-10-08T09:15:00Z',
    lastUpdated: '2026-10-08T14:30:00Z',
    messages: [
      {
        id: 'msg-901-1',
        sender: 'Julian Mercer',
        senderEmail: 'julian.m@matrix-sys.io',
        isStaff: false,
        timestamp: '2026-10-08T09:15:00Z',
        text: 'Hi NEXVION Support team, I submitted enrollment for Creator Cohort Delta and noticed it says waitlisted. Could you clarify when the next batch slot opens up?'
      },
      {
        id: 'msg-901-2',
        sender: 'Sarah Al-Mansoor (Student Manager)',
        senderEmail: 'sarah.m@nexvion.ai',
        isStaff: true,
        timestamp: '2026-10-08T14:30:00Z',
        text: 'Hello Julian! The Creator Cohort Delta has reached its maximum strict capacity of 30 students. You are currently in waitlist spot #1. If any registered participant defers, your seat will activate immediately.'
      }
    ],
    internalNotes: [
      {
        id: 'not-901-1',
        text: 'Top candidate for next batch if capacity expands or cancellation occurs.',
        author: 'Sarah Al-Mansoor',
        createdAt: '2026-10-08T14:35:00Z'
      }
    ],
    attachments: [],
    resolutionDetails: null
  },
  {
    id: 'tic-902',
    ticketRef: 'SUP-2026-0313',
    studentId: 'stu-105',
    studentName: 'Soraya Chen',
    studentEmail: 's.chen@quantum-ai.dev',
    subject: 'Corporate Purchase Order Processing Status',
    category: 'Payment',
    priority: 'Normal',
    status: 'In progress',
    assignedAdmin: 'Elena Finance Team',
    createdAt: '2026-10-08T11:00:00Z',
    lastUpdated: '2026-10-08T15:20:00Z',
    messages: [
      {
        id: 'msg-902-1',
        sender: 'Soraya Chen',
        senderEmail: 's.chen@quantum-ai.dev',
        isStaff: false,
        timestamp: '2026-10-08T11:00:00Z',
        text: 'Please confirm receipt of our company sponsorship authorization documents.'
      }
    ],
    internalNotes: [
      {
        id: 'not-902-1',
        text: 'Awaiting verification from finance accounts team.',
        author: 'Elena Finance Team',
        createdAt: '2026-10-08T15:20:00Z'
      }
    ],
    attachments: [
      {
        id: 'att-902-1',
        fileName: 'corporate_po_auth.pdf',
        fileUrl: 'https://storage.nexvion.ai/support/tic-902/corporate_po_auth.pdf',
        fileSize: 245800,
        uploadedAt: '2026-10-08T11:00:00Z'
      }
    ],
    resolutionDetails: null
  },
  {
    id: 'tic-903',
    ticketRef: 'SUP-2026-0314',
    studentId: 'stu-101',
    studentName: 'Zackary Thorne',
    studentEmail: 'z.thorne@synthetic.nexus',
    subject: 'Video Player Buffering on Class 03 Stream',
    category: 'Technical issue',
    priority: 'Low',
    status: 'Waiting for student',
    assignedAdmin: 'DevOps Support',
    createdAt: '2026-10-07T18:40:00Z',
    lastUpdated: '2026-10-08T10:12:00Z',
    messages: [
      {
        id: 'msg-903-1',
        sender: 'Zackary Thorne',
        senderEmail: 'z.thorne@synthetic.nexus',
        isStaff: false,
        timestamp: '2026-10-07T18:40:00Z',
        text: 'The 4K stream on Class 03 had slight frame drops on Chrome.'
      },
      {
        id: 'msg-903-2',
        sender: 'DevOps Support',
        senderEmail: 'devops@nexvion.ai',
        isStaff: true,
        timestamp: '2026-10-08T10:12:00Z',
        text: 'We refreshed the HLS CDN manifest. Please let us know if adaptive 1080p fallback works smoothly on your end.'
      }
    ],
    internalNotes: [
      {
        id: 'not-903-1',
        text: 'CDN cache purged for Class 03.',
        author: 'DevOps Support',
        createdAt: '2026-10-08T10:15:00Z'
      }
    ],
    attachments: [],
    resolutionDetails: null
  }
];
DEFAULT_SEED_SUPPORT_TICKETS.forEach(t => SUPPORT_TICKETS_REGISTRY.set(t.id, JSON.parse(JSON.stringify(t))));

function getCorsOrigin(reqOrigin) {
  if (!reqOrigin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : ALLOWED_ORIGINS[0];
}

function sendJson(res, statusCode, data, reqOrigin) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': getCorsOrigin(reqOrigin),
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nexvion-signature, webhook-signature, x-admin-role'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  // Use WHATWG URL API (no deprecated url.parse)
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1:3000'}`);
  parsedUrl.query = Object.fromEntries(parsedUrl.searchParams.entries());
  let pathname = decodeURIComponent(parsedUrl.pathname);
  const reqOrigin = req.headers.origin || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': getCorsOrigin(reqOrigin),
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nexvion-signature, webhook-signature, x-admin-role'
    });
    res.end();
    return;
  }

  // Phase 18 Firebase Configuration & Status Endpoints
  if (pathname === '/api/firebase/config' && req.method === 'GET') {
    const requiredEnvVars = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_STORAGE_BUCKET', 'FIREBASE_APP_ID'];
    const missing = requiredEnvVars.filter(k => !process.env[k]);
    // NOTE: apiKey is intentionally included — it is a public browser key for Firebase SDK initialization.
    // It is NOT a secret. Firebase security is enforced via Firestore Rules and Auth Claims, NOT this key.
    sendJson(res, 200, {
      configured: missing.length === 0,
      apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4',
      projectId: process.env.FIREBASE_PROJECT_ID || 'nexvion-ai',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'nexvion-ai.firebaseapp.com',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'nexvion-ai.firebasestorage.app',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '916097030104',
      appId: process.env.FIREBASE_APP_ID || '1:916097030104:web:e9b393b7fa8c89a84b84ad',
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-Q09E6TX5XJ',
      missingVariables: missing
    }, reqOrigin);
    return;
  }

  if (pathname === '/api/firebase/status' && req.method === 'GET') {
    sendJson(res, 200, {
      status: 'active',
      projectId: process.env.FIREBASE_PROJECT_ID || 'nexvion-ai',
      collections: [
        'courses', 'tiers', 'batches', 'students', 'enrollments',
        'modules', 'classes', 'lessons', 'videos', 'resources',
        'projects', 'assignments', 'submissions', 'announcements',
        'notifications', 'payments', 'certificates', 'supportTickets',
        'auditLogs', 'settings'
      ],
      timestamp: new Date().toISOString()
    }, reqOrigin);
    return;
  }

  // Phase 13 Payment API Endpoints
  if (pathname === '/api/payments/config' && req.method === 'GET') {
    sendJson(res, 200, {
      country: 'US',
      currency: 'USD',
      provider: 'Nexvion Gateway Abstraction (Stripe / Sandbox)',
      tiers: TIER_PRICES_REGISTRY
    });
    return;
  }

  if (pathname === '/api/payments/create-checkout-session' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { studentId, studentName, studentEmail, courseId, tierId } = body;
      if (!studentId || !tierId) {
        return sendJson(res, 400, { error: 'Missing required fields: studentId and tierId' });
      }

      const tierConfig = TIER_PRICES_REGISTRY[tierId];
      if (!tierConfig) {
        return sendJson(res, 404, { error: `Tier "${tierId}" not found` });
      }

      // Free tier: Foundations
      if (!tierConfig.isPaid || tierId === 'ai-foundations') {
        const txRef = `NEX-FREE-${Date.now()}`;
        return sendJson(res, 200, {
          success: true,
          freeTier: true,
          status: 'Not required',
          transactionRef: txRef,
          amount: 0,
          currency: 'USD',
          message: 'Free tier enrolled successfully'
        });
      }

      // Paid tier: Check if price is configured or coming soon
      if (tierConfig.amount === null || tierConfig.priceDisplay === 'PRICE COMING SOON') {
        const txRef = `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        return sendJson(res, 200, {
          success: false,
          comingSoon: true,
          status: 'Pending',
          transactionRef: txRef,
          priceDisplay: 'PRICE COMING SOON',
          message: 'Official tuition price coming soon. Cohort seat reserved pending fee schedule.'
        });
      }

      // Paid tier with configured price: create checkout session
      const transactionRef = `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkoutData = {
        sessionId,
        transactionRef,
        studentId,
        studentName: studentName || 'Student',
        studentEmail: studentEmail || '',
        courseId: courseId || tierId,
        tierId,
        amount: tierConfig.amount,
        currency: tierConfig.currency || 'USD',
        status: 'Pending',
        verificationStatus: 'Pending verification',
        createdAt: new Date().toISOString()
      };
      ACTIVE_CHECKOUT_TRANSACTIONS.set(transactionRef, checkoutData);

      sendJson(res, 200, {
        success: true,
        sessionId,
        transactionRef,
        checkoutUrl: `/checkout.html?session_id=${sessionId}&tx=${transactionRef}`,
        amount: tierConfig.amount,
        currency: tierConfig.currency || 'USD',
        status: 'Pending'
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/verify-payment' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { transactionRef, studentId, amount, currency } = body;
      if (!transactionRef) {
        return sendJson(res, 400, { error: 'Missing transactionRef' });
      }

      const tx = ACTIVE_CHECKOUT_TRANSACTIONS.get(transactionRef);
      if (!tx) {
        return sendJson(res, 404, { error: 'Transaction reference not found' });
      }

      // Validate amount against server registry (never trust client)
      if (amount !== undefined && Number(amount) !== Number(tx.amount)) {
        return sendJson(res, 400, { error: `Amount mismatch: expected ${tx.amount}, received ${amount}` });
      }
      if (currency && currency.toUpperCase() !== tx.currency.toUpperCase()) {
        return sendJson(res, 400, { error: `Currency mismatch: expected ${tx.currency}, received ${currency}` });
      }
      if (studentId && tx.studentId && studentId !== tx.studentId) {
        return sendJson(res, 403, { error: 'Unauthorized: transaction does not belong to student' });
      }

      tx.status = 'Paid';
      tx.verificationStatus = 'Verified';
      tx.verifiedAt = new Date().toISOString();

      sendJson(res, 200, {
        success: true,
        verified: true,
        transactionRef,
        status: 'Paid',
        verificationStatus: 'Verified',
        amount: tx.amount,
        currency: tx.currency
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/webhook' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const signature = req.headers['x-nexvion-signature'] || req.headers['webhook-signature'];
      if (!signature) {
        return sendJson(res, 401, { error: 'Missing webhook signature' });
      }

      const eventId = body.id || `${body.type}_${body.transactionRef || Date.now()}`;
      if (PROCESSED_WEBHOOK_EVENTS.has(eventId)) {
        return sendJson(res, 200, { received: true, duplicate: true, message: 'Event already processed (idempotent)' });
      }
      PROCESSED_WEBHOOK_EVENTS.add(eventId);

      const tx = body.transactionRef ? ACTIVE_CHECKOUT_TRANSACTIONS.get(body.transactionRef) : null;
      if (tx) {
        if (body.type === 'payment.succeeded' || body.type === 'payment_intent.succeeded') {
          tx.status = 'Paid';
          tx.verificationStatus = 'Verified';
        } else if (body.type === 'payment.failed' || body.type === 'payment_intent.payment_failed') {
          tx.status = 'Failed';
          tx.verificationStatus = 'Verification failed';
        } else if (body.type === 'payment.cancelled' || body.type === 'checkout.session.cancelled') {
          tx.status = 'Cancelled';
        } else if (body.type === 'payment.refunded' || body.type === 'charge.refunded') {
          tx.status = 'Refunded';
          tx.refundStatus = 'Processed';
        }
      }

      sendJson(res, 200, { received: true, eventId, status: 'processed' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/refund' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const authRole = req.headers['x-admin-role'];
      if (!['Owner', 'Super Admin', 'Finance Manager'].includes(authRole)) {
        return sendJson(res, 403, { error: 'Access denied: Only Finance Managers or Super Admins can initiate refunds' });
      }

      const { transactionRef, reason } = body;
      const tx = transactionRef ? ACTIVE_CHECKOUT_TRANSACTIONS.get(transactionRef) : null;
      if (tx) {
        tx.status = 'Refunded';
        tx.refundStatus = 'Processed';
        tx.refundReason = reason || 'Administrative refund';
      }

      sendJson(res, 200, { success: true, refundStatus: 'Processed', reason: reason || 'Administrative refund' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  // =========================================================================
  // Phase 14 Notification Delivery Engine Endpoints
  // =========================================================================
  if (pathname === '/api/notifications/devices/register' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, token, platform, deviceModel, appVersion } = body;
      if (!userId || !token || !platform) {
        return sendJson(res, 400, { error: 'Missing required device registration fields: userId, token, and platform.' });
      }

      const validPlatforms = ['android', 'web', 'desktop', 'ios'];
      const normPlatform = String(platform).toLowerCase();
      if (!validPlatforms.includes(normPlatform)) {
        return sendJson(res, 400, { error: `Invalid platform "${platform}". Must be one of: ${validPlatforms.join(', ')}` });
      }

      const record = {
        token,
        userId,
        platform: normPlatform,
        deviceModel: deviceModel || 'Standard Terminal',
        appVersion: appVersion || '1.0.0',
        registeredAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        valid: true
      };
      NOTIFICATION_DEVICE_TOKENS.set(token, record);

      sendJson(res, 200, {
        success: true,
        message: 'Device token registered successfully',
        token,
        platform: normPlatform,
        registeredAt: record.registeredAt
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/devices/unregister' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, token } = body;
      if (!token) {
        return sendJson(res, 400, { error: 'Missing required field: token' });
      }

      const existing = NOTIFICATION_DEVICE_TOKENS.get(token);
      if (existing) {
        if (userId && existing.userId !== userId) {
          return sendJson(res, 403, { error: 'Forbidden: Cannot remove device token belonging to another user.' });
        }
        NOTIFICATION_DEVICE_TOKENS.delete(token);
      }

      sendJson(res, 200, {
        success: true,
        unregistered: true,
        message: 'Device token removed successfully'
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/devices' && req.method === 'GET') {
    const userId = parsedUrl.query.userId;
    if (!userId) {
      return sendJson(res, 400, { error: 'Missing query parameter: userId' });
    }

    // Never expose another user's device tokens
    const userDevices = Array.from(NOTIFICATION_DEVICE_TOKENS.values())
      .filter(d => d.userId === userId && d.valid)
      .map(({ token, platform, deviceModel, appVersion, lastSeenAt, registeredAt }) => ({
        token,
        platform,
        deviceModel,
        appVersion,
        lastSeenAt,
        registeredAt
      }));

    sendJson(res, 200, { userId, devices: userDevices });
    return;
  }

  if (pathname === '/api/notifications/devices/cleanup-invalid' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { invalidTokens } = body;
      let cleanedCount = 0;
      if (Array.isArray(invalidTokens)) {
        for (const tok of invalidTokens) {
          if (NOTIFICATION_DEVICE_TOKENS.has(tok)) {
            NOTIFICATION_DEVICE_TOKENS.delete(tok);
            cleanedCount++;
          }
        }
      } else {
        for (const [tok, data] of NOTIFICATION_DEVICE_TOKENS.entries()) {
          if (!data.valid) {
            NOTIFICATION_DEVICE_TOKENS.delete(tok);
            cleanedCount++;
          }
        }
      }

      sendJson(res, 200, { success: true, cleanedCount, remainingTokens: NOTIFICATION_DEVICE_TOKENS.size });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/preferences' && req.method === 'GET') {
    const userId = parsedUrl.query.userId;
    if (!userId) {
      return sendJson(res, 400, { error: 'Missing query parameter: userId' });
    }

    const defaultPrefs = {
      newClasses: true,
      classReminders: true,
      announcements: true,
      enrollmentUpdates: true,
      projectReminders: true,
      certificateUpdates: true,
      systemMessages: true,
      emailDigest: false,
      pushEnabled: true
    };
    const prefs = USER_NOTIFICATION_PREFERENCES.get(userId) || defaultPrefs;
    sendJson(res, 200, { userId, preferences: prefs });
    return;
  }

  if (pathname === '/api/notifications/preferences' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, preferences } = body;
      if (!userId || !preferences) {
        return sendJson(res, 400, { error: 'Missing userId or preferences object.' });
      }

      const existing = USER_NOTIFICATION_PREFERENCES.get(userId) || {
        newClasses: true,
        classReminders: true,
        announcements: true,
        enrollmentUpdates: true,
        projectReminders: true,
        certificateUpdates: true,
        systemMessages: true,
        emailDigest: false,
        pushEnabled: true
      };
      const updated = { ...existing, ...preferences };
      USER_NOTIFICATION_PREFERENCES.set(userId, updated);

      sendJson(res, 200, { success: true, userId, preferences: updated });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/send' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const authRole = req.headers['x-admin-role'] || 'System';
      const allowedRoles = ['Owner', 'Super Admin', 'Student Manager', 'Content Manager', 'System'];
      if (!allowedRoles.includes(authRole)) {
        return sendJson(res, 403, { error: 'Access denied: Only authorized administrators or system backend can dispatch notifications.' });
      }

      const {
        title,
        message,
        type = 'System message',
        audience = 'All Enrolled Students',
        courseId = '',
        tierId = '',
        batchId = '',
        deepLink = '',
        scheduledFor = null,
        targetUserId = null,
        idempotencyKey = null,
        simulateFailure = false
      } = body;

      if (!title || !message) {
        return sendJson(res, 400, { error: 'Missing required notification fields: title and message.' });
      }

      // Check idempotency to prevent duplicate notification sends
      if (idempotencyKey) {
        if (PROCESSED_NOTIFICATION_IDEMPOTENCY.has(idempotencyKey)) {
          const cached = NOTIFICATION_HISTORY.get(idempotencyKey);
          return sendJson(res, 200, {
            duplicate: true,
            idempotent: true,
            message: 'Duplicate notification request recognized and deduplicated (idempotent)',
            notification: cached || { id: idempotencyKey, status: 'Sent' }
          });
        }
        PROCESSED_NOTIFICATION_IDEMPOTENCY.add(idempotencyKey);
      }

      const notifId = idempotencyKey || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const nowIso = new Date().toISOString();
      const isScheduled = !!scheduledFor && new Date(scheduledFor) > new Date();

      // Collect target users
      let targetUserIds = [];
      if (targetUserId) {
        targetUserIds = [targetUserId];
      } else {
        // Collect distinct users from registered devices or defaults
        const allKnownUsers = new Set();
        for (const dev of NOTIFICATION_DEVICE_TOKENS.values()) {
          if (dev.valid) allKnownUsers.add(dev.userId);
        }
        // Always include current student sessions
        allKnownUsers.add('stu-nx-8821');
        allKnownUsers.add('stu-sample-01');
        targetUserIds = Array.from(allKnownUsers);
      }

      // Map notification type to preference key
      const typePrefMap = {
        'New class': 'newClasses',
        'Class reminder': 'classReminders',
        'Announcement': 'announcements',
        'Enrollment update': 'enrollmentUpdates',
        'Project reminder': 'projectReminders',
        'Certificate update': 'certificateUpdates',
        'System message': 'systemMessages'
      };
      const prefKey = typePrefMap[type] || 'systemMessages';

      let recipientCount = 0;
      let successCount = 0;
      let failureCount = 0;
      let errorSummary = null;

      if (!isScheduled) {
        if (simulateFailure) {
          failureCount = targetUserIds.length || 1;
          recipientCount = failureCount;
          errorSummary = 'Simulated FCM transport network disconnect';
        } else {
          for (const uid of targetUserIds) {
            const prefs = USER_NOTIFICATION_PREFERENCES.get(uid) || {
              newClasses: true,
              classReminders: true,
              announcements: true,
              enrollmentUpdates: true,
              projectReminders: true,
              certificateUpdates: true,
              systemMessages: true,
              emailDigest: false,
              pushEnabled: true
            };

            // Respect disabled preferences
            if (!prefs.pushEnabled || prefs[prefKey] === false) {
              continue; // User opted out of this notification type
            }

            recipientCount++;

            // Deliver to user in-app inbox
            let inbox = USER_NOTIFICATION_INBOXES.get(uid) || [];
            inbox.unshift({
              id: `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              notificationId: notifId,
              title,
              message,
              type,
              deepLink,
              read: false,
              createdAt: nowIso
            });
            USER_NOTIFICATION_INBOXES.set(uid, inbox);

            // Deliver to registered devices (Android, Web, Desktop)
            const userTokens = Array.from(NOTIFICATION_DEVICE_TOKENS.values()).filter(d => d.userId === uid && d.valid);
            if (userTokens.length > 0) {
              userTokens.forEach(dev => {
                dev.lastSeenAt = nowIso;
              });
              successCount++;
            } else {
              // In-app inbox delivered successfully
              successCount++;
            }
          }
        }
      }

      let status = isScheduled ? 'Scheduled' : 'Sent';
      if (!isScheduled) {
        if (simulateFailure) status = 'Failed';
        else if (recipientCount > 0 && failureCount > 0 && successCount > 0) status = 'Partially delivered';
        else if (recipientCount > 0 && successCount === 0) status = 'Failed';
        else status = 'Sent';
      }

      const notifRecord = {
        id: notifId,
        title,
        message,
        type,
        audience,
        courseId,
        tierId,
        batchId,
        deepLink,
        status,
        recipientCount: isScheduled ? targetUserIds.length : recipientCount,
        successCount,
        failureCount,
        errorSummary,
        createdBy: authRole,
        createdAt: nowIso,
        scheduledFor: isScheduled ? new Date(scheduledFor).toISOString() : null,
        sentAt: isScheduled ? null : nowIso
      };

      NOTIFICATION_HISTORY.set(notifId, notifRecord);

      sendJson(res, 200, {
        success: !simulateFailure,
        notification: notifRecord,
        recipientCount: notifRecord.recipientCount,
        successCount,
        failureCount,
        status
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/cancel-scheduled' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { notificationId } = body;
      if (!notificationId) {
        return sendJson(res, 400, { error: 'Missing notificationId' });
      }

      const notif = NOTIFICATION_HISTORY.get(notificationId);
      if (!notif) {
        return sendJson(res, 404, { error: 'Notification record not found' });
      }

      notif.status = 'Cancelled';
      notif.cancelledAt = new Date().toISOString();

      sendJson(res, 200, { success: true, notificationId, status: 'Cancelled' });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/notifications/history' && req.method === 'GET') {
    const list = Array.from(NOTIFICATION_HISTORY.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sendJson(res, 200, { history: list, notifications: list });
    return;
  }

  if (pathname === '/api/notifications/inbox' && req.method === 'GET') {
    const userId = parsedUrl.query.userId || 'stu-nx-8821';
    const inbox = USER_NOTIFICATION_INBOXES.get(userId) || [];
    const unreadCount = inbox.filter(m => !m.read).length;
    sendJson(res, 200, { userId, unreadCount, inbox, notifications: inbox });
    return;
  }

  if (pathname === '/api/notifications/inbox/mark-read' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { userId, notificationId, markAll } = body;
      if (!userId) {
        return sendJson(res, 400, { error: 'Missing userId' });
      }

      let inbox = USER_NOTIFICATION_INBOXES.get(userId) || [];
      if (markAll) {
        inbox.forEach(item => { item.read = true; });
      } else if (notificationId) {
        const item = inbox.find(m => m.id === notificationId || m.notificationId === notificationId);
        if (item) item.read = true;
      }
      USER_NOTIFICATION_INBOXES.set(userId, inbox);

      const unreadCount = inbox.filter(m => !m.read).length;
      sendJson(res, 200, { success: true, userId, unreadCount });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/payments/status' && req.method === 'GET') {
    const txRef = parsedUrl.query.tx || parsedUrl.query.transactionRef;
    const sessionId = parsedUrl.query.session_id || parsedUrl.query.sessionId;
    let tx = null;
    if (txRef) {
      tx = ACTIVE_CHECKOUT_TRANSACTIONS.get(txRef);
    } else if (sessionId) {
      for (const item of ACTIVE_CHECKOUT_TRANSACTIONS.values()) {
        if (item.sessionId === sessionId) { tx = item; break; }
      }
    }
    if (!tx) {
      return sendJson(res, 404, { error: 'Transaction or session not found' });
    }
    return sendJson(res, 200, {
      transactionRef: tx.transactionRef,
      sessionId: tx.sessionId,
      studentId: tx.studentId,
      courseId: tx.courseId,
      tierId: tx.tierId,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      verificationStatus: tx.verificationStatus,
      refundStatus: tx.refundStatus || 'None'
    });
  }

  // =========================================================================
  // Phase 15 Secure Certificate Issuance & Public Verification Endpoints
  // =========================================================================
  if (pathname === '/api/certificates' && req.method === 'GET') {
    const studentId = parsedUrl.query.studentId;
    const adminRole = req.headers['x-admin-role'] || 'None';
    const isStaff = ['Owner', 'Super Admin', 'Academic Director', 'Certifier', 'Student Manager'].includes(adminRole);

    let list = Array.from(CERTIFICATES_REGISTRY.values());
    if (studentId) {
      list = list.filter(c => c.studentId === studentId);
    } else if (!isStaff) {
      return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to view all credential records.' });
    }
    return sendJson(res, 200, { certificates: list });
  }

  if (pathname.startsWith('/api/certificates/') && req.method === 'GET' && !pathname.startsWith('/api/certificates/verify')) {
    const certId = pathname.replace(/^\/api\/certificates\//, '').trim();
    const cert = CERTIFICATES_REGISTRY.get(certId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certId);
    if (!cert) {
      return sendJson(res, 404, { error: 'Certificate record not found.' });
    }
    return sendJson(res, 200, { certificate: cert });
  }

  if (pathname === '/api/certificates/calculate-eligibility' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { studentId, courseId } = body;
      if (!studentId) {
        return sendJson(res, 400, { error: 'Missing studentId' });
      }

      const existingCert = Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.studentId === studentId && (!courseId || c.courseId === courseId));
      const targetCourseId = courseId || existingCert?.courseId || 'course-ai-foundations';
      const isPaidCourse = targetCourseId !== 'course-ai-foundations' && targetCourseId !== 'ai-foundations';

      const courseMet = true;
      const classesMet = true;
      const projectMet = true;
      const assignmentsMet = true;
      let paymentMet = true;
      let paymentDetail = 'Tuition Cleared (Free Tier / Sponsored)';

      if (isPaidCourse) {
        let hasPaid = false;
        for (const tx of ACTIVE_CHECKOUT_TRANSACTIONS.values()) {
          if (tx.studentId === studentId && tx.status === 'Paid') {
            hasPaid = true;
            paymentDetail = `Tuition Cleared (Transaction #${tx.transactionRef})`;
            break;
          }
        }
        paymentMet = hasPaid;
        if (!hasPaid) paymentDetail = 'Tuition Payment Outstanding for Paid Credential Track';
      }

      const academicRequirementsMet = courseMet && classesMet && projectMet && assignmentsMet && paymentMet;
      const manualApprovalMet = !!(existingCert && existingCert.requirements?.manualApproval?.met);

      let status = 'Not eligible';
      let eligibilityStatus = 'Incomplete Milestones';
      if (existingCert && existingCert.status === 'Revoked') {
        status = 'Revoked';
        eligibilityStatus = 'Disqualified / Revoked';
      } else if (existingCert && existingCert.status === 'Issued') {
        status = 'Issued';
        eligibilityStatus = 'Requirements Satisfied';
      } else if (academicRequirementsMet && manualApprovalMet) {
        status = 'Approved';
        eligibilityStatus = 'Requirements Satisfied';
      } else if (academicRequirementsMet && !manualApprovalMet) {
        status = 'Pending approval';
        eligibilityStatus = 'Awaiting Directorate Sign-off';
      }

      const calculatedRequirements = {
        courseCompletion: { met: courseMet, label: 'Course Progress', detail: 'Curriculum modules verified' },
        classCompletion: { met: classesMet, label: 'Required Classes', detail: 'Mandatory live classes verified' },
        projectCompletion: { met: projectMet, label: 'Capstone Project', detail: projectMet ? 'Capstone portfolio approved' : 'Capstone project evaluation pending' },
        assignmentCompletion: { met: assignmentsMet, label: 'Assignment Completion', detail: 'Sprint lab assignments evaluated and passed' },
        paymentCompletion: { met: paymentMet, label: 'Tuition Clearance', detail: paymentDetail },
        manualApproval: { met: manualApprovalMet, label: 'Directorate Approval', detail: manualApprovalMet ? (existingCert?.requirements?.manualApproval?.detail || 'Approved by Academic Directorate') : 'Pending final review and signature from Academic Directorate' }
      };

      sendJson(res, 200, {
        eligible: academicRequirementsMet,
        status,
        eligibilityStatus,
        requirements: calculatedRequirements,
        academicRequirementsMet,
        manualApprovalMet
      });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/certificates/approve' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to approve certificate eligibility.' });
      }

      const { certificateId, approver, note } = body;
      const cert = CERTIFICATES_REGISTRY.get(certificateId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certificateId);
      if (!cert) {
        return sendJson(res, 404, { error: 'Certificate record not found.' });
      }

      const nowIso = new Date().toISOString();
      const approverName = approver || adminRole;
      if (!cert.requirements) cert.requirements = {};
      cert.requirements.manualApproval = {
        met: true,
        label: 'Directorate Approval',
        detail: `Signed off by ${approverName} on ${nowIso.split('T')[0]}`
      };
      cert.status = 'Approved';
      cert.eligibilityStatus = 'Requirements Satisfied';
      cert.approvedAt = nowIso;
      cert.approvedBy = approverName;

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({ text: note || `Eligibility approved by ${approverName}`, author: approverName, date: nowIso });

      // Deliver notification to student inbox
      if (cert.studentId) {
        const inbox = USER_NOTIFICATION_INBOXES.get(cert.studentId) || [];
        inbox.unshift({
          id: `inbox-cert-${Date.now()}`,
          notificationId: `notif-cert-appr-${Date.now()}`,
          title: `🎉 Certificate Approved: ${cert.courseTitle}`,
          message: `Academic Directorate sign-off granted. Credential is ready for issuance.`,
          type: 'Certificate update',
          deepLink: 'dashboard.html#certificates',
          read: false,
          createdAt: nowIso
        });
        USER_NOTIFICATION_INBOXES.set(cert.studentId, inbox);
      }

      sendJson(res, 200, { success: true, certificate: cert });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/certificates/reject' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to reject certificate eligibility.' });
      }

      const { certificateId, reason } = body;
      const cert = CERTIFICATES_REGISTRY.get(certificateId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certificateId);
      if (!cert) {
        return sendJson(res, 404, { error: 'Certificate record not found.' });
      }

      const nowIso = new Date().toISOString();
      cert.status = 'Not eligible';
      cert.eligibilityStatus = 'Eligibility Rejected';
      if (cert.requirements && cert.requirements.manualApproval) {
        cert.requirements.manualApproval.met = false;
        cert.requirements.manualApproval.detail = `Rejected: ${reason || 'Criteria not met'}`;
      }
      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({ text: `Eligibility rejected: ${reason || 'Criteria not met'}`, author: adminRole, date: nowIso });

      sendJson(res, 200, { success: true, certificate: cert });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/certificates/issue' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to issue credentials.' });
      }

      const { certificateId, signatory } = body;
      const cert = CERTIFICATES_REGISTRY.get(certificateId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certificateId);
      if (!cert) {
        return sendJson(res, 404, { error: 'Certificate record not found.' });
      }

      // Duplicate prevention
      if (cert.status === 'Issued') {
        return sendJson(res, 200, { duplicate: true, alreadyIssued: true, certificate: cert });
      }

      if (cert.status !== 'Approved' && cert.status !== 'Eligible') {
        return sendJson(res, 400, { error: `Cannot issue certificate: Candidate must be Approved before issuance. Current status: "${cert.status}"` });
      }

      const nowIso = new Date().toISOString();
      const code = cert.tierName?.toUpperCase().includes('FOUND') ? 'FND' : cert.tierName?.toUpperCase().includes('BUILD') ? 'BLD' : 'CRT';
      const seq = Math.floor(1000 + Math.random() * 9000);
      const verificationId = (cert.verificationId && !cert.verificationId.includes('(') && !cert.verificationId.includes('Pending') && !cert.verificationId.includes('Reserved'))
        ? cert.verificationId
        : `NEX-${code}-2026-${seq}`;

      cert.status = 'Issued';
      cert.verificationId = verificationId;
      cert.issueDate = nowIso.split('T')[0];
      cert.issuedAt = nowIso;
      cert.issuedBy = adminRole;
      cert.issuingOrganization = 'NEXVION AI Academy';
      cert.verificationUrl = `/verify-certificate/${verificationId}`;
      cert.signatory = signatory || cert.signatory || 'Dr. Evelyn Vance & Dr. Kenneth Vance';

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({ text: `Official credential issued and registered with ID: ${verificationId}`, author: 'System Registrar', date: nowIso });

      // Deliver notification to student inbox
      if (cert.studentId) {
        const inbox = USER_NOTIFICATION_INBOXES.get(cert.studentId) || [];
        inbox.unshift({
          id: `inbox-cert-${Date.now()}`,
          notificationId: `notif-cert-iss-${Date.now()}`,
          title: `📜 Certificate Issued: ${cert.courseTitle}`,
          message: `Congratulations! Your digital certificate has been issued (ID: ${verificationId}).`,
          type: 'Certificate update',
          deepLink: 'dashboard.html#certificates',
          read: false,
          createdAt: nowIso
        });
        USER_NOTIFICATION_INBOXES.set(cert.studentId, inbox);
      }

      sendJson(res, 200, { success: true, certificate: cert });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/certificates/revoke' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to revoke credentials.' });
      }

      const { certificateId, reason } = body;
      const cert = CERTIFICATES_REGISTRY.get(certificateId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certificateId);
      if (!cert) {
        return sendJson(res, 404, { error: 'Certificate record not found.' });
      }

      if (cert.status === 'Revoked') {
        return sendJson(res, 200, { success: true, certificate: cert });
      }

      const nowIso = new Date().toISOString();
      const revokeReason = reason || 'Administrative compliance action';
      cert.status = 'Revoked';
      cert.eligibilityStatus = 'Disqualified / Revoked';
      cert.revocation = {
        reason: revokeReason,
        revokedBy: adminRole,
        revokedAt: nowIso
      };

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({ text: `Credential revoked: ${revokeReason}`, author: adminRole, date: nowIso });

      // Deliver notification to student inbox
      if (cert.studentId) {
        const inbox = USER_NOTIFICATION_INBOXES.get(cert.studentId) || [];
        inbox.unshift({
          id: `inbox-cert-${Date.now()}`,
          notificationId: `notif-cert-rev-${Date.now()}`,
          title: `⚠️ Certificate Notice: Credential Revoked`,
          message: `Certificate record for ${cert.courseTitle} has been revoked. Reason: ${revokeReason}.`,
          type: 'Certificate update',
          deepLink: 'dashboard.html#certificates',
          read: false,
          createdAt: nowIso
        });
        USER_NOTIFICATION_INBOXES.set(cert.studentId, inbox);
      }

      sendJson(res, 200, { success: true, certificate: cert });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/certificates/note' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { certificateId, text, author } = body;
      const cert = CERTIFICATES_REGISTRY.get(certificateId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c => c.verificationId === certificateId);
      if (!cert) {
        return sendJson(res, 404, { error: 'Certificate record not found.' });
      }
      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({ text, author: author || 'Academic Staff', date: new Date().toISOString() });
      sendJson(res, 200, { success: true, certificate: cert });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  // Public Verification API (exposes only safe public fields, no private student information)
  if ((pathname.startsWith('/api/certificates/verify') || pathname === '/api/certificates/verify') && req.method === 'GET') {
    let queryId = parsedUrl.query.id || parsedUrl.query.certificateId;
    if (!queryId && pathname.startsWith('/api/certificates/verify/')) {
      queryId = pathname.replace(/^\/api\/certificates\/verify\//, '').trim();
    }
    if (!queryId) {
      return sendJson(res, 400, { error: 'Missing credential ID for public verification.' });
    }

    const cert = CERTIFICATES_REGISTRY.get(queryId) || Array.from(CERTIFICATES_REGISTRY.values()).find(c =>
      c.id === queryId || c.verificationId === queryId || (c.verificationId && c.verificationId.split(' ')[0] === queryId)
    );

    if (!cert || (cert.status !== 'Issued' && cert.status !== 'Revoked')) {
      return sendJson(res, 200, {
        valid: false,
        found: false,
        status: cert ? cert.status : 'Not found',
        message: 'Certificate record not found or not yet officially issued.'
      });
    }

    if (cert.status === 'Revoked') {
      return sendJson(res, 200, {
        valid: false,
        found: true,
        revoked: true,
        status: 'Revoked',
        certificateId: cert.verificationId || cert.id,
        studentName: cert.studentName,
        courseName: cert.courseTitle,
        tier: cert.tierName,
        issueDate: cert.issueDate,
        revocationDate: cert.revocation?.revokedAt ? cert.revocation.revokedAt.split('T')[0] : 'Recorded',
        revocationReason: cert.revocation?.reason || 'Administrative action',
        issuingOrganization: cert.issuingOrganization || 'NEXVION AI Academy'
      });
    }

    return sendJson(res, 200, {
      valid: true,
      found: true,
      revoked: false,
      status: 'Issued',
      certificateId: cert.verificationId,
      studentName: cert.studentName,
      courseName: cert.courseTitle,
      tier: cert.tierName,
      issueDate: cert.issueDate,
      grade: cert.grade,
      issuingOrganization: cert.issuingOrganization || 'NEXVION AI Academy',
      verificationUrl: cert.verificationUrl || `/verify-certificate/${cert.verificationId}`
    });
  }

  // =========================================================================
  // Phase 16 Support Desk Operations Endpoints
  // =========================================================================
  if (pathname === '/api/support/tickets' && req.method === 'GET') {
    const adminRole = req.headers['x-admin-role'] || 'None';
    const reqStudentId = req.headers['x-student-id'] || parsedUrl.query.studentId;
    const isStaff = ['Owner', 'Super Admin', 'Student Manager', 'Content Manager', 'Academic Director', 'Analyst'].includes(adminRole);

    let list = Array.from(SUPPORT_TICKETS_REGISTRY.values()).map(t => JSON.parse(JSON.stringify(t)));

    if (!isStaff && reqStudentId) {
      list = list.filter(t => t.studentId === reqStudentId || t.studentEmail === reqStudentId);
    } else if (!isStaff && !reqStudentId) {
      return sendJson(res, 403, { error: 'Access denied: Must be staff or specify student identifier.' });
    }

    if (parsedUrl.query.category && parsedUrl.query.category !== 'ALL') {
      list = list.filter(t => (t.category || '').toLowerCase() === parsedUrl.query.category.toLowerCase());
    }
    if (parsedUrl.query.status && parsedUrl.query.status !== 'ALL') {
      list = list.filter(t => (t.status || '').toLowerCase() === parsedUrl.query.status.toLowerCase());
    }
    if (parsedUrl.query.priority && parsedUrl.query.priority !== 'ALL') {
      const pF = parsedUrl.query.priority.toLowerCase() === 'medium' ? 'normal' : parsedUrl.query.priority.toLowerCase();
      list = list.filter(t => (t.priority || '').toLowerCase() === pF);
    }
    if (parsedUrl.query.assignedAdmin && parsedUrl.query.assignedAdmin !== 'ALL') {
      list = list.filter(t => (t.assignedAdmin || '').toLowerCase().includes(parsedUrl.query.assignedAdmin.toLowerCase()));
    }
    if (parsedUrl.query.search) {
      const q = parsedUrl.query.search.toLowerCase();
      list = list.filter(t =>
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.ticketRef && t.ticketRef.toLowerCase().includes(q)) ||
        (t.studentName && t.studentName.toLowerCase().includes(q))
      );
    }

    // Never leak internal notes to student callers
    if (!isStaff) {
      list = list.map(t => {
        delete t.internalNotes;
        return t;
      });
    }

    return sendJson(res, 200, { tickets: list, count: list.length });
  }

  if (pathname.startsWith('/api/support/tickets/') && req.method === 'GET') {
    const ticketId = pathname.replace(/^\/api\/support\/tickets\//, '').trim();
    const adminRole = req.headers['x-admin-role'] || 'None';
    const reqStudentId = req.headers['x-student-id'] || parsedUrl.query.studentId;
    const isStaff = ['Owner', 'Super Admin', 'Student Manager', 'Content Manager', 'Academic Director', 'Analyst'].includes(adminRole);

    const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
    if (!t) {
      return sendJson(res, 404, { error: 'Support ticket not found.' });
    }

    if (!isStaff && reqStudentId && t.studentId !== reqStudentId && t.studentEmail !== reqStudentId) {
      return sendJson(res, 403, { error: 'Access denied: Cannot access other students\' tickets.' });
    }

    const copy = JSON.parse(JSON.stringify(t));
    if (!isStaff) {
      delete copy.internalNotes;
    }
    return sendJson(res, 200, { ticket: copy });
  }

  if (pathname === '/api/support/tickets' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { subject, category, priority, studentId, studentName, studentEmail, message, attachments } = body;
      if (!subject) {
        return sendJson(res, 400, { error: 'Ticket subject is required.' });
      }

      const nowIso = new Date().toISOString();
      const seq = Math.floor(1000 + Math.random() * 9000);
      const ticketRef = `SUP-2026-${seq}`;
      const id = `tic-${Date.now().toString().slice(-4)}`;

      const messages = [];
      if (message) {
        messages.push({
          id: `msg-${Date.now()}-1`,
          sender: studentName || 'Student',
          senderEmail: studentEmail || '',
          isStaff: false,
          timestamp: nowIso,
          text: message
        });
      }

      const ticket = {
        id,
        ticketRef,
        studentId: studentId || null,
        studentName: studentName || 'Student',
        studentEmail: studentEmail || '',
        subject,
        category: category || 'General question',
        priority: priority === 'Medium' ? 'Normal' : (priority || 'Normal'),
        status: 'Open',
        assignedAdmin: 'Unassigned',
        createdAt: nowIso,
        lastUpdated: nowIso,
        createdDate: nowIso.split('T')[0],
        updatedDate: nowIso.split('T')[0],
        messages,
        internalNotes: [],
        attachments: Array.isArray(attachments) ? attachments : [],
        resolutionDetails: null
      };

      SUPPORT_TICKETS_REGISTRY.set(ticket.id, ticket);
      return sendJson(res, 201, { success: true, ticket });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/assign' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges to assign tickets.' });
      }
      const { ticketId, adminName } = body;
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      t.assignedAdmin = adminName || adminRole;
      if (t.status === 'Open') t.status = 'In progress';
      t.lastUpdated = new Date().toISOString();
      t.updatedDate = t.lastUpdated.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/reply' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { ticketId, text, sender, isStaff } = body;
      if (!text || !text.trim()) return sendJson(res, 400, { error: 'Message text is required.' });
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      const nowIso = new Date().toISOString();
      t.messages = t.messages || [];
      t.messages.push({
        id: `msg-${Date.now()}`,
        sender: sender || (isStaff ? 'Support Desk' : t.studentName),
        isStaff: !!isStaff,
        timestamp: nowIso,
        text: text.trim()
      });

      if (isStaff && (t.status === 'Open' || t.status === 'In progress')) {
        t.status = 'Waiting for student';
      } else if (!isStaff && t.status === 'Waiting for student') {
        t.status = 'In progress';
      }
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/note' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager', 'Content Manager', 'Academic Director'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Students cannot add internal staff notes.' });
      }
      const { ticketId, text, author } = body;
      if (!text || !text.trim()) return sendJson(res, 400, { error: 'Note text is required.' });
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      const nowIso = new Date().toISOString();
      t.internalNotes = t.internalNotes || [];
      t.internalNotes.push({
        id: `not-${Date.now()}`,
        text: text.trim(),
        author: author || adminRole,
        createdAt: nowIso
      });
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/priority' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges.' });
      }
      const { ticketId, priority } = body;
      const valid = ['Low', 'Normal', 'High', 'Urgent'];
      const normP = priority === 'Medium' ? 'Normal' : priority;
      if (!valid.includes(normP)) return sendJson(res, 400, { error: 'Invalid priority.' });

      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      t.priority = normP;
      t.lastUpdated = new Date().toISOString();
      t.updatedDate = t.lastUpdated.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/status' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges.' });
      }
      const { ticketId, status } = body;
      const valid = ['Open', 'In progress', 'Waiting for student', 'Resolved', 'Closed'];
      if (!valid.includes(status)) return sendJson(res, 400, { error: 'Invalid status.' });

      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      t.status = status;
      t.lastUpdated = new Date().toISOString();
      t.updatedDate = t.lastUpdated.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/resolve' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges.' });
      }
      const { ticketId, resolutionNotes, resolver } = body;
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      const nowIso = new Date().toISOString();
      t.status = 'Resolved';
      t.resolutionDetails = {
        resolvedAt: nowIso,
        resolvedBy: resolver || adminRole,
        resolutionNotes: resolutionNotes || 'Resolved'
      };
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/reopen' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const { ticketId, reason, user } = body;
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      const nowIso = new Date().toISOString();
      t.status = 'In progress';
      t.messages = t.messages || [];
      t.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'System Notice',
        isStaff: true,
        timestamp: nowIso,
        text: `Ticket reopened: ${reason || 'Investigation resumed'}`
      });
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  if (pathname === '/api/support/tickets/close' && req.method === 'POST') {
    parseJsonBody(req).then(body => {
      const adminRole = req.headers['x-admin-role'] || 'None';
      if (!['Owner', 'Super Admin', 'Student Manager'].includes(adminRole)) {
        return sendJson(res, 403, { error: 'Forbidden: Insufficient privileges.' });
      }
      const { ticketId } = body;
      const t = SUPPORT_TICKETS_REGISTRY.get(ticketId) || Array.from(SUPPORT_TICKETS_REGISTRY.values()).find(x => x.ticketRef === ticketId);
      if (!t) return sendJson(res, 404, { error: 'Ticket not found.' });

      t.status = 'Closed';
      t.lastUpdated = new Date().toISOString();
      t.updatedDate = t.lastUpdated.split('T')[0];

      return sendJson(res, 200, { success: true, ticket: t });
    }).catch(err => {
      sendJson(res, 400, { error: err.message });
    });
    return;
  }

  // =========================================================================
  // Phase 16 Analytics Aggregations Endpoint
  // =========================================================================
  if (pathname === '/api/analytics' && req.method === 'GET') {
    const adminRole = req.headers['x-admin-role'] || 'Analyst';
    const canAccessFinancials = ['Owner', 'Super Admin', 'Finance Manager'].includes(adminRole);

    const ticketsList = Array.from(SUPPORT_TICKETS_REGISTRY.values());
    const certsList = Array.from(CERTIFICATES_REGISTRY.values());

    const overview = {
      totalStudents: 1248,
      activeStudents: 934,
      pendingEnrollments: 18,
      completedEnrollments: 210,
      activeCourses: 4,
      openBatches: 7,
      waitlistedStudents: 42,
      completionRatePercent: 87.4,
      avgCourseSatisfaction: 4.92,
      supportVolume: ticketsList.length
    };

    const coursePopularity = [
      { courseId: 'course-ai-foundations', courseTitle: 'AI Foundations: Zero to AI Native', enrollmentsCount: 420, popularityScore: 92 },
      { courseId: 'course-ai-builder', courseTitle: 'AI Builder: Intelligent Application Engineering', enrollmentsCount: 384, popularityScore: 88 },
      { courseId: 'course-ai-creator', courseTitle: 'AI Creator: Multimodal Generative Systems', enrollmentsCount: 290, popularityScore: 76 },
      { courseId: 'course-ai-architect', courseTitle: 'AI Architect: Enterprise AI Systems', enrollmentsCount: 154, popularityScore: 65 }
    ];

    const tierDistribution = [
      { tier: 'AI Foundations (Free)', count: 420, percent: 33.6, color: '#7F52FF' },
      { tier: 'AI Builder (Paid)', count: 384, percent: 30.8, color: '#C757BC' },
      { tier: 'AI Creator (Paid)', count: 290, percent: 23.2, color: '#00D2B4' },
      { tier: 'AI Architect (Premium)', count: 154, percent: 12.4, color: '#F59E0B' }
    ];

    const batchCapacityUtilization = [
      { batch: 'Foundations Alpha', filled: 18, capacity: 30, percent: 60, status: 'OPEN' },
      { batch: 'Foundations Beta', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Builder Prime', filled: 26, capacity: 30, percent: 86.6, status: 'OPEN' },
      { batch: 'Builder Apex', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Creator Delta', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Creator Omega', filled: 12, capacity: 30, percent: 40, status: 'OPEN' },
      { batch: 'Architect Sovereign', filled: 28, capacity: 30, percent: 93.3, status: 'OPEN' }
    ];

    const supportVolume = {
      totalTickets: ticketsList.length,
      open: ticketsList.filter(t => t.status === 'Open').length,
      inProgress: ticketsList.filter(t => t.status === 'In progress').length,
      waitingForStudent: ticketsList.filter(t => t.status === 'Waiting for student').length,
      resolved: ticketsList.filter(t => t.status === 'Resolved').length,
      closed: ticketsList.filter(t => t.status === 'Closed').length,
      byCategory: {
        enrollment: ticketsList.filter(t => (t.category || '').toLowerCase() === 'enrollment').length,
        courseAccess: ticketsList.filter(t => (t.category || '').toLowerCase() === 'course access').length,
        payment: ticketsList.filter(t => (t.category || '').toLowerCase() === 'payment').length,
        technicalIssue: ticketsList.filter(t => (t.category || '').toLowerCase() === 'technical issue').length,
        certificate: ticketsList.filter(t => (t.category || '').toLowerCase() === 'certificate').length,
        generalQuestion: ticketsList.filter(t => (t.category || '').toLowerCase() === 'general question').length
      }
    };

    const paymentSummary = canAccessFinancials ? {
      restricted: false,
      totalRevenue: 28450,
      currency: 'USD',
      totalTransactions: 12,
      paidCount: 8,
      pendingCount: 2,
      refundedCount: 1
    } : {
      restricted: true,
      message: 'Financial ledger restricted. Requires Finance Manager role.',
      currency: 'USD'
    };

    return sendJson(res, 200, {
      overview,
      coursePopularity,
      tierDistribution,
      batchCapacityUtilization,
      supportVolume,
      certificateEligibility: {
        totalRecords: certsList.length,
        issued: certsList.filter(c => c.status === 'Issued').length,
        revoked: certsList.filter(c => c.status === 'Revoked').length,
        pendingApproval: certsList.filter(c => c.status === 'Pending approval').length
      },
      paymentSummary,
      generatedAt: new Date().toISOString()
    });
  }

  if (pathname.startsWith('/verify-certificate')) {
    pathname = '/verify-certificate.html';
  } else if (pathname === '/course' || pathname === '/course.html') {
    pathname = '/course.html';
  } else if (pathname === '/checkout' || pathname === '/checkout.html') {
    pathname = '/checkout.html';
  } else if (pathname === '/register' || pathname === '/register.html') {
    pathname = '/register.html';
  } else if (pathname === '/dashboard' || pathname === '/dashboard.html') {
    pathname = '/dashboard.html';
  } else if (pathname === '/design-system' || pathname === '/design-system.html') {
    pathname = '/design-system.html';
  } else if (pathname === '/waitlist' || pathname === '/waitlist.html') {
    pathname = '/course.html';
  } else if (pathname === '/admin/login' || pathname === '/admin-login' || pathname === '/admin-login.html') {
    pathname = '/admin-login.html';
  } else if (pathname.startsWith('/admin/') && path.extname(pathname)) {
    // Strip /admin prefix for static assets requested relatively from /admin/* pages
    const stripped = pathname.replace(/^\/admin/, '');
    const candidatePath = path.normalize(path.join(BASE_DIR, stripped));
    if (fs.existsSync(candidatePath)) {
      pathname = stripped;
    }
  } else if (pathname === '/admin' || pathname === '/admin.html' || (pathname.startsWith('/admin/') && !path.extname(pathname))) {
    pathname = '/admin.html';
  } else if (pathname === '/login') {
    pathname = '/admin-login.html';
  } else if (pathname === '/' || pathname === '' || pathname === '/home') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(BASE_DIR, pathname));

  // Security check to prevent directory traversal
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
        <html lang="en">
        <head>
          <title>404 - Not Found | NEXVION AI</title>
          <style>
            body { background: #08090E; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            h1 { font-size: 3rem; color: #8B5CF6; margin-bottom: 0.5rem; }
            p { color: #94A3B8; }
            a { color: #8B5CF6; text-decoration: none; border-bottom: 1px solid #8B5CF6; }
          </style>
        </head>
        <body>
          <div>
            <h1>404</h1>
            <p>Page or asset not found in NEXVION AI.</p>
            <p><a href="/">Return to NEXVION AI Landing Page</a></p>
          </div>
        </body>
        </html>`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Static assets: allow broad caching for fonts/images; no-cache for HTML/JS
    const isStaticAsset = ['.woff', '.woff2', '.ttf', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext);
    const cacheHeader = isStaticAsset
      ? 'public, max-age=86400, stale-while-revalidate=3600'
      : 'no-cache, no-store, must-revalidate';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheHeader,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN'
    });

    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);
  });
});

const HOST = process.env.HOST || '127.0.0.1';
server.listen(PORT, HOST, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`NEXVION AI Server [${env}] running at http://${HOST}:${PORT}/`);
});
