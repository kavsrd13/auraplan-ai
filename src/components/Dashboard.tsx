/**
 * Main Event Planning Dashboard container.
 * Coordinates all tabs (Budget, Timeline, Vendors, Ideas, Export)
 * and embeds the interactive AI Co-Planner refinement chat panel.
 *
 * @module Dashboard
 */

import React, { Suspense } from 'react';
import {
  DollarSign,
  Calendar,
  Store,
  Sparkles,
  Download,
  MapPin,
  Users,
} from 'lucide-react';
import type {
  EventPlan,
  DashboardTab,
  BudgetCategory,
  TimelineMilestone,
  VendorItem,
  ChatMessage,
} from '@/types/event';
import { TabGroup, type TabItem } from './ui/TabGroup';
import { BudgetTracker } from './BudgetTracker';
import { TimelineView } from './TimelineView';
import { VendorChecklist } from './VendorChecklist';
import { IdeaBoard } from './IdeaBoard';
import { ExportPanel } from './ExportPanel';
import { AIChatPanel } from './AIChatPanel';
import { SkeletonLoader } from './SkeletonLoader';
import { formatCurrency } from '@/utils/calculations';

interface DashboardProps {
  plan: EventPlan;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onUpdateBudget: (index: number, updates: Partial<BudgetCategory>) => void;
  onUpdateMilestone: (id: string, updates: Partial<TimelineMilestone>) => void;
  onUpdateVendor: (id: string, updates: Partial<VendorItem>) => void;
  onSavePlan: () => void;
  apiKey: string;
  chatMessages: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  plan,
  activeTab,
  onTabChange,
  onUpdateBudget,
  onUpdateMilestone,
  onUpdateVendor,
  onSavePlan,
  apiKey,
  chatMessages,
  onAddChatMessage,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'budget',
      label: 'Budget Breakdown',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'timeline',
      label: 'Timeline & Schedule',
      icon: <Calendar className="w-4 h-4" />,
      badge: plan.timeline.length,
    },
    {
      id: 'vendors',
      label: 'Vendor Checklist',
      icon: <Store className="w-4 h-4" />,
      badge: plan.vendors.length,
    },
    {
      id: 'ideas',
      label: 'Ideas & Palettes',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'export',
      label: 'Export & Share',
      icon: <Download className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="bg-gradient-to-r from-surface-900 via-aura-950 to-surface-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-aura-500/20 text-aura-300 border border-aura-400/30">
              {plan.eventInput.eventType.toUpperCase()}
            </span>
            <span className="text-xs text-surface-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {plan.eventInput.eventDate}
            </span>
            <span className="text-xs text-surface-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {plan.eventInput.location}
            </span>
            <span className="text-xs text-surface-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {plan.eventInput.guestCount} Guests
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {plan.eventInput.theme}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-surface-300">
            <div>
              <span className="text-surface-400 block text-[10px] uppercase font-bold">
                Total Budget
              </span>
              <span className="text-base font-extrabold text-white">
                {formatCurrency(plan.eventInput.totalBudget)}
              </span>
            </div>
            {plan.eventInput.dietaryPreferences && (
              <div className="max-w-xs truncate">
                <span className="text-surface-400 block text-[10px] uppercase font-bold">
                  Dietary
                </span>
                <span className="text-white truncate block">
                  {plan.eventInput.dietaryPreferences}
                </span>
              </div>
            )}
            {plan.eventInput.culturalPreferences && (
              <div className="max-w-xs truncate">
                <span className="text-surface-400 block text-[10px] uppercase font-bold">
                  Cultural / Traditions
                </span>
                <span className="text-white truncate block">
                  {plan.eventInput.culturalPreferences}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs Content (Left/Center) + AI Co-Planner Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tabs Navigation & Panels */}
        <div className="lg:col-span-2 space-y-6">
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => onTabChange(id as DashboardTab)}
            ariaLabel="Event planning dashboard sections"
          />

          {/* Accessible Tab Panels */}
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="focus:outline-none focus:ring-1 focus:ring-aura-400 rounded-2xl"
          >
            <Suspense fallback={<SkeletonLoader type={activeTab === 'export' ? 'general' : activeTab} />}>
              {activeTab === 'budget' && (
                <BudgetTracker
                  totalBudget={plan.eventInput.totalBudget}
                  budget={plan.budget}
                  onUpdateCategory={onUpdateBudget}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineView
                  timeline={plan.timeline}
                  eventDate={plan.eventInput.eventDate}
                  onUpdateMilestone={onUpdateMilestone}
                />
              )}

              {activeTab === 'vendors' && (
                <VendorChecklist
                  vendors={plan.vendors}
                  onUpdateVendor={onUpdateVendor}
                />
              )}

              {activeTab === 'ideas' && <IdeaBoard ideas={plan.ideas} />}

              {activeTab === 'export' && (
                <ExportPanel plan={plan} onSavePlan={onSavePlan} />
              )}
            </Suspense>
          </div>
        </div>

        {/* Right Column: AI Co-Planner Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <AIChatPanel
              currentPlan={plan}
              apiKey={apiKey}
              messages={chatMessages}
              onAddMessage={onAddChatMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
