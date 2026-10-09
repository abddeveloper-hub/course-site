const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(200);
  }
  throw new Error('Could not connect to Chrome debugging port');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.events = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        } else if (msg.method) {
          const listeners = this.events.get(msg.method) || [];
          listeners.forEach(fn => fn(msg.params));
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, fn) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(fn);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runPhase9Tests() {
  console.log('=================================================================');
  console.log('--- STARTING PHASE 9: FULL QUALITY ASSURANCE & HARDENING SUITE ---');
  console.log('=================================================================');

  const tmpDir = path.join(require('os').tmpdir(), 'chrome-test-p9-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  const consoleErrors = [];

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('Connected to Chrome DevTools Protocol at:', wsUrl);

    // Create a new target page
    const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://127.0.0.1:3000/admin/overview`, { method: 'PUT' });
    const target = await targetRes.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = params.args.map(a => a.value || a.description || '').join(' ');
        console.error(' [BROWSER ERROR]:', text);
        consoleErrors.push(text);
      }
    });

    cdp.on('Runtime.exceptionThrown', (params) => {
      const text = params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'Uncaught error';
      console.error(' [EXCEPTION]:', text);
      consoleErrors.push(text);
    });

    async function evaluate(expression) {
      const res = await cdp.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
      }
      return res.result?.value;
    }

    async function navigate(urlPath) {
      await evaluate(`window.NexvionAdminApp.navigateTo("${urlPath}")`);
      await sleep(200);
    }

    // Wait for App to be ready
    for (let i = 0; i < 60; i++) {
      const isReady = await evaluate(`typeof window.NexvionAdminApp !== 'undefined'`).catch(() => false);
      if (isReady) {
        console.log(`✓ NexvionAdminApp initialized in ${i * 200}ms`);
        break;
      }
      await sleep(200);
    }

    // =========================================================================
    // SECTION 1: VERIFY ALL 25 ADMIN ROUTES
    // =========================================================================
    console.log('\n--- SECTION 1: COMPLETE 25-ROUTE VERIFICATION ---');

    const ALL_ADMIN_ROUTES = [
      { path: '/admin', expectedTitleFragment: 'Operations' },
      { path: '/admin/overview', expectedTitleFragment: 'Overview' },
      { path: '/admin/courses', expectedTitleFragment: 'Courses' },
      { path: '/admin/tiers', expectedTitleFragment: 'Tiers' },
      { path: '/admin/batches', expectedTitleFragment: 'Batches' },
      { path: '/admin/students', expectedTitleFragment: 'Students' },
      { path: '/admin/enrollments', expectedTitleFragment: 'Enrollments' },
      { path: '/admin/classes', expectedTitleFragment: 'Classes' },
      { path: '/admin/modules', expectedTitleFragment: 'Modules' },
      { path: '/admin/lessons', expectedTitleFragment: 'Lessons' },
      { path: '/admin/videos', expectedTitleFragment: 'Videos' },
      { path: '/admin/resources', expectedTitleFragment: 'Resources' },
      { path: '/admin/projects', expectedTitleFragment: 'Projects' },
      { path: '/admin/assignments', expectedTitleFragment: 'Assignments' },
      { path: '/admin/submissions', expectedTitleFragment: 'Submissions' },
      { path: '/admin/announcements', expectedTitleFragment: 'Announcements' },
      { path: '/admin/notifications', expectedTitleFragment: 'Notifications' },
      { path: '/admin/payments', expectedTitleFragment: 'Payments' },
      { path: '/admin/certificates', expectedTitleFragment: 'Certificates' },
      { path: '/admin/support', expectedTitleFragment: 'Support' },
      { path: '/admin/analytics', expectedTitleFragment: 'Analytics' },
      { path: '/admin/admins', expectedTitleFragment: 'Administrative Personnel' },
      { path: '/admin/roles', expectedTitleFragment: 'Roles & Permissions' },
      { path: '/admin/audit-logs', expectedTitleFragment: 'Audit Logs' },
      { path: '/admin/settings', expectedTitleFragment: 'Settings' }
    ];

    let verifiedRoutesCount = 0;
    for (const r of ALL_ADMIN_ROUTES) {
      await navigate(r.path);
      const hostHtml = await evaluate(`document.getElementById('admContentHost')?.innerHTML || ''`);
      const hasContent = hostHtml.length > 50 && !hostHtml.includes('Loading NEXVION AI Telemetry...');
      const breadcrumb = await evaluate(`document.getElementById('breadcrumbCurrent')?.textContent || ''`);
      
      if (!hasContent) {
        throw new Error(`Route ${r.path} failed to render content into host.`);
      }
      verifiedRoutesCount++;
      console.log(`  ✓ Route: ${r.path.padEnd(24)} | Breadcrumb: ${breadcrumb.padEnd(16)} | Content OK`);
    }
    console.log(`✓ All ${verifiedRoutesCount} admin routes verified and rendered cleanly.`);

    // =========================================================================
    // SECTION 2: PUBLIC-PAGE REGRESSION CHECKS
    // =========================================================================
    console.log('\n--- SECTION 2: PUBLIC PAGES REGRESSION CHECK ---');
    const PUBLIC_PAGES = [
      'http://127.0.0.1:3000/',
      'http://127.0.0.1:3000/course',
      'http://127.0.0.1:3000/register',
      'http://127.0.0.1:3000/dashboard',
      'http://127.0.0.1:3000/design-system'
    ];

    for (const url of PUBLIC_PAGES) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Public page ${url} returned HTTP ${res.status}`);
      const text = await res.text();
      if (!text.includes('<!DOCTYPE html>') && !text.includes('<html')) {
        throw new Error(`Public page ${url} did not return valid HTML`);
      }
      console.log(`  ✓ Public Page: ${url.padEnd(36)} -> HTTP ${res.status} OK (${text.length} bytes)`);
    }

    // =========================================================================
    // SECTION 3: RESPONSIVE VIEWPORT TESTING
    // =========================================================================
    console.log('\n--- SECTION 3: RESPONSIVE VIEWPORT TESTING ---');
    const VIEWPORTS = [1440, 1280, 1024, 768, 480, 375];

    for (const width of VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 800,
        deviceScaleFactor: 1,
        mobile: width <= 768
      });
      await sleep(150);

      // Test across overview and table pages
      await navigate('/admin/overview');
      const docScrollWidth = await evaluate(`document.documentElement.scrollWidth`);
      const winInnerWidth = await evaluate(`window.innerWidth`);
      const hasHorizontalOverflow = docScrollWidth > winInnerWidth;

      if (hasHorizontalOverflow) {
        throw new Error(`Horizontal scroll overflow detected at viewport ${width}px (scrollWidth: ${docScrollWidth}, innerWidth: ${winInnerWidth})`);
      }

      await navigate('/admin/students');
      const tableScrollWidth = await evaluate(`document.documentElement.scrollWidth`);
      if (tableScrollWidth > winInnerWidth) {
        throw new Error(`Table caused horizontal document scroll at viewport ${width}px`);
      }

      console.log(`  ✓ Viewport ${width}px: Document bounds clean, no horizontal document scroll.`);
    }

    // Reset viewport back to desktop
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(150);

    // =========================================================================
    // SECTION 4: ACCESSIBILITY CHECKS
    // =========================================================================
    console.log('\n--- SECTION 4: ACCESSIBILITY & INCLUSION VERIFICATION ---');
    await navigate('/admin/overview');

    // Check Skip Link
    const skipLinkText = await evaluate(`document.querySelector('.adm-skip-link')?.textContent`);
    const skipLinkHref = await evaluate(`document.querySelector('.adm-skip-link')?.getAttribute('href')`);
    console.log(`  ✓ Skip-to-content link: "${skipLinkText}" -> Target: ${skipLinkHref}`);
    if (!skipLinkText || skipLinkHref !== '#admContentHost') {
      throw new Error('Accessible skip link missing or misconfigured');
    }

    // Check Reduced Motion CSS Support
    const hasReducedMotionCss = await evaluate(`
      Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => rule.conditionText && rule.conditionText.includes('prefers-reduced-motion'));
        } catch(e) { return false; }
      })
    `);
    console.log(`  ✓ Reduced-motion media query active in stylesheets: ${hasReducedMotionCss}`);
    if (!hasReducedMotionCss) throw new Error('prefers-reduced-motion CSS rule missing in stylesheets');

    // Check Focus Visible definition
    const hasFocusVisibleCss = await evaluate(`
      Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => rule.selectorText && rule.selectorText.includes(':focus-visible'));
        } catch(e) { return false; }
      })
    `);
    console.log(`  ✓ :focus-visible universal outline ring active: ${hasFocusVisibleCss}`);
    if (!hasFocusVisibleCss) throw new Error(':focus-visible styling rule missing');

    // Check Semantic Headings on View
    const h1Count = await evaluate(`document.querySelectorAll('h1').length`);
    console.log(`  ✓ Proper semantic single H1 per view: ${h1Count === 1 ? 'Yes' : 'Count: ' + h1Count}`);

    // Check ARIA Attributes on interactive elements
    const ariaChecks = await evaluate(`({
      sidebarNav: document.querySelector('aside.adm-sidebar')?.getAttribute('aria-label'),
      modalDialog: document.getElementById('admModalBackdrop')?.getAttribute('role'),
      drawerDialog: document.getElementById('admDrawerBackdrop')?.getAttribute('role'),
      toastAlert: document.getElementById('admToastContainer')?.getAttribute('aria-live')
    })`);
    console.log('  ✓ ARIA Landmarks verified:', ariaChecks);
    if (!ariaChecks.sidebarNav || ariaChecks.modalDialog !== 'dialog' || ariaChecks.toastAlert !== 'polite') {
      throw new Error('ARIA landmarks missing or invalid');
    }

    // =========================================================================
    // SECTION 5: DATA ARCHITECTURE & REPOSITORY LAYER AUDIT
    // =========================================================================
    console.log('\n--- SECTION 5: DATA ARCHITECTURE & REPOSITORY LAYER AUDIT ---');
    const repoMethods = await evaluate(`
      ['courseRepository', 'tierRepository', 'batchRepository', 'studentRepository',
       'enrollmentRepository', 'contentRepository', 'projectRepository', 'announcementsRepository',
       'notificationRepository', 'paymentRepository', 'certificateRepository', 'supportRepository',
       'analyticsRepository', 'adminRepository', 'roleRepository', 'auditRepository', 'settingsRepository']
      .every(repo => typeof NexvionServices[repo] === 'object')
    `);
    console.log(`  ✓ All 17 centralized repositories operational on NexvionServices: ${repoMethods}`);
    if (!repoMethods) throw new Error('Repository layer incomplete');

    // Strict 30 Batch Invariant Test
    const invariantTest = await evaluate(`
      (async () => {
        try {
          await NexvionServices.saveSettings({ batchRules: { maxBatchCapacity: 31 } });
          return 'FAILED_TO_REJECT';
        } catch (e) {
          return 'REJECTED_SUCCESSFULLY';
        }
      })()
    `);
    console.log(`  ✓ Strict batch capacity 30 invariant rejected overflow (31): ${invariantTest}`);
    if (invariantTest !== 'REJECTED_SUCCESSFULLY') throw new Error('Repository invariant failed');

    // =========================================================================
    // SECTION 6: CONSOLE ERROR AUDIT
    // =========================================================================
    console.log('\n--- SECTION 6: CONSOLE ERROR AUDIT ---');
    console.log(`Total detected console errors across all tests: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console errors:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} console errors`);
    }
    console.log('✓ ZERO CONSOLE ERRORS CONFIRMED');

    console.log('\n=================================================================');
    console.log(' ALL PHASE 9 QUALITY ASSURANCE & HARDENING CHECKS PASSED (100%)');
    console.log('=================================================================');

    cdp.close();
  } finally {
    chromeProcess.kill();
  }
}

runPhase9Tests().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
