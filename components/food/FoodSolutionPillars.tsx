"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FlaskConical, MessageCircle, Check, X, Search } from "lucide-react";

/* ── Stagger variants ────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} as const;

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

/* ── Compliance rows ─────────────────────────────────────────────────── */
const COMPLIANCE_ROWS = [
  { label: "피로 회복에 탁월한 효과", ok: false, note: "의약품 오인 우려" },
  { label: "면역력 강화에 도움",       ok: false, note: "기능성 표현 제한" },
  { label: "활력 증진에 도움을 줄 수 있는", ok: true, note: "식품공전 기준 적합" },
  { label: "100% 국내산 원재료 사용",  ok: true,  note: "원산지 표기 준수" },
];

const ROW_H = 38; // px per row (approximate)
const HEADER_H = 36; // header height

/* ── Magnifying Glass scanner ────────────────────────────────────────── */
function ComplianceMagnifier() {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Loop: scan → pause per row → reset */
  useEffect(() => {
    let cancelled = false;

    async function runLoop() {
      while (!cancelled) {
        setScanning(true);
        setActiveRow(null);
        // move over each row
        for (let r = 0; r < COMPLIANCE_ROWS.length; r++) {
          if (cancelled) return;
          await new Promise<void>(res => { timerRef.current = setTimeout(res, 680); });
          if (cancelled) return;
          setActiveRow(r);
          await new Promise<void>(res => { timerRef.current = setTimeout(res, 520); });
        }
        if (cancelled) return;
        setScanning(false);
        // pause before next loop
        await new Promise<void>(res => { timerRef.current = setTimeout(res, 1600); });
      }
    }

    const delay = setTimeout(() => { runLoop(); }, 900);
    return () => {
      cancelled = true;
      clearTimeout(delay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* Y position of magnifier: header + row mid-point */
  const magY = activeRow !== null
    ? HEADER_H + activeRow * ROW_H + ROW_H / 2
    : scanning ? HEADER_H - 12 : HEADER_H - 12;

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(13,148,136,0.15)", position: "relative" }}>

      {/* Table header */}
      <div style={{
        padding: "10px 14px",
        background: "rgba(13,148,136,0.08)",
        fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.06em",
        borderBottom: "1px solid rgba(13,148,136,0.12)",
        height: HEADER_H,
        display: "flex", alignItems: "center",
      }}>
        광고 문구 실시간 검토
      </div>

      {/* Rows */}
      {COMPLIANCE_ROWS.map((row, i) => (
        <motion.div
          key={i}
          animate={{
            background: activeRow === i
              ? row.ok
                ? "rgba(34,197,94,0.08)"
                : "rgba(239,68,68,0.08)"
              : i % 2 === 0 ? "white" : "rgba(248,250,252,0.8)",
          }}
          transition={{ duration: 0.25 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 14px",
            height: ROW_H,
            borderBottom: i < COMPLIANCE_ROWS.length - 1 ? "1px solid rgba(226,232,240,0.6)" : "none",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            {activeRow === i ? (
              <motion.div
                key="badge"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {row.ok
                  ? <Check style={{ width: 14, height: 14, color: "#22C55E", flexShrink: 0 }} />
                  : <X     style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0 }} />}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {row.ok
                  ? <Check style={{ width: 14, height: 14, color: "#22C55E", flexShrink: 0 }} />
                  : <X     style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0 }} />}
              </motion.div>
            )}
          </AnimatePresence>

          <span style={{ fontSize: 12.5, color: "#334155", flex: 1, lineHeight: 1.4 }}>{row.label}</span>

          <AnimatePresence>
            {activeRow === i && (
              <motion.span
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: 10.5, fontWeight: 700, flexShrink: 0,
                  color: row.ok ? "#22C55E" : "#EF4444",
                  padding: "2px 7px", borderRadius: 3,
                  background: row.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                }}
              >{row.note}</motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Magnifying glass icon — slides down the rows */}
      <motion.div
        animate={{ y: magY, opacity: scanning || activeRow !== null ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{
          position: "absolute",
          right: 10,
          top: -18,
          width: 32, height: 32,
          borderRadius: "50%",
          background: "white",
          border: "1.5px solid rgba(13,148,136,0.4)",
          boxShadow: "0 2px 12px rgba(13,148,136,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <Search style={{ width: 15, height: 15, color: "#0D9488" }} />
      </motion.div>

      {/* Scan line — horizontal sweep */}
      <AnimatePresence>
        {scanning && activeRow === null && (
          <motion.div
            key="scanline"
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: HEADER_H,
              left: 0, right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, #0D9488, #22C55E, transparent)",
              transformOrigin: "left center",
              pointerEvents: "none", zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Right side solution cards ────────────────────────────────────────── */
const RIGHT_CARDS = [
  {
    icon: FlaskConical,
    tag: "R&D Asset",
    title: "레시피 자산화",
    body: "수천 개의 배합비·공정 데이터를 구조화 DB로 전환합니다. 유사 레시피 추천 및 최적 배합비 제안까지 자동화합니다.",
    accent: "#0D9488",
  },
  {
    icon: MessageCircle,
    tag: "Smart CS",
    title: "지능형 CS 대응",
    body: "전 성분 데이터를 바탕으로 알레르기·원산지·영양성분 문의에 100% 팩트 기반으로 자동 응답합니다.",
    accent: "#22C55E",
  },
];

/* ── Main component ───────────────────────────────────────────────────── */
export default function FoodSolutionPillars() {
  return (
    <>
    <section className="fsp-section" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div variants={itemVariants} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.1em", textTransform: "uppercase" }}>Solution Pillars</span>
          </motion.div>

          <motion.h2 variants={itemVariants} style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16,
          }}>
            세 가지 AI 엔진으로<br />식품업 전반을 커버합니다
          </motion.h2>

          <motion.p variants={itemVariants} style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8,
          }}>
            법규 준수 · R&amp;D 자산화 · 지능형 CS — 하나의 플랫폼으로 통합 관리합니다.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <div className="fsp-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>

          {/* Featured: Compliance + magnifier */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              padding: "40px 36px", borderRadius: 14,
              background: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
              border: "1px solid rgba(13,148,136,0.18)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", bottom: -40, right: -40, width: 200, height: 200,
              background: "radial-gradient(ellipse, rgba(13,148,136,0.12) 0%, transparent 65%)",
              borderRadius: "50%", pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "4px 12px", borderRadius: 4,
              background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.2)",
              marginBottom: 20,
            }}>
              <ShieldCheck style={{ width: 13, height: 13, color: "#0D9488" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.08em" }}>Compliance AI</span>
            </div>

            <h3 style={{
              fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 900,
              color: "#0F172A", lineHeight: 1.3, marginBottom: 10,
            }}>
              실시간 법규 준수
            </h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
              표시광고법·HACCP 기준·식품위생법을 실시간으로 대조합니다.
              돋보기 AI가 광고 문구 위를 스캔하며 위반 리스크를 즉시 감지합니다.
            </p>

            {/* Animated compliance table */}
            <ComplianceMagnifier />
          </motion.div>

          {/* Right: staggered cards */}
          <motion.div
            className="fsp-right"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {RIGHT_CARDS.map((card, i) => {
              const Icon = card.icon;
              const rgb = card.accent === "#0D9488" ? "13,148,136" : "34,197,94";
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  style={{
                    flex: 1, padding: "28px 28px", borderRadius: 12,
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                    position: "relative", overflow: "hidden",
                    cursor: "default",
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 32px rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.3)` }}
                >
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "4px 12px", borderRadius: 4,
                    background: `rgba(${rgb},0.08)`,
                    border: `1px solid rgba(${rgb},0.2)`,
                    marginBottom: 16,
                  }}>
                    <Icon style={{ width: 14, height: 14, color: card.accent }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: card.accent, letterSpacing: "0.08em" }}>{card.tag}</span>
                  </div>

                  <h3 style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.25rem)", fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>{card.body}</p>
                </motion.div>
              );
            })}
          </motion.div>
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
