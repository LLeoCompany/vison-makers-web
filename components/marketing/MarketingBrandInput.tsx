"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props { onConsult: (message?: string) => void }

const ANALYSIS_STEPS = [
  "브랜드 키워드 추출 중...",
  "과거 광고 성과 패턴 분석 중...",
  "경쟁사 포지셔닝 비교 중...",
  "맞춤형 전략 초안 생성 중...",
];

export default function MarketingBrandInput({ onConsult }: Props) {
  const [brand, setBrand] = useState("");
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [step, setStep] = useState(0);

  const handleSubmit = async () => {
    const trimmed = brand.trim();
    if (!trimmed || phase !== "idle") return;

    setPhase("analyzing");
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 700));
    }
    setPhase("done");
    await new Promise(r => setTimeout(r, 1200));
    setPhase("idle");
    setBrand("");
    setStep(0);
    onConsult(`Vision AI가 ${trimmed} 브랜드 스타일을 분석했습니다. 맞춤형 마케팅 AI PoC를 신청합니다.`);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <section style={{ background: "linear-gradient(135deg, #0A0F2E 0%, #1A0A3E 50%, #0D1B3E 100%)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.5), rgba(139,92,246,0.5), transparent)" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 999, marginBottom: 24 }}>
            <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.07em", textTransform: "uppercase" }}>Brand AI Diagnosis</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 16 }}>
            브랜드명을 입력하고<br />AI 마케터를 만나보세요
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", color: "rgba(148,163,184,0.85)", lineHeight: 1.8 }}>
            Vision AI가 귀사의 브랜드 스타일을 분석하고<br />맞춤형 마케팅 전략 PoC를 제안합니다.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.05)",
            border: phase === "analyzing" ? "1px solid rgba(139,92,246,0.6)" : phase === "done" ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18, padding: "10px 10px 10px 24px",
            boxShadow: phase === "analyzing" ? "0 0 0 4px rgba(139,92,246,0.12)" : "none",
            transition: "all 0.3s",
          }}>
            {phase === "analyzing" && (
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                    style={{ width: 5, height: 5, background: "#8B5CF6", borderRadius: "50%" }}
                  />
                ))}
              </div>
            )}
            {phase === "done" && <CheckCircle2 style={{ width: 18, height: 18, color: "#22C55E", flexShrink: 0 }} />}

            <input
              value={phase === "idle" ? brand : ""}
              onChange={e => setBrand(e.target.value)}
              onKeyDown={handleKey}
              disabled={phase !== "idle"}
              placeholder={
                phase === "analyzing"
                  ? ANALYSIS_STEPS[step]
                  : phase === "done"
                  ? `분석 완료! ${brand} 브랜드 맞춤형 전략이 준비되었습니다.`
                  : "예: 나이키, 아모레퍼시픽, 스타벅스..."
              }
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 17, color: phase === "done" ? "#22C55E" : phase === "analyzing" ? "rgba(139,92,246,0.8)" : "white",
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
                color: brand.trim() && phase === "idle" ? "white" : "rgba(255,255,255,0.25)",
                fontSize: 14, fontWeight: 700, border: "none",
                cursor: brand.trim() && phase === "idle" ? "pointer" : "not-allowed",
                transition: "all 0.25s", flexShrink: 0,
                boxShadow: brand.trim() && phase === "idle" ? "0 4px 20px rgba(139,92,246,0.4)" : "none",
              }}
            >
              {phase === "idle" ? (
                <><ArrowRight style={{ width: 16, height: 16 }} /> 분석 시작</>
              ) : phase === "analyzing" ? (
                <>분석 중...</>
              ) : (
                <>완료!</>
              )}
            </button>
          </div>

          {/* Step progress */}
          <AnimatePresence>
            {phase === "analyzing" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: 20 }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ANALYSIS_STEPS.map((s, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid", transition: "all 0.3s",
                        borderColor: i < step ? "#22C55E" : i === step ? "#8B5CF6" : "rgba(255,255,255,0.15)",
                        background: i < step ? "rgba(34,197,94,0.15)" : i === step ? "rgba(139,92,246,0.15)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                      >
                        {i < step && <CheckCircle2 style={{ width: 10, height: 10, color: "#22C55E" }} />}
                        {i === step && (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B5CF6" }} />
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: i === step ? "rgba(255,255,255,0.85)" : i < step ? "rgba(34,197,94,0.7)" : "rgba(255,255,255,0.25)", transition: "color 0.3s" }}>
                        {s}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint chips */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}
        >
          {["나이키", "아모레퍼시픽", "스타벅스", "배달의민족", "다이슨"].map(chip => (
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
      </div>
    </section>
  );
}
