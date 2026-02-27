"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";

interface Props { onConsult: (message?: string) => void }

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const wordAnim: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const STATS = [
  { val: "3×",    label: "제작 프로세스 가속" },
  { val: "90%",   label: "시나리오 초안 시간 단축" },
  { val: "500+",  label: "글로벌 수상 캠페인 DB" },
  { val: "< 1초", label: "씬별 BGM 레퍼런스" },
];

export default function ProductionHero({ onConsult }: Props) {
  return (
    <>
    <section style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 110%, #061828 0%, #030407 65%)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "140px 24px 80px",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.018,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
        pointerEvents: "none",
      }} />
      {/* Accent lines */}
      <div style={{ position: "absolute", top: "17%", left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.14), transparent)" }} />
      <div style={{ position: "absolute", bottom: "23%", left: "4%", right: "4%", height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.07), transparent)" }} />
      {/* Corner glow */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 300, height: 300, background: "radial-gradient(circle at 0% 0%, rgba(14,165,233,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle at 100% 100%, rgba(14,165,233,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="prodh-inner" style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 52 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", border: "1px solid rgba(14,165,233,0.22)", borderRadius: 4, background: "rgba(14,165,233,0.05)", backdropFilter: "blur(8px)" }}>
            <motion.div
              animate={{ opacity: [1, 0.25, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", boxShadow: "0 0 8px #0EA5E9" }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,165,233,0.85)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Vision AI — Creative Production
            </span>
          </div>
        </motion.div>

        {/* Staggered headline */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Line 1 — white */}
          <div style={{ display: "flex", gap: "0.28em", flexWrap: "wrap", marginBottom: "0.05em" }}>
            {["아이디어에서", "스크린까지,"].map((w, i) => (
              <motion.span key={i} variants={wordAnim} style={{
                fontSize: "clamp(2.6rem, 7vw, 7rem)", fontWeight: 900, color: "white",
                letterSpacing: "-0.04em", lineHeight: 1.06, display: "inline-block",
              }}>{w}</motion.span>
            ))}
          </div>
          {/* Line 2 — dim */}
          <div style={{ display: "flex", gap: "0.28em", flexWrap: "wrap", marginBottom: "0.05em" }}>
            {["AI가", "제작의", "전", "과정을"].map((w, i) => (
              <motion.span key={i} variants={wordAnim} style={{
                fontSize: "clamp(2.6rem, 7vw, 7rem)", fontWeight: 900,
                color: "rgba(226,232,240,0.38)", letterSpacing: "-0.04em", lineHeight: 1.06, display: "inline-block",
              }}>{w}</motion.span>
            ))}
          </div>
          {/* Line 3 — electric blue */}
          <div style={{ display: "flex", gap: "0.28em", flexWrap: "wrap" }}>
            {["가속화합니다."].map((w, i) => (
              <motion.span key={i} variants={wordAnim} style={{
                fontSize: "clamp(2.6rem, 7vw, 7rem)", fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 1.06, display: "inline-block",
                background: "linear-gradient(92deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 28px rgba(14,165,233,0.5))",
              }}>{w}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(148,163,184,0.6)", maxWidth: 520, lineHeight: 1.9, marginTop: 36, marginBottom: 52 }}
        >
          CF 기획부터 시나리오 라이팅, 비주얼 레퍼런스까지.<br />
          Vision AI가 제작 팀의 크리에이티브 파트너가 됩니다.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.55 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
        >
          <button
            onClick={() => onConsult()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 38px", borderRadius: 4, border: "none",
              background: "#0EA5E9", color: "white",
              fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 0 0 1px rgba(14,165,233,0.5), 0 8px 32px rgba(14,165,233,0.4)",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(14,165,233,0.8), 0 12px 40px rgba(14,165,233,0.55)"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(14,165,233,0.5), 0 8px 32px rgba(14,165,233,0.4)"; }}
          >
            <Play style={{ width: 13, height: 13 }} />
            무료 PoC 신청
          </button>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 28px", borderRadius: 4,
              background: "transparent", color: "rgba(226,232,240,0.5)",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              border: "1px solid rgba(226,232,240,0.13)", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(226,232,240,0.28)"; e.currentTarget.style.color = "rgba(226,232,240,0.8)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(226,232,240,0.13)"; e.currentTarget.style.color = "rgba(226,232,240,0.5)"; }}
          >
            스크립트 데모 보기
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.45, duration: 0.7 }}
          className="prodh-stats" style={{ marginTop: 80, display: "flex", flexWrap: "wrap", rowGap: 28 }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="prodh-stat" style={{
              paddingRight: 44, marginRight: 44,
              borderRight: i < STATS.length - 1 ? "1px solid rgba(226,232,240,0.08)" : "none",
            }}>
              <div style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 900, color: "#0EA5E9",
                letterSpacing: "-0.02em", lineHeight: 1,
                textShadow: "0 0 20px rgba(14,165,233,0.55)",
              }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.42)", marginTop: 7, fontWeight: 600, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .prodh-inner { padding: 0 16px !important; }
        .prodh-stats { margin-top: 48px !important; row-gap: 20px !important; }
        .prodh-stat { padding-right: 24px !important; margin-right: 24px !important; }
      }
    `}</style>
    </>
  );
}
