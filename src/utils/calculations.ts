import type {
  BudgetCategory,
  EventType,
  TimelineMilestone,
} from '@/types/event';
import { MILESTONE_STATUS } from '@/utils/constants';

/**
 * Default budget allocation percentages per event type.
 * Each entry maps a category name to a percentage of the total budget.
 */
const BUDGET_ALLOCATIONS: Record<EventType, Record<string, number>> = {
  wedding: {
    Venue: 0.3,
    Catering: 0.25,
    Decor: 0.15,
    Entertainment: 0.15,
    Miscellaneous: 0.15,
  },
  birthday: {
    Venue: 0.25,
    Catering: 0.3,
    Decor: 0.15,
    Entertainment: 0.2,
    Miscellaneous: 0.1,
  },
  community: {
    Venue: 0.35,
    Catering: 0.2,
    Decor: 0.1,
    Entertainment: 0.2,
    Miscellaneous: 0.15,
  },
};

/**
 * Generates default budget category allocations based on the total budget
 * and event type. Each event type has a predefined percentage split.
 *
 * @param totalBudget - The total budget amount in USD.
 * @param eventType - The type of event being planned.
 * @returns An array of `BudgetCategory` objects with allocated amounts.
 *
 * @example
 * ```ts
 * const budget = calculateBudgetAllocations(10000, 'wedding');
 * // => [{ category: 'Venue', allocated: 3000, estimated: 0, actual: 0, notes: '' }, ...]
 * ```
 */
export function calculateBudgetAllocations(
  totalBudget: number,
  eventType: EventType
): BudgetCategory[] {
  const allocations = BUDGET_ALLOCATIONS[eventType];

  return Object.entries(allocations).map(([category, percentage]) => ({
    category,
    allocated: Math.round(totalBudget * percentage * 100) / 100,
    estimated: 0,
    actual: 0,
    notes: '',
  }));
}

/**
 * Calculates the total allocated budget across all categories.
 *
 * @param budget - Array of budget categories.
 * @returns The sum of all `allocated` amounts.
 *
 * @example
 * ```ts
 * const total = calculateTotalAllocated(budget);
 * // => 10000
 * ```
 */
export function calculateTotalAllocated(budget: BudgetCategory[]): number {
  return budget.reduce((sum, cat) => sum + cat.allocated, 0);
}

/**
 * Calculates the total actual spend across all categories.
 *
 * @param budget - Array of budget categories.
 * @returns The sum of all `actual` amounts.
 *
 * @example
 * ```ts
 * const totalSpent = calculateTotalActual(budget);
 * // => 8500
 * ```
 */
export function calculateTotalActual(budget: BudgetCategory[]): number {
  return budget.reduce((sum, cat) => sum + cat.actual, 0);
}

/**
 * Calculates the budget utilization as a percentage of actual vs. allocated.
 * Returns 0 if the allocated amount is 0 to avoid division by zero.
 *
 * @param allocated - The allocated budget amount.
 * @param actual - The actual amount spent.
 * @returns Utilization percentage (e.g., 85 means 85%).
 *
 * @example
 * ```ts
 * const util = calculateBudgetUtilization(1000, 850);
 * // => 85
 * ```
 */
export function calculateBudgetUtilization(allocated: number, actual: number): number {
  if (allocated === 0) {
    return 0;
  }
  return Math.round((actual / allocated) * 10000) / 100;
}

/**
 * Determines whether the total actual spending exceeds the total budget.
 *
 * @param totalBudget - The overall budget cap.
 * @param budget - Array of budget categories with actual amounts.
 * @returns `true` if total actual spending exceeds the budget.
 *
 * @example
 * ```ts
 * const over = isOverBudget(10000, budget);
 * // => false
 * ```
 */
export function isOverBudget(totalBudget: number, budget: BudgetCategory[]): boolean {
  return calculateTotalActual(budget) > totalBudget;
}

/**
 * Returns budget categories where the actual spend exceeds the allocated amount.
 *
 * @param budget - Array of budget categories.
 * @returns Array of categories that are over their allocated budget.
 *
 * @example
 * ```ts
 * const overCategories = getOverBudgetCategories(budget);
 * // => [{ category: 'Catering', allocated: 2500, actual: 3000, ... }]
 * ```
 */
export function getOverBudgetCategories(budget: BudgetCategory[]): BudgetCategory[] {
  return budget.filter((cat) => cat.actual > cat.allocated);
}

/**
 * Sorts timeline milestones by their due date in ascending order (earliest first).
 * Returns a new array without mutating the original.
 *
 * @param milestones - Array of timeline milestones.
 * @returns A new array of milestones sorted by `dueDate`.
 *
 * @example
 * ```ts
 * const sorted = sortTimelineByDate(milestones);
 * ```
 */
export function sortTimelineByDate(milestones: TimelineMilestone[]): TimelineMilestone[] {
  return [...milestones].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

/**
 * Returns milestones that are due within the specified number of days
 * and are not yet completed.
 *
 * @param milestones - Array of timeline milestones.
 * @param daysAhead - Number of days into the future to look.
 * @returns Array of upcoming incomplete milestones within the window.
 *
 * @example
 * ```ts
 * const upcoming = getUpcomingMilestones(milestones, 7);
 * // => milestones due in the next 7 days that aren't completed
 * ```
 */
export function getUpcomingMilestones(
  milestones: TimelineMilestone[],
  daysAhead: number
): TimelineMilestone[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + daysAhead);

  return milestones.filter((milestone) => {
    if (milestone.status === MILESTONE_STATUS.COMPLETED) {
      return false;
    }
    const dueDate = new Date(milestone.dueDate);
    return dueDate >= now && dueDate <= cutoff;
  });
}

/**
 * Calculates the number of days from today until the given date.
 * Negative values indicate past dates.
 *
 * @param dateString - A date string parseable by the `Date` constructor.
 * @returns Number of days until the date (negative if in the past).
 *
 * @example
 * ```ts
 * const days = calculateDaysUntil('2026-12-25');
 * // => 65 (if today is Oct 21, 2026)
 * ```
 */
export function calculateDaysUntil(dateString: string): number {
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats a numeric amount as a USD currency string.
 *
 * @param amount - The dollar amount to format.
 * @returns A formatted currency string (e.g., "$1,234.56").
 *
 * @example
 * ```ts
 * formatCurrency(1234.5);
 * // => "$1,234.50"
 * ```
 */
export function formatCurrency(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/**
 * Generates a unique identifier string.
 * Uses `crypto.randomUUID()` when available, otherwise falls back
 * to a timestamp + random number combination.
 *
 * @returns A unique identifier string.
 *
 * @example
 * ```ts
 * const id = generateId();
 * // => "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * ```
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${randomPart2}`;
}
