"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Shield } from "lucide-react";

interface LegalHeroProps {
  onConsult: () => void;
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
export default function LegalHero({ onConsult }: LegalHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.volume = 0;
    video.playbackRate = 0.65;
    const play = () => { video.muted = true; video.playbackRate = 0.65; video.play().catch(() => {}).finally(() => setVideoReady(true)); };
    video.addEventListener("loadeddata", play);
    video.addEventListener("error", () => setVideoReady(true));
    if (video.readyState >= 2) play();
    else video.load();
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <>
    <section className="lh-section" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: "#111111", overflow: "hidden", paddingTop: 80 }}>

      {/* Video bg */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <video ref={videoRef} loop playsInline preload="auto" muted
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.2)", transformOrigin: "center center", opacity: videoReady ? 1 : 0, transition: "opacity 1s ease" }}>
          <source src="/video/legal-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Black overlay 40% — ensures text is always legible */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1, pointerEvents: "none" }} />


      {/* Warm top accent line */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(210,175,120,0.45), transparent)", zIndex: 2, pointerEvents: "none" }} />

      {/* Decorative glows */}
      <div style={{ position: "absolute", top: "-10%", right: "25%", width: 500, height: 500, background: "radial-gradient(circle, rgba(184,145,80,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 360, height: 360, background: "radial-gradient(circle, rgba(26,34,56,0.6) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 780 }}>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(184,145,80,0.15)", border: "1px solid rgba(184,145,80,0.45)", borderRadius: 999, marginBottom: 28 }}
          >
            <Shield style={{ width: 13, height: 13, color: "#B89150" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#C9A86C", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Legal AI · Vision AI 법률 솔루션
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 28, textShadow: "0 2px 24px rgba(0,0,0,0.9)" }}
          >
            법률 지식과 AI의 결합,
            <br />
            <span style={{ color: "rgba(255,255,255,0.75)", textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>단순 검색을 넘어</span>
            <br />
            <span style={{ background: "linear-gradient(90deg, #D4A853, #F0D080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(184,145,80,0.5))" }}>
              추론의 영역으로.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }}
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.9, marginBottom: 40, maxWidth: 580, letterSpacing: "0.01em", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            수만 건의 판례와 조항을 3초 안에 검색하고,<br />
            환각 없는 정확한 출처로 법률 의견서를 완성합니다.<br />
            법무법인의 데이터는 폐쇄망 안에서 완전히 보호됩니다.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.3 }}
            className="lh-btns" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 56 }}
          >
            <button onClick={onConsult}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "#B89150", color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(184,145,80,0.5)", transition: "all 0.2s", letterSpacing: "-0.01em" }}
              onMouseOver={e => { e.currentTarget.style.background = "#A07D40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#B89150"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              무료 데모 신청하기 <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", backdropFilter: "blur(12px)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              <Download style={{ width: 16, height: 16 }} /> 기술 백서 다운로드
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="lh-stats" style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            {[
              { val: "3초", desc: "평균 판례 검색 속도" },
              { val: "99.2%", desc: "출처 정확도" },
              { val: "85%", desc: "업무 시간 단축" },
              { val: "0건", desc: "데이터 유출 사례" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 900, color: "#D4A853", letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(184,145,80,0.4)" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2, letterSpacing: "0.02em" }}>{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .lh-section { padding-top: 100px !important; }
        .lh-section > div { padding: 40px 24px !important; }
        .lh-btns { flex-direction: column !important; }
        .lh-btns button { width: 100% !important; justify-content: center !important; }
        .lh-stats { gap: 20px 32px !important; }
      }
    `}</style>
    </>
  );
}
