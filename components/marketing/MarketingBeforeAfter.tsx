"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingDown, TrendingUp, Users, ChevronRight } from "lucide-react";

const CASES = [
  {
    tag: "이커머스",
    emoji: "🛒",
    before: {
      label: "기존 방식",
      time: "5시간",
      desc: "마케터가 제품 특성을 직접 이해하고, 채널별로 수동 작성",
      copies: [
        { ch: "📸 인스타", text: "신상품 출시! 지금 구매하세요. 한정 수량입니다." },
        { ch: "📘 페이스북", text: "새로운 제품을 소개합니다. 지금 바로 확인해보세요!" },
        { ch: "🔍 구글", text: "신상품 | 최고 품질 | 빠른 배송" },
      ],
      metric: { label: "CTR", val: "1.2%", trend: "down" },
    },
    after: {
      label: "Vision AI",
      time: "10초",
      desc: "제품 URL 하나로 ROAS 데이터 + 브랜드 보이스 반영한 채널별 20종 완성",
      copies: [
        { ch: "📸 인스타", text: '"엄마, 이거 찾던 거야" — 이번 시즌 가장 많이 공유된 리뷰가 된 제품. 지금 만나보세요. ✨ #가성비갑 #찐후기' },
        { ch: "📘 페이스북", text: "출시 72시간 만에 리뷰 1,000개 돌파. 왜인지 직접 경험해보세요. 지금 주문 시 무료배송 + 10% 즉시 할인." },
        { ch: "🔍 구글", text: "리뷰 4.9점 베스트셀러 | 72h 1,000개 후기 | 오늘 주문 시 무료배송" },
      ],
      metric: { label: "CTR", val: "4.7%", trend: "up" },
    },
  },
  {
    tag: "브랜딩",
    emoji: "✍️",
    before: {
      label: "기존 방식",
      time: "3일",
      desc: "시니어 마케터만이 작성할 수 있는 보도자료·뉴스레터 — 일관성 유지 불가",
      copies: [
        { ch: "📰 보도자료", text: "당사는 이번에 신제품을 출시하였습니다. 자세한 내용은 하단을 참조해주시기 바랍니다." },
        { ch: "📧 뉴스레터", text: "안녕하세요, 고객님. 이번 달 신제품 소식을 전해드립니다. 감사합니다." },
      ],
      metric: { label: "오픈율", val: "8%", trend: "down" },
    },
    after: {
      label: "Vision AI",
      time: "30초",
      desc: "신입부터 임원까지 — 10년 치 브랜드 히스토리가 담긴 동일한 보이스로 즉시 작성",
      copies: [
        { ch: "📰 보도자료", text: "시장의 언어를 바꾸겠다는 약속. [브랜드명]이 3년간의 R&D 끝에 새로운 기준을 제시합니다. 발표 후 24시간 만에 업계 3위 매체가 'Breakthrough of 2024'로 선정했습니다." },
        { ch: "📧 뉴스레터", text: "당신이 구독을 유지한 이유가 생겼습니다. 이번 달, 저희가 가장 오래 준비한 것들을 꺼내놓겠습니다. (읽는 데 4분이면 충분합니다) →" },
      ],
      metric: { label: "오픈율", val: "34%", trend: "up" },
    },
  },
];

export default function MarketingBeforeAfter() {
  const [activeCase, setActiveCase] = useState(0);
  const c = CASES[activeCase];

  return (
    <section style={{ background: "#FFFFFF", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.22)", borderRadius: 999, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Before & After</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            같은 브랜드, 완전히 다른 결과
          </h2>

          {/* Case tabs */}
          <div style={{ display: "inline-flex", gap: 8, marginTop: 8, background: "#F1F5F9", padding: "4px", borderRadius: 12 }}>
            {CASES.map((ca, i) => (
              <button key={i} onClick={() => setActiveCase(i)}
                style={{
                  padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", transition: "all 0.2s",
                  background: activeCase === i ? "white" : "transparent",
                  color: activeCase === i ? "#0EA5E9" : "#94A3B8",
                  boxShadow: activeCase === i ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {ca.emoji} {ca.tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Comparison */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCase}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "stretch" }}
          >
            {/* Before */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "20px 0 0 20px", padding: "36px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#CBD5E1" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8 }}>
                  <Clock style={{ width: 12, height: 12, color: "#94A3B8" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>{c.before.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#FEF2F2", borderRadius: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#EF4444" }}>{c.before.time}</span>
                  <TrendingDown style={{ width: 12, height: 12, color: "#EF4444" }} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>{c.before.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {c.before.copies.map((copy, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 6 }}>{copy.ch}</div>
                    <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{copy.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "12px 16px", background: "#FEF2F2", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingDown style={{ width: 14, height: 14, color: "#EF4444" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>{c.before.metric.label}: {c.before.metric.val}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, background: "linear-gradient(to bottom, #F1F5F9, white, #F1F5F9)", position: "relative", zIndex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(139,92,246,0.35)" }}>
                <ChevronRight style={{ width: 16, height: 16, color: "white" }} />
              </div>
            </div>

            {/* After */}
            <div style={{ background: "linear-gradient(145deg, #F0F9FF 0%, #F5F3FF 100%)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "0 20px 20px 0", padding: "36px", overflow: "hidden", position: "relative", boxShadow: "4px 0 24px rgba(139,92,246,0.08) inset" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 8 }}>
                  <Users style={{ width: 12, height: 12, color: "#0EA5E9" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9" }}>{c.after.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "rgba(34,197,94,0.1)", borderRadius: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#16A34A" }}>{c.after.time}</span>
                  <TrendingUp style={{ width: 12, height: 12, color: "#16A34A" }} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, marginBottom: 24 }}>{c.after.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {c.after.copies.map((copy, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid rgba(14,165,233,0.15)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 2px 8px rgba(14,165,233,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", marginBottom: 6 }}>{copy.ch}</div>
                    <p style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{copy.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp style={{ width: 14, height: 14, color: "#16A34A" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{c.after.metric.label}: {c.after.metric.val} ↑ {Math.round((parseFloat(c.after.metric.val) / parseFloat(c.before.metric.val) - 1) * 100)}% 향상</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
