/**
 * InSight — Main React Application Controller
 * Follows clean architecture, SOLID principles, and Ant Design 5.0 styling.
 */

import React, { useState, useCallback } from 'react';
import './styles/design-tokens.css';

import { useTheme } from './hooks/useTheme.js';
import { useProjects } from './hooks/useProjects.js';
import { useSubmissions } from './hooks/useSubmissions.js';

import { Header } from './components/common/Header.jsx';
import { Sidebar } from './components/common/Sidebar.jsx';
import { Drawer } from './components/common/Drawer.jsx';
import { Toast } from './components/common/Toast.jsx';
import { Modal } from './components/common/Modal.jsx';

import { InboxView } from './features/inbox/InboxView.jsx';
import { KanbanView } from './features/kanban/KanbanView.jsx';
import { ProjectsView } from './features/projects/ProjectsView.jsx';
import { WebhooksView } from './features/webhooks/WebhooksView.jsx';
import { SandboxView } from './features/sandbox/SandboxView.jsx';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { projects, selectedProjectKey, setSelectedProjectKey, addProject, generateEmbedSnippet } =
    useProjects();

  const {
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
    activeSubmission,
    setActiveSubmissionId,
    updateSubmissionStatus,
    updateSubmissionAssignee,
    deleteSubmission
  } = useSubmissions();

  const [activeTab, setActiveTab] = useState('inbox');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const handleResetFilters = () => {
    setSelectedProjectKey('ALL');
    setActiveCategoryFilter('ALL');
    setActiveStatusFilter('ALL');
    setActiveReleaseFilter('ALL');
    setSearchQuery('');
    showToast('Filters reset to show all items');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navigation */}
      <Header
        projects={projects}
        selectedProjectKey={selectedProjectKey}
        onSelectProject={setSelectedProjectKey}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Layout Area */}
      <div className="ant-layout">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="ant-content">
          {activeTab === 'inbox' && (
            <InboxView
              submissions={submissions}
              filteredSubmissions={filteredSubmissions}
              stats={stats}
              releases={releases}
              activeCategoryFilter={activeCategoryFilter}
              setActiveCategoryFilter={setActiveCategoryFilter}
              activeStatusFilter={activeStatusFilter}
              setActiveStatusFilter={setActiveStatusFilter}
              activeReleaseFilter={activeReleaseFilter}
              setActiveReleaseFilter={setActiveReleaseFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenSubmission={setActiveSubmissionId}
              onResetFilters={handleResetFilters}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanView
              filteredSubmissions={filteredSubmissions}
              onOpenSubmission={setActiveSubmissionId}
              onStatusChange={updateSubmissionStatus}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onAddProject={addProject}
              generateEmbedSnippet={generateEmbedSnippet}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'webhooks' && (
            <WebhooksView
              filteredSubmissions={filteredSubmissions}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'sandbox' && (
            <SandboxView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Slide-over Submission Details Drawer */}
      <Drawer
        isOpen={Boolean(activeSubmission)}
        submission={activeSubmission}
        onClose={() => setActiveSubmissionId(null)}
        onStatusChange={updateSubmissionStatus}
        onAssigneeChange={updateSubmissionAssignee}
        onDelete={(id) => {
          deleteSubmission(id);
          showToast(`Submission ${id} deleted.`);
        }}
      />

      {/* User Profile & Workspace Settings Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        title="Workspace Admin Account & Profile Settings"
        onClose={() => setIsProfileModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              className="ant-btn ant-btn-primary"
              onClick={() => {
                setIsProfileModalOpen(false);
                showToast('User profile settings saved successfully!');
              }}
            >
              Done & Close
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'var(--bg-elevated)',
              padding: 16,
              borderRadius: 10,
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                color: '#fff',
                fontSize: 20,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              AC
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>
                Alex Chen
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                alex.chen@acme.internal
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                <span className="ant-tag ant-tag-processing" style={{ fontSize: 11 }}>
                  Workspace Lead
                </span>
                <span className="ant-tag ant-tag-purple" style={{ fontSize: 11 }}>
                  Enterprise Plan
                </span>
              </div>
            </div>
          </div>

          <div className="ant-descriptions">
            <div className="ant-descriptions-item">
              <label>Organization Name</label>
              <span style={{ fontWeight: 600 }}>Acme Enterprise Cloud</span>
            </div>
            <div className="ant-descriptions-item">
              <label>Role / Permissions</label>
              <span>Owner & Administrator</span>
            </div>
            <div className="ant-descriptions-item">
              <label>SSO / Auth Method</label>
              <span>Okta SAML 2.0 / Google Workspace</span>
            </div>
            <div className="ant-descriptions-item">
              <label>Active Seats Used</label>
              <span>4 / 10 Licensed Seats</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 8,
              padding: 14,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            💡 <strong>Production Deployment Note:</strong> In standalone demo mode, profile details and submissions are stored locally in your browser so you can test without external dependencies. When deploying to production, this modal integrates directly with your authentication provider (e.g. Supabase Auth, Auth0, or WorkOS SSO).
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
