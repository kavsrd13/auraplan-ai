import { describe, it, expect } from 'vitest';
import { appReducer, initialAppState } from '@/hooks/useEventPlan';
import { getDemoPlan } from '@/services/demoData';
import type { AppState, ChatMessage } from '@/types/event';
import { DASHBOARD_TABS } from '@/utils/constants';

describe('useEventPlan appReducer', () => {
  const baseState: AppState = {
    ...initialAppState,
  };

  it('updates view correctly with SET_VIEW', () => {
    const nextState = appReducer(baseState, {
      type: 'SET_VIEW',
      payload: 'dashboard',
    });
    expect(nextState.view).toBe('dashboard');
  });

  it('updates active tab with SET_TAB', () => {
    const nextState = appReducer(baseState, {
      type: 'SET_TAB',
      payload: DASHBOARD_TABS.TIMELINE,
    });
    expect(nextState.activeTab).toBe(DASHBOARD_TABS.TIMELINE);
  });

  it('sets current plan and navigates to dashboard with SET_PLAN', () => {
    const demoPlan = getDemoPlan();
    const nextState = appReducer(baseState, {
      type: 'SET_PLAN',
      payload: demoPlan,
    });
    expect(nextState.currentPlan).toEqual(demoPlan);
    expect(nextState.view).toBe('dashboard');
    expect(nextState.error).toBeNull();
  });

  it('updates budget item with UPDATE_BUDGET', () => {
    const demoPlan = getDemoPlan();
    const loadedState: AppState = {
      ...baseState,
      currentPlan: demoPlan,
    };

    const nextState = appReducer(loadedState, {
      type: 'UPDATE_BUDGET',
      payload: { index: 0, updates: { actual: 9999, notes: 'Updated notes' } },
    });

    expect(nextState.currentPlan?.budget[0].actual).toBe(9999);
    expect(nextState.currentPlan?.budget[0].notes).toBe('Updated notes');
  });

  it('updates milestone item with UPDATE_MILESTONE', () => {
    const demoPlan = getDemoPlan();
    const loadedState: AppState = {
      ...baseState,
      currentPlan: demoPlan,
    };
    const firstMilestoneId = demoPlan.timeline[0].id;

    const nextState = appReducer(loadedState, {
      type: 'UPDATE_MILESTONE',
      payload: { id: firstMilestoneId, updates: { status: 'in-progress' } },
    });

    const updated = nextState.currentPlan?.timeline.find((m) => m.id === firstMilestoneId);
    expect(updated?.status).toBe('in-progress');
  });

  it('updates vendor item with UPDATE_VENDOR', () => {
    const demoPlan = getDemoPlan();
    const loadedState: AppState = {
      ...baseState,
      currentPlan: demoPlan,
    };
    const firstVendorId = demoPlan.vendors[0].id;

    const nextState = appReducer(loadedState, {
      type: 'UPDATE_VENDOR',
      payload: { id: firstVendorId, updates: { status: 'booked', notes: 'Contract verified' } },
    });

    const updated = nextState.currentPlan?.vendors.find((v) => v.id === firstVendorId);
    expect(updated?.status).toBe('booked');
    expect(updated?.notes).toBe('Contract verified');
  });

  it('toggles isGenerating flag with SET_GENERATING', () => {
    const generatingState = appReducer(baseState, {
      type: 'SET_GENERATING',
      payload: true,
    });
    expect(generatingState.isGenerating).toBe(true);

    const stoppedState = appReducer(generatingState, {
      type: 'SET_GENERATING',
      payload: false,
    });
    expect(stoppedState.isGenerating).toBe(false);
  });

  it('records error message with SET_ERROR', () => {
    const nextState = appReducer(baseState, {
      type: 'SET_ERROR',
      payload: 'Gemini rate limit reached',
    });
    expect(nextState.error).toBe('Gemini rate limit reached');
  });

  it('persists apiKey with SET_API_KEY', () => {
    const nextState = appReducer(baseState, {
      type: 'SET_API_KEY',
      payload: 'AIzaSyTestKey12345',
    });
    expect(nextState.apiKey).toBe('AIzaSyTestKey12345');
  });

  it('appends chat message with ADD_CHAT_MESSAGE', () => {
    const testMsg: ChatMessage = {
      id: 'msg-1',
      role: 'user',
      content: 'Can we optimize flowers budget?',
      timestamp: new Date().toISOString(),
    };
    const nextState = appReducer(baseState, {
      type: 'ADD_CHAT_MESSAGE',
      payload: testMsg,
    });
    expect(nextState.chatMessages).toHaveLength(1);
    expect(nextState.chatMessages[0].content).toBe('Can we optimize flowers budget?');
  });

  it('clears plan and returns to form view with CLEAR_PLAN', () => {
    const demoPlan = getDemoPlan();
    const loadedState: AppState = {
      ...baseState,
      currentPlan: demoPlan,
      view: 'dashboard',
    };

    const clearedState = appReducer(loadedState, {
      type: 'CLEAR_PLAN',
    });

    expect(clearedState.currentPlan).toBeNull();
    expect(clearedState.view).toBe('form');
  });
});
