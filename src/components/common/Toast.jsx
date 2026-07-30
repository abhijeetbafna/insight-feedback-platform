/**
 * InSight — Toast Notification Component
 */

import React from 'react';

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="ant-toast-container">
      <div
        className="ant-toast"
        style={{
          borderLeft: `4px solid ${type === 'error' ? 'var(--ant-error)' : 'var(--ant-success)'}`
        }}
      >
        <span>{type === 'error' ? '⚠️' : '✅'}</span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              fontSize: 14
            }}
            aria-label="Close toast"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
