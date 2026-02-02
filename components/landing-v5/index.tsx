"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Critical - Load immediately (Above the fold)
export { default as Hero } from "./Hero";

// Section Skeleton for loading states
const SectionSkeleton = ({ height = "600px" }: { height?: string }) => (
  <div
    className="w-full skeleton"
    style={{ minHeight: height }}
    aria-hidden="true"
  />
);

// Lazy load below-the-fold sections with code splitting
export const ComparisonSection = dynamic(
  () => import("./ComparisonSection"),
  {
    loading: () => <SectionSkeleton height="800px" />,
    ssr: true,
  }
);

export const DefenseArchitecture = dynamic(
  () => import("./DefenseArchitecture"),
  {
    loading: () => <SectionSkeleton height="900px" />,
    ssr: true,
  }
);

export const AdminDashboardPreview = dynamic(
  () => import("./AdminDashboardPreview"),
  {
    loading: () => <SectionSkeleton height="800px" />,
    ssr: true,
  }
);

// Full landing page composition with optimized loading
export const LandingPageV5 = () => {
  return (
    <main className="bg-[#020617] min-h-screen">
      {/* Critical: Above the fold - No lazy loading */}
      <Hero />

      {/* Below the fold: Code split and lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="800px" />}>
        <ComparisonSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="900px" />}>
        <DefenseArchitecture />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="800px" />}>
        <AdminDashboardPreview />
      </Suspense>
    </main>
  );
};

export default LandingPageV5;
