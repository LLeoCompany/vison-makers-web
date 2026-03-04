"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, FileCheck, TrendingDown, RefreshCw, ArrowRight } from "lucide-react";

/* ── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, start]);
  return count;
}

/* ── KPI data ───────────────────────────────────────────────────────────── */
const KPIS = [
  {
    icon: FileCheck,
    value: 90, unit: "%", suffix: " 감소",
    label: "신고 오류율",
    detail: "AI 사전 검증 기반",
    accent: "#10B981",
    rgb: "16,185,129",
  },
  {
    icon: Clock,
    value: 5, unit: "초", suffix: "",
    label: "세법 조항 검색",
    detail: "전체 세법 DB 실시간 탐색",
    accent: "#10B981",
    rgb: "16,185,129",
  },
  {
    icon: TrendingDown,
    value: 70, unit: "%", suffix: " 절감",
    label: "세무 업무 시간",
    detail: "평균 3일 → 반나절",
    accent: "#334155",
    rgb: "51,65,85",
  },
  {
    icon: RefreshCw,
    value: 100, unit: "%", suffix: "",
    label: "개정 세법 자동 반영",
    detail: "고시 즉시 RAG DB 업데이트",
    accent: "#10B981",
    rgb: "16,185,129",
  },
];

function KPICard({ kpi, delay, started }: { kpi: typeof KPIS[0]; delay: number; started: boolean }) {
  const count = useCountUp(kpi.value, 1400, started);
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.55, delay }}
      style={{
        padding: "30px 26px", borderRadius: 12, background: "white",
        border: "1px solid #E2E8F0", position: "relative", overflow: "hidden",
      }}
      whileHover={{ y: -3, boxShadow: `0 8px 28px rgba(${kpi.rgb},0.12)`, borderColor: `rgba(${kpi.rgb},0.3)` }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${kpi.accent}, transparent)`,
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 8, flexShrink: 0,
          background: `rgba(${kpi.rgb},0.1)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon style={{ width: 20, height: 20, color: kpi.accent }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", lineHeight: 1.3 }}>{kpi.label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 8 }}>
        <span style={{ fontSize: "2.8rem", fontWeight: 900, color: kpi.accent, lineHeight: 1, letterSpacing: "-0.04em" }}>
          {count}
        </span>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: kpi.accent }}>{kpi.unit}</span>
        {kpi.suffix && (
          <span style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", marginLeft: 4 }}>{kpi.suffix}</span>
        )}
      </div>

      <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{kpi.detail}</div>
    </motion.div>
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */
interface Props { onConsult: (msg?: string) => void }

export default function TaxDashboard({ onConsult }: Props) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <section className="td-section" style={{ background: "#F8FAFC", padding: "100px 24px" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Performance Dashboard
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16,
          }}>
            숫자로 증명하는<br />Vision AI 세무 도입 효과
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8 }}>
            실제 세무/회계법인 도입 사례 기반 평균 수치입니다.
          </p>
        </motion.div>

        {/* KPI grid */}
        <div className="td-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 52 }}>
          {KPIS.map((kpi, i) => (
            <KPICard key={i} kpi={kpi} delay={i * 0.2} started={started} />
          ))}
        </div>

        {/* ROI strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            padding: "28px 32px", borderRadius: 12,
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginBottom: 6, letterSpacing: "0.05em" }}>
              평균 투자 회수 기간
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", letterSpacing: "-0.05em" }}>
                4.2
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#10B981" }}>개월</span>
              <span style={{ fontSize: 13, color: "rgba(148,163,184,0.5)" }}>도입 비용 기준 ROI</span>
            </div>
          </div>
          <div style={{ width: 1, height: 52, background: "rgba(51,65,85,0.6)" }} className="td-divider" />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", lineHeight: 1.7 }}>
              세무 신고 오류 1건 당 평균 가산세 <span style={{ color: "white", fontWeight: 700 }}>₩1,200만</span> 절감,<br />
              누락 공제 발굴로 연 평균 <span style={{ color: "#10B981", fontWeight: 800 }}>₩3.8억</span> 절세 효과.
            </div>
          </div>
          <button
            onClick={() => onConsult("[세무/회계 RAG] 도입 ROI 시뮬레이션을 요청드립니다.\n당사 업종·규모에 맞는 절세 예상액을 확인하고 싶습니다.")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 8, border: "none",
              background: "#10B981", color: "white",
              fontSize: 13, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
              transition: "all 0.2s", flexShrink: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#10B981"; e.currentTarget.style.transform = "none"; }}
          >
            <ArrowRight style={{ width: 14, height: 14 }} /> ROI 시뮬레이션 신청
          </button>
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 900px) {
        .td-section { padding: 70px 24px !important; }
        .td-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .td-divider { display: none !important; }
      }
      @media (max-width: 480px) {
        .td-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
