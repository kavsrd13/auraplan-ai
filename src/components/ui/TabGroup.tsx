/**
 * Accessible TabGroup component following WAI-ARIA Tabs pattern.
 * Supports ArrowLeft, ArrowRight, Home, and End keyboard navigation,
 * aria-selected, aria-controls, and proper tabIndex management.
 * Optimized with React.memo.
 *
 * @module TabGroup
 */

import React, { useRef, useCallback } from 'react';

/**
 * Definition of an individual navigation tab item.
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Human-readable tab title */
  label: string;
  /** Optional SVG icon element */
  icon?: React.ReactNode;
  /** Optional badge count or status string */
  badge?: number | string;
}

/**
 * Props for the TabGroup component.
 */
export interface TabGroupProps {
  /** Array of tab definitions */
  tabs: TabItem[];
  /** Identifier of the currently active tab */
  activeTab: string;
  /** Callback fired when a tab is selected */
  onTabChange: (tabId: string) => void;
  /** Accessible label describing the navigation group */
  ariaLabel: string;
}

/**
 * Accessible TabGroup navigation bar with arrow keyboard navigation.
 *
 * @param props - Component properties
 * @returns Tablist navigation container element
 */
const TabGroupComponent: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number): void => {
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
        const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        buttons?.[newIndex]?.focus();
      }
    },
    [tabs, onTabChange]
  );

  return (
    <nav aria-label={ariaLabel}>
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
    </nav>
  );
};

TabGroupComponent.displayName = 'TabGroup';

export const TabGroup = React.memo(TabGroupComponent);
export default TabGroup;
