"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, FileSearch, MessageSquare, ChevronRight } from "lucide-react";

const cases = [
  {
    icon: Scale,
    tag: "Case 01",
    title: "유사 판례 고속 검색",
    subtitle: "10년치 판결문을 3초 안에",
    desc: "과거 유사한 손해배상 판결문 10년 치를 분석하여 승소 확률을 계산합니다. 사건 키워드만 입력하면 가장 유리한 판례를 순위별로 제시합니다.",
    detail: [
      "수십만 건 판례 데이터베이스 벡터 검색",
      "유사도 점수 및 판결 결과 요약",
      "인용 가능한 원문 조항 자동 추출",
      "법원·연도별 필터링 지원",
    ],
    color: "#1A2238",
    gradient: "linear-gradient(135deg, #F5F6FA 0%, #E8ECF2 100%)",
    accent: "#E8ECF2",
  },
  {
    icon: FileSearch,
    tag: "Case 02",
    title: "계약서 리스크 검토",
    subtitle: "독소 조항을 즉시 탐지",
    desc: "수백 페이지의 계약서 중 사내 표준 가이드라인에 위배되는 독소 조항을 즉시 탐지합니다. 위험도를 High·Mid·Low로 자동 분류합니다.",
    detail: [
      "PDF·Word 계약서 대용량 업로드",
      "Risk Score 자동 산정 (High/Mid/Low)",
      "표준 계약서 대비 편차 조항 하이라이트",
      "수정 권고안 초안 자동 작성",
    ],
    color: "#0F766E",
    gradient: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
    accent: "#CCFBF1",
  },
  {
    icon: MessageSquare,
    tag: "Case 03",
    title: "법률 상담 자동화",
    subtitle: "반복 질의 응답 80% 자동화",
    desc: "반복적인 단순 법률 질의에 대해 정확한 법적 근거를 바탕으로 초안을 작성합니다. 변호사는 복잡한 사건에만 집중할 수 있습니다.",
    detail: [
      "24/7 자동 초안 답변 생성",
      "모든 답변에 법령·판례 출처 첨부",
      "변호사 검토 후 1-click 승인",
      "고객 포털 연동 가능",
    ],
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
    accent: "#EDE9FE",
  },
];

export default function LegalUseCases() {
  const [active, setActive] = useState(0);

  return (
    <>
    <section className="lu-section" style={{ background: "#EFF6FF", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(26,34,56,0.07)", border: "1px solid rgba(26,34,56,0.15)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1A2238", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Use Cases
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            구체적 도입 시나리오
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            법무법인과 기업 법무팀이 Vision AI를 도입한 후<br />
            실제로 달라진 세 가지 업무 시나리오입니다.
          </p>
        </motion.div>

        <div className="lu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "start" }}>
          {/* Left: Tab list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cases.map((c, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "24px", borderRadius: 16,
                  border: active === i ? `2px solid ${c.color}` : "2px solid #E2E8F0",
                  background: active === i ? c.gradient : "white",
                  cursor: "pointer", transition: "all 0.25s",
                  boxShadow: active === i ? `0 8px 32px ${c.color}18` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, background: active === i ? c.color : "#F1F5F9", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
                    <c.icon style={{ width: 22, height: 22, color: active === i ? "white" : "#94A3B8" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active === i ? c.color : "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{c.tag}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{c.subtitle}</div>
                  </div>
                  <ChevronRight style={{ width: 18, height: 18, color: active === i ? c.color : "#CBD5E1", flexShrink: 0, transition: "all 0.25s" }} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right: Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{
                background: cases[active].gradient,
                border: `2px solid ${cases[active].accent}`,
                borderRadius: 24, padding: "40px",
                boxShadow: `0 16px 48px ${cases[active].color}12`,
              }}
            >
              {/* Icon + tag */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{ width: 60, height: 60, background: cases[active].color, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {React.createElement(cases[active].icon, { style: { width: 28, height: 28, color: "white" } })}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: cases[active].color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{cases[active].tag}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>{cases[active].title}</div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, marginBottom: 32 }}>
                {cases[active].desc}
              </p>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cases[active].detail.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ width: 8, height: 8, background: cases[active].color, borderRadius: "50%", flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#1E293B", fontWeight: 500 }}>{d}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .lu-section { padding: 60px 24px !important; }
        .lu-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      }
    `}</style>
    </>
  );
}
