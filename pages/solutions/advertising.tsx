import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HomeFooter from "@/components/home/HomeFooter";
import ProductionHero from "@/components/production/ProductionHero";
import ProductionFeatures from "@/components/production/ProductionFeatures";

const ProductionScriptDemo = dynamic(() => import("@/components/production/ProductionScriptDemo"), { ssr: false });
const ProductionCTA = dynamic(() => import("@/components/production/ProductionCTA"), { ssr: false });
const ConsultationSidebar = dynamic(() => import("@/components/home/ConsultationSidebar"), { ssr: false });

export default function AdvertisingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMessage, setSidebarMessage] = useState("");

  const openConsult = (message?: string) => {
    setSidebarMessage(message ?? "");
    setSidebarOpen(true);
  };

  return (
    <>
      <Head>
        <title>광고 제작 AI 솔루션 | Vision AI</title>
        <meta name="description" content="CF 기획부터 시나리오 라이팅, 비주얼 레퍼런스까지. Vision AI가 제작 팀의 크리에이티브 파트너가 됩니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="광고 제작 AI 솔루션 | Vision AI" />
        <meta property="og:description" content="아이디어에서 스크린까지, AI가 제작의 전 과정을 가속화합니다." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConsultationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        initialMessage={sidebarMessage}
      />

      <div style={{ minHeight: "100vh" }}>
        <Navbar onConsultationOpen={() => openConsult()} heroTheme="dark" />

        <main>
          {/* ① Dark cinematic ── Hero */}
          <ProductionHero onConsult={openConsult} />

          {/* ② White minimal ── 3 AI Capabilities */}
          <ProductionFeatures />

          {/* ③ Deep dark ── CF Script Timeline Demo */}
          <ProductionScriptDemo />

          {/* ④ Dark gradient ── Campaign keyword → CTA */}
          <ProductionCTA onConsult={openConsult} />

          {/* ⑤ Dark ── Final CTA banner */}
          <ProductionCtaBanner onConsult={openConsult} />
        </main>

        <HomeFooter />
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          min-height: 100%;
          background-color: #030407;
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
            system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
            "Noto Sans KR", "Malgun Gothic", sans-serif;
          color: #F8FAFC;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          letter-spacing: 0.005em;
          line-height: 1.7;
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050810; }
        ::-webkit-scrollbar-thumb { background: #0EA5E9; border-radius: 3px; }
        ::selection { background: rgba(14,165,233,0.2); color: #7DD3FC; }
      `}</style>
    </>
  );
}

/* ── Final CTA Banner ─────────────────────────────────────────── */
function ProductionCtaBanner({ onConsult }: { onConsult: () => void }) {
  return (
    <section style={{
      background: "#030407",
      borderTop: "1px solid rgba(14,165,233,0.1)",
      padding: "88px 24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Thin accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0EA5E9, transparent)" }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, color: "rgba(14,165,233,0.7)" }}>
          Start Today
        </div>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: 16 }}>
          귀사 캠페인만을 위한<br />AI를 지금 경험하세요
        </h2>
        <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)", color: "rgba(148,163,184,0.45)", maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.9 }}>
          별도 인프라 없이 2주 무료 PoC로 성과를 먼저 확인하세요.<br />
          CF 기획부터 캠페인 런칭까지 전 과정을 지원합니다.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onConsult}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 44px", background: "#0EA5E9", color: "white",
              fontSize: 14, fontWeight: 800, borderRadius: 4, border: "none",
              letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 0 0 1px rgba(14,165,233,0.5), 0 8px 32px rgba(14,165,233,0.4)",
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(14,165,233,0.8), 0 12px 40px rgba(14,165,233,0.55)"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(14,165,233,0.5), 0 8px 32px rgba(14,165,233,0.4)"; }}
          >
            무료 PoC 신청하기
          </button>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 36px", background: "transparent", color: "rgba(226,232,240,0.45)",
              fontSize: 14, fontWeight: 700, borderRadius: 4,
              border: "1px solid rgba(226,232,240,0.12)", cursor: "pointer", transition: "all 0.2s",
              letterSpacing: "0.04em",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(226,232,240,0.3)"; e.currentTarget.style.color = "rgba(226,232,240,0.8)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(226,232,240,0.12)"; e.currentTarget.style.color = "rgba(226,232,240,0.45)"; }}
          >
            성공 사례 보기
          </button>
        </div>
      </div>
    </section>
  );
}
