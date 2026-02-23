import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HomeFooter from "@/components/home/HomeFooter";

const ServiceCards = dynamic(() => import("@/components/home/ServiceCards"), { ssr: true });
const SecuritySection = dynamic(() => import("@/components/home/SecuritySection"), { ssr: true });
const CaseStudySection = dynamic(() => import("@/components/home/CaseStudySection"), { ssr: true });
const ConsultationForm = dynamic(() => import("@/components/home/ConsultationForm"), { ssr: true });

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision AI | 보안 기반 Enterprise RAG 솔루션</title>
        <meta
          name="description"
          content="귀사의 데이터를 강력한 지능으로. 보안 기반 도메인 특화 RAG 솔루션 - Vision AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Vision AI | 보안 기반 Enterprise RAG 솔루션" />
        <meta
          property="og:description"
          content="귀사의 데이터를 강력한 지능으로. 보안 기반 도메인 특화 RAG 솔루션."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main>
          <HeroSection />
          <ServiceCards />
          <SecuritySection />
          <CaseStudySection />
          <ConsultationForm />
        </main>

        <HomeFooter />
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
          background-color: #ffffff;
          font-family:
            "Pretendard Variable",
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            Roboto,
            "Helvetica Neue",
            "Segoe UI",
            "Apple SD Gothic Neo",
            "Noto Sans KR",
            "Malgun Gothic",
            sans-serif;
          color: #111827;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        ::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #1e40af;
        }

        ::selection {
          background: rgba(30, 64, 175, 0.15);
          color: #1e40af;
        }
      `}</style>
    </>
  );
}
