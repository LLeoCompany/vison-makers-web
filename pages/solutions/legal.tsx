import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HomeFooter from "@/components/home/HomeFooter";
import LegalHero from "@/components/legal/LegalHero";

const LegalComparison = dynamic(() => import("@/components/legal/LegalComparison"), { ssr: true });
const RagVisualizer = dynamic(() => import("@/components/legal/RagVisualizer"), { ssr: false });
const LegalUseCases = dynamic(() => import("@/components/legal/LegalUseCases"), { ssr: true });
const LegalSecurity = dynamic(() => import("@/components/legal/LegalSecurity"), { ssr: true });
const LegalConsultWidget = dynamic(() => import("@/components/legal/LegalConsultWidget"), { ssr: false });

export default function LegalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openConsult = () => setSidebarOpen(true);

  return (
    <>
      <Head>
        <title>법률 특화 RAG 솔루션 | Vision AI</title>
        <meta
          name="description"
          content="수만 건의 판례와 조항을 단 3초 안에 검색. 환각 없는 정확한 출처 제시, 법무법인 데이터를 폐쇄망 안에서 안전하게 관리하는 Vision AI 법률 RAG 솔루션."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="법률 특화 RAG 솔루션 | Vision AI" />
        <meta
          property="og:description"
          content="수만 건의 판례와 조항을 단 3초 안에 검색. 환각 없는 정확한 출처 제시, 폐쇄망 On-Premise 구축."
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Consultation floating widget */}
      <LegalConsultWidget />

      <div style={{ minHeight: "100vh", background: "white" }}>
        <Navbar onConsultationOpen={openConsult} heroTheme="light" />

        <main>
          {/* Section 1: Hero */}
          <LegalHero onConsult={openConsult} />

          {/* Section 2: Comparison */}
          <LegalComparison />

          {/* Section 3: RAG Visualizer */}
          <RagVisualizer />

          {/* Section 4: Use Cases */}
          <LegalUseCases />

          {/* Section 5: Security */}
          <LegalSecurity />

          {/* Section 6: CTA Banner */}
          <CtaBanner onConsult={openConsult} />
        </main>

        <HomeFooter />
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          min-height: 100%;
          background-color: #ffffff;
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
          color: #111827;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #93c5fd; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #1e40af; }
        ::selection { background: rgba(30,64,175,0.15); color: #1e40af; }
      `}</style>
    </>
  );
}

/* ── Inline CTA Banner ─────────────────────────────────────────────── */
function CtaBanner({ onConsult }: { onConsult: () => void }) {
  return (
    <section style={{ background: "linear-gradient(135deg, #0A0F1E 0%, #1E3A8A 50%, #2563EB 100%)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 400, height: 400, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-10%", transform: "translateY(-50%)", width: 600, height: 600, border: "1px solid rgba(255,255,255,0.03)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          Start Today
        </div>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
          지금 바로 무료 데모를 경험하세요
        </h2>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "rgba(147,197,253,0.85)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          별도 인프라 없이도 Vision AI 법률 RAG를 체험할 수 있습니다.<br />
          도입 컨설팅부터 PoC까지 전 과정을 무료로 지원합니다.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onConsult}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "white",
              color: "#1E3A8A", fontSize: 15, fontWeight: 800,
              borderRadius: 12, border: "none", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.2)", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.3)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)"; }}
          >
            무료 데모 신청하기
          </button>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "transparent",
              color: "white", fontSize: 15, fontWeight: 700,
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
              backdropFilter: "blur(8px)", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >
            기술 백서 다운로드
          </button>
        </div>
      </div>
    </section>
  );
}
