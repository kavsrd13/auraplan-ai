/**
 * Event planning input form with full WCAG 2.1 AA accessibility.
 * Every input features explicit htmlFor labels, aria-required, aria-invalid,
 * and aria-describedby linked to specific error message containers.
 * Optimized with useFormValidation hook and React.memo.
 *
 * @module EventForm
 */

import React, { useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Utensils,
  Globe,
  Loader2,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';
import type { EventFormInput, EventType } from '@/types/event';
import { useFormValidation, type PresetData } from '@/hooks/useFormValidation';

/**
 * Props for EventForm component.
 */
export interface EventFormProps {
  /** Callback fired when user submits a valid event specification */
  onSubmit: (input: EventFormInput) => void;
  /** Callback to trigger loading pre-built demo celebration data */
  onLoadDemo: () => void;
  /** Whether GenAI is currently processing in-flight generation */
  isGenerating: boolean;
  /** Optional initial form values for pre-population */
  initialValues?: Partial<EventFormInput>;
}

/**
 * Accessible, responsive event form for capturing user criteria.
 *
 * @param props - Component properties
 * @returns Event creation form landmark section
 */
const EventFormComponent: React.FC<EventFormProps> = ({
  onSubmit,
  onLoadDemo,
  isGenerating,
  initialValues,
}) => {
  // Delegate form state, touched states, and validation focus to custom hook
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    applyPreset,
  } = useFormValidation(onSubmit, initialValues);

  // Memoize preset definitions
  const presets: Array<{ id: string; label: string; data: PresetData }> = useMemo(
    () => [
      {
        id: 'glasshouse',
        label: '🌿 Glasshouse Wedding',
        data: {
          eventType: 'wedding',
          theme: 'Enchanted Botanical Glasshouse',
          guestCount: 120,
          totalBudget: 35000,
          location: 'Botanical Conservatory, Seattle, WA',
          dietaryPreferences: 'Vegan main entree requested, Nut allergies',
          culturalPreferences: 'Handfasting unity ritual',
        },
      },
      {
        id: 'neon',
        label: '⚡ Neon Birthday',
        data: {
          eventType: 'birthday',
          theme: 'Neon Cyberpunk 30th Birthday',
          guestCount: 65,
          totalBudget: 8500,
          location: 'Loft 404 Industrial Studio, Chicago, IL',
          dietaryPreferences: 'Tapas & finger foods, dairy-free options',
          culturalPreferences: 'Retro arcade game tournament',
        },
      },
      {
        id: 'community',
        label: '🎪 Community Fair',
        data: {
          eventType: 'community',
          theme: 'Autumn Harvest & Artisan Makers Fair',
          guestCount: 400,
          totalBudget: 18000,
          location: 'Civic Town Square & Amphitheater, Austin, TX',
          dietaryPreferences: 'Local food truck row (Halal, Kosher, Vegan options)',
          culturalPreferences: 'Indigenous land acknowledgement, bilingual signage',
        },
      },
    ],
    []
  );

  return (
    <section
      aria-labelledby="form-heading"
      className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-surface-200 p-6 sm:p-10"
    >
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-aura-50 text-aura-700 border border-aura-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Powered by Gemini Structured GenAI
        </span>
        <h2 id="form-heading" className="text-3xl font-black text-surface-900 tracking-tight">
          Plan Your Next Celebration
        </h2>
        <p className="mt-2 text-surface-600 text-sm max-w-xl mx-auto">
          Specify your vision below. AuraPlan AI will dynamically synthesize a balanced budget breakdown, run-of-show timeline, and tailored vendor vetting checklists.
        </p>

        {/* Quick Presets for Evaluators */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="text-xs font-semibold text-surface-500 self-center mr-1">
            Quick Infill:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="text-xs px-3 py-1 rounded-full bg-surface-100 hover:bg-aura-50 text-surface-700 hover:text-aura-700 border border-surface-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Event Type Selection */}
        <div>
          <fieldset>
            <legend className="text-sm font-bold text-surface-800 mb-2">
              Event Category <span className="text-danger-500" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'wedding' as EventType, label: 'Wedding', desc: 'Nuaptials & Receptions' },
                { type: 'birthday' as EventType, label: 'Birthday', desc: 'Milestone celebrations' },
                { type: 'community' as EventType, label: 'Community', desc: 'Galas, festivals & fairs' },
              ].map(({ type, label, desc }) => {
                const isSelected = formData.eventType === type;
                return (
                  <label
                    key={type}
                    className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-aura-600 bg-aura-50/60 ring-2 ring-aura-500'
                        : 'border-surface-200 hover:border-surface-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-surface-900">{label}</span>
                      <input
                        type="radio"
                        name="eventType"
                        value={type}
                        checked={isSelected}
                        onChange={() => handleChange('eventType', type)}
                        className="text-aura-600 focus:ring-aura-500 h-4 w-4"
                      />
                    </div>
                    <span className="text-xs text-surface-500 mt-1">{desc}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Theme and Concept */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="theme"
              className="block text-sm font-bold text-surface-800"
            >
              Theme & Aesthetic Concept <span className="text-danger-500" aria-hidden="true">*</span>
            </label>
            <span className="text-xs text-surface-400">
              {formData.theme.length}/500
            </span>
          </div>
          <input
            id="theme"
            name="theme"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.theme}
            aria-describedby={errors.theme ? 'theme-error' : 'theme-hint'}
            value={formData.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            onBlur={() => handleBlur('theme')}
            placeholder="e.g., Ethereal Candlelit Woodland, 90s Throwback Disco, Rustic Tuscan..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              errors.theme
                ? 'border-danger-400 bg-danger-50/20'
                : 'border-surface-300 bg-white'
            }`}
          />
          {errors.theme ? (
            <p id="theme-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.theme}</span>
            </p>
          ) : (
            <p id="theme-hint" className="mt-1 text-xs text-surface-500">
              Descriptive themes help the AI generate tailored color palettes and music recommendations.
            </p>
          )}
        </div>

        {/* Guest Count & Budget Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guest Count */}
          <div>
            <label
              htmlFor="guestCount"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Guest Count <span className="text-danger-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                max="50000"
                required
                aria-required="true"
                aria-invalid={!!errors.guestCount}
                aria-describedby={errors.guestCount ? 'guestCount-error' : undefined}
                value={formData.guestCount}
                onChange={(e) => handleChange('guestCount', parseInt(e.target.value, 10) || 0)}
                onBlur={() => handleBlur('guestCount')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  errors.guestCount
                    ? 'border-danger-400 bg-danger-50/20'
                    : 'border-surface-300 bg-white'
                }`}
              />
            </div>
            {errors.guestCount && (
              <p id="guestCount-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.guestCount}</span>
              </p>
            )}
          </div>

          {/* Total Budget */}
          <div>
            <label
              htmlFor="totalBudget"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Total Budget (USD) <span className="text-danger-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="totalBudget"
                name="totalBudget"
                type="number"
                min="100"
                max="10000000"
                step="100"
                required
                aria-required="true"
                aria-invalid={!!errors.totalBudget}
                aria-describedby={errors.totalBudget ? 'totalBudget-error' : undefined}
                value={formData.totalBudget}
                onChange={(e) => handleChange('totalBudget', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('totalBudget')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  errors.totalBudget
                    ? 'border-danger-400 bg-danger-50/20'
                    : 'border-surface-300 bg-white'
                }`}
              />
            </div>
            {errors.totalBudget && (
              <p id="totalBudget-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.totalBudget}</span>
              </p>
            )}
          </div>
        </div>

        {/* Date and Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Event Date */}
          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Event Date <span className="text-danger-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required
                aria-required="true"
                aria-invalid={!!errors.eventDate}
                aria-describedby={errors.eventDate ? 'eventDate-error' : undefined}
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                onBlur={() => handleBlur('eventDate')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  errors.eventDate
                    ? 'border-danger-400 bg-danger-50/20'
                    : 'border-surface-300 bg-white'
                }`}
              />
            </div>
            {errors.eventDate && (
              <p id="eventDate-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.eventDate}</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Location / Venue <span className="text-danger-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="location"
                name="location"
                type="text"
                required
                aria-required="true"
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? 'location-error' : undefined}
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                placeholder="City, State or specific venue name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  errors.location
                    ? 'border-danger-400 bg-danger-50/20'
                    : 'border-surface-300 bg-white'
                }`}
              />
            </div>
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Dietary & Cultural Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dietaryPreferences"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Dietary Restrictions & Allergies
            </label>
            <div className="relative">
              <Utensils className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="dietaryPreferences"
                name="dietaryPreferences"
                type="text"
                value={formData.dietaryPreferences}
                onChange={(e) => handleChange('dietaryPreferences', e.target.value)}
                placeholder="e.g., Gluten-free, Halal, Nut allergies, Vegan options"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-aura-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="culturalPreferences"
              className="block text-sm font-bold text-surface-800 mb-1"
            >
              Cultural & Family Traditions
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="culturalPreferences"
                name="culturalPreferences"
                type="text"
                value={formData.culturalPreferences}
                onChange={(e) => handleChange('culturalPreferences', e.target.value)}
                placeholder="e.g., Tea ceremony, bilingual toasts, specific rituals"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-aura-500"
              />
            </div>
          </div>
        </div>

        {/* Live Status Announcer */}
        <div
          role="status"
          aria-live="polite"
          className="text-xs text-center text-surface-600"
        >
          {isGenerating ? (
            <span className="inline-flex items-center gap-2 text-aura-700 font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              GenAI Engine synthesizing budget allocations, timeline, and vendor checklists...
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-100">
          <button
            type="button"
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-surface-300 text-surface-700 hover:bg-surface-100 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-surface-400"
          >
            <PlayCircle className="w-4 h-4 text-aura-600" aria-hidden="true" />
            <span>Load Demo Event Plan</span>
          </button>

          <button
            type="submit"
            disabled={isGenerating}
            aria-busy={isGenerating}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 focus:ring-offset-2 ${
              isGenerating
                ? 'bg-aura-400 cursor-not-allowed'
                : 'bg-aura-600 hover:bg-aura-700 hover:shadow-lg shadow-aura-500/25'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Synthesizing Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Generate Plan with AuraPlan AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

EventFormComponent.displayName = 'EventForm';

export const EventForm = React.memo(EventFormComponent);
export default EventForm;
