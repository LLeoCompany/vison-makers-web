"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

const STATS = [
  { value: "10×", label: "법규 검토 속도" },
  { value: "0%",  label: "표시 위반율"   },
  { value: "99%", label: "CS 정확도"     },
  { value: "90%", label: "업무 시간 절감" },
];

interface Props { onConsult: (msg?: string) => void }

export default function FoodHero({ onConsult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.volume = 0;
    video.playbackRate = 0.6;
    const play = () => {
      video.muted = true;
      video.playbackRate = 0.6;
      video.play().catch(() => {}).finally(() => setVideoReady(true));
    };
    video.addEventListener("loadeddata", play);
    video.addEventListener("error", () => setVideoReady(true));
    if (video.readyState >= 2) play();
    else video.load();
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <>
    <section className="fh-section" style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      background: "#062924",
      overflow: "hidden",
      paddingTop: 56,
    }}>

      {/* ── Video Background ────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <video
          ref={videoRef}
          loop
          playsInline
          preload="auto"
          muted
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: "scale(1.08)",
            transformOrigin: "center center",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 1.4s ease",
          }}
        >
          <source src="/video/main-visual.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Deep Teal Overlay ────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, rgba(4,30,22,0.88) 0%, rgba(13,148,136,0.52) 45%, rgba(4,30,22,0.85) 100%)",
      }} />

      {/* Bottom gradient fade to next section */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 220,
        background: "linear-gradient(to bottom, transparent, rgba(10,22,40,0.7))",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Teal accent top line */}
      <div style={{
        position: "absolute", top: 56, left: 0, right: 0, height: 1, zIndex: 2,
        background: "linear-gradient(90deg, transparent, rgba(13,148,136,0.5), rgba(34,197,94,0.35), transparent)",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "15%", right: "10%",
        width: 700, height: 700,
        background: "radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 65%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-5%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Content ────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "80px 24px",
        width: "100%", position: "relative", zIndex: 2,
      }}>
        <div style={{ maxWidth: 820 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 999,
              background: "rgba(13,148,136,0.2)", border: "1px solid rgba(45,212,191,0.4)",
              marginBottom: 32,
            }}
          >
            <ShieldCheck style={{ width: 13, height: 13, color: "#2DD4BF" }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#2DD4BF",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Food &amp; Distribution RAG · Vision AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 900,
              letterSpacing: "-0.055em", lineHeight: 1.08,
              color: "#FFFFFF", marginBottom: 32,
              textShadow: "0 2px 32px rgba(0,0,0,0.85)",
            }}
          >
            식품 안전과 레시피 자산화,
            <br />
            <span style={{
              background: "linear-gradient(90deg, #2DD4BF 0%, #22C55E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(13,148,136,0.7))",
            }}>
              AI로 완성하다
            </span>
          </motion.h1>

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            style={{
              fontSize: "clamp(1rem, 1.9vw, 1.18rem)",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.95, marginBottom: 48,
              maxWidth: 600,
              textShadow: "0 1px 14px rgba(0,0,0,0.65)",
            }}
          >
            수시로 바뀌는 식품위생법, 연구원 머릿속에만 있는 배합비,<br />
            쏟아지는 알레르기 문의까지 — Vision AI가 일괄 처리합니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="fh-btns"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 64 }}
          >
            <button
              onClick={() => onConsult()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 34px", borderRadius: 10, border: "none",
                background: "#0D9488", color: "white",
                fontSize: 15, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 8px 36px rgba(13,148,136,0.6)",
                transition: "all 0.2s", letterSpacing: "-0.01em",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#0F766E"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(13,148,136,0.7)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#0D9488"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(13,148,136,0.6)"; }}
            >
              무료 컨설팅 신청 <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => document.getElementById("food-scanner")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.28)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)", fontSize: 15, fontWeight: 700, cursor: "pointer",
                backdropFilter: "blur(14px)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
            >
              법규 스캐너 체험하기
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            style={{ paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="fh-stats" style={{ display: "flex", flexWrap: "wrap", gap: "16px 44px" }}>
              {STATS.map((s) => (
                <div key={s.value}>
                  <div style={{
                    fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 900,
                    color: "#2DD4BF", lineHeight: 1, letterSpacing: "-0.035em",
                    textShadow: "0 0 24px rgba(13,148,136,0.6)",
                  }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
          <ChevronDown style={{ width: 18, height: 18, color: "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </motion.div>
    </section>

    <style>{`
      @media (max-width: 768px) {
        .fh-section { padding-top: 56px !important; min-height: 100dvh !important; }
        .fh-btns { flex-direction: column !important; }
        .fh-btns button { width: 100% !important; justify-content: center !important; }
        .fh-stats { gap: 12px 28px !important; }
      }
    `}</style>
    </>
  );
}
