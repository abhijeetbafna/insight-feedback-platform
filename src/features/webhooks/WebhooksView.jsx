/**
 * InSight — Webhook Simulator & CSV Data Exporter View Component (Wow-Factor Glassmorphic Revamp)
 */

import React, { useState } from 'react';
import { exportSubmissionsToCSV } from '../../services/exportService.js';

export function WebhooksView({ filteredSubmissions, onShowToast }) {
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXX');
  const [isSimulating, setIsSimulating] = useState(false);
  const [webhookOutput, setWebhookOutput] = useState('Click "Trigger Test Webhook" to simulate outbound notification payload...');

  const handleExportCSV = () => {
    const success = exportSubmissionsToCSV(filteredSubmissions);
    if (success) {
      onShowToast(`Exported ${filteredSubmissions.length} submissions to CSV!`);
    } else {
      onShowToast('No submissions to export based on current filters.', 'error');
    }
  };

  const handleTriggerWebhook = () => {
    setIsSimulating(true);
    setWebhookOutput('Simulating outbound HTTP POST request to webhook endpoint...');

    setTimeout(() => {
      const sampleItem = filteredSubmissions[0] || {
        id: 'SUB-SAMPLE',
        projectKey: 'PRJ-DEMO',
        category: 'bug',
        comment: 'Sample webhook payload generated from InSight platform.',
        status: 'new',
        component: 'Header Navigation',
        metadata: {
          pageUrl: 'https://demo.internal.co',
          reporter: { name: 'DevOps Automated Bot', email: 'bot@company.com' }
        }
      };

      const payload = {
        event: 'insight.feedback_submitted',
        timestamp: new Date().toISOString(),
        target_url: webhookUrl,
        submission: {
          id: sampleItem.id,
          project_key: sampleItem.projectKey,
          category: sampleItem.category,
          status: sampleItem.status,
          component: sampleItem.component,
          comment: sampleItem.comment,
          reporter: sampleItem.metadata?.reporter || { name: 'Anonymous' },
          url: sampleItem.metadata?.pageUrl || 'N/A'
        }
      };

      setWebhookOutput(
        `HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload, null, 2)}`
      );
      setIsSimulating(false);
      onShowToast('⚡ Test webhook simulated successfully!');
    }, 600);
  };

  return (
    <section className="view-section">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Data Export & Webhook Integration
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
          Export dataset reports or test outbound API notifications for Slack, Jira, and enterprise webhooks
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* CSV Exporter Card */}
        <div
          className="ant-card"
          style={{
            borderTop: '3px solid var(--ant-success)',
            background: 'var(--bg-container)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="ant-card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <span className="ant-card-head-title">CSV Dataset Exporter</span>
            </div>
            <span className="ant-tag ant-tag-success">{filteredSubmissions.length} active items</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Download a structured CSV dataset of all active filtered submissions for spreadsheet analysis in Excel, Google Sheets, or enterprise data warehouses.
          </p>
          <button
            className="ant-btn ant-btn-primary"
            onClick={handleExportCSV}
            aria-label="Export Submissions CSV"
            style={{ height: 38, padding: '0 20px', fontSize: 13.5 }}
          >
            ⬇️ Download Submissions CSV
          </button>
        </div>

        {/* Webhook Simulator Card */}
        <div
          className="ant-card"
          style={{
            borderTop: '3px solid var(--ant-primary)',
            background: 'var(--bg-container)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="ant-card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🔗</span>
              <span className="ant-card-head-title">Webhook Payload Simulator</span>
            </div>
            <span className="ant-tag ant-tag-processing">REST API</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            Test outbound JSON payload formatting sent automatically when end-users submit feedback:
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input
              type="text"
              className="ant-input"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              style={{
                flex: 1,
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: 12.5,
                color: 'var(--text-main)'
              }}
              aria-label="Webhook Destination URL"
            />
            <button
              className="ant-btn ant-btn-primary"
              onClick={handleTriggerWebhook}
              disabled={isSimulating}
              style={{ height: 36, padding: '0 16px', fontSize: 13 }}
            >
              {isSimulating ? 'Sending...' : '⚡ Test Webhook'}
            </button>
          </div>

          <div
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color-split)',
              borderRadius: 'var(--radius-sm)',
              padding: 14,
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--ant-cyan)',
              maxHeight: 280,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)'
            }}
          >
            {webhookOutput}
          </div>
        </div>
      </div>
    </section>
  );
}
