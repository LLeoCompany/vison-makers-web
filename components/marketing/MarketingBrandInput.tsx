"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props { onConsult: (message?: string) => void }

const STEPS = [
  "브랜드 키워드 추출 중...",
  "과거 광고 성과 패턴 분석 중...",
  "경쟁사 포지셔닝 비교 중...",
  "맞춤형 전략 초안 생성 중...",
];

const CHIPS = ["나이키", "아모레퍼시픽", "스타벅스", "배달의민족", "다이슨"];

export default function MarketingBrandInput({ onConsult }: Props) {
  const [brand, setBrand] = useState("");
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [step, setStep] = useState(0);
  const brandRef = useRef("");

  const handleSubmit = async () => {
    const trimmed = brand.trim();
    if (!trimmed || phase !== "idle") return;
    brandRef.current = trimmed;

    setPhase("analyzing");
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 650));
    }
    setPhase("done");

    // Auto-open sidebar after success display
    await new Promise(r => setTimeout(r, 1800));
    const savedBrand = brandRef.current;
    setPhase("idle");
    setBrand("");
    setStep(0);
    onConsult(`Vision AI가 ${savedBrand} 브랜드를 분석했습니다. 맞춤형 마케팅 AI PoC를 신청합니다.`);
  };

  return (
    <section style={{ background: "linear-gradient(135deg, #0A0F2E 0%, #1A0A3E 55%, #0D1B3E 100%)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Glow bg */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0EA5E9, #8B5CF6, transparent)" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 999, marginBottom: 24 }}>
            <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>Brand AI Diagnosis</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 16,
            background: "linear-gradient(90deg, #fff 30%, rgba(148,163,184,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            귀사의 브랜드명을 입력하고<br />AI 전략을 확인하세요
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)", color: "rgba(148,163,184,0.75)", lineHeight: 1.85 }}>
            Vision AI가 브랜드 스타일을 분석하고<br />맞춤형 마케팅 전략 PoC를 제안합니다.
          </p>
        </motion.div>

        {/* Input box */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              /* ── Success state ── */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                style={{
                  padding: "28px 32px", borderRadius: 20,
                  background: "rgba(34,197,94,0.07)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  boxShadow: "0 0 0 1px rgba(34,197,94,0.15), 0 8px 40px rgba(34,197,94,0.15), 0 0 60px rgba(34,197,94,0.06)",
                  display: "flex", alignItems: "center", gap: 18,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                >
                  <CheckCircle2 style={{ width: 40, height: 40, color: "#22C55E", filter: "drop-shadow(0 0 12px rgba(34,197,94,0.6))" }} />
                </motion.div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 4 }}>
                    분석 완료!
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(148,163,184,0.85)", lineHeight: 1.6 }}>
                    <span style={{ color: "#4ADE80", fontWeight: 700 }}>{brandRef.current}</span> 맞춤형 전략이 준비되었습니다.<br />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>전문 컨설턴트에게 연결 중...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Idle / analyzing state ── */
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
                  border: phase === "analyzing"
                    ? "1px solid rgba(139,92,246,0.55)"
                    : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 18, padding: "10px 10px 10px 24px",
                  boxShadow: phase === "analyzing" ? "0 0 0 4px rgba(139,92,246,0.1)" : "none",
                  transition: "all 0.3s",
                }}>
                  <input
                    value={phase === "idle" ? brand : ""}
                    onChange={e => setBrand(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    disabled={phase !== "idle"}
                    placeholder={
                      phase === "analyzing" ? STEPS[step] : "예: 나이키, 아모레퍼시픽, 스타벅스..."
                    }
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 17, color: phase === "analyzing" ? "rgba(167,139,250,0.85)" : "white",
                      fontFamily: "inherit", letterSpacing: "0.01em",
                      fontStyle: phase !== "idle" ? "italic" : "normal",
                      transition: "color 0.3s",
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!brand.trim() || phase !== "idle"}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "14px 28px", borderRadius: 12,
                      background: brand.trim() && phase === "idle"
                        ? "linear-gradient(135deg, #0EA5E9, #8B5CF6)"
                        : "rgba(255,255,255,0.06)",
                      color: brand.trim() && phase === "idle" ? "white" : "rgba(255,255,255,0.22)",
                      fontSize: 14, fontWeight: 800, border: "none",
                      cursor: brand.trim() && phase === "idle" ? "pointer" : "not-allowed",
                      transition: "all 0.25s", flexShrink: 0,
                      boxShadow: brand.trim() && phase === "idle"
                        ? "0 4px 24px rgba(139,92,246,0.45)"
                        : "none",
                    }}
                  >
                    {phase === "idle" ? (
                      <><ArrowRight style={{ width: 16, height: 16 }} /> 분석 시작</>
                    ) : (
                      <>분석 중...</>
                    )}
                  </button>
                </div>

                {/* ── Horizontal progress bar ── */}
                <AnimatePresence>
                  {phase === "analyzing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Segmented bar */}
                      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                        {STEPS.map((_, i) => (
                          <motion.div
                            key={i}
                            style={{ flex: 1, height: 4, borderRadius: 99, overflow: "hidden",
                              background: "rgba(255,255,255,0.07)" }}
                          >
                            <motion.div
                              animate={{ width: i <= step ? "100%" : "0%" }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              style={{ height: "100%", borderRadius: 99,
                                background: i < step
                                  ? "linear-gradient(90deg, #22C55E, #4ADE80)"
                                  : "linear-gradient(90deg, #0EA5E9, #8B5CF6)",
                                boxShadow: i <= step ? "0 0 8px rgba(139,92,246,0.6)" : "none",
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      {/* Current step label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}
                          style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6",
                            boxShadow: "0 0 10px #8B5CF6" }}
                        />
                        <span style={{ fontSize: 13, color: "rgba(167,139,250,0.85)", fontWeight: 600 }}>
                          {STEPS[step]}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                          {step + 1} / {STEPS.length}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint chips */}
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}
          >
            {CHIPS.map(chip => (
              <button key={chip} onClick={() => setBrand(chip)}
                style={{
                  padding: "6px 14px", borderRadius: 999,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer",
                  transition: "all 0.15s", fontFamily: "inherit",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.color = "#A78BFA"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
              >{chip}</button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
