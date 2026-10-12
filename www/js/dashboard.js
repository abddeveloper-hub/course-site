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
    status: "ENROLLED • STARTING SOON"
  },

  // Active Enrolled Course Information
  course: {
    id: "ai-foundations",
    name: "AI FOUNDATIONS",
    level: "LEVEL 01 • BEGINNER",
    batch: "Batch 01",
    status: "ENROLLED • STARTING SOON",
    progress: 0,
    completedClasses: 0,
    totalClasses: 20,
    completedModules: 0,
    totalModules: 5,
    completedProjects: 0,
    totalProjects: 3
  },

  // Next Unfinished Class (Continue Learning)
  nextClass: {
    moduleTag: "ORIENTATION • GETTING STARTED",
    title: "Cohort Orientation & Class Schedule",
    description: "Classes have not started yet. Your cohort orientation schedule, live links, and learning environment will unlock here before Day 1.",
    type: "Orientation",
    duration: "Coming Soon",
    videoUrlMock: ""
  },

  // Course Modules with Visual States: COMPLETED, IN PROGRESS, LOCKED
  modules: [
    {
      id: "mod-01",
      number: "01",
      title: "AI Fundamentals",
      status: "active",
      badgeText: "STARTING SOON",
      progress: 0,
      classesCount: "4 classes (Starting Soon)",
      locked: false,
      lockReason: ""
    },
    {
      id: "mod-02",
      number: "02",
      title: "Generative AI",
      status: "locked",
      badgeText: "UPCOMING",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Unlocks after completing Module 01."
    },
    {
      id: "mod-03",
      number: "03",
      title: "AI Tools",
      status: "locked",
      badgeText: "UPCOMING",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Unlocks after completing Module 02."
    },
    {
      id: "mod-04",
      number: "04",
      title: "Prompt Engineering",
      status: "locked",
      badgeText: "UPCOMING",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Unlocks after completing Module 03."
    },
    {
      id: "mod-05",
      number: "05",
      title: "AI for Students",
      status: "locked",
      badgeText: "UPCOMING",
      progress: 0,
      classesCount: "4 classes",
      locked: true,
      lockReason: "Unlocks after completing Module 04."
    }
  ],

  // Recent Classes
  recentClasses: [],

  // Student Hands-on Projects
  projects: [
    {
      id: "proj-1",
      title: "AI Research Assistant",
      description: "Build an automated research synthesizer that queries AI models to summarize and extract insights from academic articles.",
      status: "UPCOMING",
      statusBadge: "STARTING SOON",
      progress: 0,
      actionText: "View Brief →",
      locked: false,
      pillColor: "var(--accent-purple-light)",
      pillBg: "rgba(139, 92, 246, 0.15)"
    },
    {
      id: "proj-2",
      title: "AI Prompt Toolkit",
      description: "Curate, test, and benchmark 25+ domain-specific system prompts for student problem-solving and structured writing.",
      status: "LOCKED",
      statusBadge: "UPCOMING",
      progress: 0,
      actionText: "🔒 Locked",
      locked: true,
      lockReason: "Unlocks after completing Module 02.",
      pillColor: "var(--text-muted)",
      pillBg: "rgba(255, 255, 255, 0.06)"
    },
    {
      id: "proj-3",
      title: "Final AI Project",
      description: "Autonomous Multi-Step AI Student Agent: Your capstone graduation build integrating prompt workflows and AI APIs.",
      status: "LOCKED",
      statusBadge: "UPCOMING",
      progress: 0,
      actionText: "🔒 Locked",
      locked: true,
      lockReason: "Capstone project unlocks towards the end of your cohort.",
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
      title: "Cohort Orientation & Welcome",
      time: "Date Coming Soon"
    },
    nextProject: {
      title: "Course Setup & Tool Access",
      time: "Before Week 1"
    }
  },

  // Certificate Eligibility Progress
  certificate: {
    title: "NEXVION AI Foundations Certificate",
    eligible: false,
    statusText: "NOT YET ELIGIBLE",
    progress: 0,
    description: "Complete the required course content and projects once classes start to become eligible for your NEXVION AI certificate.",
    requirements: [
      { text: "Complete all 20 course lessons (0 / 20 completed)", done: false, count: "0 / 20" },
      { text: "Complete all 5 course modules (0 / 5 completed)", done: false, count: "0 / 5" },
      { text: "Submit all 3 student practical projects (0 / 3 completed)", done: false, count: "0 / 3" },
      { text: "Pass the AI Foundations capstone review", done: false, count: "Pending" }
    ]
  },

  // Notifications default initial feed
  notifications: [
    {
      id: "notif-orientation-2026",
      title: "Cohort 2026 Orientation & Curriculum Schedule",
      message: "Welcome to NEXVION AI Academy! Orientation begins this week. Live interactive classroom links, Discord cohort channels, and starter AI toolkits have been activated. Please review your module roadmap.",
      type: "Announcement",
      sender: "Academic Director",
      deepLink: "course.html#curriculum",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      audience: "All Learners",
      unread: true
    },
    {
      id: "notif-credentials-verified",
      title: "Cryptographic Student Credentials Activated",
      message: "Your learner profile has been verified and registered with the Academy Registry. Your unique Student ID badge has been linked to your course tier.",
      type: "Enrollment update",
      sender: "Registrar Services",
      deepLink: "dashboard.html#certificateSection",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      audience: "All Learners",
      unread: false
    },
    {
      id: "notif-webinar-prep",
      title: "Upcoming Live Webinar: System Architecture 101",
      message: "Join Lead Instructor Abdul Wahid for a 90-minute live deep-dive into multi-agent systems and real-time inference optimization.",
      type: "New class",
      sender: "Instructional Team",
      deepLink: "course.html#curriculum",
      createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
      audience: "All Learners",
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
  initRealtimeNotifications();
  initRealtimeVideos();
  checkAndRegisterClientDevice();
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
      if (typeof window !== 'undefined' && window.NexvionCloudSync && window.NexvionCloudSync.syncNow) {
        window.NexvionCloudSync.syncNow();
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
  const btnContinue = document.getElementById('btnContinueClass');

  if (nxtTag) nxtTag.textContent = nxt.moduleTag;
  if (nxtTitle) nxtTitle.textContent = nxt.title;
  if (nxtDesc) nxtDesc.textContent = nxt.description;
  if (nxtMeta) nxtMeta.textContent = `${nxt.type} • ${nxt.duration}`;

  if (btnContinue) {
    if (nxt.video || nxt.videoId) {
      btnContinue.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>WATCH LESSON (${nxt.duration || '25:00'})</span>
      `;
    } else {
      btnContinue.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>CLASSES STARTING SOON</span>
      `;
    }
  }

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
 * Render Recent Classes & Video Lectures
 */
function renderRecentClasses() {
  const container = document.getElementById('recentClassesContainer');
  if (!container) return;

  const countBadge = document.querySelector('#recentClassesSection .dash-section-header span');
  if (countBadge) {
    if (DASHBOARD_DATA.recentClasses && DASHBOARD_DATA.recentClasses.length > 0) {
      const completedCount = DASHBOARD_DATA.recentClasses.filter(c => c.status === 'completed').length;
      countBadge.textContent = `${completedCount} of ${DASHBOARD_DATA.recentClasses.length} Completed`;
    } else {
      countBadge.textContent = '0 Completed';
    }
  }

  if (!DASHBOARD_DATA.recentClasses || DASHBOARD_DATA.recentClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding: 24px 16px; text-align: center;">
        <span class="empty-state-icon" style="font-size: 1.6rem; display: block; margin-bottom: 6px;">🗓️</span>
        <span class="empty-state-title" style="font-size: 0.8125rem; font-weight: 700; color: var(--neutral-obsidian); display: block; margin-bottom: 4px; letter-spacing: 0.03em;">CLASSES HAVE NOT STARTED YET</span>
        <span class="empty-state-desc" style="font-size: 0.75rem; color: var(--text-muted); display: block; line-height: 1.4;">Live session links, class notes, and recordings will appear here once your cohort officially begins.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = DASHBOARD_DATA.recentClasses.map(cls => {
    const isCompleted = cls.status === 'completed';
    const hasVideo = !!(cls.video || cls.videoId);
    const clickAction = hasVideo
      ? `openVideoPlayerModal('${escapeHtml(cls.videoId || cls.id)}')`
      : `handleClassClick('${escapeHtml(cls.title)}', '${cls.status}')`;

    return `
      <div class="recent-class-item" onclick="${clickAction}" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; gap: 12px;" title="${hasVideo ? 'Click to watch lesson: ' + escapeHtml(cls.title) : 'Click to view class details'}">
        <div class="recent-class-left" style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
          ${cls.thumbnailUrl ? `
            <div style="position: relative; width: 68px; height: 42px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background: #0F172A; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <img src="${escapeHtml(cls.thumbnailUrl)}" alt="${escapeHtml(cls.title)}" style="width: 100%; height: 100%; object-fit: cover;">
              <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px;">▶</div>
            </div>
          ` : `
            <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(127, 82, 255, 0.12); color: var(--primary, #7F52FF); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0;">
              ${cls.icon || '▶'}
            </div>
          `}
          <div style="flex: 1; min-width: 0;">
            <div class="recent-class-title" style="font-size: 0.84rem; font-weight: 600; color: var(--neutral-obsidian, #0F172A); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(cls.title)}
            </div>
            <div class="recent-class-meta" style="font-size: 0.72rem; color: var(--text-muted, #94A3B8); margin-top: 2px;">
              ${escapeHtml(cls.module)} • ${escapeHtml(cls.duration || '25:00')} ${cls.resolution ? '• ' + escapeHtml(cls.resolution) : ''}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <span class="mod-status-badge" style="font-size: 0.6875rem; padding: 4px 10px; border-radius: 6px; font-weight: 700; ${isCompleted ? 'background: rgba(16, 185, 129, 0.12); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.25);' : 'background: rgba(6, 182, 212, 0.12); color: #06B6D4; border: 1px solid rgba(6, 182, 212, 0.25);'}">
            ${isCompleted ? '✓ Completed' : '▶ Watch Video'}
          </span>
        </div>
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
 * Get Student ID for notifications
 */
function getActiveStudentId() {
  try {
    const saved = localStorage.getItem('nexvion_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id || parsed.uid || parsed.studentId) return parsed.id || parsed.uid || parsed.studentId;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getCurrentUser) {
    const u = window.NexvionAuth.getCurrentUser();
    if (u && (u.uid || u.id)) return u.uid || u.id;
  }
  return DASHBOARD_DATA.student.id;
}

/**
 * Global Real-Time Notifications State & Cache
 */
let CURRENT_NOTIFICATIONS = [];
let ACTIVE_VIEWING_NOTIF = null;
let REALTIME_STORED_NOTIFS = [];
let knownNotifIds = new Set();
let isInitialNotifLoad = true;

function getReadNotificationIds() {
  try {
    const raw = localStorage.getItem('nexvion_read_notif_ids');
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
}

function saveReadNotificationId(id) {
  try {
    const set = getReadNotificationIds();
    set.add(String(id));
    localStorage.setItem('nexvion_read_notif_ids', JSON.stringify([...set]));
  } catch (e) {}
}

function removeReadNotificationId(id) {
  try {
    const set = getReadNotificationIds();
    set.delete(String(id));
    localStorage.setItem('nexvion_read_notif_ids', JSON.stringify([...set]));
  } catch (e) {}
}

function formatFullDateTime(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Recently';
  }
}

/**
 * Render Notification Items
 */
async function renderNotifications() {
  const container = document.getElementById('notifListContainer');
  const badge = document.getElementById('notifBadge');
  const unreadLabel = document.getElementById('notifUnreadCount');
  const mobSub = document.getElementById('mobSheetNotifSub');
  if (!container) return;

  const studentId = getActiveStudentId();
  let notifications = [];

  // 1. Check in-memory real-time stream
  if (REALTIME_STORED_NOTIFS && REALTIME_STORED_NOTIFS.length > 0) {
    notifications = [...REALTIME_STORED_NOTIFS];
  }

  // 2. Fetch service / local storage inbox
  try {
    if (typeof window !== 'undefined' && window.NexvionServices && window.NexvionServices.getStudentInbox) {
      const inbox = await window.NexvionServices.getStudentInbox(studentId);
      if (Array.isArray(inbox) && inbox.length > 0) {
        notifications = [...inbox, ...notifications];
      }
    } else if (typeof window !== 'undefined' && (window.location.port === '3000' || window.__ENABLE_LOCAL_API__)) {
      const resp = await fetch(`/api/notifications/inbox?userId=${encodeURIComponent(studentId)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.inbox && data.inbox.length > 0) {
          notifications = [...data.inbox, ...notifications];
        }
      }
    }
  } catch (err) {
    // network fallback
  }

  // 3. Fallback / seed initial default announcements if empty
  if (!notifications || notifications.length === 0) {
    notifications = DASHBOARD_DATA.notifications.map(n => ({
      id: String(n.id),
      title: n.title,
      message: n.message || n.title,
      type: n.type || 'Announcement',
      sender: n.sender || 'Academic Director',
      deepLink: n.deepLink || '',
      createdAt: n.createdAt || new Date().toISOString(),
      read: !n.unread
    }));
  }

  // Deduplicate by ID
  const seenIds = new Set();
  const deduped = [];
  for (const n of notifications) {
    const idStr = String(n.id);
    if (!seenIds.has(idStr)) {
      seenIds.add(idStr);
      deduped.push({
        ...n,
        id: idStr
      });
    }
  }

  // Apply persistent read states from localStorage
  const readSet = getReadNotificationIds();
  deduped.forEach(n => {
    if (readSet.has(n.id)) {
      n.read = true;
    }
  });

  // Sort newest first
  deduped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  CURRENT_NOTIFICATIONS = deduped;

  const unreadCount = deduped.filter(n => !n.read).length;
  if (unreadLabel) unreadLabel.textContent = `${unreadCount} NEW`;
  if (mobSub) mobSub.textContent = unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up';
  
  if (badge) {
    if (unreadCount > 0) {
      badge.style.display = 'block';
      badge.classList.add('pulse');
    } else {
      badge.style.display = 'none';
      badge.classList.remove('pulse');
    }
  }

  if (deduped.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted, #94A3B8); font-size: 0.8125rem;">
        No notifications yet. You're all caught up!
      </div>
    `;
    return;
  }

  container.innerHTML = deduped.slice(0, 10).map(n => {
    let icon = '📢';
    let catBadge = 'Notice';
    const typeLower = (n.type || '').toLowerCase();
    if (typeLower.includes('class')) { icon = '📡'; catBadge = 'Live Class'; }
    else if (typeLower.includes('enrollment') || typeLower.includes('batch')) { icon = '🎓'; catBadge = 'Enrollment'; }
    else if (typeLower.includes('project')) { icon = '🛠️'; catBadge = 'Lab'; }
    else if (typeLower.includes('cert')) { icon = '🏆'; catBadge = 'Credential'; }
    else if (typeLower.includes('system')) { icon = '⚙️'; catBadge = 'System'; }

    const timeAgo = formatTimeAgo(n.createdAt || n.time || new Date().toISOString());
    const isUnread = !n.read;

    return `
      <div class="notif-item ${isUnread ? 'unread' : ''}" style="display: flex; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.15s ease; ${isUnread ? 'background: rgba(127, 82, 255, 0.08); border-left: 3px solid var(--primary, #7F52FF);' : 'background: transparent;'}" onclick="openNotificationDetailModal('${escapeHtml(n.id)}')">
        <div style="font-size: 1.15rem; line-height: 1.2; flex-shrink: 0;">${icon}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <span style="font-size: 0.65rem; font-family: var(--font-mono); font-weight: 700; color: var(--primary, #7F52FF); text-transform: uppercase;">${catBadge}</span>
            <span class="notif-item-time" style="font-size: 0.6875rem; color: #94A3B8;">${timeAgo}</span>
          </div>
          <div class="notif-item-title" style="font-size: 0.82rem; font-weight: ${isUnread ? '700' : '500'}; color: var(--neutral-obsidian, #0F172A); word-break: break-word; line-height: 1.35;">${escapeHtml(n.title)}</div>
          ${n.message && n.message !== n.title ? `<div style="font-size: 0.72rem; color: #64748B; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(n.message)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Open Full Notification Details Modal
 */
window.openNotificationDetailModal = function(notifId) {
  closeAllDropdowns();
  const notif = CURRENT_NOTIFICATIONS.find(n => n.id === notifId);
  if (!notif) return;

  ACTIVE_VIEWING_NOTIF = notif;
  saveReadNotificationId(notifId);
  notif.read = true;
  renderNotifications();

  const backdrop = document.getElementById('notifDetailModalBackdrop');
  const pill = document.getElementById('notifDetailPill');
  const title = document.getElementById('modalNotifDetailTitle');
  const sender = document.getElementById('notifDetailSender');
  const time = document.getElementById('notifDetailTime');
  const body = document.getElementById('notifDetailBody');
  const readBadge = document.getElementById('notifDetailReadBadge');
  const actionBtn = document.getElementById('notifDetailActionBtn');
  const toggleBtn = document.getElementById('notifToggleReadBtn');

  if (pill) {
    let catClass = 'announcement';
    let catText = '📢 ANNOUNCEMENT';
    const t = (notif.type || '').toLowerCase();
    if (t.includes('class')) { catClass = 'class'; catText = '📡 LIVE CLASS'; }
    else if (t.includes('enrollment')) { catClass = 'enrollment'; catText = '🎓 ENROLLMENT'; }
    else if (t.includes('project')) { catClass = 'project'; catText = '🛠️ PROJECT LAB'; }
    else if (t.includes('cert')) { catClass = 'class'; catText = '🏆 CREDENTIAL CRITERIA'; }
    else if (t.includes('system')) { catClass = 'system'; catText = '⚙️ SYSTEM NOTICE'; }
    
    pill.className = `notif-detail-pill ${catClass}`;
    pill.textContent = catText;
  }

  if (title) title.textContent = notif.title;
  if (sender) sender.textContent = notif.sender || 'NEXVION AI Academy';
  if (time) time.textContent = formatFullDateTime(notif.createdAt);
  if (body) body.textContent = notif.message || notif.title;

  if (readBadge) {
    readBadge.innerHTML = `<span style="color:#059669; font-weight:700;">● Read</span>`;
  }

  if (toggleBtn) {
    toggleBtn.textContent = 'Mark as Unread';
  }

  if (actionBtn) {
    if (notif.deepLink) {
      actionBtn.style.display = 'inline-flex';
      actionBtn.href = notif.deepLink;
      actionBtn.onclick = () => closeNotificationDetailModal();
    } else {
      actionBtn.style.display = 'none';
    }
  }

  if (backdrop) backdrop.classList.add('active');
};

/**
 * Close Notification Details Modal
 */
window.closeNotificationDetailModal = function() {
  const backdrop = document.getElementById('notifDetailModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
  ACTIVE_VIEWING_NOTIF = null;
};

/**
 * Toggle Active Notification Read/Unread State
 */
window.toggleActiveNotificationReadState = function() {
  if (!ACTIVE_VIEWING_NOTIF) return;
  const readSet = getReadNotificationIds();
  const isCurrentlyRead = readSet.has(ACTIVE_VIEWING_NOTIF.id);

  if (isCurrentlyRead) {
    removeReadNotificationId(ACTIVE_VIEWING_NOTIF.id);
    ACTIVE_VIEWING_NOTIF.read = false;
    showToast('Marked as unread');
    const readBadge = document.getElementById('notifDetailReadBadge');
    if (readBadge) readBadge.innerHTML = `<span style="color:#EF4444; font-weight:700;">● Unread</span>`;
    const toggleBtn = document.getElementById('notifToggleReadBtn');
    if (toggleBtn) toggleBtn.textContent = 'Mark as Read';
  } else {
    saveReadNotificationId(ACTIVE_VIEWING_NOTIF.id);
    ACTIVE_VIEWING_NOTIF.read = true;
    showToast('Marked as read');
    const readBadge = document.getElementById('notifDetailReadBadge');
    if (readBadge) readBadge.innerHTML = `<span style="color:#059669; font-weight:700;">● Read</span>`;
    const toggleBtn = document.getElementById('notifToggleReadBtn');
    if (toggleBtn) toggleBtn.textContent = 'Mark as Unread';
  }
  renderNotifications();
};

/**
 * Handle notification click with deep link and mark-read
 */
window.handleNotificationItemClick = async function(notifId, deepLink, title) {
  openNotificationDetailModal(notifId);
};

/**
 * Mark all notifications as read
 */
window.markAllNotificationsRead = async function(event) {
  if (event && event.stopPropagation) event.stopPropagation();
  try {
    CURRENT_NOTIFICATIONS.forEach(n => {
      saveReadNotificationId(n.id);
      n.read = true;
    });
    const studentId = getActiveStudentId();
    if (typeof window !== 'undefined' && window.NexvionServices && window.NexvionServices.markAllNotificationsRead) {
      await window.NexvionServices.markAllNotificationsRead(studentId);
    }
    showToast('All notifications marked as read.');
    renderNotifications();
  } catch (e) {
    showToast('All notifications marked as read.');
    renderNotifications();
  }
};

/**
 * Real-Time Notifications Engine (Firestore + Storage Event Bus)
 */
function initRealtimeNotifications() {
  // 1. Initialize Firestore listener
  if (typeof firebase !== 'undefined') {
    try {
      let app;
      try {
        app = firebase.app();
      } catch (noApp) {
        app = firebase.initializeApp(window.firebaseConfig || {
          apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
          authDomain: "nexvion-ai.firebaseapp.com",
          projectId: "nexvion-ai",
          storageBucket: "nexvion-ai.firebasestorage.app"
        });
      }
      const db = app.firestore ? app.firestore() : firebase.firestore();

      // Listen to public announcements
      db.collection('announcements')
        .orderBy('createdAt', 'desc')
        .limit(15)
        .onSnapshot((snapshot) => {
          handleIncomingRealtimeSnapshot(snapshot, 'Announcement');
        }, (err) => {
          console.warn('Realtime announcements listener notice:', err.message);
        });

      // Listen to broadcast notifications
      db.collection('notifications')
        .orderBy('date', 'desc')
        .limit(15)
        .onSnapshot((snapshot) => {
          handleIncomingRealtimeSnapshot(snapshot, 'Notification');
        }, (err) => {
          console.warn('Realtime notifications listener notice:', err.message);
        });
    } catch (err) {
      console.warn('Realtime Firestore initialization warning:', err.message);
    }
  }

  // 2. Storage event bus across browser tabs & WebViews
  window.addEventListener('storage', (e) => {
    if (e.key === 'nexvion_broadcast_notifications' || e.key === 'nexvion_read_notif_ids' || e.key === 'nexvion_current_user') {
      renderNotifications();
      renderStudentProfile();
    }
  });

  // 3. Periodic background refresh (every 30 seconds)
  setInterval(() => {
    renderNotifications();
  }, 30000);
}

function handleIncomingRealtimeSnapshot(snapshot, defaultType) {
  if (!snapshot || !snapshot.docChanges) return;
  const changes = snapshot.docChanges();
  let hasNew = false;
  let latestNewItem = null;

  changes.forEach(change => {
    const data = change.doc.data() || {};
    const id = change.doc.id;
    const createdAt = data.createdAt || data.createdDate || data.date || new Date().toISOString();

    const notifItem = {
      id: id,
      title: data.title || 'Platform Notification',
      message: data.message || data.content || data.body || '',
      type: data.type || defaultType || 'Announcement',
      sender: data.sentBy || data.author || data.createdBy || 'Academy Team',
      deepLink: data.deepLink || data.link || '',
      createdAt: createdAt,
      read: false
    };

    // Store in realtime array
    const existingIdx = REALTIME_STORED_NOTIFS.findIndex(n => n.id === id);
    if (existingIdx >= 0) {
      REALTIME_STORED_NOTIFS[existingIdx] = notifItem;
    } else {
      REALTIME_STORED_NOTIFS.unshift(notifItem);
    }

    if (change.type === 'added') {
      if (!isInitialNotifLoad && !knownNotifIds.has(id)) {
        hasNew = true;
        latestNewItem = notifItem;
      }
      knownNotifIds.add(id);
    }
  });

  isInitialNotifLoad = false;
  renderNotifications();

  if (hasNew && latestNewItem) {
    triggerRealtimeNotificationAlert(latestNewItem);
  }
}

/**
 * Play Subtle Synthetic Audio Chime (Web Audio API)
 */
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      // Audio autoplay policy on mobile requires prior user tap
      ctx.close().catch(() => {});
      return;
    }
    const now = ctx.currentTime;

    // Chime Note 1: 880 Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.04, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Chime Note 2: 1320 Hz
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.1);
    gain2.gain.setValueAtTime(0.04, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch (e) {}
}

/**
 * Trigger Realtime Alert (Badge Pulse, Chime & Toast Banner)
 */
function triggerRealtimeNotificationAlert(item) {
  playNotificationChime();

  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.style.display = 'block';
    badge.classList.add('pulse');
  }

  showRealtimeBanner(item);

  // CRITICAL FIX: Display outside-the-browser notification toast on Windows / Mac / Android
  if (window.NexvionNotifications && typeof window.NexvionNotifications.displaySystemNotification === 'function') {
    window.NexvionNotifications.displaySystemNotification(item.title || 'NEXVION AI', {
      body: item.message || 'You have a new update from Academy.',
      tag: 'rt-notif-' + (item.id || Date.now()),
      data: { url: './dashboard.html', id: item.id }
    });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(item.title || 'NEXVION AI', {
          body: item.message || 'You have a new update from Academy.',
          icon: './icons/icon-192.png',
          badge: './icons/icon-192.png',
          requireInteraction: true,
          tag: 'rt-notif-' + (item.id || Date.now())
        });
      }).catch(() => {});
    } else {
      try {
        new Notification(item.title || 'NEXVION AI', {
          body: item.message || 'You have a new update from Academy.',
          icon: './icons/icon-192.png'
        });
      } catch(e) {}
    }
  }
}

let bannerTimeout = null;
function showRealtimeBanner(item) {
  const banner = document.getElementById('dashRealtimeBanner');
  const title = document.getElementById('rtBannerTitle');
  const sub = document.getElementById('rtBannerSub');
  const icon = document.getElementById('rtBannerIcon');
  if (!banner || !title) return;

  let iconChar = '📢';
  const typeLower = (item.type || '').toLowerCase();
  if (typeLower.includes('class')) iconChar = '📡';
  else if (typeLower.includes('enrollment')) iconChar = '🎓';
  else if (typeLower.includes('project')) iconChar = '🛠️';
  else if (typeLower.includes('cert')) iconChar = '🏆';

  if (icon) icon.textContent = iconChar;
  title.textContent = item.title;
  if (sub) sub.textContent = item.message ? item.message.slice(0, 60) + '...' : 'New update dispatched from Academy';

  banner.dataset.notifId = item.id;
  banner.classList.add('show');

  if (bannerTimeout) clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => {
    dismissRealtimeBanner();
  }, 7000);
}

window.dismissRealtimeBanner = function() {
  const banner = document.getElementById('dashRealtimeBanner');
  if (banner) banner.classList.remove('show');
};

window.handleRealtimeBannerClick = function() {
  const banner = document.getElementById('dashRealtimeBanner');
  if (banner && banner.dataset.notifId) {
    openNotificationDetailModal(banner.dataset.notifId);
  }
  dismissRealtimeBanner();
};

/* ==============================================================================
   2.5 REAL-TIME COURSE VIDEOS & WORKBENCH PLAYER ENGINE
   ============================================================================== */
let COURSE_VIDEOS = [];
let ACTIVE_PLAYING_VIDEO = null;

function getWatchedVideoIds() {
  try {
    const raw = localStorage.getItem('nexvion_watched_videos');
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
}

function saveWatchedVideoId(id) {
  try {
    const s = getWatchedVideoIds();
    s.add(String(id));
    localStorage.setItem('nexvion_watched_videos', JSON.stringify([...s]));
  } catch (e) {}
}

function removeWatchedVideoId(id) {
  try {
    const s = getWatchedVideoIds();
    s.delete(String(id));
    localStorage.setItem('nexvion_watched_videos', JSON.stringify([...s]));
  } catch (e) {}
}

function parseFirestoreVideoDoc(doc) {
  if (!doc) return null;
  const data = { id: doc.name ? doc.name.split('/').pop() : '' };
  if (doc.fields) {
    for (const [key, val] of Object.entries(doc.fields)) {
      if (val.stringValue !== undefined) data[key] = val.stringValue;
      else if (val.integerValue !== undefined) data[key] = parseInt(val.integerValue, 10);
      else if (val.booleanValue !== undefined) data[key] = val.booleanValue;
      else if (val.timestampValue !== undefined) data[key] = val.timestampValue;
    }
  }
  return data;
}

/**
 * Initialize Real-Time Course Videos from Firestore & REST
 */
async function initRealtimeVideos() {
  console.log('[Dashboard] Initializing real-time course videos stream...');
  
  // 1. Attempt Firestore live subscription
  if (typeof firebase !== 'undefined') {
    try {
      let app;
      try {
        app = firebase.app();
      } catch (noApp) {
        app = firebase.initializeApp(window.firebaseConfig || {
          apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
          authDomain: "nexvion-ai.firebaseapp.com",
          projectId: "nexvion-ai",
          storageBucket: "nexvion-ai.firebasestorage.app"
        });
      }
      const db = app.firestore ? app.firestore() : firebase.firestore();
      db.collection('videos').onSnapshot((snapshot) => {
        const vids = [];
        snapshot.forEach(doc => {
          vids.push({ id: doc.id, ...doc.data() });
        });
        if (vids.length > 0) {
          console.log('[Dashboard] Loaded', vids.length, 'videos via Firestore onSnapshot');
          handleVideosLoaded(vids);
        } else {
          fetchVideosRestFallback();
        }
      }, (err) => {
        console.warn('[Dashboard] Firestore videos onSnapshot notice:', err.message);
        fetchVideosRestFallback();
      });
      return;
    } catch (e) {
      console.warn('[Dashboard] Firebase video listener notice:', e.message);
    }
  }

  // 2. Direct REST Fallback
  fetchVideosRestFallback();
}

async function fetchVideosRestFallback() {
  try {
    const res = await fetch('https://firestore.googleapis.com/v1/projects/nexvion-ai/databases/(default)/documents/videos');
    if (!res.ok) return;
    const json = await res.json();
    if (json.documents && Array.isArray(json.documents)) {
      const vids = json.documents.map(parseFirestoreVideoDoc).filter(Boolean);
      console.log('[Dashboard] Loaded', vids.length, 'videos via Firestore REST API');
      handleVideosLoaded(vids);
    }
  } catch (err) {
    console.warn('[Dashboard] REST fetch videos notice:', err.message);
  }
}

/**
 * Hydrate Loaded Videos into Dashboard State & UI
 */
function handleVideosLoaded(vids) {
  if (!Array.isArray(vids) || vids.length === 0) return;

  const activeVids = vids.filter(v => v.visibility !== 'Archived' && v.status !== 'Archived');
  if (activeVids.length === 0) return;

  COURSE_VIDEOS = activeVids;
  const watchedSet = getWatchedVideoIds();
  const watchedCount = activeVids.filter(v => watchedSet.has(v.id)).length;

  // Update total & completed classes metrics
  DASHBOARD_DATA.course.totalClasses = Math.max(20, activeVids.length);
  DASHBOARD_DATA.course.completedClasses = watchedCount;
  DASHBOARD_DATA.course.progress = Math.round((watchedCount / DASHBOARD_DATA.course.totalClasses) * 100);

  // Identify next unwatched video
  const nextVideo = activeVids.find(v => !watchedSet.has(v.id)) || activeVids[0];

  DASHBOARD_DATA.nextClass = {
    videoId: nextVideo.id,
    video: nextVideo,
    moduleTag: `${(nextVideo.courseTitle || 'AI FOUNDATIONS').toUpperCase()} • ${(nextVideo.classTitle || 'CLASS 01').toUpperCase()}`,
    title: nextVideo.title,
    description: `Lecture ready to stream (${nextVideo.duration || '25:00'} • ${nextVideo.resolution || '1080p HD'}). Click below to watch on your workbench.`,
    type: "Video Lecture",
    duration: nextVideo.duration || "25:00",
    videoUrl: nextVideo.embedUrl || nextVideo.youtubeUrl || ''
  };

  // Populate recent classes array
  DASHBOARD_DATA.recentClasses = activeVids.map(v => {
    const isDone = watchedSet.has(v.id);
    let ytThumb = v.thumbnailUrl || '';
    if (!ytThumb && v.youtubeId) {
      ytThumb = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
    }
    return {
      id: v.id,
      videoId: v.id,
      title: v.title,
      module: v.classTitle || v.courseTitle || 'Core Class',
      duration: v.duration || '25:00',
      resolution: v.resolution || '1080p HD',
      thumbnailUrl: ytThumb,
      icon: isDone ? '✓' : '▶',
      status: isDone ? 'completed' : 'in-progress',
      video: v
    };
  });

  // Re-render UI components
  renderCurrentCourse();
  renderRecentClasses();
}

/**
 * Open Video Player Modal and begin stream
 */
window.openVideoPlayerModal = function(videoId) {
  closeAllDropdowns();
  if (typeof closeMobileProfileSheet === 'function') closeMobileProfileSheet();
  const video = COURSE_VIDEOS.find(v => v.id === videoId) || (DASHBOARD_DATA.nextClass && DASHBOARD_DATA.nextClass.video);
  if (!video) {
    showToast('Video details loading...');
    return;
  }
  ACTIVE_PLAYING_VIDEO = video;

  const backdrop = document.getElementById('videoPlayerModalBackdrop');
  const badge = document.getElementById('videoPlayerBadge');
  const durationBadge = document.getElementById('videoPlayerDurationBadge');
  const title = document.getElementById('modalVideoPlayerTitle');
  const courseName = document.getElementById('videoPlayerCourseName');
  const subtitle = document.getElementById('videoPlayerSubtitle');
  const iframe = document.getElementById('videoPlayerIframe');
  const btnWatched = document.getElementById('btnMarkVideoWatched');
  const btnWatchedText = document.getElementById('btnMarkVideoWatchedText');

  if (badge) badge.textContent = `🎥 ${(video.courseTitle || 'AI FOUNDATIONS').toUpperCase()} • ${(video.classTitle || 'CLASS 01').toUpperCase()}`;
  if (durationBadge) durationBadge.textContent = video.duration || '25:00';
  if (title) title.textContent = video.title || 'Course Lecture';
  if (courseName) courseName.innerHTML = `Course: <strong style="color: #F1F5F9;">${escapeHtml(video.courseTitle || 'AI Foundations')}</strong>`;
  if (subtitle) subtitle.textContent = `${video.classTitle || 'Class 01'} • ${video.resolution || '1080p HD'} • Official Academy Curriculum`;

  // Determine embed URL
  let embedUrl = video.embedUrl || '';
  if (!embedUrl && video.youtubeId) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
  } else if (!embedUrl && video.youtubeUrl) {
    const match = video.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if (match && match[1]) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }
  if (embedUrl && !embedUrl.includes('autoplay=')) {
    embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
  }

  if (iframe) {
    iframe.src = embedUrl;
  }

  const watchedSet = getWatchedVideoIds();
  const isWatched = watchedSet.has(video.id);
  if (btnWatchedText) {
    btnWatchedText.textContent = isWatched ? '✓ Completed (Click to undo)' : '✓ Mark as Completed';
  }
  if (btnWatched) {
    btnWatched.style.background = isWatched ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)';
    btnWatched.style.color = isWatched ? '#10B981' : '#F1F5F9';
    btnWatched.style.borderColor = isWatched ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.15)';
  }

  if (backdrop) backdrop.classList.add('active');
};

/**
 * Close Video Player Modal and stop stream
 */
window.closeVideoPlayerModal = function() {
  const backdrop = document.getElementById('videoPlayerModalBackdrop');
  const iframe = document.getElementById('videoPlayerIframe');
  if (iframe) {
    iframe.src = ''; // Instantly halt audio/video stream
  }
  if (backdrop) backdrop.classList.remove('active');
  ACTIVE_PLAYING_VIDEO = null;
};

/**
 * Toggle Watched Status for Currently Active Video
 */
window.toggleCurrentVideoWatched = function() {
  if (!ACTIVE_PLAYING_VIDEO) return;
  const vidId = ACTIVE_PLAYING_VIDEO.id;
  const watchedSet = getWatchedVideoIds();
  if (watchedSet.has(vidId)) {
    removeWatchedVideoId(vidId);
    showToast('Video marked as unfinished.');
  } else {
    saveWatchedVideoId(vidId);
    showToast('Lesson marked as completed! Progress updated. 🎉');
  }

  const updatedSet = getWatchedVideoIds();
  const isWatched = updatedSet.has(vidId);
  const btnWatched = document.getElementById('btnMarkVideoWatched');
  const btnWatchedText = document.getElementById('btnMarkVideoWatchedText');
  if (btnWatchedText) {
    btnWatchedText.textContent = isWatched ? '✓ Completed (Click to undo)' : '✓ Mark as Completed';
  }
  if (btnWatched) {
    btnWatched.style.background = isWatched ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)';
    btnWatched.style.color = isWatched ? '#10B981' : '#F1F5F9';
    btnWatched.style.borderColor = isWatched ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.15)';
  }

  handleVideosLoaded(COURSE_VIDEOS);
};

/**
 * Toggle Mobile Notifications from Sheet
 */
window.toggleMobileNotifications = function() {
  closeMobileProfileSheet();
  const notifDropdown = document.getElementById('notifDropdown');
  const notifBtn = document.getElementById('notifBtn');
  if (notifDropdown) {
    notifDropdown.classList.add('active');
    if (notifBtn) notifBtn.setAttribute('aria-expanded', 'true');
  }
};

/**
 * Open Account & Student Profile Details Modal
 */
window.openAccountDetailsModal = function() {
  closeAllDropdowns();
  closeMobileProfileSheet();

  let user = null;
  try {
    const raw = localStorage.getItem('nexvion_current_user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {}

  const fullName = (user && (user.fullName || user.name)) || DASHBOARD_DATA.student.name;
  const studentId = (user && (user.studentId || user.id)) || DASHBOARD_DATA.student.id;
  const email = (user && user.email) || 'student@nexvion.ai';
  const phone = (user && user.phone) || 'Not provided';
  const course = (user && (user.enrolledCourseTitle || user.enrolledCourse || user.courseTitle)) || DASHBOARD_DATA.course.name;
  const batch = (user && (user.batchName || user.batch)) || DASHBOARD_DATA.course.batch;
  const city = (user && (user.city || user.country)) || 'Global';
  const institution = (user && (user.institution || user.educationLevel)) || 'Self-Taught / Independent';
  const status = (user && user.enrollmentStatus) || 'Enrolled & Verified';
  const createdAt = (user && user.createdAt) ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Spring 2026';

  const avatar = fullName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AW';

  // Populate Modal Fields
  const heroAvatar = document.getElementById('accHeroAvatar');
  const heroName = document.getElementById('accHeroName');
  const heroId = document.getElementById('accHeroId');
  const fieldEmail = document.getElementById('accFieldEmail');
  const fieldPhone = document.getElementById('accFieldPhone');
  const fieldCourse = document.getElementById('accFieldCourse');
  const fieldBatch = document.getElementById('accFieldBatch');
  const fieldInst = document.getElementById('accFieldInstitution');
  const fieldCity = document.getElementById('accFieldCity');
  const fieldStatus = document.getElementById('accFieldStatus');
  const fieldDate = document.getElementById('accFieldDate');

  if (heroAvatar) heroAvatar.textContent = avatar;
  if (heroName) heroName.textContent = fullName;
  if (heroId) heroId.textContent = studentId;
  if (fieldEmail) fieldEmail.textContent = email;
  if (fieldPhone) fieldPhone.textContent = phone;
  if (fieldCourse) fieldCourse.textContent = course;
  if (fieldBatch) fieldBatch.textContent = batch;
  if (fieldInst) fieldInst.textContent = institution;
  if (fieldCity) fieldCity.textContent = city;
  if (fieldStatus) fieldStatus.textContent = `● ${status}`;
  if (fieldDate) fieldDate.textContent = createdAt;

  // Pre-fill edit inputs
  const editPhone = document.getElementById('editPhone');
  const editCity = document.getElementById('editCity');
  const editInst = document.getElementById('editInstitution');
  if (editPhone) editPhone.value = phone !== 'Not provided' ? phone : '';
  if (editCity) editCity.value = city !== 'Global' ? city : '';
  if (editInst) editInst.value = institution !== 'Academy Learner' ? institution : '';

  toggleEditProfileForm(false);

  const backdrop = document.getElementById('accountDetailsModalBackdrop');
  if (backdrop) backdrop.classList.add('active');
};

/**
 * Close Account Details Modal
 */
window.closeAccountDetailsModal = function() {
  const backdrop = document.getElementById('accountDetailsModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
};

/**
 * Copy Student ID with toast feedback
 */
window.copyStudentId = function() {
  const heroId = document.getElementById('accHeroId');
  const text = heroId ? heroId.textContent : 'NX-2026-8821';
  navigator.clipboard.writeText(text).then(() => {
    showToast('Student ID copied: ' + text);
  }).catch(() => {
    showToast('Student ID: ' + text);
  });
};

/**
 * Toggle Edit Profile Form in Modal
 */
window.toggleEditProfileForm = function(show) {
  const form = document.getElementById('accEditForm');
  const btn = document.getElementById('btnToggleEditProfile');
  if (form) {
    if (show) form.classList.add('active');
    else form.classList.remove('active');
  }
  if (btn) btn.style.display = show ? 'none' : 'inline-flex';
};

/**
 * Save Student Profile Changes to localStorage & Firestore
 */
window.saveStudentProfileChanges = function() {
  const phone = (document.getElementById('editPhone')?.value || '').trim();
  const city = (document.getElementById('editCity')?.value || '').trim();
  const inst = (document.getElementById('editInstitution')?.value || '').trim();

  let user = {};
  try {
    const raw = localStorage.getItem('nexvion_current_user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {}

  if (phone) user.phone = phone;
  if (city) user.city = city;
  if (inst) user.institution = inst;
  user.updatedAt = new Date().toISOString();

  localStorage.setItem('nexvion_current_user', JSON.stringify(user));

  // Sync to Cloud Firestore immediately
  if (typeof window !== 'undefined' && window.NexvionCloudSync && window.NexvionCloudSync.syncNow) {
    window.NexvionCloudSync.syncNow();
  }

  showToast('Profile information updated successfully! ✨');
  openAccountDetailsModal();
};

/**
 * Time ago formatting helper
 */
function formatTimeAgo(isoString) {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch (e) {
    return 'Recently';
  }
}

/**
 * Non-intrusive push device token registration
 */
function checkAndRegisterClientDevice() {
  try {
    if (localStorage.getItem('nexvion_device_registered_v1')) return;
    const studentId = getActiveStudentId();
    if (!studentId) return;

    const platform = /android/i.test(navigator.userAgent) ? 'android' :
                     /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' :
                     /windows|macintosh|linux/i.test(navigator.userAgent) ? 'desktop' : 'web';

    const fakeToken = `dev-tok-${platform}-${Math.random().toString(36).substring(2, 10)}`;
    if (typeof window !== 'undefined' && window.NexvionServices && window.NexvionServices.registerDeviceToken) {
      window.NexvionServices.registerDeviceToken({
        userId: studentId,
        token: fakeToken,
        platform,
        deviceModel: navigator.userAgent.slice(0, 40)
      }).catch(() => {});
    }
    localStorage.setItem('nexvion_device_registered_v1', 'true');
  } catch (e) {}
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
      if (window.innerWidth <= 768 && typeof openMobileProfileSheet === 'function') {
        openMobileProfileSheet();
        return;
      }
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

  // Close dropdowns and modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      if (typeof closeVideoPlayerModal === 'function') closeVideoPlayerModal();
      if (typeof closeNotificationDetailModal === 'function') closeNotificationDetailModal();
      if (typeof closeAccountDetailsModal === 'function') closeAccountDetailsModal();
      if (typeof closeCertModal === 'function') closeCertModal();
      if (typeof closeLockedModal === 'function') closeLockedModal();
      if (typeof closeMobileProfileSheet === 'function') closeMobileProfileSheet();
      if (typeof dismissRealtimeBanner === 'function') dismissRealtimeBanner();
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

  // Initialize Mobile Bottom Nav ScrollSpy
  initMobileScrollSpy();
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
  if (nxt && (nxt.videoId || nxt.video)) {
    openVideoPlayerModal(nxt.videoId || (nxt.video && nxt.video.id));
    return;
  }
  if (COURSE_VIDEOS && COURSE_VIDEOS.length > 0) {
    openVideoPlayerModal(COURSE_VIDEOS[0].id);
    return;
  }
  if (DASHBOARD_DATA.course.progress === 0 || nxt.duration === 'Coming Soon') {
    showToast(`Classes have not started yet. Cohort orientation schedule will be announced soon!`);
    return;
  }
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
 * Open Settings & Account Details
 */
function openProfileSettings() {
  closeAllDropdowns();
  if (typeof openAccountDetailsModal === 'function') {
    openAccountDetailsModal();
    if (typeof toggleEditProfileForm === 'function') {
      toggleEditProfileForm(true);
    }
  } else {
    showToast("Student Settings — Profile & preferences.");
  }
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
 * Mobile Bottom Navigation Section Scrolling
 */
function scrollToMobileSection(targetId) {
  // Close profile sheet if open
  closeMobileProfileSheet();

  // Update active tab visual state
  document.querySelectorAll('.mob-nav-item').forEach(item => item.classList.remove('active'));
  const activeBtn = document.getElementById(
    targetId === 'top' ? 'mobNavHome' :
    targetId === 'myCourseSection' ? 'mobNavCourse' :
    targetId === 'recentClassesSection' ? 'mobNavClasses' :
    targetId === 'projectsSection' ? 'mobNavProjects' : ''
  );
  if (activeBtn) activeBtn.classList.add('active');

  if (targetId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const main = document.querySelector('.dashboard-main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(targetId);
  if (!el) return;

  const topbar = document.getElementById('dashTopbar');
  const offset = (topbar ? topbar.offsetHeight : 64) + 12;

  // Window scroll
  const rect = el.getBoundingClientRect();
  const windowTarget = window.pageYOffset + rect.top - offset;
  window.scrollTo({ top: Math.max(0, windowTarget), behavior: 'smooth' });

  // Main container scroll if scrollable
  const main = document.querySelector('.dashboard-main');
  if (main && main.scrollHeight > main.clientHeight) {
    const mainTarget = el.offsetTop - offset;
    main.scrollTo({ top: Math.max(0, mainTarget), behavior: 'smooth' });
  }
}
window.scrollToMobileSection = scrollToMobileSection;

/**
 * Mobile Bottom Nav Profile Sheet Controller
 */
function openMobileProfileSheet() {
  const sheet = document.getElementById('mobProfileSheet');
  const backdrop = document.getElementById('mobProfileBackdrop');
  if (!sheet || !backdrop) return;

  // Sync profile details
  const stu = DASHBOARD_DATA.student;
  const course = DASHBOARD_DATA.course;

  const avatarEl = document.getElementById('mobSheetAvatar');
  const nameEl = document.getElementById('mobSheetName');
  const idEl = document.getElementById('mobSheetId');
  const emailEl = document.getElementById('mobSheetEmail');
  const courseEl = document.getElementById('mobSheetCourse');
  const batchEl = document.getElementById('mobSheetBatch');
  const statusEl = document.getElementById('mobSheetStatusBadge');

  if (avatarEl) avatarEl.textContent = stu.avatar || 'AW';
  if (nameEl) nameEl.textContent = stu.name || 'Student';
  if (idEl) idEl.textContent = `ID: ${stu.id || 'NX-2026-8821'}`;
  if (emailEl) emailEl.textContent = stu.email || (stu.name ? `${stu.name.toLowerCase().replace(/\s+/g, '.')}@nexvion.ai` : 'student@nexvion.ai');
  if (courseEl) courseEl.textContent = course.name || stu.enrolledCourse || 'AI FOUNDATIONS';
  if (batchEl) batchEl.textContent = `Batch: ${stu.batch || 'open free batch'} • ${stu.cohort || 'Spring 2026'}`;
  if (statusEl) statusEl.textContent = `● ${stu.status ? stu.status.split('•')[0].trim() : 'ENROLLED'}`;

  backdrop.classList.add('active');
  sheet.classList.add('active');

  // Highlight profile tab
  document.querySelectorAll('.mob-nav-item').forEach(item => item.classList.remove('active'));
  const profNav = document.getElementById('mobNavProfile');
  if (profNav) profNav.classList.add('active');
}
window.openMobileProfileSheet = openMobileProfileSheet;

function closeMobileProfileSheet() {
  const sheet = document.getElementById('mobProfileSheet');
  const backdrop = document.getElementById('mobProfileBackdrop');
  if (sheet) sheet.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}
window.closeMobileProfileSheet = closeMobileProfileSheet;

function toggleProfileDropdown() {
  if (window.innerWidth <= 768) {
    openMobileProfileSheet();
    return;
  }
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileDropdown) {
    profileDropdown.classList.toggle('active');
  }
}
window.toggleProfileDropdown = toggleProfileDropdown;

function initMobileScrollSpy() {
  const sections = [
    { id: 'top', tab: 'mobNavHome' },
    { id: 'myCourseSection', tab: 'mobNavCourse' },
    { id: 'recentClassesSection', tab: 'mobNavClasses' },
    { id: 'projectsSection', tab: 'mobNavProjects' }
  ];

  const updateActiveTab = () => {
    const sheet = document.getElementById('mobProfileSheet');
    if (sheet && sheet.classList.contains('active')) return;

    let current = 'top';
    const scrollPos = window.pageYOffset + 180;

    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el && el.offsetTop <= scrollPos) {
        current = sec.id;
      }
    });

    sections.forEach(sec => {
      const tab = document.getElementById(sec.tab);
      if (tab) {
        if (sec.id === current) tab.classList.add('active');
        else tab.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  const main = document.querySelector('.dashboard-main');
  if (main) main.addEventListener('scroll', updateActiveTab, { passive: true });
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

// Reactively update dashboard whenever Cloud Sync receives new cohort/batch assignment
if (typeof window !== 'undefined') {
  window.addEventListener('nexvion:student-updated', () => {
    console.log('[Dashboard] Re-rendering profile with newly assigned cohort/batch');
    renderStudentProfile();
    renderCurrentCourse();
  });
}
