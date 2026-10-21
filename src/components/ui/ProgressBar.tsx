/**
 * Accessible progress bar component conforming to WAI-ARIA progressbar specification.
 * Displays visual progress with aria-valuenow, aria-valuemin, aria-valuemax,
 * and customizable color thresholds.
 * Memoized with React.memo to optimize re-render cycles in high-frequency dashboards.
 *
 * @module ProgressBar
 */

import React, { useMemo } from 'react';
import { BUDGET_THRESHOLDS } from '@/utils/constants';

/**
 * Visual color variant options for ProgressBar.
 */
export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'auto';

/**
 * Size scale options for ProgressBar height.
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

/**
 * Props for ProgressBar component.
 */
export interface ProgressBarProps {
  /** Numeric progress value */
  value: number;
  /** Maximum progress capacity (default: 100) */
  max?: number;
  /** Accessible label describing what the bar measures */
  label: string;
  /** Whether to render textual percentage indicator */
  showPercent?: boolean;
  /** Height dimension */
  size?: ProgressBarSize;
  /** Theme color variant or 'auto' for threshold-based colors */
  variant?: ProgressBarVariant;
  /** Optional extra Tailwind CSS classes */
  className?: string;
}

const heightClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

/**
 * Progress bar component with ARIA attributes and animated transitions.
 *
 * @param props - Component properties
 * @returns Stylized accessible progress bar element
 */
const ProgressBarComponent: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  variant = 'auto',
  className = '',
}) => {
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.max(0, Math.min(value, safeMax * 1.5));
  const percentage = Math.min(Math.round((clampedValue / safeMax) * 100), 100);
  const actualPercent = Math.round((clampedValue / safeMax) * 100);

  // Compute color based on variant or thresholds
  const colorClass = useMemo((): string => {
    if (variant === 'auto') {
      if (actualPercent > BUDGET_THRESHOLDS.DANGER_PERCENT) {
        return 'bg-danger-600';
      }
      if (actualPercent >= BUDGET_THRESHOLDS.WARNING_PERCENT) {
        return 'bg-warning-500';
      }
      return 'bg-success-600';
    }

    switch (variant) {
      case 'primary':
        return 'bg-aura-600';
      case 'success':
        return 'bg-success-600';
      case 'warning':
        return 'bg-warning-500';
      case 'danger':
        return 'bg-danger-600';
      default:
        return 'bg-aura-600';
    }
  }, [variant, actualPercent]);

  return (
    <div className={`w-full ${className}`}>
      {showPercent && (
        <div className="flex justify-between text-xs font-medium text-surface-600 mb-1">
          <span>{label}</span>
          <span
            className={
              actualPercent > BUDGET_THRESHOLDS.DANGER_PERCENT
                ? 'text-danger-600 font-bold'
                : 'text-surface-700'
            }
          >
            {actualPercent}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={actualPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={`w-full bg-surface-200 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`${heightClasses[size]} ${colorClass} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBarComponent.displayName = 'ProgressBar';

export const ProgressBar = React.memo(ProgressBarComponent);
export default ProgressBar;
