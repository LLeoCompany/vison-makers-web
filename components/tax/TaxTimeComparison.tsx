"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, TrendingUp } from "lucide-react";

/* ── Comparison data ────────────────────────────────────────────────────── */
const METRICS = [
  {
    label: "세무 검토 소요 시간",
    before: { text: "40시간", pct: 100 },
    after:  { text: "5분",    pct: 3.5 }, // visual only — 5min / 40h ≈ 0.2%, floored to 3.5% for readability
    badge: "480× 단축",
    highlight: true,
  },
  {
    label: "예규·판례 대조 정확도",
    before: { text: "60%", pct: 60 },
    after:  { text: "98%", pct: 98 },
    badge: "+63%p 향상",
    highlight: false,
  },
  {
    label: "신고 오류 사전 탐지율",
    before: { text: "45%", pct: 45 },
    after:  { text: "95%", pct: 95 },
    badge: "+111%p 향상",
    highlight: false,
  },
];

export default function TaxTimeComparison() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
    <section className="ttc-section" style={{ background: "#F8FAFC", padding: "100px 24px" }}>
      <div ref={ref} style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 4, marginBottom: 20,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
          }}>
            <Zap style={{ width: 11, height: 11, color: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Performance Benchmark
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.2, marginBottom: 14,
          }}>
            40시간이{" "}
            <span style={{
              background: "linear-gradient(90deg, #10B981, #059669)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>5분</span>
            으로
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8 }}>
            Vision AI가 실제로 가져다 주는 세무 생산성 혁신입니다.
          </p>
        </motion.div>

        {/* Metric bar charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Metric label + badge */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8,
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{m.label}</span>
                <span style={{
                  padding: "4px 12px", borderRadius: 4,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                  fontSize: 11, fontWeight: 800, color: "#059669",
                }}>{m.badge}</span>
              </div>

              {/* Before bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, width: 80, flexShrink: 0 }}>
                    <Clock style={{ width: 11, height: 11, color: "#94A3B8" }} />
                    <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>기존 방식</span>
                  </div>
                  <span style={{
                    fontSize: m.highlight ? 20 : 14, fontWeight: 900,
                    color: "#475569", letterSpacing: "-0.03em",
                  }}>{m.before.text}</span>
                </div>
                <div style={{
                  height: m.highlight ? 14 : 10, borderRadius: 7,
                  background: "#E2E8F0", overflow: "hidden",
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={started ? { width: `${m.before.pct}%` } : {}}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%", borderRadius: 7,
                      background: "linear-gradient(90deg, #CBD5E1, #94A3B8)",
                    }}
                  />
                </div>
              </div>

              {/* After bar */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, width: 80, flexShrink: 0 }}>
                    <Zap style={{ width: 11, height: 11, color: "#10B981" }} />
                    <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>Vision AI</span>
                  </div>
                  <span style={{
                    fontSize: m.highlight ? 20 : 14, fontWeight: 900,
                    color: "#059669", letterSpacing: "-0.03em",
                  }}>{m.after.text}</span>
                  {m.highlight && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={started ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.6, type: "spring" }}
                      style={{
                        padding: "3px 9px", borderRadius: 4,
                        background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                        fontSize: 12, fontWeight: 800, color: "#10B981",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}
                    >
                      <TrendingUp style={{ width: 11, height: 11 }} />
                      {m.badge}
                    </motion.span>
                  )}
                </div>
                <div style={{
                  height: m.highlight ? 14 : 10, borderRadius: 7,
                  background: "#DCFCE7", overflow: "hidden", position: "relative",
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={started ? { width: `${m.after.pct}%` } : {}}
                    transition={{ duration: 1.1, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%", borderRadius: 7,
                      background: "linear-gradient(90deg, #10B981, #34D399)",
                      boxShadow: "0 2px 10px rgba(16,185,129,0.35)",
                    }}
                  />
                  {/* Glow pulse on emerald bar */}
                  {m.highlight && started && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(90deg, transparent 80%, rgba(52,211,153,0.5))",
                        borderRadius: 7,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Divider (not last) */}
              {i < METRICS.length - 1 && (
                <div style={{ marginTop: 12, height: 1, background: "#E2E8F0" }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom callout strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: 52, padding: "20px 28px", borderRadius: 12,
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 4 }}>
              평균 세무 업무 자동화율
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
                70
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>%</span>
              <span style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>반복 업무 대체</span>
            </div>
          </div>
          <div style={{ width: 1, height: 44, background: "rgba(51,65,85,0.6)" }} className="ttc-divider" />
          <div style={{ flex: 2, minWidth: 240 }}>
            <p style={{ fontSize: 13, color: "rgba(148,163,184,0.65)", lineHeight: 1.7, margin: 0 }}>
              세무사 1인당 처리 건수 <span style={{ color: "white", fontWeight: 700 }}>3배 증가</span>, 단순 검토 업무를 AI에 위임하고
              고부가 자문에 집중하세요.
            </p>
          </div>
        </motion.div>

      </div>
    </section>

    <style>{`
      @media (max-width: 768px) {
        .ttc-section { padding: 60px 24px !important; }
        .ttc-divider { display: none !important; }
      }
      @media (max-width: 480px) {
        .ttc-section { padding: 50px 16px !important; }
      }
    `}</style>
    </>
  );
}
