"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mic2, BarChart3, Zap, Globe2, RefreshCw, Target } from "lucide-react";

interface BentoCard {
  icon: React.ElementType;
  tag: string;
  title: string;
  desc: string;
  accent: string;
  size: "large" | "medium" | "small";
  visual?: React.ReactNode;
}

function ChannelBars() {
  const bars = [
    { label: "Instagram", pct: 92, color: "#E1306C" },
    { label: "Facebook", pct: 78, color: "#1877F2" },
    { label: "Google", pct: 85, color: "#4285F4" },
    { label: "유튜브", pct: 67, color: "#FF0000" },
    { label: "TikTok", pct: 73, color: "#69C9D0" },
  ];
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      {bars.map((b, i) => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", width: 52, flexShrink: 0 }}>{b.label}</span>
          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
            <motion.div
              initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
              style={{ height: "100%", borderRadius: 99, background: b.color }}
            />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", width: 28, textAlign: "right" }}>{b.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function TrendPulse() {
  const words = ["#여름캠페인", "#MZ세대", "#가심비", "#미닝아웃", "#ESG마케팅"];
  return (
    <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
      {words.map((w, i) => (
        <motion.span key={w}
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.12 }}
          style={{
            padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: i % 2 === 0 ? "rgba(14,165,233,0.15)" : "rgba(139,92,246,0.15)",
            border: `1px solid ${i % 2 === 0 ? "rgba(14,165,233,0.35)" : "rgba(139,92,246,0.35)"}`,
            color: i % 2 === 0 ? "#38BDF8" : "#A78BFA",
          }}
        >{w}</motion.span>
      ))}
    </div>
  );
}

function ROASMeter() {
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
      {[{ label: "도입 전", val: 180, max: 500, color: "rgba(255,255,255,0.15)" }, { label: "도입 후", val: 432, max: 500, color: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }].map((r, i) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", width: 44, flexShrink: 0 }}>{r.label}</span>
          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${(r.val / r.max) * 100}%` }}
              viewport={{ once: true }} transition={{ delay: i * 0.2 + 0.3, duration: 1 }}
              style={{ height: "100%", borderRadius: 99, background: r.color }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 900, color: i === 1 ? "#38BDF8" : "rgba(255,255,255,0.35)", width: 36, textAlign: "right" }}>{r.val}%</span>
        </div>
      ))}
      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(139,92,246,0.8)", fontWeight: 700 }}>↑ +252%p ROAS 향상</div>
    </div>
  );
}

const CARDS: BentoCard[] = [
  {
    icon: Mic2, tag: "Brand Voice", size: "large",
    title: "일관된 톤앤매너",
    desc: "브랜드 가이드북을 학습해 어떤 채널, 어떤 담당자가 요청해도 동일한 브랜드 목소리로 응답합니다.",
    accent: "#0EA5E9",
    visual: <ChannelBars />,
  },
  {
    icon: BarChart3, tag: "Data-Driven", size: "medium",
    title: "ROAS 기반 기획",
    desc: "과거 성과 데이터를 참조해 가장 효율 높은 소구점을 자동 선택합니다.",
    accent: "#8B5CF6",
    visual: <ROASMeter />,
  },
  {
    icon: Globe2, tag: "Trend Engine", size: "medium",
    title: "실시간 트렌드 접목",
    desc: "외부 트렌드 키워드를 사내 자산과 결합, 시의성 있는 캠페인 아이디어를 제안합니다.",
    accent: "#0EA5E9",
    visual: <TrendPulse />,
  },
  {
    icon: Zap, tag: "Speed", size: "small",
    title: "10초 완성",
    desc: "제품 설명만 입력하면 채널별 광고 카피 20종이 10초 안에 생성됩니다.",
    accent: "#8B5CF6",
  },
  {
    icon: RefreshCw, tag: "Iteration", size: "small",
    title: "무제한 버전",
    desc: "같은 브랜드 보이스로 수백 가지 변형을 즉시 생성합니다.",
    accent: "#0EA5E9",
  },
  {
    icon: Target, tag: "Targeting", size: "small",
    title: "타겟별 최적화",
    desc: "MZ·X세대·시니어 등 타겟 세그먼트마다 다른 언어를 구사합니다.",
    accent: "#8B5CF6",
  },
];

function BentoCardItem({ card, index }: { card: BentoCard; index: number }) {
  const isLarge = card.size === "large";
  const isMedium = card.size === "medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        gridColumn: isLarge ? "span 2" : "span 1",
        gridRow: isLarge ? "span 2" : "span 1",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: isLarge ? "32px" : "24px",
        position: "relative", overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />
      {/* Corner glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: `radial-gradient(circle, ${card.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: isLarge ? 40 : 34, height: isLarge ? 40 : 34, borderRadius: 10, background: card.accent === "#0EA5E9" ? "rgba(14,165,233,0.15)" : "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <card.icon style={{ width: isLarge ? 18 : 15, height: isLarge ? 18 : 15, color: card.accent }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: card.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{card.tag}</span>
      </div>

      <h3 style={{ fontSize: isLarge ? 22 : isMedium ? 17 : 15, fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: 10 }}>{card.title}</h3>
      <p style={{ fontSize: isLarge ? 14 : 13, color: "rgba(148,163,184,0.85)", lineHeight: 1.7, margin: 0 }}>{card.desc}</p>

      {card.visual}
    </motion.div>
  );
}

export default function MarketingBentoFeatures() {
  return (
    <section style={{ background: "#080D24", padding: "100px 24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.28)", borderRadius: 999, marginBottom: 20 }}>
            <Zap style={{ width: 12, height: 12, color: "#8B5CF6" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.06em", textTransform: "uppercase" }}>Core Features</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
            브랜드의 모든 순간을<br />AI가 함께합니다
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "minmax(200px, auto)", gap: 16 }}>
          {CARDS.map((card, i) => (
            <BentoCardItem key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
