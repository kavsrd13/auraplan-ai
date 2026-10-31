/**
 * Barrel export for all TypeScript type definitions and Zod schemas.
 * Provides a single import point for all application interfaces, types, and schemas.
 *
 * @module types
 *
 * @example
 * ```ts
 * import type { EventPlan, EventFormInput, BudgetCategory } from '@/types';
 * ```
 */

export type {
  EventType,
  TaskStatus,
  VendorStatus,
  BudgetCategory,
  TimelineMilestone,
  VendorItem,
  ThemeIdea,
  MenuSuggestion,
  DecorIdea,
  IdeaBoard,
  EventPlan,
  EventFormInput,
  ChatMessage,
  AIGeneratedPlan,
  AppView,
  DashboardTab,
  AppState,
  AppAction,
} from './event';

export {
  MAX_STRING_LENGTH,
  MAX_GUEST_COUNT,
  MAX_BUDGET,
  EventFormSchema,
  BudgetCategorySchema,
  TimelineMilestoneSchema,
  VendorItemSchema,
  ThemeIdeaSchema,
  MenuSuggestionSchema,
  DecorIdeaSchema,
  IdeaBoardSchema,
  AIGeneratedPlanSchema,
} from './event';
