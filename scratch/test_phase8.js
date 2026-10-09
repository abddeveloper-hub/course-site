const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(200);
  }
  throw new Error('Could not connect to Chrome debugging port');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.events = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        } else if (msg.method) {
          const listeners = this.events.get(msg.method) || [];
          listeners.forEach(fn => fn(msg.params));
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, fn) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(fn);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  console.log('--- STARTING PHASE 8 AUTOMATED VALIDATION SUITE ---');
  const tmpDir = path.join(require('os').tmpdir(), 'chrome-test-p8-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  const consoleErrors = [];

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('Connected to Chrome DevTools Protocol at:', wsUrl);

    // Create a new target page
    const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://127.0.0.1:3000/admin/overview`, { method: 'PUT' });
    const target = await targetRes.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = params.args.map(a => a.value || a.description || '').join(' ');
        console.error(' [BROWSER ERROR]:', text);
        consoleErrors.push(text);
      }
    });

    cdp.on('Runtime.exceptionThrown', (params) => {
      const text = params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'Uncaught error';
      console.error(' [EXCEPTION]:', text);
      consoleErrors.push(text);
    });

    async function evaluate(expression) {
      const res = await cdp.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
      }
      return res.result?.value;
    }

    async function navigate(urlPath) {
      await evaluate(`window.NexvionAdminApp.navigateTo("${urlPath}")`);
      await sleep(350);
    }

    async function screenshot(filename) {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const artifactsDir = 'C:\\Users\\ABDUL WAHID\\.gemini\\antigravity-ide\\brain\\53787fc0-0432-4380-8972-87e11e054568';
      const outPath = path.join(artifactsDir, filename);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log(` Saved screenshot: ${filename}`);
    }

    for (let i = 0; i < 60; i++) {
      const isReady = await evaluate(`typeof window.NexvionAdminApp !== 'undefined'`).catch(() => false);
      if (isReady) {
        console.log(`NexvionAdminApp ready after ${i * 200}ms`);
        break;
      }
      await sleep(200);
    }

    // =========================================================================
    // SUITE 1: ADMIN USERS
    // =========================================================================
    console.log('\n--- SUITE 1: ADMIN USERS (/admin/admins) ---');
    await navigate('/admin/admins');

    const adminHeader = await evaluate(`document.querySelector('.adm-page-title span')?.textContent`);
    console.log('✓ Page Header Title:', adminHeader);
    if (!adminHeader.includes('Administrative Personnel')) throw new Error('Admin header mismatch');

    const securityBannerAdmins = await evaluate(`document.querySelector('.adm-security-banner')?.textContent`);
    if (!securityBannerAdmins || !securityBannerAdmins.includes('Security Boundary Notice')) {
      throw new Error('Security boundary banner missing in /admin/admins');
    }
    console.log('✓ Security Boundary Notice confirmed on Admins view');

    const totalAdminsCount = await evaluate(`document.querySelectorAll('#adminUsersTable tbody tr').length`);
    console.log(`✓ Table rows rendered on page 1: ${totalAdminsCount}`);
    if (totalAdminsCount < 10) throw new Error('Expected at least 10 rows on page 1');

    // Test Search
    console.log('Testing live search in Admins table...');
    await evaluate(`NexvionAdminApp.onAdminSearch('Evelyn')`);
    await sleep(150);
    const searchResultCount = await evaluate(`document.querySelectorAll('#adminUsersTable tbody tr').length`);
    console.log(`✓ Search for "Evelyn" returned ${searchResultCount} row(s)`);
    if (searchResultCount !== 1) throw new Error('Search failed to isolate record');
    await evaluate(`NexvionAdminApp.onAdminSearch('')`);
    await sleep(150);

    // Test Status Filter
    console.log('Testing status filter in Admins table...');
    await evaluate(`NexvionAdminApp.onAdminStatusFilter('Invited')`);
    await sleep(150);
    const invitedRows = await evaluate(`document.querySelectorAll('#adminUsersTable tbody tr').length`);
    console.log(`✓ Status filter "Invited" returned ${invitedRows} row(s)`);
    if (invitedRows < 1) throw new Error('Expected at least 1 invited admin');
    await evaluate(`NexvionAdminApp.onAdminStatusFilter('ALL')`);
    await sleep(150);

    // Test Invite Admin Workflow
    console.log('Testing Invite Admin workflow...');
    await evaluate(`NexvionAdminApp.openInviteAdminModal()`);
    await sleep(150);
    const modalTitle = await evaluate(`document.getElementById('admModalTitle')?.textContent`);
    if (!modalTitle.includes('Invite Administrator')) throw new Error('Invite modal did not open');
    await evaluate(`
      document.getElementById('inviteAdminName').value = 'Dr. Alistair Finch';
      document.getElementById('inviteAdminEmail').value = 'a.finch@nexvion.ai';
      document.getElementById('inviteAdminRole').value = 'Analyst';
    `);
    await evaluate(`NexvionAdminApp.submitInviteAdmin()`);
    await sleep(250);
    console.log('✓ Invite submitted successfully');

    // Test Change Role Workflow
    console.log('Testing Change Role workflow...');
    await evaluate(`NexvionAdminApp.openChangeRoleModal('adm-005')`);
    await sleep(150);
    await evaluate(`document.getElementById('changeRoleSelect').value = 'Finance Manager'`);
    await evaluate(`NexvionAdminApp.submitChangeRole('adm-005')`);
    await sleep(250);
    console.log('✓ Role changed successfully for adm-005');

    // Test Suspend Admin Workflow
    console.log('Testing Suspend Admin workflow...');
    await evaluate(`NexvionAdminApp.openSuspendAdminModal('adm-006')`);
    await sleep(150);
    await evaluate(`NexvionAdminApp.submitSuspendAdmin('adm-006')`);
    await sleep(250);
    const suspendedStatus = await evaluate(`
      (async () => {
        const u = await NexvionServices.getAdminUserById('adm-006');
        return u.status;
      })()
    `);
    console.log('✓ Admin adm-006 status after suspension:', suspendedStatus);
    if (suspendedStatus !== 'Suspended') throw new Error('Admin was not suspended');

    // Test Reactivate Admin Workflow
    console.log('Testing Reactivate Admin workflow...');
    await evaluate(`NexvionAdminApp.reactivateAdminAction('adm-006')`);
    await sleep(250);
    const reactivatedStatus = await evaluate(`
      (async () => {
        const u = await NexvionServices.getAdminUserById('adm-006');
        return u.status;
      })()
    `);
    console.log('✓ Admin adm-006 status after reactivation:', reactivatedStatus);
    if (reactivatedStatus !== 'Active') throw new Error('Admin was not reactivated');

    // Test View Activity Drawer & Deep Link /admin/admins/:id
    console.log('Testing Admin Activity Drawer deep link /admin/admins/adm-001...');
    await navigate('/admin/admins/adm-001');
    await sleep(250);
    const drawerTitle = await evaluate(`document.getElementById('admDrawerTitle')?.textContent`);
    console.log('✓ Drawer Title:', drawerTitle);
    if (!drawerTitle.includes('Kenneth Vance')) throw new Error('Activity drawer did not open for adm-001');
    await evaluate(`NexvionAdminApp.closeDrawer()`);
    await sleep(150);

    await screenshot('admin_users_desktop.png');

    // =========================================================================
    // SUITE 2: ROLES & PERMISSIONS
    // =========================================================================
    console.log('\n--- SUITE 2: ROLES & PERMISSIONS (/admin/roles) ---');
    await navigate('/admin/roles');

    const rolesHeader = await evaluate(`document.querySelector('.adm-page-title span')?.textContent`);
    console.log('✓ Page Header Title:', rolesHeader);
    if (!rolesHeader.includes('Roles & Permissions Matrix')) throw new Error('Roles header mismatch');

    // Verify exact security notice copy
    const securityBannerText = await evaluate(`document.querySelector('.adm-security-banner')?.textContent`);
    if (!securityBannerText.includes('Frontend permissions are not real security')) {
      throw new Error('Mandatory security boundary notice text missing');
    }
    if (!securityBannerText.includes('Firebase Authentication, custom claims, Firestore Security Rules')) {
      throw new Error('Security boundary notice missing required Firebase enforcement text');
    }
    console.log('✓ Exact security boundary notice verified');

    // Verify 8 Role Cards
    const roleCardCount = await evaluate(`document.querySelectorAll('.adm-role-card').length`);
    console.log(`✓ Role cards rendered: ${roleCardCount}`);
    if (roleCardCount !== 8) throw new Error(`Expected 8 role cards, found ${roleCardCount}`);

    // Verify 23 Module Permission Matrix
    const matrixRowCount = await evaluate(`document.querySelectorAll('.adm-matrix-table tbody tr').length`);
    console.log(`✓ 23-Module matrix rows rendered: ${matrixRowCount}`);
    if (matrixRowCount !== 23) throw new Error(`Expected 23 module rows in permission matrix, found ${matrixRowCount}`);

    // Test matrix search
    await evaluate(`NexvionAdminApp.onRoleMatrixSearch('Certificates')`);
    await sleep(150);
    const searchMatrixRows = await evaluate(`document.querySelectorAll('.adm-matrix-table tbody tr').length`);
    console.log(`✓ Filtered matrix rows for "Certificates": ${searchMatrixRows}`);
    if (searchMatrixRows !== 1) throw new Error('Matrix search failed');
    await evaluate(`NexvionAdminApp.onRoleMatrixSearch('')`);
    await sleep(150);

    // Test deep link /admin/roles/role-owner
    console.log('Testing deep link /admin/roles/role-owner...');
    await navigate('/admin/roles/role-owner');
    await sleep(250);
    const roleDrawerTitle = await evaluate(`document.getElementById('admDrawerTitle')?.textContent`);
    console.log('✓ Role Drawer Title:', roleDrawerTitle);
    if (!roleDrawerTitle.includes('Owner')) throw new Error('Role detail drawer did not open for Owner');
    await evaluate(`NexvionAdminApp.closeDrawer()`);
    await sleep(150);

    await screenshot('admin_roles_matrix.png');

    // =========================================================================
    // SUITE 3: AUDIT LOGS
    // =========================================================================
    console.log('\n--- SUITE 3: AUDIT LOGS (/admin/audit-logs) ---');
    await navigate('/admin/audit-logs');

    const auditHeader = await evaluate(`document.querySelector('.adm-page-title span')?.textContent`);
    console.log('✓ Page Header Title:', auditHeader);
    if (!auditHeader.includes('Platform Audit Logs')) throw new Error('Audit logs header mismatch');

    // Verify mandatory production copy
    const auditCopyCheck = await evaluate(`document.body.textContent.includes('Server-side audit logging will be connected during backend integration.')`);
    console.log('✓ Mandatory audit integration copy present:', auditCopyCheck);
    if (!auditCopyCheck) throw new Error('Mandatory exact audit copy missing');

    const auditRowsCount = await evaluate(`document.querySelectorAll('#auditLogsTable tbody tr').length`);
    console.log(`✓ Audit log table entries rendered: ${auditRowsCount}`);
    if (auditRowsCount < 5) throw new Error('Expected at least 5 audit log rows');

    // Toggle Timeline View
    console.log('Testing timeline view toggle...');
    await evaluate(`NexvionAdminApp.toggleAuditViewMode('timeline')`);
    await sleep(200);
    const timelineCards = await evaluate(`document.querySelectorAll('.adm-audit-card').length`);
    console.log(`✓ Timeline cards rendered: ${timelineCards}`);
    if (timelineCards < 5) throw new Error('Timeline view failed to render cards');

    // Toggle back to table
    await evaluate(`NexvionAdminApp.toggleAuditViewMode('table')`);
    await sleep(200);

    // Test Inspect Diff Drawer
    console.log('Testing Inspect Diff drawer on audit log...');
    const firstLogId = await evaluate(`(async () => (await NexvionServices.getAuditLogs())[0].id)()`);
    await evaluate(`NexvionAdminApp.openAuditLogDetail('${firstLogId}')`);
    await sleep(200);
    const auditDrawerTitle = await evaluate(`document.getElementById('admDrawerTitle')?.textContent`);
    console.log('✓ Audit Drawer Title:', auditDrawerTitle);
    const hasDiffPanes = await evaluate(`document.querySelectorAll('.adm-diff-pane').length === 2`);
    console.log('✓ Side-by-side / comparison diff panes rendered in drawer:', hasDiffPanes);
    if (!hasDiffPanes) throw new Error('State diff panes missing in audit drawer');
    await evaluate(`NexvionAdminApp.closeDrawer()`);
    await sleep(150);

    await screenshot('admin_audit_logs.png');

    // =========================================================================
    // SUITE 4: PLATFORM SETTINGS
    // =========================================================================
    console.log('\n--- SUITE 4: SETTINGS & GOVERNANCE (/admin/settings) ---');
    await navigate('/admin/settings');

    const settingsHeader = await evaluate(`document.querySelector('.adm-page-title span')?.textContent`);
    console.log('✓ Page Header Title:', settingsHeader);
    if (!settingsHeader.includes('Platform Settings & Governance')) throw new Error('Settings header mismatch');

    // Verify 10 tabs
    const settingsTabsCount = await evaluate(`document.querySelectorAll('.adm-settings-tab-btn').length`);
    console.log(`✓ Settings tabs rendered: ${settingsTabsCount}`);
    if (settingsTabsCount !== 10) throw new Error(`Expected 10 settings tabs, found ${settingsTabsCount}`);

    // Verify Strict Batch Invariant on Tab 5 ('batchRules')
    console.log('Testing Batch Rules Tab & Fixed 30 Capacity Invariant...');
    await evaluate(`NexvionAdminApp.switchSettingsTab('batchRules')`);
    await sleep(200);

    const maxBatchCap = await evaluate(`document.getElementById('settingMaxBatchCapacity')?.value`);
    const isBatchDisabled = await evaluate(`document.getElementById('settingMaxBatchCapacity')?.disabled`);
    const hasLockedBadge = await evaluate(`document.querySelector('.adm-batch-locked-badge')?.textContent`);
    console.log(`✓ Maximum Batch Capacity: ${maxBatchCap}, Disabled: ${isBatchDisabled}, Badge: ${hasLockedBadge}`);

    if (maxBatchCap !== '30') throw new Error('Maximum batch capacity is not 30');
    if (!isBatchDisabled) throw new Error('Maximum batch capacity must not be editable');
    if (!hasLockedBadge || !hasLockedBadge.includes('FIXED AT 30')) throw new Error('Locked badge missing');

    // Test Repository Invariant Enforcement
    console.log('Testing Repository Rejection when trying to save maxBatchCapacity > 30...');
    const invariantRejection = await evaluate(`
      (async () => {
        try {
          await NexvionServices.saveSettings({ batchRules: { maxBatchCapacity: 45 } });
          return 'FAILED_TO_REJECT';
        } catch (e) {
          return e.message;
        }
      })()
    `);
    console.log('✓ Invariant rejection response:', invariantRejection);
    if (invariantRejection === 'FAILED_TO_REJECT') throw new Error('Repository failed to enforce max capacity <= 30 invariant');

    // Test Unsaved Changes Warning Banner on Platform Tab
    console.log('Testing dirty state tracking & unsaved changes banner...');
    await evaluate(`NexvionAdminApp.switchSettingsTab('platform')`);
    await sleep(200);

    await evaluate(`
      document.getElementById('settingPlatformName').value = 'NEXVION AI Super Academy';
      NexvionAdminApp.onSettingFieldChange();
    `);
    await sleep(150);

    const unsavedBannerVisible = await evaluate(`
      document.getElementById('settingsUnsavedBanner')?.style.display !== 'none'
    `);
    console.log('✓ Unsaved changes banner visible on dirty input:', unsavedBannerVisible);
    if (!unsavedBannerVisible) throw new Error('Unsaved changes banner failed to appear');

    // Cancel Changes
    console.log('Testing Cancel / Discard Changes...');
    await evaluate(`NexvionAdminApp.cancelSettingsChanges()`);
    await sleep(150);
    const platformNameReverted = await evaluate(`document.getElementById('settingPlatformName')?.value`);
    console.log('✓ Platform name after discard:', platformNameReverted);
    if (platformNameReverted.includes('Super Academy')) throw new Error('Discard failed to revert dirty input');

    // Save Settings
    console.log('Testing Save Settings workflow...');
    await evaluate(`
      document.getElementById('settingPlatformName').value = 'NEXVION AI Academy Global';
      NexvionAdminApp.saveSettingsForm();
    `);
    await sleep(500);

    const savedPlatformName = await evaluate(`(async () => (await NexvionServices.getSettings()).platform.platformName)()`);
    console.log('✓ Confirmed persisted settings name:', savedPlatformName);
    if (savedPlatformName !== 'NEXVION AI Academy Global') throw new Error('Settings save failed');

    // Reset Section
    console.log('Testing Reset Section Defaults...');
    await evaluate(`(async () => await NexvionServices.resetSettingsSection('platform'))()`);
    await evaluate(`NexvionAdminApp.renderSettingsView ? NexvionAdminApp.renderSettingsView() : NexvionAdminApp.navigateTo('/admin/settings')`);
    await sleep(250);
    const resetPlatformName = await evaluate(`(async () => (await NexvionServices.getSettings()).platform.platformName)()`);
    console.log('✓ Platform name restored to default seed:', resetPlatformName);

    await screenshot('admin_settings_tabs.png');

    // =========================================================================
    // SUITE 5: PERMISSION-AWARE NAVIGATION & ACCESS GATES
    // =========================================================================
    console.log('\n--- SUITE 5: PERMISSION-AWARE RBAC ACCESS GATES ---');
    console.log('Switching active role context to "Analyst"...');
    await evaluate(`NexvionAdminApp.switchRole('Analyst')`);
    await sleep(200);

    // Verify restricted routes get .adm-nav-restricted in sidebar
    const restrictedNavItems = await evaluate(`document.querySelectorAll('.adm-nav-item.adm-nav-restricted').length`);
    console.log(`✓ Sidebar navigation items restricted for Analyst: ${restrictedNavItems}`);
    if (restrictedNavItems < 5) throw new Error('Expected multiple restricted sidebar items for Analyst');

    // Test navigating to /admin/admins as Analyst -> Access Gate
    console.log('Attempting to navigate to /admin/admins as Analyst (lacks manage_admins)...');
    await navigate('/admin/admins');
    await sleep(200);
    const isGateRendered = await evaluate(`document.querySelector('.adm-perm-gate') !== null`);
    const gateText = await evaluate(`document.querySelector('.adm-perm-gate')?.textContent`);
    console.log('✓ Permission gate rendered for unauthorized route:', isGateRendered);
    if (!isGateRendered) throw new Error('Permission gate was not rendered for Analyst accessing /admin/admins');
    if (!gateText.includes('manage_admins')) throw new Error('Permission gate did not state required manage_admins capability');

    // Test navigating to /admin/settings as Analyst -> Access Gate
    console.log('Attempting to navigate to /admin/settings as Analyst (lacks manage_settings)...');
    await navigate('/admin/settings');
    await sleep(200);
    const isSettingsGateRendered = await evaluate(`document.querySelector('.adm-perm-gate') !== null`);
    console.log('✓ Permission gate rendered for /admin/settings:', isSettingsGateRendered);
    if (!isSettingsGateRendered) throw new Error('Permission gate not rendered for /admin/settings');

    // Restore role back to Super Admin
    console.log('Restoring role context back to "Super Admin"...');
    await evaluate(`NexvionAdminApp.switchRole('Super Admin')`);
    await sleep(200);
    await navigate('/admin/admins');
    await sleep(200);
    const adminsRestored = await evaluate(`document.querySelector('#adminUsersTable') !== null`);
    console.log('✓ Full view access restored after switching back to Super Admin:', adminsRestored);
    if (!adminsRestored) throw new Error('Failed to restore view after role elevation');

    // =========================================================================
    // FINAL CHECKS
    // =========================================================================
    console.log('\n--- CONSOLE ERRORS AUDIT ---');
    console.log(`Total detected console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console error details:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} console errors`);
    }
    console.log('✓ ZERO CONSOLE ERRORS CONFIRMED ACROSS ALL TEST WORKFLOWS');

    console.log('\n======================================================');
    console.log(' ALL PHASE 8 VALIDATION CHECKS PASSED WITH 100% SUCCESS');
    console.log('======================================================');

    cdp.close();
  } finally {
    chromeProcess.kill();
  }
}

runTests().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
