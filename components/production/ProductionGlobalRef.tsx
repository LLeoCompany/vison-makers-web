"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Loader2, Award, Sparkles, Search } from "lucide-react";

interface RefCard {
  award: string;
  awardTier: "grand-prix" | "gold" | "black" | "platinum";
  year: string;
  brand: string;
  campaign: string;
  insight: string;
  technique: string;
}

const AWARD_STYLES: Record<RefCard["awardTier"], { bg: string; border: string; text: string; dot: string }> = {
  "grand-prix": { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.35)", text: "#F59E0B", dot: "#F59E0B" },
  "gold":       { bg: "rgba(234,179,8,0.1)",  border: "rgba(234,179,8,0.35)",  text: "#EAB308", dot: "#EAB308" },
  "black":      { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)", text: "#94A3B8", dot: "#94A3B8" },
  "platinum":   { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "#A78BFA", dot: "#A78BFA" },
};

interface QueryOption {
  label: string;
  query: string;
  cards: RefCard[];
}

const QUERY_OPTIONS: QueryOption[] = [
  {
    label: "스포츠 · 동기부여",
    query: "스포츠 브랜드의 동기부여 캠페인 레퍼런스",
    cards: [
      {
        award: "Cannes Lions Grand Prix", awardTier: "grand-prix", year: "2024",
        brand: "Nike", campaign: "Winning Isn't for Everyone",
        insight: "승리에 집착하는 스포츠 스타의 어두운 면을 역설적으로 영웅화. '집착'을 긍정적 브랜드 가치로 전환.",
        technique: "흑백 필름 + 독백 나레이션 + 실제 선수 비하인드 클립",
      },
      {
        award: "D&AD Black Pencil", awardTier: "black", year: "2023",
        brand: "Under Armour", campaign: "The Only Way Is Through",
        insight: "한계 돌파를 '통과해야 하는 것'으로 구조화. 고통을 회피 대상이 아닌 통과 의례로 포지셔닝.",
        technique: "슬로우 모션 트레이닝 몽타주 + 운동선수의 내면 독백",
      },
      {
        award: "One Show Gold", awardTier: "gold", year: "2023",
        brand: "Adidas", campaign: "Impossible Is Nothing — Reissue",
        insight: "레거시 슬로건을 현재 시점에서 재해석. 과거 영웅과 현재 아이콘을 교차 편집하여 브랜드 연속성 강조.",
        technique: "아카이브 필름 + 현재 촬영 분 교차 편집 (Same Frame)",
      },
    ],
  },
  {
    label: "럭셔리 · 미니멀",
    query: "고급 브랜드 미니멀 감성 CF 사례",
    cards: [
      {
        award: "Cannes Lions Gold", awardTier: "gold", year: "2023",
        brand: "Apple", campaign: "Shot on iPhone — Macro World",
        insight: "제품을 숨기고 경험을 파는 방식의 정점. 아마추어 사용자 작품을 통해 제품 성능을 자연스럽게 입증.",
        technique: "UGC + 큐레이션 + 미니멀 타이포그래피 전광판 옥외광고",
      },
      {
        award: "LIA Gold", awardTier: "gold", year: "2023",
        brand: "Chanel", campaign: "N°5 — The One That I Want",
        insight: "유명 팝 곡을 단 하나의 제품에 귀속시키는 문화적 납치 전략. 가사 해석을 향수 욕망으로 치환.",
        technique: "뮤지컬 내러티브 + 1분 단편 영화 형식 + 스타 캐스팅",
      },
      {
        award: "Clio Platinum", awardTier: "platinum", year: "2024",
        brand: "Loewe", campaign: "Crafted World — Silence",
        insight: "명품의 침묵을 시각화. 광고음악 없이 장인의 손 움직임 소리만으로 '장인정신'을 전달.",
        technique: "ASMR 필름 + 극단적 클로즈업 + 침묵 내러티브",
      },
    ],
  },
  {
    label: "MZ · 바이럴",
    query: "MZ세대 겨냥 유머·바이럴 광고 성공 사례",
    cards: [
      {
        award: "D&AD Black Pencil", awardTier: "black", year: "2024",
        brand: "Dove", campaign: "The Cost of Beauty",
        insight: "미의 기준에 희생된 실제 여성들의 이야기를 다큐로 포장. 시청자가 광고임을 모르고 공유하게 설계.",
        technique: "다큐멘터리 형식 + 실제 증언자 + 소셜 바이럴 시드 전략",
      },
      {
        award: "One Show Gold", awardTier: "gold", year: "2023",
        brand: "Heinz", campaign: "Draw Ketchup",
        insight: "전 세계 어디서나 '케첩 그려보세요'라고 하면 하인즈 병이 나온다는 문화적 사실을 역으로 활용.",
        technique: "소셜 실험 UGC + 글로벌 동시 참여 캠페인 + 최소 미디어비",
      },
      {
        award: "Cannes Lions Gold", awardTier: "gold", year: "2023",
        brand: "Liquid Death", campaign: "Murder Your Thirst",
        insight: "물을 금속 캔에 담아 헤비메탈 브랜드로 포지셔닝. 카테고리 상식을 파괴해 바이럴 유도.",
        technique: "과장된 호러 무비 패러디 + 과격한 브랜드 보이스 + SNS 쇼트폼",
      },
    ],
  },
  {
    label: "사회적 가치",
    query: "ESG · 사회적 메시지 캠페인 사례",
    cards: [
      {
        award: "Cannes Lions Grand Prix", awardTier: "grand-prix", year: "2023",
        brand: "Always", campaign: "#LikeAGirl — Keep Playing",
        insight: "성별 고정관념을 어린이의 시선으로 해체. 브랜드 메시지 없이 관객이 스스로 참여하도록 유도.",
        technique: "소셜 실험 다큐 + 해시태그 운동 + UGC 무한 증폭",
      },
      {
        award: "D&AD Black Pencil", awardTier: "black", year: "2023",
        brand: "Patagonia", campaign: "Don't Buy This Jacket",
        insight: "제품을 사지 말라고 광고하여 역설적으로 최고의 브랜드 신뢰도 획득. 지속가능성 철학의 극단적 실천.",
        technique: "신문 전면 광고 단일 집행 + PR 증폭 전략",
      },
      {
        award: "Clio Gold", awardTier: "gold", year: "2024",
        brand: "IKEA", campaign: "The Refuge Collection",
        insight: "난민 캠프 아이들의 그림을 제품 디자인으로 실제 제작·판매. 수익을 난민 지원에 사용하는 진정성 루프.",
        technique: "제품 자체가 미디어 + 아이들 인터뷰 + 전시형 팝업",
      },
    ],
  },
];

function AwardBadge({ tier, name, year }: { tier: RefCard["awardTier"]; name: string; year: string }) {
  const s = AWARD_STYLES[tier];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 5 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
      <span style={{ fontSize: 10, fontWeight: 800, color: s.text, letterSpacing: "0.04em" }}>{name}</span>
      <span style={{ fontSize: 10, color: s.text, opacity: 0.6, fontWeight: 600 }}>{year}</span>
    </div>
  );
}

function RefCardItem({ card, delay }: { card: RefCard; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      style={{
        background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14,
        padding: "22px 24px", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6, transparent)" }} />

      {/* Award badge */}
      <div style={{ marginBottom: 14 }}>
        <AwardBadge tier={card.awardTier} name={card.award} year={card.year} />
      </div>

      {/* Brand + Campaign */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{card.brand}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "white", letterSpacing: "-0.02em", lineHeight: 1.3 }}>&ldquo;{card.campaign}&rdquo;</div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "12px 0" }} />

      {/* Insight */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginBottom: 5 }}>💡 핵심 인사이트</div>
        <p style={{ fontSize: 12.5, color: "rgba(226,232,240,0.72)", lineHeight: 1.7, margin: 0 }}>{card.insight}</p>
      </div>

      {/* Technique */}
      <div style={{ padding: "8px 12px", background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.14)", borderRadius: 7 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.05em", marginBottom: 3 }}>🎯 핵심 기법</div>
        <p style={{ fontSize: 11.5, color: "rgba(148,163,184,0.75)", margin: 0, fontWeight: 500 }}>{card.technique}</p>
      </div>
    </motion.div>
  );
}

export default function ProductionGlobalRef() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputQuery, setInputQuery] = useState("");

  const handleSelect = async (idx: number) => {
    if (loading) return;
    setSelected(null);
    setLoading(true);
    setInputQuery(QUERY_OPTIONS[idx].query);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSelected(idx);
  };

  const activeOption = selected !== null ? QUERY_OPTIONS[selected] : null;

  return (
    <section style={{ background: "#080D1E", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(14,165,233,0.2), transparent)" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.28)", borderRadius: 4, marginBottom: 22 }}>
            <Globe2 style={{ width: 12, height: 12, color: "#A78BFA" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" }}>Global Creative DB</span>
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16,
            background: "linear-gradient(90deg, #A78BFA 0%, #38BDF8 60%, #A78BFA 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 24px rgba(139,92,246,0.4))",
          }}>
            전 세계 광고제 수상작 DB<br />RAG로 연결됩니다
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.6vw, 1rem)", color: "rgba(148,163,184,0.55)", maxWidth: 500, margin: "0 auto", lineHeight: 1.9 }}>
            Cannes Lions · D&AD · One Show · Clio 수상작을 학습한 AI가<br />
            귀사 캠페인에 가장 적합한 글로벌 레퍼런스를 즉시 리스트업합니다.
          </p>
        </motion.div>

        {/* Query input area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          {/* Input row (decorative) */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
            border: loading ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "12px 16px",
            maxWidth: 680, margin: "0 auto 20px",
            transition: "border-color 0.3s",
          }}>
            <Search style={{ width: 16, height: 16, color: "rgba(148,163,184,0.4)", flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 14, color: loading ? "rgba(167,139,250,0.75)" : "rgba(148,163,184,0.5)", fontStyle: "italic" }}>
              {loading ? "AI가 전 세계 광고제 DB에서 레퍼런스를 검색하는 중..." : (inputQuery || "아래 카테고리를 선택하거나 직접 검색하세요")}
            </div>
            {loading && <Loader2 style={{ width: 15, height: 15, color: "#A78BFA", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
            {!loading && selected !== null && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>{activeOption?.cards.length}개 발견</span>
              </div>
            )}
          </div>

          {/* Query chips */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {QUERY_OPTIONS.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(i)}
                style={{
                  padding: "8px 18px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  transition: "all 0.2s",
                  background: selected === i ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)",
                  border: selected === i ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  color: selected === i ? "#A78BFA" : "rgba(255,255,255,0.38)",
                  boxShadow: selected === i ? "0 0 16px rgba(139,92,246,0.2)" : "none",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <div style={{ minHeight: 200 }}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", padding: "48px 0" }}
              >
                {["Cannes Lions 수상 데이터베이스 접근 중...", "D&AD · One Show · Clio 크로스 레퍼런스 중...", "최적 레퍼런스 순위 산정 중..."].map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.35 }}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      style={{ width: 5, height: 5, borderRadius: "50%", background: "#A78BFA" }} />
                    <span style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{msg}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && activeOption && (
              <motion.div key={`results-${selected}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Results header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
                  <span style={{ fontSize: 12, color: "rgba(167,139,250,0.8)", fontWeight: 700 }}>
                    {activeOption.query} — {activeOption.cards.length}개 레퍼런스 발견
                  </span>
                </div>
                {/* Cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {activeOption.cards.map((card, i) => (
                    <RefCardItem key={i} card={card} delay={i * 0.12} />
                  ))}
                </div>
              </motion.div>
            )}

            {!loading && selected === null && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "48px 0", color: "rgba(148,163,184,0.25)", fontSize: 13 }}
              >
                카테고리를 선택하면 AI가 글로벌 레퍼런스를 큐레이션합니다
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
