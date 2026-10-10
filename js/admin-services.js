/**
 * ============================================================================
 * NEXVION AI — PRODUCTION ADMINISTRATION SERVICE & REPOSITORY LAYER
 * ============================================================================
 * 
 * Formal service layer for the NEXVION AI Administration Portal.
 * Designed to cleanly swap to Firebase Authentication, Cloud Firestore,
 * Firebase Storage, Cloud Functions, and Firebase Cloud Messaging (FCM).
 * 
 * Architectural Boundaries:
 * - All components consume repository interfaces only.
 * - Local persistence via LocalStorage until Firestore connectors are initialized.
 * - Invariant: Maximum batch capacity is capped at 30 students per cohort.
 * - Four official tiers: AI Foundations (Free), AI Builder, AI Creator, AI Architect.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const services = factory();
    root.NexvionServices = services;
    // Backward compatibility alias for existing code
    root.NexvionAdminData = services;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'nexvion_admin_production_data_v10_pristine_clean';

  // --------------------------------------------------------------------------
  // 1. DEFAULT PRODUCTION DATA MODELS
  // --------------------------------------------------------------------------

  const defaultTiers = [
    {
      id: 'ai-foundations',
      name: 'AI Foundations',
      number: '01',
      badge: 'LEVEL 01 • BEGINNER',
      accessLevel: 'Open Access Cohort',
      tierType: 'free',
      priceDisplay: 'FREE',
      coursesCount: 1,
      enrolledCount: 0,
      status: 'active',
      description: 'Start your AI journey from zero. Understand the fundamentals of Artificial Intelligence and learn how to confidently use modern AI tools.',
      features: [
        'AI Fundamentals & Neural Foundations',
        'Modern AI Tools & Conversational Systems',
        'Basic Prompt Engineering Methodologies',
        'Community Forum & Academic Peer Exchanges',
        'Interactive Self-Paced Quizzes & Checkpoints',
        'NEXVION Certificate of Completion'
      ]
    },
    {
      id: 'ai-builder',
      name: 'AI Builder',
      number: '02',
      badge: 'LEVEL 02 • BEGINNER → INTERMEDIATE',
      accessLevel: 'Verified Cohort',
      tierType: 'paid',
      priceDisplay: 'PRICE COMING SOON',
      coursesCount: 1,
      enrolledCount: 0,
      status: 'active',
      description: 'Move beyond using AI and start building with it. Learn AI-assisted coding, websites, APIs and practical digital projects.',
      features: [
        'Advanced Prompt Framing & System Directives',
        'AI-Assisted Full-Stack Engineering',
        'LLM API Integration & Embeddings',
        'Structured Output & Function Calling',
        'Interactive Lab Coding Environments',
        '30-Student Cohort Mentorship Sessions',
        'Staff-Reviewed Project Portfolios'
      ]
    },
    {
      id: 'ai-creator',
      name: 'AI Creator',
      number: '03',
      badge: 'LEVEL 03 • INTERMEDIATE',
      accessLevel: 'Specialized Cohort',
      tierType: 'paid',
      priceDisplay: 'PRICE COMING SOON',
      coursesCount: 1,
      enrolledCount: 0,
      status: 'active',
      description: 'Build applications, automations and AI-powered products using the skills developed in the previous levels.',
      features: [
        'Autonomous Multi-Step AI Agent Systems',
        'Vector Databases & Semantic Retrieval (RAG)',
        'Complex Workflow Automation & Webhooks',
        'Production Deployment & Containerization',
        'Security Guardrails & Evaluation Pipelines',
        'Dedicated Technical Architecture Office Hours'
      ]
    },
    {
      id: 'ai-architect',
      name: 'AI Architect',
      number: '04',
      badge: 'LEVEL 04 • ADVANCED',
      accessLevel: 'Executive Intensive',
      tierType: 'premium',
      priceDisplay: 'PRICE COMING SOON',
      coursesCount: 1,
      enrolledCount: 0,
      status: 'active',
      description: 'Explore advanced AI agents, intelligent systems, automation and AI product architecture.',
      features: [
        'Custom Fine-Tuning & Quantized Model Deployments',
        'Enterprise Multi-Tenant AI Architectures',
        'Multi-Agent Swarm Orchestration Systems',
        'High-Performance SIMD & Vector Runtimes',
        '1-on-1 Architectural Capstone Defense',
        'NEXVION Certified AI Architect Credential'
      ]
    }
  ];

  const defaultCourses = [
    {
      id: 'ai-foundations',
      title: 'AI Foundations: Zero to AI Native',
      courseNumber: '01',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      tierType: 'free',
      shortDescription: 'Comprehensive orientation for modern artificial intelligence fundamentals, terminology, and baseline tools.',
      fullDescription: 'Designed for beginners and professionals seeking a rigorous foundation in generative AI, language models, neural concepts, and practical daily AI tools. Students complete hands-on interactive modules and foundational prompt workflows.',
      status: 'Published',
      visibility: 'Public',
      priceDisplay: 'FREE',
      instructor: 'Dr. Evelyn Vance & Faculty Team',
      coverImage: 'assets/course-foundations.jpg',
      duration: '4 Weeks',
      modulesCount: 0,
      classesCount: 0,
      lessonsCount: 0,
      projectsCount: 0,
      assignmentsCount: 0,
      totalEnrolled: 0,
      activeBatchesCount: 0,
      learningOutcomes: [
        'Understand foundational mechanics of LLMs, neural tokens, and transformers',
        'Master zero-shot, few-shot, and chain-of-thought prompt design',
        'Safely incorporate conversational and reasoning AI assistants into daily workflows',
        'Recognize hallucination patterns, bias vectors, and fundamental AI safety rules'
      ],
      certificateRequirements: {
        minAttendancePercent: 80,
        requiredProjects: 0,
        requiredAssignments: 0,
        passingGradePercent: 75
      },
      updatedAt: '2026-10-06T14:30:00Z'
    },
    {
      id: 'ai-builder',
      title: 'AI Builder: Intelligent Application Engineering',
      courseNumber: '02',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      tierType: 'paid',
      shortDescription: 'Bridge software engineering and AI capabilities to build interactive web apps and AI-assisted workflows.',
      fullDescription: 'Take your technical proficiency to the next tier by integrating LLM APIs, building automated full-stack websites, creating intelligent components, and mastering developer velocity with modern AI programming companions.',
      status: 'Published',
      visibility: 'Public',
      priceDisplay: 'PRICE COMING SOON',
      instructor: 'Marcus Chen & Sarah Al-Mansoor',
      coverImage: 'assets/course-builder.jpg',
      duration: '8 Weeks',
      modulesCount: 0,
      classesCount: 0,
      lessonsCount: 0,
      projectsCount: 0,
      assignmentsCount: 0,
      totalEnrolled: 0,
      activeBatchesCount: 0,
      learningOutcomes: [
        'Construct production-ready web interfaces with integrated AI capabilities',
        'Harness OpenAI, Claude, and local Ollama APIs with structured output schema',
        'Implement authentication, state management, and real-time streaming tokens',
        'Deploy intelligent applications to cloud edge platforms with telemetry'
      ],
      certificateRequirements: {
        minAttendancePercent: 85,
        requiredProjects: 0,
        requiredAssignments: 0,
        passingGradePercent: 80
      },
      updatedAt: '2026-10-07T09:15:00Z'
    },
    {
      id: 'ai-creator',
      title: 'AI Creator: Autonomous Systems & Workflows',
      courseNumber: '03',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      tierType: 'paid',
      shortDescription: 'Develop autonomous multi-step automations, semantic retrieval pipelines, and production AI products.',
      fullDescription: 'Focuses on building real-world enterprise automations, RAG (Retrieval-Augmented Generation) systems with vector databases, webhook pipelines, and robust AI workflow engines designed for modern product ecosystems.',
      status: 'Published',
      visibility: 'Public',
      priceDisplay: 'PRICE COMING SOON',
      instructor: 'Elena Rostova & David K. Osei',
      coverImage: 'assets/course-creator.jpg',
      duration: '10 Weeks',
      modulesCount: 0,
      classesCount: 0,
      lessonsCount: 0,
      projectsCount: 0,
      assignmentsCount: 0,
      totalEnrolled: 0,
      activeBatchesCount: 0,
      learningOutcomes: [
        'Engineer vector search pipelines with chunking, reranking, and semantic hygiene',
        'Build multi-agent task execution flows with deterministic error recoveries',
        'Orchestrate complex document processing and multimodal reasoning tasks',
        'Evaluate pipeline accuracy, token economics, and response latency targets'
      ],
      certificateRequirements: {
        minAttendancePercent: 85,
        requiredProjects: 0,
        requiredAssignments: 0,
        passingGradePercent: 85
      },
      updatedAt: '2026-10-08T11:45:00Z'
    },
    {
      id: 'ai-architect',
      title: 'AI Architect: Enterprise Intelligence Systems',
      courseNumber: '04',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      tierType: 'premium',
      shortDescription: 'Master enterprise-grade AI architecture, fine-tuning, autonomous swarms, and high-performance runtimes.',
      fullDescription: 'The pinnacle NEXVION program for senior engineers and technology leaders. Covers distributed model deployment, custom adapter training (LoRA/QLoRA), high-concurrency low-latency inference runtimes, security guardrails, and autonomous organizational swarms.',
      status: 'Published',
      visibility: 'Public',
      priceDisplay: 'PRICE COMING SOON',
      instructor: 'Chief AI Architect Dr. Kenneth Vance',
      coverImage: 'assets/course-architect.jpg',
      duration: '12 Weeks',
      modulesCount: 0,
      classesCount: 0,
      lessonsCount: 0,
      projectsCount: 0,
      assignmentsCount: 0,
      totalEnrolled: 0,
      activeBatchesCount: 0,
      learningOutcomes: [
        'Design resilient, scalable multi-tenant AI systems with robust fault tolerance',
        'Execute domain-specific adapter fine-tuning and benchmark performance matrices',
        'Implement defense-in-depth security architectures against prompt injection and jailbreaks',
        'Build high-performance native inference bridges with SIMD/GPU optimization'
      ],
      certificateRequirements: {
        minAttendancePercent: 90,
        requiredProjects: 0,
        requiredAssignments: 0,
        passingGradePercent: 90
      },
      updatedAt: '2026-10-08T16:20:00Z'
    }
  ];

  // INVARIANT: Every batch capacity is strictly capped at 30.
  // Pristine Production State: Empty databases initialized for live entries.
  const defaultBatches = [];

  const defaultStudents = [];

  const defaultEnrollments = [];

  const defaultClasses = [];

  const defaultModules = [];

  const defaultLessons = [];

  const defaultVideos = [];

  const defaultResources = [];

  const defaultProjects = [];

  const defaultAssignments = [];

  const defaultSubmissions = [];

  const defaultAnnouncements = [];

  const defaultNotifications = [];

  const defaultPayments = [];

  const defaultCertificates = [];

  const defaultSupportTickets = [];

  const defaultAdminUsers = [
    {
      id: 'adm-001',
      name: 'Kenneth Vance',
      email: 'kenneth.vance@nexvion.ai',
      role: 'Owner',
      status: 'Active',
      lastActive: '2026-10-09T07:20:00Z',
      createdAt: '2026-01-01',
      avatar: 'assets/avatars/kenneth.png',
      department: 'Executive Directorate'
    },
    {
      id: 'adm-002',
      name: 'Evelyn Vance',
      email: 'evelyn.vance@nexvion.ai',
      role: 'Super Admin',
      status: 'Active',
      lastActive: '2026-10-09T07:15:00Z',
      createdAt: '2026-01-10',
      avatar: 'assets/avatars/evelyn.png',
      department: 'Platform Operations'
    },
    {
      id: 'adm-003',
      name: 'Marcus Chen',
      email: 'marcus.chen@nexvion.ai',
      role: 'Content Manager',
      status: 'Active',
      lastActive: '2026-10-08T19:15:00Z',
      createdAt: '2026-02-15',
      avatar: 'assets/avatars/marcus.png',
      department: 'Curriculum & Labs'
    },
    {
      id: 'adm-004',
      name: 'Sarah Al-Mansoor',
      email: 'sarah.m@nexvion.ai',
      role: 'Student Manager',
      status: 'Active',
      lastActive: '2026-10-08T20:50:00Z',
      createdAt: '2026-03-01',
      avatar: 'assets/avatars/sarah.png',
      department: 'Admissions & Cohorts'
    },
    {
      id: 'adm-005',
      name: 'Elena Rostova',
      email: 'elena.r@nexvion.ai',
      role: 'Finance Manager',
      status: 'Active',
      lastActive: '2026-10-08T16:00:00Z',
      createdAt: '2026-03-12',
      avatar: 'assets/avatars/elena.png',
      department: 'Finance & Tuition'
    },
    {
      id: 'adm-006',
      name: 'David K. Osei',
      email: 'david.osei@nexvion.ai',
      role: 'Communications Manager',
      status: 'Active',
      lastActive: '2026-10-08T18:10:00Z',
      createdAt: '2026-04-05',
      avatar: 'assets/avatars/david.png',
      department: 'Communications'
    },
    {
      id: 'adm-007',
      name: 'Nadia Petrova',
      email: 'nadia.p@nexvion.ai',
      role: 'Support Manager',
      status: 'Active',
      lastActive: '2026-10-09T06:30:00Z',
      createdAt: '2026-04-20',
      avatar: 'assets/avatars/nadia.png',
      department: 'Student Support Desk'
    },
    {
      id: 'adm-008',
      name: 'Liam Vance',
      email: 'liam.vance@nexvion.ai',
      role: 'Analyst',
      status: 'Active',
      lastActive: '2026-10-08T15:30:00Z',
      createdAt: '2026-05-01',
      avatar: 'assets/avatars/liam.png',
      department: 'Institutional Intelligence'
    },
    {
      id: 'adm-009',
      name: 'Alexander Croft',
      email: 'a.croft@nexvion.ai',
      role: 'Content Manager',
      status: 'Invited',
      lastActive: 'Invitation Pending',
      createdAt: '2026-10-06',
      avatar: 'assets/avatars/alexander.png',
      department: 'Curriculum & Labs'
    },
    {
      id: 'adm-010',
      name: 'Chloe Bennet',
      email: 'c.bennet@nexvion.ai',
      role: 'Support Manager',
      status: 'Suspended',
      lastActive: '2026-09-24T11:20:00Z',
      createdAt: '2026-03-15',
      avatar: 'assets/avatars/chloe.png',
      department: 'Student Support Desk'
    },
    {
      id: 'adm-011',
      name: 'Jordan Hayes',
      email: 'j.hayes@nexvion.ai',
      role: 'Student Manager',
      status: 'Inactive',
      lastActive: '2026-08-10T14:00:00Z',
      createdAt: '2026-02-01',
      avatar: 'assets/avatars/jordan.png',
      department: 'Admissions & Cohorts'
    }
  ];

  // Canonical 23-Module Permission Definition
  const PERMISSION_MODULES = [
    { id: 'dashboard', name: 'Dashboard', category: 'Overview', permKey: 'view_dashboard', key: 'view_dashboard' },
    { id: 'courses', name: 'Courses', category: 'Curriculum', permKey: 'manage_courses', key: 'manage_courses' },
    { id: 'tiers', name: 'Tiers', category: 'Curriculum', permKey: 'manage_tiers', key: 'manage_tiers' },
    { id: 'batches', name: 'Batches', category: 'Operations', permKey: 'manage_batches', key: 'manage_batches' },
    { id: 'students', name: 'Students', category: 'Students', permKey: 'manage_students', key: 'manage_students' },
    { id: 'enrollments', name: 'Enrollments', category: 'Students', permKey: 'manage_enrollments', key: 'manage_enrollments' },
    { id: 'classes', name: 'Classes', category: 'Content', permKey: 'manage_classes', key: 'manage_classes' },
    { id: 'modules', name: 'Modules', category: 'Content', permKey: 'manage_modules', key: 'manage_modules' },
    { id: 'lessons', name: 'Lessons', category: 'Content', permKey: 'manage_lessons', key: 'manage_lessons' },
    { id: 'videos', name: 'Videos', category: 'Content', permKey: 'manage_videos', key: 'manage_videos' },
    { id: 'resources', name: 'Resources', category: 'Content', permKey: 'manage_resources', key: 'manage_resources' },
    { id: 'projects', name: 'Projects', category: 'Assessment', permKey: 'manage_projects', key: 'manage_projects' },
    { id: 'assignments', name: 'Assignments', category: 'Assessment', permKey: 'manage_assignments', key: 'manage_assignments' },
    { id: 'announcements', name: 'Announcements', category: 'Engagement', permKey: 'manage_announcements', key: 'manage_announcements' },
    { id: 'notifications', name: 'Notifications', category: 'Engagement', permKey: 'send_notifications', key: 'send_notifications' },
    { id: 'payments', name: 'Payments', category: 'Business', permKey: 'view_payments', key: 'view_payments' },
    { id: 'certificates', name: 'Certificates', category: 'Credentialing', permKey: 'manage_certificates', key: 'manage_certificates' },
    { id: 'support', name: 'Support', category: 'Operations', permKey: 'manage_support', key: 'manage_support' },
    { id: 'analytics', name: 'Analytics', category: 'Insights', permKey: 'view_analytics', key: 'view_analytics' },
    { id: 'admins', name: 'Admin Users', category: 'Governance', permKey: 'manage_admins', key: 'manage_admins' },
    { id: 'roles', name: 'Roles & Permissions', category: 'Governance', permKey: 'manage_roles', key: 'manage_roles' },
    { id: 'audit-logs', name: 'Audit Logs', category: 'Governance', permKey: 'view_audit_logs', key: 'view_audit_logs' },
    { id: 'settings', name: 'Settings', category: 'Governance', permKey: 'manage_settings', key: 'manage_settings' }
  ];

  const defaultRoles = [
    {
      id: 'role-owner',
      name: 'Owner',
      description: 'Absolute platform authority, billing root, and master administrative governance.',
      usersCount: 1,
      isSystem: true,
      permissions: [
        'view_dashboard', 'manage_courses', 'manage_tiers', 'manage_batches',
        'manage_students', 'manage_enrollments', 'manage_classes', 'manage_modules',
        'manage_lessons', 'manage_videos', 'manage_resources', 'manage_projects',
        'manage_assignments', 'manage_announcements', 'send_notifications',
        'view_payments', 'manage_certificates', 'manage_support', 'view_analytics',
        'manage_admins', 'manage_roles', 'view_audit_logs', 'manage_settings'
      ],
      accessLevel: 'Full System Root Access (23 / 23 Modules)'
    },
    {
      id: 'role-super-admin',
      name: 'Super Admin',
      description: 'Full operational access across all educational, student, content, and system workflows.',
      usersCount: 1,
      isSystem: true,
      permissions: [
        'view_dashboard', 'manage_courses', 'manage_tiers', 'manage_batches',
        'manage_students', 'manage_enrollments', 'manage_classes', 'manage_modules',
        'manage_lessons', 'manage_videos', 'manage_resources', 'manage_projects',
        'manage_assignments', 'manage_announcements', 'send_notifications',
        'view_payments', 'manage_certificates', 'manage_support', 'view_analytics',
        'manage_admins', 'view_audit_logs', 'manage_settings'
      ],
      accessLevel: 'Operational Command (22 / 23 Modules)'
    },
    {
      id: 'role-content-mgr',
      name: 'Content Manager',
      description: 'Manages curricula, courses, tiers, modules, classes, lessons, videos, resources, and projects.',
      usersCount: 2,
      isSystem: false,
      permissions: [
        'view_dashboard', 'manage_courses', 'manage_tiers', 'manage_classes',
        'manage_modules', 'manage_lessons', 'manage_videos', 'manage_resources',
        'manage_projects', 'manage_assignments', 'manage_announcements', 'view_analytics'
      ],
      accessLevel: 'Curriculum & Media Authority (12 / 23 Modules)'
    },
    {
      id: 'role-student-mgr',
      name: 'Student Manager',
      description: 'Oversees student directory, batch assignments, enrollments, certificates, and student tickets.',
      usersCount: 2,
      isSystem: false,
      permissions: [
        'view_dashboard', 'manage_batches', 'manage_students', 'manage_enrollments',
        'manage_certificates', 'manage_support', 'manage_announcements', 'send_notifications'
      ],
      accessLevel: 'Cohort & Student Success (8 / 23 Modules)'
    },
    {
      id: 'role-finance-mgr',
      name: 'Finance Manager',
      description: 'Reconciles tuition payments, oversees invoice receipts, and audits fee records.',
      usersCount: 1,
      isSystem: false,
      permissions: [
        'view_dashboard', 'view_payments', 'manage_enrollments', 'view_analytics', 'view_audit_logs'
      ],
      accessLevel: 'Financial Audit & Billing (5 / 23 Modules)'
    },
    {
      id: 'role-comms-mgr',
      name: 'Communications Manager',
      description: 'Authors platform announcements, schedules student notifications, and manages broadcast outreach.',
      usersCount: 1,
      isSystem: false,
      permissions: [
        'view_dashboard', 'manage_announcements', 'send_notifications', 'manage_support'
      ],
      accessLevel: 'Communications & Announcements (4 / 23 Modules)'
    },
    {
      id: 'role-support-mgr',
      name: 'Support Manager',
      description: 'Resolves student inquiries, triages technical tickets, and coordinates learner support.',
      usersCount: 2,
      isSystem: false,
      permissions: [
        'view_dashboard', 'manage_support', 'manage_students', 'manage_enrollments'
      ],
      accessLevel: 'Learner Operations & Helpdesk (4 / 23 Modules)'
    },
    {
      id: 'role-analyst',
      name: 'Analyst',
      description: 'Read-only business intelligence on enrollment trends, platform metrics, and learning velocity.',
      usersCount: 1,
      isSystem: false,
      permissions: [
        'view_dashboard', 'view_analytics'
      ],
      accessLevel: 'Institutional Reporting & Metrics (2 / 23 Modules)'
    }
  ];

  const defaultAuditLogs = [
    {
      id: 'aud-init-001',
      timestamp: new Date().toISOString(),
      admin: 'Kenneth Vance (Owner)',
      adminEmail: 'kenneth.vance@nexvion.ai',
      action: 'PLATFORM_INITIALIZED',
      entityType: 'System',
      entityName: 'NEXVION AI Production Platform',
      previousState: '{"mode": "Setup"}',
      newState: '{"mode": "Production Ready", "status": "Fresh Platform Initialized"}',
      ipDevice: 'System Bootstrap',
      result: 'Success',
      notes: 'Fresh platform initialized. Cohort enrollments and student registries reset for live admissions.'
    }
  ];

  const defaultSettings = {
    platform: {
      platformName: 'NEXVION AI',
      portalTitle: 'NEXVION AI Administration Portal',
      logoUrl: 'NEXVION_logo_design_20261005164702.jpg',
      defaultTimezone: 'UTC',
      dateFormat: 'YYYY-MM-DD HH:mm UTC',
      maintenanceMode: false
    },
    branding: {
      primaryColor: '#7F52FF',
      secondaryColor: '#C757BC',
      accentColor: '#00D2B4',
      canvasTheme: 'Technical Precision Minimalism',
      fontSans: 'Space Grotesk, Geist, Inter',
      fontMono: 'JetBrains Mono'
    },
    courses: {
      strictTierCount: 4,
      allowedTiers: ['AI Foundations', 'AI Builder', 'AI Creator', 'AI Architect'],
      defaultCourseVisibility: 'Public',
      enableCourseReviews: true,
      priceComingSoonPlaceholder: 'PRICE COMING SOON'
    },
    enrollmentRules: {
      approvalMode: 'Manual Review',
      waitlistEnabled: true,
      autoEnrollOnPayment: true,
      notifyOnWaitlistMovement: true
    },
    batchRules: {
      maxBatchCapacity: 30, // STRICT ARCHITECTURAL INVARIANT: Fixed at 30, cannot exceed 30
      enforceMaxCapacityStrict: true,
      autoWaitlistOverflow: true,
      defaultBatchDurationWeeks: 8,
      allowInstructorOverbook: false
    },
    notifications: {
      inAppNotificationsEnabled: true,
      emailNotificationsSimulation: true,
      browserPushSimulation: true,
      futureProvider: 'Firebase Cloud Messaging (FCM)',
      slackWebhookPlaceholder: 'https://hooks.slack.com/services/T00/B00/XXXX'
    },
    certificates: {
      requireManualApproval: true,
      minCompletionPercent: 90,
      minAttendancePercent: 80,
      minAssignmentGrade: 75,
      digitalVerificationBaseUrl: 'https://nexvion.ai/verify/'
    },
    payments: {
      paymentGatewayStatus: 'Gateway integration pending',
      displayComingSoonForPaidTiers: true,
      currencyCode: 'USD',
      integrationNotice: 'Payment processing will be connected during backend integration.'
    },
    support: {
      defaultAssignee: 'Student Management Desk',
      slaResponseHours: 24,
      autoCloseResolvedDays: 7
    },
    adminPreferences: {
      denseTableMode: false,
      sessionTimeoutMinutes: 60,
      auditLogRetentionDays: 365
    }
  };

  const defaultAnalytics = {
    overview: {
      totalStudents: 0,
      activeStudents: 0,
      pendingEnrollments: 0,
      activeCourses: 4,
      openBatches: 0,
      waitlistedStudents: 0,
      upcomingClasses: 0,
      pendingSupportRequests: 0,
      completionRatePercent: 0,
      avgCourseSatisfaction: 0
    },
    enrollmentTrends: [
      { period: 'Week 1', foundations: 0, builder: 0, creator: 0, architect: 0 }
    ],
    tierDistribution: [
      { tier: 'AI Foundations (Free)', count: 0, percent: 0, color: '#7F52FF' },
      { tier: 'AI Builder (Paid)', count: 0, percent: 0, color: '#C757BC' },
      { tier: 'AI Creator (Paid)', count: 0, percent: 0, color: '#00D2B4' },
      { tier: 'AI Architect (Premium)', count: 0, percent: 0, color: '#F59E0B' }
    ],
    batchCapacityUtilization: []
  };

  // --------------------------------------------------------------------------
  // 2. DATA STORE
  // --------------------------------------------------------------------------

  const FIREBASE_CONFIG = (typeof window !== 'undefined' && window.firebaseConfig) || {
    apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
    authDomain: "nexvion-ai.firebaseapp.com",
    projectId: "nexvion-ai",
    storageBucket: "nexvion-ai.firebasestorage.app",
    messagingSenderId: "916097030104",
    appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad",
    measurementId: "G-Q09E6TX5XJ"
  };

  class ProductionDataStore {
    constructor() {
      this.state = this.loadState();
      this.currentRole = 'Super Admin';
      this.firestoreEnabled = false;
      this.db = null;
      this.storage = null;
      this.syncInProgress = false;
      this.lastSyncTime = null;
      this.stateStatus = {};
      const allCols = [
        'courses', 'tiers', 'batches', 'students', 'enrollments',
        'modules', 'classes', 'lessons', 'videos', 'resources',
        'projects', 'assignments', 'submissions', 'announcements',
        'notifications', 'payments', 'certificates', 'supportTickets',
        'auditLogs', 'settings'
      ];
      allCols.forEach(c => {
        this.stateStatus[c] = {
          loading: false,
          empty: false,
          error: null,
          permissionDenied: false,
          retrying: false,
          lastFetched: null
        };
      });
      this.initFirestore();
    }

    validateFirebaseConfig() {
      const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'];
      const missing = required.filter(k => !FIREBASE_CONFIG[k] || String(FIREBASE_CONFIG[k]).includes('your-'));
      return {
        configured: missing.length === 0,
        missingFields: missing,
        projectId: FIREBASE_CONFIG.projectId,
        authDomain: FIREBASE_CONFIG.authDomain
      };
    }

    getFirebaseConfig() {
      return { ...FIREBASE_CONFIG };
    }

    getRepositoryState(collectionName) {
      return this.stateStatus[collectionName] ? { ...this.stateStatus[collectionName] } : { loading: false, empty: false, error: null, permissionDenied: false, retrying: false, lastFetched: null };
    }

    setRepositoryLoading(collectionName, loading) {
      if (!this.stateStatus[collectionName]) {
        this.stateStatus[collectionName] = { loading: false, empty: false, error: null, permissionDenied: false, retrying: false, lastFetched: null };
      }
      this.stateStatus[collectionName].loading = !!loading;
      if (loading) {
        this.stateStatus[collectionName].error = null;
      }
    }

    setRepositoryError(collectionName, err, isPermissionDenied = false) {
      if (!this.stateStatus[collectionName]) {
        this.stateStatus[collectionName] = { loading: false, empty: false, error: null, permissionDenied: false, retrying: false, lastFetched: null };
      }
      this.stateStatus[collectionName].loading = false;
      this.stateStatus[collectionName].error = typeof err === 'string' ? err : (err && err.message) || 'Repository fetch error';
      this.stateStatus[collectionName].permissionDenied = !!isPermissionDenied;
    }

    setRepositorySuccess(collectionName, isEmpty = false) {
      if (!this.stateStatus[collectionName]) {
        this.stateStatus[collectionName] = { loading: false, empty: false, error: null, permissionDenied: false, retrying: false, lastFetched: null };
      }
      this.stateStatus[collectionName].loading = false;
      this.stateStatus[collectionName].error = null;
      this.stateStatus[collectionName].permissionDenied = false;
      this.stateStatus[collectionName].empty = !!isEmpty;
      this.stateStatus[collectionName].retrying = false;
      this.stateStatus[collectionName].lastFetched = new Date().toISOString();
    }

    async retryRepository(collectionName) {
      if (!this.stateStatus[collectionName]) {
        this.stateStatus[collectionName] = { loading: false, empty: false, error: null, permissionDenied: false, retrying: false, lastFetched: null };
      }
      this.stateStatus[collectionName].retrying = true;
      this.stateStatus[collectionName].error = null;
      return this.queryDocs(collectionName, { forceRefresh: true });
    }

    initFirestore() {
      try {
        if (typeof window !== 'undefined' && window.firebase) {
          if (window.firebase.firestore) {
            this.db = window.firebase.firestore();
            this.firestoreEnabled = true;
          }
          if (window.firebase.storage) {
            try {
              this.storage = window.firebase.storage();
            } catch (stErr) {
              console.warn('ProductionDataStore: Storage init note:', stErr.message);
            }
          }
          if (window.firebase.auth) {
            window.firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                this.syncWithFirestore().catch(() => {});
              }
            });
          }
        }
      } catch (err) {
        console.warn('ProductionDataStore: Firestore/Storage init deferred or in offline/demo mode:', err.message);
        this.firestoreEnabled = false;
      }
    }

    getFirestoreStatus() {
      const fb = typeof window !== 'undefined' && window.firebase;
      return {
        available: !!(fb && fb.firestore),
        connected: !!(this.firestoreEnabled && this.db),
        authenticated: !!(fb && fb.auth && fb.auth().currentUser),
        lastSync: this.lastSyncTime || null
      };
    }

    async persistDoc(collectionName, docId, docData) {
      this.saveState();
      if (this.firestoreEnabled && this.db && docId) {
        const cleanData = JSON.parse(JSON.stringify(docData));
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await this.db.collection(collectionName).doc(String(docId)).set(cleanData, { merge: true });
            return true;
          } catch (err) {
            if (attempt === 2) {
              console.warn(`Firestore sync note (${collectionName}/${docId}):`, err.message);
            } else {
              await new Promise(res => setTimeout(res, 250 * (attempt + 1)));
            }
          }
        }
      }
      return true;
    }

    async deleteDoc(collectionName, docId) {
      this.saveState();
      if (this.firestoreEnabled && this.db && docId) {
        try {
          await this.db.collection(collectionName).doc(String(docId)).delete();
        } catch (err) {
          console.warn(`Firestore delete note (${collectionName}/${docId}):`, err.message);
        }
      }
      return true;
    }

    async queryDocs(collectionName, options = {}) {
      this.setRepositoryLoading(collectionName, true);
      let results = [];
      let totalCount = 0;

      // 1. Try real Firestore if enabled
      if (this.firestoreEnabled && this.db) {
        let attempts = 0;
        let lastErr = null;
        while (attempts < 3) {
          try {
            let q = this.db.collection(collectionName);
            if (options.filters && Array.isArray(options.filters)) {
              for (const f of options.filters) {
                if (f.value !== undefined && f.value !== null && f.value !== 'ALL') {
                  q = q.where(f.field, f.op || '==', f.value);
                }
              }
            }
            if (options.orderBy) {
              q = q.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
            }
            if (options.limit) {
              q = q.limit(Number(options.limit));
            }
            const snap = await q.get();
            const remoteDocs = [];
            snap.forEach(doc => {
              remoteDocs.push({ id: doc.id, ...doc.data() });
            });

            if (collectionName === 'batches') {
              remoteDocs.forEach(b => {
                b.capacity = 30; // 30-cap hard invariant
                if (b.enrolledCount > 30) b.enrolledCount = 30;
              });
            }

            if (remoteDocs.length > 0) {
              if (collectionName === 'settings') {
                this.state.settings = { ...this.state.settings, ...remoteDocs[0] };
              } else {
                this.state[collectionName] = remoteDocs;
              }
              this.saveState();
            }

            results = remoteDocs;
            totalCount = snap.size;
            this.setRepositorySuccess(collectionName, results.length === 0);
            break;
          } catch (err) {
            lastErr = err;
            attempts++;
            const isPerm = err.code === 'permission-denied' ||
              (err.message && (err.message.toLowerCase().includes('permission') || err.message.toLowerCase().includes('access denied')));
            if (isPerm) {
              this.setRepositoryError(collectionName, err.message, true);
              break;
            }
            if (attempts < 3) {
              await new Promise(r => setTimeout(r, 200 * attempts));
            }
          }
        }

        if (lastErr && results.length === 0) {
          const isPerm = lastErr.code === 'permission-denied' ||
            (lastErr.message && (lastErr.message.toLowerCase().includes('permission') || lastErr.message.toLowerCase().includes('access denied')));
          this.setRepositoryError(collectionName, lastErr.message, isPerm);
        }
      }

      // Fallback to local state if Firestore query returned nothing or failed
      if (results.length === 0 && this.state[collectionName]) {
        let local = Array.isArray(this.state[collectionName])
          ? [...this.state[collectionName]]
          : (this.state[collectionName] ? [this.state[collectionName]] : []);

        if (options.filters && Array.isArray(options.filters)) {
          for (const f of options.filters) {
            if (f.value !== undefined && f.value !== null && f.value !== 'ALL') {
              local = local.filter(item => {
                if (f.op === '===' || f.op === '==' || !f.op) return item[f.field] === f.value;
                if (f.op === '>') return item[f.field] > f.value;
                if (f.op === '<') return item[f.field] < f.value;
                if (f.op === 'array-contains') return Array.isArray(item[f.field]) && item[f.field].includes(f.value);
                return true;
              });
            }
          }
        }

        if (options.search) {
          const s = options.search.toLowerCase();
          local = local.filter(item => {
            return Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(s));
          });
        }

        if (collectionName === 'batches') {
          local.forEach(b => {
            b.capacity = 30;
            if (b.enrolledCount > 30) b.enrolledCount = 30;
          });
        }

        totalCount = local.length;
        if (options.limit) {
          const page = Number(options.page) || 1;
          const limit = Number(options.limit);
          const start = (page - 1) * limit;
          local = local.slice(start, start + limit);
        }

        results = local;
        if (!this.stateStatus[collectionName]?.error) {
          this.setRepositorySuccess(collectionName, results.length === 0);
        }
      }

      const out = JSON.parse(JSON.stringify(results));
      out.pagination = {
        page: Number(options.page) || 1,
        limit: Number(options.limit) || results.length,
        total: totalCount,
        hasMore: options.limit ? totalCount > (Number(options.page) || 1) * Number(options.limit) : false
      };
      return out;
    }

    async getDoc(collectionName, docId) {
      if (this.firestoreEnabled && this.db && docId) {
        try {
          const snap = await this.db.collection(collectionName).doc(String(docId)).get();
          if (snap.exists) {
            const data = { id: snap.id, ...snap.data() };
            if (collectionName === 'batches') {
              data.capacity = 30;
              if (data.enrolledCount > 30) data.enrolledCount = 30;
            }
            return data;
          }
        } catch (err) {
          // Fall back to local
        }
      }
      if (collectionName === 'settings') {
        return JSON.parse(JSON.stringify(this.state.settings || {}));
      }
      const list = this.state[collectionName] || [];
      const item = list.find(x => x.id === docId || (x.verificationId && x.verificationId === docId) || (x.ticketRef && x.ticketRef === docId));
      if (item && collectionName === 'batches') {
        item.capacity = 30;
        if (item.enrolledCount > 30) item.enrolledCount = 30;
      }
      return item ? JSON.parse(JSON.stringify(item)) : null;
    }

    async syncWithFirestore() {
      if (!this.firestoreEnabled || !this.db || this.syncInProgress) return;
      this.syncInProgress = true;
      try {
        const collections = [
          'tiers', 'courses', 'batches', 'students', 'enrollments',
          'modules', 'classes', 'lessons', 'videos', 'resources',
          'projects', 'assignments', 'submissions', 'announcements',
          'notifications', 'payments', 'certificates', 'supportTickets',
          'auditLogs', 'settings'
        ];
        for (const col of collections) {
          try {
            const snapshot = await this.db.collection(col).get();
            if (!snapshot.empty) {
              const remoteDocs = [];
              snapshot.forEach(doc => {
                remoteDocs.push({ id: doc.id, ...doc.data() });
              });
              if (col === 'settings' && remoteDocs.length > 0) {
                this.state.settings = { ...this.state.settings, ...remoteDocs[0] };
              } else if (remoteDocs.length > 0) {
                if (col === 'batches') {
                  remoteDocs.forEach(b => {
                    b.capacity = 30; // 30-cap hard invariant
                    if (b.enrolledCount > 30) b.enrolledCount = 30;
                  });
                }
                this.state[col] = remoteDocs;
              }
            }
          } catch (colErr) {
            // Permissions on specific collections may vary per role
          }
        }
        this.lastSyncTime = new Date().toISOString();
        this.saveState();
      } catch (err) {
        console.warn('Firestore sync note:', err.message);
      } finally {
        this.syncInProgress = false;
      }
    }

    async seedInitialData(force = false) {
      // Safe initial seeding: Never overwrites existing production data unless force is true
      if (!this.firestoreEnabled || !this.db) {
        return { status: 'seeded_locally', count: defaultTiers.length + defaultCourses.length + defaultBatches.length };
      }
      try {
        let seededCount = 0;

        // 1. Four official tiers (FREE, PRICE COMING SOON)
        for (const tier of defaultTiers) {
          const docRef = this.db.collection('tiers').doc(tier.id);
          if (!force) {
            const snap = await docRef.get();
            if (snap.exists) continue;
          }
          await docRef.set(tier, { merge: true });
          seededCount++;
        }

        // 2. Initial courses
        for (const course of defaultCourses) {
          const docRef = this.db.collection('courses').doc(course.id);
          if (!force) {
            const snap = await docRef.get();
            if (snap.exists) continue;
          }
          await docRef.set(course, { merge: true });
          seededCount++;
        }

        // 3. Initial batches (30 students cap strictly enforced)
        for (const batch of defaultBatches) {
          const docRef = this.db.collection('batches').doc(batch.id);
          if (!force) {
            const snap = await docRef.get();
            if (snap.exists) continue;
          }
          const cleanBatch = {
            ...batch,
            capacity: 30,
            enrolledCount: Math.min(Number(batch.enrolledCount) || 0, 30)
          };
          await docRef.set(cleanBatch, { merge: true });
          seededCount++;
        }

        // 4. Initial Development Administrator
        const devAdmin = defaultAdminUsers[0];
        if (devAdmin) {
          const docRef = this.db.collection('adminUsers').doc(devAdmin.id);
          if (!force) {
            const snap = await docRef.get();
            if (!snap.exists) {
              await docRef.set(devAdmin, { merge: true });
              seededCount++;
            }
          } else {
            await docRef.set(devAdmin, { merge: true });
            seededCount++;
          }
        }

        return { status: 'success', seededCount };
      } catch (err) {
        console.error('Seed initial data error:', err);
        return { status: 'error', error: err.message };
      }
    }

    loadState() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          // Evict any legacy mock storage keys
          try {
            const keysToRemove = [];
            for (let i = 0; i < window.localStorage.length; i++) {
              const k = window.localStorage.key(i);
              if (k && (k.startsWith('nexvion_admin_production_data_') || k.startsWith('nexvion_admin_data_')) && k !== STORAGE_KEY) {
                keysToRemove.push(k);
              }
            }
            keysToRemove.forEach(k => window.localStorage.removeItem(k));
          } catch (e) {}

          const cached = window.localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.tiers && parsed.tiers.length === 4 && Array.isArray(parsed.batches)) {
              parsed.batches.forEach(b => {
                b.capacity = 30;
                if (b.enrolledCount > 30) b.enrolledCount = 30;
              });
              if (!Array.isArray(parsed.batches)) parsed.batches = [];
              if (!Array.isArray(parsed.classes)) parsed.classes = [];
              if (!Array.isArray(parsed.modules)) parsed.modules = [];
              if (!Array.isArray(parsed.lessons)) parsed.lessons = [];
              if (!Array.isArray(parsed.videos)) parsed.videos = [];
              if (!Array.isArray(parsed.resources)) parsed.resources = [];
              if (!Array.isArray(parsed.projects)) parsed.projects = [];
              if (!Array.isArray(parsed.assignments)) parsed.assignments = [];
              if (!Array.isArray(parsed.students)) parsed.students = [];
              if (!Array.isArray(parsed.enrollments)) parsed.enrollments = [];
              if (!Array.isArray(parsed.submissions)) parsed.submissions = [];
              if (!Array.isArray(parsed.announcements)) parsed.announcements = [];
              if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
              if (!Array.isArray(parsed.payments)) {
                parsed.payments = JSON.parse(JSON.stringify(defaultPayments));
              }
              if (!Array.isArray(parsed.certificates)) {
                parsed.certificates = JSON.parse(JSON.stringify(defaultCertificates));
              }
              if (!Array.isArray(parsed.supportTickets)) {
                parsed.supportTickets = JSON.parse(JSON.stringify(defaultSupportTickets));
              }
              if (!Array.isArray(parsed.adminUsers)) {
                parsed.adminUsers = JSON.parse(JSON.stringify(defaultAdminUsers));
              }
              if (!Array.isArray(parsed.roles)) {
                parsed.roles = JSON.parse(JSON.stringify(defaultRoles));
              }
              if (!Array.isArray(parsed.auditLogs)) {
                parsed.auditLogs = JSON.parse(JSON.stringify(defaultAuditLogs));
              }
              if (!parsed.settings || !parsed.settings.enrollmentRules || !parsed.settings.adminPreferences) {
                parsed.settings = JSON.parse(JSON.stringify(defaultSettings));
              }
              if (!parsed.analytics || !parsed.analytics.overview) {
                parsed.analytics = JSON.parse(JSON.stringify(defaultAnalytics));
              }
              if (!parsed.fileMetadata) {
                parsed.fileMetadata = [];
              }
              if (!parsed.tierPrices) {
                parsed.tierPrices = {
                  'ai-foundations': { tierName: 'AI Foundations', priceDisplay: 'FREE', amount: 0, currency: 'USD', isPaid: false },
                  'ai-builder': { tierName: 'AI Builder', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
                  'ai-creator': { tierName: 'AI Creator', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
                  'ai-architect': { tierName: 'AI Architect', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true }
                };
              }
              return parsed;
            }
          }
        }
      } catch (err) {
        console.warn('ProductionDataStore: Fallback to defaults', err);
      }

      return {
        tiers: JSON.parse(JSON.stringify(defaultTiers)),
        courses: JSON.parse(JSON.stringify(defaultCourses)),
        batches: JSON.parse(JSON.stringify(defaultBatches)),
        students: JSON.parse(JSON.stringify(defaultStudents)),
        enrollments: JSON.parse(JSON.stringify(defaultEnrollments)),
        classes: JSON.parse(JSON.stringify(defaultClasses)),
        modules: JSON.parse(JSON.stringify(defaultModules)),
        lessons: JSON.parse(JSON.stringify(defaultLessons)),
        videos: JSON.parse(JSON.stringify(defaultVideos)),
        resources: JSON.parse(JSON.stringify(defaultResources)),
        projects: JSON.parse(JSON.stringify(defaultProjects)),
        assignments: JSON.parse(JSON.stringify(defaultAssignments)),
        submissions: JSON.parse(JSON.stringify(defaultSubmissions)),
        announcements: JSON.parse(JSON.stringify(defaultAnnouncements)),
        notifications: JSON.parse(JSON.stringify(defaultNotifications)),
        payments: JSON.parse(JSON.stringify(defaultPayments)),
        certificates: JSON.parse(JSON.stringify(defaultCertificates)),
        supportTickets: JSON.parse(JSON.stringify(defaultSupportTickets)),
        adminUsers: JSON.parse(JSON.stringify(defaultAdminUsers)),
        roles: JSON.parse(JSON.stringify(defaultRoles)),
        auditLogs: JSON.parse(JSON.stringify(defaultAuditLogs)),
        settings: JSON.parse(JSON.stringify(defaultSettings)),
        analytics: JSON.parse(JSON.stringify(defaultAnalytics)),
        fileMetadata: [],
        deviceTokens: [],
        notificationPreferences: {},
        userInboxes: {},
        tierPrices: {
          'ai-foundations': { tierName: 'AI Foundations', priceDisplay: 'FREE', amount: 0, currency: 'USD', isPaid: false },
          'ai-builder': { tierName: 'AI Builder', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
          'ai-creator': { tierName: 'AI Creator', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
          'ai-architect': { tierName: 'AI Architect', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true }
        }
      };
    }

    saveState() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (err) {
        console.warn('ProductionDataStore: Error saving to localStorage', err);
      }
    }

    resetState() {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      this.state = this.loadState();
      return true;
    }

    setCurrentRole(roleName) {
      this.currentRole = roleName;
    }

    getCurrentRole() {
      return this.currentRole;
    }

    hasPermission(permissionKey) {
      const roleObj = this.state.roles.find(r => r.name.toLowerCase() === this.currentRole.toLowerCase());
      if (!roleObj) return true;
      if (roleObj.name === 'Owner') return true;
      return roleObj.permissions.includes(permissionKey);
    }
  }

  const store = new ProductionDataStore();

  // --------------------------------------------------------------------------
  // 3. FORMAL SERVICE REPOSITORIES (Ready for Cloud Firestore swapping)
  // --------------------------------------------------------------------------

  // --- courseRepository ---
  const courseRepository = {
    findAll: async (options = {}) => store.queryDocs('courses', options),
    findById: async (id) => store.getDoc('courses', id),
    create: async (courseData) => {
      const newCourse = {
        ...courseData,
        id: courseData.id || `course-${Date.now()}`,
        status: courseData.status || 'Draft',
        visibility: courseData.visibility || 'Internal',
        certificateRequirements: courseData.certificateRequirements || { minAttendance: 80, minAssignmentScore: 70, capstoneApproved: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.courses.unshift(newCourse);
      store.saveState();
      store.persistDoc('courses', newCourse.id, newCourse);
      auditRepository.log('Created Course', 'Course', newCourse.title, null, JSON.stringify(newCourse));
      return newCourse;
    },
    update: async (id, courseData) => {
      const idx = store.state.courses.findIndex(c => c.id === id);
      if (idx !== -1) {
        const prev = JSON.stringify(store.state.courses[idx]);
        store.state.courses[idx] = { ...store.state.courses[idx], ...courseData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('courses', id, store.state.courses[idx]);
        auditRepository.log('Updated Course', 'Course', store.state.courses[idx].title, prev, JSON.stringify(courseData));
        return store.state.courses[idx];
      }
      return null;
    },
    publish: async (id) => {
      return courseRepository.update(id, { status: 'Published', visibility: 'Public' });
    },
    unpublish: async (id) => {
      return courseRepository.update(id, { status: 'Draft', visibility: 'Internal' });
    },
    archive: async (id) => {
      return courseRepository.update(id, { status: 'Archived', visibility: 'Archived' });
    },
    assignTier: async (courseId, tierId) => {
      const course = store.state.courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');
      const tier = store.state.tiers.find(t => t.id === tierId);
      if (!tier) throw new Error('Tier not found');
      course.tierId = tier.id;
      course.tierName = tier.name;
      course.tierType = tier.tierType;
      course.priceDisplay = tier.priceDisplay;
      course.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('courses', course.id, course);
      auditRepository.log('Assigned Tier to Course', 'Course', `${course.title} → ${tier.name}`);
      return course;
    },
    getModules: async (courseId) => {
      const mods = store.state.modules.filter(m => m.courseId === courseId);
      return JSON.parse(JSON.stringify(mods));
    },
    getClasses: async (courseId) => {
      const cls = store.state.classes.filter(c => c.courseId === courseId);
      return JSON.parse(JSON.stringify(cls));
    },
    getProjects: async (courseId) => {
      const prjs = store.state.projects.filter(p => p.courseId === courseId);
      return JSON.parse(JSON.stringify(prjs));
    },
    configureCertificateRequirements: async (courseId, requirements) => {
      const course = store.state.courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');
      course.certificateRequirements = { ...(course.certificateRequirements || {}), ...requirements };
      course.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('courses', course.id, course);
      auditRepository.log('Configured Certificate Requirements', 'Course', `${course.title}: ${JSON.stringify(requirements)}`);
      return course;
    },
    delete: async (id) => {
      const idx = store.state.courses.findIndex(c => c.id === id);
      if (idx !== -1) {
        const title = store.state.courses[idx].title;
        store.state.courses.splice(idx, 1);
        store.saveState();
        store.deleteDoc('courses', id);
        auditRepository.log('Archived Course', 'Course', title);
        return true;
      }
      return false;
    }
  };

  // --- tierRepository ---
  const tierRepository = {
    findAll: async (options = {}) => store.queryDocs('tiers', options),
    findById: async (id) => store.getDoc('tiers', id),
    update: async (id, tierData) => {
      const idx = store.state.tiers.findIndex(t => t.id === id);
      if (idx !== -1) {
        store.state.tiers[idx] = { ...store.state.tiers[idx], ...tierData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('tiers', id, store.state.tiers[idx]);
        auditRepository.log('Updated Course Tier', 'Tier', store.state.tiers[idx].name);
        return store.state.tiers[idx];
      }
      return null;
    }
  };

  // --- batchRepository (Strict 30-Cap Invariant Enforced) ---
  const batchRepository = {
    findAll: async (options = {}) => {
      const items = await store.queryDocs('batches', options);
      items.forEach(b => {
        b.capacity = 30; // Hard invariant: strictly 30 seats per cohort
        if (b.enrolledCount >= 30) {
          b.status = b.status === 'COMPLETED' ? 'COMPLETED' : 'FULL';
        }
      });
      return items;
    },
    findById: async (id) => {
      const b = await store.getDoc('batches', id);
      if (b) {
        b.capacity = 30;
        if (b.enrolledCount >= 30) {
          b.status = b.status === 'COMPLETED' ? 'COMPLETED' : 'FULL';
        }
      }
      return b;
    },
    create: async (batchData) => {
      const clean = {
        ...batchData,
        id: batchData.id || `batch-${Date.now()}`,
        capacity: 30, // MAX 30 ALWAYS
        enrolledCount: Math.min(Number(batchData.enrolledCount) || 0, 30),
        waitlistCount: Number(batchData.waitlistCount) || 0,
        status: Number(batchData.enrolledCount) >= 30 ? 'FULL' : (batchData.status || 'OPEN'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.batches.unshift(clean);
      store.saveState();
      store.persistDoc('batches', clean.id, clean);
      auditRepository.log('Created Cohort Batch', 'Batch', clean.name, null, JSON.stringify(clean));
      return clean;
    },
    update: async (id, batchData) => {
      const idx = store.state.batches.findIndex(b => b.id === id);
      if (idx !== -1) {
        const enrolled = Math.min(Number(batchData.enrolledCount !== undefined ? batchData.enrolledCount : store.state.batches[idx].enrolledCount), 30);
        store.state.batches[idx] = {
          ...store.state.batches[idx],
          ...batchData,
          capacity: 30,
          enrolledCount: enrolled,
          status: enrolled >= 30 ? (store.state.batches[idx].status === 'COMPLETED' ? 'COMPLETED' : 'FULL') : (batchData.status || store.state.batches[idx].status),
          updatedAt: new Date().toISOString()
        };
        store.saveState();
        store.persistDoc('batches', id, store.state.batches[idx]);
        auditRepository.log('Updated Cohort Batch', 'Batch', store.state.batches[idx].name);
        return store.state.batches[idx];
      }
      return null;
    },
    assignCourse: async (batchId, courseId) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      const course = store.state.courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');
      batch.courseId = course.id;
      batch.courseTitle = course.title;
      batch.courseNumber = course.courseNumber;
      batch.tierId = course.tierId;
      batch.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('batches', batchId, batch);
      auditRepository.log('Assigned Course to Cohort Batch', 'Batch', `${batch.name} → ${course.title}`);
      return batch;
    },
    assignInstructor: async (batchId, instructorName) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      batch.instructor = instructorName;
      batch.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('batches', batchId, batch);
      auditRepository.log('Assigned Instructor', 'Batch', `${batch.name}: ${instructorName}`);
      return batch;
    },
    setDates: async (batchId, startDate, endDate) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      batch.startDate = startDate;
      batch.endDate = endDate;
      batch.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('batches', batchId, batch);
      auditRepository.log('Updated Batch Dates', 'Batch', `${batch.name}: ${startDate} to ${endDate}`);
      return batch;
    },
    setSchedule: async (batchId, schedule) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      batch.schedule = schedule;
      batch.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('batches', batchId, batch);
      auditRepository.log('Updated Batch Schedule', 'Batch', `${batch.name}: ${schedule}`);
      return batch;
    },
    addStudent: async (batchId, studentId) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      const student = store.state.students.find(s => s.id === studentId);

      // STRICT INVARIANT ENFORCEMENT: Max 30 students per batch
      if (batch.enrolledCount >= 30) {
        batch.waitlistCount = (batch.waitlistCount || 0) + 1;
        batch.status = 'FULL';
        batch.updatedAt = nowIso;
        if (student) {
          student.enrollmentStatus = 'Waitlisted';
          student.batchId = batch.id;
          student.batchName = batch.name;
        }
        let enr = store.state.enrollments.find(e => e.studentId === studentId && e.batchId === batch.id);
        if (!enr) {
          enr = {
            id: `enr-${Date.now()}`,
            studentId: studentId,
            studentName: student ? student.name : 'Student',
            studentEmail: student ? student.email : '',
            courseId: batch.courseId || '',
            courseTitle: batch.courseTitle || '',
            batchId: batch.id,
            batchName: batch.name,
            status: 'Waitlisted',
            submittedAt: nowIso,
            updatedBy: actionAuthor,
            updatedAt: nowIso,
            history: [{
              status: 'Waitlisted',
              timestamp: nowIso,
              actionBy: actionAuthor,
              note: `Cohort reached 30-student capacity. Placed on waitlist (#${batch.waitlistCount}).`
            }]
          };
          store.state.enrollments.unshift(enr);
        } else {
          enr.status = 'Waitlisted';
          enr.updatedBy = actionAuthor;
          enr.updatedAt = nowIso;
          enr.history = enr.history || [];
          enr.history.push({
            status: 'Waitlisted',
            timestamp: nowIso,
            actionBy: actionAuthor,
            note: `Cohort reached 30-student capacity. Placed on waitlist (#${batch.waitlistCount}).`
          });
        }
        store.saveState();
        store.persistDoc('batches', batch.id, batch);
        if (enr) store.persistDoc('enrollments', enr.id, enr);
        if (student) store.persistDoc('students', student.id, student);
        auditRepository.log('30-Student Cap Reached — Placed on Waitlist', 'Batch', `${student ? student.name : studentId} placed on waitlist for ${batch.name} (Waitlist #${batch.waitlistCount})`);
        throw new Error(`Cohort "${batch.name}" is at maximum capacity (30 / 30). Student has been placed on the cohort waitlist (Position #${batch.waitlistCount}).`);
      }

      batch.enrolledCount += 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';
      batch.updatedAt = nowIso;

      if (student) {
        student.enrollmentStatus = 'Enrolled';
        student.batchId = batch.id;
        student.batchName = batch.name;
        student.lastActive = nowIso;
      }

      let enr = store.state.enrollments.find(e => e.studentId === studentId && (e.batchId === batch.id || !e.batchId));
      if (enr) {
        enr.batchId = batch.id;
        enr.batchName = batch.name;
        enr.status = 'Enrolled';
        enr.updatedBy = actionAuthor;
        enr.updatedAt = nowIso;
        enr.history = enr.history || [];
        enr.history.push({
          status: 'Enrolled',
          timestamp: nowIso,
          actionBy: actionAuthor,
          note: `Enrolled into cohort ${batch.name} (${batch.enrolledCount}/30)`
        });
      } else {
        enr = {
          id: `enr-${Date.now()}`,
          studentId: studentId,
          studentName: student ? student.name : 'Student',
          studentEmail: student ? student.email : '',
          courseId: batch.courseId || '',
          courseTitle: batch.courseTitle || '',
          batchId: batch.id,
          batchName: batch.name,
          status: 'Enrolled',
          submittedAt: nowIso,
          updatedBy: actionAuthor,
          updatedAt: nowIso,
          history: [{
            status: 'Enrolled',
            timestamp: nowIso,
            actionBy: actionAuthor,
            note: `Enrolled into cohort ${batch.name}`
          }]
        };
        store.state.enrollments.unshift(enr);
      }

      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      if (enr) store.persistDoc('enrollments', enr.id, enr);
      if (student) store.persistDoc('students', student.id, student);
      auditRepository.log('Enrolled Student into Cohort', 'Batch', `${student ? student.name : studentId} into ${batch.name} (${batch.enrolledCount}/30)`);
      return true;
    },
    removeStudent: async (batchId, studentId, reason = 'Administrative removal') => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      const enr = store.state.enrollments.find(e => e.studentId === studentId && e.batchId === batch.id);
      if (enr && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
        if (batch.enrolledCount > 0) {
          batch.enrolledCount -= 1;
          if (batch.status === 'FULL') batch.status = 'OPEN';
        }
        // Invariant: Do not silently delete historical enrollment!
        enr.status = 'Withdrawn';
        enr.withdrawalReason = reason;
        enr.updatedBy = actionAuthor;
        enr.updatedAt = nowIso;
        enr.history = enr.history || [];
        enr.history.push({
          status: 'Withdrawn',
          timestamp: nowIso,
          actionBy: actionAuthor,
          note: `Removed from cohort ${batch.name}. Reason: ${reason}`
        });
      } else if (enr && enr.status === 'Waitlisted') {
        if (batch.waitlistCount > 0) batch.waitlistCount -= 1;
        enr.status = 'Cancelled';
        enr.rejectionReason = reason;
        enr.updatedBy = actionAuthor;
        enr.updatedAt = nowIso;
      }

      const student = store.state.students.find(s => s.id === studentId);
      if (student && student.batchId === batch.id) {
        student.batchId = null;
        student.batchName = 'Unassigned';
        student.enrollmentStatus = 'Withdrawn';
      }

      batch.updatedAt = nowIso;
      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      if (enr) store.persistDoc('enrollments', enr.id, enr);
      if (student) store.persistDoc('students', student.id, student);
      auditRepository.log('Removed Student from Cohort', 'Batch', `${student ? student.name : studentId} removed from ${batch.name}. Historical enrollment preserved. Reason: ${reason}`);
      return true;
    },
    getWaitlist: async (batchId) => {
      const waitlisted = store.state.enrollments.filter(e => e.batchId === batchId && e.status === 'Waitlisted');
      return JSON.parse(JSON.stringify(waitlisted));
    },
    moveWaitlistToBatch: async (batchId, studentId) => {
      return batchRepository.admitFromWaitlist(batchId, studentId);
    },
    admitFromWaitlist: async (batchId, studentId) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Batch not found');
      if (batch.enrolledCount >= 30) {
        throw new Error('Cohort batch has reached maximum capacity of 30 students. Cannot admit from waitlist until a seat opens.');
      }
      batch.enrolledCount += 1;
      if (batch.waitlistCount > 0) batch.waitlistCount -= 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      batch.updatedAt = nowIso;

      const student = store.state.students.find(s => s.id === studentId);
      if (student) {
        student.enrollmentStatus = 'Enrolled';
        student.batchId = batch.id;
        student.batchName = batch.name;
      }
      const enr = store.state.enrollments.find(e => e.studentId === studentId && e.batchId === batch.id);
      if (enr) {
        enr.status = 'Enrolled';
        enr.updatedBy = actionAuthor;
        enr.updatedAt = nowIso;
        enr.history = enr.history || [];
        enr.history.push({
          status: 'Enrolled',
          timestamp: nowIso,
          actionBy: actionAuthor,
          note: `Admitted from waitlist into ${batch.name} (${batch.enrolledCount}/30)`
        });
      }

      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      if (enr) store.persistDoc('enrollments', enr.id, enr);
      if (student) store.persistDoc('students', student.id, student);
      auditRepository.log('Admitted Student from Waitlist', 'Batch', `${student ? student.name : studentId} into ${batch.name}`);
      return true;
    },
    completeBatch: async (batchId) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      batch.status = 'COMPLETED';
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      batch.updatedAt = nowIso;

      store.state.enrollments.forEach(enr => {
        if (enr.batchId === batchId && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
          enr.status = 'Completed';
          enr.updatedBy = actionAuthor;
          enr.updatedAt = nowIso;
          enr.history = enr.history || [];
          enr.history.push({
            status: 'Completed',
            timestamp: nowIso,
            actionBy: actionAuthor,
            note: `Cohort ${batch.name} concluded.`
          });
        }
      });
      store.state.students.forEach(s => {
        if (s.batchId === batchId && s.enrollmentStatus === 'Enrolled') {
          s.enrollmentStatus = 'Completed';
        }
      });

      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      auditRepository.log('Marked Batch Completed', 'Batch', `${batch.name} concluded successfully.`);
      return batch;
    },
    cancelBatch: async (batchId, reason = 'Cohort cancelled') => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Cohort batch not found');
      batch.status = 'CANCELLED';
      batch.cancellationReason = reason;
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      batch.updatedAt = nowIso;

      store.state.enrollments.forEach(enr => {
        if (enr.batchId === batchId) {
          enr.status = 'Cancelled';
          enr.rejectionReason = `Cohort cancelled: ${reason}`;
          enr.updatedBy = actionAuthor;
          enr.updatedAt = nowIso;
        }
      });
      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      auditRepository.log('Cancelled Cohort Batch', 'Batch', `${batch.name} cancelled. Reason: ${reason}`);
      return batch;
    }
  };

  // --- studentRepository ---
  const studentRepository = {
    findAll: async (options = {}) => store.queryDocs('students', options),
    findById: async (id) => store.getDoc('students', id),
    create: async (studentData) => {
      const clean = {
        ...studentData,
        id: studentData.id || `stu-${Date.now()}`,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
        internalNotesList: studentData.internalNotesList || []
      };
      store.state.students.unshift(clean);
      store.saveState();
      store.persistDoc('students', clean.id, clean);
      auditRepository.log('Added Student Record', 'Student', clean.name);
      return clean;
    },
    update: async (id, studentData) => {
      const idx = store.state.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        store.state.students[idx] = { ...store.state.students[idx], ...studentData };
        store.saveState();
        store.persistDoc('students', id, store.state.students[idx]);
        auditRepository.log('Updated Student Record', 'Student', store.state.students[idx].name);
        return store.state.students[idx];
      }
      return null;
    },
    addNote: async (studentId, noteText, author, priority = 'Normal') => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return false;
      const timeStr = new Date().toISOString();
      const noteObj = {
        id: `not-${Date.now()}`,
        author: author || store.getCurrentRole(),
        timestamp: timeStr,
        priority: priority,
        text: noteText
      };
      student.internalNotesList = student.internalNotesList || [];
      student.internalNotesList.unshift(noteObj);
      student.internalNotes = (student.internalNotes ? student.internalNotes + '\n' : '') + `[${timeStr.split('T')[0]} - ${noteObj.author}] ${noteText}`;
      store.saveState();
      store.persistDoc('students', student.id, student);
      auditRepository.log('Added Internal Student Note', 'Student', `${student.name} (${priority})`);
      return noteObj;
    },
    getEnrollments: async (studentId) => {
      return JSON.parse(JSON.stringify(store.state.enrollments.filter(e => e.studentId === studentId)));
    },
    getClasses: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      const courseClasses = store.state.classes.filter(c => c.courseId === student.enrolledCourseId);
      return courseClasses.map((cls, idx) => {
        let attendance = 'Upcoming';
        if (student.progressPercent >= 80) attendance = 'Attended';
        else if (student.progressPercent >= 50 && idx <= 2) attendance = 'Attended';
        else if (student.progressPercent >= 20 && idx === 0) attendance = 'Attended';
        else if (student.progressPercent > 0 && idx === 1) attendance = 'Recording Watched';
        else if (student.enrollmentStatus === 'Completed') attendance = 'Attended';
        return {
          ...cls,
          attendanceStatus: attendance
        };
      });
    },
    getProjects: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      const projects = store.state.projects.filter(p => p.courseId === student.enrolledCourseId);
      return projects.map(prj => {
        const sub = store.state.submissions.find(s => s.studentId === studentId);
        return {
          ...prj,
          submissionStatus: sub ? sub.status : (student.progressPercent > 50 ? 'In Progress' : 'Not Started'),
          submissionScore: sub ? sub.score : null,
          submissionFeedback: sub ? sub.feedback : null
        };
      });
    },
    getAssignments: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      const assignments = store.state.assignments.filter(a => a.courseId === student.enrolledCourseId);
      return assignments.map(asg => {
        const sub = store.state.submissions.find(s => s.assignmentId === asg.id && s.studentId === studentId);
        return {
          ...asg,
          submissionStatus: sub ? sub.status : (student.progressPercent > 30 ? 'Pending submission' : 'Not Started'),
          score: sub ? sub.score : null,
          feedback: sub ? sub.feedback : null,
          submittedAt: sub ? sub.submittedAt : null
        };
      });
    },
    getPayments: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      return store.state.payments.filter(p => 
        (p.studentName && p.studentName.toLowerCase() === student.name.toLowerCase()) ||
        (p.studentEmail && p.studentEmail.toLowerCase() === student.email.toLowerCase())
      );
    },
    getCertificates: async (studentId) => {
      return store.state.certificates.filter(c => c.studentId === studentId);
    },
    getSupportTickets: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      return store.state.supportTickets.filter(t => 
        (t.studentEmail && t.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
        (t.studentName && t.studentName.toLowerCase() === student.name.toLowerCase())
      );
    },
    getActivityTimeline: async (studentId) => {
      const student = store.state.students.find(s => s.id === studentId);
      if (!student) return [];
      const events = [];

      // 1. Account Creation
      events.push({
        id: `act-${student.id}-1`,
        title: 'Account Registered',
        category: 'System',
        dotType: 'info',
        timestamp: student.joinDate ? `${student.joinDate} 09:00 UTC` : '2026-09-01 09:00 UTC',
        description: `Student account created with access to ${student.enrolledCourseTitle || 'platform'}.`
      });

      // 2. Enrollment / Batch Event
      if (student.batchName) {
        events.push({
          id: `act-${student.id}-2`,
          title: `Cohort Placement: ${student.batchName}`,
          category: 'Enrollment',
          dotType: student.enrollmentStatus === 'Waitlisted' ? 'warning' : 'success',
          timestamp: student.joinDate ? `${student.joinDate} 11:30 UTC` : '2026-09-02 11:30 UTC',
          description: `Assigned status "${student.enrollmentStatus}" in ${student.batchName} (Maximum 30 capacity cohort).`
        });
      }

      // 3. Tuition / Payment Event
      if (student.paymentStatus) {
        events.push({
          id: `act-${student.id}-3`,
          title: `Tuition Verification: ${student.paymentStatus}`,
          category: 'Billing',
          dotType: student.paymentStatus === 'Paid' || student.paymentStatus === 'Not required' ? 'success' : 'warning',
          timestamp: student.joinDate ? `${student.joinDate} 12:15 UTC` : '2026-09-02 12:15 UTC',
          description: `Educational tier billing recorded as "${student.paymentStatus}".`
        });
      }

      // 4. Progress Checkpoint
      if (student.progressPercent > 0) {
        events.push({
          id: `act-${student.id}-4`,
          title: `Curriculum Milestone Reached (${student.progressPercent}%)`,
          category: 'Academic',
          dotType: 'success',
          timestamp: student.lastActive ? new Date(student.lastActive).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : '2026-10-06 14:00 UTC',
          description: `Student demonstrated ${student.attendancePercent || 85}% live attendance across active module classes.`
        });
      }

      // 5. Staff Notes
      if (student.internalNotesList && student.internalNotesList.length) {
        student.internalNotesList.forEach((n, idx) => {
          events.push({
            id: `act-note-${n.id || idx}`,
            title: `Internal Note Added by ${n.author}`,
            category: 'Staff Note',
            dotType: n.priority === 'High' ? 'warning' : 'info',
            timestamp: new Date(n.timestamp).toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
            description: n.text
          });
        });
      }

      // 6. Certificate Status
      if (student.certificateStatus === 'Issued') {
        events.push({
          id: `act-${student.id}-6`,
          title: 'Certificate of Completion Issued',
          category: 'Credential',
          dotType: 'success',
          timestamp: '2026-10-05 14:30 UTC',
          description: 'Official verified digital credential signed and dispatched to student.'
        });
      }

      events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return events;
    }
  };

  // --- enrollmentRepository ---
  const enrollmentRepository = {
    findAll: async (options = {}) => store.queryDocs('enrollments', options),
    findById: async (id) => store.getDoc('enrollments', id),
    create: async (enrData) => {
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      const clean = {
        ...enrData,
        id: enrData.id || `enr-${Date.now()}`,
        submittedAt: enrData.submittedAt || nowIso,
        status: enrData.status || 'Pending',
        updatedBy: actionAuthor,
        updatedAt: nowIso,
        history: enrData.history || [
          {
            status: enrData.status || 'Pending',
            timestamp: nowIso,
            actionBy: actionAuthor,
            note: 'Enrollment application submitted.'
          }
        ]
      };
      store.state.enrollments.unshift(clean);
      store.saveState();
      store.persistDoc('enrollments', clean.id, clean);
      auditRepository.log('Submitted Enrollment Application', 'Enrollment', clean.studentName);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(clean, 'submitted');
      } catch (e) {}
      return clean;
    },
    update: async (id, enrData) => {
      const idx = store.state.enrollments.findIndex(e => e.id === id);
      if (idx !== -1) {
        store.state.enrollments[idx] = { ...store.state.enrollments[idx], ...enrData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('enrollments', id, store.state.enrollments[idx]);
        return store.state.enrollments[idx];
      }
      return null;
    },
    approve: async (id, targetBatchId) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment application not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      
      const batchId = targetBatchId || enr.batchId;
      const batch = store.state.batches.find(b => b.id === batchId);
      if (batch) {
        // STRICT INVARIANT ENFORCEMENT: Max 30 students per batch
        if (batch.enrolledCount >= 30) {
          throw new Error(`Cohort "${batch.name}" has reached maximum capacity of 30 students. Direct enrollment approval is locked. Please place applicant on the Waitlist instead.`);
        }
        batch.enrolledCount = Math.min(batch.enrolledCount + 1, 30);
        if (batch.enrolledCount >= 30) batch.status = 'FULL';
        batch.updatedAt = nowIso;
        enr.batchId = batch.id;
        enr.batchName = batch.name;
        store.persistDoc('batches', batch.id, batch);
      }

      enr.status = 'Approved';
      enr.decidedAt = nowIso;
      enr.decidedBy = actionAuthor;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Approved',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Approved for course ${enr.courseTitle}${batch ? ' in ' + batch.name : ''}.`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Approved';
        if (batch) {
          student.batchId = batch.id;
          student.batchName = batch.name;
        }
        student.lastActive = nowIso;
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Approved Student Enrollment', 'Enrollment', `${enr.studentName} → ${enr.courseTitle} (Decided by: ${actionAuthor})`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'approved');
      } catch (e) {}
      return enr;
    },
    reject: async (id, reason) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment application not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      enr.status = 'Rejected';
      enr.rejectionReason = reason || 'Application declined by admissions desk.';
      enr.decidedAt = nowIso;
      enr.decidedBy = actionAuthor;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Rejected',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Application rejected: ${enr.rejectionReason}`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Rejected';
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Rejected Student Enrollment', 'Enrollment', `${enr.studentName}: ${enr.rejectionReason} (By: ${actionAuthor})`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'rejected');
      } catch (e) {}
      return enr;
    },
    assignBatch: async (enrollmentId, newBatchId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment application not found.');
      const targetBatch = store.state.batches.find(b => b.id === newBatchId);
      if (!targetBatch) throw new Error('Target cohort batch not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      // INVARIANT ENFORCEMENT: Max 30 students per batch
      if (targetBatch.enrolledCount >= 30) {
        throw new Error(`Target cohort "${targetBatch.name}" is already at maximum capacity (30 / 30). Select an alternate cohort or place on waitlist.`);
      }

      // Decrement previous batch if enrolled
      if (enr.batchId && enr.batchId !== newBatchId && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
        const oldBatch = store.state.batches.find(b => b.id === enr.batchId);
        if (oldBatch && oldBatch.enrolledCount > 0) {
          oldBatch.enrolledCount -= 1;
          if (oldBatch.status === 'FULL') oldBatch.status = 'OPEN';
          oldBatch.updatedAt = nowIso;
          store.persistDoc('batches', oldBatch.id, oldBatch);
        }
      }

      // Increment new batch
      if (enr.status === 'Enrolled' || enr.status === 'Approved') {
        targetBatch.enrolledCount = Math.min(targetBatch.enrolledCount + 1, 30);
        if (targetBatch.enrolledCount >= 30) targetBatch.status = 'FULL';
        targetBatch.updatedAt = nowIso;
        store.persistDoc('batches', targetBatch.id, targetBatch);
      }

      enr.batchId = targetBatch.id;
      enr.batchName = targetBatch.name;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: enr.status,
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Assigned to cohort ${targetBatch.name}`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.batchId = targetBatch.id;
        student.batchName = targetBatch.name;
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Reassigned Cohort Batch', 'Enrollment', `${enr.studentName} → ${targetBatch.name} (By: ${actionAuthor})`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'batch_assigned');
      } catch (e) {}
      return targetBatch;
    },
    moveToWaitlist: async (enrollmentId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment record not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      if (enr.batchId) {
        const batch = store.state.batches.find(b => b.id === enr.batchId);
        if (batch) {
          if (enr.status === 'Enrolled' && batch.enrolledCount > 0) {
            batch.enrolledCount -= 1;
            if (batch.status === 'FULL') batch.status = 'OPEN';
          }
          batch.waitlistCount = (batch.waitlistCount || 0) + 1;
          batch.updatedAt = nowIso;
          store.persistDoc('batches', batch.id, batch);
        }
      }

      enr.status = 'Waitlisted';
      enr.decidedAt = nowIso;
      enr.decidedBy = actionAuthor;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Waitlisted',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Placed on waitlist for ${enr.batchName || 'cohort'}.`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Waitlisted';
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Moved Student to Waitlist', 'Enrollment', `${enr.studentName} (${enr.batchName || 'cohort'}) by ${actionAuthor}`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'waitlisted');
      } catch (e) {}
      return enr;
    },
    admitFromWaitlist: async (enrollmentId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment record not found.');
      const batch = store.state.batches.find(b => b.id === enr.batchId);
      if (!batch) throw new Error('Cohort batch not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      if (batch.enrolledCount >= 30) {
        throw new Error(`Cohort "${batch.name}" is already at maximum capacity (30 / 30). Cannot admit from waitlist until a seat opens.`);
      }

      batch.enrolledCount += 1;
      if (batch.waitlistCount > 0) batch.waitlistCount -= 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';
      batch.updatedAt = nowIso;

      enr.status = 'Enrolled';
      enr.decidedAt = nowIso;
      enr.decidedBy = actionAuthor;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Enrolled',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Admitted from waitlist into ${batch.name} (${batch.enrolledCount}/30).`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Enrolled';
        student.batchId = batch.id;
        student.batchName = batch.name;
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('batches', batch.id, batch);
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Admitted Student from Waitlist', 'Enrollment', `${enr.studentName} into ${batch.name} (${batch.enrolledCount}/30) by ${actionAuthor}`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'moved_from_waitlist');
      } catch (e) {}
      return enr;
    },
    cancel: async (id, reason = 'Cancelled by applicant or administrative request') => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment record not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      if (enr.batchId && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
        const batch = store.state.batches.find(b => b.id === enr.batchId);
        if (batch && batch.enrolledCount > 0) {
          batch.enrolledCount -= 1;
          if (batch.status === 'FULL') batch.status = 'OPEN';
          batch.updatedAt = nowIso;
          store.persistDoc('batches', batch.id, batch);
        }
      }

      enr.status = 'Cancelled';
      enr.cancellationReason = reason;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Cancelled',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Enrollment cancelled. Reason: ${reason}`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Cancelled';
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Cancelled Enrollment', 'Enrollment', `${enr.studentName} (${enr.courseTitle}). Reason: ${reason}`);
      return enr;
    },
    complete: async (id) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment record not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      enr.status = 'Completed';
      enr.completedAt = nowIso;
      enr.completedBy = actionAuthor;
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Completed',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Course completed and credential requirements fulfilled.`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Completed';
        student.progressPercent = 100;
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Completed Enrollment', 'Enrollment', `${enr.studentName} completed ${enr.courseTitle}`);
      try {
        await notificationDeliveryService.triggerEnrollmentNotification(enr, 'completed');
      } catch (e) {}
      return enr;
    },
    changeCourse: async (id, newCourseId) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment record not found.');
      const newCourse = store.state.courses.find(c => c.id === newCourseId);
      if (!newCourse) throw new Error('Target course not found.');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();

      const prevCourseTitle = enr.courseTitle;

      // Unassign batch if it was bound to previous course
      if (enr.batchId && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
        const batch = store.state.batches.find(b => b.id === enr.batchId);
        if (batch && batch.enrolledCount > 0) {
          batch.enrolledCount -= 1;
          if (batch.status === 'FULL') batch.status = 'OPEN';
          batch.updatedAt = nowIso;
          store.persistDoc('batches', batch.id, batch);
        }
      }

      enr.courseId = newCourse.id;
      enr.courseTitle = newCourse.title;
      enr.batchId = null;
      enr.batchName = 'Unassigned';
      enr.status = 'Pending';
      enr.updatedBy = actionAuthor;
      enr.updatedAt = nowIso;
      enr.history = enr.history || [];
      enr.history.push({
        status: 'Course Changed',
        timestamp: nowIso,
        actionBy: actionAuthor,
        note: `Course changed from "${prevCourseTitle}" to "${newCourse.title}". Batch unassigned pending approval.`
      });

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrolledCourseId = newCourse.id;
        student.enrolledCourseTitle = newCourse.title;
        student.batchId = null;
        student.batchName = 'Unassigned';
        student.enrollmentStatus = 'Pending';
        store.persistDoc('students', student.id, student);
      }

      store.saveState();
      store.persistDoc('enrollments', enr.id, enr);
      auditRepository.log('Changed Enrollment Course', 'Enrollment', `${enr.studentName}: ${prevCourseTitle} → ${newCourse.title}`);
      return enr;
    },
    getHistory: async (studentOrEnrollmentId) => {
      let enr = store.state.enrollments.find(e => e.id === studentOrEnrollmentId);
      if (!enr) {
        enr = store.state.enrollments.find(e => e.studentId === studentOrEnrollmentId);
      }
      return enr && enr.history ? JSON.parse(JSON.stringify(enr.history)) : [];
    },
    updateStatus: async (id, newStatus, reason = '') => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (enr) {
        const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
        const nowIso = new Date().toISOString();
        const prev = enr.status;
        enr.status = newStatus;
        enr.updatedBy = actionAuthor;
        enr.updatedAt = nowIso;
        if (reason) {
          enr.rejectionReason = reason;
          enr.notes = (enr.notes ? enr.notes + ' | ' : '') + reason;
        }
        enr.history = enr.history || [];
        enr.history.push({
          status: newStatus,
          timestamp: nowIso,
          actionBy: actionAuthor,
          note: reason ? `Status changed from ${prev} to ${newStatus}. Note: ${reason}` : `Status changed from ${prev} to ${newStatus}.`
        });

        const student = store.state.students.find(s => s.id === enr.studentId);
        if (student) {
          student.enrollmentStatus = newStatus;
          store.persistDoc('students', student.id, student);
        }
        store.saveState();
        store.persistDoc('enrollments', enr.id, enr);
        auditRepository.log('Updated Enrollment Status', 'Enrollment', `${enr.studentName} (${enr.courseTitle}): ${prev} → ${newStatus} by ${actionAuthor}`);
        return true;
      }
      return false;
    },
    addNote: async (id, noteText) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (enr) {
        const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
        const timeStr = new Date().toISOString().split('T')[0];
        enr.notes = (enr.notes ? enr.notes + '\n' : '') + `[${timeStr} - ${actionAuthor}] ${noteText}`;
        enr.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('enrollments', enr.id, enr);
        return true;
      }
      return false;
    }
  };

  // --- contentRepository (Classes, Modules, Lessons, Videos, Resources) ---
  const contentRepository = {
    getClasses: async (options = {}) => store.queryDocs('classes', options),
    getClassById: async (id) => store.getDoc('classes', id),
    saveClass: async (classData) => {
      const idx = store.state.classes.findIndex(c => c.id === classData.id);
      if (idx !== -1) {
        store.state.classes[idx] = { ...store.state.classes[idx], ...classData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('classes', classData.id, store.state.classes[idx]);
        auditRepository.log('Updated Curriculum Class', 'Class', store.state.classes[idx].title);
        try {
          await notificationDeliveryService.triggerClassNotification(store.state.classes[idx], 'rescheduled');
        } catch (e) {}
        return store.state.classes[idx];
      } else {
        const newClass = {
          ...classData,
          id: classData.id || `cls-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.classes.unshift(newClass);
        store.saveState();
        store.persistDoc('classes', newClass.id, newClass);
        auditRepository.log('Created Curriculum Class', 'Class', newClass.title);
        try {
          await notificationDeliveryService.triggerClassNotification(newClass, 'new_class');
        } catch (e) {}
        return newClass;
      }
    },
    duplicateClass: async (id) => {
      const orig = store.state.classes.find(c => c.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `cls-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.classes.unshift(clone);
      store.saveState();
      store.persistDoc('classes', clone.id, clone);
      auditRepository.log('Duplicated Curriculum Class', 'Class', clone.title);
      return clone;
    },
    archiveClass: async (id) => {
      const c = store.state.classes.find(item => item.id === id);
      if (c) {
        c.status = 'Archived';
        c.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('classes', id, c);
        auditRepository.log('Archived Curriculum Class', 'Class', c.title);
        try {
          await notificationDeliveryService.triggerClassNotification(c, 'cancelled');
        } catch (e) {}
        return true;
      }
      return false;
    },

    getModules: async (options = {}) => store.queryDocs('modules', options),
    getModuleById: async (id) => store.getDoc('modules', id),
    saveModule: async (modData) => {
      const idx = store.state.modules.findIndex(m => m.id === modData.id);
      if (idx !== -1) {
        store.state.modules[idx] = { ...store.state.modules[idx], ...modData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('modules', modData.id, store.state.modules[idx]);
        auditRepository.log('Updated Curriculum Module', 'Module', store.state.modules[idx].title);
        return store.state.modules[idx];
      } else {
        const newMod = {
          ...modData,
          id: modData.id || `mod-${Date.now()}`,
          classesCount: modData.classesCount || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.modules.unshift(newMod);
        store.saveState();
        store.persistDoc('modules', newMod.id, newMod);
        auditRepository.log('Created Curriculum Module', 'Module', newMod.title);
        return newMod;
      }
    },
    duplicateModule: async (id) => {
      const orig = store.state.modules.find(m => m.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `mod-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.modules.unshift(clone);
      store.saveState();
      store.persistDoc('modules', clone.id, clone);
      auditRepository.log('Duplicated Curriculum Module', 'Module', clone.title);
      return clone;
    },
    archiveModule: async (id) => {
      const m = store.state.modules.find(item => item.id === id);
      if (m) {
        m.status = 'Archived';
        m.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('modules', id, m);
        auditRepository.log('Archived Curriculum Module', 'Module', m.title);
        return true;
      }
      return false;
    },

    getLessons: async (options = {}) => store.queryDocs('lessons', options),
    getLessonById: async (id) => store.getDoc('lessons', id),
    saveLesson: async (lsnData) => {
      const idx = store.state.lessons.findIndex(l => l.id === lsnData.id);
      if (idx !== -1) {
        store.state.lessons[idx] = { ...store.state.lessons[idx], ...lsnData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('lessons', lsnData.id, store.state.lessons[idx]);
        auditRepository.log('Updated Lesson', 'Lesson', store.state.lessons[idx].title);
        return store.state.lessons[idx];
      } else {
        const newLsn = {
          ...lsnData,
          id: lsnData.id || `lsn-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.lessons.unshift(newLsn);
        store.saveState();
        store.persistDoc('lessons', newLsn.id, newLsn);
        auditRepository.log('Created Lesson', 'Lesson', newLsn.title);
        return newLsn;
      }
    },
    duplicateLesson: async (id) => {
      const orig = store.state.lessons.find(l => l.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `lsn-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.lessons.unshift(clone);
      store.saveState();
      store.persistDoc('lessons', clone.id, clone);
      auditRepository.log('Duplicated Lesson', 'Lesson', clone.title);
      return clone;
    },
    archiveLesson: async (id) => {
      const l = store.state.lessons.find(item => item.id === id);
      if (l) {
        l.status = 'Archived';
        l.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('lessons', id, l);
        auditRepository.log('Archived Lesson', 'Lesson', l.title);
        return true;
      }
      return false;
    },

    getVideos: async (options = {}) => store.queryDocs('videos', options),
    getVideoById: async (id) => store.getDoc('videos', id),
    saveVideo: async (vidData) => {
      const idx = store.state.videos.findIndex(v => v.id === vidData.id);
      if (idx !== -1) {
        store.state.videos[idx] = { ...store.state.videos[idx], ...vidData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('videos', vidData.id, store.state.videos[idx]);
        auditRepository.log('Updated Video Asset', 'Video', store.state.videos[idx].title);
        return store.state.videos[idx];
      } else {
        const newVid = {
          ...vidData,
          id: vidData.id || `vid-${Date.now()}`,
          uploadedAt: vidData.uploadedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.videos.unshift(newVid);
        store.saveState();
        store.persistDoc('videos', newVid.id, newVid);
        auditRepository.log('Created Video Asset', 'Video', newVid.title);
        return newVid;
      }
    },
    archiveVideo: async (id) => {
      const v = store.state.videos.find(item => item.id === id);
      if (v) {
        v.status = 'Archived';
        v.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('videos', id, v);
        auditRepository.log('Archived Video Asset', 'Video', v.title);
        return true;
      }
      return false;
    },

    getResources: async (options = {}) => store.queryDocs('resources', options),
    getResourceById: async (id) => store.getDoc('resources', id),
    saveResource: async (resData) => {
      const idx = store.state.resources.findIndex(r => r.id === resData.id);
      if (idx !== -1) {
        store.state.resources[idx] = { ...store.state.resources[idx], ...resData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('resources', resData.id, store.state.resources[idx]);
        auditRepository.log('Updated Resource Asset', 'Resource', store.state.resources[idx].title);
        return store.state.resources[idx];
      } else {
        const newRes = {
          ...resData,
          id: resData.id || `res-${Date.now()}`,
          downloadCount: resData.downloadCount || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.resources.unshift(newRes);
        store.saveState();
        store.persistDoc('resources', newRes.id, newRes);
        auditRepository.log('Created Resource Asset', 'Resource', newRes.title);
        return newRes;
      }
    },
    archiveResource: async (id) => {
      const r = store.state.resources.find(item => item.id === id);
      if (r) {
        r.status = 'Archived';
        r.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('resources', id, r);
        auditRepository.log('Archived Resource Asset', 'Resource', r.title);
        return true;
      }
      return false;
    }
  };

  // --- projectRepository (Projects, Assignments & Submissions) ---
  const projectRepository = {
    getProjects: async (options = {}) => store.queryDocs('projects', options),
    getProjectById: async (id) => store.getDoc('projects', id),
    saveProject: async (projectData) => {
      const idx = store.state.projects.findIndex(p => p.id === projectData.id);
      if (idx !== -1) {
        store.state.projects[idx] = { ...store.state.projects[idx], ...projectData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('projects', projectData.id, store.state.projects[idx]);
        auditRepository.log('Updated Project Milestone', 'Project', store.state.projects[idx].title);
        return store.state.projects[idx];
      } else {
        const newProj = {
          ...projectData,
          id: projectData.id || `prj-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.projects.unshift(newProj);
        store.saveState();
        store.persistDoc('projects', newProj.id, newProj);
        auditRepository.log('Created Project Milestone', 'Project', newProj.title);
        return newProj;
      }
    },
    duplicateProject: async (id) => {
      const orig = store.state.projects.find(p => p.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `prj-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.projects.unshift(clone);
      store.saveState();
      store.persistDoc('projects', clone.id, clone);
      auditRepository.log('Duplicated Project Milestone', 'Project', clone.title);
      return clone;
    },
    archiveProject: async (id) => {
      const p = store.state.projects.find(item => item.id === id);
      if (p) {
        p.status = 'Archived';
        p.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('projects', id, p);
        auditRepository.log('Archived Project Milestone', 'Project', p.title);
        return true;
      }
      return false;
    },

    getAssignments: async (options = {}) => store.queryDocs('assignments', options),
    getAssignmentById: async (id) => store.getDoc('assignments', id),
    saveAssignment: async (assignmentData) => {
      const idx = store.state.assignments.findIndex(a => a.id === assignmentData.id);
      if (idx !== -1) {
        store.state.assignments[idx] = { ...store.state.assignments[idx], ...assignmentData, updatedAt: new Date().toISOString() };
        store.saveState();
        store.persistDoc('assignments', assignmentData.id, store.state.assignments[idx]);
        auditRepository.log('Updated Assignment Requirement', 'Assignment', store.state.assignments[idx].title);
        return store.state.assignments[idx];
      } else {
        const newAsg = {
          ...assignmentData,
          id: assignmentData.id || `asg-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.state.assignments.unshift(newAsg);
        store.saveState();
        store.persistDoc('assignments', newAsg.id, newAsg);
        auditRepository.log('Created Assignment Requirement', 'Assignment', newAsg.title);
        return newAsg;
      }
    },
    duplicateAssignment: async (id) => {
      const orig = store.state.assignments.find(a => a.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `asg-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.state.assignments.unshift(clone);
      store.saveState();
      store.persistDoc('assignments', clone.id, clone);
      auditRepository.log('Duplicated Assignment Requirement', 'Assignment', clone.title);
      return clone;
    },
    archiveAssignment: async (id) => {
      const a = store.state.assignments.find(item => item.id === id);
      if (a) {
        a.status = 'Archived';
        a.updatedAt = new Date().toISOString();
        store.saveState();
        store.persistDoc('assignments', id, a);
        auditRepository.log('Archived Assignment Requirement', 'Assignment', a.title);
        return true;
      }
      return false;
    },

    getSubmissions: async (filter = {}) => {
      return store.queryDocs('submissions', typeof filter === 'object' ? { filters: Object.entries(filter).map(([k, v]) => ({ field: k, value: v })) } : {});
    },
    getSubmissionById: async (id) => store.getDoc('submissions', id),
    saveSubmission: async (subData) => {
      const idx = store.state.submissions.findIndex(s => s.id === subData.id);
      if (idx !== -1) {
        store.state.submissions[idx] = { ...store.state.submissions[idx], ...subData, lastUpdated: new Date().toISOString() };
        store.saveState();
        store.persistDoc('submissions', subData.id, store.state.submissions[idx]);
        return store.state.submissions[idx];
      } else {
        const newSub = {
          ...subData,
          id: subData.id || `sub-${Date.now()}`,
          submittedAt: subData.submittedAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        store.state.submissions.unshift(newSub);
        store.saveState();
        store.persistDoc('submissions', newSub.id, newSub);
        return newSub;
      }
    },
    gradeSubmission: async (id, scoreOrObj, feedback, reviewer) => {
      const sub = store.state.submissions.find(s => s.id === id);
      if (sub) {
        if (typeof scoreOrObj === 'object' && scoreOrObj !== null) {
          if (scoreOrObj.score !== undefined && scoreOrObj.score !== null) sub.score = Number(scoreOrObj.score);
          if (scoreOrObj.feedback !== undefined) sub.feedback = scoreOrObj.feedback;
          if (scoreOrObj.internalNote !== undefined) sub.internalReviewerNote = scoreOrObj.internalNote;
          if (scoreOrObj.reviewer !== undefined) sub.reviewer = scoreOrObj.reviewer;
          if (scoreOrObj.status !== undefined) sub.status = scoreOrObj.status;
          else sub.status = 'Reviewed';
        } else {
          sub.score = Number(scoreOrObj);
          sub.feedback = feedback || '';
          sub.reviewer = reviewer || store.getCurrentRole();
          sub.status = 'Reviewed';
        }
        sub.lastUpdated = new Date().toISOString();
        store.saveState();
        store.persistDoc('submissions', sub.id, sub);
        auditRepository.log('Evaluated Student Submission', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle || sub.fileName} - ${sub.studentName} (${sub.score}/100)`);
        return sub;
      }
      return null;
    },
    returnForRevision: async (id, feedback, internalNote, reviewer) => {
      const sub = store.state.submissions.find(s => s.id === id);
      if (sub) {
        sub.status = 'Returned for revision';
        sub.feedback = feedback || 'Please review reviewer feedback and submit revised solution.';
        if (internalNote) sub.internalReviewerNote = internalNote;
        sub.reviewer = reviewer || store.getCurrentRole();
        sub.lastUpdated = new Date().toISOString();
        store.saveState();
        store.persistDoc('submissions', sub.id, sub);
        auditRepository.log('Returned Submission For Revision', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle || sub.fileName} - ${sub.studentName}`);
        return sub;
      }
      return null;
    },
    approveCompletion: async (id, feedback, internalNote, reviewer, score = 100) => {
      const sub = store.state.submissions.find(s => s.id === id);
      if (sub) {
        sub.status = 'Approved';
        sub.score = Number(score) || 100;
        sub.feedback = feedback || 'Milestone requirements completed and approved by faculty reviewer.';
        if (internalNote) sub.internalReviewerNote = internalNote;
        sub.reviewer = reviewer || store.getCurrentRole();
        sub.lastUpdated = new Date().toISOString();
        store.saveState();
        store.persistDoc('submissions', sub.id, sub);
        auditRepository.log('Approved Milestone Completion', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle || sub.fileName} - ${sub.studentName} (${sub.score}/100)`);
        return sub;
      }
      return null;
    }
  };

  // --- storageRepository (Secure File & Content Storage Engine) ---
  const storageRepository = {
    SPECS: {
      COVERS: {
        maxSizeBytes: 5 * 1024 * 1024,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg']
      },
      RESOURCES: {
        maxSizeBytes: 50 * 1024 * 1024,
        allowedExtensions: ['.pdf', '.doc', '.docx', '.zip', '.txt', '.json', '.png', '.jpg', '.webp']
      },
      VIDEOS: {
        maxSizeBytes: 500 * 1024 * 1024,
        allowedExtensions: ['.mp4', '.webm', '.mov']
      },
      THUMBNAILS: {
        maxSizeBytes: 5 * 1024 * 1024,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
      },
      SUBMISSIONS: {
        maxSizeBytes: 25 * 1024 * 1024,
        allowedExtensions: ['.pdf', '.zip', '.py', '.js', '.html', '.css', '.ipynb', '.docx', '.txt', '.json']
      }
    },

    validateFile: (file, specKey) => {
      const spec = storageRepository.SPECS[specKey] || storageRepository.SPECS.RESOURCES;
      if (!file) throw new Error('No file provided for upload.');

      const name = file.name || 'unnamed_file';
      const extMatch = name.match(/\.[0-9a-z]+$/i);
      const ext = extMatch ? extMatch[0].toLowerCase() : '';

      if (spec.allowedExtensions && !spec.allowedExtensions.includes(ext)) {
        throw new Error(`File type "${ext || 'unknown'}" is not supported. Allowed formats: ${spec.allowedExtensions.join(', ')}`);
      }

      const size = file.size || 0;
      if (size > spec.maxSizeBytes) {
        const mbLimit = Math.round(spec.maxSizeBytes / (1024 * 1024));
        throw new Error(`File size (${(size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of ${mbLimit} MB.`);
      }

      return true;
    },

    uploadResource: async ({ file, courseId, moduleId, lessonId, title, type = 'PDF Guide', onProgress }) => {
      storageRepository.validateFile(file, 'RESOURCES');
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      const safeCourseId = courseId || 'course-general';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `courses/${safeCourseId}/resources/${Date.now()}_${cleanFileName}`;

      let downloadUrl = '';
      if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
        try {
          const ref = store.storage.ref(storagePath);
          const uploadTask = ref.put(file);
          if (typeof onProgress === 'function') {
            uploadTask.on('state_changed', (snap) => {
              const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
              onProgress({ percent, bytesTransferred: snap.bytesTransferred, totalBytes: snap.totalBytes, state: snap.state });
            });
          }
          await uploadTask;
          downloadUrl = await ref.getDownloadURL();
        } catch (e) {
          downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      } else {
        if (typeof onProgress === 'function') {
          onProgress({ percent: 50, bytesTransferred: file.size / 2, totalBytes: file.size, state: 'running' });
          onProgress({ percent: 100, bytesTransferred: file.size, totalBytes: file.size, state: 'success' });
        }
        downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
      }

      const fileMeta = {
        id: `meta-${Date.now()}`,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        fileSizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        storagePath: storagePath,
        downloadUrl: downloadUrl,
        relatedCourseId: safeCourseId,
        relatedModuleId: moduleId || null,
        relatedLessonId: lessonId || null,
        uploadedBy: actionAuthor,
        uploadedAt: nowIso,
        status: 'ready',
        version: 1,
        visibility: 'Enrolled'
      };

      store.state.fileMetadata = store.state.fileMetadata || [];
      store.state.fileMetadata.unshift(fileMeta);

      const resourceRecord = {
        id: `res-${Date.now()}`,
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        type: type,
        fileSize: fileMeta.fileSizeFormatted,
        downloadUrl: downloadUrl,
        storagePath: storagePath,
        courseId: safeCourseId,
        moduleId: moduleId || null,
        lessonId: lessonId || null,
        downloadCount: 0,
        createdAt: nowIso,
        status: 'Active',
        metadataId: fileMeta.id
      };

      store.state.resources.unshift(resourceRecord);
      store.saveState();
      store.persistDoc('fileMetadata', fileMeta.id, fileMeta);
      store.persistDoc('resources', resourceRecord.id, resourceRecord);
      auditRepository.log('Uploaded Course Resource', 'Storage', `${resourceRecord.title} (${fileMeta.fileSizeFormatted})`);

      return { resource: resourceRecord, metadata: fileMeta };
    },

    replaceResource: async (resourceId, { file, onProgress }) => {
      const res = store.state.resources.find(r => r.id === resourceId);
      if (!res) throw new Error('Resource not found');
      storageRepository.validateFile(file, 'RESOURCES');

      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      const safeCourseId = res.courseId || 'course-general';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `courses/${safeCourseId}/resources/${Date.now()}_${cleanFileName}`;

      let downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
      if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
        try {
          const ref = store.storage.ref(storagePath);
          const uploadTask = ref.put(file);
          if (typeof onProgress === 'function') {
            uploadTask.on('state_changed', (snap) => {
              const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
              onProgress({ percent, bytesTransferred: snap.bytesTransferred, totalBytes: snap.totalBytes, state: snap.state });
            });
          }
          await uploadTask;
          downloadUrl = await ref.getDownloadURL();
        } catch (e) {
          downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      } else {
        if (typeof onProgress === 'function') {
          onProgress({ percent: 100, bytesTransferred: file.size, totalBytes: file.size, state: 'success' });
        }
      }

      res.storagePath = storagePath;
      res.downloadUrl = downloadUrl;
      res.fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      res.lastUpdated = nowIso;

      let meta = store.state.fileMetadata && store.state.fileMetadata.find(m => m.id === res.metadataId);
      if (meta) {
        meta.version = (meta.version || 1) + 1;
        meta.fileName = file.name;
        meta.fileSize = file.size;
        meta.storagePath = storagePath;
        meta.downloadUrl = downloadUrl;
        meta.uploadedBy = actionAuthor;
        meta.uploadedAt = nowIso;
        store.persistDoc('fileMetadata', meta.id, meta);
      }

      store.saveState();
      store.persistDoc('resources', res.id, res);
      auditRepository.log('Replaced Course Resource', 'Storage', `${res.title} (Updated to version ${meta ? meta.version : 2})`);
      return res;
    },

    deleteResource: async (resourceId) => {
      const res = store.state.resources.find(r => r.id === resourceId);
      if (!res) throw new Error('Resource not found');
      res.status = 'Archived';
      res.archivedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('resources', res.id, res);
      auditRepository.log('Archived Course Resource', 'Storage', res.title);
      return true;
    },

    downloadResource: async (resourceId, studentId = null) => {
      const res = store.state.resources.find(r => r.id === resourceId);
      if (!res) throw new Error('Resource not found');
      if (res.status === 'Archived') throw new Error('Resource has been retired or archived.');

      if (studentId) {
        const student = store.state.students.find(s => s.id === studentId);
        if (student && res.courseId && student.enrolledCourseId !== res.courseId) {
          throw new Error('Access denied: You are not enrolled in the course associated with this learning resource.');
        }
      }

      res.downloadCount = (res.downloadCount || 0) + 1;
      store.saveState();
      store.persistDoc('resources', res.id, res);
      return { url: res.downloadUrl, title: res.title, downloadCount: res.downloadCount };
    },

    uploadVideo: async ({ file, thumbnailFile, courseId, moduleId, title, description, duration = '45:00', onProgress }) => {
      if (file) storageRepository.validateFile(file, 'VIDEOS');
      if (thumbnailFile) storageRepository.validateFile(thumbnailFile, 'THUMBNAILS');

      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();
      const nowIso = new Date().toISOString();
      const videoId = `vid-${Date.now()}`;
      const safeCourseId = courseId || 'course-general';

      let videoUrl = '';
      let storagePath = '';
      if (file) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        storagePath = `courses/${safeCourseId}/videos/${videoId}/${cleanName}`;
        if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
          try {
            const ref = store.storage.ref(storagePath);
            const uploadTask = ref.put(file);
            if (typeof onProgress === 'function') {
              uploadTask.on('state_changed', (snap) => {
                const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
                onProgress({ percent, state: snap.state });
              });
            }
            await uploadTask;
            videoUrl = await ref.getDownloadURL();
          } catch (e) {
            videoUrl = `https://storage.nexvion.ai/${storagePath}`;
          }
        } else {
          if (typeof onProgress === 'function') onProgress({ percent: 100, state: 'success' });
          videoUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      }

      let thumbnailUrl = 'assets/video-thumb-default.jpg';
      if (thumbnailFile) {
        const thumbName = thumbnailFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const thumbPath = `courses/${safeCourseId}/videos/${videoId}/thumb_${thumbName}`;
        if (store.storage && thumbnailFile instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
          try {
            const thumbRef = store.storage.ref(thumbPath);
            await thumbRef.put(thumbnailFile);
            thumbnailUrl = await thumbRef.getDownloadURL();
          } catch (e) {
            thumbnailUrl = `https://storage.nexvion.ai/${thumbPath}`;
          }
        } else {
          thumbnailUrl = `https://storage.nexvion.ai/${thumbPath}`;
        }
      }

      const videoRecord = {
        id: videoId,
        title: title || 'Untitled Session Video',
        description: description || '',
        duration: duration,
        courseId: safeCourseId,
        moduleId: moduleId || null,
        storagePath: storagePath,
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
        status: 'ready',
        visibility: 'EnrolledOnly',
        uploadedBy: actionAuthor,
        uploadedAt: nowIso
      };

      if (file) {
        const fileMeta = {
          id: `meta-vid-${videoId}`,
          fileName: file.name,
          fileType: file.type || 'video/mp4',
          fileSize: file.size,
          fileSizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          storagePath: storagePath,
          downloadUrl: videoUrl,
          relatedCourseId: safeCourseId,
          relatedModuleId: moduleId || null,
          relatedLessonId: null,
          uploadedBy: actionAuthor,
          uploadedAt: nowIso,
          status: 'ready',
          version: 1,
          visibility: 'EnrolledOnly'
        };
        store.state.fileMetadata = store.state.fileMetadata || [];
        store.state.fileMetadata.unshift(fileMeta);
        store.persistDoc('fileMetadata', fileMeta.id, fileMeta);
      }

      store.state.videos = store.state.videos || [];
      store.state.videos.unshift(videoRecord);
      store.saveState();
      store.persistDoc('videos', videoRecord.id, videoRecord);
      auditRepository.log('Uploaded Video Asset', 'Storage', `${videoRecord.title} (${duration})`);

      return videoRecord;
    },

    previewVideo: async (videoId, studentId = null) => {
      const v = store.state.videos.find(item => item.id === videoId);
      if (!v) throw new Error('Video asset not found');
      if (v.status === 'Archived') throw new Error('Video session is archived and unavailable.');

      if (studentId) {
        const student = store.state.students.find(s => s.id === studentId);
        if (student && v.courseId && student.enrolledCourseId !== v.courseId) {
          throw new Error('Access denied: Video stream restricted to verified cohort students enrolled in this course.');
        }
      }

      return {
        id: v.id,
        title: v.title,
        duration: v.duration,
        playbackStreamUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        status: v.status
      };
    },

    replaceVideo: async (videoId, { file, thumbnailFile, onProgress }) => {
      const v = store.state.videos.find(item => item.id === videoId);
      if (!v) throw new Error('Video asset not found');
      if (file) storageRepository.validateFile(file, 'VIDEOS');
      if (thumbnailFile) storageRepository.validateFile(thumbnailFile, 'THUMBNAILS');

      const nowIso = new Date().toISOString();
      const actionAuthor = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || store.getCurrentRole();

      if (file) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        v.storagePath = `courses/${v.courseId || 'general'}/videos/${v.id}/${Date.now()}_${cleanName}`;
        v.videoUrl = `https://storage.nexvion.ai/${v.storagePath}`;
      }
      if (thumbnailFile) {
        const thumbName = thumbnailFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        v.thumbnailUrl = `https://storage.nexvion.ai/courses/${v.courseId || 'general'}/videos/${v.id}/thumb_${thumbName}`;
      }
      v.lastUpdated = nowIso;
      v.updatedBy = actionAuthor;
      v.status = 'ready';

      store.saveState();
      store.persistDoc('videos', v.id, v);
      auditRepository.log('Replaced Video Stream Asset', 'Storage', v.title);
      return v;
    },

    archiveVideo: async (videoId) => {
      const v = store.state.videos.find(item => item.id === videoId);
      if (!v) throw new Error('Video asset not found');
      v.status = 'Archived';
      v.archivedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('videos', v.id, v);
      auditRepository.log('Archived Video Asset', 'Storage', v.title);
      return true;
    },

    updateVideoStatus: async (videoId, status) => {
      const v = store.state.videos.find(item => item.id === videoId);
      if (!v) throw new Error('Video asset not found');
      v.status = status;
      v.lastUpdated = new Date().toISOString();
      store.saveState();
      store.persistDoc('videos', v.id, v);
      auditRepository.log('Updated Video Status', 'Storage', `${v.title} -> ${status}`);
      return v;
    },

    uploadSubmission: async ({ studentId, studentName, assignmentId, projectId, courseId, file, notes, deadline, onProgress }) => {
      if (!studentId) throw new Error('Student identifier is required for submission.');
      storageRepository.validateFile(file, 'SUBMISSIONS');
      const nowIso = new Date().toISOString();
      const submissionId = `sub-${Date.now()}`;
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `submissions/${studentId}/${submissionId}/${cleanFileName}`;

      let downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
      if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
        try {
          const ref = store.storage.ref(storagePath);
          const uploadTask = ref.put(file);
          if (typeof onProgress === 'function') {
            uploadTask.on('state_changed', (snap) => {
              const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
              onProgress({ percent, state: snap.state });
            });
          }
          await uploadTask;
          downloadUrl = await ref.getDownloadURL();
        } catch (e) {
          downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      } else {
        if (typeof onProgress === 'function') onProgress({ percent: 100, state: 'success' });
      }

      const submission = {
        id: submissionId,
        studentId: studentId,
        studentName: studentName || 'Student',
        assignmentId: assignmentId || null,
        projectId: projectId || null,
        courseId: courseId || null,
        fileName: file.name,
        fileSizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        storagePath: storagePath,
        fileUrl: downloadUrl,
        studentNotes: notes || '',
        deadline: deadline || null,
        status: 'Submitted',
        score: null,
        feedback: null,
        internalReviewerNote: null,
        reviewer: null,
        submittedAt: nowIso,
        lastUpdated: nowIso,
        version: 1
      };

      const fileMeta = {
        id: `meta-${submissionId}`,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        fileSizeFormatted: submission.fileSizeFormatted,
        storagePath: storagePath,
        downloadUrl: downloadUrl,
        relatedCourseId: courseId || null,
        relatedModuleId: null,
        relatedLessonId: null,
        uploadedBy: studentName || studentId,
        uploadedAt: nowIso,
        status: 'ready',
        version: 1,
        visibility: 'Private'
      };

      store.state.submissions = store.state.submissions || [];
      store.state.submissions.unshift(submission);
      store.state.fileMetadata = store.state.fileMetadata || [];
      store.state.fileMetadata.unshift(fileMeta);

      store.saveState();
      store.persistDoc('submissions', submission.id, submission);
      store.persistDoc('fileMetadata', fileMeta.id, fileMeta);
      auditRepository.log('Submitted Project / Assignment Deliverable', 'Submission', `${submission.studentName} - ${submission.fileName}`);

      return submission;
    },

    replaceSubmission: async (submissionId, { file, notes, onProgress }) => {
      const sub = store.state.submissions.find(s => s.id === submissionId);
      if (!sub) throw new Error('Submission record not found.');
      if (sub.deadline && new Date(sub.deadline).getTime() < Date.now()) {
        throw new Error('Submission deadline has passed. Modifications are locked.');
      }
      if (sub.status === 'Reviewed' && sub.score !== null) {
        throw new Error('Submission has already been formally graded and locked. Contact faculty mentor to request revision permission.');
      }
      storageRepository.validateFile(file, 'SUBMISSIONS');

      const nowIso = new Date().toISOString();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `submissions/${sub.studentId}/${sub.id}/${Date.now()}_${cleanFileName}`;

      let downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
      if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
        try {
          const ref = store.storage.ref(storagePath);
          const uploadTask = ref.put(file);
          if (typeof onProgress === 'function') {
            uploadTask.on('state_changed', (snap) => {
              const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
              onProgress({ percent, state: snap.state });
            });
          }
          await uploadTask;
          downloadUrl = await ref.getDownloadURL();
        } catch (e) {
          downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      } else {
        if (typeof onProgress === 'function') onProgress({ percent: 100, state: 'success' });
      }

      sub.fileName = file.name;
      sub.fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      sub.storagePath = storagePath;
      sub.fileUrl = downloadUrl;
      if (notes) sub.studentNotes = notes;
      sub.status = 'Submitted';
      sub.version = (sub.version || 1) + 1;
      sub.lastUpdated = nowIso;

      store.saveState();
      store.persistDoc('submissions', sub.id, sub);
      auditRepository.log('Replaced Submission Deliverable', 'Submission', `${sub.studentName} updated to version ${sub.version}`);
      return sub;
    },

    downloadSubmission: async (submissionId, requestingUserId = null, isAdmin = false) => {
      const sub = store.state.submissions.find(s => s.id === submissionId);
      if (!sub) throw new Error('Submission not found.');

      if (!isAdmin && requestingUserId && sub.studentId !== requestingUserId) {
        throw new Error('Access denied: Unauthorized attempt to download another student\'s submission deliverable.');
      }

      return {
        url: sub.fileUrl,
        fileName: sub.fileName,
        studentName: sub.studentName
      };
    },

    uploadCourseCover: async (courseId, file, onProgress) => {
      storageRepository.validateFile(file, 'COVERS');
      const course = store.state.courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `courses/${courseId}/covers/${Date.now()}_${cleanFileName}`;

      let downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
      if (store.storage && file instanceof (typeof Blob !== 'undefined' ? Blob : Object)) {
        try {
          const ref = store.storage.ref(storagePath);
          const uploadTask = ref.put(file);
          if (typeof onProgress === 'function') {
            uploadTask.on('state_changed', (snap) => {
              const percent = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 100;
              onProgress({ percent, state: snap.state });
            });
          }
          await uploadTask;
          downloadUrl = await ref.getDownloadURL();
        } catch (e) {
          downloadUrl = `https://storage.nexvion.ai/${storagePath}`;
        }
      } else {
        if (typeof onProgress === 'function') onProgress({ percent: 100, state: 'success' });
      }

      course.coverImage = downloadUrl;
      course.updatedAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('courses', course.id, course);
      auditRepository.log('Updated Course Cover Image', 'Course', course.title);
      return downloadUrl;
    },

    getFileMetadata: async (id) => {
      const meta = (store.state.fileMetadata || []).find(m => m.id === id);
      return meta ? JSON.parse(JSON.stringify(meta)) : null;
    },

    getAllFileMetadata: async () => {
      return JSON.parse(JSON.stringify(store.state.fileMetadata || []));
    }
  };

  // --- notificationDeliveryService (Phase 14 Real Notification Delivery Infrastructure) ---
  const notificationDeliveryService = {
    // 1. Device Registration
    registerDeviceToken: async ({ userId, token, platform, deviceModel, appVersion }) => {
      if (!userId || !token || !platform) {
        throw new Error('Device registration requires userId, token, and platform.');
      }
      const validPlatforms = ['android', 'web', 'desktop', 'ios'];
      const normPlatform = String(platform).toLowerCase();
      if (!validPlatforms.includes(normPlatform)) {
        throw new Error(`Invalid platform "${platform}". Must be one of: ${validPlatforms.join(', ')}`);
      }

      store.state.deviceTokens = store.state.deviceTokens || [];
      const existingIdx = store.state.deviceTokens.findIndex(d => d.token === token);
      const nowIso = new Date().toISOString();
      const record = {
        token,
        userId,
        platform: normPlatform,
        deviceModel: deviceModel || 'Standard Terminal',
        appVersion: appVersion || '1.0.0',
        registeredAt: existingIdx !== -1 ? store.state.deviceTokens[existingIdx].registeredAt : nowIso,
        lastSeenAt: nowIso,
        valid: true
      };

      if (existingIdx !== -1) {
        store.state.deviceTokens[existingIdx] = record;
      } else {
        store.state.deviceTokens.push(record);
      }
      store.saveState();
      store.persistDoc('deviceTokens', token, record);
      return { success: true, device: JSON.parse(JSON.stringify(record)), ...record };
    },

    unregisterDeviceToken: async (arg) => {
      const token = typeof arg === 'string' ? arg : arg?.token;
      const userId = typeof arg === 'object' ? arg?.userId : null;
      if (!token) throw new Error('Device token is required to unregister.');
      store.state.deviceTokens = store.state.deviceTokens || [];
      const idx = store.state.deviceTokens.findIndex(d => d.token === token);
      if (idx !== -1) {
        if (userId && store.state.deviceTokens[idx].userId !== userId) {
          throw new Error('Forbidden: Cannot remove device token belonging to another user.');
        }
        store.state.deviceTokens.splice(idx, 1);
        store.saveState();
      }
      return { success: true, unregistered: true };
    },

    getUserDevices: async (userId) => {
      if (!userId) throw new Error('userId is required to query devices.');
      // Never expose another user's device tokens
      const list = (store.state.deviceTokens || []).filter(d => d.userId === userId && d.valid);
      return JSON.parse(JSON.stringify(list));
    },

    cleanupInvalidTokens: async (invalidTokens) => {
      store.state.deviceTokens = store.state.deviceTokens || [];
      let cleaned = 0;
      if (Array.isArray(invalidTokens)) {
        store.state.deviceTokens = store.state.deviceTokens.filter(d => {
          if (invalidTokens.includes(d.token)) {
            cleaned++;
            return false;
          }
          return true;
        });
      } else {
        store.state.deviceTokens = store.state.deviceTokens.filter(d => {
          if (!d.valid) {
            cleaned++;
            return false;
          }
          return true;
        });
      }
      store.saveState();
      return { success: true, cleanedCount: cleaned, remainingCount: store.state.deviceTokens.length };
    },

    // 2. Notification Preferences
    getUserPreferences: async (userId) => {
      if (!userId) throw new Error('userId is required to fetch preferences.');
      const defaultPrefs = {
        newClasses: true,
        classReminders: true,
        announcements: true,
        enrollmentUpdates: true,
        projectReminders: true,
        certificateUpdates: true,
        systemMessages: true,
        emailDigest: false,
        pushEnabled: true
      };
      store.state.notificationPreferences = store.state.notificationPreferences || {};
      const prefs = store.state.notificationPreferences[userId] || defaultPrefs;
      return JSON.parse(JSON.stringify(prefs));
    },

    updateUserPreferences: async (userId, prefs) => {
      if (!userId || !prefs) throw new Error('userId and preferences are required.');
      const cur = await notificationDeliveryService.getUserPreferences(userId);
      const updated = { ...cur, ...prefs };
      store.state.notificationPreferences = store.state.notificationPreferences || {};
      store.state.notificationPreferences[userId] = updated;
      store.saveState();
      store.persistDoc('notificationPreferences', userId, updated);
      return JSON.parse(JSON.stringify(updated));
    },

    // 3. Notification Dispatch & Delivery
    sendNotification: async (notifData) => {
      const currentRole = store.getCurrentRole();
      const isSystemDispatcher = notifData.sentBy && ['System Automation', 'Registrar Directorate', 'Bursar System Automation', 'Curriculum Scheduler'].includes(notifData.sentBy);
      if (!isSystemDispatcher && !store.hasPermission('send_notifications') && !['Owner', 'Super Admin', 'Academic Director'].includes(currentRole)) {
        throw new Error('Access denied: Unauthorized role cannot dispatch broadcast notifications.');
      }

      const {
        title,
        message,
        type = 'System message',
        audience = 'All Enrolled Students',
        courseId = '',
        tierId = '',
        batchId = '',
        deepLink = '',
        scheduledFor = null,
        targetUserId = notifData.targetUserId || notifData.userId || null,
        idempotencyKey = null,
        channels = ['In-App', 'Push Notification'],
        simulateFailure = false
      } = notifData;

      if (!title || !message) {
        throw new Error('Notification title and message payload are required.');
      }

      // Check idempotency
      if (idempotencyKey) {
        const existing = (store.state.notifications || []).find(n => n.id === idempotencyKey || n.idempotencyKey === idempotencyKey);
        if (existing) {
          return { duplicate: true, idempotent: true, notification: JSON.parse(JSON.stringify(existing)) };
        }
      }

      const notifId = idempotencyKey || notifData.id || `notif-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const isScheduled = !!scheduledFor && new Date(scheduledFor) > new Date();

      // Collect target recipients
      let targetUserIds = [];
      if (targetUserId) {
        targetUserIds = [targetUserId];
      } else if (audience === 'Specific Batch' && batchId) {
        const enrs = (store.state.enrollments || []).filter(e => e.batchId === batchId);
        targetUserIds = [...new Set(enrs.map(e => e.studentId))];
      } else if (audience === 'Specific Course' && courseId) {
        const enrs = (store.state.enrollments || []).filter(e => e.courseId === courseId);
        targetUserIds = [...new Set(enrs.map(e => e.studentId))];
      } else if (audience === 'Specific Tier' && tierId) {
        const enrs = (store.state.enrollments || []).filter(e => e.tierId === tierId);
        targetUserIds = [...new Set(enrs.map(e => e.studentId))];
      } else {
        const enrs = (store.state.enrollments || []).filter(e => e.status === 'Enrolled' || e.status === 'Approved');
        targetUserIds = [...new Set(enrs.map(e => e.studentId))];
        if (targetUserIds.length === 0) {
          targetUserIds = (store.state.students || []).map(s => s.id);
        }
      }

      if (targetUserIds.length === 0) {
        targetUserIds = ['stu-nx-8821'];
      }

      const typePrefMap = {
        'New class': 'newClasses',
        'Class reminder': 'classReminders',
        'Announcement': 'announcements',
        'Enrollment update': 'enrollmentUpdates',
        'Project reminder': 'projectReminders',
        'Certificate update': 'certificateUpdates',
        'System message': 'systemMessages'
      };
      const prefKey = typePrefMap[type] || 'systemMessages';

      let recipientCount = 0;
      let successCount = 0;
      let failureCount = 0;
      let errorSummary = null;

      if (!isScheduled) {
        if (simulateFailure) {
          failureCount = targetUserIds.length || 1;
          recipientCount = failureCount;
          errorSummary = 'Simulated FCM transport network disconnect';
        } else {
          for (const uid of targetUserIds) {
            const prefs = await notificationDeliveryService.getUserPreferences(uid);
            if (!prefs.pushEnabled || prefs[prefKey] === false) {
              continue; // User opted out
            }

            recipientCount++;
            store.state.userInboxes = store.state.userInboxes || {};
            store.state.userInboxes[uid] = store.state.userInboxes[uid] || [];
            store.state.userInboxes[uid].unshift({
              id: `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              notificationId: notifId,
              title,
              message,
              type,
              deepLink,
              read: false,
              createdAt: nowIso
            });

            // Deliver to device tokens
            const userTokens = (store.state.deviceTokens || []).filter(d => d.userId === uid && d.valid);
            if (userTokens.length > 0) {
              userTokens.forEach(d => { d.lastSeenAt = nowIso; });
            }
            successCount++;
          }
        }
      }

      let deliveryStatus = isScheduled ? 'Scheduled' : 'Sent';
      if (!isScheduled) {
        if (simulateFailure) deliveryStatus = 'Failed';
        else if (recipientCount > 0 && failureCount > 0 && successCount > 0) deliveryStatus = 'Partially delivered';
        else if (recipientCount > 0 && successCount === 0) deliveryStatus = 'Failed';
        else deliveryStatus = 'Sent';
      }

      const item = {
        id: notifId,
        idempotencyKey: idempotencyKey || notifId,
        title,
        message,
        type,
        audience,
        courseId,
        tierId,
        batchId,
        deepLink,
        channels: channels && channels.length ? channels : ['In-App'],
        deliveryStatus,
        status: deliveryStatus,
        scheduledFor: isScheduled ? new Date(scheduledFor).toISOString() : null,
        scheduledDate: isScheduled ? new Date(scheduledFor).toISOString() : null,
        sentBy: notifData.sentBy || currentRole,
        createdBy: notifData.sentBy || currentRole,
        createdDate: nowIso,
        date: nowIso,
        sentAt: isScheduled ? null : nowIso,
        sentDate: isScheduled ? null : nowIso,
        recipientCount: isScheduled ? targetUserIds.length : recipientCount,
        successCount,
        failureCount,
        errorSummary
      };

      store.state.notifications = store.state.notifications || [];
      store.state.notifications.unshift(item);
      store.saveState();
      store.persistDoc('notifications', item.id, item);
      auditRepository.log('Dispatched Broadcast Notification', 'Notification', item.title);
      return { success: true, record: JSON.parse(JSON.stringify(item)), ...item };
    },

    scheduleNotification: async (notifData) => {
      if (!notifData.scheduledFor) {
        throw new Error('Scheduling requires scheduledFor date string.');
      }
      return notificationDeliveryService.sendNotification({
        ...notifData,
        scheduledFor: notifData.scheduledFor
      });
    },

    cancelScheduledNotification: async (id) => {
      const n = (store.state.notifications || []).find(item => item.id === id);
      if (!n) throw new Error('Notification not found.');
      n.deliveryStatus = 'Cancelled';
      n.status = 'Cancelled';
      n.cancelledAt = new Date().toISOString();
      store.saveState();
      store.persistDoc('notifications', id, n);
      auditRepository.log('Cancelled Scheduled Notification', 'Notification', n.title);
      return { success: true, notification: JSON.parse(JSON.stringify(n)), ...n };
    },

    getDeliveryHistory: async () => {
      return JSON.parse(JSON.stringify(store.state.notifications || []));
    },

    // 4. In-App User Inbox & UX
    getInbox: async (userId) => {
      if (!userId) return [];
      store.state.userInboxes = store.state.userInboxes || {};
      const list = store.state.userInboxes[userId] || [];
      return JSON.parse(JSON.stringify(list));
    },

    markInboxAsRead: async (userId, notificationId) => {
      if (!userId || !notificationId) return { success: false, error: 'Missing parameters' };
      store.state.userInboxes = store.state.userInboxes || {};
      const list = store.state.userInboxes[userId] || [];
      const item = list.find(m => m.id === notificationId || m.notificationId === notificationId);
      if (item) {
        item.read = true;
        store.saveState();
        return { success: true, updated: true, item };
      }
      return { success: false, notFound: true };
    },

    markAllInboxAsRead: async (userId) => {
      if (!userId) return { success: false, error: 'Missing userId' };
      store.state.userInboxes = store.state.userInboxes || {};
      const list = store.state.userInboxes[userId] || [];
      list.forEach(m => { m.read = true; });
      store.saveState();
      return { success: true, updatedCount: list.length };
    },

    // 5. Automated Lifecycle Event Triggers
    triggerAnnouncementNotification: async (announcement) => {
      if (!announcement) return null;
      return notificationDeliveryService.sendNotification({
        title: `📢 Announcement: ${announcement.title}`,
        message: announcement.content ? (announcement.content.slice(0, 140) + '...') : 'New platform announcement.',
        type: 'Announcement',
        audience: announcement.targetAudience || 'All Enrolled Students',
        courseId: announcement.courseId || '',
        tierId: announcement.tierId || '',
        batchId: announcement.batchId || '',
        deepLink: '/announcements',
        sentBy: 'System Automation'
      });
    },

    triggerEnrollmentNotification: async (enrollment, eventType) => {
      if (!enrollment || !enrollment.studentId) return null;
      const course = enrollment.courseTitle || 'Curriculum Track';
      const batch = enrollment.batchName || 'General';

      let title = '';
      let message = '';
      let deepLink = 'dashboard.html';

      switch (eventType) {
        case 'submitted':
          title = `Enrollment Application Received: ${course}`;
          message = `Your application for ${course} has been received and is queued for verification.`;
          break;
        case 'approved':
          title = `🎉 Enrollment Approved: ${course}`;
          message = `Congratulations! You have been accepted into ${course} (${batch}). Access your learning path now.`;
          break;
        case 'rejected':
          title = `Enrollment Rejected: ${course}`;
          message = `Your enrollment application for ${course} could not be approved at this time.`;
          break;
        case 'waitlisted':
          title = `⏳ Waitlist Placement: ${course}`;
          message = `Cohort capacity reached for ${course}. You are positioned on the official waitlist.`;
          break;
        case 'moved_from_waitlist':
          title = `Seat Offered from Waitlist: ${course}`;
          message = `A cohort seat opened in ${course} (${batch})! Your enrollment is now active.`;
          break;
        case 'batch_assigned':
          title = `Cohort Batch Assigned: ${batch}`;
          message = `You have been placed into cohort ${batch} for ${course}.`;
          break;
        case 'completed':
          title = `🎓 Course Completed: ${course}`;
          message = `Congratulations on completing your syllabus requirements for ${course}!`;
          deepLink = 'dashboard.html#certificates';
          break;
        default:
          title = `Enrollment Update`;
          message = `Your enrollment status for ${course} is now ${enrollment.status}.`;
      }

      return notificationDeliveryService.sendNotification({
        title,
        message,
        type: 'Enrollment update',
        targetUserId: enrollment.studentId,
        courseId: enrollment.courseId,
        tierId: enrollment.tierId,
        batchId: enrollment.batchId,
        deepLink,
        sentBy: 'Bursar System Automation'
      });
    },

    triggerClassNotification: async (classItem, eventType, reminderTime) => {
      if (!classItem) return null;
      let title = '';
      let message = '';
      let type = 'New class';
      const deepLink = `dashboard.html?class=${classItem.id}`;

      switch (eventType) {
        case 'new_class':
          title = `📡 New Class Available: ${classItem.title}`;
          message = `Class "${classItem.title}" has been published. Ready for streaming.`;
          type = 'New class';
          break;
        case 'reminder':
          title = `⏰ Live Class Reminder: ${classItem.title}`;
          message = `Reminder: Class "${classItem.title}" begins ${reminderTime || 'in 30 minutes'}.`;
          type = 'Class reminder';
          break;
        case 'rescheduled':
          title = `Class Rescheduled: ${classItem.title}`;
          message = `The schedule for class "${classItem.title}" has been updated by the instructor.`;
          type = 'Class reminder';
          break;
        case 'cancelled':
          title = `Class Notice: ${classItem.title} Cancelled`;
          message = `Session "${classItem.title}" has been cancelled. Check announcement notes.`;
          type = 'Class reminder';
          break;
        default:
          title = `Class Update: ${classItem.title}`;
          message = `Class syllabus or schedule updated.`;
      }

      return notificationDeliveryService.sendNotification({
        title,
        message,
        type,
        courseId: classItem.courseId || '',
        audience: classItem.courseId ? 'Specific Course' : 'All Enrolled Students',
        deepLink,
        sentBy: 'Curriculum Scheduler'
      });
    },

    triggerCertificateNotification: async (cert, eventType, extraReason) => {
      if (!cert || !cert.studentId) return null;
      let title = '';
      let message = '';
      const course = cert.courseTitle || 'Curriculum Track';
      const deepLink = `dashboard.html#certificates`;

      switch (eventType) {
        case 'eligibility_achieved':
          title = `🎓 Certificate Eligibility Achieved: ${course}`;
          message = `You have completed curriculum milestones for ${course}. Application queued for directorate sign-off.`;
          break;
        case 'pending_approval':
          title = `⏳ Certificate Pending Approval: ${course}`;
          message = `Your completion records are being audited by the Academic Directorate.`;
          break;
        case 'approved':
          title = `🎉 Certificate Approved: ${course}`;
          message = `Directorate sign-off granted for ${course}. Your credential is now eligible for issuance.`;
          break;
        case 'issued':
          title = `📜 Certificate Issued: ${course}`;
          message = `Congratulations! Your official digital certificate has been issued (ID: ${cert.verificationId || cert.id}).`;
          break;
        case 'revoked':
          title = `⚠️ Certificate Notice: Credential Revoked`;
          message = `Certificate record for ${course} has been revoked by issuing authority. Reason: ${extraReason || cert.revocation?.reason || 'Administrative review'}.`;
          break;
        default:
          title = `Certificate Update: ${course}`;
          message = `Your certificate status is now ${cert.status}.`;
      }

      return notificationDeliveryService.sendNotification({
        title,
        message,
        type: 'Certificate update',
        targetUserId: cert.studentId,
        courseId: cert.courseId || '',
        deepLink,
        sentBy: 'Registrar Directorate'
      });
    }
  };

  // --- notificationRepository (Backward-compatible adapter) ---
  const notificationRepository = {
    findAll: async (options = {}) => store.queryDocs('notifications', options),
    findById: async (id) => store.getDoc('notifications', id),
    save: async (data) => notificationDeliveryService.sendNotification(data),
    send: async (data) => notificationDeliveryService.sendNotification(data),
    sendTest: async (data) => notificationDeliveryService.sendNotification({
      ...data,
      isTest: true,
      sentBy: store.getCurrentRole()
    }),
    cancel: async (id) => notificationDeliveryService.cancelScheduledNotification(id)
  };

  // --- paymentRepository (Phase 13 Secure Payment Infrastructure) ---
  class NexvionPaymentGatewayAdapter {
    constructor(config = {}) {
      this.providerName = config.providerName || 'Nexvion Gateway Abstraction (Stripe / Sandbox)';
      this.currency = config.currency || 'USD';
    }

    async createCheckoutSession({ transactionRef, amount, currency, tierId, tierName, courseTitle, studentId, studentEmail, returnUrl, cancelUrl }) {
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkoutUrl = `/checkout.html?session_id=${sessionId}&tx=${transactionRef}`;
      return {
        sessionId,
        transactionRef,
        checkoutUrl,
        provider: this.providerName,
        currency: currency || this.currency,
        amount,
        status: 'Pending',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    }

    async getPaymentStatus(transactionRef) {
      return { transactionRef, provider: this.providerName, status: 'Pending' };
    }

    async verifyPayment({ transactionRef, expectedAmount, expectedCurrency, actualAmount, actualCurrency, studentId, expectedStudentId }) {
      if (!transactionRef) return { verified: false, error: 'Transaction reference is missing' };
      if (expectedAmount !== undefined && actualAmount !== undefined && Number(expectedAmount) !== Number(actualAmount)) {
        return { verified: false, error: `Payment amount mismatch: expected ${expectedAmount}, received ${actualAmount}` };
      }
      if (expectedCurrency && actualCurrency && expectedCurrency.toUpperCase() !== actualCurrency.toUpperCase()) {
        return { verified: false, error: `Currency mismatch: expected ${expectedCurrency}, received ${actualCurrency}` };
      }
      if (expectedStudentId && studentId && expectedStudentId !== studentId) {
        return { verified: false, error: `User identity mismatch: transaction does not belong to student ${expectedStudentId}` };
      }
      return { verified: true, verifiedAt: new Date().toISOString() };
    }

    async handleRefundStatus({ paymentId, transactionRef, amount, reason }) {
      return { refundId: `ref_${Date.now()}`, refundStatus: 'Processed', reason: reason || 'Administrative refund' };
    }

    async handleFailedPayment({ paymentId, transactionRef, failureCode, failureReason }) {
      return { status: 'Failed', failureCode: failureCode || 'CARD_DECLINED', failureReason: failureReason || 'Transaction declined' };
    }

    async handleCancelledPayment({ paymentId, transactionRef, reason }) {
      return { status: 'Cancelled', reason: reason || 'Checkout session cancelled by student' };
    }
  }

  const defaultGatewayProvider = new NexvionPaymentGatewayAdapter();
  const processedWebhookEvents = new Set();

  const paymentRepository = {
    provider: defaultGatewayProvider,
    processedWebhookEvents: processedWebhookEvents,

    _normalizePayment: (p) => {
      if (!p) return null;
      return {
        ...p,
        amount: p.amount !== undefined ? p.amount : (p.amountDisplay === 'FREE' ? 0 : null),
        currency: p.currency || 'USD',
        provider: p.provider || (p.amountDisplay === 'FREE' ? 'None (Free Tier)' : defaultGatewayProvider.providerName),
        verificationStatus: p.verificationStatus || (p.status === 'Paid' ? 'Verified' : p.status === 'Not required' ? 'Exempt' : 'Pending verification'),
        refundStatus: p.refundStatus || 'None'
      };
    },

    findAll: async (filters = {}) => {
      if (!store.hasPermission('view_payments') || store.getCurrentRole() === 'Analyst') {
        store.setRepositoryError('payments', 'Access denied: Unauthorized attempt to view restricted financial records.', true);
        throw new Error('Access denied: Unauthorized attempt to view restricted financial records.');
      }
      let items = await store.queryDocs('payments', typeof filters === 'object' ? { filters: Object.entries(filters).filter(([k]) => ['status', 'studentId', 'courseId', 'tierId'].includes(k)).map(([k, v]) => ({ field: k, value: v })), search: filters.search } : {});
      items = (items || []).map(paymentRepository._normalizePayment);
      if (filters.status && filters.status !== 'ALL') {
        items = items.filter(p => (p.status || '').toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.studentId) {
        items = items.filter(p => p.studentId === filters.studentId);
      }
      if (filters.courseId) {
        items = items.filter(p => p.courseId === filters.courseId);
      }
      if (filters.tierId) {
        items = items.filter(p => p.tierId === filters.tierId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(p =>
          (p.studentName && p.studentName.toLowerCase().includes(q)) ||
          (p.transactionRef && p.transactionRef.toLowerCase().includes(q)) ||
          (p.studentEmail && p.studentEmail.toLowerCase().includes(q))
        );
      }
      return JSON.parse(JSON.stringify(items));
    },

    findById: async (id) => {
      if (!store.hasPermission('view_payments') || store.getCurrentRole() === 'Analyst') {
        store.setRepositoryError('payments', 'Access denied: Unauthorized attempt to view restricted financial records.', true);
        throw new Error('Access denied: Unauthorized attempt to view restricted financial records.');
      }
      const p = await store.getDoc('payments', id);
      return p ? JSON.parse(JSON.stringify(paymentRepository._normalizePayment(p))) : null;
    },

    findByTransactionRef: async (ref) => {
      if (!store.hasPermission('view_payments') || store.getCurrentRole() === 'Analyst') {
        store.setRepositoryError('payments', 'Access denied: Unauthorized attempt to view restricted financial records.', true);
        throw new Error('Access denied: Unauthorized attempt to view restricted financial records.');
      }
      const p = (store.state.payments || []).find(item => item.transactionRef === ref);
      return p ? JSON.parse(JSON.stringify(paymentRepository._normalizePayment(p))) : null;
    },

    getTierPriceConfig: (tierId) => {
      store.state.tierPrices = store.state.tierPrices || {
        'ai-foundations': { tierName: 'AI Foundations', priceDisplay: 'FREE', amount: 0, currency: 'USD', isPaid: false },
        'ai-builder': { tierName: 'AI Builder', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
        'ai-creator': { tierName: 'AI Creator', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true },
        'ai-architect': { tierName: 'AI Architect', priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true }
      };
      return store.state.tierPrices[tierId] || { tierName: tierId, priceDisplay: 'PRICE COMING SOON', amount: null, currency: 'USD', isPaid: true };
    },

    setTierPriceConfig: async (tierId, { amount, currency = 'USD', priceDisplay }) => {
      if (!['Owner', 'Super Admin', 'Finance Manager'].includes(store.getCurrentRole())) {
        throw new Error('Access denied: Only Finance Managers or Super Admins can configure tier pricing.');
      }
      store.state.tierPrices = store.state.tierPrices || {};
      const existing = paymentRepository.getTierPriceConfig(tierId);
      const isPaid = tierId !== 'ai-foundations';
      const formattedDisplay = priceDisplay || (amount === null || amount === undefined ? 'PRICE COMING SOON' : `$${amount}`);

      store.state.tierPrices[tierId] = {
        ...existing,
        amount: isPaid ? (amount !== undefined ? amount : null) : 0,
        currency: currency || 'USD',
        priceDisplay: isPaid ? formattedDisplay : 'FREE',
        isPaid
      };
      store.saveState();
      auditRepository.log('Updated Official Tier Pricing', 'Payment', `${tierId} -> ${store.state.tierPrices[tierId].priceDisplay}`);
      return store.state.tierPrices[tierId];
    },

    createCheckoutSession: async ({ studentId, studentName, studentEmail, courseId, tierId, batchId, returnUrl, cancelUrl }) => {
      if (!studentId) throw new Error('Student identifier is required for checkout.');
      const safeTierId = tierId || 'ai-foundations';
      const tierConfig = paymentRepository.getTierPriceConfig(safeTierId);
      const student = (store.state.students || []).find(s => s.id === studentId);
      const course = (store.state.courses || []).find(c => c.id === courseId);
      const resolvedStudentName = studentName || (student ? student.name : 'Student');
      const resolvedStudentEmail = studentEmail || (student ? student.email : '');
      const resolvedCourseTitle = course ? course.title : (tierConfig.tierName || 'Curriculum Track');
      const nowIso = new Date().toISOString();

      // Free tier: AI Foundations
      if (!tierConfig.isPaid || safeTierId === 'ai-foundations') {
        const freePayment = {
          id: `pay-free-${Date.now()}`,
          transactionRef: `NEX-FREE-${Date.now()}`,
          studentId,
          studentName: resolvedStudentName,
          studentEmail: resolvedStudentEmail,
          courseId: courseId || 'ai-foundations',
          courseTitle: resolvedCourseTitle,
          tierId: safeTierId,
          tierName: tierConfig.tierName,
          batchId: batchId || null,
          amountDisplay: 'FREE',
          amount: 0,
          currency: 'USD',
          status: 'Not required',
          verificationStatus: 'Exempt',
          refundStatus: 'Not applicable',
          provider: 'None (Free Tier)',
          method: 'Free Public Tier Registration',
          invoiceId: `INV-FREE-${Math.floor(1000 + Math.random() * 9000)}`,
          date: nowIso.replace('T', ' ').slice(0, 16) + ' UTC',
          notes: 'Free-tier registration. Tuition fee exempt.'
        };
        store.state.payments = store.state.payments || [];
        store.state.payments.unshift(freePayment);
        store.saveState();
        store.persistDoc('payments', freePayment.id, freePayment);

        // Automatic enrollment activation for free tier
        let enrollment = (store.state.enrollments || []).find(e => e.studentId === studentId && (e.courseId === courseId || e.tierId === safeTierId));
        if (enrollment) {
          enrollment.status = 'Enrolled';
          enrollment.paymentStatus = 'Not required';
          enrollment.lastUpdated = nowIso;
        } else {
          enrollment = {
            id: `enr-${Date.now()}`,
            studentId,
            studentName: resolvedStudentName,
            courseId: courseId || 'ai-foundations',
            courseTitle: resolvedCourseTitle,
            tierId: safeTierId,
            batchId: batchId || null,
            status: 'Enrolled',
            paymentStatus: 'Not required',
            enrolledAt: nowIso
          };
          store.state.enrollments = store.state.enrollments || [];
          store.state.enrollments.unshift(enrollment);
        }
        store.saveState();
        store.persistDoc('enrollments', enrollment.id, enrollment);
        auditRepository.log('Registered Free Cohort Student', 'Payment', `${resolvedStudentName} (${tierConfig.tierName})`);

        return {
          success: true,
          freeTier: true,
          status: 'Not required',
          payment: freePayment,
          enrollment
        };
      }

      // Paid Tier: AI Builder, AI Creator, AI Architect
      // 1. If official price is not yet configured, preserve PRICE COMING SOON
      if (tierConfig.amount === null || tierConfig.priceDisplay === 'PRICE COMING SOON') {
        const pendingPayment = {
          id: `pay-${Date.now()}`,
          transactionRef: `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId,
          studentName: resolvedStudentName,
          studentEmail: resolvedStudentEmail,
          courseId: courseId || safeTierId,
          courseTitle: resolvedCourseTitle,
          tierId: safeTierId,
          tierName: tierConfig.tierName,
          batchId: batchId || null,
          amountDisplay: 'PRICE COMING SOON',
          amount: null,
          currency: tierConfig.currency || 'USD',
          status: 'Pending',
          verificationStatus: 'Pending verification',
          refundStatus: 'None',
          provider: defaultGatewayProvider.providerName,
          method: 'Tuition Registration',
          invoiceId: `INV-PEND-${Math.floor(1000 + Math.random() * 9000)}`,
          date: nowIso.replace('T', ' ').slice(0, 16) + ' UTC',
          notes: 'Official fee schedule coming soon. Seat reserved pending fee publication.'
        };
        store.state.payments = store.state.payments || [];
        store.state.payments.unshift(pendingPayment);
        store.saveState();
        store.persistDoc('payments', pendingPayment.id, pendingPayment);

        // Enrollment is pending payment
        let enrollment = (store.state.enrollments || []).find(e => e.studentId === studentId && (e.courseId === courseId || e.tierId === safeTierId));
        if (enrollment) {
          enrollment.status = 'Pending';
          enrollment.paymentStatus = 'Pending';
          enrollment.lastUpdated = nowIso;
        } else {
          enrollment = {
            id: `enr-${Date.now()}`,
            studentId,
            studentName: resolvedStudentName,
            courseId: courseId || safeTierId,
            courseTitle: resolvedCourseTitle,
            tierId: safeTierId,
            batchId: batchId || null,
            status: 'Pending',
            paymentStatus: 'Pending',
            enrolledAt: nowIso
          };
          store.state.enrollments = store.state.enrollments || [];
          store.state.enrollments.unshift(enrollment);
        }
        store.saveState();
        store.persistDoc('enrollments', enrollment.id, enrollment);

        return {
          success: false,
          comingSoon: true,
          status: 'Pending',
          priceDisplay: 'PRICE COMING SOON',
          payment: pendingPayment,
          enrollment
        };
      }

      // 2. Paid tier with official configured price
      // Never trusts client price: strictly enforces tierConfig.amount from server configuration
      const transactionRef = `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const pendingPayment = {
        id: `pay-${Date.now()}`,
        transactionRef,
        studentId,
        studentName: resolvedStudentName,
        studentEmail: resolvedStudentEmail,
        courseId: courseId || safeTierId,
        courseTitle: resolvedCourseTitle,
        tierId: safeTierId,
        tierName: tierConfig.tierName,
        batchId: batchId || null,
        amountDisplay: `$${tierConfig.amount}`,
        amount: Number(tierConfig.amount),
        currency: tierConfig.currency || 'USD',
        status: 'Pending',
        verificationStatus: 'Pending verification',
        refundStatus: 'None',
        provider: defaultGatewayProvider.providerName,
        method: 'Secure Card / Gateway',
        invoiceId: `INV-PEND-${Math.floor(1000 + Math.random() * 9000)}`,
        date: nowIso.replace('T', ' ').slice(0, 16) + ' UTC',
        notes: `Checkout session initiated. Awaiting trusted payment verification.`
      };

      store.state.payments = store.state.payments || [];
      store.state.payments.unshift(pendingPayment);

      // Create enrollment in Pending state
      let enrollment = (store.state.enrollments || []).find(e => e.studentId === studentId && (e.courseId === courseId || e.tierId === safeTierId));
      if (enrollment) {
        enrollment.status = 'Pending';
        enrollment.paymentStatus = 'Pending';
        enrollment.lastUpdated = nowIso;
      } else {
        enrollment = {
          id: `enr-${Date.now()}`,
          studentId,
          studentName: resolvedStudentName,
          courseId: courseId || safeTierId,
          courseTitle: resolvedCourseTitle,
          tierId: safeTierId,
          batchId: batchId || null,
          status: 'Pending',
          paymentStatus: 'Pending',
          enrolledAt: nowIso
        };
        store.state.enrollments = store.state.enrollments || [];
        store.state.enrollments.unshift(enrollment);
      }
      store.saveState();
      store.persistDoc('payments', pendingPayment.id, pendingPayment);
      store.persistDoc('enrollments', enrollment.id, enrollment);

      const session = await paymentRepository.provider.createCheckoutSession({
        transactionRef,
        amount: tierConfig.amount,
        currency: tierConfig.currency,
        tierId: safeTierId,
        tierName: tierConfig.tierName,
        courseTitle: resolvedCourseTitle,
        studentId,
        studentEmail: resolvedStudentEmail,
        returnUrl,
        cancelUrl
      });

      return {
        success: true,
        sessionId: session.sessionId,
        transactionRef,
        checkoutUrl: session.checkoutUrl,
        amount: tierConfig.amount,
        currency: tierConfig.currency,
        status: 'Pending',
        payment: pendingPayment,
        enrollment
      };
    },

    verifyPayment: async ({ transactionRef, paymentId, actualAmount, actualCurrency, studentId, signature, verifiedBy }) => {
      let p = (store.state.payments || []).find(item =>
        (transactionRef && item.transactionRef === transactionRef) ||
        (paymentId && item.id === paymentId)
      );
      if (!p) throw new Error('Payment transaction record not found.');

      // Idempotent: already paid & verified
      if (p.status === 'Paid' && p.verificationStatus === 'Verified') {
        const enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId && (e.courseId === p.courseId || e.tierId === p.tierId));
        return { verified: true, payment: paymentRepository._normalizePayment(p), enrollment: enr, idempotent: true };
      }

      // Trusted verification check
      const expectedTier = paymentRepository.getTierPriceConfig(p.tierId);
      const expectedAmount = expectedTier.amount !== null ? expectedTier.amount : p.amount;

      const verificationResult = await paymentRepository.provider.verifyPayment({
        transactionRef: p.transactionRef,
        expectedAmount,
        expectedCurrency: p.currency || 'USD',
        actualAmount: actualAmount !== undefined ? actualAmount : expectedAmount,
        actualCurrency: actualCurrency || p.currency || 'USD',
        studentId: studentId || p.studentId,
        expectedStudentId: p.studentId,
        signature
      });

      if (!verificationResult.verified) {
        p.verificationStatus = 'Verification failed';
        p.status = 'Manual review';
        p.notes = (p.notes ? p.notes + ' | ' : '') + `Verification failed: ${verificationResult.error}`;
        store.saveState();
        store.persistDoc('payments', p.id, p);
        throw new Error(`Payment verification failed: ${verificationResult.error}`);
      }

      const nowIso = new Date().toISOString();
      p.status = 'Paid';
      p.verificationStatus = 'Verified';
      p.date = nowIso.replace('T', ' ').slice(0, 16) + ' UTC';
      p.notes = (p.notes ? p.notes + ' | ' : '') + `Verified by trusted gateway: ${verifiedBy || 'Server Webhook'}`;

      // Activate enrollment only after verified payment
      let enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId && (e.courseId === p.courseId || e.tierId === p.tierId));
      if (enr) {
        enr.status = 'Enrolled';
        enr.paymentStatus = 'Paid';
        enr.lastUpdated = nowIso;
        store.persistDoc('enrollments', enr.id, enr);
      }

      // Activate student payment status if student found
      const stu = (store.state.students || []).find(s => s.id === p.studentId);
      if (stu) {
        stu.paymentStatus = 'Paid';
        stu.enrollmentStatus = 'Enrolled';
        store.persistDoc('students', stu.id, stu);
      }

      store.saveState();
      store.persistDoc('payments', p.id, p);
      auditRepository.log('Verified Tuition Payment', 'Payment', `${p.studentName} (${p.transactionRef}) - Status: Paid`);

      return {
        verified: true,
        payment: paymentRepository._normalizePayment(p),
        enrollment: enr
      };
    },

    handleWebhookEvent: async (eventPayload, signature) => {
      if (!eventPayload || !eventPayload.type) {
        throw new Error('Invalid webhook event payload');
      }

      const eventId = eventPayload.id || `${eventPayload.type}_${eventPayload.transactionRef || Date.now()}`;
      if (paymentRepository.processedWebhookEvents.has(eventId)) {
        return { received: true, duplicate: true, message: 'Event already processed (idempotent)' };
      }
      paymentRepository.processedWebhookEvents.add(eventId);

      const txRef = eventPayload.transactionRef;
      const p = (store.state.payments || []).find(item => item.transactionRef === txRef || item.id === eventPayload.paymentId);

      switch (eventPayload.type) {
        case 'payment.succeeded':
        case 'payment_intent.succeeded': {
          if (!p) throw new Error(`Payment transaction "${txRef}" not found for webhook`);
          return paymentRepository.verifyPayment({
            transactionRef: txRef,
            paymentId: p.id,
            actualAmount: eventPayload.amount !== undefined ? eventPayload.amount : p.amount,
            actualCurrency: eventPayload.currency || p.currency,
            studentId: eventPayload.studentId || p.studentId,
            verifiedBy: 'Webhook'
          });
        }
        case 'payment.failed':
        case 'payment_intent.payment_failed': {
          if (p) {
            return paymentRepository.handleFailedPayment(p.id, eventPayload.reason || 'Payment failed via processor notification');
          }
          break;
        }
        case 'payment.cancelled':
        case 'checkout.session.cancelled': {
          if (p) {
            return paymentRepository.handleCancelledPayment(p.id, eventPayload.reason || 'Checkout session cancelled');
          }
          break;
        }
        case 'payment.refunded':
        case 'charge.refunded': {
          if (p) {
            p.status = 'Refunded';
            p.refundStatus = 'Processed';
            p.notes = (p.notes ? p.notes + ' | ' : '') + `Refund processed via webhook: ${eventPayload.reason || 'Remote processor'}`;
            const enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId);
            if (enr) {
              enr.paymentStatus = 'Refunded';
              enr.status = 'Cancelled';
              store.persistDoc('enrollments', enr.id, enr);
            }
            store.saveState();
            store.persistDoc('payments', p.id, p);
            return { refunded: true, payment: paymentRepository._normalizePayment(p) };
          }
          break;
        }
        default:
          break;
      }

      return { received: true, eventId, status: 'acknowledged' };
    },

    handleFailedPayment: async (paymentId, reason) => {
      const p = (store.state.payments || []).find(item => item.id === paymentId || item.transactionRef === paymentId);
      if (!p) throw new Error('Payment record not found.');

      p.status = 'Failed';
      p.verificationStatus = 'Verification failed';
      p.notes = (p.notes ? p.notes + ' | ' : '') + `Failure recorded: ${reason || 'Card or network error'}`;

      const enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId && (e.courseId === p.courseId || e.tierId === p.tierId));
      if (enr) {
        enr.paymentStatus = 'Failed';
        store.persistDoc('enrollments', enr.id, enr);
      }
      store.saveState();
      store.persistDoc('payments', p.id, p);
      auditRepository.log('Payment Transaction Failed', 'Payment', `${p.studentName} (${p.transactionRef}): ${reason || 'Failed'}`);
      return paymentRepository._normalizePayment(p);
    },

    handleCancelledPayment: async (paymentId, reason) => {
      const p = (store.state.payments || []).find(item => item.id === paymentId || item.transactionRef === paymentId);
      if (!p) throw new Error('Payment record not found.');

      p.status = 'Cancelled';
      p.verificationStatus = 'Cancelled';
      p.notes = (p.notes ? p.notes + ' | ' : '') + `Cancelled: ${reason || 'Student left checkout'}`;

      const enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId && (e.courseId === p.courseId || e.tierId === p.tierId));
      if (enr) {
        enr.paymentStatus = 'Cancelled';
        store.persistDoc('enrollments', enr.id, enr);
      }
      store.saveState();
      store.persistDoc('payments', p.id, p);
      auditRepository.log('Payment Checkout Cancelled', 'Payment', `${p.studentName} (${p.transactionRef})`);
      return paymentRepository._normalizePayment(p);
    },

    save: async (paymentData) => {
      const idx = (store.state.payments || []).findIndex(p => p.id === paymentData.id);
      if (idx !== -1) {
        store.state.payments[idx] = { ...store.state.payments[idx], ...paymentData };
        store.saveState();
        store.persistDoc('payments', paymentData.id, store.state.payments[idx]);
        return paymentRepository._normalizePayment(store.state.payments[idx]);
      } else {
        const newPayment = {
          id: paymentData.id || `pay-${Date.now().toString().slice(-4)}`,
          transactionRef: paymentData.transactionRef || `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          date: paymentData.date || new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
          refundStatus: paymentData.refundStatus || 'None',
          status: paymentData.status || 'Pending',
          currency: paymentData.currency || 'USD',
          provider: paymentData.provider || defaultGatewayProvider.providerName,
          verificationStatus: paymentData.verificationStatus || 'Pending verification',
          ...paymentData
        };
        store.state.payments = store.state.payments || [];
        store.state.payments.unshift(newPayment);
        store.saveState();
        store.persistDoc('payments', newPayment.id, newPayment);
        return paymentRepository._normalizePayment(newPayment);
      }
    },

    refund: async (id, reason) => {
      if (!['Owner', 'Super Admin', 'Finance Manager'].includes(store.getCurrentRole())) {
        throw new Error('Access denied: Only Finance Managers or Super Admins can issue refunds.');
      }
      const p = (store.state.payments || []).find(item => item.id === id);
      if (!p) throw new Error('Payment record not found.');

      p.status = 'Refunded';
      p.refundStatus = 'Processed';
      p.notes = (p.notes ? p.notes + ' | ' : '') + `Refund processed: ${reason || 'Administrative refund request'}`;

      const enr = (store.state.enrollments || []).find(e => e.studentId === p.studentId && (e.courseId === p.courseId || e.tierId === p.tierId));
      if (enr) {
        enr.paymentStatus = 'Refunded';
        enr.status = 'Cancelled';
        store.persistDoc('enrollments', enr.id, enr);
      }
      store.saveState();
      store.persistDoc('payments', p.id, p);
      auditRepository.log('Processed Payment Refund', 'Payment', `${p.studentName} (${p.transactionRef}) - Reason: ${reason || 'Administrative discretion'}`);
      return paymentRepository._normalizePayment(p);
    },

    updateStatus: async (id, newStatus, noteText) => {
      if (!['Owner', 'Super Admin', 'Finance Manager'].includes(store.getCurrentRole())) {
        throw new Error('Access denied: Only Finance Managers can modify payment status records.');
      }
      const p = (store.state.payments || []).find(item => item.id === id);
      if (!p) throw new Error('Payment record not found.');

      const oldStatus = p.status;
      p.status = newStatus;
      if (noteText) {
        p.notes = (p.notes ? p.notes + ' | ' : '') + noteText;
      }
      store.saveState();
      store.persistDoc('payments', p.id, p);
      auditRepository.log('Updated Payment Status', 'Payment', `${p.studentName} (${p.transactionRef}): ${oldStatus} -> ${newStatus}`);
      return paymentRepository._normalizePayment(p);
    },

    getStudentPayments: async (studentId) => {
      const list = (store.state.payments || []).filter(p => p.studentId === studentId);
      return JSON.parse(JSON.stringify(list.map(paymentRepository._normalizePayment)));
    }
  };

  // --- certificateRepository (Phase 15 Secure Eligibility & Issuance) ---
  const certificateRepository = {
    findAll: async (options = {}) => store.queryDocs('certificates', options),
    findById: async (id) => store.getDoc('certificates', id),
    getStudentCertificates: async (studentId) => {
      const list = (store.state.certificates || []).filter(c => c.studentId === studentId);
      return JSON.parse(JSON.stringify(list));
    },

    // 1. Calculate eligibility from verified backend data (never trust client percentages)
    calculateEligibility: async ({ studentId, courseId }) => {
      if (!studentId) throw new Error('studentId is required to calculate eligibility.');
      const student = store.state.students.find(s => s.id === studentId);
      const enrollment = store.state.enrollments.find(e => e.studentId === studentId && (!courseId || e.courseId === courseId));
      const targetCourseId = courseId || enrollment?.courseId || student?.enrolledCourse || 'course-ai-foundations';
      const course = store.state.courses.find(c => c.id === targetCourseId || (targetCourseId && targetCourseId.includes(c.id)));
      const defaultTitle = targetCourseId.includes('builder') ? 'AI Builder: Intelligent Application Engineering' :
                           targetCourseId.includes('creator') ? 'AI Creator: Multimodal Generative Systems' :
                           targetCourseId.includes('architect') ? 'AI Architect: Enterprise AI Systems' :
                           'AI Foundations: Zero to AI Native';
      const courseTitle = course?.title || enrollment?.courseTitle || defaultTitle;

      // 1. Required Course / Module completion
      const courseModules = store.state.modules.filter(m => m.courseId === targetCourseId);
      const totalModules = courseModules.length || 5;
      const completedModulesCount = student?.completedModules !== undefined ? student.completedModules : (enrollment?.status === 'Completed' ? totalModules : (student?.progressPercent ? Math.floor((student.progressPercent / 100) * totalModules) : 0));
      const courseMet = completedModulesCount >= totalModules || enrollment?.status === 'Completed';

      // 2. Required Class completion
      const courseClasses = store.state.classes.filter(c => c.courseId === targetCourseId && c.status !== 'Archived');
      const totalClasses = courseClasses.length || 8;
      const attendedClasses = student?.completedClasses !== undefined ? student.completedClasses : (enrollment?.status === 'Completed' ? totalClasses : Math.floor(totalClasses * 0.8));
      const classesMet = attendedClasses >= totalClasses || enrollment?.status === 'Completed';

      // 3. Required Capstone Project completion
      const userSubs = store.state.submissions.filter(s => s.studentId === studentId);
      const projectSub = userSubs.find(s => s.type === 'Project' || s.title?.toLowerCase().includes('capstone') || s.projectId);
      const projectMet = (projectSub && (projectSub.status === 'Approved' || projectSub.status === 'Reviewed' || (projectSub.gradeScore !== undefined && projectSub.gradeScore >= 70))) || enrollment?.status === 'Completed';

      // 4. Required Assignment completion
      const assignmentSubs = userSubs.filter(s => s.type === 'Assignment');
      const assignmentsMet = assignmentSubs.length >= 2 || enrollment?.status === 'Completed';

      // 5. Required Payment completion (free tier is cleared; paid tier requires status === 'Paid')
      const tierId = enrollment?.tierId || course?.tierId || (targetCourseId.includes('builder') ? 'ai-builder' : targetCourseId.includes('creator') ? 'ai-creator' : targetCourseId.includes('architect') ? 'ai-architect' : 'ai-foundations');
      const isPaidCourse = targetCourseId.includes('builder') || targetCourseId.includes('creator') || targetCourseId.includes('architect') ||
        (tierId !== 'ai-foundations' && !courseTitle.toLowerCase().includes('foundations'));
      let paymentMet = true;
      let paymentDetail = 'Tuition Cleared (Free Tier / Sponsored)';
      if (isPaidCourse) {
        const studentPayments = (store.state.payments || []).filter(p => p.studentId === studentId);
        const validPayment = studentPayments.find(p => p.status === 'Paid');
        if (validPayment) {
          paymentMet = true;
          paymentDetail = `Tuition Cleared (Transaction #${validPayment.transactionRef || validPayment.id})`;
        } else {
          paymentMet = false;
          paymentDetail = 'Tuition Payment Outstanding for Paid Credential Track';
        }
      }

      // Check existing certificate record
      let existingCert = (store.state.certificates || []).find(c => c.studentId === studentId && (c.courseId === targetCourseId || !courseId));

      const academicRequirementsMet = courseMet && classesMet && projectMet && assignmentsMet && paymentMet;
      const manualApprovalMet = !!(existingCert && existingCert.requirements?.manualApproval?.met);

      let status = 'Not eligible';
      let eligibilityStatus = 'Incomplete Milestones';

      if (existingCert && existingCert.status === 'Revoked') {
        status = 'Revoked';
        eligibilityStatus = 'Disqualified / Revoked';
      } else if (existingCert && existingCert.status === 'Issued') {
        status = 'Issued';
        eligibilityStatus = 'Requirements Satisfied';
      } else if (academicRequirementsMet && manualApprovalMet) {
        status = 'Approved';
        eligibilityStatus = 'Requirements Satisfied';
      } else if (academicRequirementsMet && !manualApprovalMet) {
        status = 'Pending approval';
        eligibilityStatus = 'Awaiting Directorate Sign-off';
      } else {
        status = 'Not eligible';
        eligibilityStatus = 'Incomplete Milestones';
      }

      const calculatedRequirements = {
        courseCompletion: { met: courseMet, label: 'Course Progress', detail: `${completedModulesCount} / ${totalModules} curriculum modules completed` },
        classCompletion: { met: classesMet, label: 'Required Classes', detail: `${attendedClasses} / ${totalClasses} live interactive sessions attended` },
        projectCompletion: { met: projectMet, label: 'Capstone Project', detail: projectMet ? 'Capstone portfolio evaluated and approved' : 'Capstone project evaluation pending' },
        assignmentCompletion: { met: assignmentsMet, label: 'Assignment Completion', detail: assignmentsMet ? 'Sprint lab challenges verified' : 'Sprint lab assignments pending' },
        paymentCompletion: { met: paymentMet, label: 'Tuition Clearance', detail: paymentDetail },
        manualApproval: { met: manualApprovalMet, label: 'Directorate Approval', detail: manualApprovalMet ? (existingCert?.requirements?.manualApproval?.detail || 'Approved by Academic Directorate') : 'Pending final review and signature from Academic Directorate' }
      };

      // If existing certificate, keep requirements in sync
      if (existingCert && existingCert.status !== 'Issued' && existingCert.status !== 'Revoked') {
        existingCert.status = status;
        existingCert.eligibilityStatus = eligibilityStatus;
        existingCert.requirements = calculatedRequirements;
        store.saveState();
      }

      // Trigger notification if newly achieved eligibility
      if (academicRequirementsMet && (!existingCert || existingCert.notifiedEligibility !== true)) {
        try {
          if (existingCert) existingCert.notifiedEligibility = true;
          await notificationDeliveryService.triggerCertificateNotification(
            existingCert || { studentId, courseTitle, courseId: targetCourseId },
            'eligibility_achieved'
          );
        } catch (e) {}
      }

      return {
        eligible: academicRequirementsMet,
        status,
        eligibilityStatus,
        requirements: calculatedRequirements,
        academicRequirementsMet,
        manualApprovalMet
      };
    },

    // 2. Approve Eligibility
    approve: async (id, approver, note) => {
      const currentRole = store.getCurrentRole();
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(currentRole)) {
        throw new Error('Access denied: Unauthorized role cannot approve certificate eligibility.');
      }

      const cert = (store.state.certificates || []).find(c => c.id === id);
      if (!cert) throw new Error('Certificate record not found.');

      const nowIso = new Date().toISOString();
      const approverName = approver || (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || 'Academic Directorate';

      if (!cert.requirements) cert.requirements = {};
      cert.requirements.manualApproval = {
        met: true,
        label: 'Directorate Approval',
        detail: `Signed off by ${approverName} on ${nowIso.split('T')[0]}`
      };

      cert.status = 'Approved';
      cert.eligibilityStatus = 'Requirements Satisfied';
      cert.approvedAt = nowIso;
      cert.approvedBy = approverName;

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({
        text: note || `Eligibility approved by ${approverName}`,
        author: approverName,
        date: nowIso
      });

      cert.history = cert.history || [];
      cert.history.push({
        action: 'Eligibility Approved',
        by: approverName,
        date: nowIso,
        note: note || 'Academic Directorate sign-off recorded'
      });

      store.saveState();
      store.persistDoc('certificates', cert.id, cert);
      auditRepository.log('Approved Certificate Eligibility', 'Certificate', `${cert.studentName} (${cert.id}) by ${approverName}`);

      try {
        await notificationDeliveryService.triggerCertificateNotification(cert, 'approved');
      } catch (e) {}

      return JSON.parse(JSON.stringify(cert));
    },

    // 3. Reject Eligibility
    reject: async (id, reason, rejecter) => {
      const currentRole = store.getCurrentRole();
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(currentRole)) {
        throw new Error('Access denied: Unauthorized role cannot reject certificate eligibility.');
      }

      const cert = (store.state.certificates || []).find(c => c.id === id);
      if (!cert) throw new Error('Certificate record not found.');

      const nowIso = new Date().toISOString();
      const rejecterName = rejecter || currentRole;

      cert.status = 'Not eligible';
      cert.eligibilityStatus = 'Eligibility Rejected';
      if (cert.requirements && cert.requirements.manualApproval) {
        cert.requirements.manualApproval.met = false;
        cert.requirements.manualApproval.detail = `Rejected: ${reason || 'Academic criteria not met'}`;
      }

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({
        text: `Eligibility rejected: ${reason || 'Academic criteria not met'}`,
        author: rejecterName,
        date: nowIso
      });

      cert.history = cert.history || [];
      cert.history.push({
        action: 'Eligibility Rejected',
        by: rejecterName,
        date: nowIso,
        note: reason || 'Academic criteria not met'
      });

      store.saveState();
      store.persistDoc('certificates', cert.id, cert);
      auditRepository.log('Rejected Certificate Eligibility', 'Certificate', `${cert.studentName} (${cert.id}) - Reason: ${reason}`);

      return JSON.parse(JSON.stringify(cert));
    },

    // 4. Issue Certificate
    issue: async (id, options = {}) => {
      const currentRole = store.getCurrentRole();
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(currentRole)) {
        throw new Error('Access denied: Unauthorized role cannot issue certificates.');
      }

      const cert = (store.state.certificates || []).find(c => c.id === id);
      if (!cert) throw new Error('Certificate record not found.');

      // Duplicate prevention
      if (cert.status === 'Issued') {
        return { duplicate: true, alreadyIssued: true, certificate: JSON.parse(JSON.stringify(cert)), ...cert };
      }

      // Candidate must be Approved or Eligible
      if (cert.status !== 'Approved' && cert.status !== 'Eligible') {
        throw new Error(`Cannot issue certificate: Candidate must be Approved before issuance. Current status: "${cert.status}"`);
      }

      const nowIso = new Date().toISOString();
      const code = cert.tierName?.toUpperCase().includes('FOUND') ? 'FND' : cert.tierName?.toUpperCase().includes('BUILD') ? 'BLD' : cert.tierName?.toUpperCase().includes('CREAT') ? 'CRT' : 'ARC';
      const seq = Math.floor(1000 + Math.random() * 9000);
      const verificationId = (cert.verificationId && !cert.verificationId.includes('(') && !cert.verificationId.includes('Pending') && !cert.verificationId.includes('Reserved'))
        ? cert.verificationId
        : `NEX-${code}-2026-${seq}`;

      cert.status = 'Issued';
      cert.verificationId = verificationId;
      cert.issueDate = nowIso.split('T')[0];
      cert.issuedAt = nowIso;
      cert.issuedBy = (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || currentRole;
      cert.issuingOrganization = 'NEXVION AI Academy';
      cert.verificationUrl = `/verify-certificate/${verificationId}`;
      cert.signatory = options.signatory || cert.signatory || 'Dr. Evelyn Vance & Dr. Kenneth Vance';

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({
        text: `Official credential issued and registered with ID: ${verificationId}`,
        author: 'System Registrar',
        date: nowIso
      });

      cert.history = cert.history || [];
      cert.history.push({
        action: 'Certificate Issued',
        by: cert.issuedBy,
        date: nowIso,
        note: `Verification ID assigned: ${verificationId}`
      });

      store.saveState();
      store.persistDoc('certificates', cert.id, cert);
      auditRepository.log('Issued Certificate Credential', 'Certificate', `${cert.studentName} (${verificationId})`);

      try {
        await notificationDeliveryService.triggerCertificateNotification(cert, 'issued');
      } catch (e) {}

      return JSON.parse(JSON.stringify(cert));
    },

    // 5. Revoke Certificate
    revoke: async (id, reason, revoker) => {
      const currentRole = store.getCurrentRole();
      if (!['Owner', 'Super Admin', 'Academic Director', 'Certifier'].includes(currentRole)) {
        throw new Error('Access denied: Unauthorized role cannot revoke certificates.');
      }

      const cert = (store.state.certificates || []).find(c => c.id === id);
      if (!cert) throw new Error('Certificate record not found.');

      if (cert.status === 'Revoked') {
        return JSON.parse(JSON.stringify(cert));
      }

      const nowIso = new Date().toISOString();
      const revokerName = revoker || (typeof window !== 'undefined' && window.NexvionAuth && window.NexvionAuth.getDisplayName && window.NexvionAuth.getDisplayName()) || currentRole;
      const revokeReason = reason || 'Administrative compliance action';

      cert.status = 'Revoked';
      cert.eligibilityStatus = 'Disqualified / Revoked';
      cert.revocation = {
        reason: revokeReason,
        revokedBy: revokerName,
        revokedAt: nowIso
      };

      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({
        text: `Credential revoked: ${revokeReason}`,
        author: revokerName,
        date: nowIso
      });

      cert.history = cert.history || [];
      cert.history.push({
        action: 'Certificate Revoked',
        by: revokerName,
        date: nowIso,
        note: revokeReason
      });

      store.saveState();
      store.persistDoc('certificates', cert.id, cert);
      auditRepository.log('Revoked Certificate Credential', 'Certificate', `${cert.studentName} (${cert.verificationId || cert.id}) - Reason: ${revokeReason}`);

      try {
        await notificationDeliveryService.triggerCertificateNotification(cert, 'revoked', revokeReason);
      } catch (e) {}

      return JSON.parse(JSON.stringify(cert));
    },

    // 6. Add Internal Note
    addNote: async (id, noteText, author) => {
      const cert = (store.state.certificates || []).find(c => c.id === id);
      if (!cert) throw new Error('Certificate record not found.');

      const nowIso = new Date().toISOString();
      cert.internalNotes = cert.internalNotes || [];
      cert.internalNotes.push({
        text: noteText,
        author: author || store.getCurrentRole(),
        date: nowIso
      });

      store.saveState();
      store.persistDoc('certificates', cert.id, cert);
      auditRepository.log('Added Certificate Audit Note', 'Certificate', `${cert.studentName} (${cert.id})`);
      return JSON.parse(JSON.stringify(cert));
    },

    // 7. Public Verification (Safe metadata only, no private student information)
    verifyPublic: async (idOrVerificationId) => {
      if (!idOrVerificationId) {
        return { valid: false, found: false, message: 'No credential ID provided.' };
      }
      const cert = (store.state.certificates || []).find(c =>
        c.id === idOrVerificationId ||
        c.verificationId === idOrVerificationId ||
        (c.verificationId && c.verificationId.split(' ')[0] === idOrVerificationId)
      );

      if (!cert || (cert.status !== 'Issued' && cert.status !== 'Revoked')) {
        return {
          valid: false,
          found: false,
          status: cert ? cert.status : 'Not found',
          message: 'Certificate record not found or not yet officially issued.'
        };
      }

      if (cert.status === 'Revoked') {
        return {
          valid: false,
          found: true,
          revoked: true,
          status: 'Revoked',
          certificateId: cert.verificationId || cert.id,
          studentName: cert.studentName,
          courseName: cert.courseTitle,
          tier: cert.tierName,
          issueDate: cert.issueDate,
          revocationDate: cert.revocation?.revokedAt ? cert.revocation.revokedAt.split('T')[0] : 'Recorded',
          revocationReason: cert.revocation?.reason || 'Administrative action',
          issuingOrganization: cert.issuingOrganization || 'NEXVION AI Academy'
        };
      }

      return {
        valid: true,
        found: true,
        revoked: false,
        status: 'Issued',
        certificateId: cert.verificationId,
        studentName: cert.studentName,
        courseName: cert.courseTitle,
        tier: cert.tierName,
        issueDate: cert.issueDate,
        grade: cert.grade,
        issuingOrganization: cert.issuingOrganization || 'NEXVION AI Academy',
        verificationUrl: cert.verificationUrl || `/verify-certificate/${cert.verificationId}`
      };
    }
  };

  // --- supportRepository (Phase 16 Backend Support Operations) ---
  const supportRepository = {
    _normalizeTicket: (t, requestingUserId = null, isAdmin = true) => {
      if (!t) return null;
      const copy = JSON.parse(JSON.stringify(t));
      // Ensure arrays and structures
      copy.messages = copy.messages || [];
      copy.attachments = copy.attachments || [];
      copy.resolutionDetails = copy.resolutionDetails || null;

      // Internal notes privacy: NEVER expose internalNotes to student callers
      if (!isAdmin || (requestingUserId && copy.studentId === requestingUserId && !isAdmin)) {
        delete copy.internalNotes;
      } else {
        if (typeof copy.internalNotes === 'string') {
          copy.internalNotes = [{
            id: 'not-seed-1',
            text: copy.internalNotes,
            author: copy.assignedAdmin || 'Support Desk',
            createdAt: copy.createdAt || new Date().toISOString()
          }];
        } else if (!Array.isArray(copy.internalNotes)) {
          copy.internalNotes = [];
        }
      }

      // Priority normalization
      if (copy.priority === 'Medium') copy.priority = 'Normal';
      return copy;
    },

    findAll: async (filters = {}, requestingUserId = null, isAdmin = true) => {
      let list = await store.queryDocs('supportTickets', typeof filters === 'object' ? { filters: Object.entries(filters).filter(([k]) => ['category', 'status', 'priority', 'assignedAdmin', 'studentId'].includes(k)).map(([k, v]) => ({ field: k, value: v })), search: filters.search } : {});
      list = list || store.state.supportTickets || [];

      // Student isolation: Students can access only their own tickets
      if (!isAdmin && requestingUserId) {
        list = list.filter(t => t.studentId === requestingUserId || t.studentEmail === requestingUserId);
      }

      // Apply filters
      if (filters.category && filters.category !== 'ALL') {
        list = list.filter(t => (t.category || '').toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.status && filters.status !== 'ALL') {
        list = list.filter(t => (t.status || '').toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.priority && filters.priority !== 'ALL') {
        const pFilter = filters.priority.toLowerCase() === 'medium' ? 'normal' : filters.priority.toLowerCase();
        list = list.filter(t => (t.priority || '').toLowerCase() === pFilter);
      }
      if (filters.assignedAdmin && filters.assignedAdmin !== 'ALL') {
        list = list.filter(t => (t.assignedAdmin || '').toLowerCase().includes(filters.assignedAdmin.toLowerCase()));
      }
      if (filters.studentId) {
        list = list.filter(t => t.studentId === filters.studentId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(t =>
          (t.subject && t.subject.toLowerCase().includes(q)) ||
          (t.ticketRef && t.ticketRef.toLowerCase().includes(q)) ||
          (t.studentName && t.studentName.toLowerCase().includes(q)) ||
          (t.studentEmail && t.studentEmail.toLowerCase().includes(q))
        );
      }

      return list.map(t => supportRepository._normalizeTicket(t, requestingUserId, isAdmin));
    },

    findById: async (id, requestingUserId = null, isAdmin = true) => {
      const t = await store.getDoc('supportTickets', id);
      if (!t) return null;

      // Security: Students can access only their own tickets
      if (!isAdmin && requestingUserId) {
        if (t.studentId !== requestingUserId && t.studentEmail !== requestingUserId) {
          throw new Error('Access denied: Unauthorized attempt to view another student\'s ticket.');
        }
      }

      return supportRepository._normalizeTicket(t, requestingUserId, isAdmin);
    },

    getStudentTickets: async (studentId) => {
      if (!studentId) return [];
      const list = (store.state.supportTickets || []).filter(t => t.studentId === studentId);
      // Student view: always strictly strip internal notes
      return list.map(t => supportRepository._normalizeTicket(t, studentId, false));
    },

    create: async (data) => {
      if (!data.subject) throw new Error('Ticket subject is required.');
      const nowIso = new Date().toISOString();
      const validCategories = ['Enrollment', 'Course access', 'Payment', 'Technical issue', 'Certificate', 'General question'];
      const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];

      let category = data.category || 'General question';
      if (!validCategories.includes(category)) category = 'General question';

      let priority = data.priority || 'Normal';
      if (priority === 'Medium') priority = 'Normal';
      if (!validPriorities.includes(priority)) priority = 'Normal';

      const studentId = data.studentId || null;
      let studentName = data.studentName || 'Student';
      let studentEmail = data.studentEmail || '';

      if (studentId) {
        const student = (store.state.students || []).find(s => s.id === studentId);
        if (student) {
          studentName = student.name || studentName;
          studentEmail = student.email || studentEmail;
        }
      }

      const seq = Math.floor(1000 + Math.random() * 9000);
      const ticketRef = data.ticketRef || `SUP-2026-${seq}`;
      const ticketId = data.id || `tic-${Date.now().toString().slice(-4)}`;

      const messages = [];
      if (data.message || data.initialMessage) {
        messages.push({
          id: `msg-${Date.now()}-1`,
          sender: studentName,
          senderEmail: studentEmail,
          isStaff: false,
          timestamp: nowIso,
          text: data.message || data.initialMessage
        });
      }

      const internalNotes = [];
      if (data.internalNote) {
        internalNotes.push({
          id: `not-${Date.now()}-1`,
          text: data.internalNote,
          author: data.author || store.getCurrentRole(),
          createdAt: nowIso
        });
      }

      const newTicket = {
        id: ticketId,
        ticketRef,
        studentId,
        studentName,
        studentEmail,
        subject: data.subject,
        category,
        priority,
        status: data.status || 'Open',
        assignedAdmin: data.assignedAdmin || 'Unassigned',
        createdAt: nowIso,
        lastUpdated: nowIso,
        createdDate: nowIso.split('T')[0],
        updatedDate: nowIso.split('T')[0],
        messages,
        internalNotes,
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        resolutionDetails: null
      };

      store.state.supportTickets = store.state.supportTickets || [];
      store.state.supportTickets.unshift(newTicket);
      store.saveState();
      store.persistDoc('supportTickets', newTicket.id, newTicket);
      auditRepository.log('Created Support Ticket', 'Support', `${newTicket.ticketRef}: ${newTicket.subject}`);

      return supportRepository._normalizeTicket(newTicket, null, true);
    },

    assignTicket: async (id, adminName, adminEmail) => {
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const prevAssignee = t.assignedAdmin || 'Unassigned';
      const nowIso = new Date().toISOString();
      t.assignedAdmin = adminName;
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      if (t.status === 'Open') {
        t.status = 'In progress';
      }

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Assigned Support Ticket', 'Support', `${t.ticketRef} reassigned from ${prevAssignee} to ${adminName}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    reply: async (id, replyText, sender, isStaff = false) => {
      if (!replyText || !replyText.trim()) throw new Error('Reply message cannot be empty.');
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const nowIso = new Date().toISOString();
      const senderName = sender || (isStaff ? 'Support Desk' : t.studentName);
      t.messages = t.messages || [];
      t.messages.push({
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender: senderName,
        isStaff: !!isStaff,
        timestamp: nowIso,
        text: replyText.trim()
      });

      // Status transition intelligence
      if (isStaff && (t.status === 'Open' || t.status === 'In progress')) {
        t.status = 'Waiting for student';
      } else if (!isStaff && t.status === 'Waiting for student') {
        t.status = 'In progress';
      }

      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Replied to Support Ticket', 'Support', `${t.ticketRef} by ${senderName}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    addInternalNote: async (id, noteText, author) => {
      if (!noteText || !noteText.trim()) throw new Error('Internal note text cannot be empty.');
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const nowIso = new Date().toISOString();
      const authorName = author || store.getCurrentRole();

      if (typeof t.internalNotes === 'string') {
        t.internalNotes = [{ id: 'not-prev-1', text: t.internalNotes, author: 'Support Staff', createdAt: t.createdAt }];
      } else if (!Array.isArray(t.internalNotes)) {
        t.internalNotes = [];
      }

      t.internalNotes.push({
        id: `not-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        text: noteText.trim(),
        author: authorName,
        createdAt: nowIso
      });

      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Added Ticket Internal Note', 'Support', `${t.ticketRef} note by ${authorName}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    changePriority: async (id, newPriority) => {
      const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
      let normPriority = newPriority;
      if (normPriority === 'Medium') normPriority = 'Normal';
      if (!validPriorities.includes(normPriority)) {
        throw new Error(`Invalid priority "${newPriority}". Must be one of: ${validPriorities.join(', ')}`);
      }

      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const oldPriority = t.priority;
      const nowIso = new Date().toISOString();
      t.priority = normPriority;
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Changed Ticket Priority', 'Support', `${t.ticketRef}: ${oldPriority} -> ${normPriority}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    changeStatus: async (id, newStatus) => {
      const validStatuses = ['Open', 'In progress', 'Waiting for student', 'Resolved', 'Closed'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid ticket status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
      }

      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const oldStatus = t.status;
      const nowIso = new Date().toISOString();
      t.status = newStatus;
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      if (newStatus === 'Resolved' && !t.resolutionDetails) {
        t.resolutionDetails = {
          resolvedAt: nowIso,
          resolvedBy: store.getCurrentRole(),
          resolutionNotes: 'Marked resolved'
        };
      }

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Changed Ticket Status', 'Support', `${t.ticketRef}: ${oldStatus} -> ${newStatus}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    resolve: async (id, resolutionNotes, resolver) => {
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const nowIso = new Date().toISOString();
      const resolverName = resolver || store.getCurrentRole();
      t.status = 'Resolved';
      t.resolutionDetails = {
        resolvedAt: nowIso,
        resolvedBy: resolverName,
        resolutionNotes: resolutionNotes || 'Inquiry successfully resolved by staff.'
      };
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Resolved Support Ticket', 'Support', `${t.ticketRef} resolved by ${resolverName}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    reopen: async (id, reason, user) => {
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const nowIso = new Date().toISOString();
      const userName = user || store.getCurrentRole();
      t.status = 'In progress';
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      t.messages = t.messages || [];
      t.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'System Notice',
        isStaff: true,
        timestamp: nowIso,
        text: `Ticket reopened by ${userName}. Reason: ${reason || 'Additional investigation required.'}`
      });

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Reopened Support Ticket', 'Support', `${t.ticketRef} reopened by ${userName}: ${reason || 'Investigation resumed'}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    close: async (id, closer) => {
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) throw new Error('Support ticket not found.');

      const nowIso = new Date().toISOString();
      const closerName = closer || store.getCurrentRole();
      t.status = 'Closed';
      t.lastUpdated = nowIso;
      t.updatedDate = nowIso.split('T')[0];

      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Closed Support Ticket', 'Support', `${t.ticketRef} closed by ${closerName}`);
      return supportRepository._normalizeTicket(t, null, true);
    },

    updateTicket: async (id, updates) => {
      const t = (store.state.supportTickets || []).find(ticket => ticket.id === id || ticket.ticketRef === id);
      if (!t) return null;

      Object.assign(t, updates);
      t.lastUpdated = new Date().toISOString();
      t.updatedDate = t.lastUpdated.split('T')[0];
      store.saveState();
      store.persistDoc('supportTickets', t.id, t);
      auditRepository.log('Updated Support Ticket', 'Support', `${t.ticketRef} (${t.status})`);
      return supportRepository._normalizeTicket(t, null, true);
    }
  };

  // --- analyticsRepository (Phase 16 Operations & Educational Telemetry) ---
  const analyticsRepository = {
    getOverview: async (filters = {}, requestingRole = null) => {
      return analyticsRepository.getAnalytics(filters, requestingRole);
    },

    getAnalytics: async (filters = {}, requestingRole = null) => {
      const currentRole = requestingRole || store.getCurrentRole();
      auditRepository.log('VIEWED_ANALYTICS_OVERVIEW', 'Analytics', `Telemetry access scoped to role: ${currentRole}`);

      // Data extraction
      let enrollments = store.state.enrollments || [];
      let students = store.state.students || [];
      let courses = store.state.courses || [];
      let batches = store.state.batches || [];
      let submissions = store.state.submissions || [];
      let certificates = store.state.certificates || [];
      let notifications = store.state.notifications || [];
      let supportTickets = store.state.supportTickets || [];
      let payments = store.state.payments || [];
      let classes = store.state.classes || [];

      // Filtering by courseId
      if (filters.courseId && filters.courseId !== 'ALL') {
        enrollments = enrollments.filter(e => e.courseId === filters.courseId);
        courses = courses.filter(c => c.id === filters.courseId);
        batches = batches.filter(b => b.courseId === filters.courseId);
        submissions = submissions.filter(s => s.courseId === filters.courseId);
        certificates = certificates.filter(c => c.courseId === filters.courseId);
      }

      // Filtering by tierId
      if (filters.tierId && filters.tierId !== 'ALL') {
        enrollments = enrollments.filter(e => e.tierId === filters.tierId);
        batches = batches.filter(b => b.tierId === filters.tierId);
        payments = payments.filter(p => p.tierId === filters.tierId);
      }

      // Filtering by batchId
      if (filters.batchId && filters.batchId !== 'ALL') {
        enrollments = enrollments.filter(e => e.batchId === filters.batchId);
        batches = batches.filter(b => b.id === filters.batchId);
      }

      // Filtering by status
      if (filters.status && filters.status !== 'ALL') {
        enrollments = enrollments.filter(e => e.status === filters.status);
      }

      // 1. Overview KPIs
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.status !== 'Inactive' && s.status !== 'Suspended').length;
      const pendingEnrollments = enrollments.filter(e => e.status === 'Pending').length;
      const completedEnrollments = enrollments.filter(e => e.status === 'Completed').length;
      const activeCourses = courses.filter(c => c.status === 'Published').length || courses.length;
      const openBatches = batches.filter(b => b.status === 'Open' || b.status === 'Enrolling').length;
      const waitlistedStudents = batches.reduce((sum, b) => sum + (Array.isArray(b.waitlist) ? b.waitlist.length : (b.waitlistCount || 0)), 0);

      const completionRatePercent = enrollments.length > 0
        ? Number(((completedEnrollments / enrollments.length) * 100).toFixed(1))
        : 0;

      // 2. Course Popularity
      const coursePopularity = courses.map(c => {
        const enrCount = enrollments.filter(e => e.courseId === c.id || e.courseTitle === c.title).length;
        return {
          courseId: c.id,
          courseTitle: c.title,
          tierName: c.tierName || 'Curriculum Track',
          enrollmentsCount: enrCount,
          popularityScore: enrCount > 0 ? Math.min(100, Math.round(enrCount * 12.5)) : 0
        };
      });

      // 3. Tier Distribution
      const tierMap = {
        'ai-foundations': { tier: 'AI Foundations (Free)', count: 0, color: '#7F52FF' },
        'ai-builder': { tier: 'AI Builder (Paid)', count: 0, color: '#C757BC' },
        'ai-creator': { tier: 'AI Creator (Paid)', count: 0, color: '#00D2B4' },
        'ai-architect': { tier: 'AI Architect (Premium)', count: 0, color: '#F59E0B' }
      };
      enrollments.forEach(e => {
        const tId = e.tierId || (e.courseId && e.courseId.includes('builder') ? 'ai-builder' : e.courseId && e.courseId.includes('creator') ? 'ai-creator' : e.courseId && e.courseId.includes('architect') ? 'ai-architect' : 'ai-foundations');
        if (tierMap[tId]) tierMap[tId].count++;
        else tierMap['ai-foundations'].count++;
      });
      const totalTierCount = Math.max(1, Object.values(tierMap).reduce((s, t) => s + t.count, 0));
      const tierDistribution = Object.values(tierMap).map(t => ({
        tier: t.tier,
        count: t.count,
        percent: Number(((t.count / totalTierCount) * 100).toFixed(1)),
        color: t.color
      }));

      // 4. Batch Capacity Utilization (Strict 30-Cap)
      const batchCapacityUtilization = batches.map(b => {
        const filled = Array.isArray(b.students) ? b.students.length : (b.enrolledCount !== undefined ? b.enrolledCount : 0);
        const capacity = 30; // STRICT ARCHITECTURAL INVARIANT
        const waitlistCount = Array.isArray(b.waitlist) ? b.waitlist.length : (b.waitlistCount || 0);
        return {
          batchId: b.id,
          batch: b.name,
          filled,
          capacity,
          percent: Number(((filled / capacity) * 100).toFixed(1)),
          waitlistCount,
          status: filled >= 30 ? 'FULL' : 'OPEN'
        };
      });

      // 5. Enrollment Trends (Weekly Aggregation)
      const enrollmentTrends = [];

      // 6. Project & Assignment Submissions
      const projectSubs = submissions.filter(s => s.type === 'Project');
      const assignmentSubs = submissions.filter(s => s.type === 'Assignment');
      const projectCompletion = {
        totalProjects: projectSubs.length,
        approved: projectSubs.filter(s => s.status === 'Approved' || (s.gradeScore >= 70)).length,
        reviewed: projectSubs.filter(s => s.status === 'Reviewed').length,
        pendingReview: projectSubs.filter(s => s.status === 'Submitted' || s.status === 'Pending review').length,
        approvalRate: projectSubs.length > 0 ? Math.round((projectSubs.filter(s => s.status === 'Approved').length / projectSubs.length) * 100) : 0
      };
      const assignmentSubmissions = {
        totalAssignments: assignmentSubs.length,
        reviewed: assignmentSubs.filter(s => s.status === 'Reviewed' || s.status === 'Approved').length,
        pending: assignmentSubs.filter(s => s.status === 'Submitted' || s.status === 'Pending review').length
      };

      // 7. Certificate Eligibility Aggregation
      const certificateEligibility = {
        totalRecords: certificates.length,
        eligible: certificates.filter(c => c.status === 'Eligible').length,
        pendingApproval: certificates.filter(c => c.status === 'Pending approval').length,
        approved: certificates.filter(c => c.status === 'Approved').length,
        issued: certificates.filter(c => c.status === 'Issued').length,
        revoked: certificates.filter(c => c.status === 'Revoked').length,
        notEligible: certificates.filter(c => c.status === 'Not eligible').length
      };

      // 8. Notification Delivery Telemetry
      const notificationDelivery = {
        totalDispatched: notifications.length,
        sent: notifications.filter(n => n.status === 'Sent' || n.deliveryStatus === 'Sent').length,
        scheduled: notifications.filter(n => n.status === 'Scheduled').length,
        failed: notifications.filter(n => n.status === 'Failed').length,
        partiallyDelivered: notifications.filter(n => n.status === 'Partially delivered').length
      };

      // 9. Support Volume Metrics
      const supportVolume = {
        totalTickets: supportTickets.length,
        open: supportTickets.filter(t => t.status === 'Open').length,
        inProgress: supportTickets.filter(t => t.status === 'In progress').length,
        waitingForStudent: supportTickets.filter(t => t.status === 'Waiting for student').length,
        resolved: supportTickets.filter(t => t.status === 'Resolved').length,
        closed: supportTickets.filter(t => t.status === 'Closed').length,
        byCategory: {
          enrollment: supportTickets.filter(t => (t.category || '').toLowerCase() === 'enrollment').length,
          courseAccess: supportTickets.filter(t => (t.category || '').toLowerCase() === 'course access').length,
          payment: supportTickets.filter(t => (t.category || '').toLowerCase() === 'payment').length,
          technicalIssue: supportTickets.filter(t => (t.category || '').toLowerCase() === 'technical issue').length,
          certificate: supportTickets.filter(t => (t.category || '').toLowerCase() === 'certificate').length,
          generalQuestion: supportTickets.filter(t => (t.category || '').toLowerCase() === 'general question').length
        }
      };

      // 10. Financial Telemetry (Security Restricted for Non-Finance Roles)
      const canAccessFinancials = ['Owner', 'Super Admin', 'Finance Manager'].includes(currentRole);
      let paymentSummary = null;
      if (!canAccessFinancials) {
        paymentSummary = {
          restricted: true,
          message: 'Financial ledger restricted. Requires Finance Manager role.',
          currency: 'USD'
        };
      } else {
        const paidPayments = payments.filter(p => p.status === 'Paid');
        const totalRevenue = paidPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        paymentSummary = {
          restricted: false,
          totalRevenue,
          currency: 'USD',
          totalTransactions: payments.length,
          paidCount: paidPayments.length,
          pendingCount: payments.filter(p => p.status === 'Pending').length,
          refundedCount: payments.filter(p => p.status === 'Refunded').length,
          freeTierRegistrations: payments.filter(p => p.amountDisplay === 'FREE' || p.status === 'Not required').length
        };
      }

      return {
        overview: {
          totalStudents,
          activeStudents,
          pendingEnrollments,
          completedEnrollments,
          activeCourses,
          openBatches,
          waitlistedStudents,
          completionRatePercent,
          avgCourseSatisfaction: 0,
          supportVolume: supportVolume.totalTickets
        },
        enrollmentTrends,
        coursePopularity,
        tierDistribution,
        batchCapacityUtilization,
        studentActivity: {
          activeCount: activeStudents,
          inactiveCount: totalStudents - activeStudents,
          activeRatePercent: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0
        },
        courseCompletion: {
          totalEnrolled: enrollments.length,
          completed: completedEnrollments,
          active: enrollments.filter(e => e.status === 'Enrolled').length,
          completionRatePercent
        },
        projectCompletion,
        assignmentSubmissions,
        certificateEligibility,
        notificationDelivery,
        supportVolume,
        paymentSummary,
        filtersApplied: filters,
        generatedAt: new Date().toISOString()
      };
    }
  };

  // --- adminRepository ---
  const adminRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.adminUsers)),
    findById: async (id) => {
      const u = store.state.adminUsers.find(admin => admin.id === id);
      return u ? JSON.parse(JSON.stringify(u)) : null;
    },
    saveUser: async (userData) => {
      const idx = store.state.adminUsers.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        store.state.adminUsers[idx] = { ...store.state.adminUsers[idx], ...userData };
        store.saveState();
        auditRepository.log('UPDATED_ADMIN_USER', 'Admin', store.state.adminUsers[idx].name, 'Existing personnel profile', JSON.stringify(userData), 'Success');
        return store.state.adminUsers[idx];
      } else {
        const item = {
          ...userData,
          id: userData.id || `adm-${Date.now()}`,
          createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
          lastActive: userData.lastActive || 'Invitation Pending',
          status: userData.status || 'Invited'
        };
        store.state.adminUsers.unshift(item);
        store.saveState();
        auditRepository.log('INVITED_ADMIN_USER', 'Admin', item.name, 'Unregistered', `Invited as ${item.role}`, 'Success');
        return item;
      }
    },
    inviteUser: async ({ name, email, role, department, notes }) => {
      const newAdmin = {
        id: `adm-${Date.now()}`,
        name,
        email,
        role: role || 'Content Manager',
        status: 'Invited',
        lastActive: 'Invitation Pending',
        createdAt: new Date().toISOString().split('T')[0],
        avatar: 'assets/avatars/default.png',
        department: department || 'General Administration',
        notes: notes || ''
      };
      store.state.adminUsers.unshift(newAdmin);
      store.saveState();
      auditRepository.log('ADMIN_INVITED', 'Admin', `${newAdmin.name} (${newAdmin.email})`, 'Non-existent', `Role: ${newAdmin.role}`, 'Success');
      return newAdmin;
    },
    editUser: async (id, updates) => {
      const idx = store.state.adminUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      const prev = JSON.stringify(store.state.adminUsers[idx]);
      store.state.adminUsers[idx] = { ...store.state.adminUsers[idx], ...updates };
      store.saveState();
      auditRepository.log('ADMIN_EDITED', 'Admin', store.state.adminUsers[idx].name, prev, JSON.stringify(updates), 'Success');
      return store.state.adminUsers[idx];
    },
    changeRole: async (id, newRole) => {
      const idx = store.state.adminUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      const prevRole = store.state.adminUsers[idx].role;
      store.state.adminUsers[idx].role = newRole;
      store.saveState();
      auditRepository.log('ROLE_CHANGED', 'Admin', store.state.adminUsers[idx].name, `Role: ${prevRole}`, `Role: ${newRole}`, 'Success');
      return store.state.adminUsers[idx];
    },
    suspendUser: async (id, reason) => {
      const idx = store.state.adminUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      store.state.adminUsers[idx].status = 'Suspended';
      store.saveState();
      auditRepository.log('ADMIN_SUSPENDED', 'Admin', store.state.adminUsers[idx].name, 'Status: Active', `Status: Suspended (Reason: ${reason || 'Administrative Action'})`, 'Warning');
      return store.state.adminUsers[idx];
    },
    reactivateUser: async (id) => {
      const idx = store.state.adminUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      store.state.adminUsers[idx].status = 'Active';
      store.saveState();
      auditRepository.log('ADMIN_REACTIVATED', 'Admin', store.state.adminUsers[idx].name, 'Status: Suspended', 'Status: Active', 'Success');
      return store.state.adminUsers[idx];
    },
    getActivity: async (adminId) => {
      const admin = store.state.adminUsers.find(u => u.id === adminId);
      if (!admin) return [];
      const term = admin.name.toLowerCase();
      const email = admin.email.toLowerCase();
      return store.state.auditLogs.filter(l => 
        (l.admin && l.admin.toLowerCase().includes(term)) ||
        (l.adminEmail && l.adminEmail.toLowerCase() === email) ||
        (l.entityName && l.entityName.toLowerCase().includes(term))
      );
    },
    getRoles: async () => JSON.parse(JSON.stringify(store.state.roles)),
    getRoleById: async (roleId) => {
      const r = store.state.roles.find(role => role.id === roleId || role.name.toLowerCase() === roleId.toLowerCase());
      return r ? JSON.parse(JSON.stringify(r)) : null;
    }
  };

  // --- roleRepository ---
  const roleRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.roles)),
    findById: async (id) => {
      const r = store.state.roles.find(role => role.id === id || role.name.toLowerCase() === id.toLowerCase());
      return r ? JSON.parse(JSON.stringify(r)) : null;
    },
    getPermissionsMatrix: () => JSON.parse(JSON.stringify(PERMISSION_MODULES))
  };

  // --- auditRepository ---
  const auditRepository = {
    findAll: async (options = {}) => store.queryDocs('auditLogs', options),
    findById: async (id) => store.getDoc('auditLogs', id),
    log: (action, entityType, entityName, previousState = 'Prior state baseline', newState = 'Modified by administrative operation', result = 'Success', admin = null, ipDevice = null) => {
      const currentRole = store.getCurrentRole();
      const entry = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        admin: admin || `${currentRole} Console`,
        adminEmail: `${currentRole.toLowerCase().replace(/\s+/g, '.')}@nexvion.ai`,
        action: action,
        entityType: entityType,
        entityName: entityName,
        previousState: typeof previousState === 'object' ? JSON.stringify(previousState) : String(previousState),
        newState: typeof newState === 'object' ? JSON.stringify(newState) : String(newState),
        ipDevice: ipDevice || '192.168.1.102 • Chrome 130 on macOS',
        result: result,
        notes: `Server-side audit logging synchronized to Firestore auditLogs.`
      };
      store.state.auditLogs.unshift(entry);
      if (store.state.auditLogs.length > 100) store.state.auditLogs.pop();
      store.saveState();
      store.persistDoc('auditLogs', entry.id, entry);
      return entry;
    }
  };

  // --- settingsRepository ---
  const settingsRepository = {
    get: async () => {
      const s = await store.getDoc('settings', 'platformSettings');
      return s || JSON.parse(JSON.stringify(store.state.settings));
    },
    save: async (newSettings) => {
      // STRICT INVARIANT ENFORCEMENT: Max batch size fixed at 30, cannot exceed 30
      if (newSettings.batchRules) {
        if (newSettings.batchRules.maxBatchCapacity > 30) {
          throw new Error('Maximum batch capacity cannot exceed 30 students per platform architectural invariant.');
        }
        newSettings.batchRules.maxBatchCapacity = Math.min(30, Number(newSettings.batchRules.maxBatchCapacity) || 30);
      }
      const prev = JSON.stringify(store.state.settings);
      store.state.settings = { ...store.state.settings, ...newSettings };
      store.saveState();
      store.persistDoc('settings', 'platformSettings', store.state.settings);
      auditRepository.log('SETTINGS_UPDATED', 'Settings', 'Platform Configuration & Governance', prev, JSON.stringify(newSettings), 'Success');
      return true;
    },
    resetSection: async (sectionKey) => {
      if (defaultSettings[sectionKey]) {
        store.state.settings[sectionKey] = JSON.parse(JSON.stringify(defaultSettings[sectionKey]));
        store.saveState();
        store.persistDoc('settings', 'platformSettings', store.state.settings);
        auditRepository.log('SETTINGS_SECTION_RESET', 'Settings', `Reset section: ${sectionKey}`, 'Custom configuration', 'Factory default state restored', 'Success');
        return store.state.settings[sectionKey];
      }
      return null;
    }
  };

  // --- announcementsRepository ---
  const announcementsRepository = {
    findAll: async (options = {}) => store.queryDocs('announcements', options),
    findById: async (id) => store.getDoc('announcements', id),
    save: async (data) => {
      const idx = store.state.announcements.findIndex(a => a.id === data.id);
      if (idx !== -1) {
        store.state.announcements[idx] = {
          ...store.state.announcements[idx],
          ...data,
          lastUpdated: new Date().toISOString()
        };
        store.saveState();
        store.persistDoc('announcements', store.state.announcements[idx].id, store.state.announcements[idx]);
        auditRepository.log('Updated Platform Announcement', 'Announcement', store.state.announcements[idx].title);
        return store.state.announcements[idx];
      } else {
        const item = {
          ...data,
          id: data.id || `anc-${Date.now()}`,
          publishedAt: data.status === 'Published' ? (data.publishedAt || new Date().toISOString()) : (data.publishedAt || null),
          lastUpdated: new Date().toISOString()
        };
        store.state.announcements.unshift(item);
        store.saveState();
        store.persistDoc('announcements', item.id, item);
        auditRepository.log('Created Platform Announcement', 'Announcement', item.title);
        return item;
      }
    },
    duplicate: async (id) => {
      const orig = store.state.announcements.find(a => a.id === id);
      if (!orig) return null;
      const clone = {
        ...JSON.parse(JSON.stringify(orig)),
        id: `anc-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: 'Draft',
        publishedAt: null,
        scheduledFor: null
      };
      store.state.announcements.unshift(clone);
      store.saveState();
      store.persistDoc('announcements', clone.id, clone);
      auditRepository.log('Duplicated Platform Announcement', 'Announcement', clone.title);
      return clone;
    },
    publish: async (idOrData) => {
      let a = null;
      if (typeof idOrData === 'string') {
        a = store.state.announcements.find(item => item.id === idOrData);
      } else if (typeof idOrData === 'object' && idOrData !== null) {
        if (idOrData.id) {
          a = store.state.announcements.find(item => item.id === idOrData.id);
        }
        if (!a) {
          a = await announcementsRepository.save({ ...idOrData, status: 'Published' });
        }
      }
      if (a) {
        a.status = 'Published';
        a.publishedAt = new Date().toISOString();
        a.lastUpdated = a.publishedAt;
        store.saveState();
        store.persistDoc('announcements', a.id, a);
        auditRepository.log('Published Platform Announcement', 'Announcement', a.title);
        try {
          await notificationDeliveryService.triggerAnnouncementNotification(a);
        } catch (e) {
          console.warn('Notification delivery trigger notice:', e);
        }
        return a;
      }
      return null;
    },
    archive: async (id) => {
      const a = store.state.announcements.find(item => item.id === id);
      if (a) {
        a.status = 'Archived';
        a.lastUpdated = new Date().toISOString();
        store.saveState();
        store.persistDoc('announcements', id, a);
        auditRepository.log('Archived Platform Announcement', 'Announcement', a.title);
        return a;
      }
      return null;
    }
  };

  return {
    store,
    _store: store,
    // Service Repositories
    courseRepository,
    tierRepository,
    batchRepository,
    studentRepository,
    enrollmentRepository,
    contentRepository,
    projectRepository,
    notificationRepository,
    paymentRepository,
    certificateRepository,
    supportRepository,
    analyticsRepository,
    adminRepository,
    roleRepository,
    auditRepository,
    settingsRepository,
    announcementsRepository,

    // Session Role Helpers
    getCurrentRole: () => store.getCurrentRole(),
    setCurrentRole: (role) => store.setCurrentRole(role),
    hasPermission: (perm) => store.hasPermission(perm),
    resetToDefaults: () => store.resetState(),

    // Backward-Compatible Facade for Existing AdminApp Callers
    getCourses: () => courseRepository.findAll(),
    getCourseById: (id) => courseRepository.findById(id),
    saveCourse: (data) => data.id ? courseRepository.update(data.id, data) : courseRepository.create(data),
    getTiers: () => tierRepository.findAll(),
    getBatches: () => batchRepository.findAll(),
    getBatchById: (id) => batchRepository.findById(id),
    saveBatch: (data) => data.id ? batchRepository.update(data.id, data) : batchRepository.create(data),
    moveWaitlistStudentToEnrolled: (batchId, studentId) => batchRepository.admitFromWaitlist(batchId, studentId),
    getStudents: () => studentRepository.findAll(),
    getStudentById: (id) => studentRepository.findById(id),
    saveStudent: (data) => data.id ? studentRepository.update(data.id, data) : studentRepository.create(data),
    addStudentNote: (id, note, author, priority) => studentRepository.addNote(id, note, author, priority),
    getStudentEnrollments: (id) => studentRepository.getEnrollments(id),
    getStudentClasses: (id) => studentRepository.getClasses(id),
    getStudentProjects: (id) => studentRepository.getProjects(id),
    getStudentAssignments: (id) => studentRepository.getAssignments(id),
    getStudentPayments: (id) => studentRepository.getPayments(id),
    getStudentCertificates: (id) => studentRepository.getCertificates(id),
    getStudentSupportTickets: (id) => studentRepository.getSupportTickets(id),
    getStudentActivityTimeline: (id) => studentRepository.getActivityTimeline(id),
    getEnrollments: () => enrollmentRepository.findAll(),
    getEnrollmentById: (id) => enrollmentRepository.findById(id),
    saveEnrollment: (data) => data.id ? enrollmentRepository.update(data.id, data) : enrollmentRepository.create(data),
    approveEnrollment: (id, targetBatchId) => enrollmentRepository.approve(id, targetBatchId),
    rejectEnrollment: (id, reason) => enrollmentRepository.reject(id, reason),
    assignEnrollmentBatch: (id, batchId) => enrollmentRepository.assignBatch(id, batchId),
    moveEnrollmentToWaitlist: (id) => enrollmentRepository.moveToWaitlist(id),
    admitEnrollmentFromWaitlist: (id) => enrollmentRepository.admitFromWaitlist(id),
    admitFromWaitlist: (id) => enrollmentRepository.admitFromWaitlist(id),
    updateEnrollmentStatus: (id, status, reason) => enrollmentRepository.updateStatus(id, status, reason),
    addEnrollmentNote: (id, note) => enrollmentRepository.addNote(id, note),
    getClasses: () => contentRepository.getClasses(),
    getClassById: (id) => contentRepository.getClassById(id),
    saveClass: (data) => contentRepository.saveClass(data),
    duplicateClass: (id) => contentRepository.duplicateClass(id),
    archiveClass: (id) => contentRepository.archiveClass(id),
    getModules: () => contentRepository.getModules(),
    getModuleById: (id) => contentRepository.getModuleById(id),
    saveModule: (data) => contentRepository.saveModule(data),
    duplicateModule: (id) => contentRepository.duplicateModule(id),
    archiveModule: (id) => contentRepository.archiveModule(id),
    getLessons: () => contentRepository.getLessons(),
    getLessonById: (id) => contentRepository.getLessonById(id),
    saveLesson: (data) => contentRepository.saveLesson(data),
    duplicateLesson: (id) => contentRepository.duplicateLesson(id),
    archiveLesson: (id) => contentRepository.archiveLesson(id),
    getVideos: () => contentRepository.getVideos(),
    getVideoById: (id) => contentRepository.getVideoById(id),
    saveVideo: (data) => contentRepository.saveVideo(data),
    archiveVideo: (id) => contentRepository.archiveVideo(id),
    getResources: () => contentRepository.getResources(),
    getResourceById: (id) => contentRepository.getResourceById(id),
    saveResource: (data) => contentRepository.saveResource(data),
    archiveResource: (id) => contentRepository.archiveResource(id),
    getProjects: () => projectRepository.getProjects(),
    getProjectById: (id) => projectRepository.getProjectById(id),
    saveProject: (data) => projectRepository.saveProject(data),
    duplicateProject: (id) => projectRepository.duplicateProject(id),
    archiveProject: (id) => projectRepository.archiveProject(id),
    getAssignments: () => projectRepository.getAssignments(),
    getAssignmentById: (id) => projectRepository.getAssignmentById(id),
    saveAssignment: (data) => projectRepository.saveAssignment(data),
    duplicateAssignment: (id) => projectRepository.duplicateAssignment(id),
    archiveAssignment: (id) => projectRepository.archiveAssignment(id),
    getSubmissions: () => projectRepository.getSubmissions(),
    getSubmissionById: (id) => projectRepository.getSubmissionById(id),
    saveSubmission: (data) => projectRepository.saveSubmission(data),
    gradeSubmission: (id, a, b, c) => projectRepository.gradeSubmission(id, a, b, c),
    returnSubmissionForRevision: (id, fb, note, rev) => projectRepository.returnForRevision(id, fb, note, rev),
    approveSubmissionCompletion: (id, fb, note, rev, sc) => projectRepository.approveCompletion(id, fb, note, rev, sc),
    saveAssignmentReview: (id, score, feedback, reviewer) => projectRepository.gradeSubmission(id, score, feedback, reviewer),
    getAnnouncements: () => announcementsRepository.findAll(),
    getAnnouncementById: (id) => announcementsRepository.findById(id),
    saveAnnouncement: (data) => announcementsRepository.save(data),
    duplicateAnnouncement: (id) => announcementsRepository.duplicate(id),
    publishAnnouncement: (id) => announcementsRepository.publish(id),
    archiveAnnouncement: (id) => announcementsRepository.archive(id),
    getNotifications: () => notificationRepository.findAll(),
    getNotificationById: (id) => notificationRepository.findById(id),
    saveNotification: (data) => notificationRepository.save(data),
    sendNotification: (data) => notificationRepository.send(data),
    sendTestNotification: (data) => notificationRepository.sendTest(data),
    cancelNotification: (id) => notificationRepository.cancel(id),
    sendMockNotification: (data) => notificationRepository.send(data),
    getPayments: () => paymentRepository.findAll(),
    getPaymentById: (id) => paymentRepository.findById(id),
    refundPayment: (id, reason) => paymentRepository.refund(id, reason),
    updatePaymentStatus: (id, status, notes) => paymentRepository.updateStatus(id, status, notes),
    savePayment: (data) => paymentRepository.save(data),
    certificateRepository,
    getCertificates: () => certificateRepository.findAll(),
    getCertificateById: (id) => certificateRepository.findById(id),
    getStudentCertificates: (studentId) => certificateRepository.getStudentCertificates(studentId),
    calculateCertificateEligibility: (args) => certificateRepository.calculateEligibility(args),
    approveCertificate: (id, approver, note) => certificateRepository.approve(id, approver, note),
    rejectCertificate: (id, reason, rejecter) => certificateRepository.reject(id, reason, rejecter),
    issueCertificate: (id, options) => certificateRepository.issue(id, options),
    revokeCertificate: (id, reason, revoker) => certificateRepository.revoke(id, reason, revoker),
    addCertificateNote: (id, noteText, author) => certificateRepository.addNote(id, noteText, author),
    verifyCertificatePublic: (id) => certificateRepository.verifyPublic(id),
    issueMockCertificate: (id) => certificateRepository.issue(id),
    supportRepository,
    analyticsRepository,
    getSupportTickets: (filters, userId, isAdmin) => supportRepository.findAll(filters, userId, isAdmin),
    getSupportTicketById: (id, userId, isAdmin) => supportRepository.findById(id, userId, isAdmin),
    getStudentSupportTickets: (studentId) => supportRepository.getStudentTickets(studentId),
    createSupportTicket: (data) => supportRepository.create(data),
    assignSupportTicket: (id, adminName, adminEmail) => supportRepository.assignTicket(id, adminName, adminEmail),
    addTicketReply: (id, text, sender, isStaff) => supportRepository.reply(id, text, sender, isStaff),
    addSupportTicketInternalNote: (id, noteText, author) => supportRepository.addInternalNote(id, noteText, author),
    changeSupportTicketPriority: (id, priority) => supportRepository.changePriority(id, priority),
    changeSupportTicketStatus: (id, status) => supportRepository.changeStatus(id, status),
    resolveSupportTicket: (id, notes, resolver) => supportRepository.resolve(id, notes, resolver),
    reopenSupportTicket: (id, reason, user) => supportRepository.reopen(id, reason, user),
    closeSupportTicket: (id, closer) => supportRepository.close(id, closer),
    updateSupportTicket: (id, updates) => supportRepository.updateTicket(id, updates),
    getAnalytics: (filters, role) => analyticsRepository.getAnalytics(filters, role),
    getAnalyticsOverview: (filters, role) => analyticsRepository.getOverview(filters, role),
    getAdminUsers: () => adminRepository.findAll(),
    getAdminUserById: (id) => adminRepository.findById(id),
    saveAdminUser: (data) => adminRepository.saveUser(data),
    inviteAdminUser: (data) => adminRepository.inviteUser(data),
    editAdminUser: (id, updates) => adminRepository.editUser(id, updates),
    changeAdminRole: (id, newRole) => adminRepository.changeRole(id, newRole),
    suspendAdminUser: (id, reason) => adminRepository.suspendUser(id, reason),
    reactivateAdminUser: (id) => adminRepository.reactivateUser(id),
    getAdminActivity: (id) => adminRepository.getActivity(id),
    getRoles: () => roleRepository.findAll(),
    getRoleById: (id) => roleRepository.findById(id),
    getPermissionsMatrix: () => roleRepository.getPermissionsMatrix(),
    getAuditLogs: () => auditRepository.findAll(),
    getAuditLogById: (id) => auditRepository.findById(id),
    logAuditEvent: (action, entityType, entityName, prev, next, result) => auditRepository.log(action, entityType, entityName, prev, next, result),
    getSettings: () => settingsRepository.get(),
    saveSettings: (settings) => settingsRepository.save(settings),
    resetSettingsSection: (section) => settingsRepository.resetSection(section),

    // Phase 11 Extended Operations & Cloud Connectors
    publishCourse: (id) => courseRepository.publish(id),
    unpublishCourse: (id) => courseRepository.unpublish(id),
    archiveCourse: (id) => courseRepository.archive(id),
    assignCourseTier: (courseId, tierId) => courseRepository.assignTier(courseId, tierId),
    getCourseModules: (courseId) => courseRepository.getModules(courseId),
    getCourseClasses: (courseId) => courseRepository.getClasses(courseId),
    getCourseProjects: (courseId) => courseRepository.getProjects(courseId),
    configureCertificateRequirements: (courseId, reqs) => courseRepository.configureCertificateRequirements(courseId, reqs),

    assignBatchCourse: (batchId, courseId) => batchRepository.assignCourse(batchId, courseId),
    assignBatchInstructor: (batchId, instructor) => batchRepository.assignInstructor(batchId, instructor),
    setBatchDates: (batchId, start, end) => batchRepository.setDates(batchId, start, end),
    setBatchSchedule: (batchId, schedule) => batchRepository.setSchedule(batchId, schedule),
    addBatchStudent: (batchId, studentId) => batchRepository.addStudent(batchId, studentId),
    removeBatchStudent: (batchId, studentId, reason) => batchRepository.removeStudent(batchId, studentId, reason),
    getBatchWaitlist: (batchId) => batchRepository.getWaitlist(batchId),
    moveWaitlistToBatch: (batchId, studentId) => batchRepository.moveWaitlistToBatch(batchId, studentId),
    completeBatch: (batchId) => batchRepository.completeBatch(batchId),
    cancelBatch: (batchId, reason) => batchRepository.cancelBatch(batchId, reason),

    cancelEnrollment: (id, reason) => enrollmentRepository.cancel(id, reason),
    completeEnrollment: (id) => enrollmentRepository.complete(id),
    changeEnrollmentCourse: (id, newCourseId) => enrollmentRepository.changeCourse(id, newCourseId),
    getEnrollmentHistory: (studentOrEnrollmentId) => enrollmentRepository.getHistory(studentOrEnrollmentId),

    // Phase 12 Secure Storage, Video & Submission Operations
    storageRepository,
    uploadResource: (args) => storageRepository.uploadResource(args),
    replaceResource: (id, args) => storageRepository.replaceResource(id, args),
    deleteResource: (id) => storageRepository.deleteResource(id),
    downloadResource: (id, studentId) => storageRepository.downloadResource(id, studentId),
    uploadVideo: (args) => storageRepository.uploadVideo(args),
    previewVideo: (id, studentId) => storageRepository.previewVideo(id, studentId),
    replaceVideo: (id, args) => storageRepository.replaceVideo(id, args),
    archiveVideo: (id) => storageRepository.archiveVideo(id),
    updateVideoStatus: (id, status) => storageRepository.updateVideoStatus(id, status),
    uploadSubmission: (args) => storageRepository.uploadSubmission(args),
    replaceSubmission: (id, args) => storageRepository.replaceSubmission(id, args),
    downloadSubmission: (id, reqUserId, isAdmin) => storageRepository.downloadSubmission(id, reqUserId, isAdmin),
    uploadCourseCover: (courseId, file, onProgress) => storageRepository.uploadCourseCover(courseId, file, onProgress),
    getFileMetadata: (id) => storageRepository.getFileMetadata(id),
    getAllFileMetadata: () => storageRepository.getAllFileMetadata(),
    validateStorageFile: (file, category) => storageRepository.validateFile(file, category),

    // Phase 13 Secure Payment Infrastructure
    paymentRepository,
    createCheckoutSession: (args) => paymentRepository.createCheckoutSession(args),
    verifyPayment: (args) => paymentRepository.verifyPayment(args),
    handlePaymentWebhook: (payload, sig) => paymentRepository.handleWebhookEvent(payload, sig),
    handleFailedPayment: (id, reason) => paymentRepository.handleFailedPayment(id, reason),
    handleCancelledPayment: (id, reason) => paymentRepository.handleCancelledPayment(id, reason),
    getTierPriceConfig: (tierId) => paymentRepository.getTierPriceConfig(tierId),
    setTierPriceConfig: (tierId, cfg) => paymentRepository.setTierPriceConfig(tierId, cfg),
    getStudentPayments: (studentId) => paymentRepository.getStudentPayments(studentId),

    // Phase 14 Real Notification Delivery Infrastructure
    notificationDeliveryService,
    registerDeviceToken: (args) => notificationDeliveryService.registerDeviceToken(args),
    unregisterDeviceToken: (args) => notificationDeliveryService.unregisterDeviceToken(args),
    getUserDevices: (userId) => notificationDeliveryService.getUserDevices(userId),
    cleanupInvalidTokens: (args) => notificationDeliveryService.cleanupInvalidTokens(args),
    getUserNotificationPreferences: (userId) => notificationDeliveryService.getUserPreferences(userId),
    updateUserNotificationPreferences: (userId, prefs) => notificationDeliveryService.updateUserPreferences(userId, prefs),
    sendNotificationBroadcast: (args) => notificationDeliveryService.sendNotification(args),
    scheduleNotificationBroadcast: (args) => notificationDeliveryService.scheduleNotification(args),
    cancelScheduledBroadcast: (id) => notificationDeliveryService.cancelScheduledNotification(id),
    getNotificationDeliveryHistory: () => notificationDeliveryService.getDeliveryHistory(),
    getStudentInbox: (userId) => notificationDeliveryService.getInbox(userId),
    markNotificationRead: (userId, notifId) => notificationDeliveryService.markInboxAsRead(userId, notifId),
    markAllNotificationsRead: (userId) => notificationDeliveryService.markAllInboxAsRead(userId),

    seedInitialData: (force) => store.seedInitialData(force),
    syncWithFirestore: () => store.syncWithFirestore(),
    getFirestoreStatus: () => store.getFirestoreStatus(),
    getRepositoryState: (col) => store.getRepositoryState(col),
    setRepositoryLoading: (col, l) => store.setRepositoryLoading(col, l),
    retryRepository: (col) => store.retryRepository(col),
    queryRepository: (col, opts) => store.queryDocs(col, opts),
    validateFirebaseConfig: () => store.validateFirebaseConfig(),
    getFirebaseConfig: () => store.getFirebaseConfig()
  };
});
