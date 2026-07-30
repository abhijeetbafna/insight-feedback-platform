/**
 * InSight — Data Export Service (CSV Generator)
 * Exports filtered submissions to a clean, standard CSV file download.
 */

export function exportSubmissionsToCSV(submissions, filename = 'insight_feedback_export.csv') {
  if (!submissions || submissions.length === 0) {
    return false;
  }

  const headers = [
    'ID',
    'Project Key',
    'Category',
    'Status',
    'Component',
    'Comment',
    'Reporter Name',
    'Reporter Email',
    'Release Version',
    'Page URL',
    'Browser',
    'OS',
    'Assigned To',
    'Submission Time'
  ];

  const escapeCsvCell = (val) => {
    if (val === null || val === undefined) return '""';
    const stringified = String(val).replace(/"/g, '""');
    return `"${stringified}"`;
  };

  const rows = submissions.map((s) => [
    escapeCsvCell(s.id),
    escapeCsvCell(s.projectKey),
    escapeCsvCell(s.category),
    escapeCsvCell(s.status),
    escapeCsvCell(s.component),
    escapeCsvCell(s.comment),
    escapeCsvCell(s.metadata?.reporter?.name || 'Anonymous'),
    escapeCsvCell(s.metadata?.reporter?.email || ''),
    escapeCsvCell(s.metadata?.releaseVersion || ''),
    escapeCsvCell(s.metadata?.pageUrl || ''),
    escapeCsvCell(s.metadata?.browser || ''),
    escapeCsvCell(s.metadata?.os || ''),
    escapeCsvCell(s.assignedTo || 'Unassigned'),
    escapeCsvCell(s.createdAt || s.metadata?.timestamp || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
