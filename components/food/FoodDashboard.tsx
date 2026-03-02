"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, MessageSquare, Award } from "lucide-react";

const KPIS = [
  {
    icon: <Clock style={{ width: 22, height: 22, color: "#0D9488" }} />,
    value: 90,
    unit: "%",
    suffix: " 단축",
    label: "법무 검토 시간",
    detail: "평균 2일 → 2시간",
    accent: "#0D9488",
  },
  {
    icon: <ShieldCheck style={{ width: 22, height: 22, color: "#22C55E" }} />,
    value: 0,
    unit: "%",
    suffix: "",
    label: "레시피 배합 오차율",
    detail: "AI 기반 정밀 계산",
    accent: "#22C55E",
  },
  {
    icon: <MessageSquare style={{ width: 22, height: 22, color: "#0EA5E9" }} />,
    value: 99,
    unit: ".8%",
    suffix: "",
    label: "CS 응답 정확도",
    detail: "전 성분 DB 기반 대응",
    accent: "#0EA5E9",
  },
  {
    icon: <Award style={{ width: 22, height: 22, color: "#F59E0B" }} />,
    value: 0,
    unit: "건",
    suffix: "",
    label: "HACCP 위반 탐지",
    detail: "실시간 모니터링",
    accent: "#F59E0B",
  },
];

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

function KPICard({ kpi, delay, onStart }: { kpi: typeof KPIS[0]; delay: number; onStart: boolean }) {
  const count = useCountUp(kpi.value, 1400, onStart);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.55, delay }}
      style={{
        padding: "32px 28px", borderRadius: 12, background: "white",
        border: "1px solid #E2E8F0", position: "relative", overflow: "hidden",
        transition: "all 0.25s",
      }}
      whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(13,148,136,0.1)", borderColor: "rgba(13,148,136,0.25)" }}
    >
      {/* Accent top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${kpi.accent}, transparent)` }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0,
          background: `rgba(${
            kpi.accent === "#0D9488" ? "13,148,136" :
            kpi.accent === "#22C55E" ? "34,197,94" :
            kpi.accent === "#0EA5E9" ? "14,165,233" : "245,158,11"
          },0.1)`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {kpi.icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>{kpi.label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 8 }}>
        <span style={{ fontSize: "2.8rem", fontWeight: 900, color: kpi.accent, lineHeight: 1 }}>
          {count}
        </span>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: kpi.accent }}>{kpi.unit}</span>
        {kpi.suffix && <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", marginLeft: 4 }}>{kpi.suffix}</span>}
      </div>

      <div style={{ fontSize: 12.5, color: "#94A3B8", fontWeight: 500 }}>{kpi.detail}</div>
    </motion.div>
  );
}

interface Props { onConsult: (msg?: string) => void }

export default function FoodDashboard({ onConsult }: Props) {
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
    <section className="fd-section" style={{ background: "#F1F5F9", padding: "100px 24px" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)",
            marginBottom: 20 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>Performance Dashboard</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16 }}>
            숫자로 증명하는<br />Vision AI 도입 효과
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8 }}>
            실제 식품·유통 기업 도입 사례 기반 평균 수치입니다.
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="fd-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 52 }}>
          {KPIS.map((kpi, i) => (
            <KPICard key={i} kpi={kpi} delay={i * 0.2} onStart={started} />
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: "center" }}
        >
          <p style={{ fontSize: 15, color: "#64748B", marginBottom: 20, lineHeight: 1.7 }}>
            우리 회사에 적용하면 어떤 효과가 있을지 궁금하신가요?
          </p>
          <button onClick={() => onConsult("[식품/유통 RAG] 도입 효과 시뮬레이션을 요청드립니다.\n우리 기업의 품목 및 규모에 맞는 예상 ROI를 알고 싶습니다.")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px", borderRadius: 6, border: "none",
              background: "#0D9488", color: "white",
              fontSize: 15, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(13,148,136,0.3)",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#0F766E"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#0D9488"; e.currentTarget.style.transform = "none"; }}
          >
            <ArrowRight style={{ width: 16, height: 16 }} /> 도입 효과 시뮬레이션 신청
          </button>
        </motion.div>
      </div>
    </section>
    <style>{`
      @media (max-width: 900px) {
        .fd-section { padding: 70px 24px !important; }
        .fd-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 480px) {
        .fd-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
