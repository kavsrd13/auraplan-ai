/**
 * Validation utilities for AuraPlan AI.
 *
 * Provides wrapper functions around Zod schemas and standalone
 * validation helpers for common data formats used throughout the app.
 *
 * @module validation
 */

import {
  EventFormSchema,
  AIGeneratedPlanSchema,
} from '@/types/event';
import type { EventFormInput, AIGeneratedPlan } from '@/types/event';

/**
 * Result of validating the event planning form input.
 * On success, contains the parsed and validated data.
 * On failure, contains a map of field names to error messages.
 */
interface EventFormValidationResult {
  /** Whether validation succeeded. */
  success: boolean;
  /** The validated and parsed form data (present only on success). */
  data?: EventFormInput;
  /** Map of field names to error messages (present only on failure). */
  errors?: Record<string, string>;
}

/**
 * Result of validating an AI-generated plan response.
 * On success, contains the parsed and validated plan.
 * On failure, contains an array of error messages.
 */
interface AIResponseValidationResult {
  /** Whether validation succeeded. */
  success: boolean;
  /** The validated AI-generated plan (present only on success). */
  data?: AIGeneratedPlan;
  /** Array of error messages (present only on failure). */
  errors?: string[];
}

/**
 * Validates event planning form input against the `EventFormSchema`.
 * Extracts field-level error messages for easy integration with form UI.
 *
 * @param data - The unknown form data to validate.
 * @returns A validation result with either the parsed data or field-level errors.
 *
 * @example
 * ```ts
 * const result = validateEventForm({
 *   eventType: 'wedding',
 *   theme: 'Rustic Garden',
 *   guestCount: 150,
 *   totalBudget: 25000,
 *   eventDate: '2027-06-15',
 *   location: 'Central Park',
 *   dietaryPreferences: '',
 *   culturalPreferences: '',
 * });
 *
 * if (result.success) {
 *   console.log(result.data); // EventFormInput
 * } else {
 *   console.log(result.errors); // { guestCount: 'Guest count must be positive' }
 * }
 * ```
 */
export function validateEventForm(data: unknown): EventFormValidationResult {
  const result = EventFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data as EventFormInput };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path.join('.');
    // Only keep the first error per field for cleaner UX
    if (!errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }

  return { success: false, errors };
}

/**
 * Validates an AI-generated plan response against the `AIGeneratedPlanSchema`.
 * Used to ensure the AI output conforms to the expected structure before
 * integrating it into the application state.
 *
 * @param data - The unknown AI response data to validate.
 * @returns A validation result with either the parsed plan or an array of error messages.
 *
 * @example
 * ```ts
 * const aiResponse = JSON.parse(responseText);
 * const result = validateAIResponse(aiResponse);
 *
 * if (result.success) {
 *   dispatch({ type: 'SET_PLAN', payload: result.data });
 * } else {
 *   console.error('Invalid AI response:', result.errors);
 * }
 * ```
 */
export function validateAIResponse(data: unknown): AIResponseValidationResult {
  const result = AIGeneratedPlanSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data as AIGeneratedPlan };
  }

  const errors = result.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`
  );

  return { success: false, errors };
}

/**
 * Validates whether a string is a valid CSS hex color code.
 * Supports 3-digit (#RGB), 4-digit (#RGBA), 6-digit (#RRGGBB),
 * and 8-digit (#RRGGBBAA) formats.
 *
 * @param color - The string to validate as a hex color.
 * @returns `true` if the string is a valid hex color code.
 *
 * @example
 * ```ts
 * isValidHexColor('#ff5733');  // => true
 * isValidHexColor('#f53');     // => true
 * isValidHexColor('#ff573399'); // => true (with alpha)
 * isValidHexColor('red');      // => false
 * isValidHexColor('#xyz');     // => false
 * ```
 */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
}

/**
 * Validates whether a string can be parsed as a valid date.
 * Checks that the string is parseable by the `Date` constructor
 * and does not produce `NaN`.
 *
 * @param dateString - The string to validate as a date.
 * @returns `true` if the string is a valid, parseable date.
 *
 * @example
 * ```ts
 * isValidDate('2026-12-25');     // => true
 * isValidDate('Dec 25, 2026');   // => true
 * isValidDate('not-a-date');     // => false
 * isValidDate('');               // => false
 * ```
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString || dateString.trim().length === 0) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates whether a string is a valid HTTP or HTTPS URL.
 * Uses the `URL` constructor for robust parsing and validation.
 *
 * @param url - The string to validate as a URL.
 * @returns `true` if the string is a valid HTTP or HTTPS URL.
 *
 * @example
 * ```ts
 * isValidUrl('https://example.com');       // => true
 * isValidUrl('http://localhost:3000');      // => true
 * isValidUrl('ftp://files.example.com');   // => false (not http/https)
 * isValidUrl('not a url');                 // => false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
