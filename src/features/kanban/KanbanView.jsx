/**
 * InSight — Kanban Workflow View Component (Wow-Factor Glassmorphic Revamp)
 */

import React from 'react';
import { CategoryBadge } from '../../components/common/Badge.jsx';
import { STATUS_OPTIONS } from '../../utils/constants.js';

const COLUMNS = [
  { key: 'new', label: 'New', color: 'var(--ant-primary)', bg: 'var(--ant-primary-bg)' },
  { key: 'in_review', label: 'In Review', color: 'var(--ant-warning)', bg: 'var(--ant-warning-bg)' },
  { key: 'planned', label: 'Planned', color: 'var(--ant-purple)', bg: 'var(--ant-purple-bg)' },
  { key: 'in_progress', label: 'In Progress', color: 'var(--ant-cyan)', bg: 'var(--ant-cyan-bg)' },
  { key: 'resolved', label: 'Resolved', color: 'var(--ant-success)', bg: 'var(--ant-success-bg)' }
];

export function KanbanView({
  filteredSubmissions,
  onOpenSubmission,
  onStatusChange
}) {
  const getAvatarInitials = (name) => {
    if (!name || name === 'Anonymous') return 'AP';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="view-section">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Feedback Kanban Workflow
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Drag-and-drop workflow status progression across releases
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
            Total Items: <strong style={{ color: 'var(--ant-primary)' }}>{filteredSubmissions.length}</strong>
          </span>
        </div>
      </div>

      <div className="ant-kanban-grid">
        {COLUMNS.map((col) => {
          const colItems = filteredSubmissions.filter((s) => s.status === col.key);
          return (
            <div key={col.key} className="ant-kanban-col">
              {/* Column Header */}
              <div
                className="ant-kanban-header"
                style={{
                  borderTop: `3px solid ${col.color}`,
                  background: 'var(--bg-elevated)',
                  borderTopLeftRadius: 'var(--radius-lg)',
                  borderTopRightRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: col.color,
                      boxShadow: `0 0 10px ${col.color}`
                    }}
                  />
                  <span className="ant-kanban-title" style={{ color: 'var(--text-main)' }}>
                    {col.label}
                  </span>
                </div>
                <span
                  className="ant-tag"
                  style={{
                    background: col.bg,
                    color: col.color,
                    border: '1px solid transparent',
                    fontWeight: 700
                  }}
                >
                  {colItems.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="kanban-cards-container">
                {colItems.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 32,
                      fontSize: 13,
                      color: 'var(--text-tertiary)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 10,
                      border: '1px dashed var(--border-color)'
                    }}
                  >
                    No feedback items
                  </div>
                ) : (
                  colItems.map((item) => {
                    const reporterName = item.metadata?.reporter?.name || 'Anonymous';
                    const initials = getAvatarInitials(reporterName);
                    return (
                      <div
                        key={item.id}
                        className="ant-kanban-card"
                        onClick={() => onOpenSubmission(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onOpenSubmission(item.id);
                          }
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: 'var(--ant-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            {item.id}
                          </span>
                          <CategoryBadge category={item.category} />
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: 6,
                            lineHeight: 1.3
                          }}
                        >
                          {item.component || 'Page Body'}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            marginBottom: 14,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.comment}
                        </div>

                        {/* Card Footer */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: 10,
                            fontSize: 12
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: 'var(--bg-spotlight)',
                                border: '1px solid var(--border-color-split)',
                                color: 'var(--ant-primary)',
                                fontSize: 10,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {initials}
                            </div>
                            <span
                              style={{
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                                maxWidth: 100,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {reporterName}
                            </span>
                          </div>

                          <span
                            className="ant-tag"
                            style={{
                              background: 'var(--bg-main)',
                              color: 'var(--text-tertiary)',
                              borderColor: 'var(--border-color)',
                              fontSize: 10.5,
                              padding: '2px 8px'
                            }}
                          >
                            {item.metadata?.releaseVersion || 'v1.0.0'}
                          </span>
                        </div>

                        {/* Status Switcher (Dropdown stopPropagation) */}
                        <div
                          style={{
                            marginTop: 10,
                            display: 'flex',
                            justifyContent: 'flex-end'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            className="ant-select"
                            value={item.status || 'new'}
                            onChange={(e) => {
                              onStatusChange(item.id, e.target.value);
                            }}
                            style={{
                              height: 26,
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 4
                            }}
                            aria-label="Change item status"
                          >
                            {STATUS_OPTIONS.filter((o) => o.value !== 'ALL').map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
