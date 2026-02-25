import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HomeFooter from "@/components/home/HomeFooter";
import LegalHero from "@/components/legal/LegalHero";

const LegalWhyRag          = dynamic(() => import("@/components/legal/LegalWhyRag"),          { ssr: true });
const LegalComparison      = dynamic(() => import("@/components/legal/LegalComparison"),      { ssr: true });
const LegalCitationExample = dynamic(() => import("@/components/legal/LegalCitationExample"), { ssr: true });
const RagVisualizer        = dynamic(() => import("@/components/legal/RagVisualizer"),        { ssr: false });
const LegalChatUI       = dynamic(() => import("@/components/legal/LegalChatUI"),       { ssr: false });
const LegalUseCases     = dynamic(() => import("@/components/legal/LegalUseCases"),     { ssr: true });
const LegalSecurity     = dynamic(() => import("@/components/legal/LegalSecurity"),     { ssr: true });
const LegalConsultWidget = dynamic(() => import("@/components/legal/LegalConsultWidget"), { ssr: false });

export default function LegalPage() {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetMessage, setWidgetMessage] = useState("");

  const openConsult = (message?: string) => {
    setWidgetMessage(message ?? "");
    setWidgetOpen(true);
  };

  return (
    <>
      <Head>
        <title>법률 특화 RAG 솔루션 | Vision AI</title>
        <meta name="description" content="법률 지식과 AI의 결합. 수만 건 판례 3초 검색, 환각 없는 출처 기반 답변, 폐쇄망 On-Premise — Vision AI 법률 RAG 솔루션." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="법률 특화 RAG 솔루션 | Vision AI" />
        <meta property="og:description" content="법률 지식과 AI의 결합. 단순 검색을 넘어 추론의 영역으로." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LegalConsultWidget
        externalOpen={widgetOpen}
        initialMessage={widgetMessage}
        onExternalClose={() => setWidgetOpen(false)}
      />

      <div style={{ minHeight: "100vh" }}>
        <Navbar onConsultationOpen={openConsult} heroTheme="dark" />

        <main>
          {/* ① Dark Navy ── Hero */}
          <LegalHero onConsult={openConsult} />

          {/* ② White ── 왜 법률에 RAG가 필요한가 */}
          <div style={{ background: "#FFFFFF" }}>
            <LegalWhyRag />
          </div>

          {/* ③ Light Gray ── 기존 AI vs Vision AI 비교 */}
          <div style={{ background: "#F1F5F9" }}>
            <LegalComparison />
          </div>

          {/* ④ White ── 실제 답변 예시 (출처 링크 UI) */}
          <LegalCitationExample />

          {/* ⑤ Dark Navy ── RAG 작동 원리 인터랙티브 */}
          <RagVisualizer />

          {/* ⑥ Dark ── 법률 전용 챗 UI */}
          <LegalChatUI onConsult={openConsult} />

          {/* ⑦ Light Blue ── 도입 시나리오 */}
          <LegalUseCases />

          {/* ⑧ Dark Navy ── 보안 */}
          <LegalSecurity />

          {/* ⑨ Dark Navy ── CTA */}
          <CtaBanner onConsult={openConsult} />
        </main>

        <HomeFooter />
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          min-height: 100%;
          background-color: #F8FAFC;
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
            system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
            "Noto Sans KR", "Malgun Gothic", sans-serif;
          color: #0D1117;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          /* 모바일 가독성 — 자간·행간 */
          letter-spacing: 0.01em;
          line-height: 1.75;
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: #C8B897; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #B89150; }
        ::selection { background: rgba(184,145,80,0.15); color: #92700A; }
      `}</style>
    </>
  );
}

/* ── CTA Banner ────────────────────────────────────────────────────── */
function CtaBanner({ onConsult }: { onConsult: () => void }) {
  return (
    <section style={{ background: "linear-gradient(135deg, #0D1117 0%, #1A2238 55%, #2A3A5C 100%)", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #B89150, transparent)" }} />
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 400, height: 400, border: "1px solid rgba(184,145,80,0.07)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-10%", transform: "translateY(-50%)", width: 600, height: 600, border: "1px solid rgba(184,145,80,0.03)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#B89150", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          Start Today
        </div>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: 16 }}>
          지금 바로 무료 데모를 경험하세요
        </h2>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.85 }}>
          별도 인프라 없이도 Vision AI 법률 RAG를 체험할 수 있습니다.<br />
          도입 컨설팅부터 PoC까지 전 과정을 무료로 지원합니다.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onConsult}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", background: "#B89150", color: "white", fontSize: 15, fontWeight: 800, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(184,145,80,0.35)", transition: "all 0.2s", letterSpacing: "-0.01em" }}
            onMouseOver={e => { e.currentTarget.style.background = "#A07D40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#B89150"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            무료 데모 신청하기
          </button>
          <button
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: "transparent", color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >
            기술 백서 다운로드
          </button>
        </div>
      </div>
    </section>
  );
}
