"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, Search, GitMerge } from "lucide-react";

const hallucinations = [
  {
    q: "이 계약서의 지체상금 조항이 적법한가요?",
    bad: "네, 지체상금은 계약금액의 10% 한도 내에서 유효합니다.",
    badNote: "출처 없음 · 실제 규정과 다름",
    good: "국가계약법 시행규칙 제75조에 의해 지체상금률은 1/1000 이상이어야 하며, 해당 조항의 0.5/1000은 위법 소지가 있습니다.",
    goodNote: "국가계약법 시행규칙 제75조 [1]",
  },
  {
    q: "손해배상 청구 소멸시효는 얼마인가요?",
    bad: "손해배상 소멸시효는 5년입니다.",
    badNote: "출처 없음 · 사안에 따라 다름",
    good: "민법 제766조에 따라 불법행위로 인한 손해배상은 손해 및 가해자를 안 날로부터 3년, 행위 시로부터 10년입니다.",
    goodNote: "민법 제766조 · 대법원 2022다12345 [1][2]",
  },
];

const features = [
  {
    icon: Search,
    title: "판례 교차 검색",
    desc: "단일 판례가 아닌 연관 판례군을 동시에 검색하여 주류 판결 흐름과 소수 의견을 함께 제시합니다.",
    tag: "Cross-reference",
  },
  {
    icon: AlertTriangle,
    title: "계약서 독소 조항 자동 탐지",
    desc: "수백 페이지 계약서에서 사내 가이드라인 위배 조항, 불균형 책임 조항, 불명확한 해지 조건을 자동으로 탐지합니다.",
    tag: "Risk Detection",
  },
  {
    icon: GitMerge,
    title: "비정형 법률 문서 정형화 분석",
    desc: "계약서·내용증명·판결문·공문 등 다양한 비정형 문서를 구조화하여 핵심 조항과 당사자 의무를 추출합니다.",
    tag: "Document Parsing",
  },
];

export default function LegalWhyRag() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ background: "#F8FAFC", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(184,145,80,0.08)", border: "1px solid rgba(184,145,80,0.3)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B89150", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Why RAG
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0D1117", letterSpacing: "-0.03em", marginBottom: 16 }}>
            왜 법률에 RAG가 필요한가?
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "#64748B", maxWidth: 580, margin: "0 auto", lineHeight: 1.8, letterSpacing: "0.01em" }}>
            일반 GPT의 환각(Hallucination)은 일상에서는 불편이지만,<br />
            법률 현장에서는 소송 패소와 직업적 책임으로 이어집니다.
          </p>
        </motion.div>

        {/* Hallucination demo */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{
            background: "white", borderRadius: 24,
            border: "1px solid #E8ECF2",
            boxShadow: "0 8px 40px rgba(26,34,56,0.07)",
            overflow: "hidden", marginBottom: 64,
          }}
        >
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9" }}>
            {hallucinations.map((h, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flex: 1, padding: "18px 24px", fontSize: 13, fontWeight: 700,
                  border: "none", cursor: "pointer", transition: "all 0.2s",
                  background: active === i ? "white" : "#F8FAFC",
                  color: active === i ? "#1A2238" : "#94A3B8",
                  borderBottom: active === i ? "2px solid #B89150" : "2px solid transparent",
                }}
              >
                시나리오 {i + 1}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ padding: "32px 40px" }}
            >
              {/* Question */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>질문</div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, background: "#1A2238", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, color: "white" }}>⚖</span>
                  </div>
                  <p style={{ fontSize: 15, color: "#1E293B", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{hallucinations[active].q}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Bad: GPT */}
                <div style={{ background: "#FFF8F8", border: "1px solid #FECACA", borderRadius: 16, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: "#EF4444" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#EF4444", letterSpacing: "0.04em" }}>일반 GPT 답변</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, marginBottom: 12, letterSpacing: "0.01em" }}>{hallucinations[active].bad}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#FEE2E2", borderRadius: 8 }}>
                    <div style={{ width: 6, height: 6, background: "#EF4444", borderRadius: "50%" }} />
                    <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>{hallucinations[active].badNote}</span>
                  </div>
                </div>

                {/* Good: Vision AI */}
                <div style={{ background: "#FAFDF8", border: "1px solid #D4B483", borderRadius: 16, padding: "24px", boxShadow: "0 4px 16px rgba(184,145,80,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: "#B89150" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#B89150", letterSpacing: "0.04em" }}>Vision AI 근거 기반 답변</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.75, marginBottom: 12, letterSpacing: "0.01em" }}>{hallucinations[active].good}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#F5EDD9", borderRadius: 8 }}>
                    <FileText style={{ width: 11, height: 11, color: "#B89150" }} />
                    <span style={{ fontSize: 11, color: "#92700A", fontWeight: 600 }}>{hallucinations[active].goodNote}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Feature list */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{
                background: "white", border: "1px solid #E8ECF2",
                borderRadius: 20, padding: "32px",
                boxShadow: "0 4px 20px rgba(26,34,56,0.05)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #1A2238, #2A3A5C)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <f.icon style={{ width: 22, height: 22, color: "#B89150" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#B89150", background: "rgba(184,145,80,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(184,145,80,0.25)" }}>{f.tag}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0D1117", marginBottom: 12, letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, margin: 0, letterSpacing: "0.01em" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
