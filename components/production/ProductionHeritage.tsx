"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, BarChart2, Film, FileText, TrendingUp, Palette, Cpu, X, Check } from "lucide-react";

/* ── Document nodes positioned around central AI chip ── */
interface DocNode {
  angle: number; // degrees
  Icon: React.ElementType;
  name: string;
  color: string;
}

const DOCS: DocNode[] = [
  { angle: -90,  Icon: BookOpen,    name: "브랜드 가이드라인.pdf",  color: "#0EA5E9" },
  { angle: -30,  Icon: BarChart2,   name: "ROAS 성과 데이터.xlsx",  color: "#22C55E" },
  { angle: 30,   Icon: Film,        name: "캠페인 아카이브.zip",    color: "#F43F5E" },
  { angle: 90,   Icon: FileText,    name: "카피 히스토리.doc",      color: "#8B5CF6" },
  { angle: 150,  Icon: TrendingUp,  name: "매체 분석 리포트.pdf",   color: "#F59E0B" },
  { angle: 210,  Icon: Palette,     name: "비주얼 아이덴티티.ai",   color: "#EC4899" },
];

/* ── Floating background particles (CSS keyframes) ── */
const BG_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: Math.random() * 12 + 8,
  delay: Math.random() * 8,
}));

/* ── Chip Animation (SVG lines + positioned doc cards) ── */
const CHIP_R = 128; // orbit radius
const CX = 180;     // center x in SVG
const CY = 180;     // center y in SVG

function deg2rad(d: number) { return d * Math.PI / 180; }

function ChipAnimation() {
  return (
    <div style={{ position: "relative", width: 360, height: 360, margin: "0 auto" }}>
      {/* SVG: connecting lines + animated data dots */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        viewBox="0 0 360 360"
      >
        <defs>
          {DOCS.map((d, i) => (
            <linearGradient key={i} id={`lg${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={d.color} stopOpacity="0" />
              <stop offset="50%" stopColor={d.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={d.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {DOCS.map((doc, i) => {
          const rad = deg2rad(doc.angle);
          const dx = CX + Math.cos(rad) * CHIP_R;
          const dy = CY + Math.sin(rad) * CHIP_R;
          const pathD = `M ${dx} ${dy} L ${CX} ${CY}`;
          return (
            <g key={i}>
              {/* Static dashed line */}
              <line
                x1={dx} y1={dy} x2={CX} y2={CY}
                stroke={doc.color} strokeWidth="0.7" strokeOpacity="0.18" strokeDasharray="5 5"
              />
              {/* Animated data dot */}
              <circle r="2.5" fill={doc.color} opacity="0.85">
                <animateMotion dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" path={pathD} />
              </circle>
              {/* Second dot with offset */}
              <circle r="1.5" fill={doc.color} opacity="0.45">
                <animateMotion
                  dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" path={pathD}
                  begin={`${(2.2 + i * 0.35) * 0.5}s`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Central AI Chip */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(14,165,233,0.5), 0 0 24px rgba(14,165,233,0.2)",
            "0 0 0 14px rgba(14,165,233,0), 0 0 48px rgba(14,165,233,0.4)",
            "0 0 0 0 rgba(14,165,233,0.5), 0 0 24px rgba(14,165,233,0.2)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 76, height: 76, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(139,92,246,0.18))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(14,165,233,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Circuit grid overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }} viewBox="0 0 76 76">
          <line x1="38" y1="8" x2="38" y2="68" stroke="#0EA5E9" strokeWidth="0.6" />
          <line x1="8" y1="38" x2="68" y2="38" stroke="#0EA5E9" strokeWidth="0.6" />
          <line x1="18" y1="18" x2="58" y2="58" stroke="#0EA5E9" strokeWidth="0.4" />
          <line x1="58" y1="18" x2="18" y2="58" stroke="#0EA5E9" strokeWidth="0.4" />
          <circle cx="38" cy="38" r="16" stroke="#0EA5E9" strokeWidth="0.6" fill="none" />
        </svg>
        <Cpu style={{ width: 32, height: 32, color: "#0EA5E9", position: "relative", zIndex: 1 }} />
      </motion.div>

      {/* Document cards — positioned around the chip */}
      {DOCS.map((doc, i) => {
        const rad = deg2rad(doc.angle);
        const cx = 50 + (Math.cos(rad) * CHIP_R / 360) * 100; // % from left
        const cy = 50 + (Math.sin(rad) * CHIP_R / 360) * 100; // % from top
        const dx = CX + Math.cos(rad) * CHIP_R;
        const dy = CY + Math.sin(rad) * CHIP_R;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
            style={{
              position: "absolute",
              left: `${(dx / 360) * 100}%`,
              top: `${(dy / 360) * 100}%`,
              transform: "translate(-50%, -50%)",
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 9px",
              background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)",
              border: `1px solid ${doc.color}30`,
              borderRadius: 7, zIndex: 1, whiteSpace: "nowrap",
            }}
          >
            <doc.Icon style={{ width: 11, height: 11, color: doc.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{doc.name}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Comparison cards ── */
const PROBLEMS = [
  "브랜드의 과거 캠페인을 전혀 알지 못한다",
  "10년 전 슬로건과 현재 보이스가 연결되지 않는다",
  "클라이언트마다 동일한 제네릭 아이디어를 제안한다",
  "이전 캠페인의 실패 이유를 반영하지 못한다",
];
const SOLUTIONS = [
  "지난 10년 캠페인 데이터를 구조화하여 학습",
  "시대별 브랜드 진화 맥락을 인식한 제안",
  "브랜드 DNA에서 추출한 고유 아이디어 생성",
  "이전 실패 패턴을 파악하여 반복을 방지",
];

export default function ProductionHeritage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const py1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const py2 = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const py3 = useTransform(scrollYProgress, [0, 1], [40, -50]);

  return (
    <>
    <section ref={sectionRef} className="phe-section" style={{ background: "#0F172A", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Accent lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.2), rgba(139,92,246,0.2), transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)" }} />

      {/* Floating background particles (parallax) */}
      {BG_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute", left: `${p.x}%`,
            top: `${p.y}%`,
            y: p.id % 3 === 0 ? py1 : p.id % 3 === 1 ? py2 : py3,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.id % 2 === 0 ? "#0EA5E9" : "#8B5CF6",
            opacity: 0.2,
            pointerEvents: "none",
          }}
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ repeat: Infinity, duration: p.dur, delay: p.delay }}
        />
      ))}

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.22)", borderRadius: 4, marginBottom: 24 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", boxShadow: "0 0 8px #0EA5E9" }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(14,165,233,0.85)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Brand Heritage Analysis</span>
          </div>

          {/* Gradient glow headline */}
          <h2 style={{
            fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 18, lineHeight: 1.1,
            background: "linear-gradient(90deg, #0EA5E9 0%, #A78BFA 50%, #38BDF8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 28px rgba(14,165,233,0.45))",
          }}>
            브랜드의 DNA를 학습한 AI
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.05rem)", color: "rgba(148,163,184,0.6)", maxWidth: 540, margin: "0 auto", lineHeight: 1.9 }}>
            일반 AI는 브랜드의 과거를 모릅니다.<br />
            Vision AI는 귀사의 지난 10년 캠페인 데이터를 학습하여<br />
            가장 브랜드다운 아이디어를 제안합니다.
          </p>
        </motion.div>

        {/* Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="phe-chip-wrap" style={{ marginBottom: 72 }}
        >
          <ChipAnimation />
          {/* Caption */}
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(148,163,184,0.4)", marginTop: 20, fontWeight: 600, letterSpacing: "0.04em" }}>
            사내 자산 → RAG 인덱싱 → Brand-Specific AI 엔진 구축
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="phe-comparison" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Left — General AI */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              background: "rgba(239,68,68,0.04)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(239,68,68,0.14)", borderRadius: 16, padding: "32px",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, rgba(239,68,68,0.5), transparent)" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 6, marginBottom: 20 }}>
              <X style={{ width: 12, height: 12, color: "#EF4444" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444" }}>일반 AI</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PROBLEMS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <div style={{ width: 22, height: 22, background: "rgba(239,68,68,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <X style={{ width: 10, height: 10, color: "#EF4444" }} />
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(148,163,184,0.75)", lineHeight: 1.65, margin: 0 }}>{p}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Vision AI */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              background: "rgba(14,165,233,0.04)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(14,165,233,0.18)", borderRadius: 16, padding: "32px",
              position: "relative", overflow: "hidden",
              boxShadow: "0 8px 40px rgba(14,165,233,0.08)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.28)", borderRadius: 6, marginBottom: 20 }}>
              <Check style={{ width: 12, height: 12, color: "#0EA5E9" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0EA5E9" }}>Vision AI — Brand RAG</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SOLUTIONS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <div style={{ width: 22, height: 22, background: "rgba(14,165,233,0.12)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 10, height: 10, color: "#0EA5E9" }} />
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(226,232,240,0.82)", lineHeight: 1.65, margin: 0 }}>{s}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .phe-section { padding: 60px 16px !important; }
        .phe-chip-wrap { margin-bottom: 40px !important; }
        .phe-chip-wrap > div { transform: scale(0.72); transform-origin: center top; margin-bottom: -64px; }
        .phe-comparison { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
