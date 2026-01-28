"use client";
import React from "react";
import Head from "next/head";
import {
  Header,
  Hero,
  SocialProof,
  SecurityArchitecture,
  IndustrySolutions,
  ComparisonSection,
  BottomCTA,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vision-Makers | 기업 전용 Private RAG AI 솔루션</title>
        <meta
          name="description"
          content="외부 AI는 유출되지만, Vision-Makers는 이식합니다. 사내 문서를 성벽 안에 가두고, 오직 지능만 활용하는 기업 전용 Private RAG 솔루션."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Vision-Makers | 기업 전용 Private RAG AI 솔루션"
        />
        <meta
          property="og:description"
          content="외부 AI는 유출되지만, Vision-Makers는 이식합니다. 사내 문서를 성벽 안에 가두고, 오직 지능만 활용하는 기업 전용 Private RAG 솔루션."
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

      <div className="min-h-screen bg-[#0a0a0f] font-pretendard">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero />

          {/* Social Proof - Trust Metrics */}
          <SocialProof />

          {/* Security Architecture - The Vault */}
          <section id="security">
            <SecurityArchitecture />
          </section>

          {/* Industry Solutions */}
          <section id="solutions">
            <IndustrySolutions />
          </section>

          {/* Comparison Section */}
          <section id="comparison">
            <ComparisonSection />
          </section>

          {/* Bottom CTA */}
          <BottomCTA />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Styles for this page */}
      <style jsx global>{`
        :root {
          --color-background: #0a0a0f;
          --color-primary: #00D1FF;
          --color-primary-soft: #60A5FA;
          --color-danger: #EF4444;
          --color-success: #48BB78;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background-color: var(--color-background);
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
        }

        .font-pretendard {
          font-family: "Pretendard Variable", Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0f;
        }

        ::-webkit-scrollbar-thumb {
          background: #1a1a2e;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #00D1FF40;
        }

        /* Selection Color */
        ::selection {
          background: #00D1FF40;
          color: white;
        }
      `}</style>
    </>
  );
}
