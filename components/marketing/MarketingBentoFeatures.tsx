"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic2, BarChart3, Zap, Globe2, RefreshCw, Target } from "lucide-react";

function ChannelBars() {
  const bars = [
    { label: "Instagram", pct: 92, color: "#E1306C" },
    { label: "Facebook",  pct: 78, color: "#1877F2" },
    { label: "Google",    pct: 85, color: "#4285F4" },
    { label: "YouTube",   pct: 67, color: "#FF0000" },
    { label: "TikTok",    pct: 73, color: "#69C9D0" },
  ];
  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
      {bars.map((b, i) => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", width: 55, flexShrink: 0 }}>{b.label}</span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
            <motion.div
              initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, duration: 0.9 }}
              style={{ height: "100%", borderRadius: 99, background: b.color, boxShadow: `0 0 8px ${b.color}88` }}
            />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", width: 28, textAlign: "right" }}>{b.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function TrendPulse() {
  const words = ["#여름캠페인", "#MZ세대", "#가심비", "#미닝아웃", "#ESG마케팅", "#숏폼광고"];
  return (
    <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 7 }}>
      {words.map((w, i) => (
        <motion.span key={w}
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          style={{
            padding: "5px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: i % 2 === 0 ? "rgba(14,165,233,0.14)" : "rgba(139,92,246,0.14)",
            border: `1px solid ${i % 2 === 0 ? "rgba(14,165,233,0.4)" : "rgba(139,92,246,0.4)"}`,
            color: i % 2 === 0 ? "#38BDF8" : "#A78BFA",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "rgba(14,165,233,0.2)" : "rgba(139,92,246,0.2)"}`,
          }}
        >{w}</motion.span>
      ))}
    </div>
  );
}

function ROASMeter() {
  const bars = [
    { label: "도입 전", val: 180, max: 500, color: "rgba(255,255,255,0.12)" },
    { label: "도입 후", val: 432, max: 500, color: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" },
  ];
  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      {bars.map((r, i) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", width: 44, flexShrink: 0 }}>{r.label}</span>
          <div style={{ flex: 1, height: 9, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${(r.val / r.max) * 100}%` }}
              viewport={{ once: true }} transition={{ delay: i * 0.2 + 0.3, duration: 1 }}
              style={{ height: "100%", borderRadius: 99, background: r.color,
                boxShadow: i === 1 ? "0 0 12px rgba(14,165,233,0.6)" : "none" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 900, color: i === 1 ? "#38BDF8" : "rgba(255,255,255,0.3)", width: 36, textAlign: "right",
            textShadow: i === 1 ? "0 0 12px rgba(56,189,248,0.8)" : "none" }}>{r.val}%</span>
        </div>
      ))}
      <div style={{ marginTop: 8, fontSize: 12, color: "#A78BFA", fontWeight: 800,
        textShadow: "0 0 10px rgba(167,139,250,0.6)" }}>↑ +252%p ROAS 향상</div>
    </div>
  );
}

function SpeedMeter() {
  return (
    <div style={{ marginTop: 16 }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: 52, fontWeight: 900, color: "#F43F5E",
          textShadow: "0 0 20px rgba(244,63,94,0.7), 0 0 40px rgba(244,63,94,0.3)" }}>
          10<span style={{ fontSize: 28 }}>초</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", marginTop: 4 }}>채널별 카피 20종 완성</div>
      </motion.div>
    </div>
  );
}

interface CardData {
  icon: React.ElementType;
  tag: string;
  title: string;
  desc: string;
  accent: string;
  size: "large" | "medium" | "small";
  visual?: React.ReactNode;
}

const CARDS: CardData[] = [
  {
    icon: Mic2, tag: "카피라이팅 자동화", size: "large",
    title: "브랜드 보이스 학습",
    desc: "브랜드 가이드북을 RAG로 학습해 어떤 채널·담당자가 요청해도 동일한 브랜드 목소리로 답합니다.",
    accent: "#0EA5E9", visual: <ChannelBars />,
  },
  {
    icon: BarChart3, tag: "성과 예측 시뮬레이션", size: "medium",
    title: "ROAS 기반 기획",
    desc: "과거 성과 데이터를 실시간 참조해 가장 효율 높은 소구점을 자동으로 선택합니다.",
    accent: "#8B5CF6", visual: <ROASMeter />,
  },
  {
    icon: Globe2, tag: "트렌드 분석", size: "medium",
    title: "실시간 트렌드 접목",
    desc: "외부 트렌드 키워드를 사내 자산과 결합해 시의성 있는 캠페인 아이디어를 제안합니다.",
    accent: "#0EA5E9", visual: <TrendPulse />,
  },
  {
    icon: Zap, tag: "Speed", size: "small",
    title: "10초 완성",
    desc: "제품 설명 입력 후 채널별 광고 카피 20종이 10초 안에 생성됩니다.",
    accent: "#F43F5E", visual: <SpeedMeter />,
  },
  {
    icon: RefreshCw, tag: "Iteration", size: "small",
    title: "무제한 버전",
    desc: "동일한 브랜드 보이스로 수백 가지 변형 카피를 즉시 생성합니다.",
    accent: "#0EA5E9",
  },
  {
    icon: Target, tag: "타깃 최적화", size: "small",
    title: "세그먼트별 언어",
    desc: "MZ·X세대·시니어 등 타겟 세그먼트마다 최적화된 다른 언어를 구사합니다.",
    accent: "#8B5CF6",
  },
];

function BentoCardItem({ card, index }: { card: CardData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isLarge = card.size === "large";
  const isMedium = card.size === "medium";

  const glowColor = card.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: isLarge ? "span 2" : "span 1",
        gridRow: isLarge ? "span 2" : "span 1",
        background: hovered
          ? `linear-gradient(145deg, rgba(255,255,255,0.07), ${glowColor}0A)`
          : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: hovered
          ? `1px solid ${glowColor}55`
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 22,
        padding: isLarge ? "34px" : "26px",
        position: "relative", overflow: "hidden",
        cursor: "default",
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? `0 0 0 1px ${glowColor}22, 0 8px 40px ${glowColor}28, 0 0 60px ${glowColor}10`
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${glowColor}, transparent)`,
        opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }} />

      {/* Corner glow */}
      <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180,
        background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s", pointerEvents: "none" }} />

      {/* Icon + tag row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: isLarge ? 42 : 36, height: isLarge ? 42 : 36, borderRadius: 11,
          background: `${glowColor}18`,
          border: `1px solid ${glowColor}33`,
          boxShadow: hovered ? `0 0 16px ${glowColor}44` : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "box-shadow 0.3s",
        }}>
          <card.icon style={{ width: isLarge ? 19 : 16, height: isLarge ? 19 : 16, color: glowColor }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: glowColor, letterSpacing: "0.06em", textTransform: "uppercase",
          textShadow: hovered ? `0 0 10px ${glowColor}99` : "none", transition: "text-shadow 0.3s" }}>
          {card.tag}
        </span>
      </div>

      <h3 style={{ fontSize: isLarge ? 22 : isMedium ? 18 : 15, fontWeight: 800, color: "white",
        letterSpacing: "-0.02em", marginBottom: 10 }}>{card.title}</h3>
      <p style={{ fontSize: isLarge ? 14 : 13, color: "rgba(148,163,184,0.8)", lineHeight: 1.75, margin: 0 }}>{card.desc}</p>

      {card.visual}
    </motion.div>
  );
}

export default function MarketingBentoFeatures() {
  return (
    <section style={{ background: "#080D24", padding: "100px 24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), rgba(14,165,233,0.3), transparent)" }} />
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 999, marginBottom: 20 }}>
            <Zap style={{ width: 12, height: 12, color: "#8B5CF6" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Core Features</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
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
