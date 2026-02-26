"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

interface Props { onConsult: (message?: string) => void }

const ANALYSIS_STEPS = [
  "전 세계 레퍼런스 데이터 분석 중...",
  "브랜드 톤앤매너 패턴 매핑 중...",
  "경쟁사 크리에이티브 포지셔닝 비교 중...",
  "맞춤형 캠페인 기획안 초안 생성 중...",
];

const HINT_CHIPS = ["나이키 — 도전 정신", "스타벅스 — 일상의 여유", "현대차 — 미래 모빌리티", "아모레퍼시픽 — K뷰티"];

export default function ProductionCTA({ onConsult }: Props) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [step, setStep] = useState(0);
  const inputRef = useRef("");

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || phase !== "idle") return;
    inputRef.current = trimmed;

    setPhase("analyzing");
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 680));
    }
    setPhase("done");

    await new Promise(r => setTimeout(r, 2000));
    const saved = inputRef.current;
    setPhase("idle");
    setInput("");
    setStep(0);
    onConsult(`[CF 기획 요청] 브랜드/캠페인 키워드: ${saved}\n\nVision AI가 해당 브랜드의 톤앤매너에 최적화된 기획안 초안을 생성했습니다. 상세 내용을 확인하고 싶습니다.`);
  };

  return (
    <section style={{
      background: "radial-gradient(ellipse at 50% 0%, #071828 0%, #030407 70%)",
      padding: "100px 24px 120px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.25), transparent)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 1000, height: 500, background: "radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.22)", borderRadius: 4, marginBottom: 24 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Campaign AI Diagnosis</span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.9rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 16,
            background: "linear-gradient(90deg, #fff 35%, rgba(148,163,184,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            기획 중인 브랜드와<br />캠페인 키워드를 입력하세요.
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.05rem)", color: "rgba(148,163,184,0.55)", lineHeight: 1.9 }}>
            Vision AI가 해당 브랜드의 톤앤매너에 최적화된<br />기획안 초안을 즉시 생성합니다.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              /* ── Success state ── */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  padding: "28px 32px", borderRadius: 8,
                  background: "rgba(14,165,233,0.06)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(14,165,233,0.3)",
                  boxShadow: "0 0 0 1px rgba(14,165,233,0.12), 0 8px 40px rgba(14,165,233,0.12)",
                  display: "flex", alignItems: "center", gap: 20,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.1 }}
                >
                  <CheckCircle2 style={{ width: 42, height: 42, color: "#0EA5E9", filter: "drop-shadow(0 0 14px rgba(14,165,233,0.6))" }} />
                </motion.div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 6 }}>
                    기획안 초안이 생성되었습니다.
                  </div>
                  <div style={{ fontSize: 13.5, color: "rgba(148,163,184,0.75)", lineHeight: 1.65 }}>
                    <span style={{ color: "#38BDF8", fontWeight: 700 }}>{inputRef.current}</span>의 톤앤매너에 최적화된 기획안이 준비됐습니다.<br />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>전문 컨설턴트에게 연결 중...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Input box */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
                  border: phase === "analyzing"
                    ? "1px solid rgba(14,165,233,0.45)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "12px 12px 12px 24px",
                  boxShadow: phase === "analyzing" ? "0 0 0 4px rgba(14,165,233,0.08)" : "none",
                  transition: "all 0.3s",
                }}>
                  <input
                    value={phase === "idle" ? input : ""}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    disabled={phase !== "idle"}
                    placeholder={
                      phase === "analyzing"
                        ? ANALYSIS_STEPS[step]
                        : "기획 중인 캠페인의 키워드를 입력하고 AI의 초안을 확인하세요."
                    }
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 16, color: phase === "analyzing" ? "rgba(56,189,248,0.75)" : "white",
                      fontFamily: "inherit", letterSpacing: "0.01em",
                      fontStyle: phase !== "idle" ? "italic" : "normal",
                      transition: "color 0.3s",
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || phase !== "idle"}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "13px 28px", borderRadius: 6, border: "none",
                      background: input.trim() && phase === "idle"
                        ? "#0EA5E9"
                        : "rgba(255,255,255,0.05)",
                      color: input.trim() && phase === "idle" ? "white" : "rgba(255,255,255,0.2)",
                      fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase",
                      cursor: input.trim() && phase === "idle" ? "pointer" : "not-allowed",
                      transition: "all 0.25s", flexShrink: 0,
                      boxShadow: input.trim() && phase === "idle"
                        ? "0 4px 20px rgba(14,165,233,0.45)"
                        : "none",
                    }}
                  >
                    {phase === "idle" ? <><ArrowRight style={{ width: 15, height: 15 }} /> 기획 시작</> : <>분석 중...</>}
                  </button>
                </div>

                {/* Horizontal progress bar */}
                <AnimatePresence>
                  {phase === "analyzing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 18 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Segmented bar */}
                      <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                        {ANALYSIS_STEPS.map((_, i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                            <motion.div
                              animate={{ width: i <= step ? "100%" : "0%" }}
                              transition={{ duration: 0.55, ease: "easeOut" }}
                              style={{
                                height: "100%", borderRadius: 99,
                                background: i < step
                                  ? "linear-gradient(90deg, #22C55E, #4ADE80)"
                                  : "linear-gradient(90deg, #0EA5E9, #38BDF8)",
                                boxShadow: i <= step ? "0 0 8px rgba(14,165,233,0.7)" : "none",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Step label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                          style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", boxShadow: "0 0 8px #0EA5E9", flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 12, color: "rgba(56,189,248,0.75)", fontWeight: 600 }}>
                          {ANALYSIS_STEPS[step]}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                          {step + 1} / {ANALYSIS_STEPS.length}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint chips */}
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}
            >
              {HINT_CHIPS.map(chip => (
                <button key={chip} onClick={() => setInput(chip)}
                  style={{
                    padding: "6px 14px", borderRadius: 4,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer",
                    transition: "all 0.15s", fontFamily: "inherit",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(14,165,233,0.4)"; e.currentTarget.style.color = "#38BDF8"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                >{chip}</button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
