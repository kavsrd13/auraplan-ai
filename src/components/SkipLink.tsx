/**
 * Accessible skip navigation link.
 * Allows keyboard and screen reader users to bypass top navigation
 * directly to the main content area.
 *
 * @module SkipLink
 */

import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
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
