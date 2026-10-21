import { z } from 'zod';

// ===== Enums =====

/** Supported event types for AuraPlan AI planning. */
export type EventType = 'wedding' | 'birthday' | 'community';

/** Status of a task in the event timeline. */
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

/** Status of vendor engagement. */
export type VendorStatus = 'not-contacted' | 'contacted' | 'booked' | 'confirmed';

// ===== Interfaces =====

/** A single budget category with allocated, estimated, and actual amounts. */
export interface BudgetCategory {
  /** Name of the budget category (e.g., "Venue", "Catering"). */
  category: string;
  /** Amount allocated from the total budget. */
  allocated: number;
  /** Estimated cost for this category. */
  estimated: number;
  /** Actual amount spent. */
  actual: number;
  /** Additional notes about this budget category. */
  notes: string;
}

/** A milestone in the event planning timeline. */
export interface TimelineMilestone {
  /** Unique identifier for the milestone. */
  id: string;
  /** Title of the milestone. */
  title: string;
  /** Detailed description of what needs to be done. */
  description: string;
  /** Due date in ISO 8601 format (YYYY-MM-DD). */
  dueDate: string;
  /** Current status of the milestone. */
  status: TaskStatus;
  /** Priority level of the milestone. */
  priority: 'low' | 'medium' | 'high';
}

/** A vendor entry in the event plan. */
export interface VendorItem {
  /** Unique identifier for the vendor entry. */
  id: string;
  /** Vendor service category (e.g., "Photography", "Catering"). */
  category: string;
  /** Name of the vendor or business. */
  vendorName: string;
  /** Current engagement status with the vendor. */
  status: VendorStatus;
  /** Estimated cost for this vendor's services. */
  estimatedCost: number;
  /** Tips for negotiating with this type of vendor. */
  negotiationTips: string[];
  /** Questions to ask when vetting this vendor. */
  vettingQuestions: string[];
  /** Additional notes about this vendor. */
  notes: string;
  /** Contact information for the vendor. */
  contactInfo: string;
}

/** A theme idea for the event. */
export interface ThemeIdea {
  /** Title of the theme concept. */
  title: string;
  /** Detailed description of the theme. */
  description: string;
  /** Hex color codes for the suggested palette. */
  colorPalette: string[];
  /** Keywords describing the mood/atmosphere. */
  moodKeywords: string[];
}

/** A menu suggestion for the event. */
export interface MenuSuggestion {
  /** Category of menu items (e.g., "Appetizers", "Main Course"). */
  category: string;
  /** List of suggested menu items. */
  items: string[];
  /** Notes about dietary accommodations. */
  dietaryNotes: string;
}

/** A décor idea for a specific area of the event. */
export interface DecorIdea {
  /** Area or zone of the event (e.g., "Entrance", "Dance Floor"). */
  area: string;
  /** List of décor suggestions for this area. */
  suggestions: string[];
  /** Estimated cost for decorating this area. */
  estimatedCost: number;
}

/** Collection of creative ideas for the event. */
export interface IdeaBoard {
  /** Theme concepts and color palettes. */
  themeIdeas: ThemeIdea[];
  /** Menu and catering suggestions. */
  menuSuggestions: MenuSuggestion[];
  /** Décor ideas organized by area. */
  decorIdeas: DecorIdea[];
  /** Entertainment and activity suggestions. */
  entertainmentIdeas: string[];
}

/** Complete event plan with all planning data. */
export interface EventPlan {
  /** Unique identifier for the event plan. */
  id: string;
  /** ISO 8601 timestamp of when the plan was created. */
  createdAt: string;
  /** ISO 8601 timestamp of the last update. */
  updatedAt: string;
  /** Original user input that generated this plan. */
  eventInput: EventFormInput;
  /** Budget breakdown by category. */
  budget: BudgetCategory[];
  /** Planning timeline with milestones. */
  timeline: TimelineMilestone[];
  /** Vendor recommendations and tracking. */
  vendors: VendorItem[];
  /** Creative ideas board. */
  ideas: IdeaBoard;
}

/** User input from the event planning form. */
export interface EventFormInput {
  /** Type of event being planned. */
  eventType: EventType;
  /** Theme or style of the event. */
  theme: string;
  /** Expected number of guests. */
  guestCount: number;
  /** Total budget for the event in USD. */
  totalBudget: number;
  /** Date of the event in YYYY-MM-DD format. */
  eventDate: string;
  /** Venue or location for the event. */
  location: string;
  /** Dietary restrictions or preferences to consider. */
  dietaryPreferences: string;
  /** Cultural or religious considerations. */
  culturalPreferences: string;
}

/** A single message in the AI chat conversation. */
export interface ChatMessage {
  /** Unique identifier for the message. */
  id: string;
  /** Who sent the message. */
  role: 'user' | 'assistant';
  /** The message text content. */
  content: string;
  /** ISO 8601 timestamp of when the message was sent. */
  timestamp: string;
}

// ===== AI Response Schema =====

/** Structure of the AI-generated event plan response. */
export interface AIGeneratedPlan {
  /** Budget breakdown by category. */
  budget: BudgetCategory[];
  /** Planning timeline with milestones. */
  timeline: TimelineMilestone[];
  /** Vendor recommendations. */
  vendors: VendorItem[];
  /** Creative ideas board. */
  ideas: IdeaBoard;
}

// ===== Zod Schemas =====

/** Maximum allowed length for free-text string fields. */
export const MAX_STRING_LENGTH = 500;

/** Maximum allowed guest count. */
export const MAX_GUEST_COUNT = 10000;

/** Maximum allowed total budget in USD. */
export const MAX_BUDGET = 10000000;

/** Zod schema for validating the event planning form input. */
export const EventFormSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community']),
  theme: z
    .string()
    .min(1, 'Theme is required')
    .max(MAX_STRING_LENGTH, `Theme must be under ${MAX_STRING_LENGTH} characters`),
  guestCount: z
    .number()
    .int()
    .positive('Guest count must be positive')
    .max(MAX_GUEST_COUNT, `Guest count cannot exceed ${MAX_GUEST_COUNT}`),
  totalBudget: z
    .number()
    .positive('Budget must be positive')
    .max(MAX_BUDGET, `Budget cannot exceed $${MAX_BUDGET.toLocaleString()}`),
  eventDate: z
    .string()
    .min(1, 'Event date is required')
    .refine(
      (date) => {
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      },
      'Event date must be today or in the future'
    ),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(MAX_STRING_LENGTH, `Location must be under ${MAX_STRING_LENGTH} characters`),
  dietaryPreferences: z.string().max(MAX_STRING_LENGTH).default(''),
  culturalPreferences: z.string().max(MAX_STRING_LENGTH).default(''),
});

/** Zod schema for validating a single budget category. */
export const BudgetCategorySchema = z.object({
  category: z.string(),
  allocated: z.number().min(0),
  estimated: z.number().min(0),
  actual: z.number().min(0),
  notes: z.string(),
});

/** Zod schema for validating a timeline milestone. */
export const TimelineMilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
});

/** Zod schema for validating a vendor item. */
export const VendorItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  vendorName: z.string(),
  status: z.enum(['not-contacted', 'contacted', 'booked', 'confirmed']),
  estimatedCost: z.number().min(0),
  negotiationTips: z.array(z.string()),
  vettingQuestions: z.array(z.string()),
  notes: z.string(),
  contactInfo: z.string(),
});

/** Zod schema for validating a theme idea. */
export const ThemeIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  colorPalette: z.array(z.string()),
  moodKeywords: z.array(z.string()),
});

/** Zod schema for validating a menu suggestion. */
export const MenuSuggestionSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
  dietaryNotes: z.string(),
});

/** Zod schema for validating a décor idea. */
export const DecorIdeaSchema = z.object({
  area: z.string(),
  suggestions: z.array(z.string()),
  estimatedCost: z.number().min(0),
});

/** Zod schema for validating the complete idea board. */
export const IdeaBoardSchema = z.object({
  themeIdeas: z.array(ThemeIdeaSchema),
  menuSuggestions: z.array(MenuSuggestionSchema),
  decorIdeas: z.array(DecorIdeaSchema),
  entertainmentIdeas: z.array(z.string()),
});

/** Zod schema for validating the AI-generated plan response. */
export const AIGeneratedPlanSchema = z.object({
  budget: z.array(BudgetCategorySchema),
  timeline: z.array(TimelineMilestoneSchema),
  vendors: z.array(VendorItemSchema),
  ideas: IdeaBoardSchema,
});

// ===== App State =====

/** Top-level application view. */
export type AppView = 'form' | 'dashboard';

/** Available tabs in the dashboard view. */
export type DashboardTab = 'budget' | 'timeline' | 'vendors' | 'ideas' | 'export';

/** Global application state shape. */
export interface AppState {
  /** Current top-level view being displayed. */
  view: AppView;
  /** Currently active dashboard tab. */
  activeTab: DashboardTab;
  /** The event plan currently being viewed/edited. */
  currentPlan: EventPlan | null;
  /** All previously saved event plans. */
  savedPlans: EventPlan[];
  /** Whether the AI is currently generating a plan. */
  isGenerating: boolean;
  /** Current error message, if any. */
  error: string | null;
  /** User's Gemini API key. */
  apiKey: string;
  /** Chat conversation history with the AI assistant. */
  chatMessages: ChatMessage[];
}

/** All possible actions that can be dispatched to update application state. */
export type AppAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_TAB'; payload: DashboardTab }
  | { type: 'SET_PLAN'; payload: EventPlan }
  | { type: 'UPDATE_BUDGET'; payload: { index: number; updates: Partial<BudgetCategory> } }
  | { type: 'UPDATE_MILESTONE'; payload: { id: string; updates: Partial<TimelineMilestone> } }
  | { type: 'UPDATE_VENDOR'; payload: { id: string; updates: Partial<VendorItem> } }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SAVE_PLAN' }
  | { type: 'LOAD_PLAN'; payload: EventPlan }
  | { type: 'CLEAR_PLAN' }
  | { type: 'LOAD_SAVED_PLANS'; payload: EventPlan[] };
