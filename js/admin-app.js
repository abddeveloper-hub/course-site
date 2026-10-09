/**
 * ============================================================================
 * NEXVION AI — PRODUCTION ADMIN PORTAL CONTROLLER & SPA ROUTER
 * ============================================================================
 * Core administration engine with 22 operational views, role-based access
 * control (RBAC), repository abstraction layer, and reactive management workflows.
 * ============================================================================
 */

(function () {
  'use strict';

  const Services = window.NexvionServices || window.NexvionAdminData;
  if (!Services) {
    console.error('NexvionServices repository layer missing.');
    return;
  }
  const Data = Services;

  // --------------------------------------------------------------------------
  // 1. APPLICATION STATE
  // --------------------------------------------------------------------------
  const AppState = {
    currentRoute: '/admin/overview',
    routeParams: {},
    activeRole: 'Super Admin',
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    hasUnsavedChanges: false,
    studentDirectory: {
      searchTerm: '',
      tierFilter: 'ALL',
      batchFilter: 'ALL',
      statusFilter: 'ALL',
      paymentFilter: 'ALL',
      certFilter: 'ALL',
      sortBy: 'name-asc',
      currentPage: 1,
      pageSize: 10
    },
    activeStudentTab: 'overview',
    activeStudentId: null,
    enrollmentsView: {
      searchTerm: '',
      statusFilter: 'ALL',
      courseFilter: 'ALL'
    },
    modulesView: {
      searchTerm: '',
      courseFilter: 'ALL',
      statusFilter: 'ALL',
      sortBy: 'order-asc',
      currentPage: 1,
      pageSize: 10
    },
    classesView: {
      searchTerm: '',
      courseFilter: 'ALL',
      statusFilter: 'ALL',
      sortBy: 'order-asc',
      currentPage: 1,
      pageSize: 10
    },
    lessonsView: {
      searchTerm: '',
      courseFilter: 'ALL',
      statusFilter: 'ALL',
      sortBy: 'order-asc',
      currentPage: 1,
      pageSize: 10
    },
    videosView: {
      searchTerm: '',
      statusFilter: 'ALL',
      visibilityFilter: 'ALL',
      sortBy: 'title-asc',
      currentPage: 1,
      pageSize: 10
    },
    resourcesView: {
      searchTerm: '',
      typeFilter: 'ALL',
      courseFilter: 'ALL',
      statusFilter: 'ALL',
      sortBy: 'title-asc',
      currentPage: 1,
      pageSize: 10
    },
    projectsView: {
      searchTerm: '',
      courseFilter: 'ALL',
      tierFilter: 'ALL',
      statusFilter: 'ALL',
      requiredFilter: 'ALL',
      sortBy: 'title-asc',
      currentPage: 1,
      pageSize: 10
    },
    assignmentsView: {
      searchTerm: '',
      courseFilter: 'ALL',
      statusFilter: 'ALL',
      requiredFilter: 'ALL',
      sortBy: 'due-asc',
      currentPage: 1,
      pageSize: 10
    },
    submissionsView: {
      searchTerm: '',
      courseFilter: 'ALL',
      batchFilter: 'ALL',
      itemFilter: 'ALL',
      statusFilter: 'ALL',
      reviewerFilter: 'ALL',
      sortBy: 'date-desc',
      currentPage: 1,
      pageSize: 10
    },
    activeProjectId: null,
    activeAssignmentId: null,
    activeSubmissionId: null,
    announcementsView: {
      searchTerm: '',
      audienceFilter: 'ALL',
      statusFilter: 'ALL',
      priorityFilter: 'ALL',
      sortBy: 'date-desc',
      currentPage: 1,
      pageSize: 10
    },
    notificationsView: {
      searchTerm: '',
      typeFilter: 'ALL',
      statusFilter: 'ALL',
      sortBy: 'date-desc',
      currentPage: 1,
      pageSize: 10
    },
    announcementComposer: {
      id: null,
      title: '',
      message: '',
      richContent: '',
      audience: 'All Students',
      targetCourseId: '',
      targetTierId: '',
      targetBatchId: '',
      priority: 'Normal',
      status: 'Draft',
      publishDate: '',
      scheduledDate: '',
      author: 'Super Admin',
      activeTab: 'write'
    },
    notificationComposer: {
      title: '',
      message: '',
      type: 'New class',
      audience: 'All Enrolled Students',
      courseId: '',
      tierId: '',
      batchId: '',
      channels: ['In-App', 'Push Notification'],
      scheduleMode: 'immediate',
      scheduledFor: ''
    },
    paymentsView: {
      searchTerm: '',
      courseFilter: 'ALL',
      tierFilter: 'ALL',
      statusFilter: 'ALL',
      dateRangeFilter: 'ALL',
      sortBy: 'date-desc',
      currentPage: 1,
      pageSize: 10
    },
    certificatesView: {
      searchTerm: '',
      courseFilter: 'ALL',
      tierFilter: 'ALL',
      statusFilter: 'ALL',
      eligibilityFilter: 'ALL',
      sortBy: 'name-asc',
      currentPage: 1,
      pageSize: 10
    },
    activePaymentId: null,
    activeCertificateId: null,
    adminsView: {
      searchTerm: '',
      statusFilter: 'ALL',
      roleFilter: 'ALL',
      sortBy: 'name-asc',
      currentPage: 1,
      pageSize: 10
    },
    rolesView: {
      selectedRoleId: null,
      matrixSearchTerm: '',
      categoryFilter: 'ALL'
    },
    auditLogsView: {
      searchTerm: '',
      dateRangeFilter: 'ALL',
      adminFilter: 'ALL',
      actionFilter: 'ALL',
      entityFilter: 'ALL',
      viewMode: 'table',
      sortBy: 'timestamp-desc',
      currentPage: 1,
      pageSize: 10
    },
    settingsView: {
      activeTab: 'platform',
      dirty: false,
      saving: false
    },
    activeAdminId: null,
    activeRoleId: null,
    activeAuditLogId: null
  };

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENT REFS
  // --------------------------------------------------------------------------
  const DOM = {
    layout: null,
    sidebar: null,
    backdrop: null,
    content: null,
    breadcrumbCurrent: null,
    roleSelect: null,
    toastContainer: null,
    modalBackdrop: null,
    modalTitle: null,
    modalBody: null,
    modalFooter: null,
    drawerBackdrop: null,
    drawerTitle: null,
    drawerBody: null
  };

  // --------------------------------------------------------------------------
  // 3. ROUTER & NAVIGATION
  // --------------------------------------------------------------------------
  function parseCurrentPath() {
    let path = window.location.pathname;
    if (window.location.hash && window.location.hash.startsWith('#/admin')) {
      path = window.location.hash.slice(1);
    }
    if (path === '/admin' || path === '/admin/' || path === '/admin.html') {
      return '/admin/overview';
    }
    return path;
  }

  function navigateTo(path, pushHistory = true) {
    if (AppState.hasUnsavedChanges) {
      if (!confirm('You have unsaved changes in the editor. Leave without saving?')) {
        return;
      }
      AppState.hasUnsavedChanges = false;
    }

    if (pushHistory) {
      window.history.pushState(null, '', path);
    }

    AppState.currentRoute = path;
    closeMobileSidebar();
    updateSidebarActiveState(path);
    renderRoute(path);
  }

  const ROUTE_PERMISSIONS = {
    '/admin/overview': 'view_dashboard',
    '/admin/courses': 'manage_courses',
    '/admin/tiers': 'manage_tiers',
    '/admin/batches': 'manage_batches',
    '/admin/classes': 'manage_classes',
    '/admin/modules': 'manage_modules',
    '/admin/lessons': 'manage_lessons',
    '/admin/videos': 'manage_videos',
    '/admin/resources': 'manage_resources',
    '/admin/projects': 'manage_projects',
    '/admin/assignments': 'manage_assignments',
    '/admin/students': 'manage_students',
    '/admin/enrollments': 'manage_enrollments',
    '/admin/certificates': 'manage_certificates',
    '/admin/submissions': 'manage_assignments',
    '/admin/announcements': 'manage_announcements',
    '/admin/notifications': 'send_notifications',
    '/admin/support': 'manage_support',
    '/admin/payments': 'view_payments',
    '/admin/analytics': 'view_analytics',
    '/admin/admins': 'manage_admins',
    '/admin/roles': 'manage_roles',
    '/admin/audit-logs': 'view_audit_logs',
    '/admin/settings': 'manage_settings'
  };

  function updateSidebarActiveState(path) {
    document.querySelectorAll('.adm-nav-item').forEach(el => {
      const route = el.getAttribute('data-route');
      if (route && (path === route || (route !== '/admin/overview' && path.startsWith(route)))) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }

      // Permission awareness
      const reqPerm = ROUTE_PERMISSIONS[route];
      if (reqPerm) {
        const hasAccess = Data.hasPermission ? Data.hasPermission(reqPerm) : true;
        if (!hasAccess) {
          el.classList.add('adm-nav-restricted');
          el.setAttribute('title', `Access restricted for role: ${AppState.activeRole} (Requires: ${reqPerm})`);
        } else {
          el.classList.remove('adm-nav-restricted');
          el.removeAttribute('title');
        }
      }
    });

    // Update Breadcrumbs
    if (DOM.breadcrumbCurrent) {
      const parts = path.split('/').filter(Boolean);
      const label = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).replace('-', ' ') : 'Overview';
      DOM.breadcrumbCurrent.textContent = label;
    }
  }

  // --------------------------------------------------------------------------
  // 4. TOAST, MODAL & DRAWER ENGINE
  // --------------------------------------------------------------------------
  function showToast(title, message, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `adm-toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <div class="adm-toast-icon">${icon}</div>
      <div class="adm-toast-content">
        <h4 class="adm-toast-title">${title}</h4>
        <p class="adm-toast-msg">${message}</p>
      </div>
      <button class="adm-toast-close" aria-label="Dismiss">&times;</button>
    `;
    toast.querySelector('.adm-toast-close').addEventListener('click', () => toast.remove());
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4500);
  }

  function openModal(title, bodyHtml, footerHtml) {
    DOM.modalTitle.textContent = title;
    DOM.modalBody.innerHTML = bodyHtml;
    DOM.modalFooter.innerHTML = footerHtml || `
      <button class="adm-btn adm-btn-secondary" id="modalCancelBtn">Close</button>
    `;
    const cancelBtn = DOM.modalFooter.querySelector('#modalCancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    DOM.modalBackdrop.classList.add('active');
  }

  function closeModal() {
    DOM.modalBackdrop.classList.remove('active');
  }

  function openDrawer(title, bodyHtml) {
    DOM.drawerTitle.textContent = title;
    DOM.drawerBody.innerHTML = bodyHtml;
    DOM.drawerBackdrop.classList.add('active');
  }

  function closeDrawer() {
    DOM.drawerBackdrop.classList.remove('active');
  }

  function toggleMobileSidebar() {
    AppState.mobileSidebarOpen = !AppState.mobileSidebarOpen;
    if (AppState.mobileSidebarOpen) {
      DOM.sidebar.classList.add('mobile-open');
      DOM.backdrop.classList.add('active');
    } else {
      closeMobileSidebar();
    }
  }

  function closeMobileSidebar() {
    AppState.mobileSidebarOpen = false;
    if (DOM.sidebar) DOM.sidebar.classList.remove('mobile-open');
    if (DOM.backdrop) DOM.backdrop.classList.remove('active');
  }

  function toggleSidebarCollapse() {
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
    if (AppState.sidebarCollapsed) {
      DOM.layout.classList.add('sidebar-collapsed');
    } else {
      DOM.layout.classList.remove('sidebar-collapsed');
    }
  }

  // --------------------------------------------------------------------------
  // 5. SHARED PRODUCTION COMPONENTS (PHASE 1 SPECIFICATION)
  // --------------------------------------------------------------------------
  const AdminComponents = {
    // 1. PageHeader
    PageHeader: ({ title, description, actions = '', badge = '' }) => `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>${title}</span>
            ${badge ? `<span class="adm-badge adm-badge-published">${badge}</span>` : ''}
          </h1>
          ${description ? `<p class="adm-page-desc">${description}</p>` : ''}
        </div>
        ${actions ? `<div class="adm-header-actions">${actions}</div>` : ''}
      </div>
    `,

    // 2. StatCard
    StatCard: ({ label, value, change = '', changeType = 'up', subtext = '', icon = '' }) => `
      <div class="adm-card adm-stat-card">
        <div class="adm-stat-top">
          <span class="adm-stat-label">${label}</span>
          ${icon ? `<span class="adm-stat-icon">${icon}</span>` : ''}
        </div>
        <div class="adm-stat-value-row">
          <span class="adm-stat-value">${value}</span>
          ${change ? `<span class="adm-stat-delta ${changeType === 'down' ? 'down' : 'up'}">${change}</span>` : ''}
        </div>
        ${subtext ? `<div class="adm-stat-sub">${subtext}</div>` : ''}
      </div>
    `,

    // 3. DataTable
    DataTable: ({ id = '', headers = [], rows = [], emptyMessage = 'No records found' }) => `
      <div class="adm-table-wrap">
        <table class="adm-table" ${id ? `id="${id}"` : ''}>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows.join('') : `
              <tr>
                <td colspan="${headers.length}" style="text-align:center; padding:32px; color:var(--adm-text-muted);">
                  ${emptyMessage}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `,

    // 4. FilterBar
    FilterBar: ({ searchId = '', searchPlaceholder = 'Search...', onSearch = '', filters = [], actions = '', meta = '' }) => `
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          ${searchId ? `
            <input type="text" class="adm-input" id="${searchId}" placeholder="${searchPlaceholder}" style="min-width:200px;" oninput="${onSearch}">
          ` : ''}
          ${filters.map(f => `
            <select class="adm-select" id="${f.id}" onchange="${f.onChange}">
              ${f.options.map(opt => `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          `).join('')}
        </div>
        <div class="adm-filter-group">
          ${meta ? `<span style="font-size:0.75rem; color:var(--adm-text-muted);">${meta}</span>` : ''}
          ${actions}
        </div>
      </div>
    `,

    // 5. StatusBadge
    StatusBadge: ({ status }) => {
      const s = String(status || '').toUpperCase();
      let badgeClass = 'adm-badge-draft';
      if (['OPEN', 'ACTIVE', 'PUBLISHED', 'PAID', 'ELIGIBLE', 'ENROLLED', 'REQUIRED', 'ISSUED'].includes(s)) badgeClass = 'adm-badge-published';
      else if (['FULL'].includes(s)) badgeClass = 'adm-badge-full';
      else if (s === 'MANUAL REVIEW') badgeClass = 'adm-badge-manual-review';
      else if (s === 'REFUNDED') badgeClass = 'adm-badge-refunded';
      else if (s === 'REVOKED') badgeClass = 'adm-badge-revoked';
      else if (s === 'NOT ELIGIBLE') badgeClass = 'adm-badge-not-eligible';
      else if (s === 'NOT REQUIRED') badgeClass = 'adm-badge-not-required';
      else if (['WAITLIST', 'WAITLISTED', 'PENDING'].includes(s)) badgeClass = 'adm-badge-waitlist';
      else if (s === 'PENDING APPROVAL' || s === 'PENDING REVIEW') badgeClass = 'adm-badge-pending-review';
      else if (s === 'REVIEWED') badgeClass = 'adm-badge-reviewed';
      else if (s === 'RETURNED FOR REVISION') badgeClass = 'adm-badge-revision';
      else if (s === 'APPROVED') badgeClass = 'adm-badge-approved';
      else if (s === 'LOCKED') badgeClass = 'adm-badge-waitlist';
      else if (['FAILED', 'ERROR'].includes(s)) badgeClass = 'adm-deliv-failed';
      else if (['UPCOMING', 'SCHEDULED'].includes(s)) badgeClass = 'adm-deliv-scheduled';
      else if (['QUEUED'].includes(s)) badgeClass = 'adm-deliv-queued';
      else if (['SENT', 'DELIVERED'].includes(s)) badgeClass = 'adm-deliv-sent';
      else if (['COMPLETED'].includes(s)) badgeClass = 'adm-badge-open';
      else if (['CANCELLED'].includes(s)) badgeClass = 'adm-deliv-cancelled';
      else if (s === 'ACTIVE') badgeClass = 'adm-badge-admin-active';
      else if (s === 'INVITED') badgeClass = 'adm-badge-admin-invited';
      else if (s === 'SUSPENDED') badgeClass = 'adm-badge-admin-suspended';
      else if (s === 'INACTIVE') badgeClass = 'adm-badge-admin-inactive';
      else if (s === 'ARCHIVED' || s === 'CLOSED' || s === 'REJECTED') badgeClass = 'adm-badge-archived';
      else if (s === 'FREE') badgeClass = 'adm-badge-open';
      else if (s.includes('COMING SOON')) badgeClass = 'adm-badge-price-coming-soon';

      return `<span class="adm-badge ${badgeClass}"><span class="adm-badge-dot"></span>${status}</span>`;
    },

    PriorityBadge: ({ priority }) => {
      const p = String(priority || 'Normal').toLowerCase();
      let cls = 'adm-priority-normal';
      if (p === 'low') cls = 'adm-priority-low';
      else if (p === 'high') cls = 'adm-priority-high';
      else if (p === 'urgent') cls = 'adm-priority-urgent';
      return `<span class="adm-badge ${cls}"><span class="adm-badge-dot"></span>${priority || 'Normal'}</span>`;
    },

    DeliveryBadge: ({ status }) => {
      const s = String(status || 'Sent').toLowerCase();
      let cls = 'adm-deliv-sent';
      if (s === 'draft') cls = 'adm-deliv-draft';
      else if (s === 'scheduled') cls = 'adm-deliv-scheduled';
      else if (s === 'queued') cls = 'adm-deliv-queued';
      else if (s === 'failed') cls = 'adm-deliv-failed';
      else if (s === 'cancelled') cls = 'adm-deliv-cancelled';
      return `<span class="adm-badge ${cls}"><span class="adm-badge-dot"></span>${status || 'Sent'}</span>`;
    },

    // 6. Modal
    Modal: (title, bodyHtml, footerHtml = '') => {
      openModal(title, bodyHtml, footerHtml);
    },

    // 7. ConfirmDialog
    ConfirmDialog: ({ title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, isDestructive = false }) => {
      const body = `<p style="color:var(--adm-text-secondary); margin:0; font-size:0.88rem; line-height:1.5;">${message}</p>`;
      const footer = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">${cancelText}</button>
        <button class="adm-btn ${isDestructive ? 'adm-btn-danger' : 'adm-btn-primary'}" id="admConfirmDialogActionBtn">${confirmText}</button>
      `;
      openModal(title, body, footer);
      setTimeout(() => {
        const btn = document.getElementById('admConfirmDialogActionBtn');
        if (btn) {
          btn.onclick = () => {
            closeModal();
            if (typeof onConfirm === 'function') onConfirm();
          };
        }
      }, 30);
    },

    // 8. EmptyState
    EmptyState: ({ icon = '📂', title = 'No items found', message = 'There are no records matching your criteria.', actionText = '', onAction = '' }) => `
      <div class="adm-state-box">
        <div class="adm-state-icon">${icon}</div>
        <h3 class="adm-state-title">${title}</h3>
        <p class="adm-state-desc">${message}</p>
        ${actionText ? `<button class="adm-btn adm-btn-primary" onclick="${onAction}()">${actionText}</button>` : ''}
      </div>
    `,

    // 9. LoadingState
    LoadingState: (message = 'Loading operational telemetry...') => `
      <div class="adm-state-box">
        <div class="adm-spinner"></div>
        <h3 class="adm-state-title">${message}</h3>
        <p class="adm-state-desc">Synchronizing platform state and repository data.</p>
      </div>
    `,

    // 10. ErrorState
    ErrorState: ({ title = 'Operational Diagnostics Warning', message = 'Unable to synchronize this view.', onRetry = 'location.reload()' }) => `
      <div class="adm-state-box">
        <div class="adm-state-icon">⚠️</div>
        <h3 class="adm-state-title" style="color:var(--adm-error);">${title}</h3>
        <p class="adm-state-desc">${message}</p>
        <button class="adm-btn adm-btn-secondary" onclick="${onRetry}">Retry Telemetry Connection</button>
      </div>
    `,

    // 11. Toast
    Toast: (title, message, type = 'info') => {
      showToast(title, message, type);
    }
  };

  window.AdminComponents = AdminComponents;

  function renderEmptyState(title, message, actionText, actionFnName) {
    return AdminComponents.EmptyState({ icon: '📂', title, message, actionText, onAction: actionFnName });
  }

  function renderPermissionGate(permissionName) {
    return `
      <div class="adm-state-box adm-perm-gate" style="max-width: 680px; margin: 40px auto; padding: 36px; background: var(--adm-surface-card); border: 1px solid var(--adm-border); border-radius: var(--adm-radius-lg); box-shadow: var(--adm-shadow-md); text-align: center;">
        <div class="adm-state-icon" style="font-size: 3rem; margin-bottom: 12px;">🔒</div>
        <h3 class="adm-state-title" style="font-size: 1.35rem; color: var(--adm-text-primary); margin: 0 0 8px;">Access Restricted by Policy</h3>
        <p class="adm-state-desc" style="color: var(--adm-text-secondary); font-size: 0.9rem; line-height: 1.5; margin: 0 0 16px;">
          Your current active administrative role (<strong>${AppState.activeRole}</strong>) does not have the <code>${permissionName}</code> capability enabled in the permissions matrix.
        </p>

        <!-- Prominent Security Notice Requirement -->
        <div class="adm-security-banner" style="text-align: left; margin: 16px 0 24px;">
          <div class="adm-security-banner-icon">🛡️</div>
          <div class="adm-security-banner-content">
            <h4 class="adm-security-banner-title">Architectural Security Boundary Notice</h4>
            <p class="adm-security-banner-desc">
              Frontend permissions are an interface affordance and do not constitute a secure perimeter. They do not protect data from direct network inspection or tampering.
              <strong>Actual production authorization must be enforced by Firebase Authentication, custom user claims, Firestore Security Rules, and trusted backend Cloud Functions / microservices.</strong>
            </p>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/overview')">Return to Dashboard</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.navigateTo('/admin/roles')">Inspect Permissions Matrix</button>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 6. ROUTE VIEW RENDERERS
  // --------------------------------------------------------------------------

  // --- ROUTE: OVERVIEW DASHBOARD ---
  async function renderOverviewView() {
    const analytics = await Data.getAnalytics();
    const courses = await Data.getCourses();
    const batches = await Data.getBatches();
    const enrollments = await Data.getEnrollments();
    const support = await Data.getSupportTickets();
    const announcements = await Data.getAnnouncements();

    const stats = analytics.overview;

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Admin Overview</span>
            <span class="adm-proto-pill"><span class="adm-proto-pulse"></span> OPERATIONAL</span>
          </h1>
          <p class="adm-page-desc">Manage the NEXVION AI learning platform and student pipeline.</p>
        </div>
        <div class="adm-header-actions">
          <select class="adm-select" id="overviewDateRange">
            <option>Today</option>
            <option>Last 7 days</option>
            <option selected>Last 30 days</option>
            <option>This year</option>
          </select>
          <button class="adm-btn adm-btn-secondary" id="btnExportOverview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <button class="adm-btn adm-btn-primary" id="btnRefreshOverview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="adm-quick-actions-bar">
        <span style="font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); text-transform:uppercase;">Quick Actions:</span>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.openCreateCourseModal()">+ Create Course</button>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.openCreateBatchModal()">+ Create Batch (Cap 30)</button>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.openAddStudentModal()">+ Add Student</button>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.navigateTo('/admin/announcements')">📢 Publish Announcement</button>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.navigateTo('/admin/notifications')">⚡ Send Notification</button>
        <button class="adm-quick-chip" onclick="NexvionAdminApp.navigateTo('/admin/enrollments')">📋 Review Enrollments (${stats.pendingEnrollments})</button>
      </div>

      <!-- 8 Summary Cards -->
      <div class="adm-stats-grid">
        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Total Students</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(127,82,255,0.15); color:#7F52FF;">👥</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${stats.totalStudents.toLocaleString()}</span>
            <span class="adm-stat-delta up">↑ 14.2%</span>
          </div>
          <span class="adm-stat-sub">Across 4 curriculum tiers</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Active Students</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(0,210,180,0.15); color:#00D2B4;">🟢</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${stats.activeStudents.toLocaleString()}</span>
            <span class="adm-stat-delta up">↑ 8.6%</span>
          </div>
          <span class="adm-stat-sub">Weekly active learner velocity</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Pending Enrollments</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(245,158,11,0.15); color:#F59E0B;">⏳</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${stats.pendingEnrollments}</span>
            <span class="adm-stat-delta down">Requires Review</span>
          </div>
          <span class="adm-stat-sub">Awaiting admin sign-off</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Active Courses</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(199,87,188,0.15); color:#C757BC;">📚</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${courses.length}</span>
            <span class="adm-stat-delta up">4 Exact Tiers</span>
          </div>
          <span class="adm-stat-sub">All levels operational</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Open Batches</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(16,185,129,0.15); color:#10B981;">🏛️</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${batches.filter(b => b.status === 'OPEN').length}</span>
            <span class="adm-stat-delta up">Cap: 30 / batch</span>
          </div>
          <span class="adm-stat-sub">${batches.length} total cohorts configured</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Waitlisted Students</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(239,68,68,0.15); color:#EF4444;">🛡️</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${stats.waitlistedStudents}</span>
            <span class="adm-stat-delta down">Overflow Queue</span>
          </div>
          <span class="adm-stat-sub">Strict 30-capacity overflow</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Upcoming Classes</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(59,130,246,0.15); color:#3B82F6;">📡</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${stats.upcomingClasses}</span>
            <span class="adm-stat-delta up">This Month</span>
          </div>
          <span class="adm-stat-sub">Live sessions scheduled</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Pending Support</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(148,163,184,0.15); color:#94A3B8;">🎫</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${support.filter(t => t.status === 'Open').length}</span>
            <span class="adm-stat-delta down">${support.length} total</span>
          </div>
          <span class="adm-stat-sub">Student tickets in triage</span>
        </div>
      </div>

      <!-- Dashboard Sections: 2-Column Grid -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 24px; margin-bottom: 24px;">
        
        <!-- 1. Enrollment Overview Chart -->
        <div class="adm-card">
          <div class="adm-card-header">
            <div>
              <h3 class="adm-card-title">Enrollment Velocity by Tier</h3>
              <p class="adm-card-desc">Weekly student onboarding across four tiers</p>
            </div>
            <span class="adm-badge adm-badge-published">Active Telemetry</span>
          </div>
          <div style="padding: 10px 0;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-secondary);">
              <span><span>■</span> Foundations (Free)</span>
              <span><span>■</span> Builder</span>
              <span><span>■</span> Creator</span>
              <span><span>■</span> Architect</span>
            </div>
            <!-- Enrollment SVG Bar Chart -->
            <svg viewBox="0 0 500 160" width="100%" height="160" style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:10px;">
              <line x1="40" y1="130" x2="480" y2="130" stroke="#E2E8F0" stroke-width="1"/>
              <line x1="40" y1="80" x2="480" y2="80" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3"/>
              <line x1="40" y1="30" x2="480" y2="30" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3"/>
              
              <!-- Week 1 to 6 bars -->
              <g transform="translate(60, 0)">
                <rect x="0" y="80" width="10" height="50" fill="#7F52FF" rx="2"/>
                <rect x="12" y="90" width="10" height="40" fill="#C757BC" rx="2"/>
                <rect x="24" y="105" width="10" height="25" fill="#00D2B4" rx="2"/>
                <rect x="36" y="115" width="10" height="15" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W1</text>
              </g>
              <g transform="translate(130, 0)">
                <rect x="0" y="65" width="10" height="65" fill="#7F52FF" rx="2"/>
                <rect x="12" y="80" width="10" height="50" fill="#C757BC" rx="2"/>
                <rect x="24" y="98" width="10" height="32" fill="#00D2B4" rx="2"/>
                <rect x="36" y="110" width="10" height="20" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W2</text>
              </g>
              <g transform="translate(200, 0)">
                <rect x="0" y="45" width="10" height="85" fill="#7F52FF" rx="2"/>
                <rect x="12" y="62" width="10" height="68" fill="#C757BC" rx="2"/>
                <rect x="24" y="85" width="10" height="45" fill="#00D2B4" rx="2"/>
                <rect x="36" y="102" width="10" height="28" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W3</text>
              </g>
              <g transform="translate(270, 0)">
                <rect x="0" y="32" width="10" height="98" fill="#7F52FF" rx="2"/>
                <rect x="12" y="48" width="10" height="82" fill="#C757BC" rx="2"/>
                <rect x="24" y="70" width="10" height="60" fill="#00D2B4" rx="2"/>
                <rect x="36" y="94" width="10" height="36" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W4</text>
              </g>
              <g transform="translate(340, 0)">
                <rect x="0" y="20" width="10" height="110" fill="#7F52FF" rx="2"/>
                <rect x="12" y="36" width="10" height="94" fill="#C757BC" rx="2"/>
                <rect x="24" y="58" width="10" height="72" fill="#00D2B4" rx="2"/>
                <rect x="36" y="86" width="10" height="44" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W5</text>
              </g>
              <g transform="translate(410, 0)">
                <rect x="0" y="10" width="10" height="120" fill="#7F52FF" rx="2"/>
                <rect x="12" y="25" width="10" height="105" fill="#C757BC" rx="2"/>
                <rect x="24" y="46" width="10" height="84" fill="#00D2B4" rx="2"/>
                <rect x="36" y="78" width="10" height="52" fill="#F59E0B" rx="2"/>
                <text x="24" y="145" fill="#494455" font-size="9" text-anchor="middle">W6</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- 2. Batch Capacity Utilization (Strict 30 Cap) -->
        <div class="adm-card">
          <div class="adm-card-header">
            <div>
              <h3 class="adm-card-title">Cohort Seat Allocation (Max 30)</h3>
              <p class="adm-card-desc">Invariant: Every batch hard-capped at 30 seats</p>
            </div>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/batches')">View All</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${batches.slice(0, 5).map(b => {
              const pct = Math.round((b.enrolledCount / 30) * 100);
              const fillClass = b.enrolledCount >= 30 ? 'full' : b.enrolledCount >= 25 ? 'few' : 'open';
              const badgeClass = b.status === 'FULL' ? 'adm-badge-full' : b.status === 'WAITLIST' ? 'adm-badge-waitlist' : 'adm-badge-open';
              return `
                <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:8px; border:1px solid var(--adm-border);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div>
                      <strong style="font-size:0.84rem; color:var(--adm-text-primary);">${b.name}</strong>
                      <span style="font-size:0.72rem; color:var(--adm-text-secondary); margin-left:6px;">(${b.tierName})</span>
                    </div>
                    <span class="adm-badge ${badgeClass}"><span class="adm-badge-dot"></span>${b.status}</span>
                  </div>
                    <span class="adm-badge ${badgeClass}"><span class="adm-badge-dot"></span>${b.status}</span>
                  </div>
                  <div class="adm-capacity-bar-wrap" style="width:100%;">
                    <div class="adm-capacity-text">
                      <span>${b.enrolledCount} / 30 seats filled</span>
                      <span>${30 - b.enrolledCount} seats available ${b.waitlistCount > 0 ? `• Waitlist: ${b.waitlistCount}` : ''}</span>
                    </div>
                    <div class="adm-capacity-track">
                      <div class="adm-capacity-fill ${fillClass}" style="width:${pct}%"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

      <!-- 3. Commercial Operations & System Alerts -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
        
        <!-- Commercial Operations Container -->
        <div class="adm-card">
          <div class="adm-card-header">
            <div>
              <h3 class="adm-card-title">Commercial Operations Summary</h3>
              <p class="adm-card-desc">Payment processing is not yet connected. Tier pricing and billing ledger status.</p>
            </div>
            <span class="adm-badge adm-badge-price-coming-soon">GATEWAY PENDING</span>
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-bottom:16px;">
            <div style="background:var(--adm-surface-elevated); padding:14px; border-radius:8px; border:1px solid var(--adm-border);">
              <span style="font-size:0.72rem; color:var(--adm-text-secondary); text-transform:uppercase;">Course Pricing</span>
              <h4 style="margin:4px 0; font-size:1.15rem; color:var(--adm-text-primary);">PRICE COMING SOON</h4>
              <span style="font-size:0.7rem; color:var(--adm-text-muted);">Paid tiers: Builder, Creator, Architect</span>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:14px; border-radius:8px; border:1px solid var(--adm-border);">
              <span style="font-size:0.72rem; color:var(--adm-text-secondary); text-transform:uppercase;">Foundations Tier</span>
              <h4 style="margin:4px 0; font-size:1.15rem; color:var(--adm-success);">100% FREE</h4>
              <span style="font-size:0.7rem; color:var(--adm-text-muted);">Public access community tier</span>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:14px; border-radius:8px; border:1px solid var(--adm-border);">
              <span style="font-size:0.72rem; color:var(--adm-text-secondary); text-transform:uppercase;">Billing Records</span>
              <h4 style="margin:4px 0; font-size:1.15rem; color:var(--adm-text-primary);">5 Staged Invoices</h4>
              <span style="font-size:0.7rem; color:var(--adm-text-muted);">Awaiting payment gateway hook</span>
            </div>
          </div>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/payments')">Open Payments Table →</button>
        </div>

        <!-- System Alerts & Actions -->
        <div class="adm-card">
          <div class="adm-card-header">
            <h3 class="adm-card-title">System Alerts</h3>
            <span class="adm-badge adm-badge-waitlist">3 Warnings</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:10px; background:rgba(245,158,11,0.08); border-left:3px solid #F59E0B; border-radius:4px; font-size:0.78rem;">
              <strong style="color:#FBBF24;">Batch Delta Full (30/30)</strong>
              <p style="margin:2px 0 0; color:var(--adm-text-secondary);">19 students waiting in Creator Delta waitlist queue.</p>
            </div>
            <div style="padding:10px; background:rgba(59,130,246,0.08); border-left:3px solid #3B82F6; border-radius:4px; font-size:0.78rem;">
              <strong style="color:#60A5FA;">5 Certificates Pending Sign-off</strong>
              <p style="margin:2px 0 0; color:var(--adm-text-secondary);">Students completed all requirements in Foundations.</p>
            </div>
            <div style="padding:10px; background:rgba(127,82,255,0.08); border-left:3px solid #7F52FF; border-radius:4px; font-size:0.78rem;">
              <strong style="color:#C084FC;">Class 04 Video Processing</strong>
              <p style="margin:2px 0 0; color:var(--adm-text-secondary);">Transcoder pipeline 78% finished.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. Recent Enrollments & Support Requests -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 24px;">
        
        <!-- Recent Enrollments Table -->
        <div class="adm-card">
          <div class="adm-card-header">
            <div>
              <h3 class="adm-card-title">Recent Enrollments</h3>
              <p class="adm-card-desc">Latest student applications across all batches</p>
            </div>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/enrollments')">View All</button>
          </div>
          <div class="adm-table-wrap">
            <table class="adm-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course / Tier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${enrollments.slice(0, 4).map(e => `
                  <tr>
                    <td>
                      <strong>${e.studentName}</strong>
                      <div style="font-size:0.7rem; color:var(--adm-text-muted);">${e.email}</div>
                    </td>
                    <td>
                      <div>${e.courseTitle.split(':')[0]}</div>
                      <div style="font-size:0.7rem; color:var(--adm-text-secondary);">${e.batchName}</div>
                    </td>
                    <td>
                      <span class="adm-badge ${e.status === 'Enrolled' ? 'adm-badge-open' : e.status === 'Waitlisted' ? 'adm-badge-waitlist' : 'adm-badge-upcoming'}">
                        ${e.status}
                      </span>
                    </td>
                    <td>
                      ${e.status === 'Pending' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.approveEnrollment('${e.id}')">Approve</button>
                      ` : `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/enrollments')">Inspect</button>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Support Tickets -->
        <div class="adm-card">
          <div class="adm-card-header">
            <div>
              <h3 class="adm-card-title">Recent Support Inquiries</h3>
              <p class="adm-card-desc">Active tickets requiring attention</p>
            </div>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/support')">Support Desk</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${support.slice(0, 3).map(s => `
              <div style="background:var(--adm-surface-elevated); padding:12px; border-radius:8px; border:1px solid var(--adm-border); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-family:var(--adm-font-mono); font-size:0.72rem; color:var(--adm-tertiary);">${s.ticketRef}</span>
                    <span class="adm-badge ${s.status === 'Open' ? 'adm-badge-waitlist' : 'adm-badge-published'}">${s.status}</span>
                  </div>
                  <h4 style="margin:4px 0 2px; font-size:0.84rem; color:var(--adm-text-primary);">${s.subject}</h4>
                  <span style="font-size:0.72rem; color:var(--adm-text-secondary);">${s.studentName} • Category: ${s.category}</span>
                </div>
                <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openTicketDrawer('${s.id}')">Reply</button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Bind Overview Header Buttons
    document.getElementById('btnExportOverview')?.addEventListener('click', () => {
      showToast('Export Generated', 'Operational overview data exported to CSV format.', 'success');
    });

    document.getElementById('btnRefreshOverview')?.addEventListener('click', () => {
      showToast('Refreshing Operational Telemetry...', 'Fetching latest cohort seats and student progress.', 'info');
      setTimeout(() => renderOverviewView(), 400);
    });
  }

  // --- ROUTE: COURSES LIST ---
  async function renderCoursesView() {
    const courses = await Data.getCourses();
    const tiers = await Data.getTiers();

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">Course Management</h1>
          <p class="adm-page-desc">Manage curriculum, learning outcomes, certificate criteria, and publishing states.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateCourseModal()">
            + Create New Course
          </button>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          <input type="text" class="adm-input" id="courseSearch" placeholder="Search courses..." style="width:220px;" oninput="NexvionAdminApp.filterCoursesTable()">
          <select class="adm-select" id="courseTierFilter" onchange="NexvionAdminApp.filterCoursesTable()">
            <option value="ALL">All Tiers (4)</option>
            <option value="ai-foundations">AI Foundations</option>
            <option value="ai-builder">AI Builder</option>
            <option value="ai-creator">AI Creator</option>
            <option value="ai-architect">AI Architect</option>
          </select>
          <select class="adm-select" id="courseStatusFilter" onchange="NexvionAdminApp.filterCoursesTable()">
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
        <div class="adm-filter-group">
          <span style="font-size:0.75rem; color:var(--adm-text-muted);">${courses.length} Courses Total</span>
        </div>
      </div>

      <!-- Courses Content -->
      ${courses.length === 0 ? `
        <div class="adm-table-empty">
          <div class="adm-state-box">
            <div class="adm-state-icon">📚</div>
            <h3 class="adm-state-title">No courses found</h3>
            <p class="adm-state-desc">Get started by creating your first course curriculum.</p>
            <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateCourseModal()">Create your first course</button>
          </div>
        </div>
      ` : `
      <!-- Courses Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="coursesTable">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Tier</th>
              <th>Price</th>
              <th>Status</th>
              <th>Modules / Classes</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${courses.map(c => `
              <tr data-tier="${c.tierId}" data-status="${c.status}" data-title="${c.title.toLowerCase()}">
                <td>
                  <a href="/admin/courses/${c.id}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/courses/${c.id}')" style="color:var(--adm-text-primary); font-weight:600; text-decoration:none;">
                    ${c.title}
                  </a>
                  <div style="font-size:0.72rem; color:var(--adm-text-secondary); margin-top:2px;">Instructor: ${c.instructor}</div>
                </td>
                <td>
                  <span style="font-family:var(--adm-font-mono); font-size:0.76rem; color:var(--adm-tertiary);">${c.tierName}</span>
                </td>
                <td>
                  <span class="adm-badge ${c.priceDisplay === 'FREE' ? 'adm-badge-open' : 'adm-badge-price-coming-soon'}">
                    ${c.priceDisplay}
                  </span>
                </td>
                <td>
                  <span class="adm-badge ${c.status === 'Published' ? 'adm-badge-published' : 'adm-badge-draft'}">
                    ${c.status}
                  </span>
                </td>
                <td>
                  <span style="font-size:0.8rem;">${c.modulesCount} modules • ${c.classesCount} classes</span>
                </td>
                <td>
                  <strong>${c.totalEnrolled}</strong>
                </td>
                <td>
                  <div style="display:flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/courses/${c.id}')">View</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditCourseModal('${c.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-outline-tertiary" onclick="NexvionAdminApp.duplicateCourse('${c.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveCourse('${c.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      `}
    `;
  }

  // --- ROUTE: COURSE DETAIL VIEW ---
  async function renderCourseDetailView(courseId) {
    const course = await Data.getCourseById(courseId);
    if (!course) {
      DOM.content.innerHTML = renderEmptyState('Course Not Found', `No course exists with identifier "${courseId}".`, 'Back to Courses', 'NexvionAdminApp.navigateTo("/admin/courses")');
      return;
    }

    const modules = (await Data.getModules()).filter(m => m.courseId === courseId);
    const classes = (await Data.getClasses()).filter(c => c.courseId === courseId);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/courses')">← Back to Courses</button>
            <span class="adm-badge adm-badge-published">${course.status}</span>
            <span class="adm-badge adm-badge-price-coming-soon">${course.priceDisplay}</span>
          </div>
          <h1 class="adm-page-title">${course.title}</h1>
          <p class="adm-page-desc">${course.shortDescription}</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="window.open('/course.html', '_blank')">Preview Student View</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openEditCourseModal('${course.id}')">Edit Course Details</button>
        </div>
      </div>

      <!-- Course Details Grid -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px;">
        
        <!-- Left: Curriculum Structure -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          
          <div class="adm-card">
            <h3 class="adm-card-title">Full Curriculum Description</h3>
            <p style="font-size:0.88rem; color:var(--adm-text-secondary); line-height:1.6; margin-top:10px;">${course.fullDescription}</p>
            
            <h4 style="margin:20px 0 10px; font-size:0.9rem; color:var(--adm-text-primary);">Key Learning Outcomes</h4>
            <ul style="padding-left:20px; font-size:0.84rem; color:var(--adm-text-secondary); line-height:1.6;">
              ${course.learningOutcomes.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>

          <!-- Modules List -->
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Curriculum Modules (${modules.length})</h3>
              <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openCreateModuleModal('${course.id}')">+ Add Module</button>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${modules.length ? modules.map(m => `
                <div style="background:var(--adm-surface-elevated); padding:14px; border-radius:8px; border:1px solid var(--adm-border);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:var(--adm-text-primary); font-size:0.88rem;">${m.title}</strong>
                    <span class="adm-badge adm-badge-published">${m.status}</span>
                  </div>
                  <p style="font-size:0.8rem; color:var(--adm-text-secondary); margin:6px 0;">${m.description}</p>
                  <span style="font-size:0.72rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">Requirement: ${m.completionRequirement}</span>
                </div>
              `).join('') : '<p style="color:var(--adm-text-muted); font-size:0.8rem;">No modules added yet.</p>'}
            </div>
          </div>

        </div>

        <!-- Right: Meta Info & Certificate Rules -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          
          <div class="adm-card">
            <h3 class="adm-card-title">Course Parameters</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px; font-size:0.82rem;">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                <span style="color:var(--adm-text-secondary);">Course Tier:</span>
                <strong style="color:var(--adm-tertiary);">${course.tierName}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                <span style="color:var(--adm-text-secondary);">Tuition / Pricing:</span>
                <strong>${course.priceDisplay}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                <span style="color:var(--adm-text-secondary);">Duration:</span>
                <span>${course.duration}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                <span style="color:var(--adm-text-secondary);">Instructor:</span>
                <span>${course.instructor}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                <span style="color:var(--adm-text-secondary);">Total Enrolled:</span>
                <strong>${course.totalEnrolled} students</strong>
              </div>
            </div>
          </div>

          <div class="adm-card">
            <h3 class="adm-card-title">Certificate Requirements</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px; font-size:0.8rem; color:var(--adm-text-secondary);">
              <div>✓ Minimum Attendance: <strong>${course.certificateRequirements.minAttendancePercent}%</strong></div>
              <div>✓ Required Projects: <strong>${course.certificateRequirements.requiredProjects} projects</strong></div>
              <div>✓ Required Assignments: <strong>${course.certificateRequirements.requiredAssignments} submissions</strong></div>
              <div>✓ Passing Grade Threshold: <strong>${course.certificateRequirements.passingGradePercent}%</strong></div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // --- ROUTE: TIERS MANAGEMENT ---
  async function renderTiersView() {
    const tiers = await Data.getTiers();

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">Tier Management</h1>
          <p class="adm-page-desc">The platform strictly maintains exactly four educational tiers. No invented prices are permitted.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        ${tiers.map(t => `
          <div class="adm-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-family:var(--adm-font-mono); font-size:0.75rem; color:var(--adm-tertiary); font-weight:700;">${t.badge}</span>
                <span class="adm-badge ${t.tierType === 'free' ? 'adm-badge-open' : 'adm-badge-price-coming-soon'}">${t.priceDisplay}</span>
              </div>
              <h2 style="font-size:1.35rem; color:var(--adm-text-primary); margin:0 0 8px 0;">${t.name}</h2>
              <p style="font-size:0.82rem; color:var(--adm-text-secondary); line-height:1.5; margin-bottom:14px;">${t.description}</p>
              
              <h4 style="font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); text-transform:uppercase; margin-bottom:8px;">Included Curriculum Features</h4>
              <ul style="padding-left:18px; font-size:0.78rem; color:var(--adm-text-secondary); line-height:1.6; margin:0 0 16px 0;">
                ${t.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <div style="border-top:1px solid var(--adm-border-subtle); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; color:var(--adm-text-muted);">Enrolled: ${t.enrolledCount} learners</span>
              <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditTierModal('${t.id}')">Configure Tier</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- ROUTE: BATCH MANAGEMENT (Strict 30-Cap) ---
  async function renderBatchesView() {
    const batches = await Data.getBatches();
    const courses = await Data.getCourses();

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Batch Management</span>
            <span class="adm-badge adm-badge-waitlist">CAPACITY FIXED AT 30</span>
          </h1>
          <p class="adm-page-desc">Every cohort batch is strictly limited to 30 students. When filled, incoming applicants automatically transition to waitlist state.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateBatchModal()">+ Create New Batch</button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          <input type="text" class="adm-input" id="batchSearch" placeholder="Search cohorts..." style="width:200px;" oninput="NexvionAdminApp.filterBatchesTable()">
          <select class="adm-select" id="batchStatusFilter" onchange="NexvionAdminApp.filterBatchesTable()">
            <option value="ALL">All Cohort Statuses</option>
            <option value="OPEN">OPEN (Available Seats)</option>
            <option value="FULL">FULL (30/30)</option>
            <option value="WAITLIST">WAITLIST (Overflow)</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <span style="font-size:0.75rem; color:var(--adm-text-muted);">${batches.length} Cohorts Managed</span>
      </div>

      <!-- Batches Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="batchesTable">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Course / Tier</th>
              <th>Instructor</th>
              <th>Capacity Utilization (Cap 30)</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${batches.map(b => {
              const seatsLeft = 30 - b.enrolledCount;
              const fillClass = b.enrolledCount >= 30 ? 'full' : b.enrolledCount >= 25 ? 'few' : 'open';
              const pct = Math.round((b.enrolledCount / 30) * 100);
              const badgeClass = b.status === 'FULL' ? 'adm-badge-full' : 
                                 b.status === 'WAITLIST' ? 'adm-badge-waitlist' : 
                                 b.status === 'UPCOMING' ? 'adm-badge-upcoming' : 
                                 b.status === 'ACTIVE' ? 'adm-badge-open' : 
                                 b.status === 'COMPLETED' ? 'adm-badge-published' : 
                                 b.status === 'CANCELLED' ? 'adm-badge-archived' : 
                                 'adm-badge-open';

              return `
                <tr data-status="${b.status}" data-name="${b.name.toLowerCase()}">
                  <td>
                    <strong style="color:var(--adm-text-primary);">${b.name}</strong>
                    <div style="font-size:0.7rem; color:var(--adm-text-secondary);">${b.schedule}</div>
                  </td>
                  <td>
                    <div>${b.courseTitle.split(':')[0]}</div>
                    <div style="font-size:0.72rem; color:var(--adm-tertiary);">${b.tierName}</div>
                  </td>
                  <td>${b.instructor}</td>
                  <td>
                    <div class="adm-capacity-bar-wrap">
                      <div class="adm-capacity-text">
                        <span><strong>${b.enrolledCount} / 30</strong> filled</span>
                        <span>${seatsLeft > 0 ? `${seatsLeft} open` : 'FULL'}</span>
                      </div>
                      <div class="adm-capacity-track">
                        <div class="adm-capacity-fill ${fillClass}" style="width:${pct}%"></div>
                      </div>
                      ${b.waitlistCount > 0 ? `<div style="font-size:0.68rem; color:#FBBF24;">⚡ Waitlist queue: ${b.waitlistCount} students</div>` : ''}
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.75rem;">${b.startDate}</div>
                    <div style="font-size:0.7rem; color:var(--adm-text-muted);">to ${b.endDate}</div>
                  </td>
                  <td>
                    <span class="adm-badge ${badgeClass}"><span class="adm-badge-dot"></span>${b.status}</span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openBatchDetailDrawer('${b.id}')">Roster</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditBatchModal('${b.id}')">Edit</button>
                      ${b.enrolledCount < 30 ? `
                        <button class="adm-btn adm-btn-sm adm-btn-outline-tertiary" onclick="NexvionAdminApp.markBatchFull('${b.id}')">Mark Full</button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 2 ROUTE: STUDENT DIRECTORY
  // ==========================================================================
  async function renderStudentsView() {
    const students = await Data.getStudents();
    const tiers = await Data.getTiers();
    const batches = await Data.getBatches();

    const state = AppState.studentDirectory;

    // Filter students
    let filtered = students.filter(s => {
      const q = state.searchTerm.toLowerCase().trim();
      const matchQ = !q || 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) ||
        (s.enrolledCourseTitle && s.enrolledCourseTitle.toLowerCase().includes(q));

      const matchTier = state.tierFilter === 'ALL' || s.tierId === state.tierFilter;
      const matchBatch = state.batchFilter === 'ALL' || s.batchId === state.batchFilter;
      const matchStatus = state.statusFilter === 'ALL' || s.enrollmentStatus === state.statusFilter;
      const matchPayment = state.paymentFilter === 'ALL' || s.paymentStatus === state.paymentFilter;
      const matchCert = state.certFilter === 'ALL' || s.certificateStatus === state.certFilter;

      return matchQ && matchTier && matchBatch && matchStatus && matchPayment && matchCert;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'progress-desc': return (b.progressPercent || 0) - (a.progressPercent || 0);
        case 'progress-asc': return (a.progressPercent || 0) - (b.progressPercent || 0);
        case 'last-active': return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
        case 'joined-desc': return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
        default: return a.name.localeCompare(b.name);
      }
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Student Directory</span>
            <span class="adm-badge adm-badge-published">${students.length} Learners</span>
          </h1>
          <p class="adm-page-desc">Comprehensive administrative directory for student records, enrollment milestones, 30-capacity cohort assignments, and credentials.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportStudentList()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Student List
          </button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openAddStudentModal()">
            + Add Student Record
          </button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" id="studentSearchInput" placeholder="Search by name, email, ID..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onStudentSearch(this.value)">
          
          <select class="adm-select" id="studentTierFilter" onchange="NexvionAdminApp.onStudentTierFilter(this.value)">
            <option value="ALL" ${state.tierFilter === 'ALL' ? 'selected' : ''}>All Tiers</option>
            ${tiers.map(t => `<option value="${t.id}" ${state.tierFilter === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>

          <select class="adm-select" id="studentBatchFilter" onchange="NexvionAdminApp.onStudentBatchFilter(this.value)">
            <option value="ALL" ${state.batchFilter === 'ALL' ? 'selected' : ''}>All Cohorts</option>
            ${batches.map(b => `<option value="${b.id}" ${state.batchFilter === b.id ? 'selected' : ''}>${b.name} (${b.enrolledCount}/30)</option>`).join('')}
          </select>

          <select class="adm-select" id="studentStatusFilter" onchange="NexvionAdminApp.onStudentStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Enrollment Statuses</option>
            <option value="Pending" ${state.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${state.statusFilter === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Enrolled" ${state.statusFilter === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
            <option value="Waitlisted" ${state.statusFilter === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
            <option value="Rejected" ${state.statusFilter === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Cancelled" ${state.statusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            <option value="Completed" ${state.statusFilter === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>

          <select class="adm-select" id="studentPaymentFilter" onchange="NexvionAdminApp.onStudentPaymentFilter(this.value)">
            <option value="ALL" ${state.paymentFilter === 'ALL' ? 'selected' : ''}>All Payments</option>
            <option value="Paid" ${state.paymentFilter === 'Paid' ? 'selected' : ''}>Paid</option>
            <option value="Not required" ${state.paymentFilter === 'Not required' ? 'selected' : ''}>Not required (Free)</option>
            <option value="Pending" ${state.paymentFilter === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Manual review" ${state.paymentFilter === 'Manual review' ? 'selected' : ''}>Manual review</option>
          </select>

          <select class="adm-select" id="studentCertFilter" onchange="NexvionAdminApp.onStudentCertFilter(this.value)">
            <option value="ALL" ${state.certFilter === 'ALL' ? 'selected' : ''}>All Credentials</option>
            <option value="Issued" ${state.certFilter === 'Issued' ? 'selected' : ''}>Issued</option>
            <option value="Eligible" ${state.certFilter === 'Eligible' ? 'selected' : ''}>Eligible</option>
            <option value="Pending approval" ${state.certFilter === 'Pending approval' ? 'selected' : ''}>Pending approval</option>
            <option value="Not eligible" ${state.certFilter === 'Not eligible' ? 'selected' : ''}>Not eligible</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onStudentSort(this.value)" title="Sort directory records">
            <option value="name-asc" ${state.sortBy === 'name-asc' ? 'selected' : ''}>Sort: Name (A–Z)</option>
            <option value="name-desc" ${state.sortBy === 'name-desc' ? 'selected' : ''}>Sort: Name (Z–A)</option>
            <option value="progress-desc" ${state.sortBy === 'progress-desc' ? 'selected' : ''}>Sort: Progress (High–Low)</option>
            <option value="progress-asc" ${state.sortBy === 'progress-asc' ? 'selected' : ''}>Sort: Progress (Low–High)</option>
            <option value="last-active" ${state.sortBy === 'last-active' ? 'selected' : ''}>Sort: Last Active</option>
            <option value="joined-desc" ${state.sortBy === 'joined-desc' ? 'selected' : ''}>Sort: Date Joined</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetStudentFilters()">Reset</button>
        </div>
      </div>

      <!-- Main Student Data Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="studentsMainTable">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Email</th>
              <th>Enrolled Course</th>
              <th>Tier</th>
              <th>Cohort Batch (Cap 30)</th>
              <th>Enrollment Status</th>
              <th>Progress</th>
              <th>Tuition Payment</th>
              <th>Certificate</th>
              <th>Last Activity</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(s => {
              const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              return `
                <tr>
                  <td>
                    <div class="adm-student-cell">
                      <div class="adm-student-avatar">${initials}</div>
                      <div>
                        <a href="/admin/students/${s.id}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/students/${s.id}')" style="color:var(--adm-text-primary); font-weight:700; text-decoration:none; display:block;">
                          ${s.name}
                        </a>
                        <span style="font-family:var(--adm-font-mono); font-size:0.68rem; color:var(--adm-text-muted);">${s.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-size:0.8rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono);">${s.email}</span>
                  </td>
                  <td>
                    <div style="font-weight:500; font-size:0.82rem;">${(s.enrolledCourseTitle || '').split(':')[0]}</div>
                  </td>
                  <td>
                    <span class="adm-badge ${s.tierId === 'ai-foundations' ? 'adm-badge-open' : 'adm-badge-published'}">${s.tierName || s.tierId}</span>
                  </td>
                  <td>
                    <div>
                      <strong style="font-size:0.8rem; color:var(--adm-text-primary);">${s.batchName || 'Unassigned'}</strong>
                      <div style="font-size:0.68rem; font-family:var(--adm-font-mono); color:var(--adm-tertiary);">30 Seat Capacity</div>
                    </div>
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: s.enrollmentStatus })}
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:56px; height:5px; background:#E2E8F0; border-radius:3px; overflow:hidden;">
                        <div style="width:${s.progressPercent || 0}%; height:100%; background:var(--adm-primary);"></div>
                      </div>
                      <span style="font-size:0.75rem; font-family:var(--adm-font-mono); font-weight:600;">${s.progressPercent || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="adm-badge ${s.paymentStatus === 'Paid' ? 'adm-badge-paid' : s.paymentStatus === 'Not required' ? 'adm-badge-open' : 'adm-badge-waitlist'}">
                      ${s.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span class="adm-badge ${s.certificateStatus === 'Issued' ? 'adm-badge-published' : s.certificateStatus === 'Eligible' ? 'adm-badge-open' : 'adm-badge-draft'}">
                      ${s.certificateStatus}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); white-space:nowrap;">
                      ${s.lastActive ? new Date(s.lastActive).toLocaleDateString() : 'Active'}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/students/${s.id}')">View</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openStudentStatusModal('${s.id}')">Status</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openAddNoteModal('${s.id}')">Note</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="11" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '👥',
                    title: 'No students match current filters',
                    message: 'Adjust your search terms or filter selections to view matching student records.',
                    actionText: 'Reset Filters',
                    onAction: 'NexvionAdminApp.resetStudentFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination Bar -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> learners</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onStudentPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onStudentPageChange(${state.currentPage - 1})">
            ← Previous
          </button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">
            Page ${state.currentPage} of ${totalPages}
          </span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onStudentPageChange(${state.currentPage + 1})">
            Next →
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 2 ROUTE: STUDENT DETAIL VIEW (11 PRODUCTION TABS)
  // ==========================================================================
  async function renderStudentDetailView(studentId) {
    AppState.activeStudentId = studentId;
    const student = await Data.getStudentById(studentId);
    if (!student) {
      DOM.content.innerHTML = AdminComponents.EmptyState({
        icon: '👤',
        title: 'Student Record Not Found',
        message: `No active student found for record identifier "${studentId}".`,
        actionText: 'Back to Student Directory',
        onAction: 'NexvionAdminApp.navigateBackToStudents'
      });
      return;
    }

    // Fetch tab data through repository layer
    const enrollments = await Data.getStudentEnrollments(studentId);
    const classes = await Data.getStudentClasses(studentId);
    const projects = await Data.getStudentProjects(studentId);
    const assignments = await Data.getStudentAssignments(studentId);
    const payments = await Data.getStudentPayments(studentId);
    const certificates = await Data.getStudentCertificates(studentId);
    const supportTickets = await Data.getStudentSupportTickets(studentId);
    const timeline = await Data.getStudentActivityTimeline(studentId);
    const batch = student.batchId ? await Data.getBatchById(student.batchId) : null;

    const currentTab = AppState.activeStudentTab || 'overview';
    const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    // Render Tab Header
    const tabsList = [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'enrollments', label: `Enrollments (${enrollments.length || 1})`, icon: '📋' },
      { id: 'progress', label: 'Progress', icon: '📈' },
      { id: 'classes', label: `Classes (${classes.length})`, icon: '📡' },
      { id: 'projects', label: `Projects (${projects.length})`, icon: '🛠️' },
      { id: 'assignments', label: `Assignments (${assignments.length})`, icon: '📝' },
      { id: 'payments', label: `Payments (${payments.length})`, icon: '💳' },
      { id: 'certificates', label: `Certificates (${certificates.length})`, icon: '🎓' },
      { id: 'support', label: `Support History (${supportTickets.length})`, icon: '🎫' },
      { id: 'timeline', label: 'Activity Timeline', icon: '⏱️' }
    ];

    DOM.content.innerHTML = `
      <!-- Detail Header -->
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/students')">
              ← Back to Student Directory
            </button>
            <span class="adm-badge adm-badge-published">${student.studentStatus || 'Active'}</span>
            ${AdminComponents.StatusBadge({ status: student.enrollmentStatus || 'Enrolled' })}
            <span style="font-family:var(--adm-font-mono); font-size:0.72rem; color:var(--adm-text-muted);">ID: ${student.id.toUpperCase()}</span>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div class="adm-student-avatar adm-student-avatar-lg">${initials}</div>
            <div>
              <h1 class="adm-page-title" style="margin:0 0 2px 0;">${student.name}</h1>
              <p class="adm-page-desc">${student.email} • Enrolled in <strong>${student.enrolledCourseTitle}</strong> (${student.tierName})</p>
            </div>
          </div>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.openStudentStatusModal('${student.id}')">Change Status</button>
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.openTransferBatchModal('${student.id}')">Transfer Cohort</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openAddNoteModal('${student.id}')">+ Add Internal Note</button>
        </div>
      </div>

      <!-- Unsaved Changes Protection Banner -->
      ${AppState.hasUnsavedChanges ? `
        <div class="adm-dirty-banner" id="admDirtyBanner">
          <div class="adm-dirty-text">
            <span>⚠️ You have unsaved profile modifications for ${student.name}.</span>
          </div>
          <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.saveStudentProfileChanges('${student.id}')">Save Profile Changes</button>
        </div>
      ` : ''}

      <!-- 11-Tab Navigation Header -->
      <div class="adm-tabs-header" role="tablist">
        ${tabsList.map(tab => `
          <button class="adm-tab-btn ${currentTab === tab.id ? 'active' : ''}" 
                  role="tab" 
                  aria-selected="${currentTab === tab.id}"
                  onclick="NexvionAdminApp.switchStudentTab('${tab.id}')">
            <span>${tab.icon}</span> ${tab.label}
          </button>
        `).join('')}
      </div>

      <!-- Tab Content Host -->
      <div id="studentTabHost" class="adm-tab-content">
        ${renderStudentTabContent(currentTab, { student, batch, enrollments, classes, projects, assignments, payments, certificates, supportTickets, timeline })}
      </div>
    `;
  }

  // --- TAB CONTENT RENDERER ---
  function renderStudentTabContent(tabId, data) {
    const { student, batch, enrollments, classes, projects, assignments, payments, certificates, supportTickets, timeline } = data;

    switch (tabId) {
      case 'overview':
        return `
          <!-- 4 Stat Summary Cards -->
          <div class="adm-stats-grid">
            <div class="adm-stat-card">
              <div class="adm-stat-header">
                <span class="adm-stat-label">Course Progress</span>
                <div class="adm-stat-icon-wrap" style="background:rgba(127,82,255,0.12); color:var(--adm-primary);">📈</div>
              </div>
              <div class="adm-stat-val-wrap">
                <span class="adm-stat-value">${student.progressPercent || 0}%</span>
                <span class="adm-stat-delta up">Active</span>
              </div>
              <span class="adm-stat-sub">Across 4 curriculum modules</span>
            </div>

            <div class="adm-stat-card">
              <div class="adm-stat-header">
                <span class="adm-stat-label">Live Attendance</span>
                <div class="adm-stat-icon-wrap" style="background:rgba(0,132,112,0.12); color:var(--adm-tertiary);">📡</div>
              </div>
              <div class="adm-stat-val-wrap">
                <span class="adm-stat-value">${student.attendancePercent || 0}%</span>
                <span class="adm-stat-delta up">Attended</span>
              </div>
              <span class="adm-stat-sub">Live cohort attendance record</span>
            </div>

            <div class="adm-stat-card">
              <div class="adm-stat-header">
                <span class="adm-stat-label">Cohort Batch Seat</span>
                <div class="adm-stat-icon-wrap" style="background:rgba(199,87,188,0.12); color:var(--adm-secondary);">🏛️</div>
              </div>
              <div class="adm-stat-val-wrap">
                <span class="adm-stat-value">${batch ? `${batch.enrolledCount} / 30` : '30 Cap'}</span>
                <span class="adm-stat-delta up">${batch ? batch.status : 'Cap 30'}</span>
              </div>
              <span class="adm-stat-sub">${student.batchName || 'No cohort assigned'}</span>
            </div>

            <div class="adm-stat-card">
              <div class="adm-stat-header">
                <span class="adm-stat-label">Tuition Status</span>
                <div class="adm-stat-icon-wrap" style="background:rgba(16,185,129,0.12); color:#059669;">💳</div>
              </div>
              <div class="adm-stat-val-wrap">
                <span class="adm-stat-value" style="font-size:1.4rem;">${student.paymentStatus || 'Verified'}</span>
              </div>
              <span class="adm-stat-sub">Credential: ${student.certificateStatus || 'Eligible'}</span>
            </div>
          </div>

          <div class="adm-detail-grid">
            <div class="adm-detail-main">
              <!-- Current Enrollment Snapshot -->
              <div class="adm-card">
                <div class="adm-card-header">
                  <h3 class="adm-card-title">Active Enrollment Snapshot</h3>
                  <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openTransferBatchModal('${student.id}')">Transfer Cohort</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
                  <div>
                    <span class="adm-profile-label">Course Title</span>
                    <div style="font-weight:700; color:var(--adm-text-primary); margin-top:2px;">${student.enrolledCourseTitle}</div>
                  </div>
                  <div>
                    <span class="adm-profile-label">Curriculum Tier</span>
                    <div style="margin-top:2px;"><span class="adm-badge adm-badge-published">${student.tierName}</span></div>
                  </div>
                  <div>
                    <span class="adm-profile-label">Assigned Batch</span>
                    <div style="font-weight:600; color:var(--adm-tertiary); margin-top:2px;">${student.batchName} (${batch ? batch.enrolledCount : '0'}/30 Seats)</div>
                  </div>
                  <div>
                    <span class="adm-profile-label">Cohort Schedule</span>
                    <div style="font-size:0.82rem; color:var(--adm-text-secondary); margin-top:2px;">${batch ? batch.schedule : 'Tue & Thu 18:00 UTC'}</div>
                  </div>
                  <div>
                    <span class="adm-profile-label">Date Joined</span>
                    <div style="font-family:var(--adm-font-mono); font-size:0.82rem; color:var(--adm-text-secondary); margin-top:2px;">${student.joinDate || '2026-09-15'}</div>
                  </div>
                  <div>
                    <span class="adm-profile-label">Lead Faculty</span>
                    <div style="font-size:0.82rem; color:var(--adm-text-secondary); margin-top:2px;">${batch ? batch.instructor : 'Faculty Directorate'}</div>
                  </div>
                </div>
              </div>

              <!-- Internal Staff Notes -->
              <div class="adm-card">
                <div class="adm-card-header">
                  <h3 class="adm-card-title">Internal Staff Notes</h3>
                  <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.openAddNoteModal('${student.id}')">+ Add Note</button>
                </div>
                <div class="adm-notes-list">
                  ${student.internalNotesList && student.internalNotesList.length > 0 ? student.internalNotesList.map(n => `
                    <div class="adm-note-card priority-${(n.priority || 'Normal').toLowerCase()}">
                      <div class="adm-note-header">
                        <span class="adm-note-author">${n.author || 'Staff Admin'}</span>
                        <span class="adm-note-time">${new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p class="adm-note-body">${n.text}</p>
                    </div>
                  `).join('') : `
                    <div style="padding:16px; background:#FAFAFC; border:1px dashed var(--adm-border); border-radius:6px; color:var(--adm-text-muted); font-size:0.82rem; text-align:center;">
                      No internal notes recorded on this student profile yet.
                    </div>
                  `}
                </div>
              </div>
            </div>

            <!-- Aside: Academic Milestones & Certificate Readiness -->
            <div class="adm-detail-aside">
              <div class="adm-card">
                <h3 class="adm-card-title">Credential Readiness</h3>
                <div style="margin-top:14px; display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                    <span style="color:var(--adm-text-secondary);">Current Status:</span>
                    <span class="adm-badge ${student.certificateStatus === 'Issued' ? 'adm-badge-published' : student.certificateStatus === 'Eligible' ? 'adm-badge-open' : 'adm-badge-draft'}">${student.certificateStatus}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                    <span style="color:var(--adm-text-secondary);">Min Attendance (80%):</span>
                    <strong style="color:${(student.attendancePercent || 0) >= 80 ? 'var(--adm-success)' : 'var(--adm-error)'};">${student.attendancePercent || 0}% ✓</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                    <span style="color:var(--adm-text-secondary);">Required Projects:</span>
                    <strong>${projects.filter(p => p.submissionStatus === 'Reviewed').length} / ${projects.length || 2}</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--adm-border-subtle); padding-bottom:8px;">
                    <span style="color:var(--adm-text-secondary);">Passing Grade Avg:</span>
                    <strong>${student.progressPercent || 85}%</strong>
                  </div>
                  ${student.certificateStatus === 'Eligible' ? `
                    <button class="adm-btn adm-btn-primary" style="margin-top:8px; width:100%;" onclick="NexvionAdminApp.issueStudentCertificate('${student.id}')">Issue Certificate</button>
                  ` : ''}
                </div>
              </div>

              <div class="adm-card">
                <h3 class="adm-card-title">Recent Timeline Activity</h3>
                <div class="adm-timeline" style="margin-top:10px;">
                  ${timeline.slice(0, 3).map(ev => `
                    <div class="adm-timeline-item">
                      <div class="adm-timeline-dot ${ev.dotType}"></div>
                      <div class="adm-timeline-content">
                        <div class="adm-timeline-header">
                          <strong class="adm-timeline-title">${ev.title}</strong>
                          <span class="adm-timeline-time">${ev.timestamp.split(' ')[0]}</span>
                        </div>
                        <p class="adm-timeline-desc">${ev.description}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;

      case 'profile':
        return `
          <div class="adm-card">
            <div class="adm-card-header">
              <div>
                <h3 class="adm-card-title">Learner Profile & Credentials</h3>
                <p class="adm-card-desc">Edit contact details and student background. Changes are protected with unsaved-change safeguards.</p>
              </div>
              <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.saveStudentProfileChanges('${student.id}')">Save Profile Changes</button>
            </div>

            <form id="studentProfileForm" oninput="NexvionAdminApp.markDirty()">
              <h4 style="font-size:0.84rem; font-family:var(--adm-font-mono); color:var(--adm-primary); text-transform:uppercase; margin:16px 0 10px;">Personal & Contact Info</h4>
              <div class="adm-profile-grid">
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Full Legal Name</label>
                  <input type="text" class="adm-input" id="profName" value="${student.name}">
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Email Address</label>
                  <input type="email" class="adm-input" id="profEmail" value="${student.email}">
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Phone Number</label>
                  <input type="text" class="adm-input" id="profPhone" value="${student.phone || '+1 (555) 019-2831'}">
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Location / Country</label>
                  <input type="text" class="adm-input" id="profCountry" value="${student.country || 'Global Student'}">
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Timezone</label>
                  <input type="text" class="adm-input" id="profTimezone" value="${student.timezone || 'UTC'}">
                </div>
              </div>

              <h4 style="font-size:0.84rem; font-family:var(--adm-font-mono); color:var(--adm-primary); text-transform:uppercase; margin:24px 0 10px;">Professional & Technical Background</h4>
              <div class="adm-profile-grid">
                <div class="adm-profile-field">
                  <label class="adm-profile-label">Experience Level</label>
                  <select class="adm-select" id="profExperience" style="width:100%;">
                    <option ${student.experienceLevel === 'Beginner' ? 'selected' : ''}>Beginner</option>
                    <option ${student.experienceLevel === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option ${student.experienceLevel === 'Advanced / Staff Engineer' ? 'selected' : ''}>Advanced / Staff Engineer</option>
                    <option ${student.experienceLevel === 'Advanced / Principal Architect' ? 'selected' : ''}>Advanced / Principal Architect</option>
                  </select>
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">GitHub Handle</label>
                  <input type="text" class="adm-input" id="profGithub" value="${student.githubHandle || 'nexvion-learner'}">
                </div>
                <div class="adm-profile-field">
                  <label class="adm-profile-label">LinkedIn Profile</label>
                  <input type="text" class="adm-input" id="profLinkedin" value="${student.linkedinHandle || 'linkedin.com/in/learner'}">
                </div>
              </div>

              <div class="adm-form-group" style="margin-top:16px;">
                <label class="adm-profile-label">Bio & Learning Objectives</label>
                <textarea class="adm-textarea" id="profBio">${student.bio || 'Active AI student studying modern synthetic systems.'}</textarea>
              </div>

              <h4 style="font-size:0.84rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); text-transform:uppercase; margin:24px 0 10px;">Security & Account Telemetry</h4>
              <div class="adm-profile-grid">
                <div class="adm-profile-field">
                  <span class="adm-profile-label">Student ID</span>
                  <span class="adm-profile-val" style="font-family:var(--adm-font-mono);">${student.id.toUpperCase()}</span>
                </div>
                <div class="adm-profile-field">
                  <span class="adm-profile-label">Registration Timestamp</span>
                  <span class="adm-profile-val">${student.joinDate || '2026-09-15'}</span>
                </div>
                <div class="adm-profile-field">
                  <span class="adm-profile-label">Last Client IP</span>
                  <span class="adm-profile-val" style="font-family:var(--adm-font-mono);">${student.ipAddress || '127.0.0.1'}</span>
                </div>
                <div class="adm-profile-field">
                  <span class="adm-profile-label">Device Environment</span>
                  <span class="adm-profile-val">${student.userAgent || 'Chrome 129 / Desktop'}</span>
                </div>
              </div>
            </form>
          </div>
        `;

      case 'enrollments':
        return `
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Enrollment Records & Application Pipeline</h3>
              <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.openAssignBatchForStudentModal('${student.id}')">+ Apply for Cohort</button>
            </div>
            ${AdminComponents.DataTable({
              headers: ['Application ID', 'Course Curriculum', 'Tier', 'Cohort Batch (Cap 30)', 'Application Date', 'Decision Date', 'Status', 'Actions'],
              rows: enrollments.length > 0 ? enrollments.map(e => `
                <tr>
                  <td><strong style="font-family:var(--adm-font-mono); font-size:0.75rem;">${e.id.toUpperCase()}</strong></td>
                  <td>${e.courseTitle.split(':')[0]}</td>
                  <td><span class="adm-badge adm-badge-published">${e.tierName || 'Tier'}</span></td>
                  <td>
                    <strong>${e.batchName || 'Unassigned'}</strong>
                    <div style="font-size:0.68rem; color:var(--adm-tertiary);">30 Student Limit</div>
                  </td>
                  <td style="font-size:0.75rem; color:var(--adm-text-secondary);">${new Date(e.submittedAt).toLocaleDateString()}</td>
                  <td style="font-size:0.75rem; color:var(--adm-text-muted);">${e.decidedAt ? new Date(e.decidedAt).toLocaleDateString() : 'Pending'}</td>
                  <td>${AdminComponents.StatusBadge({ status: e.status })}</td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openTransferBatchModal('${student.id}')">Reassign</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openStudentStatusModal('${student.id}')">Status</button>
                    </div>
                  </td>
                </tr>
              `) : [
                `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--adm-text-muted);">No historical enrollment applications on record.</td></tr>`
              ]
            })}
          </div>
        `;

      case 'progress':
        return `
          <div class="adm-card">
            <h3 class="adm-card-title">Curriculum Progress Breakdown</h3>
            <p class="adm-card-desc">Mastery metrics across courses, modules, and checkpoint attendance.</p>
            <div style="margin:20px 0;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span>Total Course Mastery</span>
                <strong style="font-family:var(--adm-font-mono); color:var(--adm-primary);">${student.progressPercent || 0}% Completed</strong>
              </div>
              <div style="height:10px; background:#E2E8F0; border-radius:5px; overflow:hidden;">
                <div style="width:${student.progressPercent || 0}%; height:100%; background:linear-gradient(90deg, var(--adm-primary), var(--adm-secondary));"></div>
              </div>
            </div>

            <h4 style="font-size:0.88rem; margin:24px 0 12px; color:var(--adm-text-primary);">Module Completion Milestones</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${[
                { title: 'Module 01: Neural Foundations & Architecture', pct: 100, status: 'Completed' },
                { title: 'Module 02: Advanced Prompt Framing & Systems Directives', pct: Math.min(100, Math.round((student.progressPercent || 0) * 1.2)), status: (student.progressPercent || 0) >= 60 ? 'Completed' : 'In Progress' },
                { title: 'Module 03: API Integrations & Streaming Endpoints', pct: Math.max(0, Math.min(100, Math.round((student.progressPercent || 0) * 0.8))), status: (student.progressPercent || 0) >= 80 ? 'Completed' : (student.progressPercent || 0) >= 30 ? 'In Progress' : 'Not Started' },
                { title: 'Module 04: Production Capstone & Architecture Defense', pct: Math.max(0, Math.min(100, Math.round((student.progressPercent || 0) * 0.5))), status: (student.progressPercent || 0) >= 90 ? 'Completed' : 'In Progress' }
              ].map(m => `
                <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:0.88rem; color:var(--adm-text-primary);">${m.title}</strong>
                    <div style="font-size:0.75rem; color:var(--adm-text-secondary); margin-top:3px;">Requirements checked against automated test suite.</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:14px;">
                    <span style="font-family:var(--adm-font-mono); font-size:0.8rem; font-weight:700;">${m.pct}%</span>
                    <span class="adm-badge ${m.status === 'Completed' ? 'adm-badge-published' : m.status === 'In Progress' ? 'adm-badge-open' : 'adm-badge-draft'}">${m.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'classes':
        return `
          <div class="adm-card">
            <h3 class="adm-card-title">Live & Recorded Cohort Classes</h3>
            <p class="adm-card-desc">Attendance tracking for scheduled curriculum classes in ${student.batchName || 'this cohort'}.</p>
            ${AdminComponents.DataTable({
              headers: ['Class Title', 'Module', 'Schedule', 'Duration', 'Faculty Instructor', 'Attendance Status'],
              rows: classes.map(c => `
                <tr>
                  <td><strong>${c.title}</strong></td>
                  <td style="font-size:0.78rem; color:var(--adm-text-secondary);">${c.moduleTitle || 'Core Module'}</td>
                  <td style="font-size:0.75rem; font-family:var(--adm-font-mono);">${c.scheduleDate || 'Tue 18:00 UTC'}</td>
                  <td style="font-size:0.78rem;">${c.duration}</td>
                  <td>${c.instructor}</td>
                  <td>
                    <span class="adm-badge ${c.attendanceStatus === 'Attended' ? 'adm-badge-published' : c.attendanceStatus === 'Recording Watched' ? 'adm-badge-open' : 'adm-badge-upcoming'}">
                      ${c.attendanceStatus}
                    </span>
                  </td>
                </tr>
              `)
            })}
          </div>
        `;

      case 'projects':
        return `
          <div class="adm-card">
            <h3 class="adm-card-title">Curriculum Projects & Capstones</h3>
            <p class="adm-card-desc">Portfolio projects required for credential eligibility in ${student.tierName}.</p>
            ${AdminComponents.DataTable({
              headers: ['Project Title', 'Due Date', 'Mandatory', 'Submission Status', 'Score', 'Evaluator Feedback'],
              rows: projects.map(p => `
                <tr>
                  <td>
                    <strong>${p.title}</strong>
                    <div style="font-size:0.72rem; color:var(--adm-text-secondary); margin-top:2px;">${p.description}</div>
                  </td>
                  <td style="font-size:0.75rem; font-family:var(--adm-font-mono);">${p.dueDate}</td>
                  <td>${p.isRequired ? '<span class="adm-badge adm-badge-published">Required</span>' : 'Optional'}</td>
                  <td><span class="adm-badge ${p.submissionStatus === 'Reviewed' ? 'adm-badge-published' : p.submissionStatus === 'In Progress' ? 'adm-badge-open' : 'adm-badge-draft'}">${p.submissionStatus}</span></td>
                  <td><strong style="font-family:var(--adm-font-mono);">${p.submissionScore !== null ? `${p.submissionScore} / 100` : '—'}</strong></td>
                  <td style="font-size:0.78rem; color:var(--adm-text-secondary);">${p.submissionFeedback || 'Awaiting final staff evaluation.'}</td>
                </tr>
              `)
            })}
          </div>
        `;

      case 'assignments':
        return `
          <div class="adm-card">
            <h3 class="adm-card-title">Weekly Coding & Design Assignments</h3>
            <p class="adm-card-desc">Technical review inbox and assignment scores for ${student.name}.</p>
            ${AdminComponents.DataTable({
              headers: ['Assignment Name', 'Due Date', 'Max Points', 'Status', 'Score', 'Reviewer Feedback'],
              rows: assignments.map(a => `
                <tr>
                  <td><strong>${a.title}</strong></td>
                  <td style="font-size:0.75rem; font-family:var(--adm-font-mono);">${a.dueDate}</td>
                  <td style="font-family:var(--adm-font-mono);">${a.points} pts</td>
                  <td><span class="adm-badge ${a.submissionStatus === 'Reviewed' ? 'adm-badge-published' : 'adm-badge-open'}">${a.submissionStatus}</span></td>
                  <td><strong style="font-family:var(--adm-font-mono);">${a.score !== null ? `${a.score} / 100` : 'Pending'}</strong></td>
                  <td style="font-size:0.78rem; color:var(--adm-text-secondary);">${a.feedback || 'Reviewed by faculty mentorship team.'}</td>
                </tr>
              `)
            })}
          </div>
        `;

      case 'payments':
        return `
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Commercial Tuition & Payment Records</h3>
              <span class="adm-badge adm-badge-waitlist">PAYMENT GATEWAY PENDING</span>
            </div>
            ${AdminComponents.DataTable({
              headers: ['Transaction Ref', 'Invoice ID', 'Course / Educational Tier', 'Amount Display', 'Method', 'Date', 'Status', 'Actions'],
              rows: payments.length > 0 ? payments.map(p => `
                <tr>
                  <td><strong style="font-family:var(--adm-font-mono); font-size:0.75rem;">${p.transactionRef}</strong></td>
                  <td style="font-family:var(--adm-font-mono); font-size:0.75rem;">${p.invoiceId}</td>
                  <td>${p.courseTitle} (${p.tierName})</td>
                  <td><strong>${p.amountDisplay}</strong></td>
                  <td style="font-size:0.78rem;">${p.method}</td>
                  <td style="font-size:0.75rem; color:var(--adm-text-muted);">${p.date}</td>
                  <td><span class="adm-badge ${p.status === 'Paid' ? 'adm-badge-paid' : 'adm-badge-open'}">${p.status}</span></td>
                  <td>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.viewPaymentReceiptModal('${p.id}')">Receipt</button>
                  </td>
                </tr>
              `) : [
                `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--adm-text-muted);">No transaction logs recorded for this student.</td></tr>`
              ]
            })}
          </div>
        `;

      case 'certificates':
        return `
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Issued Credentials & Certificates</h3>
              ${student.certificateStatus === 'Eligible' ? `
                <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.issueStudentCertificate('${student.id}')">Issue Credential Now</button>
              ` : ''}
            </div>
            ${certificates.length > 0 ? certificates.map(c => `
              <div style="background:#FFFFFF; border:2px solid var(--adm-primary); border-radius:12px; padding:24px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-family:var(--adm-font-mono); font-size:0.72rem; color:var(--adm-tertiary); text-transform:uppercase;">OFFICIAL NEXVION CREDENTIAL</span>
                    <h3 style="margin:4px 0; color:var(--adm-text-primary); font-size:1.25rem;">${c.courseTitle}</h3>
                    <span style="font-size:0.8rem; color:var(--adm-text-secondary);">${c.grade} • Awarded to ${c.studentName}</span>
                  </div>
                  <div style="text-align:right;">
                    <span class="adm-badge adm-badge-published">${c.status}</span>
                    <div style="font-family:var(--adm-font-mono); font-size:0.75rem; color:var(--adm-text-muted); margin-top:4px;">ID: ${c.verificationId}</div>
                  </div>
                </div>
                <div style="border-top:1px solid var(--adm-border); margin-top:16px; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.75rem; color:var(--adm-text-muted);">Signatories: ${c.signatory} • Issued ${c.issueDate}</span>
                  <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewCertificateModal('${c.id}')">Preview Credential</button>
                </div>
              </div>
            `).join('') : `
              <div style="text-align:center; padding:36px; background:#FAFAFC; border:1px dashed var(--adm-border); border-radius:8px;">
                <div style="font-size:2rem; margin-bottom:8px;">🎓</div>
                <h4 style="margin:0 0 4px; color:var(--adm-text-primary);">No Certificate Issued Yet</h4>
                <p style="font-size:0.82rem; color:var(--adm-text-secondary); max-width:380px; margin:0 auto 16px;">
                  Student current progress is ${student.progressPercent || 0}%. A certificate will become eligible once attendance (>=80%) and required projects are completed.
                </p>
                ${student.certificateStatus === 'Eligible' ? `
                  <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.issueStudentCertificate('${student.id}')">Issue Certificate Now</button>
                ` : ''}
              </div>
            `}
          </div>
        `;

      case 'support':
        return `
          <div class="adm-card">
            <div class="adm-card-header">
              <h3 class="adm-card-title">Student Support Ticket Inbox</h3>
              <span class="adm-badge adm-badge-published">${supportTickets.length} Tickets</span>
            </div>
            ${AdminComponents.DataTable({
              headers: ['Ticket Ref', 'Subject', 'Category', 'Priority', 'Assigned Staff', 'Status', 'Last Activity', 'Actions'],
              rows: supportTickets.length > 0 ? supportTickets.map(t => `
                <tr>
                  <td><strong style="font-family:var(--adm-font-mono); font-size:0.75rem;">${t.ticketRef}</strong></td>
                  <td><strong>${t.subject}</strong></td>
                  <td>${t.category}</td>
                  <td><span class="adm-badge ${t.priority === 'High' ? 'adm-badge-full' : 'adm-badge-waitlist'}">${t.priority}</span></td>
                  <td>${t.assignedAdmin}</td>
                  <td>${AdminComponents.StatusBadge({ status: t.status })}</td>
                  <td style="font-size:0.75rem; color:var(--adm-text-muted);">${new Date(t.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openTicketDrawer('${t.id}')">Thread</button>
                  </td>
                </tr>
              `) : [
                `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--adm-text-muted);">No open or past support requests from this student.</td></tr>`
              ]
            })}
          </div>
        `;

      case 'timeline':
        return `
          <div class="adm-card">
            <h3 class="adm-card-title">Chronological Activity Audit Timeline</h3>
            <p class="adm-card-desc">Audit history of enrollments, batch assignments, attendance check-ins, staff notes, and achievements.</p>
            <div class="adm-timeline" style="margin-top:24px;">
              ${timeline.map(ev => `
                <div class="adm-timeline-item">
                  <div class="adm-timeline-dot ${ev.dotType}"></div>
                  <div class="adm-timeline-content">
                    <div class="adm-timeline-header">
                      <div>
                        <strong class="adm-timeline-title">${ev.title}</strong>
                        <span class="adm-badge adm-badge-draft" style="font-size:0.65rem; margin-left:6px;">${ev.category}</span>
                      </div>
                      <span class="adm-timeline-time">${ev.timestamp}</span>
                    </div>
                    <p class="adm-timeline-desc">${ev.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      default:
        return `<p>Select a tab above to view details.</p>`;
    }
  }

  // ==========================================================================
  // PHASE 2 ROUTE: ENROLLMENT MANAGEMENT (7 PRODUCTION STATES)
  // ==========================================================================
  async function renderEnrollmentsView() {
    const enrollments = await Data.getEnrollments();
    const batches = await Data.getBatches();
    const courses = await Data.getCourses();

    const state = AppState.enrollmentsView;

    // Filter enrollments
    const filtered = enrollments.filter(e => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q || 
        e.studentName.toLowerCase().includes(q) || 
        e.email.toLowerCase().includes(q) || 
        e.id.toLowerCase().includes(q) ||
        (e.courseTitle && e.courseTitle.toLowerCase().includes(q));

      const matchStatus = state.statusFilter === 'ALL' || e.status === state.statusFilter;
      const matchCourse = state.courseFilter === 'ALL' || e.courseId === state.courseFilter;

      return matchQ && matchStatus && matchCourse;
    });

    const pendingCount = enrollments.filter(e => e.status === 'Pending').length;
    const approvedCount = enrollments.filter(e => e.status === 'Approved').length;
    const enrolledCount = enrollments.filter(e => e.status === 'Enrolled').length;
    const waitlistCount = enrollments.filter(e => e.status === 'Waitlisted').length;

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Enrollment Management</span>
            <span class="adm-badge adm-badge-waitlist">CAPACITY FIXED AT 30</span>
          </h1>
          <p class="adm-page-desc">Admissions review pipeline across all 7 operational states. Enforces strict 30-student cohort ceilings and automated waitlist workflows.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportEnrollmentList()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Enrollments
          </button>
        </div>
      </div>

      <!-- Operational Counter Cards -->
      <div class="adm-stats-grid">
        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Pending Review</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(245,158,11,0.12); color:var(--adm-warning);">⏳</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${pendingCount}</span>
            <span class="adm-stat-delta down">Requires Review</span>
          </div>
          <span class="adm-stat-sub">Applicant submissions awaiting decision</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Approved Seats</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(0,132,112,0.12); color:var(--adm-tertiary);">✓</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${approvedCount}</span>
            <span class="adm-stat-delta up">Ready</span>
          </div>
          <span class="adm-stat-sub">Awaiting cohort start date</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Enrolled Learners</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(127,82,255,0.12); color:var(--adm-primary);">👥</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${enrolledCount}</span>
            <span class="adm-stat-delta up">Active</span>
          </div>
          <span class="adm-stat-sub">Confirmed seats in 30-cap cohorts</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Waitlisted Queue</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(239,68,68,0.12); color:var(--adm-error);">🏛️</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${waitlistCount}</span>
            <span class="adm-stat-delta down">Overflow</span>
          </div>
          <span class="adm-stat-sub">Batches filled to 30/30</span>
        </div>
      </div>

      <!-- Enrollment Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          <input type="text" class="adm-input" placeholder="Search applicant, email, ID..." value="${state.searchTerm || ''}" style="min-width:240px;" oninput="NexvionAdminApp.onEnrollmentSearch(this.value)">
          
          <select class="adm-select" onchange="NexvionAdminApp.onEnrollmentStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All States (7 States)</option>
            <option value="Pending" ${state.statusFilter === 'Pending' ? 'selected' : ''}>Pending (${pendingCount})</option>
            <option value="Approved" ${state.statusFilter === 'Approved' ? 'selected' : ''}>Approved (${approvedCount})</option>
            <option value="Enrolled" ${state.statusFilter === 'Enrolled' ? 'selected' : ''}>Enrolled (${enrolledCount})</option>
            <option value="Waitlisted" ${state.statusFilter === 'Waitlisted' ? 'selected' : ''}>Waitlisted (${waitlistCount})</option>
            <option value="Rejected" ${state.statusFilter === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Cancelled" ${state.statusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            <option value="Completed" ${state.statusFilter === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onEnrollmentCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>
        </div>

        <span style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">
          ${filtered.length} of ${enrollments.length} Records
        </span>
      </div>

      <!-- Main Enrollments Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="enrollmentsMainTable">
          <thead>
            <tr>
              <th>Application Ref</th>
              <th>Applicant</th>
              <th>Target Course & Tier</th>
              <th>Assigned Cohort (Cap 30)</th>
              <th>Application Date</th>
              <th>Tuition Verification</th>
              <th>Status</th>
              <th>Notes / Decision</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 ? filtered.map(e => {
              const b = batches.find(batch => batch.id === e.batchId);
              const enrolledCap = b ? b.enrolledCount : 0;
              const isFull = enrolledCap >= 30;
              const fillPct = Math.min(100, Math.round((enrolledCap / 30) * 100));

              return `
                <tr>
                  <td>
                    <strong style="font-family:var(--adm-font-mono); font-size:0.75rem;">${e.id.toUpperCase()}</strong>
                  </td>
                  <td>
                    <a href="/admin/students/${e.studentId}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/students/${e.studentId}')" style="color:var(--adm-text-primary); font-weight:700; text-decoration:none;">
                      ${e.studentName}
                    </a>
                    <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${e.email}</div>
                  </td>
                  <td>
                    <div>${e.courseTitle.split(':')[0]}</div>
                    <div style="font-size:0.72rem; color:var(--adm-tertiary);">${e.tierName || 'Curriculum Tier'}</div>
                  </td>
                  <td>
                    <div class="adm-capacity-bar-wrap" style="width:130px;">
                      <div class="adm-capacity-text">
                        <span><strong>${enrolledCap} / 30</strong></span>
                        <span style="color:${isFull ? 'var(--adm-error)' : 'var(--adm-tertiary)'}; font-weight:700;">${isFull ? 'FULL' : `${30 - enrolledCap} open`}</span>
                      </div>
                      <div class="adm-capacity-track">
                        <div class="adm-capacity-fill ${isFull ? 'full' : 'open'}" style="width:${fillPct}%;"></div>
                      </div>
                      <span style="font-size:0.7rem; color:var(--adm-text-muted);">${e.batchName || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td style="font-size:0.75rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono);">
                    ${new Date(e.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span class="adm-badge ${e.paymentStatus === 'Paid' ? 'adm-badge-paid' : e.paymentStatus === 'Not required' ? 'adm-badge-open' : 'adm-badge-waitlist'}">
                      ${e.paymentStatus}
                    </span>
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: e.status })}
                  </td>
                  <td style="max-width:200px; font-size:0.75rem; color:var(--adm-text-secondary); line-height:1.4;">
                    ${e.rejectionReason ? `<span style="color:var(--adm-error);">Reason: ${e.rejectionReason}</span>` : (e.notes || '—')}
                  </td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:6px;">
                      ${e.status === 'Pending' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.workflowApproveEnrollment('${e.id}')">Approve</button>
                        <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.workflowRejectEnrollment('${e.id}')">Reject</button>
                      ` : ''}

                      ${e.status === 'Approved' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.workflowAssignBatchModal('${e.id}')">Assign Batch</button>
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.workflowMoveToWaitlist('${e.id}')">Waitlist</button>
                      ` : ''}

                      ${e.status === 'Waitlisted' ? `
                        <button class="adm-btn adm-btn-sm ${isFull ? 'adm-btn-secondary' : 'adm-btn-primary'}" onclick="NexvionAdminApp.workflowAdmitFromWaitlist('${e.id}')">
                          ${isFull ? 'Batch Full (30/30)' : 'Admit to Seat'}
                        </button>
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.workflowAssignBatchModal('${e.id}')">Switch Cohort</button>
                      ` : ''}

                      ${e.status === 'Enrolled' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.workflowAssignBatchModal('${e.id}')">Reassign</button>
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.workflowMoveToWaitlist('${e.id}')">Move Waitlist</button>
                      ` : ''}

                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEnrollmentChangeStatusModal('${e.id}')">Status</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEnrollmentNoteModal('${e.id}')">Note</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="9" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📋',
                    title: 'No enrollment applications found',
                    message: 'There are no enrollment records matching the specified status or course filters.',
                    actionText: 'Clear Filters',
                    onAction: 'NexvionAdminApp.resetEnrollmentFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }


  // --- ROUTE: CLASSES, MODULES, LESSONS, VIDEOS, RESOURCES ---
  // ==========================================================================
  // PHASE 3: MODULES MANAGEMENT
  // ==========================================================================
  async function renderModulesView() {
    const modules = await Data.getModules();
    const courses = await Data.getCourses();
    const state = AppState.modulesView;

    let filtered = modules.filter(m => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.id && m.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || m.courseId === state.courseFilter;
      const matchStatus = state.statusFilter === 'ALL' || m.status === state.statusFilter;

      return matchQ && matchCourse && matchStatus;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'order-asc': return (a.order || 0) - (b.order || 0);
        case 'order-desc': return (b.order || 0) - (a.order || 0);
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        default: return (a.order || 0) - (b.order || 0);
      }
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Curriculum Modules</span>
            <span class="adm-badge adm-badge-published">${modules.length} Total</span>
          </h1>
          <p class="adm-page-desc">Define foundational learning modules, sequence curriculum order, set completion criteria, and manage student learning blocks.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportModulesList()">Export Modules</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateModuleModal()">+ Create Module</button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search module title, description..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onModuleSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onModuleCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onModuleStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Locked" ${state.statusFilter === 'Locked' ? 'selected' : ''}>Locked</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onModuleSort(this.value)">
            <option value="order-asc" ${state.sortBy === 'order-asc' ? 'selected' : ''}>Sort: Order (1 → 9)</option>
            <option value="order-desc" ${state.sortBy === 'order-desc' ? 'selected' : ''}>Sort: Order (9 → 1)</option>
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetModuleFilters()">Reset</button>
        </div>
      </div>

      <!-- Modules Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="modulesMainTable">
          <thead>
            <tr>
              <th style="width:70px;">Order</th>
              <th>Module Title</th>
              <th>Course Curriculum</th>
              <th>Description</th>
              <th>Completion Requirement</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(m => `
              <tr>
                <td style="font-family:var(--adm-font-mono); font-weight:700; color:var(--adm-tertiary);">
                  #${m.order || 1}
                </td>
                <td>
                  <strong>${m.title}</strong>
                  <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${m.id} • ${m.classesCount || 0} classes</div>
                </td>
                <td>
                  <div>${m.courseTitle || 'Curriculum Course'}</div>
                </td>
                <td style="max-width:260px; font-size:0.78rem; color:var(--adm-text-secondary); line-height:1.4;">
                  ${m.description || 'No description provided.'}
                </td>
                <td style="font-size:0.75rem; color:var(--adm-text-secondary);">
                  ${m.completionRequirement || 'All classes completed'}
                </td>
                <td>
                  ${AdminComponents.StatusBadge({ status: m.status || 'Published' })}
                </td>
                <td style="text-align:right; white-space:nowrap;">
                  <div style="display:inline-flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewModuleModal('${m.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditModuleModal('${m.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.duplicateModule('${m.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveModule('${m.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '🧱',
                    title: 'No modules found',
                    message: 'Adjust your search query or create your first curriculum module.',
                    actionText: 'Create your first module',
                    onAction: 'NexvionAdminApp.openCreateModuleModal'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> modules</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onModulePageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onModulePageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onModulePageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 3: CLASSES MANAGEMENT
  // ==========================================================================
  async function renderClassesView() {
    const classes = await Data.getClasses();
    const courses = await Data.getCourses();
    const state = AppState.classesView;

    let filtered = classes.filter(c => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.instructor && c.instructor.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || c.courseId === state.courseFilter;
      const matchStatus = state.statusFilter === 'ALL' || c.status === state.statusFilter;

      return matchQ && matchCourse && matchStatus;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'order-asc': return (a.order || 0) - (b.order || 0);
        case 'order-desc': return (b.order || 0) - (a.order || 0);
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        default: return (a.order || 0) - (b.order || 0);
      }
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Classes Management</span>
            <span class="adm-badge adm-badge-published">${classes.length} Total</span>
          </h1>
          <p class="adm-page-desc">Schedule live interactive classes, assign faculty instructors, attach video streaming references, and manage curriculum access.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportClassesList()">Export Classes</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateClassModal()">+ Create Class</button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search class title, instructor..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onClassSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onClassCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onClassStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Locked" ${state.statusFilter === 'Locked' ? 'selected' : ''}>Locked</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onClassSort(this.value)">
            <option value="order-asc" ${state.sortBy === 'order-asc' ? 'selected' : ''}>Sort: Order (1 → 9)</option>
            <option value="order-desc" ${state.sortBy === 'order-desc' ? 'selected' : ''}>Sort: Order (9 → 1)</option>
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetClassFilters()">Reset</button>
        </div>
      </div>

      <!-- Classes Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="classesMainTable">
          <thead>
            <tr>
              <th>Class Title & Module</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Duration</th>
              <th>Video Stream</th>
              <th>Completion Standard</th>
              <th>Visibility</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(c => `
              <tr>
                <td>
                  <strong>${c.title}</strong>
                  <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${c.moduleTitle || 'Module'} • ID: ${c.id}</div>
                </td>
                <td>${c.courseTitle ? c.courseTitle.split(':')[0] : 'Curriculum'}</td>
                <td>${c.instructor || 'NEXVION Faculty'}</td>
                <td style="font-family:var(--adm-font-mono); font-size:0.78rem;">${c.duration || '60 min'}</td>
                <td>
                  <span class="adm-badge ${c.videoStatus === 'Ready' ? 'adm-badge-open' : 'adm-badge-waitlist'}">
                    ${c.videoStatus || 'Pending'}
                  </span>
                </td>
                <td style="font-size:0.75rem; color:var(--adm-text-secondary);">${c.completionRequirement || 'Watch 90%'}</td>
                <td><span class="adm-badge adm-badge-published">${c.visibility || 'Published'}</span></td>
                <td>${AdminComponents.StatusBadge({ status: c.status || 'Published' })}</td>
                <td style="text-align:right; white-space:nowrap;">
                  <div style="display:inline-flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewClassModal('${c.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditClassModal('${c.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.duplicateClass('${c.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveClass('${c.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="9" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📡',
                    title: 'No classes found',
                    message: 'No classes match your current filter settings.',
                    actionText: 'Create your first class',
                    onAction: 'NexvionAdminApp.openCreateClassModal'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> classes</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onClassPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onClassPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onClassPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 3: LESSONS MANAGEMENT
  // ==========================================================================
  async function renderLessonsView() {
    const lessons = await Data.getLessons();
    const courses = await Data.getCourses();
    const state = AppState.lessonsView;

    let filtered = lessons.filter(l => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.instructor && l.instructor.toLowerCase().includes(q)) ||
        (l.id && l.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || l.courseId === state.courseFilter;
      const matchStatus = state.statusFilter === 'ALL' || l.status === state.statusFilter;

      return matchQ && matchCourse && matchStatus;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'order-asc': return (a.order || 0) - (b.order || 0);
        case 'order-desc': return (b.order || 0) - (a.order || 0);
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        default: return (a.order || 0) - (b.order || 0);
      }
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Lessons & Interactive Labs</span>
            <span class="adm-badge adm-badge-published">${lessons.length} Total</span>
          </h1>
          <p class="adm-page-desc">Create atomic pedagogical units, code exercises, structured prompt labs, and assign completion requirements.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportLessonsList()">Export Lessons</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateLessonModal()">+ Create Lesson</button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search lesson title, instructor..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onLessonSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onLessonCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onLessonStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Locked" ${state.statusFilter === 'Locked' ? 'selected' : ''}>Locked</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onLessonSort(this.value)">
            <option value="order-asc" ${state.sortBy === 'order-asc' ? 'selected' : ''}>Sort: Order (1 → 9)</option>
            <option value="order-desc" ${state.sortBy === 'order-desc' ? 'selected' : ''}>Sort: Order (9 → 1)</option>
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetLessonFilters()">Reset</button>
        </div>
      </div>

      <!-- Lessons Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="lessonsMainTable">
          <thead>
            <tr>
              <th style="width:70px;">Order</th>
              <th>Lesson Title & Module</th>
              <th>Course</th>
              <th>Duration</th>
              <th>Instructor</th>
              <th>Video</th>
              <th>Completion Standard</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(l => `
              <tr>
                <td style="font-family:var(--adm-font-mono); font-weight:700; color:var(--adm-tertiary);">
                  #${l.order || 1}
                </td>
                <td>
                  <strong>${l.title}</strong>
                  <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${l.moduleId || 'Module'} • ID: ${l.id}</div>
                </td>
                <td>${l.courseTitle || 'Curriculum'}</td>
                <td style="font-family:var(--adm-font-mono); font-size:0.78rem;">${l.duration || '25 min'}</td>
                <td>${l.instructor || 'Dr. Evelyn Vance'}</td>
                <td><span class="adm-badge ${l.videoStatus === 'Ready' ? 'adm-badge-open' : 'adm-badge-waitlist'}">${l.videoStatus || 'Ready'}</span></td>
                <td style="font-size:0.75rem; color:var(--adm-text-secondary);">${l.completionRequirement || 'Watch 90%'}</td>
                <td>${AdminComponents.StatusBadge({ status: l.status || 'Published' })}</td>
                <td style="text-align:right; white-space:nowrap;">
                  <div style="display:inline-flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewLessonModal('${l.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditLessonModal('${l.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.duplicateLesson('${l.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveLesson('${l.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="9" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📖',
                    title: 'No lessons found',
                    message: 'No lessons match your current filters. Add your first lesson.',
                    actionText: 'Create your first lesson',
                    onAction: 'NexvionAdminApp.openCreateLessonModal'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> lessons</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onLessonPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onLessonPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onLessonPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 3: VIDEO MANAGEMENT & TRANSCODING DESK
  // ==========================================================================
  async function renderVideosView() {
    const videos = await Data.getVideos();
    const state = AppState.videosView;

    let filtered = videos.filter(v => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.courseTitle && v.courseTitle.toLowerCase().includes(q)) ||
        (v.classTitle && v.classTitle.toLowerCase().includes(q)) ||
        (v.id && v.id.toLowerCase().includes(q));

      const matchStatus = state.statusFilter === 'ALL' || v.status === state.statusFilter;
      const matchVisibility = state.visibilityFilter === 'ALL' || v.visibility === state.visibilityFilter;

      return matchQ && matchStatus && matchVisibility;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        case 'duration-desc': return (b.duration || '').localeCompare(a.duration || '');
        default: return (a.title || '').localeCompare(b.title || '');
      }
    });

    const readyCount = videos.filter(v => v.status === 'Ready').length;
    const processingCount = videos.filter(v => v.status === 'Processing').length;
    const failedCount = videos.filter(v => v.status === 'Failed').length;

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Video Delivery & Media Management</span>
            <span class="adm-badge adm-badge-published">${videos.length} Assets</span>
          </h1>
          <p class="adm-page-desc">Master video archives, HLS adaptive bitrates, automated transcoder pipelines, and playback preview monitors.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openUploadVideoModal()">+ Upload New Video</button>
        </div>
      </div>

      <!-- Video Upload Dropzone Area -->
      <div class="adm-upload-dropzone" onclick="NexvionAdminApp.openUploadVideoModal()">
        <div class="adm-upload-icon">🎥</div>
        <div class="adm-upload-title">Drag & drop master recordings or click to upload</div>
        <div class="adm-upload-desc">Video storage will be connected during backend integration (Google Cloud Storage / AWS S3). Supports MP4, ProRes, WebM, and HEVC masters up to 4K 60fps.</div>
        <div class="adm-upload-meta">Auto-transcodes into 2160p, 1440p, 1080p, and 720p HLS playlists with CDN distribution</div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search video title, course, class..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onVideoSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onVideoStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All States (${videos.length})</option>
            <option value="Ready" ${state.statusFilter === 'Ready' ? 'selected' : ''}>Ready (${readyCount})</option>
            <option value="Processing" ${state.statusFilter === 'Processing' ? 'selected' : ''}>Processing (${processingCount})</option>
            <option value="Failed" ${state.statusFilter === 'Failed' ? 'selected' : ''}>Failed (${failedCount})</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onVideoVisibilityFilter(this.value)">
            <option value="ALL" ${state.visibilityFilter === 'ALL' ? 'selected' : ''}>All Visibility</option>
            <option value="Published" ${state.visibilityFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${state.visibilityFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Archived" ${state.visibilityFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onVideoSort(this.value)">
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
            <option value="duration-desc" ${state.sortBy === 'duration-desc' ? 'selected' : ''}>Sort: Duration</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetVideoFilters()">Reset</button>
        </div>
      </div>

      <!-- Videos Card Grid -->
      ${paginated.length > 0 ? `
        <div class="adm-video-grid">
          ${paginated.map(v => {
            let statusBadgeClass = 'adm-badge-ready';
            if (v.status === 'Processing') statusBadgeClass = 'adm-badge-processing';
            if (v.status === 'Failed') statusBadgeClass = 'adm-badge-failed';

            return `
              <div class="adm-video-card">
                <div class="adm-video-thumb-wrap">
                  <span class="adm-video-play-icon" onclick="NexvionAdminApp.previewVideoModal('${v.id}')" style="cursor:pointer;">▶</span>
                  <span class="adm-badge ${statusBadgeClass}" style="position:absolute; top:10px; right:10px;">
                    ${v.status || 'Ready'}
                  </span>
                  <span class="adm-video-duration-pill">${v.duration || '00:00'}</span>
                </div>
                <div class="adm-video-body">
                  <div style="font-size:0.72rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); margin-bottom:4px;">
                    ${v.courseTitle || 'Curriculum'} • ${v.classTitle || 'Lecture'}
                  </div>
                  <h4 style="margin:0 0 8px 0; font-size:0.92rem; color:var(--adm-text-primary); line-height:1.4;">${v.title}</h4>
                  <div style="font-size:0.7rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); margin-bottom:12px;">
                    ${v.resolution || '1080p'} • ${v.bitrate || 'Adaptive HLS'} • <span class="adm-badge adm-badge-published" style="font-size:0.6rem; padding:1px 6px;">${v.visibility || 'Published'}</span>
                  </div>
                  <div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--adm-border-subtle); display:flex; justify-content:space-between; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewVideoModal('${v.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openReplaceVideoModal('${v.id}')">Replace</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveVideo('${v.id}')">Archive</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="adm-card">
          ${AdminComponents.EmptyState({
            icon: '🎥',
            title: 'No videos found',
            message: 'No video streams match the selected filter criteria. Upload your first video asset.',
            actionText: 'Upload your first video',
            onAction: 'NexvionAdminApp.openUploadVideoModal'
          })}
        </div>
      `}

      <!-- Pagination -->
      <div class="adm-pagination" style="margin-top:20px;">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> videos</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onVideoPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onVideoPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onVideoPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 3: LEARNING RESOURCES & ASSET LIBRARY
  // ==========================================================================
  async function renderResourcesView() {
    const resources = await Data.getResources();
    const courses = await Data.getCourses();
    const state = AppState.resourcesView;

    let filtered = resources.filter(r => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.courseTitle && r.courseTitle.toLowerCase().includes(q)) ||
        (r.filePlaceholder && r.filePlaceholder.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q));

      const matchType = state.typeFilter === 'ALL' || r.type === state.typeFilter;
      const matchCourse = state.courseFilter === 'ALL' || r.courseTitle?.includes(state.courseFilter);
      const matchStatus = state.statusFilter === 'ALL' || r.status === state.statusFilter;

      return matchQ && matchType && matchCourse && matchStatus;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        case 'downloads-desc': return (b.downloadCount || 0) - (a.downloadCount || 0);
        default: return (a.title || '').localeCompare(b.title || '');
      }
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Learning Resources & Asset Library</span>
            <span class="adm-badge adm-badge-published">${resources.length} Assets</span>
          </h1>
          <p class="adm-page-desc">PDF reference manuals, technical documents, starter templates, Jupyter notebooks, prompt libraries, and external tools.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportResourcesList()">Export Catalog</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateResourceModal()">+ Add New Resource</button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search resource title, file, course..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onResourceSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onResourceTypeFilter(this.value)">
            <option value="ALL" ${state.typeFilter === 'ALL' ? 'selected' : ''}>All Types</option>
            <option value="PDF" ${state.typeFilter === 'PDF' ? 'selected' : ''}>PDF</option>
            <option value="Document" ${state.typeFilter === 'Document' ? 'selected' : ''}>Document</option>
            <option value="Link" ${state.typeFilter === 'Link' ? 'selected' : ''}>Link</option>
            <option value="Prompt library" ${state.typeFilter === 'Prompt library' ? 'selected' : ''}>Prompt library</option>
            <option value="Study material" ${state.typeFilter === 'Study material' ? 'selected' : ''}>Study material</option>
            <option value="Template" ${state.typeFilter === 'Template' ? 'selected' : ''}>Template</option>
            <option value="External tool" ${state.typeFilter === 'External tool' ? 'selected' : ''}>External tool</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onResourceCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.title.split(':')[0]}" ${state.courseFilter === c.title.split(':')[0] ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onResourceStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Active" ${state.statusFilter === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Locked" ${state.statusFilter === 'Locked' ? 'selected' : ''}>Locked</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onResourceSort(this.value)">
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
            <option value="downloads-desc" ${state.sortBy === 'downloads-desc' ? 'selected' : ''}>Sort: Downloads (High–Low)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetResourceFilters()">Reset</button>
        </div>
      </div>

      <!-- Resources Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="resourcesMainTable">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Type</th>
              <th>Related Curriculum</th>
              <th>File or Link Target</th>
              <th>Visibility</th>
              <th>Downloads</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(r => {
              let typeClass = 'adm-res-doc';
              if (r.type === 'PDF') typeClass = 'adm-res-pdf';
              if (r.type === 'Link') typeClass = 'adm-res-link';
              if (r.type === 'Prompt library') typeClass = 'adm-res-prompt';
              if (r.type === 'Template') typeClass = 'adm-res-template';
              if (r.type === 'External tool') typeClass = 'adm-res-tool';

              return `
                <tr>
                  <td>
                    <strong>${r.title}</strong>
                    <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${r.size || 'Digital Asset'} • ID: ${r.id}</div>
                  </td>
                  <td>
                    <span class="adm-res-badge ${typeClass}">${r.type}</span>
                  </td>
                  <td>
                    <div>${r.courseTitle || 'Curriculum'}</div>
                    <div style="font-size:0.7rem; color:var(--adm-text-secondary);">${r.moduleTitle || 'Curriculum Module'}</div>
                  </td>
                  <td>
                    <code style="font-size:0.72rem; color:var(--adm-tertiary); word-break:break-all;">${r.filePlaceholder || 'https://assets.nexvion.ai'}</code>
                  </td>
                  <td><span class="adm-badge adm-badge-published">${r.visibility || 'Public'}</span></td>
                  <td style="font-family:var(--adm-font-mono); font-weight:600;">${r.downloadCount || 0}</td>
                  <td>${AdminComponents.StatusBadge({ status: r.status || 'Active' })}</td>
                  <td style="text-align:right; white-space:nowrap;">
                    <div style="display:inline-flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewResourceModal('${r.id}')">Preview</button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openEditResourceModal('${r.id}')">Edit</button>
                      <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveResource('${r.id}')">Archive</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="8" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📁',
                    title: 'No learning resources found',
                    message: 'No learning assets match your search parameters. Add your first resource.',
                    actionText: 'Add your first resource',
                    onAction: 'NexvionAdminApp.openCreateResourceModal'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> resources</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onResourcePageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onResourcePageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onResourcePageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }


  // ==========================================================================
  // PHASE 4 ROUTE: PROJECTS MANAGEMENT
  // ==========================================================================
  async function renderProjectsView() {
    const projects = await Data.getProjects();
    const courses = await Data.getCourses();
    const tiers = await Data.getTiers();
    const state = AppState.projectsView;

    // Filter projects
    let filtered = projects.filter(p => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.moduleId && p.moduleId.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || p.courseId === state.courseFilter;
      const matchTier = state.tierFilter === 'ALL' || p.tierId === state.tierFilter;
      const matchStatus = state.statusFilter === 'ALL' || p.status === state.statusFilter;
      const matchRequired = state.requiredFilter === 'ALL' || 
        (state.requiredFilter === 'Required' && p.isRequired) ||
        (state.requiredFilter === 'Optional' && !p.isRequired);

      return matchQ && matchCourse && matchTier && matchStatus && matchRequired;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        case 'due-asc': return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        case 'due-desc': return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
        case 'course-asc': return (a.courseTitle || '').localeCompare(b.courseTitle || '');
        default: return (a.title || '').localeCompare(b.title || '');
      }
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Project Milestones & Capstones</span>
            <span class="adm-badge adm-badge-published">${projects.length} Total</span>
          </h1>
          <p class="adm-page-desc">Manage capstone requirements, rubrics, delivery guidelines, and student project evaluation criteria.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportProjectsList()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Projects
          </button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateProjectModal()">
            + Create New Project
          </button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search project title, rubric, module..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onProjectSearch(this.value)">
          
          <select class="adm-select" onchange="NexvionAdminApp.onProjectCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onProjectTierFilter(this.value)">
            <option value="ALL" ${state.tierFilter === 'ALL' ? 'selected' : ''}>All Tiers</option>
            ${tiers.map(t => `<option value="${t.id}" ${state.tierFilter === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onProjectRequiredFilter(this.value)">
            <option value="ALL" ${state.requiredFilter === 'ALL' ? 'selected' : ''}>All Requirements</option>
            <option value="Required" ${state.requiredFilter === 'Required' ? 'selected' : ''}>Required Only</option>
            <option value="Optional" ${state.requiredFilter === 'Optional' ? 'selected' : ''}>Optional Only</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onProjectStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Open" ${state.statusFilter === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Closed" ${state.statusFilter === 'Closed' ? 'selected' : ''}>Closed</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onProjectSort(this.value)">
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Sort: Title (Z–A)</option>
            <option value="due-asc" ${state.sortBy === 'due-asc' ? 'selected' : ''}>Sort: Due Date (Earliest)</option>
            <option value="due-desc" ${state.sortBy === 'due-desc' ? 'selected' : ''}>Sort: Due Date (Latest)</option>
            <option value="course-asc" ${state.sortBy === 'course-asc' ? 'selected' : ''}>Sort: Course</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetProjectFilters()">Reset</button>
        </div>
      </div>

      <!-- Projects Data Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="projectsMainTable">
          <thead>
            <tr>
              <th>Project Title & Module</th>
              <th>Course & Tier</th>
              <th>Requirement</th>
              <th>Due Date</th>
              <th>Submission Type</th>
              <th>Rubric Overview</th>
              <th>Completion Standard</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(p => `
              <tr>
                <td>
                  <div>
                    <a href="/admin/projects/${p.id}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/projects/${p.id}')" style="color:var(--adm-text-primary); font-weight:700; text-decoration:none;">
                      ${p.title}
                    </a>
                    <div style="font-size:0.72rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${p.moduleTitle || p.moduleId || 'Curriculum Module'} • ID: ${p.id}</div>
                  </div>
                </td>
                <td>
                  <div>${p.courseTitle || 'Curriculum'}</div>
                  <span class="adm-badge ${p.tierId === 'ai-foundations' ? 'adm-badge-open' : 'adm-badge-published'}" style="font-size:0.65rem;">${p.tierName || p.tierId || 'Tier'}</span>
                </td>
                <td>
                  <span class="adm-badge ${p.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">
                    ${p.isRequired ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td style="font-family:var(--adm-font-mono); font-size:0.78rem; white-space:nowrap;">
                  ${p.dueDate || 'Ongoing'}
                </td>
                <td style="font-size:0.78rem;">
                  <span style="color:var(--adm-tertiary); font-family:var(--adm-font-mono);">${p.submissionType || 'Repository + URL'}</span>
                </td>
                <td style="max-width:220px; font-size:0.75rem; color:var(--adm-text-secondary); line-height:1.4;">
                  ${p.rubric || 'Standard rubric'}
                </td>
                <td style="font-size:0.75rem; color:var(--adm-text-secondary);">
                  ${p.completionRequirement || 'Passing score >= 80%'}
                </td>
                <td>
                  ${AdminComponents.StatusBadge({ status: p.status || 'Published' })}
                </td>
                <td style="text-align:right; white-space:nowrap;">
                  <div style="display:inline-flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/projects/${p.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewProjectModal('${p.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.duplicateProject('${p.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveProject('${p.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="9" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '🛠️',
                    title: 'No project milestones found',
                    message: 'Adjust your search terms or filter selections to view matching project specifications.',
                    actionText: 'Reset Filters',
                    onAction: 'NexvionAdminApp.resetProjectFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> projects</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onProjectPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onProjectPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onProjectPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 4 ROUTE: PROJECT DETAIL & EDIT
  // ==========================================================================
  async function renderProjectDetailView(projectId) {
    AppState.activeProjectId = projectId;
    const project = await Data.getProjectById(projectId);
    if (!project) {
      DOM.content.innerHTML = AdminComponents.EmptyState({
        icon: '🛠️',
        title: 'Project Milestone Not Found',
        message: `No active project found with identifier "${projectId}".`,
        actionText: 'Back to Projects',
        onAction: 'NexvionAdminApp.navigateTo("/admin/projects")'
      });
      return;
    }

    const courses = await Data.getCourses();
    const tiers = await Data.getTiers();
    const allSubmissions = await Data.getSubmissions();
    const projectSubmissions = allSubmissions.filter(s => s.itemId === projectId || s.assignmentId === projectId);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/projects')">
              ← Back to Projects
            </button>
            ${AdminComponents.StatusBadge({ status: project.status || 'Published' })}
            <span class="adm-badge ${project.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">${project.isRequired ? 'Required' : 'Optional'}</span>
            <span style="font-family:var(--adm-font-mono); font-size:0.72rem; color:var(--adm-text-muted);">ID: ${project.id}</span>
          </div>
          <h1 class="adm-page-title">${project.title}</h1>
          <p class="adm-page-desc">${project.courseTitle} • ${project.tierName || 'Curriculum Tier'} • Due: ${project.dueDate || 'Flexible'}</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.previewProjectModal('${project.id}')">Preview Student View</button>
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.duplicateProject('${project.id}')">Duplicate</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.saveProjectDetail('${project.id}')">Save Changes</button>
        </div>
      </div>

      <!-- Unsaved Changes Protection Banner -->
      ${AppState.hasUnsavedChanges ? `
        <div class="adm-dirty-banner" id="admDirtyBanner">
          <div class="adm-dirty-text">
            <span>⚠️ You have unsaved specifications for this project milestone.</span>
          </div>
          <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.saveProjectDetail('${project.id}')">Save Changes</button>
        </div>
      ` : ''}

      <div class="adm-detail-grid">
        <div class="adm-detail-main">
          <!-- Project Specification Form -->
          <div class="adm-card">
            <h3 class="adm-card-title">Project Specification & Parameters</h3>
            <form id="projectDetailForm" oninput="NexvionAdminApp.markDirty()" style="margin-top:16px;">
              <div class="adm-form-group">
                <label class="adm-form-label">Project Title <span class="adm-req-star">*</span></label>
                <input type="text" class="adm-input" id="editProjTitle" value="${project.title || ''}" required>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Course Curriculum</label>
                  <select class="adm-select" id="editProjCourse" style="width:100%;">
                    ${courses.map(c => `<option value="${c.id}" ${c.id === project.courseId ? 'selected' : ''}>${c.title}</option>`).join('')}
                  </select>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Curriculum Tier</label>
                  <select class="adm-select" id="editProjTier" style="width:100%;">
                    ${tiers.map(t => `<option value="${t.id}" ${t.id === project.tierId ? 'selected' : ''}>${t.name}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Module Association</label>
                  <input type="text" class="adm-input" id="editProjModule" value="${project.moduleTitle || project.moduleId || ''}" placeholder="e.g. Module 01: Full-Stack AI Integration">
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Requirement Status</label>
                  <select class="adm-select" id="editProjRequired" style="width:100%;">
                    <option value="true" ${project.isRequired ? 'selected' : ''}>Required (Mandatory for completion)</option>
                    <option value="false" ${!project.isRequired ? 'selected' : ''}>Optional (Portfolio honors)</option>
                  </select>
                </div>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Due Date</label>
                  <input type="date" class="adm-input" id="editProjDueDate" value="${project.dueDate || ''}">
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Submission Type Format</label>
                  <input type="text" class="adm-input" id="editProjSubmissionType" value="${project.submissionType || ''}" placeholder="e.g. GitHub Repo + Deployed Live URL">
                </div>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Short Description</label>
                <textarea class="adm-textarea" id="editProjDesc" style="min-height:75px;">${project.description || ''}</textarea>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Student Instructions & Implementation Guide</label>
                <textarea class="adm-textarea" id="editProjInstructions" style="min-height:140px; font-family:var(--adm-font-mono); font-size:0.8rem;">${project.instructions || ''}</textarea>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Grading Rubric Specifications</label>
                <textarea class="adm-textarea" id="editProjRubric" style="min-height:80px;">${project.rubric || ''}</textarea>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Completion Standard</label>
                  <input type="text" class="adm-input" id="editProjCompletion" value="${project.completionRequirement || 'Passing grade >= 80% with faculty evaluation'}">
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Lifecycle Status</label>
                  <select class="adm-select" id="editProjStatus" style="width:100%;">
                    <option value="Draft" ${project.status === 'Draft' ? 'selected' : ''}>Draft</option>
                    <option value="Published" ${project.status === 'Published' ? 'selected' : ''}>Published</option>
                    <option value="Open" ${project.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="Closed" ${project.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    <option value="Archived" ${project.status === 'Archived' ? 'selected' : ''}>Archived</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar: Linked Submissions & Stats -->
        <div class="adm-detail-aside">
          <div class="adm-card">
            <h3 class="adm-card-title">Student Submissions (${projectSubmissions.length})</h3>
            <div style="margin-top:14px; display:flex; flex-direction:column; gap:10px;">
              ${projectSubmissions.length > 0 ? projectSubmissions.map(sub => `
                <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:6px; padding:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:0.82rem; color:var(--adm-text-primary);">${sub.studentName}</strong>
                    ${AdminComponents.StatusBadge({ status: sub.status })}
                  </div>
                  <div style="font-size:0.72rem; color:var(--adm-text-secondary); margin-bottom:8px;">${sub.batchName || 'Cohort'} • ${new Date(sub.submittedAt).toLocaleDateString()}</div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:var(--adm-font-mono); font-size:0.75rem; font-weight:700;">Score: ${sub.score !== null ? `${sub.score}/100` : 'Pending'}</span>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openSubmissionReviewDrawer('${sub.id}')">Evaluate</button>
                  </div>
                </div>
              `).join('') : `
                <p style="font-size:0.8rem; color:var(--adm-text-muted); text-align:center; padding:16px 0;">No student submissions on record for this milestone.</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 4 ROUTE: ASSIGNMENTS DIRECTORY
  // ==========================================================================
  async function renderAssignmentsView() {
    const assignments = await Data.getAssignments();
    const courses = await Data.getCourses();
    const state = AppState.assignmentsView;

    // Filter assignments
    let filtered = assignments.filter(a => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.instructions && a.instructions.toLowerCase().includes(q)) ||
        (a.moduleId && a.moduleId.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || a.courseId === state.courseFilter;
      const matchStatus = state.statusFilter === 'ALL' || a.status === state.statusFilter;
      const matchRequired = state.requiredFilter === 'ALL' ||
        (state.requiredFilter === 'Required' && a.isRequired) ||
        (state.requiredFilter === 'Optional' && !a.isRequired);

      return matchQ && matchCourse && matchStatus && matchRequired;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'due-asc': return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        case 'due-desc': return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'points-desc': return (b.points || 0) - (a.points || 0);
        default: return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Curriculum Assignments</span>
            <span class="adm-badge adm-badge-published">${assignments.length} Total</span>
          </h1>
          <p class="adm-page-desc">Create technical assignments, define submission formats, set grading points, and track completion requirements.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportAssignmentsList()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Assignments
          </button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateAssignmentModal()">
            + Create New Assignment
          </button>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search assignment title, instructions, ID..." value="${state.searchTerm}" style="min-width:220px;" oninput="NexvionAdminApp.onAssignmentSearch(this.value)">
          
          <select class="adm-select" onchange="NexvionAdminApp.onAssignmentCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAssignmentRequiredFilter(this.value)">
            <option value="ALL" ${state.requiredFilter === 'ALL' ? 'selected' : ''}>All Requirements</option>
            <option value="Required" ${state.requiredFilter === 'Required' ? 'selected' : ''}>Required Only</option>
            <option value="Optional" ${state.requiredFilter === 'Optional' ? 'selected' : ''}>Optional Only</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAssignmentStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Open" ${state.statusFilter === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Closed" ${state.statusFilter === 'Closed' ? 'selected' : ''}>Closed</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onAssignmentSort(this.value)">
            <option value="due-asc" ${state.sortBy === 'due-asc' ? 'selected' : ''}>Sort: Due Date (Earliest)</option>
            <option value="due-desc" ${state.sortBy === 'due-desc' ? 'selected' : ''}>Sort: Due Date (Latest)</option>
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="points-desc" ${state.sortBy === 'points-desc' ? 'selected' : ''}>Sort: Points (High–Low)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetAssignmentFilters()">Reset</button>
        </div>
      </div>

      <!-- Assignments Data Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="assignmentsMainTable">
          <thead>
            <tr>
              <th>Assignment Title & Module</th>
              <th>Course Curriculum</th>
              <th>Requirement</th>
              <th>Due Date</th>
              <th>Submission Type</th>
              <th>Review Requirements</th>
              <th>Max Points</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(a => `
              <tr>
                <td>
                  <div>
                    <a href="/admin/assignments/${a.id}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/assignments/${a.id}')" style="color:var(--adm-text-primary); font-weight:700; text-decoration:none;">
                      ${a.title}
                    </a>
                    <div style="font-size:0.72rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${a.moduleTitle || a.moduleId || 'Curriculum Module'} • ID: ${a.id}</div>
                  </div>
                </td>
                <td>
                  <div style="font-weight:500;">${a.courseTitle || 'Curriculum'}</div>
                </td>
                <td>
                  <span class="adm-badge ${a.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">
                    ${a.isRequired ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td style="font-family:var(--adm-font-mono); font-size:0.78rem; white-space:nowrap;">
                  ${a.dueDate || 'Flexible'}
                </td>
                <td style="font-size:0.78rem;">
                  <span style="color:var(--adm-tertiary); font-family:var(--adm-font-mono);">${a.submissionType || 'GitHub Repo'}</span>
                </td>
                <td style="max-width:220px; font-size:0.75rem; color:var(--adm-text-secondary); line-height:1.4;">
                  ${a.reviewRequirements || 'Standard review standard'}
                </td>
                <td style="font-family:var(--adm-font-mono); font-size:0.8rem; font-weight:700;">
                  ${a.points || 100} pts
                </td>
                <td>
                  ${AdminComponents.StatusBadge({ status: a.status || 'Open' })}
                </td>
                <td style="text-align:right; white-space:nowrap;">
                  <div style="display:inline-flex; gap:6px;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/assignments/${a.id}')">Edit</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.previewAssignmentModal('${a.id}')">Preview</button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.duplicateAssignment('${a.id}')">Duplicate</button>
                    <button class="adm-btn adm-btn-sm adm-btn-danger" onclick="NexvionAdminApp.archiveAssignment('${a.id}')">Archive</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="9" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📝',
                    title: 'No assignments found',
                    message: 'Adjust your search terms or filter selections to view matching curriculum assignments.',
                    actionText: 'Reset Filters',
                    onAction: 'NexvionAdminApp.resetAssignmentFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> assignments</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onAssignmentPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onAssignmentPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onAssignmentPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 4 ROUTE: ASSIGNMENT DETAIL & EDIT
  // ==========================================================================
  async function renderAssignmentDetailView(assignmentId) {
    AppState.activeAssignmentId = assignmentId;
    const assignment = await Data.getAssignmentById(assignmentId);
    if (!assignment) {
      DOM.content.innerHTML = AdminComponents.EmptyState({
        icon: '📝',
        title: 'Assignment Requirement Not Found',
        message: `No active assignment found with identifier "${assignmentId}".`,
        actionText: 'Back to Assignments',
        onAction: 'NexvionAdminApp.navigateTo("/admin/assignments")'
      });
      return;
    }

    const courses = await Data.getCourses();
    const allSubmissions = await Data.getSubmissions();
    const assignmentSubmissions = allSubmissions.filter(s => s.itemId === assignmentId || s.assignmentId === assignmentId);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/assignments')">
              ← Back to Assignments
            </button>
            ${AdminComponents.StatusBadge({ status: assignment.status || 'Open' })}
            <span class="adm-badge ${assignment.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">${assignment.isRequired ? 'Required' : 'Optional'}</span>
            <span style="font-family:var(--adm-font-mono); font-size:0.72rem; color:var(--adm-text-muted);">ID: ${assignment.id}</span>
          </div>
          <h1 class="adm-page-title">${assignment.title}</h1>
          <p class="adm-page-desc">${assignment.courseTitle} • ${assignment.points || 100} Points • Due: ${assignment.dueDate || 'Flexible'}</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.previewAssignmentModal('${assignment.id}')">Preview Student View</button>
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.duplicateAssignment('${assignment.id}')">Duplicate</button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.saveAssignmentDetail('${assignment.id}')">Save Changes</button>
        </div>
      </div>

      <!-- Unsaved Changes Banner -->
      ${AppState.hasUnsavedChanges ? `
        <div class="adm-dirty-banner" id="admDirtyBanner">
          <div class="adm-dirty-text">
            <span>⚠️ You have unsaved specifications for this assignment.</span>
          </div>
          <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.saveAssignmentDetail('${assignment.id}')">Save Changes</button>
        </div>
      ` : ''}

      <div class="adm-detail-grid">
        <div class="adm-detail-main">
          <!-- Assignment Specification Form -->
          <div class="adm-card">
            <h3 class="adm-card-title">Assignment Criteria & Instructions</h3>
            <form id="assignmentDetailForm" oninput="NexvionAdminApp.markDirty()" style="margin-top:16px;">
              <div class="adm-form-group">
                <label class="adm-form-label">Assignment Title <span class="adm-req-star">*</span></label>
                <input type="text" class="adm-input" id="editAsgTitle" value="${assignment.title || ''}" required>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Course Curriculum</label>
                  <select class="adm-select" id="editAsgCourse" style="width:100%;">
                    ${courses.map(c => `<option value="${c.id}" ${c.id === assignment.courseId ? 'selected' : ''}>${c.title}</option>`).join('')}
                  </select>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Module Association</label>
                  <input type="text" class="adm-input" id="editAsgModule" value="${assignment.moduleTitle || assignment.moduleId || ''}" placeholder="e.g. Module 01: Neural Foundations">
                </div>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Requirement Status</label>
                  <select class="adm-select" id="editAsgRequired" style="width:100%;">
                    <option value="true" ${assignment.isRequired ? 'selected' : ''}>Required (Core curriculum)</option>
                    <option value="false" ${!assignment.isRequired ? 'selected' : ''}>Optional (Supplemental challenge)</option>
                  </select>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Due Date</label>
                  <input type="date" class="adm-input" id="editAsgDueDate" value="${assignment.dueDate || ''}">
                </div>
              </div>

              <div class="adm-editor-grid">
                <div class="adm-form-group">
                  <label class="adm-form-label">Submission Format</label>
                  <input type="text" class="adm-input" id="editAsgSubmissionType" value="${assignment.submissionType || ''}" placeholder="e.g. GitHub Repository">
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Maximum Points</label>
                  <input type="number" class="adm-input" id="editAsgPoints" value="${assignment.points || 100}">
                </div>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Student Instructions & Prompt Scenario</label>
                <textarea class="adm-textarea" id="editAsgInstructions" style="min-height:120px; font-family:var(--adm-font-mono); font-size:0.8rem;">${assignment.instructions || ''}</textarea>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Review Requirements & Verification Checks</label>
                <textarea class="adm-textarea" id="editAsgRequirements" style="min-height:80px;">${assignment.reviewRequirements || ''}</textarea>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Status</label>
                <select class="adm-select" id="editAsgStatus" style="width:100%;">
                  <option value="Draft" ${assignment.status === 'Draft' ? 'selected' : ''}>Draft</option>
                  <option value="Published" ${assignment.status === 'Published' ? 'selected' : ''}>Published</option>
                  <option value="Open" ${assignment.status === 'Open' ? 'selected' : ''}>Open</option>
                  <option value="Closed" ${assignment.status === 'Closed' ? 'selected' : ''}>Closed</option>
                  <option value="Archived" ${assignment.status === 'Archived' ? 'selected' : ''}>Archived</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar: Linked Submissions -->
        <div class="adm-detail-aside">
          <div class="adm-card">
            <h3 class="adm-card-title">Student Submissions (${assignmentSubmissions.length})</h3>
            <div style="margin-top:14px; display:flex; flex-direction:column; gap:10px;">
              ${assignmentSubmissions.length > 0 ? assignmentSubmissions.map(sub => `
                <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:6px; padding:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:0.82rem; color:var(--adm-text-primary);">${sub.studentName}</strong>
                    ${AdminComponents.StatusBadge({ status: sub.status })}
                  </div>
                  <div style="font-size:0.72rem; color:var(--adm-text-secondary); margin-bottom:8px;">${sub.batchName || 'Cohort'} • ${new Date(sub.submittedAt).toLocaleDateString()}</div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:var(--adm-font-mono); font-size:0.75rem; font-weight:700;">Score: ${sub.score !== null ? `${sub.score}/100` : 'Pending'}</span>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openSubmissionReviewDrawer('${sub.id}')">Evaluate</button>
                  </div>
                </div>
              `).join('') : `
                <p style="font-size:0.8rem; color:var(--adm-text-muted); text-align:center; padding:16px 0;">No student submissions on record for this assignment.</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PHASE 4 ROUTE: SUBMISSIONS MANAGEMENT & GRADING DESK
  // ==========================================================================
  async function renderSubmissionsView() {
    const submissions = await Data.getSubmissions();
    const courses = await Data.getCourses();
    const batches = await Data.getBatches();
    const state = AppState.submissionsView;

    // Filter submissions
    let filtered = submissions.filter(s => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (s.studentName && s.studentName.toLowerCase().includes(q)) ||
        (s.studentEmail && s.studentEmail.toLowerCase().includes(q)) ||
        (s.itemTitle && s.itemTitle.toLowerCase().includes(q)) ||
        (s.assignmentTitle && s.assignmentTitle.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q));

      const matchCourse = state.courseFilter === 'ALL' || s.courseId === state.courseFilter;
      const matchBatch = state.batchFilter === 'ALL' || s.batchId === state.batchFilter;
      const matchItem = state.itemFilter === 'ALL' || 
        (state.itemFilter === 'Projects' && s.type === 'Project') ||
        (state.itemFilter === 'Assignments' && s.type === 'Assignment');
      const matchStatus = state.statusFilter === 'ALL' || s.status === state.statusFilter;
      const matchReviewer = state.reviewerFilter === 'ALL' || s.reviewer === state.reviewerFilter;

      return matchQ && matchCourse && matchBatch && matchItem && matchStatus && matchReviewer;
    });

    // Sort submissions
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'date-desc': return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
        case 'date-asc': return new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
        case 'score-desc': return (b.score || 0) - (a.score || 0);
        case 'score-asc': return (a.score || 0) - (b.score || 0);
        case 'student-asc': return (a.studentName || '').localeCompare(b.studentName || '');
        default: return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
      }
    });

    const pendingCount = submissions.filter(s => s.status === 'Pending review').length;
    const reviewedCount = submissions.filter(s => s.status === 'Reviewed').length;
    const revisionCount = submissions.filter(s => s.status === 'Returned for revision').length;
    const scoredSubs = submissions.filter(s => s.score !== null && s.score !== undefined);
    const avgScore = scoredSubs.length ? Math.round(scoredSubs.reduce((acc, s) => acc + Number(s.score), 0) / scoredSubs.length) : 0;

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Student Submissions & Grading Desk</span>
            <span class="adm-badge adm-badge-waitlist">${pendingCount} Pending Evaluation</span>
          </h1>
          <p class="adm-page-desc">Centralized review desk for project capstones and assignments. Evaluate code repositories, enter score placeholders, issue reviewer critique, and approve completion.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportSubmissionsList()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Submissions
          </button>
        </div>
      </div>

      <!-- Operational Counter Cards -->
      <div class="adm-stats-grid">
        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Pending Review</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(245,158,11,0.12); color:var(--adm-warning);">⏳</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${pendingCount}</span>
            <span class="adm-stat-delta down">Queue Active</span>
          </div>
          <span class="adm-stat-sub">Submissions awaiting faculty score & feedback</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Evaluated & Reviewed</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(0,132,112,0.12); color:var(--adm-tertiary);">✓</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${reviewedCount}</span>
            <span class="adm-stat-delta up">Completed</span>
          </div>
          <span class="adm-stat-sub">Scores and structured critique finalized</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Returned for Revision</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(239,68,68,0.12); color:var(--adm-error);">↩️</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${revisionCount}</span>
            <span class="adm-stat-delta down">Iterating</span>
          </div>
          <span class="adm-stat-sub">Students prompted to address rubrics</span>
        </div>

        <div class="adm-stat-card">
          <div class="adm-stat-header">
            <span class="adm-stat-label">Cohort Average Score</span>
            <div class="adm-stat-icon-wrap" style="background:rgba(127,82,255,0.12); color:var(--adm-primary);">📈</div>
          </div>
          <div class="adm-stat-val-wrap">
            <span class="adm-stat-value">${avgScore} / 100</span>
            <span class="adm-stat-delta up">Passing</span>
          </div>
          <span class="adm-stat-sub">Across ${scoredSubs.length} evaluated deliverables</span>
        </div>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search learner, deliverable, ID..." value="${state.searchTerm}" style="min-width:200px;" oninput="NexvionAdminApp.onSubmissionSearch(this.value)">
          
          <select class="adm-select" onchange="NexvionAdminApp.onSubmissionCourseFilter(this.value)">
            <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
            ${courses.map(c => `<option value="${c.id}" ${state.courseFilter === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onSubmissionBatchFilter(this.value)">
            <option value="ALL" ${state.batchFilter === 'ALL' ? 'selected' : ''}>All Cohorts</option>
            ${batches.map(b => `<option value="${b.id}" ${state.batchFilter === b.id ? 'selected' : ''}>${b.name} (${b.enrolledCount}/30)</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onSubmissionItemFilter(this.value)">
            <option value="ALL" ${state.itemFilter === 'ALL' ? 'selected' : ''}>All Deliverable Types</option>
            <option value="Projects" ${state.itemFilter === 'Projects' ? 'selected' : ''}>Capstones & Projects</option>
            <option value="Assignments" ${state.itemFilter === 'Assignments' ? 'selected' : ''}>Weekly Assignments</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onSubmissionStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Pending review" ${state.statusFilter === 'Pending review' ? 'selected' : ''}>Pending review</option>
            <option value="Reviewed" ${state.statusFilter === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
            <option value="Returned for revision" ${state.statusFilter === 'Returned for revision' ? 'selected' : ''}>Returned for revision</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onSubmissionReviewerFilter(this.value)">
            <option value="ALL" ${state.reviewerFilter === 'ALL' ? 'selected' : ''}>All Reviewers</option>
            <option value="Dr. Evelyn Vance" ${state.reviewerFilter === 'Dr. Evelyn Vance' ? 'selected' : ''}>Dr. Evelyn Vance</option>
            <option value="Marcus Chen" ${state.reviewerFilter === 'Marcus Chen' ? 'selected' : ''}>Marcus Chen</option>
            <option value="Academic Desk" ${state.reviewerFilter === 'Academic Desk' ? 'selected' : ''}>Academic Desk</option>
            <option value="Unassigned" ${state.reviewerFilter === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onSubmissionSort(this.value)">
            <option value="date-desc" ${state.sortBy === 'date-desc' ? 'selected' : ''}>Sort: Date (Newest)</option>
            <option value="date-asc" ${state.sortBy === 'date-asc' ? 'selected' : ''}>Sort: Date (Oldest)</option>
            <option value="score-desc" ${state.sortBy === 'score-desc' ? 'selected' : ''}>Sort: Score (High–Low)</option>
            <option value="score-asc" ${state.sortBy === 'score-asc' ? 'selected' : ''}>Sort: Score (Low–High)</option>
            <option value="student-asc" ${state.sortBy === 'student-asc' ? 'selected' : ''}>Sort: Student (A–Z)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetSubmissionFilters()">Reset</button>
        </div>
      </div>

      <!-- Submissions Data Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="submissionsMainTable">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Deliverable Item</th>
              <th>Course Curriculum</th>
              <th>Cohort Batch (Cap 30)</th>
              <th>Submission Date</th>
              <th>Evaluation Status</th>
              <th>Score</th>
              <th>Reviewer</th>
              <th>Last Updated</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(s => {
              const itemTitle = s.itemTitle || s.assignmentTitle || 'Deliverable Item';
              const isProject = s.type === 'Project' || s.itemId?.startsWith('prj-');
              const initials = s.studentAvatar || (s.studentName || 'ST').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const scoreClass = s.score !== null ? (s.score >= 80 ? 'high' : 'low') : 'pending';

              return `
                <tr>
                  <td>
                    <div class="adm-student-cell">
                      <div class="adm-student-avatar">${initials}</div>
                      <div>
                        <a href="/admin/students/${s.studentId}" onclick="event.preventDefault(); NexvionAdminApp.navigateTo('/admin/students/${s.studentId}')" style="color:var(--adm-text-primary); font-weight:700; text-decoration:none; display:block;">
                          ${s.studentName}
                        </a>
                        <span style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${s.studentEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span class="adm-badge ${isProject ? 'adm-badge-published' : 'adm-badge-upcoming'}" style="font-size:0.65rem; margin-bottom:2px;">
                        ${isProject ? 'PROJECT' : 'ASSIGNMENT'}
                      </span>
                      <strong style="display:block; font-size:0.82rem; color:var(--adm-text-primary);">${itemTitle}</strong>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.82rem;">${s.courseTitle}</div>
                  </td>
                  <td>
                    <div>
                      <strong style="font-size:0.8rem; color:var(--adm-text-primary);">${s.batchName || 'Unassigned'}</strong>
                      <div style="font-size:0.68rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">30 Seat Capacity</div>
                    </div>
                  </td>
                  <td style="font-size:0.75rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono); white-space:nowrap;">
                    ${new Date(s.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: s.status })}
                  </td>
                  <td>
                    <span class="adm-score-pill ${scoreClass}">
                      ${s.score !== null && s.score !== undefined ? `${s.score} / 100` : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:0.78rem; color:var(--adm-text-secondary);">${s.reviewer || 'Unassigned'}</span>
                  </td>
                  <td style="font-size:0.72rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); white-space:nowrap;">
                    ${s.lastUpdated ? new Date(s.lastUpdated).toLocaleDateString() : '—'}
                  </td>
                  <td style="text-align:right; white-space:nowrap;">
                    <button class="adm-btn adm-btn-sm ${s.status === 'Pending review' ? 'adm-btn-primary' : 'adm-btn-secondary'}" onclick="NexvionAdminApp.openSubmissionReviewDrawer('${s.id}')">
                      ${s.status === 'Pending review' ? 'Evaluate' : 'Review Details'}
                    </button>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="10" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📥',
                    title: 'No student submissions found',
                    message: 'Adjust your search parameters or filter selections to view matching student submissions.',
                    actionText: 'Reset Filters',
                    onAction: 'NexvionAdminApp.resetSubmissionFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> submissions</span>
          <label style="display:flex; align-items:center; gap:6px; margin-left:14px; font-size:0.75rem;">
            Per Page:
            <select class="adm-select" style="padding:3px 8px; font-size:0.75rem;" onchange="NexvionAdminApp.onSubmissionPageSize(this.value)">
              <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="25" ${state.pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
            </select>
          </label>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onSubmissionPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onSubmissionPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // --- ANNOUNCEMENTS & NOTIFICATIONS UTILITIES ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMarkdownPreview(md) {
    if (!md) return '<p style="color:var(--adm-text-muted); font-style:italic; padding:12px 0;">No rich content provided yet. Type in the markdown editor to compose.</p>';
    let html = escapeHtml(md);
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 style="margin:14px 0 6px 0; font-size:0.95rem; font-weight:700; color:var(--adm-text-primary);">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="margin:18px 0 8px 0; font-size:1.15rem; font-weight:700; color:var(--adm-text-primary); border-bottom:1px solid var(--adm-border-subtle); padding-bottom:4px;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="margin:22px 0 10px 0; font-size:1.35rem; font-weight:800; color:var(--adm-text-primary);">$1</h2>');
    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left:3px solid var(--adm-primary); padding:6px 14px; margin:12px 0; background:rgba(127,82,255,0.04); border-radius:0 6px 6px 0; color:var(--adm-text-secondary); font-style:italic;">$1</blockquote>');
    // Bold & italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--adm-text-primary); font-weight:700;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); padding:2px 6px; border-radius:4px; font-family:var(--adm-font-mono); font-size:0.85em; color:var(--adm-primary);">$1</code>');
    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li style="margin-left:20px; list-style-type:disc; color:var(--adm-text-secondary); margin-bottom:4px; font-size:0.88rem;">$1</li>');
    // Ordered lists
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li style="margin-left:20px; list-style-type:decimal; color:var(--adm-text-secondary); margin-bottom:4px; font-size:0.88rem;">$1</li>');
    // Newlines
    html = html.replace(/\n\n/g, '<p style="margin:8px 0;"></p>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function calculateAudienceReach(audience, courseId, tierId, batchId) {
    if (audience === 'All Students' || audience === 'All Enrolled Students') {
      return 1248;
    }
    if (audience === 'Faculty Only') {
      return 14;
    }
    if (audience === 'Specific Batch' && batchId) {
      if (batchId === 'batch-bld-01') return 26;
      if (batchId === 'batch-fnd-01') return 28;
      if (batchId === 'batch-crt-01') return 30;
      if (batchId === 'batch-arc-01') return 18;
      return 30;
    }
    if (audience === 'Specific Tier' && tierId) {
      if (tierId === 'tier-foundations') return 420;
      if (tierId === 'tier-builder') return 384;
      if (tierId === 'tier-creator') return 290;
      if (tierId === 'tier-architect') return 154;
      return 350;
    }
    if (audience === 'Specific Course' && courseId) {
      if (courseId === 'course-ai-foundations') return 420;
      if (courseId === 'course-ai-builder') return 384;
      if (courseId === 'course-ai-creator') return 290;
      if (courseId === 'course-ai-architect') return 154;
      return 380;
    }
    return 1248;
  }

  // --- ROUTE: ANNOUNCEMENTS DIRECTORY ---
  async function renderAnnouncementsView() {
    const announcements = await Data.getAnnouncements();
    const courses = await Data.getCourses();
    const state = AppState.announcementsView;

    // Filter announcements
    let filtered = announcements.filter(a => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        ((a.message || a.body || '').toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        (a.targetName && a.targetName.toLowerCase().includes(q));

      const matchAudience = state.audienceFilter === 'ALL' || a.audience === state.audienceFilter;
      const matchStatus = state.statusFilter === 'ALL' || a.status === state.statusFilter;
      const matchPriority = state.priorityFilter === 'ALL' || (a.priority || 'Normal') === state.priorityFilter;

      return matchQ && matchAudience && matchStatus && matchPriority;
    });

    // Sort announcements
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'date-asc':
          return new Date(a.publishedAt || a.scheduledFor || 0) - new Date(b.publishedAt || b.scheduledFor || 0);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'priority-desc': {
          const pOrder = { Urgent: 4, High: 3, Normal: 2, Low: 1 };
          return (pOrder[b.priority || 'Normal'] || 0) - (pOrder[a.priority || 'Normal'] || 0);
        }
        case 'date-desc':
        default:
          return new Date(b.publishedAt || b.scheduledFor || 0) - new Date(a.publishedAt || a.scheduledFor || 0);
      }
    });

    // Metrics
    const totalCount = announcements.length;
    const publishedCount = announcements.filter(a => a.status === 'Published').length;
    const scheduledCount = announcements.filter(a => a.status === 'Scheduled').length;
    const draftCount = announcements.filter(a => ['Draft', 'Archived'].includes(a.status)).length;

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Broadcast Announcements</span>
            <span class="adm-badge adm-badge-published">${totalCount} Total</span>
          </h1>
          <p class="adm-page-desc">Author and dispatch institutional announcements, cohort circulars, maintenance advisories, and academic notices.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="showToast('Export Archive', 'Announcement archive summary exported to CSV.', 'success')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.navigateTo('/admin/announcements/new')">
            + Compose Announcement
          </button>
        </div>
      </div>

      <!-- KPI Metrics Grid -->
      <div class="adm-kpi-grid">
        ${AdminComponents.StatCard({
          label: 'Total Platform Circulars',
          value: totalCount,
          subtext: 'Historical notice dispatches',
          icon: '📢'
        })}
        ${AdminComponents.StatCard({
          label: 'Active & Published',
          value: publishedCount,
          subtext: 'Visible in student portals',
          icon: '🌐'
        })}
        ${AdminComponents.StatCard({
          label: 'Scheduled Releases',
          value: scheduledCount,
          subtext: 'Pending automated broadcast',
          icon: '⏰'
        })}
        ${AdminComponents.StatCard({
          label: 'Drafts & Archived',
          value: draftCount,
          subtext: 'Work in progress or closed',
          icon: '📁'
        })}
      </div>

      <!-- Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group" style="flex:1;">
          <input type="text" class="adm-input" placeholder="Search notices by title, message, author..." value="${escapeHtml(state.searchTerm)}" style="min-width:240px;" oninput="NexvionAdminApp.onAnnouncementSearch(this.value)">

          <select class="adm-select" onchange="NexvionAdminApp.onAnnouncementAudienceFilter(this.value)">
            <option value="ALL" ${state.audienceFilter === 'ALL' ? 'selected' : ''}>All Audiences</option>
            <option value="All Students" ${state.audienceFilter === 'All Students' ? 'selected' : ''}>All Students</option>
            <option value="Specific Course" ${state.audienceFilter === 'Specific Course' ? 'selected' : ''}>Specific Course</option>
            <option value="Specific Tier" ${state.audienceFilter === 'Specific Tier' ? 'selected' : ''}>Specific Tier</option>
            <option value="Specific Batch" ${state.audienceFilter === 'Specific Batch' ? 'selected' : ''}>Specific Batch</option>
            <option value="Faculty Only" ${state.audienceFilter === 'Faculty Only' ? 'selected' : ''}>Faculty Only</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAnnouncementStatusFilter(this.value)">
            <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Scheduled" ${state.statusFilter === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="Published" ${state.statusFilter === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Archived" ${state.statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAnnouncementPriorityFilter(this.value)">
            <option value="ALL" ${state.priorityFilter === 'ALL' ? 'selected' : ''}>All Priorities</option>
            <option value="Low" ${state.priorityFilter === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Normal" ${state.priorityFilter === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="High" ${state.priorityFilter === 'High' ? 'selected' : ''}>High</option>
            <option value="Urgent" ${state.priorityFilter === 'Urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onAnnouncementSort(this.value)">
            <option value="date-desc" ${state.sortBy === 'date-desc' ? 'selected' : ''}>Sort: Newest First</option>
            <option value="date-asc" ${state.sortBy === 'date-asc' ? 'selected' : ''}>Sort: Oldest First</option>
            <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Sort: Title (A–Z)</option>
            <option value="priority-desc" ${state.sortBy === 'priority-desc' ? 'selected' : ''}>Sort: Priority (Urgent)</option>
          </select>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetAnnouncementFilters()">Reset</button>
        </div>
      </div>

      <!-- Announcements Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="announcementsMainTable">
          <thead>
            <tr>
              <th style="min-width:280px;">Announcement Title & Summary</th>
              <th>Target Audience</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Release / Schedule</th>
              <th>Estimated Reach</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(a => {
              const reach = a.estimatedRecipients || calculateAudienceReach(a.audience, a.targetCourseId, a.targetTierId, a.targetBatchId);
              const dateStr = a.status === 'Scheduled' && a.scheduledFor
                ? `⏰ ${new Date(a.scheduledFor).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}`
                : a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString([], { month:'short', day:'numeric', year:'numeric' })
                  : 'Draft (Unpublished)';

              return `
                <tr>
                  <td>
                    <div style="font-weight:600; color:var(--adm-text-primary); cursor:pointer;" onclick="NexvionAdminApp.navigateTo('/admin/announcements/${a.id}')">
                      ${escapeHtml(a.title)}
                    </div>
                    <div style="font-size:0.78rem; color:var(--adm-text-secondary); margin-top:3px; line-height:1.4; max-width:480px;">
                      ${escapeHtml((a.message || a.body || '').slice(0, 110))}${((a.message || a.body || '').length > 110 ? '…' : '')}
                    </div>
                    <div style="font-size:0.7rem; color:var(--adm-text-muted); margin-top:4px;">
                      By: <span style="font-family:var(--adm-font-mono);">${escapeHtml(a.author || 'Academic Director')}</span>
                    </div>
                  </td>
                  <td>
                    <span class="adm-badge adm-badge-published" style="font-size:0.72rem;">${escapeHtml(a.audience)}</span>
                    <div style="font-size:0.72rem; color:var(--adm-text-muted); margin-top:4px; font-family:var(--adm-font-mono);">
                      ${escapeHtml(a.targetName || 'All Cohorts')}
                    </div>
                  </td>
                  <td>
                    ${AdminComponents.PriorityBadge({ priority: a.priority || 'Normal' })}
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: a.status })}
                  </td>
                  <td style="font-size:0.78rem; color:var(--adm-text-secondary); white-space:nowrap; font-family:var(--adm-font-mono);">
                    ${dateStr}
                  </td>
                  <td>
                    <span style="font-weight:700; color:var(--adm-primary); font-family:var(--adm-font-mono); font-size:0.85rem;">
                      ${reach.toLocaleString()}
                    </span>
                    <span style="font-size:0.7rem; color:var(--adm-text-muted); margin-left:3px;">recipients</span>
                  </td>
                  <td style="text-align:right; white-space:nowrap;">
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Preview rich notice" onclick="NexvionAdminApp.openAnnouncementPreviewModal('${a.id}')">
                      Preview
                    </button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Edit announcement" onclick="NexvionAdminApp.navigateTo('/admin/announcements/${a.id}')">
                      Edit
                    </button>
                    <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Clone notice" onclick="NexvionAdminApp.duplicateAnnouncement('${a.id}')">
                      Copy
                    </button>
                    ${a.status !== 'Published' ? `
                      <button class="adm-btn adm-btn-sm adm-btn-primary" title="Publish now" onclick="NexvionAdminApp.publishAnnouncement('${a.id}')">
                        Publish
                      </button>
                    ` : ''}
                    ${a.status !== 'Archived' ? `
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Move to archive" onclick="NexvionAdminApp.archiveAnnouncement('${a.id}')">
                        Archive
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="7" style="padding:0;">
                  ${AdminComponents.EmptyState({
                    icon: '📢',
                    title: 'No announcements found',
                    message: 'No circulars match your current filter and search criteria.',
                    actionText: 'Reset Filters',
                    onAction: 'NexvionAdminApp.resetAnnouncementFilters'
                  })}
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="adm-pagination">
        <div class="adm-pagination-info">
          <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> notices</span>
        </div>
        <div class="adm-pagination-btns">
          <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onAnnouncementPageChange(${state.currentPage - 1})">← Previous</button>
          <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
          <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onAnnouncementPageChange(${state.currentPage + 1})">Next →</button>
        </div>
      </div>
    `;
  }

  // --- ROUTE: ANNOUNCEMENT COMPOSER (NEW & EDIT) ---
  async function renderAnnouncementComposerView(announcementId) {
    const courses = await Data.getCourses();
    const tiers = await Data.getTiers();
    const batches = await Data.getBatches();

    let announcement = null;
    if (announcementId) {
      announcement = await Data.getAnnouncementById(announcementId);
      if (!announcement) {
        showToast('Not Found', `Announcement "${announcementId}" was not found.`, 'error');
        navigateTo('/admin/announcements');
        return;
      }
    }

    const isEdit = Boolean(announcement);

    // Sync state
    if (isEdit) {
      AppState.announcementComposer = {
        id: announcement.id,
        title: announcement.title || '',
        message: announcement.message || announcement.body || '',
        richContent: announcement.richContent || announcement.body || '',
        audience: announcement.audience || 'All Students',
        targetCourseId: announcement.targetCourseId || '',
        targetTierId: announcement.targetTierId || '',
        targetBatchId: announcement.targetBatchId || '',
        priority: announcement.priority || 'Normal',
        status: announcement.status || 'Draft',
        publishDate: announcement.publishedAt ? announcement.publishedAt.slice(0, 16) : '',
        scheduledDate: announcement.scheduledFor ? announcement.scheduledFor.slice(0, 16) : '',
        author: announcement.author || 'Super Admin',
        activeTab: AppState.announcementComposer.activeTab || 'write'
      };
    } else if (AppState.announcementComposer.id !== null) {
      // Clear out previous edit session
      AppState.announcementComposer = {
        id: null,
        title: '',
        message: '',
        richContent: '',
        audience: 'All Students',
        targetCourseId: '',
        targetTierId: '',
        targetBatchId: '',
        priority: 'Normal',
        status: 'Draft',
        publishDate: '',
        scheduledDate: '',
        author: 'Super Admin',
        activeTab: 'write'
      };
    }

    AppState.hasUnsavedChanges = false;
    const comp = AppState.announcementComposer;
    const estReach = calculateAudienceReach(comp.audience, comp.targetCourseId, comp.targetTierId, comp.targetBatchId);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <div style="font-size:0.78rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); margin-bottom:4px;">
            <a href="javascript:void(0)" onclick="NexvionAdminApp.navigateTo('/admin/announcements')" style="color:var(--adm-tertiary); text-decoration:none;">Announcements</a> &rsaquo; ${isEdit ? 'Edit Notice' : 'New Broadcast'}
          </div>
          <h1 class="adm-page-title">
            <span>${isEdit ? `Edit: ${escapeHtml(comp.title || 'Untitled Notice')}` : 'Compose Broadcast Notice'}</span>
            <span class="adm-badge adm-badge-published">${comp.status}</span>
          </h1>
          <p class="adm-page-desc">Compose multi-channel platform notices with rich markdown formatting, granular audience targeting, and scheduled releases.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.navigateTo('/admin/announcements')">
            ← Back to Directory
          </button>
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.saveAnnouncementDraft()">
            Save Draft
          </button>
          <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitAnnouncementComposer(true)">
            ${isEdit ? 'Update & Publish' : 'Publish Announcement'}
          </button>
        </div>
      </div>

      <!-- Composer 2-Column Layout -->
      <div class="adm-composer-grid">
        
        <!-- Left Column: Content Editor -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          
          <div class="adm-card">
            <h3 class="adm-card-title" style="margin-bottom:16px;">Notice Content & Headline</h3>
            
            <div class="adm-form-group">
              <label class="adm-form-label">Announcement Title <span class="adm-req-star">*</span></label>
              <input type="text" id="ancComposerTitle" class="adm-input" placeholder="e.g. Cohort Kickoff & System Architecture Briefing" value="${escapeHtml(comp.title)}" oninput="NexvionAdminApp.onAnnouncementComposerChange('title', this.value)">
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Summary / Teaser Message <span class="adm-req-star">*</span></label>
              <textarea id="ancComposerMessage" class="adm-textarea" rows="2" placeholder="Brief 1-2 sentence synopsis shown in dashboard notification pills and push alerts..." oninput="NexvionAdminApp.onAnnouncementComposerChange('message', this.value)">${escapeHtml(comp.message)}</textarea>
            </div>
          </div>

          <!-- Rich Content Area with Tabs & Formatting Toolbar -->
          <div class="adm-card" style="padding:0; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid var(--adm-border); background:var(--adm-surface-elevated);">
              <h3 class="adm-card-title" style="margin:0;">Rich Document Body</h3>
              <div style="display:flex; gap:6px;">
                <button class="adm-btn adm-btn-sm ${comp.activeTab === 'write' ? 'adm-btn-primary' : 'adm-btn-secondary'}" onclick="NexvionAdminApp.setComposerTab('write')">
                  ✏️ Markdown Editor
                </button>
                <button class="adm-btn adm-btn-sm ${comp.activeTab === 'preview' ? 'adm-btn-primary' : 'adm-btn-secondary'}" onclick="NexvionAdminApp.setComposerTab('preview')">
                  👁️ Live Preview
                </button>
              </div>
            </div>

            ${comp.activeTab === 'write' ? `
              <!-- Toolbar -->
              <div class="adm-rich-toolbar">
                <button type="button" class="adm-tool-btn" title="Bold" onclick="NexvionAdminApp.insertMarkdown('**')"><strong>B</strong></button>
                <button type="button" class="adm-tool-btn" title="Italic" onclick="NexvionAdminApp.insertMarkdown('*')"><em>I</em></button>
                <button type="button" class="adm-tool-btn" title="Heading 2" onclick="NexvionAdminApp.insertMarkdown('## ')">H2</button>
                <button type="button" class="adm-tool-btn" title="Heading 3" onclick="NexvionAdminApp.insertMarkdown('### ')">H3</button>
                <button type="button" class="adm-tool-btn" title="Bullet List" onclick="NexvionAdminApp.insertMarkdown('- ')">• List</button>
                <button type="button" class="adm-tool-btn" title="Numbered List" onclick="NexvionAdminApp.insertMarkdown('1. ')">1. List</button>
                <button type="button" class="adm-tool-btn" title="Blockquote" onclick="NexvionAdminApp.insertMarkdown('> ')">" Quote</button>
                <button type="button" class="adm-tool-btn" title="Code Block" onclick="NexvionAdminApp.insertMarkdown('\`\`\`\\n', '\\n\`\`\`')">&lt;/&gt; Code</button>
                <button type="button" class="adm-tool-btn" title="Hyperlink" onclick="NexvionAdminApp.insertMarkdown('[', '](https://)')">🔗 Link</button>
              </div>

              <div style="padding:16px;">
                <textarea id="ancComposerRichContent" class="adm-textarea" rows="12" style="font-family:var(--adm-font-mono); font-size:0.85rem; line-height:1.6;" placeholder="Type announcement markdown here... Use ## for headers, **bold**, > quotes, and - bullet items." oninput="NexvionAdminApp.onAnnouncementComposerChange('richContent', this.value)">${escapeHtml(comp.richContent)}</textarea>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:0.72rem; color:var(--adm-text-muted);">
                  <span>GitHub Flavored Markdown supported.</span>
                  <span id="ancWordCount">${(comp.richContent || '').split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            ` : `
              <div style="padding:20px; min-height:300px; background:#FFFFFF;">
                <div style="border-bottom:1px solid var(--adm-border); padding-bottom:12px; margin-bottom:16px;">
                  <h2 style="margin:0 0 6px 0; color:var(--adm-text-primary); font-size:1.3rem;">${escapeHtml(comp.title || 'Untitled Notice')}</h2>
                  <p style="margin:0; font-size:0.85rem; color:var(--adm-text-secondary);">${escapeHtml(comp.message || 'No synopsis.')}</p>
                </div>
                <div class="adm-markdown-preview-body" style="font-size:0.88rem; line-height:1.7; color:var(--adm-text-secondary);">
                  ${renderMarkdownPreview(comp.richContent)}
                </div>
              </div>
            `}
          </div>

        </div>

        <!-- Right Column: Targeting, Schedule & Metadata -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          
          <!-- Audience Targeting Box -->
          <div class="adm-card">
            <h3 class="adm-card-title" style="margin-bottom:14px;">Audience & Reach Targeting</h3>

            <div class="adm-form-group">
              <label class="adm-form-label">Broadcast Audience Target <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="ancComposerAudience" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('audience', this.value)">
                <option value="All Students" ${comp.audience === 'All Students' ? 'selected' : ''}>All Students (Platform Wide)</option>
                <option value="Specific Course" ${comp.audience === 'Specific Course' ? 'selected' : ''}>Specific Course</option>
                <option value="Specific Tier" ${comp.audience === 'Specific Tier' ? 'selected' : ''}>Specific Tier</option>
                <option value="Specific Batch" ${comp.audience === 'Specific Batch' ? 'selected' : ''}>Specific Batch</option>
                <option value="Faculty Only" ${comp.audience === 'Faculty Only' ? 'selected' : ''}>Faculty & Mentors Only</option>
              </select>
            </div>

            <!-- Dependent Select: Course -->
            <div class="adm-form-group" id="ancCourseSelectGroup" style="${['Specific Course', 'Specific Tier', 'Specific Batch'].includes(comp.audience) ? '' : 'display:none;'}">
              <label class="adm-form-label">Target Course</label>
              <select class="adm-select" id="ancComposerCourse" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('targetCourseId', this.value)">
                <option value="">Select Target Course...</option>
                ${courses.map(c => `<option value="${c.id}" ${comp.targetCourseId === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
              </select>
            </div>

            <!-- Dependent Select: Tier -->
            <div class="adm-form-group" id="ancTierSelectGroup" style="${comp.audience === 'Specific Tier' ? '' : 'display:none;'}">
              <label class="adm-form-label">Target Tier</label>
              <select class="adm-select" id="ancComposerTier" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('targetTierId', this.value)">
                <option value="">Select Target Tier...</option>
                ${tiers.map(t => `<option value="${t.id}" ${comp.targetTierId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
              </select>
            </div>

            <!-- Dependent Select: Batch -->
            <div class="adm-form-group" id="ancBatchSelectGroup" style="${comp.audience === 'Specific Batch' ? '' : 'display:none;'}">
              <label class="adm-form-label">Target Batch Cohort</label>
              <select class="adm-select" id="ancComposerBatch" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('targetBatchId', this.value)">
                <option value="">Select Target Batch...</option>
                ${batches.map(b => `<option value="${b.id}" ${comp.targetBatchId === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
              </select>
            </div>

            <!-- Audience Live Estimate Box -->
            <div class="adm-audience-box" style="margin-top:14px;">
              <div class="adm-audience-metric">
                <span class="adm-audience-count" id="ancAudienceReachCount">${estReach.toLocaleString()}</span>
                <span class="adm-audience-label">Estimated Reach</span>
              </div>
              <p style="margin:0; font-size:0.75rem; color:var(--adm-text-secondary); line-height:1.4;">
                This circular will broadcast to active learners matching the specified cohort criteria.
              </p>
            </div>
          </div>

          <!-- Publication & Scheduling Card -->
          <div class="adm-card">
            <h3 class="adm-card-title" style="margin-bottom:14px;">Publication Schedule & Priority</h3>

            <div class="adm-form-group">
              <label class="adm-form-label">Notice Priority</label>
              <select class="adm-select" id="ancComposerPriority" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('priority', this.value)">
                <option value="Low" ${comp.priority === 'Low' ? 'selected' : ''}>Low (Standard Information)</option>
                <option value="Normal" ${comp.priority === 'Normal' ? 'selected' : ''}>Normal (Course Communication)</option>
                <option value="High" ${comp.priority === 'High' ? 'selected' : ''}>High (Action Required)</option>
                <option value="Urgent" ${comp.priority === 'Urgent' ? 'selected' : ''}>Urgent (Critical Platform Alert)</option>
              </select>
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Publication Status</label>
              <select class="adm-select" id="ancComposerStatus" style="width:100%;" onchange="NexvionAdminApp.onAnnouncementComposerChange('status', this.value)">
                <option value="Draft" ${comp.status === 'Draft' ? 'selected' : ''}>Draft (Internal Work in Progress)</option>
                <option value="Scheduled" ${comp.status === 'Scheduled' ? 'selected' : ''}>Scheduled (Automated Release)</option>
                <option value="Published" ${comp.status === 'Published' ? 'selected' : ''}>Published (Active & Visible)</option>
                <option value="Archived" ${comp.status === 'Archived' ? 'selected' : ''}>Archived (Hidden from Portal)</option>
              </select>
            </div>

            <!-- Scheduled Date Picker -->
            <div class="adm-form-group" id="ancScheduleGroup" style="${comp.status === 'Scheduled' ? '' : 'display:none;'}">
              <label class="adm-form-label">Scheduled Release Date & Time</label>
              <input type="datetime-local" class="adm-input" id="ancComposerScheduledFor" value="${comp.scheduledDate}" onchange="NexvionAdminApp.onAnnouncementComposerChange('scheduledDate', this.value)">
              <div style="font-size:0.72rem; color:var(--adm-text-muted); margin-top:4px;">
                Announcement will automatically switch to Published at the scheduled timestamp.
              </div>
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Publishing Authority / Author</label>
              <input type="text" class="adm-input" id="ancComposerAuthor" value="${escapeHtml(comp.author)}" oninput="NexvionAdminApp.onAnnouncementComposerChange('author', this.value)">
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
              <button class="adm-btn adm-btn-primary" style="width:100%; justify-content:center;" onclick="NexvionAdminApp.submitAnnouncementComposer(true)">
                ${isEdit ? 'Save Changes' : 'Publish Announcement'}
              </button>
              <button class="adm-btn adm-btn-secondary" style="width:100%; justify-content:center;" onclick="NexvionAdminApp.saveAnnouncementDraft()">
                Save as Draft
              </button>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // --- ROUTE: NOTIFICATIONS ENGINE ---
  async function renderNotificationsView() {
    const notifs = await Data.getNotifications();
    const courses = await Data.getCourses();
    const tiers = await Data.getTiers();
    const batches = await Data.getBatches();
    const state = AppState.notificationsView;
    const comp = AppState.notificationComposer;

    // Filter notifications
    let filtered = notifs.filter(n => {
      const q = (state.searchTerm || '').toLowerCase().trim();
      const matchQ = !q ||
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.message && n.message.toLowerCase().includes(q)) ||
        (n.audience && n.audience.toLowerCase().includes(q)) ||
        (n.sentBy && n.sentBy.toLowerCase().includes(q));

      const matchType = state.typeFilter === 'ALL' || n.type === state.typeFilter;
      const matchStatus = state.statusFilter === 'ALL' || (n.deliveryStatus || n.status) === state.statusFilter;

      return matchQ && matchType && matchStatus;
    });

    // Sort notifications
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'date-asc':
          return new Date(a.date || a.sentAt || 0) - new Date(b.date || b.sentAt || 0);
        case 'recipients-desc':
          return (b.recipientCount || 0) - (a.recipientCount || 0);
        case 'date-desc':
        default:
          return new Date(b.date || b.sentAt || 0) - new Date(a.date || a.sentAt || 0);
      }
    });

    // Metrics
    const totalDispatches = notifs.length;
    const sentCount = notifs.filter(n => (n.deliveryStatus || n.status) === 'Sent').length;
    const queuedCount = notifs.filter(n => ['Queued', 'Scheduled'].includes(n.deliveryStatus || n.status)).length;
    const draftCount = notifs.filter(n => ['Draft', 'Cancelled', 'Failed'].includes(n.deliveryStatus || n.status)).length;

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    // Live reach for composer
    const composerReach = calculateAudienceReach(comp.audience, comp.courseId, comp.tierId, comp.batchId);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Platform Notifications Engine</span>
            <span class="adm-badge adm-badge-published">${totalDispatches} Dispatched</span>
          </h1>
          <p class="adm-page-desc">Compose multi-channel notifications, preview device lockscreens, and audit global delivery pipelines across cohorts.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="showToast('Export Dispatches', 'Notification delivery log exported to CSV.', 'success')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Log
          </button>
        </div>
      </div>

      <!-- Professional Integration Notice -->
      <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); padding:14px 18px; border-radius:8px; margin-bottom:24px; font-size:0.84rem; color:var(--adm-text-secondary); display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.4rem;">🔔</span>
        <div>
          <strong style="color:var(--adm-primary);">Notification Delivery Architecture:</strong>
          Notification prepared successfully. Delivery will be enabled after backend integration (Firebase Cloud Messaging). Outbound dispatches are currently staged and recorded in the audit ledger.
        </div>
      </div>

      <!-- Top Section: Composer Form + Device Simulator -->
      <div class="adm-two-col-grid">
        
        <!-- Left: Notification Composer Form -->
        <div class="adm-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 class="adm-card-title" style="margin:0;">Compose Notification Broadcast</h3>
            <span class="adm-badge adm-badge-draft">Composer Active</span>
          </div>

          <form id="notifComposerForm" onsubmit="event.preventDefault(); NexvionAdminApp.submitNotificationBroadcast();">
            
            <div class="adm-form-group">
              <label class="adm-form-label">Notification Title <span class="adm-req-star">*</span></label>
              <input type="text" class="adm-input" id="notifTitle" required placeholder="e.g. Live Class Starting in 30 Minutes" value="${escapeHtml(comp.title)}" oninput="NexvionAdminApp.updateNotificationComposerSync()">
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Message Payload <span class="adm-req-star">*</span></label>
              <textarea class="adm-textarea" id="notifMsg" rows="3" required placeholder="Enter message payload text..." oninput="NexvionAdminApp.updateNotificationComposerSync()">${escapeHtml(comp.message)}</textarea>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div class="adm-form-group">
                <label class="adm-form-label">Notification Type <span class="adm-req-star">*</span></label>
                <select class="adm-select" id="notifType" style="width:100%;" onchange="NexvionAdminApp.updateNotificationComposerSync()">
                  <option ${comp.type === 'New class' ? 'selected' : ''}>New class</option>
                  <option ${comp.type === 'Class reminder' ? 'selected' : ''}>Class reminder</option>
                  <option ${comp.type === 'Announcement' ? 'selected' : ''}>Announcement</option>
                  <option ${comp.type === 'Enrollment update' ? 'selected' : ''}>Enrollment update</option>
                  <option ${comp.type === 'Project reminder' ? 'selected' : ''}>Project reminder</option>
                  <option ${comp.type === 'Certificate update' ? 'selected' : ''}>Certificate update</option>
                  <option ${comp.type === 'System message' ? 'selected' : ''}>System message</option>
                </select>
              </div>

              <div class="adm-form-group">
                <label class="adm-form-label">Target Audience <span class="adm-req-star">*</span></label>
                <select class="adm-select" id="notifAudience" style="width:100%;" onchange="NexvionAdminApp.updateNotificationAudienceTargets(this.value)">
                  <option value="All Enrolled Students" ${comp.audience === 'All Enrolled Students' ? 'selected' : ''}>All Enrolled Students</option>
                  <option value="Specific Course" ${comp.audience === 'Specific Course' ? 'selected' : ''}>Specific Course</option>
                  <option value="Specific Tier" ${comp.audience === 'Specific Tier' ? 'selected' : ''}>Specific Tier</option>
                  <option value="Specific Batch" ${comp.audience === 'Specific Batch' ? 'selected' : ''}>Specific Batch</option>
                </select>
              </div>
            </div>

            <!-- Granular Selectors -->
            <div id="notifTargetDetailsRow" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:14px; ${comp.audience === 'All Enrolled Students' ? 'display:none;' : ''}">
              <div class="adm-form-group">
                <label class="adm-form-label" style="font-size:0.72rem;">Course</label>
                <select class="adm-select" id="notifCourse" style="width:100%; font-size:0.75rem;" onchange="NexvionAdminApp.updateNotificationComposerSync()">
                  <option value="">All Courses</option>
                  ${courses.map(c => `<option value="${c.id}" ${comp.courseId === c.id ? 'selected' : ''}>${c.title.split(':')[0]}</option>`).join('')}
                </select>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label" style="font-size:0.72rem;">Tier</label>
                <select class="adm-select" id="notifTier" style="width:100%; font-size:0.75rem;" onchange="NexvionAdminApp.updateNotificationComposerSync()">
                  <option value="">All Tiers</option>
                  ${tiers.map(t => `<option value="${t.id}" ${comp.tierId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                </select>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label" style="font-size:0.72rem;">Batch</label>
                <select class="adm-select" id="notifBatch" style="width:100%; font-size:0.75rem;" onchange="NexvionAdminApp.updateNotificationComposerSync()">
                  <option value="">All Batches</option>
                  ${batches.map(b => `<option value="${b.id}" ${comp.batchId === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Delivery Channels -->
            <div class="adm-form-group">
              <label class="adm-form-label">Delivery Channel Dispatch</label>
              <div class="adm-channel-group" id="notifChannelGroup">
                <label class="adm-channel-pill ${comp.channels.includes('In-App') ? 'selected' : ''}">
                  <input type="checkbox" value="In-App" ${comp.channels.includes('In-App') ? 'checked' : ''} onchange="NexvionAdminApp.toggleChannel('In-App', this.checked)">
                  In-App Notification
                </label>
                <label class="adm-channel-pill ${comp.channels.includes('Push Notification') ? 'selected' : ''}">
                  <input type="checkbox" value="Push Notification" ${comp.channels.includes('Push Notification') ? 'checked' : ''} onchange="NexvionAdminApp.toggleChannel('Push Notification', this.checked)">
                  Push Notification (Web/Mobile)
                </label>
                <label class="adm-channel-pill ${comp.channels.includes('Email Digest') ? 'selected' : ''}">
                  <input type="checkbox" value="Email Digest" ${comp.channels.includes('Email Digest') ? 'checked' : ''} onchange="NexvionAdminApp.toggleChannel('Email Digest', this.checked)">
                  Email Digest
                </label>
                <label class="adm-channel-pill ${comp.channels.includes('SMS Urgent') ? 'selected' : ''}">
                  <input type="checkbox" value="SMS Urgent" ${comp.channels.includes('SMS Urgent') ? 'checked' : ''} onchange="NexvionAdminApp.toggleChannel('SMS Urgent', this.checked)">
                  SMS Urgent
                </label>
              </div>
            </div>

            <!-- Delivery Timing Placeholder -->
            <div class="adm-form-group">
              <label class="adm-form-label">Delivery Schedule</label>
              <div style="display:flex; gap:16px; align-items:center; margin-bottom:8px;">
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.82rem; cursor:pointer;">
                  <input type="radio" name="deliveryTiming" value="immediate" ${comp.scheduleMode === 'immediate' ? 'checked' : ''} onchange="NexvionAdminApp.onTimingModeChange('immediate')">
                  Send Immediately
                </label>
                <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.82rem; cursor:pointer;">
                  <input type="radio" name="deliveryTiming" value="scheduled" ${comp.scheduleMode === 'scheduled' ? 'checked' : ''} onchange="NexvionAdminApp.onTimingModeChange('scheduled')">
                  Schedule for Later
                </label>
              </div>
              <div id="notifScheduledDateWrap" style="${comp.scheduleMode === 'scheduled' ? '' : 'display:none;'}">
                <input type="datetime-local" class="adm-input" id="notifScheduledFor" value="${comp.scheduledFor}" onchange="NexvionAdminApp.updateNotificationComposerSync()">
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; border-top:1px solid var(--adm-border); padding-top:16px;">
              <button type="button" class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.previewNotificationOnDevice()">
                👁️ Preview on Device
              </button>
              <button type="button" class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.submitTestNotification()">
                🧪 Send Test Payload
              </button>
              <button type="submit" class="adm-btn adm-btn-primary" style="margin-left:auto;">
                🚀 Queue Broadcast
              </button>
            </div>

          </form>
        </div>

        <!-- Right: Mobile Device Simulator Preview -->
        <div class="adm-card" style="display:flex; flex-direction:column; align-items:center;">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:16px;">
            <h3 class="adm-card-title" style="margin:0;">Device Lockscreen Simulator</h3>
            <span class="adm-badge adm-badge-published">Realtime Sync</span>
          </div>

          <!-- Phone Mockup Container -->
          <div class="adm-phone-preview" style="width:100%; max-width:340px;">
            <div class="adm-phone-notch"></div>
            <div class="adm-phone-clock">09:41</div>
            <div class="adm-phone-date">Friday, October 9</div>

            <!-- Push Banner Card -->
            <div class="adm-lockscreen-banner" id="phoneSimulatorBanner">
              <div class="adm-lockscreen-header">
                <div class="adm-lockscreen-app">
                  <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:linear-gradient(135deg, #7F52FF, #00D2B4);"></span>
                  NEXVION AI
                </div>
                <span>NOW</span>
              </div>
              <div class="adm-lockscreen-title" id="phonePreviewTitle">
                ${escapeHtml(comp.title || 'Live Class Starting in 30 Minutes')}
              </div>
              <div class="adm-lockscreen-body" id="phonePreviewBody">
                ${escapeHtml(comp.message || 'Class 01: Transformers, Tokens & Attention Mechanisms starts at 18:00 UTC in Virtual Nexus Hall A.')}
              </div>
            </div>

            <div style="margin-top:24px; text-align:center; font-size:0.7rem; color:#64748B;">
              Swipe up to unlock • NEXVION Push Engine
            </div>
          </div>

          <!-- Simulator Metadata Details -->
          <div style="width:100%; margin-top:20px; padding:12px 14px; background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:6px; font-size:0.75rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--adm-text-muted);">Estimated Recipients:</span>
              <strong style="color:var(--adm-primary);" id="simulatorReachCount">${composerReach.toLocaleString()} students</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--adm-text-muted);">Selected Channels:</span>
              <span style="color:var(--adm-text-primary);" id="simulatorChannelsList">${comp.channels.join(', ')}</span>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Section: Notification History Table -->
      <div class="adm-card" style="padding:0; overflow:hidden;">
        <div style="padding:16px 20px; border-bottom:1px solid var(--adm-border); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 class="adm-card-title" style="margin:0 0 2px 0;">Notification Dispatch History</h3>
            <p style="margin:0; font-size:0.78rem; color:var(--adm-text-secondary);">Comprehensive audit log of recent broadcast events, channel distributions, and scheduled triggers.</p>
          </div>
          <span class="adm-badge adm-badge-published">${filtered.length} Dispatches</span>
        </div>

        <!-- Filter Bar -->
        <div class="adm-filter-bar" style="margin:0; border:none; border-bottom:1px solid var(--adm-border); border-radius:0;">
          <div class="adm-filter-group" style="flex:1;">
            <input type="text" class="adm-input" placeholder="Search dispatches by title, audience, author..." value="${escapeHtml(state.searchTerm)}" style="min-width:220px;" oninput="NexvionAdminApp.onNotificationSearch(this.value)">

            <select class="adm-select" onchange="NexvionAdminApp.onNotificationTypeFilter(this.value)">
              <option value="ALL" ${state.typeFilter === 'ALL' ? 'selected' : ''}>All Types</option>
              <option value="New class" ${state.typeFilter === 'New class' ? 'selected' : ''}>New class</option>
              <option value="Class reminder" ${state.typeFilter === 'Class reminder' ? 'selected' : ''}>Class reminder</option>
              <option value="Announcement" ${state.typeFilter === 'Announcement' ? 'selected' : ''}>Announcement</option>
              <option value="Enrollment update" ${state.typeFilter === 'Enrollment update' ? 'selected' : ''}>Enrollment update</option>
              <option value="Project reminder" ${state.typeFilter === 'Project reminder' ? 'selected' : ''}>Project reminder</option>
              <option value="Certificate update" ${state.typeFilter === 'Certificate update' ? 'selected' : ''}>Certificate update</option>
              <option value="System message" ${state.typeFilter === 'System message' ? 'selected' : ''}>System message</option>
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onNotificationStatusFilter(this.value)">
              <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Delivery States</option>
              <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Scheduled" ${state.statusFilter === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
              <option value="Queued" ${state.statusFilter === 'Queued' ? 'selected' : ''}>Queued</option>
              <option value="Sent" ${state.statusFilter === 'Sent' ? 'selected' : ''}>Sent</option>
              <option value="Failed" ${state.statusFilter === 'Failed' ? 'selected' : ''}>Failed</option>
              <option value="Cancelled" ${state.statusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <div class="adm-filter-group">
            <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onNotificationSort(this.value)">
              <option value="date-desc" ${state.sortBy === 'date-desc' ? 'selected' : ''}>Sort: Newest First</option>
              <option value="date-asc" ${state.sortBy === 'date-asc' ? 'selected' : ''}>Sort: Oldest First</option>
              <option value="recipients-desc" ${state.sortBy === 'recipients-desc' ? 'selected' : ''}>Sort: Reach (High–Low)</option>
            </select>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetNotificationFilters()">Reset</button>
          </div>
        </div>

        <!-- History Table -->
        <div class="adm-table-wrap" style="border:none;">
          <table class="adm-table" id="notificationsMainTable">
            <thead>
              <tr>
                <th style="min-width:240px;">Notification Title & Payload</th>
                <th>Type</th>
                <th>Audience & Channels</th>
                <th>Sent By</th>
                <th>Date / Time</th>
                <th>Delivery Status</th>
                <th>Recipients</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.length > 0 ? paginated.map(n => {
                const status = n.deliveryStatus || n.status || 'Sent';
                const channelsArr = Array.isArray(n.channels) ? n.channels : [n.channels || 'In-App'];
                const timeStr = n.scheduledFor
                  ? `⏰ ${new Date(n.scheduledFor).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}`
                  : n.sentAt || n.date
                    ? new Date(n.sentAt || n.date).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
                    : '—';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:600; color:var(--adm-text-primary);">${escapeHtml(n.title)}</div>
                      <div style="font-size:0.78rem; color:var(--adm-text-secondary); line-height:1.4; margin-top:2px; max-width:440px;">
                        ${escapeHtml(n.message)}
                      </div>
                    </td>
                    <td>
                      <span class="adm-badge adm-badge-published" style="font-size:0.72rem;">${escapeHtml(n.type)}</span>
                    </td>
                    <td>
                      <div style="font-size:0.8rem; font-weight:600; color:var(--adm-text-primary);">${escapeHtml(n.audience || 'All Enrolled Students')}</div>
                      <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                        ${channelsArr.map(c => `<span style="font-size:0.68rem; background:var(--adm-surface-elevated); border:1px solid var(--adm-border); padding:1px 6px; border-radius:4px; color:var(--adm-text-secondary);">${escapeHtml(c)}</span>`).join('')}
                      </div>
                    </td>
                    <td style="font-size:0.78rem; color:var(--adm-text-secondary); white-space:nowrap;">
                      ${escapeHtml(n.sentBy || 'Super Admin')}
                    </td>
                    <td style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); white-space:nowrap;">
                      ${timeStr}
                    </td>
                    <td>
                      ${AdminComponents.DeliveryBadge({ status: status })}
                    </td>
                    <td>
                      <span style="font-weight:700; color:var(--adm-primary); font-family:var(--adm-font-mono); font-size:0.85rem;">
                        ${(n.recipientCount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td style="text-align:right; white-space:nowrap;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Preview simulated lockscreen" onclick="NexvionAdminApp.previewNotificationOnDevice('${n.id}')">
                        Preview
                      </button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Re-queue notice" onclick="NexvionAdminApp.resendNotification('${n.id}')">
                        Resend
                      </button>
                      ${['Scheduled', 'Queued'].includes(status) ? `
                        <button class="adm-btn adm-btn-sm adm-btn-danger" title="Cancel scheduled dispatch" onclick="NexvionAdminApp.cancelScheduledNotification('${n.id}')">
                          Cancel
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="8" style="padding:0;">
                    ${AdminComponents.EmptyState({
                      icon: '🔔',
                      title: 'No notification records found',
                      message: 'No dispatch events match your filter and search criteria.',
                      actionText: 'Reset Filters',
                      onAction: 'NexvionAdminApp.resetNotificationFilters'
                    })}
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="adm-pagination">
          <div class="adm-pagination-info">
            <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> dispatch records</span>
          </div>
          <div class="adm-pagination-btns">
            <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onNotificationPageChange(${state.currentPage - 1})">← Previous</button>
            <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
            <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onNotificationPageChange(${state.currentPage + 1})">Next →</button>
          </div>
        </div>

      </div>
    `;
  }

  // --- ROUTE: PAYMENTS ---
  async function renderPaymentsView() {
    const allPayments = await Data.getPayments();
    const state = AppState.paymentsView;

    // Calculate Summary KPIs (6 required)
    const totalPayments = allPayments.length;
    const pendingPayments = allPayments.filter(p => p.status === 'Pending').length;
    const successfulPayments = allPayments.filter(p => p.status === 'Paid').length;
    const failedPayments = allPayments.filter(p => p.status === 'Failed').length;
    const refunds = allPayments.filter(p => p.status === 'Refunded').length;
    const manualReviews = allPayments.filter(p => p.status === 'Manual review').length;

    // Filter payments
    const searchLower = (state.searchTerm || '').toLowerCase().trim();
    const filtered = allPayments.filter(p => {
      // Search
      if (searchLower) {
        const studentMatch = (p.studentName || '').toLowerCase().includes(searchLower);
        const emailMatch = (p.studentEmail || '').toLowerCase().includes(searchLower);
        const refMatch = (p.transactionRef || '').toLowerCase().includes(searchLower);
        const invMatch = (p.invoiceId || '').toLowerCase().includes(searchLower);
        const courseMatch = (p.courseTitle || '').toLowerCase().includes(searchLower);
        if (!studentMatch && !emailMatch && !refMatch && !invMatch && !courseMatch) return false;
      }

      // Course filter
      if (state.courseFilter !== 'ALL' && p.courseTitle !== state.courseFilter && p.courseId !== state.courseFilter) {
        return false;
      }

      // Tier filter
      if (state.tierFilter !== 'ALL' && p.tierName !== state.tierFilter && p.tierId !== state.tierFilter) {
        return false;
      }

      // Status filter
      if (state.statusFilter !== 'ALL' && p.status !== state.statusFilter) {
        return false;
      }

      // Date range filter
      if (state.dateRangeFilter && state.dateRangeFilter !== 'ALL') {
        const dateStr = p.date || '';
        if (state.dateRangeFilter === 'sept2026' && !dateStr.includes('2026-09')) return false;
        if (state.dateRangeFilter === 'oct2026' && !dateStr.includes('2026-10')) return false;
        if (state.dateRangeFilter === 'last7') {
          if (!dateStr.includes('2026-10-0') && !dateStr.includes('2026-10-09')) return false;
        }
        if (state.dateRangeFilter === 'last30') {
          if (!dateStr.includes('2026-09') && !dateStr.includes('2026-10')) return false;
        }
      }

      return true;
    });

    // Sort payments
    filtered.sort((a, b) => {
      if (state.sortBy === 'date-desc') return (b.date || '').localeCompare(a.date || '');
      if (state.sortBy === 'date-asc') return (a.date || '').localeCompare(b.date || '');
      if (state.sortBy === 'student-asc') return (a.studentName || '').localeCompare(b.studentName || '');
      return 0;
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    // Dynamic unique list of courses & tiers for select dropdowns
    const uniqueCourses = [...new Set(allPayments.map(p => p.courseTitle).filter(Boolean))];
    const uniqueTiers = ['AI Foundations', 'AI Builder', 'AI Creator', 'AI Architect'];

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Payment Administration & Ledger</span>
            <span class="adm-badge adm-badge-published">${allPayments.length} Total Records</span>
          </h1>
          <p class="adm-page-desc">Comprehensive financial audit trail, transaction reconciliation, invoice receipts, and refund triage. All non-free tiers reflect scheduled official tuition.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportPaymentsCsv()">
            <span>📥 Export CSV Ledger</span>
          </button>
        </div>
      </div>

      <!-- Payment Integration Notice -->
      <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); padding:14px 18px; border-radius:var(--adm-radius-md); margin-bottom:20px; font-size:0.84rem; color:var(--adm-text-secondary); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.3rem;">ℹ️</span>
          <div>
            <strong style="color:var(--adm-primary);">Payment Processing Notice:</strong> Payment processing will be connected during backend integration. All non-free tier tuition displays <code>PRICE COMING SOON</code> until financial gateway activation.
          </div>
        </div>
        <span class="adm-badge adm-badge-price-coming-soon">GATEWAY STAGING MODE</span>
      </div>

      <!-- 6 Summary Cards -->
      <div class="adm-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom:24px;">
        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Total Payments</span>
            <span class="adm-stat-icon">💳</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value">${totalPayments}</span>
            <span class="adm-stat-delta up">All Records</span>
          </div>
          <div class="adm-stat-sub">Across 4 curriculum tiers</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Pending Payments</span>
            <span class="adm-stat-icon">⏳</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-warning);">${pendingPayments}</span>
            <span class="adm-stat-delta" style="color:var(--adm-warning);">Awaiting Settlement</span>
          </div>
          <div class="adm-stat-sub">Waitlist & clearing windows</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Successful Payments</span>
            <span class="adm-stat-icon">✓</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-success);">${successfulPayments}</span>
            <span class="adm-stat-delta up">100% Cleared</span>
          </div>
          <div class="adm-stat-sub">Confirmed enrollments</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Failed Payments</span>
            <span class="adm-stat-icon">⚠️</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-danger);">${failedPayments}</span>
            <span class="adm-stat-delta down">Needs Retry</span>
          </div>
          <div class="adm-stat-sub">Simulated gateway declines</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Refunds</span>
            <span class="adm-stat-icon">↩️</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:#7E22CE;">${refunds}</span>
            <span class="adm-stat-delta" style="color:#7E22CE;">Processed</span>
          </div>
          <div class="adm-stat-sub">Administrative refunds</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Manual Reviews</span>
            <span class="adm-stat-icon">🔍</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:#B45309;">${manualReviews}</span>
            <span class="adm-stat-delta" style="color:#B45309;">Requires Action</span>
          </div>
          <div class="adm-stat-sub">PO & voucher verification</div>
        </div>
      </div>

      <!-- Payment Ledger Card -->
      <div class="adm-card" style="padding:0; overflow:hidden;">
        <!-- Card Header & Filter Bar -->
        <div style="padding:16px 20px; border-bottom:1px solid var(--adm-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 class="adm-card-title" style="margin:0 0 2px 0;">Tuition Transactions & Invoices</h3>
            <p style="margin:0; font-size:0.78rem; color:var(--adm-text-secondary);">Direct reconciliation ledger with student profile links, invoice numbers, and gateway status.</p>
          </div>
          <span class="adm-badge adm-badge-published">${filtered.length} Matching Records</span>
        </div>

        <div class="adm-filter-bar" style="margin:0; border:none; border-bottom:1px solid var(--adm-border); border-radius:0;">
          <div class="adm-filter-group" style="flex:1; flex-wrap:wrap;">
            <input type="text" id="paymentSearchInput" class="adm-input" placeholder="Search by student, email, ref, invoice..." value="${escapeHtml(state.searchTerm)}" style="min-width:230px;" oninput="NexvionAdminApp.onPaymentSearch(this.value)">

            <select class="adm-select" onchange="NexvionAdminApp.onPaymentDateRangeFilter(this.value)">
              <option value="ALL" ${state.dateRangeFilter === 'ALL' ? 'selected' : ''}>All Date Ranges</option>
              <option value="last7" ${state.dateRangeFilter === 'last7' ? 'selected' : ''}>Last 7 Days</option>
              <option value="last30" ${state.dateRangeFilter === 'last30' ? 'selected' : ''}>Last 30 Days</option>
              <option value="sept2026" ${state.dateRangeFilter === 'sept2026' ? 'selected' : ''}>September 2026</option>
              <option value="oct2026" ${state.dateRangeFilter === 'oct2026' ? 'selected' : ''}>October 2026</option>
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onPaymentCourseFilter(this.value)">
              <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
              ${uniqueCourses.map(c => `<option value="${escapeHtml(c)}" ${state.courseFilter === c ? 'selected' : ''}>${escapeHtml(c.split(':')[0])}</option>`).join('')}
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onPaymentTierFilter(this.value)">
              <option value="ALL" ${state.tierFilter === 'ALL' ? 'selected' : ''}>All Tiers</option>
              ${uniqueTiers.map(t => `<option value="${escapeHtml(t)}" ${state.tierFilter === t ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onPaymentStatusFilter(this.value)">
              <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="Not required" ${state.statusFilter === 'Not required' ? 'selected' : ''}>Not required</option>
              <option value="Pending" ${state.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Paid" ${state.statusFilter === 'Paid' ? 'selected' : ''}>Paid</option>
              <option value="Failed" ${state.statusFilter === 'Failed' ? 'selected' : ''}>Failed</option>
              <option value="Refunded" ${state.statusFilter === 'Refunded' ? 'selected' : ''}>Refunded</option>
              <option value="Manual review" ${state.statusFilter === 'Manual review' ? 'selected' : ''}>Manual review</option>
            </select>
          </div>

          <div class="adm-filter-group">
            <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onPaymentSort(this.value)">
              <option value="date-desc" ${state.sortBy === 'date-desc' ? 'selected' : ''}>Date: Newest First</option>
              <option value="date-asc" ${state.sortBy === 'date-asc' ? 'selected' : ''}>Date: Oldest First</option>
              <option value="student-asc" ${state.sortBy === 'student-asc' ? 'selected' : ''}>Student: A–Z</option>
            </select>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetPaymentFilters()">Reset</button>
          </div>
        </div>

        <!-- Payments Table -->
        <div class="adm-table-wrap" style="border:none;">
          <table class="adm-table" id="paymentsMainTable">
            <thead>
              <tr>
                <th style="min-width:180px;">Student</th>
                <th>Course</th>
                <th>Tier & Batch</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Transaction Ref</th>
                <th>Refund Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.length > 0 ? paginated.map(p => `
                <tr>
                  <td>
                    <div style="font-weight:600; color:var(--adm-text-primary); cursor:pointer;" onclick="NexvionAdminApp.openPaymentDetail('${p.id}')">
                      ${escapeHtml(p.studentName)}
                    </div>
                    <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">
                      ${escapeHtml(p.studentEmail)}
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.82rem; font-weight:500; color:var(--adm-text-primary);">${escapeHtml(p.courseTitle ? p.courseTitle.split(':')[0] : 'Curriculum Track')}</div>
                  </td>
                  <td>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--adm-text-primary);">${escapeHtml(p.tierName)}</div>
                    <div style="font-size:0.72rem; color:var(--adm-text-secondary);">${escapeHtml(p.batchName || 'General')}</div>
                  </td>
                  <td>
                    <span class="adm-badge ${p.amountDisplay === 'FREE' ? 'adm-badge-open' : 'adm-badge-price-coming-soon'}" style="font-weight:700;">
                      ${p.amountDisplay}
                    </span>
                    <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); margin-top:2px;">
                      ${escapeHtml(p.currency || 'USD')}
                    </div>
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: p.status })}
                  </td>
                  <td style="font-size:0.75rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono); white-space:nowrap;">
                    ${escapeHtml(p.date || '—')}
                  </td>
                  <td>
                    <code style="font-size:0.72rem; color:var(--adm-tertiary); background:var(--adm-surface-elevated); padding:2px 6px; border-radius:4px; border:1px solid var(--adm-border);">${escapeHtml(p.transactionRef)}</code>
                    <div style="font-size:0.68rem; color:var(--adm-text-muted); margin-top:3px;">
                      ${escapeHtml(p.provider ? p.provider.split('(')[0].trim() : 'Gateway')} • <span style="color:${p.verificationStatus === 'Verified' ? 'var(--adm-success)' : p.verificationStatus === 'Verification failed' ? 'var(--adm-danger)' : 'var(--adm-warning)'};">${escapeHtml(p.verificationStatus || 'Pending')}</span>
                    </div>
                  </td>
                  <td>
                    ${p.refundStatus === 'Processed'
                      ? '<span class="adm-badge adm-badge-refunded" style="font-size:0.7rem;"><span class="adm-badge-dot"></span>Processed</span>'
                      : p.refundStatus === 'Not applicable'
                        ? '<span style="color:var(--adm-text-muted); font-size:0.75rem;">N/A</span>'
                        : '<span style="color:var(--adm-text-secondary); font-size:0.75rem;">None</span>'}
                  </td>
                  <td style="text-align:right; white-space:nowrap;">
                    <div style="display:inline-flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="View details" onclick="NexvionAdminApp.openPaymentDetail('${p.id}')">
                        Details
                      </button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="View invoice receipt" onclick="NexvionAdminApp.openInvoiceModal('${p.id}')">
                        Invoice
                      </button>
                      ${p.status === 'Paid' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Process refund" onclick="NexvionAdminApp.openRefundModal('${p.id}')">
                          Refund
                        </button>
                      ` : ''}
                      ${p.status === 'Manual review' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" title="Triage manual review" onclick="NexvionAdminApp.openManualReviewModal('${p.id}')">
                          Review
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="9" style="padding:0;">
                    ${AdminComponents.EmptyState({
                      icon: '💳',
                      title: 'No payment records found',
                      message: 'No transaction entries match the current filter and search criteria.',
                      actionText: 'Reset Filters',
                      onAction: 'NexvionAdminApp.resetPaymentFilters'
                    })}
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="adm-pagination">
          <div class="adm-pagination-info">
            <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> transaction records</span>
          </div>
          <div class="adm-pagination-btns">
            <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onPaymentPageChange(${state.currentPage - 1})">← Previous</button>
            <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
            <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onPaymentPageChange(${state.currentPage + 1})">Next →</button>
          </div>
        </div>

      </div>
    `;
  }

  // --- ROUTE: CERTIFICATES ---
  async function renderCertificatesView() {
    const allCerts = await Data.getCertificates();
    const state = AppState.certificatesView;

    // Calculate Summary KPIs (5 required)
    const eligibleCount = allCerts.filter(c => c.status === 'Eligible').length;
    const pendingApprovalCount = allCerts.filter(c => c.status === 'Pending approval').length;
    const issuedCount = allCerts.filter(c => c.status === 'Issued').length;
    const notYetEligibleCount = allCerts.filter(c => c.status === 'Not eligible').length;
    const revokedCount = allCerts.filter(c => c.status === 'Revoked').length;

    // Filtering
    const searchLower = (state.searchTerm || '').toLowerCase().trim();
    const filtered = allCerts.filter(c => {
      // Search
      if (searchLower) {
        const studentMatch = (c.studentName || '').toLowerCase().includes(searchLower);
        const emailMatch = (c.studentEmail || '').toLowerCase().includes(searchLower);
        const certMatch = (c.verificationId || '').toLowerCase().includes(searchLower);
        const courseMatch = (c.courseTitle || '').toLowerCase().includes(searchLower);
        if (!studentMatch && !emailMatch && !certMatch && !courseMatch) return false;
      }

      // Course filter
      if (state.courseFilter !== 'ALL' && c.courseTitle !== state.courseFilter && c.courseId !== state.courseFilter) {
        return false;
      }

      // Tier filter
      if (state.tierFilter !== 'ALL' && c.tierName !== state.tierFilter && c.tierId !== state.tierFilter) {
        return false;
      }

      // Status filter
      if (state.statusFilter !== 'ALL' && c.status !== state.statusFilter) {
        return false;
      }

      // Eligibility filter
      if (state.eligibilityFilter !== 'ALL' && c.eligibilityStatus !== state.eligibilityFilter) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'name-asc') return (a.studentName || '').localeCompare(b.studentName || '');
      if (state.sortBy === 'completion-desc') return (b.completionPercentage || 0) - (a.completionPercentage || 0);
      if (state.sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.pageSize);

    const uniqueCourses = [...new Set(allCerts.map(c => c.courseTitle).filter(Boolean))];
    const uniqueTiers = ['AI Foundations', 'AI Builder', 'AI Creator', 'AI Architect'];

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Certificate Administration & Credential Issuance</span>
            <span class="adm-badge adm-badge-published">${allCerts.length} Total Candidates</span>
          </h1>
          <p class="adm-page-desc">Audit student graduation eligibility against 5-point accreditation requirements, issue verified credentials, and maintain cryptographic audit records.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.exportCertificatesCsv()">
            <span>📥 Export Credentials CSV</span>
          </button>
        </div>
      </div>

      <!-- Credential Engine Notice -->
      <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); padding:14px 18px; border-radius:var(--adm-radius-md); margin-bottom:20px; font-size:0.84rem; color:var(--adm-text-secondary); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.3rem;">🎓</span>
          <div>
            <strong style="color:var(--adm-primary);">Credential Engine Notice:</strong> Verification engine tracks 5-point academic compliance. Digital credentials and verification IDs are managed with platform audit trails.
          </div>
        </div>
        <span class="adm-badge adm-badge-published">AUDIT ENGINE ACTIVE</span>
      </div>

      <!-- 5 Summary Cards -->
      <div class="adm-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); margin-bottom:24px;">
        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Eligible Students</span>
            <span class="adm-stat-icon">🎓</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-primary);">${eligibleCount}</span>
            <span class="adm-stat-delta up">Ready to Issue</span>
          </div>
          <div class="adm-stat-sub">100% requirements cleared</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Pending Approval</span>
            <span class="adm-stat-icon">⏳</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-warning);">${pendingApprovalCount}</span>
            <span class="adm-stat-delta" style="color:var(--adm-warning);">Awaiting Dean Sign-off</span>
          </div>
          <div class="adm-stat-sub">Awaiting directorate sign-off</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Issued Certificates</span>
            <span class="adm-stat-icon">✓</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-success);">${issuedCount}</span>
            <span class="adm-stat-delta up">Active & Verified</span>
          </div>
          <div class="adm-stat-sub">Cryptographically stamped</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Not Yet Eligible</span>
            <span class="adm-stat-icon">📚</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-text-secondary);">${notYetEligibleCount}</span>
            <span class="adm-stat-delta">In Progress</span>
          </div>
          <div class="adm-stat-sub">Curriculum requirements ongoing</div>
        </div>

        <div class="adm-card adm-stat-card">
          <div class="adm-stat-top">
            <span class="adm-stat-label">Revoked Certificates</span>
            <span class="adm-stat-icon">🚫</span>
          </div>
          <div class="adm-stat-value-row">
            <span class="adm-stat-value" style="color:var(--adm-danger);">${revokedCount}</span>
            <span class="adm-stat-delta down">Invalidated</span>
          </div>
          <div class="adm-stat-sub">Administrative revocations</div>
        </div>
      </div>

      <!-- Main Certificates Table Card -->
      <div class="adm-card" style="padding:0; overflow:hidden;">
        <!-- Header -->
        <div style="padding:16px 20px; border-bottom:1px solid var(--adm-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 class="adm-card-title" style="margin:0 0 2px 0;">Candidate Graduation Ledger</h3>
            <p style="margin:0; font-size:0.78rem; color:var(--adm-text-secondary);">Direct verification checklist audit, credential generation, and verification ID registration.</p>
          </div>
          <span class="adm-badge adm-badge-published">${filtered.length} Candidates</span>
        </div>

        <!-- Filter Bar -->
        <div class="adm-filter-bar" style="margin:0; border:none; border-bottom:1px solid var(--adm-border); border-radius:0;">
          <div class="adm-filter-group" style="flex:1; flex-wrap:wrap;">
            <input type="text" id="certificateSearchInput" class="adm-input" placeholder="Search by student, verification ID, course..." value="${escapeHtml(state.searchTerm)}" style="min-width:240px;" oninput="NexvionAdminApp.onCertificateSearch(this.value)">

            <select class="adm-select" onchange="NexvionAdminApp.onCertificateCourseFilter(this.value)">
              <option value="ALL" ${state.courseFilter === 'ALL' ? 'selected' : ''}>All Courses</option>
              ${uniqueCourses.map(c => `<option value="${escapeHtml(c)}" ${state.courseFilter === c ? 'selected' : ''}>${escapeHtml(c.split(':')[0])}</option>`).join('')}
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onCertificateTierFilter(this.value)">
              <option value="ALL" ${state.tierFilter === 'ALL' ? 'selected' : ''}>All Tiers</option>
              ${uniqueTiers.map(t => `<option value="${escapeHtml(t)}" ${state.tierFilter === t ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onCertificateStatusFilter(this.value)">
              <option value="ALL" ${state.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="Not eligible" ${state.statusFilter === 'Not eligible' ? 'selected' : ''}>Not eligible</option>
              <option value="Eligible" ${state.statusFilter === 'Eligible' ? 'selected' : ''}>Eligible</option>
              <option value="Pending approval" ${state.statusFilter === 'Pending approval' ? 'selected' : ''}>Pending approval</option>
              <option value="Issued" ${state.statusFilter === 'Issued' ? 'selected' : ''}>Issued</option>
              <option value="Revoked" ${state.statusFilter === 'Revoked' ? 'selected' : ''}>Revoked</option>
            </select>

            <select class="adm-select" onchange="NexvionAdminApp.onCertificateEligibilityFilter(this.value)">
              <option value="ALL" ${state.eligibilityFilter === 'ALL' ? 'selected' : ''}>All Criteria</option>
              <option value="Requirements Satisfied" ${state.eligibilityFilter === 'Requirements Satisfied' ? 'selected' : ''}>Requirements Satisfied</option>
              <option value="Awaiting Directorate Sign-off" ${state.eligibilityFilter === 'Awaiting Directorate Sign-off' ? 'selected' : ''}>Awaiting Directorate Sign-off</option>
              <option value="Incomplete Curriculum" ${state.eligibilityFilter === 'Incomplete Curriculum' ? 'selected' : ''}>Incomplete Curriculum</option>
              <option value="Disqualified / Withdrawn" ${state.eligibilityFilter === 'Disqualified / Withdrawn' ? 'selected' : ''}>Disqualified / Withdrawn</option>
            </select>
          </div>

          <div class="adm-filter-group">
            <select class="adm-select adm-sort-select" onchange="NexvionAdminApp.onCertificateSort(this.value)">
              <option value="name-asc" ${state.sortBy === 'name-asc' ? 'selected' : ''}>Student: A–Z</option>
              <option value="completion-desc" ${state.sortBy === 'completion-desc' ? 'selected' : ''}>Completion (High–Low)</option>
              <option value="status" ${state.sortBy === 'status' ? 'selected' : ''}>Status</option>
            </select>
            <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.resetCertificateFilters()">Reset</button>
          </div>
        </div>

        <!-- Table -->
        <div class="adm-table-wrap" style="border:none;">
          <table class="adm-table" id="certificatesMainTable">
            <thead>
              <tr>
                <th style="min-width:180px;">Student</th>
                <th>Course</th>
                <th>Tier</th>
                <th>Batch</th>
                <th style="min-width:150px;">Completion</th>
                <th>Eligibility Status</th>
                <th>Certificate Status</th>
                <th>Issue Date</th>
                <th>Verification ID</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.length > 0 ? paginated.map(c => `
                <tr>
                  <td>
                    <div style="font-weight:600; color:var(--adm-text-primary); cursor:pointer;" onclick="NexvionAdminApp.openCertificateDetail('${c.id}')">
                      ${escapeHtml(c.studentName)}
                    </div>
                    <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">
                      ${escapeHtml(c.studentEmail || '')}
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.82rem; font-weight:500; color:var(--adm-text-primary);">${escapeHtml(c.courseTitle ? c.courseTitle.split(':')[0] : 'Curriculum Track')}</div>
                  </td>
                  <td>
                    <span style="font-size:0.8rem; font-weight:600; color:var(--adm-text-primary);">${escapeHtml(c.tierName)}</span>
                  </td>
                  <td>
                    <span style="font-size:0.75rem; color:var(--adm-text-secondary);">${escapeHtml(c.batchName || 'Cohort Alpha')}</span>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div class="adm-progress-bar" style="width:72px; height:6px; background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:3px; overflow:hidden;">
                        <div class="adm-progress-fill ${c.completionPercentage >= 100 ? 'complete' : c.completionPercentage < 60 ? 'warning' : ''}" style="width:${c.completionPercentage}%; height:100%;"></div>
                      </div>
                      <span style="font-size:0.8rem; font-weight:700; color:var(--adm-text-primary); font-family:var(--adm-font-mono);">${c.completionPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="adm-badge ${c.eligibilityStatus === 'Requirements Satisfied' ? 'adm-badge-approved' : c.eligibilityStatus.includes('Awaiting') ? 'adm-badge-pending-review' : 'adm-badge-draft'}" style="font-size:0.72rem;">
                      ${escapeHtml(c.eligibilityStatus)}
                    </span>
                  </td>
                  <td>
                    ${AdminComponents.StatusBadge({ status: c.status })}
                  </td>
                  <td style="font-size:0.75rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono); white-space:nowrap;">
                    ${escapeHtml(c.issueDate || 'Pending Issue')}
                  </td>
                  <td>
                    <code style="font-size:0.72rem; color:var(--adm-tertiary); background:var(--adm-surface-elevated); padding:2px 6px; border-radius:4px; border:1px solid var(--adm-border);">${escapeHtml(c.verificationId || 'Pending Generation')}</code>
                  </td>
                  <td style="text-align:right; white-space:nowrap;">
                    <div style="display:inline-flex; gap:6px;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Review 5-point requirements checklist" onclick="NexvionAdminApp.openCertificateDetail('${c.id}')">
                        Review
                      </button>
                      ${c.status === 'Issued' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Preview credential layout" onclick="NexvionAdminApp.previewCertificateModal('${c.id}')">
                          Preview
                        </button>
                        <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Download credential package" onclick="NexvionAdminApp.downloadCertificatePlaceholder('${c.id}')">
                          Download
                        </button>
                        <button class="adm-btn adm-btn-sm adm-btn-danger" title="Revoke credential" onclick="NexvionAdminApp.revokeCertificateModal('${c.id}')">
                          Revoke
                        </button>
                      ` : ''}
                      ${c.status === 'Pending approval' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" title="Approve directorate sign-off" onclick="NexvionAdminApp.approveCertificateAction('${c.id}')">
                          Approve
                        </button>
                      ` : ''}
                      ${c.status === 'Eligible' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-primary" title="Issue credential" onclick="NexvionAdminApp.issueCertificateAction('${c.id}')">
                          Issue
                        </button>
                      ` : ''}
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="Add internal note" onclick="NexvionAdminApp.openAddNoteModal('${c.id}')">
                        +Note
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="10" style="padding:0;">
                    ${AdminComponents.EmptyState({
                      icon: '🎓',
                      title: 'No certificate records found',
                      message: 'No student candidates match the current filter and search criteria.',
                      actionText: 'Reset Filters',
                      onAction: 'NexvionAdminApp.resetCertificateFilters'
                    })}
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="adm-pagination">
          <div class="adm-pagination-info">
            <span>Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}–${Math.min(startIndex + state.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> certificate records</span>
          </div>
          <div class="adm-pagination-btns">
            <button class="adm-page-btn" ${state.currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onCertificatePageChange(${state.currentPage - 1})">← Previous</button>
            <span style="font-size:0.78rem; font-family:var(--adm-font-mono); padding:0 8px;">Page ${state.currentPage} of ${totalPages}</span>
            <button class="adm-page-btn" ${state.currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onCertificatePageChange(${state.currentPage + 1})">Next →</button>
          </div>
        </div>

      </div>
    `;
  }

  // --- ROUTE: SUPPORT INBOX ---
  async function renderSupportView() {
    const tickets = await Data.getSupportTickets();

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">Support Desk Inbox</h1>
          <p class="adm-page-desc">Triage student technical issues, seat reassignment requests, and enrollment inquiries.</p>
        </div>
      </div>

      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Student</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td><code style="font-size:0.75rem; color:var(--adm-tertiary);">${t.ticketRef}</code></td>
                <td><strong>${t.subject}</strong></td>
                <td>${t.studentName}</td>
                <td>${t.category}</td>
                <td><span class="adm-badge ${t.priority === 'High' ? 'adm-badge-full' : 'adm-badge-open'}">${t.priority}</span></td>
                <td><span class="adm-badge ${t.status === 'Open' ? 'adm-badge-waitlist' : 'adm-badge-published'}">${t.status}</span></td>
                <td>${t.assignedAdmin}</td>
                <td>
                  <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openTicketDrawer('${t.id}')">Open Conversation</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- ROUTE: ANALYTICS ---
  async function renderAnalyticsView() {
    const analytics = await Data.getAnalytics();
    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">Operations & Learning Analytics</h1>
          <p class="adm-page-desc">Cohort velocity, tier breakdown, seat distribution, and course completion telemetry.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary" onclick="showToast('Export Analytics', 'Analytics metrics exported to JSON format.', 'success')">Export Report</button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:24px;">
        <div class="adm-card">
          <h3 class="adm-card-title">Tier Distribution Breakdown</h3>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
            ${analytics.tierDistribution.map(td => `
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
                  <span>${td.tier}</span>
                  <strong>${td.count} students (${td.percent}%)</strong>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                  <div style="width:${td.percent}%; height:100%; background:${td.color};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="adm-card">
          <h3 class="adm-card-title">Cohort Seat Saturation (30-Cap)</h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
            ${analytics.batchCapacityUtilization.map(b => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--adm-surface-elevated); padding:8px 12px; border-radius:6px;">
                <span style="font-size:0.8rem; color:var(--adm-text-primary);">${b.batch}</span>
                <span style="font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-tertiary);">${b.filled} / 30 seats (${Math.round(b.percent)}%)</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- ROUTE: ADMIN USERS & ROLES ---
  // =========================================================================
  // PHASE 8: ADMIN USERS, ROLES, PERMISSIONS, AUDIT LOGS, AND SETTINGS
  // =========================================================================

  // --- ROUTE: ADMIN USERS ---
  async function renderAdminsView() {
    const rawAdmins = await Data.getAdminUsers();
    const canManageAdmins = Data.hasPermission('manage_admins');
    const viewState = AppState.adminsView;

    // Filter
    let filtered = rawAdmins.filter(a => {
      const q = (viewState.searchTerm || '').toLowerCase();
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.department && a.department.toLowerCase().includes(q)) ||
        a.role.toLowerCase().includes(q);

      const matchStatus = viewState.statusFilter === 'ALL' || a.status.toLowerCase() === viewState.statusFilter.toLowerCase();
      const matchRole = viewState.roleFilter === 'ALL' || a.role.toLowerCase() === viewState.roleFilter.toLowerCase();
      return matchSearch && matchStatus && matchRole;
    });

    // Sort
    filtered.sort((a, b) => {
      if (viewState.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (viewState.sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (viewState.sortBy === 'date-desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (viewState.sortBy === 'date-asc') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (viewState.sortBy === 'active-desc') return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
      return 0;
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / viewState.pageSize));
    const currentPage = Math.min(viewState.currentPage, totalPages);
    const startIndex = (currentPage - 1) * viewState.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + viewState.pageSize);

    // Counts
    const activeCount = rawAdmins.filter(a => a.status === 'Active').length;
    const invitedCount = rawAdmins.filter(a => a.status === 'Invited').length;
    const suspendedCount = rawAdmins.filter(a => a.status === 'Suspended' || a.status === 'Inactive').length;

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Administrative Personnel</span>
            <span class="adm-proto-pill"><span class="adm-proto-pulse"></span> ${rawAdmins.length} ACCOUNTS</span>
          </h1>
          <p class="adm-page-desc">System administration directory, credential statuses, and administrative operational workflows.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-primary ${!canManageAdmins ? 'adm-btn-disabled' : ''}" 
                  ${!canManageAdmins ? 'disabled title="Requires manage_admins permission"' : ''}
                  onclick="NexvionAdminApp.openInviteAdminModal()">
            <span>+ Invite Admin</span>
          </button>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="adm-security-banner">
        <div class="adm-security-banner-icon">🛡️</div>
        <div class="adm-security-banner-content">
          <h4 class="adm-security-banner-title">Architectural Security Boundary Notice</h4>
          <p class="adm-security-banner-desc">
            Frontend permissions are an interface affordance and do not constitute a secure perimeter. They do not protect data from direct network inspection or tampering.
            <strong>Actual production authorization must be enforced by Firebase Authentication, custom user claims, Firestore Security Rules, and trusted backend Cloud Functions / microservices.</strong>
          </p>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="adm-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
        ${AdminComponents.StatCard({
          label: 'Total Admin Staff',
          value: rawAdmins.length,
          subtext: 'Configured platform accounts',
          icon: '👥'
        })}
        ${AdminComponents.StatCard({
          label: 'Active Operators',
          value: activeCount,
          subtext: 'Operational with active sessions',
          icon: '🟢',
          change: 'Normal',
          changeType: 'up'
        })}
        ${AdminComponents.StatCard({
          label: 'Pending Invitations',
          value: invitedCount,
          subtext: 'Awaiting credential setup',
          icon: '✉️'
        })}
        ${AdminComponents.StatCard({
          label: 'Suspended / Inactive',
          value: suspendedCount,
          subtext: 'Revoked access per audit policy',
          icon: '⚠️'
        })}
      </div>

      <!-- Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          <input type="text" class="adm-input" id="adminSearchInput" placeholder="Search by name, email, department..." 
                 value="${escapeHtml(viewState.searchTerm || '')}" 
                 oninput="NexvionAdminApp.onAdminSearch(this.value)" style="min-width: 260px;">
          
          <select class="adm-select" id="adminStatusFilterSelect" onchange="NexvionAdminApp.onAdminStatusFilter(this.value)">
            <option value="ALL" ${viewState.statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
            <option value="Active" ${viewState.statusFilter === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Invited" ${viewState.statusFilter === 'Invited' ? 'selected' : ''}>Invited</option>
            <option value="Suspended" ${viewState.statusFilter === 'Suspended' ? 'selected' : ''}>Suspended</option>
            <option value="Inactive" ${viewState.statusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>

          <select class="adm-select" id="adminRoleFilterSelect" onchange="NexvionAdminApp.onAdminRoleFilter(this.value)">
            <option value="ALL" ${viewState.roleFilter === 'ALL' ? 'selected' : ''}>All Roles</option>
            <option value="Owner" ${viewState.roleFilter === 'Owner' ? 'selected' : ''}>Owner</option>
            <option value="Super Admin" ${viewState.roleFilter === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
            <option value="Content Manager" ${viewState.roleFilter === 'Content Manager' ? 'selected' : ''}>Content Manager</option>
            <option value="Student Manager" ${viewState.roleFilter === 'Student Manager' ? 'selected' : ''}>Student Manager</option>
            <option value="Finance Manager" ${viewState.roleFilter === 'Finance Manager' ? 'selected' : ''}>Finance Manager</option>
            <option value="Communications Manager" ${viewState.roleFilter === 'Communications Manager' ? 'selected' : ''}>Communications Manager</option>
            <option value="Support Manager" ${viewState.roleFilter === 'Support Manager' ? 'selected' : ''}>Support Manager</option>
            <option value="Analyst" ${viewState.roleFilter === 'Analyst' ? 'selected' : ''}>Analyst</option>
          </select>

          <select class="adm-select" id="adminSortBySelect" onchange="NexvionAdminApp.onAdminSort(this.value)">
            <option value="name-asc" ${viewState.sortBy === 'name-asc' ? 'selected' : ''}>Sort: Name (A to Z)</option>
            <option value="name-desc" ${viewState.sortBy === 'name-desc' ? 'selected' : ''}>Sort: Name (Z to A)</option>
            <option value="date-desc" ${viewState.sortBy === 'date-desc' ? 'selected' : ''}>Sort: Created (Newest)</option>
            <option value="date-asc" ${viewState.sortBy === 'date-asc' ? 'selected' : ''}>Sort: Created (Oldest)</option>
            <option value="active-desc" ${viewState.sortBy === 'active-desc' ? 'selected' : ''}>Sort: Last Active</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="NexvionAdminApp.resetAdminFilters()">Reset Filters</button>
        </div>
      </div>

      <!-- Admin Users Table -->
      <div class="adm-table-wrap">
        <table class="adm-table" id="adminUsersTable">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Created Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length > 0 ? paginated.map(a => {
              const statusClass = a.status === 'Active' ? 'adm-badge-admin-active' :
                                  a.status === 'Invited' ? 'adm-badge-admin-invited' :
                                  a.status === 'Suspended' ? 'adm-badge-admin-suspended' : 'adm-badge-admin-inactive';
              const initials = a.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="adm-avatar-circle" style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); color:var(--adm-primary); font-weight:700; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem;">
                        ${initials}
                      </div>
                      <div>
                        <strong style="color:var(--adm-text-primary); display:block; font-size:0.88rem;">${escapeHtml(a.name)}</strong>
                        <span style="font-size:0.72rem; color:var(--adm-text-muted);">${escapeHtml(a.department || 'Operations')}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style="font-size:0.78rem; color:var(--adm-text-secondary);">${escapeHtml(a.email)}</code>
                  </td>
                  <td>
                    <span class="adm-badge adm-badge-published" style="font-weight:600;">${escapeHtml(a.role)}</span>
                  </td>
                  <td>
                    <span class="adm-badge ${statusClass}">
                      <span class="adm-badge-dot"></span>${escapeHtml(a.status)}
                    </span>
                  </td>
                  <td style="font-size:0.78rem; color:var(--adm-text-muted);">
                    ${a.lastActive && a.lastActive.includes('T') ? new Date(a.lastActive).toLocaleDateString() : escapeHtml(a.lastActive || 'Pending')}
                  </td>
                  <td style="font-size:0.78rem; color:var(--adm-text-muted);">
                    ${escapeHtml(a.createdAt || '2026-10-01')}
                  </td>
                  <td style="text-align: right;">
                    <div style="display:inline-flex; gap:6px; justify-content:flex-end;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" title="View Audit Activity" onclick="NexvionAdminApp.openAdminUserDetail('${a.id}')">
                        Activity
                      </button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary ${!canManageAdmins ? 'adm-btn-disabled' : ''}" 
                              ${!canManageAdmins ? 'disabled title="Read-only"' : ''}
                              onclick="NexvionAdminApp.openEditAdminModal('${a.id}')">
                        Edit
                      </button>
                      <button class="adm-btn adm-btn-sm adm-btn-secondary ${!canManageAdmins ? 'adm-btn-disabled' : ''}" 
                              ${!canManageAdmins ? 'disabled title="Read-only"' : ''}
                              onclick="NexvionAdminApp.openChangeRoleModal('${a.id}')">
                        Role
                      </button>
                      ${a.status === 'Suspended' || a.status === 'Inactive' ? `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary ${!canManageAdmins ? 'adm-btn-disabled' : ''}" 
                                ${!canManageAdmins ? 'disabled title="Read-only"' : ''}
                                style="color:var(--adm-accent);" onclick="NexvionAdminApp.reactivateAdminAction('${a.id}')">
                          Reactivate
                        </button>
                      ` : `
                        <button class="adm-btn adm-btn-sm adm-btn-secondary ${!canManageAdmins ? 'adm-btn-disabled' : ''}" 
                                ${!canManageAdmins ? 'disabled title="Read-only"' : ''}
                                style="color:var(--adm-danger);" onclick="NexvionAdminApp.openSuspendAdminModal('${a.id}')">
                          Suspend
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="7" style="text-align:center; padding:36px; color:var(--adm-text-muted);">
                  <div class="adm-state-box">
                    <div class="adm-state-icon">👥</div>
                    <h3 class="adm-state-title">No administrative accounts found</h3>
                    <p class="adm-state-desc">Try clearing your search query or selecting a different role or status filter.</p>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; flex-wrap:wrap; gap:12px; font-size:0.82rem; color:var(--adm-text-muted);">
        <div>
          Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}</strong>–<strong>${Math.min(startIndex + viewState.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> administrative accounts
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="adm-btn adm-btn-sm adm-btn-secondary" ${currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onAdminPageChange(${currentPage - 1})">
            Previous
          </button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" ${currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onAdminPageChange(${currentPage + 1})">
            Next
          </button>
        </div>
      </div>
    `;
  }

  // --- ROUTE: ROLES & PERMISSIONS ---
  async function renderRolesView(targetRoleId = null) {
    const roles = await Data.getRoles();
    const matrix = Data.getPermissionsMatrix();
    const canManageRoles = Data.hasPermission('manage_roles');
    const viewState = AppState.rolesView;

    // Filter matrix categories / search
    let filteredMatrix = matrix.filter(mod => {
      const q = (viewState.matrixSearchTerm || '').toLowerCase();
      const pKey = (mod.key || mod.permKey || '').toLowerCase();
      const cat = (mod.category || '').toLowerCase();
      const matchSearch = !q || (mod.name || '').toLowerCase().includes(q) || pKey.includes(q) || cat.includes(q);
      const matchCat = !viewState.categoryFilter || viewState.categoryFilter === 'ALL' || mod.category === viewState.categoryFilter;
      return matchSearch && matchCat;
    });

    const categories = ['ALL', ...new Set(matrix.map(m => m.category))];

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Roles & Permissions Matrix</span>
            <span class="adm-proto-pill"><span class="adm-proto-pulse"></span> 8 ROLES • 23 MODULES</span>
          </h1>
          <p class="adm-page-desc">Granular Role-Based Access Control (RBAC) capability matrix. Switch active role context to evaluate permissions enforcement live in the interface.</p>
        </div>
        <div class="adm-header-actions">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--adm-text-muted);">Active Simulated Role:</span>
            <select class="adm-select" onchange="NexvionAdminApp.switchRole(this.value)">
              ${roles.map(r => `<option value="${r.name}" ${r.name === AppState.activeRole ? 'selected' : ''}>${r.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Security Notice (Critical Requirement) -->
      <div class="adm-security-banner">
        <div class="adm-security-banner-icon">🛡️</div>
        <div class="adm-security-banner-content">
          <h4 class="adm-security-banner-title">Architectural Security Boundary Notice</h4>
          <p class="adm-security-banner-desc">
            Frontend permissions are not real security. Do not claim that they protect data. Add documentation explaining that actual authorization must later be enforced by Firebase Authentication, custom claims, Firestore Security Rules, and trusted backend functions.
          </p>
        </div>
      </div>

      ${!canManageRoles ? `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:10px 14px; border-radius:6px; margin-bottom:20px; font-size:0.8rem; color:#B45309;">
          <strong>Read-Only Mode:</strong> Your current role context (${AppState.activeRole}) does not have <code>manage_roles</code>. Role configurations and permission matrix are displayed in read-only mode.
        </div>
      ` : ''}

      <!-- 8 Roles Grid Cards -->
      <div class="adm-roles-grid" style="margin-bottom: 32px;">
        ${roles.map(r => {
          const isActive = r.name === AppState.activeRole;
          return `
            <div class="adm-card adm-role-card ${isActive ? 'active-role' : ''}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div>
                  <h3 style="margin:0 0 2px 0; color:var(--adm-text-primary); font-size:1.05rem;">${escapeHtml(r.name)}</h3>
                  <span style="font-size:0.72rem; color:var(--adm-tertiary); font-weight:600;">${r.userCount} Assigned Staff</span>
                </div>
                <span class="adm-badge ${isActive ? 'adm-badge-published' : 'adm-badge-draft'}">
                  ${isActive ? 'CURRENT CONTEXT' : 'ROLE'}
                </span>
              </div>
              <p style="font-size:0.8rem; color:var(--adm-text-secondary); line-height:1.45; min-height:48px; margin:0 0 12px;">
                ${escapeHtml(r.description)}
              </p>
              <div style="font-size:0.72rem; color:var(--adm-text-muted); padding:6px 0; border-top:1px solid var(--adm-border); display:flex; justify-content:space-between;">
                <span>Enabled Modules:</span>
                <strong>${r.permissions.length} of 23</strong>
              </div>
              <div style="display:flex; gap:6px; margin-top:12px;">
                <button class="adm-btn adm-btn-sm ${isActive ? 'adm-btn-secondary' : 'adm-btn-primary'}" 
                        style="flex:1;" 
                        onclick="NexvionAdminApp.switchRole('${r.name}')">
                  ${isActive ? 'Active Context' : 'Switch Context'}
                </button>
                <button class="adm-btn adm-btn-sm adm-btn-secondary" 
                        onclick="NexvionAdminApp.openRoleDetailDrawer('${r.id}')" title="Inspect Role Privileges">
                  Inspect
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 23-Module Permissions Matrix -->
      <div class="adm-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <h3 class="adm-card-title" style="margin:0 0 4px 0;">23-Module Capability Matrix</h3>
            <p style="font-size:0.8rem; color:var(--adm-text-secondary); margin:0;">
              Canonical mapping of access privileges across all platform microservices.
            </p>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="text" class="adm-input" placeholder="Search capabilities..." 
                   value="${escapeHtml(viewState.matrixSearchTerm || '')}"
                   oninput="NexvionAdminApp.onRoleMatrixSearch(this.value)" style="width:200px; font-size:0.8rem;">
            <select class="adm-select" onchange="NexvionAdminApp.onRoleCategoryFilter(this.value)" style="font-size:0.8rem;">
              ${categories.map(c => `<option value="${c}" ${(viewState.categoryFilter || 'ALL') === c ? 'selected' : ''}>${c === 'ALL' ? 'All Categories' : c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="adm-matrix-wrap">
          <table class="adm-table adm-matrix-table">
            <thead>
              <tr>
                <th style="min-width: 170px;">Platform Module</th>
                <th style="min-width: 140px;">Capability Key</th>
                ${roles.map(r => `
                  <th style="text-align: center; min-width: 100px; ${r.name === AppState.activeRole ? 'background:rgba(127,82,255,0.08); font-weight:700;' : ''}">
                    ${escapeHtml(r.name.replace(' Manager', ' Mgr'))}
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredMatrix.map(mod => {
                return `
                  <tr>
                    <td>
                      <strong style="color:var(--adm-text-primary); font-size:0.85rem;">${escapeHtml(mod.name)}</strong>
                      <span style="display:block; font-size:0.7rem; color:var(--adm-text-muted);">${escapeHtml(mod.category)}</span>
                    </td>
                    <td>
                      <code style="font-size:0.72rem; color:var(--adm-tertiary);">${escapeHtml(mod.key)}</code>
                    </td>
                    ${roles.map(r => {
                      const hasPerm = r.permissions.includes(mod.key);
                      const isReadOnlyRole = r.name === 'Analyst' && hasPerm;
                      const isCurrentContext = r.name === AppState.activeRole;
                      return `
                        <td style="text-align: center; ${isCurrentContext ? 'background:rgba(127,82,255,0.04);' : ''}">
                          ${hasPerm ? (
                            isReadOnlyRole ? 
                            `<span class="adm-perm-indicator readonly" title="Read-Only Visibility">👁️ Read</span>` :
                            `<span class="adm-perm-indicator granted" title="Granted Operational Permission">✓ Full</span>`
                          ) : (
                            `<span class="adm-perm-indicator denied" title="Access Denied">—</span>`
                          )}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (targetRoleId) {
      setTimeout(() => NexvionAdminApp.openRoleDetailDrawer(targetRoleId), 50);
    }
  }

  // --- ROUTE: AUDIT LOGS ---
  async function renderAuditLogsView() {
    const rawLogs = await Data.getAuditLogs();
    const admins = await Data.getAdminUsers();
    const viewState = AppState.auditLogsView;

    // Filter
    let filtered = rawLogs.filter(log => {
      const q = (viewState.searchTerm || '').toLowerCase();
      const matchSearch = !q ||
        log.action.toLowerCase().includes(q) ||
        log.admin.toLowerCase().includes(q) ||
        log.entityName.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q);

      let matchDate = true;
      if (viewState.dateRangeFilter === 'today') {
        const d = new Date(log.timestamp);
        const now = new Date();
        matchDate = d.toDateString() === now.toDateString();
      } else if (viewState.dateRangeFilter === '7days') {
        const d = new Date(log.timestamp);
        const limit = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        matchDate = d >= limit;
      } else if (viewState.dateRangeFilter === '30days') {
        const d = new Date(log.timestamp);
        const limit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        matchDate = d >= limit;
      }

      const matchAdmin = viewState.adminFilter === 'ALL' || log.admin.toLowerCase().includes(viewState.adminFilter.toLowerCase());
      const matchAction = viewState.actionFilter === 'ALL' || log.action.toUpperCase().includes(viewState.actionFilter.toUpperCase());
      const matchEntity = viewState.entityFilter === 'ALL' || log.entityType.toLowerCase() === viewState.entityFilter.toLowerCase();

      return matchSearch && matchDate && matchAdmin && matchAction && matchEntity;
    });

    // Sort
    filtered.sort((a, b) => {
      if (viewState.sortBy === 'timestamp-desc') return new Date(b.timestamp) - new Date(a.timestamp);
      if (viewState.sortBy === 'timestamp-asc') return new Date(a.timestamp) - new Date(b.timestamp);
      return 0;
    });

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / viewState.pageSize));
    const currentPage = Math.min(viewState.currentPage, totalPages);
    const startIndex = (currentPage - 1) * viewState.pageSize;
    const paginated = filtered.slice(startIndex, startIndex + viewState.pageSize);

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Platform Audit Logs</span>
            <span class="adm-proto-pill"><span class="adm-proto-pulse"></span> ${rawLogs.length} LOGGED EVENTS</span>
          </h1>
          <p class="adm-page-desc">Chronological ledger of security mutations, role reassignments, batch operations, and system state transitions.</p>
        </div>
        <div class="adm-header-actions">
          <div style="display:flex; gap:6px; background:var(--adm-surface-elevated); padding:3px; border-radius:6px; border:1px solid var(--adm-border);">
            <button class="adm-btn adm-btn-sm ${viewState.viewMode === 'table' ? 'adm-btn-primary' : 'adm-btn-secondary'}" 
                    onclick="NexvionAdminApp.toggleAuditViewMode('table')">
              📋 Table View
            </button>
            <button class="adm-btn adm-btn-sm ${viewState.viewMode === 'timeline' ? 'adm-btn-primary' : 'adm-btn-secondary'}" 
                    onclick="NexvionAdminApp.toggleAuditViewMode('timeline')">
              ⏱️ Timeline View
            </button>
          </div>
        </div>
      </div>

      <!-- Mandatory Integration Copy Banner (Exact Copy Required) -->
      <div style="background: rgba(127, 82, 255, 0.06); border: 1px solid rgba(127, 82, 255, 0.25); border-radius: 8px; padding: 12px 18px; margin-bottom: 20px; font-size: 0.85rem; color: var(--adm-text-secondary); display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.25rem;">🔒</span>
        <div>
          <strong style="color: var(--adm-text-primary);">Integration Notice:</strong>
          Server-side audit logging will be connected during backend integration.
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="adm-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
        ${AdminComponents.StatCard({
          label: 'Total Audit Entries',
          value: rawLogs.length,
          subtext: 'Immutable operational records',
          icon: '📜'
        })}
        ${AdminComponents.StatCard({
          label: 'Logged Successes',
          value: rawLogs.filter(l => l.result === 'Success').length,
          subtext: 'Standard verified transitions',
          icon: '✓',
          change: '100%',
          changeType: 'up'
        })}
        ${AdminComponents.StatCard({
          label: 'Security Warnings',
          value: rawLogs.filter(l => l.result === 'Warning').length,
          subtext: 'Privilege elevations / suspensions',
          icon: '⚠️'
        })}
        ${AdminComponents.StatCard({
          label: 'Distinct Entities',
          value: new Set(rawLogs.map(l => l.entityType)).size,
          subtext: 'Platform domains covered',
          icon: '🗄️'
        })}
      </div>

      <!-- Filter Bar -->
      <div class="adm-filter-bar">
        <div class="adm-filter-group">
          <input type="text" class="adm-input" id="auditSearchInput" placeholder="Search admin, action, entity..." 
                 value="${escapeHtml(viewState.searchTerm || '')}" 
                 oninput="NexvionAdminApp.onAuditSearch(this.value)" style="min-width: 220px;">

          <select class="adm-select" onchange="NexvionAdminApp.onAuditDateFilter(this.value)">
            <option value="ALL" ${viewState.dateRangeFilter === 'ALL' ? 'selected' : ''}>All Dates</option>
            <option value="today" ${viewState.dateRangeFilter === 'today' ? 'selected' : ''}>Today</option>
            <option value="7days" ${viewState.dateRangeFilter === '7days' ? 'selected' : ''}>Last 7 Days</option>
            <option value="30days" ${viewState.dateRangeFilter === '30days' ? 'selected' : ''}>Last 30 Days</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAuditAdminFilter(this.value)">
            <option value="ALL" ${viewState.adminFilter === 'ALL' ? 'selected' : ''}>All Admins</option>
            ${admins.map(a => `<option value="${a.name}" ${viewState.adminFilter === a.name ? 'selected' : ''}>${a.name}</option>`).join('')}
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAuditActionFilter(this.value)">
            <option value="ALL" ${viewState.actionFilter === 'ALL' ? 'selected' : ''}>All Actions</option>
            <option value="ADMIN" ${viewState.actionFilter === 'ADMIN' ? 'selected' : ''}>Admin Events</option>
            <option value="ROLE" ${viewState.actionFilter === 'ROLE' ? 'selected' : ''}>Role Changes</option>
            <option value="SETTINGS" ${viewState.actionFilter === 'SETTINGS' ? 'selected' : ''}>Settings Updates</option>
            <option value="CERTIFICATE" ${viewState.actionFilter === 'CERTIFICATE' ? 'selected' : ''}>Certificates</option>
            <option value="PAYMENT" ${viewState.actionFilter === 'PAYMENT' ? 'selected' : ''}>Payments</option>
            <option value="ENROLLMENT" ${viewState.actionFilter === 'ENROLLMENT' ? 'selected' : ''}>Enrollments</option>
          </select>

          <select class="adm-select" onchange="NexvionAdminApp.onAuditEntityFilter(this.value)">
            <option value="ALL" ${viewState.entityFilter === 'ALL' ? 'selected' : ''}>All Entity Types</option>
            <option value="Admin" ${viewState.entityFilter === 'Admin' ? 'selected' : ''}>Admin</option>
            <option value="Role" ${viewState.entityFilter === 'Role' ? 'selected' : ''}>Role</option>
            <option value="Settings" ${viewState.entityFilter === 'Settings' ? 'selected' : ''}>Settings</option>
            <option value="Certificate" ${viewState.entityFilter === 'Certificate' ? 'selected' : ''}>Certificate</option>
            <option value="Payment" ${viewState.entityFilter === 'Payment' ? 'selected' : ''}>Payment</option>
            <option value="Enrollment" ${viewState.entityFilter === 'Enrollment' ? 'selected' : ''}>Enrollment</option>
            <option value="Batch" ${viewState.entityFilter === 'Batch' ? 'selected' : ''}>Batch</option>
            <option value="Course" ${viewState.entityFilter === 'Course' ? 'selected' : ''}>Course</option>
          </select>
        </div>

        <div class="adm-filter-group">
          <button class="adm-btn adm-btn-secondary adm-btn-sm" onclick="NexvionAdminApp.resetAuditFilters()">Reset Filters</button>
        </div>
      </div>

      ${viewState.viewMode === 'table' ? `
        <!-- Table View -->
        <div class="adm-table-wrap">
          <table class="adm-table" id="auditLogsTable">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin Operator</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity Name</th>
                <th>Result</th>
                <th>Previous State</th>
                <th>New State</th>
                <th>Device / IP</th>
                <th style="text-align: right;">Detail</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.length > 0 ? paginated.map(l => {
                const resultBadge = l.result === 'Success' ? 'adm-badge-published' :
                                    l.result === 'Warning' ? 'adm-badge-manual-review' : 'adm-deliv-failed';
                return `
                  <tr>
                    <td style="font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); white-space:nowrap;">
                      ${new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <strong style="color:var(--adm-text-primary); font-size:0.85rem; display:block;">${escapeHtml(l.admin)}</strong>
                      <span style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${escapeHtml(l.adminEmail || '')}</span>
                    </td>
                    <td>
                      <span style="color:var(--adm-primary); font-weight:700; font-size:0.8rem; font-family:var(--adm-font-mono);">${escapeHtml(l.action)}</span>
                    </td>
                    <td>
                      <span class="adm-badge adm-badge-draft">${escapeHtml(l.entityType)}</span>
                    </td>
                    <td>
                      <span style="font-size:0.82rem; color:var(--adm-text-primary); font-weight:600;">${escapeHtml(l.entityName)}</span>
                    </td>
                    <td>
                      <span class="adm-badge ${resultBadge}">${escapeHtml(l.result)}</span>
                    </td>
                    <td style="max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.72rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">
                      ${escapeHtml(l.previousState || 'None')}
                    </td>
                    <td style="max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.72rem; font-family:var(--adm-font-mono); color:var(--adm-primary);">
                      ${escapeHtml(l.newState || 'None')}
                    </td>
                    <td style="font-size:0.72rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); white-space:nowrap;">
                      ${escapeHtml(l.ipDevice || '192.168.1.1')}
                    </td>
                    <td style="text-align: right;">
                      <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openAuditLogDetail('${l.id}')">
                        Inspect
                      </button>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="10" style="text-align:center; padding:36px; color:var(--adm-text-muted);">
                    <div class="adm-state-box">
                      <div class="adm-state-icon">📜</div>
                      <h3 class="adm-state-title">No audit log entries found</h3>
                      <p class="adm-state-desc">Try clearing your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      ` : `
        <!-- Timeline View -->
        <div class="adm-audit-timeline">
          ${paginated.length > 0 ? paginated.map(l => {
            const isWarning = l.result === 'Warning';
            return `
              <div class="adm-audit-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div>
                    <span style="font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-tertiary); font-weight:700;">
                      ${new Date(l.timestamp).toLocaleString()}
                    </span>
                    <h4 style="margin:2px 0 0 0; color:var(--adm-text-primary); font-size:0.95rem;">
                      ${escapeHtml(l.action)} — <span style="font-weight:400; color:var(--adm-text-secondary);">${escapeHtml(l.entityName)}</span>
                    </h4>
                  </div>
                  <span class="adm-badge ${isWarning ? 'adm-badge-manual-review' : 'adm-badge-published'}">${escapeHtml(l.result)}</span>
                </div>

                <div style="font-size:0.78rem; color:var(--adm-text-muted); margin-bottom:12px;">
                  Operator: <strong>${escapeHtml(l.admin)}</strong> (${escapeHtml(l.adminEmail || 'internal')}) • Device: <code>${escapeHtml(l.ipDevice || 'Client Session')}</code>
                </div>

                <div class="adm-diff-grid">
                  <div class="adm-diff-pane">
                    <div class="adm-diff-title">Previous State Placeholder</div>
                    <pre class="adm-diff-code">${escapeHtml(l.previousState || 'Prior baseline')}</pre>
                  </div>
                  <div class="adm-diff-pane">
                    <div class="adm-diff-title">New State Placeholder</div>
                    <pre class="adm-diff-code" style="color:var(--adm-primary);">${escapeHtml(l.newState || 'Modified')}</pre>
                  </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                  <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.openAuditLogDetail('${l.id}')">
                    Inspect Full Details
                  </button>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="adm-card" style="text-align:center; padding:36px; color:var(--adm-text-muted);">
              No entries match the timeline filter criteria.
            </div>
          `}
        </div>
      `}

      <!-- Pagination -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; flex-wrap:wrap; gap:12px; font-size:0.82rem; color:var(--adm-text-muted);">
        <div>
          Showing <strong>${totalRecords > 0 ? startIndex + 1 : 0}</strong>–<strong>${Math.min(startIndex + viewState.pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> events
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="adm-btn adm-btn-sm adm-btn-secondary" ${currentPage <= 1 ? 'disabled' : ''} onclick="NexvionAdminApp.onAuditPageChange(${currentPage - 1})">
            Previous
          </button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button class="adm-btn adm-btn-sm adm-btn-secondary" ${currentPage >= totalPages ? 'disabled' : ''} onclick="NexvionAdminApp.onAuditPageChange(${currentPage + 1})">
            Next
          </button>
        </div>
      </div>
    `;
  }

  // --- ROUTE: PLATFORM SETTINGS & GOVERNANCE ---
  async function renderSettingsView() {
    const settings = await Data.getSettings();
    const canManageSettings = Data.hasPermission('manage_settings');
    const activeTab = AppState.settingsView.activeTab || 'platform';
    const isDirty = AppState.settingsView.dirty;

    const tabs = [
      { key: 'platform', label: 'Platform', icon: '🌐' },
      { key: 'branding', label: 'Branding', icon: '🎨' },
      { key: 'courses', label: 'Courses', icon: '📚' },
      { key: 'enrollmentRules', label: 'Enrollment rules', icon: '📋' },
      { key: 'batchRules', label: 'Batch rules', icon: '🏛️' },
      { key: 'notifications', label: 'Notifications', icon: '⚡' },
      { key: 'certificates', label: 'Certificates', icon: '🎓' },
      { key: 'payments', label: 'Payments', icon: '💳' },
      { key: 'support', label: 'Support', icon: '🎫' },
      { key: 'adminPreferences', label: 'Admin preferences', icon: '⚙️' }
    ];

    DOM.content.innerHTML = `
      <div class="adm-page-header">
        <div class="adm-page-titles">
          <h1 class="adm-page-title">
            <span>Platform Settings & Governance</span>
            <span class="adm-proto-pill"><span class="adm-proto-pulse"></span> SYSTEM GOVERNANCE</span>
          </h1>
          <p class="adm-page-desc">Institutional rules, invariant enforcement, branding configuration, and platform orchestration.</p>
        </div>
        <div class="adm-header-actions">
          <button class="adm-btn adm-btn-secondary ${!canManageSettings ? 'adm-btn-disabled' : ''}" 
                  ${!canManageSettings ? 'disabled' : ''}
                  onclick="NexvionAdminApp.resetSettingsCurrentSection()">
            Reset Section Defaults
          </button>
          <button class="adm-btn adm-btn-secondary" 
                  ${!isDirty ? 'disabled' : ''}
                  onclick="NexvionAdminApp.cancelSettingsChanges()">
            Cancel
          </button>
          <button class="adm-btn adm-btn-primary ${!canManageSettings ? 'adm-btn-disabled' : ''}" 
                  id="settingsSaveBtn"
                  ${!canManageSettings ? 'disabled title="Requires manage_settings permission"' : ''}
                  onclick="NexvionAdminApp.saveSettingsForm()">
            ${AppState.settingsView.saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <!-- Unsaved Changes Floating Banner -->
      <div class="adm-unsaved-banner" id="settingsUnsavedBanner" style="display: ${isDirty ? 'flex' : 'none'};">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">⚠️</span>
          <div>
            <strong>Unsaved Platform Settings</strong>
            <div style="font-size:0.78rem; opacity:0.85;">You have modified configuration parameters that have not yet been committed to storage.</div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn adm-btn-sm adm-btn-secondary" onclick="NexvionAdminApp.cancelSettingsChanges()">Discard</button>
          <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.saveSettingsForm()">Save Changes</button>
        </div>
      </div>

      ${!canManageSettings ? `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:10px 14px; border-radius:6px; margin-bottom:20px; font-size:0.8rem; color:#B45309;">
          <strong>Read-Only Access:</strong> Role context (${AppState.activeRole}) does not have <code>manage_settings</code>. Settings can be inspected but mutations are disabled.
        </div>
      ` : ''}

      <!-- 10 Settings Tabs Nav -->
      <div class="adm-settings-nav">
        ${tabs.map(t => `
          <button class="adm-settings-tab-btn ${activeTab === t.key ? 'active' : ''}" 
                  onclick="NexvionAdminApp.switchSettingsTab('${t.key}')">
            <span>${t.icon}</span>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Settings Tab Content Area -->
      <div class="adm-card" style="margin-top:20px;">
        ${renderSettingsTabForm(activeTab, settings, canManageSettings)}
      </div>
    `;
  }

  function renderSettingsTabForm(tabKey, settings, canManage) {
    const disabledAttr = !canManage ? 'disabled' : '';

    switch (tabKey) {
      case 'platform':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Platform Identity & Runtime Parameters</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Platform Name</div>
              <p class="adm-setting-desc">The primary public and internal identity of this autonomous academy platform.</p>
            </div>
            <div class="adm-setting-control">
              <input type="text" class="adm-input" id="settingPlatformName" value="${escapeHtml(settings.platform.platformName)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Platform Tagline</div>
              <p class="adm-setting-desc">Displayed across student onboarding portals and transaction receipts.</p>
            </div>
            <div class="adm-setting-control">
              <input type="text" class="adm-input" id="settingTagline" value="${escapeHtml(settings.platform.tagline)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Platform Standard Timezone</div>
              <p class="adm-setting-desc">Used for synchronized cohort scheduling, class timetable publishing, and audit timestamps.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingTimezone" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
                <option value="UTC" ${settings.platform.defaultTimezone === 'UTC' ? 'selected' : ''}>UTC (Coordinated Universal Time)</option>
                <option value="America/New_York" ${settings.platform.defaultTimezone === 'America/New_York' ? 'selected' : ''}>America/New York (EST/EDT)</option>
                <option value="Europe/London" ${settings.platform.defaultTimezone === 'Europe/London' ? 'selected' : ''}>Europe/London (GMT/BST)</option>
                <option value="Asia/Singapore" ${settings.platform.defaultTimezone === 'Asia/Singapore' ? 'selected' : ''}>Asia/Singapore (SGT)</option>
                <option value="Asia/Dubai" ${settings.platform.defaultTimezone === 'Asia/Dubai' ? 'selected' : ''}>Asia/Dubai (GST)</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Support Contact Email</div>
              <p class="adm-setting-desc">Official destination address for system inquiries and escalation routing.</p>
            </div>
            <div class="adm-setting-control">
              <input type="email" class="adm-input" id="settingSupportEmail" value="${escapeHtml(settings.platform.supportEmail)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Maintenance Mode Placeholder</div>
              <p class="adm-setting-desc">When toggled, presents incoming students with a scheduled upgrade advisory.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingMaintenanceMode" ${settings.platform.maintenanceMode ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Enable Maintenance Mode</span>
              </label>
            </div>
          </div>
        `;

      case 'branding':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Visual Branding & Design Tokens</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Academy Display Brand</div>
              <p class="adm-setting-desc">Hero display title in navigational chrome.</p>
            </div>
            <div class="adm-setting-control">
              <input type="text" class="adm-input" id="settingBrandAcademyName" value="${escapeHtml(settings.branding.academyName)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Platform Logo Placeholder</div>
              <p class="adm-setting-desc">Official visual emblem displayed on admin topbar and student portal.</p>
            </div>
            <div class="adm-setting-control" style="align-items:flex-end;">
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                <img src="${escapeHtml(settings.branding.logoUrl)}" alt="Logo" style="width:48px; height:48px; border-radius:10px; border:1px solid var(--adm-border); object-fit:cover;">
                <span class="adm-badge adm-badge-published">Active Asset</span>
              </div>
              <button class="adm-btn adm-btn-sm adm-btn-secondary ${disabledAttr ? 'adm-btn-disabled' : ''}" ${disabledAttr} onclick="showToast('Logo Upload Placeholder', 'Asset storage will connect during backend Cloud Storage integration.', 'info')">
                Upload Custom Logo
              </button>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Primary Brand Color</div>
              <p class="adm-setting-desc">Hex color token for buttons, active navigation, and key accents.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="color" id="settingPrimaryColor" value="${escapeHtml(settings.branding.primaryColor)}" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="border:none; width:34px; height:34px; border-radius:4px; cursor:pointer; background:none;">
                <input type="text" class="adm-input" id="settingPrimaryColorText" value="${escapeHtml(settings.branding.primaryColor)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:120px; font-family:var(--adm-font-mono);">
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Secondary Accent Color</div>
              <p class="adm-setting-desc">Vibrant secondary accent token used for telemetry indicators and badges.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="color" id="settingAccentColor" value="${escapeHtml(settings.branding.accentColor)}" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="border:none; width:34px; height:34px; border-radius:4px; cursor:pointer; background:none;">
                <input type="text" class="adm-input" id="settingAccentColorText" value="${escapeHtml(settings.branding.accentColor)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:120px; font-family:var(--adm-font-mono);">
              </div>
            </div>
          </div>
        `;

      case 'courses':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Curriculum & Content Governance</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Default Curriculum Language</div>
              <p class="adm-setting-desc">Primary locale applied to lesson transcripts and metadata.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingCourseLang" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:240px;">
                <option value="English (US)" selected>English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Auto-Publish Added Modules</div>
              <p class="adm-setting-desc">When enabled, new modules default to Published status immediately.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingAutoPublishModules" ${settings.courses.autoPublishModules ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Auto-publish modules</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Maximum Video Duration</div>
              <p class="adm-setting-desc">Target soft ceiling (minutes) for micro-lecture media files.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingMaxVideoDuration" value="${settings.courses.maxVideoDurationMinutes}" min="5" max="180" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">minutes</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Allow Public Preview Lessons</div>
              <p class="adm-setting-desc">Enables prospective applicants to preview selected foundational lessons.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingAllowPublicPreviews" ${settings.courses.allowPublicPreviews ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Enable public previews</span>
              </label>
            </div>
          </div>
        `;

      case 'enrollmentRules':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Enrollment & Admission Rules</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Enrollment Approval Mode</div>
              <p class="adm-setting-desc">Select whether applicant admissions require staff triage or proceed automatically.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingApprovalMode" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:260px;">
                <option value="Manual Review" ${settings.enrollmentRules.approvalMode === 'Manual Review' ? 'selected' : ''}>Manual Review (Staff Triage)</option>
                <option value="Automated Instant Enrollment" ${settings.enrollmentRules.approvalMode === 'Automated Instant Enrollment' ? 'selected' : ''}>Automated Instant Enrollment</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Waitlist Mechanism</div>
              <p class="adm-setting-desc">When a cohort reaches its 30-student capacity, route new applicants to the cohort waitlist.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingWaitlistEnabled" ${settings.enrollmentRules.waitlistEnabled ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Waitlist enabled</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Auto-Promote Waitlist Candidates</div>
              <p class="adm-setting-desc">Automatically admit the next waitlisted applicant when an enrolled student withdraws.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingAutoPromoteWaitlist" ${settings.enrollmentRules.autoPromoteWaitlist ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Auto-promote waitlist</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Prerequisite Verification</div>
              <p class="adm-setting-desc">Verify prerequisite tier completion before allowing admission into advanced curricula.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingEnforcePrereqs" ${settings.enrollmentRules.enforcePrerequisites ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Enforce prerequisites</span>
              </label>
            </div>
          </div>
        `;

      case 'batchRules':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Batch Governance & Capacity Invariants</h3>
          
          <!-- STRICT ARCHITECTURAL INVARIANT: Fixed at 30, never editable above 30 -->
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">
                <span>Maximum Batch Capacity</span>
                <span class="adm-batch-locked-badge">🔒 FIXED AT 30 • PLATFORM ARCHITECTURAL INVARIANT</span>
              </div>
              <p class="adm-setting-desc">
                The maximum batch size must remain fixed at 30 and must not be editable above 30. Cohort pedagogy strictly limits live learner capacity to 30 students per batch to ensure instructional mentoring bandwidth.
              </p>
            </div>
            <div class="adm-setting-control">
              <input type="number" class="adm-input" id="settingMaxBatchCapacity" value="30" min="1" max="30" disabled 
                     style="width: 140px; background: var(--adm-surface-elevated); cursor: not-allowed; font-weight: 700; color: var(--adm-primary);">
              <span style="font-size:0.72rem; color:var(--adm-text-muted);">Hard constraint enforced by platform architecture</span>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Allow Over-Enrollment Beyond Cap</div>
              <p class="adm-setting-desc">Permit admitting students once a batch reaches 30 seats.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" disabled style="cursor:not-allowed;">
                <span style="font-size:0.82rem; color:var(--adm-text-muted); font-weight:600;">Disabled (Invariant Violations Forbidden)</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Standard Cohort Cadence</div>
              <p class="adm-setting-desc">Primary scheduled commencement day for new cohort batches.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingCohortCadence" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:240px;">
                <option value="Monday" selected>Monday Launch</option>
                <option value="Wednesday">Wednesday Launch</option>
                <option value="Saturday">Saturday Launch</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Cohort Auto-Archive Grace Window</div>
              <p class="adm-setting-desc">Number of days post completion before cohort status switches to Archived.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingArchiveDays" value="${settings.batchRules.archiveDaysAfterEnd || 30}" min="7" max="180" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">days</span>
              </div>
            </div>
          </div>
        `;

      case 'notifications':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Notification Defaults & Delivery Parameters</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Default Delivery Channels</div>
              <p class="adm-setting-desc">System broadcast channels preselected for new student announcements.</p>
            </div>
            <div class="adm-setting-control" style="align-items:flex-start;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" checked ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> In-App System Alerts
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" checked ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> Mobile Device Push
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> Transactional Email
                </label>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Live Class Reminder Timing</div>
              <p class="adm-setting-desc">Automated alert dispatched before scheduled live session.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingClassReminderHours" value="${settings.notifications.classReminderHours}" min="1" max="48" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">hours before class</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Student Digest Frequency</div>
              <p class="adm-setting-desc">Cadence for aggregated student progress summaries.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingDigestCadence" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:240px;">
                <option value="Daily Summary" ${settings.notifications.digestFrequency === 'Daily Summary' ? 'selected' : ''}>Daily Summary</option>
                <option value="Weekly Digest" ${settings.notifications.digestFrequency === 'Weekly Digest' ? 'selected' : ''}>Weekly Digest</option>
                <option value="Disabled" ${settings.notifications.digestFrequency === 'Disabled' ? 'selected' : ''}>Disabled</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Nightly Quiet Hours</div>
              <p class="adm-setting-desc">Suppress non-critical push notifications between 22:00 and 07:00 student local time.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingQuietHours" ${settings.notifications.quietHoursEnabled ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Enforce quiet hours</span>
              </label>
            </div>
          </div>
        `;

      case 'certificates':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Certificate Issuance Criteria & Credential Governance</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Minimum Course Completion Requirement</div>
              <p class="adm-setting-desc">Percentage of lectures, modules, and lessons completed to qualify for graduation.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingCertMinCompletion" value="${settings.certificates.minCompletionPercentage}" min="50" max="100" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">%</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Mandatory Capstone Project Completion</div>
              <p class="adm-setting-desc">Student must have an approved capstone submission before certificate issuance.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingCertRequireCapstone" ${settings.certificates.requireCapstone ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Capstone mandatory</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Minimum Assignment Passing Grade</div>
              <p class="adm-setting-desc">Cumulative average across required sprint assignments.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingCertMinGrade" value="${settings.certificates.minAssignmentGrade}" min="50" max="100" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">points</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Directorate Approval Sign-Off</div>
              <p class="adm-setting-desc">Requires manual academic board verification before publishing digital credential.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingCertRequireManualSignoff" ${settings.certificates.requireManualSignoff ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Manual sign-off required</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Public Verification URL Template</div>
              <p class="adm-setting-desc">Pattern used by external employers to verify student credentials.</p>
            </div>
            <div class="adm-setting-control">
              <input type="text" class="adm-input" id="settingCertVerifyUrl" value="${escapeHtml(settings.certificates.verificationUrlFormat)}" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:280px; font-family:var(--adm-font-mono);">
            </div>
          </div>
        `;

      case 'payments':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Billing, Tuition & Financial Administration</h3>
          
          <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); padding:12px 16px; border-radius:8px; margin-bottom:20px; font-size:0.82rem; color:var(--adm-text-secondary);">
            <strong>Gateway Integration Status:</strong> Payment processing will be connected during backend integration. Non-free tier tuition displays <code>PRICE COMING SOON</code>.
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Institutional Ledger Currency</div>
              <p class="adm-setting-desc">Standard financial denomination for billing records.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingCurrency" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:200px;">
                <option value="USD" selected>USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="SGD">SGD (S$ - Singapore Dollar)</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Tuition Refund Grace Window</div>
              <p class="adm-setting-desc">Number of days post cohort commencement eligible for bursar refund requests.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingRefundGraceDays" value="${settings.payments.refundGraceDays}" min="0" max="60" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">days</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Accepted Payment Channels Placeholder</div>
              <p class="adm-setting-desc">Financial gateways supported during checkout.</p>
            </div>
            <div class="adm-setting-control" style="align-items:flex-start;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" checked ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> Stripe Payment Gateway
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" checked ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> Enterprise Purchase Order & Invoicing
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem;">
                  <input type="checkbox" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()"> Direct Treasury Bank Wire
                </label>
              </div>
            </div>
          </div>
        `;

      case 'support':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">Helpdesk SLAs & Student Support Policies</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Target SLA First-Response Time</div>
              <p class="adm-setting-desc">Operational service target for incoming student inquiries.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingSupportSlaHours" value="${settings.support.slaHours}" min="1" max="72" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">hours</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Auto-Assign Inbound Tickets</div>
              <p class="adm-setting-desc">Evenly distribute new student tickets among active Support Managers.</p>
            </div>
            <div class="adm-setting-control">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="settingAutoAssignTickets" ${settings.support.autoAssignTickets ? 'checked' : ''} ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()">
                <span style="font-size:0.85rem; color:var(--adm-text-primary);">Auto-assignment active</span>
              </label>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Resolved Ticket Closure Grace Window</div>
              <p class="adm-setting-desc">Hours ticket remains open awaiting student confirmation before auto-closing.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingSupportAutoCloseHours" value="${settings.support.autoCloseHours}" min="12" max="168" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">hours</span>
              </div>
            </div>
          </div>
        `;

      case 'adminPreferences':
        return `
          <h3 class="adm-card-title" style="margin-bottom:16px;">System Administration & Security Policies</h3>
          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Audit Log Retention Window</div>
              <p class="adm-setting-desc">Number of days operational audit ledger history is retained in platform storage.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingAuditRetentionDays" value="${settings.adminPreferences.auditRetentionDays}" min="30" max="365" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">days</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Staff Inactivity Session Timeout</div>
              <p class="adm-setting-desc">Automatic session lock duration for administrative accounts.</p>
            </div>
            <div class="adm-setting-control">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" class="adm-input" id="settingSessionTimeoutMinutes" value="${settings.adminPreferences.sessionTimeoutMinutes}" min="5" max="120" ${disabledAttr} oninput="NexvionAdminApp.onSettingFieldChange()" style="width:100px;">
                <span style="font-size:0.8rem; color:var(--adm-text-muted);">minutes</span>
              </div>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Multi-Factor Authentication (2FA) Policy</div>
              <p class="adm-setting-desc">Enforce hardware token or authenticator app requirement across staff accounts.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="setting2faPolicy" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:280px;">
                <option value="Enforced for all administrative staff" selected>Enforced for all administrative staff</option>
                <option value="Optional for read-only staff">Optional for read-only staff</option>
                <option value="Strict FIDO2 Hardware Key Only">Strict FIDO2 Hardware Key Only</option>
              </select>
            </div>
          </div>

          <div class="adm-setting-field-row">
            <div class="adm-setting-info">
              <div class="adm-setting-title">Data Table Layout Density</div>
              <p class="adm-setting-desc">Controls default table row padding and vertical layout spacing.</p>
            </div>
            <div class="adm-setting-control">
              <select class="adm-select" id="settingTableDensity" ${disabledAttr} onchange="NexvionAdminApp.onSettingFieldChange()" style="width:200px;">
                <option value="Comfortable" ${settings.adminPreferences.tableDensity === 'Comfortable' ? 'selected' : ''}>Comfortable</option>
                <option value="Compact" ${settings.adminPreferences.tableDensity === 'Compact' ? 'selected' : ''}>Compact</option>
              </select>
            </div>
          </div>
        `;

      default:
        return `<p style="color:var(--adm-text-muted);">Select a settings tab.</p>`;
    }
  }

  // --- ROUTE: ADMIN AUTHENTICATION ---
  async function renderLoginView() {
    DOM.content.innerHTML = `
      <div style="max-width: 460px; margin: 40px auto; padding: 32px; background: var(--adm-surface-card); border: 1px solid var(--adm-border); border-radius: var(--adm-radius-lg); box-shadow: var(--adm-shadow-lg); text-align: center;">
        <img src="NEXVION_logo_design_20261005164702.jpg" alt="NEXVION AI" style="width: 52px; height: 52px; border-radius: 12px; margin-bottom: 16px; border: 1px solid var(--adm-border);">
        <h2 style="color:var(--adm-text-primary); margin: 0 0 6px 0; font-size: 1.5rem;">NEXVION AI Admin Portal</h2>
        <p style="color: var(--adm-text-secondary); font-size: 0.84rem; margin: 0 0 20px 0;">Administrative Access & Staff Sign In</p>
        
        <div style="background: rgba(127,82,255,0.06); border: 1px solid rgba(127,82,255,0.25); border-radius: 8px; padding: 10px 14px; font-size: 0.78rem; color: var(--adm-text-secondary); text-align: left; margin-bottom: 20px; line-height: 1.4;">
          <strong>Security Notice:</strong> Real authentication will connect to Firebase Auth, enterprise SSO, and admin custom claims during the backend integration phase.
        </div>

        <form onsubmit="event.preventDefault(); NexvionAdminApp.submitSimulatedLogin();" style="text-align: left;">
          <div class="adm-form-group">
            <label class="adm-form-label">Administrator Email</label>
            <input type="email" class="adm-input" id="loginEmail" value="evelyn.vance@nexvion.ai" required>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Password</label>
            <input type="password" class="adm-input" id="loginPass" value="••••••••••••" required>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Administrative Role Context</label>
            <select class="adm-select" id="loginRole" style="width: 100%;">
              <option value="Super Admin" selected>Super Admin</option>
              <option value="Owner">Owner</option>
              <option value="Content Manager">Content Manager</option>
              <option value="Student Manager">Student Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Communications Manager">Communications Manager</option>
              <option value="Support Manager">Support Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>

          <button type="submit" class="adm-btn adm-btn-primary" style="width: 100%; margin-top: 14px; padding: 11px;">
            Sign In to Admin Portal →
          </button>
        </form>
      </div>
    `;
  }

  // --- ROUTE DISPATCHER ---
  async function renderRoute(path) {
    if (!DOM.content) return;

    // Permission-aware route access display
    const routePermissionGates = [
      { prefix: '/admin/payments', perm: 'view_payments' },
      { prefix: '/admin/analytics', perm: 'view_analytics' },
      { prefix: '/admin/admins', perm: 'manage_admins' },
      { prefix: '/admin/audit-logs', perm: 'view_audit_logs' },
      { prefix: '/admin/settings', perm: 'manage_settings' }
    ];
    for (const gate of routePermissionGates) {
      if (path.startsWith(gate.prefix) && !Data.hasPermission(gate.perm)) {
        DOM.content.innerHTML = renderPermissionGate(gate.perm);
        return;
      }
    }

    if (path === '/admin' || path === '/admin/' || path === '/admin/overview') {
      await renderOverviewView();
    } else if (path === '/admin/courses') {
      await renderCoursesView();
    } else if (path.startsWith('/admin/courses/')) {
      const courseId = path.split('/admin/courses/')[1];
      await renderCourseDetailView(courseId);
    } else if (path === '/admin/tiers') {
      await renderTiersView();
    } else if (path === '/admin/batches') {
      await renderBatchesView();
    } else if (path.startsWith('/admin/batches/')) {
      const batchId = path.split('/admin/batches/')[1];
      await renderBatchesView();
      if (batchId) setTimeout(() => NexvionAdminApp.openBatchDetail(batchId), 50);
    } else if (path === '/admin/students') {
      await renderStudentsView();
    } else if (path.startsWith('/admin/students/')) {
      const studentId = path.split('/admin/students/')[1];
      await renderStudentDetailView(studentId);
    } else if (path === '/admin/enrollments') {
      await renderEnrollmentsView();
    } else if (path === '/admin/classes') {
      await renderClassesView();
    } else if (path === '/admin/modules') {
      await renderModulesView();
    } else if (path === '/admin/lessons') {
      await renderLessonsView();
    } else if (path === '/admin/videos') {
      await renderVideosView();
    } else if (path === '/admin/resources') {
      await renderResourcesView();
    } else if (path === '/admin/projects') {
      await renderProjectsView();
    } else if (path.startsWith('/admin/projects/')) {
      const projectId = path.split('/admin/projects/')[1];
      await renderProjectDetailView(projectId);
    } else if (path === '/admin/assignments') {
      await renderAssignmentsView();
    } else if (path.startsWith('/admin/assignments/')) {
      const assignmentId = path.split('/admin/assignments/')[1];
      await renderAssignmentDetailView(assignmentId);
    } else if (path === '/admin/submissions') {
      await renderSubmissionsView();
    } else if (path.startsWith('/admin/submissions/')) {
      const subId = path.split('/admin/submissions/')[1];
      await renderSubmissionsView();
      if (subId) setTimeout(() => NexvionAdminApp.openSubmissionReviewDrawer(subId), 50);
    } else if (path === '/admin/announcements') {
      await renderAnnouncementsView();
    } else if (path === '/admin/announcements/new') {
      await renderAnnouncementComposerView(null);
    } else if (path.startsWith('/admin/announcements/')) {
      const announcementId = path.split('/admin/announcements/')[1];
      await renderAnnouncementComposerView(announcementId);
    } else if (path === '/admin/notifications') {
      await renderNotificationsView();
    } else if (path === '/admin/payments') {
      await renderPaymentsView();
    } else if (path.startsWith('/admin/payments/')) {
      const paymentId = path.split('/admin/payments/')[1];
      await renderPaymentsView();
      if (paymentId) setTimeout(() => NexvionAdminApp.openPaymentDetail(paymentId), 50);
    } else if (path === '/admin/certificates') {
      await renderCertificatesView();
    } else if (path.startsWith('/admin/certificates/')) {
      const certId = path.split('/admin/certificates/')[1];
      await renderCertificatesView();
      if (certId) setTimeout(() => NexvionAdminApp.openCertificateDetail(certId), 50);
    } else if (path === '/admin/support') {
      await renderSupportView();
    } else if (path === '/admin/analytics') {
      await renderAnalyticsView();
    } else if (path === '/admin/admins') {
      await renderAdminsView();
    } else if (path.startsWith('/admin/admins/')) {
      const adminId = path.split('/admin/admins/')[1];
      await renderAdminsView();
      if (adminId) setTimeout(() => NexvionAdminApp.openAdminUserDetail(adminId), 50);
    } else if (path === '/admin/roles') {
      await renderRolesView();
    } else if (path.startsWith('/admin/roles/')) {
      const roleId = path.split('/admin/roles/')[1];
      await renderRolesView(roleId);
    } else if (path === '/admin/audit-logs') {
      await renderAuditLogsView();
    } else if (path.startsWith('/admin/audit-logs/')) {
      const logId = path.split('/admin/audit-logs/')[1];
      await renderAuditLogsView();
      if (logId) setTimeout(() => NexvionAdminApp.openAuditLogDetail(logId), 50);
    } else if (path === '/admin/settings') {
      await renderSettingsView();
    } else if (path === '/admin/login') {
      await renderLoginView();
    } else {
      DOM.content.innerHTML = renderEmptyState('Page Not Found', `Route "${path}" is not recognized.`, 'Go to Dashboard', 'NexvionAdminApp.navigateTo("/admin/overview")');
    }
  }

  // --------------------------------------------------------------------------
  // 7. PUBLIC CONTROLLER ACTIONS & MODALS
  // --------------------------------------------------------------------------
  window.NexvionAdminApp = {
    navigateTo,
    closeModal,
    closeDrawer,
    showToast,

    switchRole: (roleName) => {
      AppState.activeRole = roleName;
      Data.setCurrentRole(roleName);
      if (DOM.roleSelect) DOM.roleSelect.value = roleName;
      const userRoleEl = document.querySelector('.adm-user-role');
      if (userRoleEl) userRoleEl.textContent = roleName;
      updateSidebarActiveState(AppState.currentRoute);
      showToast('Active Role Updated', `Role context set to ${roleName}`, 'info');
      renderRoute(AppState.currentRoute);
    },

    submitSimulatedLogin: () => {
      const email = document.getElementById('loginEmail')?.value;
      const role = document.getElementById('loginRole')?.value || 'Super Admin';
      AppState.activeRole = role;
      Data.setCurrentRole(role);
      if (DOM.roleSelect) DOM.roleSelect.value = role;
      showToast('Authenticated', `Signed in as ${email} (${role}). Production authentication will connect to Firebase Auth.`, 'success');
      navigateTo('/admin/overview');
    },

    // --- Course Modals & Actions ---
    openCreateCourseModal: () => {
      const bodyHtml = `
        <form id="createCourseForm">
          <div class="adm-form-group">
            <label class="adm-form-label">Course Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newCourseTitle" required placeholder="e.g. AI Agent Orchestration">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Tier Assignment <span class="adm-req-star">*</span></label>
            <select class="adm-select" id="newCourseTier" style="width:100%;">
              <option value="ai-foundations">AI Foundations (Free)</option>
              <option value="ai-builder">AI Builder (Paid - Price Coming Soon)</option>
              <option value="ai-creator">AI Creator (Paid - Price Coming Soon)</option>
              <option value="ai-architect">AI Architect (Premium - Price Coming Soon)</option>
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Short Description</label>
            <textarea class="adm-textarea" id="newCourseShortDesc" placeholder="Brief summary for catalog card..."></textarea>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateCourse()">Create Course</button>
      `;
      openModal('Create New Course', bodyHtml, footerHtml);
    },

    submitCreateCourse: async () => {
      const title = document.getElementById('newCourseTitle')?.value;
      const tierId = document.getElementById('newCourseTier')?.value;
      const shortDesc = document.getElementById('newCourseShortDesc')?.value;
      if (!title) {
        alert('Please provide a course title.');
        return;
      }

      const tierMap = {
        'ai-foundations': { name: 'AI Foundations', price: 'FREE' },
        'ai-builder': { name: 'AI Builder', price: 'PRICE COMING SOON' },
        'ai-creator': { name: 'AI Creator', price: 'PRICE COMING SOON' },
        'ai-architect': { name: 'AI Architect', price: 'PRICE COMING SOON' }
      };

      await Data.saveCourse({
        title,
        tierId,
        tierName: tierMap[tierId].name,
        priceDisplay: tierMap[tierId].price,
        shortDescription: shortDesc || 'New course curriculum.',
        fullDescription: shortDesc || 'Full curriculum syllabus.',
        status: 'Published',
        modulesCount: 0,
        classesCount: 0,
        totalEnrolled: 0,
        instructor: 'NEXVION Faculty',
        learningOutcomes: ['Core competency mastery'],
        certificateRequirements: { minAttendancePercent: 80, requiredProjects: 1, requiredAssignments: 2, passingGradePercent: 75 }
      });

      closeModal();
      showToast('Course Created', `Successfully initialized "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },

    openEditCourseModal: async (courseId) => {
      const course = await Data.getCourseById(courseId);
      if (!course) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Course Title</label>
          <input type="text" class="adm-input" id="editCourseTitle" value="${course.title}">
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Course Status</label>
          <select class="adm-select" id="editCourseStatus" style="width:100%;">
            <option ${course.status === 'Published' ? 'selected' : ''}>Published</option>
            <option ${course.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option ${course.status === 'Archived' ? 'selected' : ''}>Archived</option>
            <option ${course.status === 'Coming Soon' ? 'selected' : ''}>Coming Soon</option>
          </select>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Short Description</label>
          <textarea class="adm-textarea" id="editCourseShortDesc">${course.shortDescription}</textarea>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditCourse('${course.id}')">Save Changes</button>
      `;
      openModal(`Edit: ${course.title}`, bodyHtml, footerHtml);
    },

    submitEditCourse: async (courseId) => {
      const title = document.getElementById('editCourseTitle')?.value;
      const status = document.getElementById('editCourseStatus')?.value;
      const shortDesc = document.getElementById('editCourseShortDesc')?.value;
      await Data.saveCourse({ id: courseId, title, status, shortDescription: shortDesc });
      closeModal();
      showToast('Course Updated', 'Course details updated successfully.', 'success');
      renderRoute(AppState.currentRoute);
    },

    duplicateCourse: async (courseId) => {
      const course = await Data.getCourseById(courseId);
      if (course) {
        await Data.saveCourse({
          ...course,
          id: `course-${Date.now()}`,
          title: `${course.title} (Copy)`,
          status: 'Draft'
        });
        showToast('Course Duplicated', `Created draft clone of "${course.title}".`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },

    archiveCourse: async (courseId) => {
      if (confirm('Are you sure you want to archive this course?')) {
        await Data.saveCourse({ id: courseId, status: 'Archived' });
        showToast('Course Archived', 'The course has been set to Archived state.', 'info');
        renderRoute(AppState.currentRoute);
      }
    },

    // --- Batch Actions (Strict 30 Cap) ---
    openCreateBatchModal: () => {
      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Batch / Cohort Name <span class="adm-req-star">*</span></label>
          <input type="text" class="adm-input" id="newBatchName" required placeholder="e.g. Builder Cohort Gamma">
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Course Curriculum</label>
          <select class="adm-select" id="newBatchCourse" style="width:100%;">
            <option value="ai-foundations">AI Foundations</option>
            <option value="ai-builder">AI Builder</option>
            <option value="ai-creator">AI Creator</option>
            <option value="ai-architect">AI Architect</option>
          </select>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Maximum Capacity (Platform Invariant)</label>
          <input type="number" class="adm-input" value="30" disabled style="opacity:0.8; cursor:not-allowed;">
          <span class="adm-form-help">Every batch is fixed at strictly 30 seats.</span>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Lead Instructor</label>
          <input type="text" class="adm-input" id="newBatchInstructor" placeholder="e.g. Marcus Chen">
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateBatch()">Create Cohort</button>
      `;
      openModal('Create New Cohort Batch (Cap 30)', bodyHtml, footerHtml);
    },

    submitCreateBatch: async () => {
      const name = document.getElementById('newBatchName')?.value;
      const courseId = document.getElementById('newBatchCourse')?.value;
      const instructor = document.getElementById('newBatchInstructor')?.value || 'Faculty Lead';
      if (!name) {
        alert('Please enter a batch name.');
        return;
      }

      await Data.saveBatch({
        name,
        courseId,
        courseTitle: courseId.toUpperCase(),
        tierName: courseId.toUpperCase(),
        capacity: 30, // ALWAYS 30
        enrolledCount: 0,
        waitlistCount: 0,
        status: 'OPEN',
        instructor,
        schedule: 'Tue & Thu • 18:00 UTC'
      });

      closeModal();
      showToast('Cohort Created', `Batch "${name}" initialized with 30-seat cap.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    openBatchDetailDrawer: async (batchId) => {
      const batch = await Data.getBatchById(batchId);
      if (!batch) return;
      const students = (await Data.getStudents()).filter(s => s.batchId === batchId);

      const bodyHtml = `
        <div style="margin-bottom:16px;">
          <h4 style="margin:0 0 4px; color:var(--adm-text-primary);">${batch.name}</h4>
          <span style="font-size:0.75rem; color:var(--adm-tertiary);">${batch.courseTitle}</span>
        </div>

        ${batch.enrolledCount >= 30 ? `
          <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); padding:10px 14px; border-radius:6px; margin-bottom:14px; font-size:0.78rem; color:#B91C1C;">
            <strong>Capacity Limit Reached (30 / 30):</strong> Additional direct enrollments are prevented. New applicants are placed in the waitlist queue.
          </div>
        ` : ''}

        <div class="adm-capacity-bar-wrap" style="width:100%; margin-bottom:20px;">
          <div class="adm-capacity-text">
            <span><strong>${batch.enrolledCount} / 30</strong> seats filled</span>
            <span>${30 - batch.enrolledCount > 0 ? `${30 - batch.enrolledCount} seats open` : 'CAPACITY REACHED'}</span>
          </div>
          <div class="adm-capacity-track">
            <div class="adm-capacity-fill ${batch.enrolledCount >= 30 ? 'full' : 'open'}" style="width:${Math.round((batch.enrolledCount / 30) * 100)}%;"></div>
          </div>
        </div>

        <h5 style="margin:0 0 10px; font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); text-transform:uppercase;">Enrolled Roster (${students.length} / 30)</h5>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${students.length ? students.map(s => `
            <div style="background:var(--adm-surface-elevated); padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:0.8rem; color:var(--adm-text-primary);">${s.name}</strong>
                <div style="font-size:0.68rem; color:var(--adm-text-secondary);">${s.email}</div>
              </div>
              <span class="adm-badge adm-badge-published">${s.enrollmentStatus}</span>
            </div>
          `).join('') : '<p style="font-size:0.8rem; color:var(--adm-text-muted);">No students assigned to this cohort yet.</p>'}
        </div>

        <div style="margin-top:20px; border-top:1px solid var(--adm-border); padding-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h5 style="margin:0; font-size:0.75rem; font-family:var(--adm-font-mono); color:var(--adm-text-muted); text-transform:uppercase;">Waitlist Queue (${batch.waitlistCount} Waiting)</h5>
          </div>
          ${batch.waitlistCount > 0 ? `
            <div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.2); border-radius:6px; padding:12px; font-size:0.78rem;">
              <p style="margin:0 0 8px; color:var(--adm-text-secondary);">${batch.waitlistCount} applicant(s) queued. Strict cohort cap of 30 is enforced.</p>
              ${batch.enrolledCount < 30 ? `
                <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.admitNextWaitlistApplicant('${batch.id}')">Admit Next in Queue (${30 - batch.enrolledCount} open)</button>
              ` : `
                <button class="adm-btn adm-btn-sm adm-btn-secondary" disabled style="opacity:0.6; cursor:not-allowed;">Cohort Full (30/30) — Cannot Admit</button>
              `}
            </div>
          ` : `
            <p style="font-size:0.78rem; color:var(--adm-text-muted); margin:0;">Waitlist is currently empty.</p>
          `}
        </div>
      `;
      openDrawer(`Cohort Roster: ${batch.name}`, bodyHtml);
    },

    admitNextWaitlistApplicant: async (batchId) => {
      const batch = await Data.getBatchById(batchId);
      if (!batch) return;
      if (batch.enrolledCount >= 30) {
        showToast('Capacity Locked', 'Cohort has already reached maximum capacity of 30 students.', 'error');
        return;
      }
      if (batch.waitlistCount <= 0) {
        showToast('Queue Empty', 'No waitlist applicants remaining.', 'info');
        return;
      }
      batch.enrolledCount += 1;
      batch.waitlistCount -= 1;
      if (batch.enrolledCount >= 30) batch.status = 'FULL';
      await Data.saveBatch(batch);
      showToast('Student Admitted', `Applicant admitted into ${batch.name}. (${batch.enrolledCount}/30)`, 'success');
      closeDrawer();
      renderRoute(AppState.currentRoute);
    },

    markBatchFull: async (batchId) => {
      const batch = await Data.getBatchById(batchId);
      if (batch) {
        batch.status = 'FULL';
        await Data.saveBatch(batch);
        showToast('Batch Marked Full', `${batch.name} marked as FULL. New applicants will overflow to waitlist.`, 'info');
        renderRoute(AppState.currentRoute);
      }
    },

    moveWaitlistToEnrolled: async (batchId, studentId) => {
      try {
        await Data.moveWaitlistStudentToEnrolled(batchId, studentId);
        showToast('Student Admitted', 'Student moved from waitlist into enrolled cohort slot.', 'success');
        renderRoute(AppState.currentRoute);
      } catch (err) {
        alert(err.message);
      }
    },

    // --- Phase 2: Student Directory Handlers ---
    onStudentSearch: (val) => {
      AppState.studentDirectory.searchTerm = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentTierFilter: (val) => {
      AppState.studentDirectory.tierFilter = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentBatchFilter: (val) => {
      AppState.studentDirectory.batchFilter = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentStatusFilter: (val) => {
      AppState.studentDirectory.statusFilter = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentPaymentFilter: (val) => {
      AppState.studentDirectory.paymentFilter = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentCertFilter: (val) => {
      AppState.studentDirectory.certFilter = val;
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    onStudentSort: (val) => {
      AppState.studentDirectory.sortBy = val;
      renderRoute(AppState.currentRoute);
    },
    onStudentPageChange: (page) => {
      AppState.studentDirectory.currentPage = page;
      renderRoute(AppState.currentRoute);
    },
    onStudentPageSize: (size) => {
      AppState.studentDirectory.pageSize = Number(size);
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    resetStudentFilters: () => {
      AppState.studentDirectory.searchTerm = '';
      AppState.studentDirectory.tierFilter = 'ALL';
      AppState.studentDirectory.batchFilter = 'ALL';
      AppState.studentDirectory.statusFilter = 'ALL';
      AppState.studentDirectory.paymentFilter = 'ALL';
      AppState.studentDirectory.certFilter = 'ALL';
      AppState.studentDirectory.sortBy = 'name-asc';
      AppState.studentDirectory.currentPage = 1;
      renderRoute(AppState.currentRoute);
    },
    navigateBackToStudents: () => {
      navigateTo('/admin/students');
    },
    exportStudentList: async () => {
      const students = await Data.getStudents();
      const headers = ['ID', 'Name', 'Email', 'Enrolled Course', 'Tier', 'Batch', 'Enrollment Status', 'Progress %', 'Payment Status', 'Certificate Status', 'Last Active'];
      const csvRows = [headers.join(',')];
      students.forEach(s => {
        const row = [
          `"${s.id}"`,
          `"${(s.name || '').replace(/"/g, '""')}"`,
          `"${(s.email || '').replace(/"/g, '""')}"`,
          `"${(s.enrolledCourseTitle || '').replace(/"/g, '""')}"`,
          `"${(s.tierName || s.tierId || '').replace(/"/g, '""')}"`,
          `"${(s.batchName || '').replace(/"/g, '""')}"`,
          `"${s.enrollmentStatus || ''}"`,
          s.progressPercent || 0,
          `"${s.paymentStatus || ''}"`,
          `"${s.certificateStatus || ''}"`,
          `"${s.lastActive || ''}"`
        ];
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-students-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Export Generated', `Exported ${students.length} student records to CSV.`, 'success');
    },
    openAddStudentModal: async () => {
      const tiers = await Data.getTiers();
      const batches = await Data.getBatches();
      const bodyHtml = `
        <form id="addStudentForm">
          <div class="adm-form-group">
            <label class="adm-form-label">Full Legal Name <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newStudentName" required placeholder="e.g. Maya Lin">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Email Address <span class="adm-req-star">*</span></label>
            <input type="email" class="adm-input" id="newStudentEmail" required placeholder="e.g. maya@example.com">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Curriculum Tier <span class="adm-req-star">*</span></label>
            <select class="adm-select" id="newStudentTier" style="width:100%;">
              ${tiers.map(t => `<option value="${t.id}">${t.name} (${t.priceDisplay || t.price || 'Free'})</option>`).join('')}
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Assign Cohort Batch (Cap 30)</label>
            <select class="adm-select" id="newStudentBatch" style="width:100%;">
              <option value="">Unassigned</option>
              ${batches.map(b => `
                <option value="${b.id}" ${b.enrolledCount >= 30 ? 'disabled' : ''}>
                  ${b.name} (${b.enrolledCount}/30 seats) ${b.enrolledCount >= 30 ? '— FULL' : ''}
                </option>
              `).join('')}
            </select>
            <span class="adm-form-help">Batches at 30/30 cannot accept new direct enrollments.</span>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Initial Enrollment Status</label>
            <select class="adm-select" id="newStudentStatus" style="width:100%;">
              <option value="Enrolled">Enrolled</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Waitlisted">Waitlisted</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitAddStudent()">Save Student</button>
      `;
      openModal('Register New Student Record', bodyHtml, footerHtml);
    },
    submitAddStudent: async () => {
      const name = document.getElementById('newStudentName')?.value.trim();
      const email = document.getElementById('newStudentEmail')?.value.trim();
      const tierId = document.getElementById('newStudentTier')?.value;
      const batchId = document.getElementById('newStudentBatch')?.value;
      const status = document.getElementById('newStudentStatus')?.value;
      if (!name || !email) {
        alert('Please provide student name and email.');
        return;
      }
      const tiers = await Data.getTiers();
      const selectedTier = tiers.find(t => t.id === tierId);
      const batches = await Data.getBatches();
      const selectedBatch = batchId ? batches.find(b => b.id === batchId) : null;

      if (selectedBatch && selectedBatch.enrolledCount >= 30 && status === 'Enrolled') {
        alert(`Cohort "${selectedBatch.name}" is already at full capacity (30/30). Please select another batch or set status to Waitlisted.`);
        return;
      }

      await Data.saveStudent({
        name,
        email,
        tierId: tierId || 'ai-foundations',
        tierName: selectedTier ? selectedTier.name : 'AI Foundations',
        batchId: selectedBatch ? selectedBatch.id : null,
        batchName: selectedBatch ? selectedBatch.name : 'Unassigned',
        enrolledCourseTitle: selectedTier ? selectedTier.name : 'AI Foundations',
        enrollmentStatus: status || 'Enrolled',
        studentStatus: 'Active',
        progressPercent: 0,
        attendancePercent: 100,
        paymentStatus: selectedTier && selectedTier.id === 'ai-foundations' ? 'Not required' : 'Pending',
        certificateStatus: 'Not eligible'
      });

      closeModal();
      showToast('Student Created', `Successfully enrolled ${name}.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    // --- Phase 2: Student Detail Tabs & Updates ---
    switchStudentTab: (tabId) => {
      AppState.activeStudentTab = tabId;
      document.querySelectorAll('.adm-tab-btn').forEach(btn => {
        const matches = btn.getAttribute('onclick')?.includes(`'${tabId}'`);
        if (matches) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });
      renderRoute(AppState.currentRoute);
    },
    markDirty: () => {
      AppState.hasUnsavedChanges = true;
      let banner = document.getElementById('admDirtyBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'admDirtyBanner';
        banner.className = 'adm-dirty-banner';
        banner.innerHTML = `
          <div class="adm-dirty-text">
            <span>⚠️ You have unsaved profile modifications.</span>
          </div>
          <button class="adm-btn adm-btn-sm adm-btn-primary" onclick="NexvionAdminApp.saveStudentProfileChanges('${AppState.activeStudentId}')">Save Profile Changes</button>
        `;
        const tabsHeader = document.querySelector('.adm-tabs-header');
        if (tabsHeader && tabsHeader.parentElement) {
          tabsHeader.parentElement.insertBefore(banner, tabsHeader);
        }
      }
    },
    saveStudentProfileChanges: async (studentId) => {
      const student = await Data.getStudentById(studentId);
      if (!student) return;

      const name = document.getElementById('profName')?.value || student.name;
      const email = document.getElementById('profEmail')?.value || student.email;
      const phone = document.getElementById('profPhone')?.value || student.phone;
      const country = document.getElementById('profCountry')?.value || student.country;
      const timezone = document.getElementById('profTimezone')?.value || student.timezone;
      const experienceLevel = document.getElementById('profExperience')?.value || student.experienceLevel;
      const githubHandle = document.getElementById('profGithub')?.value || student.githubHandle;
      const linkedinHandle = document.getElementById('profLinkedin')?.value || student.linkedinHandle;
      const bio = document.getElementById('profBio')?.value || student.bio;

      await Data.saveStudent({
        id: studentId,
        name,
        email,
        phone,
        country,
        timezone,
        experienceLevel,
        githubHandle,
        linkedinHandle,
        bio
      });

      AppState.hasUnsavedChanges = false;
      const banner = document.getElementById('admDirtyBanner');
      if (banner) banner.remove();

      showToast('Profile Saved', `Updated profile credentials for ${name}.`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openStudentStatusModal: async (studentId) => {
      const student = await Data.getStudentById(studentId);
      if (!student) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Student Account Status</label>
          <select class="adm-select" id="editStudentStatus" style="width:100%;">
            <option value="Active" ${student.studentStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${student.studentStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
            <option value="Graduated" ${student.studentStatus === 'Graduated' ? 'selected' : ''}>Graduated</option>
            <option value="Suspended" ${student.studentStatus === 'Suspended' ? 'selected' : ''}>Suspended</option>
          </select>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Enrollment Pipeline Status</label>
          <select class="adm-select" id="editStudentEnrollmentStatus" style="width:100%;">
            <option value="Enrolled" ${student.enrollmentStatus === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
            <option value="Approved" ${student.enrollmentStatus === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Pending" ${student.enrollmentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Waitlisted" ${student.enrollmentStatus === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
            <option value="Rejected" ${student.enrollmentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Cancelled" ${student.enrollmentStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            <option value="Completed" ${student.enrollmentStatus === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitStudentStatus('${student.id}')">Update Status</button>
      `;
      openModal(`Update Status: ${student.name}`, bodyHtml, footerHtml);
    },
    submitStudentStatus: async (studentId) => {
      const studentStatus = document.getElementById('editStudentStatus')?.value;
      const enrollmentStatus = document.getElementById('editStudentEnrollmentStatus')?.value;
      await Data.saveStudent({
        id: studentId,
        studentStatus,
        enrollmentStatus
      });
      closeModal();
      showToast('Status Updated', `Student status updated to ${studentStatus} (${enrollmentStatus}).`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openAddNoteModal: async (studentId) => {
      const student = await Data.getStudentById(studentId);
      if (!student) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Internal Staff Note <span class="adm-req-star">*</span></label>
          <textarea class="adm-textarea" id="newNoteText" placeholder="Enter confidential administrative observation or milestone note..." style="min-height:90px;"></textarea>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Priority</label>
          <select class="adm-select" id="newNotePriority" style="width:100%;">
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
            <option value="Low">Low</option>
          </select>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitAddNote('${studentId}')">Attach Note</button>
      `;
      openModal(`Staff Note: ${student.name}`, bodyHtml, footerHtml);
    },
    submitAddNote: async (studentId) => {
      const text = document.getElementById('newNoteText')?.value.trim();
      const priority = document.getElementById('newNotePriority')?.value || 'Normal';
      if (!text) {
        alert('Please enter note text.');
        return;
      }
      const role = Data.getCurrentRole() || 'Admin Operations';
      await Data.addStudentNote(studentId, text, role, priority);
      closeModal();
      showToast('Note Recorded', 'Internal staff note added to student profile.', 'success');
      renderRoute(AppState.currentRoute);
    },
    openTransferBatchModal: async (studentId) => {
      const student = await Data.getStudentById(studentId);
      if (!student) return;
      const batches = await Data.getBatches();

      const bodyHtml = `
        <p style="font-size:0.82rem; color:var(--adm-text-secondary); margin-bottom:14px;">
          Select target cohort batch for <strong>${student.name}</strong>. Batches enforce a hard limit of 30 students.
        </p>
        <div class="adm-form-group">
          <label class="adm-form-label">Destination Cohort</label>
          <select class="adm-select" id="transferBatchSelect" style="width:100%;">
            ${batches.map(b => {
              const isCurrent = b.id === student.batchId;
              const isFull = b.enrolledCount >= 30;
              return `
                <option value="${b.id}" ${isCurrent ? 'selected' : ''} ${isFull && !isCurrent ? 'disabled' : ''}>
                  ${b.name} (${b.enrolledCount}/30 seats) ${isFull ? '— FULL (CAP 30)' : ''} ${isCurrent ? '— (Current)' : ''}
                </option>
              `;
            }).join('')}
          </select>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitTransferBatch('${studentId}')">Transfer Seat</button>
      `;
      openModal(`Transfer Cohort: ${student.name}`, bodyHtml, footerHtml);
    },
    submitTransferBatch: async (studentId) => {
      const targetBatchId = document.getElementById('transferBatchSelect')?.value;
      const batches = await Data.getBatches();
      const targetBatch = batches.find(b => b.id === targetBatchId);
      const student = await Data.getStudentById(studentId);

      if (!targetBatch) return;
      if (targetBatch.id !== student.batchId && targetBatch.enrolledCount >= 30) {
        alert(`Cannot transfer: "${targetBatch.name}" is already at full capacity (30/30).`);
        return;
      }

      await Data.saveStudent({
        id: studentId,
        batchId: targetBatch.id,
        batchName: targetBatch.name
      });

      closeModal();
      showToast('Cohort Reassigned', `Transferred ${student.name} to ${targetBatch.name}.`, 'success');
      renderRoute(AppState.currentRoute);
    },
    issueStudentCertificate: async (studentId) => {
      const student = await Data.getStudentById(studentId);
      if (!student) return;

      const certs = await Data.getStudentCertificates(studentId);
      if (certs.length > 0) {
        showToast('Certificate Exists', `Certificate already issued: ${certs[0].verificationId}`, 'info');
        return;
      }

      await Data.saveStudent({
        id: studentId,
        certificateStatus: 'Issued'
      });
      showToast('Certificate Issued', `Credential successfully issued to ${student.name}.`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openAssignBatchForStudentModal: async (studentId) => {
      NexvionAdminApp.openTransferBatchModal(studentId);
    },
    viewPaymentReceiptModal: async (paymentId) => {
      const payments = await Data.getPayments();
      const p = payments.find(pay => pay.id === paymentId);
      if (!p) return;

      const bodyHtml = `
        <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:20px; font-family:var(--adm-font-mono); font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--adm-border); padding-bottom:8px; margin-bottom:12px;">
            <strong>RECEIPT / INVOICE</strong>
            <span>${p.invoiceId}</span>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
            <div><span style="color:var(--adm-text-muted);">Learner:</span><br><strong>${p.studentName}</strong></div>
            <div><span style="color:var(--adm-text-muted);">Date:</span><br>${p.date}</div>
            <div><span style="color:var(--adm-text-muted);">Curriculum Tier:</span><br>${p.tierName}</div>
            <div><span style="color:var(--adm-text-muted);">Payment Method:</span><br>${p.method}</div>
            <div><span style="color:var(--adm-text-muted);">Transaction Ref:</span><br>${p.transactionRef}</div>
            <div><span style="color:var(--adm-text-muted);">Status:</span><br><span class="adm-badge adm-badge-paid">${p.status}</span></div>
          </div>
          <div style="border-top:1px solid var(--adm-border); padding-top:10px; display:flex; justify-content:space-between; font-size:1rem; font-weight:700;">
            <span>TOTAL:</span>
            <span style="color:var(--adm-primary);">${p.amountDisplay}</span>
          </div>
        </div>
      `;
      openModal(`Receipt: ${p.invoiceId}`, bodyHtml);
    },

    // --- Phase 2: Enrollment Workflow Handlers (7 Operational States) ---
    onEnrollmentSearch: (val) => {
      AppState.enrollmentsView.searchTerm = val;
      renderRoute(AppState.currentRoute);
    },
    onEnrollmentStatusFilter: (val) => {
      AppState.enrollmentsView.statusFilter = val;
      renderRoute(AppState.currentRoute);
    },
    onEnrollmentCourseFilter: (val) => {
      AppState.enrollmentsView.courseFilter = val;
      renderRoute(AppState.currentRoute);
    },
    resetEnrollmentFilters: () => {
      AppState.enrollmentsView.searchTerm = '';
      AppState.enrollmentsView.statusFilter = 'ALL';
      AppState.enrollmentsView.courseFilter = 'ALL';
      renderRoute(AppState.currentRoute);
    },
    exportEnrollmentList: async () => {
      const enrollments = await Data.getEnrollments();
      const headers = ['Application ID', 'Student ID', 'Applicant Name', 'Email', 'Course', 'Tier', 'Cohort Batch', 'Status', 'Submitted At', 'Decided At', 'Notes'];
      const csvRows = [headers.join(',')];
      enrollments.forEach(e => {
        const row = [
          `"${e.id}"`,
          `"${e.studentId}"`,
          `"${(e.studentName || '').replace(/"/g, '""')}"`,
          `"${(e.email || '').replace(/"/g, '""')}"`,
          `"${(e.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(e.tierName || '').replace(/"/g, '""')}"`,
          `"${(e.batchName || '').replace(/"/g, '""')}"`,
          `"${e.status || ''}"`,
          `"${e.submittedAt || ''}"`,
          `"${e.decidedAt || ''}"`,
          `"${(e.notes || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-enrollments-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Enrollments Exported', `Exported ${enrollments.length} enrollment applications to CSV.`, 'success');
    },
    approveEnrollment: (id) => NexvionAdminApp.workflowApproveEnrollment(id),
    rejectEnrollment: (id) => NexvionAdminApp.workflowRejectEnrollment(id),
    workflowApproveEnrollment: async (id) => {
      const enr = await Data.getEnrollmentById(id);
      if (!enr) return;
      const batches = await Data.getBatches();

      const bodyHtml = `
        <p style="font-size:0.82rem; color:var(--adm-text-secondary); margin-bottom:14px;">
          Approve enrollment application for <strong>${enr.studentName}</strong> (${enr.courseTitle}).
          Select a cohort batch with available capacity (strict 30 maximum).
        </p>
        <div class="adm-form-group">
          <label class="adm-form-label">Assign Cohort Batch</label>
          <select class="adm-select" id="approveBatchSelect" style="width:100%;">
            ${batches.map(b => `
              <option value="${b.id}" ${b.id === enr.batchId ? 'selected' : ''} ${b.enrolledCount >= 30 ? 'disabled' : ''}>
                ${b.name} (${b.enrolledCount}/30 seats) ${b.enrolledCount >= 30 ? '— FULL' : ''}
              </option>
            `).join('')}
          </select>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitWorkflowApprove('${id}')">Approve & Admit Seat</button>
      `;
      openModal(`Approve Application: ${enr.studentName}`, bodyHtml, footerHtml);
    },
    submitWorkflowApprove: async (id) => {
      const batchId = document.getElementById('approveBatchSelect')?.value;
      try {
        await Data.approveEnrollment(id, batchId);
        closeModal();
        showToast('Application Approved', 'Seat confirmed and batch assigned.', 'success');
        renderRoute(AppState.currentRoute);
      } catch (err) {
        alert(err.message);
      }
    },
    workflowRejectEnrollment: async (id) => {
      const enr = await Data.getEnrollmentById(id);
      if (!enr) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Reason for Rejection <span class="adm-req-star">*</span></label>
          <select class="adm-select" id="rejectReasonPreset" style="width:100%; margin-bottom:10px;" onchange="if(this.value) document.getElementById('rejectReasonText').value = this.value;">
            <option value="">Select typical reason...</option>
            <option value="Pre-requisite technical experience not met">Pre-requisite technical experience not met</option>
            <option value="Cohort full and waitlist capacity exceeded">Cohort full and waitlist capacity exceeded</option>
            <option value="Incomplete background statement">Incomplete background statement</option>
            <option value="Application duplicate">Application duplicate</option>
          </select>
          <textarea class="adm-textarea" id="rejectReasonText" placeholder="Specify internal reason for declining this enrollment application..."></textarea>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-danger" onclick="NexvionAdminApp.submitWorkflowReject('${id}')">Confirm Rejection</button>
      `;
      openModal(`Reject Application: ${enr.studentName}`, bodyHtml, footerHtml);
    },
    submitWorkflowReject: async (id) => {
      const reason = document.getElementById('rejectReasonText')?.value.trim();
      if (!reason) {
        alert('Please provide a reason for rejection.');
        return;
      }
      await Data.rejectEnrollment(id, reason);
      closeModal();
      showToast('Application Rejected', 'Enrollment marked as Rejected with decision notes.', 'info');
      renderRoute(AppState.currentRoute);
    },
    workflowAssignBatchModal: async (id) => {
      const enr = await Data.getEnrollmentById(id);
      if (!enr) return;
      const batches = await Data.getBatches();

      const bodyHtml = `
        <p style="font-size:0.82rem; color:var(--adm-text-secondary); margin-bottom:14px;">
          Assign cohort batch for <strong>${enr.studentName}</strong>. Maximum capacity is strictly 30 students per cohort.
        </p>
        <div class="adm-form-group">
          <label class="adm-form-label">Destination Batch</label>
          <select class="adm-select" id="assignBatchSelect" style="width:100%;">
            ${batches.map(b => `
              <option value="${b.id}" ${b.id === enr.batchId ? 'selected' : ''} ${b.enrolledCount >= 30 ? 'disabled' : ''}>
                ${b.name} (${b.enrolledCount}/30 seats) ${b.enrolledCount >= 30 ? '— FULL (CAP 30)' : ''}
              </option>
            `).join('')}
          </select>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitWorkflowAssignBatch('${id}')">Assign Batch</button>
      `;
      openModal(`Assign Cohort: ${enr.studentName}`, bodyHtml, footerHtml);
    },
    submitWorkflowAssignBatch: async (id) => {
      const batchId = document.getElementById('assignBatchSelect')?.value;
      try {
        await Data.assignEnrollmentBatch(id, batchId);
        closeModal();
        showToast('Batch Assigned', 'Cohort assignment updated successfully.', 'success');
        renderRoute(AppState.currentRoute);
      } catch (err) {
        alert(err.message);
      }
    },
    workflowMoveToWaitlist: async (id) => {
      try {
        await Data.moveEnrollmentToWaitlist(id);
        showToast('Moved to Waitlist', 'Applicant placed in cohort waitlist queue.', 'info');
        renderRoute(AppState.currentRoute);
      } catch (err) {
        alert(err.message);
      }
    },
    workflowAdmitFromWaitlist: async (id) => {
      try {
        await Data.admitEnrollmentFromWaitlist(id);
        showToast('Admitted from Waitlist', 'Student admitted into active cohort seat.', 'success');
        renderRoute(AppState.currentRoute);
      } catch (err) {
        alert(err.message);
      }
    },
    openEnrollmentChangeStatusModal: async (id) => {
      const enr = await Data.getEnrollmentById(id);
      if (!enr) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Enrollment Status (All 7 States)</label>
          <select class="adm-select" id="changeEnrStatus" style="width:100%;">
            <option value="Pending" ${enr.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${enr.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Enrolled" ${enr.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
            <option value="Waitlisted" ${enr.status === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
            <option value="Rejected" ${enr.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Cancelled" ${enr.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            <option value="Completed" ${enr.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Status Change Note / Audit Context</label>
          <textarea class="adm-textarea" id="changeEnrReason" placeholder="Optional explanation for audit logging..."></textarea>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEnrollmentChangeStatus('${id}')">Update Status</button>
      `;
      openModal(`Change Enrollment Status: ${enr.id.toUpperCase()}`, bodyHtml, footerHtml);
    },
    submitEnrollmentChangeStatus: async (id) => {
      const newStatus = document.getElementById('changeEnrStatus')?.value;
      const reason = document.getElementById('changeEnrReason')?.value.trim();
      await Data.updateEnrollmentStatus(id, newStatus, reason);
      closeModal();
      showToast('Status Updated', `Enrollment record updated to ${newStatus}.`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openEnrollmentNoteModal: async (id) => {
      const enr = await Data.getEnrollmentById(id);
      if (!enr) return;

      const bodyHtml = `
        <div class="adm-form-group">
          <label class="adm-form-label">Internal Enrollment Note <span class="adm-req-star">*</span></label>
          <textarea class="adm-textarea" id="enrNoteText" placeholder="Enter administrative observations regarding this application..."></textarea>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEnrollmentNote('${id}')">Save Note</button>
      `;
      openModal(`Enrollment Note: ${enr.studentName}`, bodyHtml, footerHtml);
    },
    submitEnrollmentNote: async (id) => {
      const note = document.getElementById('enrNoteText')?.value.trim();
      if (!note) {
        alert('Please enter a note.');
        return;
      }
      await Data.addEnrollmentNote(id, note);
      closeModal();
      showToast('Note Saved', 'Administrative note saved to enrollment application.', 'success');
      renderRoute(AppState.currentRoute);
    },

    // ========================================================================
    // PHASE 3: MODULES CONTROLLER METHODS
    // ========================================================================
    onModuleSearch: (val) => {
      AppState.modulesView.searchTerm = val;
      AppState.modulesView.currentPage = 1;
      renderModulesView();
    },
    onModuleCourseFilter: (val) => {
      AppState.modulesView.courseFilter = val;
      AppState.modulesView.currentPage = 1;
      renderModulesView();
    },
    onModuleStatusFilter: (val) => {
      AppState.modulesView.statusFilter = val;
      AppState.modulesView.currentPage = 1;
      renderModulesView();
    },
    onModuleSort: (val) => {
      AppState.modulesView.sortBy = val;
      renderModulesView();
    },
    onModulePageChange: (page) => {
      AppState.modulesView.currentPage = page;
      renderModulesView();
    },
    onModulePageSize: (size) => {
      AppState.modulesView.pageSize = Number(size);
      AppState.modulesView.currentPage = 1;
      renderModulesView();
    },
    resetModuleFilters: () => {
      AppState.modulesView.searchTerm = '';
      AppState.modulesView.courseFilter = 'ALL';
      AppState.modulesView.statusFilter = 'ALL';
      AppState.modulesView.sortBy = 'order-asc';
      AppState.modulesView.currentPage = 1;
      renderModulesView();
    },
    exportModulesList: async () => {
      const modules = await Data.getModules();
      const headers = ['Module ID', 'Title', 'Course ID', 'Course Title', 'Order', 'Classes Count', 'Completion Requirement', 'Status', 'Description'];
      const rows = [headers.join(',')];
      modules.forEach(m => {
        const row = [
          `"${m.id}"`,
          `"${(m.title || '').replace(/"/g, '""')}"`,
          `"${(m.courseId || '').replace(/"/g, '""')}"`,
          `"${(m.courseTitle || '').replace(/"/g, '""')}"`,
          m.order || 1,
          m.classesCount || 0,
          `"${(m.completionRequirement || '').replace(/"/g, '""')}"`,
          `"${m.status || ''}"`,
          `"${(m.description || '').replace(/"/g, '""')}"`
        ];
        rows.push(row.join(','));
      });
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-modules-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Modules Exported', `Exported ${modules.length} modules to CSV.`, 'success');
    },
    openCreateModuleModal: async () => {
      const courses = await Data.getCourses();
      const bodyHtml = `
        <form id="createModuleForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Module Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newModTitle" required placeholder="e.g. Module 03: Autonomous Systems Architecture">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Parent Course Curriculum <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newModCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Curriculum Sequence Order</label>
              <input type="number" class="adm-input" id="newModOrder" value="1" min="1" max="99">
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="newModRequirement" value="Complete all module classes & submit lab exercises" placeholder="e.g. Complete all classes and pass quiz">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Description & Syllabus Overview</label>
            <textarea class="adm-textarea" id="newModDesc" placeholder="Executive curriculum summary, prerequisites, and learning objectives..." style="min-height:75px;"></textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="newModStatus" style="width:100%;">
              <option value="Published" selected>Published</option>
              <option value="Draft">Draft</option>
              <option value="Locked">Locked</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateModule()">Create Module</button>
      `;
      openModal('Create New Curriculum Module', bodyHtml, footerHtml);
    },
    submitCreateModule: async () => {
      const title = document.getElementById('newModTitle')?.value.trim();
      const courseId = document.getElementById('newModCourse')?.value;
      const order = parseInt(document.getElementById('newModOrder')?.value || '1', 10);
      const completionRequirement = document.getElementById('newModRequirement')?.value.trim() || 'All classes completed';
      const description = document.getElementById('newModDesc')?.value.trim() || '';
      const status = document.getElementById('newModStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a module title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);

      await Data.saveModule({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        order,
        completionRequirement,
        description,
        status,
        classesCount: 0
      });

      closeModal();
      showToast('Module Created', `Successfully created module "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openEditModuleModal: async (id) => {
      const m = await Data.getModuleById(id);
      if (!m) return;
      const courses = await Data.getCourses();

      const bodyHtml = `
        <form id="editModuleForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Module Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="editModTitle" value="${m.title || ''}" required>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Parent Course Curriculum</label>
              <select class="adm-select" id="editModCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}" ${c.id === m.courseId ? 'selected' : ''}>${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Curriculum Sequence Order</label>
              <input type="number" class="adm-input" id="editModOrder" value="${m.order || 1}" min="1" max="99">
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="editModRequirement" value="${m.completionRequirement || ''}">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Description & Syllabus Overview</label>
            <textarea class="adm-textarea" id="editModDesc" style="min-height:75px;">${m.description || ''}</textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="editModStatus" style="width:100%;">
              <option value="Published" ${m.status === 'Published' ? 'selected' : ''}>Published</option>
              <option value="Draft" ${m.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Locked" ${m.status === 'Locked' ? 'selected' : ''}>Locked</option>
              <option value="Archived" ${m.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditModule('${id}')">Save Changes</button>
      `;
      openModal(`Edit Module: ${m.title}`, bodyHtml, footerHtml);
    },
    submitEditModule: async (id) => {
      const title = document.getElementById('editModTitle')?.value.trim();
      const courseId = document.getElementById('editModCourse')?.value;
      const order = parseInt(document.getElementById('editModOrder')?.value || '1', 10);
      const completionRequirement = document.getElementById('editModRequirement')?.value.trim() || '';
      const description = document.getElementById('editModDesc')?.value.trim() || '';
      const status = document.getElementById('editModStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a module title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);

      await Data.saveModule({
        id,
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        order,
        completionRequirement,
        description,
        status
      });

      closeModal();
      showToast('Module Updated', `Updated module "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    duplicateModule: async (id) => {
      const clone = await Data.duplicateModule(id);
      if (clone) {
        showToast('Module Duplicated', `Duplicated "${clone.title}" as Draft.`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },
    archiveModule: async (id) => {
      const m = await Data.getModuleById(id);
      if (!m) return;
      if (confirm(`Are you sure you want to archive module "${m.title}"?`)) {
        await Data.archiveModule(id);
        showToast('Module Archived', `Archived module "${m.title}".`, 'warning');
        renderRoute(AppState.currentRoute);
      }
    },
    previewModuleModal: async (id) => {
      const m = await Data.getModuleById(id);
      if (!m) return;
      const classes = (await Data.getClasses()).filter(c => c.moduleId === m.id || c.moduleTitle === m.title);

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--adm-border); padding-bottom:14px;">
            <div>
              <span style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); text-transform:uppercase; letter-spacing:0.05em;">Order Sequence #${m.order || 1} • ${m.courseTitle || 'Curriculum Course'}</span>
              <h3 style="margin:4px 0 0 0; color:var(--adm-text-primary); font-size:1.25rem;">${m.title}</h3>
            </div>
            <div>${AdminComponents.StatusBadge({ status: m.status || 'Published' })}</div>
          </div>
          <div>
            <h5 style="margin:0 0 6px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Curriculum Description</h5>
            <p style="margin:0; font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">${m.description || 'No description provided.'}</p>
          </div>
          <div style="background:var(--adm-surface-elevated); padding:12px; border-radius:8px; border:1px solid var(--adm-border);">
            <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); text-transform:uppercase; margin-bottom:4px;">Completion Requirement Standard</div>
            <div style="font-size:0.85rem; color:var(--adm-text-primary); font-weight:600;">${m.completionRequirement || 'Completion of all classes required.'}</div>
          </div>
          <div>
            <h5 style="margin:0 0 8px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Enclosed Classes & Labs (${classes.length})</h5>
            ${classes.length > 0 ? `
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${classes.map(c => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--adm-surface); padding:8px 12px; border-radius:6px; border:1px solid var(--adm-border);">
                    <div>
                      <strong style="font-size:0.82rem; color:var(--adm-text-primary);">${c.title}</strong>
                      <div style="font-size:0.7rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${c.duration || '60 min'} • ${c.instructor || 'Faculty Lead'}</div>
                    </div>
                    <span class="adm-badge adm-badge-published" style="font-size:0.65rem;">${c.status || 'Published'}</span>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="font-size:0.8rem; color:var(--adm-text-muted); margin:0;">No classes currently mapped to this module.</p>'}
          </div>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.openEditModuleModal('${m.id}')">Edit Module</button>
      `;
      openModal(`Module Overview: ${m.title}`, bodyHtml, footerHtml);
    },

    // ========================================================================
    // PHASE 3: CLASSES CONTROLLER METHODS
    // ========================================================================
    onClassSearch: (val) => {
      AppState.classesView.searchTerm = val;
      AppState.classesView.currentPage = 1;
      renderClassesView();
    },
    onClassCourseFilter: (val) => {
      AppState.classesView.courseFilter = val;
      AppState.classesView.currentPage = 1;
      renderClassesView();
    },
    onClassStatusFilter: (val) => {
      AppState.classesView.statusFilter = val;
      AppState.classesView.currentPage = 1;
      renderClassesView();
    },
    onClassSort: (val) => {
      AppState.classesView.sortBy = val;
      renderClassesView();
    },
    onClassPageChange: (page) => {
      AppState.classesView.currentPage = page;
      renderClassesView();
    },
    onClassPageSize: (size) => {
      AppState.classesView.pageSize = Number(size);
      AppState.classesView.currentPage = 1;
      renderClassesView();
    },
    resetClassFilters: () => {
      AppState.classesView.searchTerm = '';
      AppState.classesView.courseFilter = 'ALL';
      AppState.classesView.statusFilter = 'ALL';
      AppState.classesView.sortBy = 'order-asc';
      AppState.classesView.currentPage = 1;
      renderClassesView();
    },
    exportClassesList: async () => {
      const classes = await Data.getClasses();
      const headers = ['Class ID', 'Title', 'Course', 'Module', 'Instructor', 'Duration', 'Video Status', 'Visibility', 'Completion Requirement', 'Status'];
      const rows = [headers.join(',')];
      classes.forEach(c => {
        const row = [
          `"${c.id}"`,
          `"${(c.title || '').replace(/"/g, '""')}"`,
          `"${(c.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(c.moduleTitle || '').replace(/"/g, '""')}"`,
          `"${(c.instructor || '').replace(/"/g, '""')}"`,
          `"${c.duration || ''}"`,
          `"${c.videoStatus || ''}"`,
          `"${c.visibility || ''}"`,
          `"${(c.completionRequirement || '').replace(/"/g, '""')}"`,
          `"${c.status || ''}"`
        ];
        rows.push(row.join(','));
      });
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-classes-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Classes Exported', `Exported ${classes.length} classes to CSV.`, 'success');
    },
    openCreateClassModal: async () => {
      const courses = await Data.getCourses();
      const modules = await Data.getModules();
      const videos = await Data.getVideos();
      const resources = await Data.getResources();

      const bodyHtml = `
        <form id="createClassForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Class Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newClassTitle" required placeholder="e.g. Class 04: Realtime LLM Streaming Protocols">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newClassCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <select class="adm-select" id="newClassModule" style="width:100%;">
                ${modules.map(m => `<option value="${m.id}">${m.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Lead Faculty Instructor</label>
              <input type="text" class="adm-input" id="newClassInstructor" value="Dr. Evelyn Vance" placeholder="Instructor Name">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Estimated Duration</label>
              <input type="text" class="adm-input" id="newClassDuration" value="60 min" placeholder="e.g. 60 min, 90 min">
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Sequence Display Order</label>
              <input type="number" class="adm-input" id="newClassOrder" value="1" min="1">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Scope</label>
              <select class="adm-select" id="newClassVisibility" style="width:100%;">
                <option value="Published" selected>Published (Cohort Accessible)</option>
                <option value="Draft">Draft (Staff Only)</option>
                <option value="Locked">Locked (Sequential Unlock)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="newClassRequirement" value="Attend live cohort or stream >= 90% recorded playback" placeholder="e.g. Watch 90% or submit assignment">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Related Master Video Stream</label>
              <select class="adm-select" id="newClassVideo" style="width:100%;">
                <option value="">None / Pending Ingest</option>
                ${videos.map(v => `<option value="${v.id}">${v.title} (${v.duration || 'HLS'})</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Resource Material</label>
              <select class="adm-select" id="newClassResource" style="width:100%;">
                <option value="">None</option>
                ${resources.map(r => `<option value="${r.id}">${r.title} (${r.type})</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Class Syllabus & Description</label>
            <textarea class="adm-textarea" id="newClassDesc" placeholder="Pedagogical objectives, live coding agenda, and interactive breakout tasks..." style="min-height:70px;"></textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="newClassStatus" style="width:100%;">
              <option value="Published" selected>Published</option>
              <option value="Draft">Draft</option>
              <option value="Locked">Locked</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateClass()">Create Class</button>
      `;
      openModal('Schedule New Interactive Class', bodyHtml, footerHtml);
    },
    submitCreateClass: async () => {
      const title = document.getElementById('newClassTitle')?.value.trim();
      const courseId = document.getElementById('newClassCourse')?.value;
      const moduleId = document.getElementById('newClassModule')?.value;
      const instructor = document.getElementById('newClassInstructor')?.value.trim() || 'NEXVION Faculty';
      const duration = document.getElementById('newClassDuration')?.value.trim() || '60 min';
      const order = parseInt(document.getElementById('newClassOrder')?.value || '1', 10);
      const visibility = document.getElementById('newClassVisibility')?.value || 'Published';
      const completionRequirement = document.getElementById('newClassRequirement')?.value.trim() || 'Attend live or watch >= 90%';
      const videoId = document.getElementById('newClassVideo')?.value;
      const resourceId = document.getElementById('newClassResource')?.value;
      const description = document.getElementById('newClassDesc')?.value.trim() || '';
      const status = document.getElementById('newClassStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a class title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);
      const modules = await Data.getModules();
      const selectedMod = modules.find(m => m.id === moduleId);

      await Data.saveClass({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        moduleId,
        moduleTitle: selectedMod ? selectedMod.title : 'Curriculum Module',
        instructor,
        duration,
        order,
        visibility,
        completionRequirement,
        relatedVideoId: videoId,
        videoStatus: videoId ? 'Ready' : 'Pending',
        relatedResourceId: resourceId,
        description,
        status
      });

      closeModal();
      showToast('Class Created', `Successfully created class "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openEditClassModal: async (id) => {
      const c = await Data.getClassById(id);
      if (!c) return;
      const courses = await Data.getCourses();
      const modules = await Data.getModules();
      const videos = await Data.getVideos();
      const resources = await Data.getResources();

      const bodyHtml = `
        <form id="editClassForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Class Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="editClassTitle" value="${c.title || ''}" required>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum</label>
              <select class="adm-select" id="editClassCourse" style="width:100%;">
                ${courses.map(crs => `<option value="${crs.id}" ${crs.id === c.courseId ? 'selected' : ''}>${crs.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <select class="adm-select" id="editClassModule" style="width:100%;">
                ${modules.map(m => `<option value="${m.id}" ${m.id === c.moduleId ? 'selected' : ''}>${m.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Lead Faculty Instructor</label>
              <input type="text" class="adm-input" id="editClassInstructor" value="${c.instructor || ''}">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Estimated Duration</label>
              <input type="text" class="adm-input" id="editClassDuration" value="${c.duration || '60 min'}">
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Sequence Display Order</label>
              <input type="number" class="adm-input" id="editClassOrder" value="${c.order || 1}" min="1">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Scope</label>
              <select class="adm-select" id="editClassVisibility" style="width:100%;">
                <option value="Published" ${c.visibility === 'Published' ? 'selected' : ''}>Published</option>
                <option value="Draft" ${c.visibility === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Locked" ${c.visibility === 'Locked' ? 'selected' : ''}>Locked</option>
                <option value="Archived" ${c.visibility === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="editClassRequirement" value="${c.completionRequirement || ''}">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Related Master Video Stream</label>
              <select class="adm-select" id="editClassVideo" style="width:100%;">
                <option value="">None / Pending Ingest</option>
                ${videos.map(v => `<option value="${v.id}" ${v.id === c.relatedVideoId ? 'selected' : ''}>${v.title} (${v.duration || 'HLS'})</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Resource Material</label>
              <select class="adm-select" id="editClassResource" style="width:100%;">
                <option value="">None</option>
                ${resources.map(r => `<option value="${r.id}" ${r.id === c.relatedResourceId ? 'selected' : ''}>${r.title} (${r.type})</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Class Syllabus & Description</label>
            <textarea class="adm-textarea" id="editClassDesc" style="min-height:70px;">${c.description || ''}</textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="editClassStatus" style="width:100%;">
              <option value="Published" ${c.status === 'Published' ? 'selected' : ''}>Published</option>
              <option value="Draft" ${c.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Locked" ${c.status === 'Locked' ? 'selected' : ''}>Locked</option>
              <option value="Archived" ${c.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditClass('${id}')">Save Changes</button>
      `;
      openModal(`Edit Class: ${c.title}`, bodyHtml, footerHtml);
    },
    submitEditClass: async (id) => {
      const title = document.getElementById('editClassTitle')?.value.trim();
      const courseId = document.getElementById('editClassCourse')?.value;
      const moduleId = document.getElementById('editClassModule')?.value;
      const instructor = document.getElementById('editClassInstructor')?.value.trim() || 'NEXVION Faculty';
      const duration = document.getElementById('editClassDuration')?.value.trim() || '60 min';
      const order = parseInt(document.getElementById('editClassOrder')?.value || '1', 10);
      const visibility = document.getElementById('editClassVisibility')?.value || 'Published';
      const completionRequirement = document.getElementById('editClassRequirement')?.value.trim() || '';
      const videoId = document.getElementById('editClassVideo')?.value;
      const resourceId = document.getElementById('editClassResource')?.value;
      const description = document.getElementById('editClassDesc')?.value.trim() || '';
      const status = document.getElementById('editClassStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a class title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);
      const modules = await Data.getModules();
      const selectedMod = modules.find(m => m.id === moduleId);

      await Data.saveClass({
        id,
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        moduleId,
        moduleTitle: selectedMod ? selectedMod.title : 'Curriculum Module',
        instructor,
        duration,
        order,
        visibility,
        completionRequirement,
        relatedVideoId: videoId,
        videoStatus: videoId ? 'Ready' : 'Pending',
        relatedResourceId: resourceId,
        description,
        status
      });

      closeModal();
      showToast('Class Updated', `Updated class "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    duplicateClass: async (id) => {
      const clone = await Data.duplicateClass(id);
      if (clone) {
        showToast('Class Duplicated', `Duplicated "${clone.title}" as Draft.`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },
    archiveClass: async (id) => {
      const c = await Data.getClassById(id);
      if (!c) return;
      if (confirm(`Are you sure you want to archive class "${c.title}"?`)) {
        await Data.archiveClass(id);
        showToast('Class Archived', `Archived class "${c.title}".`, 'warning');
        renderRoute(AppState.currentRoute);
      }
    },
    previewClassModal: async (id) => {
      const c = await Data.getClassById(id);
      if (!c) return;

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <!-- Video Stream Monitor Simulated Header -->
          <div style="background:var(--adm-bg); border-radius:8px; border:1px solid var(--adm-border); overflow:hidden; position:relative; min-height:180px; display:flex; align-items:center; justify-content:center;">
            <div style="text-align:center; padding:20px;">
              <div style="font-size:2.5rem; margin-bottom:8px;">📡</div>
              <div style="font-weight:600; color:var(--adm-text-primary); font-size:0.95rem;">HLS Adaptive Live & On-Demand Stream</div>
              <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); margin-top:4px;">Stream Status: ${c.videoStatus || 'Ready'} • 1080p 60fps • Latency: 2.1s</div>
            </div>
            <span class="adm-badge adm-badge-published" style="position:absolute; top:12px; right:12px;">${c.visibility || 'Published'}</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">${c.courseTitle || 'Curriculum'} • ${c.moduleTitle || 'Module'}</span>
              <h3 style="margin:4px 0 0 0; color:var(--adm-text-primary); font-size:1.25rem;">${c.title}</h3>
            </div>
            <div>${AdminComponents.StatusBadge({ status: c.status || 'Published' })}</div>
          </div>

          <div class="adm-kpi-grid" style="grid-template-columns: repeat(3, 1fr); gap:10px;">
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Faculty Instructor</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${c.instructor || 'Faculty Lead'}</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Duration</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${c.duration || '60 min'}</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Order Sequence</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-tertiary); margin-top:2px;">#${c.order || 1}</div>
            </div>
          </div>

          <div>
            <h5 style="margin:0 0 6px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Completion Requirement</h5>
            <p style="margin:0; font-size:0.82rem; color:var(--adm-text-secondary); background:var(--adm-surface); padding:8px 12px; border-radius:6px; border:1px solid var(--adm-border);">
              ${c.completionRequirement || 'Attend live or stream >= 90% recorded playback.'}
            </p>
          </div>

          <div>
            <h5 style="margin:0 0 6px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Syllabus Overview & Description</h5>
            <p style="margin:0; font-size:0.84rem; color:var(--adm-text-secondary); line-height:1.5;">${c.description || 'No description provided for this class.'}</p>
          </div>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.openEditClassModal('${c.id}')">Edit Class</button>
      `;
      openModal(`Class Preview: ${c.title}`, bodyHtml, footerHtml);
    },

    // ========================================================================
    // PHASE 3: LESSONS CONTROLLER METHODS
    // ========================================================================
    onLessonSearch: (val) => {
      AppState.lessonsView.searchTerm = val;
      AppState.lessonsView.currentPage = 1;
      renderLessonsView();
    },
    onLessonCourseFilter: (val) => {
      AppState.lessonsView.courseFilter = val;
      AppState.lessonsView.currentPage = 1;
      renderLessonsView();
    },
    onLessonStatusFilter: (val) => {
      AppState.lessonsView.statusFilter = val;
      AppState.lessonsView.currentPage = 1;
      renderLessonsView();
    },
    onLessonSort: (val) => {
      AppState.lessonsView.sortBy = val;
      renderLessonsView();
    },
    onLessonPageChange: (page) => {
      AppState.lessonsView.currentPage = page;
      renderLessonsView();
    },
    onLessonPageSize: (size) => {
      AppState.lessonsView.pageSize = Number(size);
      AppState.lessonsView.currentPage = 1;
      renderLessonsView();
    },
    resetLessonFilters: () => {
      AppState.lessonsView.searchTerm = '';
      AppState.lessonsView.courseFilter = 'ALL';
      AppState.lessonsView.statusFilter = 'ALL';
      AppState.lessonsView.sortBy = 'order-asc';
      AppState.lessonsView.currentPage = 1;
      renderLessonsView();
    },
    exportLessonsList: async () => {
      const lessons = await Data.getLessons();
      const headers = ['Lesson ID', 'Title', 'Course', 'Module', 'Instructor', 'Duration', 'Completion Requirement', 'Status'];
      const rows = [headers.join(',')];
      lessons.forEach(l => {
        const row = [
          `"${l.id}"`,
          `"${(l.title || '').replace(/"/g, '""')}"`,
          `"${(l.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(l.moduleId || '').replace(/"/g, '""')}"`,
          `"${(l.instructor || '').replace(/"/g, '""')}"`,
          `"${l.duration || ''}"`,
          `"${(l.completionRequirement || '').replace(/"/g, '""')}"`,
          `"${l.status || ''}"`
        ];
        rows.push(row.join(','));
      });
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-lessons-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Lessons Exported', `Exported ${lessons.length} lessons to CSV.`, 'success');
    },
    openCreateLessonModal: async () => {
      const courses = await Data.getCourses();
      const modules = await Data.getModules();
      const videos = await Data.getVideos();
      const resources = await Data.getResources();

      const bodyHtml = `
        <form id="createLessonForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Lesson Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newLessonTitle" required placeholder="e.g. Lesson 02: Prompt Engineering & Few-Shot Templates">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newLessonCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <select class="adm-select" id="newLessonModule" style="width:100%;">
                ${modules.map(m => `<option value="${m.id}">${m.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Lead Faculty Instructor</label>
              <input type="text" class="adm-input" id="newLessonInstructor" value="Dr. Evelyn Vance" placeholder="Instructor Name">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Paced Duration</label>
              <input type="text" class="adm-input" id="newLessonDuration" value="25 min" placeholder="e.g. 25 min, 40 min">
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Sequence Display Order</label>
              <input type="number" class="adm-input" id="newLessonOrder" value="1" min="1">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Scope</label>
              <select class="adm-select" id="newLessonVisibility" style="width:100%;">
                <option value="Published" selected>Published</option>
                <option value="Draft">Draft</option>
                <option value="Locked">Locked</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="newLessonRequirement" value="Watch video and complete terminal code exercise" placeholder="e.g. Watch video and complete lab">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Related Master Video</label>
              <select class="adm-select" id="newLessonVideo" style="width:100%;">
                <option value="">None / Text Lesson</option>
                ${videos.map(v => `<option value="${v.id}">${v.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Resource</label>
              <select class="adm-select" id="newLessonResource" style="width:100%;">
                <option value="">None</option>
                ${resources.map(r => `<option value="${r.id}">${r.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lesson Pedagogical Notes & Lab Prompts</label>
            <textarea class="adm-textarea" id="newLessonDesc" placeholder="Learning goals, code snippets, and exercise checkpoints..." style="min-height:75px;"></textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="newLessonStatus" style="width:100%;">
              <option value="Published" selected>Published</option>
              <option value="Draft">Draft</option>
              <option value="Locked">Locked</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateLesson()">Create Lesson</button>
      `;
      openModal('Create New Pedagogical Lesson', bodyHtml, footerHtml);
    },
    submitCreateLesson: async () => {
      const title = document.getElementById('newLessonTitle')?.value.trim();
      const courseId = document.getElementById('newLessonCourse')?.value;
      const moduleId = document.getElementById('newLessonModule')?.value;
      const instructor = document.getElementById('newLessonInstructor')?.value.trim() || 'Dr. Evelyn Vance';
      const duration = document.getElementById('newLessonDuration')?.value.trim() || '25 min';
      const order = parseInt(document.getElementById('newLessonOrder')?.value || '1', 10);
      const visibility = document.getElementById('newLessonVisibility')?.value || 'Published';
      const completionRequirement = document.getElementById('newLessonRequirement')?.value.trim() || 'Watch 90%';
      const videoId = document.getElementById('newLessonVideo')?.value;
      const resourceId = document.getElementById('newLessonResource')?.value;
      const description = document.getElementById('newLessonDesc')?.value.trim() || '';
      const status = document.getElementById('newLessonStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a lesson title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);
      const modules = await Data.getModules();
      const selectedMod = modules.find(m => m.id === moduleId);

      await Data.saveLesson({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        moduleId,
        moduleTitle: selectedMod ? selectedMod.title : 'Curriculum Module',
        instructor,
        duration,
        order,
        visibility,
        completionRequirement,
        relatedVideoId: videoId,
        videoStatus: videoId ? 'Ready' : 'Pending',
        relatedResourceId: resourceId,
        description,
        status
      });

      closeModal();
      showToast('Lesson Created', `Successfully created lesson "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openEditLessonModal: async (id) => {
      const l = await Data.getLessonById(id);
      if (!l) return;
      const courses = await Data.getCourses();
      const modules = await Data.getModules();
      const videos = await Data.getVideos();
      const resources = await Data.getResources();

      const bodyHtml = `
        <form id="editLessonForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Lesson Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="editLessonTitle" value="${l.title || ''}" required>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum</label>
              <select class="adm-select" id="editLessonCourse" style="width:100%;">
                ${courses.map(crs => `<option value="${crs.id}" ${crs.id === l.courseId ? 'selected' : ''}>${crs.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <select class="adm-select" id="editLessonModule" style="width:100%;">
                ${modules.map(m => `<option value="${m.id}" ${m.id === l.moduleId ? 'selected' : ''}>${m.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Lead Faculty Instructor</label>
              <input type="text" class="adm-input" id="editLessonInstructor" value="${l.instructor || ''}">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Paced Duration</label>
              <input type="text" class="adm-input" id="editLessonDuration" value="${l.duration || '25 min'}">
            </div>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Sequence Display Order</label>
              <input type="number" class="adm-input" id="editLessonOrder" value="${l.order || 1}" min="1">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Scope</label>
              <select class="adm-select" id="editLessonVisibility" style="width:100%;">
                <option value="Published" ${l.visibility === 'Published' ? 'selected' : ''}>Published</option>
                <option value="Draft" ${l.visibility === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Locked" ${l.visibility === 'Locked' ? 'selected' : ''}>Locked</option>
                <option value="Archived" ${l.visibility === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Completion Requirement Standard</label>
            <input type="text" class="adm-input" id="editLessonRequirement" value="${l.completionRequirement || ''}">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Related Master Video</label>
              <select class="adm-select" id="editLessonVideo" style="width:100%;">
                <option value="">None / Text Lesson</option>
                ${videos.map(v => `<option value="${v.id}" ${v.id === l.relatedVideoId ? 'selected' : ''}>${v.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Resource</label>
              <select class="adm-select" id="editLessonResource" style="width:100%;">
                <option value="">None</option>
                ${resources.map(r => `<option value="${r.id}" ${r.id === l.relatedResourceId ? 'selected' : ''}>${r.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lesson Pedagogical Notes & Lab Prompts</label>
            <textarea class="adm-textarea" id="editLessonDesc" style="min-height:75px;">${l.description || ''}</textarea>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Lifecycle Status</label>
            <select class="adm-select" id="editLessonStatus" style="width:100%;">
              <option value="Published" ${l.status === 'Published' ? 'selected' : ''}>Published</option>
              <option value="Draft" ${l.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Locked" ${l.status === 'Locked' ? 'selected' : ''}>Locked</option>
              <option value="Archived" ${l.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditLesson('${id}')">Save Changes</button>
      `;
      openModal(`Edit Lesson: ${l.title}`, bodyHtml, footerHtml);
    },
    submitEditLesson: async (id) => {
      const title = document.getElementById('editLessonTitle')?.value.trim();
      const courseId = document.getElementById('editLessonCourse')?.value;
      const moduleId = document.getElementById('editLessonModule')?.value;
      const instructor = document.getElementById('editLessonInstructor')?.value.trim() || 'Dr. Evelyn Vance';
      const duration = document.getElementById('editLessonDuration')?.value.trim() || '25 min';
      const order = parseInt(document.getElementById('editLessonOrder')?.value || '1', 10);
      const visibility = document.getElementById('editLessonVisibility')?.value || 'Published';
      const completionRequirement = document.getElementById('editLessonRequirement')?.value.trim() || '';
      const videoId = document.getElementById('editLessonVideo')?.value;
      const resourceId = document.getElementById('editLessonResource')?.value;
      const description = document.getElementById('editLessonDesc')?.value.trim() || '';
      const status = document.getElementById('editLessonStatus')?.value || 'Published';

      if (!title) {
        alert('Please enter a lesson title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);
      const modules = await Data.getModules();
      const selectedMod = modules.find(m => m.id === moduleId);

      await Data.saveLesson({
        id,
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        moduleId,
        moduleTitle: selectedMod ? selectedMod.title : 'Curriculum Module',
        instructor,
        duration,
        order,
        visibility,
        completionRequirement,
        relatedVideoId: videoId,
        videoStatus: videoId ? 'Ready' : 'Pending',
        relatedResourceId: resourceId,
        description,
        status
      });

      closeModal();
      showToast('Lesson Updated', `Updated lesson "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    duplicateLesson: async (id) => {
      const clone = await Data.duplicateLesson(id);
      if (clone) {
        showToast('Lesson Duplicated', `Duplicated "${clone.title}" as Draft.`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },
    archiveLesson: async (id) => {
      const l = await Data.getLessonById(id);
      if (!l) return;
      if (confirm(`Are you sure you want to archive lesson "${l.title}"?`)) {
        await Data.archiveLesson(id);
        showToast('Lesson Archived', `Archived lesson "${l.title}".`, 'warning');
        renderRoute(AppState.currentRoute);
      }
    },
    previewLessonModal: async (id) => {
      const l = await Data.getLessonById(id);
      if (!l) return;

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--adm-border); padding-bottom:12px;">
            <div>
              <span style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">Sequence #${l.order || 1} • ${l.courseTitle || 'Curriculum'}</span>
              <h3 style="margin:4px 0 0 0; color:var(--adm-text-primary); font-size:1.25rem;">${l.title}</h3>
            </div>
            <div>${AdminComponents.StatusBadge({ status: l.status || 'Published' })}</div>
          </div>

          <div class="adm-kpi-grid" style="grid-template-columns: repeat(3, 1fr); gap:10px;">
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Instructor</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${l.instructor || 'Faculty Lead'}</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Duration</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${l.duration || '25 min'}</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Video Stream</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-tertiary); margin-top:2px;">${l.videoStatus || 'Ready'}</div>
            </div>
          </div>

          <div>
            <h5 style="margin:0 0 6px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Completion Requirement</h5>
            <p style="margin:0; font-size:0.82rem; color:var(--adm-text-secondary); background:var(--adm-surface); padding:8px 12px; border-radius:6px; border:1px solid var(--adm-border);">
              ${l.completionRequirement || 'Watch video stream and complete lab checkpoint.'}
            </p>
          </div>

          <div>
            <h5 style="margin:0 0 6px 0; font-size:0.75rem; text-transform:uppercase; font-family:var(--adm-font-mono); color:var(--adm-text-muted);">Lesson Content & Lab Prompts</h5>
            <div style="font-size:0.84rem; color:var(--adm-text-secondary); line-height:1.5; white-space:pre-wrap; background:var(--adm-surface-card); padding:12px; border-radius:6px; border:1px solid var(--adm-border);">
              ${l.description || 'Pedagogical objectives and interactive code exercises mapped to this unit.'}
            </div>
          </div>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.openEditLessonModal('${l.id}')">Edit Lesson</button>
      `;
      openModal(`Lesson Details: ${l.title}`, bodyHtml, footerHtml);
    },

    // ========================================================================
    // PHASE 3: VIDEOS CONTROLLER METHODS
    // ========================================================================
    onVideoSearch: (val) => {
      AppState.videosView.searchTerm = val;
      AppState.videosView.currentPage = 1;
      renderVideosView();
    },
    onVideoStatusFilter: (val) => {
      AppState.videosView.statusFilter = val;
      AppState.videosView.currentPage = 1;
      renderVideosView();
    },
    onVideoVisibilityFilter: (val) => {
      AppState.videosView.visibilityFilter = val;
      AppState.videosView.currentPage = 1;
      renderVideosView();
    },
    onVideoSort: (val) => {
      AppState.videosView.sortBy = val;
      renderVideosView();
    },
    onVideoPageChange: (page) => {
      AppState.videosView.currentPage = page;
      renderVideosView();
    },
    onVideoPageSize: (size) => {
      AppState.videosView.pageSize = Number(size);
      AppState.videosView.currentPage = 1;
      renderVideosView();
    },
    resetVideoFilters: () => {
      AppState.videosView.searchTerm = '';
      AppState.videosView.statusFilter = 'ALL';
      AppState.videosView.visibilityFilter = 'ALL';
      AppState.videosView.sortBy = 'title-asc';
      AppState.videosView.currentPage = 1;
      renderVideosView();
    },
    openUploadVideoModal: async () => {
      const courses = await Data.getCourses();

      const bodyHtml = `
        <form id="uploadVideoForm" style="display:flex; flex-direction:column; gap:14px;">
          <!-- Visual Upload Drop Area -->
          <div class="adm-upload-dropzone" style="border:2px dashed var(--adm-primary); background:rgba(127,82,255,0.04); padding:24px; text-align:center; border-radius:10px; cursor:pointer;" onclick="document.getElementById('simulatedVideoFile').click()">
            <input type="file" id="simulatedVideoFile" accept="video/*" style="display:none;" onchange="
              if (this.files && this.files[0]) {
                document.getElementById('uploadFileNotice').innerText = 'Selected Master File: ' + this.files[0].name + ' (' + (this.files[0].size / (1024*1024)).toFixed(1) + ' MB)';
                if (!document.getElementById('newVideoTitle').value) {
                  document.getElementById('newVideoTitle').value = this.files[0].name.replace(/\\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                }
              }
            ">
            <div style="font-size:2.2rem; margin-bottom:6px;">📤</div>
            <div style="font-weight:700; color:var(--adm-text-primary); font-size:0.95rem;">Drag & drop raw recording master or click to browse</div>
            <div id="uploadFileNotice" style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); margin-top:4px;">Supports MP4, Apple ProRes, WebM, and HEVC masters up to 4K 60fps</div>
            <div style="font-size:0.72rem; color:var(--adm-text-muted); margin-top:8px; line-height:1.4;">Video storage will be connected during backend integration (Google Cloud Storage / AWS S3).</div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Video Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newVideoTitle" required placeholder="e.g. Master Lecture: Autonomous Tool Use & Reasoning Loops">
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Association</label>
              <select class="adm-select" id="newVideoCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Lecture / Class Descriptor</label>
              <input type="text" class="adm-input" id="newVideoClass" value="Class 01: Core Lecture" placeholder="e.g. Class 02: Streaming Architecture">
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Duration (MM:SS or HH:MM:SS)</label>
              <input type="text" class="adm-input" id="newVideoDuration" value="45:00" placeholder="e.g. 52:18">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Target Transcoding Profile</label>
              <select class="adm-select" id="newVideoProfile" style="width:100%;">
                <option value="1080p 60fps • 6000 kbps" selected>1080p 60fps (Standard Master)</option>
                <option value="2160p 60fps • 14000 kbps">4K 2160p UHD (Executive Tier)</option>
                <option value="1440p 60fps • 9000 kbps">2K 1440p QHD</option>
                <option value="720p 30fps • 2800 kbps">720p Low-Bandwidth</option>
              </select>
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Pipeline Ingest State</label>
              <select class="adm-select" id="newVideoStatus" style="width:100%;">
                <option value="Ready" selected>Ready (Transcode Complete)</option>
                <option value="Processing">Processing (Encoding HLS)</option>
                <option value="Failed">Failed (Transcoder Error)</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Access Visibility</label>
              <select class="adm-select" id="newVideoVisibility" style="width:100%;">
                <option value="Published" selected>Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitUploadVideo()">Start Ingest & Transcode</button>
      `;
      openModal('Upload Master Video Stream', bodyHtml, footerHtml);
    },
    submitUploadVideo: async () => {
      const title = document.getElementById('newVideoTitle')?.value.trim();
      const courseId = document.getElementById('newVideoCourse')?.value;
      const classTitle = document.getElementById('newVideoClass')?.value.trim() || 'Core Lecture';
      const duration = document.getElementById('newVideoDuration')?.value.trim() || '45:00';
      const profile = document.getElementById('newVideoProfile')?.value || '1080p';
      const status = document.getElementById('newVideoStatus')?.value || 'Ready';
      const visibility = document.getElementById('newVideoVisibility')?.value || 'Published';

      if (!title) {
        alert('Please enter a video title.');
        return;
      }
      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);

      await Data.saveVideo({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title.split(':')[0] : 'Curriculum Course',
        classTitle,
        duration,
        resolution: profile.split('•')[0].trim(),
        bitrate: profile.split('•')[1]?.trim() || 'Adaptive HLS',
        status,
        visibility,
        hlsManifestUrl: `https://cdn.nexvion.ai/hls/vid-${Date.now()}/master.m3u8`
      });

      closeModal();
      showToast('Video Ingest Initialized', 'Video storage will be connected during backend integration. Record added to library.', 'success');
      renderRoute(AppState.currentRoute);
    },
    openReplaceVideoModal: async (id) => {
      const v = await Data.getVideoById(id);
      if (!v) return;

      const bodyHtml = `
        <form id="replaceVideoForm" style="display:flex; flex-direction:column; gap:14px;">
          <div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); border-radius:8px; padding:12px; font-size:0.8rem; color:var(--adm-text-secondary);">
            Replacing master asset for <strong>${v.title}</strong>. Existing playback URLs will remain valid via rolling zero-downtime cache invalidation.
          </div>

          <div class="adm-upload-dropzone" style="border:2px dashed var(--adm-primary); background:rgba(127,82,255,0.04); padding:24px; text-align:center; border-radius:10px; cursor:pointer;" onclick="document.getElementById('replaceVideoFile').click()">
            <input type="file" id="replaceVideoFile" accept="video/*" style="display:none;" onchange="
              if (this.files && this.files[0]) {
                document.getElementById('replaceFileNotice').innerText = 'Selected New Master: ' + this.files[0].name + ' (' + (this.files[0].size / (1024*1024)).toFixed(1) + ' MB)';
              }
            ">
            <div style="font-size:2.2rem; margin-bottom:6px;">🔄</div>
            <div style="font-weight:700; color:var(--adm-text-primary); font-size:0.95rem;">Select replacement master file</div>
            <div id="replaceFileNotice" style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); margin-top:4px;">MP4, ProRes, or WebM master</div>
            <div style="font-size:0.72rem; color:var(--adm-text-muted); margin-top:8px;">Video storage will be connected during backend integration.</div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Updated Video Duration</label>
            <input type="text" class="adm-input" id="replaceVideoDuration" value="${v.duration || '45:00'}">
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Replacement Transcoding Profile</label>
            <select class="adm-select" id="replaceVideoProfile" style="width:100%;">
              <option value="1080p 60fps • 6000 kbps" selected>1080p 60fps (Standard Master)</option>
              <option value="2160p 60fps • 14000 kbps">4K 2160p UHD (Executive Tier)</option>
              <option value="1440p 60fps • 9000 kbps">2K 1440p QHD</option>
            </select>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Post-Ingest State</label>
            <select class="adm-select" id="replaceVideoStatus" style="width:100%;">
              <option value="Ready" selected>Ready (Immediate Hot-Swap)</option>
              <option value="Processing">Processing (Transcode Queue)</option>
              <option value="Failed">Failed (Simulated Error)</option>
            </select>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitReplaceVideo('${id}')">Replace Video Master</button>
      `;
      openModal(`Replace Video: ${v.title}`, bodyHtml, footerHtml);
    },
    submitReplaceVideo: async (id) => {
      const v = await Data.getVideoById(id);
      if (!v) return;

      const duration = document.getElementById('replaceVideoDuration')?.value.trim() || v.duration;
      const profile = document.getElementById('replaceVideoProfile')?.value || '1080p';
      const status = document.getElementById('replaceVideoStatus')?.value || 'Ready';

      await Data.saveVideo({
        ...v,
        duration,
        resolution: profile.split('•')[0].trim(),
        bitrate: profile.split('•')[1]?.trim() || 'Adaptive HLS',
        status
      });

      closeModal();
      showToast('Video Master Replaced', 'New master stream ingested. Video storage will be connected during backend integration.', 'success');
      renderRoute(AppState.currentRoute);
    },
    previewVideoModal: async (id) => {
      const v = await Data.getVideoById(id);
      if (!v) return;

      let statusBadgeClass = 'adm-badge-ready';
      if (v.status === 'Processing') statusBadgeClass = 'adm-badge-processing';
      if (v.status === 'Failed') statusBadgeClass = 'adm-badge-failed';

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <!-- Simulated Video Player Monitor -->
          <div style="background:#09090D; border-radius:10px; border:1px solid var(--adm-border); overflow:hidden; position:relative; min-height:220px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <div style="font-size:3.5rem; color:var(--adm-primary); filter:drop-shadow(0 0 16px rgba(127,82,255,0.4));">▶</div>
            <div style="margin-top:12px; font-weight:600; color:#fff; font-size:1rem;">${v.title}</div>
            <div style="font-size:0.75rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono); margin-top:4px;">
              ${v.resolution || '1080p'} • ${v.duration || '00:00'} • ${v.bitrate || 'HLS Adaptive'}
            </div>
            
            <!-- Video Player Controls Bar Simulation -->
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(18,18,24,0.85); backdrop-filter:blur(6px); padding:8px 14px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08);">
              <div style="display:flex; align-items:center; gap:10px; font-size:0.8rem; color:#fff;">
                <span>▶ 00:00 / ${v.duration || '00:00'}</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="adm-badge adm-badge-published" style="font-size:0.65rem;">HLS LIVE</span>
                <span style="font-size:0.7rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">1080p60</span>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="font-size:0.75rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono);">${v.courseTitle || 'Curriculum'} • ${v.classTitle || 'Lecture'}</span>
              <h3 style="margin:4px 0 0 0; color:var(--adm-text-primary); font-size:1.25rem;">${v.title}</h3>
            </div>
            <div><span class="adm-badge ${statusBadgeClass}">${v.status || 'Ready'}</span></div>
          </div>

          <div style="background:var(--adm-surface-elevated); padding:12px; border-radius:8px; border:1px solid var(--adm-border); display:flex; flex-direction:column; gap:6px;">
            <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); text-transform:uppercase;">HLS Master Stream Manifest</div>
            <code style="font-size:0.75rem; color:var(--adm-tertiary); word-break:break-all;">${v.hlsManifestUrl || `https://cdn.nexvion.ai/hls/${v.id}/master.m3u8`}</code>
            <div style="font-size:0.7rem; color:var(--adm-text-secondary); margin-top:2px;">Video storage will be connected during backend integration. CDN distributed playback endpoint verified.</div>
          </div>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.openReplaceVideoModal('${v.id}')">Replace Master</button>
      `;
      openModal(`Video Preview Monitor: ${v.title}`, bodyHtml, footerHtml);
    },
    archiveVideo: async (id) => {
      const v = await Data.getVideoById(id);
      if (!v) return;
      if (confirm(`Are you sure you want to archive video asset "${v.title}"?`)) {
        await Data.archiveVideo(id);
        showToast('Video Archived', `Archived video "${v.title}".`, 'warning');
        renderRoute(AppState.currentRoute);
      }
    },

    // ========================================================================
    // PHASE 3: RESOURCES CONTROLLER METHODS
    // ========================================================================
    onResourceSearch: (val) => {
      AppState.resourcesView.searchTerm = val;
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    onResourceTypeFilter: (val) => {
      AppState.resourcesView.typeFilter = val;
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    onResourceCourseFilter: (val) => {
      AppState.resourcesView.courseFilter = val;
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    onResourceStatusFilter: (val) => {
      AppState.resourcesView.statusFilter = val;
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    onResourceSort: (val) => {
      AppState.resourcesView.sortBy = val;
      renderResourcesView();
    },
    onResourcePageChange: (page) => {
      AppState.resourcesView.currentPage = page;
      renderResourcesView();
    },
    onResourcePageSize: (size) => {
      AppState.resourcesView.pageSize = Number(size);
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    resetResourceFilters: () => {
      AppState.resourcesView.searchTerm = '';
      AppState.resourcesView.typeFilter = 'ALL';
      AppState.resourcesView.courseFilter = 'ALL';
      AppState.resourcesView.statusFilter = 'ALL';
      AppState.resourcesView.sortBy = 'title-asc';
      AppState.resourcesView.currentPage = 1;
      renderResourcesView();
    },
    exportResourcesList: async () => {
      const resources = await Data.getResources();
      const headers = ['Resource ID', 'Title', 'Type', 'Course', 'Module', 'File/Link', 'Visibility', 'Downloads', 'Status'];
      const rows = [headers.join(',')];
      resources.forEach(r => {
        const row = [
          `"${r.id}"`,
          `"${(r.title || '').replace(/"/g, '""')}"`,
          `"${r.type || ''}"`,
          `"${(r.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(r.moduleTitle || '').replace(/"/g, '""')}"`,
          `"${(r.filePlaceholder || '').replace(/"/g, '""')}"`,
          `"${r.visibility || ''}"`,
          r.downloadCount || 0,
          `"${r.status || ''}"`
        ];
        rows.push(row.join(','));
      });
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-resources-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Resources Exported', `Exported ${resources.length} learning assets to CSV.`, 'success');
    },
    openCreateResourceModal: async () => {
      const courses = await Data.getCourses();
      const modules = await Data.getModules();

      const bodyHtml = `
        <form id="createResourceForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Resource Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newResTitle" required placeholder="e.g. Production RAG Vector Chunking Benchmarking Notebook">
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Resource Type <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newResType" style="width:100%;">
                <option value="PDF" selected>PDF</option>
                <option value="Document">Document</option>
                <option value="Link">Link</option>
                <option value="Prompt library">Prompt library</option>
                <option value="Study material">Study material</option>
                <option value="Template">Template</option>
                <option value="External tool">External tool</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Course <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newResCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.title.split(':')[0]}">${c.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Related Module Association</label>
            <select class="adm-select" id="newResModule" style="width:100%;">
              <option value="">General Curriculum Resource</option>
              ${modules.map(m => `<option value="${m.title}">${m.title}</option>`).join('')}
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">File Path or External Link URL <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newResTarget" required value="https://assets.nexvion.ai/docs/reference-guide.pdf" placeholder="e.g. notebooks/rag-chunking.ipynb or https://github.com/...">
            <span class="adm-form-help">Enter repository path, cloud asset URI, or documentation hyperlink.</span>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Permission</label>
              <select class="adm-select" id="newResVisibility" style="width:100%;">
                <option value="Public" selected>Public (All Tiers)</option>
                <option value="Enrolled Only">Enrolled Only (Active Students)</option>
                <option value="Staff Only">Staff Only</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Asset Status</label>
              <select class="adm-select" id="newResStatus" style="width:100%;">
                <option value="Active" selected>Active</option>
                <option value="Draft">Draft</option>
                <option value="Locked">Locked</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateResource()">Save Resource</button>
      `;
      openModal('Add Learning Resource Asset', bodyHtml, footerHtml);
    },
    submitCreateResource: async () => {
      const title = document.getElementById('newResTitle')?.value.trim();
      const type = document.getElementById('newResType')?.value || 'PDF';
      const courseTitle = document.getElementById('newResCourse')?.value || 'AI Foundations';
      const moduleTitle = document.getElementById('newResModule')?.value || 'Curriculum Module';
      const filePlaceholder = document.getElementById('newResTarget')?.value.trim() || 'https://assets.nexvion.ai';
      const visibility = document.getElementById('newResVisibility')?.value || 'Public';
      const status = document.getElementById('newResStatus')?.value || 'Active';

      if (!title) {
        alert('Please enter a resource title.');
        return;
      }

      await Data.saveResource({
        title,
        type,
        courseTitle,
        moduleTitle,
        filePlaceholder,
        size: type === 'Link' ? 'Web Link' : (type === 'Template' ? 'Repo Starter' : '2.4 MB'),
        visibility,
        status,
        downloadCount: 0
      });

      closeModal();
      showToast('Resource Added', `Added resource "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openEditResourceModal: async (id) => {
      const r = await Data.getResourceById(id);
      if (!r) return;
      const courses = await Data.getCourses();
      const modules = await Data.getModules();

      const bodyHtml = `
        <form id="editResourceForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Resource Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="editResTitle" value="${r.title || ''}" required>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Resource Type</label>
              <select class="adm-select" id="editResType" style="width:100%;">
                <option value="PDF" ${r.type === 'PDF' ? 'selected' : ''}>PDF</option>
                <option value="Document" ${r.type === 'Document' ? 'selected' : ''}>Document</option>
                <option value="Link" ${r.type === 'Link' ? 'selected' : ''}>Link</option>
                <option value="Prompt library" ${r.type === 'Prompt library' ? 'selected' : ''}>Prompt library</option>
                <option value="Study material" ${r.type === 'Study material' ? 'selected' : ''}>Study material</option>
                <option value="Template" ${r.type === 'Template' ? 'selected' : ''}>Template</option>
                <option value="External tool" ${r.type === 'External tool' ? 'selected' : ''}>External tool</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Related Course</label>
              <select class="adm-select" id="editResCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.title.split(':')[0]}" ${r.courseTitle && r.courseTitle.includes(c.title.split(':')[0]) ? 'selected' : ''}>${c.title}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Related Module Association</label>
            <select class="adm-select" id="editResModule" style="width:100%;">
              <option value="">General Curriculum Resource</option>
              ${modules.map(m => `<option value="${m.title}" ${r.moduleTitle === m.title ? 'selected' : ''}>${m.title}</option>`).join('')}
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">File Path or Link Target</label>
            <input type="text" class="adm-input" id="editResTarget" value="${r.filePlaceholder || ''}" required>
          </div>
          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Visibility Permission</label>
              <select class="adm-select" id="editResVisibility" style="width:100%;">
                <option value="Public" ${r.visibility === 'Public' ? 'selected' : ''}>Public</option>
                <option value="Enrolled Only" ${r.visibility === 'Enrolled Only' ? 'selected' : ''}>Enrolled Only</option>
                <option value="Staff Only" ${r.visibility === 'Staff Only' ? 'selected' : ''}>Staff Only</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Asset Status</label>
              <select class="adm-select" id="editResStatus" style="width:100%;">
                <option value="Active" ${r.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Draft" ${r.status === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Locked" ${r.status === 'Locked' ? 'selected' : ''}>Locked</option>
                <option value="Archived" ${r.status === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>
          </div>
        </form>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditResource('${id}')">Save Changes</button>
      `;
      openModal(`Edit Resource: ${r.title}`, bodyHtml, footerHtml);
    },
    submitEditResource: async (id) => {
      const r = await Data.getResourceById(id);
      if (!r) return;

      const title = document.getElementById('editResTitle')?.value.trim();
      const type = document.getElementById('editResType')?.value || r.type;
      const courseTitle = document.getElementById('editResCourse')?.value || r.courseTitle;
      const moduleTitle = document.getElementById('editResModule')?.value || r.moduleTitle;
      const filePlaceholder = document.getElementById('editResTarget')?.value.trim() || r.filePlaceholder;
      const visibility = document.getElementById('editResVisibility')?.value || r.visibility;
      const status = document.getElementById('editResStatus')?.value || r.status;

      if (!title) {
        alert('Please enter a resource title.');
        return;
      }

      await Data.saveResource({
        ...r,
        title,
        type,
        courseTitle,
        moduleTitle,
        filePlaceholder,
        visibility,
        status
      });

      closeModal();
      showToast('Resource Updated', `Updated resource "${title}".`, 'success');
      renderRoute(AppState.currentRoute);
    },
    previewResourceModal: async (id) => {
      const r = await Data.getResourceById(id);
      if (!r) return;

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="adm-res-badge adm-res-pdf" style="margin-bottom:6px; display:inline-block;">${r.type}</span>
              <h3 style="margin:4px 0 0 0; color:var(--adm-text-primary); font-size:1.25rem;">${r.title}</h3>
            </div>
            <div>${AdminComponents.StatusBadge({ status: r.status || 'Active' })}</div>
          </div>

          <div class="adm-kpi-grid" style="grid-template-columns: repeat(3, 1fr); gap:10px;">
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Course Curriculum</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${r.courseTitle || 'Curriculum'}</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Downloads / Access</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-tertiary); margin-top:2px;">${r.downloadCount || 0} hits</div>
            </div>
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:6px; border:1px solid var(--adm-border);">
              <div style="font-size:0.7rem; color:var(--adm-text-muted); text-transform:uppercase; font-family:var(--adm-font-mono);">Visibility Scope</div>
              <div style="font-size:0.85rem; font-weight:600; color:var(--adm-text-primary); margin-top:2px;">${r.visibility || 'Public'}</div>
            </div>
          </div>

          <div style="background:var(--adm-surface-elevated); padding:14px; border-radius:8px; border:1px solid var(--adm-border);">
            <div style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); text-transform:uppercase; margin-bottom:4px;">Target Location or Link</div>
            <code style="font-size:0.82rem; color:var(--adm-tertiary); word-break:break-all;">${r.filePlaceholder || 'https://assets.nexvion.ai'}</code>
            <div style="font-size:0.75rem; color:var(--adm-text-secondary); margin-top:8px;">File storage will be connected during backend integration. Asset catalog reference is validated.</div>
          </div>
        </div>
      `;
      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.openEditResourceModal('${r.id}')">Edit Resource</button>
      `;
      openModal(`Resource Preview: ${r.title}`, bodyHtml, footerHtml);
    },
    archiveResource: async (id) => {
      const r = await Data.getResourceById(id);
      if (!r) return;
      if (confirm(`Are you sure you want to archive resource "${r.title}"?`)) {
        await Data.archiveResource(id);
        showToast('Resource Archived', `Archived resource "${r.title}".`, 'warning');
        renderRoute(AppState.currentRoute);
      }
    },

    // ========================================================================
    // PHASE 4: PROJECTS CONTROLLER METHODS
    // ========================================================================
    onProjectSearch: (val) => {
      AppState.projectsView.searchTerm = val;
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    onProjectCourseFilter: (val) => {
      AppState.projectsView.courseFilter = val;
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    onProjectTierFilter: (val) => {
      AppState.projectsView.tierFilter = val;
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    onProjectRequiredFilter: (val) => {
      AppState.projectsView.requiredFilter = val;
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    onProjectStatusFilter: (val) => {
      AppState.projectsView.statusFilter = val;
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    onProjectSort: (val) => {
      AppState.projectsView.sortBy = val;
      renderProjectsView();
    },
    onProjectPageChange: (page) => {
      AppState.projectsView.currentPage = page;
      renderProjectsView();
    },
    onProjectPageSize: (size) => {
      AppState.projectsView.pageSize = Number(size);
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    resetProjectFilters: () => {
      AppState.projectsView.searchTerm = '';
      AppState.projectsView.courseFilter = 'ALL';
      AppState.projectsView.tierFilter = 'ALL';
      AppState.projectsView.requiredFilter = 'ALL';
      AppState.projectsView.statusFilter = 'ALL';
      AppState.projectsView.sortBy = 'title-asc';
      AppState.projectsView.currentPage = 1;
      renderProjectsView();
    },
    exportProjectsList: async () => {
      const projects = await Data.getProjects();
      const headers = ['Project ID', 'Project Title', 'Course', 'Tier', 'Module', 'Requirement', 'Due Date', 'Submission Type', 'Status', 'Rubric', 'Completion Requirement'];
      const csvRows = [headers.join(',')];
      projects.forEach(p => {
        const row = [
          `"${p.id}"`,
          `"${(p.title || '').replace(/"/g, '""')}"`,
          `"${(p.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(p.tierName || p.tierId || '').replace(/"/g, '""')}"`,
          `"${(p.moduleTitle || p.moduleId || '').replace(/"/g, '""')}"`,
          `"${p.isRequired ? 'Required' : 'Optional'}"`,
          `"${p.dueDate || ''}"`,
          `"${(p.submissionType || '').replace(/"/g, '""')}"`,
          `"${p.status || ''}"`,
          `"${(p.rubric || '').replace(/"/g, '""')}"`,
          `"${(p.completionRequirement || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-projects-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Projects Exported', `Exported ${projects.length} project specifications to CSV.`, 'success');
    },
    openCreateProjectModal: async () => {
      const courses = await Data.getCourses();
      const tiers = await Data.getTiers();

      const bodyHtml = `
        <form id="createProjectForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Project Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newProjTitle" required placeholder="e.g. Autonomous Multi-Agent Research Assistant">
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newProjCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Curriculum Tier</label>
              <select class="adm-select" id="newProjTier" style="width:100%;">
                ${tiers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <input type="text" class="adm-input" id="newProjModule" placeholder="e.g. Module 01: Full-Stack Integration">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Requirement Status</label>
              <select class="adm-select" id="newProjRequired" style="width:100%;">
                <option value="true" selected>Required (Mandatory for completion)</option>
                <option value="false">Optional (Portfolio honors)</option>
              </select>
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Due Date</label>
              <input type="date" class="adm-input" id="newProjDueDate" value="${new Date(Date.now() + 14*86400000).toISOString().split('T')[0]}">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Submission Format</label>
              <input type="text" class="adm-input" id="newProjSubmissionType" value="GitHub Repo + Deployed Live URL" placeholder="e.g. GitHub Repo + Live URL">
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Short Description</label>
            <textarea class="adm-textarea" id="newProjDesc" placeholder="Executive description of the capstone deliverables..." style="min-height:60px;"></textarea>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Student Instructions & Implementation Guide</label>
            <textarea class="adm-textarea" id="newProjInstructions" placeholder="Step-by-step requirements, architecture constraints, and API keys setup..." style="min-height:90px; font-family:var(--adm-font-mono); font-size:0.8rem;"></textarea>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Grading Rubric Specifications</label>
            <textarea class="adm-textarea" id="newProjRubric" placeholder="Criterion 1 (30%): Agent architecture&#10;Criterion 2 (40%): Tool execution&#10;Criterion 3 (30%): Evaluation benchmark" style="min-height:75px;"></textarea>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Completion Standard</label>
              <input type="text" class="adm-input" id="newProjCompletion" value="Passing score >= 80% with faculty evaluation">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Lifecycle Status</label>
              <select class="adm-select" id="newProjStatus" style="width:100%;">
                <option value="Published" selected>Published</option>
                <option value="Open">Open</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </form>
      `;

      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateProject()">Create Project</button>
      `;

      openModal('Create New Project Milestone', bodyHtml, footerHtml);
    },
    submitCreateProject: async () => {
      const title = document.getElementById('newProjTitle')?.value.trim();
      if (!title) {
        alert('Please enter a project title.');
        return;
      }
      const courseId = document.getElementById('newProjCourse')?.value;
      const tierId = document.getElementById('newProjTier')?.value;
      const moduleTitle = document.getElementById('newProjModule')?.value.trim();
      const isRequired = document.getElementById('newProjRequired')?.value === 'true';
      const dueDate = document.getElementById('newProjDueDate')?.value;
      const submissionType = document.getElementById('newProjSubmissionType')?.value.trim();
      const description = document.getElementById('newProjDesc')?.value.trim();
      const instructions = document.getElementById('newProjInstructions')?.value.trim();
      const rubric = document.getElementById('newProjRubric')?.value.trim();
      const completionRequirement = document.getElementById('newProjCompletion')?.value.trim();
      const status = document.getElementById('newProjStatus')?.value || 'Published';

      const courses = await Data.getCourses();
      const tiers = await Data.getTiers();
      const selectedCourse = courses.find(c => c.id === courseId);
      const selectedTier = tiers.find(t => t.id === tierId);

      await Data.saveProject({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title : 'Curriculum Course',
        tierId,
        tierName: selectedTier ? selectedTier.name : 'Curriculum Tier',
        moduleId: 'mod-custom',
        moduleTitle: moduleTitle || 'Curriculum Milestone',
        isRequired,
        dueDate: dueDate || 'Flexible',
        submissionType: submissionType || 'GitHub Repo + Deployed Live URL',
        description: description || 'Capstone project specifications.',
        instructions: instructions || 'Complete project specifications according to rubric.',
        rubric: rubric || 'Standard rubric: Architecture (40%), Functionality (40%), Presentation (20%)',
        completionRequirement: completionRequirement || 'Passing score >= 80% with faculty evaluation',
        status
      });

      closeModal();
      showToast('Project Milestone Created', `Successfully initialized "${title}".`, 'success');
      renderRoute('/admin/projects');
    },
    saveProjectDetail: async (projectId) => {
      const title = document.getElementById('editProjTitle')?.value.trim();
      if (!title) {
        alert('Project title cannot be empty.');
        return;
      }
      const courseId = document.getElementById('editProjCourse')?.value;
      const tierId = document.getElementById('editProjTier')?.value;
      const moduleTitle = document.getElementById('editProjModule')?.value.trim();
      const isRequired = document.getElementById('editProjRequired')?.value === 'true';
      const dueDate = document.getElementById('editProjDueDate')?.value;
      const submissionType = document.getElementById('editProjSubmissionType')?.value.trim();
      const description = document.getElementById('editProjDesc')?.value.trim();
      const instructions = document.getElementById('editProjInstructions')?.value.trim();
      const rubric = document.getElementById('editProjRubric')?.value.trim();
      const completionRequirement = document.getElementById('editProjCompletion')?.value.trim();
      const status = document.getElementById('editProjStatus')?.value || 'Published';

      const courses = await Data.getCourses();
      const tiers = await Data.getTiers();
      const selectedCourse = courses.find(c => c.id === courseId);
      const selectedTier = tiers.find(t => t.id === tierId);

      await Data.saveProject({
        id: projectId,
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title : 'Curriculum Course',
        tierId,
        tierName: selectedTier ? selectedTier.name : 'Curriculum Tier',
        moduleTitle: moduleTitle || 'Curriculum Milestone',
        isRequired,
        dueDate,
        submissionType,
        description,
        instructions,
        rubric,
        completionRequirement,
        status
      });

      AppState.hasUnsavedChanges = false;
      const banner = document.getElementById('admDirtyBanner');
      if (banner) banner.remove();

      showToast('Project Milestone Saved', `Saved updates to "${title}".`, 'success');
      renderProjectDetailView(projectId);
    },
    duplicateProject: async (projectId) => {
      const cloned = await Data.duplicateProject(projectId);
      if (cloned) {
        showToast('Project Duplicated', `Created draft clone "${cloned.title}".`, 'success');
        navigateTo(`/admin/projects/${cloned.id}`);
      }
    },
    archiveProject: async (projectId) => {
      const p = await Data.getProjectById(projectId);
      if (!p) return;
      AdminComponents.ConfirmDialog({
        title: `Archive Project: ${p.title}`,
        message: 'Are you sure you want to archive this project milestone? Students will no longer see it in active coursework.',
        confirmText: 'Archive Milestone',
        isDestructive: true,
        onConfirm: async () => {
          await Data.archiveProject(projectId);
          showToast('Project Archived', `Archived project "${p.title}".`, 'warning');
          renderRoute(AppState.currentRoute);
        }
      });
    },
    previewProjectModal: async (projectId) => {
      const p = await Data.getProjectById(projectId);
      if (!p) return;

      const bodyHtml = `
        <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:12px;">
            <div>
              <span style="font-size:0.72rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); text-transform:uppercase;">${p.courseTitle} • ${p.moduleTitle || p.moduleId}</span>
              <h2 style="margin:4px 0 6px 0; color:var(--adm-text-primary); font-size:1.35rem;">${p.title}</h2>
              <div style="font-size:0.8rem; color:var(--adm-text-secondary);">${p.tierName || p.tierId}</div>
            </div>
            <div style="text-align:right;">
              ${AdminComponents.StatusBadge({ status: p.status })}
              <div style="margin-top:6px;"><span class="adm-badge ${p.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">${p.isRequired ? 'Required' : 'Optional'}</span></div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:12px; margin-bottom:16px; font-size:0.8rem;">
            <div><span style="color:var(--adm-text-muted);">Due Date:</span> <strong>${p.dueDate || 'Flexible'}</strong></div>
            <div><span style="color:var(--adm-text-muted);">Submission Type:</span> <strong style="color:var(--adm-primary); font-family:var(--adm-font-mono);">${p.submissionType || 'GitHub Repo'}</strong></div>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.85rem; color:var(--adm-text-primary); margin:0 0 4px 0;">Project Description</h4>
            <p style="font-size:0.82rem; color:var(--adm-text-secondary); line-height:1.5; margin:0;">${p.description || 'No description provided.'}</p>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.85rem; color:var(--adm-text-primary); margin:0 0 4px 0;">Student Instructions & Deliverables</h4>
            <div style="background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:12px; font-family:var(--adm-font-mono); font-size:0.78rem; line-height:1.5; white-space:pre-wrap; color:var(--adm-text-primary);">${p.instructions || 'Review module materials and complete deliverable.'}</div>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.85rem; color:var(--adm-text-primary); margin:0 0 4px 0;">Evaluation Rubric Specifications</h4>
            <div class="adm-rubric-box">
              <div style="font-size:0.8rem; color:var(--adm-text-secondary); white-space:pre-wrap; line-height:1.4;">${p.rubric || 'Standard rubric applied.'}</div>
            </div>
          </div>

          <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); border-radius:6px; padding:10px 14px; font-size:0.78rem; color:var(--adm-text-secondary);">
            <strong>Completion Requirement:</strong> ${p.completionRequirement || 'Passing score >= 80% with faculty evaluation'}
          </div>
        </div>
      `;

      openModal(`Student View Preview: ${p.title}`, bodyHtml);
    },

    // ========================================================================
    // PHASE 4: ASSIGNMENTS CONTROLLER METHODS
    // ========================================================================
    onAssignmentSearch: (val) => {
      AppState.assignmentsView.searchTerm = val;
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    onAssignmentCourseFilter: (val) => {
      AppState.assignmentsView.courseFilter = val;
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    onAssignmentRequiredFilter: (val) => {
      AppState.assignmentsView.requiredFilter = val;
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    onAssignmentStatusFilter: (val) => {
      AppState.assignmentsView.statusFilter = val;
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    onAssignmentSort: (val) => {
      AppState.assignmentsView.sortBy = val;
      renderAssignmentsView();
    },
    onAssignmentPageChange: (page) => {
      AppState.assignmentsView.currentPage = page;
      renderAssignmentsView();
    },
    onAssignmentPageSize: (size) => {
      AppState.assignmentsView.pageSize = Number(size);
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    resetAssignmentFilters: () => {
      AppState.assignmentsView.searchTerm = '';
      AppState.assignmentsView.courseFilter = 'ALL';
      AppState.assignmentsView.requiredFilter = 'ALL';
      AppState.assignmentsView.statusFilter = 'ALL';
      AppState.assignmentsView.sortBy = 'due-asc';
      AppState.assignmentsView.currentPage = 1;
      renderAssignmentsView();
    },
    exportAssignmentsList: async () => {
      const assignments = await Data.getAssignments();
      const headers = ['Assignment ID', 'Assignment Title', 'Course', 'Module', 'Requirement', 'Due Date', 'Submission Type', 'Max Points', 'Status', 'Review Requirements'];
      const csvRows = [headers.join(',')];
      assignments.forEach(a => {
        const row = [
          `"${a.id}"`,
          `"${(a.title || '').replace(/"/g, '""')}"`,
          `"${(a.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(a.moduleTitle || a.moduleId || '').replace(/"/g, '""')}"`,
          `"${a.isRequired ? 'Required' : 'Optional'}"`,
          `"${a.dueDate || ''}"`,
          `"${(a.submissionType || '').replace(/"/g, '""')}"`,
          `"${a.points || 100}"`,
          `"${a.status || ''}"`,
          `"${(a.reviewRequirements || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-assignments-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Assignments Exported', `Exported ${assignments.length} assignments to CSV.`, 'success');
    },
    openCreateAssignmentModal: async () => {
      const courses = await Data.getCourses();

      const bodyHtml = `
        <form id="createAssignmentForm" style="display:flex; flex-direction:column; gap:12px;">
          <div class="adm-form-group">
            <label class="adm-form-label">Assignment Title <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="newAsgTitle" required placeholder="e.g. Structured Output Extraction & JSON Validation">
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Course Curriculum <span class="adm-req-star">*</span></label>
              <select class="adm-select" id="newAsgCourse" style="width:100%;">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Module Association</label>
              <input type="text" class="adm-input" id="newAsgModule" placeholder="e.g. Module 01: Neural Foundations">
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Requirement Status</label>
              <select class="adm-select" id="newAsgRequired" style="width:100%;">
                <option value="true" selected>Required (Core curriculum)</option>
                <option value="false">Optional (Supplemental challenge)</option>
              </select>
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Due Date</label>
              <input type="date" class="adm-input" id="newAsgDueDate" value="${new Date(Date.now() + 7*86400000).toISOString().split('T')[0]}">
            </div>
          </div>

          <div class="adm-editor-grid">
            <div class="adm-form-group">
              <label class="adm-form-label">Submission Format</label>
              <input type="text" class="adm-input" id="newAsgSubmissionType" value="GitHub Repository" placeholder="e.g. GitHub Repository">
            </div>
            <div class="adm-form-group">
              <label class="adm-form-label">Maximum Points</label>
              <input type="number" class="adm-input" id="newAsgPoints" value="100">
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Student Instructions & Prompt Scenario</label>
            <textarea class="adm-textarea" id="newAsgInstructions" placeholder="Specific technical requirements, test cases, and problem description..." style="min-height:90px; font-family:var(--adm-font-mono); font-size:0.8rem;"></textarea>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Review Requirements & Verification Checks</label>
            <textarea class="adm-textarea" id="newAsgRequirements" placeholder="Criteria checked during faculty evaluation..." style="min-height:75px;"></textarea>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Status</label>
            <select class="adm-select" id="newAsgStatus" style="width:100%;">
              <option value="Open" selected>Open</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </form>
      `;

      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitCreateAssignment()">Create Assignment</button>
      `;

      openModal('Create New Assignment', bodyHtml, footerHtml);
    },
    submitCreateAssignment: async () => {
      const title = document.getElementById('newAsgTitle')?.value.trim();
      if (!title) {
        alert('Please enter an assignment title.');
        return;
      }
      const courseId = document.getElementById('newAsgCourse')?.value;
      const moduleTitle = document.getElementById('newAsgModule')?.value.trim();
      const isRequired = document.getElementById('newAsgRequired')?.value === 'true';
      const dueDate = document.getElementById('newAsgDueDate')?.value;
      const submissionType = document.getElementById('newAsgSubmissionType')?.value.trim();
      const points = Number(document.getElementById('newAsgPoints')?.value) || 100;
      const instructions = document.getElementById('newAsgInstructions')?.value.trim();
      const reviewRequirements = document.getElementById('newAsgRequirements')?.value.trim();
      const status = document.getElementById('newAsgStatus')?.value || 'Open';

      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);

      await Data.saveAssignment({
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title : 'Curriculum Course',
        moduleId: 'mod-custom',
        moduleTitle: moduleTitle || 'Curriculum Assignment',
        isRequired,
        dueDate: dueDate || 'Flexible',
        submissionType: submissionType || 'GitHub Repository',
        points,
        instructions: instructions || 'Complete code tasks according to guidelines.',
        reviewRequirements: reviewRequirements || 'Standard verification checks and automated unit tests.',
        status
      });

      closeModal();
      showToast('Assignment Created', `Successfully initialized "${title}".`, 'success');
      renderRoute('/admin/assignments');
    },
    saveAssignmentDetail: async (assignmentId) => {
      const title = document.getElementById('editAsgTitle')?.value.trim();
      if (!title) {
        alert('Assignment title cannot be empty.');
        return;
      }
      const courseId = document.getElementById('editAsgCourse')?.value;
      const moduleTitle = document.getElementById('editAsgModule')?.value.trim();
      const isRequired = document.getElementById('editAsgRequired')?.value === 'true';
      const dueDate = document.getElementById('editAsgDueDate')?.value;
      const submissionType = document.getElementById('editAsgSubmissionType')?.value.trim();
      const points = Number(document.getElementById('editAsgPoints')?.value) || 100;
      const instructions = document.getElementById('editAsgInstructions')?.value.trim();
      const reviewRequirements = document.getElementById('editAsgRequirements')?.value.trim();
      const status = document.getElementById('editAsgStatus')?.value || 'Open';

      const courses = await Data.getCourses();
      const selectedCourse = courses.find(c => c.id === courseId);

      await Data.saveAssignment({
        id: assignmentId,
        title,
        courseId,
        courseTitle: selectedCourse ? selectedCourse.title : 'Curriculum Course',
        moduleTitle: moduleTitle || 'Curriculum Assignment',
        isRequired,
        dueDate,
        submissionType,
        points,
        instructions,
        reviewRequirements,
        status
      });

      AppState.hasUnsavedChanges = false;
      const banner = document.getElementById('admDirtyBanner');
      if (banner) banner.remove();

      showToast('Assignment Saved', `Saved updates to "${title}".`, 'success');
      renderAssignmentDetailView(assignmentId);
    },
    duplicateAssignment: async (assignmentId) => {
      const cloned = await Data.duplicateAssignment(assignmentId);
      if (cloned) {
        showToast('Assignment Duplicated', `Created draft clone "${cloned.title}".`, 'success');
        navigateTo(`/admin/assignments/${cloned.id}`);
      }
    },
    archiveAssignment: async (assignmentId) => {
      const a = await Data.getAssignmentById(assignmentId);
      if (!a) return;
      AdminComponents.ConfirmDialog({
        title: `Archive Assignment: ${a.title}`,
        message: 'Are you sure you want to archive this assignment? It will be removed from active student queues.',
        confirmText: 'Archive Assignment',
        isDestructive: true,
        onConfirm: async () => {
          await Data.archiveAssignment(assignmentId);
          showToast('Assignment Archived', `Archived "${a.title}".`, 'warning');
          renderRoute(AppState.currentRoute);
        }
      });
    },
    previewAssignmentModal: async (assignmentId) => {
      const a = await Data.getAssignmentById(assignmentId);
      if (!a) return;

      const bodyHtml = `
        <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:12px;">
            <div>
              <span style="font-size:0.72rem; color:var(--adm-tertiary); font-family:var(--adm-font-mono); text-transform:uppercase;">${a.courseTitle} • ${a.moduleTitle || a.moduleId}</span>
              <h2 style="margin:4px 0 6px 0; color:var(--adm-text-primary); font-size:1.35rem;">${a.title}</h2>
              <div style="font-size:0.8rem; color:var(--adm-text-secondary); font-family:var(--adm-font-mono); font-weight:700;">Max Points: ${a.points || 100} pts</div>
            </div>
            <div style="text-align:right;">
              ${AdminComponents.StatusBadge({ status: a.status })}
              <div style="margin-top:6px;"><span class="adm-badge ${a.isRequired ? 'adm-badge-published' : 'adm-badge-draft'}">${a.isRequired ? 'Required' : 'Optional'}</span></div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:12px; margin-bottom:16px; font-size:0.8rem;">
            <div><span style="color:var(--adm-text-muted);">Due Date:</span> <strong>${a.dueDate || 'Flexible'}</strong></div>
            <div><span style="color:var(--adm-text-muted);">Submission Type:</span> <strong style="color:var(--adm-primary); font-family:var(--adm-font-mono);">${a.submissionType || 'GitHub Repository'}</strong></div>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.85rem; color:var(--adm-text-primary); margin:0 0 4px 0;">Student Instructions & Prompt Scenario</h4>
            <div style="background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:12px; font-family:var(--adm-font-mono); font-size:0.78rem; line-height:1.5; white-space:pre-wrap; color:var(--adm-text-primary);">${a.instructions || 'Review assignment scenario and push solutions.'}</div>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.85rem; color:var(--adm-text-primary); margin:0 0 4px 0;">Review Requirements & Verification Standards</h4>
            <div class="adm-rubric-box">
              <div style="font-size:0.8rem; color:var(--adm-text-secondary); white-space:pre-wrap; line-height:1.4;">${a.reviewRequirements || 'Standard review requirements.'}</div>
            </div>
          </div>
        </div>
      `;

      openModal(`Student View Preview: ${a.title}`, bodyHtml);
    },

    // ========================================================================
    // PHASE 4: STUDENT SUBMISSIONS & GRADING DESK
    // ========================================================================
    onSubmissionSearch: (val) => {
      AppState.submissionsView.searchTerm = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionCourseFilter: (val) => {
      AppState.submissionsView.courseFilter = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionBatchFilter: (val) => {
      AppState.submissionsView.batchFilter = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionItemFilter: (val) => {
      AppState.submissionsView.itemFilter = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionStatusFilter: (val) => {
      AppState.submissionsView.statusFilter = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionReviewerFilter: (val) => {
      AppState.submissionsView.reviewerFilter = val;
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    onSubmissionSort: (val) => {
      AppState.submissionsView.sortBy = val;
      renderSubmissionsView();
    },
    onSubmissionPageChange: (page) => {
      AppState.submissionsView.currentPage = page;
      renderSubmissionsView();
    },
    onSubmissionPageSize: (size) => {
      AppState.submissionsView.pageSize = Number(size);
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    resetSubmissionFilters: () => {
      AppState.submissionsView.searchTerm = '';
      AppState.submissionsView.courseFilter = 'ALL';
      AppState.submissionsView.batchFilter = 'ALL';
      AppState.submissionsView.itemFilter = 'ALL';
      AppState.submissionsView.statusFilter = 'ALL';
      AppState.submissionsView.reviewerFilter = 'ALL';
      AppState.submissionsView.sortBy = 'date-desc';
      AppState.submissionsView.currentPage = 1;
      renderSubmissionsView();
    },
    exportSubmissionsList: async () => {
      const submissions = await Data.getSubmissions();
      const headers = ['Submission ID', 'Student Name', 'Student Email', 'Deliverable Item', 'Type', 'Course', 'Batch (Cap 30)', 'Submitted Date', 'Status', 'Score', 'Reviewer', 'Last Updated', 'Feedback'];
      const csvRows = [headers.join(',')];
      submissions.forEach(s => {
        const row = [
          `"${s.id}"`,
          `"${(s.studentName || '').replace(/"/g, '""')}"`,
          `"${(s.studentEmail || '').replace(/"/g, '""')}"`,
          `"${(s.itemTitle || s.assignmentTitle || '').replace(/"/g, '""')}"`,
          `"${s.type || (s.itemId?.startsWith('prj-') ? 'Project' : 'Assignment')}"`,
          `"${(s.courseTitle || '').replace(/"/g, '""')}"`,
          `"${(s.batchName || '').replace(/"/g, '""')}"`,
          `"${s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : ''}"`,
          `"${s.status || ''}"`,
          `"${s.score !== null ? s.score : 'Pending'}"`,
          `"${(s.reviewer || 'Unassigned').replace(/"/g, '""')}"`,
          `"${s.lastUpdated ? new Date(s.lastUpdated).toLocaleDateString() : ''}"`,
          `"${(s.feedback || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexvion-submissions-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Submissions Exported', `Exported ${submissions.length} submission records to CSV.`, 'success');
    },
    openSubmissionReviewDrawer: async (submissionId) => {
      const sub = await Data.getSubmissionById(submissionId);
      if (!sub) return;

      const itemTitle = sub.itemTitle || sub.assignmentTitle || 'Deliverable Item';
      const isProject = sub.type === 'Project' || sub.itemId?.startsWith('prj-');
      const scoreVal = sub.score !== null && sub.score !== undefined ? sub.score : '';

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <!-- Top summary badge banner -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:#FAFAFC; border:1px solid var(--adm-border); border-radius:8px; padding:12px 14px;">
            <div>
              <span class="adm-badge ${isProject ? 'adm-badge-published' : 'adm-badge-upcoming'}" style="font-size:0.68rem; margin-bottom:4px;">
                ${isProject ? 'PROJECT CAPSTONE' : 'ASSIGNMENT'}
              </span>
              <h3 style="margin:2px 0 0; font-size:1.05rem; color:var(--adm-text-primary);">${itemTitle}</h3>
            </div>
            <div>
              ${AdminComponents.StatusBadge({ status: sub.status })}
            </div>
          </div>

          <!-- Student Information Card -->
          <div class="adm-card" style="padding:14px;">
            <h4 style="margin:0 0 10px 0; font-size:0.85rem; color:var(--adm-text-primary); border-bottom:1px solid var(--adm-border); padding-bottom:6px;">
              👤 Student Information
            </h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.8rem;">
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Student Name:</span>
                <strong>${sub.studentName}</strong>
              </div>
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Email:</span>
                <span style="font-family:var(--adm-font-mono);">${sub.studentEmail}</span>
              </div>
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Course Curriculum:</span>
                <span>${sub.courseTitle}</span>
              </div>
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Cohort Batch (Max 30):</span>
                <strong>${sub.batchName || 'Cohort'}</strong>
              </div>
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Submission Date:</span>
                <span style="font-family:var(--adm-font-mono);">${new Date(sub.submittedAt).toLocaleString()}</span>
              </div>
              <div>
                <span style="color:var(--adm-text-muted); display:block; font-size:0.72rem;">Last Updated:</span>
                <span style="font-family:var(--adm-font-mono);">${sub.lastUpdated ? new Date(sub.lastUpdated).toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>

          <!-- Submitted Content Placeholder -->
          <div class="adm-card" style="padding:14px;">
            <h4 style="margin:0 0 10px 0; font-size:0.85rem; color:var(--adm-text-primary); border-bottom:1px solid var(--adm-border); padding-bottom:6px;">
              📦 Submitted Content & Artifacts (UI Placeholder)
            </h4>
            
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:0.72rem; color:var(--adm-text-muted); text-transform:uppercase;">Live Production URL / Deployed Instance</div>
                  <a href="${sub.liveUrlPlaceholder || '#'}" target="_blank" class="adm-submission-link" onclick="event.preventDefault(); showToast('Demo URL Link', 'Opening simulated deployment instance placeholder.', 'info');">
                    🔗 ${sub.liveUrlPlaceholder || `https://app.nexvion.io/sandbox/${sub.id}`}
                  </a>
                </div>
                <span class="adm-badge adm-badge-open" style="font-size:0.65rem;">LIVE</span>
              </div>

              <div style="background:#FFFFFF; border:1px solid var(--adm-border); border-radius:6px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:0.72rem; color:var(--adm-text-muted); text-transform:uppercase;">Source Code Repository</div>
                  <a href="${sub.repoUrlPlaceholder || '#'}" target="_blank" class="adm-submission-link" onclick="event.preventDefault(); showToast('Repository Link', 'Navigating to source repository placeholder.', 'info');">
                    🐙 ${sub.repoUrlPlaceholder || `https://github.com/nexvion-cohort/${sub.studentId}-${sub.itemId || 'work'}`}
                  </a>
                </div>
                <span class="adm-badge adm-badge-published" style="font-size:0.65rem;">GIT</span>
              </div>

              ${sub.studentNotes ? `
                <div style="background:#FAFAFC; border:1px solid var(--adm-border); border-radius:6px; padding:10px 12px;">
                  <div style="font-size:0.72rem; color:var(--adm-text-muted); text-transform:uppercase; margin-bottom:4px;">Student Submission Statement</div>
                  <p style="margin:0; font-size:0.8rem; color:var(--adm-text-secondary); line-height:1.4;">${sub.studentNotes}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Review Instructions & Rubric Context -->
          <div class="adm-card" style="padding:14px; background:#FAFAFC;">
            <h4 style="margin:0 0 8px 0; font-size:0.85rem; color:var(--adm-text-primary);">
              📋 Evaluation Criteria & Review Instructions
            </h4>
            <p style="margin:0; font-size:0.78rem; color:var(--adm-text-secondary); line-height:1.45;">
              Verify architectural correctness, schema validation compliance, test coverage, and clear prompt system constraints. Passing score standard requires >= 80%.
            </p>
          </div>

          <!-- Faculty Grading Form -->
          <form id="submissionReviewForm" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:12px;">
            <div class="adm-editor-grid">
              <div class="adm-form-group">
                <label class="adm-form-label">Reviewer Context</label>
                <select class="adm-select" id="subReviewerSelect" style="width:100%;">
                  <option value="Dr. Evelyn Vance" ${sub.reviewer === 'Dr. Evelyn Vance' ? 'selected' : ''}>Dr. Evelyn Vance (Lead AI Faculty)</option>
                  <option value="Marcus Chen" ${sub.reviewer === 'Marcus Chen' ? 'selected' : ''}>Marcus Chen (Curriculum Architect)</option>
                  <option value="Academic Desk" ${sub.reviewer === 'Academic Desk' ? 'selected' : ''}>Academic Review Desk</option>
                  <option value="Super Admin" ${sub.reviewer === 'Super Admin' ? 'selected' : ''}>Super Admin Console</option>
                </select>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Score (Placeholder 0–100) <span class="adm-req-star">*</span></label>
                <input type="number" class="adm-input" id="subReviewScore" min="0" max="100" value="${scoreVal}" placeholder="e.g. 92" required>
                <span class="adm-form-help">Enter evaluation score out of 100 points.</span>
              </div>
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Student Feedback (Visible to Learner)</label>
              <textarea class="adm-textarea" id="subStudentFeedback" placeholder="Provide constructive feedback, code observations, and improvement recommendations..." style="min-height:90px; font-size:0.82rem;">${sub.feedback || ''}</textarea>
            </div>

            <div class="adm-form-group">
              <label class="adm-form-label">Internal Reviewer Note (Confidential Staff Note)</label>
              <textarea class="adm-textarea" id="subInternalNote" placeholder="Internal observations, integrity flags, or faculty notes..." style="min-height:60px; font-size:0.82rem;">${sub.internalReviewerNote || ''}</textarea>
            </div>

            <!-- Workflow Action Buttons -->
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
              <div style="display:flex; gap:8px;">
                <button type="button" class="adm-btn adm-btn-secondary" style="flex:1;" onclick="NexvionAdminApp.submitReturnForRevision('${sub.id}')">
                  ↩️ Return for Revision
                </button>
                <button type="button" class="adm-btn adm-btn-secondary" style="flex:1;" onclick="NexvionAdminApp.submitGradeSubmission('${sub.id}')">
                  ✓ Mark as Reviewed
                </button>
              </div>
              <button type="button" class="adm-btn adm-btn-primary" style="width:100%;" onclick="NexvionAdminApp.submitApproveCompletion('${sub.id}')">
                ★ Approve Completion (Pass & Credit)
              </button>
            </div>
          </form>
        </div>
      `;

      openDrawer(`Review Deliverable: ${itemTitle}`, bodyHtml);
    },
    submitGradeSubmission: async (submissionId) => {
      const scoreInput = document.getElementById('subReviewScore')?.value;
      const feedback = document.getElementById('subStudentFeedback')?.value.trim();
      const internalNote = document.getElementById('subInternalNote')?.value.trim();
      const reviewer = document.getElementById('subReviewerSelect')?.value || 'Academic Desk';

      if (scoreInput === '' || isNaN(Number(scoreInput))) {
        alert('Please enter a valid numeric score (0–100).');
        return;
      }
      const score = Math.max(0, Math.min(100, Number(scoreInput)));

      await Data.gradeSubmission(submissionId, {
        score,
        feedback: feedback || 'Submission evaluated and confirmed by reviewer.',
        internalNote,
        reviewer,
        status: 'Reviewed'
      });

      closeDrawer();
      showToast('Submission Evaluated', `Saved score (${score}/100) and marked as Reviewed.`, 'success');
      renderRoute(AppState.currentRoute);
    },
    submitReturnForRevision: async (submissionId) => {
      const feedback = document.getElementById('subStudentFeedback')?.value.trim();
      const internalNote = document.getElementById('subInternalNote')?.value.trim();
      const reviewer = document.getElementById('subReviewerSelect')?.value || 'Academic Desk';

      if (!feedback) {
        alert('Please provide student feedback explaining what needs to be revised before returning.');
        return;
      }

      await Data.returnSubmissionForRevision(submissionId, feedback, internalNote, reviewer);
      closeDrawer();
      showToast('Returned for Revision', 'Submission returned to student with revision notes.', 'warning');
      renderRoute(AppState.currentRoute);
    },
    submitApproveCompletion: async (submissionId) => {
      let scoreInput = document.getElementById('subReviewScore')?.value;
      const feedback = document.getElementById('subStudentFeedback')?.value.trim();
      const internalNote = document.getElementById('subInternalNote')?.value.trim();
      const reviewer = document.getElementById('subReviewerSelect')?.value || 'Academic Desk';

      let score = Number(scoreInput);
      if (isNaN(score) || score < 80) {
        score = 88;
      }

      await Data.approveSubmissionCompletion(submissionId, feedback, internalNote, reviewer, score);
      closeDrawer();
      showToast('Completion Approved', `Milestone approved with passing score (${score}/100).`, 'success');
      renderRoute(AppState.currentRoute);
    },
    openGradeSubmissionModal: (subId) => {
      if (subId) {
        NexvionAdminApp.openSubmissionReviewDrawer(subId);
      } else {
        NexvionAdminApp.navigateTo('/admin/submissions');
      }
    },

    // --- Forward-Compatible Action Stubs ---
    openEditBatchModal: (batchId) => NexvionAdminApp.openBatchDetailDrawer(batchId),
    openEditTierModal: () => showToast('Tier Configuration', 'Tier specifications are defined at platform level.', 'info'),
    openCreateClassModal: () => showToast('Class Management', 'Class scheduling enabled in Phase 3.', 'info'),
    openCreateModuleModal: () => showToast('Curriculum Management', 'Module creator enabled in Phase 3.', 'info'),
    openCreateAnnouncementModal: () => NexvionAdminApp.navigateTo('/admin/announcements/new'),
    saveSettingsForm: () => showToast('Settings Saved', 'Platform configuration updated.', 'success'),

    // =========================================================================
    // PHASE 5: ANNOUNCEMENT CONTROLLERS
    // =========================================================================
    onAnnouncementSearch: (query) => {
      AppState.announcementsView.searchTerm = query;
      AppState.announcementsView.currentPage = 1;
      renderAnnouncementsView();
    },

    onAnnouncementAudienceFilter: (val) => {
      AppState.announcementsView.audienceFilter = val;
      AppState.announcementsView.currentPage = 1;
      renderAnnouncementsView();
    },

    onAnnouncementStatusFilter: (val) => {
      AppState.announcementsView.statusFilter = val;
      AppState.announcementsView.currentPage = 1;
      renderAnnouncementsView();
    },

    onAnnouncementPriorityFilter: (val) => {
      AppState.announcementsView.priorityFilter = val;
      AppState.announcementsView.currentPage = 1;
      renderAnnouncementsView();
    },

    onAnnouncementSort: (val) => {
      AppState.announcementsView.sortBy = val;
      renderAnnouncementsView();
    },

    onAnnouncementPageChange: (page) => {
      AppState.announcementsView.currentPage = Math.max(1, page);
      renderAnnouncementsView();
    },

    resetAnnouncementFilters: () => {
      AppState.announcementsView = {
        searchTerm: '',
        audienceFilter: 'ALL',
        statusFilter: 'ALL',
        priorityFilter: 'ALL',
        sortBy: 'date-desc',
        currentPage: 1,
        pageSize: 10
      };
      renderAnnouncementsView();
      showToast('Filters Reset', 'Announcement filters cleared.', 'info');
    },

    openAnnouncementPreviewModal: async (id) => {
      const a = await Data.getAnnouncementById(id);
      if (!a) return;
      const reach = a.estimatedRecipients || calculateAudienceReach(a.audience, a.targetCourseId, a.targetTierId, a.targetBatchId);
      const dateStr = a.status === 'Scheduled' && a.scheduledFor
        ? `Scheduled for: ${new Date(a.scheduledFor).toLocaleString()}`
        : a.publishedAt
          ? `Published: ${new Date(a.publishedAt).toLocaleDateString()}`
          : 'Draft Status';

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; border-bottom:1px solid var(--adm-border); padding-bottom:12px;">
            <span class="adm-badge adm-badge-published">${a.audience}</span>
            ${AdminComponents.PriorityBadge({ priority: a.priority || 'Normal' })}
            ${AdminComponents.StatusBadge({ status: a.status })}
            <span style="font-size:0.75rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono); margin-left:auto;">
              ${reach.toLocaleString()} recipients • ${dateStr}
            </span>
          </div>

          <div>
            <h3 style="margin:0 0 6px 0; font-size:1.15rem; color:var(--adm-text-primary);">${escapeHtml(a.title)}</h3>
            <p style="margin:0 0 12px 0; font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">${escapeHtml(a.message || a.body || '')}</p>
          </div>

          <div style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:8px; padding:16px; font-size:0.88rem; line-height:1.7;">
            ${renderMarkdownPreview(a.richContent || a.message || a.body)}
          </div>

          <div style="font-size:0.75rem; color:var(--adm-text-muted); display:flex; justify-content:space-between;">
            <span>Author: <strong>${escapeHtml(a.author || 'Academic Director')}</strong></span>
            <span>Target: <strong>${escapeHtml(a.targetName || 'All Cohorts')}</strong></span>
          </div>
        </div>
      `;

      const footerHtml = `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeModal(); NexvionAdminApp.navigateTo('/admin/announcements/${a.id}')">Edit Announcement</button>
      `;

      openModal(`Announcement Preview: ${a.title}`, bodyHtml, footerHtml);
    },

    duplicateAnnouncement: async (id) => {
      const clone = await Data.duplicateAnnouncement(id);
      if (clone) {
        showToast('Notice Cloned', `Draft copy created: "${clone.title}".`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },

    publishAnnouncement: async (id) => {
      if (!confirm('Publish this announcement now? It will become visible to all targeted learners.')) {
        return;
      }
      const updated = await Data.publishAnnouncement(id);
      if (updated) {
        showToast('Announcement Published', `Notice "${updated.title}" is now active platform-wide.`, 'success');
        renderRoute(AppState.currentRoute);
      }
    },

    archiveAnnouncement: async (id) => {
      if (!confirm('Archive this announcement? It will be archived and hidden from public portal feeds.')) {
        return;
      }
      const updated = await Data.archiveAnnouncement(id);
      if (updated) {
        showToast('Announcement Archived', `Notice "${updated.title}" moved to archive.`, 'info');
        renderRoute(AppState.currentRoute);
      }
    },

    onAnnouncementComposerChange: (field, val) => {
      AppState.announcementComposer[field] = val;
      AppState.hasUnsavedChanges = true;

      if (field === 'audience') {
        const courseGrp = document.getElementById('ancCourseSelectGroup');
        const tierGrp = document.getElementById('ancTierSelectGroup');
        const batchGrp = document.getElementById('ancBatchSelectGroup');

        if (courseGrp) courseGrp.style.display = ['Specific Course', 'Specific Tier', 'Specific Batch'].includes(val) ? 'block' : 'none';
        if (tierGrp) tierGrp.style.display = val === 'Specific Tier' ? 'block' : 'none';
        if (batchGrp) batchGrp.style.display = val === 'Specific Batch' ? 'block' : 'none';
      }

      if (field === 'status') {
        const schedGrp = document.getElementById('ancScheduleGroup');
        if (schedGrp) schedGrp.style.display = val === 'Scheduled' ? 'block' : 'none';
      }

      // Update reach count
      const comp = AppState.announcementComposer;
      const reachEl = document.getElementById('ancAudienceReachCount');
      if (reachEl) {
        const reach = calculateAudienceReach(comp.audience, comp.targetCourseId, comp.targetTierId, comp.targetBatchId);
        reachEl.textContent = reach.toLocaleString();
      }

      // Update word count
      const wordCountEl = document.getElementById('ancWordCount');
      if (wordCountEl && field === 'richContent') {
        const words = (val || '').split(/\s+/).filter(Boolean).length;
        wordCountEl.textContent = `${words} words`;
      }
    },

    setComposerTab: (tab) => {
      const titleEl = document.getElementById('ancComposerTitle');
      const msgEl = document.getElementById('ancComposerMessage');
      const richEl = document.getElementById('ancComposerRichContent');

      if (titleEl) AppState.announcementComposer.title = titleEl.value;
      if (msgEl) AppState.announcementComposer.message = msgEl.value;
      if (richEl) AppState.announcementComposer.richContent = richEl.value;

      AppState.announcementComposer.activeTab = tab;
      renderAnnouncementComposerView(AppState.announcementComposer.id);
    },

    insertMarkdown: (prefix, suffix = prefix) => {
      const textarea = document.getElementById('ancComposerRichContent');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selection = text.substring(start, end);

      const replacement = prefix + (selection || 'text') + suffix;
      textarea.value = text.substring(0, start) + replacement + text.substring(end);
      AppState.announcementComposer.richContent = textarea.value;
      AppState.hasUnsavedChanges = true;

      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selection || 'text').length);
    },

    saveAnnouncementDraft: async () => {
      const titleEl = document.getElementById('ancComposerTitle');
      const msgEl = document.getElementById('ancComposerMessage');
      const richEl = document.getElementById('ancComposerRichContent');

      const title = titleEl ? titleEl.value.trim() : AppState.announcementComposer.title;
      if (!title) {
        showToast('Validation Error', 'Please enter a title for this draft announcement.', 'error');
        if (titleEl) titleEl.focus();
        return;
      }

      const comp = AppState.announcementComposer;
      const payload = {
        id: comp.id || `anc-${Date.now()}`,
        title: title,
        message: msgEl ? msgEl.value.trim() : comp.message,
        body: msgEl ? msgEl.value.trim() : comp.message,
        richContent: richEl ? richEl.value : comp.richContent,
        audience: comp.audience,
        targetCourseId: comp.targetCourseId,
        targetTierId: comp.targetTierId,
        targetBatchId: comp.targetBatchId,
        priority: comp.priority,
        status: 'Draft',
        scheduledFor: null,
        author: comp.author || 'Super Admin',
        estimatedRecipients: calculateAudienceReach(comp.audience, comp.targetCourseId, comp.targetTierId, comp.targetBatchId)
      };

      await Data.saveAnnouncement(payload);
      AppState.hasUnsavedChanges = false;
      showToast('Draft Saved', `Announcement draft "${payload.title}" saved.`, 'success');
      navigateTo('/admin/announcements');
    },

    submitAnnouncementComposer: async (publishNow = true) => {
      const titleEl = document.getElementById('ancComposerTitle');
      const msgEl = document.getElementById('ancComposerMessage');
      const richEl = document.getElementById('ancComposerRichContent');

      const title = titleEl ? titleEl.value.trim() : AppState.announcementComposer.title;
      const message = msgEl ? msgEl.value.trim() : AppState.announcementComposer.message;
      const richContent = richEl ? richEl.value : AppState.announcementComposer.richContent;

      if (!title) {
        showToast('Validation Error', 'Announcement title is required.', 'error');
        if (titleEl) titleEl.focus();
        return;
      }

      if (!message) {
        showToast('Validation Error', 'Summary teaser message is required.', 'error');
        if (msgEl) msgEl.focus();
        return;
      }

      const comp = AppState.announcementComposer;
      let finalStatus = comp.status;
      if (publishNow) {
        finalStatus = comp.scheduledDate ? 'Scheduled' : 'Published';
      }

      const payload = {
        id: comp.id || `anc-${Date.now()}`,
        title: title,
        message: message,
        body: message,
        richContent: richContent || message,
        audience: comp.audience,
        targetCourseId: comp.targetCourseId,
        targetTierId: comp.targetTierId,
        targetBatchId: comp.targetBatchId,
        priority: comp.priority,
        status: finalStatus,
        publishedAt: finalStatus === 'Published' ? new Date().toISOString() : null,
        scheduledFor: finalStatus === 'Scheduled' && comp.scheduledDate ? new Date(comp.scheduledDate).toISOString() : null,
        author: comp.author || 'Super Admin',
        estimatedRecipients: calculateAudienceReach(comp.audience, comp.targetCourseId, comp.targetTierId, comp.targetBatchId)
      };

      await Data.saveAnnouncement(payload);
      AppState.hasUnsavedChanges = false;
      showToast(
        finalStatus === 'Published' ? 'Announcement Published' : finalStatus === 'Scheduled' ? 'Release Scheduled' : 'Announcement Saved',
        `Notice "${payload.title}" has been saved with ${finalStatus} status.`,
        'success'
      );
      navigateTo('/admin/announcements');
    },

    // =========================================================================
    // PHASE 5: NOTIFICATION ENGINE CONTROLLERS
    // =========================================================================
    onNotificationSearch: (query) => {
      AppState.notificationsView.searchTerm = query;
      AppState.notificationsView.currentPage = 1;
      renderNotificationsView();
    },

    onNotificationTypeFilter: (val) => {
      AppState.notificationsView.typeFilter = val;
      AppState.notificationsView.currentPage = 1;
      renderNotificationsView();
    },

    onNotificationStatusFilter: (val) => {
      AppState.notificationsView.statusFilter = val;
      AppState.notificationsView.currentPage = 1;
      renderNotificationsView();
    },

    onNotificationSort: (val) => {
      AppState.notificationsView.sortBy = val;
      renderNotificationsView();
    },

    onNotificationPageChange: (page) => {
      AppState.notificationsView.currentPage = Math.max(1, page);
      renderNotificationsView();
    },

    resetNotificationFilters: () => {
      AppState.notificationsView = {
        searchTerm: '',
        typeFilter: 'ALL',
        statusFilter: 'ALL',
        sortBy: 'date-desc',
        currentPage: 1,
        pageSize: 10
      };
      renderNotificationsView();
      showToast('Filters Reset', 'Notification filters cleared.', 'info');
    },

    updateNotificationComposerSync: () => {
      const titleEl = document.getElementById('notifTitle');
      const msgEl = document.getElementById('notifMsg');
      const typeEl = document.getElementById('notifType');
      const courseEl = document.getElementById('notifCourse');
      const tierEl = document.getElementById('notifTier');
      const batchEl = document.getElementById('notifBatch');
      const schedEl = document.getElementById('notifScheduledFor');

      const comp = AppState.notificationComposer;
      if (titleEl) comp.title = titleEl.value;
      if (msgEl) comp.message = msgEl.value;
      if (typeEl) comp.type = typeEl.value;
      if (courseEl) comp.courseId = courseEl.value;
      if (tierEl) comp.tierId = tierEl.value;
      if (batchEl) comp.batchId = batchEl.value;
      if (schedEl) comp.scheduledFor = schedEl.value;

      // Update phone simulator live banner
      const prevTitle = document.getElementById('phonePreviewTitle');
      const prevBody = document.getElementById('phonePreviewBody');
      const reachCountEl = document.getElementById('simulatorReachCount');

      if (prevTitle) prevTitle.textContent = comp.title || 'Live Class Starting in 30 Minutes';
      if (prevBody) prevBody.textContent = comp.message || 'Class 01: Transformers, Tokens & Attention Mechanisms starts at 18:00 UTC in Virtual Nexus Hall A.';

      if (reachCountEl) {
        const reach = calculateAudienceReach(comp.audience, comp.courseId, comp.tierId, comp.batchId);
        reachCountEl.textContent = `${reach.toLocaleString()} students`;
      }
    },

    updateNotificationAudienceTargets: (val) => {
      AppState.notificationComposer.audience = val;
      const detailsRow = document.getElementById('notifTargetDetailsRow');
      if (detailsRow) {
        detailsRow.style.display = val === 'All Enrolled Students' ? 'none' : 'grid';
      }
      NexvionAdminApp.updateNotificationComposerSync();
    },

    toggleChannel: (channel, isChecked) => {
      const comp = AppState.notificationComposer;
      if (isChecked) {
        if (!comp.channels.includes(channel)) comp.channels.push(channel);
      } else {
        comp.channels = comp.channels.filter(c => c !== channel);
      }
      const channelsListEl = document.getElementById('simulatorChannelsList');
      if (channelsListEl) {
        channelsListEl.textContent = comp.channels.length > 0 ? comp.channels.join(', ') : 'None selected';
      }
    },

    onTimingModeChange: (mode) => {
      AppState.notificationComposer.scheduleMode = mode;
      const schedWrap = document.getElementById('notifScheduledDateWrap');
      if (schedWrap) {
        schedWrap.style.display = mode === 'scheduled' ? 'block' : 'none';
      }
    },

    previewNotificationOnDevice: async (notifId) => {
      let notif = null;
      if (notifId) {
        notif = await Data.getNotificationById(notifId);
      }
      const comp = notif || AppState.notificationComposer;
      const channels = Array.isArray(comp.channels) ? comp.channels : [comp.channels || 'In-App'];

      const bodyHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          <div class="adm-phone-preview" style="width:100%; max-width:320px;">
            <div class="adm-phone-notch"></div>
            <div class="adm-phone-clock">09:41</div>
            <div class="adm-phone-date">Friday, October 9</div>

            <div class="adm-lockscreen-banner">
              <div class="adm-lockscreen-header">
                <div class="adm-lockscreen-app">
                  <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:linear-gradient(135deg, #7F52FF, #00D2B4);"></span>
                  NEXVION AI
                </div>
                <span>NOW</span>
              </div>
              <div class="adm-lockscreen-title">
                ${escapeHtml(comp.title || 'Live Class Starting in 30 Minutes')}
              </div>
              <div class="adm-lockscreen-body">
                ${escapeHtml(comp.message || 'Class 01: Transformers, Tokens & Attention Mechanisms starts at 18:00 UTC.')}
              </div>
            </div>

            <div style="margin-top:20px; text-align:center; font-size:0.68rem; color:#64748B;">
              Simulated Lockscreen Delivery
            </div>
          </div>

          <div style="width:100%; font-size:0.8rem; background:var(--adm-surface-elevated); padding:12px; border-radius:6px; border:1px solid var(--adm-border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:var(--adm-text-muted);">Audience:</span>
              <strong>${escapeHtml(comp.audience || 'All Enrolled Students')}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:var(--adm-text-muted);">Type:</span>
              <strong>${escapeHtml(comp.type || 'System message')}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--adm-text-muted);">Channels:</span>
              <span style="color:var(--adm-tertiary);">${channels.join(', ')}</span>
            </div>
          </div>
        </div>
      `;

      openModal(`Device Push Preview: ${comp.title || 'Notification'}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
      `);
    },

    submitTestNotification: async () => {
      const titleEl = document.getElementById('notifTitle');
      const msgEl = document.getElementById('notifMsg');
      const title = titleEl ? titleEl.value.trim() : AppState.notificationComposer.title;
      const message = msgEl ? msgEl.value.trim() : AppState.notificationComposer.message;

      if (!title || !message) {
        showToast('Validation Error', 'Please enter a notification title and message payload before sending a test.', 'error');
        if (titleEl && !title) titleEl.focus();
        return;
      }

      const comp = AppState.notificationComposer;
      await Data.sendTestNotification({
        title,
        message,
        type: comp.type,
        audience: comp.audience,
        courseId: comp.courseId,
        tierId: comp.tierId,
        batchId: comp.batchId,
        channels: comp.channels
      });

      showToast(
        'Test Notification Dispatched',
        'Notification prepared successfully. Delivery will be enabled after backend integration.',
        'info'
      );
      renderNotificationsView();
    },

    submitNotificationBroadcast: async () => {
      const titleEl = document.getElementById('notifTitle');
      const msgEl = document.getElementById('notifMsg');
      const title = titleEl ? titleEl.value.trim() : AppState.notificationComposer.title;
      const message = msgEl ? msgEl.value.trim() : AppState.notificationComposer.message;

      if (!title || !message) {
        showToast('Validation Error', 'Notification title and payload message are required.', 'error');
        if (titleEl && !title) titleEl.focus();
        return;
      }

      const comp = AppState.notificationComposer;
      const scheduledFor = comp.scheduleMode === 'scheduled' && comp.scheduledFor
        ? new Date(comp.scheduledFor).toISOString()
        : null;

      const recipientCount = calculateAudienceReach(comp.audience, comp.courseId, comp.tierId, comp.batchId);
      const idempotencyKey = `adm-notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const result = await Data.sendNotification({
        title,
        message,
        type: comp.type,
        audience: comp.audience,
        courseId: comp.courseId,
        tierId: comp.tierId,
        batchId: comp.batchId,
        channels: comp.channels,
        scheduledFor,
        recipientCount,
        idempotencyKey
      });

      const succ = result && result.successCount !== undefined ? result.successCount : recipientCount;
      const fail = result && result.failureCount !== undefined ? result.failureCount : 0;

      showToast(
        scheduledFor ? 'Broadcast Scheduled' : 'Broadcast Dispatched',
        scheduledFor
          ? `Notification scheduled for ${new Date(scheduledFor).toLocaleString()}.`
          : `Delivered to ${succ} recipient(s)${fail > 0 ? `, ${fail} failed.` : '.'}`,
        fail > 0 && succ === 0 ? 'warning' : 'success'
      );

      // Reset form
      AppState.notificationComposer.title = '';
      AppState.notificationComposer.message = '';
      AppState.notificationComposer.scheduledFor = '';
      if (titleEl) titleEl.value = '';
      if (msgEl) msgEl.value = '';

      renderNotificationsView();
    },

    cancelScheduledNotification: async (id) => {
      if (!confirm('Cancel this scheduled notification dispatch?')) return;
      await Data.cancelNotification(id);
      showToast('Dispatch Cancelled', 'Scheduled broadcast has been cancelled.', 'warning');
      renderNotificationsView();
    },

    resendNotification: async (id) => {
      const orig = await Data.getNotificationById(id);
      if (!orig) return;
      const idempotencyKey = `adm-resend-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const result = await Data.sendNotification({
        title: orig.title,
        message: orig.message,
        type: orig.type,
        audience: orig.audience,
        courseId: orig.courseId,
        tierId: orig.tierId,
        batchId: orig.batchId,
        channels: orig.channels,
        recipientCount: orig.recipientCount,
        idempotencyKey
      });
      const succ = result && result.successCount !== undefined ? result.successCount : orig.recipientCount;
      showToast('Notification Re-queued', `Re-dispatched successfully to ${succ} recipient(s).`, 'success');
      renderNotificationsView();
    },

    // Backward-Compatible Facade Handlers
    sendNotification: async () => NexvionAdminApp.submitNotificationBroadcast(),
    sendNotificationTest: async () => NexvionAdminApp.submitTestNotification(),
    sendNotificationMock: function() { return NexvionAdminApp.submitNotificationBroadcast(); },
    sendNotificationTestMock: function() { return NexvionAdminApp.submitTestNotification(); },

    // =========================================================================
    // PHASE 6: PAYMENT ADMINISTRATION CONTROLLERS
    // =========================================================================
    onPaymentSearch: (query) => {
      AppState.paymentsView.searchTerm = query;
      AppState.paymentsView.currentPage = 1;
      renderPaymentsView();
    },

    onPaymentDateRangeFilter: (val) => {
      AppState.paymentsView.dateRangeFilter = val;
      AppState.paymentsView.currentPage = 1;
      renderPaymentsView();
    },

    onPaymentCourseFilter: (val) => {
      AppState.paymentsView.courseFilter = val;
      AppState.paymentsView.currentPage = 1;
      renderPaymentsView();
    },

    onPaymentTierFilter: (val) => {
      AppState.paymentsView.tierFilter = val;
      AppState.paymentsView.currentPage = 1;
      renderPaymentsView();
    },

    onPaymentStatusFilter: (val) => {
      AppState.paymentsView.statusFilter = val;
      AppState.paymentsView.currentPage = 1;
      renderPaymentsView();
    },

    onPaymentSort: (val) => {
      AppState.paymentsView.sortBy = val;
      renderPaymentsView();
    },

    onPaymentPageChange: (page) => {
      AppState.paymentsView.currentPage = Math.max(1, page);
      renderPaymentsView();
    },

    resetPaymentFilters: () => {
      AppState.paymentsView = {
        searchTerm: '',
        courseFilter: 'ALL',
        tierFilter: 'ALL',
        statusFilter: 'ALL',
        dateRangeFilter: 'ALL',
        sortBy: 'date-desc',
        currentPage: 1,
        pageSize: 10
      };
      renderPaymentsView();
      showToast('Filters Reset', 'Payment filters restored to defaults.', 'info');
    },

    openPaymentDetail: async (paymentId) => {
      const p = await Data.getPaymentById(paymentId);
      if (!p) {
        showToast('Payment Not Found', `Record "${paymentId}" does not exist.`, 'error');
        return;
      }
      AppState.activePaymentId = paymentId;

      const bodyHtml = `
        <div style="padding:20px;">
          <!-- Top Card -->
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h3 style="margin:0 0 4px 0; font-size:1.1rem; color:var(--adm-text-primary);">${escapeHtml(p.studentName)}</h3>
                <div style="font-size:0.8rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${escapeHtml(p.studentEmail)}</div>
              </div>
              <div>${AdminComponents.StatusBadge({ status: p.status })}</div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.82rem; padding-top:10px; border-top:1px solid var(--adm-border);">
              <div><span style="color:var(--adm-text-muted);">Course:</span> <strong style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(p.courseTitle)}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Tier & Cohort:</span> <strong style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(p.tierName)} • ${escapeHtml(p.batchName || 'General')}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Transaction Ref:</span> <code style="display:block; color:var(--adm-tertiary); margin-top:2px; font-size:0.75rem;">${escapeHtml(p.transactionRef)}</code></div>
              <div><span style="color:var(--adm-text-muted);">Invoice Number:</span> <code style="display:block; color:var(--adm-primary); margin-top:2px; font-size:0.75rem;">${escapeHtml(p.invoiceId)}</code></div>
              <div><span style="color:var(--adm-text-muted);">Payment Date:</span> <span style="display:block; color:var(--adm-text-secondary); margin-top:2px;">${escapeHtml(p.date)}</span></div>
              <div><span style="color:var(--adm-text-muted);">Method:</span> <span style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(p.method)}</span></div>
              <div><span style="color:var(--adm-text-muted);">Amount & Currency:</span> <strong style="display:block; color:var(--adm-primary); margin-top:2px;">${p.amountDisplay} (${escapeHtml(p.currency || 'USD')})</strong></div>
              <div><span style="color:var(--adm-text-muted);">Provider:</span> <span style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(p.provider || 'Nexvion Gateway')}</span></div>
              <div><span style="color:var(--adm-text-muted);">Verification Status:</span> <span style="display:block; margin-top:2px;"><span class="adm-badge ${p.verificationStatus === 'Verified' ? 'adm-badge-published' : p.verificationStatus === 'Exempt' ? 'adm-badge-open' : 'adm-badge-pending'}" style="font-size:0.75rem;">${escapeHtml(p.verificationStatus || 'Pending')}</span></span></div>
            </div>
          </div>

          <!-- Gateway Staging Callout -->
          <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.8rem; color:var(--adm-text-secondary); line-height:1.45;">
            <strong style="color:var(--adm-primary);">Integration Notice:</strong> Payment processing will be connected during backend integration. Non-free tier tuition displays <code>PRICE COMING SOON</code>.
          </div>

          <!-- Internal Audit & Memo -->
          <div class="adm-card" style="margin-bottom:20px;">
            <h4 style="margin:0 0 8px 0; font-size:0.92rem; color:var(--adm-text-primary);">Audit Trail & Internal Notes</h4>
            <div style="background:var(--adm-surface-elevated); padding:12px; border-radius:6px; border:1px solid var(--adm-border); font-size:0.82rem; color:var(--adm-text-secondary); line-height:1.5;">
              ${escapeHtml(p.notes || 'No internal memos logged for this transaction.')}
            </div>
          </div>

          <!-- Drawer Actions -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.openInvoiceModal('${p.id}')">
              <span>📄 View Official Invoice</span>
            </button>
            <div style="display:flex; gap:8px;">
              ${p.status === 'Paid' ? `
                <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.openRefundModal('${p.id}')">Process Refund</button>
              ` : ''}
              ${p.status === 'Manual review' ? `
                <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openManualReviewModal('${p.id}')">Resolve Review</button>
              ` : ''}
              <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeDrawer()">Close</button>
            </div>
          </div>
        </div>
      `;

      openDrawer(`Payment Transaction: ${p.transactionRef}`, bodyHtml);
    },

    openInvoiceModal: async (paymentId) => {
      const p = await Data.getPaymentById(paymentId);
      if (!p) return;

      const bodyHtml = `
        <div class="adm-invoice-card">
          <div class="adm-invoice-header">
            <div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--adm-primary); letter-spacing:0.04em;">NEXVION AI</div>
              <div style="font-size:0.75rem; color:var(--adm-text-muted);">Advanced Autonomous Intelligence Academy</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.05rem; font-weight:700; color:var(--adm-text-primary); font-family:var(--adm-font-mono);">${escapeHtml(p.invoiceId)}</div>
              <div style="font-size:0.75rem; color:var(--adm-text-muted);">${escapeHtml(p.date)}</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; font-size:0.82rem;">
            <div>
              <div style="color:var(--adm-text-muted); font-size:0.72rem; text-transform:uppercase; margin-bottom:4px;">Billed To:</div>
              <strong style="color:var(--adm-text-primary); font-size:0.95rem;">${escapeHtml(p.studentName)}</strong>
              <div style="color:var(--adm-text-secondary); font-size:0.78rem;">${escapeHtml(p.studentEmail)}</div>
              <div style="color:var(--adm-text-muted); font-size:0.72rem; margin-top:2px;">Candidate ID: ${escapeHtml(p.studentId || 'stu-student')}</div>
            </div>
            <div>
              <div style="color:var(--adm-text-muted); font-size:0.72rem; text-transform:uppercase; margin-bottom:4px;">Reconciliation Info:</div>
              <div>Payment Method: <strong>${escapeHtml(p.method)}</strong></div>
              <div>Transaction Ref: <code style="font-size:0.75rem;">${escapeHtml(p.transactionRef)}</code></div>
              <div style="margin-top:4px;">Settlement Status: ${AdminComponents.StatusBadge({ status: p.status })}</div>
            </div>
          </div>

          <div style="border-top:1px solid var(--adm-border); border-bottom:1px solid var(--adm-border); padding:14px 0; margin-bottom:16px;">
            <div class="adm-invoice-row" style="font-weight:600; color:var(--adm-text-primary); padding-bottom:8px;">
              <span>Curriculum Item Description</span>
              <span>Tuition Fee</span>
            </div>
            <div class="adm-invoice-row" style="align-items:center;">
              <div>
                <strong style="color:var(--adm-text-primary);">${escapeHtml(p.courseTitle)}</strong>
                <div style="font-size:0.75rem; color:var(--adm-text-muted);">${escapeHtml(p.tierName)} • Cohort: ${escapeHtml(p.batchName || 'Alpha')}</div>
              </div>
              <div>
                <span class="adm-badge ${p.amountDisplay === 'FREE' ? 'adm-badge-open' : 'adm-badge-price-coming-soon'}" style="font-weight:700;">
                  ${p.amountDisplay}
                </span>
              </div>
            </div>
          </div>

          <div class="adm-invoice-total">
            <span>Total Official Ledger Tuition:</span>
            <span style="color:var(--adm-primary); font-family:var(--adm-font-mono);">${p.amountDisplay}</span>
          </div>

          <div style="margin-top:20px; padding:12px; background:var(--adm-surface-elevated); border-radius:6px; font-size:0.76rem; color:var(--adm-text-secondary); line-height:1.45; border:1px solid var(--adm-border);">
            <strong>System Notice:</strong> Payment processing will be connected during backend integration. Official institutional tax invoices will be generated dynamically upon financial gateway activation.
          </div>
        </div>
      `;

      openModal(`Tax Invoice: ${p.invoiceId}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.downloadInvoicePlaceholder('${p.id}')">Download Invoice PDF</button>
      `);
    },

    downloadInvoicePlaceholder: (paymentId) => {
      showToast('Invoice Download Initiated', `Downloaded invoice receipt package for ${paymentId}.`, 'success');
      closeModal();
    },

    openRefundModal: async (paymentId) => {
      const p = await Data.getPaymentById(paymentId);
      if (!p) return;

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">
          <p style="margin-top:0;">You are initiating an administrative refund for the following tuition transaction:</p>

          <div style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:8px; padding:14px; margin-bottom:16px;">
            <div style="font-weight:700; color:var(--adm-text-primary); font-size:0.95rem;">${escapeHtml(p.studentName)} (${escapeHtml(p.studentEmail)})</div>
            <div style="font-size:0.78rem; color:var(--adm-text-muted); margin-top:2px;">${escapeHtml(p.courseTitle)} • ${escapeHtml(p.tierName)}</div>
            <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px solid var(--adm-border); padding-top:8px;">
              <span>Ref: <code>${escapeHtml(p.transactionRef)}</code></span>
              <span>Amount: <strong>${p.amountDisplay}</strong></span>
            </div>
          </div>

          <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:6px; padding:12px; margin-bottom:16px; font-size:0.8rem; color:#B45309; line-height:1.45;">
            <strong>Payment Gateway Notice:</strong> Payment processing will be connected during backend integration. Submitting this record flags the transaction as 'Refunded' and logs an academic audit trail.
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Refund Reason *</label>
            <select class="adm-select" id="refundReasonSelect" style="width:100%; margin-bottom:8px;">
              <option value="Student schedule conflict before cohort start">Student schedule conflict before cohort start</option>
              <option value="Dissatisfaction guarantee request within grace period">Dissatisfaction guarantee request within grace period</option>
              <option value="Duplicate transaction correction">Duplicate transaction correction</option>
              <option value="Administrative adjustment by Directorate">Administrative adjustment by Directorate</option>
            </select>
            <input type="text" class="adm-input" id="refundCustomReasonInput" placeholder="Additional audit notes or bursar memo (optional)" style="width:100%;">
          </div>
        </div>
      `;

      openModal(`Initiate Refund: ${p.transactionRef}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-danger" onclick="NexvionAdminApp.submitRefundAction('${p.id}')">Confirm Refund</button>
      `);
    },

    submitRefundAction: async (paymentId) => {
      const selectEl = document.getElementById('refundReasonSelect');
      const memoEl = document.getElementById('refundCustomReasonInput');
      const reason = (selectEl ? selectEl.value : '') + (memoEl && memoEl.value.trim() ? ` — Note: ${memoEl.value.trim()}` : '');

      await Data.refundPayment(paymentId, reason);
      closeModal();
      closeDrawer();
      showToast('Refund Processed', 'Payment record updated to Refunded status.', 'success');
      renderRoute(AppState.currentRoute);
    },

    openManualReviewModal: async (paymentId) => {
      const p = await Data.getPaymentById(paymentId);
      if (!p) return;

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">
          <p style="margin-top:0;">Triage and resolve payment manual review verification:</p>

          <div style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:8px; padding:14px; margin-bottom:14px;">
            <div style="font-weight:700; color:var(--adm-text-primary); font-size:0.95rem;">${escapeHtml(p.studentName)} (${escapeHtml(p.studentEmail)})</div>
            <div style="font-size:0.8rem; color:var(--adm-text-muted); margin-top:2px;">Method: ${escapeHtml(p.method)}</div>
            <div style="font-size:0.8rem; color:var(--adm-text-muted);">Invoice: <code>${escapeHtml(p.invoiceId)}</code> • Ref: <code>${escapeHtml(p.transactionRef)}</code></div>
            <div style="margin-top:10px; padding:8px 10px; background:rgba(245, 158, 11, 0.1); border-radius:4px; font-size:0.8rem; color:#B45309;">
              <strong>Verification Flag:</strong> ${escapeHtml(p.notes || 'Awaiting PO/Voucher verification')}
            </div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Review Decision *</label>
            <select class="adm-select" id="manualReviewDecision" style="width:100%; margin-bottom:10px;">
              <option value="Paid">Approve as Paid (Verification Cleared)</option>
              <option value="Failed">Decline / Mark Failed (Invalid PO / Rejected)</option>
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Bursar Resolution Memo</label>
            <input type="text" id="manualReviewNote" class="adm-input" placeholder="e.g. Verified VAT number with enterprise treasury" style="width:100%;">
          </div>
        </div>
      `;

      openModal(`Manual Review Resolution: ${p.transactionRef}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitManualReviewAction('${p.id}')">Submit Decision</button>
      `);
    },

    submitManualReviewAction: async (paymentId) => {
      const decisionEl = document.getElementById('manualReviewDecision');
      const noteEl = document.getElementById('manualReviewNote');
      const decision = decisionEl ? decisionEl.value : 'Paid';
      const note = noteEl ? noteEl.value.trim() : 'Manual review resolution recorded.';

      await Data.updatePaymentStatus(paymentId, decision, note);
      closeModal();
      closeDrawer();
      showToast('Review Resolved', `Transaction updated to ${decision}.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    exportPaymentsCsv: async () => {
      const payments = await Data.getPayments();
      const headers = ['ID', 'TransactionRef', 'StudentName', 'StudentEmail', 'Course', 'Tier', 'Batch', 'Amount', 'Status', 'Date', 'Method', 'InvoiceID', 'RefundStatus'];
      const rows = payments.map(p => [
        `"${p.id}"`,
        `"${p.transactionRef}"`,
        `"${p.studentName}"`,
        `"${p.studentEmail}"`,
        `"${p.courseTitle}"`,
        `"${p.tierName}"`,
        `"${p.batchName || ''}"`,
        `"${p.amountDisplay}"`,
        `"${p.status}"`,
        `"${p.date}"`,
        `"${p.method}"`,
        `"${p.invoiceId}"`,
        `"${p.refundStatus || 'None'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nexvion_payments_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Export Complete', 'Financial transactions ledger exported to CSV.', 'success');
    },

    // =========================================================================
    // PHASE 6: CERTIFICATE ADMINISTRATION CONTROLLERS
    // =========================================================================
    onCertificateSearch: (query) => {
      AppState.certificatesView.searchTerm = query;
      AppState.certificatesView.currentPage = 1;
      renderCertificatesView();
    },

    onCertificateCourseFilter: (val) => {
      AppState.certificatesView.courseFilter = val;
      AppState.certificatesView.currentPage = 1;
      renderCertificatesView();
    },

    onCertificateTierFilter: (val) => {
      AppState.certificatesView.tierFilter = val;
      AppState.certificatesView.currentPage = 1;
      renderCertificatesView();
    },

    onCertificateStatusFilter: (val) => {
      AppState.certificatesView.statusFilter = val;
      AppState.certificatesView.currentPage = 1;
      renderCertificatesView();
    },

    onCertificateEligibilityFilter: (val) => {
      AppState.certificatesView.eligibilityFilter = val;
      AppState.certificatesView.currentPage = 1;
      renderCertificatesView();
    },

    onCertificateSort: (val) => {
      AppState.certificatesView.sortBy = val;
      renderCertificatesView();
    },

    onCertificatePageChange: (page) => {
      AppState.certificatesView.currentPage = Math.max(1, page);
      renderCertificatesView();
    },

    resetCertificateFilters: () => {
      AppState.certificatesView = {
        searchTerm: '',
        courseFilter: 'ALL',
        tierFilter: 'ALL',
        statusFilter: 'ALL',
        eligibilityFilter: 'ALL',
        sortBy: 'name-asc',
        currentPage: 1,
        pageSize: 10
      };
      renderCertificatesView();
      showToast('Filters Reset', 'Certificate filters restored to defaults.', 'info');
    },

    openCertificateDetail: async (certId) => {
      const c = await Data.getCertificateById(certId);
      if (!c) {
        showToast('Certificate Candidate Not Found', `Record "${certId}" does not exist.`, 'error');
        return;
      }
      AppState.activeCertificateId = certId;
      const req = c.requirements || {
        courseCompletion: { met: c.completionPercentage >= 80, label: 'Course Progress', detail: `${c.completionPercentage}% modules completed` },
        classCompletion: { met: true, label: 'Required Classes', detail: 'Mandatory live classes verified' },
        projectCompletion: { met: c.completionPercentage >= 80, label: 'Capstone Project', detail: 'Capstone submitted' },
        assignmentCompletion: { met: true, label: 'Assignment Completion', detail: 'Sprint challenges completed' },
        manualApproval: { met: c.status === 'Issued' || c.status === 'Eligible', label: 'Directorate Approval', detail: 'Directorate sign-off' }
      };

      const bodyHtml = `
        <div style="padding:20px;">
          <!-- Top Card -->
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h3 style="margin:0 0 4px 0; font-size:1.15rem; color:var(--adm-text-primary);">${escapeHtml(c.studentName)}</h3>
                <div style="font-size:0.8rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${escapeHtml(c.studentEmail || '')}</div>
              </div>
              <div>${AdminComponents.StatusBadge({ status: c.status })}</div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.82rem; padding-top:10px; border-top:1px solid var(--adm-border);">
              <div><span style="color:var(--adm-text-muted);">Curriculum:</span> <strong style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(c.courseTitle)}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Tier & Batch:</span> <strong style="display:block; color:var(--adm-text-primary); margin-top:2px;">${escapeHtml(c.tierName)} • ${escapeHtml(c.batchName || 'Cohort Alpha')}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Completion:</span> <strong style="display:block; color:var(--adm-primary); margin-top:2px;">${c.completionPercentage}%</strong></div>
              <div><span style="color:var(--adm-text-muted);">Grade:</span> <strong style="display:block; color:var(--adm-success); margin-top:2px;">${escapeHtml(c.grade || 'First Class')}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Verification ID:</span> <code style="display:block; color:var(--adm-tertiary); margin-top:2px; font-size:0.75rem;">${escapeHtml(c.verificationId || 'Pending Generation')}</code></div>
              <div><span style="color:var(--adm-text-muted);">Issue Date:</span> <span style="display:block; color:var(--adm-text-secondary); margin-top:2px;">${escapeHtml(c.issueDate || 'Pending Issue')}</span></div>
            </div>
          </div>

          <!-- 5-Point Requirements Checklist UI -->
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="margin:0; font-size:0.95rem; color:var(--adm-text-primary);">Certificate Requirements Checklist</h4>
              <span style="font-size:0.75rem; color:var(--adm-text-muted);">5-Point Accreditation Audit</span>
            </div>

            <div class="adm-req-list">
              <!-- 1. Course Completion -->
              <div class="adm-req-item">
                <div class="adm-req-left">
                  <div class="adm-req-icon ${req.courseCompletion.met ? 'met' : 'unmet'}">${req.courseCompletion.met ? '✓' : '!'}</div>
                  <div>
                    <div class="adm-req-title">1. Course Curriculum Completion</div>
                    <div class="adm-req-sub">${escapeHtml(req.courseCompletion.detail)}</div>
                  </div>
                </div>
                <span class="adm-badge ${req.courseCompletion.met ? 'adm-badge-approved' : 'adm-badge-waitlist'}">${req.courseCompletion.met ? 'Satisfied' : 'Pending'}</span>
              </div>

              <!-- 2. Required Class Completion -->
              <div class="adm-req-item">
                <div class="adm-req-left">
                  <div class="adm-req-icon ${req.classCompletion.met ? 'met' : 'unmet'}">${req.classCompletion.met ? '✓' : '!'}</div>
                  <div>
                    <div class="adm-req-title">2. Mandatory Live Classes Attendance</div>
                    <div class="adm-req-sub">${escapeHtml(req.classCompletion.detail)}</div>
                  </div>
                </div>
                <span class="adm-badge ${req.classCompletion.met ? 'adm-badge-approved' : 'adm-badge-waitlist'}">${req.classCompletion.met ? 'Satisfied' : 'Pending'}</span>
              </div>

              <!-- 3. Required Project Completion -->
              <div class="adm-req-item">
                <div class="adm-req-left">
                  <div class="adm-req-icon ${req.projectCompletion.met ? 'met' : 'unmet'}">${req.projectCompletion.met ? '✓' : '!'}</div>
                  <div>
                    <div class="adm-req-title">3. Capstone Portfolio Defense</div>
                    <div class="adm-req-sub">${escapeHtml(req.projectCompletion.detail)}</div>
                  </div>
                </div>
                <span class="adm-badge ${req.projectCompletion.met ? 'adm-badge-approved' : 'adm-badge-waitlist'}">${req.projectCompletion.met ? 'Satisfied' : 'Pending'}</span>
              </div>

              <!-- 4. Assignment Completion -->
              <div class="adm-req-item">
                <div class="adm-req-left">
                  <div class="adm-req-icon ${req.assignmentCompletion.met ? 'met' : 'unmet'}">${req.assignmentCompletion.met ? '✓' : '!'}</div>
                  <div>
                    <div class="adm-req-title">4. Lab Assignments & Sprints</div>
                    <div class="adm-req-sub">${escapeHtml(req.assignmentCompletion.detail)}</div>
                  </div>
                </div>
                <span class="adm-badge ${req.assignmentCompletion.met ? 'adm-badge-approved' : 'adm-badge-waitlist'}">${req.assignmentCompletion.met ? 'Satisfied' : 'Pending'}</span>
              </div>

              <!-- 5. Manual Approval Requirement -->
              <div class="adm-req-item">
                <div class="adm-req-left">
                  <div class="adm-req-icon ${req.manualApproval.met ? 'met' : 'unmet'}">${req.manualApproval.met ? '✓' : '!'}</div>
                  <div>
                    <div class="adm-req-title">5. Academic Directorate Sign-Off</div>
                    <div class="adm-req-sub">${escapeHtml(req.manualApproval.detail)}</div>
                  </div>
                </div>
                <span class="adm-badge ${req.manualApproval.met ? 'adm-badge-approved' : 'adm-badge-waitlist'}">${req.manualApproval.met ? 'Signed Off' : 'Required'}</span>
              </div>
            </div>
          </div>

          <!-- Internal Audit Notes & Memos -->
          <div class="adm-card" style="margin-bottom:20px;">
            <h4 style="margin:0 0 10px 0; font-size:0.95rem; color:var(--adm-text-primary);">Internal Audit Notes</h4>
            <div id="certAuditNotesList" style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
              ${(c.internalNotes && c.internalNotes.length > 0) ? c.internalNotes.map(n => `
                <div style="background:var(--adm-surface-elevated); padding:10px 12px; border-radius:6px; border:1px solid var(--adm-border); font-size:0.8rem;">
                  <div style="display:flex; justify-content:space-between; color:var(--adm-text-muted); font-size:0.72rem; margin-bottom:4px;">
                    <strong>${escapeHtml(n.author || 'Academic Staff')}</strong>
                    <span>${n.date ? new Date(n.date).toLocaleDateString() : '—'}</span>
                  </div>
                  <div style="color:var(--adm-text-secondary); line-height:1.4;">${escapeHtml(n.text)}</div>
                </div>
              `).join('') : '<div style="color:var(--adm-text-muted); font-size:0.8rem; font-style:italic;">No internal audit notes recorded yet.</div>'}
            </div>

            <!-- Add Note form -->
            <div style="display:flex; gap:8px;">
              <input type="text" id="newCertAuditNoteInput" class="adm-input" placeholder="Add internal compliance or academic note..." style="flex:1;">
              <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.submitDrawerAuditNote('${c.id}')">Add Note</button>
            </div>
          </div>

          <!-- Drawer Action Bar -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end;">
            ${c.status === 'Pending approval' ? `
              <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.approveCertificateAction('${c.id}')">Approve Directorate Sign-Off</button>
            ` : ''}
            ${c.status === 'Eligible' ? `
              <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.issueCertificateAction('${c.id}')">Issue Digital Credential</button>
            ` : ''}
            ${c.status === 'Issued' ? `
              <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.previewCertificateModal('${c.id}')">Preview Credential</button>
              <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.downloadCertificatePlaceholder('${c.id}')">Download Package</button>
              <button class="adm-btn adm-btn-danger" onclick="NexvionAdminApp.revokeCertificateModal('${c.id}')">Revoke Credential</button>
            ` : ''}
            <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeDrawer()">Close</button>
          </div>
        </div>
      `;

      openDrawer(`Eligibility Audit: ${c.studentName}`, bodyHtml);
    },

    previewCertificateModal: async (certId) => {
      const c = await Data.getCertificateById(certId);
      if (!c) return;

      const bodyHtml = `
        <div class="adm-cert-frame">
          <div class="adm-cert-inner">
            <div class="adm-cert-watermark">NEXVION</div>
            <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:1.4rem;">✦</span>
              <span style="font-size:0.85rem; font-weight:800; letter-spacing:0.18em; color:var(--adm-primary); text-transform:uppercase;">NEXVION AI ACADEMY</span>
              <span style="font-size:1.4rem;">✦</span>
            </div>
            <div class="adm-cert-title" style="font-size:1.5rem; font-weight:800; letter-spacing:0.04em; color:#0F172A; text-transform:uppercase; margin-bottom:4px;">
              Certificate of Excellence
            </div>
            <div class="adm-cert-sub" style="font-size:0.85rem; color:#64748B; font-style:italic; margin-bottom:20px;">
              This official credential certifies that
            </div>
            <div class="adm-cert-recipient" style="font-size:1.9rem; font-weight:800; color:#1E293B; letter-spacing:0.02em; border-bottom:2px solid #CBD5E1; display:inline-block; padding:0 32px 8px 32px; margin-bottom:18px;">
              ${escapeHtml(c.studentName)}
            </div>
            <div class="adm-cert-text" style="font-size:0.9rem; color:#475569; max-width:540px; margin:0 auto 24px auto; line-height:1.6;">
              has successfully completed all rigorous curriculum modules, verified interactive live requirements, and passed comprehensive defense with distinction in
              <br>
              <strong style="color:#0F172A; font-size:1.05rem;">${escapeHtml(c.courseTitle)}</strong>
              <br>
              <span style="font-size:0.8rem; color:#64748B;">Specialization Tier: ${escapeHtml(c.tierName)} • Cohort: ${escapeHtml(c.batchName || 'Cohort Alpha')}</span>
            </div>

            <!-- Signatures and Gold Seal -->
            <div class="adm-cert-signatures">
              <div class="adm-cert-sign-col">
                <div class="adm-cert-sign-line"></div>
                <div class="adm-cert-sign-name">Dr. Evelyn Vance</div>
                <div class="adm-cert-sign-title">Academic Dean & Co-Founder</div>
              </div>
              <div class="adm-cert-seal">
                <span>VERIFIED</span>
                <span>CREDENTIAL</span>
              </div>
              <div class="adm-cert-sign-col">
                <div class="adm-cert-sign-line"></div>
                <div class="adm-cert-sign-name">Dr. Kenneth Vance</div>
                <div class="adm-cert-sign-title">Chief AI Architect</div>
              </div>
            </div>

            <div style="margin-top:20px; font-size:0.75rem; color:#94A3B8; font-family:var(--adm-font-mono);">
              Verification ID: <strong>${escapeHtml(c.verificationId || 'NEX-CERT-2026')}</strong> • Issued: ${escapeHtml(c.issueDate || '2026-10-05')}
            </div>
          </div>
        </div>
      `;

      openModal(`Credential Verification Preview`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Close</button>
        <button class="adm-btn adm-btn-secondary" onclick="showToast('Print Preview', 'Sending credential layout to print spooler...', 'info')">Print Preview</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.downloadCertificatePlaceholder('${c.id}')">Download Credential PDF</button>
      `);
    },

    downloadCertificatePlaceholder: async (certId) => {
      const c = await Data.getCertificateById(certId);
      showToast('Credential Downloaded', `Certificate package prepared for ${c ? c.verificationId : certId}.`, 'success');
      closeModal();
    },

    approveCertificateAction: async (certId) => {
      await Data.approveCertificate(certId, 'Academic Directorate');
      closeDrawer();
      showToast('Eligibility Approved', 'Academic Directorate sign-off recorded. Candidate is now Eligible for issuance.', 'success');
      renderRoute(AppState.currentRoute);
    },

    issueCertificateAction: async (certId) => {
      const updated = await Data.issueCertificate(certId);
      closeDrawer();
      showToast('Certificate Issued', `Credential successfully generated and registered as ${updated ? updated.verificationId : 'Issued'}.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    revokeCertificateModal: async (certId) => {
      const c = await Data.getCertificateById(certId);
      if (!c) return;

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">
          <p style="margin-top:0;">You are about to revoke the issued credential for:</p>
          <div style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:8px; padding:14px; margin-bottom:14px;">
            <div style="font-weight:700; color:var(--adm-text-primary); font-size:0.95rem;">${escapeHtml(c.studentName)}</div>
            <div style="font-size:0.8rem; color:var(--adm-text-muted); margin-top:2px;">${escapeHtml(c.courseTitle)} (${escapeHtml(c.tierName)})</div>
            <div style="font-size:0.8rem; color:var(--adm-text-muted); margin-top:2px;">Credential: <code>${escapeHtml(c.verificationId)}</code></div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Revocation Reason *</label>
            <select class="adm-select" id="revokeReasonSelect" style="width:100%; margin-bottom:8px;">
              <option value="Honor code violation during academic review">Honor code violation during academic review</option>
              <option value="Tuition refund and cohort withdrawal">Tuition refund and cohort withdrawal</option>
              <option value="Administrative correction / duplicate issuance">Administrative correction / duplicate issuance</option>
            </select>
            <input type="text" class="adm-input" id="revokeCustomReasonInput" placeholder="Additional audit details (optional)" style="width:100%;">
          </div>
        </div>
      `;

      openModal(`Revoke Credential: ${c.studentName}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-danger" onclick="NexvionAdminApp.submitRevokeCertificateAction('${c.id}')">Confirm Revocation</button>
      `);
    },

    submitRevokeCertificateAction: async (certId) => {
      const selectEl = document.getElementById('revokeReasonSelect');
      const memoEl = document.getElementById('revokeCustomReasonInput');
      const reason = (selectEl ? selectEl.value : '') + (memoEl && memoEl.value.trim() ? ` — ${memoEl.value.trim()}` : '');

      await Data.revokeCertificate(certId, reason);
      closeModal();
      closeDrawer();
      showToast('Certificate Revoked', 'Credential status updated to Revoked and recorded in audit log.', 'warning');
      renderRoute(AppState.currentRoute);
    },

    openAddNoteModal: async (certId) => {
      const c = await Data.getCertificateById(certId);
      if (!c) return;

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary);">
          <p style="margin-top:0;">Add internal audit memo for <strong>${escapeHtml(c.studentName)}</strong>:</p>
          <div class="adm-form-group">
            <label class="adm-form-label">Audit Note Text *</label>
            <textarea class="adm-textarea" id="modalAuditNoteInput" placeholder="Type internal compliance or academic observation..." rows="4"></textarea>
          </div>
        </div>
      `;

      openModal(`Add Audit Note: ${c.studentName}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitModalAuditNote('${c.id}')">Save Note</button>
      `);
    },

    submitModalAuditNote: async (certId) => {
      const noteInput = document.getElementById('modalAuditNoteInput');
      const text = noteInput ? noteInput.value.trim() : '';
      if (!text) {
        showToast('Validation Error', 'Note text cannot be empty.', 'error');
        return;
      }

      await Data.addCertificateNote(certId, text, AppState.activeRole || 'Academic Staff');
      closeModal();
      showToast('Note Added', 'Internal audit note recorded.', 'success');
      renderRoute(AppState.currentRoute);
    },

    submitDrawerAuditNote: async (certId) => {
      const noteInput = document.getElementById('newCertAuditNoteInput');
      const text = noteInput ? noteInput.value.trim() : '';
      if (!text) {
        showToast('Validation Error', 'Please type a note before submitting.', 'error');
        return;
      }

      await Data.addCertificateNote(certId, text, AppState.activeRole || 'Academic Staff');
      noteInput.value = '';
      showToast('Note Added', 'Internal audit note saved.', 'success');
      NexvionAdminApp.openCertificateDetail(certId);
    },

    exportCertificatesCsv: async () => {
      const certs = await Data.getCertificates();
      const headers = ['ID', 'StudentID', 'StudentName', 'StudentEmail', 'Course', 'Tier', 'Batch', 'CompletionPercent', 'EligibilityStatus', 'Status', 'IssueDate', 'VerificationID'];
      const rows = certs.map(c => [
        `"${c.id}"`,
        `"${c.studentId || ''}"`,
        `"${c.studentName}"`,
        `"${c.studentEmail || ''}"`,
        `"${c.courseTitle}"`,
        `"${c.tierName}"`,
        `"${c.batchName || ''}"`,
        `"${c.completionPercentage || 0}"`,
        `"${c.eligibilityStatus || ''}"`,
        `"${c.status}"`,
        `"${c.issueDate || ''}"`,
        `"${c.verificationId || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nexvion_certificates_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Export Complete', 'Certificate credentials ledger exported to CSV.', 'success');
    },

    // Backward-Compatibility Aliases
    issueCertificate: async (certId) => NexvionAdminApp.issueCertificateAction(certId),
    revokeCertificate: async (certId) => NexvionAdminApp.revokeCertificateModal(certId),
    issueMockCertificate: async (certId) => NexvionAdminApp.issueCertificateAction(certId),
    revokeMockCertificate: async (certId) => NexvionAdminApp.revokeCertificateModal(certId),

    // --- Support Ticket Drawer ---
    openTicketDrawer: async (ticketId) => {
      const ticket = (await Data.getSupportTickets()).find(t => t.id === ticketId);
      if (!ticket) return;

      const bodyHtml = `
        <div style="margin-bottom:14px;">
          <span class="adm-badge adm-badge-waitlist">${ticket.status}</span>
          <h3 style="margin:6px 0; color:var(--adm-text-primary);">${ticket.subject}</h3>
          <span style="font-size:0.75rem; color:var(--adm-text-muted);">${ticket.studentName} (${ticket.studentEmail})</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
          ${ticket.messages.map(m => `
            <div style="background:var(--adm-surface-elevated); padding:10px 14px; border-radius:8px; border:1px solid var(--adm-border);">
              <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--adm-tertiary); margin-bottom:4px;">
                <strong>${m.sender}</strong>
                <span>${new Date(m.timestamp).toLocaleTimeString()}</span>
              </div>
              <p style="margin:0; font-size:0.82rem; color:var(--adm-text-primary); line-height:1.4;">${m.text}</p>
            </div>
          `).join('')}
        </div>
        <div class="adm-form-group">
          <label class="adm-form-label">Send Support Response</label>
          <textarea class="adm-textarea" id="ticketReplyText" placeholder="Type response to student..."></textarea>
          <button class="adm-btn adm-btn-primary" style="margin-top:8px;" onclick="NexvionAdminApp.submitTicketReply('${ticket.id}')">Send Reply</button>
        </div>
      `;
      openDrawer(`Ticket: ${ticket.ticketRef}`, bodyHtml);
    },

    submitTicketReply: async (ticketId) => {
      const reply = document.getElementById('ticketReplyText')?.value;
      if (!reply) return;
      await Data.addTicketReply(ticketId, reply, 'Support Admin Desk');
      closeDrawer();
      showToast('Reply Sent', 'Student message thread updated.', 'success');
      renderRoute(AppState.currentRoute);
    },

    // --- Filter helpers ---
    filterCoursesTable: () => {
      const q = document.getElementById('courseSearch')?.value.toLowerCase() || '';
      const tier = document.getElementById('courseTierFilter')?.value || 'ALL';
      const status = document.getElementById('courseStatusFilter')?.value || 'ALL';

      const rows = document.querySelectorAll('#coursesTable tbody tr');
      let visibleCount = 0;
      rows.forEach(tr => {
        const title = tr.getAttribute('data-title') || '';
        const trTier = tr.getAttribute('data-tier') || '';
        const trStatus = tr.getAttribute('data-status') || '';

        const matchQ = !q || title.includes(q);
        const matchTier = tier === 'ALL' || trTier === tier;
        const matchStatus = status === 'ALL' || trStatus === status;

        const isVisible = matchQ && matchTier && matchStatus;
        tr.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
      });

      let emptyMsg = document.getElementById('coursesEmptyMsg');
      if (visibleCount === 0 && rows.length > 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'coursesEmptyMsg';
          emptyMsg.className = 'adm-table-empty';
          emptyMsg.innerHTML = `
            <div class="adm-state-box">
              <div class="adm-state-icon">📚</div>
              <h3 class="adm-state-title">No courses found</h3>
              <p class="adm-state-desc">No courses match the specified filters.</p>
              <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.openCreateCourseModal()">Create your first course</button>
            </div>
          `;
          document.querySelector('#coursesTable')?.parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    },

    filterBatchesTable: () => {
      const q = document.getElementById('batchSearch')?.value.toLowerCase() || '';
      const status = document.getElementById('batchStatusFilter')?.value || 'ALL';

      const rows = document.querySelectorAll('#batchesTable tbody tr');
      let visibleCount = 0;
      rows.forEach(tr => {
        const name = tr.getAttribute('data-name') || '';
        const trStatus = tr.getAttribute('data-status') || '';

        const matchQ = !q || name.includes(q);
        const matchStatus = status === 'ALL' || trStatus === status;

        const isVisible = matchQ && matchStatus;
        tr.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
      });

      let emptyMsg = document.getElementById('batchesEmptyMsg');
      if (visibleCount === 0 && rows.length > 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'batchesEmptyMsg';
          emptyMsg.className = 'adm-table-empty';
          emptyMsg.innerHTML = AdminComponents.EmptyState({
            icon: '🏛️',
            title: 'No cohorts match these filters',
            message: 'Try clearing your search term or selecting another cohort status.',
            actionText: 'Reset Filters',
            onAction: 'NexvionAdminApp.resetBatchFilters'
          });
          document.querySelector('#batchesTable')?.parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    },

    resetBatchFilters: () => {
      if (document.getElementById('batchSearch')) document.getElementById('batchSearch').value = '';
      if (document.getElementById('batchStatusFilter')) document.getElementById('batchStatusFilter').value = 'ALL';
      NexvionAdminApp.filterBatchesTable();
    },

    components: AdminComponents,

    filterStudentsTable: () => {
      const q = document.getElementById('studentSearch')?.value.toLowerCase() || '';
      const tier = document.getElementById('studentTierFilter')?.value || 'ALL';
      const status = document.getElementById('studentStatusFilter')?.value || 'ALL';

      const rows = document.querySelectorAll('#studentsTable tbody tr');
      let visibleCount = 0;
      rows.forEach(tr => {
        const name = tr.getAttribute('data-name') || '';
        const trTier = tr.getAttribute('data-tier') || '';
        const trStatus = tr.getAttribute('data-status') || '';

        const matchQ = !q || name.includes(q);
        const matchTier = tier === 'ALL' || trTier === tier;
        const matchStatus = status === 'ALL' || trStatus === status;

        const isVisible = matchQ && matchTier && matchStatus;
        tr.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
      });

      let emptyMsg = document.getElementById('studentsEmptyMsg');
      if (visibleCount === 0 && rows.length > 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'studentsEmptyMsg';
          emptyMsg.className = 'adm-table-empty';
          emptyMsg.innerHTML = `
            <div class="adm-state-box">
              <div class="adm-state-icon">🔍</div>
              <h3 class="adm-state-title">No students match these filters</h3>
              <p class="adm-state-desc">Try clearing or adjusting your search parameters.</p>
            </div>
          `;
          document.querySelector('#studentsTable')?.parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    },

    // =========================================================================
    // PHASE 8: ADMIN USERS CONTROLLERS
    // =========================================================================
    onAdminSearch: (val) => {
      AppState.adminsView.searchTerm = val;
      AppState.adminsView.currentPage = 1;
      renderAdminsView();
    },

    onAdminStatusFilter: (val) => {
      AppState.adminsView.statusFilter = val;
      AppState.adminsView.currentPage = 1;
      renderAdminsView();
    },

    onAdminRoleFilter: (val) => {
      AppState.adminsView.roleFilter = val;
      AppState.adminsView.currentPage = 1;
      renderAdminsView();
    },

    onAdminSort: (val) => {
      AppState.adminsView.sortBy = val;
      renderAdminsView();
    },

    onAdminPageChange: (page) => {
      AppState.adminsView.currentPage = Math.max(1, page);
      renderAdminsView();
    },

    resetAdminFilters: () => {
      AppState.adminsView = {
        searchTerm: '',
        statusFilter: 'ALL',
        roleFilter: 'ALL',
        sortBy: 'name-asc',
        currentPage: 1,
        pageSize: 10
      };
      renderAdminsView();
      showToast('Filters Reset', 'Administrative personnel filters restored to defaults.', 'info');
    },

    openInviteAdminModal: () => {
      if (!Data.hasPermission('manage_admins')) {
        showToast('Permission Denied', 'Your active role lacks manage_admins permission.', 'error');
        return;
      }

      const bodyHtml = `
        <form id="inviteAdminForm" onsubmit="event.preventDefault(); NexvionAdminApp.submitInviteAdmin();">
          <div class="adm-form-group">
            <label class="adm-form-label">Full Name <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="inviteAdminName" placeholder="e.g. Dr. Alistair Finch" required>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Corporate Email Address <span class="adm-req-star">*</span></label>
            <input type="email" class="adm-input" id="inviteAdminEmail" placeholder="e.g. a.finch@nexvion.ai" required>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Administrative Role Assignment <span class="adm-req-star">*</span></label>
            <select class="adm-select" id="inviteAdminRole" style="width:100%;">
              <option value="Content Manager">Content Manager</option>
              <option value="Student Manager">Student Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Communications Manager">Communications Manager</option>
              <option value="Support Manager">Support Manager</option>
              <option value="Analyst">Analyst</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Department / Unit</label>
            <input type="text" class="adm-input" id="inviteAdminDept" placeholder="e.g. Academic Curriculum Directorate">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Onboarding Invitation Memo</label>
            <textarea class="adm-textarea" id="inviteAdminNotes" placeholder="Optional internal onboarding notes..."></textarea>
          </div>
        </form>
      `;

      openModal('Invite Administrator', bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitInviteAdmin()">Send Invitation</button>
      `);
    },

    submitInviteAdmin: async () => {
      const nameInput = document.getElementById('inviteAdminName');
      const emailInput = document.getElementById('inviteAdminEmail');
      const roleInput = document.getElementById('inviteAdminRole');
      const deptInput = document.getElementById('inviteAdminDept');
      const notesInput = document.getElementById('inviteAdminNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const role = roleInput ? roleInput.value : 'Content Manager';
      const department = deptInput ? deptInput.value.trim() : 'Operations';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name || !email) {
        showToast('Validation Error', 'Full name and email address are required.', 'error');
        return;
      }
      if (!email.includes('@')) {
        showToast('Validation Error', 'Please provide a valid email address.', 'error');
        return;
      }

      await Data.inviteAdminUser({ name, email, role, department, notes });
      closeModal();
      showToast('Invitation Dispatched', `Admin invitation sent to ${email} for role ${role}.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    openEditAdminModal: async (adminId) => {
      const a = await Data.getAdminUserById(adminId);
      if (!a) return;

      const bodyHtml = `
        <form id="editAdminForm" onsubmit="event.preventDefault(); NexvionAdminApp.submitEditAdmin('${a.id}');">
          <div class="adm-form-group">
            <label class="adm-form-label">Full Name <span class="adm-req-star">*</span></label>
            <input type="text" class="adm-input" id="editAdminName" value="${escapeHtml(a.name)}" required>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Email Address <span class="adm-req-star">*</span></label>
            <input type="email" class="adm-input" id="editAdminEmail" value="${escapeHtml(a.email)}" required>
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Department / Unit</label>
            <input type="text" class="adm-input" id="editAdminDept" value="${escapeHtml(a.department || '')}">
          </div>
          <div class="adm-form-group">
            <label class="adm-form-label">Operational Notes</label>
            <textarea class="adm-textarea" id="editAdminNotes">${escapeHtml(a.notes || '')}</textarea>
          </div>
        </form>
      `;

      openModal(`Edit Admin: ${a.name}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitEditAdmin('${a.id}')">Save Changes</button>
      `);
    },

    submitEditAdmin: async (adminId) => {
      const nameInput = document.getElementById('editAdminName');
      const emailInput = document.getElementById('editAdminEmail');
      const deptInput = document.getElementById('editAdminDept');
      const notesInput = document.getElementById('editAdminNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const department = deptInput ? deptInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name || !email) {
        showToast('Validation Error', 'Name and email are required.', 'error');
        return;
      }

      await Data.editAdminUser(adminId, { name, email, department, notes });
      closeModal();
      showToast('Profile Updated', 'Administrator profile details saved.', 'success');
      renderRoute(AppState.currentRoute);
    },

    openChangeRoleModal: async (adminId) => {
      const a = await Data.getAdminUserById(adminId);
      if (!a) return;
      const roles = await Data.getRoles();

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">
          <p style="margin-top:0;">Reassign administrative role for <strong>${escapeHtml(a.name)}</strong> (currently <code>${escapeHtml(a.role)}</code>):</p>
          
          ${a.role === 'Owner' ? `
            <div style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.3); border-radius:6px; padding:10px 14px; margin-bottom:14px; color:#B91C1C;">
              <strong>Warning:</strong> You are modifying the primary Owner account. Ensure at least one active Owner exists on the platform.
            </div>
          ` : ''}

          <div class="adm-form-group">
            <label class="adm-form-label">Target Role *</label>
            <select class="adm-select" id="changeRoleSelect" style="width:100%;">
              ${roles.map(r => `<option value="${r.name}" ${r.name === a.role ? 'selected' : ''}>${r.name} — ${r.description}</option>`).join('')}
            </select>
          </div>
        </div>
      `;

      openModal(`Change Role: ${a.name}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.submitChangeRole('${a.id}')">Update Role</button>
      `);
    },

    submitChangeRole: async (adminId) => {
      const selectEl = document.getElementById('changeRoleSelect');
      const newRole = selectEl ? selectEl.value : null;
      if (!newRole) return;

      await Data.changeAdminRole(adminId, newRole);
      closeModal();
      showToast('Role Updated', `Assigned new role (${newRole}) to administrator.`, 'success');
      renderRoute(AppState.currentRoute);
    },

    openSuspendAdminModal: async (adminId) => {
      const a = await Data.getAdminUserById(adminId);
      if (!a) return;

      const bodyHtml = `
        <div style="font-size:0.85rem; color:var(--adm-text-secondary); line-height:1.5;">
          <p style="margin-top:0;">You are suspending administrative privileges for:</p>
          <div style="background:var(--adm-surface-elevated); border:1px solid var(--adm-border); border-radius:8px; padding:12px; margin-bottom:14px;">
            <strong style="color:var(--adm-text-primary); font-size:0.95rem;">${escapeHtml(a.name)}</strong>
            <div style="font-size:0.8rem; color:var(--adm-text-muted);">${escapeHtml(a.email)} • Role: ${escapeHtml(a.role)}</div>
          </div>

          <div class="adm-form-group">
            <label class="adm-form-label">Suspension Policy Reason *</label>
            <select class="adm-select" id="suspendReasonSelect" style="width:100%; margin-bottom:8px;">
              <option value="Security audit flag / credential review">Security audit flag / credential review</option>
              <option value="Staff offboarding / personnel transfer">Staff offboarding / personnel transfer</option>
              <option value="Temporary leave of absence">Temporary leave of absence</option>
              <option value="Administrative policy violation">Administrative policy violation</option>
            </select>
            <input type="text" class="adm-input" id="suspendCustomReason" placeholder="Additional audit notes (optional)" style="width:100%;">
          </div>
        </div>
      `;

      openModal(`Suspend Account: ${a.name}`, bodyHtml, `
        <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeModal()">Cancel</button>
        <button class="adm-btn adm-btn-danger" onclick="NexvionAdminApp.submitSuspendAdmin('${a.id}')">Confirm Suspension</button>
      `);
    },

    submitSuspendAdmin: async (adminId) => {
      const selectEl = document.getElementById('suspendReasonSelect');
      const customEl = document.getElementById('suspendCustomReason');
      const reason = (selectEl ? selectEl.value : '') + (customEl && customEl.value.trim() ? ` — ${customEl.value.trim()}` : '');

      await Data.suspendAdminUser(adminId, reason);
      closeModal();
      showToast('Account Suspended', 'Administrator access revoked and status updated to Suspended.', 'warning');
      renderRoute(AppState.currentRoute);
    },

    reactivateAdminAction: async (adminId) => {
      await Data.reactivateAdminUser(adminId);
      showToast('Account Reactivated', 'Administrator account returned to Active status.', 'success');
      renderRoute(AppState.currentRoute);
    },

    openAdminUserDetail: async (adminId) => {
      const a = await Data.getAdminUserById(adminId);
      if (!a) {
        showToast('Admin Not Found', `Record ${adminId} does not exist.`, 'error');
        return;
      }
      AppState.activeAdminId = adminId;
      const activity = await Data.getAdminActivity(adminId);

      const bodyHtml = `
        <div style="padding:20px;">
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h3 style="margin:0 0 4px 0; color:var(--adm-text-primary); font-size:1.15rem;">${escapeHtml(a.name)}</h3>
                <div style="font-size:0.8rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono);">${escapeHtml(a.email)}</div>
              </div>
              <span class="adm-badge ${a.status === 'Active' ? 'adm-badge-admin-active' : a.status === 'Invited' ? 'adm-badge-admin-invited' : a.status === 'Suspended' ? 'adm-badge-admin-suspended' : 'adm-badge-admin-inactive'}">
                <span class="adm-badge-dot"></span>${escapeHtml(a.status)}
              </span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem; border-top:1px solid var(--adm-border); padding-top:10px;">
              <div><span style="color:var(--adm-text-muted);">Assigned Role:</span> <strong style="display:block; color:var(--adm-primary);">${escapeHtml(a.role)}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Department:</span> <strong style="display:block; color:var(--adm-text-primary);">${escapeHtml(a.department || 'Operations')}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Last Active:</span> <span style="display:block; color:var(--adm-text-secondary);">${escapeHtml(a.lastActive || 'Pending')}</span></div>
              <div><span style="color:var(--adm-text-muted);">Account Created:</span> <span style="display:block; color:var(--adm-text-secondary);">${escapeHtml(a.createdAt || '2026-10-01')}</span></div>
            </div>
          </div>

          <!-- Activity Audit Ledger -->
          <div class="adm-card">
            <h4 style="margin:0 0 12px 0; font-size:0.95rem; color:var(--adm-text-primary); display:flex; justify-content:space-between; align-items:center;">
              <span>Operational Activity Trail</span>
              <span class="adm-badge adm-badge-published">${activity.length} Events</span>
            </h4>

            ${activity.length > 0 ? `
              <div style="display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto;">
                ${activity.map(l => `
                  <div style="background:var(--adm-surface-elevated); padding:10px 12px; border-radius:6px; border:1px solid var(--adm-border); font-size:0.8rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span style="color:var(--adm-primary); font-weight:700; font-family:var(--adm-font-mono);">${escapeHtml(l.action)}</span>
                      <span style="font-size:0.72rem; color:var(--adm-text-muted);">${new Date(l.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div style="color:var(--adm-text-secondary); font-size:0.78rem;">
                      ${escapeHtml(l.entityType)}: <strong>${escapeHtml(l.entityName)}</strong>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="text-align:center; padding:24px; color:var(--adm-text-muted); font-size:0.82rem;">
                No administrative mutations recorded for this account.
              </div>
            `}
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
            <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeDrawer()">Close</button>
            <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.closeDrawer(); NexvionAdminApp.openEditAdminModal('${a.id}')">Edit Admin</button>
          </div>
        </div>
      `;

      openDrawer(`Personnel Profile: ${a.name}`, bodyHtml);
    },

    // =========================================================================
    // PHASE 8: ROLES & PERMISSIONS CONTROLLERS
    // =========================================================================
    onRoleMatrixSearch: (query) => {
      AppState.rolesView.matrixSearchTerm = query;
      renderRolesView();
    },

    onRoleCategoryFilter: (cat) => {
      AppState.rolesView.categoryFilter = cat;
      renderRolesView();
    },

    openRoleDetailDrawer: async (roleId) => {
      const r = await Data.getRoleById(roleId);
      if (!r) {
        showToast('Role Not Found', `Role identifier ${roleId} not found.`, 'error');
        return;
      }
      AppState.activeRoleId = roleId;
      const allAdmins = await Data.getAdminUsers();
      const assignedAdmins = allAdmins.filter(a => a.role.toLowerCase() === r.name.toLowerCase());

      const bodyHtml = `
        <div style="padding:20px;">
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <h3 style="margin:0 0 2px 0; color:var(--adm-text-primary); font-size:1.2rem;">${escapeHtml(r.name)}</h3>
                <span style="font-size:0.75rem; color:var(--adm-text-muted);">${r.userCount} assigned personnel</span>
              </div>
              <span class="adm-badge adm-badge-published">System Defined</span>
            </div>
            <p style="font-size:0.82rem; color:var(--adm-text-secondary); line-height:1.45; margin:0;">
              ${escapeHtml(r.description)}
            </p>
          </div>

          <!-- Granted Capabilities -->
          <div class="adm-card" style="margin-bottom:16px;">
            <h4 style="margin:0 0 10px 0; font-size:0.92rem; color:var(--adm-text-primary);">
              Granted Capability Permissions (${r.permissions.length} of 23)
            </h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:200px; overflow-y:auto;">
              ${r.permissions.map(p => `
                <span style="font-size:0.72rem; font-family:var(--adm-font-mono); background:var(--adm-surface-elevated); padding:3px 8px; border-radius:4px; border:1px solid var(--adm-border); color:var(--adm-primary);">
                  ${escapeHtml(p)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Assigned Personnel -->
          <div class="adm-card" style="margin-bottom:20px;">
            <h4 style="margin:0 0 10px 0; font-size:0.92rem; color:var(--adm-text-primary);">
              Assigned Staff Accounts (${assignedAdmins.length})
            </h4>
            ${assignedAdmins.length > 0 ? `
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${assignedAdmins.map(a => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--adm-surface-elevated); padding:8px 12px; border-radius:6px; font-size:0.82rem;">
                    <div>
                      <strong style="color:var(--adm-text-primary);">${escapeHtml(a.name)}</strong>
                      <div style="font-size:0.72rem; color:var(--adm-text-muted);">${escapeHtml(a.email)}</div>
                    </div>
                    <span class="adm-badge adm-badge-open">${escapeHtml(a.status)}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="font-size:0.8rem; color:var(--adm-text-muted); text-align:center; padding:16px;">
                No personnel currently hold this role.
              </div>
            `}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="adm-btn adm-btn-primary" onclick="NexvionAdminApp.switchRole('${r.name}'); NexvionAdminApp.closeDrawer();">
              Set as Active Context
            </button>
            <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeDrawer()">Close</button>
          </div>
        </div>
      `;

      openDrawer(`Role Architecture: ${r.name}`, bodyHtml);
    },

    // =========================================================================
    // PHASE 8: AUDIT LOG CONTROLLERS
    // =========================================================================
    onAuditSearch: (val) => {
      AppState.auditLogsView.searchTerm = val;
      AppState.auditLogsView.currentPage = 1;
      renderAuditLogsView();
    },

    onAuditDateFilter: (val) => {
      AppState.auditLogsView.dateRangeFilter = val;
      AppState.auditLogsView.currentPage = 1;
      renderAuditLogsView();
    },

    onAuditAdminFilter: (val) => {
      AppState.auditLogsView.adminFilter = val;
      AppState.auditLogsView.currentPage = 1;
      renderAuditLogsView();
    },

    onAuditActionFilter: (val) => {
      AppState.auditLogsView.actionFilter = val;
      AppState.auditLogsView.currentPage = 1;
      renderAuditLogsView();
    },

    onAuditEntityFilter: (val) => {
      AppState.auditLogsView.entityFilter = val;
      AppState.auditLogsView.currentPage = 1;
      renderAuditLogsView();
    },

    onAuditPageChange: (page) => {
      AppState.auditLogsView.currentPage = Math.max(1, page);
      renderAuditLogsView();
    },

    toggleAuditViewMode: (mode) => {
      AppState.auditLogsView.viewMode = mode;
      renderAuditLogsView();
    },

    resetAuditFilters: () => {
      AppState.auditLogsView = {
        searchTerm: '',
        dateRangeFilter: 'ALL',
        adminFilter: 'ALL',
        actionFilter: 'ALL',
        entityFilter: 'ALL',
        viewMode: AppState.auditLogsView.viewMode || 'table',
        sortBy: 'timestamp-desc',
        currentPage: 1,
        pageSize: 10
      };
      renderAuditLogsView();
      showToast('Filters Reset', 'Audit ledger filters cleared.', 'info');
    },

    openAuditLogDetail: async (logId) => {
      const l = await Data.getAuditLogById(logId);
      if (!l) {
        showToast('Audit Record Not Found', `Log entry ${logId} not found.`, 'error');
        return;
      }
      AppState.activeAuditLogId = logId;

      const bodyHtml = `
        <div style="padding:20px;">
          <div class="adm-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="adm-badge adm-badge-published" style="font-family:var(--adm-font-mono);">${escapeHtml(l.id)}</span>
                <h3 style="margin:6px 0 2px 0; color:var(--adm-primary); font-size:1.15rem; font-family:var(--adm-font-mono);">${escapeHtml(l.action)}</h3>
              </div>
              <span class="adm-badge ${l.result === 'Success' ? 'adm-badge-published' : 'adm-badge-manual-review'}">${escapeHtml(l.result)}</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem; border-top:1px solid var(--adm-border); padding-top:10px; margin-top:8px;">
              <div><span style="color:var(--adm-text-muted);">Timestamp:</span> <span style="display:block; font-family:var(--adm-font-mono);">${new Date(l.timestamp).toLocaleString()}</span></div>
              <div><span style="color:var(--adm-text-muted);">Operator:</span> <strong style="display:block; color:var(--adm-text-primary);">${escapeHtml(l.admin)}</strong></div>
              <div><span style="color:var(--adm-text-muted);">Operator Email:</span> <code style="display:block; color:var(--adm-text-secondary); font-size:0.75rem;">${escapeHtml(l.adminEmail || 'internal')}</code></div>
              <div><span style="color:var(--adm-text-muted);">Device / IP:</span> <code style="display:block; color:var(--adm-tertiary); font-size:0.75rem;">${escapeHtml(l.ipDevice || '192.168.1.100')}</code></div>
              <div><span style="color:var(--adm-text-muted);">Entity Domain:</span> <span style="display:block; color:var(--adm-text-primary);">${escapeHtml(l.entityType)}</span></div>
              <div><span style="color:var(--adm-text-muted);">Entity Target:</span> <span style="display:block; color:var(--adm-text-primary); font-weight:600;">${escapeHtml(l.entityName)}</span></div>
            </div>
          </div>

          <!-- State Diff Viewer -->
          <div class="adm-card" style="margin-bottom:16px;">
            <h4 style="margin:0 0 10px 0; font-size:0.92rem; color:var(--adm-text-primary);">State Mutation Comparison</h4>
            <div class="adm-diff-grid">
              <div class="adm-diff-pane">
                <div class="adm-diff-title">Prior State Baseline</div>
                <pre class="adm-diff-code">${escapeHtml(l.previousState || 'None')}</pre>
              </div>
              <div class="adm-diff-pane">
                <div class="adm-diff-title">Committed New State</div>
                <pre class="adm-diff-code" style="color:var(--adm-primary);">${escapeHtml(l.newState || 'None')}</pre>
              </div>
            </div>
          </div>

          <!-- Mandatory Exact Copy Notice -->
          <div style="background:rgba(127,82,255,0.06); border:1px solid rgba(127,82,255,0.25); border-radius:8px; padding:12px; font-size:0.8rem; color:var(--adm-text-secondary); margin-bottom:20px;">
            <strong>System Notice:</strong> Server-side audit logging will be connected during backend integration.
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="adm-btn adm-btn-secondary" onclick="NexvionAdminApp.closeDrawer()">Close</button>
          </div>
        </div>
      `;

      openDrawer(`Audit Log Event: ${l.action}`, bodyHtml);
    },

    // =========================================================================
    // PHASE 8: SETTINGS & GOVERNANCE CONTROLLERS
    // =========================================================================
    switchSettingsTab: (tabKey) => {
      AppState.settingsView.activeTab = tabKey;
      renderSettingsView();
    },

    onSettingFieldChange: () => {
      AppState.settingsView.dirty = true;
      AppState.hasUnsavedChanges = true;
      const banner = document.getElementById('settingsUnsavedBanner');
      if (banner) banner.style.display = 'flex';
    },

    cancelSettingsChanges: () => {
      AppState.settingsView.dirty = false;
      AppState.hasUnsavedChanges = false;
      renderSettingsView();
      showToast('Changes Discarded', 'Settings reverted to saved state.', 'info');
    },

    resetSettingsCurrentSection: async () => {
      const activeTab = AppState.settingsView.activeTab || 'platform';
      if (!confirm(`Reset settings in section "${activeTab}" to factory default seed values?`)) {
        return;
      }

      await Data.resetSettingsSection(activeTab);
      AppState.settingsView.dirty = false;
      AppState.hasUnsavedChanges = false;
      renderSettingsView();
      showToast('Section Reset', `Default seed configuration restored for ${activeTab}.`, 'info');
    },

    saveSettingsForm: async () => {
      if (!Data.hasPermission('manage_settings')) {
        showToast('Permission Denied', 'Your active role lacks manage_settings capability.', 'error');
        return;
      }

      const activeTab = AppState.settingsView.activeTab || 'platform';
      const curSettings = await Data.getSettings();

      // Validation
      if (activeTab === 'platform') {
        const nameEl = document.getElementById('settingPlatformName');
        if (nameEl && !nameEl.value.trim()) {
          showToast('Validation Error', 'Platform name cannot be empty.', 'error');
          nameEl.focus();
          return;
        }
        curSettings.platform.platformName = nameEl.value.trim();

        const tagEl = document.getElementById('settingTagline');
        if (tagEl) curSettings.platform.tagline = tagEl.value.trim();

        const tzEl = document.getElementById('settingTimezone');
        if (tzEl) curSettings.platform.defaultTimezone = tzEl.value;

        const emailEl = document.getElementById('settingSupportEmail');
        if (emailEl) curSettings.platform.supportEmail = emailEl.value.trim();

        const maintEl = document.getElementById('settingMaintenanceMode');
        if (maintEl) curSettings.platform.maintenanceMode = maintEl.checked;
      }

      if (activeTab === 'branding') {
        const brandNameEl = document.getElementById('settingBrandAcademyName');
        if (brandNameEl) curSettings.branding.academyName = brandNameEl.value.trim();

        const primColEl = document.getElementById('settingPrimaryColorText');
        if (primColEl) curSettings.branding.primaryColor = primColEl.value.trim();

        const accColEl = document.getElementById('settingAccentColorText');
        if (accColEl) curSettings.branding.accentColor = accColEl.value.trim();
      }

      if (activeTab === 'enrollmentRules') {
        const appModeEl = document.getElementById('settingApprovalMode');
        if (appModeEl) curSettings.enrollmentRules.approvalMode = appModeEl.value;

        const waitlistEl = document.getElementById('settingWaitlistEnabled');
        if (waitlistEl) curSettings.enrollmentRules.waitlistEnabled = waitlistEl.checked;

        const autoPromoteEl = document.getElementById('settingAutoPromoteWaitlist');
        if (autoPromoteEl) curSettings.enrollmentRules.autoPromoteWaitlist = autoPromoteEl.checked;

        const prereqEl = document.getElementById('settingEnforcePrereqs');
        if (prereqEl) curSettings.enrollmentRules.enforcePrerequisites = prereqEl.checked;
      }

      if (activeTab === 'batchRules') {
        // STRICT INVARIANT ENFORCEMENT: Max batch size fixed at 30, cannot be editable above 30
        const batchCapEl = document.getElementById('settingMaxBatchCapacity');
        const enteredCap = batchCapEl ? Number(batchCapEl.value) : 30;
        if (enteredCap > 30) {
          showToast('Invariant Violation Error', 'The maximum batch size must remain fixed at 30 and cannot exceed 30.', 'error');
          return;
        }
        curSettings.batchRules.maxBatchCapacity = 30;

        const cadenceEl = document.getElementById('settingCohortCadence');
        if (cadenceEl) curSettings.batchRules.standardCohortCadence = cadenceEl.value;

        const archiveDaysEl = document.getElementById('settingArchiveDays');
        if (archiveDaysEl) curSettings.batchRules.archiveDaysAfterEnd = Number(archiveDaysEl.value) || 30;
      }

      if (activeTab === 'certificates') {
        const minCompEl = document.getElementById('settingCertMinCompletion');
        if (minCompEl) {
          const val = Number(minCompEl.value);
          if (isNaN(val) || val < 50 || val > 100) {
            showToast('Validation Error', 'Minimum completion percentage must be between 50% and 100%.', 'error');
            return;
          }
          curSettings.certificates.minCompletionPercentage = val;
        }

        const reqCapEl = document.getElementById('settingCertRequireCapstone');
        if (reqCapEl) curSettings.certificates.requireCapstone = reqCapEl.checked;

        const minGrdEl = document.getElementById('settingCertMinGrade');
        if (minGrdEl) curSettings.certificates.minAssignmentGrade = Number(minGrdEl.value) || 70;

        const signoffEl = document.getElementById('settingCertRequireManualSignoff');
        if (signoffEl) curSettings.certificates.requireManualSignoff = signoffEl.checked;

        const urlEl = document.getElementById('settingCertVerifyUrl');
        if (urlEl) curSettings.certificates.verificationUrlFormat = urlEl.value.trim();
      }

      if (activeTab === 'payments') {
        const curEl = document.getElementById('settingCurrency');
        if (curEl) curSettings.payments.currency = curEl.value;

        const refGraceEl = document.getElementById('settingRefundGraceDays');
        if (refGraceEl) curSettings.payments.refundGraceDays = Number(refGraceEl.value) || 14;
      }

      if (activeTab === 'support') {
        const slaEl = document.getElementById('settingSupportSlaHours');
        if (slaEl) curSettings.support.slaHours = Number(slaEl.value) || 24;

        const autoAssignEl = document.getElementById('settingAutoAssignTickets');
        if (autoAssignEl) curSettings.support.autoAssignTickets = autoAssignEl.checked;

        const autoCloseEl = document.getElementById('settingSupportAutoCloseHours');
        if (autoCloseEl) curSettings.support.autoCloseHours = Number(autoCloseEl.value) || 48;
      }

      if (activeTab === 'adminPreferences') {
        const retEl = document.getElementById('settingAuditRetentionDays');
        if (retEl) curSettings.adminPreferences.auditRetentionDays = Number(retEl.value) || 90;

        const sessEl = document.getElementById('settingSessionTimeoutMinutes');
        if (sessEl) curSettings.adminPreferences.sessionTimeoutMinutes = Number(sessEl.value) || 30;

        const densEl = document.getElementById('settingTableDensity');
        if (densEl) curSettings.adminPreferences.tableDensity = densEl.value;
      }

      // Simulate loading state
      AppState.settingsView.saving = true;
      const saveBtn = document.getElementById('settingsSaveBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving Changes...';
      }

      setTimeout(async () => {
        try {
          await Data.saveSettings(curSettings);
          AppState.settingsView.saving = false;
          AppState.settingsView.dirty = false;
          AppState.hasUnsavedChanges = false;
          showToast('Settings Saved', 'Platform governance configuration successfully committed.', 'success');
          renderSettingsView();
        } catch (err) {
          AppState.settingsView.saving = false;
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Settings';
          }
          showToast('Save Error', err.message || 'Unable to update platform settings.', 'error');
        }
      }, 350);
    },

    resetPlatformData: () => {
      if (confirm('Reset platform data back to system defaults?')) {
        Data.resetToDefaults();
        showToast('Reset Complete', 'Platform state restored to default seed values.', 'info');
        renderRoute(AppState.currentRoute);
      }
    },
    resetMockData: function() { return NexvionAdminApp.resetPlatformData(); }
  };

  // --------------------------------------------------------------------------
  // 8. INITIALIZATION
  // --------------------------------------------------------------------------
  function init() {
    DOM.layout = document.querySelector('.adm-layout');
    DOM.sidebar = document.getElementById('admSidebar');
    DOM.backdrop = document.getElementById('admBackdrop');
    DOM.content = document.getElementById('admContentHost');
    DOM.breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    DOM.roleSelect = document.getElementById('admRoleSelect');
    DOM.toastContainer = document.getElementById('admToastContainer');

    DOM.modalBackdrop = document.getElementById('admModalBackdrop');
    DOM.modalTitle = document.getElementById('admModalTitle');
    DOM.modalBody = document.getElementById('admModalBody');
    DOM.modalFooter = document.getElementById('admModalFooter');

    DOM.drawerBackdrop = document.getElementById('admDrawerBackdrop');
    DOM.drawerTitle = document.getElementById('admDrawerTitle');
    DOM.drawerBody = document.getElementById('admDrawerBody');

    // Bind Navigation Link Clicks
    document.querySelectorAll('.adm-nav-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        if (route) navigateTo(route);
      });
    });

    // Mobile Hamburger Toggle
    document.getElementById('admMobileToggle')?.addEventListener('click', toggleMobileSidebar);
    DOM.backdrop?.addEventListener('click', closeMobileSidebar);

    // Sidebar Collapse Button
    document.getElementById('admCollapseBtn')?.addEventListener('click', toggleSidebarCollapse);

    // Modal Close Button
    document.getElementById('admModalCloseBtn')?.addEventListener('click', closeModal);
    DOM.modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === DOM.modalBackdrop) closeModal();
    });

    // Drawer Close Button
    document.getElementById('admDrawerCloseBtn')?.addEventListener('click', closeDrawer);
    DOM.drawerBackdrop?.addEventListener('click', (e) => {
      if (e.target === DOM.drawerBackdrop) closeDrawer();
    });

    // Role Switcher in Topbar
    if (DOM.roleSelect) {
      DOM.roleSelect.addEventListener('change', (e) => {
        window.NexvionAdminApp.switchRole(e.target.value);
      });
    }

    // Handle History popstate (Back/Forward)
    window.addEventListener('popstate', () => {
      const path = parseCurrentPath();
      AppState.currentRoute = path;
      updateSidebarActiveState(path);
      renderRoute(path);
    });

    // Initial Route Render
    const initialPath = parseCurrentPath();
    AppState.currentRoute = initialPath;
    updateSidebarActiveState(initialPath);
    renderRoute(initialPath);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
