"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertOctagon, FileWarning, Lightbulb } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} as const;
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

const CHALLENGES = [
  {
    icon: AlertOctagon,
    accent: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.18)",
    tag: "가산세 리스크",
    title: "연 12회 개정되는 세법,\n놓치면 수천만 원 가산세",
    body: "법인세·부가세·소득세법은 매년 수차례 개정됩니다. 담당자가 바뀌거나 개정 시점을 놓치는 순간, 잘못된 신고로 가산세와 세무조사 리스크가 동시에 발생합니다.",
    stat: "연평균 12회+",
    statLabel: "주요 세법 개정 횟수",
  },
  {
    icon: FileWarning,
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.18)",
    tag: "공제 누락 손실",
    title: "모르고 지나친 공제 항목,\n절세 기회가 사라진다",
    body: "R&D 세액공제, 고용증대 세액공제, 중소기업 특별감면 — 복잡한 요건과 증빙 기준 때문에 실제 적용 가능한 기업의 60% 이상이 혜택을 받지 못하고 있습니다.",
    stat: "60%+",
    statLabel: "공제 미적용 기업 비율",
  },
];

export default function TaxChallenge() {
  return (
    <>
    <section className="tc-section" style={{ background: "#0A1628", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          variants={containerVariants} initial="hidden"
          whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div variants={itemVariants} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              The Challenge
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants} style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "white", lineHeight: 1.25, marginBottom: 16,
          }}>
            세무/회계팀이 풀지 못한<br />두 가지 구조적 문제
          </motion.h2>

          <motion.p variants={itemVariants} style={{
            fontSize: "clamp(0.9rem, 1.7vw, 1rem)",
            color: "rgba(148,163,184,0.55)", lineHeight: 1.8,
          }}>
            사람의 기억과 수작업에 의존하는 세무 관리, 이제 AI로 전환할 시점입니다.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="tc-grid"
          variants={containerVariants} initial="hidden"
          whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 52 }}
        >
          {CHALLENGES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={i} variants={itemVariants} style={{
                padding: "36px 32px", borderRadius: 12,
                background: c.bg, border: `1px solid ${c.border}`,
                position: "relative", overflow: "hidden",
              }}>
                {/* Top accent bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${c.accent}, transparent)`,
                }} />

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "4px 12px", borderRadius: 4,
                  background: `${c.accent}15`, border: `1px solid ${c.accent}30`,
                  marginBottom: 20,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.accent, letterSpacing: "0.08em" }}>{c.tag}</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                  <Icon style={{ width: 26, height: 26, color: c.accent, flexShrink: 0, marginTop: 2 }} />
                  <h3 style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 800,
                    color: "white", lineHeight: 1.4, whiteSpace: "pre-line",
                  }}>{c.title}</h3>
                </div>

                <p style={{ fontSize: 14, color: "rgba(148,163,184,0.7)", lineHeight: 1.85, marginBottom: 28 }}>
                  {c.body}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: "2rem", fontWeight: 900, color: c.accent, letterSpacing: "-0.04em" }}>
                    {c.stat}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(148,163,184,0.45)", fontWeight: 500 }}>
                    {c.statLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Solution banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            padding: "26px 32px", borderRadius: 10,
            background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.22)",
            display: "flex", alignItems: "center", gap: 18,
          }}
        >
          <div style={{
            flexShrink: 0, width: 42, height: 42, borderRadius: "50%",
            background: "rgba(16,185,129,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lightbulb style={{ width: 20, height: 20, color: "#10B981" }} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: "white", marginBottom: 5 }}>
              Vision AI가 두 문제를 동시에 해결합니다.
            </div>
            <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", lineHeight: 1.75 }}>
              실시간 개정 세법 탐지부터 숨겨진 공제 항목 자동 발굴까지 — 세무/회계 특화 RAG 엔진이 기업 데이터에 맞춰 즉시 작동합니다.
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 768px) {
        .tc-section { padding: 70px 24px !important; }
        .tc-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
