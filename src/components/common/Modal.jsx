/**
 * InSight — Accessible Fixed-Overlay Modal Dialog Component
 * Ensures dialogs float centered above the application with a backdrop blur mask.
 */

import React, { useEffect } from 'react';

export function Modal({ isOpen, title, onClose, children, footer }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ant-modal-mask ant-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        className="ant-modal ant-modal-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          background: 'var(--bg-container)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          zIndex: 10000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          className="ant-modal-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--text-main)',
            background: 'var(--bg-elevated)',
            flexShrink: 0
          }}
        >
          <div className="ant-modal-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
            {title}
          </div>
          <button
            className="ant-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32,
              height: 32,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              fontSize: 16,
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="ant-modal-body"
          style={{
            padding: 24,
            overflowY: 'auto',
            flex: 1,
            color: 'var(--text-main)'
          }}
        >
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div
            className="ant-modal-footer"
            style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              flexShrink: 0
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
