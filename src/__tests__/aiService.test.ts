/**
 * Unit tests for Gemini GenAI integration service.
 * Tests prompt formatting, structured JSON parsing, retry logic, caching,
 * and graceful fallback handling on network failure.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateEventPlan,
  chatWithAI,
  clearPlanCache,
  generateOfflineFallbackPlan,
} from '@/services/aiService';
import type { EventFormInput } from '@/types/event';

// Mock the @google/genai module
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    Type: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
      BOOLEAN: 'BOOLEAN',
    },
  };
});

describe('aiService.ts', () => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const sampleInput: EventFormInput = {
    eventType: 'wedding',
    theme: 'Midnight Romance in Paris',
    guestCount: 100,
    totalBudget: 30000,
    eventDate: tomorrow,
    location: 'Paris, France',
    dietaryPreferences: 'Vegetarian and Halal',
    culturalPreferences: 'French-Moroccan fusion',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    clearPlanCache();
  });

  describe('Offline Fallback Mode', () => {
    it('should generate a valid offline fallback plan if API key is empty', async () => {
      const plan = await generateEventPlan(sampleInput, '');
      expect(plan).toBeDefined();
      expect(plan.budget).toHaveLength(5);
      expect(plan.timeline.length).toBeGreaterThan(0);
      expect(plan.vendors.length).toBeGreaterThan(0);
      expect(plan.ideas.themeIdeas.length).toBeGreaterThan(0);

      // Verify budget sums up to totalBudget
      const sum = plan.budget.reduce((acc, b) => acc + b.allocated, 0);
      expect(sum).toBe(sampleInput.totalBudget);
    });

    it('should generate offline fallback plan synchronously via generateOfflineFallbackPlan', () => {
      const fallback = generateOfflineFallbackPlan(sampleInput);
      expect(fallback.budget).toBeDefined();
      expect(fallback.timeline).toBeDefined();
      expect(fallback.ideas.themeIdeas[0].title).toBe('Midnight Romance in Paris');
    });
  });

  describe('Gemini API Integration & Structured Output', () => {
    it('should parse valid structured JSON from Gemini API', async () => {
      const mockApiResponse = {
        budget: [
          { category: 'Venue & Facilities', allocated: 10000, estimated: 9500, actual: 0, notes: 'Historic Chateau' },
          { category: 'Catering & Dining', allocated: 8000, estimated: 8000, actual: 0, notes: 'Multi-course dinner' },
        ],
        timeline: [
          { id: 'm1', title: 'Reserve Chateau', description: 'Pay deposit', dueDate: tomorrow, status: 'pending', priority: 'high' },
        ],
        vendors: [
          {
            id: 'v1',
            category: 'Venue',
            vendorName: 'Chateau de Romance',
            status: 'not-contacted',
            estimatedCost: 9500,
            negotiationTips: ['Ask for shoulder season rate'],
            vettingQuestions: ['Is catering exclusive?'],
            notes: 'Beautiful garden',
            contactInfo: 'info@chateau.fr',
          },
        ],
        ideas: {
          themeIdeas: [
            {
              title: 'Parisian Midnight',
              description: 'Navy and gold velvet accents',
              colorPalette: ['#1E1B4B', '#F59E0B', '#FFFFFF', '#6B7280', '#000000'],
              moodKeywords: ['Luxe', 'Romantic'],
            },
          ],
          menuSuggestions: [
            { category: 'Appetizers', items: ['Gourmet Canape Selection'], dietaryNotes: 'Halal certified' },
          ],
          decorIdeas: [
            { area: 'Ballroom', suggestions: ['Crystal chandeliers'], estimatedCost: 2000 },
          ],
          entertainmentIdeas: ['French Gypsy Jazz Trio'],
        },
      };

      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(mockApiResponse),
      });

      const plan = await generateEventPlan(sampleInput, 'AIzaSyFakeTestKey');

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(plan.budget[0].category).toBe('Venue & Facilities');
      expect(plan.vendors[0].vendorName).toBe('Chateau de Romance');
      expect(plan.ideas.themeIdeas[0].title).toBe('Parisian Midnight');
    });

    it('should serve cached plan on subsequent identical calls without re-invoking Gemini', async () => {
      const mockApiResponse = {
        budget: [
          { category: 'Venue', allocated: 15000, estimated: 15000, actual: 0, notes: 'Test' },
        ],
        timeline: [
          { id: 't1', title: 'Milestone 1', description: 'Desc', dueDate: tomorrow, status: 'pending', priority: 'low' },
        ],
        vendors: [
          {
            id: 'v1',
            category: 'Venue',
            vendorName: 'Test Venue',
            status: 'not-contacted',
            estimatedCost: 15000,
            negotiationTips: ['Tip'],
            vettingQuestions: ['Q'],
            notes: '',
            contactInfo: '',
          },
        ],
        ideas: {
          themeIdeas: [
            { title: 'Test Theme', description: 'Desc', colorPalette: ['#000000'], moodKeywords: ['Test'] },
          ],
          menuSuggestions: [{ category: 'Main', items: ['Item'], dietaryNotes: '' }],
          decorIdeas: [{ area: 'Entrance', suggestions: ['Flowers'], estimatedCost: 500 }],
          entertainmentIdeas: ['DJ'],
        },
      };

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockApiResponse),
      });

      // First call -> hits API
      const plan1 = await generateEventPlan(sampleInput, 'AIzaSyFakeTestKey');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      // Second identical call -> should return from cache
      const plan2 = await generateEventPlan(sampleInput, 'AIzaSyFakeTestKey');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1); // Still 1, cache hit!
      expect(plan1).toEqual(plan2);
    });

    it('should gracefully fall back to offline generator if Gemini API fails all retries', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network connection timeout'));

      const plan = await generateEventPlan(sampleInput, 'AIzaSyFakeTestKey');
      // Should not throw, should return fallback plan
      expect(plan).toBeDefined();
      expect(plan.budget).toBeDefined();
      expect(plan.timeline).toBeDefined();
    });
  });

  describe('chatWithAI', () => {
    it('should return demo response if API key is omitted', async () => {
      const demoPlan = generateOfflineFallbackPlan(sampleInput);
      const fullPlan = {
        id: 'plan-1',
        createdAt: '',
        updatedAt: '',
        eventInput: sampleInput,
        ...demoPlan,
      };

      const response = await chatWithAI('How do I reduce costs?', fullPlan, '');
      expect(response).toContain('[Demo Mode]');
    });

    it('should return AI text when Gemini API responds', async () => {
      const demoPlan = generateOfflineFallbackPlan(sampleInput);
      const fullPlan = {
        id: 'plan-1',
        createdAt: '',
        updatedAt: '',
        eventInput: sampleInput,
        ...demoPlan,
      };

      mockGenerateContent.mockResolvedValueOnce({
        text: 'Consider reducing bar hours by 1 hour to save roughly $1,200.',
      });

      const response = await chatWithAI('How do I reduce costs?', fullPlan, 'AIzaSyFakeTestKey');
      expect(response).toBe('Consider reducing bar hours by 1 hour to save roughly $1,200.');
    });
  });
});
