/**
 * Dynamic import utilities for code splitting
 * This allows screens to be loaded on-demand, reducing initial bundle size
 */

// Lazy load heavy screens/components
export const lazyLoadScreen = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};

// Example usage:
// const HeavyScreen = lazyLoadScreen(() => import('../screens/HeavyScreen'));
