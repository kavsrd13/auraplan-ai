/**
 * Custom React hook for managing inline editing state in BudgetTracker.
 * Encapsulates editor state (editing index, temporary fields for allocated/actual spend and notes)
 * and provides memoized handlers to start, commit, and cancel edits safely.
 *
 * @module useBudgetEditor
 */

import { useState, useCallback } from 'react';
import type { BudgetCategory } from '@/types/event';

export interface UseBudgetEditorReturn {
  /** Index of category currently being edited, or null if none */
  editingIndex: number | null;
  /** Temporary actual spend value during edit */
  editActual: number;
  /** Temporary allocated budget value during edit */
  editAllocated: number;
  /** Temporary notes value during edit */
  editNotes: string;
  /** Setter for temporary actual spend value */
  setEditActual: (val: number) => void;
  /** Setter for temporary allocated budget value */
  setEditAllocated: (val: number) => void;
  /** Setter for temporary notes value */
  setEditNotes: (val: string) => void;
  /** Initiates inline edit for a category */
  handleStartEdit: (index: number, item: BudgetCategory) => void;
  /** Commits the inline edit and invokes update callback */
  handleSaveEdit: (index: number) => void;
  /** Cancels the inline edit without saving */
  handleCancelEdit: () => void;
}

/**
 * Hook to manage inline editing lifecycle of budget categories.
 *
 * @param onUpdateCategory - Callback invoked when an edited category is committed
 * @returns State and memoized action handlers for the budget category editor
 *
 * @example
 * ```tsx
 * const editor = useBudgetEditor(onUpdateCategory);
 * ```
 */
export function useBudgetEditor(
  onUpdateCategory: (index: number, updates: Partial<BudgetCategory>) => void
): UseBudgetEditorReturn {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editActual, setEditActual] = useState<number>(0);
  const [editAllocated, setEditAllocated] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const handleStartEdit = useCallback((index: number, item: BudgetCategory): void => {
    setEditingIndex(index);
    setEditActual(item.actual);
    setEditAllocated(item.allocated);
    setEditNotes(item.notes || '');
  }, []);

  const handleSaveEdit = useCallback(
    (index: number): void => {
      onUpdateCategory(index, {
        actual: Math.max(0, editActual),
        allocated: Math.max(0, editAllocated),
        notes: editNotes.trim(),
      });
      setEditingIndex(null);
    },
    [editActual, editAllocated, editNotes, onUpdateCategory]
  );

  const handleCancelEdit = useCallback((): void => {
    setEditingIndex(null);
  }, []);

  return {
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
  };
}

export default useBudgetEditor;
