"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Search, Shield, Database, Zap, Lock, Globe, Check, X, ChevronRight } from "lucide-react";

// ── Feature Data ──────────────────────────────────────────────────────────────
const features = [
  {
    num: "01",
    icon: <Search style={{ width: 28, height: 28 }} />,
    title: "Vision RAG Core",
    subtitle: "하이브리드 검색 엔진",
    description:
      "시맨틱 검색과 키워드 검색을 결합한 하이브리드 방식으로 최적의 답변을 제공합니다. 자가 수정(Self-RAG) 엔진이 답변 품질을 실시간 검증합니다.",
    points: ["하이브리드 벡터 + 키워드 검색", "Self-RAG 자가 수정 메커니즘", "정확한 출처(Source) 인용"],
    glow: "rgba(37,99,235,0.5)",
    border: "rgba(59,130,246,0.3)",
    accent: "#3B82F6",
    iconBg: "linear-gradient(135deg, #1D4ED8, #2563EB)",
  },
  {
    num: "02",
    icon: <Shield style={{ width: 28, height: 28 }} />,
    title: "보안 아키텍처",
    subtitle: "5계층 방어 체계",
    description:
      "AES-256 암호화부터 AI 출력 필터링까지 5단계 보안 레이어로 기업 데이터를 완벽히 보호합니다. ISO 27001 인증 기반의 검증된 보안 체계입니다.",
    points: ["ISO 27001 보안 인증", "On-Premise 구축 가능", "Zero Trust 아키텍처"],
    glow: "rgba(99,102,241,0.5)",
    border: "rgba(129,140,248,0.3)",
    accent: "#818CF8",
    iconBg: "linear-gradient(135deg, #4338CA, #6366F1)",
  },
  {
    num: "03",
    icon: <Database style={{ width: 28, height: 28 }} />,
    title: "데이터 주권",
    subtitle: "완전 폐쇄형 LLM",
    description:
      "귀사의 데이터는 외부로 단 한 바이트도 나가지 않습니다. 폐쇄형 환경에서 LLM을 운영하여 핵심 지식 자산의 완전한 소유권을 보장합니다.",
    points: ["데이터 외부 유출 Zero", "폐쇄망 구성 지원", "기업 데이터 완전 소유권"],
    glow: "rgba(14,165,233,0.5)",
    border: "rgba(56,189,248,0.3)",
    accent: "#38BDF8",
    iconBg: "linear-gradient(135deg, #0369A1, #0EA5E9)",
  },
];

const compareRows = [
  "귀사 내부 문서 참조",
  "정확한 출처 명시",
  "데이터 보안 보장",
  "업종별 특화 학습",
  "온프레미스 설치",
];

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: `1px solid ${feature.border}`,
          borderRadius: 20,
          padding: "32px 28px",
          height: "100%",
          backdropFilter: "blur(12px)",
          boxShadow: `0 0 0 1px ${feature.border}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
          cursor: "default",
          overflow: "hidden",
          transition: "box-shadow 0.3s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 0 0 1px ${feature.border}, 0 0 40px ${feature.glow}, 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`;
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 0 0 1px ${feature.border}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`;
        }}
      >
        {/* Large decorative number */}
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 16,
            fontSize: 100,
            fontWeight: 900,
            color: "rgba(255,255,255,0.03)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {feature.num}
        </div>

        {/* Glow dot top-left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle at 0% 0%, ${feature.glow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            background: feature.iconBg,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            marginBottom: 20,
            boxShadow: `0 8px 24px ${feature.glow}`,
            transform: "translateZ(20px)",
          }}
        >
          {feature.icon}
        </div>

        {/* Number badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            background: `${feature.accent}20`,
            border: `1px solid ${feature.accent}40`,
            borderRadius: 999,
            marginBottom: 10,
          }}
        >
          <span style={{ width: 6, height: 6, background: feature.accent, borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: feature.accent, letterSpacing: "0.05em" }}>
            {feature.subtitle}
          </span>
        </div>

        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "white",
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          {feature.title}
        </h3>

        <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.9)", lineHeight: 1.75, marginBottom: 20 }}>
          {feature.description}
        </p>

        {/* Points */}
        <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {feature.points.map((p, j) => (
            <li key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: `${feature.accent}20`,
                  border: `1px solid ${feature.accent}50`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Check style={{ width: 10, height: 10, color: feature.accent }} />
              </div>
              <span style={{ fontSize: 13, color: "rgba(203,213,225,0.85)" }}>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ── Comparison Row ────────────────────────────────────────────────────────────
function CompareRow({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span style={{ flex: 1, fontSize: 14, color: "rgba(203,213,225,0.8)" }}>{label}</span>
      {/* 일반 AI */}
      <div
        style={{
          width: 76,
          textAlign: "center",
          padding: "4px 0",
          borderRadius: 999,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <X style={{ width: 10, height: 10, color: "#F87171" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#F87171" }}>불가</span>
      </div>
      {/* Vision AI */}
      <div
        style={{
          width: 76,
          textAlign: "center",
          padding: "4px 0",
          borderRadius: 999,
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Check style={{ width: 10, height: 10, color: "#60A5FA" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#60A5FA" }}>가능</span>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function SystemIntroSection() {
  return (
    <section
      id="system-intro"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #0A0F1E 0%, #0D1526 50%, #0A0F1E 100%)",
        padding: "100px 0 120px",
        overflow: "hidden",
      }}
    >
      {/* ── Background Decorations ──────────────────────────────────── */}
      {/* Top-left glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Center-right glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: -150,
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: "40%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>

        {/* ── Section Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            <Zap style={{ width: 13, height: 13, color: "#60A5FA" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA", letterSpacing: "0.04em" }}>
              WHY VISION AI
            </span>
          </div>

          {/* Headline with gradient */}
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: 16,
              background: "linear-gradient(135deg, #FFFFFF 0%, #93C5FD 50%, #818CF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Vision AI를 선택해야 하는 이유
          </h2>
          <p style={{ fontSize: 15, color: "rgba(148,163,184,0.85)", maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
            단순한 챗봇이 아닙니다. 귀사의 지식 자산을 AI 인프라로 전환하는
            <br />
            완전한 엔터프라이즈 솔루션입니다.
          </p>
        </motion.div>

        {/* ── 3D Feature Cards ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 80,
          }}
        >
          {features.map((f, i) => (
            <TiltCard key={i} feature={f} index={i} />
          ))}
        </div>

        {/* ── Comparison Section ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24,
            padding: "48px 40px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          className="compare-grid"
        >
          {/* Left: Table */}
          <div>
            <div style={{ marginBottom: 28 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                일반 ChatGPT vs{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #3B82F6, #818CF8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Vision AI
                </span>
              </h3>
              <p style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                범용 AI와의 결정적 차이, 직접 비교해보세요.
              </p>
            </div>

            {/* Column headers */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: 10,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 4,
              }}
            >
              <span style={{ flex: 1 }} />
              <span style={{ width: 76, textAlign: "center", fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>일반 AI</span>
              <span style={{ width: 76, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vision AI</span>
            </div>

            {compareRows.map((label, i) => (
              <CompareRow key={i} label={label} delay={0.05 * i} />
            ))}

            {/* Score bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: 24, padding: "16px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(148,163,184,0.7)", marginBottom: 8 }}>
                <span>기능 완성도 비교</span>
                <span style={{ color: "#60A5FA", fontWeight: 700 }}>Vision AI 5/5</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #2563EB, #818CF8)", borderRadius: 999 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right: Two contrast cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Card 1: 범용 LLM 한계 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                flex: 1,
                padding: "24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe style={{ width: 18, height: 18, color: "#F87171" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#F87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>한계</p>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>범용 LLM의 문제점</h4>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                인터넷 기반 학습 데이터로 귀사 내부 문서를 알지 못합니다. 민감한 데이터를 외부 서버에 전송해야 하는 보안 리스크가 존재합니다.
              </p>
            </motion.div>

            {/* Card 2: Vision AI 강점 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                flex: 1,
                padding: "24px",
                background: "linear-gradient(145deg, rgba(37,99,235,0.15) 0%, rgba(99,102,241,0.1) 100%)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 0 40px rgba(37,99,235,0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #1D4ED8, #2563EB)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(37,99,235,0.4)" }}>
                  <Lock style={{ width: 18, height: 18, color: "white" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>강점</p>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Vision AI의 차별점</h4>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(186,214,254,0.8)", lineHeight: 1.7 }}>
                귀사 문서로 학습된 전용 AI가 내부 망에서 작동합니다. 데이터는 단 한 바이트도 외부로 나가지 않으며 완전한 데이터 주권을 보장합니다.
              </p>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#60A5FA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginTop: 4,
                }}
              >
                자세히 알아보기
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .compare-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
