const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': '*',
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
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nexvion-signature, webhook-signature, x-admin-role'
    });
    res.end();
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

  if (pathname === '/course' || pathname === '/course.html') {
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
    pathname = '/index.html';
  } else if (pathname === '/' || pathname === '') {
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

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`NEXVION AI Server running at http://127.0.0.1:${PORT}/`);
});
