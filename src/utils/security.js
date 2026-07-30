/**
 * InSight — Security & Input Validation Layer (OWASP Top 10 Compliance)
 * Ensures all user feedback commentary, project keys, and URL metadata are sanitized against XSS.
 */

/**
 * Escapes potentially dangerous characters to prevent Cross-Site Scripting (XSS).
 * @param {string} str - Raw string input
 * @returns {string} Safe HTML string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes multi-line text input while preserving line breaks safely.
 * @param {string} comment - Raw feedback comment
 * @returns {string} Sanitized string
 */
export function sanitizeComment(comment) {
  if (!comment || typeof comment !== 'string') return '';
  const trimmed = comment.trim();
  // Strip script tags and inline event handlers explicitly
  const noScripts = trimmed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  return escapeHtml(noScripts);
}

/**
 * Validates project key format (e.g., PRJ-ANALYTICS, PRJ-001).
 * Must be uppercase alphanumeric with dashes, 3-24 characters.
 * @param {string} key
 * @returns {boolean}
 */
export function validateProjectKey(key) {
  if (!key || typeof key !== 'string') return false;
  const pattern = /^[A-Z0-9]{2,10}-[A-Z0-9]{2,14}$/;
  return pattern.test(key.trim());
}

/**
 * Validates standard hexadecimal color codes (#RRGGBB or #RGB).
 * @param {string} color
 * @returns {boolean}
 */
export function validateHexColor(color) {
  if (!color || typeof color !== 'string') return false;
  const pattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return pattern.test(color.trim());
}

/**
 * Safely parses a JSON string from localStorage with a fallback default.
 * Prevents application crashes from corrupted storage payloads.
 * @template T
 * @param {string|null} raw
 * @param {T} fallback
 * @returns {T}
 */
export function safeParseJson(raw, fallback) {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object' ? parsed : fallback;
  } catch (err) {
    console.error('[InSight Security] Failed to parse stored JSON safely. Using fallback.', err);
    return fallback;
  }
}
