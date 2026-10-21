/**
 * Unit tests for calculations utility functions.
 * Tests budget mathematics, over-budget detection, timeline sorting, and date math.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBudgetAllocations,
  calculateTotalAllocated,
  calculateTotalActual,
  calculateBudgetUtilization,
  isOverBudget,
  getOverBudgetCategories,
  sortTimelineByDate,
  calculateDaysUntil,
  formatCurrency,
} from '@/utils/calculations';
import type { BudgetCategory, TimelineMilestone } from '@/types/event';

describe('calculations.ts', () => {
  describe('calculateBudgetAllocations', () => {
    it('should allocate wedding budget according to wedding percentages (30/25/15/15/15)', () => {
      const budget = calculateBudgetAllocations(10000, 'wedding');
      expect(budget).toHaveLength(5);

      const venue = budget.find((b) => b.category.includes('Venue'));
      const catering = budget.find((b) => b.category.includes('Catering'));
      const decor = budget.find((b) => b.category.includes('Decor'));

      expect(venue?.allocated).toBe(3000);
      expect(catering?.allocated).toBe(2500);
      expect(decor?.allocated).toBe(1500);

      const totalAllocated = budget.reduce((sum, b) => sum + b.allocated, 0);
      expect(totalAllocated).toBe(10000);
    });

    it('should allocate birthday budget according to birthday percentages (25/30/15/20/10)', () => {
      const budget = calculateBudgetAllocations(5000, 'birthday');
      const catering = budget.find((b) => b.category.includes('Catering'));
      expect(catering?.allocated).toBe(1500); // 30% of 5000

      const totalAllocated = budget.reduce((sum, b) => sum + b.allocated, 0);
      expect(totalAllocated).toBe(5000);
    });

    it('should allocate community budget according to community percentages (35/20/10/20/15)', () => {
      const budget = calculateBudgetAllocations(20000, 'community');
      const venue = budget.find((b) => b.category.includes('Venue'));
      expect(venue?.allocated).toBe(7000); // 35% of 20000

      const totalAllocated = budget.reduce((sum, b) => sum + b.allocated, 0);
      expect(totalAllocated).toBe(20000);
    });
  });

  describe('Budget math totals & utilization', () => {
    const mockBudget: BudgetCategory[] = [
      { category: 'Venue', allocated: 5000, estimated: 4800, actual: 5200, notes: '' },
      { category: 'Catering', allocated: 3000, estimated: 3000, actual: 2500, notes: '' },
      { category: 'Decor', allocated: 2000, estimated: 2000, actual: 2000, notes: '' },
    ];

    it('should correctly sum total allocated budget', () => {
      expect(calculateTotalAllocated(mockBudget)).toBe(10000);
    });

    it('should correctly sum total actual spend', () => {
      expect(calculateTotalActual(mockBudget)).toBe(9700);
    });

    it('should calculate budget utilization percentage', () => {
      expect(calculateBudgetUtilization(10000, 9700)).toBe(97);
      expect(calculateBudgetUtilization(1000, 1500)).toBe(150);
      expect(calculateBudgetUtilization(0, 100)).toBe(0);
    });

    it('should detect when total budget is exceeded', () => {
      expect(isOverBudget(9000, mockBudget)).toBe(true); // 9700 > 9000
      expect(isOverBudget(10000, mockBudget)).toBe(false); // 9700 <= 10000
    });

    it('should identify specific categories that are over budget', () => {
      const over = getOverBudgetCategories(mockBudget);
      expect(over).toHaveLength(1);
      expect(over[0].category).toBe('Venue'); // 5200 actual > 5000 allocated
    });
  });

  describe('sortTimelineByDate', () => {
    it('should sort milestones chronologically in ascending order', () => {
      const milestones: TimelineMilestone[] = [
        { id: '1', title: 'Late task', dueDate: '2026-12-01', description: '', status: 'pending', priority: 'medium' },
        { id: '2', title: 'Early task', dueDate: '2026-06-01', description: '', status: 'completed', priority: 'high' },
        { id: '3', title: 'Middle task', dueDate: '2026-09-15', description: '', status: 'in-progress', priority: 'low' },
      ];

      const sorted = sortTimelineByDate(milestones);
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD amounts cleanly without cents', () => {
      expect(formatCurrency(25000)).toBe('$25,000');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });
  });

  describe('calculateDaysUntil', () => {
    it('should calculate positive days for future dates', () => {
      const future = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
      const days = calculateDaysUntil(future);
      expect(days).toBeGreaterThanOrEqual(4);
      expect(days).toBeLessThanOrEqual(6);
    });
  });
});
