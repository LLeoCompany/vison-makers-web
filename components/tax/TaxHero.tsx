"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ChevronDown, TrendingUp } from "lucide-react";

/* ── Bar chart data ─────────────────────────────────────────────────────── */
const BARS = [
  { month: "7월", before: 148, after: 92, label: "₩56M" },
  { month: "8월", before: 162, after: 98, label: "₩64M" },
  { month: "9월", before: 155, after: 88, label: "₩67M" },
  { month: "10월", before: 174, after: 94, label: "₩80M" },
  { month: "11월", before: 168, after: 90, label: "₩78M" },
  { month: "12월", before: 190, after: 96, label: "₩94M" },
];

const SVG_W = 420;
const SVG_H = 200;
const BASE_Y = SVG_H - 24;
const MAX_VAL = 200;
const BAR_W = 28;
const GROUP_W = 64;
const OFFSET_X = 20;

function toH(val: number) { return (val / MAX_VAL) * (SVG_H - 40); }

/* ── Animated Chart ─────────────────────────────────────────────────────── */
function TaxBarChart({ active }: { active: boolean }) {
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H + 30}`}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="beforeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="afterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Horizontal grid lines */}
      {[0.25, 0.5, 0.75, 1].map((frac, i) => (
        <line key={i}
          x1={OFFSET_X} y1={BASE_Y - frac * (SVG_H - 40)}
          x2={SVG_W - 10} y2={BASE_Y - frac * (SVG_H - 40)}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4 6"
        />
      ))}

      {/* Baseline */}
      <line x1={OFFSET_X} y1={BASE_Y} x2={SVG_W - 10} y2={BASE_Y}
        stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

      {/* Bar groups */}
      {BARS.map((b, i) => {
        const gx = OFFSET_X + i * GROUP_W;
        const beforeH = toH(b.before);
        const afterH  = toH(b.after);
        return (
          <g key={i}>
            {/* Before bar (slate) */}
            <motion.rect
              x={gx} width={BAR_W - 4} rx={3}
              fill="url(#beforeGrad)"
              initial={{ y: BASE_Y, height: 0 }}
              animate={active ? { y: BASE_Y - beforeH, height: beforeH } : { y: BASE_Y, height: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* After bar (emerald) */}
            <motion.rect
              x={gx + BAR_W - 2} width={BAR_W - 4} rx={3}
              fill="url(#afterGrad)"
              filter="url(#glow)"
              initial={{ y: BASE_Y, height: 0 }}
              animate={active ? { y: BASE_Y - afterH, height: afterH } : { y: BASE_Y, height: 0 }}
              transition={{ duration: 0.8, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Saving label */}
            <motion.text
              x={gx + BAR_W - 2} y={BASE_Y - beforeH - 8}
              textAnchor="middle" fontSize={9}
              fill="#10B981" fontWeight={700}
              initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >{b.label}</motion.text>
            {/* Month label */}
            <text x={gx + BAR_W} y={BASE_Y + 14}
              textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.35)" fontWeight={500}>
              {b.month}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${OFFSET_X}, ${SVG_H + 20})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill="#475569" opacity={0.7} />
        <text x={14} y={9} fontSize={9} fill="rgba(255,255,255,0.45)">AI 도입 전</text>
        <rect x={72} y={0} width={10} height={10} rx={2} fill="#10B981" />
        <text x={86} y={9} fontSize={9} fill="rgba(255,255,255,0.45)">AI 도입 후</text>
        <text x={170} y={9} fontSize={9} fill="#10B981" fontWeight={700}>← 절세 Gap</text>
      </g>
    </svg>
  );
}

/* ── Stats ──────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "90%",  label: "신고 오류 감소"     },
  { value: "5초",  label: "세법 조항 검색"     },
  { value: "70%",  label: "업무 시간 절감"     },
  { value: "100%", label: "개정 세법 자동 반영" },
];

/* ── Floating badges ────────────────────────────────────────────────────── */
const BADGES = [
  { text: "법인세법 §25",    delay: 0.8,  x: "62%", y: "18%" },
  { text: "예규 대조 완료",  delay: 1.1,  x: "72%", y: "52%" },
  { text: "절세 ₩439M",      delay: 1.4,  x: "55%", y: "74%" },
];

interface Props { onConsult: (msg?: string) => void }

export default function TaxHero({ onConsult }: Props) {
  const [chartActive, setChartActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setChartActive(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <section ref={sectionRef} className="th-section" style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      background: "#0F172A",
      overflow: "hidden",
      paddingTop: 56,
    }}>

      {/* ── CSS Grid pattern background ──────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: [
          "linear-gradient(rgba(51,65,85,0.18) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(51,65,85,0.18) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "48px 48px",
      }} />

      {/* Emerald glow top-right */}
      <div style={{
        position: "absolute", top: "-10%", right: "5%",
        width: 800, height: 800,
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 60%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />
      {/* Slate glow bottom-left */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(51,65,85,0.25) 0%, transparent 65%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Emerald top accent line */}
      <div style={{
        position: "absolute", top: 56, left: 0, right: 0, height: 1, zIndex: 1,
        background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(16,185,129,0.15), transparent)",
      }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "72px 24px",
        width: "100%", position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", gap: 64,
      }} className="th-inner">

        {/* ── Left: Text ───────────────────────────────────────────── */}
        <div className="th-text" style={{ flex: "0 0 auto", maxWidth: 540 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 4,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              marginBottom: 28,
            }}
          >
            <Calculator style={{ width: 13, height: 13, color: "#10B981" }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#10B981",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Tax &amp; Accounting RAG · Vision AI
            </span>
          </motion.div>

          {/* Headline */}
          {[
            { text: "복잡한 세법 속", color: "white" },
            { text: "숨겨진 절세 기회,", color: "white" },
            { text: "AI가 찾아드립니다.", color: "#10B981" },
          ].map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.12 }}
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900,
                letterSpacing: "-0.05em", lineHeight: 1.1,
                color: line.color,
                marginBottom: i === 2 ? 28 : 4,
                textShadow: i === 2 ? "0 0 32px rgba(16,185,129,0.4)" : undefined,
              }}
            >{line.text}</motion.div>
          ))}

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.08rem)",
              color: "rgba(148,163,184,0.8)", lineHeight: 1.9, marginBottom: 44,
            }}
          >
            연평균 12회 이상 개정되는 세법, 쌓이는 가산세 리스크,<br />
            놓치기 쉬운 공제 항목 — Vision AI가 실시간으로 탐지합니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="th-btns"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 60 }}
          >
            <button onClick={() => onConsult()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 30px", borderRadius: 8, border: "none",
                background: "#10B981", color: "white",
                fontSize: 14, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 24px rgba(16,185,129,0.45)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#10B981"; e.currentTarget.style.transform = "none"; }}
            >
              무료 절세 진단 신청 <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
            <button onClick={() => document.getElementById("tax-rag-demo")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 26px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 700, cursor: "pointer",
                backdropFilter: "blur(8px)", transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <TrendingUp style={{ width: 14, height: 14 }} /> RAG 근거 시연보기
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="th-stats" style={{ display: "flex", flexWrap: "wrap", gap: "14px 40px" }}>
              {STATS.map((s) => (
                <div key={s.value}>
                  <div style={{
                    fontSize: "clamp(1.5rem, 2.8vw, 2rem)", fontWeight: 900,
                    color: "#10B981", lineHeight: 1, letterSpacing: "-0.04em",
                    textShadow: "0 0 20px rgba(16,185,129,0.5)",
                  }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(148,163,184,0.55)", marginTop: 5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: Animated chart dashboard ──────────────────────── */}
        <motion.div
          className="th-chart"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: 1, position: "relative" }}
        >
          {/* Dashboard card */}
          <div style={{
            padding: "28px 28px 16px",
            borderRadius: 16,
            background: "rgba(30,41,59,0.7)",
            border: "1px solid rgba(51,65,85,0.8)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: "0.08em", marginBottom: 3 }}>
                  절세 효과 분석 리포트
                </div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)" }}>
                  2024.07 — 2024.12 · AI 자동 생성
                </div>
              </div>
              <div style={{
                padding: "4px 10px", borderRadius: 4,
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                fontSize: 10, fontWeight: 700, color: "#10B981",
              }}>LIVE</div>
            </div>

            {/* Cumulative saving callout */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 8, marginBottom: 20,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <TrendingUp style={{ width: 18, height: 18, color: "#10B981", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981", letterSpacing: "-0.04em" }}>
                  ₩4억 3,900만
                </div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", marginTop: 1 }}>6개월 누적 절세액 · 전년 대비 +62%</div>
              </div>
            </motion.div>

            {/* Bar chart */}
            <TaxBarChart active={chartActive} />
          </div>

          {/* Floating badges */}
          {BADGES.map((b, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: b.delay, type: "spring", stiffness: 200, damping: 18 }}
              style={{
                position: "absolute", left: b.x, top: b.y,
                padding: "5px 10px", borderRadius: 6,
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(16,185,129,0.35)",
                fontSize: 11, fontWeight: 700, color: "#10B981",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                whiteSpace: "nowrap",
              }}
            >
              {b.text}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        }}
      >
        <span style={{ fontSize: 10, color: "rgba(148,163,184,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
          <ChevronDown style={{ width: 16, height: 16, color: "rgba(148,163,184,0.3)" }} />
        </motion.div>
      </motion.div>
    </section>

    <style>{`
      @media (max-width: 1024px) {
        .th-chart { display: none !important; }
        .th-inner { justify-content: center !important; }
        .th-text  { max-width: 100% !important; }
      }
      @media (max-width: 768px) {
        .th-section { padding-top: 56px !important; }
        .th-btns { flex-direction: column !important; }
        .th-btns button { width: 100% !important; justify-content: center !important; }
        .th-stats { gap: 10px 28px !important; }
      }
    `}</style>
    </>
  );
}
