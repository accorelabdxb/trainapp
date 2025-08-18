import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  componentName: string;
  renderTime?: number;
  mountTime?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>();
  const renderStartRef = useRef<number>();

  useEffect(() => {
    // Component mounted
    mountTimeRef.current = Date.now();

    return () => {
      // Component unmounted
      if (mountTimeRef.current) {
        const mountDuration = Date.now() - mountTimeRef.current;
        if (__DEV__) {
          console.log(
            `[Performance] ${componentName} was mounted for ${mountDuration}ms`
          );
        }
      }
    };
  }, [componentName]);

  const startRender = () => {
    renderStartRef.current = Date.now();
  };

  const endRender = () => {
    if (renderStartRef.current) {
      const renderTime = Date.now() - renderStartRef.current;
      if (__DEV__ && renderTime > 16) {
        // Log if render takes more than 16ms (60fps threshold)
        console.warn(
          `[Performance] ${componentName} render took ${renderTime}ms`
        );
      }
    }
  };

  return { startRender, endRender };
};
