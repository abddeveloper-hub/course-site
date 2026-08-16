// AI Nexus Academy - Multi-Step Registration Wizard (Features 4A, 4B, 4C & 3C)

const Wizard = {
  currentStep: 1,
  totalSteps: 5,
  isExpressMode: false,
  
  formData: {
    fullName: "",
    email: "",
    phone: "",
    education: "Computer Science Student",
    linkedin: "",
    trackId: "ai-beginners",
    batchId: "batch-weekend-am",
    addons: [],
    voucherCode: "",
    voucherDiscount: 0,
    paymentMethod: "card"
  },

  init: function() {
    this.renderTrackOptions();
    this.renderBatchOptions();
    this.renderAddonOptions();
    this.setupEventListeners();
    this.updateWizardUI();
    this.calculatePricing();
  },

  // Switch between Standard (5-step) and Express (2-step) mode
  setMode: function(express) {
    this.isExpressMode = express;
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.mode === (express ? 'express' : 'standard'));
    });

    const progressWrap = document.getElementById('wizardProgressWrap');
    if (progressWrap) {
      progressWrap.style.display = express ? 'none' : 'flex';
    }

    // Toggle Express container vs standard steps
    const expressPane = document.getElementById('expressStepPane');
    const standardContainer = document.getElementById('standardStepsContainer');

    if (express) {
      if (expressPane) expressPane.style.display = 'block';
      if (standardContainer) standardContainer.style.display = 'none';
      this.populateExpressOptions();
    } else {
      if (expressPane) expressPane.style.display = 'none';
      if (standardContainer) standardContainer.style.display = 'block';
      this.goToStep(1);
    }
  },

  // Render Track Selector Cards (Step 2 - Square Grid Tiles with Pure AI Details & Fees)
  renderTrackOptions: function() {
    const container = document.getElementById('wizardTrackContainer');
    if (!container) return;

    const courseTechMap = {
      'ai-beginners': ['Cursor AI', 'Windsurf IDE', 'Lovable.dev', 'Bolt.new', 'v0.dev', 'Replit Agent'],
      'applied-ml-ds': ['Vercel Cloud', 'Render / Netlify', 'Supabase DB', 'Firebase Backend', 'Docker', 'GitHub CI/CD'],
      'genai-agents': ['Python FastAPI', 'OpenAI GPT-4o API', 'Claude 3.5 API', 'Google Gemini API', 'Pinecone Vector DB', 'Webhooks'],
      'fullstack-ai-engineer': ['CrewAI Multi-Agents', 'LangGraph Swarms', 'Enterprise RAG', 'Ollama Local LLM', 'vLLM Serving', 'Cloud GPUs']
    };

    const courseBadgeMap = {
      'ai-beginners': { class: 'track-badge-zero', text: '🌱 Low Tier · Vibe Coding Softwares (₹1,500)' },
      'applied-ml-ds': { class: 'track-badge-popular', text: '⭐ Mid Tier · Hosting & Deployment (₹2,500)' },
      'genai-agents': { class: 'track-badge-trending', text: '🔥 High Tier · APIs & Backend (₹3,500)' },
      'fullstack-ai-engineer': { class: 'track-badge-career', text: '🚀 Highest Tier · Advanced AI & Agents (₹5,000)' }
    };

    let html = '';
    ACADEMY_DATA.courses.forEach(course => {
      const isSelected = this.formData.trackId === course.id;
      const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
      const techChips = (courseTechMap[course.id] || []).map(tech => `<span class="tech-chip"><i class="fas fa-robot" style="font-size:0.65rem; color:var(--neon-cyan);"></i>${tech}</span>`).join('');
      const badgeInfo = courseBadgeMap[course.id] || { class: 'track-badge-zero', text: course.badge || 'Certified AI' };
      const monthlyInstallment = Math.round(course.price / 3);

      const highlightItems = course.highlights ? course.highlights.slice(0, 4).map(h => `
        <li>
          <i class="fas fa-check-circle" style="color:var(--neon-emerald); margin-top:3px; font-size:0.8rem; flex-shrink:0;"></i>
          <span>${h}</span>
        </li>
      `).join('') : '';

      html += `
        <div class="track-square-card track-select-card ${isSelected ? 'selected' : ''}" onclick="Wizard.selectTrack('${course.id}')" id="track-card-${course.id}">
          
          <!-- TOP ROW: AI ICON + BADGES + RADIO -->
          <div class="square-card-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="square-icon-wrap" style="background:${course.gradient || 'var(--grad-primary)'};">
                <i class="fas ${course.icon || 'fa-brain'}"></i>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="course-code">${course.code}</span>
                  <span class="track-badge-pill ${badgeInfo.class}">${badgeInfo.text}</span>
                </div>
                <div style="font-size:0.75rem; color:#d97706; font-weight:700; margin-top:2px;">
                  <i class="fas fa-star" style="color:#f59e0b;"></i> ${course.rating || 4.9} <span style="color:#64748b; font-weight:500;">(${course.reviewCount || 340} student reviews)</span>
                </div>
              </div>
            </div>

            <div class="square-card-radio">
              <i class="fas fa-check"></i>
            </div>
          </div>

          <!-- AI TITLE & DESCRIPTION -->
          <div>
            <h4 class="square-title">${course.title}</h4>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--neon-cyan); margin-top:2px;">${course.category} &bull; ${course.tier || ''}</div>
            <p class="square-desc">${course.description}</p>
          </div>

          <!-- DEDICATED PROMINENT AI TUITION FEE BOX -->
          <div class="square-fee-box">
            <div class="square-fee-top">
              <span>All-Inclusive AI Tuition Fee</span>
              ${discount > 0 ? `<span class="square-savings-tag"><i class="fas fa-bolt"></i> Save ₹${(course.originalPrice - course.price).toLocaleString()} (${discount}% OFF)</span>` : ''}
            </div>
            <div class="square-price-row">
              <span class="square-price">₹${course.price.toLocaleString()}</span>
              ${course.originalPrice ? `<span class="square-orig-price">₹${course.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="square-installment-text">or 3 flexible monthly payments of ₹${monthlyInstallment.toLocaleString()}/mo</div>
          </div>

          <!-- AI TECH STACK & CURRICULUM BULLETS -->
          <div>
            <div class="square-tech-chips">
              ${techChips}
            </div>
            ${highlightItems ? `<ul class="square-highlights-list" style="margin-top:10px;">${highlightItems}</ul>` : ''}
          </div>

          <!-- DURATION & LIVE AI LAB INFO -->
          <div class="square-meta-info">
            <div><i class="fas fa-clock" style="color:var(--neon-cyan); margin-right:4px;"></i> <strong>${course.duration}</strong></div>
            <div><i class="fas fa-microchip" style="color:var(--neon-emerald); margin-right:4px;"></i> Cloud GPU Labs + Live Zoom</div>
          </div>

          <!-- SELECTION ACTION BUTTON -->
          <div class="square-select-btn ${isSelected ? 'selected' : ''}">
            ${isSelected ? `<i class="fas fa-check-circle"></i> <span>✓ AI Track Selected</span>` : `<i class="far fa-circle"></i> <span>Select This AI Track</span>`}
          </div>

        </div>
      `;
    });
    container.innerHTML = html;
  },

  selectTrack: function(trackId) {
    this.formData.trackId = trackId;
    document.querySelectorAll('.track-select-card').forEach(card => {
      card.classList.remove('selected');
      const btn = card.querySelector('.square-select-btn');
      if (btn) {
        btn.classList.remove('selected');
        btn.innerHTML = `<i class="far fa-circle"></i> <span>Select This Course Track</span>`;
      }
    });

    const target = document.getElementById(`track-card-${trackId}`);
    if (target) {
      target.classList.add('selected');
      const btn = target.querySelector('.square-select-btn');
      if (btn) {
        btn.classList.add('selected');
        btn.innerHTML = `<i class="fas fa-check-circle"></i> <span>✓ Course Track Selected</span>`;
      }
    }

    this.calculatePricing();
  },

  // Render Batch Selector Cards (Step 3)
  renderBatchOptions: function() {
    const container = document.getElementById('wizardBatchContainer');
    if (!container) return;

    const batches = StorageService.getBatches();
    let html = '';
    batches.forEach(batch => {
      const isSelected = this.formData.batchId === batch.id;
      const percent = Math.round((batch.enrolledSeats / batch.maxSeats) * 100);
      const isFull = batch.enrolledSeats >= batch.maxSeats;

      html += `
        <div class="batch-select-card ${isSelected ? 'selected' : ''} ${isFull ? 'opacity-50' : ''}" onclick="${isFull ? '' : `Wizard.selectBatch('${batch.id}')`}" id="batch-card-${batch.id}">
          <div class="batch-card-header">
            <div>
              <strong style="color:#0f172a; font-size:1.05rem;">${batch.name}</strong>
              <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-calendar-alt" style="color:var(--neon-cyan); margin-right:4px;"></i> Starts: ${batch.startDate}</div>
            </div>
            <span class="status-badge ${percent > 80 ? 'status-waitlisted' : 'status-confirmed'}">${batch.status}</span>
          </div>
          <p style="font-size:0.85rem; color:#334155; margin-bottom:6px;"><i class="fas fa-clock" style="color:var(--neon-cyan); margin-right:4px;"></i> ${batch.schedule}</p>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:10px;">
            <span>Seats Reserved: ${batch.enrolledSeats}/${batch.maxSeats}</span>
            <span>${percent}% Full</span>
          </div>
          <div class="batch-capacity-bar">
            <div class="batch-capacity-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  selectBatch: function(batchId) {
    this.formData.batchId = batchId;
    document.querySelectorAll('.batch-select-card').forEach(card => card.classList.remove('selected'));
    const target = document.getElementById(`batch-card-${batchId}`);
    if (target) target.classList.add('selected');
  },

  // Render Addons (Step 2 & Calculator)
  renderAddonOptions: function() {
    const container = document.getElementById('wizardAddonsContainer');
    if (!container) return;

    let html = '';
    ACADEMY_DATA.addons.forEach(addon => {
      const isChecked = this.formData.addons.includes(addon.id);
      html += `
        <label class="addon-label-card ${isChecked ? 'selected' : ''}" id="addon-label-${addon.id}">
          <div class="addon-info">
            <input type="checkbox" value="${addon.id}" ${isChecked ? 'checked' : ''} onchange="Wizard.toggleAddon('${addon.id}', this.checked)">
            <div class="addon-text">
              <h5>${addon.name}</h5>
              <p>${addon.description}</p>
            </div>
          </div>
          <div class="addon-price-tag">+₹${addon.price}</div>
        </label>
      `;
    });
    container.innerHTML = html;
  },

  toggleAddon: function(addonId, isChecked) {
    if (isChecked) {
      if (!this.formData.addons.includes(addonId)) this.formData.addons.push(addonId);
    } else {
      this.formData.addons = this.formData.addons.filter(id => id !== addonId);
    }
    const card = document.getElementById(`addon-label-${addonId}`);
    if (card) card.classList.toggle('selected', isChecked);
    this.calculatePricing();
  },

  // Calculate Real-time dynamic pricing & vouchers (Feature 3C)
  calculatePricing: function() {
    const selectedCourse = ACADEMY_DATA.courses.find(c => c.id === this.formData.trackId) || ACADEMY_DATA.courses[0];
    const basePrice = selectedCourse.price;

    let addonTotal = 0;
    this.formData.addons.forEach(addonId => {
      const addon = ACADEMY_DATA.addons.find(a => a.id === addonId);
      if (addon) addonTotal += addon.price;
    });

    const subtotal = basePrice + addonTotal;
    let discountAmount = 0;

    if (this.formData.voucherCode && ACADEMY_DATA.vouchers[this.formData.voucherCode]) {
      const v = ACADEMY_DATA.vouchers[this.formData.voucherCode];
      if (v.discountPercent) {
        discountAmount = Math.round((subtotal * v.discountPercent) / 100);
      } else if (v.flatDiscount) {
        discountAmount = Math.min(subtotal, v.flatDiscount);
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // Update Step 4 Summary Elements
    const step4TrackName = document.getElementById('step4TrackName');
    const step4TrackPrice = document.getElementById('step4TrackPrice');
    const step4AddonsPrice = document.getElementById('step4AddonsPrice');
    const step4DiscountRow = document.getElementById('step4DiscountRow');
    const step4DiscountVal = document.getElementById('step4DiscountVal');
    const step4TotalPrice = document.getElementById('step4TotalPrice');

    if (step4TrackName) step4TrackName.textContent = selectedCourse.title;
    if (step4TrackPrice) step4TrackPrice.textContent = `₹${basePrice.toLocaleString()}`;
    if (step4AddonsPrice) step4AddonsPrice.textContent = `+₹${addonTotal.toLocaleString()}`;
    
    if (step4DiscountRow && step4DiscountVal) {
      if (discountAmount > 0) {
        step4DiscountRow.style.display = 'flex';
        step4DiscountVal.textContent = `-₹${discountAmount.toLocaleString()}`;
      } else {
        step4DiscountRow.style.display = 'none';
      }
    }

    if (step4TotalPrice) step4TotalPrice.textContent = `₹${total.toLocaleString()}`;

    return { basePrice, addonTotal, subtotal, discountAmount, total, course: selectedCourse };
  },

  // Apply Voucher Code
  applyVoucher: function(code) {
    const voucherInput = document.getElementById('wizardVoucherInput');
    const cleanCode = (code || (voucherInput ? voucherInput.value : '')).trim().toUpperCase();
    const msgEl = document.getElementById('voucherFeedbackMsg');

    if (!cleanCode) {
      if (msgEl) {
        msgEl.textContent = "Please enter a voucher code.";
        msgEl.style.color = "var(--neon-amber)";
      }
      return;
    }

    if (ACADEMY_DATA.vouchers[cleanCode]) {
      this.formData.voucherCode = cleanCode;
      const v = ACADEMY_DATA.vouchers[cleanCode];
      if (msgEl) {
        msgEl.textContent = `✓ Applied! ${v.description}`;
        msgEl.style.color = "var(--neon-emerald)";
      }
      App.showToast("Voucher Applied!", v.description, "success");
      this.calculatePricing();
    } else {
      if (msgEl) {
        msgEl.textContent = "✕ Invalid promo code. Try FUTUREAI20 or STUDENT50.";
        msgEl.style.color = "var(--neon-rose)";
      }
      App.showToast("Invalid Voucher", "Use FUTUREAI20 for 20% off or STUDENT50 for scholarship.", "error");
    }
  },

  // Navigation between steps
  nextStep: function() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      }
    }
  },

  prevStep: function() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  },

  goToStep: function(stepNumber) {
    this.currentStep = stepNumber;
    this.updateWizardUI();

    if (this.currentStep === 2) {
      this.renderTrackOptions();
      this.renderAddonOptions();
    } else if (this.currentStep === 3) {
      this.renderBatchOptions();
    } else if (this.currentStep === 5) {
      this.renderQRPaymentGateway();
    }

    const viewReg = document.getElementById('view-register');
    if (viewReg) {
      window.scrollTo({ top: viewReg.offsetTop - 40, behavior: 'smooth' });
    }
  },

  onStepNodeClick: function(targetStep) {
    if (targetStep === this.currentStep) return;
    if (targetStep < this.currentStep) {
      this.goToStep(targetStep);
    } else {
      let valid = true;
      for (let s = this.currentStep; s < targetStep; s++) {
        if (!this.validateStep(s)) {
          valid = false;
          break;
        }
      }
      if (valid) {
        this.goToStep(targetStep);
      }
    }
  },

  updateWizardUI: function() {
    // Hide all step panes
    document.querySelectorAll('.wizard-step-pane').forEach((pane, idx) => {
      pane.classList.toggle('active', (idx + 1) === this.currentStep);
    });

    // Update progress node markers
    document.querySelectorAll('.step-node').forEach((node, idx) => {
      const stepIndex = idx + 1;
      node.classList.toggle('active', stepIndex === this.currentStep);
      node.classList.toggle('completed', stepIndex < this.currentStep);
    });

    // Update progress bar line fill
    const fill = document.getElementById('wizardProgressBarFill');
    if (fill) {
      const percentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      fill.style.width = `${percentage}%`;
    }

    // Hide or show back/next buttons
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');

    if (prevBtn) prevBtn.style.display = this.currentStep === 1 || this.currentStep === 5 || this.currentStep === 6 ? 'none' : 'inline-flex';
    if (nextBtn) {
      if (this.currentStep === 4) {
        nextBtn.innerHTML = `Proceed to Secure QR Payment <i class="fas fa-qrcode" style="margin-left:6px;"></i>`;
        nextBtn.style.display = 'inline-flex';
      } else if (this.currentStep === 5 || this.currentStep === 6) {
        nextBtn.style.display = 'none';
      } else {
        nextBtn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;
        nextBtn.style.display = 'inline-flex';
      }
    }

    if (this.currentStep === 4) {
      this.calculatePricing();
    }
  },

  // Validate fields for current step
  validateStep: function(step) {
    if (step === 1) {
      const name = document.getElementById('wizFullName').value.trim();
      const email = document.getElementById('wizEmail').value.trim();
      const phone = document.getElementById('wizPhone').value.trim();
      const edu = document.getElementById('wizEducation').value;

      if (!name || name.length < 2) {
        App.showToast("Required Field", "Please enter your full name.", "error");
        document.getElementById('wizFullName').focus();
        return false;
      }
      if (!email || !email.includes('@') || !email.includes('.')) {
        App.showToast("Invalid Email", "Please enter a valid email address.", "error");
        document.getElementById('wizEmail').focus();
        return false;
      }
      if (!phone || phone.length < 7) {
        App.showToast("Required Field", "Please enter your contact phone/WhatsApp number.", "error");
        document.getElementById('wizPhone').focus();
        return false;
      }

      this.formData.fullName = name;
      this.formData.email = email;
      this.formData.phone = phone;
      this.formData.education = edu;
      this.formData.linkedin = (document.getElementById('wizLinkedin') ? document.getElementById('wizLinkedin').value.trim() : '');
      return true;
    }

    if (step === 2) {
      if (!this.formData.trackId) {
        App.showToast("Select a Track", "Please choose an AI course track to proceed.", "error");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!this.formData.batchId) {
        App.showToast("Select a Batch", "Please choose your preferred batch cohort timing.", "error");
        return false;
      }
      return true;
    }

    return true;
  },

  // Render Step 5: Secure QR Code Payment Gateway
  renderQRPaymentGateway: function() {
    const pricing = this.calculatePricing();
    const tempStudentId = `AI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const qrContainer = document.getElementById('wizardPaymentQrSlot');
    const amountDisplay = document.getElementById('qrPaymentTotalDisplay');
    const studentDisplay = document.getElementById('qrPaymentCandidateName');
    const trackDisplay = document.getElementById('qrPaymentTrackName');

    if (qrContainer) {
      qrContainer.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <img src="images/phonepe-qr.png" alt="PhonePe QR Code - Abdul Wahid" class="phonepe-qr-img" onerror="this.outerHTML=IDCardGenerator.generatePaymentQRCodeSVG(${pricing.total}, '${tempStudentId}')" style="width:100%; max-width:260px; height:auto; display:block; border-radius:12px;" />
        </div>
      `;
    }
    if (amountDisplay) amountDisplay.textContent = `₹${pricing.total.toLocaleString()}`;
    if (studentDisplay) studentDisplay.textContent = this.formData.fullName || "Candidate";
    if (trackDisplay) trackDisplay.textContent = pricing.course.title;
  },

  // Payment Verification & Admin Acceptance Waiting Room
  verifyQRPayment: function() {
    const verifyBtn = document.getElementById('verifyQrPaymentBtn');
    if (verifyBtn) {
      verifyBtn.disabled = true;
      verifyBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting Payment Hash & UTR...`;
    }

    const txnRef = (document.getElementById('qrPaymentTxnRef')?.value || "").trim() || `UPI-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(() => {
      this.submitPaymentForAdminApproval(txnRef);
    }, 1200);
  },

  submitPaymentForAdminApproval: function(txnRef) {
    const pricing = this.calculatePricing();
    const batch = StorageService.getBatches().find(b => b.id === this.formData.batchId) || StorageService.getBatches()[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const studentId = `AI-2026-${randomSuffix}`;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const studentRecord = {
      id: studentId,
      fullName: this.formData.fullName || "Candidate",
      email: this.formData.email,
      phone: this.formData.phone,
      education: this.formData.education,
      linkedin: this.formData.linkedin,
      trackId: this.formData.trackId,
      trackTitle: pricing.course.title,
      batchId: this.formData.batchId,
      batchName: batch.name,
      addons: this.formData.addons,
      totalPaid: pricing.total,
      txnRef: txnRef,
      voucherApplied: this.formData.voucherCode || "NONE",
      status: "Pending Approval",
      registeredAt: formattedDate,
      mode: batch.mode.includes("Hybrid") ? "Hybrid" : "Live Online",
      certificateAllotted: false,
      certificateId: `G-NEX-2026-${randomSuffix}`,
      certificateGrade: "Distinction (98%)",
      certificateDate: now.toISOString().slice(0, 10)
    };

    // Save student to StorageService & Firebase
    StorageService.saveStudent(studentRecord);
    StorageService.setCurrentStudent(studentRecord);
    this.activePendingStudentId = studentId;

    // Populate Pending Screen Elements
    const nameEl = document.getElementById('pendingCandidateName');
    const idEl = document.getElementById('pendingApplicationId');
    const trackEl = document.getElementById('pendingTrackTitle');
    const batchEl = document.getElementById('pendingBatchName');
    const totalEl = document.getElementById('pendingTotalPaid');
    const txnEl = document.getElementById('pendingTxnRefDisplay');
    const emailEl = document.getElementById('pendingCandidateEmail');
    const timeEl = document.getElementById('pendingSubmittedTime');

    if (nameEl) nameEl.textContent = studentRecord.fullName;
    if (idEl) idEl.textContent = studentRecord.id;
    if (trackEl) trackEl.textContent = studentRecord.trackTitle;
    if (batchEl) batchEl.textContent = studentRecord.batchName;
    if (totalEl) totalEl.textContent = `₹${studentRecord.totalPaid.toLocaleString()}`;
    if (txnEl) txnEl.textContent = txnRef;
    if (emailEl) emailEl.textContent = studentRecord.email;
    if (timeEl) timeEl.textContent = studentRecord.registeredAt;

    // Transition to Pending Approval Pane
    document.querySelectorAll('.wizard-step-pane').forEach(p => p.classList.remove('active'));
    const pendingPane = document.getElementById('stepPanePendingApproval');
    if (pendingPane) pendingPane.classList.add('active');

    // Hide Next/Prev buttons in footer
    const nextBtn = document.getElementById('wizardNextBtn');
    const prevBtn = document.getElementById('wizardPrevBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';

    // Start background live polling listener
    this.startPendingApprovalListener(studentId);

    // Refresh Admin dashboard in background
    AdminDashboard.render();
    if (typeof AdminApp !== 'undefined') AdminApp.updateBadgeCounts();

    App.showToast("Payment Submitted!", "Waiting for Admin to accept payment & release credentials.", "info");
  },

  startPendingApprovalListener: function(studentId) {
    if (this.approvalPollTimer) clearInterval(this.approvalPollTimer);

    this.approvalPollTimer = setInterval(() => {
      const students = StorageService.getStudents();
      const student = students.find(s => s.id === studentId);

      if (student && (student.status === 'Confirmed' || student.status === 'Payment Verified')) {
        clearInterval(this.approvalPollTimer);
        this.unlockApprovedAdmission(student);
      }
    }, 2000);
  },

  checkPaymentStatusManual: function() {
    const btn = document.getElementById('checkStatusManualBtn');
    if (btn) {
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Checking Live Database...`;
      btn.disabled = true;
    }

    setTimeout(() => {
      const studentId = this.activePendingStudentId || (StorageService.getCurrentStudent() ? StorageService.getCurrentStudent().id : null);
      const student = StorageService.getStudents().find(s => s.id === studentId);

      if (student && (student.status === 'Confirmed' || student.status === 'Payment Verified')) {
        if (this.approvalPollTimer) clearInterval(this.approvalPollTimer);
        this.unlockApprovedAdmission(student);
      } else {
        if (btn) {
          btn.innerHTML = `<i class="fas fa-redo"></i> Check Status Now`;
          btn.disabled = false;
        }
        App.showToast("Status: Under Review", "Payment is awaiting Admin acceptance. Please wait a moment.", "info");
      }
    }, 800);
  },

  unlockApprovedAdmission: function(student) {
    StorageService.setCurrentStudent(student);

    // Render Digital ID Card into Step 6
    IDCardGenerator.renderCard(student, 'wizardIdCardResult');

    // Render Official Google Professional Certificate into Step 6
    AICertificateGenerator.renderCertificate(student, 'wizardCertificateSlot');

    // Display confirmation pane
    document.querySelectorAll('.wizard-step-pane').forEach(p => p.classList.remove('active'));
    const successPane = document.getElementById('stepPaneSuccess');
    if (successPane) successPane.classList.add('active');

    // Refresh Admin & Student Hub views
    AdminDashboard.render();
    StudentHub.render();
    if (typeof AdminApp !== 'undefined') AdminApp.updateBadgeCounts();

    App.showToast("Payment Approved & Confirmed! 🏆", `Welcome to AI Nexus Academy, ${student.fullName}! Your student pass & certificate are ready.`, "success");
  },

  // Submit complete enrollment
  submitEnrollment: function() {
    this.goToStep(5);
  },

  // Populate Express 2-step option
  populateExpressOptions: function() {
    const trackSelect = document.getElementById('expressTrackSelect');
    const batchSelect = document.getElementById('expressBatchSelect');

    if (trackSelect) {
      trackSelect.innerHTML = ACADEMY_DATA.courses.map(c => `
        <option value="${c.id}">${c.code} - ${c.title} ($${c.price})</option>
      `).join('');
    }

    if (batchSelect) {
      batchSelect.innerHTML = StorageService.getBatches().map(b => `
        <option value="${b.id}">${b.name} (${b.schedule})</option>
      `).join('');
    }
  },

  // Submit Express Enrollment
  submitExpressEnrollment: function() {
    const name = document.getElementById('expressFullName').value.trim();
    const email = document.getElementById('expressEmail').value.trim();
    const phone = document.getElementById('expressPhone').value.trim();
    const trackId = document.getElementById('expressTrackSelect').value;
    const batchId = document.getElementById('expressBatchSelect').value;

    if (!name || !email || !phone) {
      App.showToast("Required Fields", "Please complete name, email, and phone.", "error");
      return;
    }

    this.formData.fullName = name;
    this.formData.email = email;
    this.formData.phone = phone;
    this.formData.trackId = trackId;
    this.formData.batchId = batchId;
    this.formData.addons = [];

    // Switch back to standard step 5 view to display card
    this.setMode(false);
    this.submitEnrollment();
  },

  setupEventListeners: function() {
    // Voucher input enter key
    const voucherInput = document.getElementById('wizardVoucherInput');
    if (voucherInput) {
      voucherInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyVoucher();
        }
      });
    }
  }
};
