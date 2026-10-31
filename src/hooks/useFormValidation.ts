/**
 * Custom React hook for managing event creation form state, validation lifecycle,
 * accessibility error focus management, and quick preset application.
 *
 * @module useFormValidation
 */

import { useState, useCallback, useMemo } from 'react';
import type { EventFormInput, EventType } from '@/types/event';
import { validateEventForm } from '@/utils/validation';
import { TIME_CONSTANTS, FORM_DEFAULTS } from '@/utils/constants';

export interface PresetData {
  eventType: EventType;
  theme: string;
  guestCount: number;
  totalBudget: number;
  location: string;
  dietaryPreferences: string;
  culturalPreferences: string;
}

export interface UseFormValidationReturn {
  /** Current form values */
  formData: EventFormInput;
  /** Active validation errors mapped by field name */
  errors: Record<string, string>;
  /** Map of touched fields */
  touched: Record<string, boolean>;
  /** Update handler for a specific field */
  handleChange: (field: keyof EventFormInput, value: string | number) => void;
  /** Blur handler validating field on exit */
  handleBlur: (field: keyof EventFormInput) => void;
  /** Form submission handler with validation and accessibility focus */
  handleSubmit: (e: React.FormEvent) => void;
  /** Applies preset data directly to the form */
  applyPreset: (preset: PresetData) => void;
  /** Manually sets form data */
  setFormData: React.Dispatch<React.SetStateAction<EventFormInput>>;
  /** Helper indicating whether form has any current errors */
  hasErrors: boolean;
}

/**
 * Hook to manage form state and validation for event planning input.
 *
 * @param onSubmit - Callback invoked with validated EventFormInput upon valid submission
 * @param initialValues - Optional partial initial values
 * @returns Form state, errors, touched status, and event handlers
 *
 * @example
 * ```tsx
 * const { formData, errors, touched, handleChange, handleBlur, handleSubmit } =
 *   useFormValidation(onSubmit, initialValues);
 * ```
 */
export function useFormValidation(
  onSubmit: (input: EventFormInput) => void,
  initialValues?: Partial<EventFormInput>
): UseFormValidationReturn {
  // Calculate tomorrow's date using named time constant to avoid magic number
  const tomorrow = useMemo((): string => {
    return new Date(Date.now() + TIME_CONSTANTS.MS_PER_DAY).toISOString().split('T')[0];
  }, []);

  const [formData, setFormData] = useState<EventFormInput>({
    eventType: initialValues?.eventType || FORM_DEFAULTS.EVENT_TYPE,
    theme: initialValues?.theme || '',
    guestCount: initialValues?.guestCount || FORM_DEFAULTS.GUEST_COUNT,
    totalBudget: initialValues?.totalBudget || FORM_DEFAULTS.TOTAL_BUDGET,
    eventDate: initialValues?.eventDate || tomorrow,
    location: initialValues?.location || '',
    dietaryPreferences: initialValues?.dietaryPreferences || '',
    culturalPreferences: initialValues?.culturalPreferences || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (field: keyof EventFormInput, value: string | number): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        setErrors((prev) => {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof EventFormInput): void => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const result = validateEventForm(formData);
      if (!result.success && result.errors && result.errors[field]) {
        const fieldError = result.errors[field];
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    },
    [formData]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      const result = validateEventForm(formData);
      if (!result.success && result.errors) {
        setErrors(result.errors);
        const allTouched: Record<string, boolean> = {};
        Object.keys(formData).forEach((k) => {
          allTouched[k] = true;
        });
        setTouched(allTouched);

        // Shift focus to the first erroneous input element for WCAG compliance
        const firstErrorKey = Object.keys(result.errors)[0];
        if (firstErrorKey) {
          const element = document.getElementById(firstErrorKey);
          element?.focus();
        }
        return;
      }

      if (result.data) {
        setErrors({});
        onSubmit(result.data);
      }
    },
    [formData, onSubmit]
  );

  const applyPreset = useCallback((preset: PresetData): void => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
    setErrors({});
  }, []);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    applyPreset,
    setFormData,
    hasErrors,
  };
}

export default useFormValidation;
