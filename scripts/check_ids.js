const fs = require('fs');
const c = fs.readFileSync('course.html', 'utf8');
console.log('Includes id="modules":', c.includes('id="modules"'));
console.log('Includes id="curriculum":', c.includes('id="curriculum"'));
console.log('Includes id="roadmap":', c.includes('id="roadmap"'));
