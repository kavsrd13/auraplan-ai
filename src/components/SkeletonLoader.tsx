/**
 * Skeleton loading placeholders for dashboard tabs and heavy UI sections.
 * Provides accessible, animated loading states with aria-busy="true" and aria-live="polite".
 * Supports distinct structural layouts matching Budget, Timeline, Vendor, and Idea tabs.
 *
 * @module SkeletonLoader
 */

import React from 'react';

/**
 * Supported structural skeleton loader layout variants.
 */
export type SkeletonType = 'budget' | 'timeline' | 'vendors' | 'ideas' | 'general';

/**
 * Props for the SkeletonLoader component.
 */
export interface SkeletonLoaderProps {
  /** Layout structure variant to display */
  type?: SkeletonType;
}

/**
 * Accessible SkeletonLoader component.
 *
 * @param props - Component properties
 * @returns Animated pulse skeleton placeholder
 */
const SkeletonLoaderComponent: React.FC<SkeletonLoaderProps> = ({ type = 'general' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="w-full space-y-4 animate-pulse"
    >
      <span className="sr-only">Loading content, please wait...</span>

      {type === 'budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-surface-200 rounded-xl p-4">
                <div className="h-4 bg-surface-300 rounded w-1/3 mb-3"></div>
                <div className="h-8 bg-surface-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-surface-100 rounded-xl p-4 border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-1/4 mb-2"></div>
                <div className="h-2.5 bg-surface-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'timeline' && (
        <div className="space-y-4 pl-4 border-l-2 border-surface-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 pb-6">
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
              <div className="h-6 bg-surface-200 rounded w-1/2"></div>
              <div className="h-4 bg-surface-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {type === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-surface-100 rounded-xl p-5 border border-surface-200 space-y-3">
              <div className="h-5 bg-surface-300 rounded w-1/3"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              <div className="h-16 bg-surface-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {type === 'ideas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-surface-100 rounded-xl p-4 border border-surface-200 space-y-3">
                <div className="h-5 bg-surface-300 rounded w-2/3"></div>
                <div className="h-12 bg-surface-200 rounded w-full"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((c) => (
                    <div key={c} className="h-8 w-8 rounded-full bg-surface-300"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'general' && (
        <div className="space-y-4 p-6 bg-surface-50 rounded-xl">
          <div className="h-6 bg-surface-300 rounded w-1/3"></div>
          <div className="h-4 bg-surface-200 rounded w-2/3"></div>
          <div className="h-4 bg-surface-200 rounded w-1/2"></div>
        </div>
      )}
    </div>
  );
};

SkeletonLoaderComponent.displayName = 'SkeletonLoader';

export const SkeletonLoader = React.memo(SkeletonLoaderComponent);
export default SkeletonLoader;
