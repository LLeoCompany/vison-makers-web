"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet, AlertCircle, Lightbulb, CheckCircle2,
  ArrowRight, Zap, Brain, MoveHorizontal,
} from "lucide-react";

/* ── Excel rows ─────────────────────────────────────────────────────────── */
const ROWS = [
  { account: "접대비",     amount: "1,200,000", evidence: "일반영수증", status: "한도 초과",  ok: false, aiIdx: 0 },
  { account: "급여",       amount: "45,000,000",evidence: "이체확인서", status: "적격",       ok: true,  aiIdx: -1 },
  { account: "연구개발비", amount: "8,500,000", evidence: "세금계산서", status: "공제 가능",  ok: true,  aiIdx: 2 },
  { account: "임차료",     amount: "3,200,000", evidence: "계산서",     status: "적격",       ok: true,  aiIdx: -1 },
  { account: "복리후생비", amount: "780,000",   evidence: "없음",       status: "증빙 누락",  ok: false, aiIdx: 1 },
  { account: "광고선전비", amount: "12,000,000",evidence: "세금계산서", status: "적격",       ok: true,  aiIdx: -1 },
];

/* ── AI analysis results ────────────────────────────────────────────────── */
const AI_RESULTS = [
  {
    icon: AlertCircle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",
    label: "접대비 한도 초과",
    detail: "법인세법 §25 한도 초과 ₩320K — 손금불산입 처리 필요",
  },
  {
    icon: AlertCircle, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
    label: "적격증빙 누락",
    detail: "복리후생비 ₩780K — 세금계산서 미수취, 경정청구 불가",
  },
  {
    icon: Lightbulb, color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
    label: "R&D 세액공제 기회",
    detail: "조세특례제한법 §10 적용 가능 — 예상 공제액 ₩850,000",
  },
  {
    icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)",
    label: "최적화 절세 효과",
    detail: "세무조정 후 예상 절세액 ₩1,840,000",
  },
];

/* ── Data-stream connector ──────────────────────────────────────────────── */
function DataStreamConnector({ active }: { active: boolean }) {
  return (
    <div className="tei-connector" style={{
      width: 72, flexShrink: 0, alignSelf: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(16,185,129,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>RAG</span>

      {[0, 1].map(row => (
        <div key={row} style={{ position: "relative", width: 56, height: 2 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(16,185,129,0.1), rgba(16,185,129,0.5), rgba(16,185,129,0.1))",
          }} />
          {active && [0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ x: [-8, 64], opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: row * 0.7 + i * 0.46, ease: "linear" }}
              style={{
                position: "absolute", top: -3, left: 0,
                width: 8, height: 8, borderRadius: "50%",
                background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.9)",
              }}
            />
          ))}
          {row === 0 && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, calc(-50% + 16px))",
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Brain style={{ width: 15, height: 15, color: "#10B981" }} />
            </div>
          )}
        </div>
      ))}

      <div style={{
        width: 0, height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "7px solid rgba(16,185,129,0.4)",
      }} />
      <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(16,185,129,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI</span>
    </div>
  );
}

/* ── Mobile card item ───────────────────────────────────────────────────── */
function MobileRowCard({ row, i }: { row: typeof ROWS[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.35 }}
      style={{
        padding: "14px 16px", borderRadius: 10, marginBottom: 8,
        background: row.ok ? "rgba(15,23,42,0.85)" : "rgba(239,68,68,0.06)",
        border: `1.5px solid ${row.ok ? "rgba(51,65,85,0.55)" : "rgba(239,68,68,0.25)"}`,
        boxShadow: row.ok
          ? "0 2px 12px rgba(0,0,0,0.3)"
          : "0 2px 16px rgba(239,68,68,0.12)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 800, color: "white", fontSize: 14, wordBreak: "keep-all" }}>{row.account}</span>
        <span style={{
          padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 800,
          background: row.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.12)",
          border: `1px solid ${row.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
          color: row.ok ? (row.status === "공제 가능" ? "#34D399" : "rgba(148,163,184,0.6)") : "#F87171",
          flexShrink: 0,
        }}>{row.status}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", marginBottom: 2 }}>금액</div>
          <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontFamily: "monospace" }}>{row.amount}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", marginBottom: 2 }}>증빙자료</div>
          <div style={{
            fontSize: 12,
            color: row.evidence === "없음" ? "#F87171" : "rgba(148,163,184,0.8)",
            fontWeight: row.evidence === "없음" ? 700 : 400,
          }}>{row.evidence}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function TaxExcelIntegration() {
  const [scanRow, setScanRow]     = useState<number | null>(null);
  const [visibleAI, setVisibleAI] = useState<number[]>([]);
  const [started, setStarted]     = useState(false);
  const sectionRef                 = useRef<HTMLDivElement>(null);
  const timerRef                   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef               = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    cancelledRef.current = false;
    async function runScan() {
      await delay(400);
      while (!cancelledRef.current) {
        setVisibleAI([]);
        setScanRow(null);
        await delay(500);
        for (let r = 0; r < ROWS.length; r++) {
          if (cancelledRef.current) return;
          setScanRow(r);
          await delay(500);
          const aiIdx = ROWS[r].aiIdx;
          if (aiIdx >= 0) {
            setVisibleAI(prev => prev.includes(aiIdx) ? prev : [...prev, aiIdx]);
            await delay(260);
          }
        }
        setScanRow(null);
        await delay(2000);
      }
    }
    runScan();
    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started]);

  function delay(ms: number) {
    return new Promise<void>(res => { timerRef.current = setTimeout(res, ms); });
  }

  /* ── Shared AI panel ──────────────────────────────────────────────────── */
  const aiPanel = (
    <motion.div
      className="tei-ai"
      initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
      style={{ flex: 1, minWidth: 0 }}
    >
      <div style={{
        padding: "14px 18px",
        borderRadius: "12px 12px 0 0",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.2)", borderBottom: "none",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }}
        />
        <span style={{ fontSize: 12, fontWeight: 800, color: "#10B981" }}>Vision AI 분석 결과</span>
        <div style={{ marginLeft: "auto", fontSize: 10, color: "rgba(148,163,184,0.5)", fontWeight: 600 }}>실시간 탐지 중</div>
      </div>

      <div style={{
        borderRadius: "0 0 12px 12px",
        border: "1px solid rgba(16,185,129,0.2)",
        padding: "16px",
        background: "rgba(15,23,42,0.7)",
        backdropFilter: "blur(8px)",
        minHeight: 280,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_RESULTS.map((r, i) => {
            const Icon = r.icon;
            const isVisible = visibleAI.includes(i);
            return (
              <AnimatePresence key={i}>
                {isVisible ? (
                  <motion.div
                    initial={{ opacity: 0, x: 16, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      padding: "11px 13px", borderRadius: 8,
                      background: r.bg, border: `1px solid ${r.border}`,
                      overflow: "hidden",
                      boxShadow: `0 2px 12px ${r.bg.replace("0.08", "0.15")}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <Icon style={{ width: 14, height: 14, color: r.color, flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: r.color, marginBottom: 2 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", lineHeight: 1.5, wordBreak: "keep-all" }}>{r.detail}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div key={`ph-${i}`} style={{
                    padding: "12px 13px", borderRadius: 8,
                    background: "rgba(51,65,85,0.08)",
                    border: "1px solid rgba(51,65,85,0.18)",
                    height: 56,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(51,65,85,0.3)" }} />
                    <div style={{ height: 8, width: "55%", borderRadius: 4, background: "rgba(51,65,85,0.2)" }} />
                  </div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        <AnimatePresence>
          {visibleAI.length === AI_RESULTS.length && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                marginTop: 12, padding: "10px 13px", borderRadius: 8,
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.06))",
                border: "1px solid rgba(16,185,129,0.25)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(52,211,153,0.85)", fontWeight: 700 }}>
                세무조정 후 예상 절세 ₩1,840,000
              </span>
              <ArrowRight style={{ width: 12, height: 12, color: "#10B981", flexShrink: 0 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.5 }}
        style={{
          marginTop: 14, width: "100%",
          padding: "13px 20px", borderRadius: 8, border: "none",
          background: "#10B981", color: "white",
          fontSize: 13, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
          transition: "all 0.2s",
        }}
        whileHover={{ scale: 1.01, boxShadow: "0 6px 28px rgba(16,185,129,0.45)" }}
        whileTap={{ scale: 0.99 }}
      >
        <FileSpreadsheet style={{ width: 14, height: 14 }} />
        엑셀 파일 업로드 &amp; T/B 분석 시작
      </motion.button>
    </motion.div>
  );

  return (
    <>
    <section className="tei-section" style={{
      background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
      padding: "100px 24px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: [
          "linear-gradient(rgba(51,65,85,0.12) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(51,65,85,0.12) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "10%",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div ref={sectionRef} style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 4,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            marginBottom: 24,
          }}>
            <FileSpreadsheet style={{ width: 12, height: 12, color: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Excel AI Integration
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "white", lineHeight: 1.2, marginBottom: 16,
            wordBreak: "keep-all",
          }}>
            엑셀은 세무의 언어입니다
          </h2>
          <p style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "rgba(148,163,184,0.65)", lineHeight: 1.85, maxWidth: 600, margin: "0 auto",
            wordBreak: "keep-all",
          }}>
            Vision AI가 엑셀 파일을 업로드하는 순간,<br />
            경정청구 기회와 적격증빙 오류를 자동으로 탐지합니다.
          </p>
        </motion.div>

        {/* T/B Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 24px", borderRadius: 10, marginBottom: 48,
            background: "rgba(16,185,129,0.07)",
            border: "1px solid rgba(16,185,129,0.25)",
            boxShadow: "0 0 0 1px rgba(16,185,129,0.08), 0 4px 24px rgba(0,0,0,0.2)",
            flexWrap: "wrap",
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 8, flexShrink: 0,
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>📊</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "white", lineHeight: 1.5, wordBreak: "keep-all" }}>
              엑셀 업로드만으로{" "}
              <span style={{ color: "#34D399" }}>합계잔액시산표(T/B) 분석</span>{" "}
              및 오류 검증 완료
            </div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.55)", marginTop: 3 }}>
              세무조정 전 필수 검토 과정 — 업로드 후 5분 내 자동 완료
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(16,185,129,0.7)" }}>실시간 처리</span>
          </div>
        </motion.div>

        {/* ── Desktop/Tablet: side-by-side panels ────────────────────────── */}
        <div className="tei-panels" style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>

          {/* Excel panel (desktop) */}
          <motion.div
            className="tei-excel"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ flex: "0 0 auto", width: "48%", minWidth: 0 }}
          >
            {/* Desktop table view */}
            <div className="tei-desktop-view">
              {/* Window chrome */}
              <div style={{
                borderRadius: "12px 12px 0 0",
                background: "#1A2744",
                border: "1px solid rgba(51,65,85,0.7)", borderBottom: "none",
                padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#EF4444","#F59E0B","#22C55E"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(148,163,184,0.6)", fontWeight: 600 }}>
                  <FileSpreadsheet style={{ width: 11, height: 11, color: "#10B981" }} />
                  세무결산_2024Q4.xlsx
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "3px 8px", borderRadius: 3,
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: 9, fontWeight: 800, color: "#10B981",
                  }}>
                    <Zap style={{ width: 8, height: 8 }} />AI 분석 중
                  </div>
                </div>
              </div>

              {/* Scrollable table */}
              <div className="tei-table-wrap" style={{ overflowX: "visible" }}>
                <div style={{
                  borderRadius: "0 0 12px 12px",
                  background: "#0D1B2E",
                  border: "1px solid rgba(51,65,85,0.7)",
                  overflow: "hidden",
                  minWidth: 400,
                }}>
                  {/* Column headers */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1.6fr 1.6fr 1.4fr",
                    background: "#162033", borderBottom: "1px solid rgba(51,65,85,0.5)",
                  }}>
                    {["계정과목","금액 (원)","증빙자료","AI 판정"].map(h => (
                      <div key={h} style={{
                        padding: "7px 8px", borderRight: "1px solid rgba(51,65,85,0.3)",
                        fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.4)",
                      }}>{h}</div>
                    ))}
                  </div>
                  {/* Data rows */}
                  {ROWS.map((row, i) => {
                    const isActive = scanRow === i;
                    const isIssue = !row.ok;
                    return (
                      <motion.div key={i}
                        animate={{ background: isActive ? (isIssue ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.1)") : "transparent" }}
                        transition={{ duration: 0.2 }}
                        style={{
                          display: "grid", gridTemplateColumns: "2fr 1.6fr 1.6fr 1.4fr",
                          borderBottom: "1px solid rgba(51,65,85,0.25)", position: "relative",
                        }}
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{
                                position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
                                background: isIssue ? "#EF4444" : "#10B981",
                                boxShadow: isIssue ? "0 0 12px rgba(239,68,68,0.8)" : "0 0 12px rgba(16,185,129,0.8)",
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <div style={{
                          padding: "8px 8px 8px 12px", borderRight: "1px solid rgba(51,65,85,0.3)",
                          fontSize: 12, fontWeight: 600,
                          color: isActive ? (isIssue ? "#FCA5A5" : "#6EE7B7") : "rgba(226,232,240,0.75)",
                        }}>{row.account}</div>
                        <div style={{
                          padding: "8px", borderRight: "1px solid rgba(51,65,85,0.3)",
                          fontSize: 11, color: "rgba(148,163,184,0.7)", fontFamily: "monospace",
                        }}>{row.amount}</div>
                        <div style={{
                          padding: "8px", borderRight: "1px solid rgba(51,65,85,0.3)",
                          fontSize: 11,
                          color: row.evidence === "없음" ? "#F87171" : "rgba(148,163,184,0.6)",
                          fontWeight: row.evidence === "없음" ? 700 : 400,
                        }}>{row.evidence}</div>
                        <div style={{
                          padding: "8px", fontSize: 10, fontWeight: 700,
                          color: row.ok ? (row.status === "공제 가능" ? "#34D399" : "rgba(148,163,184,0.5)") : "#F87171",
                        }}>{row.status}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile: card list (shown on < 480px) */}
            <div className="tei-mobile-cards" style={{ display: "none" }}>
              {ROWS.map((row, i) => <MobileRowCard key={i} row={row} i={i} />)}
            </div>

            {/* Swipe hint (tablet 480–900px only) */}
            <div className="tei-swipe-hint" style={{
              display: "none",
              alignItems: "center", gap: 6, marginTop: 8, justifyContent: "center",
              fontSize: 11, color: "rgba(16,185,129,0.5)", fontWeight: 600,
            }}>
              <MoveHorizontal style={{ width: 13, height: 13 }} />
              <span>밀어서 더 보기</span>
            </div>

            {/* Upload hint */}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(148,163,184,0.35)" }}>
              <FileSpreadsheet style={{ width: 11, height: 11 }} />
              .xlsx · .csv · .xls 지원 · 최대 50MB
            </div>
          </motion.div>

          {/* Animated connector (desktop only) */}
          <DataStreamConnector active={started} />

          {/* AI panel */}
          {aiPanel}
        </div>

        {/* ── Mobile: stacked layout (AI panel full-width) ───────────────── */}
        <div className="tei-mobile-ai" style={{ display: "none", marginTop: 24 }}>
          {aiPanel}
        </div>

      </div>
    </section>

    <style>{`
      @media (max-width: 900px) {
        .tei-section  { padding: 70px 24px !important; }
        .tei-panels   { flex-direction: column !important; }
        .tei-excel    { width: 100% !important; }
        .tei-connector { display: none !important; }
        .tei-table-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
        .tei-table-wrap > div { min-width: 400px; }
        .tei-swipe-hint { display: flex !important; }
      }
      @media (max-width: 480px) {
        .tei-section  { padding: 60px 16px !important; }
        .tei-desktop-view { display: none !important; }
        .tei-mobile-cards { display: block !important; }
        .tei-swipe-hint { display: none !important; }
      }
    `}</style>
    </>
  );
}
