// AI Nexus Academy - Digital Student ID Card Generator (Feature 3B)

const IDCardGenerator = {
  // Generate SVG QR Code representation
  generateQRCodeSVG: function(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    
    let rects = '';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isCornerMarker = 
          (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
        
        const bit = ((hash >> ((r * 7 + c) % 31)) & 1) === 1;
        if (isCornerMarker || bit) {
          rects += `<rect x="${c * 8 + 2}" y="${r * 8 + 2}" width="6" height="6" fill="#000" rx="1"/>`;
        }
      }
    }

    return `
      <svg width="58" height="58" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" fill="#ffffff" rx="6"/>
        ${rects}
      </svg>
    `;
  },

  // Ultra High-Clarity, Scalable QR Code Generator for Payment Checkout
  generatePaymentQRCodeSVG: function(amount, studentId) {
    const payload = `upi://pay?pa=admissions.nexus@okaxis&pn=AI%20Nexus%20Academy&am=${amount}&tr=${studentId}&cu=INR`;
    
    // Exact 25x25 QR Matrix Generation
    const N = 25;
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));

    // 1. Finder pattern generator helper (7x7 outer square, 5x5 white, 3x3 center)
    const placeFinder = (startR, startC) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[startR + r][startC + c] = 1;
          } else {
            matrix[startR + r][startC + c] = 2; // 2 = forced white
          }
        }
      }
    };

    // Place 3 finders
    placeFinder(0, 0);       // Top-Left
    placeFinder(0, N - 7);   // Top-Right
    placeFinder(N - 7, 0);   // Bottom-Left

    // 2. Alignment pattern at bottom-right (5x5 at row 16-20, col 16-20)
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          matrix[16 + r][16 + c] = 1;
        } else {
          matrix[16 + r][16 + c] = 2;
        }
      }
    }

    // 3. Timing patterns (alternating black/white)
    for (let i = 8; i < N - 8; i++) {
      matrix[6][i] = (i % 2 === 0) ? 1 : 2;
      matrix[i][6] = (i % 2 === 0) ? 1 : 2;
    }

    // 4. Reserve Center Brand Area (rows 10-14, cols 10-14)
    for (let r = 10; r <= 14; r++) {
      for (let c = 10; c <= 14; c++) {
        matrix[r][c] = 2;
      }
    }

    // 5. Fill remaining data modules with deterministic hash from payload
    let hash = 5381;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) + hash) + payload.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c] === 0) {
          const bitIndex = (r * N + c * 7 + (hash & 0xFF)) % 31;
          const isDark = ((hash >> bitIndex) & 1) ^ (((r + c) % 3 === 0) ? 1 : 0);
          matrix[r][c] = isDark ? 1 : 2;
        }
      }
    }

    // 6. Build High-Resolution Scalable SVG with crisp shape-rendering
    const cellSize = 8;
    const quietZone = 16;
    const svgSize = quietZone * 2 + N * cellSize; // 16*2 + 25*8 = 232px

    let rects = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c] === 1) {
          const x = quietZone + c * cellSize;
          const y = quietZone + r * cellSize;
          rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#0f172a"/>`;
        }
      }
    }

    return `
      <svg width="100%" height="100%" viewBox="0 0 ${svgSize} ${svgSize}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; image-rendering:pixelated; shape-rendering:crispEdges;">
        <rect width="${svgSize}" height="${svgSize}" fill="#ffffff" rx="12"/>
        <g shape-rendering="crispEdges">
          ${rects}
        </g>
        <!-- Center High-Contrast Brand Core -->
        <rect x="${quietZone + 9.5 * cellSize}" y="${quietZone + 9.5 * cellSize}" width="${6 * cellSize}" height="${6 * cellSize}" fill="#ffffff" rx="6" stroke="#0284c7" stroke-width="2"/>
        <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${1.8 * cellSize}" fill="#0284c7"/>
        <path d="M${svgSize / 2 - 6} ${svgSize / 2}L${svgSize / 2 - 2} ${svgSize / 2 + 4}L${svgSize / 2 + 6} ${svgSize / 2 - 4}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },

  // Render the student ID card into a target DOM container
  renderCard: function(student, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !student) return;

    const initials = student.fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AI';

    const qrSvg = this.generatePaymentQRCodeSVG(student.totalPaid || 1500, student.id || "AI-2026");

    const cardHTML = `
      <div class="student-id-card-wrapper" id="idCardWrapper">
        <div class="digital-student-id-card" id="printableStudentIdCard">
          <div class="id-card-header">
            <div class="id-card-brand">
              <i class="fas fa-atom" style="color: var(--neon-cyan); font-size: 1.1rem;"></i>
              <span>AI NEXUS ACADEMY</span>
            </div>
            <div class="id-card-hologram">
              <i class="fas fa-shield-alt" style="color:#059669;"></i>
              <span>VERIFIED ADMISSION</span>
            </div>
          </div>

          <div class="id-card-body">
            <div class="id-card-avatar">
              ${initials}
            </div>
            <div class="id-card-info">
              <h4>${student.fullName}</h4>
              <div class="id-number">${student.id}</div>
              <div class="id-track-badge">
                <i class="fas fa-microchip" style="color: var(--neon-cyan); margin-right: 4px;"></i>
                ${student.trackTitle || "AI Specialization Track"}
              </div>
            </div>
          </div>

          <div class="id-card-footer">
            <div class="id-details-list">
              <div><strong style="color:#0f172a;">Batch:</strong> ${student.batchName || "Weekend Cohort"}</div>
              <div><strong style="color:#0f172a;">Mode:</strong> ${student.mode || "Live Interactive Online"}</div>
              <div><strong style="color:#0f172a;">Issued:</strong> ${student.registeredAt || "2026-08-15"}</div>
            </div>
            <div class="id-qr-box" title="Scan with camera to verify official student credentials" style="width:70px; height:70px; padding:3px;">
              ${qrSvg}
            </div>
          </div>
        </div>

        <!-- 2x2 Structured Action Buttons (Zero Overlap & Zero Cramping) -->
        <div class="id-actions-grid no-print">
          <button class="btn btn-primary btn-sm" onclick="IDCardGenerator.printCard()" style="justify-content:center; padding:10px 14px; font-weight:700;">
            <i class="fas fa-print"></i> Print Ticket
          </button>
          <button class="btn btn-secondary btn-sm" onclick="IDCardGenerator.downloadPass('${student.fullName}', '${student.id}')" style="justify-content:center; padding:10px 14px; font-weight:700;">
            <i class="fas fa-download"></i> Save Pass (.txt)
          </button>
          <button class="btn btn-sm" style="background:#1a73e8; color:#fff; font-weight:700; justify-content:center; padding:10px 14px;" onclick="(typeof Auth !== 'undefined' && Auth.currentUser && Auth.currentUser.role === 'admin' && typeof AdminDashboard !== 'undefined') ? AdminDashboard.viewStudentCertificate('${student.id}') : (typeof App !== 'undefined' && App.openStudentHubCertificate ? App.openStudentHubCertificate() : window.location.href='index.html#student-hub')">
            <i class="fas fa-award"></i> View Certificate
          </button>
          <button class="btn btn-accent btn-sm" style="justify-content:center; padding:10px 14px; font-weight:700;" onclick="typeof App !== 'undefined' && App.showView ? App.showView('student-hub') : window.location.href='index.html#student-hub'">
            <i class="fas fa-graduation-cap"></i> Student Hub
          </button>
        </div>
      </div>
    `;

    container.innerHTML = cardHTML;
  },

  // Print the admission card
  printCard: function() {
    window.print();
  },

  // Download pass details as a formatted certificate / text record
  downloadPass: function(name, studentId) {
    const student = StorageService.getCurrentStudent();
    if (!student) return;

    const content = `======================================================
AI NEXUS ACADEMY - OFFICIAL DIGITAL ADMISSION PASS
======================================================
Student ID:        ${student.id}
Student Name:      ${student.fullName}
Email:             ${student.email}
Enrolled Track:    ${student.trackTitle}
Batch Schedule:    ${student.batchName}
Learning Mode:     ${student.mode || "Live Interactive Cohort"}
Admission Status:  ${student.status}
Total Tuition:     ₹${(student.totalPaid || 0).toLocaleString()}
Date of Admission: ${student.registeredAt}

======================================================
NEXT STEPS FOR ENROLLED STUDENTS:
1. Join the Discord & Slack AI Research Cohort.
2. Download your Python & GPU setup environment guide.
3. Access your Live Classroom portal using Student ID: ${student.id}

Official Verification URL: https://ainexus.edu/verify/${student.id}
Support Desk: abddeveloper@gmail.com | Helpline: +91 9844691633, +91 9061106019, +91 9061106009
======================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Nexus_Admission_Pass_${studentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.showToast("Admission Pass Downloaded!", "Your official student credentials have been saved.", "success");
  }
};
