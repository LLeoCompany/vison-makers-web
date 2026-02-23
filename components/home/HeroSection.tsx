"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

interface HeroSectionProps {
  onConsultationOpen: () => void;
}

export default function HeroSection({ onConsultationOpen }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Critical: set muted directly on DOM element (React muted prop has SSR issues)
    video.muted = true;
    video.volume = 0;

    const attemptPlay = () => {
      video.muted = true;
      video.play().then(() => {
        setVideoReady(true);
      }).catch((err) => {
        console.warn("Video autoplay failed:", err);
        // Still mark as ready to remove loading state
        setVideoReady(true);
      });
    };

    const onLoadedData = () => attemptPlay();
    const onCanPlayThrough = () => {
      if (!videoReady) attemptPlay();
    };
    const onError = () => {
      console.warn("Video load error");
      setVideoError(true);
      setVideoReady(true);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("error", onError);

    // Force load if already in a ready state
    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("error", onError);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !muted;
    video.muted = newMuted;
    video.volume = newMuted ? 0 : 0.5;
    setMuted(newMuted);
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Background Layer ──────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Dark fallback (neutral, no blue) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#111111",
          }}
        />

        {/* Video element – full opacity, no color tint */}
        {!videoError && (
          <video
            ref={videoRef}
            loop
            playsInline
            preload="auto"
            muted
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            <source src="/video/main-visual.mp4" type="video/mp4" />
          </video>
        )}

        {/* Minimal neutral dark overlay – no blue, just dim for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.6) 100%)",
          }}
        />

      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "140px 24px 80px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 700 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(147,197,253,0.25)",
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                background: "#60A5FA",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ color: "#BFDBFE", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>
              Enterprise RAG Solution
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            데이터의 가치를
            <br />
            <span style={{ color: "#93C5FD" }}>지능으로</span>,
            <br />
            Vision AI RAG 솔루션
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.125rem)",
              color: "rgba(147,197,253,0.85)",
              marginBottom: 40,
              lineHeight: 1.75,
            }}
          >
            귀사의 문서·데이터를 AI 지식 인프라로 전환합니다.
            <br />
            보안을 지키면서, Fortune 500 수준의 AI를 즉시 도입하세요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 64 }}
          >
            <button
              onClick={scrollToServices}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "#2563EB",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#1D4ED8";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#2563EB";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              솔루션 바로가기
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              onClick={onConsultationOpen}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
            >
              무료 상담 신청
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              { value: "85%", label: "업무 효율 향상" },
              { value: "3초", label: "문서 검색 속도" },
              { value: "100%", label: "데이터 보안 유지" },
              { value: "6개", label: "지원 산업 분야" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#93C5FD" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Mute Toggle (shown when video is playing) ─────────────── */}
      {videoReady && !videoError && (
        <button
          onClick={toggleMute}
          style={{
            position: "absolute",
            bottom: 32,
            right: 24,
            zIndex: 20,
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          title={muted ? "음소거 해제" : "음소거"}
        >
          {muted ? <VolumeX style={{ width: 16, height: 16 }} /> : <Volume2 style={{ width: 16, height: 16 }} />}
        </button>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{
            width: 2,
            height: 32,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            borderRadius: 999,
            margin: "0 auto",
          }}
        />
      </motion.div>
    </section>
  );
}
