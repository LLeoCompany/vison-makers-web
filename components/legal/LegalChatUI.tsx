"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, X, ChevronRight, Scale, Loader2 } from "lucide-react";

const CONVERSATIONS = [
  {
    id: 1,
    user: "임대차 보증금 반환 소송에서 임대인이 보증금 반환을 거부할 수 있는 법적 근거가 있나요?",
    answer: [
      { text: "임대인은 원칙적으로 임대차 종료 시 보증금을 반환해야 합니다. 다만 ", cite: null },
      { text: "민법 제618조", cite: { id: "C1", case: "민법 제618조", preview: "임대차는 당사자 일방이 상대방에게 목적물을 사용, 수익하게 할 것을 약정하고 상대방이 이에 대하여 차임을 지급할 것을 약정함으로써 그 효력이 생긴다." }},
      { text: " 및 ", cite: null },
      { text: "주택임대차보호법 제3조의2", cite: { id: "C2", case: "주택임대차보호법 제3조의2", preview: "임대차가 종료된 경우에도 임차인이 보증금을 반환받을 때까지는 임대차 관계가 존속되는 것으로 본다. 임차인은 임대인에 대하여 보증금의 반환을 청구할 수 있다." }},
      { text: "에 따라 임차인이 임대인에게 손해를 입힌 경우 손해액을 공제하고 반환할 수 있습니다. ", cite: null },
      { text: "대법원 2021다55890 판결", cite: { id: "C3", case: "대법원 2021다55890", preview: "임대인이 보증금 반환채무와 임차인의 목적물 인도의무는 동시이행 관계에 있으므로, 임차인이 목적물을 인도하지 아니한 채 보증금 반환을 청구하는 경우 임대인은 동시이행의 항변권을 행사할 수 있다." }},
      { text: "에서는 목적물 인도와 보증금 반환이 동시이행 관계임을 확인하였습니다.", cite: null },
    ],
  },
  {
    id: 2,
    user: "계약 해지 통보 시 내용증명 발송이 법적으로 필수인가요?",
    answer: [
      { text: "내용증명 자체가 법적 요건은 아닙니다. 그러나 ", cite: null },
      { text: "민법 제111조", cite: { id: "C4", case: "민법 제111조", preview: "의사표시는 상대방에게 도달한 때에 그 효력이 생긴다. 의사표시자가 그 통지를 발송한 후 사망하거나 제한능력자가 되어도 의사표시의 효력에 영향을 미치지 아니한다." }},
      { text: "에 의해 의사표시는 '도달주의'를 원칙으로 하므로, 해지 통보의 도달 사실을 입증하기 위해 내용증명이 실무상 필수적으로 사용됩니다.", cite: null },
    ],
  },
];

interface Citation {
  id: string;
  case: string;
  preview: string;
}

export default function LegalChatUI({ onConsult }: { onConsult: (message?: string) => void }) {
  const [activeConv, setActiveConv] = useState(0);
  const [openCite, setOpenCite] = useState<Citation | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    const trimmed = inputVal.trim();
    if (!trimmed || analyzing) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 750));
    setAnalyzing(false);
    setInputVal("");
    onConsult(`질문: ${trimmed}`);
  };

  return (
    <section className="lcu-section" style={{ background: "#0D1117", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative glows */}
      <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(184,145,80,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(26,34,56,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(184,145,80,0.1)", border: "1px solid rgba(184,145,80,0.3)", borderRadius: 999, marginBottom: 20 }}>
            <Scale style={{ width: 12, height: 12, color: "#B89150" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B89150", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Legal Chat Interface
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
            법률 전용 AI 챗 인터페이스
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "rgba(148,163,184,0.9)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8, letterSpacing: "0.01em" }}>
            답변마다 사건번호·판결문 원문이 즉시 연동됩니다.<br />
            출처 버튼을 클릭하면 원문을 그 자리에서 확인하세요.
          </p>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, overflow: "hidden",
            backdropFilter: "blur(12px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            maxWidth: 900, margin: "0 auto",
          }}
        >
          {/* Titlebar */}
          <div style={{ padding: "16px 24px", background: "rgba(26,34,56,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => (
                <div key={c} style={{ width: 12, height: 12, background: c, borderRadius: "50%" }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", padding: "5px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                <Scale style={{ width: 12, height: 12, color: "#B89150" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Vision AI · 법률 전용 챗</span>
              </div>
            </div>
            {/* Scenario tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {CONVERSATIONS.map((_, i) => (
                <button key={i} onClick={() => { setActiveConv(i); setOpenCite(null); }}
                  style={{
                    padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    border: "1px solid",
                    borderColor: activeConv === i ? "#B89150" : "rgba(255,255,255,0.1)",
                    background: activeConv === i ? "rgba(184,145,80,0.12)" : "transparent",
                    color: activeConv === i ? "#B89150" : "rgba(255,255,255,0.35)",
                    transition: "all 0.15s",
                  }}
                >
                  Q{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Messages area */}
          <div className="lcu-messages" style={{ padding: "32px 32px 24px", minHeight: 340 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeConv}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* User message */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                  <div style={{
                    maxWidth: "70%", background: "rgba(184,145,80,0.15)",
                    border: "1px solid rgba(184,145,80,0.3)",
                    borderRadius: "18px 18px 4px 18px", padding: "14px 18px",
                  }}>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: 0, letterSpacing: "0.01em" }}>
                      {CONVERSATIONS[activeConv].user}
                    </p>
                  </div>
                </div>

                {/* AI message */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1A2238, #2A3A5C)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Scale style={{ width: 16, height: 16, color: "#B89150" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B89150", marginBottom: 8, letterSpacing: "0.04em" }}>Vision AI Legal</div>
                    <div style={{
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px 18px 18px 18px", padding: "18px 20px",
                    }}>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.85, margin: 0, letterSpacing: "0.01em" }}>
                        {CONVERSATIONS[activeConv].answer.map((seg, i) =>
                          seg.cite ? (
                            <button key={i}
                              onClick={() => setOpenCite(openCite?.id === seg.cite!.id ? null : seg.cite!)}
                              style={{
                                display: "inline",
                                background: openCite?.id === seg.cite.id ? "rgba(184,145,80,0.25)" : "rgba(184,145,80,0.12)",
                                border: "1px solid rgba(184,145,80,0.45)",
                                borderRadius: 6, padding: "1px 7px",
                                fontSize: 13, fontWeight: 700, color: "#D4A853",
                                cursor: "pointer", margin: "0 2px",
                                transition: "all 0.15s",
                              }}
                            >
                              {seg.text} <span style={{ fontSize: 10, opacity: 0.7 }}>[원문]</span>
                            </button>
                          ) : (
                            <span key={i}>{seg.text}</span>
                          )
                        )}
                      </p>

                      {/* Citation panel */}
                      <AnimatePresence>
                        {openCite && (
                          <motion.div
                            key={openCite.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{
                              marginTop: 16, background: "rgba(26,34,56,0.6)",
                              border: "1px solid rgba(184,145,80,0.3)",
                              borderRadius: 12, padding: "16px 18px",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <FileText style={{ width: 13, height: 13, color: "#B89150" }} />
                                  <span style={{ fontSize: 12, fontWeight: 800, color: "#B89150" }}>{openCite.case}</span>
                                </div>
                                <button onClick={() => setOpenCite(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex" }}>
                                  <X style={{ width: 14, height: 14 }} />
                                </button>
                              </div>
                              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, letterSpacing: "0.01em" }}>
                                {openCite.preview}
                              </p>
                              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                                <ChevronRight style={{ width: 12, height: 12, color: "#B89150" }} />
                                <span style={{ fontSize: 11, color: "#B89150", fontWeight: 600 }}>판결문 전문 보기</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Source chips */}
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {CONVERSATIONS[activeConv].answer
                        .filter(s => s.cite)
                        .map((s, i) => (
                          <button key={i}
                            onClick={() => setOpenCite(openCite?.id === s.cite!.id ? null : s.cite!)}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              padding: "4px 10px", borderRadius: 8,
                              background: openCite?.id === s.cite!.id ? "rgba(184,145,80,0.2)" : "rgba(255,255,255,0.05)",
                              border: "1px solid",
                              borderColor: openCite?.id === s.cite!.id ? "rgba(184,145,80,0.5)" : "rgba(255,255,255,0.1)",
                              fontSize: 11, color: openCite?.id === s.cite!.id ? "#D4A853" : "rgba(255,255,255,0.4)",
                              cursor: "pointer", transition: "all 0.15s",
                            }}
                          >
                            <FileText style={{ width: 10, height: 10 }} />
                            {s.cite!.case}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="lcu-input-bar" style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="lcu-input-row" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: 10,
                background: analyzing ? "rgba(184,145,80,0.08)" : "rgba(255,255,255,0.05)",
                border: analyzing ? "1px solid rgba(184,145,80,0.4)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "10px 16px", transition: "all 0.3s",
              }}>
                {analyzing && (
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.18 }}
                        style={{ width: 5, height: 5, background: "#B89150", borderRadius: "50%" }}
                      />
                    ))}
                  </div>
                )}
                <input
                  ref={inputRef}
                  value={analyzing ? "" : inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                  onFocus={() => setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
                  disabled={analyzing}
                  placeholder={analyzing ? "상담 폼을 준비하는 중입니다..." : "법률 질문을 입력하고 Enter → 상담 연결..."}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: analyzing ? "rgba(184,145,80,0.7)" : "rgba(255,255,255,0.7)", fontFamily: "inherit", fontStyle: analyzing ? "italic" : "normal" }}
                />
              </div>
              <button onClick={handleSend} disabled={analyzing} style={{
                width: 42, height: 42,
                background: analyzing ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #B89150, #D4A853)",
                border: "none", borderRadius: 12, cursor: analyzing ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: analyzing ? "none" : "0 4px 16px rgba(184,145,80,0.3)",
                transition: "all 0.3s",
              }}>
                {analyzing
                  ? <Loader2 style={{ width: 16, height: 16, color: "#B89150", animation: "spin 1s linear infinite" }} />
                  : <Send style={{ width: 16, height: 16, color: "white" }} />
                }
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              질문 입력 후 Enter → 상담 신청 폼에 내용이 자동 채워집니다
            </div>
          </div>
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @media (max-width: 768px) {
              .lcu-section { padding: 60px 24px !important; }
              .lcu-messages { padding: 20px 16px 16px !important; min-height: auto !important; }
              .lcu-input-bar { padding: 12px 16px !important; }
              .lcu-input-row { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
              .lcu-input-row > button { width: 100% !important; height: 44px !important; border-radius: 12px !important; }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}
