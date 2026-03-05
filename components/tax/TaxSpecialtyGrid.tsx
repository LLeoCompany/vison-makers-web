"use client";
import React from "react";
import { motion } from "framer-motion";
import { Archive, Globe2, Sprout, ChevronRight, CheckCircle2 } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
} as const;
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

/* ── Mini content for each card ─────────────────────────────────────────── */

function InheritanceContent() {
  const brackets = [
    { range: "1억 이하",    rate: "10%", amount: "₩10M" },
    { range: "5억 이하",    rate: "20%", amount: "₩90M" },
    { range: "10억 이하",   rate: "30%", amount: "₩240M" },
    { range: "30억 이하",   rate: "40%", amount: "₩840M" },
    { range: "30억 초과",   rate: "50%", amount: "₩1.2B+" },
  ];
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(52,211,153,0.7)", marginBottom: 10, letterSpacing: "0.06em" }}>
        과세표준별 세율 시뮬레이션
      </div>
      {brackets.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 0",
            borderBottom: i < brackets.length - 1 ? "1px solid rgba(51,65,85,0.4)" : "none",
          }}
        >
          <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", flex: 1 }}>{b.range}</div>
          <div style={{
            padding: "2px 7px", borderRadius: 3,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
            fontSize: 10, fontWeight: 800, color: "#10B981",
          }}>{b.rate}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(226,232,240,0.75)", minWidth: 54, textAlign: "right" }}>
            {b.amount}
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.65 }}
        style={{
          marginTop: 14, padding: "10px 14px", borderRadius: 6,
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
          fontSize: 11, color: "rgba(52,211,153,0.8)", fontWeight: 700,
        }}
      >
        AI 공제 최적화 → 절세 예상액 최대 42% ↓
      </motion.div>
    </div>
  );
}

function InternationalContent() {
  const countries = [
    { flag: "🇺🇸", name: "미국",   treaty: "이중과세 방지 협약 적용" },
    { flag: "🇯🇵", name: "일본",   treaty: "원천세 감면 15% → 10%" },
    { flag: "🇨🇳", name: "중국",   treaty: "상설사업장 판정 AI 검토" },
    { flag: "🇩🇪", name: "독일",   treaty: "이전가격 문서화 지원" },
  ];
  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
      {countries.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 6,
            background: "rgba(51,65,85,0.25)", border: "1px solid rgba(51,65,85,0.45)",
          }}
        >
          <span style={{ fontSize: 16 }}>{c.flag}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(226,232,240,0.85)" }}>{c.name}</div>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.55)" }}>{c.treaty}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VentureContent() {
  const benefits = [
    "창업 초기 3년 법인세 50% 감면",
    "벤처확인기업 R&D 세액공제 25%",
    "스톡옵션 행사이익 비과세 특례",
    "엔젤투자 소득공제 100% 한도",
    "기술이전 소득세 50% 감면",
  ];
  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 7 }}>
      {benefits.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.09 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
        >
          <CheckCircle2 style={{ width: 13, height: 13, color: "#10B981", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: "rgba(148,163,184,0.75)", lineHeight: 1.45 }}>{b}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Cards config ───────────────────────────────────────────────────────── */
const CARDS = [
  {
    icon: Archive,
    badge: "상속·증여세 전문",
    title: "상속/증여세\n시뮬레이션",
    body: "과세표준별 세율 자동 산출, AI 공제 최적화, 가업승계 특례까지 — 복잡한 상속·증여 세무를 즉시 시뮬레이션합니다.",
    accent: "#10B981",
    accentDim: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.2)",
    large: true,
    content: <InheritanceContent />,
  },
  {
    icon: Globe2,
    badge: "국제조세 RAG",
    title: "글로벌 국제조세",
    body: "이중과세 방지 협약, 이전가격 문서화, 해외 원천세 환급 — 국가별 세무 기준을 RAG로 즉시 검토합니다.",
    accent: "#10B981",
    accentDim: "rgba(16,185,129,0.06)",
    accentBorder: "rgba(16,185,129,0.18)",
    large: false,
    content: <InternationalContent />,
  },
  {
    icon: Sprout,
    badge: "벤처 특례 정책",
    title: "벤처기업 특례 정책",
    body: "조세특례제한법상 벤처기업 감면 혜택 전 항목을 AI가 자동 적용 여부를 판별합니다.",
    accent: "#A78BFA",
    accentDim: "rgba(167,139,250,0.06)",
    accentBorder: "rgba(167,139,250,0.18)",
    large: false,
    content: <VentureContent />,
  },
];

export default function TaxSpecialtyGrid() {
  return (
    <>
    <section className="tsg-section" style={{
      background: "#0A0F1E",
      padding: "100px 24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: [
          "linear-gradient(rgba(30,41,59,0.6) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(30,41,59,0.6) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "64px 64px",
      }} />
      {/* Glow accents */}
      <div style={{
        position: "absolute", top: "20%", left: "-5%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "-5%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 4,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Specialty Solutions
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "white", lineHeight: 1.2, marginBottom: 16,
          }}>
            세무의 깊이가 다릅니다
          </h2>
          <p style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
            color: "rgba(148,163,184,0.55)", lineHeight: 1.8,
          }}>
            상속·증여세부터 글로벌 국제조세, 벤처기업 특례까지<br />
            전문 영역별 세무 RAG를 제공합니다.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="tsg-grid"
          variants={containerVariants} initial="hidden"
          whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.45fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 20,
          }}
        >
          {/* Large card — spans 2 rows */}
          {(() => {
            const card = CARDS[0];
            const Icon = card.icon;
            return (
              <motion.div
                variants={itemVariants}
                className="tsg-card"
                style={{
                  gridRow: "1 / 3",
                  padding: "36px 32px",
                  borderRadius: 16,
                  background: `linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,15,30,0.95))`,
                  border: `1px solid ${card.accentBorder}`,
                  position: "relative", overflow: "hidden",
                  cursor: "default",
                  boxShadow: `0 0 0 1px ${card.accentBorder}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                }}
                whileHover={{ boxShadow: `0 8px 40px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.3)` }}
              >
                {/* Background glow */}
                <div style={{
                  position: "absolute", bottom: -60, right: -60,
                  width: 260, height: 260,
                  background: `radial-gradient(circle, ${card.accentDim} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", top: -20, left: -20,
                  width: 200, height: 200,
                  background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Badge + icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: card.accentDim, border: `1px solid ${card.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon style={{ width: 22, height: 22, color: card.accent }} />
                    </div>
                    <div style={{
                      padding: "4px 10px", borderRadius: 4,
                      background: card.accentDim, border: `1px solid ${card.accentBorder}`,
                      fontSize: 10, fontWeight: 700, color: card.accent, letterSpacing: "0.06em",
                    }}>
                      {card.badge}
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: "clamp(1.3rem, 2.2vw, 1.65rem)", fontWeight: 900,
                    color: "white", lineHeight: 1.3, marginBottom: 12,
                    whiteSpace: "pre-line",
                  }}>{card.title}</h3>

                  <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.65)", lineHeight: 1.75 }}>
                    {card.body}
                  </p>

                  {card.content}

                  <motion.button
                    whileHover={{ gap: 10 }}
                    style={{
                      marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "9px 16px", borderRadius: 6, border: `1px solid ${card.accentBorder}`,
                      background: card.accentDim, color: card.accent,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    상속·증여세 시뮬레이션 신청 <ChevronRight style={{ width: 13, height: 13 }} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })()}

          {/* Small cards */}
          {CARDS.slice(1).map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="tsg-card"
                style={{
                  padding: "28px 26px",
                  borderRadius: 16,
                  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,15,30,0.95))",
                  border: `1px solid ${card.accentBorder}`,
                  position: "relative", overflow: "hidden",
                  cursor: "default",
                }}
                whileHover={{ boxShadow: `0 6px 28px rgba(30,41,59,0.5)`, borderColor: card.accent + "55" }}
              >
                <div style={{
                  position: "absolute", bottom: -40, right: -40,
                  width: 180, height: 180,
                  background: `radial-gradient(circle, ${card.accentDim} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                      background: card.accentDim, border: `1px solid ${card.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon style={{ width: 19, height: 19, color: card.accent }} />
                    </div>
                    <div style={{
                      padding: "3px 8px", borderRadius: 3,
                      background: card.accentDim, border: `1px solid ${card.accentBorder}`,
                      fontSize: 9, fontWeight: 700, color: card.accent, letterSpacing: "0.06em",
                    }}>
                      {card.badge}
                    </div>
                  </div>
                  <h3 style={{
                    fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)", fontWeight: 900,
                    color: "white", marginBottom: 10, lineHeight: 1.3,
                  }}>{card.title}</h3>
                  <p style={{ fontSize: 12.5, color: "rgba(148,163,184,0.6)", lineHeight: 1.7 }}>
                    {card.body}
                  </p>
                  {card.content}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>

    <style>{`
      @media (max-width: 900px) {
        .tsg-section { padding: 70px 24px !important; }
        .tsg-grid {
          grid-template-columns: 1fr !important;
          grid-template-rows: auto !important;
          gap: 16px !important;
        }
        .tsg-grid > :first-child { grid-row: auto !important; }
        .tsg-card { box-shadow: 0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05) !important; border-width: 1.5px !important; }
      }
      @media (max-width: 480px) {
        .tsg-section { padding: 60px 16px !important; }
        .tsg-card { padding: 24px 20px !important; }
      }
    `}</style>
    </>
  );
}
