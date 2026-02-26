"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, Loader2, ExternalLink } from "lucide-react";

interface Product {
  emoji: string; label: string; brand: string;
  copies: { instagram: string; facebook: string; google: string };
}

const PRODUCTS: Product[] = [
  {
    emoji: "👟", label: "러닝화", brand: "RUNX",
    copies: {
      instagram: "한계는 네 머릿속에만 있어. 발이 먼저 알아챈다. 🏃‍♂️✨\n\n지난 시즌 1등 러너들이 선택한 RUNX — 오늘 네 기록을 다시 써봐.\n\n#RUNX #한계를넘어 #러닝화 #러닝챌린지",
      facebook: "🏆 이번 시즌, 왜 러너 10명 중 7명이 RUNX를 다시 구매했을까요?\n반발력 기술 업그레이드 + 여름 한정 색상 출시. 지금 확인하세요.",
      google: "RUNX 러닝화 공식몰 | 반발력 30% 향상 | 무료배송·30일 무료반품",
    },
  },
  {
    emoji: "💄", label: "스킨케어", brand: "GLOW",
    copies: {
      instagram: "피부가 말하기 시작했어 — '드디어 제대로 된 걸 만났다'고. ✨\n\nGLOW 세럼, 28일 후 당신의 피부가 증명합니다.\n\n#GLOW세럼 #빛나는피부 #K뷰티 #스킨케어루틴",
      facebook: "💧 지성, 건성, 복합성 — 피부 타입 상관없이 사랑받는 이유가 있어요.\nGLOW 세럼 28일 체험단 모집 중. 지금 신청하면 정가 대비 40% 할인!",
      google: "GLOW 비타C 세럼 공식 | 피부과 테스트 완료 | 28일 피부톤 개선 보장",
    },
  },
  {
    emoji: "☕", label: "커피", brand: "BREW",
    copies: {
      instagram: "오늘 하루도, 첫 모금부터 제대로. ☕\n\nBREW의 에티오피아 싱글오리진 — 산미가 아닌 과일 향이라고요?\n\n#BREW #스페셜티커피 #모닝루틴 #커피한잔",
      facebook: "☕ 카페 퀄리티를 집에서. BREW 정기구독 시작하면\n매달 큐레이션된 원두가 배송됩니다. 첫 달 50% 할인 + 드리퍼 증정!",
      google: "BREW 스페셜티 원두 구독 | 매달 큐레이션 | 첫 달 50% 할인",
    },
  },
  {
    emoji: "🐾", label: "펫 푸드", brand: "PAWS",
    copies: {
      instagram: "우리 강아지가 밥그릇을 핥는 횟수가 달라졌어요. 🐾💛\n\nPAWS 자연식 — 인공첨가물 0%, 사랑 100%.\n\n#PAWS #강아지밥 #자연식사료 #펫스타그램",
      facebook: "🐶 수의사가 추천하는 자연식 사료, PAWS.\n방부제·인공색소 無, 국내산 닭고기 100% 사용. 7일 체험팩 1,900원으로 시작하세요.",
      google: "PAWS 자연식 사료 | 수의사 추천 | 방부제 無 | 7일 체험팩 1,900원",
    },
  },
  {
    emoji: "🧴", label: "향수", brand: "AURA",
    copies: {
      instagram: "당신이 떠난 자리에도 향기는 남아 있어야 하니까. 🌸\n\nAURA 시그니처 컬렉션 — 기억되는 사람이 되는 법.\n\n#AURA #시그니처향수 #퍼퓸 #향기로운하루",
      facebook: "✨ 처음 맡았을 때 '이거다' 싶은 향이 있어요.\nAURA 시향 키트 — 8가지 시그니처 향을 집에서 직접 경험해보세요. 무료 배송.",
      google: "AURA 시그니처 향수 | 시향 키트 무료배송 | 8종 컬렉션",
    },
  },
];

const CHANNELS = ["instagram", "facebook", "google"] as const;
type Channel = typeof CHANNELS[number];

const CHANNEL_META: Record<Channel, { label: string; color: string; emoji: string }> = {
  instagram: { label: "Instagram",     color: "#E1306C", emoji: "📸" },
  facebook:  { label: "Facebook",      color: "#1877F2", emoji: "📘" },
  google:    { label: "Google 검색광고", color: "#4285F4", emoji: "🔍" },
};

function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    let last = 0;
    const tick = (time: number) => {
      if (time - last >= speed) {
        last = time;
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayed(text.slice(0, indexRef.current));
        } else { setDone(true); return; }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Instagram preview mock ── */
function InstagramMock({ product, copy, generating }: { product: Product; copy: string; generating: boolean }) {
  const { displayed, done } = useTypewriter(generating ? "" : copy, 16);
  const likes = [2400, 8900, 5600, 3100, 4700];
  const idx = PRODUCTS.indexOf(product);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24,
      overflow: "hidden", maxWidth: 380, margin: "0 auto",
      boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #E1306C, #F56040, #FFDC80)", padding: 2 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
            {product.emoji}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{product.brand.toLowerCase()}_official</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>스폰서 광고</div>
        </div>
        <ExternalLink style={{ width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />
      </div>

      {/* Post image */}
      <div style={{ height: 220, background: `linear-gradient(135deg, rgba(14,165,233,0.18), rgba(139,92,246,0.28))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 80, filter: "drop-shadow(0 4px 20px rgba(139,92,246,0.5))" }}>{product.emoji}</span>
        <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: 99, fontSize: 10, color: "white", fontWeight: 600 }}>
          {product.brand}
        </div>
        {generating && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexDirection: "column" }}>
            <Loader2 style={{ width: 26, height: 26, color: "#8B5CF6", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 12, color: "rgba(167,139,250,0.9)", fontWeight: 600 }}>브랜드 보이스 분석 중...</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: "12px 16px 4px", display: "flex", gap: 14, alignItems: "center" }}>
        {[Heart, MessageCircle, Share2].map((Icon, i) => (
          <Icon key={i} style={{ width: 22, height: 22, color: i === 0 && done ? "#EF4444" : "rgba(255,255,255,0.55)", transition: "color 0.4s" }} />
        ))}
        <Bookmark style={{ width: 22, height: 22, color: "rgba(255,255,255,0.55)", marginLeft: "auto" }} />
      </div>

      <div style={{ padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "white" }}>
        좋아요 {likes[idx]?.toLocaleString() ?? "4,200"}개
      </div>

      {/* Caption */}
      <div style={{ padding: "6px 16px 16px", minHeight: 88 }}>
        {generating ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center", paddingTop: 4 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.2 }}
                style={{ width: 6, height: 6, background: "#8B5CF6", borderRadius: "50%", boxShadow: "0 0 8px #8B5CF6" }} />
            ))}
            <span style={{ fontSize: 12, color: "rgba(167,139,250,0.7)", marginLeft: 4 }}>AI 카피 생성 중...</span>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
            <span style={{ fontWeight: 700 }}>{product.brand.toLowerCase()}_official </span>
            {displayed}
            {!done && <span style={{ color: "#8B5CF6", animation: "blink 1s step-end infinite" }}>|</span>}
          </p>
        )}
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: "0 16px 16px", padding: "8px 12px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles style={{ width: 11, height: 11, color: "#A78BFA" }} />
          <span style={{ fontSize: 11, color: "rgba(167,139,250,0.9)", fontWeight: 600 }}>브랜드 보이스 + ROAS 데이터 반영 완료</span>
        </motion.div>
      )}
    </div>
  );
}

/* ── Text preview (Facebook / Google) ── */
function TextPreview({ channel, product, copy, generating }: { channel: Channel; product: Product; copy: string; generating: boolean }) {
  const { displayed, done } = useTypewriter(generating ? "" : copy, 18);
  const meta = CHANNEL_META[channel];

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
      border: `1px solid ${meta.color}22`, borderRadius: 24,
      padding: "36px 40px", maxWidth: 560, margin: "0 auto",
      boxShadow: `0 8px 40px ${meta.color}14`,
    }}>
      {/* Chrome mock header */}
      {channel === "google" && (
        <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
          <div style={{ width: 60, height: 8, background: `${meta.color}33`, borderRadius: 99 }} />
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, letterSpacing: "0.06em", marginBottom: 18, textTransform: "uppercase" }}>
        {meta.emoji} {meta.label} 광고 카피
      </div>

      <div style={{ background: `${meta.color}08`, border: `1px solid ${meta.color}18`, borderRadius: 14, padding: "24px 28px", minHeight: 120 }}>
        {generating ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Loader2 style={{ width: 16, height: 16, color: meta.color, animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 13, color: "rgba(148,163,184,0.5)" }}>채널 최적화 중...</span>
          </div>
        ) : (
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line", fontWeight: 500 }}>
            {displayed}
            {!done && <span style={{ color: meta.color }}>|</span>}
          </p>
        )}
      </div>

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles style={{ width: 11, height: 11, color: meta.color }} />
          <span style={{ fontSize: 11, color: meta.color, fontWeight: 700, opacity: 0.85 }}>
            {product.brand} 브랜드 보이스 + {channel === "facebook" ? "참여율" : "CTR"} 최적화 적용
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default function MarketingCopyDemo() {
  const [selected, setSelected] = useState(0);
  const [channel, setChannel] = useState<Channel>("instagram");
  const [generating, setGenerating] = useState(false);

  const handleSelect = async (idx: number) => {
    if (idx === selected || generating) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    setSelected(idx);
    setGenerating(false);
  };

  const handleChannel = async (ch: Channel) => {
    if (ch === channel || generating) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 550));
    setChannel(ch);
    setGenerating(false);
  };

  const product = PRODUCTS[selected];
  const currentCopy = product.copies[channel];

  return (
    <section style={{ background: "#0A0F2E", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* bg glows */}
      <div style={{ position: "absolute", top: "20%", right: "-8%", width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-8%", left: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 999, marginBottom: 22 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.08em", textTransform: "uppercase" }}>Interactive Demo</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: 16 }}>
            제품을 선택하면<br />카피가 즉시 생성됩니다
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)", color: "rgba(148,163,184,0.75)", maxWidth: 480, margin: "0 auto", lineHeight: 1.85 }}>
            브랜드 보이스 + ROAS 데이터 + 채널 최적화가 한 번에 적용됩니다.
          </p>
        </motion.div>

        {/* ── Product selector (horizontal pills) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}
        >
          {PRODUCTS.map((p, i) => (
            <button key={i} onClick={() => handleSelect(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                borderRadius: 99, cursor: "pointer",
                background: selected === i ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                border: selected === i ? "1px solid rgba(139,92,246,0.55)" : "1px solid rgba(255,255,255,0.08)",
                color: selected === i ? "white" : "rgba(255,255,255,0.45)",
                fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                boxShadow: selected === i ? "0 0 20px rgba(139,92,246,0.25)" : "none",
              }}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Channel tabs ── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}
        >
          {CHANNELS.map(ch => {
            const meta = CHANNEL_META[ch];
            const active = channel === ch;
            return (
              <button key={ch} onClick={() => handleChannel(ch)}
                style={{
                  padding: "8px 20px", borderRadius: 99, cursor: "pointer",
                  background: active ? `${meta.color}1A` : "rgba(255,255,255,0.03)",
                  border: active ? `1px solid ${meta.color}55` : "1px solid rgba(255,255,255,0.07)",
                  color: active ? meta.color : "rgba(255,255,255,0.35)",
                  fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                  boxShadow: active ? `0 0 16px ${meta.color}22` : "none",
                }}
              >
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Preview area ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selected}-${channel}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {channel === "instagram" ? (
              <InstagramMock product={product} copy={currentCopy} generating={generating} />
            ) : (
              <TextPreview channel={channel} product={product} copy={currentCopy} generating={generating} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
