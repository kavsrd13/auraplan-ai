/**
 * Main application state reducer and hook for AuraPlan AI.
 * Manages global application state including event plan data,
 * interactive edits, API generation progress, chat history, and persistence.
 *
 * @module useEventPlan
 */

import { useReducer, useCallback, useMemo, useEffect } from 'react';
import type {
  AppState,
  AppAction,
  AppView,
  DashboardTab,
  EventPlan,
  BudgetCategory,
  TimelineMilestone,
  VendorItem,
  ChatMessage,
} from '@/types/event';
import {
  calculateTotalAllocated,
  calculateTotalActual,
  isOverBudget as checkIsOverBudget,
  getOverBudgetCategories,
  sortTimelineByDate,
} from '@/utils/calculations';
import {
  MILESTONE_STATUS,
  VENDOR_STATUS,
} from '@/utils/constants';
import {
  loadPlansFromStorage,
  savePlanToStorage,
} from '@/hooks/useLocalStorage';

/**
 * Reducer function managing the state transitions of AuraPlan AI.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_PLAN': {
      const plan = action.payload;
      return {
        ...state,
        currentPlan: plan,
        view: 'dashboard',
        error: null,
      };
    }

    case 'UPDATE_BUDGET': {
      if (!state.currentPlan) return state;
      const { index, updates } = action.payload;
      const updatedBudget = state.currentPlan.budget.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      );
      const updatedPlan: EventPlan = {
        ...state.currentPlan,
        budget: updatedBudget,
        updatedAt: new Date().toISOString(),
      };
      savePlanToStorage(updatedPlan);
      return {
        ...state,
        currentPlan: updatedPlan,
      };
    }

    case 'UPDATE_MILESTONE': {
      if (!state.currentPlan) return state;
      const { id, updates } = action.payload;
      const updatedTimeline = state.currentPlan.timeline.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      const updatedPlan: EventPlan = {
        ...state.currentPlan,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString(),
      };
      savePlanToStorage(updatedPlan);
      return {
        ...state,
        currentPlan: updatedPlan,
      };
    }

    case 'UPDATE_VENDOR': {
      if (!state.currentPlan) return state;
      const { id, updates } = action.payload;
      const updatedVendors = state.currentPlan.vendors.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      const updatedPlan: EventPlan = {
        ...state.currentPlan,
        vendors: updatedVendors,
        updatedAt: new Date().toISOString(),
      };
      savePlanToStorage(updatedPlan);
      return {
        ...state,
        currentPlan: updatedPlan,
      };
    }

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };

    case 'SAVE_PLAN': {
      if (!state.currentPlan) return state;
      savePlanToStorage(state.currentPlan);
      const existingIndex = state.savedPlans.findIndex(
        (p) => p.id === state.currentPlan?.id
      );
      const updatedSaved =
        existingIndex >= 0
          ? state.savedPlans.map((p, i) =>
              i === existingIndex ? state.currentPlan! : p
            )
          : [state.currentPlan, ...state.savedPlans];
      return { ...state, savedPlans: updatedSaved };
    }

    case 'LOAD_PLAN':
      return {
        ...state,
        currentPlan: action.payload,
        view: 'dashboard',
        error: null,
      };

    case 'CLEAR_PLAN':
      return {
        ...state,
        currentPlan: null,
        view: 'form',
        activeTab: 'budget',
        error: null,
      };

    case 'LOAD_SAVED_PLANS':
      return { ...state, savedPlans: action.payload };

    default:
      return state;
  }
}

/** Initial state for the AuraPlan application. */
export const initialAppState: AppState = {
  view: 'form',
  activeTab: 'budget',
  currentPlan: null,
  savedPlans: [],
  isGenerating: false,
  error: null,
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '',
  chatMessages: [],
};

/**
 * Custom hook providing structured access to AuraPlan AI state and memoized computations.
 */
export function useEventPlan(initialOverride?: Partial<AppState>) {
  const [state, dispatch] = useReducer(
    appReducer,
    { ...initialAppState, ...initialOverride }
  );

  // Load saved plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = loadPlansFromStorage();
      if (stored && stored.length > 0) {
        dispatch({ type: 'LOAD_SAVED_PLANS', payload: stored });
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  // Memoized derived calculations
  const totalAllocated = useMemo(() => {
    return state.currentPlan?.budget
      ? calculateTotalAllocated(state.currentPlan.budget)
      : 0;
  }, [state.currentPlan?.budget]);

  const totalActual = useMemo(() => {
    return state.currentPlan?.budget
      ? calculateTotalActual(state.currentPlan.budget)
      : 0;
  }, [state.currentPlan?.budget]);

  const isOverBudget = useMemo(() => {
    if (!state.currentPlan) return false;
    return checkIsOverBudget(
      state.currentPlan.eventInput.totalBudget,
      state.currentPlan.budget
    );
  }, [state.currentPlan]);

  const overBudgetCategories = useMemo(() => {
    return state.currentPlan?.budget
      ? getOverBudgetCategories(state.currentPlan.budget)
      : [];
  }, [state.currentPlan?.budget]);

  const sortedTimeline = useMemo(() => {
    return state.currentPlan?.timeline
      ? sortTimelineByDate(state.currentPlan.timeline)
      : [];
  }, [state.currentPlan?.timeline]);

  const completedMilestonesCount = useMemo(() => {
    return (
      state.currentPlan?.timeline.filter((m) => m.status === MILESTONE_STATUS.COMPLETED)
        .length || 0
    );
  }, [state.currentPlan?.timeline]);

  const bookedVendorsCount = useMemo(() => {
    return (
      state.currentPlan?.vendors.filter(
        (v) => v.status === VENDOR_STATUS.BOOKED || v.status === VENDOR_STATUS.CONFIRMED
      ).length || 0
    );
  }, [state.currentPlan?.vendors]);

  // Action dispatchers
  const setView = useCallback(
    (view: AppView) => dispatch({ type: 'SET_VIEW', payload: view }),
    []
  );

  const setTab = useCallback(
    (tab: DashboardTab) => dispatch({ type: 'SET_TAB', payload: tab }),
    []
  );

  const setPlan = useCallback(
    (plan: EventPlan) => dispatch({ type: 'SET_PLAN', payload: plan }),
    []
  );

  const updateBudget = useCallback(
    (index: number, updates: Partial<BudgetCategory>) =>
      dispatch({ type: 'UPDATE_BUDGET', payload: { index, updates } }),
    []
  );

  const updateMilestone = useCallback(
    (id: string, updates: Partial<TimelineMilestone>) =>
      dispatch({ type: 'UPDATE_MILESTONE', payload: { id, updates } }),
    []
  );

  const updateVendor = useCallback(
    (id: string, updates: Partial<VendorItem>) =>
      dispatch({ type: 'UPDATE_VENDOR', payload: { id, updates } }),
    []
  );

  const setGenerating = useCallback(
    (isGenerating: boolean) =>
      dispatch({ type: 'SET_GENERATING', payload: isGenerating }),
    []
  );

  const setError = useCallback(
    (error: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    []
  );

  const setApiKey = useCallback(
    (apiKey: string) => dispatch({ type: 'SET_API_KEY', payload: apiKey }),
    []
  );

  const addChatMessage = useCallback(
    (message: ChatMessage) =>
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message }),
    []
  );

  const savePlan = useCallback(() => dispatch({ type: 'SAVE_PLAN' }), []);

  const loadPlan = useCallback(
    (plan: EventPlan) => dispatch({ type: 'LOAD_PLAN', payload: plan }),
    []
  );

  const clearPlan = useCallback(() => dispatch({ type: 'CLEAR_PLAN' }), []);

  return {
    state,
    dispatch,
    // Memoized values
    totalAllocated,
    totalActual,
    isOverBudget,
    overBudgetCategories,
    sortedTimeline,
    completedMilestonesCount,
    bookedVendorsCount,
    // Dispatchers
    setView,
    setTab,
    setPlan,
    updateBudget,
    updateMilestone,
    updateVendor,
    setGenerating,
    setError,
    setApiKey,
    addChatMessage,
    savePlan,
    loadPlan,
    clearPlan,
  };
}
