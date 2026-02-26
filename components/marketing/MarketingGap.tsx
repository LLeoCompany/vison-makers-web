"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Check, BookOpen, Database, TrendingUp, Sparkles } from "lucide-react";

/* ── Data source nodes for the RAG flow visualization ── */
const DATA_SOURCES = [
  { icon: BookOpen,  label: "브랜드 가이드북",  sub: "톤앤매너 · 보이스 · 슬로건", color: "#0EA5E9" },
  { icon: Database,  label: "ROAS 성과 DB",     sub: "CTR · 전환율 · 과거 캠페인",  color: "#8B5CF6" },
  { icon: TrendingUp,label: "트렌드 리서치",    sub: "실시간 키워드 · 경쟁사 동향",  color: "#F43F5E" },
];

const PROBLEMS = [
  "브랜드 톤앤매너를 전혀 모른 채 일반적인 문구를 생성한다",
  "과거 ROAS 데이터 없이 성과 없는 카피를 반복한다",
  "경쟁사와 구분되지 않는 무색무취한 광고 문구를 뱉는다",
  "오늘의 트렌드와 연결된 아이디어를 스스로 제안하지 못한다",
];

const SOLUTIONS = [
  { color: "#0EA5E9", text: "브랜드 가이드북 · 히스토리 카피 전수 학습" },
  { color: "#8B5CF6", text: "ROAS·CTR·전환율 과거 성과 DB 실시간 참조" },
  { color: "#F43F5E", text: "외부 트렌드 + 사내 자산 결합 브레인스토밍" },
  { color: "#0EA5E9", text: "인스타·페북·구글 채널별 최적 포맷 자동 분리" },
];

/* ── Animated connecting line ── */
function PulseLine({ delay = 0 }: { delay?: number }) {
  return (
    <div style={{ flex: 1, height: 1, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)" }} />
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 1.8, delay, ease: "linear" }}
        style={{ position: "absolute", top: 0, left: 0, width: "40%", height: 1,
          background: "linear-gradient(90deg, transparent, #8B5CF6, #0EA5E9, transparent)" }}
      />
    </div>
  );
}

export default function MarketingGap() {
  return (
    <section style={{ background: "#0F172A", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Aurora bg glows */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "15%", width: 500, height: 350, background: "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0EA5E9, #8B5CF6, transparent)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 999, marginBottom: 24 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#8B5CF6" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.08em", textTransform: "uppercase" }}>The Difference</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 18,
            background: "linear-gradient(90deg, #fff 30%, rgba(148,163,184,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            왜 단순한 ChatGPT로는<br />부족한가?
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)", color: "rgba(148,163,184,0.75)", maxWidth: 500, margin: "0 auto", lineHeight: 1.85 }}>
            일반 AI는 모든 브랜드에게 똑같이 답합니다.<br />
            Vision AI는 오직 귀사의 데이터로만 답합니다.
          </p>
        </motion.div>

        {/* ── RAG Data Flow Visualization ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center", flexWrap: "wrap", rowGap: 24 }}>
            {/* Data source nodes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DATA_SOURCES.map((src, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)",
                    border: `1px solid ${src.color}33`, borderRadius: 14,
                    boxShadow: `0 0 20px ${src.color}18`,
                    minWidth: 240,
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${src.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <src.icon style={{ width: 16, height: 16, color: src.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{src.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", marginTop: 1 }}>{src.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated connecting lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 8px", alignSelf: "stretch", justifyContent: "space-around" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", width: 80 }}>
                  <PulseLine delay={i * 0.5} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", flexShrink: 0 }} />
                </div>
              ))}
            </div>

            {/* AI Engine center node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.55 }}
              style={{ position: "relative" }}
            >
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                style={{ position: "absolute", inset: -16, borderRadius: 28, background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", pointerEvents: "none" }}
              />
              <div style={{
                width: 140, height: 140, borderRadius: 24,
                background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(139,92,246,0.3))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139,92,246,0.4)",
                boxShadow: "0 0 0 1px rgba(139,92,246,0.2), 0 8px 40px rgba(139,92,246,0.3), 0 0 80px rgba(14,165,233,0.1)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 32 }}>🧠</span>
                <div style={{ fontSize: 11, fontWeight: 800, color: "white", textAlign: "center", letterSpacing: "0.04em" }}>BRAND-SPECIFIC<br />RAG ENGINE</div>
              </div>
            </motion.div>

            {/* Right connecting lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 8px", alignSelf: "stretch", justifyContent: "space-around" }}>
              {[0.2, 0.7, 1.2].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", width: 80 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #8B5CF6, #F43F5E)", flexShrink: 0 }} />
                  <PulseLine delay={d} />
                </div>
              ))}
            </div>

            {/* Output nodes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "인스타그램 카피", emoji: "📸", color: "#F43F5E" },
                { label: "페이스북 광고", emoji: "📘", color: "#0EA5E9" },
                { label: "구글 검색광고", emoji: "🔍", color: "#8B5CF6" },
              ].map((out, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
                    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)",
                    border: `1px solid ${out.color}2A`, borderRadius: 14,
                    boxShadow: `0 0 20px ${out.color}14`,
                    minWidth: 200,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{out.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{out.label}</span>
                  <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: out.color, boxShadow: `0 0 8px ${out.color}` }} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Comparison Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

          {/* Left — General AI problems */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              background: "rgba(239,68,68,0.04)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(239,68,68,0.15)", borderRadius: 24,
              padding: "36px 36px 40px", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, rgba(239,68,68,0.6), transparent)" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, marginBottom: 24 }}>
              <X style={{ width: 13, height: 13, color: "#EF4444" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }}>일반 AI (ChatGPT 등)</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PROBLEMS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 26, height: 26, background: "rgba(239,68,68,0.12)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <X style={{ width: 12, height: 12, color: "#EF4444" }} />
                  </div>
                  <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.85)", lineHeight: 1.7, margin: 0 }}>{p}</p>
                </motion.div>
              ))}
            </div>

            {/* Sample bad copy */}
            <div style={{ marginTop: 28, padding: "16px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.6)", marginBottom: 8, letterSpacing: "0.05em" }}>AI 생성 카피 예시</div>
              <p style={{ fontSize: 13, color: "rgba(148,163,184,0.55)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                &ldquo;최고의 품질로 만들어진 제품을 경험해보세요. 지금 바로 구매하시면 특별 혜택을 드립니다.&rdquo;
              </p>
              <div style={{ marginTop: 10, fontSize: 11, color: "rgba(239,68,68,0.7)", fontWeight: 600 }}>😑 어느 브랜드에나 쓸 수 있는 문구</div>
            </div>
          </motion.div>

          {/* Right — Vision AI solutions */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{
              background: "rgba(14,165,233,0.05)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24,
              padding: "36px 36px 40px", position: "relative", overflow: "hidden",
              boxShadow: "0 8px 40px rgba(139,92,246,0.1)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 8, marginBottom: 24 }}>
              <Check style={{ width: 13, height: 13, color: "#0EA5E9" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9" }}>Vision AI — Brand-Specific RAG</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SOLUTIONS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 26, height: 26, background: `${s.color}18`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 12, height: 12, color: s.color }} />
                  </div>
                  <p style={{ fontSize: 13.5, color: "rgba(226,232,240,0.88)", lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Sample good copy */}
            <div style={{ marginTop: 28, padding: "16px 18px", background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", marginBottom: 8, letterSpacing: "0.05em" }}>Vision AI 생성 카피 예시</div>
              <p style={{ fontSize: 13, color: "rgba(226,232,240,0.88)", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
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
