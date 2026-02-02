import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

// Critical: Load immediately (Above the fold)
import {
  MegaNavigation,
  EnterpriseHero,
} from "@/components/enterprise";

// Lazy load below-the-fold sections
const TechStackLayers = dynamic(
  () => import("@/components/enterprise/TechStackLayers"),
  { ssr: true }
);

const ComparisonSection = dynamic(
  () => import("@/components/landing-v5/ComparisonSection"),
  { ssr: true }
);

const DefenseArchitecture = dynamic(
  () => import("@/components/landing-v5/DefenseArchitecture"),
  { ssr: true }
);

const SecurityBadges = dynamic(
  () => import("@/components/enterprise/SecurityBadges"),
  { ssr: true }
);

const CaseStudyGrid = dynamic(
  () => import("@/components/enterprise/CaseStudyGrid"),
  { ssr: true }
);

const AdminDashboardPreview = dynamic(
  () => import("@/components/landing-v5/AdminDashboardPreview"),
  { ssr: true }
);

// Footer from v4
import { Footer } from "@/components/landing-v4";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision AI | Enterprise-Grade Knowledge Infrastructure</title>
        <meta
          name="description"
          content="대기업은 이미 가졌습니다. 이제 당신 차례입니다. Fortune 500이 사용하는 Enterprise RAG 인프라를 중소기업도 도입할 수 있습니다."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Vision AI | Enterprise-Grade Knowledge Infrastructure"
        />
        <meta
          property="og:description"
          content="대기업은 이미 가졌습니다. 이제 당신 차례입니다. Fortune 500이 사용하는 Enterprise RAG 인프라를 중소기업도 도입할 수 있습니다."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#020617]">
        {/* Mega Navigation */}
        <MegaNavigation />

        {/* Main Content */}
        <main>
          {/* Enterprise Hero with Data Visualization */}
          <EnterpriseHero />

          {/* Technology Stack Layers */}
          <TechStackLayers />

          {/* Legacy AI vs Vision AI */}
          <ComparisonSection />

          {/* 5-Layer Defense Architecture */}
          <DefenseArchitecture />

          {/* Security & Compliance Badges */}
          <SecurityBadges />

          {/* Case Study Grid */}
          <CaseStudyGrid />

          {/* Admin Dashboard Preview */}
          <AdminDashboardPreview />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          width: 100%;
          min-height: 100%;
          background-color: #020617;
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          color: white;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #020617;
        }

        ::-webkit-scrollbar-thumb {
          background: #1e3a8a;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }

        /* Selection */
        ::selection {
          background: rgba(16, 185, 129, 0.3);
          color: white;
        }

        /* Glassmorphism Base */
        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Skeleton Animation */
        .skeleton {
          background: linear-gradient(
            90deg,
            #0a192f 25%,
            #1e3a8a20 50%,
            #0a192f 75%
          );
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}
