"use client";
import React from "react";
import Head from "next/head";
import {
  Header,
  VideoHero,
  VideoFeatures,
  HorizontalSolutions,
  Footer,
} from "@/components/landing-v4";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision-Makers | 우리 서버 안에 AI를 심다</title>
        <meta
          name="description"
          content="데이터 유출 없는 완벽한 폐쇄형 AI. 귀사의 서버 안에 직접 심는 AI 사내 비서."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Vision-Makers | 우리 서버 안에 AI를 심다" />
        <meta
          property="og:description"
          content="데이터 유출 없는 완벽한 폐쇄형 AI. 귀사의 서버 안에 직접 심는 AI 사내 비서."
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

      <div className="page-wrapper">
        {/* Fixed Header */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero with Video Background */}
          <VideoHero />

          {/* Features with Video Transitions */}
          <section id="features">
            <VideoFeatures />
          </section>

          {/* Horizontal Scroll Solutions */}
          <section id="solutions">
            <HorizontalSolutions />
          </section>

          {/* Giantstep-style Footer */}
          <Footer />
        </main>
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
          background-color: #000000;
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          color: white;
          overflow-x: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

        .page-wrapper {
          width: 100%;
          min-height: 100vh;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: #000000;
        }

        ::-webkit-scrollbar-thumb {
          background: #00F0FF;
          border-radius: 0;
        }

        /* Selection */
        ::selection {
          background: rgba(0, 240, 255, 0.3);
          color: white;
        }

        /* Video placeholder when no video is available */
        video:not([src]),
        video[src=""] {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
        }
      `}</style>
    </>
  );
}
