"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";

interface LegalSearchInputProps {
  onSubmit: (message: string) => void;
}

const PLACEHOLDERS = [
  "판례 교차 검색 기능이 궁금합니다",
  "계약서 독소 조항 자동 탐지가 어떻게 작동하나요?",
  "On-Premise 구축 비용이 어떻게 되나요?",
  "비정형 법률 문서 분석 기능이 필요합니다",
];

export default function LegalSearchInput({ onSubmit }: LegalSearchInputProps) {
  const [value, setValue] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || analyzing) return;

    setAnalyzing(true);
    // "분석 중..." 애니메이션 후 위젯 열기
    await new Promise(r => setTimeout(r, 1400));
    setAnalyzing(false);
    setValue("");
    onSubmit(trimmed);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <section style={{ background: "#0F172A", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(184,145,80,0.35), transparent)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(184,145,80,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Sparkles style={{ width: 16, height: 16, color: "#B89150" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#B89150", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Ask Vision AI Legal
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1.2 }}>
            궁금하신 법률 AI 기능을<br />직접 입력해보세요
          </h2>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(184,145,80,0.3)",
            borderRadius: 16, padding: "8px 8px 8px 20px",
            boxShadow: "0 0 0 0 rgba(184,145,80,0)",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
          onFocus={() => {}}
          >
            <Search style={{ width: 20, height: 20, color: "#B89150", flexShrink: 0 }} />
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholder}
              disabled={analyzing}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 16, color: "white", fontFamily: "inherit",
                letterSpacing: "0.01em", lineHeight: 1.5,
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || analyzing}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12,
                background: value.trim() && !analyzing ? "#B89150" : "rgba(255,255,255,0.06)",
                color: value.trim() && !analyzing ? "white" : "rgba(255,255,255,0.25)",
                fontSize: 14, fontWeight: 700, border: "none", cursor: value.trim() && !analyzing ? "pointer" : "not-allowed",
                transition: "all 0.2s", flexShrink: 0, letterSpacing: "-0.01em",
                boxShadow: value.trim() && !analyzing ? "0 4px 16px rgba(184,145,80,0.3)" : "none",
              }}
            >
              {analyzing ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Search style={{ width: 15, height: 15 }} />}
              {analyzing ? "분석 중..." : "상담 연결"}
            </button>
          </div>

          {/* Status */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                      style={{ width: 6, height: 6, background: "#B89150", borderRadius: "50%" }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>
                  질문을 분석하고 상담 폼을 준비하는 중입니다...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}
        >
          {["판례 교차 검색", "계약서 독소 조항 탐지", "On-Premise 구축", "비정형 문서 분석", "보안 아키텍처 문의"].map(chip => (
            <button key={chip} onClick={() => { setValue(chip); }}
              style={{
                padding: "6px 14px", borderRadius: 999,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 12, color: "rgba(255,255,255,0.45)", cursor: "pointer",
                transition: "all 0.15s", fontFamily: "inherit",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(184,145,80,0.4)"; e.currentTarget.style.color = "#D4A853"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
