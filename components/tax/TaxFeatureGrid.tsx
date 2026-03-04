"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  RefreshCw, FileSearch, PieChart,
  CheckCircle2, X, Clock, TrendingUp,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} as const;
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

/* ── Mini-visuals for each feature card ─────────────────────────────────── */

// Feature 1: Latest Tax Law — shows a "law update feed"
function LawUpdateFeed() {
  const updates = [
    { date: "2024.01", law: "법인세법 §25 개정", status: "반영" },
    { date: "2024.06", law: "부가가치세법 §61 신설", status: "반영" },
    { date: "2024.09", law: "소득세법 시행령 §41 개정", status: "반영" },
  ];
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
      {updates.map((u, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 10px", borderRadius: 6,
            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
          }}
        >
          <CheckCircle2 style={{ width: 13, height: 13, color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: "#334155", flex: 1, fontWeight: 500 }}>{u.law}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#10B981",
            padding: "2px 6px", borderRadius: 3, background: "rgba(16,185,129,0.1)",
          }}>{u.status}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.65 }}
        style={{
          display: "flex", alignItems: "center", gap: 6, marginTop: 2,
          fontSize: 11, color: "#94A3B8",
        }}
      >
        <Clock style={{ width: 11, height: 11 }} />
        마지막 업데이트: 방금 전 · 자동 동기화 중
      </motion.div>
    </div>
  );
}

// Feature 2: Document classification — shows a before/after
function DocClassifyDemo() {
  const docs = [
    { name: "거래명세서_2024Q4.pdf", cat: "매입 증빙", ok: true },
    { name: "접대비_영수증_11월.jpg", cat: "접대비 한도 초과", ok: false },
    { name: "급여이체확인서.xlsx",    cat: "인건비 증빙", ok: true },
    { name: "세금계산서_1234.pdf",    cat: "부가세 매출", ok: true },
  ];
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 5 }}>
      {docs.map((d, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.35 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 10px", borderRadius: 6,
            background: d.ok ? "#F0FDF4" : "#FEF2F2",
            border: `1px solid ${d.ok ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}`,
          }}
        >
          {d.ok
            ? <CheckCircle2 style={{ width: 12, height: 12, color: "#10B981", flexShrink: 0 }} />
            : <X style={{ width: 12, height: 12, color: "#EF4444", flexShrink: 0 }} />}
          <span style={{ fontSize: 10.5, color: "#475569", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.name}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, flexShrink: 0,
            color: d.ok ? "#059669" : "#DC2626",
          }}>{d.cat}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Feature 3: Tax simulation — simple comparison bars
function TaxSimDemo() {
  const scenarios = [
    { label: "현재 방식", amount: 82, color: "#94A3B8" },
    { label: "R&D 공제 적용", amount: 57, color: "#10B981" },
    { label: "고용증대 추가", amount: 43, color: "#059669" },
  ];
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      {scenarios.map((s, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: s.color }}>₩{s.amount}M</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${s.amount}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%", borderRadius: 3, background: s.color }}
            />
          </div>
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.8 }}
        style={{
          display: "flex", alignItems: "center", gap: 6, marginTop: 4,
          padding: "8px 12px", borderRadius: 6,
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <TrendingUp style={{ width: 13, height: 13, color: "#10B981" }} />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#059669" }}>
          최적 시나리오 적용 시 ₩39M 절세
        </span>
      </motion.div>
    </div>
  );
}

/* ── Feature cards data ────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: RefreshCw,
    tag: "Real-time Update",
    title: "최신 세법 자동 반영",
    body: "개정 세법, 국세청 예규, 판례가 실시간으로 RAG DB에 업데이트됩니다. 담당자가 바뀌어도 항상 최신 기준으로 분석합니다.",
    accent: "#10B981",
    mini: <LawUpdateFeed />,
    featured: true,
  },
  {
    icon: FileSearch,
    tag: "Auto Classification",
    title: "증빙 자동 분류",
    body: "PDF·엑셀·이미지 형태의 증빙 서류를 AI가 즉시 분류합니다. 접대비 한도 초과, 누락 증빙을 사전에 탐지합니다.",
    accent: "#334155",
    mini: <DocClassifyDemo />,
    featured: false,
  },
  {
    icon: PieChart,
    tag: "Tax Simulation",
    title: "절세 시뮬레이션",
    body: "적용 가능한 모든 공제·감면 항목을 조합해 최적 절세 시나리오를 자동 산출합니다. ROI까지 수치로 확인하세요.",
    accent: "#10B981",
    mini: <TaxSimDemo />,
    featured: false,
  },
];

/* ── Component ─────────────────────────────────────────────────────────── */
export default function TaxFeatureGrid() {
  return (
    <>
    <section className="tfg-section" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
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
            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Core Features
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants} style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16,
          }}>
            세 가지 AI 엔진으로<br />세무 리스크를 원천 차단합니다
          </motion.h2>

          <motion.p variants={itemVariants} style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8,
          }}>
            법령 업데이트 · 증빙 분류 · 절세 최적화 — 세무 업무 전 사이클을 자동화합니다.
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          className="tfg-grid"
          variants={containerVariants} initial="hidden"
          whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr 1fr", gap: 20 }}
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const rgb = f.accent === "#10B981" ? "16,185,129" : "51,65,85";
            return (
              <motion.div key={i} variants={itemVariants}
                style={{
                  padding: "32px 28px", borderRadius: 14,
                  background: f.featured
                    ? "linear-gradient(145deg, #F0FDF4, #DCFCE7)"
                    : "#F8FAFC",
                  border: f.featured
                    ? "1px solid rgba(16,185,129,0.2)"
                    : "1px solid #E2E8F0",
                  position: "relative", overflow: "hidden",
                  cursor: "default",
                }}
                whileHover={{ y: -3, boxShadow: `0 8px 32px rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.3)` }}
              >
                {f.featured && (
                  <div style={{
                    position: "absolute", bottom: -40, right: -40,
                    width: 180, height: 180,
                    background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)",
                    borderRadius: "50%", pointerEvents: "none",
                  }} />
                )}

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "4px 11px", borderRadius: 4,
                  background: `rgba(${rgb},0.09)`,
                  border: `1px solid rgba(${rgb},0.2)`,
                  marginBottom: 18,
                }}>
                  <Icon style={{ width: 13, height: 13, color: f.accent }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: f.accent, letterSpacing: "0.08em" }}>{f.tag}</span>
                </div>

                <h3 style={{
                  fontSize: "clamp(1.1rem, 1.9vw, 1.3rem)", fontWeight: 900,
                  color: "#0F172A", marginBottom: 10, lineHeight: 1.3,
                }}>{f.title}</h3>

                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>{f.body}</p>

                {f.mini}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 1024px) {
        .tfg-section { padding: 70px 24px !important; }
        .tfg-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 640px) {
        .tfg-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
