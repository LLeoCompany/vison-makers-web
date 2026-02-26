"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";

interface Props { onConsult: () => void }

/* ── Particle Canvas ───────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      r: number; hue: number; opacity: number;
    }

    const N = 70;
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.6,
      hue: Math.random() > 0.5 ? 200 : 270, // blue or purple
      opacity: Math.random() * 0.55 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.6)`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Connect nearby particles
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            const hue = (particles[i].hue + particles[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

/* ── Floating stat card ────────────────────────────────────────────── */
function GlassCard({
  children, delay, style,
}: { children: React.ReactNode; delay: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale: { delay, duration: 0.6 },
        y: { delay, duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 18,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        pointerEvents: "none",
        zIndex: 3,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function MarketingHero({ onConsult }: Props) {
  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "#0F172A", overflow: "hidden", paddingTop: 80,
    }}>
      {/* Aurora mesh gradient */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(139,92,246,0.22) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 20% 70%, rgba(14,165,233,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 40% at 50% 10%, rgba(244,63,94,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Neon gradient overlay at top + bottom */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #0EA5E9, #8B5CF6, transparent)", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)", zIndex: 2 }} />

      {/* Floating glass cards */}
      <GlassCard delay={0.8} style={{ right: "7%", top: "14%", minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <TrendingUp style={{ width: 14, height: 14, color: "#F43F5E" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>CAMPAIGN ROAS</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
          +342<span style={{ fontSize: 16, color: "#F43F5E" }}>%</span>
        </div>
        <div style={{ marginTop: 8, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            animate={{ width: ["0%", "78%"] }} transition={{ delay: 1.5, duration: 1.4, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #0EA5E9, #8B5CF6)" }}
          />
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Vision AI 도입 3개월</div>
      </GlassCard>

      <GlassCard delay={1.0} style={{ right: "8%", bottom: "22%", minWidth: 180 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.06em", marginBottom: 10 }}>AI COPY GENERATED</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { ch: "📸 Instagram", pct: 92 },
            { ch: "📘 Facebook", pct: 78 },
            { ch: "🔍 Google", pct: 85 },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: 80 }}>{row.ch}</span>
              <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
                <motion.div
                  animate={{ width: `${row.pct}%` }} initial={{ width: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.9 }}
                  style={{ height: "100%", borderRadius: 99, background: i % 2 === 0 ? "#0EA5E9" : "#8B5CF6" }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={1.2} style={{ left: "4%", bottom: "28%" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", marginBottom: 8, letterSpacing: "0.06em" }}>BRAND VOICE MATCH</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 160 }}>
          {["톤앤매너 ✓", "ROAS 데이터 ✓", "트렌드 키워드 ✓", "채널 최적화 ✓"].map(t => (
            <span key={t} style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.35)", color: "#A78BFA" }}>{t}</span>
          ))}
        </div>
      </GlassCard>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 4 }}>
        <div style={{ maxWidth: 780 }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.45)", borderRadius: 999, marginBottom: 32, boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
          >
            <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              The Creative Pulse · Vision AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 32 }}
          >
            브랜드의 영혼을
            <br />
            학습한
            <br />
            <span style={{
              background: "linear-gradient(90deg, #0EA5E9 0%, #8B5CF6 55%, #F43F5E 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(139,92,246,0.6))",
            }}>
              AI 크리에이티브 엔진.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(148,163,184,0.9)", lineHeight: 1.85, marginBottom: 44, maxWidth: 560 }}
          >
            수만 건의 성과 데이터와 브랜드 가이드라인을 실시간으로 참조해<br />
            1초 만에 채널별 최적 크리에이티브를 제안합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.34 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 64 }}
          >
            <button onClick={onConsult}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 34px",
                background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
                color: "white", fontSize: 15, fontWeight: 800, borderRadius: 14,
                border: "none", cursor: "pointer", letterSpacing: "-0.01em",
                boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 8px 32px rgba(139,92,246,0.45), 0 0 60px rgba(14,165,233,0.15)",
                transition: "all 0.22s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.6), 0 12px 40px rgba(139,92,246,0.6), 0 0 80px rgba(14,165,233,0.25)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.4), 0 8px 32px rgba(139,92,246,0.45), 0 0 60px rgba(14,165,233,0.15)";
              }}
            >
              <Zap style={{ width: 16, height: 16 }} />
              브랜드 진단 시작하기
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 28px",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 700, borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
                backdropFilter: "blur(12px)", transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              성공 사례 보기
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { val: "1초", desc: "카피 생성 속도", color: "#0EA5E9" },
              { val: "20종", desc: "채널별 동시 생성", color: "#8B5CF6" },
              { val: "+342%", desc: "평균 ROAS 향상", color: "#F43F5E" },
              { val: "98%", desc: "브랜드 톤 일관성", color: "#0EA5E9" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 900, letterSpacing: "-0.03em", color: s.color, textShadow: `0 0 20px ${s.color}88` }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 2, letterSpacing: "0.02em" }}>{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
