/**
 * Accessible TabGroup component following WAI-ARIA Tabs pattern.
 * Supports ArrowLeft, ArrowRight, Home, and End keyboard navigation.
 *
 * @module TabGroup
 */

import React, { useRef } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  ariaLabel: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[newIndex];
    if (nextTab) {
      onTabChange(nextTab.id);
      // Focus newly selected tab element
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[newIndex]?.focus();
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2 border-b border-surface-200 pb-2 mb-6"
    >
      {tabs.map((tab, index) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 focus:ring-offset-1 ${
              isSelected
                ? 'bg-aura-600 text-white shadow-sm'
                : 'text-surface-700 hover:text-surface-900 hover:bg-surface-100'
            }`}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-aura-700 text-white'
                    : 'bg-surface-200 text-surface-800'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
