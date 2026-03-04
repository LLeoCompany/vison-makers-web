"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Calculator } from "lucide-react";

const ANALYSIS_STEPS = [
  "최신 예규 및 판례 데이터베이스 대조 중...",
  "적용 가능 공제·감면 항목 탐색 중...",
  "업종별 세무 리스크 매핑 중...",
  "최적 절세 전략 생성 중...",
];

const HINT_CHIPS = [
  "접대비 한도 계산",
  "R&D 세액공제 요건",
  "법인세 신고 오류",
  "가산세 면제 기준",
  "부가세 환급 절차",
];

interface Props { onConsult: (msg?: string) => void }

export default function TaxCTA({ onConsult }: Props) {
  const [input, setInput]     = useState("");
  const [phase, setPhase]     = useState<"idle" | "analyzing" | "done">("idle");
  const [step, setStep]       = useState(0);
  const savedInput            = useRef("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || phase !== "idle") return;
    savedInput.current = trimmed;

    setPhase("analyzing");
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 700));
    }
    setPhase("done");

    await new Promise(r => setTimeout(r, 2400));
    const saved = savedInput.current;
    setPhase("idle");
    setInput("");
    setStep(0);
    onConsult(
      `[세무/회계 RAG 진단 요청] 세무 이슈: ${saved}\n\nVision AI가 해당 세무 이슈에 맞는 최적 절세 전략과 관련 예규를 준비했습니다. 상세 내용을 확인하고 싶습니다.`
    );
  };

  return (
    <>
    <section className="tcta-section" style={{
      background: "radial-gradient(ellipse at 50% 0%, #071020 0%, #020408 70%)",
      padding: "100px 24px 120px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid pattern bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(51,65,85,0.08) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(51,65,85,0.08) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "48px 48px",
        zIndex: 0,
      }} />
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)",
        zIndex: 1,
      }} />
      {/* Emerald glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        width: 900, height: 400,
        background: "radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 4,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            marginBottom: 24,
          }}>
            <Calculator style={{ width: 12, height: 12, color: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Tax AI Diagnosis
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.9rem)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 16,
            background: "linear-gradient(90deg, #fff 30%, rgba(148,163,184,0.55))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            궁금한 세무 이슈를 입력하여<br />AI 진단을 시작하세요.
          </h2>
          <p style={{
            fontSize: "clamp(0.95rem, 1.7vw, 1.05rem)",
            color: "rgba(148,163,184,0.5)", lineHeight: 1.9,
          }}>
            Vision AI가 최신 예규·판례와 즉시 대조하여<br />
            분석 완료! 귀사의 업종에 맞는 최적의 절세 전략이 준비됩니다.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  padding: "28px 32px", borderRadius: 10,
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  boxShadow: "0 0 0 1px rgba(16,185,129,0.1), 0 8px 40px rgba(16,185,129,0.1)",
                  display: "flex", alignItems: "center", gap: 20,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.1 }}
                >
                  <CheckCircle2 style={{
                    width: 42, height: 42, color: "#10B981",
                    filter: "drop-shadow(0 0 12px rgba(16,185,129,0.6))",
                  }} />
                </motion.div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 6 }}>
                    분석 완료! 최적의 절세 전략이 준비되었습니다.
                  </div>
                  <div style={{ fontSize: 13.5, color: "rgba(148,163,184,0.7)", lineHeight: 1.6 }}>
                    <span style={{ color: "#34D399", fontWeight: 700 }}>"{savedInput.current}"</span>에 대한 전략을 준비 중입니다.<br />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>전문 세무 컨설턴트에게 연결 중...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Input row */}
                <div className="tcta-row" style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: phase === "analyzing"
                    ? "1px solid rgba(16,185,129,0.45)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "12px 12px 12px 22px",
                  boxShadow: phase === "analyzing" ? "0 0 0 4px rgba(16,185,129,0.07)" : "none",
                  transition: "all 0.3s",
                }}>
                  <input
                    ref={inputRef}
                    value={phase === "idle" ? input : ""}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    disabled={phase !== "idle"}
                    placeholder={
                      phase === "analyzing"
                        ? ANALYSIS_STEPS[step]
                        : "궁금한 세무 이슈를 입력하여 AI 진단을 시작하세요."
                    }
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 15, color: phase === "analyzing" ? "rgba(52,211,153,0.75)" : "white",
                      fontFamily: "inherit", letterSpacing: "0.01em",
                      fontStyle: phase !== "idle" ? "italic" : "normal",
                      transition: "color 0.3s",
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || phase !== "idle"}
                    className="tcta-btn"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "12px 26px", borderRadius: 8, border: "none",
                      background: input.trim() && phase === "idle"
                        ? "#10B981"
                        : "rgba(255,255,255,0.05)",
                      color: input.trim() && phase === "idle" ? "white" : "rgba(255,255,255,0.2)",
                      fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase",
                      cursor: input.trim() && phase === "idle" ? "pointer" : "not-allowed",
                      transition: "all 0.25s", flexShrink: 0,
                      boxShadow: input.trim() && phase === "idle"
                        ? "0 4px 20px rgba(16,185,129,0.45)" : "none",
                    }}
                  >
                    {phase === "idle"
                      ? <><ArrowRight style={{ width: 14, height: 14 }} /> 진단 시작</>
                      : <>분석 중...</>}
                  </button>
                </div>

                {/* Progress bar */}
                <AnimatePresence>
                  {phase === "analyzing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                        {ANALYSIS_STEPS.map((_, i) => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 99, overflow: "hidden",
                            background: "rgba(255,255,255,0.05)",
                          }}>
                            <motion.div
                              animate={{ width: i <= step ? "100%" : "0%" }}
                              transition={{ duration: 0.55, ease: "easeOut" }}
                              style={{
                                height: "100%", borderRadius: 99,
                                background: i < step
                                  ? "linear-gradient(90deg, #10B981, #34D399)"
                                  : "linear-gradient(90deg, #059669, #10B981)",
                                boxShadow: i <= step ? "0 0 8px rgba(16,185,129,0.7)" : "none",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                          style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: "#10B981", boxShadow: "0 0 8px #10B981", flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 12, color: "rgba(52,211,153,0.75)", fontWeight: 600 }}>
                          {ANALYSIS_STEPS[step]}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.18)", fontWeight: 600 }}>
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
              style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}
            >
              {HINT_CHIPS.map(chip => (
                <button key={chip} onClick={() => setInput(chip)}
                  style={{
                    padding: "6px 14px", borderRadius: 4,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 12, color: "rgba(255,255,255,0.33)", cursor: "pointer",
                    transition: "all 0.15s", fontFamily: "inherit",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.color = "#34D399"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.33)"; }}
                >{chip}</button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 768px) {
        .tcta-section { padding: 60px 24px 80px !important; }
        .tcta-row { flex-direction: column !important; align-items: stretch !important; padding: 12px !important; gap: 10px !important; }
        .tcta-btn { width: 100% !important; justify-content: center !important; }
      }
    `}</style>
    </>
  );
}
