/**
 * InSight — Sidebar Navigation Component (with Smooth Collapse & Expand Toggle)
 */

import React from 'react';

const MENU_ITEMS = [
  { key: 'inbox', icon: '📥', label: 'Inbox & Backlog' },
  { key: 'kanban', icon: '📊', label: 'Kanban Board' },
  { key: 'projects', icon: '⚙️', label: 'Projects & Embed Code' },
  { key: 'webhooks', icon: '🔗', label: 'Webhooks & Export' },
  { key: 'sandbox', icon: '🧪', label: 'Live Demo Sandbox' }
];

export function Sidebar({ activeTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  return (
    <aside
      className={`ant-sider ${isCollapsed ? 'ant-sider-collapsed' : ''}`}
      style={{
        width: isCollapsed ? 68 : 260,
        transition: 'width 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Top Navigation Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {MENU_ITEMS.map((item) => {
          const isSelected = activeTab === item.key;
          return (
            <div
              key={item.key}
              className={`ant-menu-item ${isSelected ? 'ant-menu-item-selected' : ''}`}
              onClick={() => onSelectTab(item.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectTab(item.key);
                }
              }}
              title={isCollapsed ? item.label : undefined}
              style={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '12px 0' : '11px 16px',
                gap: isCollapsed ? 0 : 12
              }}
            >
              <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Collapse / Expand Toggle Button */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: 12,
          marginTop: 12
        }}
      >
        <button
          className="ant-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle sidebar collapse state"
          style={{
            width: '100%',
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
        >
          <span>{isCollapsed ? '▶' : '◀'}</span>
          {!isCollapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </aside>
  );
}
