import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, MessageSquare, Calculator } from "lucide-react";
import TaxHero from "@/components/tax/TaxHero";
import TaxChallenge from "@/components/tax/TaxChallenge";
import TaxFeatureGrid from "@/components/tax/TaxFeatureGrid";
import TaxDashboard from "@/components/tax/TaxDashboard";

const TaxRAGDemo           = dynamic(() => import("@/components/tax/TaxRAGDemo"),           { ssr: false });
const TaxTimeComparison    = dynamic(() => import("@/components/tax/TaxTimeComparison"),    { ssr: false });
const TaxExcelIntegration  = dynamic(() => import("@/components/tax/TaxExcelIntegration"),  { ssr: false });
const TaxSpecialtyGrid     = dynamic(() => import("@/components/tax/TaxSpecialtyGrid"),     { ssr: false });
const TaxCTA               = dynamic(() => import("@/components/tax/TaxCTA"),               { ssr: false });
const ConsultationSidebar  = dynamic(() => import("@/components/home/ConsultationSidebar"), { ssr: false });

export default function TaxPage() {
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [sidebarMessage, setSidebarMessage] = useState<string | undefined>();

  const handleConsult = (msg?: string) => {
    setSidebarMessage(msg);
    setSidebarOpen(true);
  };

  return (
    <>
      <Head>
        <title>세무·회계 특화 RAG | Vision AI</title>
        <meta name="description" content="복잡한 세법 속 숨겨진 절세 기회를 Vision AI가 찾아드립니다. 최신 예규·판례 기반 RAG." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="세무·회계 특화 RAG | Vision AI" />
        <meta property="og:description" content="복잡한 세법 속 숨겨진 절세 기회를 Vision AI가 찾아드립니다." />
        <meta name="theme-color" content="#10B981" />
      </Head>

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(51,65,85,0.5)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "rgba(148,163,184,0.7)", textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#10B981"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,0.7)"; }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />홈으로
            </Link>
            <span style={{ color: "rgba(51,65,85,0.8)", fontSize: 14 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(148,163,184,0.45)" }}>분야별 AI</span>
            <span style={{ color: "rgba(51,65,85,0.8)", fontSize: 14 }}>/</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#10B981" }}>
              <Calculator style={{ width: 13, height: 13 }} />세무·회계
            </span>
          </div>
          <button
            onClick={() => handleConsult()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 6, border: "none",
              background: "#10B981", color: "white",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 12px rgba(16,185,129,0.35)",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#059669"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#10B981"; }}
          >
            <MessageSquare style={{ width: 13, height: 13 }} />
            세무 AI 도입 상담
          </button>
        </div>
      </header>

      {/*
        Section sequence (background rhythm):
        Hero              → Dark Navy (#0F172A) + CSS grid pattern
        Challenge         → Near-black (#0A1628)
        FeatureGrid       → White (#FFFFFF)
        TimeComparison    → Cool White (#F8FAFC)   ← 40h vs 5min bar chart
        RAGDemo           → Dark Slate (#1E293B)   ← star section
        ExcelIntegration  → Dark Gradient (#1E293B → #0F172A)
        SpecialtyGrid     → Deep Navy (#0A0F1E)
        Dashboard         → Cool White (#F8FAFC)
        CTA               → Deep Dark (radial)
      */}
      <main style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}>
        <TaxHero onConsult={handleConsult} />
        <TaxChallenge />
        <TaxFeatureGrid />
        <TaxTimeComparison />
        <TaxRAGDemo />
        <TaxExcelIntegration />
        <TaxSpecialtyGrid />
        <TaxDashboard onConsult={handleConsult} />
        <TaxCTA onConsult={handleConsult} />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{ background: "#030711", padding: "32px 24px", borderTop: "1px solid rgba(51,65,85,0.4)" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: "#10B981",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 12 }}>V</span>
            </div>
            <span style={{ fontWeight: 800, color: "white", fontSize: 15 }}>
              Vision<span style={{ color: "#34D399" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>
            © 2024 Vision-Makers. All rights reserved.
          </p>
          <Link href="/" style={{
            fontSize: 13, color: "rgba(148,163,184,0.4)", textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#34D399"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,0.4)"; }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </footer>

      <ConsultationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        initialMessage={sidebarMessage}
      />

      <style>{`
        :root {
          --scrollbar-thumb: #334155;
          --scrollbar-track: #0F172A;
        }
        *::-webkit-scrollbar { width: 5px; }
        *::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        *::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
        *::-webkit-scrollbar-thumb:hover { background: #10B981; }
      `}</style>
    </>
  );
}
