"use client";

import React, { useRef, useState, useEffect, Suspense, ComponentType } from "react";
import { m, useInView, domAnimation, LazyMotion } from "framer-motion";

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
}

/**
 * Lazy Section Wrapper
 * - Defers rendering until section is near viewport
 * - Prevents unnecessary JS execution
 * - Reduces TTI by lazy loading below-the-fold content
 */
export const LazySection = ({
  children,
  className = "",
  fallback,
  rootMargin = "200px",
  threshold = 0.1,
  minHeight = "400px",
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className} style={{ minHeight: shouldRender ? "auto" : minHeight }}>
      {shouldRender ? (
        children
      ) : (
        fallback || <SectionSkeleton minHeight={minHeight} />
      )}
    </div>
  );
};

/**
 * Section Skeleton for loading states
 */
const SectionSkeleton = ({ minHeight }: { minHeight: string }) => (
  <div
    className="w-full skeleton rounded-lg"
    style={{ minHeight }}
  />
);

/**
 * Lazy Motion Section
 * - Wraps content with LazyMotion for reduced bundle
 * - Includes fade-in animation on view
 */
export const LazyMotionSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

/**
 * Dynamic Import Wrapper for heavy components
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn);

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <SectionSkeleton minHeight="400px" />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Preload component on hover/focus
 */
export const usePreloadComponent = (
  importFn: () => Promise<{ default: ComponentType<unknown> }>
) => {
  const preloaded = useRef(false);

  const preload = () => {
    if (!preloaded.current) {
      preloaded.current = true;
      importFn();
    }
  };

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
};

export default LazySection;
