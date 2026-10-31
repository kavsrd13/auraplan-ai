/**
 * Barrel export for shared UI primitive components.
 * Provides a single import point for Badge, ProgressBar, and TabGroup.
 *
 * @module ui
 *
 * @example
 * ```ts
 * import { Badge, ProgressBar, TabGroup } from '@/components/ui';
 * ```
 */

export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from './ProgressBar';

export { TabGroup } from './TabGroup';
export type { TabGroupProps, TabItem } from './TabGroup';
