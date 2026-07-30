/**
 * InSight — Header Component (Enterprise SaaS Edition with User Profile Menu)
 */

import React, { useState } from 'react';

export function Header({
  projects,
  selectedProjectKey,
  onSelectProject,
  isDark,
  onToggleTheme,
  onOpenProfile,
  onShowToast
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className="ant-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        position: 'relative',
        zIndex: 100
      }}
    >
      {/* Brand & Product Identity (Cleaned up — No "Ant Design System" tag) */}
      <a
        href="#"
        className="ant-brand"
        onClick={(e) => e.preventDefault()}
        style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
      >
        <div
          className="ant-brand-logo"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--ant-primary), var(--ant-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
          }}
        >
          👁️
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="ant-brand-title"
            style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}
          >
            InSight
          </span>
          <span
            className="ant-tag ant-tag-purple"
            style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', letterSpacing: '0.04em' }}
          >
            ENTERPRISE
          </span>
        </div>
      </a>

      {/* Right Toolbar: Project Selector, Theme Toggle, and User Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <select
          className="ant-select"
          value={selectedProjectKey}
          onChange={(e) => onSelectProject(e.target.value)}
          aria-label="Filter by Project"
          style={{ height: 36, fontWeight: 600 }}
        >
          <option value="ALL">🌐 All Workspace Projects ({projects.length})</option>
          {projects.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name} ({p.key})
            </option>
          ))}
        </select>

        <button
          className="ant-btn"
          onClick={onToggleTheme}
          title="Toggle Light / Dark Theme"
          aria-label="Toggle Light / Dark Theme"
          style={{ height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>{isDark ? '☀️ Light' : '🌙 Dark'}</span>
        </button>

        {/* User Account Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: showUserMenu ? 'var(--bg-elevated)' : 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px 4px 6px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title="User Account & Organization Profile"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)'
              }}
            >
              AC
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Alex Chen</span>
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>▼</span>
          </button>

          {/* Profile Dropdown Card */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 260,
                background: 'var(--bg-container)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: 12,
                zIndex: 1000
              }}
            >
              <div
                style={{
                  padding: '8px 10px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: 8
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>Alex Chen</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>alex.chen@acme.internal</div>
                <div style={{ marginTop: 6 }}>
                  <span
                    className="ant-tag ant-tag-processing"
                    style={{ fontSize: 10, padding: '1px 6px' }}
                  >
                    Workspace Admin
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenProfile?.();
                  }}
                  className="ant-btn"
                  style={{
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: 'transparent',
                    height: 34,
                    fontSize: 13,
                    padding: '0 10px'
                  }}
                >
                  👤 My Profile & Account Settings
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onShowToast?.('🏢 Acme Corporation • Pro Enterprise Workspace Tier (10 Seats)', 'info');
                  }}
                  className="ant-btn"
                  style={{
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: 'transparent',
                    height: 34,
                    fontSize: 13,
                    padding: '0 10px'
                  }}
                >
                  🏢 Organization & Workspace
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onShowToast?.('🔑 Production API Token: ins_live_99a8x29b3c4d...', 'info');
                  }}
                  className="ant-btn"
                  style={{
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: 'transparent',
                    height: 34,
                    fontSize: 13,
                    padding: '0 10px'
                  }}
                >
                  🔑 API Tokens & Access Keys
                </button>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onShowToast?.('🔒 Signed out simulation. In production, this redirects to SSO / Auth0 login.', 'warning');
                  }}
                  className="ant-btn ant-btn-danger"
                  style={{
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: 'transparent',
                    height: 34,
                    fontSize: 13,
                    padding: '0 10px'
                  }}
                >
                  🚪 Sign Out / Switch User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
