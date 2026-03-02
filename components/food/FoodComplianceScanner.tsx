"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface ScanResult {
  type: "warn" | "ok";
  text: string;
  detail: string;
}

const EXAMPLES = [
  {
    label: "광고 문구 검토",
    input: "이 제품은 피로 회복에 탁월한 효과가 있습니다.",
    results: [
      { type: "warn" as const, text: "\"피로 회복\" 탁월한 효과", detail: "의약품 오인 우려가 있어 식품 광고 시 제한됩니다. (식품위생법 제10조)" },
      { type: "ok"   as const, text: "권장 수정: \"활력 증진에 도움을 줄 수 있는\"", detail: "식품공전 기능성 표현 기준 적합. 그대로 사용 가능합니다." },
    ],
  },
  {
    label: "영양 성분 표기",
    input: "나트륨 0mg, 지방 0g (전혀 없음)",
    results: [
      { type: "warn" as const, text: "\"전혀 없음\" 표현", detail: "영양성분 강조 표시 기준 위반. '0'은 허용되나 '전혀 없음' 표현은 소비자 오인 유발 가능." },
      { type: "ok"   as const, text: "권장 수정: \"나트륨 0mg, 지방 0g\"", detail: "수치만 표기 시 식품 등의 표시기준 준수 확인됨." },
    ],
  },
  {
    label: "원산지 표시",
    input: "국내산 100% 천연 원재료 사용",
    results: [
      { type: "ok"   as const, text: "\"국내산\" 원산지 표기 확인", detail: "농수산물의 원산지 표시에 관한 법률 기준 적합." },
      { type: "warn" as const, text: "\"100% 천연\" 표현 주의", detail: "모든 원재료의 천연 여부 입증 자료가 없을 경우 허위 표시로 간주될 수 있습니다." },
    ],
  },
];

const SCAN_STEPS = [
  "식품위생법 DB 대조 중...",
  "표시광고법 가이드라인 검토 중...",
  "HACCP 기준 체크 중...",
  "결과 생성 중...",
];

export default function FoodComplianceScanner() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "result">("idle");
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);

  const runScan = async (text: string) => {
    const matched = EXAMPLES.find(e => e.input === text);
    const finalResults = matched?.results ?? [
      { type: "ok" as const, text: "입력 텍스트 분석 완료", detail: "현행 식품위생법 및 표시광고법 기준에서 명확한 위반 사항이 탐지되지 않았습니다." },
      { type: "warn" as const, text: "추가 법무 검토 권장", detail: "정확한 컴플라이언스 판단을 위해 Vision AI 전문 컨설턴트와의 상담을 추천드립니다." },
    ];

    setPhase("scanning");
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise(r => setTimeout(r, 600));
    }
    setResults(finalResults);
    setPhase("result");
  };

  const handleScan = () => {
    const trimmed = input.trim();
    if (!trimmed || phase !== "idle") return;
    runScan(trimmed);
  };

  const handleReset = () => {
    setPhase("idle");
    setInput("");
    setResults([]);
    setScanStep(0);
  };

  return (
    <>
    <section id="food-scanner" className="fcs-section" style={{
      background: "#F8FAFC", padding: "100px 24px",
      borderTop: "1px solid #E2E8F0",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)",
            marginBottom: 20 }}
          >
            <ScanLine style={{ width: 13, height: 13, color: "#0D9488" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>Compliance Scanner</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16 }}>
            성분표 · 광고 문구를 입력하면<br />AI가 즉시 법규 위반 여부를 스캔합니다
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#64748B", lineHeight: 1.8 }}>
            예시 버튼을 클릭하거나 직접 텍스트를 입력해보세요.
          </p>
        </motion.div>

        {/* Scanner layout */}
        <div className="fcs-layout" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "start" }}>

          {/* Left: Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ padding: "28px 28px", background: "white", borderRadius: "12px 0 0 12px",
              border: "1px solid #E2E8F0", borderRight: "none" }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8",
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Input — 분석 텍스트 입력
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={phase !== "idle"}
              placeholder="성분표 또는 광고 문구를 입력하세요..."
              rows={5}
              style={{
                width: "100%", resize: "none",
                border: "1px solid #E2E8F0", borderRadius: 8,
                padding: "12px 14px", fontSize: 14, color: "#334155",
                fontFamily: "inherit", lineHeight: 1.7, outline: "none",
                background: phase !== "idle" ? "#F8FAFC" : "white",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#0D9488"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
            />
            <button
              onClick={handleScan}
              disabled={!input.trim() || phase !== "idle"}
              style={{
                marginTop: 12, width: "100%",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 6, border: "none",
                background: input.trim() && phase === "idle" ? "#0D9488" : "#E2E8F0",
                color: input.trim() && phase === "idle" ? "white" : "#94A3B8",
                fontSize: 14, fontWeight: 700, cursor: input.trim() && phase === "idle" ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              <ScanLine style={{ width: 15, height: 15 }} />
              법규 스캔 시작
            </button>

            {/* Example chips */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600,
                letterSpacing: "0.06em", marginBottom: 8 }}>예시 선택</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {EXAMPLES.map((ex, i) => (
                  <button key={i}
                    onClick={() => { handleReset(); setTimeout(() => setInput(ex.input), 10); }}
                    style={{
                      textAlign: "left", padding: "7px 12px", borderRadius: 6,
                      border: "1px solid #E2E8F0", background: "#F8FAFC",
                      fontSize: 12.5, color: "#475569", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.color = "#0D9488"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <span style={{ fontWeight: 700, marginRight: 6 }}>{ex.label}</span>
                    <span style={{ opacity: 0.6 }}>→ {ex.input.slice(0, 20)}...</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center: Process arrow */}
          <div className="fcs-center" style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "28px 16px", background: "white",
            border: "1px solid #E2E8F0", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0",
            minWidth: 120, alignSelf: "stretch",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8",
              letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: 16 }}>Process</div>
            <AnimatePresence mode="wait">
              {phase === "scanning" ? (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center" }}>
                  <Loader2 style={{ width: 28, height: 28, color: "#0D9488", margin: "0 auto 12px" }}
                    className="fcs-spin" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {SCAN_STEPS.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: i <= scanStep ? "#0D9488" : "#E2E8F0",
                          transition: "background 0.3s",
                        }} />
                        <span style={{ fontSize: 10.5, color: i <= scanStep ? "#0D9488" : "#CBD5E1",
                          fontWeight: i === scanStep ? 700 : 400, transition: "all 0.3s" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : phase === "result" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center" }}>
                  <CheckCircle2 style={{ width: 32, height: 32, color: "#22C55E", margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>분석 완료</div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: "center" }}>
                  <ArrowRight style={{ width: 28, height: 28, color: "#CBD5E1", margin: "0 auto" }} />
                  <div style={{ fontSize: 10, color: "#CBD5E1", marginTop: 8 }}>대기 중</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DB labels */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {["식품위생법 DB", "표시광고법", "HACCP 기준"].map(db => (
                <div key={db} style={{ padding: "5px 8px", borderRadius: 4,
                  background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)",
                  fontSize: 10, fontWeight: 600, color: "#0D9488", textAlign: "center" }}>{db}</div>
              ))}
            </div>
          </div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ padding: "28px 28px", background: "white", borderRadius: "0 12px 12px 0",
              border: "1px solid #E2E8F0", borderLeft: "none", minHeight: 300 }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8",
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Result — 분석 결과
            </div>
            <AnimatePresence mode="wait">
              {phase === "result" ? (
                <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}>
                  {results.map((r, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      style={{
                        padding: "14px 16px", borderRadius: 8, marginBottom: 12,
                        background: r.type === "warn" ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)",
                        border: `1px solid ${r.type === "warn" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
                          {r.type === "warn" ? "🔴" : "🟢"}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 700,
                          color: r.type === "warn" ? "#DC2626" : "#16A34A", lineHeight: 1.4 }}>
                          {r.text}
                        </span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.65, margin: 0, paddingLeft: 23 }}>
                        {r.detail}
                      </p>
                    </motion.div>
                  ))}
                  <button onClick={handleReset}
                    style={{ marginTop: 4, padding: "8px 16px", borderRadius: 6,
                      border: "1px solid #E2E8F0", background: "white",
                      fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer",
                      transition: "all 0.15s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.color = "#0D9488"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
                  >
                    다시 스캔
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", height: 200, gap: 12 }}>
                  <ShieldAlert style={{ width: 36, height: 36, color: "#CBD5E1" }} />
                  <div style={{ fontSize: 13, color: "#CBD5E1", textAlign: "center", lineHeight: 1.6 }}>
                    텍스트를 입력하고<br />스캔을 시작하세요
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      .fcs-spin { animation: spin 1s linear infinite; }
      @media (max-width: 900px) {
        .fcs-section { padding: 70px 24px !important; }
        .fcs-layout { grid-template-columns: 1fr !important; }
        .fcs-layout > div { border-radius: 12px !important; border: 1px solid #E2E8F0 !important; margin-bottom: 12px; }
        .fcs-center { flex-direction: row !important; flex-wrap: wrap; min-width: unset !important; padding: 16px 24px !important; }
      }
    `}</style>
    </>
  );
}
