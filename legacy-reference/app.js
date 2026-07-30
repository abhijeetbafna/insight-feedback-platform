/**
 * InSight — Central Dashboard Controller (Ant Design 5.0 System)
 */

(function () {
  const STORE_KEY = 'insight_submissions';
  const PROJECTS_KEY = 'insight_projects';

  const defaultProjects = [
    { key: 'PRJ-ANALYTICS', name: 'Acme Analytics Hub', releaseVersion: 'v2.4.1-beta', color: '#1677FF', position: 'bottom-right' },
    { key: 'PRJ-CHECKOUT', name: 'E-Commerce Ops Dashboard', releaseVersion: 'v1.8.0', color: '#52C41A', position: 'bottom-right' },
    { key: 'PRJ-INVENTORY', name: 'Inventory & Supply Portal', releaseVersion: 'v3.1.2', color: '#FAAD14', position: 'bottom-left' }
  ];

  const defaultSubmissions = [
    {
      id: 'SUB-982103',
      projectKey: 'PRJ-ANALYTICS',
      category: 'bug',
      comment: 'Chart export to PDF crashes when selecting custom date ranges older than 90 days. Uncaught RangeError: Invalid time value in bundle.js:412.',
      status: 'new',
      component: 'Date Range Selector',
      selector: '#customDateRangePicker',
      metadata: {
        pageUrl: 'https://analytics.internal.co/reports/revenue',
        path: '/reports/revenue',
        browser: 'Chrome 126.0 (Windows 11)',
        os: 'Windows',
        viewport: '1440 x 900',
        releaseVersion: 'v2.4.1-beta',
        reporter: { name: 'Sarah Jenkins', email: 'sarah.j@company.com' },
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      attachment: null,
      assignedTo: 'Dev Team Lead',
      tags: ['bug', 'P1']
    },
    {
      id: 'SUB-764319',
      projectKey: 'PRJ-CHECKOUT',
      category: 'feature_request',
      comment: 'It would be super helpful to have a quick batch approve button for pending refunds instead of opening each modal one by one.',
      status: 'planned',
      component: 'Refunds Table Header',
      selector: '.table-header-actions',
      metadata: {
        pageUrl: 'https://checkout-admin.internal.co/refunds',
        path: '/refunds',
        browser: 'Safari 17.4 (macOS)',
        os: 'macOS',
        viewport: '1720 x 1080',
        releaseVersion: 'v1.8.0',
        reporter: { name: 'Michael Chang', email: 'm.chang@company.com' },
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      attachment: null,
      assignedTo: 'Product Manager',
      tags: ['feature_request', 'UX']
    },
    {
      id: 'SUB-552109',
      projectKey: 'PRJ-ANALYTICS',
      category: 'liked',
      comment: 'The new dark mode toggle and real-time refresh rate on the KPI summary card are fantastic! Huge speed improvement.',
      status: 'resolved',
      component: 'KPI Overview Panel',
      selector: '#kpiOverview',
      metadata: {
        pageUrl: 'https://analytics.internal.co/dashboard',
        path: '/dashboard',
        browser: 'Firefox 127.0 (Linux)',
        os: 'Linux',
        viewport: '1920 x 1080',
        releaseVersion: 'v2.4.1-beta',
        reporter: { name: 'David Ross', email: 'd.ross@company.com' },
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      attachment: null,
      assignedTo: 'Unassigned',
      tags: ['praise', 'ui']
    },
    {
      id: 'SUB-331084',
      projectKey: 'PRJ-INVENTORY',
      category: 'improvement',
      comment: 'Table column sorting indicator is very faint in light mode. Can we make the sorting arrows higher contrast?',
      status: 'in_progress',
      component: 'SKU Inventory Grid',
      selector: '.sku-grid-header',
      metadata: {
        pageUrl: 'https://inventory.internal.co/stock',
        path: '/stock',
        browser: 'Edge 126.0 (Windows)',
        os: 'Windows',
        viewport: '1536 x 864',
        releaseVersion: 'v3.1.2',
        reporter: { name: 'Elena Rostova', email: 'elena.r@company.com' },
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      attachment: null,
      assignedTo: 'UI Designer',
      tags: ['improvement', 'design']
    }
  ];

  function getProjects() {
    try {
      const stored = localStorage.getItem(PROJECTS_KEY);
      return stored ? JSON.parse(stored) : defaultProjects;
    } catch (e) {
      return defaultProjects;
    }
  }

  function getSubmissions() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      return stored ? JSON.parse(stored) : defaultSubmissions;
    } catch (e) {
      return defaultSubmissions;
    }
  }

  function saveSubmissions(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }

  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem(STORE_KEY)) {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultSubmissions));
  }

  // App State Variables
  let projects = getProjects();
  let submissions = getSubmissions();
  let activeTab = 'inbox';
  let selectedProjectKey = 'ALL';
  let activeCategoryFilter = 'ALL';
  let activeStatusFilter = 'ALL';
  let activeReleaseFilter = 'ALL';
  let searchQuery = '';
  let activeSubmission = null;

  // Element Handles
  const projectSelectHeader = document.getElementById('projectSelectHeader');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const menuItems = document.querySelectorAll('.ant-menu-item');
  const viewSections = document.querySelectorAll('.view-section');

  const statTotal = document.getElementById('statTotal');
  const statBugs = document.getElementById('statBugs');
  const statRequests = document.getElementById('statRequests');
  const statPraise = document.getElementById('statPraise');

  const searchInput = document.getElementById('searchInput');
  const filterCategorySelect = document.getElementById('filterCategorySelect');
  const filterStatusSelect = document.getElementById('filterStatusSelect');
  const filterReleaseSelect = document.getElementById('filterReleaseSelect');
  const inboxTableBody = document.getElementById('inboxTableBody');

  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerCategoryBadge = document.getElementById('drawerCategoryBadge');
  const drawerStatusSelect = document.getElementById('drawerStatusSelect');
  const drawerCommentText = document.getElementById('drawerCommentText');
  const drawerComponentSpan = document.getElementById('drawerComponentSpan');
  const drawerSelectorSpan = document.getElementById('drawerSelectorSpan');
  const drawerReporterSpan = document.getElementById('drawerReporterSpan');
  const drawerUrlSpan = document.getElementById('drawerUrlSpan');
  const drawerBrowserSpan = document.getElementById('drawerBrowserSpan');
  const drawerOsSpan = document.getElementById('drawerOsSpan');
  const drawerReleaseSpan = document.getElementById('drawerReleaseSpan');
  const drawerTimeSpan = document.getElementById('drawerTimeSpan');
  const drawerMediaContainer = document.getElementById('drawerMediaContainer');
  const drawerAssigneeSelect = document.getElementById('drawerAssigneeSelect');

  const projectListContainer = document.getElementById('projectListContainer');
  const btnCreateProject = document.getElementById('btnCreateProject');
  const embedSnippetBox = document.getElementById('embedSnippetBox');
  const copySnippetBtn = document.getElementById('copySnippetBtn');

  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnTestWebhook = document.getElementById('btnTestWebhook');
  const webhookOutput = document.getElementById('webhookOutput');

  function initHeader() {
    projectSelectHeader.innerHTML = `<option value="ALL">🌐 All Projects (${projects.length})</option>` +
      projects.map(p => `<option value="${p.key}">${p.name} (${p.key})</option>`).join('');

    projectSelectHeader.addEventListener('change', (e) => {
      selectedProjectKey = e.target.value;
      renderAllViews();
    });

    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.getAttribute('data-theme') !== 'light';
      document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeToggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    });

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuItems.forEach(n => n.classList.remove('ant-menu-item-selected'));
        item.classList.add('ant-menu-item-selected');
        activeTab = item.getAttribute('data-tab');
        switchViewSection(activeTab);
      });
    });
  }

  function switchViewSection(tabKey) {
    viewSections.forEach(sec => {
      if (sec.id === `section-${tabKey}`) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
    renderAllViews();
  }

  function getFilteredSubmissions() {
    submissions = getSubmissions();
    return submissions.filter(s => {
      if (selectedProjectKey !== 'ALL' && s.projectKey !== selectedProjectKey) return false;
      if (activeCategoryFilter !== 'ALL' && s.category !== activeCategoryFilter) return false;
      if (activeStatusFilter !== 'ALL' && s.status !== activeStatusFilter) return false;
      if (activeReleaseFilter !== 'ALL' && s.metadata.releaseVersion !== activeReleaseFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const textMatch = s.comment.toLowerCase().includes(q) ||
          s.component.toLowerCase().includes(q) ||
          s.metadata.reporter.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q);
        if (!textMatch) return false;
      }
      return true;
    });
  }

  function renderAllViews() {
    const list = getFilteredSubmissions();

    statTotal.textContent = list.length;
    statBugs.textContent = list.filter(s => s.category === 'bug').length;
    statRequests.textContent = list.filter(s => s.category === 'feature_request').length;
    statPraise.textContent = list.filter(s => s.category === 'liked').length;

    const releaseVersions = Array.from(new Set(submissions.map(s => s.metadata.releaseVersion)));
    filterReleaseSelect.innerHTML = `<option value="ALL">All Releases</option>` +
      releaseVersions.map(v => `<option value="${v}">${v}</option>`).join('');
    filterReleaseSelect.value = activeReleaseFilter;

    if (activeTab === 'inbox') {
      renderInboxTable(list);
    } else if (activeTab === 'kanban') {
      renderKanbanBoard(list);
    } else if (activeTab === 'projects') {
      renderProjectsTab();
    }
  }

  function renderInboxTable(list) {
    if (list.length === 0) {
      inboxTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 40px; color: var(--text-tertiary);">
            No feedback submissions found matching your active filters.
          </td>
        </tr>
      `;
      return;
    }

    inboxTableBody.innerHTML = list.map(item => {
      const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      let tagClass = 'ant-tag-success';
      let catLabel = '👍 Praise';
      if (item.category === 'bug') { tagClass = 'ant-tag-error'; catLabel = '🐛 Bug'; }
      else if (item.category === 'feature_request') { tagClass = 'ant-tag-processing'; catLabel = '💡 Feature'; }
      else if (item.category === 'improvement') { tagClass = 'ant-tag-warning'; catLabel = '🛠️ Improvement'; }

      const statusTagMap = {
        new: 'ant-tag-processing',
        in_review: 'ant-tag-warning',
        planned: 'ant-tag-purple',
        in_progress: 'ant-tag-processing',
        resolved: 'ant-tag-success',
        wont_fix: 'ant-tag'
      };

      return `
        <tr data-sub-id="${item.id}">
          <td style="font-weight:600; color:var(--ant-primary);">${item.id}</td>
          <td><span class="ant-tag ${tagClass}">${catLabel}</span></td>
          <td>
            <div style="font-weight:500; color:var(--text-main); max-width: 320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(item.comment)}
            </div>
            <div style="font-size:11px; color:var(--text-tertiary); margin-top:2px;">
              🎯 ${escapeHtml(item.component)} (${item.projectKey})
            </div>
          </td>
          <td><span class="ant-tag ${statusTagMap[item.status] || 'ant-tag'}">${item.status.replace('_', ' ').toUpperCase()}</span></td>
          <td>${escapeHtml(item.metadata.reporter.name)}</td>
          <td><span class="ant-tag">${item.metadata.releaseVersion}</span></td>
          <td style="font-size:12px; color:var(--text-tertiary);">${dateStr}</td>
        </tr>
      `;
    }).join('');

    inboxTableBody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => openDetailDrawer(row.getAttribute('data-sub-id')));
    });
  }

  function renderKanbanBoard(list) {
    const columns = [
      { key: 'new', label: 'New', color: '#1677FF' },
      { key: 'in_review', label: 'In Review', color: '#FAAD14' },
      { key: 'planned', label: 'Planned', color: '#722ED1' },
      { key: 'in_progress', label: 'In Progress', color: '#13C2C2' },
      { key: 'resolved', label: 'Resolved', color: '#52C41A' }
    ];

    columns.forEach(col => {
      const colEl = document.getElementById(`kanban-col-${col.key}`);
      if (!colEl) return;

      const colItems = list.filter(s => s.status === col.key);
      const countEl = colEl.querySelector('.col-count');
      if (countEl) countEl.textContent = colItems.length;

      const cardContainer = colEl.querySelector('.kanban-cards-container');
      if (!cardContainer) return;

      if (colItems.length === 0) {
        cardContainer.innerHTML = `<div style="font-size:12px; color:var(--text-tertiary); text-align:center; padding:24px 0;">No items</div>`;
      } else {
        cardContainer.innerHTML = colItems.map(item => `
          <div class="ant-kanban-card" data-sub-id="${item.id}">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span class="ant-tag ant-tag-processing" style="font-size:11px;">${item.category}</span>
              <span style="font-size:11px; color:var(--text-tertiary);">${item.projectKey}</span>
            </div>
            <div style="font-size:13px; font-weight:500; color:var(--text-main); margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              ${escapeHtml(item.comment)}
            </div>
            <div style="font-size:11px; color:var(--text-tertiary); display:flex; align-items:center; justify-content:space-between;">
              <span>🎯 ${escapeHtml(item.component)}</span>
              <span>👤 ${escapeHtml(item.assignedTo)}</span>
            </div>
          </div>
        `).join('');

        cardContainer.querySelectorAll('.ant-kanban-card').forEach(card => {
          card.addEventListener('click', () => openDetailDrawer(card.getAttribute('data-sub-id')));
        });
      }
    });
  }

  function openDetailDrawer(subId) {
    activeSubmission = submissions.find(s => s.id === subId);
    if (!activeSubmission) return;

    drawerTitle.textContent = `${activeSubmission.id} — ${activeSubmission.component}`;
    drawerCategoryBadge.textContent = activeSubmission.category.toUpperCase();

    drawerStatusSelect.value = activeSubmission.status;
    drawerCommentText.textContent = activeSubmission.comment;
    drawerComponentSpan.textContent = activeSubmission.component;
    drawerSelectorSpan.textContent = activeSubmission.selector;

    drawerReporterSpan.textContent = `${activeSubmission.metadata.reporter.name} (${activeSubmission.metadata.reporter.email})`;
    drawerUrlSpan.textContent = activeSubmission.metadata.pageUrl;
    drawerBrowserSpan.textContent = activeSubmission.metadata.browser;
    drawerOsSpan.textContent = `${activeSubmission.metadata.os} | Viewport: ${activeSubmission.metadata.viewport}`;
    drawerReleaseSpan.textContent = activeSubmission.metadata.releaseVersion;
    drawerTimeSpan.textContent = new Date(activeSubmission.createdAt).toLocaleString();
    drawerAssigneeSelect.value = activeSubmission.assignedTo || 'Unassigned';

    if (activeSubmission.attachment) {
      drawerMediaContainer.style.display = 'block';
      if (activeSubmission.attachment.type === 'image') {
        drawerMediaContainer.innerHTML = `
          <div style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">📷 Annotated Screenshot Attachment:</div>
          <img src="${activeSubmission.attachment.dataUrl}" style="width:100%; border-radius:6px; border:1px solid var(--border-color-split);" />
        `;
      } else if (activeSubmission.attachment.type === 'video') {
        drawerMediaContainer.innerHTML = `
          <div style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">🎥 Screen Video Playback:</div>
          <video src="${activeSubmission.attachment.dataUrl}" controls style="width:100%; border-radius:6px; border:1px solid var(--border-color-split);"></video>
        `;
      }
    } else {
      drawerMediaContainer.style.display = 'none';
    }

    drawerBackdrop.classList.add('open');
  }

  closeDrawerBtn.addEventListener('click', () => drawerBackdrop.classList.remove('open'));
  drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) drawerBackdrop.classList.remove('open');
  });

  drawerStatusSelect.addEventListener('change', (e) => {
    if (!activeSubmission) return;
    activeSubmission.status = e.target.value;
    saveSubmissions(submissions);
    renderAllViews();
  });

  drawerAssigneeSelect.addEventListener('change', (e) => {
    if (!activeSubmission) return;
    activeSubmission.assignedTo = e.target.value;
    saveSubmissions(submissions);
    renderAllViews();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderAllViews();
  });

  filterCategorySelect.addEventListener('change', (e) => {
    activeCategoryFilter = e.target.value;
    renderAllViews();
  });

  filterStatusSelect.addEventListener('change', (e) => {
    activeStatusFilter = e.target.value;
    renderAllViews();
  });

  filterReleaseSelect.addEventListener('change', (e) => {
    activeReleaseFilter = e.target.value;
    renderAllViews();
  });

  function renderProjectsTab() {
    projectListContainer.innerHTML = projects.map(p => `
      <div class="ant-card" style="margin-bottom:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <h3 style="font-size:15px; font-weight:600; color:var(--text-main);">${escapeHtml(p.name)}</h3>
            <div style="font-size:12px; color:var(--text-tertiary); margin-top:2px;">
              Project Key: <code style="color:var(--ant-primary); font-weight:600;">${p.key}</code> | Release Tag: <strong>${p.releaseVersion}</strong>
            </div>
          </div>
          <button class="ant-btn ant-btn-primary select-proj-btn" data-key="${p.key}">Get Embed Code</button>
        </div>
      </div>
    `).join('');

    projectListContainer.querySelectorAll('.select-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const proj = projects.find(p => p.key === key);
        if (!proj) return;
        embedSnippetBox.textContent = `<script src="d:/Feedback Tool/insight-widget.js" data-project-key="${proj.key}" data-release-version="${proj.releaseVersion}" data-color="${proj.color}" data-position="${proj.position}"></script>`;
      });
    });
  }

  btnCreateProject.addEventListener('click', () => {
    const name = prompt('Enter Product Name:', 'New Enterprise App');
    if (!name) return;
    const key = 'PRJ-' + name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
    projects.push({ key, name, releaseVersion: 'v1.0.0', color: '#1677FF', position: 'bottom-right' });
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    initHeader();
    renderProjectsTab();
  });

  copySnippetBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(embedSnippetBox.textContent);
    alert('Embed script copied to clipboard!');
  });

  btnExportCSV.addEventListener('click', () => {
    const list = getFilteredSubmissions();
    if (list.length === 0) {
      alert('No feedback entries to export!');
      return;
    }
    const headers = ['ID', 'ProjectKey', 'Category', 'Status', 'Component', 'Comment', 'ReporterName', 'ReporterEmail', 'PageURL', 'ReleaseVersion', 'Browser', 'OS', 'CreatedAt'];
    const rows = list.map(s => [
      s.id, s.projectKey, s.category, s.status,
      `"${s.component.replace(/"/g, '""')}"`,
      `"${s.comment.replace(/"/g, '""')}"`,
      `"${s.metadata.reporter.name}"`,
      s.metadata.reporter.email, s.metadata.pageUrl, s.metadata.releaseVersion,
      `"${s.metadata.browser}"`, s.metadata.os, s.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `insight_feedback_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  btnTestWebhook.addEventListener('click', () => {
    webhookOutput.textContent = JSON.stringify({
      event: 'feedback.submission_created',
      timestamp: new Date().toISOString(),
      payload: submissions[0] || {}
    }, null, 2);
  });

  window.addEventListener('insight:submission', () => {
    submissions = getSubmissions();
    renderAllViews();
  });

  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('insight_channel');
    channel.onmessage = (e) => {
      if (e.data && e.data.type === 'NEW_SUBMISSION') {
        submissions = getSubmissions();
        renderAllViews();
      }
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  initHeader();
  renderAllViews();
})();
