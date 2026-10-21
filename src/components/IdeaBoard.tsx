/**
 * Personalized Ideas & Concept Board component.
 * Custom theme concepts, color palettes with interactive CSS color swatches,
 * menu suggestions with dietary accommodation notes, decor areas, and entertainment.
 * Optimized with useCallback and React.memo.
 *
 * @module IdeaBoard
 */

import React, { useState, useCallback } from 'react';
import {
  Palette,
  UtensilsCrossed,
  Sparkles,
  Music,
  Check,
  Copy,
  Layers,
} from 'lucide-react';
import type { IdeaBoard as IdeaBoardType } from '@/types/event';
import { formatCurrency } from '@/utils/calculations';

/**
 * Props for IdeaBoard component.
 */
export interface IdeaBoardProps {
  /** Complete creative ideas object including themes, palettes, menus, and decor */
  ideas: IdeaBoardType;
}

/**
 * Interactive Idea Board presenting generative creative concepts and color swatches.
 *
 * @param props - Component properties
 * @returns Concept board layout with copy-to-clipboard swatches
 */
const IdeaBoardComponent: React.FC<IdeaBoardProps> = ({ ideas }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = useCallback((hex: string): void => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Themes and Color Palettes Section */}
      <section aria-labelledby="themes-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-aura-600" aria-hidden="true" />
          <h3 id="themes-heading" className="text-xl font-black text-surface-900 tracking-tight">
            Curated Themes & Color Palettes
          </h3>
        </div>
        <p className="text-xs text-surface-500">
          Click any color swatch to copy its hexadecimal code to your clipboard.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ideas.themeIdeas.map((theme, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-surface-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h4 className="font-extrabold text-base text-surface-900 mb-2">
                  {theme.title}
                </h4>
                <p className="text-xs text-surface-600 leading-relaxed mb-4">
                  {theme.description}
                </p>

                {/* Mood Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {theme.moodKeywords.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-100 text-surface-600"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <span className="text-[11px] font-bold text-surface-500 uppercase tracking-wider block mb-2">
                  Color Swatches
                </span>
                <div className="flex items-center gap-2">
                  {theme.colorPalette.map((hex, cIdx) => {
                    const isCopied = copiedColor === hex;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => copyToClipboard(hex)}
                        title={`Copy ${hex}`}
                        aria-label={`Copy color ${hex} to clipboard`}
                        className="group relative flex-1 h-12 rounded-xl shadow-inner transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-aura-500"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="sr-only">Color {hex}</span>
                        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl text-white transition-opacity">
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {copiedColor && (
                  <p className="mt-2 text-[11px] text-emerald-600 font-semibold text-center">
                    Copied {copiedColor} to clipboard!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culinary & Menu Ideas */}
      <section aria-labelledby="menu-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-aura-600" aria-hidden="true" />
          <h3 id="menu-heading" className="text-xl font-black text-surface-900 tracking-tight">
            Culinary Concepts & Menu Suggestions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ideas.menuSuggestions.map((menu, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-surface-200 p-5 shadow-xs"
            >
              <h4 className="font-extrabold text-base text-surface-900 mb-3 pb-2 border-b border-surface-100 flex items-center justify-between">
                <span>{menu.category}</span>
                <span className="text-xs font-semibold text-aura-700 bg-aura-50 px-2.5 py-0.5 rounded-full">
                  {menu.items.length} items
                </span>
              </h4>
              <ul className="space-y-2 text-xs text-surface-700 mb-4">
                {menu.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-aura-600 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {menu.dietaryNotes && (
                <div className="p-3 bg-surface-50 rounded-xl text-[11px] text-surface-600 border border-surface-100">
                  <span className="font-bold text-surface-800">Dietary Note: </span>
                  {menu.dietaryNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Decor & Area Concepts */}
      <section aria-labelledby="decor-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-aura-600" aria-hidden="true" />
          <h3 id="decor-heading" className="text-xl font-black text-surface-900 tracking-tight">
            Spatial & Decor Styling Concepts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ideas.decorIdeas.map((decor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-surface-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-surface-900">{decor.area}</span>
                  <span className="text-xs font-black text-aura-700">
                    ~{formatCurrency(decor.estimatedCost)}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-surface-600 mt-3">
                  {decor.suggestions.map((sug, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-surface-400 mt-1.5 flex-shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Entertainment Ideas */}
      <section aria-labelledby="entertainment-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-aura-600" aria-hidden="true" />
          <h3 id="entertainment-heading" className="text-xl font-black text-surface-900 tracking-tight">
            Curated Entertainment & Guest Experiences
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-xs">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-surface-700">
            {ideas.entertainmentIdeas.map((ent, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100"
              >
                <Sparkles className="w-4 h-4 text-aura-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">{ent}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

IdeaBoardComponent.displayName = 'IdeaBoard';

export const IdeaBoard = React.memo(IdeaBoardComponent);
export default IdeaBoard;
