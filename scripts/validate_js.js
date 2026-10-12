const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let errors = 0;
['js', 'www/js'].forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.js')).forEach(file => {
    const full = path.join(dir, file);
    try {
      execSync(`node -c "${full}"`);
      console.log('VALID:', full);
    } catch (e) {
      console.error('INVALID:', full, e.message);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log('ALL JS FILES ARE 100% VALID SYNTAX!');
} else {
  process.exit(1);
}
