const fs = require('fs');
const path = require('path');

const routes = [
  'overview', 'courses', 'tiers', 'batches', 'classes', 'modules',
  'lessons', 'videos', 'resources', 'projects', 'assignments',
  'students', 'enrollments', 'certificates', 'submissions',
  'announcements', 'notifications', 'support', 'payments',
  'analytics', 'admins', 'roles', 'audit-logs', 'settings'
];

function buildHtml(route) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NEXVION AI — Admin Operations Portal</title>
  <script>
    (function() {
      var target = '/admin.html#/admin/${route}' + window.location.search;
      window.location.replace(target);
    })();
  </script>
</head>
<body style="background:#08090d; color:#94a3b8; font-family:system-ui,sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
  <p>Redirecting to NEXVION Admin Portal...</p>
</body>
</html>
`;
}

['.', 'www'].forEach(base => {
  const adminDir = path.join(__dirname, '..', base, 'admin');
  fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(path.join(adminDir, 'index.html'), buildHtml('overview'), 'utf8');

  routes.forEach(r => {
    const rDir = path.join(adminDir, r);
    fs.mkdirSync(rDir, { recursive: true });
    fs.writeFileSync(path.join(rDir, 'index.html'), buildHtml(r), 'utf8');
    fs.writeFileSync(path.join(adminDir, r + '.html'), buildHtml(r), 'utf8');
  });
});

console.log('Successfully generated all physical admin route fallbacks!');
