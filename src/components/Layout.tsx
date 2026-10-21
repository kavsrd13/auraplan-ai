/**
 * Main application layout component conforming to semantic HTML5 landmarks.
 * Provides accessible scaffolding with header, main, footer, skip link, and
 * accessibility preferences toolbar.
 *
 * @module Layout
 */

import React from 'react';
import { Sparkles, Calendar, Key, PlayCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import { SkipLink } from './SkipLink';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import type { AppView } from '@/types/event';

/**
 * Props for the Layout component.
 */
export interface LayoutProps {
  /** Page or modal content nested inside the layout landmark */
  children: React.ReactNode;
  /** Active primary application view mode ('form' or 'dashboard') */
  view: AppView;
  /** Whether an active event plan is currently loaded in state */
  hasPlan?: boolean;
  /** Active Gemini API key string or empty */
  apiKey: string;
  /** Handler invoked to open API key configuration dialog */
  onOpenApiKeyModal: () => void;
  /** Handler to load sample demonstration event data */
  onLoadDemo: () => void;
  /** Handler to start a fresh event planning session */
  onNewPlan: () => void;
  /** Optional title of the currently loaded plan for header display */
  eventTitle?: string;
}

/**
 * Semantic layout container wrapping the entire AuraPlan application.
 *
 * @param props - Component properties
 * @returns Landmark-rich layout hierarchy
 */
const LayoutComponent: React.FC<LayoutProps> = ({
  children,
  view,
  apiKey,
  onOpenApiKeyModal,
  onLoadDemo,
  onNewPlan,
  eventTitle,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 font-sans antialiased selection:bg-aura-200 selection:text-aura-900">
      <SkipLink />
      <AccessibilityToolbar />

      {/* Semantic Landmark: HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-aura-600 via-aura-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-aura-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-surface-900 flex items-center gap-2">
                  <span>AuraPlan</span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-bold tracking-wider uppercase bg-aura-100 text-aura-800 border border-aura-200">
                    AI Co-Planner
                  </span>
                </h1>
                <p className="text-xs text-surface-500 hidden sm:block">
                  Next-Gen Celebration & Event Planning Architecture
                </p>
              </div>
            </div>

            {/* Current Event Pill if viewing dashboard */}
            {view === 'dashboard' && eventTitle && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface-100 rounded-full border border-surface-200 text-xs font-semibold text-surface-700">
                <Calendar className="w-3.5 h-3.5 text-aura-600" aria-hidden="true" />
                <span className="max-w-xs truncate">{eventTitle}</span>
              </div>
            )}

            {/* Global Actions Navigation */}
            <nav aria-label="Global application actions" className="flex items-center gap-2.5">
              {view === 'dashboard' && (
                <button
                  type="button"
                  onClick={onNewPlan}
                  aria-label="Create new event plan"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-surface-700 hover:text-surface-900 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-aura-500"
                >
                  <PlusCircle className="w-4 h-4 text-aura-600" aria-hidden="true" />
                  <span className="hidden sm:inline">New Plan</span>
                </button>
              )}

              <button
                type="button"
                onClick={onLoadDemo}
                aria-label="Load demo event plan"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-aura-700 hover:text-aura-800 bg-aura-50 hover:bg-aura-100 border border-aura-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-aura-500"
              >
                <PlayCircle className="w-4 h-4 text-aura-600" aria-hidden="true" />
                <span>Load Demo Event</span>
              </button>

              <button
                type="button"
                onClick={onOpenApiKeyModal}
                aria-label="Configure Gemini API Key"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  apiKey
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Key className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {apiKey ? 'API Key Active' : 'Configure API Key'}
                </span>
                {apiKey && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Semantic Landmark: MAIN */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Semantic Landmark: FOOTER */}
      <footer className="bg-white border-t border-surface-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-surface-700">AuraPlan AI</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Google GenAI (@google/genai)</span>
          </div>
          <div>
            Built with strict TypeScript, Tailwind CSS & Vitest. Total bundle &lt; 10 MB.
          </div>
        </div>
      </footer>
    </div>
  );
};

LayoutComponent.displayName = 'Layout';

export const Layout = React.memo(LayoutComponent);
export default Layout;
