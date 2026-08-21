// AI Nexus Academy - Google Professional Certificate Generator
// Modeled after official Google Career & Cloud Professional Certificates

const AICertificateGenerator = {
  // Generate Verification Hash / Cert ID
  generateCertId: function(studentId) {
    if (studentId) {
      return `G-NEX-${studentId.replace('AI-', '')}`;
    }
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `G-NEX-2026-${rand}`;
  },

  // Render Certificate DOM
  renderCertificate: function(student, containerId, allowOverride = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const studentData = student || StorageService.getCurrentStudent();
    if (!studentData) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 40px 20px; text-align: center; border-radius: 16px;">
          <i class="fas fa-lock" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px;"></i>
          <h3 style="color: #0f172a; font-weight: 800; margin-bottom: 6px;">No Certificate Available</h3>
          <p style="color: #64748b; font-size: 0.9rem;">Official certificates are granted exclusively by the Academy Administration to registered students.</p>
        </div>
      `;
      return;
    }

    // Security & Policy Check: Only render printable certificate if allotted by Admin or in Admin Mode
    if (!studentData.certificateAllotted && !allowOverride) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 36px 24px; text-align: center; border: 2px dashed rgba(2, 132, 199, 0.35); background: rgba(2, 132, 199, 0.03); border-radius: 16px;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(2, 132, 199, 0.1); color: var(--neon-cyan); font-size: 1.6rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">
            <i class="fas fa-user-shield"></i>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
            Certificate Pending Admin Authorization
          </h3>
          <p style="color: #64748b; font-size: 0.9rem; max-width: 520px; margin: 0 auto 16px auto; line-height: 1.6;">
            The official Google-grade Certificate for <strong>${studentData.fullName}</strong> is awaiting administrative evaluation and faculty review. Only academy administrators can issue and authorize official credentials.
          </p>
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(245, 158, 11, 0.1); color: #b45309; border: 1px solid rgba(245, 158, 11, 0.3); padding: 6px 16px; border-radius: 20px; font-size: 0.825rem; font-weight: 700;">
            <i class="fas fa-clock"></i> Status: Awaiting Admin Issuance
          </div>
        </div>
      `;
      return;
    }

    const certId = studentData.certificateId || this.generateCertId(studentData.id);
    const dateStr = studentData.certificateDate || studentData.registeredAt;
    const dateObj = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const qrSvg = IDCardGenerator.generateQRCodeSVG(certId);

    const honorsBadge = studentData.certificateGrade ? `
      <div style="margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; background: rgba(26, 115, 232, 0.08); color: #1a73e8; border: 1px solid rgba(26, 115, 232, 0.25); padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">
        <i class="fas fa-medal" style="color:#fbbc04;"></i> ${studentData.certificateGrade}
      </div>
    ` : '';

    const certHTML = `
      <div class="google-cert-outer-wrapper">
        
        <!-- MAIN GOOGLE STYLE CERTIFICATE CARD -->
        <div class="google-cert-card" id="printableAICertificate">
          
          <!-- Top Multi-Color Google Accent Ribbon -->
          <div class="google-cert-top-bar">
            <div class="g-bar g-blue"></div>
            <div class="g-bar g-red"></div>
            <div class="g-bar g-yellow"></div>
            <div class="g-bar g-green"></div>
          </div>

          <!-- Certificate Content Layout -->
          <div class="google-cert-inner">
            
            <!-- Header Row: Logos & Date -->
            <div class="google-cert-header">
              <div class="google-cert-brand">
                <div class="google-cert-logo-mark">
                  <i class="fas fa-brain" style="color:#1a73e8; margin-right:8px;"></i>
                  <span style="font-weight:800; color:#202124; letter-spacing:-0.02em; font-size:1.35rem;">AI NEXUS</span>
                  <span style="color:#5f6368; font-weight:400; font-size:1.35rem; margin-left:4px;">Academy</span>
                </div>
                <div class="google-cert-badge-type">PROFESSIONAL CERTIFICATE</div>
              </div>

              <div class="google-cert-meta-top">
                <div class="google-cert-date-tag">${formattedDate}</div>
              </div>
            </div>

            <!-- Recipient Section -->
            <div class="google-cert-recipient-block">
              <p class="google-cert-certifies-text">This is to certify that</p>
              <h1 class="google-cert-recipient-name" id="certRecipientName">${studentData.fullName}</h1>
              ${honorsBadge}
              <p class="google-cert-completion-text">
                has successfully completed the rigorous curriculum and demonstrated validated industry competence in the
              </p>
              <h2 class="google-cert-course-name" id="certTrackName">${studentData.trackTitle}</h2>
              <div class="google-cert-program-subtitle">An online, rigorous professional training and specialization program</div>
            </div>

            <!-- Curriculum Highlights & Skills Evaluated -->
            <div class="google-cert-skills-box">
              <div class="google-cert-skills-title">DEMONSTRATED COMPETENCIES & SPECIALIZATIONS</div>
              <div class="google-cert-tags-wrap">
                <span class="g-skill-chip"><i class="fas fa-check-circle" style="color:#34a853;"></i> Neural Architecture & Deep Learning</span>
                <span class="g-skill-chip"><i class="fas fa-check-circle" style="color:#1a73e8;"></i> Large Language Models (LLMs) & Prompt Engineering</span>
                <span class="g-skill-chip"><i class="fas fa-check-circle" style="color:#ea4335;"></i> Multi-Agent Autonomous Swarms</span>
                <span class="g-skill-chip"><i class="fas fa-check-circle" style="color:#fbbc04;"></i> Enterprise RAG & Vector Databases</span>
                <span class="g-skill-chip"><i class="fas fa-check-circle" style="color:#1a73e8;"></i> Production MLOps & Cloud GPU Scaling</span>
              </div>
            </div>

            <!-- Signatures & Official Seal Footer -->
            <div class="google-cert-footer">
              
              <!-- Signature 1 -->
              <div class="google-sig-column">
                <div class="google-sig-image font-signature">Sarah Sterling</div>
                <div class="google-sig-rule"></div>
                <div class="google-sig-name">Dr. Sarah Sterling</div>
                <div class="google-sig-title">Director of Artificial Intelligence</div>
                <div class="google-sig-org">AI Nexus Academy of Intelligence</div>
              </div>

              <!-- Center Gold Verified Seal -->
              <div class="google-seal-column">
                <div class="google-official-seal">
                  <div class="seal-inner-circle">
                    <i class="fas fa-certificate" style="font-size:1.4rem; color:#fbbc04; margin-bottom:2px;"></i>
                    <div style="font-size:0.55rem; font-weight:800; letter-spacing:0.06em; color:#1a73e8;">VERIFIED</div>
                    <div style="font-size:0.5rem; font-weight:700; color:#5f6368;">CERTIFICATE</div>
                  </div>
                </div>
              </div>

              <!-- Signature 2 / Verification QR -->
              <div class="google-sig-column">
                <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:8px;">
                  <div style="width:48px; height:48px;">
                    ${qrSvg}
                  </div>
                  <div style="text-align:left;">
                    <div style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:#202124;">ID: ${certId}</div>
                    <div style="font-size:0.65rem; color:#5f6368;">Verify authenticity at:</div>
                    <div style="font-size:0.65rem; color:#1a73e8; font-weight:600;">ainexus.edu/verify</div>
                  </div>
                </div>
                <div class="google-sig-rule"></div>
                <div class="google-sig-name">Marc Harrison</div>
                <div class="google-sig-title">VP of Academic Accreditation</div>
                <div class="google-sig-org">Global AI Standards Council</div>
              </div>

            </div>

          </div>

          <!-- Bottom Security Code Band -->
          <div class="google-cert-security-band">
            <div>ACCREDITED BY AI NEXUS ACADEMIC COUNCIL &bull; IN ACCORDANCE WITH ISO/IEC 17024 STANDARDS</div>
            <div style="font-family:var(--font-mono);">SECURITY HASH: SHA256-${certId.replace(/-/g, '')}-VERIFIED</div>
          </div>

        </div>

        <!-- ACTION CONTROLS BAR (Hidden during print) -->
        <div class="google-cert-actions-bar no-print">
          <button class="btn btn-primary" onclick="AICertificateGenerator.printCertificate()">
            <i class="fas fa-file-pdf"></i> Download Official PDF / Print
          </button>
          <button class="btn btn-secondary" onclick="AICertificateGenerator.shareOnLinkedIn('${studentData.fullName}', '${studentData.trackTitle}', '${certId}')">
            <i class="fab fa-linkedin" style="color:#0a66c2;"></i> Add to LinkedIn Profile
          </button>
          <button class="btn btn-secondary" onclick="AICertificateGenerator.downloadCertificateData('${studentData.fullName}', '${certId}')">
            <i class="fas fa-download"></i> Save Transcript Proof
          </button>
          <button class="btn btn-secondary" onclick="App.showToast('Verification URL Copied!', 'https://ainexus.edu/verify/${certId}', 'success')">
            <i class="fas fa-link"></i> Copy Verification Link
          </button>
        </div>

      </div>
    `;

    container.innerHTML = certHTML;
  },

  // Print Certificate (triggers clean print preview)
  printCertificate: function() {
    window.print();
  },

  // Share to LinkedIn Certification Modal
  shareOnLinkedIn: function(name, track, certId) {
    const orgName = encodeURIComponent("AI Nexus Academy");
    const certName = encodeURIComponent(track);
    const certUrl = encodeURIComponent(`https://ainexus.edu/verify/${certId}`);
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&certId=${certId}&certUrl=${certUrl}`;
    
    window.open(linkedInUrl, '_blank');
    App.showToast("LinkedIn Redirect", "Opening LinkedIn Certification dialog...", "info");
  },

  // Save credential as text transcript
  downloadCertificateData: function(name, certId) {
    const student = StorageService.getCurrentStudent();
    const track = student ? student.trackTitle : "Generative AI & Machine Learning Engineering";
    const date = student ? student.registeredAt : new Date().toISOString().slice(0, 10);

    const certText = `================================================================================
AI NEXUS ACADEMY - PROFESSIONAL CAREER CERTIFICATE
ACCREDITATION & DIGITAL TRANSCRIPT OF COMPLETION
================================================================================

CERTIFICATE SERIAL:   ${certId}
CANDIDATE NAME:       ${name}
PROFESSIONAL TRACK:   ${track}
COMPLETION DATE:      ${date}
ISSUING AUTHORITY:    AI Nexus Academic Council & Global AI Research Institute
CREDENTIAL STATUS:    Verified & Active

EVALUATED DOMAINS & CORE COMPETENCIES:
1. Deep Learning & Foundation Neural Architectures
2. Large Language Models (LLMs) & Prompt Engineering
3. Autonomous Multi-Agent Swarms & Task Automation
4. Enterprise Retrieval-Augmented Generation (RAG)
5. Production MLOps, Containerization & GPU Deployment

ONLINE VERIFICATION REGISTRY:
https://ainexus.edu/verify/${certId}

================================================================================
This official digital credential verifies that the recipient has fulfilled all
academic, project, and examination requirements prescribed for this track.
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Nexus_Google_Certificate_${certId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.showToast("Transcript Saved!", `Downloaded digital transcript: ${certId}`, "success");
  }
};
