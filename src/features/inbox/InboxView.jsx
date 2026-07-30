/**
 * InSight — Inbox & Backlog View Component
 * Fixed KPI Card selection states & immaculate responsive table formatting.
 */

import React from 'react';
import { StatCard } from '../../components/common/StatCard.jsx';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge.jsx';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatters.js';

export function InboxView({
  submissions,
  filteredSubmissions,
  stats,
  releases,
  activeCategoryFilter,
  setActiveCategoryFilter,
  activeStatusFilter,
  setActiveStatusFilter,
  activeReleaseFilter,
  setActiveReleaseFilter,
  searchQuery,
  setSearchQuery,
  onOpenSubmission,
  onResetFilters
}) {
  const hasActiveFilters =
    activeCategoryFilter !== 'ALL' ||
    activeStatusFilter !== 'ALL' ||
    activeReleaseFilter !== 'ALL' ||
    searchQuery.trim() !== '';

  const getAvatarInitials = (name) => {
    if (!name || name === 'Anonymous') return 'AP';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="view-section">
      {/* KPI Metric Cards Grid — Now shows GLOBAL PROJECT STATS and RAISED GLOWING SELECTION */}
      <div className="ant-stats-grid">
        <StatCard
          title="TOTAL SUBMISSIONS"
          value={stats.total}
          color="var(--ant-primary)"
          isSelected={activeCategoryFilter === 'ALL' && activeStatusFilter === 'ALL'}
          onClick={() => {
            if (onResetFilters) {
              onResetFilters();
            } else {
              setActiveCategoryFilter('ALL');
              setActiveStatusFilter('ALL');
            }
          }}
        />
        <StatCard
          title="OPEN BUGS"
          value={stats.bugs}
          color="var(--ant-error)"
          isSelected={activeCategoryFilter === 'bug'}
          onClick={() => {
            setActiveCategoryFilter('bug');
            setActiveStatusFilter('ALL');
          }}
        />
        <StatCard
          title="FEATURE REQUESTS"
          value={stats.requests}
          color="var(--ant-warning)"
          isSelected={activeCategoryFilter === 'feature_request'}
          onClick={() => {
            setActiveCategoryFilter('feature_request');
            setActiveStatusFilter('ALL');
          }}
        />
        <StatCard
          title="PRAISE HIGHLIGHTS"
          value={stats.praise}
          color="var(--ant-success)"
          isSelected={activeCategoryFilter === 'liked'}
          onClick={() => {
            setActiveCategoryFilter('liked');
            setActiveStatusFilter('ALL');
          }}
        />
      </div>

      {/* Toolbar Filters & Active Filter Controls */}
      <div className="ant-toolbar">
        <div className="ant-input-affix-wrapper">
          <span className="ant-input-prefix">🔍</span>
          <input
            type="text"
            className="ant-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback, components, reporters, IDs..."
            aria-label="Search submissions"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer'
              }}
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="ant-select"
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className="ant-select"
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className="ant-select"
            value={activeReleaseFilter}
            onChange={(e) => setActiveReleaseFilter(e.target.value)}
            aria-label="Filter by Release"
          >
            <option value="ALL">All Releases</option>
            {releases.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {hasActiveFilters && onResetFilters && (
            <button
              className="ant-btn ant-btn-danger"
              onClick={onResetFilters}
              style={{ height: 34, fontSize: 12, padding: '0 12px' }}
              title="Reset all search and dropdown filters"
            >
              ✕ Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Data Table — Fixed widths & whiteSpace so columns never clip or wrap awkwardly */}
      <div className="ant-table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="ant-table" style={{ minWidth: 1050, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 130, whiteSpace: 'nowrap' }}>ID</th>
              <th style={{ width: 140, whiteSpace: 'nowrap' }}>Category</th>
              <th style={{ width: 'auto' }}>Feedback & Target Component</th>
              <th style={{ width: 140, whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ width: 190, whiteSpace: 'nowrap' }}>Reporter</th>
              <th style={{ width: 110, whiteSpace: 'nowrap' }}>Release</th>
              <th style={{ width: 150, whiteSpace: 'nowrap' }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: 56,
                    color: 'var(--text-tertiary)'
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 15 }}>
                    No feedback submissions found matching your active filters.
                  </div>
                  {hasActiveFilters && onResetFilters && (
                    <button
                      className="ant-btn ant-btn-primary"
                      onClick={onResetFilters}
                      style={{ marginTop: 14 }}
                    >
                      Reset All Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((item) => {
                const reporterName = item.metadata?.reporter?.name || 'Anonymous';
                const initials = getAvatarInitials(reporterName);
                return (
                  <tr
                    key={item.id}
                    onClick={() => onOpenSubmission(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onOpenSubmission(item.id);
                      }
                    }}
                  >
                    {/* Clean Monospace ID Pill (No floating dot) */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className="ant-tag ant-tag-processing"
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          padding: '4px 10px',
                          fontSize: 12
                        }}
                      >
                        {item.id}
                      </span>
                    </td>

                    {/* Category Tag */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CategoryBadge category={item.category} />
                    </td>

                    {/* Feedback Comment (main text) + Component Sub-tag */}
                    <td style={{ padding: '16px 18px' }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          marginBottom: 6,
                          lineHeight: 1.45,
                          maxWidth: 480
                        }}
                      >
                        {item.comment}
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontSize: 11.5,
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <span>🎯 Target:</span>
                        <strong style={{ color: 'var(--text-main)' }}>
                          {item.component || 'Page Body'}
                        </strong>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Reporter with Avatar Initials */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: 'var(--bg-spotlight)',
                            border: '1px solid var(--border-color-split)',
                            color: 'var(--ant-primary)',
                            fontSize: 11.5,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {initials}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 13 }}>
                          {reporterName}
                        </span>
                      </div>
                    </td>

                    {/* Release Tag */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className="ant-tag"
                        style={{
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-main)',
                          borderColor: 'var(--border-color-split)',
                          fontWeight: 700
                        }}
                      >
                        {item.metadata?.releaseVersion || 'v1.0.0'}
                      </span>
                    </td>

                    {/* Submitted Date (nowrap so it never truncates or cuts off) */}
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(item.createdAt || item.metadata?.timestamp)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
