// AI Nexus Academy - Admin & Admissions Management Suite (Feature 6A)

const AdminDashboard = {
  currentSearch: "",
  currentTrackFilter: "ALL",
  currentStatusFilter: "ALL",

  init: function() {
    this.render();
    this.setupEventListeners();
  },

  render: function() {
    const students = StorageService.getStudents();
    const batches = StorageService.getBatches();

    this.renderKPIs(students, batches);
    this.renderBatchMeters(batches);
    this.renderStudentTable(students);
  },

  // 1. Calculate & Render KPI Metrics Cards
  renderKPIs: function(students, batches) {
    const totalStudents = students.length;
    const totalRevenue = students.reduce((acc, s) => acc + (s.totalPaid || 0), 0);
    
    const totalSeats = batches.reduce((acc, b) => acc + b.maxSeats, 0);
    const filledSeats = batches.reduce((acc, b) => acc + b.enrolledSeats, 0);
    const occupancyPercent = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;

    // Find top track
    const trackCounts = {};
    students.forEach(s => {
      if (s.trackTitle) trackCounts[s.trackTitle] = (trackCounts[s.trackTitle] || 0) + 1;
    });
    let topTrack = "—";
    let maxCount = 0;
    for (const track in trackCounts) {
      if (trackCounts[track] > maxCount) {
        maxCount = trackCounts[track];
        topTrack = track.split('&')[0].trim();
      }
    }

    const kpiTotalStudents = document.getElementById('kpiTotalStudents');
    const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
    const kpiOccupancy = document.getElementById('kpiOccupancy');
    const kpiTopTrack = document.getElementById('kpiTopTrack');

    if (kpiTotalStudents) kpiTotalStudents.textContent = totalStudents;
    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `₹${totalRevenue.toLocaleString()}`;
    if (kpiOccupancy) kpiOccupancy.textContent = `${occupancyPercent}%`;
    if (kpiTopTrack) kpiTopTrack.textContent = topTrack;
  },

  // 2. Render Batch Occupancy Progress Meters
  renderBatchMeters: function(batches) {
    const container = document.getElementById('adminBatchMeters');
    if (!container) return;

    let html = '';
    batches.forEach(b => {
      const percent = Math.round((b.enrolledSeats / b.maxSeats) * 100);
      html += `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding: 16px 20px; margin-bottom: 12px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
            <div>
              <strong style="color:#0f172a; font-size:0.95rem;">${b.name}</strong>
              <div style="font-size:0.775rem; color:#64748b;">${b.schedule}</div>
            </div>
            <span class="status-badge ${percent > 80 ? 'status-waitlisted' : 'status-confirmed'}">
              ${b.enrolledSeats}/${b.maxSeats} Seats (${percent}%)
            </span>
          </div>
          <div class="batch-capacity-bar">
            <div class="batch-capacity-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  // 3. Render Student Applications Table with Search & Filter
  renderStudentTable: function(students) {
    const tbody = document.getElementById('adminStudentTableBody');
    if (!tbody) return;

    let filtered = students.filter(s => {
      const matchQuery = 
        !this.currentSearch ||
        s.fullName.toLowerCase().includes(this.currentSearch) ||
        s.email.toLowerCase().includes(this.currentSearch) ||
        s.id.toLowerCase().includes(this.currentSearch);

      const matchTrack = 
        this.currentTrackFilter === "ALL" ||
        s.trackId === this.currentTrackFilter;

      const matchStatus = 
        this.currentStatusFilter === "ALL" ||
        s.status === this.currentStatusFilter;

      return matchQuery && matchTrack && matchStatus;
    });

    const countLabel = document.getElementById('adminStudentCountBadge');
    if (countLabel) countLabel.textContent = `${filtered.length} Applications`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">
            <i class="fas fa-search" style="font-size:1.8rem; color:var(--neon-cyan); margin-bottom:10px; display:block;"></i>
            No student records matching the selected criteria.
          </td>
        </tr>
      `;
      return;
    }

    let rowsHTML = '';
    filtered.forEach(s => {
      rowsHTML += `
        <tr>
          <td>
            <strong style="color:var(--neon-cyan); font-family:var(--font-mono); font-size:0.85rem;">${s.id}</strong>
          </td>
          <td>
            <div style="font-weight:700; color:#0f172a;">${s.fullName}</div>
            <div style="font-size:0.775rem; color:var(--text-muted);">${s.email}</div>
          </td>
          <td>
            <div style="font-size:0.85rem; font-weight:600; color:#334155;">${s.trackTitle}</div>
            <div style="font-size:0.75rem; color:var(--neon-violet);"><i class="fas fa-calendar-alt"></i> ${s.batchName}</div>
          </td>
          <td>
            <strong style="color:#0f172a; font-family:var(--font-mono);">₹${(s.totalPaid || 0).toLocaleString()}</strong>
            ${s.voucherApplied && s.voucherApplied !== 'NONE' ? `<div style="font-size:0.7rem; color:var(--neon-emerald);">${s.voucherApplied}</div>` : ''}
          </td>
          <td>
            <select class="select-custom" style="padding:4px 8px; font-size:0.75rem; width:auto;" onchange="AdminDashboard.updateStatus('${s.id}', this.value)">
              <option value="Confirmed" ${s.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Payment Verified" ${s.status === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
              <option value="Pending Approval" ${s.status === 'Pending Approval' || s.status === 'Pending' ? 'selected' : ''}>Pending Approval</option>
              <option value="Waitlisted" ${s.status === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
            </select>
          </td>
          <td style="font-size:0.775rem; color:var(--text-muted);">${s.registeredAt}</td>
          <td>
            <div style="display:flex; gap:6px; align-items:center;">
              ${(s.status === 'Pending Approval' || s.status === 'Pending') ? `
                <button class="btn btn-sm" style="padding:6px 12px; font-size:0.775rem; background:#059669; color:#fff; font-weight:700; box-shadow:0 2px 8px rgba(5,150,105,0.35);" onclick="AdminDashboard.acceptPayment('${s.id}')" title="Accept Payment & Release Credentials">
                  <i class="fas fa-check-circle"></i> Accept
                </button>
              ` : ''}

              <button class="btn btn-secondary btn-sm" style="padding:6px 10px; font-size:0.8rem;" onclick="AdminDashboard.viewStudentPass('${s.id}')" title="View Digital Pass">
                <i class="fas fa-id-card"></i> Pass
              </button>

              ${s.certificateAllotted ? `
                <button class="btn btn-primary btn-sm" style="padding:6px 10px; font-size:0.8rem; background:#1a73e8; color:#fff;" onclick="AdminDashboard.viewStudentCertificate('${s.id}')" title="View Official Google Certificate">
                  <i class="fas fa-award"></i> Cert
                </button>
              ` : `
                <button class="btn btn-primary btn-sm" style="padding:6px 10px; font-size:0.8rem; background:linear-gradient(135deg, #d97706, #b45309); color:#fff;" onclick="AdminDashboard.openAllotCertModal('${s.id}')" title="Allot Google-Grade Certificate">
                  <i class="fas fa-stamp"></i> Allot
                </button>
              `}

              <button class="btn btn-secondary btn-sm" style="padding:6px 10px; font-size:0.85rem;" onclick="AdminDashboard.openStudentSlideDrawer('${s.id}')" title="More Options & Full Student Dossier">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHTML;
  },

  renderTable: function() {
    this.renderStudentTable(StorageService.getStudents());
  },

  // ------------------------------------------------------------------------
  // CERTIFICATE ALLOTMENT CONTROLLER (Feature: Allow Admin to Allot Certificate)
  // ------------------------------------------------------------------------
  openAllotCertModal: function(studentId) {
    const students = StorageService.getStudents();
    const select = document.getElementById('allotSelectStudent');
    if (!select) {
      App.showToast("Allot Certificate", "Certificate allotment initialized.", "info");
      return;
    }

    // Populate student select dropdown
    select.innerHTML = students.map(s => `
      <option value="${s.id}" ${s.id === studentId ? 'selected' : ''}>
        ${s.fullName} (${s.id}) - ${s.trackTitle.split('&')[0]}
      </option>
    `).join('');

    const targetId = studentId || (students.length > 0 ? students[0].id : null);
    if (targetId) {
      this.onAllotStudentSelected(targetId);
    }

    const dateInput = document.getElementById('allotIssueDate');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    App.openModal('allotCertModal');
  },

  onAllotStudentSelected: function(studentId) {
    const students = StorageService.getStudents();
    const s = students.find(item => item.id === studentId);
    if (!s) return;

    const displayTrack = document.getElementById('allotDisplayTrack');
    const displayCohort = document.getElementById('allotDisplayCohort');
    const credInput = document.getElementById('allotCredentialId');

    if (displayTrack) displayTrack.textContent = s.trackTitle;
    if (displayCohort) displayCohort.textContent = `${s.batchName} (${s.mode || 'Live Cohort'})`;
    if (credInput) {
      credInput.value = s.certificateId || `G-NEX-2026-${s.id.split('-').pop()}`;
    }
  },

  submitAllotCertificate: function() {
    const studentSelect = document.getElementById('allotSelectStudent');
    const studentId = studentSelect ? studentSelect.value : null;
    if (!studentId) {
      App.showToast("Candidate Required", "Please select a student to allot certificate.", "error");
      return;
    }

    const credId = document.getElementById('allotCredentialId')?.value.trim() || `G-NEX-2026-${studentId.split('-').pop()}`;
    const issueDate = document.getElementById('allotIssueDate')?.value || new Date().toISOString().slice(0, 10);
    const honors = document.getElementById('allotAcademicHonors')?.value || "High Honors with Merit (95%)";

    const updated = StorageService.allotCertificate(studentId, {
      id: credId,
      date: issueDate,
      grade: honors
    });

    if (updated) {
      App.closeModal('allotCertModal');
      App.showToast("Certificate Allotted! 🎓", `Google-Grade Certificate granted to ${updated.fullName} (${credId})`, "success");
      this.render();
      if (typeof AdminApp !== 'undefined') {
        AdminApp.renderOverviewRecentTable();
        AdminApp.renderCertificateRegistry();
        AdminApp.updateBadgeCounts();
      }
    }
  },

  revokeStudentCertificate: function(studentId) {
    if (!confirm("Are you sure you want to revoke this student's official certificate allotment?")) return;

    const success = StorageService.revokeCertificate(studentId);
    if (success) {
      App.showToast("Certificate Revoked", "Student certificate allotment has been revoked.", "info");
      this.render();
      if (typeof AdminApp !== 'undefined') {
        AdminApp.renderOverviewRecentTable();
        AdminApp.renderCertificateRegistry();
      }
      this.closeSlideDrawer();
    }
  },

  allotAllEligibleStudents: function() {
    if (!confirm("Allot and grant Google-Grade AI Certificates to ALL enrolled candidates?")) return;

    StorageService.allotAllCertificates();
    App.showToast("All Certificates Allotted! 🏆", "All student credentials have been authorized and published.", "success");
    this.render();
    if (typeof AdminApp !== 'undefined') {
      AdminApp.renderOverviewRecentTable();
      AdminApp.renderCertificateRegistry();
      AdminApp.updateBadgeCounts();
    }
  },

  // 4. Admin 1-Click Payment Acceptance & Admission Release
  acceptPayment: function(studentId) {
    const students = StorageService.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
      App.showToast("Student Not Found", `Could not locate record ${studentId}`, "error");
      return;
    }

    student.status = "Payment Verified";
    student.certificateAllotted = true;

    // Update batch capacity seat count if newly confirmed
    const batches = StorageService.getBatches();
    const batch = batches.find(b => b.id === student.batchId);
    if (batch) {
      batch.enrolledSeats = Math.min(batch.maxSeats, (batch.enrolledSeats || 0) + 1);
      StorageService.saveBatch(batch);
    }

    // Persist updated student record
    StorageService.saveStudent(student);
    StorageService.setCurrentStudent(student);

    // Sync to Cloud Firestore if connected
    if (typeof FirebaseService !== 'undefined' && (FirebaseService.isInitialized || FirebaseService.isConfigured)) {
      FirebaseService.saveStudentAdmission(student);
    }

    App.showToast("Payment Accepted! ✅", `Admission confirmed for ${student.fullName}! Student ID & certificate released.`, "success");

    this.render();
    if (typeof AdminApp !== 'undefined') {
      AdminApp.renderOverviewRecentTable();
      AdminApp.renderCertificateRegistry();
      AdminApp.updateBadgeCounts();
    }
  },

  acceptPaymentFromCandidateScreen: function() {
    const pendingIdEl = document.getElementById('pendingApplicationId');
    const studentId = pendingIdEl ? pendingIdEl.textContent.trim() : null;

    if (!studentId || studentId === 'AI-2026-XXXX') {
      App.showToast("No Pending Registration", "Please submit a registration first.", "error");
      return;
    }

    this.acceptPayment(studentId);
  },

  // 5. Inline Status Updater
  updateStatus: function(studentId, newStatus) {
    const success = StorageService.updateStudentStatus(studentId, newStatus);
    if (success) {
      App.showToast("Status Updated", `Student ${studentId} status changed to ${newStatus}`, "success");
      this.render();
      if (typeof AdminApp !== 'undefined') {
        AdminApp.renderOverviewRecentTable();
        AdminApp.renderCertificateRegistry();
      }
    }
  },

  // View specific student's ID pass in modal
  viewStudentPass: function(studentId) {
    const students = StorageService.getStudents();
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    StorageService.setCurrentStudent(target);
    if (document.getElementById('adminPassModalContent')) {
      IDCardGenerator.renderCard(target, 'adminPassModalContent');
    }
    if (document.getElementById('modalPassContainer')) {
      IDCardGenerator.renderCard(target, 'modalPassContainer');
    }
    const modalId = document.getElementById('adminPassModal') ? 'adminPassModal' : 'passModal';
    App.openModal(modalId);
  },

  // View specific student's Official AI Certificate in modal
  viewStudentCertificate: function(studentId) {
    const students = StorageService.getStudents();
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    AICertificateGenerator.renderCertificate(target, 'modalCertContainer');
    App.openModal('certModal');
  },

  // 5. 1-Click Export to CSV Functionality (Feature 6A)
  exportToCSV: function() {
    const students = StorageService.getStudents();
    if (students.length === 0) {
      App.showToast("No Data", "No student registrations to export.", "error");
      return;
    }

    const headers = ["Student ID", "Full Name", "Email", "Phone", "Education", "Course Track", "Batch", "Tuition Paid ($)", "Voucher", "Status", "Registered Date"];
    
    const rows = students.map(s => [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.education || ''}"`,
      `"${s.trackTitle}"`,
      `"${s.batchName}"`,
      `"${s.totalPaid}"`,
      `"${s.voucherApplied || 'NONE'}"`,
      `"${s.status}"`,
      `"${s.registeredAt}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AI_Nexus_Admissions_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    App.showToast("CSV Exported", `Downloaded ${students.length} student records successfully!`, "success");
  },

  // Open modal to create a new batch
  openAddBatchModal: function() {
    App.openModal('addBatchModal');
  },

  // Submit new batch (compatible with both admin.html and index.html)
  saveNewBatch: function(e) {
    if (e) e.preventDefault();

    const name = (document.getElementById('modalBatchName')?.value || document.getElementById('newBatchName')?.value || "").trim();
    const schedule = (document.getElementById('modalBatchSchedule')?.value || document.getElementById('newBatchSchedule')?.value || "").trim();
    const startDate = (document.getElementById('modalBatchStart')?.value || document.getElementById('newBatchStartDate')?.value || "").trim();
    const maxSeats = parseInt(document.getElementById('modalBatchSeats')?.value || document.getElementById('newBatchMaxSeats')?.value, 10) || 30;
    const mode = document.getElementById('modalBatchMode')?.value || "Live Interactive Online";

    if (!name || !schedule || !startDate) {
      App.showToast("Required Fields", "Please complete all batch details.", "error");
      return;
    }

    const newBatch = {
      id: `batch-${Date.now()}`,
      name: name,
      schedule: schedule,
      mode: mode,
      startDate: startDate,
      maxSeats: maxSeats,
      enrolledSeats: 0,
      status: "Seats Available"
    };

    StorageService.saveBatch(newBatch);
    if (typeof Wizard !== 'undefined') Wizard.renderBatchOptions();
    if (typeof AdminApp !== 'undefined') {
      AdminApp.renderBatchDetailGrid();
      AdminApp.updateBadgeCounts();
    }
    this.render();
    App.closeModal('addBatchModal');
    App.showToast("Batch Created", `Successfully launched ${name}!`, "success");
  },

  createBatch: function(e) {
    this.saveNewBatch(e);
  },

  setupEventListeners: function() {
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.toLowerCase().trim();
        this.renderStudentTable(StorageService.getStudents());
      });
    }

    const trackSelect = document.getElementById('adminTrackFilter');
    if (trackSelect) {
      trackSelect.addEventListener('change', (e) => {
        this.currentTrackFilter = e.target.value;
        this.renderStudentTable(StorageService.getStudents());
      });
    }

    const statusSelect = document.getElementById('adminStatusFilter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderStudentTable(StorageService.getStudents());
      });
    }
  },

  // ------------------------------------------------------------------------
  // SLIDE-OVER DRAWER METHODS (Feature: Three Dots Side Drawer)
  // ------------------------------------------------------------------------
  openStudentSlideDrawer: function(studentId) {
    const students = StorageService.getStudents();
    const s = students.find(item => item.id === studentId);
    if (!s) return;

    const drawer = document.getElementById('adminSlideDrawer');
    const backdrop = document.getElementById('adminDrawerBackdrop');
    if (!drawer) return;

    const initials = s.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    drawer.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-title">
          <i class="fas fa-id-card-alt" style="color:var(--neon-cyan);"></i> Student Dossier
        </div>
        <button class="drawer-close-btn" onclick="AdminDashboard.closeSlideDrawer()" aria-label="Close Drawer">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="drawer-body">
        <!-- Profile Highlight Card -->
        <div style="background:linear-gradient(135deg, rgba(2,132,199,0.06), rgba(124,58,237,0.06)); border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-align:center;">
          <div style="width:68px; height:68px; border-radius:50%; background:var(--grad-primary); color:#ffffff; font-weight:900; font-size:1.5rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; box-shadow:0 6px 16px rgba(2,132,199,0.3);">
            ${initials}
          </div>
          <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${s.fullName}</h3>
          <div style="font-size:0.875rem; color:#64748b; margin-bottom:12px;">${s.email}</div>
          <div style="display:inline-flex; align-items:center; gap:8px; background:#ffffff; border:1px solid #cbd5e1; padding:5px 14px; border-radius:20px; font-family:var(--font-mono); font-size:0.85rem; font-weight:700; color:#0284c7;">
            <span>${s.id}</span>
            <button onclick="navigator.clipboard.writeText('${s.id}'); App.showToast('Copied', 'Student ID copied to clipboard', 'info');" style="border:none; background:none; cursor:pointer; color:#64748b;" title="Copy ID">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <!-- Academic & Enrollment Info -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <i class="fas fa-graduation-cap"></i> Enrolled Curriculum & Cohort
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:700;">TRACK</div>
              <div style="font-size:0.95rem; font-weight:700; color:#0f172a;">${s.trackTitle}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:700;">BATCH SCHEDULE</div>
              <div style="font-size:0.9rem; font-weight:600; color:#334155;"><i class="fas fa-calendar-alt" style="color:var(--neon-violet); margin-right:4px;"></i> ${s.batchName} (${s.mode || 'Live Online'})</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:700;">PHONE / WHATSAPP</div>
              <div style="font-size:0.9rem; font-weight:600; color:#334155;">${s.phone || 'Provided during verification'}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:700;">REGISTRATION DATE</div>
              <div style="font-size:0.9rem; font-weight:600; color:#334155;">${s.registeredAt}</div>
            </div>
          </div>
        </div>

        <!-- Tuition & Financials -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <i class="fas fa-receipt"></i> Tuition & Billing Summary
          </div>
          ${(s.status === 'Pending Approval' || s.status === 'Pending') ? `
            <div style="margin-bottom:14px;">
              <button class="btn btn-primary" style="width:100%; justify-content:center; background:#059669; font-weight:800; font-size:0.9rem; padding:12px; box-shadow:0 4px 14px rgba(5,150,105,0.35);" onclick="AdminDashboard.acceptPayment('${s.id}'); AdminDashboard.openStudentSlideDrawer('${s.id}');">
                <i class="fas fa-check-circle"></i> Accept Payment & Release Credentials
              </button>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:0.875rem; color:#64748b;">Total Tuition:</span>
            <strong style="font-size:1.1rem; color:#0f172a; font-family:var(--font-mono);">₹${(s.totalPaid || 0).toLocaleString()}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Voucher / Promo Code:</span>
            <span class="status-badge status-confirmed" style="font-size:0.75rem;">${s.voucherApplied || 'STANDARD'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:10px;">
            <span style="font-size:0.875rem; font-weight:700; color:#0f172a;">Admission Status:</span>
            <select class="select-custom" style="padding:6px 12px; font-size:0.85rem; width:auto; font-weight:700;" onchange="AdminDashboard.updateStatus('${s.id}', this.value); AdminDashboard.openStudentSlideDrawer('${s.id}');">
              <option value="Confirmed" ${s.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Payment Verified" ${s.status === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
              <option value="Pending Approval" ${s.status === 'Pending Approval' || s.status === 'Pending' ? 'selected' : ''}>Pending Approval</option>
              <option value="Waitlisted" ${s.status === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
            </select>
          </div>
        </div>
        <div class="drawer-section" style="border-left: 4px solid ${s.certificateAllotted ? '#1a73e8' : '#d97706'};">
          <div class="drawer-section-title" style="display:flex; justify-content:space-between; align-items:center;">
            <span><i class="fas fa-award" style="color:#1a73e8;"></i> Google Certificate Allotment</span>
            <span class="status-badge ${s.certificateAllotted ? 'status-confirmed' : 'status-pending'}">
              ${s.certificateAllotted ? '<i class="fas fa-check-circle"></i> Allotted' : '<i class="fas fa-clock"></i> Not Allotted'}
            </span>
          </div>

          ${s.certificateAllotted ? `
            <div style="font-size:0.875rem; margin-bottom:6px; color:#334155;"><strong>Credential ID:</strong> <span style="font-family:var(--font-mono); color:#1a73e8; font-weight:700;">${s.certificateId}</span></div>
            <div style="font-size:0.875rem; margin-bottom:6px; color:#334155;"><strong>Academic Honors:</strong> <span style="color:#059669; font-weight:700;">${s.certificateGrade}</span></div>
            <div style="font-size:0.875rem; margin-bottom:14px; color:#334155;"><strong>Authorized On:</strong> ${s.certificateDate}</div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-primary btn-sm" style="flex:2; justify-content:center; background:#1a73e8; color:#fff;" onclick="AdminDashboard.viewStudentCertificate('${s.id}')">
                <i class="fas fa-eye"></i> View & Print
              </button>
              <button class="btn btn-secondary btn-sm" style="flex:1; justify-content:center; color:#e11d48;" onclick="AdminDashboard.revokeStudentCertificate('${s.id}')" title="Revoke Certificate">
                <i class="fas fa-ban"></i> Revoke
              </button>
            </div>
          ` : `
            <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">This student has not yet been granted an official accredited certificate.</p>
            <button class="btn btn-primary btn-sm" style="width:100%; justify-content:center; background:linear-gradient(135deg, #1a73e8, #7c3aed); color:#fff;" onclick="AdminDashboard.openAllotCertModal('${s.id}')">
              <i class="fas fa-stamp"></i> Allot Accredited Certificate
            </button>
          `}
        </div>

        <!-- Quick Action Buttons List -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${s.certificateAllotted ? `
            <button class="btn btn-primary" style="width:100%; justify-content:center; background:#1a73e8; color:#fff;" onclick="AdminDashboard.viewStudentCertificate('${s.id}')">
              <i class="fas fa-award"></i> View Official Certificate
            </button>
          ` : ''}
          <button class="btn btn-secondary" style="width:100%; justify-content:center;" onclick="AdminDashboard.viewStudentPass('${s.id}')">
            <i class="fas fa-id-card"></i> View Digital Student Pass
          </button>
          <button class="btn btn-secondary" style="width:100%; justify-content:center;" onclick="App.showToast('Verification Sent', 'Admission receipt and classroom access link sent to ${s.email}', 'success')">
            <i class="fas fa-paper-plane"></i> Resend Admission Credentials
          </button>
        </div>
      </div>

      <div class="drawer-footer">
        <button class="btn btn-secondary" style="flex:1;" onclick="AdminDashboard.closeSlideDrawer()">
          Close Panel
        </button>
      </div>
    `;

    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  },

  openSystemDrawer: function() {
    const drawer = document.getElementById('adminSlideDrawer');
    const backdrop = document.getElementById('adminDrawerBackdrop');
    if (!drawer) return;

    const students = StorageService.getStudents();
    const batches = StorageService.getBatches();

    drawer.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-title">
          <i class="fas fa-cogs" style="color:#7c3aed;"></i> System Actions & Logs
        </div>
        <button class="drawer-close-btn" onclick="AdminDashboard.closeSlideDrawer()" aria-label="Close Drawer">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="drawer-body">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fas fa-database"></i> Database Health</div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
            <span>Total Records:</span>
            <strong>${students.length} Students, ${batches.length} Batches</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
            <span>Storage Driver:</span>
            <strong style="color:#059669;">Browser LocalStorage (Encrypted)</strong>
          </div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fas fa-history"></i> Real-time Activity Audit</div>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem; color:#475569;">
            <div>&bull; <strong>Dr. Sterling</strong> logged in (Dean Session)</div>
            <div>&bull; <strong>Alex Rivera</strong> verified for AI-301 Track</div>
            <div>&bull; <strong>G-NEX-2026-9182</strong> Google Certificate issued</div>
            <div>&bull; Auto-sync interval: <strong>Active (Real-time)</strong></div>
          </div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fas fa-download"></i> System Exports</div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.exportToCSV()" style="width:100%; justify-content:center;">
              <i class="fas fa-file-csv"></i> Download Student Roster (.CSV)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="StorageService.resetToDefault(); AdminDashboard.render(); App.showToast('Reset Complete', 'Demo database restored', 'info'); AdminDashboard.closeSlideDrawer();" style="width:100%; justify-content:center; color:#e11d48;">
              <i class="fas fa-redo"></i> Restore Default Demo Database
            </button>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button class="btn btn-secondary" style="flex:1;" onclick="AdminDashboard.closeSlideDrawer()">
          Close
        </button>
      </div>
    `;

    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  },

  closeSlideDrawer: function() {
    const drawer = document.getElementById('adminSlideDrawer');
    const backdrop = document.getElementById('adminDrawerBackdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }
};

