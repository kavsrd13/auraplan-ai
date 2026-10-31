/**
 * Barrel export for all service modules.
 * Provides a single import point for AI integration and demo data services.
 *
 * @module services
 *
 * @example
 * ```ts
 * import { generateEventPlan, chatWithAI, getDemoPlan } from '@/services';
 * ```
 */

export {
  generateEventPlan,
  generateOfflineFallbackPlan,
  chatWithAI,
  clearPlanCache,
} from './aiService';

export { getDemoPlan } from './demoData';
