/**
 * Accessible skip navigation link.
 * Allows keyboard and screen reader users to bypass top navigation
 * directly to the main landmark content area.
 * Meets WCAG 2.1 AA criterion 2.4.1 (Bypass Blocks).
 *
 * @module SkipLink
 */

import React from 'react';

/**
 * Props for the SkipLink component.
 */
export interface SkipLinkProps {
  /** Target HTML ID of the primary content landmark (default: 'main-content') */
  targetId?: string;
  /** Accessible label displayed when link receives keyboard focus */
  label?: string;
}

/**
 * SkipLink component that remains visually hidden until focused via Tab.
 *
 * @param props - Component properties
 * @returns Skip anchor element
 */
const SkipLinkComponent: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-aura-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-aura-400 focus:ring-offset-2 font-medium text-sm transition-all"
    >
      {label}
    </a>
  );
};

SkipLinkComponent.displayName = 'SkipLink';

export const SkipLink = React.memo(SkipLinkComponent);
export default SkipLink;
