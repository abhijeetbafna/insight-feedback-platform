/**
 * InSight — Projects & Embed Snippet Manager View Component (Wow-Factor Glassmorphic Revamp)
 */

import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal.jsx';

export function ProjectsView({
  projects,
  onAddProject,
  generateEmbedSnippet,
  onShowToast
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnippetKey, setSelectedSnippetKey] = useState(projects[0]?.key || 'PRJ-ANALYTICS');

  // Form State
  const [keyInput, setKeyInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [releaseInput, setReleaseInput] = useState('v1.0.0');
  const [colorInput, setColorInput] = useState('#38bdf8');
  const [positionInput, setPositionInput] = useState('bottom-right');
  const [formError, setFormError] = useState('');

  const handleCreateProject = (e) => {
    e?.preventDefault();
    setFormError('');

    const res = onAddProject({
      key: keyInput,
      name: nameInput,
      releaseVersion: releaseInput,
      color: colorInput,
      position: positionInput
    });

    if (!res.success) {
      setFormError(res.error);
      return;
    }

    onShowToast(`Project "${nameInput}" (${keyInput}) created successfully!`);
    setIsModalOpen(false);
    setKeyInput('');
    setNameInput('');
    setReleaseInput('v1.0.0');
    setColorInput('#38bdf8');
    setPositionInput('bottom-right');
    setSelectedSnippetKey(res.project.key);
  };

  const handleCopySnippet = () => {
    const snippetText = generateEmbedSnippet(selectedSnippetKey);
    navigator.clipboard.writeText(snippetText).then(
      () => {
        onShowToast('📋 Script embed tag copied to clipboard!');
      },
      (err) => {
        onShowToast('Failed to copy to clipboard', 'error');
      }
    );
  };

  const snippetCode = generateEmbedSnippet(selectedSnippetKey);

  return (
    <section className="view-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Product Projects & Embed Configs
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Manage product environments and generate single-line widget embed tags
          </p>
        </div>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          style={{ height: 38, padding: '0 20px', fontSize: 14 }}
        >
          + New Project
        </button>
      </div>

      {/* Projects List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {projects.map((proj) => (
          <div
            key={proj.key}
            className="ant-card"
          >
            <div className="ant-card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: proj.color,
                    boxShadow: `0 0 10px ${proj.color}`
                  }}
                />
                <span className="ant-card-head-title">{proj.name}</span>
              </div>
              <span className="ant-tag ant-tag-processing" style={{ fontWeight: 800 }}>
                {proj.key}
              </span>
            </div>
            <div className="ant-descriptions">
              <div className="ant-descriptions-item">
                <label>Release Tag</label>
                <span style={{ color: 'var(--ant-primary)', fontWeight: 700 }}>{proj.releaseVersion}</span>
              </div>
              <div className="ant-descriptions-item">
                <label>Widget Accent</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: proj.color,
                      border: '1px solid var(--border-color-split)',
                      boxShadow: `0 0 8px ${proj.color}`
                    }}
                  />
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{proj.color}</span>
                </div>
              </div>
              <div className="ant-descriptions-item" style={{ gridColumn: 'span 2' }}>
                <label>Widget Screen Anchor</label>
                <span>{proj.position === 'bottom-left' ? 'Bottom Left Screen Corner' : 'Bottom Right Screen Corner'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embed Snippet Generator Card */}
      <div
        className="ant-card"
        style={{ marginTop: 28 }}
      >
        <div className="ant-card-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <span className="ant-card-head-title">Single-Line HTML Embed Snippet Generator</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>Target Project:</span>
            <select
              className="ant-select"
              style={{ height: 34, minWidth: 200 }}
              value={selectedSnippetKey}
              onChange={(e) => setSelectedSnippetKey(e.target.value)}
              aria-label="Select Target Project for Snippet"
            >
              {projects.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ant-card-body">
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Add this script tag inside the <code>&lt;body&gt;</code> of any internal web application to instantly activate the embeddable feedback and bug widget:
          </p>

          <div className="ant-code-box">
            {snippetCode}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="ant-btn ant-btn-primary"
              onClick={handleCopySnippet}
              style={{ height: 38, padding: '0 24px', fontSize: 13.5 }}
            >
              📋 Copy Script Tag to Clipboard
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Create Project */}
      <Modal
        isOpen={isModalOpen}
        title="Create New Project"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="ant-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="project-form"
              className="ant-btn ant-btn-primary"
            >
              Save Project
            </button>
          </>
        }
      >
        <form id="project-form" onSubmit={handleCreateProject}>
          {formError && (
            <div
              style={{
                background: 'var(--ant-error-bg)',
                border: '1px solid var(--ant-error)',
                color: 'var(--ant-error)',
                padding: 10,
                borderRadius: 6,
                fontSize: 13,
                marginBottom: 16
              }}
            >
              {formError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="proj-key">Project Key (Prefix ID, e.g. PRJ-ACME)</label>
              <input
                id="proj-key"
                type="text"
                required
                placeholder="PRJ-..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj-name">Project Display Name</label>
              <input
                id="proj-name"
                type="text"
                required
                placeholder="e.g. Acme Enterprise Cloud"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj-rel">Initial Release Tag</label>
              <input
                id="proj-rel"
                type="text"
                required
                placeholder="e.g. v1.0.0-beta"
                value={releaseInput}
                onChange={(e) => setReleaseInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj-col">Widget Primary Accent Color</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  id="proj-col"
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  style={{ width: 44, height: 38, padding: 2, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="proj-pos">Widget Screen Anchor Position</label>
              <select
                id="proj-pos"
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
              >
                <option value="bottom-right">Bottom Right Screen Corner</option>
                <option value="bottom-left">Bottom Left Screen Corner</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </section>
  );
}
