/**
 * ==============================================================================
 * NEXVION AI — STUDENT LEARNING DASHBOARD
 * Frontend Mock Data Architecture & Client Interactivity
 * ==============================================================================
 * 
 * NOTE: FRONTEND ONLY PROTOTYPE.
 * All data is isolated in DASHBOARD_DATA for straightforward backend/Firebase 
 * integration in subsequent phases.
 */

'use strict';

/* ==============================================================================
   1. STRUCTURED MOCK DATA ARCHITECTURE
   ============================================================================== */
const DASHBOARD_DATA = {
  // Authenticated Student Profile
  student: {
    id: "stu-nx-8821",
    name: "Abdul Wahid",
    firstName: "Abdul",
    avatar: "AW",
    cohort: "SPRING 2026 COHORT",
    enrolledCourse: "AI FOUNDATIONS",
    level: "LEVEL 01 • BEGINNER",
    batch: "Batch 01",
    status: "ACTIVE"
  },

  // Active Enrolled Course Information
  course: {
    id: "ai-foundations",
    name: "AI FOUNDATIONS",
    level: "LEVEL 01 • BEGINNER",
    batch: "Batch 01",
    status: "ACTIVE",
    progress: 68,
    completedClasses: 12,
    totalClasses: 20,
    completedModules: 2,
    totalModules: 5,
    completedProjects: 1,
    totalProjects: 3
  },

  // Next Unfinished Class (Continue Learning)
  nextClass: {
    moduleTag: "MODULE 03 • AI TOOLS",
    title: "AI Research Tools",
    description: "Learn how modern AI research tools can help you find, understand and organize information.",
    type: "Lesson",
    duration: "12 min",
    videoUrlMock: "https://nexvion.ai/player/mock-m03-c03"
  },

  // Course Modules with Visual States: COMPLETED, IN PROGRESS, LOCKED
  modules: [
    {
      id: "mod-01",
      number: "01",
      title: "AI Fundamentals",
      status: "completed",
      badgeText: "COMPLETED",
      progress: 100,
      classesCount: "4 classes",
      locked: false,
      lockReason: ""
    },
    {
      id: "mod-02",
      number: "02",
      title: "Generative AI",
      status: "completed",
      badgeText: "COMPLETED",
      progress: 100,
      classesCount: "4 classes",
      locked: false,
      lockReason: ""
    },
    {
      id: "mod-03",
      number: "03",
      title: "AI Tools",
      status: "active",
      badgeText: "IN PROGRESS",
      progress: 60,
      classesCount: "4 classes (3 completed)",
      locked: false,
      lockReason: ""
    },
    {
      id: "mod-04",
      number: "04",
      title: "Prompt Engineering",
      status: "locked",
      badgeText: "LOCKED",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Complete the previous module (AI Tools) to unlock this content."
    },
    {
      id: "mod-05",
      number: "05",
      title: "AI for Students",
      status: "locked",
      badgeText: "LOCKED",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Complete Module 04 (Prompt Engineering) to unlock this content."
    }
  ],

  // Recent Classes
  recentClasses: [
    {
      id: "rc-1",
      title: "What is Artificial Intelligence?",
      module: "Module 01",
      duration: "14 min",
      status: "completed",
      icon: "✓"
    },
    {
      id: "rc-2",
      title: "Introduction to Generative AI",
      module: "Module 02",
      duration: "18 min",
      status: "completed",
      icon: "✓"
    },
    {
      id: "rc-3",
      title: "Understanding AI Models",
      module: "Module 02",
      duration: "22 min",
      status: "completed",
      icon: "✓"
    },
    {
      id: "rc-4",
      title: "AI Research Tools",
      module: "Module 03",
      duration: "12 min",
      status: "in-progress",
      icon: "▶"
    }
  ],

  // Student Hands-on Projects
  projects: [
    {
      id: "proj-1",
      title: "AI Research Assistant",
      description: "Build an automated research synthesizer that queries AI models to summarize and extract insights from academic articles.",
      status: "IN PROGRESS",
      statusBadge: "IN PROGRESS",
      progress: 45,
      actionText: "Open Project →",
      locked: false,
      pillColor: "var(--accent-purple-light)",
      pillBg: "rgba(139, 92, 246, 0.15)"
    },
    {
      id: "proj-2",
      title: "AI Prompt Toolkit",
      description: "Curate, test, and benchmark 25+ domain-specific system prompts for student problem-solving and structured writing.",
      status: "COMPLETED",
      statusBadge: "COMPLETED",
      progress: 100,
      actionText: "Review Project ✓",
      locked: false,
      pillColor: "#10B981",
      pillBg: "rgba(16, 185, 129, 0.15)"
    },
    {
      id: "proj-3",
      title: "Final AI Project",
      description: "Autonomous Multi-Step AI Student Agent: Your capstone graduation build integrating prompt workflows and AI APIs.",
      status: "LOCKED",
      statusBadge: "LOCKED",
      progress: 0,
      actionText: "🔒 Locked",
      locked: true,
      lockReason: "Unlock by completing Module 05 and prerequisite projects.",
      pillColor: "var(--text-muted)",
      pillBg: "rgba(255, 255, 255, 0.06)"
    }
  ],

  // Learning Resources
  resources: [
    {
      id: "res-1",
      icon: "📄",
      title: "Notes",
      description: "Comprehensive lecture notes, concept cheat sheets, and downloadable AI summary PDFs."
    },
    {
      id: "res-2",
      icon: "🧠",
      title: "Prompt Library",
      description: "Curated collection of 100+ proven prompts for research, coding, writing, and analysis."
    },
    {
      id: "res-3",
      icon: "🔗",
      title: "Useful AI Tools",
      description: "Vetted directory of free and student-friendly generative AI tools, APIs, and playgrounds."
    },
    {
      id: "res-4",
      icon: "📚",
      title: "Study Materials",
      description: "Recommended reading list, foundational papers, and hands-on beginner exercises."
    }
  ],

  // Upcoming Schedule (Up Next)
  upcoming: {
    nextClass: {
      title: "AI Research Tools",
      time: "Tomorrow"
    },
    nextProject: {
      title: "AI Research Assistant",
      time: "Due in 4 days"
    }
  },

  // Certificate Eligibility Progress
  certificate: {
    title: "NEXVION AI Foundations Certificate",
    eligible: false,
    statusText: "NOT YET ELIGIBLE",
    progress: 68,
    description: "Complete the required course content and projects to become eligible for your NEXVION AI certificate.",
    requirements: [
      { text: "Complete all 20 course lessons (12 / 20 completed)", done: false, count: "12 / 20" },
      { text: "Complete all 5 course modules (2 / 5 completed)", done: false, count: "2 / 5" },
      { text: "Submit all 3 student practical projects (1 / 3 completed)", done: false, count: "1 / 3" },
      { text: "Pass the AI Foundations capstone review", done: false, count: "Pending" }
    ]
  },

  // Notifications
  notifications: [
    {
      id: 1,
      title: "New class available: AI Research Tools is now unlocked!",
      time: "10m ago",
      unread: true
    },
    {
      id: 2,
      title: "New resource added: Prompt Engineering Playbook v2",
      time: "2h ago",
      unread: true
    },
    {
      id: 3,
      title: "Project deadline reminder: AI Research Assistant due in 4 days",
      time: "Yesterday",
      unread: false
    }
  ]
};

/* ==============================================================================
   2. DOM HYDRATION & RENDERING
   ============================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderStudentProfile();
  renderCurrentCourse();
  renderModules();
  renderRecentClasses();
  renderProjects();
  renderResources();
  renderNotifications();
  initUIInteractions();
});

/**
 * Render Student Profile info into Topbar and Welcome
 */
function renderStudentProfile() {
  let stu = { ...DASHBOARD_DATA.student };

  // Future backend / local registration session integration:
  try {
    const saved = localStorage.getItem('nexvion_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.fullName) {
        stu.name = parsed.fullName;
        stu.firstName = parsed.fullName.trim().split(' ')[0] || parsed.fullName;
        const initials = parsed.fullName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        if (initials) stu.avatar = initials;
      }
    }
  } catch (e) {
    // Fallback to default mock student
  }

  // Topbar
  const topbarAvatar = document.getElementById('topbarAvatar');
  const topbarStudentName = document.getElementById('topbarStudentName');
  const topbarCohortBadge = document.getElementById('topbarCohortBadge');
  
  if (topbarAvatar) topbarAvatar.textContent = stu.avatar;
  if (topbarStudentName) topbarStudentName.textContent = stu.name;
  if (topbarCohortBadge) topbarCohortBadge.textContent = stu.cohort;

  // Welcome Section
  const welcomeTitle = document.getElementById('welcomeTitle');
  if (welcomeTitle) {
    welcomeTitle.textContent = `GOOD TO SEE YOU AGAIN, ${stu.firstName.toUpperCase()} 👋`;
  }
}

/**
 * Render Current Course Progress & Hero Card
 */
function renderCurrentCourse() {
  let crs = { ...DASHBOARD_DATA.course };
  const nxt = DASHBOARD_DATA.nextClass;

  // Read registered student profile or enroll query param
  try {
    const saved = localStorage.getItem('nexvion_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.enrolledCourse) {
        crs.name = parsed.enrolledCourse;
        if (parsed.batch) crs.batch = parsed.batch;
        if (parsed.enrolledCourse.toUpperCase().includes('BUILDER')) {
          crs.level = 'LEVEL 02 • BEGINNER → INTERMEDIATE';
        } else if (parsed.enrolledCourse.toUpperCase().includes('CREATOR')) {
          crs.level = 'LEVEL 03 • INTERMEDIATE';
        } else if (parsed.enrolledCourse.toUpperCase().includes('ARCHITECT')) {
          crs.level = 'LEVEL 04 • ADVANCED';
        } else {
          crs.level = 'LEVEL 01 • BEGINNER';
        }
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const enrolledParam = urlParams.get('enrolled') || urlParams.get('enroll');
    if (enrolledParam) {
      const map = {
        'ai-foundations': { name: 'AI FOUNDATIONS', level: 'LEVEL 01 • BEGINNER' },
        'ai-builder': { name: 'AI BUILDER', level: 'LEVEL 02 • BEGINNER → INTERMEDIATE' },
        'ai-creator': { name: 'AI CREATOR', level: 'LEVEL 03 • INTERMEDIATE' },
        'ai-architect': { name: 'AI ARCHITECT', level: 'LEVEL 04 • ADVANCED' }
      };
      if (map[enrolledParam]) {
        crs.name = map[enrolledParam].name;
        crs.level = map[enrolledParam].level;
        setTimeout(() => {
          showToast(`Successfully enrolled in ${crs.name}! Welcome to your course.`);
        }, 400);
      }
    }
  } catch (e) {
    // Fallback to default
  }

  // Course card details
  const tierBadge = document.getElementById('courseTierBadge');
  const batchBadge = document.getElementById('courseBatchBadge');
  const statusBadge = document.getElementById('courseStatusBadge');
  const titleEl = document.getElementById('currentCourseTitle');
  const percentEl = document.getElementById('courseProgressPercent');
  const countEl = document.getElementById('courseProgressCount');
  const barEl = document.getElementById('courseProgressBar');

  if (tierBadge) tierBadge.textContent = crs.level;
  if (batchBadge) batchBadge.textContent = crs.batch;
  if (statusBadge) statusBadge.textContent = crs.status;
  if (titleEl) titleEl.textContent = crs.name;
  if (percentEl) percentEl.textContent = `${crs.progress}%`;
  if (countEl) countEl.textContent = `${crs.completedClasses} of ${crs.totalClasses} classes completed`;
  if (barEl) barEl.style.width = `${crs.progress}%`;

  // Continue Learning Card
  const nxtTag = document.getElementById('nextClassModuleTag');
  const nxtTitle = document.getElementById('continueClassTitle');
  const nxtDesc = document.getElementById('nextClassDesc');
  const nxtMeta = document.getElementById('nextClassMeta');

  if (nxtTag) nxtTag.textContent = nxt.moduleTag;
  if (nxtTitle) nxtTitle.textContent = nxt.title;
  if (nxtDesc) nxtDesc.textContent = nxt.description;
  if (nxtMeta) nxtMeta.textContent = `${nxt.type} • ${nxt.duration}`;

  // 4-Metrics Grid
  const mProgress = document.getElementById('metricCourseProgress');
  const mClasses = document.getElementById('metricClassesCount');
  const mModules = document.getElementById('metricModulesCount');
  const mProjects = document.getElementById('metricProjectsCount');

  if (mProgress) mProgress.textContent = `${crs.progress}%`;
  if (mClasses) mClasses.textContent = `${crs.completedClasses} / ${crs.totalClasses}`;
  if (mModules) mModules.textContent = `${crs.completedModules} / ${crs.totalModules}`;
  if (mProjects) mProjects.textContent = `${crs.completedProjects} / ${crs.totalProjects}`;

  // Up Next Cards
  const upClassTitle = document.getElementById('upNextClassTitle');
  const upClassTime = document.getElementById('upNextClassTime');
  const upProjTitle = document.getElementById('upNextProjectTitle');
  const upProjTime = document.getElementById('upNextProjectTime');

  if (upClassTitle) upClassTitle.textContent = DASHBOARD_DATA.upcoming.nextClass.title;
  if (upClassTime) upClassTime.textContent = DASHBOARD_DATA.upcoming.nextClass.time;
  if (upProjTitle) upProjTitle.textContent = DASHBOARD_DATA.upcoming.nextProject.title;
  if (upProjTime) upProjTime.textContent = DASHBOARD_DATA.upcoming.nextProject.time;

  // Certificate Section
  const certBadge = document.getElementById('certStatusBadge');
  const certPercent = document.getElementById('certProgressPercent');
  if (certBadge) certBadge.textContent = DASHBOARD_DATA.certificate.statusText;
  if (certPercent) certPercent.textContent = `${DASHBOARD_DATA.certificate.progress}% completed`;
}

/**
 * Render Enrolled Modules List (01 through 05)
 */
function renderModules() {
  const container = document.getElementById('modulesListContainer');
  if (!container) return;

  if (!DASHBOARD_DATA.modules || DASHBOARD_DATA.modules.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <span class="empty-state-icon">📚</span>
        <span class="empty-state-title">NO MODULES AVAILABLE</span>
        <span class="empty-state-desc">Your enrolled modules will appear here once the term begins.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = DASHBOARD_DATA.modules.map(mod => {
    let iconClass = 'ic-completed';
    let iconChar = '✓';
    let badgeStyle = 'background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3);';

    if (mod.status === 'active') {
      iconClass = 'ic-active';
      iconChar = '●';
      badgeStyle = 'background: rgba(139, 92, 246, 0.2); color: var(--accent-purple-light); border: 1px solid rgba(139, 92, 246, 0.4);';
    } else if (mod.status === 'locked') {
      iconClass = 'ic-locked';
      iconChar = '🔒';
      badgeStyle = 'background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1);';
    }

    const clickAction = mod.locked
      ? `onclick="showLockedModal('${escapeHtml(mod.title)}', '${escapeHtml(mod.lockReason)}');"`
      : `onclick="showToast('${mod.status === 'completed' ? 'Module ' + mod.number + ' review opened' : 'Resuming ' + mod.title}');"`;

    return `
      <div class="dash-module-item ${mod.status}" ${clickAction} style="cursor: pointer;" title="${mod.locked ? 'Locked: ' + mod.lockReason : 'Click to inspect ' + mod.title}">
        <div class="mod-left-info">
          <div class="mod-status-icon ${iconClass}">
            ${iconChar}
          </div>
          <div>
            <div class="mod-title-text">${mod.number} — ${escapeHtml(mod.title)}</div>
            <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 2px;">
              ${mod.locked ? '🔒 Locked • Prerequisite required' : mod.classesCount}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="mod-status-badge" style="${badgeStyle}">
            ${mod.badgeText}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Recent Classes
 */
function renderRecentClasses() {
  const container = document.getElementById('recentClassesContainer');
  if (!container) return;

  if (!DASHBOARD_DATA.recentClasses || DASHBOARD_DATA.recentClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <span class="empty-state-icon">🎥</span>
        <span class="empty-state-title">NO RECENT CLASSES</span>
        <span class="empty-state-desc">Your watched classes will be recorded here as you progress.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = DASHBOARD_DATA.recentClasses.map(cls => {
    const isCompleted = cls.status === 'completed';
    const iconColor = isCompleted ? '#10B981' : 'var(--accent-purple-light)';
    const statusText = isCompleted ? 'Completed' : 'In Progress';

    return `
      <div class="recent-class-item" onclick="handleClassClick('${escapeHtml(cls.title)}', '${cls.status}')" style="cursor: pointer;" title="Click to view class details">
        <div class="recent-class-left">
          <span style="color: ${iconColor}; font-weight: 800; font-size: 0.875rem;">${cls.icon}</span>
          <div>
            <div class="recent-class-title">${escapeHtml(cls.title)}</div>
            <div class="recent-class-meta">${cls.module} • ${cls.duration}</div>
          </div>
        </div>
        <span style="font-size: 0.6875rem; font-weight: 700; color: ${iconColor};">
          ${statusText}
        </span>
      </div>
    `;
  }).join('');
}

/**
 * Render Student Projects
 */
function renderProjects() {
  const container = document.getElementById('projectsListContainer');
  if (!container) return;

  if (!DASHBOARD_DATA.projects || DASHBOARD_DATA.projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <span class="empty-state-icon">🛠️</span>
        <span class="empty-state-title">NO PROJECTS YET</span>
        <span class="empty-state-desc">Your projects will appear here when you start building.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = DASHBOARD_DATA.projects.map(proj => {
    const isLocked = proj.locked;
    const clickHandler = isLocked
      ? `onclick="showLockedModal('${escapeHtml(proj.title)}', '${escapeHtml(proj.lockReason || 'Complete prerequisite modules to unlock this project.')}');"`
      : `onclick="handleProjectClick('${escapeHtml(proj.title)}', '${proj.status}');"`;

    return `
      <div class="dash-project-card" style="${isLocked ? 'opacity: 0.65;' : ''}">
        <div class="project-card-top">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">${isLocked ? '🔒' : '🚀'}</span>
            <span class="project-card-title">${escapeHtml(proj.title)}</span>
          </div>
          <span class="project-status-pill" style="color: ${proj.pillColor}; background: ${proj.pillBg};">
            ${proj.statusBadge}
          </span>
        </div>

        <p class="project-card-desc">${escapeHtml(proj.description)}</p>

        <!-- Progress Track -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; margin-bottom: 4px; color: var(--text-muted);">
            <span>Project Completion</span>
            <span style="font-weight: 700; color: var(--neutral-obsidian);">${proj.progress}%</span>
          </div>
          <div class="dash-progress-track">
            <div class="dash-progress-fill" style="width: ${proj.progress}%; ${proj.progress === 100 ? 'background: #10B981;' : ''}"></div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
          <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;" ${clickHandler}>
            <span>${proj.actionText}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Learning Resources Grid
 */
function renderResources() {
  const container = document.getElementById('resourcesGridContainer');
  if (!container) return;

  if (!DASHBOARD_DATA.resources || DASHBOARD_DATA.resources.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <span class="empty-state-icon">📁</span>
        <span class="empty-state-title">NO RESOURCES AVAILABLE</span>
        <span class="empty-state-desc">Supplementary materials will be uploaded here by instructors.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = DASHBOARD_DATA.resources.map(res => {
    return `
      <a href="javascript:void(0)" class="resource-card" onclick="handleResourceClick('${escapeHtml(res.title)}')">
        <span class="resource-card-icon">${res.icon}</span>
        <span class="resource-card-title">${escapeHtml(res.title)}</span>
        <span class="resource-card-desc">${escapeHtml(res.description)}</span>
      </a>
    `;
  }).join('');
}

/**
 * Render Notification Items
 */
function renderNotifications() {
  const container = document.getElementById('notifListContainer');
  if (!container) return;

  container.innerHTML = DASHBOARD_DATA.notifications.map(n => {
    return `
      <div class="notif-item" onclick="showToast('${escapeHtml(n.title)}');">
        <div style="font-size: 0.8125rem; line-height: 1;">📌</div>
        <div style="flex: 1;">
          <div class="notif-item-title">${escapeHtml(n.title)}</div>
          <div class="notif-item-time">${n.time}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==============================================================================
   3. INTERACTIVE CONTROLS & EVENT HANDLERS
   ============================================================================== */
function initUIInteractions() {
  // 1. Notification dropdown toggle
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = notifDropdown.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        notifDropdown.classList.add('active');
        notifBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // 2. Profile dropdown toggle
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = profileDropdown.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        profileDropdown.classList.add('active');
        profileBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // 3. Mobile sidebar drawer toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const dashboardSidebar = document.getElementById('dashboardSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && dashboardSidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      dashboardSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-wrap') && !e.target.closest('.student-profile-wrap')) {
      closeAllDropdowns();
    }
  });

  // Highlight active sidebar navigation item on scroll
  const navItems = document.querySelectorAll('.dash-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (this.getAttribute('href')?.startsWith('#')) {
        navItems.forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        // Close mobile sidebar if open
        if (dashboardSidebar && sidebarOverlay) {
          dashboardSidebar.classList.remove('active');
          sidebarOverlay.classList.remove('active');
        }
      }
    });
  });
}

function closeAllDropdowns() {
  const notifDropdown = document.getElementById('notifDropdown');
  const profileDropdown = document.getElementById('profileDropdown');
  const notifBtn = document.getElementById('notifBtn');
  const profileBtn = document.getElementById('profileBtn');

  if (notifDropdown) notifDropdown.classList.remove('active');
  if (profileDropdown) profileDropdown.classList.remove('active');
  if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
  if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
}

/**
 * Handle "CONTINUE CLASS" / "CONTINUE LEARNING" CTA
 */
function handleContinueClass() {
  const nxt = DASHBOARD_DATA.nextClass;
  showToast(`Resuming Lesson: "${nxt.title}" (${nxt.duration})`);
}

/**
 * Handle clicking on a recent class item
 */
function handleClassClick(title, status) {
  if (status === 'completed') {
    showToast(`Reviewing completed class: "${title}"`);
  } else {
    showToast(`Launching in-progress class: "${title}"`);
  }
}

/**
 * Handle project item click
 */
function handleProjectClick(title, status) {
  if (status === 'COMPLETED') {
    showToast(`Opening project repo for: "${title}" ✓`);
  } else {
    showToast(`Opening workspace for: "${title}" (In Progress)`);
  }
}

/**
 * Handle clicking a learning resource
 */
function handleResourceClick(title) {
  showToast(`Accessing: ${title}`);
}

/**
 * Show Locked Content Modal
 */
function showLockedModal(title, reason) {
  const backdrop = document.getElementById('lockedModalBackdrop');
  const titleEl = document.getElementById('modalLockedTitle');
  const descEl = document.getElementById('modalLockedDesc');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = reason || "Complete the previous module to unlock this content.";
  if (backdrop) backdrop.classList.add('active');
}

function closeLockedModal() {
  const backdrop = document.getElementById('lockedModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
}

/**
 * Show Certificate Requirements Modal
 */
function openCertModal() {
  const backdrop = document.getElementById('certModalBackdrop');
  const listContainer = document.getElementById('certChecklistContainer');

  if (listContainer && DASHBOARD_DATA.certificate.requirements) {
    listContainer.innerHTML = DASHBOARD_DATA.certificate.requirements.map(req => {
      return `
        <li class="req-item ${req.done ? 'completed' : 'pending'}">
          <div class="req-icon ${req.done ? 'done' : 'wait'}">
            ${req.done ? '✓' : '●'}
          </div>
          <div style="flex: 1;">
            <span>${escapeHtml(req.text)}</span>
          </div>
        </li>
      `;
    }).join('');
  }

  if (backdrop) backdrop.classList.add('active');
}

function closeCertModal() {
  const backdrop = document.getElementById('certModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
}

/**
 * Open Settings
 */
function openProfileSettings() {
  closeAllDropdowns();
  showToast("Student Settings — Profile, notifications, and cohort preferences.");
}

/**
 * Logout Handler
 */
function handleLogout() {
  closeAllDropdowns();
  showToast("Logging out of Student Dashboard... Redirecting to home.");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

/**
 * Mobile Bottom Nav Profile Trigger
 */
function toggleProfileDropdown() {
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileDropdown) {
    profileDropdown.classList.toggle('active');
  }
}

/**
 * Floating Toast Feedback Notification
 */
let toastTimeout = null;
function showToast(message, icon = "✨") {
  const toast = document.getElementById('dashToast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIc = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (toastIc) toastIc.textContent = icon;

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Basic HTML Escaping Helper
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
