/**
 * Accessible progress bar component.
 * Displays visual progress with aria-valuenow, aria-valuemin, aria-valuemax,
 * and customizable color thresholds.
 *
 * @module ProgressBar
 */

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  variant = 'auto',
  className = '',
}) => {
  const clampedValue = Math.max(0, Math.min(value, max * 1.5));
  const percentage = Math.min(Math.round((clampedValue / max) * 100), 100);
  const actualPercent = Math.round((clampedValue / max) * 100);

  // Auto variant selects color based on percentage threshold
  let colorClass = 'bg-aura-600';
  if (variant === 'auto') {
    if (actualPercent > 100) {
      colorClass = 'bg-danger-600';
    } else if (actualPercent >= 90) {
      colorClass = 'bg-warning-500';
    } else {
      colorClass = 'bg-success-600';
    }
  } else {
    switch (variant) {
      case 'primary':
        colorClass = 'bg-aura-600';
        break;
      case 'success':
        colorClass = 'bg-success-600';
        break;
      case 'warning':
        colorClass = 'bg-warning-500';
        break;
      case 'danger':
        colorClass = 'bg-danger-600';
        break;
    }
  }

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {showPercent && (
        <div className="flex justify-between text-xs font-medium text-surface-600 mb-1">
          <span>{label}</span>
          <span className={actualPercent > 100 ? 'text-danger-600 font-bold' : ''}>
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
        className={`w-full bg-surface-200 rounded-full overflow-hidden ${heightClass}`}
      >
        <div
          className={`${heightClass} ${colorClass} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
