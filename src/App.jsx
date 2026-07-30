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
import { UserProfileModal } from './components/common/UserProfileModal.jsx';

import { InboxView } from './features/inbox/InboxView.jsx';
import { KanbanView } from './features/kanban/KanbanView.jsx';
import { ProjectsView } from './features/projects/ProjectsView.jsx';
import { WebhooksView } from './features/webhooks/WebhooksView.jsx';
import { SandboxView } from './features/sandbox/SandboxView.jsx';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { projects, addProject, generateEmbedSnippet } = useProjects();

  const {
    submissions,
    filteredSubmissions,
    stats,
    releases,
    selectedProjectKey,
    setSelectedProjectKey,
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
  const [profileModalTab, setProfileModalTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('insight_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
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
        onOpenProfile={(tab = 'profile') => {
          setProfileModalTab(tab);
          setIsProfileModalOpen(true);
        }}
        onShowToast={showToast}
        currentUser={currentUser}
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

      {/* User Profile, Organization, API Keys & Persona Switcher Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        initialTab={profileModalTab}
        onClose={() => setIsProfileModalOpen(false)}
        onShowToast={showToast}
        currentUser={currentUser}
        onSwitchUser={(u) => {
          setCurrentUser(u);
          try {
            localStorage.setItem('insight_current_user', JSON.stringify(u));
          } catch {}
        }}
      />

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
