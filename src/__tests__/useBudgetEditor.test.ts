import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBudgetEditor } from '@/hooks/useBudgetEditor';
import type { BudgetCategory } from '@/types/event';

describe('useBudgetEditor hook', () => {
  const mockCategory: BudgetCategory = {
    category: 'Catering & Bar',
    allocated: 10000,
    estimated: 9500,
    actual: 8000,
    notes: 'Buffet style meal',
  };

  it('starts with editingIndex null and zero values', () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() => useBudgetEditor(onUpdate));

    expect(result.current.editingIndex).toBeNull();
    expect(result.current.editActual).toBe(0);
    expect(result.current.editAllocated).toBe(0);
    expect(result.current.editNotes).toBe('');
  });

  it('populates fields when handleStartEdit is invoked', () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() => useBudgetEditor(onUpdate));

    act(() => {
      result.current.handleStartEdit(2, mockCategory);
    });

    expect(result.current.editingIndex).toBe(2);
    expect(result.current.editActual).toBe(8000);
    expect(result.current.editAllocated).toBe(10000);
    expect(result.current.editNotes).toBe('Buffet style meal');
  });

  it('commits updates and clamps negative values on handleSaveEdit', () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() => useBudgetEditor(onUpdate));

    act(() => {
      result.current.handleStartEdit(0, mockCategory);
      result.current.setEditActual(-500); // negative check
      result.current.setEditAllocated(12000);
      result.current.setEditNotes('Special dietary inclusions');
    });

    act(() => {
      result.current.handleSaveEdit(0);
    });

    expect(onUpdate).toHaveBeenCalledWith(0, {
      actual: 0, // Clamped to 0
      allocated: 12000,
      notes: 'Special dietary inclusions',
    });
    expect(result.current.editingIndex).toBeNull();
  });

  it('discards edits when handleCancelEdit is called', () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() => useBudgetEditor(onUpdate));

    act(() => {
      result.current.handleStartEdit(1, mockCategory);
      result.current.setEditActual(15000);
    });

    act(() => {
      result.current.handleCancelEdit();
    });

    expect(onUpdate).not.toHaveBeenCalled();
    expect(result.current.editingIndex).toBeNull();
  });
});
