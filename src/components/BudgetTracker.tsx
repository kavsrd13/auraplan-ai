/**
 * Dynamic Budget Breakdown component.
 * Categorized allocations with estimated vs actual spend tracking,
 * visual progress bars, over-budget alerts, and interactive inline spend adjustments.
 * Optimized with useMemo, useBudgetEditor custom hook, and React.memo.
 *
 * @module BudgetTracker
 */

import React, { useMemo } from 'react';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Edit2,
  Check,
  X,
  Info,
} from 'lucide-react';
import type { BudgetCategory } from '@/types/event';
import { ProgressBar } from './ui/ProgressBar';
import { Badge } from './ui/Badge';
import { formatCurrency, calculateBudgetUtilization } from '@/utils/calculations';
import { useBudgetEditor } from '@/hooks/useBudgetEditor';

/**
 * Props for the BudgetTracker component.
 */
export interface BudgetTrackerProps {
  /** Total event budget cap defined by user */
  totalBudget: number;
  /** Array of categorized budget items */
  budget: BudgetCategory[];
  /** Handler to persist updates to an individual budget category */
  onUpdateCategory: (index: number, updates: Partial<BudgetCategory>) => void;
}

/**
 * Interactive BudgetTracker component.
 *
 * @param props - Component properties
 * @returns Dashboard section rendering budget metrics, progress bars, and inline editing
 */
const BudgetTrackerComponent: React.FC<BudgetTrackerProps> = ({
  totalBudget,
  budget,
  onUpdateCategory,
}) => {
  // Extract editor state and actions to dedicated custom hook
  const {
    editingIndex,
    editActual,
    editAllocated,
    editNotes,
    setEditActual,
    setEditAllocated,
    setEditNotes,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
  } = useBudgetEditor(onUpdateCategory);

  // Memoize aggregated metrics to avoid redundant recalculations on unrelated renders
  const totalAllocated = useMemo(
    () => budget.reduce((sum, item) => sum + item.allocated, 0),
    [budget]
  );

  const totalActual = useMemo(
    () => budget.reduce((sum, item) => sum + item.actual, 0),
    [budget]
  );

  const remainingBudget = useMemo(
    () => totalBudget - totalActual,
    [totalBudget, totalActual]
  );

  const overallUtilization = useMemo(
    () => calculateBudgetUtilization(totalBudget, totalActual),
    [totalBudget, totalActual]
  );

  const isTotalOver = useMemo(
    () => totalActual > totalBudget,
    [totalActual, totalBudget]
  );

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs">
          <div className="flex items-center justify-between text-surface-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <DollarSign className="w-4 h-4 text-aura-600" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-surface-900">{formatCurrency(totalBudget)}</p>
          <span className="text-xs text-surface-500 mt-1 block">Allocated: {formatCurrency(totalAllocated)}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs">
          <div className="flex items-center justify-between text-surface-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Actual Spend</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-surface-900">{formatCurrency(totalActual)}</p>
          <span className="text-xs text-surface-500 mt-1 block">{overallUtilization}% utilized</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs">
          <div className="flex items-center justify-between text-surface-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining</span>
            <PieChart className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          </div>
          <p
            className={`text-2xl font-black ${
              remainingBudget < 0 ? 'text-danger-600' : 'text-emerald-700'
            }`}
          >
            {formatCurrency(remainingBudget)}
          </p>
          <span className="text-xs text-surface-500 mt-1 block">
            {remainingBudget < 0 ? 'Exceeds budget cap' : 'Safe reserve funds'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs">
          <div className="flex items-center justify-between text-surface-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Budget Health</span>
            <AlertTriangle
              className={`w-4 h-4 ${isTotalOver ? 'text-danger-600' : 'text-emerald-600'}`}
              aria-hidden="true"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isTotalOver ? 'danger' : 'success'}>
              {isTotalOver ? 'Over Budget' : 'On Track'}
            </Badge>
          </div>
          <span className="text-xs text-surface-500 mt-2 block">
            {isTotalOver
              ? `Deficit of ${formatCurrency(Math.abs(remainingBudget))}`
              : `${formatCurrency(remainingBudget)} under ceiling`}
          </span>
        </div>
      </div>

      {/* Global Utilization Progress Bar */}
      <div className="p-6 bg-white rounded-2xl border border-surface-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-surface-900">Total Spend Progress</h3>
            <p className="text-xs text-surface-500">
              Aggregated spend across all categories compared to your total budget cap
            </p>
          </div>
          <span className="text-sm font-extrabold text-surface-800">
            {formatCurrency(totalActual)} / {formatCurrency(totalBudget)}
          </span>
        </div>
        <ProgressBar
          value={totalActual}
          max={totalBudget}
          label="Total event budget progress"
          size="lg"
          variant="auto"
          showPercent
        />
      </div>

      {/* Over-Budget Alert Banner with aria-live */}
      <div aria-live="polite">
        {isTotalOver && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-900">
            <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-sm font-bold">Total Budget Exceeded!</h4>
              <p className="text-xs text-danger-700 mt-0.5">
                Current expenses exceed your total budget by {formatCurrency(Math.abs(remainingBudget))}. Consider adjusting non-essential categories or negotiating lower vendor minimums using the AI chat.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Categorized Allocations Table & Cards */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-surface-900">Categorized Budget Allocations</h3>
            <p className="text-xs text-surface-500">
              Click the edit icon on any row to update actual payments, adjust allocations, or add payment receipts.
            </p>
          </div>
        </div>

        <div className="divide-y divide-surface-100">
          {budget.map((item, index) => {
            const isEditing = editingIndex === index;
            const categoryOver = item.actual > item.allocated;
            const utilization = calculateBudgetUtilization(item.allocated, item.actual);

            return (
              <div
                key={item.category}
                className={`p-6 transition-colors ${
                  categoryOver ? 'bg-danger-50/30' : 'hover:bg-surface-50/50'
                }`}
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-surface-900">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(index)}
                          aria-label={`Save edits for ${item.category}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-aura-600 hover:bg-aura-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          aria-label="Cancel editing"
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-surface-400"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`allocated-${index}`}
                          className="block text-xs font-semibold text-surface-700 mb-1"
                        >
                          Allocated Amount ($)
                        </label>
                        <input
                          id={`allocated-${index}`}
                          type="number"
                          min="0"
                          value={editAllocated}
                          onChange={(e) => setEditAllocated(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-aura-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`actual-${index}`}
                          className="block text-xs font-semibold text-surface-700 mb-1"
                        >
                          Actual Spend ($)
                        </label>
                        <input
                          id={`actual-${index}`}
                          type="number"
                          min="0"
                          value={editActual}
                          onChange={(e) => setEditActual(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-aura-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`notes-${index}`}
                        className="block text-xs font-semibold text-surface-700 mb-1"
                      >
                        Notes & Inclusions
                      </label>
                      <input
                        id={`notes-${index}`}
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-aura-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-surface-900">{item.category}</span>
                        {categoryOver && (
                          <Badge variant="danger">
                            Over by {formatCurrency(item.actual - item.allocated)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-surface-500 block">Actual / Allocated</span>
                          <span className="text-sm font-extrabold text-surface-900">
                            {formatCurrency(item.actual)}{' '}
                            <span className="text-surface-400 font-normal">/ {formatCurrency(item.allocated)}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(index, item)}
                          aria-label={`Edit ${item.category} budget values`}
                          className="p-2 text-surface-400 hover:text-aura-600 hover:bg-aura-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-aura-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar per category */}
                    <ProgressBar
                      value={item.actual}
                      max={item.allocated}
                      label={`${item.category} utilization`}
                      size="md"
                      variant="auto"
                      showPercent
                    />

                    {/* Notes & Estimates */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-surface-500 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" aria-hidden="true" />
                        <span>{item.notes}</span>
                      </div>
                      <span className="text-surface-600 font-medium sm:text-right">
                        Estimated: {formatCurrency(item.estimated)} ({utilization}% of cap)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

BudgetTrackerComponent.displayName = 'BudgetTracker';

export const BudgetTracker = React.memo(BudgetTrackerComponent);
export default BudgetTracker;
