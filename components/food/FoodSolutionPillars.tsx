"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical, MessageCircle, Check, X } from "lucide-react";

const COMPLIANCE_ROWS = [
  { label: "피로 회복에 탁월한 효과", ok: false, note: "의약품 오인 우려" },
  { label: "면역력 강화에 도움",       ok: false, note: "기능성 표현 제한" },
  { label: "활력 증진에 도움을 줄 수 있는", ok: true, note: "식품공전 기준 적합" },
  { label: "100% 국내산 원재료 사용",  ok: true, note: "원산지 표기 준수" },
];

const RIGHT_CARDS = [
  {
    icon: <FlaskConical style={{ width: 22, height: 22, color: "#0D9488" }} />,
    tag: "R&D Asset",
    title: "레시피 자산화",
    body: "수천 개의 배합비·공정 데이터를 구조화 DB로 전환합니다. 유사 레시피 추천 및 최적 배합비 제안까지 자동화합니다.",
    accent: "#0D9488",
  },
  {
    icon: <MessageCircle style={{ width: 22, height: 22, color: "#22C55E" }} />,
    tag: "Smart CS",
    title: "지능형 CS 대응",
    body: "전 성분 데이터를 바탕으로 알레르기·원산지·영양성분 문의에 100% 팩트 기반으로 자동 응답합니다.",
    accent: "#22C55E",
  },
];

export default function FoodSolutionPillars() {
  return (
    <>
    <section className="fsp-section" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)",
            marginBottom: 20 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>Solution Pillars</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16 }}>
            세 가지 AI 엔진으로<br />식품업 전반을 커버합니다
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="fsp-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>

          {/* Featured: Compliance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              padding: "40px 36px", borderRadius: 14,
              background: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
              border: "1px solid rgba(13,148,136,0.18)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200,
              background: "radial-gradient(ellipse, rgba(13,148,136,0.12) 0%, transparent 65%)",
              borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
              padding: "4px 12px", borderRadius: 4,
              background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.2)",
              marginBottom: 20 }}>
              <ShieldCheck style={{ width: 13, height: 13, color: "#0D9488" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.08em" }}>Compliance</span>
            </div>

            <h3 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 900,
              color: "#0F172A", lineHeight: 1.3, marginBottom: 12 }}>
              실시간 법규 준수
            </h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
              표시광고법·HACCP 기준·식품위생법을 실시간으로 대조하여 위반 리스크를 즉시 감지합니다.
              제품 출시 전 자동 컴플라이언스 체크로 행정처분 리스크를 원천 차단합니다.
            </p>

            {/* Mini compliance table */}
            <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(13,148,136,0.15)" }}>
              <div style={{ padding: "10px 14px", background: "rgba(13,148,136,0.08)",
                fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.06em",
                borderBottom: "1px solid rgba(13,148,136,0.12)" }}>
                광고 문구 실시간 검토
              </div>
              {COMPLIANCE_ROWS.map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px",
                  background: i % 2 === 0 ? "white" : "rgba(248,250,252,0.8)",
                  borderBottom: i < COMPLIANCE_ROWS.length - 1 ? "1px solid rgba(226,232,240,0.6)" : "none",
                }}>
                  {row.ok
                    ? <Check style={{ width: 14, height: 14, color: "#22C55E", flexShrink: 0 }} />
                    : <X style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0 }} />}
                  <span style={{ fontSize: 12.5, color: "#334155", flex: 1, lineHeight: 1.4 }}>{row.label}</span>
                  <span style={{ fontSize: 11, color: row.ok ? "#22C55E" : "#EF4444", fontWeight: 600, flexShrink: 0 }}>{row.note}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: stacked cards */}
          <div className="fsp-right" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {RIGHT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.15 }}
                style={{
                  flex: 1, padding: "28px 28px", borderRadius: 12,
                  background: "#F8FAFC", border: "1px solid #E2E8F0",
                  position: "relative", overflow: "hidden",
                  transition: "all 0.25s",
                  cursor: "default",
                }}
                whileHover={{ y: -3, boxShadow: `0 8px 32px rgba(13,148,136,0.12)`, borderColor: "rgba(13,148,136,0.3)" }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "4px 12px", borderRadius: 4,
                  background: `rgba(${card.accent === "#0D9488" ? "13,148,136" : "34,197,94"},0.08)`,
                  border: `1px solid rgba(${card.accent === "#0D9488" ? "13,148,136" : "34,197,94"},0.2)`,
                  marginBottom: 16 }}>
                  {card.icon}
                  <span style={{ fontSize: 11, fontWeight: 700, color: card.accent, letterSpacing: "0.08em" }}>{card.tag}</span>
                </div>

                <h3 style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.25rem)", fontWeight: 800,
                  color: "#0F172A", marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <style>{`
      @media (max-width: 900px) {
        .fsp-section { padding: 70px 24px !important; }
        .fsp-grid { grid-template-columns: 1fr !important; }
        .fsp-right { flex-direction: row !important; }
      }
      @media (max-width: 600px) {
        .fsp-right { flex-direction: column !important; }
      }
    `}</style>
    </>
  );
}
