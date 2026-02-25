"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BarChart2, Heart, Share2 } from "lucide-react";

interface Props { onConsult: () => void }

/* Animated gradient orb */
function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", ...style }} />;
}

/* Floating card component */
function FloatingCard({
  children, delay, x, y, rotate,
}: {
  children: React.ReactNode; delay: number; x: string; y: string; rotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      style={{
        position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`,
        background: "rgba(255,255,255,0.10)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16,
        padding: "14px 18px", pointerEvents: "none", zIndex: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function MarketingHero({ onConsult }: Props) {
  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(135deg, #0A0F2E 0%, #1A0A3E 40%, #0D1B3E 100%)",
      overflow: "hidden", paddingTop: 80,
    }}>
      {/* Gradient orbs */}
      <Orb style={{ width: 600, height: 600, top: "-15%", right: "-5%", background: "rgba(139,92,246,0.35)" }} />
      <Orb style={{ width: 500, height: 500, bottom: "-10%", left: "-8%", background: "rgba(14,165,233,0.28)" }} />
      <Orb style={{ width: 300, height: 300, top: "30%", left: "35%", background: "rgba(139,92,246,0.12)" }} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Floating cards */}
      <FloatingCard delay={0.8} x="62%" y="12%" rotate={3}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <BarChart2 style={{ width: 14, height: 14, color: "#0EA5E9" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>ROAS 성과</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>+342%</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Vision AI 도입 후 3개월</div>
        <div style={{ marginTop: 8, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
          <motion.div animate={{ width: ["0%", "78%"] }} transition={{ delay: 1.4, duration: 1.2 }}
            style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />
        </div>
      </FloatingCard>

      <FloatingCard delay={1.0} x="60%" y="62%" rotate={-2}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>👟</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>AI 카피 생성됨</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "white", maxWidth: 160, lineHeight: 1.4 }}>
              &ldquo;지면을 박차고, 한계를 넘어라.&rdquo;
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
          {[{ icon: Heart, val: "12.4k" }, { icon: Share2, val: "3.2k" }].map(({ icon: Icon, val }) => (
            <div key={val} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon style={{ width: 11, height: 11, color: "#8B5CF6" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </FloatingCard>

      <FloatingCard delay={1.2} x="6%" y="55%" rotate={-3}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", marginBottom: 6, letterSpacing: "0.06em" }}>BRAND VOICE</div>
        {["톤앤매너", "채널 최적화", "ROAS 데이터"].map((tag, i) => (
          <div key={i} style={{ display: "inline-block", margin: "0 4px 4px 0", padding: "3px 8px", background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 99, fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
            {tag}
          </div>
        ))}
      </FloatingCard>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 760 }}>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 999, marginBottom: 32 }}
          >
            <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Marketing AI · Vision AI 광고 솔루션
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 28 }}
          >
            귀사의 브랜드 언어를
            <br />
            학습한 단 한 명의
            <br />
            <span style={{ background: "linear-gradient(90deg, #0EA5E9, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI 카피라이터.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 44, maxWidth: 560 }}
          >
            수만 개의 성과 데이터와 브랜드 가이드라인을 기반으로,<br />
            1초 만에 최적의 크리에이티브를 채널별로 제안합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 60 }}
          >
            <button onClick={onConsult}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", color: "white", fontSize: 15, fontWeight: 700, borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(139,92,246,0.45)", transition: "all 0.2s", letterSpacing: "-0.01em" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,92,246,0.55)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,92,246,0.45)"; }}
            >
              브랜드 진단 시작하기 <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 28px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 700, borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", backdropFilter: "blur(12px)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              성공 사례 보기
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { val: "1초", desc: "카피 생성 속도" },
              { val: "20종", desc: "채널별 카피 동시 생성" },
              { val: "+342%", desc: "평균 ROAS 향상" },
              { val: "98%", desc: "브랜드 톤 일관성" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, letterSpacing: "-0.03em", background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: "0.02em" }}>{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
