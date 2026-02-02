"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  aspectRatio?: string;
  showSkeleton?: boolean;
}

/**
 * Optimized Image Component
 * - Prevents CLS with aspect ratio container
 * - Lazy loading with blur placeholder
 * - Skeleton loading state
 * - Error fallback handling
 */
const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  aspectRatio,
  showSkeleton = true,
  className = "",
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Determine the source
  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio || "auto",
      }}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Actual image */}
      <Image
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;

/**
 * Background Image with optimization
 */
export const OptimizedBackgroundImage = ({
  src,
  className = "",
  children,
  overlay = true,
}: {
  src: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Skeleton while loading */}
      {!isLoaded && <div className="absolute inset-0 skeleton" />}

      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
