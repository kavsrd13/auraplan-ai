/**
 * Barrel export for all utility modules.
 * Provides a single import point for calculations, validation,
 * sanitization, and application constants.
 *
 * @module utils
 *
 * @example
 * ```ts
 * import { formatCurrency, validateEventForm, sanitizeForPrompt } from '@/utils';
 * ```
 */

export {
  calculateBudgetAllocations,
  calculateTotalAllocated,
  calculateTotalActual,
  calculateBudgetUtilization,
  isOverBudget,
  getOverBudgetCategories,
  sortTimelineByDate,
  getUpcomingMilestones,
  calculateDaysUntil,
  formatCurrency,
  generateId,
} from './calculations';

export {
  validateEventForm,
  validateAIResponse,
  isValidHexColor,
  isValidDate,
  isValidUrl,
} from './validation';

export {
  escapeXML,
  sanitizeHTML,
  sanitizeForPrompt,
  sanitizeObject,
} from './sanitize';

export {
  EVENT_TYPES,
  MILESTONE_STATUS,
  VENDOR_STATUS,
  DASHBOARD_TABS,
  BUDGET_THRESHOLDS,
  STORAGE_KEYS,
  INPUT_LIMITS,
  AI_CONFIG,
  STANDARD_BUDGET_CATEGORIES,
  TIME_CONSTANTS,
  UI_FEEDBACK_DURATION,
  TIMELINE_THRESHOLDS,
  FORM_DEFAULTS,
  EXPORT_CONFIG,
} from './constants';

export type {
  EventTypeValue,
  MilestoneStatusValue,
  VendorStatusValue,
  DashboardTabValue,
} from './constants';
