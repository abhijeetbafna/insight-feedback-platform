/**
 * InSight — Detail Drawer Slide-over Panel (Glassmorphic Revamp)
 */

import React, { useEffect } from 'react';
import { CategoryBadge } from './Badge.jsx';
import { STATUS_OPTIONS, ASSIGNEE_OPTIONS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatters.js';

export function Drawer({
  isOpen,
  submission,
  onClose,
  onStatusChange,
  onAssigneeChange,
  onDelete
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!submission) return null;

  const metadata = submission.metadata || {};
  const reporter = metadata.reporter || { name: 'Anonymous', email: '' };

  // Resolve attachment dataUrl safely whether stored as object or string
  const attachmentUrl =
    typeof submission.attachment === 'object' && submission.attachment !== null
      ? submission.attachment.dataUrl
      : submission.attachment;

  return (
    <div
      className={`ant-drawer-mask ant-drawer-backdrop ${isOpen ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-label="Submission Details Drawer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: isOpen ? 'block' : 'none'
      }}
    >
      <div
        className="ant-drawer ant-drawer-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '90%',
          maxWidth: 620,
          background: 'var(--bg-container)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.35)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: 24
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ant-primary)' }}>
              {submission.id}
            </h3>
            <span
              className="ant-tag"
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {metadata.releaseVersion || 'v1.0.0'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onDelete && (
              <button
                className="ant-btn ant-btn-danger"
                onClick={() => onDelete(submission.id)}
                style={{ height: 32, fontSize: 12, padding: '0 12px' }}
                title="Delete submission"
                aria-label="Delete submission"
              >
                🗑️ Delete
              </button>
            )}
            <button className="close-btn" onClick={onClose} aria-label="Close drawer">
              ✕
            </button>
          </div>
        </div>

        {/* Status and Assignee Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            background: 'var(--bg-container)',
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--border-color)'
          }}
        >
          <CategoryBadge category={submission.category} />

          <select
            className="ant-select"
            value={submission.status || 'new'}
            onChange={(e) => onStatusChange(submission.id, e.target.value)}
            style={{ height: 30, fontSize: 12 }}
            aria-label="Update Submission Status"
          >
            {STATUS_OPTIONS.filter((opt) => opt.value !== 'ALL').map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            className="ant-select"
            value={submission.assignedTo || 'Unassigned'}
            onChange={(e) => onAssigneeChange(submission.id, e.target.value)}
            style={{ height: 30, fontSize: 12 }}
            aria-label="Assign to team member"
          >
            {ASSIGNEE_OPTIONS.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        {/* Commentary Card */}
        <div
          style={{
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color-split)',
            borderRadius: 10,
            padding: 16,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--ant-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8
            }}
          >
            💬 Feedback Commentary
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {submission.comment || 'No comment provided.'}
          </div>
        </div>

        {/* Attached Screenshot Image */}
        {attachmentUrl && (
          <div
            style={{
              background: 'var(--bg-container)',
              border: '1px solid var(--border-color-split)',
              borderRadius: 10,
              padding: 16,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--ant-success)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10
              }}
            >
              📸 Attached Screenshot
            </div>
            <img
              src={attachmentUrl}
              alt="User screenshot attachment"
              style={{
                width: '100%',
                maxHeight: 340,
                objectFit: 'contain',
                borderRadius: 6,
                border: '1px solid var(--border-color)'
              }}
            />
          </div>
        )}

        {/* Technical Metadata Table */}
        <div
          style={{
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color-split)',
            borderRadius: 10,
            padding: 16,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--ant-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 14
            }}
          >
            🖥️ Technical Metadata & Context
          </div>
          <div className="ant-descriptions">
            <div className="ant-descriptions-item">
              <label>Target Component</label>
              <span>{submission.component || 'Page Body'}</span>
            </div>
            <div className="ant-descriptions-item">
              <label>DOM Selector</label>
              <span style={{ fontFamily: 'monospace', color: 'var(--ant-success)' }}>
                {submission.selector || 'N/A'}
              </span>
            </div>
            <div className="ant-descriptions-item">
              <label>Reporter</label>
              <span>
                {reporter.name} {reporter.email ? `(${reporter.email})` : ''}
              </span>
            </div>
            <div className="ant-descriptions-item">
              <label>Release Tag</label>
              <span style={{ color: 'var(--ant-primary)' }}>
                {metadata.releaseVersion || 'v1.0.0'}
              </span>
            </div>
            <div className="ant-descriptions-item" style={{ gridColumn: 'span 2' }}>
              <label>Page URL</label>
              <span style={{ wordBreak: 'break-all', color: 'var(--ant-primary)' }}>
                {metadata.pageUrl || 'N/A'}
              </span>
            </div>
            <div className="ant-descriptions-item">
              <label>Browser</label>
              <span>{metadata.browser || 'Unknown'}</span>
            </div>
            <div className="ant-descriptions-item">
              <label>OS & Viewport</label>
              <span>
                {metadata.os || 'Unknown'} ({metadata.viewport || 'N/A'})
              </span>
            </div>
            <div className="ant-descriptions-item" style={{ gridColumn: 'span 2' }}>
              <label>Submission Time</label>
              <span>{formatDate(submission.createdAt || metadata.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
