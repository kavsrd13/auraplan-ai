/**
 * Accessible status badge component.
 * Renders an inline semantic badge used for categories, counts, and status indicators.
 * Optimized with React.memo to prevent superfluous parent re-renders.
 *
 * @module Badge
 */

import React from 'react';

/**
 * Visual styling variants for the Badge component.
 */
export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * Size scale options for the Badge component.
 */
export type BadgeSize = 'sm' | 'md';

/**
 * Props for the Badge component.
 */
export interface BadgeProps {
  /** Text or element rendered inside the badge */
  children: React.ReactNode;
  /** Color theme variant indicating severity or category */
  variant?: BadgeVariant;
  /** Physical sizing scale of padding and text */
  size?: BadgeSize;
  /** Optional extra Tailwind CSS classes */
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-100 text-surface-700 border-surface-300',
  info: 'bg-aura-50 text-aura-700 border-aura-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

/**
 * Accessible Badge component.
 *
 * @param props - Component properties
 * @returns Stylized inline status pill
 */
const BadgeComponent: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

BadgeComponent.displayName = 'Badge';

export const Badge = React.memo(BadgeComponent);
export default Badge;
