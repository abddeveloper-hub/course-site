const https = require('https');

function saveToFirestore(collection, docId, fields) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/nexvion-ai/databases/(default)/documents/${collection}?documentId=${encodeURIComponent(docId)}`;
    const formattedFields = {};
    for (const [key, val] of Object.entries(fields)) {
      if (typeof val === 'number') formattedFields[key] = { integerValue: String(val) };
      else if (typeof val === 'boolean') formattedFields[key] = { booleanValue: val };
      else formattedFields[key] = { stringValue: String(val || '') };
    }

    const payload = JSON.stringify({ fields: formattedFields });
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Ingest a missing student directly into Cloud Firestore
 */
async function ingestStudent({ name, email, course = 'AI Foundations', batch = 'Batch 01', studentId = null }) {
  const id = studentId || ('NX-2026-' + Math.floor(10000 + Math.random() * 90000));
  const enrId = 'enr-' + Date.now();
  console.log(`Ingesting student record: ${name} (${email}) as ${id}...`);
  
  const studentResult = await saveToFirestore('students', id, {
    id: id,
    studentId: id,
    name: name,
    fullName: name,
    email: email.toLowerCase().trim(),
    enrolledCourse: course,
    enrolledCourseTitle: course,
    batchName: batch,
    enrollmentStatus: 'Enrolled',
    paymentStatus: 'Approved',
    progressPercent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restoredFromProof: true
  });

  const enrollResult = await saveToFirestore('enrollments', enrId, {
    id: enrId,
    studentId: id,
    studentName: name,
    studentEmail: email.toLowerCase().trim(),
    courseId: course.toLowerCase().replace(/\s+/g, '-'),
    courseTitle: course,
    batchName: batch,
    status: 'Active',
    paymentStatus: 'Approved',
    enrolledAt: new Date().toISOString()
  });

  console.log(`Successfully restored student ${id} to Cloud Firestore!`);
  return { id, studentResult, enrollResult };
}

module.exports = { ingestStudent };

if (require.main === module) {
  const [,, name, email, course] = process.argv;
  if (!name || !email) {
    console.log('Usage: node scripts/restore_student.js "Student Name" "email@example.com" [CourseName]');
    process.exit(1);
  }
  ingestStudent({ name, email, course }).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
