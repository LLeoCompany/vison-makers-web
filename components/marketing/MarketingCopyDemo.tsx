"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, Loader2 } from "lucide-react";

interface Product {
  emoji: string;
  label: string;
  brand: string;
  tag: string;
  copies: {
    instagram: string;
    facebook: string;
    google: string;
  };
}

const PRODUCTS: Product[] = [
  {
    emoji: "👟", label: "러닝화", brand: "RUNX",
    tag: "#RUN #러닝 #퍼포먼스",
    copies: {
      instagram: "한계는 네 머릿속에만 있어. 발이 먼저 알아챈다. 🏃‍♂️✨\n\n지난 시즌 1등 러너들이 선택한 RUNX — 오늘 네 기록을 다시 써봐.\n\n#RUNX #한계를넘어 #러닝화 #러닝챌린지",
      facebook: "🏆 이번 시즌, 왜 러너 10명 중 7명이 RUNX를 다시 구매했을까요?\n반발력 기술 업그레이드 + 여름 한정 색상 출시. 지금 확인하세요.",
      google: "RUNX 러닝화 공식몰 | 반발력 30% 향상 | 무료배송·30일 무료반품",
    },
  },
  {
    emoji: "💄", label: "스킨케어", brand: "GLOW",
    tag: "#스킨케어 #글로우 #뷰티",
    copies: {
      instagram: "피부가 말하기 시작했어 — '드디어 제대로 된 걸 만났다'고. ✨\n\nGLOW 세럼, 28일 후 당신의 피부가 증명합니다.\n\n#GLOW세럼 #빛나는피부 #K뷰티 #스킨케어루틴",
      facebook: "💧 지성, 건성, 복합성 — 피부 타입 상관없이 사랑받는 이유가 있어요.\nGLOW 세럼 28일 체험단 모집 중. 지금 신청하면 정가 대비 40% 할인!",
      google: "GLOW 비타C 세럼 공식 | 피부과 테스트 완료 | 28일 피부톤 개선 보장",
    },
  },
  {
    emoji: "☕", label: "커피", brand: "BREW",
    tag: "#커피 #스페셜티 #모닝커피",
    copies: {
      instagram: "오늘 하루도, 첫 모금부터 제대로. ☕\n\nBREW의 에티오피아 싱글오리진 — 산미가 아닌 과일 향이라고요? 직접 느껴보세요.\n\n#BREW #스페셜티커피 #모닝루틴 #커피한잔",
      facebook: "☕ 카페 퀄리티를 집에서. BREW 정기구독 시작하면\n매달 큐레이션된 원두가 배송됩니다. 첫 달 50% 할인 + 드리퍼 증정!",
      google: "BREW 스페셜티 원두 구독 | 매달 큐레이션 | 첫 달 50% 할인",
    },
  },
  {
    emoji: "🐾", label: "펫 푸드", brand: "PAWS",
    tag: "#펫푸드 #반려동물 #건강",
    copies: {
      instagram: "우리 강아지가 밥그릇을 핥는 횟수가 달라졌어요. 🐾💛\n\nPAWS 자연식 — 인공첨가물 0%, 사랑 100%.\n\n#PAWS #강아지밥 #자연식사료 #반려동물건강 #펫스타그램",
      facebook: "🐶 수의사가 추천하는 자연식 사료, PAWS.\n방부제·인공색소 無, 국내산 닭고기 100% 사용. 7일 체험팩 1,900원으로 시작하세요.",
      google: "PAWS 자연식 사료 | 수의사 추천 | 방부제 無 | 7일 체험팩 1,900원",
    },
  },
  {
    emoji: "🧴", label: "향수", brand: "AURA",
    tag: "#향수 #퍼퓸 #시그니처향",
    copies: {
      instagram: "당신이 떠난 자리에도 향기는 남아 있어야 하니까. 🌸\n\nAURA 시그니처 컬렉션 — 기억되는 사람이 되는 법.\n\n#AURA #시그니처향수 #퍼퓸 #향기로운하루",
      facebook: "✨ 처음 맡았을 때 '이거다' 싶은 향이 있어요.\nAURA 시향 키트 — 8가지 시그니처 향을 집에서 직접 경험해보세요. 무료 배송.",
      google: "AURA 시그니처 향수 | 시향 키트 무료배송 | 8종 컬렉션",
    },
  },
];

const CHANNELS = ["instagram", "facebook", "google"] as const;
type Channel = typeof CHANNELS[number];

const CHANNEL_LABELS: Record<Channel, string> = {
  instagram: "📸 Instagram",
  facebook: "📘 Facebook",
  google: "🔍 Google 검색광고",
};

function useTypewriter(text: string, speed = 28) {
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
        } else {
          setDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed]);

  return { displayed, done };
}

export default function MarketingCopyDemo() {
  const [selected, setSelected] = useState(0);
  const [channel, setChannel] = useState<Channel>("instagram");
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const currentCopy = PRODUCTS[selected].copies[channel];
  const { displayed, done } = useTypewriter(showResult ? currentCopy : "", 18);

  const handleSelect = async (idx: number) => {
    if (idx === selected) return;
    setShowResult(false);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 900));
    setSelected(idx);
    setGenerating(false);
    setShowResult(true);
  };

  const handleChannel = async (ch: Channel) => {
    if (ch === channel) return;
    setShowResult(false);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 600));
    setChannel(ch);
    setGenerating(false);
    setShowResult(true);
  };

  const likes = [2400, 8900, 5600, 3100, 4700];

  return (
    <section style={{ background: "#0A0F2E", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* bg glow */}
      <div style={{ position: "absolute", top: "30%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 999, marginBottom: 20 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Interactive Preview</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
            제품을 선택하면<br />카피가 즉시 생성됩니다
          </h2>
          <p style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)", color: "rgba(148,163,184,0.9)", maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
            브랜드 보이스 + ROAS 데이터 + 채널 최적화가<br />한 번에 적용됩니다.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start" }}>

          {/* Left — product selector */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: 12 }}>PRODUCT CATEGORY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PRODUCTS.map((p, i) => (
                <button key={i} onClick={() => handleSelect(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 16px", borderRadius: 14, cursor: "pointer",
                    background: selected === i ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                    border: selected === i ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.2s", textAlign: "left",
                    boxShadow: selected === i ? "0 4px 20px rgba(139,92,246,0.2)" : "none",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selected === i ? "white" : "rgba(255,255,255,0.55)" }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: selected === i ? "rgba(139,92,246,0.9)" : "rgba(255,255,255,0.25)", fontWeight: 600 }}>{p.brand}</div>
                  </div>
                  {selected === i && (
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)" }} />
                  )}
                </button>
              ))}
            </div>

            {/* Channel selector */}
            <div style={{ marginTop: 24, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: 12 }}>CHANNEL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => handleChannel(ch)}
                  style={{
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left", fontSize: 12, fontWeight: 600,
                    background: channel === ch ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.03)",
                    border: channel === ch ? "1px solid rgba(14,165,233,0.4)" : "1px solid rgba(255,255,255,0.05)",
                    color: channel === ch ? "#0EA5E9" : "rgba(255,255,255,0.4)",
                    transition: "all 0.15s",
                  }}
                >
                  {CHANNEL_LABELS[ch]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — Instagram preview or other channel */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <AnimatePresence mode="wait">
              {channel === "instagram" ? (
                <motion.div key={`ig-${selected}`}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: "#1E1B4B", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24, overflow: "hidden", maxWidth: 420, margin: "0 auto" }}
                >
                  {/* IG header */}
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {PRODUCTS[selected].emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{PRODUCTS[selected].brand.toLowerCase()}_official</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>브랜드 공식 계정</div>
                    </div>
                    <div style={{ marginLeft: "auto", padding: "4px 10px", background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "white" }}>팔로우</div>
                  </div>

                  {/* Post image placeholder */}
                  <div style={{ height: 200, background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(139,92,246,0.25))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 64 }}>{PRODUCTS[selected].emoji}</span>
                    {generating && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(10,15,46,0.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexDirection: "column" }}>
                        <Loader2 style={{ width: 24, height: 24, color: "#8B5CF6", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>브랜드 보이스 적용 중...</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "12px 16px 4px", display: "flex", gap: 14, alignItems: "center" }}>
                    {[Heart, MessageCircle, Share2].map((Icon, i) => (
                      <Icon key={i} style={{ width: 22, height: 22, color: i === 0 && done ? "#EF4444" : "rgba(255,255,255,0.6)", transition: "color 0.3s" }} />
                    ))}
                    <Bookmark style={{ width: 22, height: 22, color: "rgba(255,255,255,0.6)", marginLeft: "auto" }} />
                  </div>

                  {/* Likes */}
                  <div style={{ padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "white" }}>
                    좋아요 {likes[selected].toLocaleString()}개
                  </div>

                  {/* Caption */}
                  <div style={{ padding: "6px 16px 16px", minHeight: 90 }}>
                    {generating ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                            style={{ width: 6, height: 6, background: "#8B5CF6", borderRadius: "50%" }} />
                        ))}
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>AI 생성 중...</span>
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                        <span style={{ fontWeight: 700 }}>{PRODUCTS[selected].brand.toLowerCase()}_official </span>
                        {displayed}
                        {!done && <span style={{ animation: "blink 1s step-end infinite", color: "#8B5CF6" }}>|</span>}
                      </p>
                    )}
                  </div>

                  {/* AI badge */}
                  {done && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ margin: "0 16px 16px", padding: "8px 12px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Sparkles style={{ width: 11, height: 11, color: "#8B5CF6" }} />
                      <span style={{ fontSize: 11, color: "rgba(139,92,246,0.9)", fontWeight: 600 }}>브랜드 보이스 + ROAS 데이터 반영 완료</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div key={`${channel}-${selected}`}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "36px 40px" }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginBottom: 20 }}>
                    {CHANNEL_LABELS[channel]} 광고 카피
                  </div>
                  <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.15)", borderRadius: 14, padding: "24px 28px", minHeight: 120 }}>
                    {generating ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Loader2 style={{ width: 16, height: 16, color: "#0EA5E9", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>채널 최적화 중...</span>
                      </div>
                    ) : (
                      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line", fontWeight: 500 }}>
                        {displayed}
                        {!done && <span style={{ color: "#0EA5E9" }}>|</span>}
                      </p>
                    )}
                  </div>
                  {done && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Sparkles style={{ width: 11, height: 11, color: "#8B5CF6" }} />
                      <span style={{ fontSize: 11, color: "rgba(139,92,246,0.8)", fontWeight: 600 }}>{PRODUCTS[selected].brand} 브랜드 보이스 + {channel === "facebook" ? "참여율" : "CTR"} 최적화 적용</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
