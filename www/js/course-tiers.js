/**
 * NEXVION AI — Four-Tier Course System & Batch Architecture
 * Reusable data structure and components for:
 * 01 AI FOUNDATIONS (FREE)
 * 02 AI BUILDER (PAID)
 * 03 AI CREATOR (PAID)
 * 04 AI ARCHITECT (PREMIUM)
 *
 * Strictly enforces 30-seat maximum capacity per batch in data structures.
 */

(function () {
  'use strict';

  // --- REUSABLE DATA MODEL (Ready for Firebase / Backend API ingestion) ---
  const NEXVION_COURSES = [
    {
      courseId: "ai-foundations",
      courseNumber: "01",
      courseName: "AI FOUNDATIONS",
      levelBadge: "LEVEL 01 • BEGINNER",
      priceType: "free",
      priceDisplay: "FREE",
      description: "Start your AI journey from zero. Understand the fundamentals of Artificial Intelligence and learn how to confidently use modern AI tools.",
      learningAreas: [
        "AI Fundamentals",
        "Generative AI",
        "Understanding Modern AI",
        "AI Tools",
        "Basic Prompt Engineering",
        "AI for Students"
      ],
      outcome: "Understand AI and become a confident AI user.",
      // Active Batch data (Capacity strictly = 30)
      activeBatch: {
        batchId: "foundations-batch-01",
        batchName: "Batch 01",
        capacity: 30,
        enrolledCount: 0,
        status: "open" // "open" | "few" | "full" | "coming_soon"
      },
      ctaType: "join_free",
      ctaText: "JOIN FREE",
      targetTab: "tab-course-01"
    },
    {
      courseId: "ai-builder",
      courseNumber: "02",
      courseName: "AI BUILDER",
      levelBadge: "LEVEL 02 • BEGINNER → INTERMEDIATE",
      priceType: "paid",
      priceDisplay: "PRICE COMING SOON",
      description: "Move beyond using AI and start building with it. Learn AI-assisted coding, websites, APIs and practical digital projects.",
      learningAreas: [
        "Advanced Prompt Engineering",
        "AI + Coding",
        "Website Development",
        "AI-assisted Development",
        "APIs",
        "Practical Projects"
      ],
      outcome: "Go from AI user to AI builder.",
      activeBatch: {
        batchId: "builder-batch-01",
        batchName: "Batch 01",
        capacity: 30,
        enrolledCount: 0,
        status: "open"
      },
      ctaType: "enroll",
      ctaText: "ENROLL NOW",
      targetTab: "tab-course-02"
    },
    {
      courseId: "ai-creator",
      courseNumber: "03",
      courseName: "AI CREATOR",
      levelBadge: "LEVEL 03 • INTERMEDIATE",
      priceType: "paid",
      priceDisplay: "PRICE COMING SOON",
      description: "Build applications, automations and AI-powered products using the skills developed in the previous levels.",
      learningAreas: [
        "Application Development",
        "AI Applications",
        "Automation",
        "Databases",
        "AI Workflows",
        "Product Projects"
      ],
      outcome: "Go from AI builder to AI creator.",
      activeBatch: {
        batchId: "creator-batch-01",
        batchName: "Batch 01",
        capacity: 30,
        enrolledCount: 0,
        status: "open"
      },
      ctaType: "enroll",
      ctaText: "ENROLL NOW",
      targetTab: "tab-course-03"
    },
    {
      courseId: "ai-architect",
      courseNumber: "04",
      courseName: "AI ARCHITECT",
      levelBadge: "LEVEL 04 • ADVANCED",
      priceType: "premium",
      priceDisplay: "PRICE COMING SOON",
      description: "Explore advanced AI agents, intelligent systems, automation and AI product architecture.",
      learningAreas: [
        "AI Agents",
        "Advanced Automation",
        "AI Systems",
        "APIs & Integrations",
        "AI Product Architecture",
        "Advanced Final Project"
      ],
      outcome: "Learn to design and build advanced AI-powered systems.",
      activeBatch: {
        batchId: "architect-batch-01",
        batchName: "Batch 01",
        capacity: 30,
        enrolledCount: 0,
        status: "coming_soon"
      },
      ctaType: "notify",
      ctaText: "NOTIFY ME",
      targetTab: "tab-course-04"
    }
  ];

  // Expose courses globally for future Firebase / API hydration
  window.NEXVION_COURSES = NEXVION_COURSES;

  // --- REUSABLE UI COMPONENT BUILDERS ---

  /**
   * Component: <BatchStatus batch={batch} />
   */
  function renderBatchStatus(batch) {
    const remaining = batch.capacity - batch.enrolledCount;

    if (batch.status === 'full' || batch.enrolledCount >= batch.capacity) {
      return `<span class="batch-status-pill status-full">🔒 BATCH FULL</span>`;
    } else if (batch.status === 'few' || (remaining <= 5 && remaining > 0)) {
      return `<span class="batch-status-pill status-few">⚠ ONLY ${remaining} SEATS LEFT</span>`;
    } else if (batch.status === 'coming_soon') {
      return `<span class="batch-status-pill status-soon">COMING SOON</span>`;
    } else {
      return `<span class="batch-status-pill status-open">● OPEN</span>`;
    }
  }

  /**
   * Component: <SeatProgress batch={batch} />
   */
  function renderSeatProgress(batch) {
    const remaining = Math.max(0, batch.capacity - batch.enrolledCount);
    const percentage = Math.min(100, Math.round((batch.enrolledCount / batch.capacity) * 100));

    let fillClass = 'fill-open';
    if (batch.status === 'full' || batch.enrolledCount >= batch.capacity) {
      fillClass = 'fill-full';
    } else if (batch.status === 'few' || remaining <= 5) {
      fillClass = 'fill-few';
    } else if (batch.status === 'coming_soon') {
      fillClass = 'fill-soon';
    }

    return `
      <div class="seat-progress-row">
        <span><strong>${batch.enrolledCount} / ${batch.capacity}</strong> seats filled</span>
        <span>${remaining} remaining</span>
      </div>
      <div class="seat-progress-bar-track">
        <div class="seat-progress-bar-fill ${fillClass}" style="width: ${percentage}%;"></div>
      </div>
      <div class="batch-capacity-rule-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span>Strict limit: Exactly 30 students per cohort</span>
      </div>
    `;
  }

  /**
   * Component: <EnrollmentButton course={course} />
   */
  function renderEnrollmentButton(course) {
    const batch = course.activeBatch;

    if (batch.status === 'full' || batch.enrolledCount >= batch.capacity) {
      return `
        <button type="button" class="btn btn-waitlist btn-trigger-waitlist" data-course-id="${course.courseId}" data-course-name="${course.courseName}" data-batch-id="${batch.batchId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>JOIN WAITLIST</span>
        </button>
      `;
    } else if (batch.status === 'coming_soon') {
      return `
        <button type="button" class="btn btn-notify-soon btn-trigger-notify" data-course-id="${course.courseId}" data-course-name="${course.courseName}" data-batch-id="${batch.batchId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span>NOTIFY ME</span>
        </button>
      `;
    } else if (course.priceType === 'free') {
      return `
        <a href="register.html?course=${course.courseId}&batch=${batch.batchId}" class="btn btn-primary">
          <span>JOIN FREE</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      `;
    } else {
      return `
        <a href="register.html?course=${course.courseId}&batch=${batch.batchId}" class="btn btn-primary">
          <span>ENROLL NOW</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      `;
    }
  }

  // --- INITIALIZE INTERACTIVE COURSE TABS & WAITLIST LOGIC ---
  document.addEventListener('DOMContentLoaded', function () {

    // 1. Tab Switcher for Course Curriculum Detail Section
    const tabs = document.querySelectorAll('.curriculum-tier-tab');
    const contents = document.querySelectorAll('.curriculum-tier-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target-tab');

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });

    // 2. Links from Card "View Curriculum & Details"
    document.querySelectorAll('.tier-details-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetTabId = this.getAttribute('data-tab-jump');
        const correspondingTab = document.querySelector(`.curriculum-tier-tab[data-target-tab="${targetTabId}"]`);

        if (correspondingTab) {
          correspondingTab.click();
        }

        const section = document.getElementById('curriculum-breakdown');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 3. Waitlist & Notification Modal Logic
    const waitlistModal = document.getElementById('modal-waitlist');
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistCourseTitle = document.getElementById('waitlist-course-name');
    const waitlistBatchInput = document.getElementById('waitlist-batch-id');
    const waitlistCourseInput = document.getElementById('waitlist-course-id');

    function openWaitlist(courseId, courseName, batchId) {
      if (!waitlistModal) return;
      if (waitlistCourseTitle) waitlistCourseTitle.textContent = `${courseName} (${batchId.toUpperCase()})`;
      if (waitlistCourseInput) waitlistCourseInput.value = courseId;
      if (waitlistBatchInput) waitlistBatchInput.value = batchId;

      waitlistModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeWaitlist() {
      if (!waitlistModal) return;
      waitlistModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-trigger-waitlist, .btn-trigger-notify').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const cid = this.getAttribute('data-course-id');
        const cname = this.getAttribute('data-course-name');
        const bid = this.getAttribute('data-batch-id');
        openWaitlist(cid, cname, bid);
      });
    });

    document.querySelectorAll('.modal-waitlist-close').forEach(btn => {
      btn.addEventListener('click', closeWaitlist);
    });

    if (waitlistModal) {
      waitlistModal.addEventListener('click', function (e) {
        if (e.target === waitlistModal) closeWaitlist();
      });
    }

    if (waitlistForm) {
      waitlistForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Securing Waitlist Spot...';
        }

        setTimeout(function () {
          waitlistForm.innerHTML = `
            <div style="text-align: center; padding: 24px 10px;">
              <div style="font-size: 2.2rem; margin-bottom: 12px; color: #10B981;">✓</div>
              <h3 style="font-size: 1.25rem; color: #fff; margin-bottom: 8px;">You're on the Waitlist!</h3>
              <p style="color: #94A3B8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 20px;">
                As soon as a seat opens in this batch or the next cohort schedule is confirmed, an invitation link will be dispatched to your email.
              </p>
              <button type="button" class="btn btn-secondary btn-sm modal-waitlist-close" onclick="document.getElementById('modal-waitlist').classList.remove('active'); document.body.style.overflow='';">
                Close Window
              </button>
            </div>
          `;
        }, 700);
      });
    }

    // 4. Sync State for Registered Students (Prevent redundant registration prompts)
    syncRegisteredStudentState();
  });

  /**
   * Recognize logged-in/registered student and adapt CTA buttons to open Dashboard
   */
  function syncRegisteredStudentState() {
    try {
      const savedUserStr = localStorage.getItem('nexvion_current_user');
      if (!savedUserStr) return;

      const user = JSON.parse(savedUserStr);
      if (!user || !user.fullName) return;

      const enrolledCourseId = user.enrolledCourseId || 'ai-foundations';

      // 1. Update Navbar CTA
      const navCta = document.getElementById('nav-cta-btn');
      if (navCta) {
        navCta.innerHTML = `<span>DASHBOARD</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 6px;"><polyline points="9 18 15 12 9 6"/></svg>`;
        navCta.href = 'dashboard.html';
      }

      // 2. Update Mobile Drawer CTA
      document.querySelectorAll('.drawer-actions a[href="register.html"]').forEach(btn => {
        btn.textContent = 'STUDENT DASHBOARD';
        btn.href = 'dashboard.html';
      });

      // 3. Update Course Cards:
      // Foundations card
      const foundationsCard = document.getElementById('card-ai-foundations');
      if (foundationsCard) {
        const btn = foundationsCard.querySelector('.tier-card-actions a.btn-primary');
        if (btn) {
          if (enrolledCourseId === 'ai-foundations') {
            btn.innerHTML = `<span>CONTINUE LEARNING</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            btn.href = 'dashboard.html';
            btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            btn.style.borderColor = '#10B981';
            btn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';

            const header = foundationsCard.querySelector('.tier-card-header');
            if (header && !header.querySelector('.enrolled-badge-tag')) {
              const badge = document.createElement('span');
              badge.className = 'enrolled-badge-tag';
              badge.style.cssText = 'font-size: 0.6875rem; font-weight: 800; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 100px;';
              badge.textContent = '✓ CURRENT ENROLLMENT';
              header.prepend(badge);
            }
          } else {
            btn.innerHTML = `<span>SWITCH TO FOUNDATIONS</span>`;
            btn.href = 'javascript:void(0)';
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              user.enrolledCourse = 'AI FOUNDATIONS';
              user.enrolledCourseId = 'ai-foundations';
              localStorage.setItem('nexvion_current_user', JSON.stringify(user));
              window.location.href = 'dashboard.html';
            });
          }
        }
      }

      // Builder card
      const builderCard = document.getElementById('card-ai-builder');
      if (builderCard) {
        const btn = builderCard.querySelector('.tier-card-actions a.btn-primary');
        if (btn) {
          if (enrolledCourseId === 'ai-builder') {
            btn.innerHTML = `<span>CONTINUE LEARNING</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            btn.href = 'dashboard.html';
            btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            btn.style.borderColor = '#10B981';
            btn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';

            const header = builderCard.querySelector('.tier-card-header');
            if (header && !header.querySelector('.enrolled-badge-tag')) {
              const badge = document.createElement('span');
              badge.className = 'enrolled-badge-tag';
              badge.style.cssText = 'font-size: 0.6875rem; font-weight: 800; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 100px;';
              badge.textContent = '✓ CURRENT ENROLLMENT';
              header.prepend(badge);
            }
          } else {
            btn.innerHTML = `<span>ENROLL IN BUILDER →</span>`;
            btn.href = 'checkout.html?tier=ai-builder';
          }
        }
      }

      // 4. Update Final CTA Button
      const finalCta = document.getElementById('final-primary-cta');
      if (finalCta) {
        finalCta.innerHTML = `<span>GO TO STUDENT DASHBOARD</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        finalCta.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'dashboard.html';
        };
      }
    } catch (err) {
      console.warn('Error syncing student enrollment state:', err);
    }
  }

})();

