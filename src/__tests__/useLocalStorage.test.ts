import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useLocalStorage,
  savePlanToStorage,
  loadPlansFromStorage,
  clearPlansFromStorage,
} from '@/hooks/useLocalStorage';
import { getDemoPlan } from '@/services/demoData';

describe('useLocalStorage utilities & hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('useLocalStorage hook', () => {
    it('returns initialValue when storage key is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>('test-key', 'initial')
      );
      expect(result.current[0]).toBe('initial');
    });

    it('persists and returns updated value', () => {
      const { result } = renderHook(() =>
        useLocalStorage<number>('counter-key', 10)
      );

      act(() => {
        result.current[1](25);
      });

      expect(result.current[0]).toBe(25);
      expect(JSON.parse(window.localStorage.getItem('counter-key') || '')).toBe(25);
    });

    it('supports functional updater pattern', () => {
      const { result } = renderHook(() =>
        useLocalStorage<number>('counter-key', 5)
      );

      act(() => {
        result.current[1]((prev) => prev + 15);
      });

      expect(result.current[0]).toBe(20);
    });

    it('gracefully handles JSON parse errors in localStorage', () => {
      window.localStorage.setItem('corrupted-key', 'not-valid-json{{');
      const { result } = renderHook(() =>
        useLocalStorage<string>('corrupted-key', 'safe-default')
      );
      expect(result.current[0]).toBe('safe-default');
    });
  });

  describe('savePlanToStorage & loadPlansFromStorage', () => {
    it('saves a plan and retrieves it via loadPlansFromStorage', () => {
      const demoPlan = getDemoPlan();
      savePlanToStorage(demoPlan);

      const loaded = loadPlansFromStorage();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe(demoPlan.id);
      expect(loaded[0].eventInput.theme).toBe(demoPlan.eventInput.theme);
    });

    it('updates an existing plan if saved again with same ID', () => {
      const demoPlan = getDemoPlan();
      savePlanToStorage(demoPlan);

      const updatedPlan = {
        ...demoPlan,
        eventInput: {
          ...demoPlan.eventInput,
          theme: 'Updated Theme Title',
        },
      };
      savePlanToStorage(updatedPlan);

      const loaded = loadPlansFromStorage();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].eventInput.theme).toBe('Updated Theme Title');
    });

    it('clears all plans via clearPlansFromStorage', () => {
      const demoPlan = getDemoPlan();
      savePlanToStorage(demoPlan);
      expect(loadPlansFromStorage()).toHaveLength(1);

      clearPlansFromStorage();
      expect(loadPlansFromStorage()).toHaveLength(0);
    });

    it('handles QuotaExceededError gracefully without throwing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const err = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw err;
      });

      const demoPlan = getDemoPlan();
      expect(() => savePlanToStorage(demoPlan)).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
