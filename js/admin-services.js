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

  const STORAGE_KEY = 'nexvion_admin_production_data_v4';

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
      enrolledCount: 420,
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
      enrolledCount: 384,
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
      enrolledCount: 290,
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
      enrolledCount: 154,
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
      modulesCount: 4,
      classesCount: 12,
      lessonsCount: 24,
      projectsCount: 2,
      assignmentsCount: 4,
      totalEnrolled: 420,
      activeBatchesCount: 2,
      learningOutcomes: [
        'Understand foundational mechanics of LLMs, neural tokens, and transformers',
        'Master zero-shot, few-shot, and chain-of-thought prompt design',
        'Safely incorporate conversational and reasoning AI assistants into daily workflows',
        'Recognize hallucination patterns, bias vectors, and fundamental AI safety rules'
      ],
      certificateRequirements: {
        minAttendancePercent: 80,
        requiredProjects: 2,
        requiredAssignments: 4,
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
      modulesCount: 6,
      classesCount: 18,
      lessonsCount: 36,
      projectsCount: 4,
      assignmentsCount: 6,
      totalEnrolled: 384,
      activeBatchesCount: 2,
      learningOutcomes: [
        'Construct production-ready web interfaces with integrated AI capabilities',
        'Harness OpenAI, Claude, and local Ollama APIs with structured output schema',
        'Implement authentication, state management, and real-time streaming tokens',
        'Deploy intelligent applications to cloud edge platforms with telemetry'
      ],
      certificateRequirements: {
        minAttendancePercent: 85,
        requiredProjects: 4,
        requiredAssignments: 6,
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
      modulesCount: 8,
      classesCount: 24,
      lessonsCount: 48,
      projectsCount: 5,
      assignmentsCount: 8,
      totalEnrolled: 290,
      activeBatchesCount: 2,
      learningOutcomes: [
        'Engineer vector search pipelines with chunking, reranking, and semantic hygiene',
        'Build multi-agent task execution flows with deterministic error recoveries',
        'Orchestrate complex document processing and multimodal reasoning tasks',
        'Evaluate pipeline accuracy, token economics, and response latency targets'
      ],
      certificateRequirements: {
        minAttendancePercent: 85,
        requiredProjects: 5,
        requiredAssignments: 8,
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
      modulesCount: 10,
      classesCount: 30,
      lessonsCount: 60,
      projectsCount: 6,
      assignmentsCount: 10,
      totalEnrolled: 154,
      activeBatchesCount: 1,
      learningOutcomes: [
        'Design resilient, scalable multi-tenant AI systems with robust fault tolerance',
        'Execute domain-specific adapter fine-tuning and benchmark performance matrices',
        'Implement defense-in-depth security architectures against prompt injection and jailbreaks',
        'Build high-performance native inference bridges with SIMD/GPU optimization'
      ],
      certificateRequirements: {
        minAttendancePercent: 90,
        requiredProjects: 6,
        requiredAssignments: 10,
        passingGradePercent: 90
      },
      updatedAt: '2026-10-08T16:20:00Z'
    }
  ];

  // INVARIANT: Every batch capacity is strictly capped at 30.
  const defaultBatches = [
    {
      id: 'batch-fnd-01',
      name: 'Foundations Cohort Alpha',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      startDate: '2026-10-15',
      endDate: '2026-11-12',
      instructor: 'Dr. Evelyn Vance',
      capacity: 30, // MAX 30 ALWAYS
      enrolledCount: 18,
      waitlistCount: 0,
      status: 'OPEN', // OPEN | FULL | WAITLIST | UPCOMING | ACTIVE | COMPLETED | CANCELLED
      schedule: 'Tue & Thu • 18:00 - 19:30 UTC',
      roomPlaceholder: 'Virtual Nexus Hall A',
      notes: 'Introductory cohort. All instructional materials unlocked.'
    },
    {
      id: 'batch-fnd-02',
      name: 'Foundations Cohort Beta',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      startDate: '2026-11-01',
      endDate: '2026-11-28',
      instructor: 'Sarah Al-Mansoor',
      capacity: 30,
      enrolledCount: 30, // 30 = FULL
      waitlistCount: 8,
      status: 'FULL',
      schedule: 'Mon & Wed • 16:00 - 17:30 UTC',
      roomPlaceholder: 'Virtual Nexus Hall B',
      notes: 'Cohort reached 30-student capacity. Additional applicants on waitlist.'
    },
    {
      id: 'batch-bld-01',
      name: 'Builder Cohort Prime',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      startDate: '2026-10-20',
      endDate: '2026-12-15',
      instructor: 'Marcus Chen',
      capacity: 30,
      enrolledCount: 26,
      waitlistCount: 0,
      status: 'OPEN',
      schedule: 'Wed & Fri • 17:00 - 19:00 UTC',
      roomPlaceholder: 'Dev Studio 1',
      notes: '4 seats remaining. Cohort filling steadily.'
    },
    {
      id: 'batch-bld-02',
      name: 'Builder Cohort Apex',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      startDate: '2026-11-10',
      endDate: '2027-01-05',
      instructor: 'Marcus Chen',
      capacity: 30,
      enrolledCount: 30,
      waitlistCount: 14,
      status: 'FULL',
      schedule: 'Tue & Thu • 19:00 - 21:00 UTC',
      roomPlaceholder: 'Dev Studio 2',
      notes: 'Full capacity reached. Waitlist active.'
    },
    {
      id: 'batch-crt-01',
      name: 'Creator Cohort Delta',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      startDate: '2026-10-25',
      endDate: '2027-01-08',
      instructor: 'Elena Rostova',
      capacity: 30,
      enrolledCount: 30,
      waitlistCount: 19,
      status: 'WAITLIST',
      schedule: 'Mon & Thu • 18:30 - 20:30 UTC',
      roomPlaceholder: 'Autonomous Lab Beta',
      notes: 'Fully registered. Enrolled 30/30. Overflow applicants queued.'
    },
    {
      id: 'batch-crt-02',
      name: 'Creator Cohort Omega',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      startDate: '2026-12-01',
      endDate: '2027-02-15',
      instructor: 'David K. Osei',
      capacity: 30,
      enrolledCount: 12,
      waitlistCount: 0,
      status: 'UPCOMING',
      schedule: 'Sat & Sun • 14:00 - 16:00 UTC',
      roomPlaceholder: 'Autonomous Lab Alpha',
      notes: 'Winter cohort open for applicant registration.'
    },
    {
      id: 'batch-arc-01',
      name: 'Architect Cohort Sovereign',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      startDate: '2026-11-05',
      endDate: '2027-01-28',
      instructor: 'Dr. Kenneth Vance',
      capacity: 30,
      enrolledCount: 28,
      waitlistCount: 3,
      status: 'ACTIVE',
      schedule: 'Fri • 16:00 - 20:00 UTC (Executive Intensive)',
      roomPlaceholder: 'Executive Council Room',
      notes: 'Only 2 seats remaining. Screening requirements in progress.'
    },
    {
      id: 'batch-fnd-prev',
      name: 'Foundations Cohort Pioneer',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      instructor: 'Dr. Evelyn Vance',
      capacity: 30,
      enrolledCount: 30,
      waitlistCount: 0,
      status: 'COMPLETED',
      schedule: 'Tue & Thu • 18:00 - 19:30 UTC',
      roomPlaceholder: 'Virtual Nexus Hall A',
      notes: 'Completed alumni cohort. 28 students achieved certificates.'
    },
    {
      id: 'batch-bld-cancelled',
      name: 'Builder Experimental Cohort',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      instructor: 'Marcus Chen',
      capacity: 30,
      enrolledCount: 0,
      waitlistCount: 0,
      status: 'CANCELLED',
      schedule: 'Sun • 10:00 - 14:00 UTC',
      roomPlaceholder: 'Dev Studio 3',
      notes: 'Rescheduled into weekday evening slots by department request.'
    }
  ];

  const defaultStudents = [
    {
      id: 'stu-101',
      name: 'Zackary Thorne',
      email: 'z.thorne@synthetic.nexus',
      avatar: 'assets/avatars/zack.png',
      enrolledCourseId: 'ai-builder',
      enrolledCourseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      enrollmentStatus: 'Enrolled',
      studentStatus: 'Active',
      progressPercent: 72,
      attendancePercent: 91,
      paymentStatus: 'Paid',
      certificateStatus: 'Eligible',
      lastActive: '2026-10-08T19:42:00Z',
      joinDate: '2026-09-15',
      phone: '+1 (415) 890-2341',
      country: 'United States (San Francisco, CA)',
      timezone: 'UTC-7 (PDT)',
      bio: 'Full-stack software engineer developing autonomous agentic coding companions and streaming APIs.',
      experienceLevel: 'Intermediate',
      githubHandle: 'zthorne-dev',
      linkedinHandle: 'linkedin.com/in/zack-thorne',
      ipAddress: '198.51.100.42',
      userAgent: 'Chrome 129 / macOS Sequoia',
      internalNotes: 'Consistent high performer on LLM API project passes. Active in Discord office hours.',
      internalNotesList: [
        { id: 'not-101-1', author: 'Marcus Chen', role: 'Lead Instructor', timestamp: '2026-09-18T10:15:00Z', priority: 'Normal', text: 'Completed onboarding sprint ahead of schedule. Excellent code structure.' },
        { id: 'not-101-2', author: 'Academic Directorate', role: 'Super Admin', timestamp: '2026-10-05T16:20:00Z', priority: 'Medium', text: 'Passed Capstone Project 01 review with 92% evaluation score.' }
      ]
    },
    {
      id: 'stu-102',
      name: 'Amara Valen',
      email: 'amara.valen@domain.org',
      avatar: 'assets/avatars/amara.png',
      enrolledCourseId: 'ai-foundations',
      enrolledCourseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      enrollmentStatus: 'Enrolled',
      studentStatus: 'Active',
      progressPercent: 88,
      attendancePercent: 95,
      paymentStatus: 'Not required',
      certificateStatus: 'Pending approval',
      lastActive: '2026-10-08T21:10:00Z',
      joinDate: '2026-09-20',
      phone: '+44 20 7946 0912',
      country: 'United Kingdom (London)',
      timezone: 'UTC+1 (BST)',
      bio: 'Digital product manager transitioning to AI-native workflow design and prompt architecture.',
      experienceLevel: 'Beginner',
      githubHandle: 'amara-valen',
      linkedinHandle: 'linkedin.com/in/amara-valen',
      ipAddress: '82.165.197.1',
      userAgent: 'Safari 18 / macOS Sonoma',
      internalNotes: 'Completed all 4 modules. Final portfolio verification completed. Pending certificate sign-off.',
      internalNotesList: [
        { id: 'not-102-1', author: 'Dr. Evelyn Vance', role: 'Academic Director', timestamp: '2026-09-22T09:00:00Z', priority: 'Normal', text: 'Enrolled in open Foundations cohort. Prompt tuning exercises submitted.' },
        { id: 'not-102-2', author: 'Student Desk', role: 'Support Admin', timestamp: '2026-10-07T14:30:00Z', priority: 'High', text: 'Portfolio verification cleared. Ready for certificate issuance sign-off.' }
      ]
    },
    {
      id: 'stu-103',
      name: 'Julian Mercer',
      email: 'julian.m@matrix-sys.io',
      avatar: 'assets/avatars/julian.png',
      enrolledCourseId: 'ai-creator',
      enrolledCourseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      batchId: 'batch-crt-01',
      batchName: 'Creator Cohort Delta',
      enrollmentStatus: 'Waitlisted',
      studentStatus: 'Active',
      progressPercent: 0,
      attendancePercent: 0,
      paymentStatus: 'Pending',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-07T12:05:00Z',
      joinDate: '2026-10-02',
      phone: '+1 (650) 412-8921',
      country: 'United States (Palo Alto, CA)',
      timezone: 'UTC-7 (PDT)',
      bio: 'Systems engineer exploring multi-agent autonomous frameworks, vector search indices, and RAG pipelines.',
      experienceLevel: 'Intermediate',
      githubHandle: 'jmercer-sys',
      linkedinHandle: 'linkedin.com/in/julian-mercer',
      ipAddress: '172.56.21.89',
      userAgent: 'Edge 128 / Windows 11',
      internalNotes: 'Batch filled to 30. Waitlist position #1. Will auto-advance when a seat opens.',
      internalNotesList: [
        { id: 'not-103-1', author: 'Admissions Officer', role: 'Student Manager', timestamp: '2026-10-02T12:10:00Z', priority: 'Medium', text: 'Cohort Delta reached maximum 30 capacity. Assigned to Waitlist #1.' }
      ]
    },
    {
      id: 'stu-104',
      name: 'Devon K. Scott',
      email: 'd.scott@hyperion.tech',
      avatar: 'assets/avatars/devon.png',
      enrolledCourseId: 'ai-architect',
      enrolledCourseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      enrollmentStatus: 'Enrolled',
      studentStatus: 'Active',
      progressPercent: 64,
      attendancePercent: 88,
      paymentStatus: 'Paid',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-08T18:14:00Z',
      joinDate: '2026-09-01',
      phone: '+1 (206) 555-0199',
      country: 'United States (Seattle, WA)',
      timezone: 'UTC-7 (PDT)',
      bio: 'Staff Infrastructure Architect working on distributed GPU clusters and quantized local model serving.',
      experienceLevel: 'Advanced / Staff Engineer',
      githubHandle: 'dscott-arch',
      linkedinHandle: 'linkedin.com/in/devon-k-scott',
      ipAddress: '204.79.197.200',
      userAgent: 'Firefox 130 / Ubuntu Linux',
      internalNotes: 'Staff Architect at Hyperion. Working on SIMD runtime integration.',
      internalNotesList: [
        { id: 'not-104-1', author: 'Dr. Kenneth Vance', role: 'Chief AI Architect', timestamp: '2026-09-05T11:00:00Z', priority: 'Normal', text: 'Corporate sponsorship confirmed. High technical aptitude in model quantization.' }
      ]
    },
    {
      id: 'stu-105',
      name: 'Soraya Chen',
      email: 's.chen@quantum-ai.dev',
      avatar: 'assets/avatars/soraya.png',
      enrolledCourseId: 'ai-builder',
      enrolledCourseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      enrollmentStatus: 'Pending',
      studentStatus: 'Invited',
      progressPercent: 0,
      attendancePercent: 0,
      paymentStatus: 'Manual review',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-08T08:30:00Z',
      joinDate: '2026-10-07',
      phone: '+1 (617) 495-1000',
      country: 'United States (Boston, MA)',
      timezone: 'UTC-4 (EDT)',
      bio: 'Data analyst moving to generative software tools. Enterprise sponsored.',
      experienceLevel: 'Beginner',
      githubHandle: 'schen-quantum',
      linkedinHandle: 'linkedin.com/in/soraya-chen',
      ipAddress: '140.247.0.1',
      userAgent: 'Chrome 129 / macOS Sonoma',
      internalNotes: 'Awaiting tuition authorization from enterprise sponsor purchase order.',
      internalNotesList: [
        { id: 'not-105-1', author: 'Finance Desk', role: 'Finance Manager', timestamp: '2026-10-08T08:45:00Z', priority: 'Medium', text: 'Invoice INV-PO-0210 under verification with sponsor corporate accounts.' }
      ]
    },
    {
      id: 'stu-106',
      name: 'Rohan Mehra',
      email: 'rohan.mehra@neurovion.in',
      avatar: 'assets/avatars/rohan.png',
      enrolledCourseId: 'ai-foundations',
      enrolledCourseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      enrollmentStatus: 'Completed',
      studentStatus: 'Completed',
      progressPercent: 100,
      attendancePercent: 100,
      paymentStatus: 'Not required',
      certificateStatus: 'Issued',
      lastActive: '2026-10-05T14:22:00Z',
      joinDate: '2026-08-10',
      phone: '+91 98200 12345',
      country: 'India (Bengaluru)',
      timezone: 'UTC+5:30 (IST)',
      bio: 'Undergraduate AI researcher exploring attention mechanisms, neural tokenizers, and prompt pipelines.',
      experienceLevel: 'Beginner',
      githubHandle: 'rohan-neuro',
      linkedinHandle: 'linkedin.com/in/rohan-mehra',
      ipAddress: '103.21.244.0',
      userAgent: 'Firefox 130 / Windows 11',
      internalNotes: 'Successfully completed Foundations. Certificate #NEX-FND-2026-0042 issued.',
      internalNotesList: [
        { id: 'not-106-1', author: 'Evelyn Vance', role: 'Super Admin', timestamp: '2026-10-05T14:30:00Z', priority: 'Normal', text: '100% course requirements satisfied. Certificate credential issued.' }
      ]
    },
    {
      id: 'stu-107',
      name: 'Kassandra Lee',
      email: 'klee@vertex-labs.com',
      avatar: 'assets/avatars/kassandra.png',
      enrolledCourseId: 'ai-creator',
      enrolledCourseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      batchId: 'batch-crt-01',
      batchName: 'Creator Cohort Delta',
      enrollmentStatus: 'Enrolled',
      studentStatus: 'Active',
      progressPercent: 58,
      attendancePercent: 82,
      paymentStatus: 'Paid',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-08T15:00:00Z',
      joinDate: '2026-09-12',
      phone: '+1 (512) 345-6789',
      country: 'United States (Austin, TX)',
      timezone: 'UTC-5 (CDT)',
      bio: 'Backend software engineer designing autonomous code review and CI/CD triage agents.',
      experienceLevel: 'Intermediate',
      githubHandle: 'klee-vertex',
      linkedinHandle: 'linkedin.com/in/kassandra-lee',
      ipAddress: '66.249.66.1',
      userAgent: 'Chrome 129 / Linux x86_64',
      internalNotes: 'Building autonomous code review agent.',
      internalNotesList: [
        { id: 'not-107-1', author: 'Elena Rostova', role: 'Lead Instructor', timestamp: '2026-09-25T17:00:00Z', priority: 'Normal', text: 'Benchmarking reciprocal rank fusion in vector search pipeline.' }
      ]
    },
    {
      id: 'stu-108',
      name: 'Tobias Sterling',
      email: 't.sterling@arch-systems.net',
      avatar: 'assets/avatars/tobias.png',
      enrolledCourseId: 'ai-architect',
      enrolledCourseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      enrollmentStatus: 'Enrolled',
      studentStatus: 'Active',
      progressPercent: 92,
      attendancePercent: 96,
      paymentStatus: 'Paid',
      certificateStatus: 'Eligible',
      lastActive: '2026-10-08T22:02:00Z',
      joinDate: '2026-08-25',
      phone: '+49 30 2233 4455',
      country: 'Germany (Berlin)',
      timezone: 'UTC+2 (CEST)',
      bio: 'Principal Systems Architect specializing in SIMD compilation, low-latency kernels, and LoRA adapters.',
      experienceLevel: 'Advanced / Principal Architect',
      githubHandle: 'tsterling-arch',
      linkedinHandle: 'linkedin.com/in/tobias-sterling',
      ipAddress: '185.199.108.153',
      userAgent: 'Safari 18 / macOS Sonoma',
      internalNotes: 'Capstone thesis submitted. Ready for final evaluation.',
      internalNotesList: [
        { id: 'not-108-1', author: 'Dr. Kenneth Vance', role: 'Chief AI Architect', timestamp: '2026-10-08T18:00:00Z', priority: 'High', text: 'Thesis oral defense scored 96% distinction. Ready for certificate issuance.' }
      ]
    },
    {
      id: 'stu-109',
      name: 'Liam O\'Connor',
      email: 'liam.oc@celtic-data.ie',
      avatar: 'assets/avatars/liam.png',
      enrolledCourseId: 'ai-foundations',
      enrolledCourseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-02',
      batchName: 'Foundations Cohort Beta',
      enrollmentStatus: 'Waitlisted',
      studentStatus: 'Active',
      progressPercent: 0,
      attendancePercent: 0,
      paymentStatus: 'Not required',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-08T11:15:00Z',
      joinDate: '2026-10-06',
      phone: '+353 1 496 0123',
      country: 'Ireland (Dublin)',
      timezone: 'UTC+1 (IST)',
      bio: 'Technical writer interested in modern neural tools and conversational design.',
      experienceLevel: 'Beginner',
      githubHandle: 'liam-celtic',
      linkedinHandle: 'linkedin.com/in/liam-oconnor',
      ipAddress: '193.120.199.2',
      userAgent: 'Chrome 129 / Windows 11',
      internalNotes: 'Cohort Beta filled to 30. Placed in waitlist queue.',
      internalNotesList: [
        { id: 'not-109-1', author: 'Admissions Desk', role: 'Student Manager', timestamp: '2026-10-06T15:15:00Z', priority: 'Normal', text: 'Waitlisted due to 30/30 cohort capacity limit.' }
      ]
    },
    {
      id: 'stu-110',
      name: 'Maya Lin',
      email: 'mlin@pacific-stream.org',
      avatar: 'assets/avatars/maya.png',
      enrolledCourseId: 'ai-builder',
      enrolledCourseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-02',
      batchName: 'Builder Cohort Apex',
      enrollmentStatus: 'Approved',
      studentStatus: 'Invited',
      progressPercent: 0,
      attendancePercent: 0,
      paymentStatus: 'Paid',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-08T07:12:00Z',
      joinDate: '2026-10-08',
      phone: '+1 (604) 555-8911',
      country: 'Canada (Vancouver, BC)',
      timezone: 'UTC-7 (PDT)',
      bio: 'Frontend UI/UX developer learning streaming API connectors and client state synchronization.',
      experienceLevel: 'Intermediate',
      githubHandle: 'mayalin-ui',
      linkedinHandle: 'linkedin.com/in/maya-lin-dev',
      ipAddress: '142.103.1.1',
      userAgent: 'Safari 18 / macOS Sequoia',
      internalNotes: 'Seat approved. Ready for batch activation upon cohort launch date.',
      internalNotesList: [
        { id: 'not-110-1', author: 'Admissions Officer', role: 'Student Manager', timestamp: '2026-10-08T07:15:00Z', priority: 'Normal', text: 'Application approved. Assigned seat in Builder Cohort Apex.' }
      ]
    },
    {
      id: 'stu-111',
      name: 'Garrison Vance',
      email: 'g.vance@vanguard-ai.com',
      avatar: 'assets/avatars/garrison.png',
      enrolledCourseId: 'ai-architect',
      enrolledCourseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      enrollmentStatus: 'Rejected',
      studentStatus: 'Inactive',
      progressPercent: 0,
      attendancePercent: 0,
      paymentStatus: 'Pending',
      certificateStatus: 'Not eligible',
      lastActive: '2026-10-02T16:00:00Z',
      joinDate: '2026-09-28',
      phone: '+1 (312) 555-4321',
      country: 'United States (Chicago, IL)',
      timezone: 'UTC-5 (CDT)',
      bio: 'Applicant seeking direct entrance into executive Architect program.',
      experienceLevel: 'Beginner',
      githubHandle: 'gvance-ai',
      linkedinHandle: 'linkedin.com/in/garrison-vance',
      ipAddress: '12.180.20.1',
      userAgent: 'Edge 128 / Windows 11',
      internalNotes: 'Application rejected: Prerequisites not met for Level 4 Architect executive tier.',
      internalNotesList: [
        { id: 'not-111-1', author: 'Admissions Directorate', role: 'Super Admin', timestamp: '2026-10-02T16:15:00Z', priority: 'High', text: 'Applicant does not meet prerequisite coding & systems architecture requirements for Level 4 track.' }
      ]
    },
    {
      id: 'stu-112',
      name: 'Darius Thorne',
      email: 'darius.t@thorne-digital.com',
      avatar: 'assets/avatars/darius.png',
      enrolledCourseId: 'ai-builder',
      enrolledCourseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      enrollmentStatus: 'Cancelled',
      studentStatus: 'Inactive',
      progressPercent: 15,
      attendancePercent: 20,
      paymentStatus: 'Paid',
      certificateStatus: 'Not eligible',
      lastActive: '2026-09-18T10:00:00Z',
      joinDate: '2026-09-01',
      phone: '+1 (404) 555-7788',
      country: 'United States (Atlanta, GA)',
      timezone: 'UTC-4 (EDT)',
      bio: 'Digital enterprise consultant.',
      experienceLevel: 'Intermediate',
      githubHandle: 'darius-thorne',
      linkedinHandle: 'linkedin.com/in/darius-thorne',
      ipAddress: '131.247.1.1',
      userAgent: 'Chrome 128 / Windows 10',
      internalNotes: 'Student requested voluntary withdrawal due to personal schedule conflict. Registration cancelled.',
      internalNotesList: [
        { id: 'not-112-1', author: 'Student Desk', role: 'Support Admin', timestamp: '2026-09-18T10:30:00Z', priority: 'Normal', text: 'Voluntary withdrawal processed upon student written request.' }
      ]
    }
  ];

  const defaultEnrollments = [
    {
      id: 'enr-201',
      studentId: 'stu-105',
      studentName: 'Soraya Chen',
      email: 's.chen@quantum-ai.dev',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      status: 'Pending',
      submittedAt: '2026-10-08T08:30:00Z',
      decidedAt: null,
      paymentStatus: 'Manual review',
      notes: 'Requested company invoice billing. Corporate purchase order authorization in progress.'
    },
    {
      id: 'enr-202',
      studentId: 'stu-103',
      studentName: 'Julian Mercer',
      email: 'julian.m@matrix-sys.io',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      batchId: 'batch-crt-01',
      batchName: 'Creator Cohort Delta',
      status: 'Waitlisted',
      submittedAt: '2026-10-07T12:05:00Z',
      decidedAt: '2026-10-07T12:10:00Z',
      paymentStatus: 'Pending',
      notes: 'Cohort Delta filled to 30. Placed in waitlist queue position #1.'
    },
    {
      id: 'enr-203',
      studentId: 'stu-101',
      studentName: 'Zackary Thorne',
      email: 'z.thorne@synthetic.nexus',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      status: 'Enrolled',
      submittedAt: '2026-09-15T10:00:00Z',
      decidedAt: '2026-09-15T10:15:00Z',
      paymentStatus: 'Paid',
      notes: 'Full verification cleared. Cohort seat assigned.'
    },
    {
      id: 'enr-204',
      studentId: 'stu-102',
      studentName: 'Amara Valen',
      email: 'amara.valen@domain.org',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      status: 'Enrolled',
      submittedAt: '2026-09-20T11:20:00Z',
      decidedAt: '2026-09-20T11:25:00Z',
      paymentStatus: 'Not required',
      notes: 'Standard free access tier enrollment approved.'
    },
    {
      id: 'enr-205',
      studentId: 'stu-109',
      studentName: 'Liam O\'Connor',
      email: 'liam.oc@celtic-data.ie',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-02',
      batchName: 'Foundations Cohort Beta',
      status: 'Waitlisted',
      submittedAt: '2026-10-06T15:10:00Z',
      decidedAt: '2026-10-06T15:15:00Z',
      paymentStatus: 'Not required',
      notes: 'Batch Beta reached max 30 capacity. Placed in waitlist position #1.'
    },
    {
      id: 'enr-206',
      studentId: 'stu-110',
      studentName: 'Maya Lin',
      email: 'mlin@pacific-stream.org',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-02',
      batchName: 'Builder Cohort Apex',
      status: 'Approved',
      submittedAt: '2026-10-08T07:12:00Z',
      decidedAt: '2026-10-08T07:15:00Z',
      paymentStatus: 'Paid',
      notes: 'Seat approved by admissions committee. Ready for cohort activation upon batch start.'
    },
    {
      id: 'enr-207',
      studentId: 'stu-111',
      studentName: 'Garrison Vance',
      email: 'g.vance@vanguard-ai.com',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      status: 'Rejected',
      submittedAt: '2026-09-28T14:00:00Z',
      decidedAt: '2026-10-02T16:15:00Z',
      paymentStatus: 'Pending',
      rejectionReason: 'Prerequisite technical requirements not met for Level 04 Executive track.',
      notes: 'Advised applicant to enroll in Level 02 AI Builder or Level 03 Creator first.'
    },
    {
      id: 'enr-208',
      studentId: 'stu-112',
      studentName: 'Darius Thorne',
      email: 'darius.t@thorne-digital.com',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      status: 'Cancelled',
      submittedAt: '2026-09-01T09:00:00Z',
      decidedAt: '2026-09-18T10:30:00Z',
      paymentStatus: 'Paid',
      rejectionReason: 'Student requested voluntary cancellation due to personal relocation.',
      notes: 'Registration cancelled upon written request. Tuition credit reserved.'
    },
    {
      id: 'enr-209',
      studentId: 'stu-106',
      studentName: 'Rohan Mehra',
      email: 'rohan.mehra@neurovion.in',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      status: 'Completed',
      submittedAt: '2026-08-10T12:00:00Z',
      decidedAt: '2026-10-05T14:30:00Z',
      paymentStatus: 'Not required',
      notes: 'Course completed with High Distinction (98%). Certificate issued.'
    },
    {
      id: 'enr-210',
      studentId: 'stu-104',
      studentName: 'Devon K. Scott',
      email: 'd.scott@hyperion.tech',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      status: 'Enrolled',
      submittedAt: '2026-09-01T08:30:00Z',
      decidedAt: '2026-09-01T09:30:00Z',
      paymentStatus: 'Paid',
      notes: 'Corporate sponsorship verified. Seat confirmed.'
    },
    {
      id: 'enr-211',
      studentId: 'stu-107',
      studentName: 'Kassandra Lee',
      email: 'klee@vertex-labs.com',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      batchId: 'batch-crt-01',
      batchName: 'Creator Cohort Delta',
      status: 'Enrolled',
      submittedAt: '2026-09-12T11:00:00Z',
      decidedAt: '2026-09-12T11:30:00Z',
      paymentStatus: 'Paid',
      notes: 'Direct seat confirmed in Creator Cohort Delta.'
    },
    {
      id: 'enr-212',
      studentId: 'stu-108',
      studentName: 'Tobias Sterling',
      email: 't.sterling@arch-systems.net',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      batchId: 'batch-arc-01',
      batchName: 'Architect Cohort Sovereign',
      status: 'Enrolled',
      submittedAt: '2026-08-25T14:00:00Z',
      decidedAt: '2026-08-25T14:45:00Z',
      paymentStatus: 'Paid',
      notes: 'Executive verification cleared.'
    }
  ];

  const defaultClasses = [
    {
      id: 'cls-301',
      title: 'Class 01: Transformers, Tokens & Attention Mechanisms',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      moduleId: 'mod-fnd-01',
      moduleTitle: 'Module 01: Foundations & Architecture',
      instructor: 'Dr. Evelyn Vance',
      duration: '75 min',
      order: 1,
      videoStatus: 'Ready',
      resourcesCount: 3,
      completionRequirement: 'Watch video + Complete Quiz 01',
      visibility: 'Published',
      status: 'Published',
      scheduleDate: '2026-10-15 18:00 UTC'
    },
    {
      id: 'cls-302',
      title: 'Class 02: Advanced Prompt Framing & Chain-of-Thought',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      moduleId: 'mod-fnd-01',
      moduleTitle: 'Module 01: Foundations & Architecture',
      instructor: 'Dr. Evelyn Vance',
      duration: '80 min',
      order: 2,
      videoStatus: 'Ready',
      resourcesCount: 4,
      completionRequirement: 'Submit Prompt Exercise',
      visibility: 'Published',
      status: 'Published',
      scheduleDate: '2026-10-17 18:00 UTC'
    },
    {
      id: 'cls-303',
      title: 'Class 03: Constructing AI-Assisted Frontends with Streaming API',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      moduleId: 'mod-bld-01',
      moduleTitle: 'Module 01: Full-Stack AI Integration',
      instructor: 'Marcus Chen',
      duration: '90 min',
      order: 1,
      videoStatus: 'Ready',
      resourcesCount: 5,
      completionRequirement: 'Deploy Working SSE Streaming UI',
      visibility: 'Published',
      status: 'Published',
      scheduleDate: '2026-10-20 17:00 UTC'
    },
    {
      id: 'cls-304',
      title: 'Class 04: Structured JSON Schema & Function Calling in LLMs',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      moduleId: 'mod-bld-01',
      moduleTitle: 'Module 01: Full-Stack AI Integration',
      instructor: 'Marcus Chen',
      duration: '85 min',
      order: 2,
      videoStatus: 'Ready',
      resourcesCount: 2,
      completionRequirement: 'Pass Type-Safety Test Suite',
      visibility: 'Published',
      status: 'Published',
      scheduleDate: '2026-10-22 17:00 UTC'
    },
    {
      id: 'cls-305',
      title: 'Class 05: Vector Embeddings & Hybrid Search Pipelines',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      moduleId: 'mod-crt-01',
      moduleTitle: 'Module 01: Knowledge Retrieval & RAG',
      instructor: 'Elena Rostova',
      duration: '95 min',
      order: 1,
      videoStatus: 'Ready',
      resourcesCount: 6,
      completionRequirement: 'Benchmark Reciprocal Rank Fusion',
      visibility: 'Published',
      status: 'Published',
      scheduleDate: '2026-10-25 18:30 UTC'
    },
    {
      id: 'cls-306',
      title: 'Class 06: Enterprise LoRA Fine-Tuning & Model Evaluation',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      moduleId: 'mod-arc-01',
      moduleTitle: 'Module 01: Specialized Model Runtimes',
      instructor: 'Dr. Kenneth Vance',
      duration: '120 min',
      order: 1,
      videoStatus: 'Ready',
      resourcesCount: 4,
      completionRequirement: 'Submit Weight Delta Benchmark',
      visibility: 'Draft',
      status: 'Draft',
      scheduleDate: '2026-11-05 16:00 UTC'
    }
  ];

  const defaultModules = [
    {
      id: 'mod-fnd-01',
      title: 'Module 01: Foundations & Architecture',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      order: 1,
      classesCount: 3,
      description: 'Understanding LLM inner workings, tokenization, embeddings, and context window mechanics.',
      completionRequirement: '100% of classes completed',
      status: 'Published'
    },
    {
      id: 'mod-fnd-02',
      title: 'Module 02: Prompt Engineering Mastery',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations: Zero to AI Native',
      order: 2,
      classesCount: 3,
      description: 'Zero-shot, few-shot, system persona design, and recursive prompt chains.',
      completionRequirement: 'Submit Capstone Prompt Matrix',
      status: 'Published'
    },
    {
      id: 'mod-bld-01',
      title: 'Module 01: Full-Stack AI Integration',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      order: 1,
      classesCount: 4,
      description: 'Streaming token APIs, server-sent events, function calling and typed responses.',
      completionRequirement: 'Deploy streaming application',
      status: 'Published'
    },
    {
      id: 'mod-crt-01',
      title: 'Module 01: Knowledge Retrieval & RAG',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator: Autonomous Systems & Workflows',
      order: 1,
      classesCount: 4,
      description: 'Vector chunking, high-dimensional indexing, BM25 hybrid ranking, and guardrails.',
      completionRequirement: 'Pass retrieval precision benchmark',
      status: 'Published'
    },
    {
      id: 'mod-arc-01',
      title: 'Module 01: Specialized Model Runtimes',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      order: 1,
      classesCount: 5,
      description: 'Quantization (AWQ, GGUF), SIMD compilation, enterprise security firewalls.',
      completionRequirement: 'Complete runtime latency benchmark',
      status: 'Published'
    }
  ];

  const defaultLessons = [
    {
      id: 'lsn-401',
      title: 'Lesson 1.1: What Happens When an LLM Receives a Prompt',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      moduleId: 'mod-fnd-01',
      duration: '22 min',
      order: 1,
      instructor: 'Dr. Evelyn Vance',
      videoStatus: 'Ready',
      resources: ['tokenization-guide.pdf', 'tokenizer-tool-link'],
      completionRequirement: 'Watch to 90%',
      visibility: 'Published',
      status: 'Published'
    },
    {
      id: 'lsn-402',
      title: 'Lesson 1.2: Attention Weights & Next Token Probability',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      moduleId: 'mod-fnd-01',
      duration: '28 min',
      order: 2,
      instructor: 'Dr. Evelyn Vance',
      videoStatus: 'Ready',
      resources: ['attention-interactive.html'],
      completionRequirement: 'Watch to 90%',
      visibility: 'Published',
      status: 'Published'
    },
    {
      id: 'lsn-403',
      title: 'Lesson 2.1: Structuring Responses with JSON Schema Enforcement',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      moduleId: 'mod-bld-01',
      duration: '35 min',
      order: 1,
      instructor: 'Marcus Chen',
      videoStatus: 'Ready',
      resources: ['schema-validator.ts', 'openapi-spec.json'],
      completionRequirement: 'Run code sandbox',
      visibility: 'Published',
      status: 'Published'
    },
    {
      id: 'lsn-404',
      title: 'Lesson 2.2: Building an Infinite Context Chat Controller',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      moduleId: 'mod-bld-01',
      duration: '42 min',
      order: 2,
      instructor: 'Marcus Chen',
      videoStatus: 'Ready',
      resources: ['sliding-window-buffer.js'],
      completionRequirement: 'Submit repository link',
      visibility: 'Published',
      status: 'Published'
    }
  ];

  const defaultVideos = [
    {
      id: 'vid-501',
      title: 'Transformer Neural Mechanisms & Tokenization',
      courseTitle: 'AI Foundations',
      classTitle: 'Class 01: Transformers, Tokens & Attention',
      duration: '01:14:22',
      thumbnail: 'assets/video-thumb-01.jpg',
      status: 'Ready',
      resolution: '4K 2160p (HLS Adaptive)',
      bitrate: '8500 kbps',
      storagePlaceholder: 'gs://nexvion-media-archive/transcoded/v-501.m3u8',
      visibility: 'Published',
      uploadedAt: '2026-10-05T12:00:00Z'
    },
    {
      id: 'vid-502',
      title: 'Live Lab: Implementing Server-Sent Events with AI Streams',
      courseTitle: 'AI Builder',
      classTitle: 'Class 03: Constructing AI-Assisted Frontends',
      duration: '01:28:40',
      thumbnail: 'assets/video-thumb-02.jpg',
      status: 'Ready',
      resolution: '1080p 60fps',
      bitrate: '5200 kbps',
      storagePlaceholder: 'gs://nexvion-media-archive/transcoded/v-502.m3u8',
      visibility: 'Published',
      uploadedAt: '2026-10-06T14:15:00Z'
    },
    {
      id: 'vid-503',
      title: 'Architecting Hybrid Dense-Sparse Vector Search RAG',
      courseTitle: 'AI Creator',
      classTitle: 'Class 05: Vector Embeddings & Hybrid Search',
      duration: '01:35:10',
      thumbnail: 'assets/video-thumb-03.jpg',
      status: 'Ready',
      resolution: '1080p 60fps',
      bitrate: '4800 kbps',
      storagePlaceholder: 'gs://nexvion-raw-uploads/v-503-master.mp4',
      visibility: 'Published',
      uploadedAt: '2026-10-08T16:00:00Z'
    },
    {
      id: 'vid-504',
      title: 'Native SIMD Acceleration for AI Model Inferences',
      courseTitle: 'AI Architect',
      classTitle: 'Class 06: Specialized Model Runtimes',
      duration: '02:02:15',
      thumbnail: 'assets/video-thumb-04.jpg',
      status: 'Ready',
      resolution: '4K 2160p',
      bitrate: '7200 kbps',
      storagePlaceholder: 'gs://nexvion-staging/v-504.mp4',
      visibility: 'Draft',
      uploadedAt: '2026-10-08T20:00:00Z'
    }
  ];

  const defaultResources = [
    {
      id: 'res-601',
      title: 'NEXVION Prompt Engineering Reference Manual (2026)',
      type: 'PDF',
      courseTitle: 'AI Foundations',
      moduleTitle: 'Module 02: Prompt Engineering',
      filePlaceholder: 'docs/nexvion-prompt-manual-v2.pdf',
      size: '4.8 MB',
      visibility: 'Public',
      status: 'Active',
      downloadCount: 842
    },
    {
      id: 'res-602',
      title: 'Full-Stack Next.js + AI SDK Starter Repository',
      type: 'Template',
      courseTitle: 'AI Builder',
      moduleTitle: 'Module 01: Full-Stack AI Integration',
      filePlaceholder: 'github.com/nexvion-academy/ai-sdk-starter',
      size: 'Repository Starter',
      visibility: 'Public',
      status: 'Active',
      downloadCount: 615
    },
    {
      id: 'res-603',
      title: 'Production RAG Vector Chunking Benchmarking Notebook',
      type: 'Study material',
      courseTitle: 'AI Creator',
      moduleTitle: 'Module 01: Knowledge Retrieval & RAG',
      filePlaceholder: 'notebooks/rag-chunking-benchmarks.ipynb',
      size: '12.4 MB',
      visibility: 'Enrolled Only',
      status: 'Active',
      downloadCount: 390
    },
    {
      id: 'res-604',
      title: 'Enterprise System Prompts & Guardrails Library',
      type: 'Prompt library',
      courseTitle: 'AI Builder',
      moduleTitle: 'Module 02: System Prompts',
      filePlaceholder: 'prompts/enterprise-guardrails.json',
      size: '1.2 MB',
      visibility: 'Public',
      status: 'Active',
      downloadCount: 920
    },
    {
      id: 'res-605',
      title: 'SIMD Compiler Vectorization Cheatsheet',
      type: 'Document',
      courseTitle: 'AI Architect',
      moduleTitle: 'Module 01: Specialized Model Runtimes',
      filePlaceholder: 'cheatsheets/simd-neon-avx512.pdf',
      size: '2.1 MB',
      visibility: 'Enrolled Only',
      status: 'Active',
      downloadCount: 145
    }
  ];

  const defaultProjects = [
    {
      id: 'prj-701',
      title: 'Capstone: Intelligent Automated Research Assistant',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      moduleId: 'mod-bld-01',
      moduleTitle: 'Module 01: Full-Stack AI Integration',
      description: 'Build a multi-source research summarizer using streaming LLMs, web search extraction, and persistent note storage.',
      instructions: '1. Create UI with modern dark mode.\n2. Connect streaming response endpoints with resilient SSE reconnects.\n3. Implement source citations and automated hallucination verification.\n4. Deploy on serverless architecture.',
      dueDate: '2026-11-20',
      isRequired: true,
      submissionType: 'GitHub Repo + Deployed Live URL',
      rubric: 'Architecture & System Design (30%), UI/UX Experience (25%), Token Efficiency (25%), Error Handling & Recovery (20%)',
      status: 'Published',
      completionRequirement: 'Passing grade >= 80% with faculty evaluation'
    },
    {
      id: 'prj-702',
      title: 'Autonomous Multi-Agent Workflow Engine',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      moduleId: 'mod-crt-01',
      moduleTitle: 'Module 01: Knowledge Retrieval & RAG',
      description: 'Construct a supervisor-worker autonomous agent network that breaks down complex user objectives into atomic tasks.',
      instructions: '1. Define typed state contracts between agents.\n2. Implement loop safety limits and recursion guards.\n3. Add structured telemetry export and decision tree visualization.',
      dueDate: '2026-12-05',
      isRequired: true,
      submissionType: 'Code Archive + Video Demo Walkthrough',
      rubric: 'System Resilience & Guards (35%), Tool Calling Accuracy (35%), Observability & Logging (30%)',
      status: 'Published',
      completionRequirement: 'Passing grade >= 85%'
    },
    {
      id: 'prj-703',
      title: 'Foundations AI Workflow Portfolio',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      tierId: 'ai-foundations',
      tierName: 'AI Foundations',
      moduleId: 'mod-fnd-02',
      moduleTitle: 'Module 02: Prompt Engineering & Guardrails',
      description: 'Document 5 daily productivity automations built with state-of-the-art conversational and reasoning AI.',
      instructions: 'Submit a comprehensive PDF portfolio outlining prompt templates, few-shot examples, test inputs, and before/after time savings metrics.',
      dueDate: '2026-11-05',
      isRequired: true,
      submissionType: 'Portfolio Document (PDF)',
      rubric: 'Depth of prompt design & guardrails (50%), Practical utility & measurement (50%)',
      status: 'Published',
      completionRequirement: 'Required for graduation certificate'
    },
    {
      id: 'prj-704',
      title: 'Enterprise Microservice Tool-Calling Architecture',
      courseId: 'ai-architect',
      courseTitle: 'AI Architect',
      tierId: 'ai-architect',
      tierName: 'AI Architect',
      moduleId: 'mod-arc-01',
      moduleTitle: 'Module 01: Specialized Model Runtimes',
      description: 'Architect a secure, horizontally scalable function-calling microservice using OpenAPI schemas and strict input sanitation.',
      instructions: '1. Build stateless gateway.\n2. Implement cryptographic token verification.\n3. Enforce sub-50ms schema validation per dispatch.',
      dueDate: '2026-12-15',
      isRequired: true,
      submissionType: 'OpenAPI Specification + Docker Engine',
      rubric: 'Interface Contract (40%), Security Guardrails (30%), Execution Latency (30%)',
      status: 'Draft',
      completionRequirement: 'Minimum 90% score with faculty architecture defense'
    },
    {
      id: 'prj-705',
      title: 'Semantic Retrieval-Augmented Generation Benchmarking',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator',
      tierId: 'ai-creator',
      tierName: 'AI Creator',
      moduleId: 'mod-crt-02',
      moduleTitle: 'Module 02: Advanced Embeddings & Hybrid Search',
      description: 'Evaluate dense vs sparse vector search indices across custom technical documentation collections.',
      instructions: 'Provide benchmarking scripts, mean reciprocal rank (MRR) comparisons, and cost-per-query analysis.',
      dueDate: '2026-11-28',
      isRequired: false,
      submissionType: 'Jupyter Notebook + Benchmark Report',
      rubric: 'Test Coverage (40%), Analysis Rigor (40%), Documentation (20%)',
      status: 'Open',
      completionRequirement: 'Optional portfolio honors capstone'
    },
    {
      id: 'prj-706',
      title: 'High-Concurrency Realtime LLM Gateway',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      tierId: 'ai-builder',
      tierName: 'AI Builder',
      moduleId: 'mod-bld-02',
      moduleTitle: 'Module 02: Realtime Streaming & Sockets',
      description: 'Construct a multi-tenant gateway that routes streaming completions across multiple provider fallback pools.',
      instructions: '1. Handle provider outages automatically.\n2. Maintain consistent SSE framing for clients.\n3. Log token cost telemetry.',
      dueDate: '2026-10-30',
      isRequired: true,
      submissionType: 'Production TypeScript Codebase',
      rubric: 'Concurrency Limiters (35%), Telemetry Logging (35%), Resiliency (30%)',
      status: 'Closed',
      completionRequirement: 'Passing grade >= 80%'
    }
  ];

  const defaultAssignments = [
    {
      id: 'asg-801',
      title: 'Assignment 01: Multi-Turn System Persona Prompt Tuning',
      courseTitle: 'AI Foundations',
      courseId: 'ai-foundations',
      moduleId: 'mod-fnd-01',
      moduleTitle: 'Module 01: Neural Foundations & Architecture',
      instructions: 'Design a system persona that restricts conversational responses strictly to financial analysis syntax. Provide 5 test transcripts.',
      dueDate: '2026-10-18',
      submissionType: 'GitHub Repository',
      isRequired: true,
      reviewRequirements: 'Automated test suite pass & persona consistency under adversarial prompting',
      points: 100,
      totalSubmissions: 34,
      pendingReviews: 5,
      status: 'Open'
    },
    {
      id: 'asg-802',
      title: 'Assignment 02: Resilient Error Handling for Streamed LLM Responses',
      courseTitle: 'AI Builder',
      courseId: 'ai-builder',
      moduleId: 'mod-bld-01',
      moduleTitle: 'Module 01: Full-Stack AI Integration',
      instructions: 'Handle mid-stream disconnection, 429 rate limit errors with exponential backoff, and partial JSON reconstruction in TypeScript.',
      dueDate: '2026-10-24',
      submissionType: 'Code Gist / Repo',
      isRequired: true,
      reviewRequirements: '429 backoff handling & stream buffer recovery verified against mock rate-limited endpoint',
      points: 100,
      totalSubmissions: 28,
      pendingReviews: 6,
      status: 'Open'
    },
    {
      id: 'asg-803',
      title: 'Assignment 03: Vector Chunk Boundary Optimization Experiment',
      courseTitle: 'AI Creator',
      courseId: 'ai-creator',
      moduleId: 'mod-crt-01',
      moduleTitle: 'Module 01: Knowledge Retrieval & RAG',
      instructions: 'Compare recursive character splitter vs Markdown semantic splitter on a 100-page technical manual. Document chunk coherence.',
      dueDate: '2026-10-30',
      submissionType: 'Markdown + Benchmark JSON',
      isRequired: true,
      reviewRequirements: 'Side-by-side chunk split evaluation on sample corpus',
      points: 100,
      totalSubmissions: 21,
      pendingReviews: 4,
      status: 'Open'
    },
    {
      id: 'asg-804',
      title: 'Assignment 04: Structured JSON Schema Output Validation',
      courseTitle: 'AI Foundations',
      courseId: 'ai-foundations',
      moduleId: 'mod-fnd-02',
      moduleTitle: 'Module 02: Prompt Engineering & Guardrails',
      instructions: 'Construct a Zod or Pydantic validation schema that enforces strict JSON response payloads without hallucinated keys.',
      dueDate: '2026-11-02',
      submissionType: 'Schema File + Test Cases',
      isRequired: false,
      reviewRequirements: 'Strict schema adherence across 10 sample inputs',
      points: 100,
      totalSubmissions: 16,
      pendingReviews: 2,
      status: 'Draft'
    },
    {
      id: 'asg-805',
      title: 'Assignment 05: Token Budget & Latency Optimization Pipeline',
      courseTitle: 'AI Architect',
      courseId: 'ai-architect',
      moduleId: 'mod-arc-01',
      moduleTitle: 'Module 01: Specialized Model Runtimes',
      instructions: 'Implement context window sliding and token compression heuristics to minimize token budget across lengthy transcripts.',
      dueDate: '2026-11-12',
      submissionType: 'Performance Benchmark Suite',
      isRequired: true,
      reviewRequirements: 'Sub-200ms Time-To-First-Token in local test harness',
      points: 100,
      totalSubmissions: 12,
      pendingReviews: 1,
      status: 'Closed'
    },
    {
      id: 'asg-806',
      title: 'Assignment 06: Multi-Tool Function Calling Sandbox',
      courseTitle: 'AI Builder',
      courseId: 'ai-builder',
      moduleId: 'mod-bld-02',
      moduleTitle: 'Module 02: Realtime Streaming & Sockets',
      instructions: 'Implement a client application that accepts model function call requests, executes local sandbox calculations, and submits results.',
      dueDate: '2026-11-18',
      submissionType: 'Live API Endpoint',
      isRequired: true,
      reviewRequirements: 'Pass 5 sequential tool execution challenges',
      points: 100,
      totalSubmissions: 18,
      pendingReviews: 3,
      status: 'Published'
    }
  ];

  const defaultSubmissions = [
    {
      id: 'sub-901',
      type: 'Assignment',
      itemId: 'asg-801',
      itemTitle: 'Assignment 01: Multi-Turn System Persona Prompt Tuning',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      studentId: 'stu-101',
      studentName: 'Zackary Thorne',
      studentEmail: 'z.thorne@synthetic.nexus',
      studentAvatar: 'ZT',
      submittedAt: '2026-10-07T14:10:00Z',
      lastUpdated: '2026-10-07T14:10:00Z',
      submissionContent: 'https://github.com/zthorne/nexvion-persona-spec',
      submissionNotes: 'Implemented financial advisor persona with strict markdown tabular constraint. Ran 5 sample scenarios.',
      status: 'Pending review',
      score: null,
      feedback: '',
      internalReviewerNote: 'Initial submission queue. Awaiting evaluation by Foundations grading team.',
      reviewer: 'Unassigned'
    },
    {
      id: 'sub-902',
      type: 'Assignment',
      itemId: 'asg-802',
      itemTitle: 'Assignment 02: Resilient Error Handling for Streamed LLM Responses',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      studentId: 'stu-104',
      studentName: 'Devon K. Scott',
      studentEmail: 'd.scott@synthetic.nexus',
      studentAvatar: 'DS',
      submittedAt: '2026-10-06T18:22:00Z',
      lastUpdated: '2026-10-07T10:15:00Z',
      submissionContent: 'https://gist.github.com/dscott/resilient-stream-engine.ts',
      submissionNotes: 'Includes retry wrapper with jittered exponential backoff and unit test coverage.',
      status: 'Reviewed',
      score: 96,
      feedback: 'Flawless exponential backoff and buffer recovery implementation. Exception handling meets production standard.',
      internalReviewerNote: 'Strong technical execution. Candidate for cohort peer mentor.',
      reviewer: 'Marcus Chen'
    },
    {
      id: 'sub-903',
      type: 'Assignment',
      itemId: 'asg-801',
      itemTitle: 'Assignment 01: Multi-Turn System Persona Prompt Tuning',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      studentId: 'stu-102',
      studentName: 'Amara Valen',
      studentEmail: 'a.valen@synthetic.nexus',
      studentAvatar: 'AV',
      submittedAt: '2026-10-07T19:40:00Z',
      lastUpdated: '2026-10-07T19:40:00Z',
      submissionContent: 'https://github.com/amara-valen/prompt-persona-suite',
      submissionNotes: 'Includes 8 test dialogues testing boundary conditions and guardrails.',
      status: 'Pending review',
      score: null,
      feedback: '',
      internalReviewerNote: 'Queued for review.',
      reviewer: 'Unassigned'
    },
    {
      id: 'sub-904',
      type: 'Project',
      itemId: 'prj-701',
      itemTitle: 'Capstone: Intelligent Automated Research Assistant',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      studentId: 'stu-103',
      studentName: 'Elena Rostova',
      studentEmail: 'e.rostova@synthetic.nexus',
      studentAvatar: 'ER',
      submittedAt: '2026-10-08T09:15:00Z',
      lastUpdated: '2026-10-08T14:30:00Z',
      submissionContent: 'https://github.com/erostova/ai-research-agent-v1',
      submissionNotes: 'Live demo running at https://research-agent-demo.app with OpenAI streaming proxy.',
      status: 'Returned for revision',
      score: 64,
      feedback: 'Streaming UI is visually polished, but citation grounding check failed on 2 evaluation tests. Please revise the hallucination filter and resubmit.',
      internalReviewerNote: 'Student needs guidance on prompt guardrails before approving completion. Returned for minor revision.',
      reviewer: 'Dr. Evelyn Vance'
    },
    {
      id: 'sub-905',
      type: 'Project',
      itemId: 'prj-702',
      itemTitle: 'Autonomous Multi-Agent Workflow Engine',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator',
      batchId: 'batch-crt-01',
      batchName: 'Creator Cohort Delta',
      studentId: 'stu-105',
      studentName: 'Tariq Mansoor',
      studentEmail: 't.mansoor@synthetic.nexus',
      studentAvatar: 'TM',
      submittedAt: '2026-10-07T11:50:00Z',
      lastUpdated: '2026-10-08T11:20:00Z',
      submissionContent: 'https://github.com/tmansoor/agent-orchestrator-core',
      submissionNotes: 'Includes 10-minute Loom walkthrough explaining graph loop boundaries.',
      status: 'Reviewed',
      score: 94,
      feedback: 'Superb supervisor-worker architecture with clean loop-prevention boundaries and typed state contracts.',
      internalReviewerNote: 'Approved capstone milestone completion. Recommended for showcase gallery.',
      reviewer: 'Dr. Evelyn Vance'
    },
    {
      id: 'sub-906',
      type: 'Assignment',
      itemId: 'asg-803',
      itemTitle: 'Assignment 03: Vector Chunk Boundary Optimization Experiment',
      courseId: 'ai-creator',
      courseTitle: 'AI Creator',
      batchId: 'batch-crt-02',
      batchName: 'Creator Cohort Omega',
      studentId: 'stu-106',
      studentName: 'Priya Sharma',
      studentEmail: 'p.sharma@synthetic.nexus',
      studentAvatar: 'PS',
      submittedAt: '2026-10-08T16:30:00Z',
      lastUpdated: '2026-10-08T16:30:00Z',
      submissionContent: 'https://github.com/psharma/vector-chunking-experiments',
      submissionNotes: 'Ran comparative recall analysis across 5 chunk overlap configurations.',
      status: 'Pending review',
      score: null,
      feedback: '',
      internalReviewerNote: 'Requires technical review of Jupyter notebook data.',
      reviewer: 'Marcus Chen'
    },
    {
      id: 'sub-907',
      type: 'Project',
      itemId: 'prj-703',
      itemTitle: 'Foundations AI Workflow Portfolio',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      batchId: 'batch-fnd-01',
      batchName: 'Foundations Cohort Alpha',
      studentId: 'stu-107',
      studentName: 'Lucas Vance',
      studentEmail: 'l.vance@synthetic.nexus',
      studentAvatar: 'LV',
      submittedAt: '2026-10-05T13:00:00Z',
      lastUpdated: '2026-10-06T09:30:00Z',
      submissionContent: 'https://storage.nexvion.ai/portfolios/lucas-vance-fnd.pdf',
      submissionNotes: 'Comprehensive 18-page summary of personal productivity systems with AI.',
      status: 'Reviewed',
      score: 90,
      feedback: 'High quality prompt documentation and demonstrable daily time savings across 5 productivity workflows.',
      internalReviewerNote: 'Fulfills certificate eligibility requirement.',
      reviewer: 'Academic Desk'
    },
    {
      id: 'sub-908',
      type: 'Assignment',
      itemId: 'asg-802',
      itemTitle: 'Assignment 02: Resilient Error Handling for Streamed LLM Responses',
      courseId: 'ai-builder',
      courseTitle: 'AI Builder',
      batchId: 'batch-bld-01',
      batchName: 'Builder Cohort Prime',
      studentId: 'stu-108',
      studentName: 'Maya Lin',
      studentEmail: 'm.lin@synthetic.nexus',
      studentAvatar: 'ML',
      submittedAt: '2026-10-08T18:12:00Z',
      lastUpdated: '2026-10-08T18:12:00Z',
      submissionContent: 'https://github.com/mayalin/sse-stream-client',
      submissionNotes: 'Added reconnect visual indicator and automatic token refresh.',
      status: 'Pending review',
      score: null,
      feedback: '',
      internalReviewerNote: 'Newly submitted.',
      reviewer: 'Unassigned'
    },
    {
      id: 'sub-909',
      type: 'Assignment',
      itemId: 'asg-801',
      itemTitle: 'Assignment 01: Multi-Turn System Persona Prompt Tuning',
      courseId: 'ai-foundations',
      courseTitle: 'AI Foundations',
      batchId: 'batch-fnd-02',
      batchName: 'Foundations Cohort Beta',
      studentId: 'stu-109',
      studentName: 'Carlos Mendez',
      studentEmail: 'c.mendez@synthetic.nexus',
      studentAvatar: 'CM',
      submittedAt: '2026-10-06T15:45:00Z',
      lastUpdated: '2026-10-07T12:00:00Z',
      submissionContent: 'https://github.com/cmendez/persona-tuning',
      submissionNotes: 'Created legal assistant persona prompt.',
      status: 'Returned for revision',
      score: 58,
      feedback: 'System persona frequently breaks character on adversarial test inputs. Please review Section 3 instructions and update system directives.',
      internalReviewerNote: 'First submission flagged for weak prompt boundaries.',
      reviewer: 'Marcus Chen'
    }
  ];

  const defaultAnnouncements = [
    {
      id: 'anc-001',
      title: 'Welcome to the 2026 Cohorts at NEXVION AI',
      message: 'All students enrolled in Foundations, Builder, and Creator cohorts should verify access to their instructional links and calendar schedules.',
      richContent: '### Welcome to the Frontier of Autonomous AI Engineering\n\nWe are thrilled to welcome all newly enrolled candidates to the **Q4 2026 Cohort Series**.\n\n#### Key Onboarding Checklist:\n1. Verify your GPU cluster workstation credentials.\n2. Complete Module 01 orientation before the live synchronous kickoff.\n3. Join your designated Discord and Slack private cohort channels.\n\n> "The best way to predict the future is to synthesize it." — NEXVION Faculty',
      audience: 'All Students',
      targetId: 'all',
      targetName: 'Global Platform',
      targetCourseId: '',
      targetTierId: '',
      targetBatchId: '',
      priority: 'High',
      status: 'Published',
      publishedAt: '2026-10-01T10:00:00Z',
      scheduledFor: null,
      author: 'Dr. Evelyn Vance (Academic Director)',
      estimatedRecipients: 1248
    },
    {
      id: 'anc-002',
      title: 'Batch 01 Builder Cohort: Scheduled Architecture Office Hours',
      message: 'Marcus Chen will host an open debugging session on Thursday at 19:00 UTC covering streaming API connections and client reconnects.',
      richContent: '### Architecture Deep Dive: HLS Video & Event Streaming\n\nInstructor **Marcus Chen** will conduct live office hours this Thursday at **19:00 UTC**.\n\n- **Topic:** Resilient SSE connections, token refreshing, and backoff jitter.\n- **Prerequisites:** Review Lesson 03 code repos before attending.\n- **Link:** Virtual Nexus Hall B',
      audience: 'Specific Batch',
      targetId: 'batch-bld-01',
      targetName: 'Builder Cohort Prime',
      targetCourseId: 'course-ai-builder',
      targetTierId: 'tier-builder',
      targetBatchId: 'batch-bld-01',
      priority: 'Normal',
      status: 'Published',
      publishedAt: '2026-10-06T16:00:00Z',
      scheduledFor: null,
      author: 'Marcus Chen (Lead Instructor)',
      estimatedRecipients: 26
    },
    {
      id: 'anc-003',
      title: 'Upcoming Scheduled Maintenance: Video Encoding Pipeline',
      message: 'Video player transcoder updates will run on Sunday 02:00 UTC for 30 minutes. Stream playback may experience momentary pauses.',
      richContent: '### Infrastructure Maintenance Advisory\n\nThe central transcoding cluster will undergo kernel patching on **Sunday at 02:00 UTC**.\n\n- Expected downtime: Under 15 minutes.\n- CDN-cached playback will remain accessible without degradation.\n- Live stream broadcasts will be disabled during this interval.',
      audience: 'All Students',
      targetId: 'all',
      targetName: 'Global Platform',
      targetCourseId: '',
      targetTierId: '',
      targetBatchId: '',
      priority: 'Urgent',
      status: 'Scheduled',
      publishedAt: null,
      scheduledFor: '2026-10-12T02:00:00Z',
      author: 'System Operations Team',
      estimatedRecipients: 1248
    },
    {
      id: 'anc-004',
      title: 'Draft: AI Creator Advanced Multi-Agent Framework Guidelines',
      message: 'Preliminary draft for upcoming guidelines on multi-agent consensus protocols and LangGraph orchestration.',
      richContent: '### Draft Specification: Autonomous Multi-Agent Workflows\n\n*Review pending by Academic Board.*\n\nThis guide establishes grading rubric benchmarks for agents with multi-turn reflective verification loops.',
      audience: 'Specific Course',
      targetId: 'course-ai-creator',
      targetName: 'Autonomous Agent Engineering',
      targetCourseId: 'course-ai-creator',
      targetTierId: 'tier-creator',
      targetBatchId: '',
      priority: 'Normal',
      status: 'Draft',
      publishedAt: null,
      scheduledFor: null,
      author: 'DevOps & Curriculum Board',
      estimatedRecipients: 290
    },
    {
      id: 'anc-005',
      title: 'Archived: Q3 2026 Summer Capstone Showcase Submissions Closed',
      message: 'The submission window for the Q3 Capstone Showcase has concluded. All finalists have been contacted.',
      richContent: '### Q3 Capstone Archive\n\nSubmissions are now closed. Archive preserved for historical reference and graduation audit compliance.',
      audience: 'All Students',
      targetId: 'all',
      targetName: 'Global Platform',
      targetCourseId: '',
      targetTierId: '',
      targetBatchId: '',
      priority: 'Low',
      status: 'Archived',
      publishedAt: '2026-08-30T18:00:00Z',
      scheduledFor: null,
      author: 'Academic Registrar',
      estimatedRecipients: 1120
    }
  ];

  const defaultNotifications = [
    {
      id: 'notif-101',
      title: 'Live Class Starting in 30 Minutes',
      message: 'Class 01: Transformers, Tokens & Attention Mechanisms starts at 18:00 UTC in Virtual Nexus Hall A.',
      type: 'Class reminder',
      audience: 'Batch 01 Foundations',
      course: 'AI Foundations',
      courseId: 'course-ai-foundations',
      tier: 'AI Foundations',
      tierId: 'tier-foundations',
      batch: 'Foundations Cohort Alpha',
      batchId: 'batch-fnd-01',
      channels: ['In-App', 'Push Notification'],
      deliveryStatus: 'Sent',
      status: 'Sent',
      sentBy: 'Marcus Chen',
      date: '2026-10-08T17:30:00Z',
      sentAt: '2026-10-08T17:30:00Z',
      recipientCount: 28,
      scheduledFor: null
    },
    {
      id: 'notif-102',
      title: 'Capstone Project 01 Instructions Published',
      message: 'Specifications for the Intelligent Automated Research Assistant have been released in Module 01.',
      type: 'Project reminder',
      audience: 'AI Builder Cohort',
      course: 'AI Builder',
      courseId: 'course-ai-builder',
      tier: 'AI Builder',
      tierId: 'tier-builder',
      batch: 'Builder Cohort Prime',
      batchId: 'batch-bld-01',
      channels: ['In-App', 'Email Digest'],
      deliveryStatus: 'Sent',
      status: 'Sent',
      sentBy: 'Elena Rostova',
      date: '2026-10-07T14:00:00Z',
      sentAt: '2026-10-07T14:00:00Z',
      recipientCount: 26,
      scheduledFor: null
    },
    {
      id: 'notif-103',
      title: 'Certificate Eligibility Verified',
      message: 'Congratulations Rohan Mehra! Your course completion criteria have been fully verified.',
      type: 'Certificate update',
      audience: 'Individual Student',
      course: 'AI Foundations',
      courseId: 'course-ai-foundations',
      tier: 'AI Foundations',
      tierId: 'tier-foundations',
      batch: 'Foundations Cohort Alpha',
      batchId: 'batch-fnd-01',
      channels: ['In-App', 'Push Notification', 'Email Digest'],
      deliveryStatus: 'Sent',
      status: 'Sent',
      sentBy: 'Academic Registrar',
      date: '2026-10-05T14:30:00Z',
      sentAt: '2026-10-05T14:30:00Z',
      recipientCount: 1,
      scheduledFor: null
    },
    {
      id: 'notif-104',
      title: 'New Class Scheduled: Advanced Prompt Engineering',
      message: 'A bonus guest masterclass by Dr. Vance has been added to the syllabus for tomorrow at 16:00 UTC.',
      type: 'New class',
      audience: 'All Enrolled Students',
      course: 'All Courses',
      courseId: '',
      tier: 'All Tiers',
      tierId: '',
      batch: 'All Batches',
      batchId: '',
      channels: ['In-App', 'Push Notification'],
      deliveryStatus: 'Queued',
      status: 'Queued',
      sentBy: 'Super Admin',
      date: '2026-10-09T08:00:00Z',
      sentAt: null,
      recipientCount: 1248,
      scheduledFor: '2026-10-09T12:00:00Z'
    },
    {
      id: 'notif-105',
      title: 'Enrollment Window Extension for Batch 02',
      message: 'Late registration seats have been authorized for candidate review until end of week.',
      type: 'Enrollment update',
      audience: 'Specific Course',
      course: 'Autonomous Agent Engineering',
      courseId: 'course-ai-creator',
      tier: 'AI Creator',
      tierId: 'tier-creator',
      batch: 'All Batches',
      batchId: '',
      channels: ['In-App', 'Email Digest'],
      deliveryStatus: 'Scheduled',
      status: 'Scheduled',
      sentBy: 'Admissions Officer',
      date: '2026-10-09T09:00:00Z',
      sentAt: null,
      recipientCount: 290,
      scheduledFor: '2026-10-10T09:00:00Z'
    },
    {
      id: 'notif-106',
      title: 'Infrastructure Maintenance Advisory',
      message: 'Platform GPU compute will undergo an emergency kernel patch tonight from 03:00 to 03:15 UTC.',
      type: 'System message',
      audience: 'All Enrolled Students',
      course: 'All Courses',
      courseId: '',
      tier: 'All Tiers',
      tierId: '',
      batch: 'All Batches',
      batchId: '',
      channels: ['In-App', 'Push Notification', 'SMS Urgent'],
      deliveryStatus: 'Failed',
      status: 'Failed',
      sentBy: 'System Operations Daemon',
      date: '2026-10-04T03:00:00Z',
      sentAt: '2026-10-04T03:00:00Z',
      recipientCount: 1248,
      scheduledFor: null
    },
    {
      id: 'notif-107',
      title: 'Draft: End of Term Satisfaction Survey',
      message: 'Please complete your cohort feedback before final project evaluation submissions.',
      type: 'Announcement',
      audience: 'All Enrolled Students',
      course: 'All Courses',
      courseId: '',
      tier: 'All Tiers',
      tierId: '',
      batch: 'All Batches',
      batchId: '',
      channels: ['In-App'],
      deliveryStatus: 'Draft',
      status: 'Draft',
      sentBy: 'Super Admin',
      date: '2026-10-09T10:15:00Z',
      sentAt: null,
      recipientCount: 1248,
      scheduledFor: null
    },
    {
      id: 'notif-108',
      title: 'Cancelled Class Broadcast: Monday Review Session',
      message: 'Monday morning review has been combined into Wednesday main laboratory.',
      type: 'Class reminder',
      audience: 'Batch 01 Foundations',
      course: 'AI Foundations',
      courseId: 'course-ai-foundations',
      tier: 'AI Foundations',
      tierId: 'tier-foundations',
      batch: 'Foundations Cohort Alpha',
      batchId: 'batch-fnd-01',
      channels: ['In-App', 'Push Notification'],
      deliveryStatus: 'Cancelled',
      status: 'Cancelled',
      sentBy: 'Marcus Chen',
      date: '2026-10-03T11:00:00Z',
      sentAt: null,
      recipientCount: 28,
      scheduledFor: '2026-10-05T09:00:00Z'
    }
  ];

  const defaultPayments = [
    {
      id: 'pay-7001',
      transactionRef: 'NEX-TX-2026-8812',
      studentName: 'Zackary Thorne',
      studentEmail: 'z.thorne@synthetic.nexus',
      studentId: 'stu-101',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      courseId: 'course-ai-builder',
      tierName: 'AI Builder',
      tierId: 'tier-builder',
      batchName: 'Builder Cohort Prime',
      batchId: 'batch-prime-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Paid',
      date: '2026-09-15 10:15 UTC',
      method: 'Direct Credit Transfer',
      invoiceId: 'INV-2026-0412',
      refundStatus: 'None',
      notes: 'Tuition cleared via direct enterprise transfer. Student fully unlocked.'
    },
    {
      id: 'pay-7002',
      transactionRef: 'NEX-TX-2026-8813',
      studentName: 'Amara Valen',
      studentEmail: 'amara.valen@domain.org',
      studentId: 'stu-102',
      courseTitle: 'AI Foundations: Zero to AI Native',
      courseId: 'course-ai-foundations',
      tierName: 'AI Foundations',
      tierId: 'tier-foundations',
      batchName: 'Foundations Cohort Alpha',
      batchId: 'batch-alpha-2026',
      amountDisplay: 'FREE',
      status: 'Not required',
      date: '2026-09-20 11:20 UTC',
      method: 'Free Public Tier Registration',
      invoiceId: 'INV-FREE-0104',
      refundStatus: 'Not applicable',
      notes: 'Community open enrollment scholarship grant. No payment collected.'
    },
    {
      id: 'pay-7003',
      transactionRef: 'NEX-TX-2026-8814',
      studentName: 'Julian Mercer',
      studentEmail: 'julian.m@matrix-sys.io',
      studentId: 'stu-103',
      courseTitle: 'AI Creator: Generative Content & Workflow Automation',
      courseId: 'course-ai-creator',
      tierName: 'AI Creator',
      tierId: 'tier-creator',
      batchName: 'Creator Cohort Delta',
      batchId: 'batch-delta-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Pending',
      date: '2026-10-07 12:05 UTC',
      method: 'Waitlist Reserved Seat',
      invoiceId: 'INV-PEND-0922',
      refundStatus: 'None',
      notes: 'Seat reserved. Payment processing will be connected during backend integration.'
    },
    {
      id: 'pay-7004',
      transactionRef: 'NEX-TX-2026-8815',
      studentName: 'Devon K. Scott',
      studentEmail: 'd.scott@hyperion.tech',
      studentId: 'stu-104',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Paid',
      date: '2026-09-01 09:30 UTC',
      method: 'Corporate Sponsorship Wire',
      invoiceId: 'INV-2026-0089',
      refundStatus: 'None',
      notes: 'Corporate sponsorship wire verified by Bursar Office.'
    },
    {
      id: 'pay-7005',
      transactionRef: 'NEX-TX-2026-8816',
      studentName: 'Soraya Chen',
      studentEmail: 's.chen@quantum-ai.dev',
      studentId: 'stu-105',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      courseId: 'course-ai-builder',
      tierName: 'AI Builder',
      tierId: 'tier-builder',
      batchName: 'Builder Cohort Prime',
      batchId: 'batch-prime-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Manual review',
      date: '2026-10-08 08:30 UTC',
      method: 'Enterprise Purchase Order Verification',
      invoiceId: 'INV-PO-0210',
      refundStatus: 'None',
      notes: 'PO matching flag: Corporate VAT registration number requires manual verification by Finance.'
    },
    {
      id: 'pay-7006',
      transactionRef: 'NEX-TX-2026-8817',
      studentName: 'Marcus Sterling',
      studentEmail: 'm.sterling@orbital.dev',
      studentId: 'stu-109',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Failed',
      date: '2026-10-06 14:22 UTC',
      method: 'Simulated Card Gateway',
      invoiceId: 'INV-FAIL-0033',
      refundStatus: 'None',
      notes: 'Transaction declined by card network: simulated 3D Secure timeout. Payment processing will be connected during backend integration.'
    },
    {
      id: 'pay-7007',
      transactionRef: 'NEX-TX-2026-8818',
      studentName: 'Elena Rostova',
      studentEmail: 'elena.rostova@helios-labs.io',
      studentId: 'stu-107',
      courseTitle: 'AI Creator: Generative Content & Workflow Automation',
      courseId: 'course-ai-creator',
      tierName: 'AI Creator',
      tierId: 'tier-creator',
      batchName: 'Creator Cohort Delta',
      batchId: 'batch-delta-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Refunded',
      date: '2026-09-28 16:45 UTC',
      method: 'Wire Reversal',
      invoiceId: 'INV-2026-0377',
      refundStatus: 'Processed',
      notes: 'Full tuition refund approved following cohort schedule conflict prior to commencement.'
    },
    {
      id: 'pay-7008',
      transactionRef: 'NEX-TX-2026-8819',
      studentName: 'Rohan Mehra',
      studentEmail: 'rohan.mehra@ai-craft.in',
      studentId: 'stu-106',
      courseTitle: 'AI Foundations: Zero to AI Native',
      courseId: 'course-ai-foundations',
      tierName: 'AI Foundations',
      tierId: 'tier-foundations',
      batchName: 'Foundations Cohort Alpha',
      batchId: 'batch-alpha-2026',
      amountDisplay: 'FREE',
      status: 'Not required',
      date: '2026-09-18 08:10 UTC',
      method: 'Free Public Tier Registration',
      invoiceId: 'INV-FREE-0105',
      refundStatus: 'Not applicable',
      notes: 'Gratis Tier Level 01 registration.'
    },
    {
      id: 'pay-7009',
      transactionRef: 'NEX-TX-2026-8820',
      studentName: 'Tobias Sterling',
      studentEmail: 't.sterling@synthetics.io',
      studentId: 'stu-108',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Paid',
      date: '2026-09-02 11:15 UTC',
      method: 'Direct Credit Transfer',
      invoiceId: 'INV-2026-0094',
      refundStatus: 'None',
      notes: 'Tier 04 enterprise tuition confirmed. Receipt issued.'
    },
    {
      id: 'pay-7010',
      transactionRef: 'NEX-TX-2026-8821',
      studentName: 'Kaelen Voss',
      studentEmail: 'kaelen.voss@nexus-edge.com',
      studentId: 'stu-110',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      courseId: 'course-ai-builder',
      tierName: 'AI Builder',
      tierId: 'tier-builder',
      batchName: 'Builder Cohort Prime',
      batchId: 'batch-prime-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Pending',
      date: '2026-10-08 17:00 UTC',
      method: 'SEPA Direct Debit',
      invoiceId: 'INV-PEND-0925',
      refundStatus: 'None',
      notes: 'SEPA Direct Debit clearing window active. Payment processing will be connected during backend integration.'
    },
    {
      id: 'pay-7011',
      transactionRef: 'NEX-TX-2026-8822',
      studentName: 'Maya Lin',
      studentEmail: 'm.lin@deepvision.org',
      studentId: 'stu-111',
      courseTitle: 'AI Creator: Generative Content & Workflow Automation',
      courseId: 'course-ai-creator',
      tierName: 'AI Creator',
      tierId: 'tier-creator',
      batchName: 'Creator Cohort Delta',
      batchId: 'batch-delta-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Failed',
      date: '2026-10-05 19:12 UTC',
      method: 'International Swift Wire',
      invoiceId: 'INV-FAIL-0034',
      refundStatus: 'None',
      notes: 'Intermediary banking code mismatch. Payment processing will be connected during backend integration.'
    },
    {
      id: 'pay-7012',
      transactionRef: 'NEX-TX-2026-8823',
      studentName: 'Liam O\'Connor',
      studentEmail: 'liam.oc@cortex.tech',
      studentId: 'stu-112',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      amountDisplay: 'PRICE COMING SOON',
      status: 'Manual review',
      date: '2026-10-09 07:45 UTC',
      method: 'Academic Voucher Verification',
      invoiceId: 'INV-PO-0211',
      refundStatus: 'None',
      notes: 'Institutional sponsorship grant voucher awaiting bursar reconciliation.'
    }
  ];

  const defaultCertificates = [
    {
      id: 'cert-8001',
      verificationId: 'NEX-FND-2026-0042',
      studentId: 'stu-106',
      studentName: 'Rohan Mehra',
      studentEmail: 'rohan.mehra@ai-craft.in',
      courseTitle: 'AI Foundations: Zero to AI Native',
      courseId: 'course-ai-foundations',
      tierName: 'AI Foundations',
      tierId: 'tier-foundations',
      batchName: 'Foundations Cohort Alpha',
      batchId: 'batch-alpha-2026',
      completionPercentage: 100,
      eligibilityStatus: 'Requirements Satisfied',
      status: 'Issued',
      issueDate: '2026-10-05',
      grade: 'Distinction (98%)',
      signatory: 'Dr. Evelyn Vance & Dr. Kenneth Vance',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '100% curriculum lessons completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '8 / 8 mandatory interactive live classes attended' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Foundations Capstone passed with 98% score' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '4 / 4 lab assignments evaluated and passed' },
        manualApproval: { met: true, label: 'Directorate Approval', detail: 'Signed off by Academic Director on 2026-10-04' }
      },
      internalNotes: [
        { text: 'Academic audit verified complete attendance & top-percentile submission.', author: 'Academic Directorate', date: '2026-10-04T10:00:00Z' },
        { text: 'Digital credential generated and cryptographically stamped.', author: 'System Registrar', date: '2026-10-05T08:30:00Z' }
      ]
    },
    {
      id: 'cert-8002',
      verificationId: 'NEX-FND-2026-0043 (Unissued)',
      studentId: 'stu-102',
      studentName: 'Amara Valen',
      studentEmail: 'amara.valen@domain.org',
      courseTitle: 'AI Foundations: Zero to AI Native',
      courseId: 'course-ai-foundations',
      tierName: 'AI Foundations',
      tierId: 'tier-foundations',
      batchName: 'Foundations Cohort Alpha',
      batchId: 'batch-alpha-2026',
      completionPercentage: 95,
      eligibilityStatus: 'Awaiting Directorate Sign-off',
      status: 'Pending approval',
      issueDate: 'Pending Generation',
      grade: 'First Class (88%)',
      signatory: 'Academic Directorate',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '95% modules and lessons completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '8 / 8 live classes attended' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Capstone submitted and approved by mentor' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '4 / 4 assignments submitted' },
        manualApproval: { met: false, label: 'Directorate Approval', detail: 'Pending final review and signature from Academic Directorate' }
      },
      internalNotes: [
        { text: 'Submission scored 88%. Ready for directorate approval sign-off.', author: 'Marcus Chen', date: '2026-10-07T14:10:00Z' }
      ]
    },
    {
      id: 'cert-8003',
      verificationId: 'NEX-BLD-2026-0019 (Reserved)',
      studentId: 'stu-101',
      studentName: 'Zackary Thorne',
      studentEmail: 'z.thorne@synthetic.nexus',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      courseId: 'course-ai-builder',
      tierName: 'AI Builder',
      tierId: 'tier-builder',
      batchName: 'Builder Cohort Prime',
      batchId: 'batch-prime-2026',
      completionPercentage: 88,
      eligibilityStatus: 'Requirements Satisfied',
      status: 'Eligible',
      issueDate: 'Pending Generation',
      grade: 'In Progress (91%)',
      signatory: 'Marcus Chen & Lead Instructor',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '88% of core modules completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '10 / 10 mandatory interactive engineering sessions attended' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Production Agent Project verified' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: 'All 6 technical sprint challenges completed' },
        manualApproval: { met: true, label: 'Directorate Approval', detail: 'Approved for certification by Marcus Chen' }
      },
      internalNotes: [
        { text: 'Student cleared all technical requirements. Ready to issue certificate credential.', author: 'Marcus Chen', date: '2026-10-06T11:20:00Z' }
      ]
    },
    {
      id: 'cert-8004',
      verificationId: 'NEX-ARC-2026-0004 (Reserved)',
      studentId: 'stu-108',
      studentName: 'Tobias Sterling',
      studentEmail: 't.sterling@synthetics.io',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      completionPercentage: 96,
      eligibilityStatus: 'Requirements Satisfied',
      status: 'Eligible',
      issueDate: 'Pending Generation',
      grade: 'High Distinction (96%)',
      signatory: 'Chief AI Architect Dr. Kenneth Vance',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '96% curriculum completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '12 / 12 architecture workshops completed' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Enterprise multi-agent system capstone defended with honors' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '8 / 8 architectural design reviews cleared' },
        manualApproval: { met: true, label: 'Directorate Approval', detail: 'Signed off by Dr. Kenneth Vance' }
      },
      internalNotes: [
        { text: 'Capstone defense passed with high distinction.', author: 'Dr. Kenneth Vance', date: '2026-10-05T16:00:00Z' }
      ]
    },
    {
      id: 'cert-8005',
      verificationId: 'NEX-ARC-2026-0003',
      studentId: 'stu-104',
      studentName: 'Devon K. Scott',
      studentEmail: 'd.scott@hyperion.tech',
      courseTitle: 'AI Architect: Enterprise Intelligence Systems',
      courseId: 'course-ai-architect',
      tierName: 'AI Architect',
      tierId: 'tier-architect',
      batchName: 'Architect Cohort Sovereign',
      batchId: 'batch-sovereign-2026',
      completionPercentage: 100,
      eligibilityStatus: 'Requirements Satisfied',
      status: 'Issued',
      issueDate: '2026-09-28',
      grade: 'High Distinction (99%)',
      signatory: 'Dr. Evelyn Vance & Dr. Kenneth Vance',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '100% curriculum completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '12 / 12 workshops completed' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Enterprise LLM Gateway Defense Cleared' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '8 / 8 assignments graded 99%' },
        manualApproval: { met: true, label: 'Directorate Approval', detail: 'Approved and issued by Academic Board' }
      },
      internalNotes: [
        { text: 'Exemplary capstone architecture. Certified on Sept 28, 2026.', author: 'Academic Board', date: '2026-09-28T09:00:00Z' }
      ]
    },
    {
      id: 'cert-8006',
      verificationId: 'Pending Generation',
      studentId: 'stu-103',
      studentName: 'Julian Mercer',
      studentEmail: 'julian.m@matrix-sys.io',
      courseTitle: 'AI Creator: Generative Content & Workflow Automation',
      courseId: 'course-ai-creator',
      tierName: 'AI Creator',
      tierId: 'tier-creator',
      batchName: 'Creator Cohort Delta',
      batchId: 'batch-delta-2026',
      completionPercentage: 42,
      eligibilityStatus: 'Incomplete Curriculum',
      status: 'Not eligible',
      issueDate: 'Pending Completion',
      grade: 'Pending (42%)',
      signatory: 'TBD',
      requirements: {
        courseCompletion: { met: false, label: 'Course Progress', detail: '42% completed (minimum 80% required)' },
        classCompletion: { met: false, label: 'Required Classes', detail: '4 / 10 live sessions attended (minimum 8 required)' },
        projectCompletion: { met: false, label: 'Capstone Project', detail: 'Creator Portfolio not yet submitted' },
        assignmentCompletion: { met: false, label: 'Assignment Completion', detail: '2 / 6 creative labs submitted' },
        manualApproval: { met: false, label: 'Directorate Approval', detail: 'Student must complete coursework before review' }
      },
      internalNotes: [
        { text: 'Student enrolled recently; actively working through Module 2.', author: 'Sarah Al-Mansoor', date: '2026-10-07T09:30:00Z' }
      ]
    },
    {
      id: 'cert-8007',
      verificationId: 'NEX-CRT-2026-0008',
      studentId: 'stu-107',
      studentName: 'Elena Rostova',
      studentEmail: 'elena.rostova@helios-labs.io',
      courseTitle: 'AI Creator: Generative Content & Workflow Automation',
      courseId: 'course-ai-creator',
      tierName: 'AI Creator',
      tierId: 'tier-creator',
      batchName: 'Creator Cohort Delta',
      batchId: 'batch-delta-2026',
      completionPercentage: 100,
      eligibilityStatus: 'Disqualified / Withdrawn',
      status: 'Revoked',
      issueDate: '2026-09-15',
      grade: 'Revoked (Withdrawn)',
      signatory: 'Academic Directorate',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: 'Completed before cohort transfer' },
        classCompletion: { met: true, label: 'Required Classes', detail: 'Attendance logged' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Project submitted' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: 'Assignments logged' },
        manualApproval: { met: false, label: 'Directorate Approval', detail: 'Credential revoked following tuition refund & cohort withdrawal' }
      },
      internalNotes: [
        { text: 'Credential revoked on 2026-09-28 following tuition refund request.', author: 'Academic Directorate', date: '2026-09-28T17:00:00Z' }
      ]
    },
    {
      id: 'cert-8008',
      verificationId: 'NEX-BLD-2026-0020 (Unissued)',
      studentId: 'stu-105',
      studentName: 'Soraya Chen',
      studentEmail: 's.chen@quantum-ai.dev',
      courseTitle: 'AI Builder: Intelligent Application Engineering',
      courseId: 'course-ai-builder',
      tierName: 'AI Builder',
      tierId: 'tier-builder',
      batchName: 'Builder Cohort Prime',
      batchId: 'batch-prime-2026',
      completionPercentage: 92,
      eligibilityStatus: 'Awaiting Directorate Sign-off',
      status: 'Pending approval',
      issueDate: 'Pending Generation',
      grade: 'Distinction (94%)',
      signatory: 'Academic Directorate',
      requirements: {
        courseCompletion: { met: true, label: 'Course Progress', detail: '92% curriculum completed' },
        classCompletion: { met: true, label: 'Required Classes', detail: '10 / 10 live engineering sessions attended' },
        projectCompletion: { met: true, label: 'Capstone Project', detail: 'Autonomous Agent Platform defended successfully' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: '6 / 6 technical sprint challenges completed' },
        manualApproval: { met: false, label: 'Directorate Approval', detail: 'Audit package awaiting Academic Dean sign-off' }
      },
      internalNotes: [
        { text: 'Capstone defense scored 94%. Recommended for distinction award.', author: 'Marcus Chen', date: '2026-10-08T15:20:00Z' }
      ]
    }
  ];

  const defaultSupportTickets = [
    {
      id: 'tic-901',
      ticketRef: 'SUP-2026-0312',
      studentName: 'Julian Mercer',
      studentEmail: 'julian.m@matrix-sys.io',
      subject: 'Inquiry regarding Waitlist Queue Position for Creator Cohort Delta',
      category: 'Enrollment',
      priority: 'High',
      status: 'Open',
      assignedAdmin: 'Sarah Al-Mansoor',
      createdAt: '2026-10-08T09:15:00Z',
      lastUpdated: '2026-10-08T14:30:00Z',
      messages: [
        {
          sender: 'Julian Mercer',
          timestamp: '2026-10-08T09:15:00Z',
          text: 'Hi NEXVION Support team, I submitted enrollment for Creator Cohort Delta and noticed it says waitlisted. Could you clarify when the next batch slot opens up?'
        },
        {
          sender: 'Sarah Al-Mansoor (Student Manager)',
          timestamp: '2026-10-08T14:30:00Z',
          text: 'Hello Julian! The Creator Cohort Delta has reached its maximum strict capacity of 30 students. You are currently in waitlist spot #1. If any registered participant defers, your seat will activate immediately.'
        }
      ],
      internalNotes: 'Top candidate for next batch if capacity expands or cancellation occurs.'
    },
    {
      id: 'tic-902',
      ticketRef: 'SUP-2026-0313',
      studentName: 'Soraya Chen',
      studentEmail: 's.chen@quantum-ai.dev',
      subject: 'Corporate Purchase Order Processing Status',
      category: 'Payment',
      priority: 'Medium',
      status: 'In progress',
      assignedAdmin: 'Elena Finance Team',
      createdAt: '2026-10-08T11:00:00Z',
      lastUpdated: '2026-10-08T15:20:00Z',
      messages: [
        {
          sender: 'Soraya Chen',
          timestamp: '2026-10-08T11:00:00Z',
          text: 'Please confirm receipt of our company sponsorship authorization documents.'
        }
      ],
      internalNotes: 'Awaiting verification from finance accounts team.'
    },
    {
      id: 'tic-903',
      ticketRef: 'SUP-2026-0314',
      studentName: 'Zackary Thorne',
      studentEmail: 'z.thorne@synthetic.nexus',
      subject: 'Video Player Buffering on Class 03 Stream',
      category: 'Technical issue',
      priority: 'Low',
      status: 'Waiting for student',
      assignedAdmin: 'DevOps Support',
      createdAt: '2026-10-07T18:40:00Z',
      lastUpdated: '2026-10-08T10:12:00Z',
      messages: [
        {
          sender: 'Zackary Thorne',
          timestamp: '2026-10-07T18:40:00Z',
          text: 'The 4K stream on Class 03 had slight frame drops on Chrome.'
        },
        {
          sender: 'DevOps Support',
          timestamp: '2026-10-08T10:12:00Z',
          text: 'We refreshed the HLS CDN manifest. Please let us know if adaptive 1080p fallback works smoothly on your end.'
        }
      ],
      internalNotes: 'CDN cache purged for Class 03.'
    }
  ];

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
        'view_dashboard', 'view_analytics', 'view_payments'
      ],
      accessLevel: 'Institutional Reporting & Metrics (3 / 23 Modules)'
    }
  ];

  const defaultAuditLogs = [
    {
      id: 'aud-001',
      timestamp: '2026-10-09T07:15:30Z',
      admin: 'Kenneth Vance (Owner)',
      adminEmail: 'kenneth.vance@nexvion.ai',
      action: 'BATCH_CAPACITY_LOCKED',
      entityType: 'Batch',
      entityName: 'Foundations Cohort Alpha',
      previousState: '{"capacity": 30, "enforceStrict": true}',
      newState: '{"capacity": 30, "invariantLocked": true, "status": "HARD_CAP_30_ENFORCED"}',
      ipDevice: '192.168.1.102 • Chrome 130 on macOS Sequoia',
      result: 'Success',
      notes: 'Platform architectural invariant re-validated. Maximum batch capacity fixed at 30.'
    },
    {
      id: 'aud-002',
      timestamp: '2026-10-09T06:55:12Z',
      admin: 'Evelyn Vance (Super Admin)',
      adminEmail: 'evelyn.vance@nexvion.ai',
      action: 'ADMIN_INVITED',
      entityType: 'Admin',
      entityName: 'Alexander Croft (a.croft@nexvion.ai)',
      previousState: 'Non-existent personnel record',
      newState: '{"role": "Content Manager", "status": "Invited", "department": "Curriculum & Labs"}',
      ipDevice: '192.168.1.114 • Chrome 130 on Windows 11 Pro',
      result: 'Success',
      notes: 'Personnel onboarding invitation dispatch triggered.'
    },
    {
      id: 'aud-003',
      timestamp: '2026-10-09T06:40:22Z',
      admin: 'Evelyn Vance (Super Admin)',
      adminEmail: 'evelyn.vance@nexvion.ai',
      action: 'ADMIN_SUSPENDED',
      entityType: 'Admin',
      entityName: 'Chloe Bennet (c.bennet@nexvion.ai)',
      previousState: '{"status": "Active", "role": "Support Manager"}',
      newState: '{"status": "Suspended", "suspensionReason": "Audit review ongoing"}',
      ipDevice: '192.168.1.114 • Chrome 130 on Windows 11 Pro',
      result: 'Warning',
      notes: 'Administrative credentials suspended during quarterly audit review.'
    },
    {
      id: 'aud-004',
      timestamp: '2026-10-09T06:12:05Z',
      admin: 'Elena Rostova (Finance Manager)',
      adminEmail: 'elena.r@nexvion.ai',
      action: 'TUITION_REFUNDED',
      entityType: 'Payment',
      entityName: 'PAY-2026-001 (Sophia Vance)',
      previousState: '{"paymentStatus": "Paid", "amount": "PRICE COMING SOON"}',
      newState: '{"paymentStatus": "Refunded", "refundReason": "Cohort schedule conflict"}',
      ipDevice: '10.0.5.42 • Firefox 131 on Linux Ubuntu',
      result: 'Success',
      notes: 'Tuition reversal processed. Gateway staging notice logged.'
    },
    {
      id: 'aud-005',
      timestamp: '2026-10-08T22:30:10Z',
      admin: 'Kenneth Vance (Owner)',
      adminEmail: 'kenneth.vance@nexvion.ai',
      action: 'CREDENTIAL_ISSUED',
      entityType: 'Certificate',
      entityName: 'NEX-FND-2026-0042 (Rohan Mehra)',
      previousState: '{"eligibilityStatus": "Requirements Satisfied", "status": "Pending approval"}',
      newState: '{"certificateStatus": "Issued", "verificationId": "NEX-FND-2026-0042"}',
      ipDevice: '192.168.1.102 • Chrome 130 on macOS Sequoia',
      result: 'Success',
      notes: '5-point requirements verified. Digital academic credential issued.'
    },
    {
      id: 'aud-006',
      timestamp: '2026-10-08T21:40:12Z',
      admin: 'Sarah Al-Mansoor (Student Manager)',
      adminEmail: 'sarah.m@nexvion.ai',
      action: 'ENROLLMENT_APPROVED',
      entityType: 'Enrollment',
      entityName: 'Maya Lin (#enr-206 • Creator Cohort Delta)',
      previousState: '{"status": "Pending"}',
      newState: '{"status": "Approved", "batchAllocated": "Creator Cohort Delta"}',
      ipDevice: '10.0.3.18 • Safari 18 on iPadOS',
      result: 'Success',
      notes: 'Enrollment approved into Creator Delta cohort (capacity capped at 30).'
    },
    {
      id: 'aud-007',
      timestamp: '2026-10-08T19:22:05Z',
      admin: 'Marcus Chen (Content Manager)',
      adminEmail: 'marcus.chen@nexvion.ai',
      action: 'LESSON_PUBLISHED',
      entityType: 'Lesson',
      entityName: 'Lesson 2.1: JSON Schema Enforcement',
      previousState: '{"status": "Draft"}',
      newState: '{"status": "Published", "visibility": "Cohort Open"}',
      ipDevice: '10.0.4.88 • Edge 129 on Windows 11',
      result: 'Success',
      notes: 'Curriculum update approved and published across AI Builder tier cohorts.'
    },
    {
      id: 'aud-008',
      timestamp: '2026-10-08T18:05:44Z',
      admin: 'David K. Osei (Comms Manager)',
      adminEmail: 'david.osei@nexvion.ai',
      action: 'NOTIFICATION_DISPATCHED',
      entityType: 'Notification',
      entityName: 'Live Class Starting in 30 Minutes',
      previousState: '{"status": "Queued"}',
      newState: '{"status": "Sent", "recipientCount": 28}',
      ipDevice: '10.0.2.19 • Chrome 130 on Windows 11',
      result: 'Success',
      notes: 'In-app cohort push dispatched to Builder Cohort Prime students.'
    },
    {
      id: 'aud-009',
      timestamp: '2026-10-08T16:12:10Z',
      admin: 'Evelyn Vance (Super Admin)',
      adminEmail: 'evelyn.vance@nexvion.ai',
      action: 'SETTINGS_UPDATED',
      entityType: 'Settings',
      entityName: 'Batch Rules & Cap Governance',
      previousState: '{"maxBatchCapacity": 30, "autoWaitlistOverflow": true}',
      newState: '{"maxBatchCapacity": 30, "enforceMaxCapacityStrict": true}',
      ipDevice: '192.168.1.114 • Chrome 130 on Windows 11 Pro',
      result: 'Success',
      notes: 'Strict enforcement enabled for 30-student cohort hard-cap.'
    },
    {
      id: 'aud-010',
      timestamp: '2026-10-08T14:30:20Z',
      admin: 'Sarah Al-Mansoor (Student Manager)',
      adminEmail: 'sarah.m@nexvion.ai',
      action: 'STUDENT_STATUS_UPDATED',
      entityType: 'Student',
      entityName: 'Amara Valen (#stu-102)',
      previousState: '{"status": "Enrolled"}',
      newState: '{"status": "Active", "attendanceRate": "100%"}',
      ipDevice: '10.0.3.18 • Safari 18 on macOS',
      result: 'Success',
      notes: 'Academic progress updated following Foundations live class completion.'
    },
    {
      id: 'aud-011',
      timestamp: '2026-10-08T11:15:00Z',
      admin: 'Nadia Petrova (Support Manager)',
      adminEmail: 'nadia.p@nexvion.ai',
      action: 'TICKET_RESOLVED',
      entityType: 'Support',
      entityName: 'TCK-2026-104 (Video playback buffering)',
      previousState: '{"status": "Open", "priority": "Medium"}',
      newState: '{"status": "Resolved", "resolution": "HLS CDN manifest updated"}',
      ipDevice: '10.0.6.21 • Chrome 130 on macOS',
      result: 'Success',
      notes: 'Student verified 1080p stream resolution without frame drops.'
    },
    {
      id: 'aud-012',
      timestamp: '2026-10-08T09:45:30Z',
      admin: 'Liam Vance (Analyst)',
      adminEmail: 'liam.vance@nexvion.ai',
      action: 'REPORT_EXPORTED',
      entityType: 'Analytics',
      entityName: 'Q3 Enrollment Velocity & Tuition Yield',
      previousState: 'System query',
      newState: 'CSV Report Downloaded (Records: 1,248)',
      ipDevice: '10.0.1.55 • Firefox 131 on Linux',
      result: 'Success',
      notes: 'Intelligence audit export generated for executive committee.'
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
      totalStudents: 1248,
      activeStudents: 934,
      pendingEnrollments: 18,
      activeCourses: 4,
      openBatches: 7,
      waitlistedStudents: 42,
      upcomingClasses: 12,
      pendingSupportRequests: 9,
      completionRatePercent: 87.4,
      avgCourseSatisfaction: 4.92
    },
    enrollmentTrends: [
      { period: 'Week 1', foundations: 45, builder: 38, creator: 28, architect: 14 },
      { period: 'Week 2', foundations: 62, builder: 48, creator: 34, architect: 18 },
      { period: 'Week 3', foundations: 88, builder: 65, creator: 42, architect: 25 },
      { period: 'Week 4', foundations: 110, builder: 82, creator: 55, architect: 32 },
      { period: 'Week 5', foundations: 135, builder: 96, creator: 68, architect: 39 },
      { period: 'Week 6', foundations: 154, builder: 115, creator: 81, architect: 45 }
    ],
    tierDistribution: [
      { tier: 'AI Foundations (Free)', count: 420, percent: 33.6, color: '#7F52FF' },
      { tier: 'AI Builder (Paid)', count: 384, percent: 30.8, color: '#C757BC' },
      { tier: 'AI Creator (Paid)', count: 290, percent: 23.2, color: '#00D2B4' },
      { tier: 'AI Architect (Premium)', count: 154, percent: 12.4, color: '#F59E0B' }
    ],
    batchCapacityUtilization: [
      { batch: 'Foundations Alpha', filled: 18, capacity: 30, percent: 60, status: 'OPEN' },
      { batch: 'Foundations Beta', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Builder Prime', filled: 26, capacity: 30, percent: 86.6, status: 'OPEN' },
      { batch: 'Builder Apex', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Creator Delta', filled: 30, capacity: 30, percent: 100, status: 'FULL' },
      { batch: 'Creator Omega', filled: 12, capacity: 30, percent: 40, status: 'OPEN' },
      { batch: 'Architect Sovereign', filled: 28, capacity: 30, percent: 93.3, status: 'OPEN' }
    ]
  };

  // --------------------------------------------------------------------------
  // 2. DATA STORE
  // --------------------------------------------------------------------------

  class ProductionDataStore {
    constructor() {
      this.state = this.loadState();
      this.currentRole = 'Super Admin';
    }

    loadState() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const cached = window.localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.tiers && parsed.tiers.length === 4 && parsed.batches) {
              parsed.batches.forEach(b => {
                b.capacity = 30;
                if (b.enrolledCount > 30) b.enrolledCount = 30;
              });
              if (!parsed.payments || parsed.payments.length < 12) {
                parsed.payments = JSON.parse(JSON.stringify(defaultPayments));
              }
              if (!parsed.certificates || parsed.certificates.length < 8) {
                parsed.certificates = JSON.parse(JSON.stringify(defaultCertificates));
              }
              if (!parsed.adminUsers || parsed.adminUsers.length < 11) {
                parsed.adminUsers = JSON.parse(JSON.stringify(defaultAdminUsers));
              }
              if (!parsed.roles || parsed.roles.length < 8) {
                parsed.roles = JSON.parse(JSON.stringify(defaultRoles));
              }
              if (!parsed.auditLogs || parsed.auditLogs.length < 12) {
                parsed.auditLogs = JSON.parse(JSON.stringify(defaultAuditLogs));
              }
              if (!parsed.settings || !parsed.settings.enrollmentRules || !parsed.settings.adminPreferences) {
                parsed.settings = JSON.parse(JSON.stringify(defaultSettings));
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
        analytics: JSON.parse(JSON.stringify(defaultAnalytics))
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
    findAll: async () => JSON.parse(JSON.stringify(store.state.courses)),
    findById: async (id) => {
      const c = store.state.courses.find(c => c.id === id);
      return c ? JSON.parse(JSON.stringify(c)) : null;
    },
    create: async (courseData) => {
      const newCourse = {
        ...courseData,
        id: courseData.id || `course-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      store.state.courses.unshift(newCourse);
      store.saveState();
      auditRepository.log('Created Course', 'Course', newCourse.title);
      return newCourse;
    },
    update: async (id, courseData) => {
      const idx = store.state.courses.findIndex(c => c.id === id);
      if (idx !== -1) {
        store.state.courses[idx] = { ...store.state.courses[idx], ...courseData, updatedAt: new Date().toISOString() };
        store.saveState();
        auditRepository.log('Updated Course', 'Course', store.state.courses[idx].title);
        return store.state.courses[idx];
      }
      return null;
    },
    delete: async (id) => {
      const idx = store.state.courses.findIndex(c => c.id === id);
      if (idx !== -1) {
        const title = store.state.courses[idx].title;
        store.state.courses.splice(idx, 1);
        store.saveState();
        auditRepository.log('Archived Course', 'Course', title);
        return true;
      }
      return false;
    }
  };

  // --- tierRepository ---
  const tierRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.tiers)),
    findById: async (id) => {
      const t = store.state.tiers.find(t => t.id === id);
      return t ? JSON.parse(JSON.stringify(t)) : null;
    },
    update: async (id, tierData) => {
      const idx = store.state.tiers.findIndex(t => t.id === id);
      if (idx !== -1) {
        store.state.tiers[idx] = { ...store.state.tiers[idx], ...tierData };
        store.saveState();
        auditRepository.log('Updated Course Tier', 'Tier', store.state.tiers[idx].name);
        return store.state.tiers[idx];
      }
      return null;
    }
  };

  // --- batchRepository (Strict 30-Cap) ---
  const batchRepository = {
    findAll: async () => {
      store.state.batches.forEach(b => {
        b.capacity = 30;
        if (b.enrolledCount >= 30) {
          b.status = b.status === 'COMPLETED' ? 'COMPLETED' : 'FULL';
        }
      });
      return JSON.parse(JSON.stringify(store.state.batches));
    },
    findById: async (id) => {
      const b = store.state.batches.find(b => b.id === id);
      if (b) b.capacity = 30;
      return b ? JSON.parse(JSON.stringify(b)) : null;
    },
    create: async (batchData) => {
      const clean = {
        ...batchData,
        id: batchData.id || `batch-${Date.now()}`,
        capacity: 30, // MAX 30 ALWAYS
        enrolledCount: Math.min(Number(batchData.enrolledCount) || 0, 30),
        waitlistCount: Number(batchData.waitlistCount) || 0,
        status: Number(batchData.enrolledCount) >= 30 ? 'FULL' : (batchData.status || 'OPEN')
      };
      store.state.batches.unshift(clean);
      store.saveState();
      auditRepository.log('Created Cohort Batch', 'Batch', clean.name);
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
          status: enrolled >= 30 ? 'FULL' : (batchData.status || store.state.batches[idx].status)
        };
        store.saveState();
        auditRepository.log('Updated Cohort Batch', 'Batch', store.state.batches[idx].name);
        return store.state.batches[idx];
      }
      return null;
    },
    admitFromWaitlist: async (batchId, studentId) => {
      const batch = store.state.batches.find(b => b.id === batchId);
      if (!batch) throw new Error('Batch not found');
      if (batch.enrolledCount >= 30) {
        throw new Error('Batch has reached maximum capacity of 30 students.');
      }
      batch.enrolledCount += 1;
      if (batch.waitlistCount > 0) batch.waitlistCount -= 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';

      const student = store.state.students.find(s => s.id === studentId);
      if (student) {
        student.enrollmentStatus = 'Enrolled';
        student.batchId = batch.id;
        student.batchName = batch.name;
      }
      const enr = store.state.enrollments.find(e => e.studentId === studentId && e.batchId === batch.id);
      if (enr) enr.status = 'Enrolled';

      store.saveState();
      auditRepository.log('Admitted Student from Waitlist', 'Batch', `${student ? student.name : studentId} into ${batch.name}`);
      return true;
    }
  };

  // --- studentRepository ---
  const studentRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.students)),
    findById: async (id) => {
      const s = store.state.students.find(s => s.id === id);
      return s ? JSON.parse(JSON.stringify(s)) : null;
    },
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
      auditRepository.log('Added Student Record', 'Student', clean.name);
      return clean;
    },
    update: async (id, studentData) => {
      const idx = store.state.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        store.state.students[idx] = { ...store.state.students[idx], ...studentData };
        store.saveState();
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
    findAll: async () => JSON.parse(JSON.stringify(store.state.enrollments)),
    findById: async (id) => {
      const e = store.state.enrollments.find(e => e.id === id);
      return e ? JSON.parse(JSON.stringify(e)) : null;
    },
    create: async (enrData) => {
      const clean = {
        ...enrData,
        id: enrData.id || `enr-${Date.now()}`,
        submittedAt: enrData.submittedAt || new Date().toISOString(),
        status: enrData.status || 'Pending'
      };
      store.state.enrollments.unshift(clean);
      store.saveState();
      auditRepository.log('Submitted Enrollment Application', 'Enrollment', clean.studentName);
      return clean;
    },
    update: async (id, enrData) => {
      const idx = store.state.enrollments.findIndex(e => e.id === id);
      if (idx !== -1) {
        store.state.enrollments[idx] = { ...store.state.enrollments[idx], ...enrData };
        store.saveState();
        return store.state.enrollments[idx];
      }
      return null;
    },
    approve: async (id, targetBatchId) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment application not found.');
      
      const batchId = targetBatchId || enr.batchId;
      const batch = store.state.batches.find(b => b.id === batchId);
      if (batch) {
        if (batch.enrolledCount >= 30) {
          throw new Error(`Cohort "${batch.name}" has reached maximum capacity of 30 students. Direct enrollment is locked. Move applicant to Waitlist instead.`);
        }
        batch.enrolledCount = Math.min(batch.enrolledCount + 1, 30);
        if (batch.enrolledCount >= 30) batch.status = 'FULL';
        enr.batchId = batch.id;
        enr.batchName = batch.name;
      }

      enr.status = 'Approved';
      enr.decidedAt = new Date().toISOString();

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Approved';
        if (batch) {
          student.batchId = batch.id;
          student.batchName = batch.name;
        }
      }

      store.saveState();
      auditRepository.log('Approved Student Enrollment', 'Enrollment', `${enr.studentName} → ${enr.courseTitle}`);
      return enr;
    },
    reject: async (id, reason) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (!enr) throw new Error('Enrollment application not found.');

      enr.status = 'Rejected';
      enr.rejectionReason = reason || 'Application declined by admissions desk.';
      enr.decidedAt = new Date().toISOString();

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Rejected';
      }

      store.saveState();
      auditRepository.log('Rejected Student Enrollment', 'Enrollment', `${enr.studentName}: ${enr.rejectionReason}`);
      return enr;
    },
    assignBatch: async (enrollmentId, newBatchId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment application not found.');
      const targetBatch = store.state.batches.find(b => b.id === newBatchId);
      if (!targetBatch) throw new Error('Target cohort batch not found.');

      if (targetBatch.enrolledCount >= 30) {
        throw new Error(`Target cohort "${targetBatch.name}" is already at maximum capacity (30 / 30). Select an alternate cohort or place on waitlist.`);
      }

      // Decrement previous batch if enrolled
      if (enr.batchId && enr.batchId !== newBatchId && (enr.status === 'Enrolled' || enr.status === 'Approved')) {
        const oldBatch = store.state.batches.find(b => b.id === enr.batchId);
        if (oldBatch && oldBatch.enrolledCount > 0) {
          oldBatch.enrolledCount -= 1;
          if (oldBatch.status === 'FULL') oldBatch.status = 'OPEN';
        }
      }

      // Increment new batch
      if (enr.status === 'Enrolled' || enr.status === 'Approved') {
        targetBatch.enrolledCount = Math.min(targetBatch.enrolledCount + 1, 30);
        if (targetBatch.enrolledCount >= 30) targetBatch.status = 'FULL';
      }

      enr.batchId = targetBatch.id;
      enr.batchName = targetBatch.name;

      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.batchId = targetBatch.id;
        student.batchName = targetBatch.name;
      }

      store.saveState();
      auditRepository.log('Reassigned Cohort Batch', 'Enrollment', `${enr.studentName} → ${targetBatch.name}`);
      return targetBatch;
    },
    moveToWaitlist: async (enrollmentId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment record not found.');

      if (enr.batchId) {
        const batch = store.state.batches.find(b => b.id === enr.batchId);
        if (batch) {
          if (enr.status === 'Enrolled' && batch.enrolledCount > 0) {
            batch.enrolledCount -= 1;
            if (batch.status === 'FULL') batch.status = 'OPEN';
          }
          batch.waitlistCount = (batch.waitlistCount || 0) + 1;
        }
      }

      enr.status = 'Waitlisted';
      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) student.enrollmentStatus = 'Waitlisted';

      store.saveState();
      auditRepository.log('Moved Student to Waitlist', 'Enrollment', `${enr.studentName} (${enr.batchName})`);
      return enr;
    },
    admitFromWaitlist: async (enrollmentId) => {
      const enr = store.state.enrollments.find(e => e.id === enrollmentId);
      if (!enr) throw new Error('Enrollment record not found.');
      const batch = store.state.batches.find(b => b.id === enr.batchId);
      if (!batch) throw new Error('Cohort batch not found.');

      if (batch.enrolledCount >= 30) {
        throw new Error(`Cohort "${batch.name}" is already at maximum capacity (30 / 30). Cannot admit from waitlist until a seat opens.`);
      }

      batch.enrolledCount += 1;
      if (batch.waitlistCount > 0) batch.waitlistCount -= 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';

      enr.status = 'Enrolled';
      const student = store.state.students.find(s => s.id === enr.studentId);
      if (student) {
        student.enrollmentStatus = 'Enrolled';
        student.batchId = batch.id;
        student.batchName = batch.name;
      }

      store.saveState();
      auditRepository.log('Admitted Student from Waitlist', 'Enrollment', `${enr.studentName} into ${batch.name} (${batch.enrolledCount}/30)`);
      return enr;
    },
    updateStatus: async (id, newStatus, reason = '') => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (enr) {
        const prev = enr.status;
        enr.status = newStatus;
        if (reason) {
          enr.rejectionReason = reason;
          enr.notes = (enr.notes ? enr.notes + ' | ' : '') + reason;
        }
        const student = store.state.students.find(s => s.id === enr.studentId);
        if (student) student.enrollmentStatus = newStatus;
        store.saveState();
        auditRepository.log('Updated Enrollment Status', 'Enrollment', `${enr.studentName} (${enr.courseTitle}): ${prev} → ${newStatus}`);
        return true;
      }
      return false;
    },
    addNote: async (id, noteText) => {
      const enr = store.state.enrollments.find(e => e.id === id);
      if (enr) {
        const timeStr = new Date().toISOString().split('T')[0];
        enr.notes = (enr.notes ? enr.notes + '\n' : '') + `[${timeStr}] ${noteText}`;
        store.saveState();
        return true;
      }
      return false;
    }
  };

  // --- contentRepository (Classes, Modules, Lessons, Videos, Resources) ---
  const contentRepository = {
    getClasses: async () => JSON.parse(JSON.stringify(store.state.classes)),
    getClassById: async (id) => {
      const c = store.state.classes.find(item => item.id === id);
      return c ? JSON.parse(JSON.stringify(c)) : null;
    },
    saveClass: async (classData) => {
      const idx = store.state.classes.findIndex(c => c.id === classData.id);
      if (idx !== -1) {
        store.state.classes[idx] = { ...store.state.classes[idx], ...classData };
        store.saveState();
        auditRepository.log('Updated Curriculum Class', 'Class', store.state.classes[idx].title);
        return store.state.classes[idx];
      } else {
        const newClass = {
          ...classData,
          id: classData.id || `cls-${Date.now()}`
        };
        store.state.classes.unshift(newClass);
        store.saveState();
        auditRepository.log('Created Curriculum Class', 'Class', newClass.title);
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
        status: 'Draft'
      };
      store.state.classes.unshift(clone);
      store.saveState();
      auditRepository.log('Duplicated Curriculum Class', 'Class', clone.title);
      return clone;
    },
    archiveClass: async (id) => {
      const c = store.state.classes.find(item => item.id === id);
      if (c) {
        c.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Curriculum Class', 'Class', c.title);
        return true;
      }
      return false;
    },

    getModules: async () => JSON.parse(JSON.stringify(store.state.modules)),
    getModuleById: async (id) => {
      const m = store.state.modules.find(item => item.id === id);
      return m ? JSON.parse(JSON.stringify(m)) : null;
    },
    saveModule: async (modData) => {
      const idx = store.state.modules.findIndex(m => m.id === modData.id);
      if (idx !== -1) {
        store.state.modules[idx] = { ...store.state.modules[idx], ...modData };
        store.saveState();
        auditRepository.log('Updated Curriculum Module', 'Module', store.state.modules[idx].title);
        return store.state.modules[idx];
      } else {
        const newMod = {
          ...modData,
          id: modData.id || `mod-${Date.now()}`,
          classesCount: modData.classesCount || 0
        };
        store.state.modules.unshift(newMod);
        store.saveState();
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
        status: 'Draft'
      };
      store.state.modules.unshift(clone);
      store.saveState();
      auditRepository.log('Duplicated Curriculum Module', 'Module', clone.title);
      return clone;
    },
    archiveModule: async (id) => {
      const m = store.state.modules.find(item => item.id === id);
      if (m) {
        m.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Curriculum Module', 'Module', m.title);
        return true;
      }
      return false;
    },

    getLessons: async () => JSON.parse(JSON.stringify(store.state.lessons)),
    getLessonById: async (id) => {
      const l = store.state.lessons.find(item => item.id === id);
      return l ? JSON.parse(JSON.stringify(l)) : null;
    },
    saveLesson: async (lsnData) => {
      const idx = store.state.lessons.findIndex(l => l.id === lsnData.id);
      if (idx !== -1) {
        store.state.lessons[idx] = { ...store.state.lessons[idx], ...lsnData };
        store.saveState();
        auditRepository.log('Updated Lesson', 'Lesson', store.state.lessons[idx].title);
        return store.state.lessons[idx];
      } else {
        const newLsn = {
          ...lsnData,
          id: lsnData.id || `lsn-${Date.now()}`
        };
        store.state.lessons.unshift(newLsn);
        store.saveState();
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
        status: 'Draft'
      };
      store.state.lessons.unshift(clone);
      store.saveState();
      auditRepository.log('Duplicated Lesson', 'Lesson', clone.title);
      return clone;
    },
    archiveLesson: async (id) => {
      const l = store.state.lessons.find(item => item.id === id);
      if (l) {
        l.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Lesson', 'Lesson', l.title);
        return true;
      }
      return false;
    },

    getVideos: async () => JSON.parse(JSON.stringify(store.state.videos)),
    getVideoById: async (id) => {
      const v = store.state.videos.find(item => item.id === id);
      return v ? JSON.parse(JSON.stringify(v)) : null;
    },
    saveVideo: async (vidData) => {
      const idx = store.state.videos.findIndex(v => v.id === vidData.id);
      if (idx !== -1) {
        store.state.videos[idx] = { ...store.state.videos[idx], ...vidData };
        store.saveState();
        auditRepository.log('Updated Video Asset', 'Video', store.state.videos[idx].title);
        return store.state.videos[idx];
      } else {
        const newVid = {
          ...vidData,
          id: vidData.id || `vid-${Date.now()}`,
          uploadedAt: vidData.uploadedAt || new Date().toISOString()
        };
        store.state.videos.unshift(newVid);
        store.saveState();
        auditRepository.log('Created Video Asset', 'Video', newVid.title);
        return newVid;
      }
    },
    archiveVideo: async (id) => {
      const v = store.state.videos.find(item => item.id === id);
      if (v) {
        v.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Video Asset', 'Video', v.title);
        return true;
      }
      return false;
    },

    getResources: async () => JSON.parse(JSON.stringify(store.state.resources)),
    getResourceById: async (id) => {
      const r = store.state.resources.find(item => item.id === id);
      return r ? JSON.parse(JSON.stringify(r)) : null;
    },
    saveResource: async (resData) => {
      const idx = store.state.resources.findIndex(r => r.id === resData.id);
      if (idx !== -1) {
        store.state.resources[idx] = { ...store.state.resources[idx], ...resData };
        store.saveState();
        auditRepository.log('Updated Resource Asset', 'Resource', store.state.resources[idx].title);
        return store.state.resources[idx];
      } else {
        const newRes = {
          ...resData,
          id: resData.id || `res-${Date.now()}`,
          downloadCount: resData.downloadCount || 0
        };
        store.state.resources.unshift(newRes);
        store.saveState();
        auditRepository.log('Created Resource Asset', 'Resource', newRes.title);
        return newRes;
      }
    },
    archiveResource: async (id) => {
      const r = store.state.resources.find(item => item.id === id);
      if (r) {
        r.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Resource Asset', 'Resource', r.title);
        return true;
      }
      return false;
    }
  };

  // --- projectRepository (Projects, Assignments & Submissions) ---
  const projectRepository = {
    getProjects: async () => JSON.parse(JSON.stringify(store.state.projects)),
    getProjectById: async (id) => {
      const p = store.state.projects.find(item => item.id === id);
      return p ? JSON.parse(JSON.stringify(p)) : null;
    },
    saveProject: async (projectData) => {
      const idx = store.state.projects.findIndex(p => p.id === projectData.id);
      if (idx !== -1) {
        store.state.projects[idx] = { ...store.state.projects[idx], ...projectData };
        store.saveState();
        auditRepository.log('Updated Project Milestone', 'Project', store.state.projects[idx].title);
        return store.state.projects[idx];
      } else {
        const newProj = {
          ...projectData,
          id: projectData.id || `prj-${Date.now()}`
        };
        store.state.projects.unshift(newProj);
        store.saveState();
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
        status: 'Draft'
      };
      store.state.projects.unshift(clone);
      store.saveState();
      auditRepository.log('Duplicated Project Milestone', 'Project', clone.title);
      return clone;
    },
    archiveProject: async (id) => {
      const p = store.state.projects.find(item => item.id === id);
      if (p) {
        p.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Project Milestone', 'Project', p.title);
        return true;
      }
      return false;
    },

    getAssignments: async () => JSON.parse(JSON.stringify(store.state.assignments)),
    getAssignmentById: async (id) => {
      const a = store.state.assignments.find(item => item.id === id);
      return a ? JSON.parse(JSON.stringify(a)) : null;
    },
    saveAssignment: async (assignmentData) => {
      const idx = store.state.assignments.findIndex(a => a.id === assignmentData.id);
      if (idx !== -1) {
        store.state.assignments[idx] = { ...store.state.assignments[idx], ...assignmentData };
        store.saveState();
        auditRepository.log('Updated Assignment Requirement', 'Assignment', store.state.assignments[idx].title);
        return store.state.assignments[idx];
      } else {
        const newAsg = {
          ...assignmentData,
          id: assignmentData.id || `asg-${Date.now()}`
        };
        store.state.assignments.unshift(newAsg);
        store.saveState();
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
        status: 'Draft'
      };
      store.state.assignments.unshift(clone);
      store.saveState();
      auditRepository.log('Duplicated Assignment Requirement', 'Assignment', clone.title);
      return clone;
    },
    archiveAssignment: async (id) => {
      const a = store.state.assignments.find(item => item.id === id);
      if (a) {
        a.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Assignment Requirement', 'Assignment', a.title);
        return true;
      }
      return false;
    },

    getSubmissions: async () => JSON.parse(JSON.stringify(store.state.submissions)),
    getSubmissionById: async (id) => {
      const s = store.state.submissions.find(item => item.id === id);
      return s ? JSON.parse(JSON.stringify(s)) : null;
    },
    saveSubmission: async (subData) => {
      const idx = store.state.submissions.findIndex(s => s.id === subData.id);
      if (idx !== -1) {
        store.state.submissions[idx] = { ...store.state.submissions[idx], ...subData, lastUpdated: new Date().toISOString() };
        store.saveState();
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
        auditRepository.log('Evaluated Student Submission', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle} - ${sub.studentName} (${sub.score}/100)`);
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
        auditRepository.log('Returned Submission For Revision', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle} - ${sub.studentName}`);
        return sub;
      }
      return null;
    },
    approveCompletion: async (id, feedback, internalNote, reviewer, score = 100) => {
      const sub = store.state.submissions.find(s => s.id === id);
      if (sub) {
        sub.status = 'Reviewed';
        sub.score = Number(score) || 100;
        sub.feedback = feedback || 'Milestone requirements completed and approved by faculty reviewer.';
        if (internalNote) sub.internalReviewerNote = internalNote;
        sub.reviewer = reviewer || store.getCurrentRole();
        sub.lastUpdated = new Date().toISOString();
        store.saveState();
        auditRepository.log('Approved Milestone Completion', sub.type || 'Submission', `${sub.itemTitle || sub.assignmentTitle} - ${sub.studentName} (${sub.score}/100)`);
        return sub;
      }
      return null;
    }
  };

  // --- notificationRepository ---
  const notificationRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.notifications)),
    findById: async (id) => {
      const n = store.state.notifications.find(item => item.id === id);
      return n ? JSON.parse(JSON.stringify(n)) : null;
    },
    save: async (data) => {
      const idx = store.state.notifications.findIndex(n => n.id === data.id);
      if (idx !== -1) {
        store.state.notifications[idx] = { ...store.state.notifications[idx], ...data };
        store.saveState();
        return store.state.notifications[idx];
      } else {
        const item = {
          ...data,
          id: data.id || `notif-${Date.now()}`,
          date: data.date || new Date().toISOString(),
          sentAt: data.deliveryStatus === 'Sent' ? new Date().toISOString() : null
        };
        store.state.notifications.unshift(item);
        store.saveState();
        return item;
      }
    },
    send: async (notifData) => {
      const item = {
        id: notifData.id || `notif-${Date.now()}`,
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || 'System message',
        audience: notifData.audience || 'All Enrolled Students',
        course: notifData.course || 'All Courses',
        courseId: notifData.courseId || '',
        tier: notifData.tier || 'All Tiers',
        tierId: notifData.tierId || '',
        batch: notifData.batch || 'All Batches',
        batchId: notifData.batchId || '',
        channels: notifData.channels && notifData.channels.length ? notifData.channels : ['In-App'],
        deliveryStatus: notifData.scheduledFor ? 'Scheduled' : 'Sent',
        status: notifData.scheduledFor ? 'Scheduled' : 'Sent',
        scheduledFor: notifData.scheduledFor || null,
        sentBy: notifData.sentBy || store.getCurrentRole(),
        date: new Date().toISOString(),
        sentAt: notifData.scheduledFor ? null : new Date().toISOString(),
        recipientCount: notifData.recipientCount || 42
      };
      store.state.notifications.unshift(item);
      store.saveState();
      auditRepository.log('Dispatched Broadcast Notification', 'Notification', item.title);
      return item;
    },
    sendTest: async (notifData) => {
      const item = {
        id: `notif-test-${Date.now()}`,
        title: `[TEST] ${notifData.title}`,
        message: notifData.message,
        type: notifData.type || 'System message',
        audience: `Test Dispatch (${store.getCurrentRole()})`,
        course: notifData.course || 'All Courses',
        courseId: notifData.courseId || '',
        tier: notifData.tier || 'All Tiers',
        tierId: notifData.tierId || '',
        batch: notifData.batch || 'All Batches',
        batchId: notifData.batchId || '',
        channels: notifData.channels && notifData.channels.length ? notifData.channels : ['In-App'],
        deliveryStatus: 'Sent',
        status: 'Sent',
        sentBy: store.getCurrentRole(),
        date: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        recipientCount: 1,
        isTest: true
      };
      store.state.notifications.unshift(item);
      store.saveState();
      auditRepository.log('Dispatched Test Push Notification', 'Notification', item.title);
      return item;
    },
    cancel: async (id) => {
      const n = store.state.notifications.find(item => item.id === id);
      if (n) {
        n.deliveryStatus = 'Cancelled';
        n.status = 'Cancelled';
        store.saveState();
        auditRepository.log('Cancelled Scheduled Notification', 'Notification', n.title);
        return n;
      }
      return null;
    }
  };

  // --- paymentRepository ---
  const paymentRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.payments)),
    findById: async (id) => {
      const p = store.state.payments.find(p => p.id === id);
      return p ? JSON.parse(JSON.stringify(p)) : null;
    },
    save: async (paymentData) => {
      const idx = store.state.payments.findIndex(p => p.id === paymentData.id);
      if (idx !== -1) {
        store.state.payments[idx] = { ...store.state.payments[idx], ...paymentData };
        store.saveState();
        return store.state.payments[idx];
      } else {
        const newPayment = {
          id: paymentData.id || `pay-${Date.now().toString().slice(-4)}`,
          transactionRef: paymentData.transactionRef || `NEX-TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          date: paymentData.date || new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
          refundStatus: paymentData.refundStatus || 'None',
          ...paymentData
        };
        store.state.payments.unshift(newPayment);
        store.saveState();
        return newPayment;
      }
    },
    refund: async (id, reason) => {
      const p = store.state.payments.find(item => item.id === id);
      if (p) {
        p.status = 'Refunded';
        p.refundStatus = 'Processed';
        p.notes = (p.notes ? p.notes + ' | ' : '') + `Refund processed: ${reason || 'Administrative refund request'}`;
        store.saveState();
        auditRepository.log('Processed Payment Refund', 'Payment', `${p.studentName} (${p.transactionRef}) - Reason: ${reason || 'Administrative discretion'}`);
        return p;
      }
      return null;
    },
    updateStatus: async (id, newStatus, noteText) => {
      const p = store.state.payments.find(item => item.id === id);
      if (p) {
        const oldStatus = p.status;
        p.status = newStatus;
        if (noteText) {
          p.notes = (p.notes ? p.notes + ' | ' : '') + noteText;
        }
        store.saveState();
        auditRepository.log('Updated Payment Status', 'Payment', `${p.studentName} (${p.transactionRef}): ${oldStatus} -> ${newStatus}`);
        return p;
      }
      return null;
    }
  };

  // --- certificateRepository ---
  const certificateRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.certificates)),
    findById: async (id) => {
      const c = store.state.certificates.find(c => c.id === id);
      return c ? JSON.parse(JSON.stringify(c)) : null;
    },
    approve: async (id, approver) => {
      const cert = store.state.certificates.find(c => c.id === id);
      if (cert) {
        if (!cert.requirements) cert.requirements = {};
        if (!cert.requirements.manualApproval) {
          cert.requirements.manualApproval = { met: true, label: 'Directorate Approval', detail: '' };
        }
        cert.requirements.manualApproval.met = true;
        cert.requirements.manualApproval.detail = `Signed off by ${approver || 'Academic Directorate'} on ${new Date().toISOString().split('T')[0]}`;
        cert.status = 'Eligible';
        cert.eligibilityStatus = 'Requirements Satisfied';
        if (!cert.internalNotes) cert.internalNotes = [];
        cert.internalNotes.push({
          text: `Eligibility approved by ${approver || 'Academic Directorate'}`,
          author: approver || 'Academic Directorate',
          date: new Date().toISOString()
        });
        store.saveState();
        auditRepository.log('Approved Certificate Eligibility', 'Certificate', `${cert.studentName} (${cert.id})`);
        return cert;
      }
      return null;
    },
    issue: async (id) => {
      const cert = store.state.certificates.find(c => c.id === id);
      if (cert) {
        cert.status = 'Issued';
        cert.issueDate = new Date().toISOString().split('T')[0];
        if (!cert.verificationId || cert.verificationId.includes('Pending') || cert.verificationId.includes('Reserved') || cert.verificationId.includes('Unissued')) {
          const code = cert.tierName?.toUpperCase().includes('FOUND') ? 'FND' : cert.tierName?.toUpperCase().includes('BUILD') ? 'BLD' : cert.tierName?.toUpperCase().includes('CREAT') ? 'CRT' : 'ARC';
          cert.verificationId = `NEX-${code}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (!cert.internalNotes) cert.internalNotes = [];
        cert.internalNotes.push({
          text: `Credential issued and assigned verification ID: ${cert.verificationId}`,
          author: 'System Registrar',
          date: new Date().toISOString()
        });
        store.saveState();
        auditRepository.log('Issued Certificate Credential', 'Certificate', `${cert.studentName} (${cert.verificationId})`);
        return cert;
      }
      return null;
    },
    revoke: async (id, reason) => {
      const cert = store.state.certificates.find(c => c.id === id);
      if (cert) {
        cert.status = 'Revoked';
        cert.eligibilityStatus = 'Disqualified / Revoked';
        if (!cert.internalNotes) cert.internalNotes = [];
        cert.internalNotes.push({
          text: `Credential revoked: ${reason || 'Administrative action'}`,
          author: 'Compliance Directorate',
          date: new Date().toISOString()
        });
        store.saveState();
        auditRepository.log('Revoked Certificate Credential', 'Certificate', `${cert.studentName} (${cert.verificationId}) - Reason: ${reason || 'Administrative action'}`);
        return cert;
      }
      return null;
    },
    addNote: async (id, noteText, author) => {
      const cert = store.state.certificates.find(c => c.id === id);
      if (cert) {
        if (!cert.internalNotes) cert.internalNotes = [];
        cert.internalNotes.push({
          text: noteText,
          author: author || 'Academic Staff',
          date: new Date().toISOString()
        });
        store.saveState();
        auditRepository.log('Added Certificate Audit Note', 'Certificate', `${cert.studentName} (${cert.id})`);
        return cert;
      }
      return null;
    }
  };

  // --- supportRepository ---
  const supportRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.supportTickets)),
    findById: async (id) => {
      const t = store.state.supportTickets.find(t => t.id === id);
      return t ? JSON.parse(JSON.stringify(t)) : null;
    },
    reply: async (id, replyText, sender) => {
      const ticket = store.state.supportTickets.find(t => t.id === id);
      if (ticket) {
        ticket.messages.push({
          sender: sender || 'Support Desk',
          timestamp: new Date().toISOString(),
          text: replyText
        });
        ticket.lastUpdated = new Date().toISOString();
        store.saveState();
        return true;
      }
      return false;
    },
    updateTicket: async (id, updates) => {
      const ticket = store.state.supportTickets.find(t => t.id === id);
      if (ticket) {
        Object.assign(ticket, updates);
        ticket.lastUpdated = new Date().toISOString();
        store.saveState();
        auditRepository.log('Updated Support Ticket', 'Support', `${ticket.ticketRef} (${ticket.status})`);
        return ticket;
      }
      return null;
    }
  };

  // --- analyticsRepository ---
  const analyticsRepository = {
    getOverview: async () => JSON.parse(JSON.stringify(store.state.analytics))
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
    findAll: async () => JSON.parse(JSON.stringify(store.state.auditLogs)),
    findById: async (id) => {
      const l = store.state.auditLogs.find(log => log.id === id);
      return l ? JSON.parse(JSON.stringify(l)) : null;
    },
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
        notes: `Server-side audit logging will be connected during backend integration.`
      };
      store.state.auditLogs.unshift(entry);
      if (store.state.auditLogs.length > 100) store.state.auditLogs.pop();
      store.saveState();
      return entry;
    }
  };

  // --- settingsRepository ---
  const settingsRepository = {
    get: async () => JSON.parse(JSON.stringify(store.state.settings)),
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
      auditRepository.log('SETTINGS_UPDATED', 'Settings', 'Platform Configuration & Governance', prev, JSON.stringify(newSettings), 'Success');
      return true;
    },
    resetSection: async (sectionKey) => {
      if (defaultSettings[sectionKey]) {
        store.state.settings[sectionKey] = JSON.parse(JSON.stringify(defaultSettings[sectionKey]));
        store.saveState();
        auditRepository.log('SETTINGS_SECTION_RESET', 'Settings', `Reset section: ${sectionKey}`, 'Custom configuration', 'Factory default state restored', 'Success');
        return store.state.settings[sectionKey];
      }
      return null;
    }
  };

  // --- announcementsRepository ---
  const announcementsRepository = {
    findAll: async () => JSON.parse(JSON.stringify(store.state.announcements)),
    findById: async (id) => {
      const a = store.state.announcements.find(item => item.id === id);
      return a ? JSON.parse(JSON.stringify(a)) : null;
    },
    save: async (data) => {
      const idx = store.state.announcements.findIndex(a => a.id === data.id);
      if (idx !== -1) {
        store.state.announcements[idx] = {
          ...store.state.announcements[idx],
          ...data,
          lastUpdated: new Date().toISOString()
        };
        store.saveState();
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
      auditRepository.log('Duplicated Platform Announcement', 'Announcement', clone.title);
      return clone;
    },
    publish: async (id) => {
      const a = store.state.announcements.find(item => item.id === id);
      if (a) {
        a.status = 'Published';
        a.publishedAt = new Date().toISOString();
        store.saveState();
        auditRepository.log('Published Platform Announcement', 'Announcement', a.title);
        return a;
      }
      return null;
    },
    archive: async (id) => {
      const a = store.state.announcements.find(item => item.id === id);
      if (a) {
        a.status = 'Archived';
        store.saveState();
        auditRepository.log('Archived Platform Announcement', 'Announcement', a.title);
        return a;
      }
      return null;
    }
  };

  return {
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
    getCertificates: () => certificateRepository.findAll(),
    getCertificateById: (id) => certificateRepository.findById(id),
    approveCertificate: (id, approver) => certificateRepository.approve(id, approver),
    issueCertificate: (id) => certificateRepository.issue(id),
    revokeCertificate: (id, reason) => certificateRepository.revoke(id, reason),
    addCertificateNote: (id, noteText, author) => certificateRepository.addNote(id, noteText, author),
    issueMockCertificate: (id) => certificateRepository.issue(id),
    revokeMockCertificate: (id) => certificateRepository.revoke(id),
    getSupportTickets: () => supportRepository.findAll(),
    updateSupportTicket: (id, updates) => supportRepository.updateTicket(id, updates),
    addTicketReply: (id, text, sender) => supportRepository.reply(id, text, sender),
    getAnalytics: () => analyticsRepository.getOverview(),
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
    resetSettingsSection: (section) => settingsRepository.resetSection(section)
  };
});
