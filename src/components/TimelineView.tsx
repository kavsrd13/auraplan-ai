/**
 * Chronological Timeline & Run-of-Show component.
 * Features milestone countdowns, day-of hourly schedules, status toggles,
 * priority indicators, and filter controls.
 * Optimized with useMemo, useCallback, and React.memo.
 *
 * @module TimelineView
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { TimelineMilestone, TaskStatus } from '@/types/event';
import { Badge } from './ui/Badge';
import { calculateDaysUntil } from '@/utils/calculations';
import { MILESTONE_STATUS } from '@/utils/constants';

/**
 * Props for TimelineView component.
 */
export interface TimelineViewProps {
  /** List of chronologically sorted milestones */
  timeline: TimelineMilestone[];
  /** Target event date string in ISO format (YYYY-MM-DD) */
  eventDate: string;
  /** Callback to update a milestone by ID */
  onUpdateMilestone: (id: string, updates: Partial<TimelineMilestone>) => void;
}

/**
 * Interactive Timeline & Schedule view.
 *
 * @param props - Component properties
 * @returns Milestone tracker UI with filtering and status transitions
 */
const TimelineViewComponent: React.FC<TimelineViewProps> = ({
  timeline,
  eventDate,
  onUpdateMilestone,
}) => {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  // Memoize counts to avoid recomputing on unrelated re-renders
  const totalCount = timeline.length;

  const completedCount = useMemo(
    () => timeline.filter((m) => m.status === MILESTONE_STATUS.COMPLETED).length,
    [timeline]
  );

  const inProgressCount = useMemo(
    () => timeline.filter((m) => m.status === MILESTONE_STATUS.IN_PROGRESS).length,
    [timeline]
  );

  const pendingCount = useMemo(
    () => timeline.filter((m) => m.status === MILESTONE_STATUS.PENDING).length,
    [timeline]
  );

  const completionPercent = useMemo(
    () => (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0),
    [totalCount, completedCount]
  );

  // Memoize filtered items
  const filteredTimeline = useMemo(() => {
    if (filterStatus === 'all') return timeline;
    return timeline.filter((item) => item.status === filterStatus);
  }, [timeline, filterStatus]);

  const daysToEvent = useMemo(() => calculateDaysUntil(eventDate), [eventDate]);

  const cycleStatus = useCallback(
    (milestone: TimelineMilestone): void => {
      const nextStatus: Record<TaskStatus, TaskStatus> = {
        pending: 'in-progress',
        'in-progress': 'completed',
        completed: 'pending',
      };
      onUpdateMilestone(milestone.id, { status: nextStatus[milestone.status] });
    },
    [onUpdateMilestone]
  );

  const getPriorityBadge = useCallback((priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger" size="sm">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'low':
      default:
        return <Badge variant="neutral" size="sm">Low</Badge>;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Timeline Header & Countdown */}
      <div className="p-6 bg-white rounded-2xl border border-surface-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-aura-600 block mb-1">
            Chronological Run-of-Show
          </span>
          <h3 className="text-xl font-black text-surface-900 tracking-tight">
            Planning Milestones & Day-of Schedule
          </h3>
          <p className="text-xs text-surface-500 mt-1">
            Click any status pill to advance from Pending → In Progress → Completed.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface-50 p-4 rounded-xl border border-surface-200">
          <div className="text-center px-3 border-r border-surface-200">
            <span className="text-xs text-surface-500 uppercase font-bold block">Countdown</span>
            <span className="text-2xl font-black text-aura-700">
              {daysToEvent > 0 ? `${daysToEvent}d` : daysToEvent === 0 ? 'Today!' : 'Passed'}
            </span>
          </div>
          <div className="text-center px-3">
            <span className="text-xs text-surface-500 uppercase font-bold block">Progress</span>
            <span className="text-2xl font-black text-emerald-600">{completionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface-100 rounded-xl border border-surface-200">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              filterStatus === 'all'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              filterStatus === 'pending'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('in-progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              filterStatus === 'in-progress'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              filterStatus === 'completed'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="text-xs text-surface-500">
          Showing {filteredTimeline.length} of {totalCount} items
        </div>
      </div>

      {/* Chronological Milestone List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-aura-200 space-y-6">
        {filteredTimeline.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-surface-200">
            <CheckCircle2 className="w-8 h-8 text-surface-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-surface-700">No milestones match this filter.</p>
          </div>
        ) : (
          filteredTimeline.map((milestone) => {
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in-progress';
            const daysUntil = calculateDaysUntil(milestone.dueDate);

            return (
              <div
                key={milestone.id}
                className={`relative group bg-white p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-surface-200 bg-surface-50/50 opacity-85'
                    : isInProgress
                    ? 'border-aura-300 ring-1 ring-aura-200 shadow-xs'
                    : 'border-surface-200 hover:border-surface-300 shadow-xs'
                }`}
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 border-white text-white'
                      : isInProgress
                      ? 'bg-aura-600 border-white text-white animate-pulse'
                      : 'bg-white border-surface-300 text-surface-400'
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-base font-bold text-surface-900 ${
                          isCompleted ? 'line-through text-surface-500' : ''
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      {getPriorityBadge(milestone.priority)}
                    </div>
                    <p className="text-xs text-surface-600 leading-relaxed max-w-2xl">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Status Toggle Button */}
                  <div className="flex items-center gap-3 sm:self-start">
                    <button
                      type="button"
                      onClick={() => cycleStatus(milestone)}
                      aria-label={`Current status: ${milestone.status}. Click to cycle status.`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : isInProgress
                          ? 'bg-aura-100 text-aura-800 hover:bg-aura-200'
                          : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5" />}
                      {isInProgress && <Clock className="w-3.5 h-3.5" />}
                      {milestone.status === 'pending' && <RotateCcw className="w-3.5 h-3.5" />}
                      <span className="capitalize">{milestone.status.replace('-', ' ')}</span>
                    </button>
                  </div>
                </div>

                {/* Due Date & Countdown Footer */}
                <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-surface-400" aria-hidden="true" />
                    <span>Target Date: {milestone.dueDate}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      daysUntil < 0
                        ? 'text-danger-600'
                        : daysUntil <= 7
                        ? 'text-amber-600'
                        : 'text-surface-500'
                    }`}
                  >
                    {daysUntil > 0
                      ? `${daysUntil} days left`
                      : daysUntil === 0
                      ? 'Due Today'
                      : `${Math.abs(daysUntil)} days overdue`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

TimelineViewComponent.displayName = 'TimelineView';

export const TimelineView = React.memo(TimelineViewComponent);
export default TimelineView;
