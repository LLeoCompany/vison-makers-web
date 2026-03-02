"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Mic, Music2, Loader2, Clapperboard } from "lucide-react";

interface Scene {
  id: string; time: string; type: string;
  visual: string; narration: string; bgm: string;
}
interface Campaign {
  emoji: string; label: string; brand: string; tagline: string;
  scenes: Scene[];
}

const CAMPAIGNS: Campaign[] = [
  {
    emoji: "👟", label: "스포츠웨어", brand: "RUNX",
    tagline: '"한계를 박차는 그 발걸음" — #RUN24 캠페인',
    scenes: [
      {
        id: "01", time: "0:00–0:05", type: "OPEN",
        visual: "드론 샷 — 새벽 4시 한강, 안개 속 홀로 달리는 러너의 실루엣. 서서히 줌인.",
        narration: "(침묵. 숨소리와 발소리만.)",
        bgm: "미니멀 피아노 솔로, BPM 68. 서서히 스트링 레이어 추가.",
      },
      {
        id: "02", time: "0:06–0:18", type: "PRODUCT SHOT",
        visual: "슬로우 모션 — 발이 지면에 닿는 순간 파티클 이펙트. 반발력 시각화 그래픽.",
        narration: '"몸이 기억하기 전에, 발이 먼저 알아챘다."',
        bgm: "일렉트로닉 킥 드럼 인서트. BPM 130으로 급상승.",
      },
      {
        id: "03", time: "0:19–0:30", type: "LOGO OUT",
        visual: "제품 360° 회전 클로즈업. 화이트 스튜디오. 마지막 프레임 로고 오버레이.",
        narration: '"RUNX — 한계를 박차는 그 발걸음."',
        bgm: "오케스트라 스트링 크레센도 → 로고 스팅 마무리.",
      },
    ],
  },
  {
    emoji: "🚗", label: "자동차", brand: "APEX",
    tagline: '"도로가 없는 곳에 길을 만든다" — APEX 4WD',
    scenes: [
      {
        id: "01", time: "0:00–0:05", type: "OPEN",
        visual: "항공 뷰 — 안개 낀 미개척 산악 도로. 헤드라이트 두 점이 안개를 뚫고 나타남.",
        narration: "(엔진 저음 + 타이어 마찰음)",
        bgm: "신스 오케스트라 베이스. 저음부 빌드업 시작.",
      },
      {
        id: "02", time: "0:06–0:18", type: "DRIVE",
        visual: "차량 인테리어 — 핸들 클로즈업, 계기판 클러스터, 창밖 스쳐가는 절경 리버스 샷.",
        narration: '"어디까지 갈 수 있는가는, 당신이 결정합니다."',
        bgm: "록 기타 리프 인서트. 드럼 풀킥. BPM 128.",
      },
      {
        id: "03", time: "0:19–0:30", type: "LOGO OUT",
        visual: "차량 전면 스틸 샷. 산 정상 배경. 골든 아워 사이드 라이팅.",
        narration: '"APEX. 도로가 없는 곳에 길을 만든다."',
        bgm: "장엄한 오케스트라 마무리. 타이탄 드럼 롤 → 스팅.",
      },
    ],
  },
  {
    emoji: "💎", label: "럭셔리 뷰티", brand: "LUMÉ",
    tagline: '"당신이 기억되는 방식" — LUMÉ Signature',
    scenes: [
      {
        id: "01", time: "0:00–0:05", type: "OPEN",
        visual: "익스트림 클로즈업 — 피부 결 마이크로 텍스처. 빛이 굴절되는 순간 포착. Macro 렌즈.",
        narration: "(침묵. 카운터 무드.)",
        bgm: "챔버 스트링 피치카토. BPM 52. 극도로 미니멀.",
      },
      {
        id: "02", time: "0:06–0:18", type: "RITUAL",
        visual: "모델 손이 세럼을 바르는 슬로우 모션. 피부 흡수 인포그래픽 오버레이. 따뜻한 색온도.",
        narration: '"28일간 100명 중 94명이 피부가 달라졌다고 말했습니다."',
        bgm: "피아노 + 바이올린 듀엣. 감정 클라이맥스. BPM 72.",
      },
      {
        id: "03", time: "0:19–0:30", type: "LOGO OUT",
        visual: "제품 패키지 스틸. 순백 배경. 금빛 로고 디졸브 인. 마지막 컷 홀드 2초.",
        narration: '"LUMÉ — 당신이 기억되는 방식."',
        bgm: "미니멀 피아노 코다. 마지막 음 페이드 아웃.",
      },
    ],
  },
  {
    emoji: "📱", label: "테크 브랜드", brand: "AXIS",
    tagline: '"생각보다 빠르게, 상상보다 얇게" — AXIS X1',
    scenes: [
      {
        id: "01", time: "0:00–0:04", type: "OPEN",
        visual: "블랙 공간. 빛의 선들이 교차하며 디바이스 실루엣을 서서히 형성. CGI 렌더.",
        narration: "(침묵. 고주파 웜업 톤.)",
        bgm: "일렉트로닉 앰비언트. 긴장감 고조. 타악기 없음.",
      },
      {
        id: "02", time: "0:05–0:20", type: "FEATURE",
        visual: "디바이스 360° 회전. 기능 텍스트 포인트가 AR처럼 플로팅. 슬림 사이드 프로파일 강조.",
        narration: '"생각보다 빠르게. 상상보다 얇게."',
        bgm: "디지털 신스팝. 16비트 킥. 클린 기타 리프. BPM 120.",
      },
      {
        id: "03", time: "0:21–0:30", type: "LOGO OUT",
        visual: "실사용자 라이프스타일 몽타주 (5컷 0.8초씩) → 제품 로고 풀 화면 줌인 홀드.",
        narration: '"AXIS X1 — 이미 미래입니다."',
        bgm: "오케스트라 + 신스 하이브리드 마무리. 드라마틱 스팅.",
      },
    ],
  },
];

function useDelayedVisible(trigger: boolean, delay: number) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!trigger) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [trigger, delay]);
  return visible;
}

function SceneCard({ scene, index, active }: { scene: Scene; index: number; active: boolean }) {
  const visible = useDelayedVisible(active, index * 500 + 200);
  const TYPE_COLORS: Record<string, string> = {
    "OPEN": "#0EA5E9",
    "PRODUCT SHOT": "#8B5CF6",
    "DRIVE": "#F43F5E",
    "RITUAL": "#EC4899",
    "FEATURE": "#0EA5E9",
    "LOGO OUT": "#64748B",
  };
  const accentColor = TYPE_COLORS[scene.type] ?? "#0EA5E9";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex", gap: 0,
            paddingBottom: index < 2 ? 32 : 0,
          }}
        >
          {/* Timeline gutter */}
          <div style={{ width: 48, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: accentColor, boxShadow: `0 0 10px ${accentColor}88`, flexShrink: 0 }} />
            {index < 2 && (
              <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.07)", marginTop: 6 }} />
            )}
          </div>

          {/* Scene content */}
          <div style={{ flex: 1 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ padding: "3px 10px", background: `${accentColor}18`, border: `1px solid ${accentColor}44`, borderRadius: 3, fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: "0.07em" }}>
                씬 #{scene.id}
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 600, fontFamily: "monospace" }}>{scene.time}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 700, letterSpacing: "0.05em" }}>{scene.type}</span>
            </div>

            {/* Three fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { Icon: Film,   label: "영상",   text: scene.visual,     color: "#0EA5E9" },
                { Icon: Mic,    label: "나레이션", text: scene.narration,  color: "#E2E8F0" },
                { Icon: Music2, label: "BGM",    text: scene.bgm,        color: "#8B5CF6" },
              ].map(({ Icon, label, text, color }) => (
                <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, width: 80, flexShrink: 0, paddingTop: 2 }}>
                    <Icon style={{ width: 11, height: 11, color, opacity: 0.65 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color, opacity: 0.65, letterSpacing: "0.04em" }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "rgba(226,232,240,0.75)", lineHeight: 1.65, margin: 0, fontFamily: label === "BGM" ? "monospace" : "inherit" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProductionScriptDemo() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const selectedRef = useRef(0);

  const generate = async (idx: number) => {
    if (phase === "analyzing") return;
    setPhase("idle");
    selectedRef.current = idx;
    setSelected(idx);
    await new Promise(r => setTimeout(r, 80));
    setPhase("analyzing");
    await new Promise(r => setTimeout(r, 1600));
    setPhase("done");
  };

  useEffect(() => { generate(0); }, []);

  const campaign = CAMPAIGNS[selected];

  return (
    <>
    <section className="psd-section" style={{ background: "#050810", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.28), transparent)" }} />
      <div style={{ position: "absolute", top: "40%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.22)", borderRadius: 4, marginBottom: 20 }}>
            <Clapperboard style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Script Generator</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
            CF 스크립트가 씬 단위로<br />즉시 완성됩니다
          </h2>
        </motion.div>

        {/* Campaign selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
          {CAMPAIGNS.map((c, i) => (
            <button key={i} onClick={() => generate(i)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 18px",
                borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
                background: selected === i ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.03)",
                border: selected === i ? "1px solid rgba(14,165,233,0.38)" : "1px solid rgba(255,255,255,0.07)",
                color: selected === i ? "#0EA5E9" : "rgba(255,255,255,0.38)",
                fontSize: 12, fontWeight: 700,
              }}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Script window */}
        <div style={{
          background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden",
        }}>
          {/* macOS-style chrome */}
          <div style={{ padding: "11px 18px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#FF5F57", "#FFBD2E", "#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                <Film style={{ width: 10, height: 10, color: "#0EA5E9" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                  Vision AI CF Script — {campaign.brand}
                </span>
              </div>
            </div>
            <div style={{ minWidth: 70, display: "flex", justifyContent: "flex-end" }}>
              {phase === "analyzing" && (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Loader2 style={{ width: 11, height: 11, color: "#0EA5E9", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ fontSize: 10, color: "rgba(14,165,233,0.7)", fontWeight: 600 }}>분석 중</span>
                </div>
              )}
              {phase === "done" && (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                  <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>생성 완료</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="psd-content" style={{ padding: "28px 32px 32px" }}>
            {/* Brief */}
            <div style={{ marginBottom: 28, padding: "12px 16px", background: "rgba(14,165,233,0.05)", border: "1px solid rgba(14,165,233,0.12)", borderRadius: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 5 }}>CAMPAIGN BRIEF</div>
              <div style={{ fontSize: 13, color: "rgba(226,232,240,0.65)", fontWeight: 600, fontStyle: "italic" }}>{campaign.tagline}</div>
            </div>

            {/* Analyzing state */}
            <AnimatePresence>
              {phase === "analyzing" && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0 24px" }}
                >
                  {["전 세계 광고제 수상 캠페인 데이터베이스 접근 중...", "브랜드 톤앤매너 패턴 분석 중...", "씬별 비주얼 컨텍스트 매핑 중...", "CF 스크립트 생성 중..."].map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.35 }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 12, color: "rgba(148,163,184,0.55)" }}>{msg}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scenes */}
            {(phase === "done" || phase === "analyzing") && (
              <div>
                {campaign.scenes.map((scene, i) => (
                  <SceneCard key={`${selected}-${scene.id}`} scene={scene} index={i} active={phase === "done"} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .psd-section { padding: 60px 24px !important; }
          .psd-content { padding: 20px 16px 24px !important; }
        }
      `}</style>
    </section>
    </>
  );
}
