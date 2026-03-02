"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Lightbulb } from "lucide-react";

const CHALLENGES = [
  {
    icon: <AlertTriangle style={{ width: 28, height: 28, color: "#EF4444" }} />,
    accent: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    tag: "법규 리스크",
    title: "수시로 바뀌는 식품위생법,\n놓치면 바로 행정처분",
    body: "식품표시기준, 표시광고법, HACCP 가이드라인은 연평균 12회 이상 개정됩니다. 담당자가 바뀔 때마다 사각지대가 생기고, 단 한 건의 위반이 브랜드 전체를 흔들 수 있습니다.",
    stat: "연평균 12회+",
    statLabel: "식품 법규 개정 횟수",
  },
  {
    icon: <BookOpen style={{ width: 28, height: 28, color: "#F59E0B" }} />,
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    tag: "R&D 자산 손실",
    title: "연구원 퇴사 한 번에\n수년 치 레시피가 사라진다",
    body: "배합비와 공정 노하우가 특정 연구원의 머릿속과 개인 파일에만 존재합니다. 퇴사·이직·인수합병 시 핵심 R&D 자산이 그대로 증발하는 구조적 리스크입니다.",
    stat: "60%+",
    statLabel: "레시피 자산 미디지털화율",
  },
];

export default function FoodChallenge() {
  return (
    <>
    <section className="fc-section" style={{
      background: "#0A1628",
      padding: "100px 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            marginBottom: 20 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>The Challenge</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "white", lineHeight: 1.25, marginBottom: 16 }}>
            식품업계가 풀지 못한<br />두 가지 고질적 문제
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.05rem)", color: "rgba(148,163,184,0.6)", lineHeight: 1.8 }}>
            기술의 문제가 아닙니다. 체계의 문제입니다.
          </p>
        </motion.div>

        {/* Challenge cards */}
        <div className="fc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 56 }}>
          {CHALLENGES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.15 }}
              style={{
                padding: "36px 32px", borderRadius: 12,
                background: c.bg, border: `1px solid ${c.border}`,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                padding: "4px 12px", borderRadius: 4,
                background: `rgba(${c.accent === "#EF4444" ? "239,68,68" : "245,158,11"},0.12)`,
                border: `1px solid ${c.border}`, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.accent, letterSpacing: "0.08em" }}>{c.tag}</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>{c.icon}</div>
                <h3 style={{ fontSize: "clamp(1.15rem, 2vw, 1.35rem)", fontWeight: 800,
                  color: "white", lineHeight: 1.4, whiteSpace: "pre-line" }}>{c.title}</h3>
              </div>

              <p style={{ fontSize: 14.5, color: "rgba(148,163,184,0.75)", lineHeight: 1.8, marginBottom: 28 }}>
                {c.body}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: c.accent }}>{c.stat}</span>
                <span style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", fontWeight: 500 }}>{c.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            padding: "28px 36px", borderRadius: 10,
            background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.25)",
            display: "flex", alignItems: "center", gap: 20,
          }}
        >
          <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
            background: "rgba(13,148,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lightbulb style={{ width: 22, height: 22, color: "#0D9488" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 6 }}>
              Vision AI가 두 문제를 동시에 해결합니다.
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(148,163,184,0.65)", lineHeight: 1.7 }}>
              실시간 법규 준수 감지부터 레시피 자산 DB화까지 — 식품·유통 특화 RAG 엔진이 기업 내부 데이터를 학습해 즉시 작동합니다.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .fc-section { padding: 70px 24px !important; }
        .fc-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
      }
    `}</style>
    </>
  );
}
