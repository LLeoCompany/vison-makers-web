import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HomeFooter from "@/components/home/HomeFooter";
import MarketingHero from "@/components/marketing/MarketingHero";

const MarketingGap          = dynamic(() => import("@/components/marketing/MarketingGap"),          { ssr: true });
const MarketingCopyDemo     = dynamic(() => import("@/components/marketing/MarketingCopyDemo"),     { ssr: false });
const MarketingBentoFeatures= dynamic(() => import("@/components/marketing/MarketingBentoFeatures"),{ ssr: true });
const MarketingBeforeAfter  = dynamic(() => import("@/components/marketing/MarketingBeforeAfter"),  { ssr: true });
const MarketingBrandInput   = dynamic(() => import("@/components/marketing/MarketingBrandInput"),   { ssr: false });
const ConsultationSidebar   = dynamic(() => import("@/components/home/ConsultationSidebar"),        { ssr: false });

export default function MarketingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openConsult = (message?: string) => {
    setSidebarOpen(true);
  };

  return (
    <>
      <Head>
        <title>광고/마케팅 AI 솔루션 | Vision AI</title>
        <meta name="description" content="귀사의 브랜드 언어를 학습한 단 한 명의 AI 카피라이터. ROAS 데이터 + 브랜드 가이드라인 기반으로 1초 만에 채널별 최적 카피를 생성합니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="광고/마케팅 AI 솔루션 | Vision AI" />
        <meta property="og:description" content="브랜드 언어를 학습한 AI 카피라이터 — 1초, 20종, 채널별 최적화." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Consultation sidebar */}
      <ConsultationSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ minHeight: "100vh" }}>
        <Navbar onConsultationOpen={() => setSidebarOpen(true)} heroTheme="dark" />

        <main>
          {/* ① Dark Gradient ── Hero */}
          <MarketingHero onConsult={openConsult} />

          {/* ② White ── 왜 ChatGPT로는 부족한가 */}
          <MarketingGap />

          {/* ③ Dark ── 인터랙티브 카피 데모 */}
          <MarketingCopyDemo />

          {/* ④ Deep Dark ── Bento Grid 핵심 기능 */}
          <MarketingBentoFeatures />

          {/* ⑤ White ── Before / After 사례 */}
          <MarketingBeforeAfter />

          {/* ⑥ Dark Gradient ── 브랜드명 입력 → 상담 */}
          <MarketingBrandInput onConsult={openConsult} />

          {/* ⑦ Dark ── CTA */}
          <MarketingCtaBanner onConsult={openConsult} />
        </main>

        <HomeFooter />
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          min-height: 100%;
          background-color: #FFFFFF;
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
            system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
            "Noto Sans KR", "Malgun Gothic", sans-serif;
          color: #0D1117;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          letter-spacing: 0.01em;
          line-height: 1.75;
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9, #8B5CF6); border-radius: 3px; }
        ::selection { background: rgba(14,165,233,0.15); color: #0369A1; }
      `}</style>
    </>
  );
}

/* ── CTA Banner ─────────────────────────────────────────────────────── */
function MarketingCtaBanner({ onConsult }: { onConsult: () => void }) {
  return (
    <section style={{ background: "linear-gradient(135deg, #0C4A6E 0%, #1E1B4B 55%, #0C4A6E 100%)", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0EA5E9, #8B5CF6, transparent)" }} />
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Start Today
        </div>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: 16 }}>
          귀사 브랜드만의 AI를<br />지금 경험해보세요
        </h2>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.85 }}>
          별도 인프라 없이 2주 무료 PoC로 성과를 먼저 확인하세요.<br />
          도입 컨설팅부터 캠페인 런칭까지 전 과정을 지원합니다.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onConsult}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", color: "white", fontSize: 15, fontWeight: 800, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(139,92,246,0.4)", transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,92,246,0.5)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,92,246,0.4)"; }}
          >
            무료 PoC 신청하기
          </button>
          <button
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: "transparent", color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >
            성공 사례 보기
          </button>
        </div>
      </div>
    </section>
  );
}
