"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

const NODES = [
  { id: "grain",    emoji: "🌾", label: "원재료",   angle: 0   },
  { id: "lab",      emoji: "🧪", label: "성분분석", angle: 60  },
  { id: "doc",      emoji: "📋", label: "법규준수", angle: 120 },
  { id: "factory",  emoji: "🏭", label: "생산관리", angle: 180 },
  { id: "cs",       emoji: "💬", label: "CS대응",   angle: 240 },
  { id: "truck",    emoji: "🚚", label: "유통관리", angle: 300 },
];

const R = 130;
const CX = 160;
const CY = 160;

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function FoodDataViz() {
  return (
    <svg width="320" height="320" viewBox="0 0 320 320" aria-hidden>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(13,148,136,0.15)" strokeWidth={1} strokeDasharray="4 6" />
      <circle cx={CX} cy={CY} r={R * 0.55} fill="none" stroke="rgba(13,148,136,0.08)" strokeWidth={1} />

      {/* Spokes + data-flow dots */}
      {NODES.map((n) => {
        const rad = toRad(n.angle - 90);
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        const mx = CX + (R * 0.55) * Math.cos(rad);
        const my = CY + (R * 0.55) * Math.sin(rad);
        const pathId = `path-${n.id}`;
        return (
          <g key={n.id}>
            <line x1={mx} y1={my} x2={nx} y2={ny} stroke="rgba(13,148,136,0.2)" strokeWidth={1} />
            <defs>
              <path id={pathId} d={`M ${mx} ${my} L ${nx} ${ny}`} />
            </defs>
            <circle r={3} fill="#22C55E" opacity={0.9}>
              <animateMotion dur={`${1.8 + NODES.indexOf(n) * 0.3}s`} repeatCount="indefinite" rotate="auto">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* Node circles */}
      {NODES.map((n) => {
        const rad = toRad(n.angle - 90);
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        return (
          <g key={`node-${n.id}`}>
            <circle cx={nx} cy={ny} r={26} fill="rgba(13,148,136,0.12)" stroke="rgba(13,148,136,0.35)" strokeWidth={1} />
            <text x={nx} y={ny + 1} textAnchor="middle" dominantBaseline="middle" fontSize={18}>{n.emoji}</text>
            <text x={nx} y={ny + 22} textAnchor="middle" fontSize={9} fill="rgba(13,148,136,0.8)" fontWeight={600}>{n.label}</text>
          </g>
        );
      })}

      {/* Central AI chip */}
      <circle cx={CX} cy={CY} r={40} fill="rgba(13,148,136,0.18)" stroke="#0D9488" strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={32} fill="rgba(13,148,136,0.1)" stroke="rgba(13,148,136,0.4)" strokeWidth={1} strokeDasharray="3 5" />
      <text x={CX} y={CY - 6} textAnchor="middle" dominantBaseline="middle" fontSize={20}>🤖</text>
      <text x={CX} y={CY + 14} textAnchor="middle" fontSize={9} fill="#0D9488" fontWeight={700} letterSpacing="0.05em">Vision AI</text>
    </svg>
  );
}

const STATS = [
  { value: "10×", label: "법규 검토 속도" },
  { value: "0%",  label: "표시 위반율"   },
  { value: "99%", label: "CS 정확도"     },
  { value: "90%", label: "업무 시간 절감" },
];

interface Props { onConsult: (msg?: string) => void }

export default function FoodHero({ onConsult }: Props) {
  return (
    <>
    <section className="fh-section" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 50%, #F1F5F9 100%)",
      display: "flex", alignItems: "center",
      padding: "120px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 600, height: 600,
        background: "radial-gradient(ellipse, rgba(13,148,136,0.06) 0%, transparent 65%)",
        pointerEvents: "none", borderRadius: "50%" }} />

      <div className="fh-inner" style={{ maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "flex", alignItems: "center", gap: 64 }}>

        {/* Left: text */}
        <div className="fh-text" style={{ flex: "0 0 auto", maxWidth: 560 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 4,
              background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)",
              marginBottom: 28 }}
          >
            <ShieldCheck style={{ width: 13, height: 13, color: "#0D9488" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>Food & Distribution RAG</span>
          </motion.div>

          {/* Headline */}
          {["복잡한 식품 법규부터", "비법 레시피까지,", "AI가 완벽하게 관리합니다."].map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              style={{
                fontSize: i < 2 ? "clamp(1.9rem, 3.8vw, 3rem)" : "clamp(1.9rem, 3.8vw, 3rem)",
                fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.04em",
                color: i === 2
                  ? "#0D9488"
                  : "#0F172A",
                marginBottom: i === 2 ? 32 : 4,
              }}
            >{line}</motion.div>
          ))}

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.1rem)", color: "#64748B", lineHeight: 1.85, marginBottom: 40 }}
          >
            수시로 바뀌는 식품위생법, 연구원 머릿속에만 있는 배합비,<br />
            쏟아지는 알레르기 문의까지 — Vision AI가 일괄 처리합니다.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="fh-btns"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}
          >
            <button onClick={() => onConsult()} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 6, border: "none",
              background: "#0D9488", color: "white",
              fontSize: 15, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(13,148,136,0.35)",
              transition: "all 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#0F766E"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#0D9488"; e.currentTarget.style.transform = "none"; }}
            >
              <ArrowRight style={{ width: 16, height: 16 }} /> 무료 컨설팅 신청
            </button>
            <button onClick={() => document.getElementById("food-scanner")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 6,
                border: "1.5px solid rgba(13,148,136,0.3)", background: "white",
                color: "#0D9488", fontSize: 15, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#0D9488"; e.currentTarget.style.background = "rgba(13,148,136,0.04)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(13,148,136,0.3)"; e.currentTarget.style.background = "white"; }}
            >
              법규 스캐너 체험하기
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="fh-stats"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px" }}
          >
            {STATS.map((s) => (
              <div key={s.value}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0D9488", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: animated viz */}
        <motion.div
          className="fh-viz"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <FoodDataViz />
        </motion.div>
      </div>
    </section>
    <style>{`
      @media (max-width: 1024px) {
        .fh-viz { display: none !important; }
        .fh-inner { justify-content: center !important; }
        .fh-text { max-width: 100% !important; }
      }
      @media (max-width: 768px) {
        .fh-section { padding: 100px 24px 60px !important; }
        .fh-btns { flex-direction: column !important; }
        .fh-btns button { width: 100% !important; justify-content: center !important; }
        .fh-stats { gap: 12px 28px !important; }
      }
    `}</style>
    </>
  );
}
