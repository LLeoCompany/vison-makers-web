/**
 * Performance Optimization Utilities
 * Target: LCP < 2.5s, CLS < 0.1, TTI < 3s
 */

// Intersection Observer for lazy loading
export const createLazyObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null => {
  if (typeof window === "undefined") return null;

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical images
export const preloadImage = (src: string, priority: "high" | "low" = "low") => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  if (priority === "high") {
    link.setAttribute("fetchpriority", "high");
  }
  document.head.appendChild(link);
};

// Preload critical resources
export const preloadResources = (resources: { href: string; as: string }[]) => {
  if (typeof window === "undefined") return;

  resources.forEach(({ href, as }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

// Defer non-critical CSS
export const loadDeferredStyles = (href: string) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.media = "print";
  link.onload = () => {
    link.media = "all";
  };
  document.head.appendChild(link);
};

// Request Idle Callback polyfill
export const requestIdleCallback =
  typeof window !== "undefined"
    ? window.requestIdleCallback ||
      ((cb: IdleRequestCallback) => setTimeout(cb, 1))
    : (cb: IdleRequestCallback) => setTimeout(cb, 1);

// Cancel Idle Callback polyfill
export const cancelIdleCallback =
  typeof window !== "undefined"
    ? window.cancelIdleCallback || clearTimeout
    : clearTimeout;

// Debounce for scroll/resize handlers
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle for animation frames
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// RAF-based throttle for smooth animations
export const rafThrottle = <T extends (...args: unknown[]) => unknown>(
  fn: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  return (...args: Parameters<T>) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
};

// Check if element is in viewport
export const isInViewport = (element: Element, offset = 0): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth) + offset
  );
};

// Measure performance
export const measurePerformance = (name: string) => {
  if (typeof window === "undefined" || !window.performance) return;

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      if (process.env.NODE_ENV === "development") {
        console.log(`[Perf] ${name}: ${measure?.duration?.toFixed(2)}ms`);
      }
      return measure?.duration;
    },
  };
};

// Prefetch route on hover/focus
export const prefetchOnInteraction = (
  element: HTMLElement,
  href: string
): (() => void) => {
  let prefetched = false;

  const prefetch = () => {
    if (prefetched) return;
    prefetched = true;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  };

  element.addEventListener("mouseenter", prefetch);
  element.addEventListener("focus", prefetch);

  return () => {
    element.removeEventListener("mouseenter", prefetch);
    element.removeEventListener("focus", prefetch);
  };
};

// Get connection type for adaptive loading
export const getConnectionType = (): string => {
  if (typeof navigator === "undefined") return "unknown";

  const connection =
    (navigator as Navigator & { connection?: { effectiveType: string } })
      .connection ||
    (navigator as Navigator & { mozConnection?: { effectiveType: string } })
      .mozConnection ||
    (navigator as Navigator & { webkitConnection?: { effectiveType: string } })
      .webkitConnection;

  return connection?.effectiveType || "unknown";
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Adaptive loading based on connection
export const shouldLoadHeavyAssets = (): boolean => {
  const connection = getConnectionType();
  return connection === "4g" || connection === "unknown";
};
