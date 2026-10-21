/**
 * Root Application component for AuraPlan AI.
 * Orchestrates views, state management, API key management modal,
 * and handles AI generation flows with abort controller protection.
 * Wrapped with ErrorBoundary for bulletproof fault isolation.
 *
 * @module App
 */

import React, { useState, useRef, useCallback } from 'react';
import { Layout } from './components/Layout';
import { EventForm } from './components/EventForm';
import { Dashboard } from './components/Dashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useEventPlan } from './hooks/useEventPlan';
import { generateEventPlan } from './services/aiService';
import { getDemoPlan } from './services/demoData';
import type { EventFormInput, EventPlan } from './types/event';
import { AlertCircle, X } from 'lucide-react';

/**
 * Main application orchestrator for AuraPlan AI.
 *
 * @returns Master React application tree with layout landmarks and modal overlays
 */
export const App: React.FC = () => {
  const {
    state,
    setPlan,
    setTab,
    updateBudget,
    updateMilestone,
    updateVendor,
    setGenerating,
    setError,
    setApiKey,
    addChatMessage,
    savePlan,
    clearPlan,
  } = useEventPlan();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGeneratePlan = useCallback(
    async (input: EventFormInput): Promise<void> => {
      // Abort previous in-flight request if present to conserve quota
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setGenerating(true);
      setError(null);

      try {
        const generated = await generateEventPlan(
          input,
          state.apiKey,
          abortControllerRef.current.signal
        );

        const now = new Date().toISOString();
        const newPlan: EventPlan = {
          id: `plan-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
          eventInput: input,
          budget: generated.budget,
          timeline: generated.timeline,
          vendors: generated.vendors,
          ideas: generated.ideas,
        };

        setPlan(newPlan);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        console.error('[App] Generation error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to generate event plan. Please check your network or try loading demo data.'
        );
      } finally {
        setGenerating(false);
      }
    },
    [state.apiKey, setGenerating, setError, setPlan]
  );

  const handleLoadDemo = useCallback((): void => {
    const demo = getDemoPlan();
    setPlan(demo);
  }, [setPlan]);

  const handleNewPlan = useCallback((): void => {
    clearPlan();
  }, [clearPlan]);

  const openApiKeyModal = useCallback((): void => {
    setIsApiKeyModalOpen(true);
  }, []);

  const closeApiKeyModal = useCallback((): void => {
    setIsApiKeyModalOpen(false);
  }, []);

  const dismissError = useCallback((): void => {
    setError(null);
  }, [setError]);

  return (
    <ErrorBoundary>
      <Layout
        view={state.view}
        hasPlan={!!state.currentPlan}
        apiKey={state.apiKey}
        eventTitle={state.currentPlan?.eventInput.theme}
        onOpenApiKeyModal={openApiKeyModal}
        onLoadDemo={handleLoadDemo}
        onNewPlan={handleNewPlan}
      >
        {/* Global Error Banner with aria-live */}
        <div aria-live="assertive">
          {state.error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center justify-between text-danger-900 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-danger-600 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
              <button
                type="button"
                onClick={dismissError}
                aria-label="Dismiss error"
                className="p-1 text-danger-500 hover:text-danger-800 rounded focus:outline-none focus:ring-2 focus:ring-danger-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Main View Router protected with ErrorBoundary */}
        <ErrorBoundary>
          {state.view === 'form' || !state.currentPlan ? (
            <EventForm
              onSubmit={handleGeneratePlan}
              onLoadDemo={handleLoadDemo}
              isGenerating={state.isGenerating}
            />
          ) : (
            <Dashboard
              plan={state.currentPlan}
              activeTab={state.activeTab}
              onTabChange={setTab}
              onUpdateBudget={updateBudget}
              onUpdateMilestone={updateMilestone}
              onUpdateVendor={updateVendor}
              onSavePlan={savePlan}
              apiKey={state.apiKey}
              chatMessages={state.chatMessages}
              onAddChatMessage={addChatMessage}
            />
          )}
        </ErrorBoundary>

        {/* API Key Modal */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={closeApiKeyModal}
          apiKey={state.apiKey}
          onSaveKey={setApiKey}
        />
      </Layout>
    </ErrorBoundary>
  );
};

App.displayName = 'App';

export default App;
