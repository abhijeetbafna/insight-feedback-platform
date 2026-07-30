/**
 * InSight — Accessible Category and Status Badges
 */

import React from 'react';
import { getCategoryBadgeProps, getStatusBadgeProps } from '../../utils/formatters.js';

export function CategoryBadge({ category }) {
  const { label, variant } = getCategoryBadgeProps(category);
  return <span className={`ant-tag ant-tag-${variant}`}>{label}</span>;
}

export function StatusBadge({ status }) {
  const { label, variant } = getStatusBadgeProps(status);
  return <span className={`ant-tag ant-tag-${variant}`}>{label}</span>;
}
