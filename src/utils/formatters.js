/**
 * InSight — Formatting Utilities for Dates, Status Labels, and Categories
 */

export function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Unknown';
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const hours = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hour12}:${mins} ${ampm}`;
  } catch (err) {
    return 'Unknown';
  }
}

export function getCategoryBadgeProps(category) {
  switch (category) {
    case 'bug':
      return { label: '🐛 Bug', variant: 'error' };
    case 'feature_request':
      return { label: '💡 Feature', variant: 'processing' };
    case 'improvement':
      return { label: '🛠️ Improvement', variant: 'warning' };
    case 'liked':
      return { label: '👍 Praise', variant: 'success' };
    default:
      return { label: category || 'Feedback', variant: 'default' };
  }
}

export function getStatusBadgeProps(status) {
  switch (status) {
    case 'new':
      return { label: 'New', variant: 'processing' };
    case 'in_review':
      return { label: 'In Review', variant: 'warning' };
    case 'planned':
      return { label: 'Planned', variant: 'purple' };
    case 'in_progress':
      return { label: 'In Progress', variant: 'cyan' };
    case 'resolved':
      return { label: 'Resolved', variant: 'success' };
    case 'wont_fix':
      return { label: "Won't Fix", variant: 'default' };
    default:
      return { label: status || 'New', variant: 'default' };
  }
}
