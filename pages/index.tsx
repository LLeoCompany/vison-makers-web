"use client";
import React from "react";
import Head from "next/head";
import {
  Header,
  Hero,
  CoreValue,
  Architecture,
  HorizontalSolutions,
  Footer,
} from "@/components/landing-v3";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision-Makers | 우리 서버 안에 AI를 심다</title>
        <meta
          name="description"
          content="우리 서버 안에 직접 심는 AI 사내 비서. 데이터는 밖으로 나가지 않습니다."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Vision-Makers | 우리 서버 안에 AI를 심다" />
        <meta
          property="og:description"
          content="우리 서버 안에 직접 심는 AI 사내 비서. 데이터는 밖으로 나가지 않습니다."
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

      {/* Fixed Header */}
      <Header />

      {/* Scroll Snap Container */}
      <main className="snap-container">
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Core Value */}
        <div id="value">
          <CoreValue />
        </div>

        {/* Section 3: Horizontal Solutions */}
        <div id="solutions">
          <HorizontalSolutions />
        </div>

        {/* Section 4: Architecture */}
        <div id="architecture">
          <Architecture />
        </div>

        {/* Footer */}
        <Footer />
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background-color: #000000;
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          color: white;
          overflow-x: hidden;
        }

        /* Scroll Snap */
        .snap-container {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
        }

        .snap-start {
          scroll-snap-align: start;
        }

        /* Custom Scrollbar - Minimal */
        .snap-container::-webkit-scrollbar {
          width: 4px;
        }

        .snap-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .snap-container::-webkit-scrollbar-thumb {
          background: #007aff;
          border-radius: 2px;
        }

        /* Selection */
        ::selection {
          background: rgba(0, 122, 255, 0.4);
          color: white;
        }

        /* Smooth scroll offset for header */
        html {
          scroll-padding-top: 80px;
        }
      `}</style>
    </>
  );
}
