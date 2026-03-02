import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";
import FoodHero from "@/components/food/FoodHero";
import FoodChallenge from "@/components/food/FoodChallenge";
import FoodSolutionPillars from "@/components/food/FoodSolutionPillars";
import FoodDashboard from "@/components/food/FoodDashboard";

const FoodComplianceScanner = dynamic(() => import("@/components/food/FoodComplianceScanner"), { ssr: false });
const FoodCTA = dynamic(() => import("@/components/food/FoodCTA"), { ssr: false });
const ConsultationSidebar = dynamic(() => import("@/components/home/ConsultationSidebar"), { ssr: false });

export default function FoodPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMessage, setSidebarMessage] = useState<string | undefined>();

  const handleConsult = (msg?: string) => {
    setSidebarMessage(msg);
    setSidebarOpen(true);
  };

  return (
    <>
      <Head>
        <title>식품·유통 특화 RAG | Vision AI</title>
        <meta name="description" content="복잡한 식품 법규부터 비법 레시피까지, Vision AI가 완벽하게 관리합니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="식품·유통 특화 RAG | Vision AI" />
        <meta property="og:description" content="복잡한 식품 법규부터 비법 레시피까지, Vision AI가 완벽하게 관리합니다." />
        <meta name="theme-color" content="#0D9488" />
      </Head>

      {/* Sticky Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(13,148,136,0.1)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "#64748B", textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#0D9488"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              홈으로
            </Link>
            <span style={{ color: "#CBD5E1", fontSize: 14 }}>/</span>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>분야별 AI</span>
            <span style={{ color: "#CBD5E1", fontSize: 14 }}>/</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 13, fontWeight: 700, color: "#0D9488" }}>
              <ShieldCheck style={{ width: 13, height: 13 }} />
              식품·유통
            </span>
          </div>
          <button
            onClick={() => handleConsult()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 6, border: "none",
              background: "#0D9488", color: "white",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#0F766E"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#0D9488"; }}
          >
            <MessageSquare style={{ width: 13, height: 13 }} />
            식품 AI 도입 상담
          </button>
        </div>
      </header>

      <main style={{ background: "#FFFFFF", wordBreak: "keep-all", overflowWrap: "break-word" }}>
        <FoodHero onConsult={handleConsult} />
        <FoodChallenge />
        <FoodSolutionPillars />
        <FoodComplianceScanner />
        <FoodDashboard onConsult={handleConsult} />
        <FoodCTA onConsult={handleConsult} />
      </main>

      {/* Footer */}
      <footer style={{ background: "#071828", padding: "32px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "#0D9488",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 12 }}>V</span>
            </div>
            <span style={{ fontWeight: 800, color: "white", fontSize: 15 }}>
              Vision<span style={{ color: "#2DD4BF" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            © 2024 Vision-Makers. All rights reserved.
          </p>
          <Link href="/" style={{
            fontSize: 13, color: "#64748B", textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#2DD4BF"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
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
          --scrollbar-thumb: #0D9488;
          --scrollbar-track: #F0FDFA;
        }
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        *::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
      `}</style>
    </>
  );
}
