/**
 * Accessible status badge component.
 *
 * @module Badge
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    neutral: 'bg-surface-100 text-surface-700 border-surface-300',
    info: 'bg-aura-50 text-aura-700 border-aura-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  }[variant];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
