"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ExternalLink, Shield, X, ChevronRight, MessageSquare } from "lucide-react";

/* ── Citation data ──────────────────────────────────────────────────────── */
interface Citation {
  id: number;
  title: string;
  law: string;
  article: string;
  excerpt: string;
  source: string;
  updated: string;
  confidence: number;
}

const CITATIONS: Citation[] = [
  {
    id: 1,
    title: "법인세법 제25조 제1항",
    law: "법인세법",
    article: "§25 접대비의 한도액 계산",
    excerpt:
      "각 사업연도에 지출한 접대비 한도액은 다음 각 호의 금액을 합산한 금액으로 한다.\n\n1. 기본금액: 중소기업 36,000,000원, 그 외 12,000,000원\n\n2. 수입금액 기준: 100억 이하 부분의 100분의 0.3, 100억 초과 500억 이하 부분의 100분의 0.2...\n\n[단서] 문화접대비를 지출한 경우 한도액의 20%를 추가 인정한다.",
    source: "국세청 법령정보시스템",
    updated: "2024.01.01 개정",
    confidence: 0.98,
  },
  {
    id: 2,
    title: "법인세법 시행령 제41조",
    law: "법인세법 시행령",
    article: "§41 접대비의 범위",
    excerpt:
      "법 제25조에 따른 접대비란 다음 각 호의 어느 하나에 해당하는 비용을 말한다.\n\n1. 기업 업무와 관련하여 지출한 거래처 접대·향응·위안 비용\n2. 경조사비 (기준금액 20만원 이하 건당)\n3. 골프 접대비 (영수증 필수 구비)\n\n※ 1만원 초과 지출 시 법인 신용카드 또는 현금영수증 필수",
    source: "국세청 법령정보시스템",
    updated: "2023.12.31 개정",
    confidence: 0.96,
  },
  {
    id: 3,
    title: "국세청 예규 법인세과-2024-142호",
    law: "국세청 예규",
    article: "2024 접대비 한도 상향 적용 지침",
    excerpt:
      "2024년 세법 개정(법인세법 §25 개정)에 따른 중소기업 접대비 기본 한도 상향(2,400만원 → 3,600만원) 관련 유권해석:\n\n■ 적용 기준일: 2024.01.01 이후 지출분부터 소급 적용\n■ 중소기업 판정: 조세특례제한법 §2에 의한 기준 준수\n■ 연도 중 중소기업 해당 여부 변동 시: 해당 사업연도 말일 기준으로 판정",
    source: "국세청 법령정보시스템 예규",
    updated: "2024.03.15 공고",
    confidence: 0.94,
  },
];

/* ── Preset questions ───────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    q: "소규모 법인 접대비 한도는 어떻게 계산하나요?",
    answer: [
      { text: "소규모 법인의 접대비 한도액은 ", cite: null },
      { text: "기본 한도 + 수입금액 한도", cite: null },
      { text: "의 합산으로 계산합니다.\n\n", cite: null },
      { text: "① 기본 한도", cite: null },
      { text: ": 중소기업은 연 3,600만원", cite: 1 },
      { text: "이며, 일반 법인은 연 1,200만원입니다.\n\n", cite: null },
      { text: "② 수입금액 한도", cite: null },
      { text: ": 수입금액 100억 이하 × 0.3%, 100억 초과~500억 × 0.2%", cite: 2 },
      { text: "를 추가 계상합니다.\n\n", cite: null },
      { text: "③ 2024년 개정 사항", cite: null },
      { text: ": 중소기업 기본한도가 2,400만원 → 3,600만원으로 상향, 2024.01.01부터 소급 적용", cite: 3 },
      { text: " 됩니다.\n\n⚠️ 권고: 골프 접대비 및 경조사비는 별도 증빙 기준이 적용됩니다. 상세 검토가 필요합니다.", cite: null },
    ],
  },
  {
    q: "R&D 세액공제 요건과 공제율을 알려주세요.",
    answer: [
      { text: "연구개발(R&D) 세액공제는 조세특례제한법 §10에 따라 다음과 같이 적용됩니다.\n\n", cite: null },
      { text: "① 신성장·원천기술 R&D", cite: 1 },
      { text: ": 중소기업 30~40%, 중견기업 20%, 대기업 10~20%\n\n", cite: null },
      { text: "② 일반 R&D", cite: 2 },
      { text: ": 중소기업 25%, 중견기업 8%, 대기업 2% (증가분 방식 선택 가능)\n\n", cite: null },
      { text: "③ 적용 유의사항", cite: 3 },
      { text: ": 연구 전담 부서 요건 충족 및 연구노트 구비 필수. 최근 세무조사 강화 추세.", cite: null },
    ],
  },
];

/* ── Inline citation badge ──────────────────────────────────────────────── */
function CiteBadge({ num, onClick, active }: { num: number; onClick: () => void; active: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, borderRadius: "50%", border: "none", cursor: "pointer",
        background: active ? "#10B981" : "rgba(16,185,129,0.15)",
        color: active ? "white" : "#059669",
        fontSize: 10, fontWeight: 800,
        marginLeft: 3, marginRight: 1,
        verticalAlign: "middle",
        transition: "background 0.2s",
        boxShadow: active ? "0 0 8px rgba(16,185,129,0.5)" : "none",
        flexShrink: 0,
      }}
    >{num}</motion.button>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function TaxRAGDemo() {
  const [qIdx, setQIdx] = useState(0);
  const [activeCite, setActiveCite] = useState<Citation | null>(null);
  const currentQ = QUESTIONS[qIdx];

  const handleCite = (id: number) => {
    const c = CITATIONS.find(c => c.id === id) ?? null;
    setActiveCite(prev => prev?.id === id ? null : c);
  };

  return (
    <>
    <section id="tax-rag-demo" className="trd-section" style={{
      background: "#1E293B",
      padding: "100px 24px",
      borderTop: "1px solid rgba(51,65,85,0.8)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 4,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            marginBottom: 20,
          }}>
            <BookOpen style={{ width: 13, height: 13, color: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              RAG Citation Demo
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "white", lineHeight: 1.25, marginBottom: 16,
          }}>
            AI 답변 옆에 항상<br />법령 근거가 붙습니다
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "rgba(148,163,184,0.6)", lineHeight: 1.8 }}>
            번호 배지를 클릭하면 국세청 법령 원문이 즉시 열립니다.
          </p>
        </motion.div>

        {/* Demo area */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", position: "relative" }}
        >

          {/* ── Left: Chat panel ──────────────────────────────────── */}
          <div style={{
            flex: 1, background: "#0F172A",
            border: "1px solid rgba(51,65,85,0.7)",
            borderRight: activeCite ? "none" : undefined,
            borderRadius: activeCite ? "16px 0 0 16px" : 16,
            display: "flex", flexDirection: "column",
            minWidth: 0,
          }}>
            {/* Chat header */}
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(51,65,85,0.6)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(30,41,59,0.5)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#EF4444","#F59E0B","#22C55E"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginLeft: 6 }}>
                  Vision AI — 세무/회계 전문 Agent
                </span>
              </div>
              <div style={{
                padding: "3px 8px", borderRadius: 4,
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                fontSize: 10, fontWeight: 700, color: "#10B981",
              }}>LIVE DEMO</div>
            </div>

            {/* Question selector */}
            <div style={{
              display: "flex", gap: 8, padding: "12px 16px",
              borderBottom: "1px solid rgba(51,65,85,0.4)",
              flexWrap: "wrap",
            }}>
              {QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => { setQIdx(i); setActiveCite(null); }}
                  style={{
                    padding: "5px 12px", borderRadius: 5, cursor: "pointer",
                    border: `1px solid ${qIdx === i ? "rgba(16,185,129,0.5)" : "rgba(51,65,85,0.6)"}`,
                    background: qIdx === i ? "rgba(16,185,129,0.1)" : "transparent",
                    color: qIdx === i ? "#10B981" : "rgba(148,163,184,0.5)",
                    fontSize: 11, fontWeight: 600, transition: "all 0.2s",
                  }}
                >질문 {i + 1}</button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ padding: "20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 16, overflow: "auto" }}>

              {/* User bubble */}
              <AnimatePresence mode="wait">
                <motion.div key={`q-${qIdx}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px",
                    background: "#334155", borderRadius: "12px 12px 2px 12px",
                    fontSize: 13.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.6,
                  }}>
                    {currentQ.q}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* AI bubble */}
              <AnimatePresence mode="wait">
                <motion.div key={`a-${qIdx}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#10B981",
                  }}>AI</div>

                  <div style={{
                    flex: 1, padding: "14px 16px",
                    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.6)",
                    borderRadius: "2px 12px 12px 12px",
                    fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                  }}>
                    {currentQ.answer.map((seg, i) => (
                      <React.Fragment key={i}>
                        {seg.text}
                        {seg.cite && (
                          <CiteBadge
                            num={seg.cite}
                            onClick={() => handleCite(seg.cite!)}
                            active={activeCite?.id === seg.cite}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Citations footer */}
              <div style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", fontWeight: 600, marginBottom: 4 }}>
                  📎 출처 (클릭하여 원문 확인)
                </p>
                {CITATIONS.slice(0, 3).map((c) => (
                  <button key={c.id} onClick={() => handleCite(c.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 12px", borderRadius: 6, cursor: "pointer",
                      border: `1px solid ${activeCite?.id === c.id ? "rgba(16,185,129,0.45)" : "rgba(51,65,85,0.5)"}`,
                      background: activeCite?.id === c.id ? "rgba(16,185,129,0.07)" : "transparent",
                      transition: "all 0.2s", textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      background: activeCite?.id === c.id ? "#10B981" : "rgba(16,185,129,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 800, color: activeCite?.id === c.id ? "white" : "#10B981",
                    }}>{c.id}</div>
                    <span style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", flex: 1 }}>{c.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Shield style={{ width: 10, height: 10, color: "#10B981" }} />
                      <span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>
                        {(c.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <ChevronRight style={{ width: 12, height: 12, color: "rgba(148,163,184,0.3)" }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Citation detail panel ─────────────────────── */}
          <AnimatePresence>
            {activeCite && (
              <motion.div
                key={activeCite.id}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                style={{
                  overflow: "hidden", flexShrink: 0,
                  background: "#0F172A",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderLeft: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "0 16px 16px 0",
                }}
              >
                <div style={{ width: 340, padding: "20px", height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Panel header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "3px 9px", borderRadius: 4,
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                        marginBottom: 8,
                      }}>
                        <BookOpen style={{ width: 11, height: 11, color: "#10B981" }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>법령 원문</span>
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: "white", lineHeight: 1.35 }}>
                        {activeCite.title}
                      </div>
                    </div>
                    <button onClick={() => setActiveCite(null)}
                      style={{
                        width: 26, height: 26, borderRadius: "50%", border: "none", cursor: "pointer",
                        background: "rgba(51,65,85,0.6)", color: "rgba(148,163,184,0.7)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    ><X style={{ width: 13, height: 13 }} /></button>
                  </div>

                  {/* Article tag */}
                  <div style={{
                    padding: "5px 10px", borderRadius: 4, marginBottom: 14,
                    background: "rgba(51,65,85,0.4)", border: "1px solid rgba(51,65,85,0.6)",
                    fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.7)",
                  }}>
                    {activeCite.article}
                  </div>

                  {/* Excerpt */}
                  <div style={{
                    flex: 1, padding: "14px 16px", borderRadius: 8,
                    background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)",
                    fontSize: 12.5, color: "rgba(203,213,225,0.85)", lineHeight: 1.85,
                    whiteSpace: "pre-wrap", overflowY: "auto",
                    marginBottom: 14,
                  }}>
                    {activeCite.excerpt}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <ExternalLink style={{ width: 11, height: 11, color: "#10B981" }} />
                      <span style={{ fontSize: 11, color: "rgba(148,163,184,0.6)" }}>{activeCite.source}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "rgba(148,163,184,0.45)" }}>{activeCite.updated}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Shield style={{ width: 11, height: 11, color: "#10B981" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>
                          신뢰도 {(activeCite.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginTop: 32, padding: "22px 28px", borderRadius: 10,
            background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)",
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}
        >
          <MessageSquare style={{ width: 20, height: 20, color: "#10B981", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 3 }}>
              귀사의 세무 질문을 Vision AI에게 직접 물어보세요.
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(148,163,184,0.5)" }}>
              모든 답변에 법령 근거가 포함됩니다. 할루시네이션 없는 정확한 정보만 제공합니다.
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 900px) {
        .trd-section { padding: 70px 24px !important; }
      }
    `}</style>
    </>
  );
}
