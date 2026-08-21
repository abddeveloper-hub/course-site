// AI Nexus Academy - Main Application Coordinator

const App = {
  currentView: 'home',

  init: function() {
    // Initialize Cloud Infrastructure
    if (typeof FirebaseService !== 'undefined') {
      FirebaseService.init();
    }

    this.setupNavigation();
    this.renderCourseShowcase();
    this.renderTestimonials();
    this.setupFAQ();
    this.setupScrollListener();
    this.startCyberTelemetry();
    
    // Initialize child modules safely
    if (typeof Auth !== 'undefined' && Auth.init) Auth.init();
    if (typeof Wizard !== 'undefined' && Wizard.init) Wizard.init();
    if (typeof AdminDashboard !== 'undefined' && AdminDashboard.init) AdminDashboard.init();
    if (typeof StudentHub !== 'undefined' && StudentHub.init) StudentHub.init();

    // Check URL hash for direct routing if present
    const homeView = document.getElementById('view-home');
    if (homeView) {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'courses', 'auth', 'register', 'student-hub', 'admin-portal'].includes(hash)) {
        this.showView(hash);
      } else {
        this.showView('home');
      }
    }
  },

  // View Switching Router
  showView: function(viewId) {
    // Handling for AI Tracks (Courses section on Home page)
    if (viewId === 'courses') {
      this.showView('home');
      setTimeout(() => {
        const sec = document.getElementById('coursesSection');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return;
    }

    // Handling for AI Study Hub dedicated page
    if (viewId === 'learn' || viewId === 'study-hub') {
      window.location.href = 'learn.html';
      return;
    }

    // Handling for Nexus AI Lab dedicated page
    if (viewId === 'ai-lab') {
      window.location.href = 'ai-lab.html';
      return;
    }

    // Deprecated / Restricted public certificate route redirect
    if (viewId === 'certificate') {
      this.showToast("Official Certificate Policy", "Certificates are issued and authorized exclusively by the Academy Administration to enrolled students.", "info");
      const student = typeof StorageService !== 'undefined' ? StorageService.getCurrentStudent() : null;
      if (student) {
        this.showView('student-hub');
      } else {
        this.showView('courses');
      }
      return;
    }

    // Admin Route Protection Guard
    if (viewId === 'admin-portal') {
      if (typeof Auth !== 'undefined' && (!Auth.currentUser || Auth.currentUser.role !== 'admin')) {
        this.showToast("Administrator Authentication Required", "Please sign in with Admin credentials to access the CRM console.", "error");
        if (Auth.setAuthTab) Auth.setAuthTab('signin');
        if (Auth.fillDemoCreds) Auth.fillDemoCreds('admin');
        viewId = 'auth';
      }
    }

    this.currentView = viewId;

    // Toggle view elements
    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Pause heavy 3D WebGL background when off-home to give 100% frame rate to current view
    if (typeof ThreeBackground !== 'undefined') {
      ThreeBackground.isPaused = (viewId !== 'home');
    }

    // Update nav active states
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewId || (viewId === 'courses' && link.dataset.view === 'courses'));
    });

    // Sub-module refresh when view activates
    if (viewId === 'admin-portal' && typeof AdminDashboard !== 'undefined') {
      AdminDashboard.render();
    } else if (viewId === 'student-hub' && typeof StudentHub !== 'undefined') {
      StudentHub.render();
    } else if (viewId === 'register' && typeof Wizard !== 'undefined') {
      Wizard.renderTrackOptions();
      Wizard.renderBatchOptions();
      Wizard.renderAddonOptions();
      Wizard.calculatePricing();
    }
  },

  // 1-Click Track Enrollment Initialization
  startEnrollment: function(trackId) {
    this.showView('register');
    if (trackId && typeof Wizard !== 'undefined') {
      Wizard.formData.trackId = trackId;
      Wizard.goToStep(2);
      setTimeout(() => {
        Wizard.selectTrack(trackId);
      }, 100);
    }
  },

  // Delegated Global Navigation Handler (Works for all buttons & links dynamically)
  setupNavigation: function() {
    document.addEventListener('click', (e) => {
      const routeEl = e.target.closest('[data-route]');
      if (routeEl) {
        e.preventDefault();
        const route = routeEl.dataset.route;
        this.showView(route);
      }
    });
  },

  // Mobile Drawer Toggle
  toggleMobileDrawer: function(open) {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    if (drawer) drawer.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
  },

  // Open verified certificate in modal for authorized students
  openStudentHubCertificate: function() {
    const student = StorageService.getCurrentStudent();
    if (!student) {
      this.showToast("No Active Enrollment", "Please register for a course to access your student records.", "error");
      return;
    }

    if (!student.certificateAllotted) {
      this.showToast(
        "Certificate Pending Admin Allotment",
        "Your official certificate is issued exclusively by the Academy Administration following Capstone evaluation.",
        "info"
      );
      return;
    }

    AICertificateGenerator.renderCertificate(student, 'modalCertContainer');
    this.openModal('certModal');
  },

  // Setup FAQ accordion
  setupFAQ: function() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
          if (!isOpen) item.classList.add('open');
        });
      }
    });
  },

  // Render Course Showcase Grid on Homepage
  renderCourseShowcase: function(filterLevel = 'All') {
    const container = document.getElementById('courseShowcaseGrid');
    if (!container) return;

    const filtered = filterLevel === 'All'
      ? ACADEMY_DATA.courses
      : ACADEMY_DATA.courses.filter(c => c.level === filterLevel);

    let html = '';
    filtered.forEach(course => {
      const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
      const highlightList = (course.highlights || []).slice(0, 3).map(h => `
        <li><i class="fas fa-check-circle" style="color:var(--neon-emerald); font-size:0.85rem; margin-top:3px;"></i><span>${h}</span></li>
      `).join('');

      html += `
        <div class="course-card">
          <div>
            <div class="course-badge-top">
              <span class="course-code">${course.code}</span>
              <span class="course-level-tag ${course.level === 'Beginner' ? 'level-beginner' : course.level === 'Intermediate' ? 'level-intermediate' : 'level-advanced'}">${course.badge || course.level}</span>
            </div>

            <div class="course-icon-wrap" style="background:${course.gradient || 'var(--grad-primary)'}; color:#ffffff;">
              <i class="fas ${course.icon || 'fa-brain'}"></i>
            </div>

            <h3 class="course-title">${course.title}</h3>
            <div style="font-size:0.8rem; font-weight:700; color:var(--neon-cyan); text-transform:uppercase; margin-bottom:8px;">${course.category} &bull; ${course.tier || ''}</div>
            <p class="course-desc">${course.description}</p>

            <ul class="course-features">
              ${highlightList}
            </ul>
          </div>

          <div>
            <div class="course-meta">
              <span class="meta-item"><i class="fas fa-clock" style="color:var(--neon-cyan);"></i> ${course.duration}</span>
              <span class="meta-item"><i class="fas fa-star" style="color:#f59e0b;"></i> ${course.rating} (${course.reviewCount})</span>
            </div>

            <div class="course-price-wrap">
              <span class="course-price">₹${course.price.toLocaleString()}</span>
              ${course.originalPrice ? `<span class="course-original-price">₹${course.originalPrice.toLocaleString()}</span>` : ''}
              ${discount > 0 ? `<span class="badge" style="background:rgba(5,150,105,0.1); color:var(--neon-emerald); font-size:0.75rem; padding:3px 8px; border-radius:12px; margin-left:auto;">${discount}% OFF</span>` : ''}
            </div>

            <div style="display:flex; gap:10px;">
              <button class="btn btn-primary" style="flex:1;" onclick="App.startEnrollment('${course.id}')">
                <i class="fas fa-arrow-right"></i> Enroll Now
              </button>
              <button class="btn btn-secondary" onclick="App.openCourseModal('${course.id}')" title="View Detailed Syllabus">
                <i class="fas fa-info-circle"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  filterCourses: function(level, btn) {
    if (btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.renderCourseShowcase(level);
  },

  openCourseModal: function(courseId) {
    const course = ACADEMY_DATA.courses.find(c => c.id === courseId);
    if (!course) return;

    const modalBody = document.getElementById('courseModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
        <div style="width:50px; height:50px; border-radius:12px; background:${course.gradient}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.4rem;">
          <i class="fas ${course.icon}"></i>
        </div>
        <div>
          <span class="course-code">${course.code} &bull; ${course.tier || ''}</span>
          <h3 style="font-size:1.35rem; color:#0f172a; margin-top:2px;">${course.title}</h3>
        </div>
      </div>
      <p style="color:#475569; font-size:0.9rem; line-height:1.6; margin-bottom:20px;">${course.description}</p>
      
      <h4 style="font-size:1rem; color:#0f172a; font-weight:800; margin-bottom:12px;">Curriculum & Weekly Syllabus</h4>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">
        ${(course.syllabus || []).map(s => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px;">
            <strong style="color:var(--neon-cyan); font-size:0.8rem; text-transform:uppercase;">${s.week}:</strong>
            <span style="color:#1e293b; font-size:0.875rem; font-weight:600; margin-left:6px;">${s.title}</span>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:16px;">
        <div>
          <span style="font-size:0.75rem; color:#64748b;">Tuition Fee</span>
          <div style="font-size:1.5rem; font-weight:800; color:#0f172a;">₹${course.price.toLocaleString()}</div>
        </div>
        <button class="btn btn-primary" onclick="App.closeModal('courseModal'); App.startEnrollment('${course.id}');">
          <i class="fas fa-bolt"></i> Enroll In This Track
        </button>
      </div>
    `;

    this.openModal('courseModal');
  },

  // Render Testimonials
  renderTestimonials: function() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    let html = '';
    ACADEMY_DATA.testimonials.forEach(t => {
      html += `
        <div class="glass-panel" style="padding: 28px;">
          <div style="display:flex; gap:4px; color:var(--neon-amber); margin-bottom:16px;">
            ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
          </div>
          <p style="font-size:0.95rem; color:#334155; font-style:italic; margin-bottom:20px; line-height:1.6;">"${t.text}"</p>
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:42px; height:42px; border-radius:50%; background:var(--grad-primary); display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:800; font-size:0.9rem; box-shadow:0 4px 12px rgba(2, 132, 199, 0.3);">
              ${t.avatar}
            </div>
            <div>
              <strong style="color:#0f172a; font-size:0.95rem;">${t.name}</strong>
              <div style="font-size:0.8rem; color:var(--text-muted);">${t.role}</div>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  // Modal handlers
  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  },

  // Toast notifications
  showToast: function(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = 
      type === 'success' ? 'fa-check-circle' :
      type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    toast.innerHTML = `
      <div class="toast-icon"><i class="fas ${icon}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // High-performance RAF Throttled Navbar scroll listener
  setupScrollListener: function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let isTicking = false;

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 40);
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  },

  // Live Holographic Cyber Telemetry Ticker (Option 5)
  startCyberTelemetry: function() {
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = setInterval(() => {
      const latencyEl = document.getElementById('hudLatencyVal');
      const scholarsEl = document.getElementById('hudScholarsCount');
      if (latencyEl) {
        const ms = Math.floor(10 + Math.random() * 8);
        latencyEl.textContent = `${ms}ms`;
      }
      if (scholarsEl) {
        const count = 1420 + Math.floor(Math.random() * 15);
        scholarsEl.textContent = `${count.toLocaleString()}+`;
      }
    }, 3500);
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
