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
      <div className="ant-alert">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
            ⚡ InSight Live Host App Sandbox
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 640 }}>
            Below is an interactive mock application (<strong>Acme Revenue Analytics Hub</strong>). Look at the bottom right corner for the floating <strong>InSight feedback button</strong>, or click any simulation card below to instantly inject live feedback into your Inbox and Kanban board.
          </p>
        </div>
        <div
          style={{
            background: 'var(--bg-spotlight)',
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
          {/* TAB 1: OVERVIEW */}
          {activeHostTab === 'overview' && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24
                }}
              >
                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Monthly Recurring Revenue
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      $184,290.00
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-success)', marginTop: 6, fontWeight: 600 }}>
                      ↑ 14.2% vs last month
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Active Enterprise Teams
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      1,429
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-primary)', marginTop: 6, fontWeight: 600 }}>
                      +84 net new accounts
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Checkout Conversion Rate
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      68.4%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-warning)', marginTop: 6, fontWeight: 600 }}>
                      ⚡ Checkout Modal SLA Ok
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Overview Analytics Section */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 28
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                      📈 Weekly Revenue Velocity & Cohort Performance
                    </h5>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Real-time aggregation from production payment processing engines.
                    </p>
                  </div>
                  <button
                    className="ant-btn ant-btn-primary"
                    style={{ height: 32, fontSize: 12 }}
                    onClick={() =>
                      handleSimulateInstantFeedback(
                        'liked',
                        'The weekly revenue velocity chart has zero lag after our Redis cache upgrade!',
                        'Overview Velocity Chart'
                      )
                    }
                  >
                    👍 Praise This Chart
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', padding: '14px 0', borderTop: '1px solid var(--border-color-split)' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>Q1 ARPU</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginTop: 4 }}>$1,290.00</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>CHURN RATE</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ant-success)', marginTop: 4 }}>0.82%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>EXPANSION MRR</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ant-primary)', marginTop: 4 }}>+$18,400</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>SLA UPTIME</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ant-purple)', marginTop: 4 }}>99.998%</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CONVERSIONS */}
          {activeHostTab === 'conversions' && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24
                }}
              >
                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Checkout Funnel SLA
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      99.98%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-success)', marginTop: 6, fontWeight: 600 }}>
                      ⚡ All Payment Regions Stable
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Cart Abandonment Rate
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      14.2%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-primary)', marginTop: 6, fontWeight: 600 }}>
                      ↓ 2.1% lower drop-off
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Payment Retry Success
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      88.5%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-warning)', marginTop: 6, fontWeight: 600 }}>
                      💳 Stripe & Apple Pay Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Conversions Action Section */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 28
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                      🛒 Enterprise Checkout Funnel Monitoring
                    </h5>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Monitor drop-offs across payment gateways (Stripe, Apple Pay, SEPA Direct Debit).
                    </p>
                  </div>
                  <button
                    className="ant-btn"
                    style={{ height: 32, fontSize: 12, borderColor: 'var(--ant-error)', color: 'var(--ant-error)' }}
                    onClick={() =>
                      handleSimulateInstantFeedback(
                        'bug',
                        'Checkout modal hangs indefinitely when selecting Apple Pay on Safari 17.',
                        'Apple Pay Button'
                      )
                    }
                  >
                    🐛 Simulate Checkout Hang Bug
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 16, padding: '14px 0', borderTop: '1px solid var(--border-color-split)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>• Step 1: Pricing Table (98% Pass)</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>• Step 2: Org Details (92% Pass)</span>
                  <span style={{ fontSize: 12, color: 'var(--ant-error)', fontWeight: 600 }}>• Step 3: Payment Modal (68% Pass)</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: BILLING */}
          {activeHostTab === 'billing' && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24
                }}
              >
                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Open Invoices
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      24 Invoices
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-warning)', marginTop: 6, fontWeight: 600 }}>
                      $42,100.00 Outstanding Due
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Auto-Renewal Rate
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      96.4%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-success)', marginTop: 6, fontWeight: 600 }}>
                      +1.8% vs last quarter
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Billing Sync Status
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      Connected
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-primary)', marginTop: 6, fontWeight: 600 }}>
                      ⚡ QuickBooks / NetSuite Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Billing Action Section */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 28
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                      💳 Invoice Ledger & CSV Data Export
                    </h5>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Export financial transactions or request custom accounting integrations.
                    </p>
                  </div>
                  <button
                    className="ant-btn"
                    style={{ height: 32, fontSize: 12, borderColor: 'var(--ant-warning)', color: 'var(--ant-warning)' }}
                    onClick={() =>
                      handleSimulateInstantFeedback(
                        'feature_request',
                        'Please allow exporting monthly invoices as multi-page PDF packets.',
                        'Invoice Exporter Button'
                      )
                    }
                  >
                    💡 Request PDF Invoice Export
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 24, padding: '14px 0', borderTop: '1px solid var(--border-color-split)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invoice #INV-9021 • Paid • $14,200.00</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invoice #INV-9022 • Paid • $8,900.00</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invoice #INV-9023 • Due • $19,000.00</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: API-LOGS */}
          {activeHostTab === 'api-logs' && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24
                }}
              >
                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      API Throughput
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      1.42M req
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-primary)', marginTop: 6, fontWeight: 600 }}>
                      120 requests / sec average
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      P99 Latency SLA
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      42 ms
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-success)', marginTop: 6, fontWeight: 600 }}>
                      ⚡ 8ms faster than SLA target
                    </div>
                  </div>
                </div>

                <div className="ant-card" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="ant-card-body" style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      5XX Server Error Rate
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      0.01%
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ant-purple)', marginTop: 6, fontWeight: 600 }}>
                      24 isolated timeouts logged
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional API Logs Console Section */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 28
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                      📡 Real-Time Webhook & API Gateway Event Log
                    </h5>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Live streaming HTTP status codes and payload traces from production API nodes.
                    </p>
                  </div>
                  <button
                    className="ant-btn"
                    style={{ height: 32, fontSize: 12, borderColor: 'var(--ant-purple)', color: 'var(--ant-purple)' }}
                    onClick={() =>
                      handleSimulateInstantFeedback(
                        'improvement',
                        'Can we include Request ID headers in the webhook error callback payload?',
                        'API Webhook Console'
                      )
                    }
                  >
                    🛠️ Request RequestID Tracing
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 0', borderTop: '1px solid var(--border-color-split)', fontFamily: 'monospace', fontSize: 12 }}>
                  <div style={{ color: 'var(--ant-success)' }}>[200 OK] POST /v1/checkout/intent — 24ms</div>
                  <div style={{ color: 'var(--ant-success)' }}>[200 OK] GET /v1/analytics/stream — 11ms</div>
                  <div style={{ color: 'var(--ant-warning)' }}>[429 RATE_LIMIT] POST /v1/webhooks/dispatch — 88ms (Retry Queued)</div>
                </div>
              </div>
            </>
          )}
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
                className="ant-sim-card"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'bug',
                    'Checkout confirmation modal hangs for 4 seconds when paying via Apple Pay.',
                    'Checkout Modal Component'
                  )
                }
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ant-error)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🐛</span>
                  <span>Simulate Bug Report</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Target: Checkout Modal Component
                </div>
              </button>

              <button
                className="ant-sim-card"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'feature_request',
                    'Please add CSV data export for monthly invoices in the Billing tab.',
                    'Billing Table Action Bar'
                  )
                }
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ant-warning)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡</span>
                  <span>Simulate Feature Request</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Target: Billing Table Action Bar
                </div>
              </button>

              <button
                className="ant-sim-card"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'improvement',
                    'The date picker contrast in dark mode is slightly low on mobile viewports.',
                    'Date Filter Selector'
                  )
                }
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ant-purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🛠️</span>
                  <span>Simulate Improvement</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Target: Date Filter Selector
                </div>
              </button>

              <button
                className="ant-sim-card"
                onClick={() =>
                  handleSimulateInstantFeedback(
                    'liked',
                    'The new instant KPI sparkline loading speed is super impressive! Excellent work.',
                    'Analytics Dashboard KPI'
                  )
                }
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ant-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>👍</span>
                  <span>Simulate Praise Highlight</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Target: Analytics Dashboard KPI
                </div>
              </button>
            </div>
          </div>
        </div>
    </section>
  );
}
