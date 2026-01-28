"use client";
import React from "react";
import Head from "next/head";
import {
  Header,
  Hero,
  CoreValue,
  IndustrySolutions,
  SecurityArchitecture,
  Footer,
} from "@/components/landing-v2";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision-Makers | 우리 서버 안의 AI 사내 비서</title>
        <meta
          name="description"
          content="우리 서버 안에 직접 심는, 가장 똑똑한 AI 사내 비서. 데이터 유출 걱정 없는 로컬 인프라 기반 맞춤형 AI 이식."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Vision-Makers | 우리 서버 안의 AI 사내 비서"
        />
        <meta
          property="og:description"
          content="우리 서버 안에 직접 심는, 가장 똑똑한 AI 사내 비서. 데이터 유출 걱정 없는 로컬 인프라 기반 맞춤형 AI 이식."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />

        {/* Pretendard Font */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </Head>

      <div className="scroll-container">
        {/* Header - Fixed */}
        <Header />

        {/* Scroll Snap Container */}
        <main className="snap-container">
          {/* Section 1: Hero */}
          <Hero />

          {/* Section 2: Core Value */}
          <section id="value">
            <CoreValue />
          </section>

          {/* Section 3: Industry Solutions */}
          <section id="solutions">
            <IndustrySolutions />
          </section>

          {/* Section 4: Security Architecture */}
          <section id="security">
            <SecurityArchitecture />
          </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      <style jsx global>{`
        :root {
          --color-bg: #0a1628;
          --color-primary: #00d1ff;
          --color-secondary: #60a5fa;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background-color: var(--color-bg);
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          color: white;
          overflow-x: hidden;
        }

        /* Scroll Snap Container */
        .snap-container {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        /* Scroll Snap Sections */
        .snap-start {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        /* Custom Scrollbar */
        .snap-container::-webkit-scrollbar {
          width: 6px;
        }

        .snap-container::-webkit-scrollbar-track {
          background: var(--color-bg);
        }

        .snap-container::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          opacity: 0.3;
          border-radius: 3px;
        }

        .snap-container::-webkit-scrollbar-thumb:hover {
          background: var(--color-secondary);
        }

        /* Selection */
        ::selection {
          background: rgba(0, 209, 255, 0.3);
          color: white;
        }

        /* Smooth anchor scrolling */
        html {
          scroll-padding-top: 64px;
        }
      `}</style>
    </>
  );
}
