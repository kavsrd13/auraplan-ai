/**
 * Local storage persistence hooks and utilities for AuraPlan AI.
 *
 * Provides a React hook for syncing state with `localStorage`,
 * plus standalone helpers for saving, loading, and removing
 * event plans from browser storage.
 *
 * @module useLocalStorage
 */

import { useState, useCallback } from 'react';
import type { EventPlan } from '@/types/event';
import { STORAGE_KEYS } from '@/utils/constants';

/** Storage key for the array of saved event plans. */
const PLANS_STORAGE_KEY = STORAGE_KEYS.PLANS;

/**
 * Custom hook for persisting state to `localStorage` with JSON serialization.
 *
 * On mount, reads the stored value for `key` and parses it as JSON.
 * Falls back to `initialValue` if the key is missing, the JSON is invalid,
 * or `localStorage` is unavailable.
 *
 * The setter function accepts either a new value or an updater function
 * (like `useState`), writes the result to `localStorage`, and updates
 * the React state.
 *
 * @typeParam T - The type of the stored value.
 * @param key - The `localStorage` key to read from and write to.
 * @param initialValue - The default value when no stored data exists.
 * @returns A tuple of `[storedValue, setValue]`, matching the `useState` API.
 *
 * @example
 * ```tsx
 * const [apiKey, setApiKey] = useLocalStorage<string>('auraplan-api-key', '');
 *
 * // Update with a value
 * setApiKey('my-new-key');
 *
 * // Update with an updater function
 * setApiKey((prev) => prev + '-suffix');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item) as T;
    } catch {
      // Handle JSON parse errors or localStorage being unavailable
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prevValue) => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error: unknown) {
          // Handle quota exceeded or other storage errors
          if (
            error instanceof DOMException &&
            error.name === 'QuotaExceededError'
          ) {
            console.warn(
              `[useLocalStorage] Storage quota exceeded for key "${key}". Value was not persisted.`
            );
          } else {
            console.warn(
              `[useLocalStorage] Failed to write to localStorage for key "${key}":`,
              error
            );
          }
        }
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

/**
 * Saves an event plan to `localStorage`.
 *
 * If a plan with the same `id` already exists, it is replaced
 * with the updated version. Otherwise, the new plan is prepended
 * to the array so the most recent plan appears first.
 *
 * @param plan - The event plan to save.
 *
 * @example
 * ```ts
 * savePlanToStorage(myEventPlan);
 * ```
 */
export function savePlanToStorage(plan: EventPlan): void {
  try {
    const existing = loadPlansFromStorage();
    const index = existing.findIndex((p) => p.id === plan.id);

    if (index >= 0) {
      existing[index] = plan;
    } else {
      existing.unshift(plan);
    }

    window.localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(existing));
  } catch (error: unknown) {
    if (
      error instanceof DOMException &&
      error.name === 'QuotaExceededError'
    ) {
      console.warn(
        '[savePlanToStorage] Storage quota exceeded. Plan was not saved.'
      );
    } else {
      console.warn('[savePlanToStorage] Failed to save plan:', error);
    }
  }
}

/**
 * Loads all saved event plans from `localStorage`.
 *
 * Returns an empty array if no plans are stored, the stored
 * JSON is invalid, or `localStorage` is unavailable.
 *
 * @returns An array of previously saved event plans.
 *
 * @example
 * ```ts
 * const plans = loadPlansFromStorage();
 * console.log(`Found ${plans.length} saved plans.`);
 * ```
 */
export function loadPlansFromStorage(): EventPlan[] {
  try {
    const raw = window.localStorage.getItem(PLANS_STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as EventPlan[];
  } catch {
    return [];
  }
}

/**
 * Removes a single event plan from `localStorage` by its ID.
 *
 * If the plan ID is not found, this is a no-op.
 *
 * @param planId - The unique identifier of the plan to remove.
 *
 * @example
 * ```ts
 * removePlanFromStorage('abc-123');
 * ```
 */
export function removePlanFromStorage(planId: string): void {
  try {
    const existing = loadPlansFromStorage();
    const filtered = existing.filter((p) => p.id !== planId);
    window.localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error: unknown) {
    console.warn(
      `[removePlanFromStorage] Failed to remove plan "${planId}":`,
      error
    );
  }
}
