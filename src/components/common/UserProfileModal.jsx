/**
 * InSight — Enterprise User Profile, Organization, API Keys & Persona Switcher Center
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.jsx';

export function UserProfileModal({
  isOpen,
  initialTab = 'profile',
  onClose,
  onShowToast,
  currentUser,
  onSwitchUser
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Editable Profile State
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@acme.internal');
  const [department, setDepartment] = useState('Product & Engineering');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  // Organization Team State
  const [orgName, setOrgName] = useState('Acme Corporation — Pro Enterprise');
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Chen', email: 'alex.chen@acme.internal', role: 'Workspace Admin', badge: 'ant-tag-processing' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@acme.internal', role: 'Product Manager', badge: 'ant-tag-purple' },
    { id: 3, name: 'David Kim', email: 'd.kim@acme.internal', role: 'Lead Engineer', badge: 'ant-tag-success' },
    { id: 4, name: 'Elena Rostova', email: 'elena.r@acme.internal', role: 'QA Lead', badge: 'ant-tag-warning' }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Product Manager');

  // API Keys State
  const [apiKey, setApiKey] = useState('ins_live_99a8x29b3c4f7e8d00a12b34c56e78f9');
  const [webhookSecret, setWebhookSecret] = useState('whsec_acme_prod_8829104fae1091b2c3');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'profile');
      if (currentUser) {
        setName(currentUser.name);
        setEmail(currentUser.email);
      }
    }
  }, [isOpen, initialTab, currentUser]);

  const handleSaveProfile = () => {
    onShowToast?.(`Profile updated for ${name} (${email})`, 'success');
    if (onSwitchUser) {
      onSwitchUser({
        name,
        email,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase() || 'AC',
        role: 'Workspace Admin'
      });
    }
    onClose();
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      onShowToast?.('Please enter an email address to invite', 'error');
      return;
    }
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      badge: 'ant-tag-processing'
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    onShowToast?.(`Invited ${newMember.email} as ${inviteRole}`, 'success');
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    onShowToast?.('Team member removed from workspace', 'info');
  };

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    onShowToast?.(`Copied ${label} to clipboard!`, 'success');
  };

  const handleRegenerateApiKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey = `ins_live_${randomHex}`;
    setApiKey(newKey);
    onShowToast?.('Regenerated Production API Token!', 'success');
  };

  const personas = [
    {
      name: 'Alex Chen',
      email: 'alex.chen@acme.internal',
      role: 'Workspace Admin',
      initials: 'AC',
      color: 'linear-gradient(135deg, #1677ff, #722ed1)'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@acme.internal',
      role: 'Product Manager',
      initials: 'SJ',
      color: 'linear-gradient(135deg, #10b981, #06b6d4)'
    },
    {
      name: 'David Kim',
      email: 'd.kim@acme.internal',
      role: 'Lead Developer',
      initials: 'DK',
      color: 'linear-gradient(135deg, #f59e0b, #ef4444)'
    }
  ];

  const tabs = [
    { key: 'profile', label: '👤 My Profile & Settings' },
    { key: 'org', label: '🏢 Organization & Team' },
    { key: 'api', label: '🔑 API Tokens & Access Keys' },
    { key: 'auth', label: '🚪 Persona Switcher & Auth' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      title="Acme Enterprise Workspace Center"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="ant-btn" onClick={onClose} style={{ height: 36 }}>
            Close
          </button>
          {activeTab === 'profile' && (
            <button
              className="ant-btn ant-btn-primary"
              onClick={handleSaveProfile}
              style={{ height: 36, padding: '0 20px' }}
            >
              Save Profile Changes
            </button>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', minHeight: 440, gap: 24 }}>
        {/* Left Sidebar Navigation */}
        <div
          style={{
            width: 210,
            borderRight: '1px solid var(--border-color-split)',
            paddingRight: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === t.key ? 'var(--ant-primary-bg)' : 'transparent',
                color: activeTab === t.key ? 'var(--ant-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === t.key ? 700 : 500,
                fontSize: 13,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Content Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* TAB 1: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'var(--bg-elevated)',
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: currentUser?.color || 'linear-gradient(135deg, #1677ff, #722ed1)',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {currentUser?.initials || 'AC'}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {email}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <span className="ant-tag ant-tag-processing" style={{ fontSize: 11 }}>
                      {currentUser?.role || 'Workspace Admin'}
                    </span>
                    <span className="ant-tag ant-tag-purple" style={{ fontSize: 11 }}>
                      Enterprise Tier
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="ant-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', height: 38 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    className="ant-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', height: 38 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Department / Team
                </label>
                <input
                  type="text"
                  className="ant-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', height: 38 }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border-color-split)', paddingTop: 14 }}>
                <h5 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                  Notification Preferences
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                    />
                    <span>Email alerts when critical bug reports are submitted</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={slackAlerts}
                      onChange={(e) => setSlackAlerts(e.target.checked)}
                    />
                    <span>Slack webhook digest notifications for SLA breach warnings</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORGANIZATION & TEAM */}
          {activeTab === 'org' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Workspace / Organization Name
                </label>
                <input
                  type="text"
                  className="ant-input"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  style={{ width: '100%', height: 38 }}
                />
              </div>

              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>
                    Enterprise Seat Licenses
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {teamMembers.length} of 10 seats currently assigned in this workspace
                  </div>
                </div>
                <span className="ant-tag ant-tag-success" style={{ fontWeight: 700 }}>
                  Active Enterprise SLA
                </span>
              </div>

              <div>
                <h5 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                  Active Team Members ({teamMembers.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                  {teamMembers.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color-split)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                          {m.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className={`ant-tag ${m.badge}`} style={{ fontSize: 11 }}>
                          {m.role}
                        </span>
                        {m.id !== 1 && (
                          <button
                            className="ant-btn ant-btn-danger"
                            onClick={() => handleRemoveMember(m.id)}
                            style={{ height: 26, fontSize: 11, padding: '0 8px' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Team Member Form */}
              <form onSubmit={handleInviteMember} style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-color-split)', paddingTop: 14 }}>
                <input
                  type="email"
                  className="ant-input"
                  placeholder="colleague@acme.internal"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{ flex: 1, height: 36 }}
                />
                <select
                  className="ant-input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{ width: 150, height: 36 }}
                >
                  <option value="Product Manager">PM</option>
                  <option value="Lead Engineer">Engineer</option>
                  <option value="QA Lead">QA Specialist</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button type="submit" className="ant-btn ant-btn-primary" style={{ height: 36, fontSize: 12 }}>
                  + Invite Member
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: API TOKENS & ACCESS KEYS */}
          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Production REST API Token
                  </label>
                  <button
                    className="ant-btn"
                    onClick={() => handleCopy(apiKey, 'API Token')}
                    style={{ height: 26, fontSize: 11 }}
                  >
                    📋 Copy Token
                  </button>
                </div>
                <div className="ant-code-box" style={{ fontSize: 13, userSelect: 'all' }}>
                  {apiKey}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Webhook Signing Secret Key
                  </label>
                  <button
                    className="ant-btn"
                    onClick={() => handleCopy(webhookSecret, 'Webhook Secret')}
                    style={{ height: 26, fontSize: 11 }}
                  >
                    📋 Copy Secret
                  </button>
                </div>
                <div className="ant-code-box" style={{ fontSize: 13, userSelect: 'all' }}>
                  {webhookSecret}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>
                    Rotate Production Tokens
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Revokes old API tokens immediately across all embedded widgets.
                  </div>
                </div>
                <button
                  className="ant-btn ant-btn-danger"
                  onClick={handleRegenerateApiKey}
                  style={{ height: 32, fontSize: 12 }}
                >
                  🔄 Regenerate API Keys
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PERSONA SWITCHER & AUTH */}
          {activeTab === 'auth' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                  🎭 Switch Active User Persona
                </h5>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 14 }}>
                  Click any persona below to simulate switching user roles in the workspace:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {personas.map((p) => {
                    const isCurrent = currentUser?.name === p.name;
                    return (
                      <div
                        key={p.name}
                        onClick={() => {
                          if (onSwitchUser) {
                            onSwitchUser(p);
                            onShowToast?.(`Switched active user to ${p.name} (${p.role})`, 'success');
                            onClose();
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: isCurrent ? 'var(--ant-primary-bg)' : 'var(--bg-elevated)',
                          border: isCurrent ? '1.5px solid var(--ant-primary)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: p.color,
                              color: '#fff',
                              fontSize: 14,
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {p.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              {p.email} • {p.role}
                            </div>
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="ant-tag ant-tag-processing" style={{ fontWeight: 700 }}>
                            Active Persona
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--ant-primary)', fontWeight: 600 }}>
                            Switch →
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color-split)', paddingTop: 14 }}>
                <button
                  className="ant-btn ant-btn-danger"
                  onClick={() => {
                    onShowToast?.('Signed out of session. (In production, redirects to SSO Auth0 / WorkOS)', 'warning');
                    onClose();
                  }}
                  style={{ width: '100%', height: 38, fontSize: 13, fontWeight: 700 }}
                >
                  🚪 Sign Out of Enterprise Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
