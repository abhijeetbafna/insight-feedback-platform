/**
 * InSight — Reusable KPI Stat Card Component (Raised & Glowing when Selected)
 */

import React from 'react';

export function StatCard({ title, value, color, onClick, isSelected }) {
  const accentColor = color || 'var(--ant-primary)';

  return (
    <div
      className="ant-stat-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      title={`Click to filter by ${title}`}
      style={{
        transform: isSelected ? 'translateY(-6px)' : undefined,
        background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-container)',
        boxShadow: isSelected
          ? `0 16px 36px rgba(0, 0, 0, 0.35), 0 0 0 2px ${accentColor}, 0 0 28px ${accentColor}44`
          : undefined,
        borderTop: isSelected ? `4px solid ${accentColor}` : undefined,
        borderColor: isSelected ? accentColor : undefined,
        transition: 'all 240ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div
        className="ant-stat-title"
        style={{
          color: isSelected ? accentColor : 'var(--text-tertiary)',
          fontWeight: isSelected ? 800 : 700
        }}
      >
        {title}
      </div>
      <div className="ant-stat-value" style={{ color: accentColor }}>
        {value}
      </div>
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}`
          }}
        />
      )}
    </div>
  );
}
