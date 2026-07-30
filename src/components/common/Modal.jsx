/**
 * InSight — Accessible Modal Dialog Component
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
      className="ant-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="ant-modal-wrapper">
        <div className="ant-modal-header">
          <div className="ant-modal-title">{title}</div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="ant-modal-body">{children}</div>
        {footer && <div className="ant-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
