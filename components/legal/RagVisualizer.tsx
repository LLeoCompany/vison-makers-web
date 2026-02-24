"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Database, FileText, ChevronRight, X } from "lucide-react";

const DEMO_QUERY = "상가 임차인이 계약 만료 전 임의로 권리금을 회수할 수 있는 법적 근거가 있나요?";

const CHUNKS = [
  {
    id: 1,
    title: "상가건물 임대차보호법 제10조의4",
    preview: "임대인은 임차인이 주선한 신규임차인이 되려는 자로부터 권리금을 수수하는 행위를 방해하여서는 아니 된다...",
    full: "임대인은 임차인이 주선한 신규임차인이 되려는 자로부터 권리금을 수수하는 행위를 방해하여서는 아니 된다. 다만 임차인이 주선한 신규임차인이 되려는 자가 보증금 또는 차임을 지급할 자력이 없는 경우 등 대통령령으로 정하는 사유가 있는 경우에는 그러하지 아니하다.",
    year: "2015년 개정",
    relevance: 97,
  },
  {
    id: 2,
    title: "대법원 2019다242163 판결",
    preview: "권리금 회수 방해로 인한 손해배상 청구는 임차인이 신규임차인 주선 사실을 입증하여야 하며...",
    full: "권리금 회수 방해로 인한 손해배상 청구는 임차인이 신규임차인 주선 사실을 입증하여야 하며, 임대인의 방해 행위와 손해 사이의 인과관계가 인정되어야 한다. 본 사건에서 원고는 신규임차인 주선을 위한 적극적 노력을 다하였음을 인정한다.",
    year: "대법원 2019",
    relevance: 89,
  },
  {
    id: 3,
    title: "상가건물 임대차보호법 제10조의3",
    preview: "권리금이란 임대차 목적물인 상가건물에서 영업을 하는 자 또는 영업을 하려는 자가 영업시설·비품...",
    full: "권리금이란 임대차 목적물인 상가건물에서 영업을 하는 자 또는 영업을 하려는 자가 영업시설·비품, 거래처, 신용, 영업상의 노하우, 상가건물의 위치에 따른 영업상의 이점 등 유형·무형의 재산적 가치의 양도 또는 이용대가로서 임대인, 임차인에게 보증금과 차임 이외에 지급하는 금전 등의 대가를 말한다.",
    year: "법령 정의",
    relevance: 82,
  },
];

const ANSWER = [
  { text: "상가 임차인은 ", cite: null },
  { text: "상가건물 임대차보호법 제10조의4", cite: 1 },
  { text: "에 따라 임대차 기간이 만료되기 전 임대인이 권리금 회수를 방해하지 못하도록 요구할 수 있습니다. 구체적으로 임차인이 신규임차인을 주선하였음에도 임대인이 이를 거부하는 경우, ", cite: null },
  { text: "대법원 2019다242163", cite: 2 },
  { text: " 판례에 따라 손해배상을 청구할 수 있습니다. 다만 신규임차인의 자력 부족 등 대통령령이 정한 예외 사유가 있는 경우에는 임대인의 거부가 정당화됩니다.", cite: null },
];

type Step = "idle" | "query" | "retrieval" | "generation" | "done";

export default function RagVisualizer() {
  const [step, setStep] = useState<Step>("idle");
  const [activeChunk, setActiveChunk] = useState<number | null>(null);
  const [citationOpen, setCitationOpen] = useState<number | null>(null);

  const run = async () => {
    setStep("query");
    await delay(900);
    setStep("retrieval");
    await delay(1400);
    setStep("generation");
    await delay(1200);
    setStep("done");
  };

  const reset = () => {
    setStep("idle");
    setActiveChunk(null);
    setCitationOpen(null);
  };

  return (
    <section style={{ background: "#0A0F1E", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative glow */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(30,58,138,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Core Technology
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
            법률 RAG, 어떻게 작동하나요?
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "rgba(148,163,184,0.9)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            질문 하나가 수만 건의 판례·법령 데이터베이스를 탐색하고,<br />
            검증된 출처만으로 답변을 완성합니다.
          </p>
        </motion.div>

        {/* Main visualizer card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 40px 48px", backdropFilter: "blur(12px)" }}
        >
          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40, justifyContent: "center" }}>
            {[
              { label: "Query", icon: Search, s: "query" },
              { label: "Retrieval", icon: Database, s: "retrieval" },
              { label: "Generation", icon: FileText, s: "generation" },
            ].map((item, i) => {
              const steps: Step[] = ["query", "retrieval", "generation", "done"];
              const active = steps.indexOf(step) >= steps.indexOf(item.s as Step);
              return (
                <React.Fragment key={i}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: active ? "linear-gradient(135deg, #1E3A8A, #3B82F6)" : "rgba(255,255,255,0.06)",
                      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.4s",
                      boxShadow: active ? "0 0 24px rgba(59,130,246,0.35)" : "none",
                    }}>
                      <item.icon style={{ width: 20, height: 20, color: active ? "white" : "rgba(255,255,255,0.3)" }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#93C5FD" : "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>{item.label}</span>
                  </div>
                  {i < 2 && (
                    <div style={{ flex: 1, height: 2, background: active && steps.indexOf(step) > i ? "linear-gradient(90deg, #3B82F6, #1E3A8A)" : "rgba(255,255,255,0.08)", margin: "0 8px", marginBottom: 28, transition: "all 0.4s" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Content area */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* Left: Query + Retrieved chunks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Query box */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                  변호사의 질문
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  border: step === "query" || step === "retrieval" || step === "generation" || step === "done"
                    ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  transition: "border-color 0.4s",
                  boxShadow: step !== "idle" ? "0 0 20px rgba(59,130,246,0.1)" : "none",
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Search style={{ width: 16, height: 16, color: "#3B82F6", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, margin: 0 }}>{DEMO_QUERY}</p>
                  </div>
                </div>
              </div>

              {/* Retrieved chunks */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                  검색된 조항 · 판례
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CHUNKS.map((chunk, i) => {
                    const visible = (step === "retrieval" || step === "generation" || step === "done");
                    return (
                      <motion.div
                        key={chunk.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                        transition={{ delay: i * 0.18, duration: 0.4 }}
                        onClick={() => setActiveChunk(activeChunk === chunk.id ? null : chunk.id)}
                        style={{
                          background: activeChunk === chunk.id ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
                          border: activeChunk === chunk.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 20, height: 20, background: "rgba(59,130,246,0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#93C5FD", flexShrink: 0 }}>
                              {chunk.id}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{chunk.title}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{chunk.relevance}%</span>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.55 }}>
                          {chunk.preview}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Answer with citations */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                AI 법률 검토 의견 (출처 인용)
              </div>
              <AnimatePresence mode="wait">
                {(step === "generation" || step === "done") ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: 14, padding: "24px",
                      boxShadow: "0 0 32px rgba(59,130,246,0.08)",
                    }}
                  >
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.9, margin: 0 }}>
                      {ANSWER.map((seg, i) =>
                        seg.cite ? (
                          <button
                            key={i}
                            onClick={() => setCitationOpen(citationOpen === seg.cite ? null : seg.cite!)}
                            style={{
                              display: "inline",
                              background: "rgba(59,130,246,0.15)",
                              border: "1px solid rgba(59,130,246,0.4)",
                              borderRadius: 6, padding: "1px 7px",
                              fontSize: 13, fontWeight: 700, color: "#93C5FD",
                              cursor: "pointer", margin: "0 2px",
                              transition: "all 0.15s",
                            }}
                          >
                            {seg.text} [{seg.cite}]
                          </button>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        )
                      )}
                    </p>

                    {/* Citation popup */}
                    <AnimatePresence>
                      {citationOpen !== null && (
                        <motion.div
                          key={citationOpen}
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            marginTop: 20, background: "rgba(30,58,138,0.15)",
                            border: "1px solid rgba(59,130,246,0.35)",
                            borderRadius: 12, padding: "16px 18px",
                          }}
                        >
                          {(() => {
                            const c = CHUNKS.find(x => x.id === citationOpen);
                            if (!c) return null;
                            return (
                              <>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <FileText style={{ width: 14, height: 14, color: "#93C5FD" }} />
                                    <span style={{ fontSize: 12, fontWeight: 800, color: "#93C5FD" }}>[{c.id}] {c.title}</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, color: "#64748B" }}>{c.year}</span>
                                    <button onClick={() => setCitationOpen(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex" }}>
                                      <X style={{ width: 14, height: 14 }} />
                                    </button>
                                  </div>
                                </div>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>{c.full}</p>
                              </>
                            );
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {step === "done" && (
                      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "#64748B" }}>
                        출처 [1][2][3] 클릭 시 원문 조항 확인 가능
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.1)",
                      borderRadius: 14, padding: "48px 24px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                    }}
                  >
                    <FileText style={{ width: 32, height: 32, color: "rgba(255,255,255,0.12)" }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>
                      {step === "idle" ? "데모를 실행하면 답변이 여기에 표시됩니다" : "답변 생성 중..."}
                    </span>
                    {step !== "idle" && (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        style={{ width: 48, height: 3, background: "linear-gradient(90deg, #1E3A8A, #3B82F6)", borderRadius: 999 }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Run button */}
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 16 }}>
            {step === "idle" ? (
              <button
                onClick={run}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 36px", background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
                  color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(30,58,138,0.4)",
                }}
              >
                <Search style={{ width: 16, height: 16 }} />
                RAG 데모 실행하기
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            ) : step === "done" ? (
              <button
                onClick={reset}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 36px", background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 700, borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
                }}
              >
                다시 실행
              </button>
            ) : (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 36px", background: "rgba(59,130,246,0.1)",
                borderRadius: 12, border: "1px solid rgba(59,130,246,0.2)",
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  style={{ width: 16, height: 16, border: "2px solid rgba(59,130,246,0.3)", borderTopColor: "#3B82F6", borderRadius: "50%" }}
                />
                <span style={{ fontSize: 14, color: "#93C5FD", fontWeight: 600 }}>
                  {step === "query" ? "질문 분석 중..." : step === "retrieval" ? "판례 검색 중..." : "답변 생성 중..."}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
