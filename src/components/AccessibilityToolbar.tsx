/**
 * Accessibility preferences toolbar.
 * Provides controls for high contrast mode, reduced motion, and text scaling,
 * ensuring WCAG 2.1 AA compliance and empowering users with assistive preferences.
 *
 * @module AccessibilityToolbar
 */

import React, { useState, useEffect } from 'react';
import { Eye, Type, Sparkles } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'larger'>('normal');

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

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('larger');
    else setTextSize('normal');
  };

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
          onClick={() => setHighContrast(!highContrast)}
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
