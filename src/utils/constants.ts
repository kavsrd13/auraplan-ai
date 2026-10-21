/**
 * Application-wide constants for AuraPlan AI.
 * Centralizes magic strings, numeric thresholds, and configuration values
 * to prevent scattered literals and improve maintainability and code quality.
 *
 * @module constants
 */

/**
 * Event type constants supported by the platform.
 */
export const EVENT_TYPES = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  COMMUNITY: 'community',
} as const;

export type EventTypeValue = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/**
 * Milestone and timeline task status values.
 */
export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export type MilestoneStatusValue = (typeof MILESTONE_STATUS)[keyof typeof MILESTONE_STATUS];

/**
 * Vendor negotiation and booking status values.
 */
export const VENDOR_STATUS = {
  NOT_CONTACTED: 'not-contacted',
  CONTACTED: 'contacted',
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
} as const;

export type VendorStatusValue = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];

/**
 * Main dashboard navigation tab identifiers.
 */
export const DASHBOARD_TABS = {
  BUDGET: 'budget',
  TIMELINE: 'timeline',
  VENDORS: 'vendors',
  IDEAS: 'ideas',
  EXPORT: 'export',
} as const;

export type DashboardTabValue = (typeof DASHBOARD_TABS)[keyof typeof DASHBOARD_TABS];

/**
 * Budget utilization percentage thresholds for visual alerts.
 */
export const BUDGET_THRESHOLDS = {
  WARNING_PERCENT: 90,
  DANGER_PERCENT: 100,
} as const;

/**
 * Local storage keys utilized for persistence across sessions.
 */
export const STORAGE_KEYS = {
  PLANS: 'auraplan-saved-plans',
  API_KEY: 'auraplan-api-key',
  ACTIVE_PLAN_ID: 'auraplan-active-plan-id',
  ACCESSIBILITY_SETTINGS: 'auraplan-a11y-settings',
} as const;

/**
 * Form field character length and value boundaries for sanitization and validation.
 */
export const INPUT_LIMITS = {
  THEME_MIN_LENGTH: 3,
  THEME_MAX_LENGTH: 200,
  LOCATION_MIN_LENGTH: 2,
  LOCATION_MAX_LENGTH: 200,
  PREFERENCES_MAX_LENGTH: 500,
  MIN_GUESTS: 1,
  MAX_GUESTS: 50000,
  MIN_BUDGET: 100,
  MAX_BUDGET: 10000000,
} as const;

/**
 * Default Gemini model configurations.
 */
export const AI_CONFIG = {
  PRIMARY_MODEL: 'gemini-3.5-flash-lite',
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 8000,
  REQUEST_TIMEOUT_MS: 30000,
} as const;

/**
 * Core budget categories default list.
 */
export const STANDARD_BUDGET_CATEGORIES = [
  'Venue & Rentals',
  'Catering & Bar',
  'Decor & Florals',
  'Entertainment & Media',
  'Miscellaneous & Contingency',
] as const;
