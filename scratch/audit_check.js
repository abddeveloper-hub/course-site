const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'course.html',
  'checkout.html',
  'register.html',
  'dashboard.html',
  'verify-certificate.html',
  'admin.html',
  'admin-login.html',
  'design-system.html'
];

let issues = [];

htmlFiles.forEach(htmlFile => {
  if (!fs.existsSync(htmlFile)) {
    issues.push(`HTML file does not exist: ${htmlFile}`);
    return;
  }
  const content = fs.readFileSync(htmlFile, 'utf8');

  // Check CSS links
  const linkMatches = content.matchAll(/<link[^>]+href=["']([^"']+)["']/gi);
  for (const m of linkMatches) {
    const rawHref = m[1];
    const href = rawHref.split('?')[0].split('#')[0];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;
    const localPath = href.startsWith('/') ? href.slice(1) : href;
    if (!fs.existsSync(localPath)) {
      issues.push(`[${htmlFile}] Missing stylesheet: ${rawHref}`);
    }
  }

  // Check script tags
  const scriptMatches = content.matchAll(/<script[^>]+src=["']([^"']+)["']/gi);
  for (const m of scriptMatches) {
    const rawSrc = m[1];
    const src = rawSrc.split('?')[0].split('#')[0];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) continue;
    const localPath = src.startsWith('/') ? src.slice(1) : src;
    if (!fs.existsSync(localPath)) {
      issues.push(`[${htmlFile}] Missing script: ${rawSrc}`);
    }
  }

  // Check img tags
  const imgMatches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const m of imgMatches) {
    const rawSrc = m[1];
    const src = rawSrc.split('?')[0].split('#')[0];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) continue;
    const localPath = src.startsWith('/') ? src.slice(1) : src;
    if (!fs.existsSync(localPath)) {
      issues.push(`[${htmlFile}] Missing image: ${rawSrc}`);
    }
  }
});

console.log('--- HTML Asset & Link Inspection Results ---');
if (issues.length === 0) {
  console.log('✅ ALL HTML pages have 100% valid links, scripts, and image references!');
} else {
  console.log(`Found ${issues.length} potential issues:`);
  issues.forEach(i => console.warn('  ⚠️ ' + i));
}

// Check CSS files for broken asset urls
const cssFiles = ['css/style.css', 'css/admin.css', 'css/motion.css', 'css/synthetic-systems.css'];
let cssIssues = [];

cssFiles.forEach(cssFile => {
  if (!fs.existsSync(cssFile)) {
    cssIssues.push(`CSS file does not exist: ${cssFile}`);
    return;
  }
  const content = fs.readFileSync(cssFile, 'utf8');
  const urlMatches = content.matchAll(/url\(["']?([^"')]+)["']?\)/gi);
  for (const m of urlMatches) {
    const rawUrl = m[1];
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('//')) continue;
    const cleanUrl = rawUrl.split('?')[0].split('#')[0];
    const resolvedPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : path.join(path.dirname(cssFile), cleanUrl);
    if (!fs.existsSync(resolvedPath)) {
      cssIssues.push(`[${cssFile}] Broken asset url: ${rawUrl} -> resolved: ${resolvedPath}`);
    }
  }
});

console.log('\n--- CSS Asset URL Inspection Results ---');
if (cssIssues.length === 0) {
  console.log('✅ ALL CSS files have 100% valid url() references!');
} else {
  console.log(`Found ${cssIssues.length} potential issues:`);
  cssIssues.forEach(i => console.warn('  ⚠️ ' + i));
}

// HTTP Route Verification
async function verifyRoutes() {
  const http = require('http');
  const PORT = 3098;
  process.env.PORT = PORT;
  process.env.HOST = '127.0.0.1';

  const serverProc = require('child_process').fork(path.join(__dirname, '../server.js'), [], {
    env: { ...process.env, PORT: String(PORT) },
    silent: true
  });

  await new Promise(r => setTimeout(r, 1200));

  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${PORT}${urlPath}`, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }).on('error', reject);
    });
  }

  const routes = [
    { path: '/', expectStatus: 200, contains: 'NEXVION AI' },
    { path: '/home', expectStatus: 200, contains: 'NEXVION AI' },
    { path: '/course', expectStatus: 200, contains: 'Curriculum' },
    { path: '/checkout', expectStatus: 200, contains: 'Checkout' },
    { path: '/register', expectStatus: 200, contains: 'Registration' },
    { path: '/dashboard', expectStatus: 200, contains: 'Compiler Workbench' },
    { path: '/verify-certificate/NEX-FND-2026-0042', expectStatus: 200, contains: 'Certificate Verification' },
    { path: '/design-system', expectStatus: 200, contains: 'Design System' },
    { path: '/admin', expectStatus: 200, contains: 'Admin Operations' },
    { path: '/admin/overview', expectStatus: 200, contains: 'Admin Operations' },
    { path: '/admin/login', expectStatus: 200, contains: 'Sign in to continue' },
    { path: '/login', expectStatus: 200, contains: 'Sign in to continue' },
    { path: '/api/firebase/config', expectStatus: 200, contains: 'nexvion-ai' },
    { path: '/api/analytics', expectStatus: 200, contains: 'batchCapacityUtilization' }
  ];

  console.log('\n--- Live HTTP Route Verification Results ---');
  let routeErrors = 0;
  for (const r of routes) {
    try {
      const res = await get(r.path);
      if (res.status === r.expectStatus && res.body.includes(r.contains)) {
        console.log(`  ✅ [${res.status}] ${r.path} -> OK`);
      } else {
        console.error(`  ❌ FAIL: ${r.path} -> Status: ${res.status} (expected ${r.expectStatus}), Contains: ${res.body.includes(r.contains)}`);
        routeErrors++;
      }
    } catch (e) {
      console.error(`  ❌ ERROR requesting ${r.path}:`, e.message);
      routeErrors++;
    }
  }

  serverProc.kill('SIGTERM');
  if (routeErrors === 0) {
    console.log('\n✅ ALL 14 public, admin, and API routes verified successfully!');
  } else {
    console.error(`\n❌ ${routeErrors} route verification failures detected!`);
    process.exit(1);
  }
}

verifyRoutes().catch(e => { console.error(e); process.exit(1); });


