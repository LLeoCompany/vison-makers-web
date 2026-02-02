import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to detect user's reduced motion preference
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook for intersection observer based lazy loading
 */
export const useLazyLoad = (
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

/**
 * Hook for adaptive loading based on connection speed
 */
export const useAdaptiveLoading = () => {
  const [connectionType, setConnectionType] = useState<string>("4g");
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: {
        effectiveType: string;
        saveData: boolean;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      };
    }).connection;

    if (connection) {
      setConnectionType(connection.effectiveType);
      setSaveData(connection.saveData);

      const updateConnection = () => {
        setConnectionType(connection.effectiveType);
        setSaveData(connection.saveData);
      };

      connection.addEventListener("change", updateConnection);
      return () => connection.removeEventListener("change", updateConnection);
    }
  }, []);

  return {
    connectionType,
    saveData,
    shouldLoadHeavyAssets: connectionType === "4g" && !saveData,
    shouldReduceAnimations: connectionType === "2g" || connectionType === "slow-2g",
  };
};

/**
 * Hook for idle callback execution
 */
export const useIdleCallback = (
  callback: () => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(callback)
      : window.setTimeout(callback, 1);

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(id);
      } else {
        window.clearTimeout(id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * Hook for debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for RAF-throttled callback
 */
export const useRAFCallback = <T extends (...args: unknown[]) => void>(
  callback: T
): T => {
  const rafId = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      callbackRef.current(...args);
      rafId.current = null;
    });
  }, []) as T;
};

/**
 * Hook to preload images
 */
export const usePreloadImages = (srcs: string[]) => {
  useEffect(() => {
    const images = srcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      images.forEach((img) => {
        img.src = "";
      });
    };
  }, [srcs]);
};

/**
 * Hook for measuring component render performance
 */
export const useRenderPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Render] ${componentName}: #${renderCount.current} (${timeSinceLastRender.toFixed(2)}ms since last)`
      );
    }

    lastRenderTime.current = now;
  });
};
