"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const legacy = [
  "출처 불분명한 환각(Hallucination) 답변",
  "사건 기록 외부 클라우드 전송 위험",
  "최신 판례·법령 반영 지연",
  "법률 전문 용어 오해석",
  "감사 로그 부재 — 책임 소재 불명확",
];

const vision = [
  "모든 답변에 원문 조항·판례 출처 표기",
  "On-Premise 폐쇄망 — 데이터 외부 유출 Zero",
  "실시간 법령 데이터베이스 자동 동기화",
  "법률 특화 파인튜닝 모델 탑재",
  "전 요청 감사 로그 — 완전한 투명성 보장",
];

export default function LegalComparison() {
  return (
    <section style={{ background: "#F8FAFC", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(26,34,56,0.07)", border: "1px solid rgba(26,34,56,0.15)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1A2238", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Why Vision AI
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            왜 기존 AI는 법률에 부적합한가?
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#64748B", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            법률 업무는 단순한 텍스트 생성이 아닙니다.<br />
            정확한 출처와 철저한 보안이 생명입니다.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "start" }}>
          {/* Legacy AI */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
          >
            {/* Card header */}
            <div style={{ padding: "24px 28px", background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)", borderBottom: "1px solid #FECDD3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#FCA5A5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X style={{ width: 20, height: 20, color: "#DC2626" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>기존 범용 AI</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>ChatGPT / 일반 LLM</div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {legacy.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 22, height: 22, background: "#FEE2E2", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <X style={{ width: 13, height: 13, color: "#DC2626" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* VS divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: 56, height: 56, background: "linear-gradient(135deg, #1A2238, #3B82F6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(26,34,56,0.3)", color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "0.02em" }}
            >
              VS
            </motion.div>
          </div>

          {/* Vision AI */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "2px solid #1A2238", boxShadow: "0 8px 40px rgba(26,34,56,0.15)" }}
          >
            {/* Card header */}
            <div style={{ padding: "24px 28px", background: "linear-gradient(135deg, #F5F6FA 0%, #E8ECF2 100%)", borderBottom: "1px solid #C8D0DE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#1A2238", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1A2238", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Vision AI</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>법률 특화 RAG 솔루션</div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {vision.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 22, height: 22, background: "#E8ECF2", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 13, height: 13, color: "#1A2238" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.6, fontWeight: 500 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
