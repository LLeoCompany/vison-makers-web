"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Download, Shield } from "lucide-react";

interface LegalHeroProps {
  onConsult: () => void;
}

/* ── Animated network canvas ─────────────────────────────────────────────── */
function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const nodes: Node[] = Array.from({ length: 36 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 1.5,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - d / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.4)";
        ctx.fill();
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
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
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
export default function LegalHero({ onConsult }: LegalHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(160deg, #ffffff 0%, #EFF6FF 40%, #DBEAFE 100%)",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Network canvas */}
      <NetworkCanvas />

      {/* Decorative blue blur circles */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 560, height: 560, background: "radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 760 }}>

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(30,58,138,0.07)", border: "1px solid rgba(30,58,138,0.15)", borderRadius: 999, marginBottom: 28 }}
          >
            <Shield style={{ width: 13, height: 13, color: "#1E3A8A" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Legal AI · Vision AI 법률 솔루션
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#0F172A", lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: 24 }}
          >
            수만 건의 판례와 조항,
            <br />
            <span style={{ color: "#1E3A8A" }}>단 3초 안에</span> 근거를 찾습니다.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#475569", lineHeight: 1.85, marginBottom: 40, maxWidth: 580 }}
          >
            환각 증상 없는 정확한 출처 제시.
            <br />
            법무법인의 데이터를 가장 안전한 성벽 안에 가둡니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 64 }}
          >
            <button
              onClick={onConsult}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#1E3A8A", color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(30,58,138,0.3)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "#1E40AF"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#1E3A8A"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              무료 데모 신청하기 <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "transparent", color: "#1E3A8A", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "2px solid #1E3A8A", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(30,58,138,0.05)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <Download style={{ width: 16, height: 16 }} /> 기술 백서 다운로드
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 28, borderTop: "1px solid rgba(30,58,138,0.12)" }}
          >
            {[
              { val: "3초", desc: "평균 판례 검색 속도" },
              { val: "99.2%", desc: "출처 정확도" },
              { val: "85%", desc: "계약 검토 시간 단축" },
              { val: "0건", desc: "데이터 유출 사례" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
