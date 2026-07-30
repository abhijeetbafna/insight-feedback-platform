/**
 * InSight — Live Interactive Sandbox & Embedded Widget Demonstration
 * Revamped with Wow-Factor Host App Aesthetic & Clean DOM Teardown on unmount.
 */

import React, { useEffect, useState } from 'react';
import { storageService } from '../../services/storageService.js';
import { CATEGORY_OPTIONS } from '../../utils/constants.js';

export function SandboxView({ onShowToast }) {
  const [submissionsCount, setSubmissionsCount] = useState(() => {
    return storageService.getSubmissions().length;
  });

  const [activeHostTab, setActiveHostTab] = useState('overview');

  // Load Widget Script & Clean Up DOM when navigating away from Sandbox
  useEffect(() => {
    let script = document.getElementById('insight-widget-script');
    if (!script) {
      script = document.createElement('script');
      script.id = 'insight-widget-script';
      script.src = '/insight-widget.js';
      script.setAttribute('data-project-key', 'PRJ-ANALYTICS');
      script.setAttribute('data-release-version', 'v2.4.1-beta');
      script.setAttribute('data-color', '#38bdf8');
      script.setAttribute('data-position', 'bottom-right');
      document.body.appendChild(script);
    }

    const unsubscribe = storageService.subscribe((list) => {
      setSubmissionsCount(list.length);
    });

    return () => {
      unsubscribe();
      // Clean up standalone widget DOM elements so they don't pollute Admin tabs
      const scriptElem = document.getElementById('insight-widget-script');
      if (scriptElem) scriptElem.remove();

      const btnElem = document.getElementById('insight-widget-btn');
      if (btnElem) btnElem.remove();

      const modalElem = document.getElementById('insight-widget-modal');
      if (modalElem) modalElem.remove();

      const annoElem = document.getElementById('insight-anno-overlay');
      if (annoElem) annoElem.remove();

      const toastElem = document.getElementById('insight-widget-toast');
      if (toastElem) toastElem.remove();

      window.__InSightWidgetInitialized = false;
    };
  }, []);

  const handleSimulateInstantFeedback = (category, comment, component) => {
    const list = storageService.getSubmissions();
    const newId = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newItem = {
      id: newId,
      projectKey: 'PRJ-ANALYTICS',
      category: category,
      comment: comment,
      status: 'new',
      component: component,
      selector: `#${component.toLowerCase().replace(/\s+/g, '-')}`,
      metadata: {
        pageUrl: window.location.href,
        path: '/sandbox',
        browser: 'Chrome 122.0 (Simulated)',
        os: 'macOS Sonoma (Simulated)',
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        reporter: {
          name: 'Alex Chen (Product Manager)',
          email: 'alex.chen@acme.internal'
        },
        releaseVersion: 'v2.4.1-beta',
        timestamp: new Date().toISOString()
      },
      attachment: null,
      createdAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      tags: [category, 'SandboxDemo']
    };

    const nextList = [newItem, ...list];
    storageService.saveSubmissions(nextList);
    onShowToast(`Simulated submission ${newId} published across tabs!`);
  };

  return (
    <section className="view-section">
      {/* Top Description Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(192, 132, 252, 0.12))',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
            ⚡ InSight Live Host App Sandbox
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 640 }}>
            Below is an interactive mock application (<strong>Acme Revenue Analytics Hub</strong>). Look at the bottom right corner for the floating <strong>InSight feedback button</strong>, or click any simulation card below to instantly inject live feedback into your Inbox and Kanban board.
          </p>
        </div>
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)' }}>
            LOCAL SUBMISSIONS STORE:
          </span>
          <span
            className="ant-tag ant-tag-processing"
            style={{ fontSize: 14, fontWeight: 800, padding: '4px 14px' }}
          >
            {submissionsCount} Items
          </span>
        </div>
      </div>

      {/* Simulated Host Web Application — Acme Revenue Hub */}
      <div
        style={{
          background: 'var(--bg-container)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Host App Navigation */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-color)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>
                Acme Revenue Analytics Hub
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Host App Environment • Production v2.4.1-beta
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['overview', 'conversions', 'billing', 'api-logs'].map((tab) => (
              <button
                key={tab}
                className="ant-btn"
                onClick={() => setActiveHostTab(tab)}
                style={{
                  height: 32,
                  fontSize: 12,
                  textTransform: 'capitalize',
                  background: activeHostTab === tab ? 'var(--ant-primary-bg)' : 'transparent',
                  color: activeHostTab === tab ? 'var(--ant-primary)' : 'var(--text-secondary)',
                  borderColor: activeHostTab === tab ? 'var(--ant-primary)' : 'transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Host App Main Viewport */}
        <div style={{ padding: 28 }}>
          {/* Revenue KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 28
            }}
          >
            <div
              className="ant-card"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Monthly Recurring Revenue
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
                $184,290.00
              </div>
              <div style={{ fontSize: 12, color: 'var(--ant-success)', marginTop: 4, fontWeight: 600 }}>
                ↑ 14.2% vs last month
              </div>
            </div>

            <div
              className="ant-card"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Enterprise Teams
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
                1,429
              </div>
              <div style={{ fontSize: 12, color: 'var(--ant-primary)', marginTop: 4, fontWeight: 600 }}>
                +84 net new accounts
              </div>
            </div>

            <div
              className="ant-card"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Checkout Conversion Rate
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
                68.4%
              </div>
              <div style={{ fontSize: 12, color: 'var(--ant-warning)', marginTop: 4, fontWeight: 600 }}>
                ⚡ Checkout Modal SLA Ok
              </div>
            </div>
          </div>

          {/* Interactive Simulation Panel */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color-split)',
              borderRadius: 'var(--radius-md)',
              padding: 22
            }}
          >
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
              🧪 Instant Feedback Injection Simulator
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>
              Click any button below to simulate an end-user clicking the floating InSight widget on this page and reporting an issue:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 12
              }}
            >
              <button
                className="ant-btn"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'bug',
                    'Checkout confirmation modal hangs for 4 seconds when paying via Apple Pay.',
                    'Checkout Modal Component'
                  )
                }
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  background: 'var(--bg-main)',
                  border: '1px solid rgba(248, 113, 113, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ant-error)' }}>
                    🐛 Simulate Bug Report
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Target: Checkout Modal Component
                  </div>
                </div>
              </button>

              <button
                className="ant-btn"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'feature_request',
                    'Please add CSV data export for monthly invoices in the Billing tab.',
                    'Billing Table Action Bar'
                  )
                }
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  background: 'var(--bg-main)',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ant-warning)' }}>
                    💡 Simulate Feature Request
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Target: Billing Table Action Bar
                  </div>
                </div>
              </button>

              <button
                className="ant-btn"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'improvement',
                    'The date picker contrast in dark mode is slightly low on mobile viewports.',
                    'Date Filter Selector'
                  )
                }
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  background: 'var(--bg-main)',
                  border: '1px solid rgba(192, 132, 252, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ant-purple)' }}>
                    🛠️ Simulate Improvement
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Target: Date Filter Selector
                  </div>
                </div>
              </button>

              <button
                className="ant-btn"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'liked',
                    'The new instant KPI sparkline loading speed is super impressive! Excellent work.',
                    'Analytics Dashboard KPI'
                  )
                }
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  background: 'var(--bg-main)',
                  border: '1px solid rgba(74, 222, 128, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ant-success)' }}>
                    👍 Simulate Praise Highlight
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Target: Analytics Dashboard KPI
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
