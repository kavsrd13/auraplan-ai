/**
 * Barrel export for all custom React hooks.
 * Consolidates hook imports into a single module path.
 *
 * @module hooks
 *
 * @example
 * ```ts
 * import { useEventPlan, useLocalStorage, useDebounce } from '@/hooks';
 * ```
 */

export { useEventPlan, appReducer, initialAppState } from './useEventPlan';
export { useLocalStorage, savePlanToStorage, loadPlansFromStorage, removePlanFromStorage, clearPlansFromStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useBudgetEditor } from './useBudgetEditor';
export type { UseBudgetEditorReturn } from './useBudgetEditor';
export { useFormValidation } from './useFormValidation';
export type { UseFormValidationReturn, PresetData } from './useFormValidation';
