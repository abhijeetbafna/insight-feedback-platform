/**
 * InSight — Custom Hook for Projects Management and Widget Snippet Generation
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService.js';
import { validateProjectKey, validateHexColor } from '../utils/security.js';

export function useProjects() {
  const [projects, setProjects] = useState(() => storageService.getProjects());

  useEffect(() => {
    const unsubscribe = storageService.subscribe(null, (updatedProjects) => {
      setProjects([...updatedProjects]);
    });
    return () => unsubscribe();
  }, []);

  const addProject = useCallback(({ key, name, releaseVersion, color, position }) => {
    const trimmedKey = (key || '').trim().toUpperCase();
    const trimmedName = (name || '').trim();
    const trimmedRelease = (releaseVersion || 'v1.0.0').trim();
    const hexColor = (color || '#1677FF').trim();
    const pos = position === 'bottom-left' ? 'bottom-left' : 'bottom-right';

    if (!trimmedKey || !trimmedName) {
      return { success: false, error: 'Project Key and Name are required.' };
    }
    if (!validateProjectKey(trimmedKey)) {
      return {
        success: false,
        error: 'Invalid Project Key format. Must be like PRJ-ANALYTICS (A-Z, 0-9, and dashes).'
      };
    }
    if (!validateHexColor(hexColor)) {
      return { success: false, error: 'Invalid hex color code. Must be like #1677FF.' };
    }

    const exists = projects.some((p) => p.key === trimmedKey);
    if (exists) {
      return { success: false, error: `A project with key "${trimmedKey}" already exists.` };
    }

    const newProject = {
      key: trimmedKey,
      name: trimmedName,
      releaseVersion: trimmedRelease,
      color: hexColor,
      position: pos
    };

    const next = [...projects, newProject];
    setProjects(next);
    storageService.saveProjects(next);
    return { success: true, project: newProject };
  }, [projects]);

  const generateEmbedSnippet = useCallback((projectKey) => {
    const found = projects.find((p) => p.key === projectKey) || projects[0] || {
      key: 'PRJ-DEMO',
      releaseVersion: 'v1.0.0',
      color: '#1677FF',
      position: 'bottom-right'
    };

    return `<script src="/insight-widget.js" data-project-key="${found.key}" data-release-version="${found.releaseVersion}" data-color="${found.color}" data-position="${found.position}"></script>`;
  }, [projects]);

  return {
    projects,
    addProject,
    generateEmbedSnippet
  };
}
