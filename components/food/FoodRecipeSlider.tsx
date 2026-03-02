"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FlaskConical, ChefHat, AlertCircle,
  TrendingDown, ShieldCheck, BarChart3,
} from "lucide-react";

/* ── Card data ─────────────────────────────────────────────────────────── */
const RECIPE_CARDS = [
  {
    icon: FlaskConical,
    tag: "배합비 자산화",
    title: "김치찌개 소스 v3.2",
    subtitle: "원재료 24종 · 공정 7단계",
    items: ["고추장 12.5%", "된장 8.2%", "마늘 3.4%", "생강 1.1%"],
    status: "DB 등록 완료",
    statusOk: true,
    accent: "#0D9488",
  },
  {
    icon: ShieldCheck,
    tag: "AI 최적화 제안",
    title: "나트륨 저감 대안 레시피",
    subtitle: "기존 대비 나트륨 22% 절감",
    items: ["저염간장 대체 +0.8%", "천일염 -15%", "MSG 제거", "풍미 보완 재료 +2종"],
    status: "적합 판정",
    statusOk: true,
    accent: "#22C55E",
  },
  {
    icon: AlertCircle,
    tag: "알레르기 스캔",
    title: "HMR 갈비탕 성분 분석",
    subtitle: "성분 42종 전체 검토",
    items: ["밀: 함유 ⚠️", "대두: 함유 ⚠️", "우유: 비함유 ✓", "견과류: 비함유 ✓"],
    status: "표시 수정 권장",
    statusOk: false,
    accent: "#F59E0B",
  },
  {
    icon: TrendingDown,
    tag: "원가 최적화",
    title: "냉동만두 원가 분석",
    subtitle: "재료비 구성 자동 산출",
    items: ["원재료비 41%", "가공비 23%", "포장비 11%", "물류비 8%"],
    status: "원가 목표 달성",
    statusOk: true,
    accent: "#0D9488",
  },
  {
    icon: ChefHat,
    tag: "HACCP 자동화",
    title: "생산라인 위생 일지",
    subtitle: "라인 3개 실시간 모니터링",
    items: ["냉각 4°C 이하 ✓", "가열 75°C 이상 ✓", "교차오염 방지 ✓", "세척 CCP ✓"],
    status: "전 항목 이상 없음",
    statusOk: true,
    accent: "#22C55E",
  },
  {
    icon: BarChart3,
    tag: "유통 최적화",
    title: "유통기한 재고 예측",
    subtitle: "AI 수요 예측 기반",
    items: ["D-3 위험재고 12건", "자동 할인 알림 발송", "폐기 절감 ₩2.4M", "회전율 +18%"],
    status: "조치 완료",
    statusOk: true,
    accent: "#0EA5E9",
  },
];

/* Duplicate for seamless infinite loop */
const CARDS_LOOP = [...RECIPE_CARDS, ...RECIPE_CARDS];

/* ── Stagger variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} as const;

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

/* ── Component ─────────────────────────────────────────────────────────── */
export default function FoodRecipeSlider() {
  return (
    <>
    <section style={{
      background: "linear-gradient(180deg, #F0FDFA 0%, #CCFBF1 100%)",
      padding: "100px 0",
      overflow: "hidden",
      borderTop: "1px solid rgba(13,148,136,0.1)",
    }}>

      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{ maxWidth: 1100, margin: "0 auto 56px", padding: "0 24px", textAlign: "center" }}
      >
        <motion.div variants={itemVariants} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 4,
          background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.22)",
          marginBottom: 20,
        }}>
          <FlaskConical style={{ width: 13, height: 13, color: "#0D9488" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            R&amp;D Asset Intelligence
          </span>
        </motion.div>

        <motion.h2 variants={itemVariants} style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
          letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.25, marginBottom: 16,
        }}>
          수천 개의 레시피·배합비를<br />AI가 실시간으로 관리합니다
        </motion.h2>

        <motion.p variants={itemVariants} style={{
          fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "#475569", lineHeight: 1.85,
        }}>
          연구원 개인 파일에 잠든 R&amp;D 노하우를 기업의 영원한 자산으로 전환합니다.<br />
          카드 위에 마우스를 올리면 슬라이더가 멈춥니다.
        </motion.p>
      </motion.div>

      {/* ── Infinite scroll track ─────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Fade edges */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 140,
          background: "linear-gradient(to right, #F0FDFA, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 140,
          background: "linear-gradient(to left, #CCFBF1, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        <div className="frs-track">
          {CARDS_LOOP.map((card, i) => {
            const Icon = card.icon;
            const isWarn = !card.statusOk;
            return (
              <div
                key={i}
                className="frs-card"
                style={{
                  flexShrink: 0, width: 284,
                  padding: "26px 24px",
                  borderRadius: 14,
                  background: "white",
                  border: "1px solid rgba(13,148,136,0.13)",
                  boxShadow: "0 2px 20px rgba(13,148,136,0.07)",
                  marginRight: 20,
                  cursor: "default",
                }}
              >
                {/* Tag */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 4,
                  background: `${card.accent}12`,
                  border: `1px solid ${card.accent}28`,
                  marginBottom: 16,
                }}>
                  <Icon style={{ width: 12, height: 12, color: card.accent }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: card.accent, letterSpacing: "0.07em" }}>{card.tag}</span>
                </div>

                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A", marginBottom: 3 }}>{card.title}</h3>
                <p style={{ fontSize: 11.5, color: "#94A3B8", marginBottom: 14, lineHeight: 1.4 }}>{card.subtitle}</p>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                  {card.items.map((item, j) => (
                    <div key={j} style={{
                      fontSize: 12.5, color: "#475569", lineHeight: 1.45,
                      padding: "5px 9px", borderRadius: 5, background: "#F8FAFC",
                      borderLeft: `2px solid ${card.accent}40`,
                    }}>{item}</div>
                  ))}
                </div>

                {/* Status badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 11px", borderRadius: 6,
                  background: isWarn ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.08)",
                  border: `1px solid ${isWarn ? "rgba(239,68,68,0.22)" : "rgba(34,197,94,0.25)"}`,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: isWarn ? "#EF4444" : "#22C55E",
                    boxShadow: isWarn ? "0 0 6px #EF444488" : "0 0 6px #22C55E88",
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: isWarn ? "#DC2626" : "#16A34A",
                  }}>{card.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom stat strip */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        style={{
          maxWidth: 1100, margin: "52px auto 0",
          padding: "0 24px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20,
        }}
        className="frs-stat-grid"
      >
        {[
          { num: "3,200+", label: "자산화된 레시피 수", sub: "평균 도입 1년 기준" },
          { num: "0건",     label: "배합비 유출 사고",  sub: "폐쇄망 RAG 아키텍처" },
          { num: "2시간",   label: "신 레시피 DB 등록",  sub: "기존 2주 → AI 자동화" },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} style={{
            padding: "24px 28px", borderRadius: 12,
            background: "white", border: "1px solid rgba(13,148,136,0.12)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0D9488", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "8px 0 4px" }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{s.sub}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>

    <style>{`
      .frs-track {
        display: flex;
        padding: 12px 60px;
        width: max-content;
        animation: frs-scroll 44s linear infinite;
      }
      .frs-track:hover {
        animation-play-state: paused;
      }
      @keyframes frs-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @media (max-width: 640px) {
        .frs-stat-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    </>
  );
}
