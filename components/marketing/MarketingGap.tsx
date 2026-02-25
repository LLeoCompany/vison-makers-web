"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, Check, AlertTriangle, Database, TrendingUp, BookOpen } from "lucide-react";

const PROBLEMS = [
  { icon: AlertTriangle, text: "우리 브랜드만의 '톤앤매너'를 전혀 모른다" },
  { icon: AlertTriangle, text: "과거에 어떤 광고가 잘 됐는지 ROAS 데이터가 없다" },
  { icon: AlertTriangle, text: "경쟁사와 구분되지 않는 무색무취한 문구를 뱉는다" },
  { icon: AlertTriangle, text: "오늘 트렌드와 연결된 아이디어를 스스로 제안 못 한다" },
];

const SOLUTIONS = [
  { icon: BookOpen, text: "브랜드 가이드북 · 히스토리 카피 전수 학습", color: "#0EA5E9" },
  { icon: Database, text: "ROAS·CTR·전환율 과거 성과 DB 실시간 참조", color: "#8B5CF6" },
  { icon: TrendingUp, text: "외부 트렌드 데이터 + 사내 자산 결합 브레인스토밍", color: "#0EA5E9" },
  { icon: Check, text: "인스타·페북·구글 채널별 최적 포맷 자동 분리", color: "#8B5CF6" },
];

export default function MarketingGap() {
  return (
    <section style={{ background: "#FFFFFF", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative top stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.22)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.06em", textTransform: "uppercase" }}>The Gap</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            왜 단순한 ChatGPT로는<br />부족한가?
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#64748B", maxWidth: 540, margin: "0 auto", lineHeight: 1.8 }}>
            일반 AI는 모든 브랜드에게 똑같이 답합니다.<br />
            Vision AI는 오직 귀사의 데이터로만 답합니다.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* Left — General AI problems */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 24, padding: "36px 36px 40px", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#E2E8F0" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, marginBottom: 24 }}>
              <X style={{ width: 13, height: 13, color: "#EF4444" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }}>일반 AI (ChatGPT 등)</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {PROBLEMS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 28, height: 28, background: "#FEF2F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <p.icon style={{ width: 13, height: 13, color: "#EF4444" }} />
                  </div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{p.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Sample bad copy */}
            <div style={{ marginTop: 28, padding: "16px 18px", background: "white", border: "1px solid #E2E8F0", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 8, letterSpacing: "0.05em" }}>AI 생성 카피 예시</div>
              <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                &ldquo;최고의 품질로 만들어진 제품을 경험해보세요. 지금 바로 구매하시면 특별 혜택을 드립니다.&rdquo;
              </p>
              <div style={{ marginTop: 10, fontSize: 11, color: "#EF4444", fontWeight: 600 }}>😑 어느 브랜드에나 쓸 수 있는 문구</div>
            </div>
          </motion.div>

          {/* Right — Vision AI solution */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: "linear-gradient(145deg, #F0F9FF 0%, #F5F3FF 100%)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24, padding: "36px 36px 40px", position: "relative", overflow: "hidden", boxShadow: "0 8px 40px rgba(139,92,246,0.1)" }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 8, marginBottom: 24 }}>
              <Check style={{ width: 13, height: 13, color: "#0EA5E9" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9" }}>Vision AI — Brand-Specific RAG</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {SOLUTIONS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 28, height: 28, background: s.color === "#0EA5E9" ? "rgba(14,165,233,0.12)" : "rgba(139,92,246,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <s.icon style={{ width: 13, height: 13, color: s.color }} />
                  </div>
                  <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Sample good copy */}
            <div style={{ marginTop: 28, padding: "16px 18px", background: "white", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", marginBottom: 8, letterSpacing: "0.05em" }}>Vision AI 생성 카피 예시</div>
              <p style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                &ldquo;지난 시즌 CTR 1위 캠페인 소구점 반영 — 한계를 박차는 그 발걸음, 지금 네 차례야. #RUN24&rdquo;
              </p>
              <div style={{ marginTop: 10, fontSize: 11, color: "#0EA5E9", fontWeight: 600 }}>✨ 귀사 ROAS 데이터 + 브랜드 보이스 반영</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
