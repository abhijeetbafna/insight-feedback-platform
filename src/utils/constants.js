/**
 * InSight — Global Constants, Storage Keys, and Default Seed Data
 */

export const STORE_KEY = 'insight_submissions';
export const PROJECTS_KEY = 'insight_projects';
export const BROADCAST_CHANNEL_NAME = 'insight_channel';

export const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'liked', label: '👍 Praise (Liked)' },
  { value: 'improvement', label: '🛠️ Improvement' },
  { value: 'bug', label: '🐛 Bug Report' },
  { value: 'feature_request', label: '💡 Feature Request' }
];

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'wont_fix', label: "Won't Fix" }
];

export const ASSIGNEE_OPTIONS = [
  'Unassigned',
  'Product Manager',
  'Dev Team Lead',
  'UI Designer',
  'QA Specialist',
  'Security Engineer'
];

export const DEFAULT_PROJECTS = [
  {
    key: 'PRJ-ANALYTICS',
    name: 'Acme Analytics Hub',
    releaseVersion: 'v2.4.1-beta',
    color: '#1677FF',
    position: 'bottom-right'
  },
  {
    key: 'PRJ-CHECKOUT',
    name: 'E-Commerce Ops Dashboard',
    releaseVersion: 'v1.8.0',
    color: '#52C41A',
    position: 'bottom-right'
  },
  {
    key: 'PRJ-INVENTORY',
    name: 'Inventory & Supply Portal',
    releaseVersion: 'v3.1.2',
    color: '#FAAD14',
    position: 'bottom-left'
  }
];

export const DEFAULT_SUBMISSIONS = [
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
    tags: ['bug', 'P1'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
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
    tags: ['feature_request', 'UX'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
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
    tags: ['praise', 'ui'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
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
    tags: ['improvement', 'design'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];
