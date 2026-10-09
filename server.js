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

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/course' || pathname === '/course.html') {
    pathname = '/course.html';
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
