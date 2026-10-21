import { describe, it, expect } from 'vitest';
import {
  EVENT_TYPES,
  MILESTONE_STATUS,
  VENDOR_STATUS,
  DASHBOARD_TABS,
  BUDGET_THRESHOLDS,
  STORAGE_KEYS,
  INPUT_LIMITS,
  AI_CONFIG,
  STANDARD_BUDGET_CATEGORIES,
} from '@/utils/constants';

describe('constants definitions', () => {
  it('defines valid EVENT_TYPES', () => {
    expect(EVENT_TYPES.WEDDING).toBe('wedding');
    expect(EVENT_TYPES.BIRTHDAY).toBe('birthday');
    expect(EVENT_TYPES.COMMUNITY).toBe('community');
  });

  it('defines consistent MILESTONE_STATUS values', () => {
    expect(MILESTONE_STATUS.PENDING).toBe('pending');
    expect(MILESTONE_STATUS.IN_PROGRESS).toBe('in-progress');
    expect(MILESTONE_STATUS.COMPLETED).toBe('completed');
  });

  it('defines consistent VENDOR_STATUS values', () => {
    expect(VENDOR_STATUS.NOT_CONTACTED).toBe('not-contacted');
    expect(VENDOR_STATUS.CONTACTED).toBe('contacted');
    expect(VENDOR_STATUS.BOOKED).toBe('booked');
    expect(VENDOR_STATUS.CONFIRMED).toBe('confirmed');
  });

  it('defines expected DASHBOARD_TABS', () => {
    expect(DASHBOARD_TABS.BUDGET).toBe('budget');
    expect(DASHBOARD_TABS.TIMELINE).toBe('timeline');
    expect(DASHBOARD_TABS.VENDORS).toBe('vendors');
    expect(DASHBOARD_TABS.IDEAS).toBe('ideas');
    expect(DASHBOARD_TABS.EXPORT).toBe('export');
  });

  it('defines correct BUDGET_THRESHOLDS', () => {
    expect(BUDGET_THRESHOLDS.WARNING_PERCENT).toBe(90);
    expect(BUDGET_THRESHOLDS.DANGER_PERCENT).toBe(100);
    expect(BUDGET_THRESHOLDS.WARNING_PERCENT).toBeLessThan(BUDGET_THRESHOLDS.DANGER_PERCENT);
  });

  it('defines STORAGE_KEYS with consistent prefixes', () => {
    expect(STORAGE_KEYS.PLANS).toContain('auraplan');
    expect(STORAGE_KEYS.API_KEY).toContain('auraplan');
  });

  it('defines reasonable INPUT_LIMITS', () => {
    expect(INPUT_LIMITS.THEME_MAX_LENGTH).toBeGreaterThan(INPUT_LIMITS.THEME_MIN_LENGTH);
    expect(INPUT_LIMITS.MAX_GUESTS).toBeGreaterThan(INPUT_LIMITS.MIN_GUESTS);
    expect(INPUT_LIMITS.MAX_BUDGET).toBeGreaterThan(INPUT_LIMITS.MIN_BUDGET);
  });

  it('configures AI_CONFIG with production model and retry backoff', () => {
    expect(AI_CONFIG.PRIMARY_MODEL).toBe('gemini-3.5-flash-lite');
    expect(AI_CONFIG.MAX_RETRIES).toBe(3);
    expect(AI_CONFIG.INITIAL_RETRY_DELAY_MS).toBe(1000);
  });

  it('provides standard budget categories list', () => {
    expect(STANDARD_BUDGET_CATEGORIES).toHaveLength(5);
    expect(STANDARD_BUDGET_CATEGORIES).toContain('Venue & Rentals');
    expect(STANDARD_BUDGET_CATEGORIES).toContain('Catering & Bar');
  });
});
