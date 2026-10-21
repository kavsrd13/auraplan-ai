import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '@/hooks/useFormValidation';
import type { EventFormInput } from '@/types/event';

describe('useFormValidation hook', () => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const validData: EventFormInput = {
    eventType: 'wedding',
    theme: 'Vintage Botanical Greenhouse Wedding',
    guestCount: 150,
    totalBudget: 40000,
    eventDate: tomorrow,
    location: 'Emerald Glasshouse, Portland, OR',
    dietaryPreferences: 'Vegan, GF',
    culturalPreferences: 'Handfasting unity knot',
  };

  it('initializes with default values and empty errors', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormValidation(onSubmit));

    expect(result.current.formData.eventType).toBe('wedding');
    expect(result.current.formData.guestCount).toBe(100);
    expect(result.current.formData.totalBudget).toBe(25000);
    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  it('updates field value via handleChange', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormValidation(onSubmit));

    act(() => {
      result.current.handleChange('theme', 'Neon Cyberpunk 40th');
      result.current.handleChange('guestCount', 75);
    });

    expect(result.current.formData.theme).toBe('Neon Cyberpunk 40th');
    expect(result.current.formData.guestCount).toBe(75);
  });

  it('validates and applies errors on handleBlur', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormValidation(onSubmit));

    act(() => {
      result.current.handleChange('theme', 'A'); // Too short
      result.current.handleBlur('theme');
    });

    expect(result.current.touched.theme).toBe(true);
    expect(result.current.errors.theme).toBeDefined();
    expect(result.current.hasErrors).toBe(true);
  });

  it('applies preset data directly via applyPreset', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormValidation(onSubmit));

    act(() => {
      result.current.applyPreset({
        eventType: 'birthday',
        theme: 'Neon 90s Throwback',
        guestCount: 50,
        totalBudget: 5000,
        location: 'Arcade Loft, NY',
        dietaryPreferences: 'Pizza, Nut allergy',
        culturalPreferences: 'Retro karaoke',
      });
    });

    expect(result.current.formData.eventType).toBe('birthday');
    expect(result.current.formData.theme).toBe('Neon 90s Throwback');
    expect(result.current.formData.guestCount).toBe(50);
    expect(result.current.formData.totalBudget).toBe(5000);
    expect(result.current.errors).toEqual({});
  });

  it('calls onSubmit with valid form data upon handleSubmit', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormValidation(onSubmit, validData));

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      result.current.handleSubmit(mockEvent);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      theme: 'Vintage Botanical Greenhouse Wedding',
      guestCount: 150,
      totalBudget: 40000,
    }));
  });

  it('rejects submission with negative budget and populates errors', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormValidation(onSubmit, {
        ...validData,
        totalBudget: -500,
      })
    );

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      result.current.handleSubmit(mockEvent);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.totalBudget).toBeDefined();
  });
});
