/**
 * Barrel export for all application components.
 * Provides a single import surface for consumers.
 *
 * @module components
 *
 * @example
 * ```ts
 * import { Layout, Dashboard, EventForm, ErrorBoundary } from '@/components';
 * ```
 */

// UI Primitives (re-exported from ui barrel)
export { Badge, ProgressBar, TabGroup } from './ui';
export type { BadgeProps, ProgressBarProps, TabGroupProps, TabItem } from './ui';

// Layout & Navigation
export { Layout } from './Layout';
export type { LayoutProps } from './Layout';
export { SkipLink } from './SkipLink';
export type { SkipLinkProps } from './SkipLink';
export { AccessibilityToolbar } from './AccessibilityToolbar';

// Core Views
export { Dashboard } from './Dashboard';
export type { DashboardProps } from './Dashboard';
export { EventForm } from './EventForm';
export { ApiKeyModal } from './ApiKeyModal';

// Feedback & Loading
export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary';
export { SkeletonLoader } from './SkeletonLoader';
export type { SkeletonLoaderProps, SkeletonType } from './SkeletonLoader';

// Feature Panels
export { AIChatPanel } from './AIChatPanel';
