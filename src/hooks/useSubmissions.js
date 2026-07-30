/**
 * InSight — Custom Hook for Real-Time Feedback Submissions State
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { storageService } from '../services/storageService.js';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState(() => storageService.getSubmissions());
  const [selectedProjectKey, setSelectedProjectKey] = useState('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
  const [activeReleaseFilter, setActiveReleaseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe((updatedList) => {
      setSubmissions([...updatedList]);
    });
    return () => unsubscribe();
  }, []);

  const updateSubmissionStatus = useCallback((id, newStatus) => {
    setSubmissions((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      });
      storageService.saveSubmissions(next);
      return next;
    });
  }, []);

  const updateSubmissionAssignee = useCallback((id, newAssignee) => {
    setSubmissions((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          return { ...item, assignedTo: newAssignee };
        }
        return item;
      });
      storageService.saveSubmissions(next);
      return next;
    });
  }, []);

  const deleteSubmission = useCallback((id) => {
    setSubmissions((prev) => {
      const next = prev.filter((item) => item.id !== id);
      storageService.saveSubmissions(next);
      return next;
    });
    if (activeSubmissionId === id) {
      setActiveSubmissionId(null);
    }
  }, [activeSubmissionId]);

  const releases = useMemo(() => {
    const set = new Set(
      submissions.map((s) => s.metadata?.releaseVersion || '').filter(Boolean)
    );
    return Array.from(set);
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (selectedProjectKey !== 'ALL' && s.projectKey !== selectedProjectKey) return false;
      if (activeCategoryFilter !== 'ALL' && s.category !== activeCategoryFilter) return false;
      if (activeStatusFilter !== 'ALL' && s.status !== activeStatusFilter) return false;
      if (activeReleaseFilter !== 'ALL' && s.metadata?.releaseVersion !== activeReleaseFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          (s.comment || '').toLowerCase().includes(q) ||
          (s.component || '').toLowerCase().includes(q) ||
          (s.metadata?.reporter?.name || '').toLowerCase().includes(q) ||
          (s.id || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    submissions,
    selectedProjectKey,
    activeCategoryFilter,
    activeStatusFilter,
    activeReleaseFilter,
    searchQuery
  ]);

  const projectSubmissions = useMemo(() => {
    if (selectedProjectKey === 'ALL') return submissions;
    return submissions.filter((s) => s.projectKey === selectedProjectKey);
  }, [submissions, selectedProjectKey]);

  const stats = useMemo(() => {
    return {
      total: projectSubmissions.length,
      bugs: projectSubmissions.filter((s) => s.category === 'bug').length,
      requests: projectSubmissions.filter((s) => s.category === 'feature_request' || s.category === 'improvement').length,
      praise: projectSubmissions.filter((s) => s.category === 'liked').length
    };
  }, [projectSubmissions]);

  const activeSubmission = useMemo(() => {
    if (!activeSubmissionId) return null;
    return submissions.find((s) => s.id === activeSubmissionId) || null;
  }, [submissions, activeSubmissionId]);

  return {
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
  };
}
