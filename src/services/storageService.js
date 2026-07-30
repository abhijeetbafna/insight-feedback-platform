/**
 * InSight — Persistence & Real-Time Sync Storage Service
 * Handles safe localStorage operations and multi-context BroadcastChannel syncing.
 */

import {
  STORE_KEY,
  PROJECTS_KEY,
  BROADCAST_CHANNEL_NAME,
  DEFAULT_SUBMISSIONS,
  DEFAULT_PROJECTS
} from '../utils/constants.js';
import { safeParseJson } from '../utils/security.js';

class StorageService {
  constructor() {
    this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(BROADCAST_CHANNEL_NAME) : null;
    this.initSeeds();
  }

  initSeeds() {
    if (!localStorage.getItem(PROJECTS_KEY)) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem(STORE_KEY)) {
      localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_SUBMISSIONS));
    }
  }

  getSubmissions() {
    const raw = localStorage.getItem(STORE_KEY);
    return safeParseJson(raw, DEFAULT_SUBMISSIONS);
  }

  saveSubmissions(list) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
      if (this.channel) {
        this.channel.postMessage({ type: 'SUBMISSIONS_UPDATED', list });
      }
    } catch (err) {
      console.error('[InSight Storage] Error writing submissions to localStorage:', err);
    }
  }

  getProjects() {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return safeParseJson(raw, DEFAULT_PROJECTS);
  }

  saveProjects(list) {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
      if (this.channel) {
        this.channel.postMessage({ type: 'PROJECTS_UPDATED', list });
      }
    } catch (err) {
      console.error('[InSight Storage] Error writing projects to localStorage:', err);
    }
  }

  subscribe(onSubmissionsChange, onProjectsChange) {
    const handleStorage = (e) => {
      if (e.key === STORE_KEY && onSubmissionsChange) {
        onSubmissionsChange(this.getSubmissions());
      }
      if (e.key === PROJECTS_KEY && onProjectsChange) {
        onProjectsChange(this.getProjects());
      }
    };

    window.addEventListener('storage', handleStorage);

    let handleMessage = null;
    if (this.channel) {
      handleMessage = (event) => {
        const { type, list } = event.data || {};
        if (type === 'SUBMISSIONS_UPDATED' && onSubmissionsChange) {
          onSubmissionsChange(list || this.getSubmissions());
        } else if (type === 'NEW_SUBMISSION' && onSubmissionsChange) {
          onSubmissionsChange(this.getSubmissions());
        } else if (type === 'PROJECTS_UPDATED' && onProjectsChange) {
          onProjectsChange(list || this.getProjects());
        }
      };
      this.channel.addEventListener('message', handleMessage);
    }

    // Return cleanup unsubscribe function
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (this.channel && handleMessage) {
        this.channel.removeEventListener('message', handleMessage);
      }
    };
  }
}

export const storageService = new StorageService();
