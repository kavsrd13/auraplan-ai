/**
 * Debounce hooks for AuraPlan AI.
 *
 * Provides hooks for debouncing values and callbacks,
 * useful for search inputs, auto-save, and rate-limiting
 * expensive computations.
 *
 * @module useDebounce
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounces a value by the specified delay.
 * Returns the latest value only after the caller has stopped
 * changing it for `delay` milliseconds.
 *
 * Useful for search inputs and auto-save triggers where you want
 * to wait for the user to stop typing before acting.
 *
 * @typeParam T - The type of the value being debounced.
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value, updated only after the delay elapses.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This runs only after the user stops typing for 300ms
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Creates a debounced callback function that delays invocation
 * until after `delay` milliseconds have elapsed since the last call.
 *
 * The returned function is stable across renders (same reference)
 * and always calls the latest version of `callback` when it fires.
 *
 * @typeParam T - The function signature of the callback.
 * @param callback - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced version of the callback with the same signature.
 *
 * @example
 * ```tsx
 * const handleSave = useDebouncedCallback((data: PlanData) => {
 *   savePlanToStorage(data);
 * }, 500);
 *
 * // Call handleSave freely; the actual save runs 500ms after the last call.
 * handleSave(currentPlan);
 * ```
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always keep the ref up-to-date with the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [delay]
  );

  return debouncedFn;
}
