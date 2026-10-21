/**
 * Accessibility preferences toolbar conforming to WCAG 2.1 AA specifications.
 * Provides interactive toggles for high contrast mode and dynamic font scaling,
 * allowing users with low vision or cognitive differences to customize readability.
 * Memoized with React.memo.
 *
 * @module AccessibilityToolbar
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Type, Sparkles } from 'lucide-react';

/**
 * Text size scaling options for accessibility preferences.
 */
export type TextScaleOption = 'normal' | 'large' | 'larger';

/**
 * Accessible toolbar component rendering controls for visual adjustments.
 *
 * @returns Accessibility settings banner landmark
 */
const AccessibilityToolbarComponent: React.FC = () => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<TextScaleOption>('normal');

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-lg-mode', 'text-xl-mode');
    if (textSize === 'large') {
      root.classList.add('text-lg-mode');
    } else if (textSize === 'larger') {
      root.classList.add('text-xl-mode');
    }
  }, [textSize]);

  const toggleContrast = useCallback((): void => {
    setHighContrast((prev) => !prev);
  }, []);

  const cycleTextSize = useCallback((): void => {
    setTextSize((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'larger';
      return 'normal';
    });
  }, []);

  return (
    <aside
      aria-label="Accessibility settings"
      className="bg-surface-900 text-white text-xs py-1.5 px-4 flex items-center justify-between border-b border-surface-800"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-aura-300" aria-hidden="true" />
        <span className="font-medium tracking-wide">AuraPlan Accessibility Tools</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleContrast}
          aria-pressed={highContrast}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-aura-400 ${
            highContrast ? 'bg-aura-500 text-white font-bold' : 'bg-surface-800 hover:bg-surface-700 text-surface-200'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Contrast: {highContrast ? 'High' : 'Normal'}</span>
        </button>

        <button
          type="button"
          onClick={cycleTextSize}
          aria-label={`Current text scale: ${textSize}. Click to change.`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-200 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-400"
          title="Adjust Text Scale"
        >
          <Type className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Size: {textSize}</span>
        </button>
      </div>
    </aside>
  );
};

AccessibilityToolbarComponent.displayName = 'AccessibilityToolbar';

export const AccessibilityToolbar = React.memo(AccessibilityToolbarComponent);
export default AccessibilityToolbar;
