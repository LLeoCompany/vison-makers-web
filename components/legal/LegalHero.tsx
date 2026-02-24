"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Shield } from "lucide-react";

interface LegalHeroProps {
  onConsult: () => void;
}

/* ── Legal Illustration (Navy + Gold) ───────────────────────────────────── */
function LegalIllustration() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520, height: 540 }}>
      {/* Glow backdrop */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380, height: 380,
        background: "radial-gradient(circle, rgba(26,34,56,0.1) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* ── Scales of Justice ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -54%)" }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
          <rect x="118" y="36" width="4" height="160" rx="2" fill="#1A2238" opacity="0.8" />
          <rect x="48" y="54" width="144" height="4" rx="2" fill="#1A2238" opacity="0.9" />
          <circle cx="120" cy="38" r="8" fill="#1A2238" />
          <circle cx="120" cy="38" r="4" fill="#B89150" />

          <line x1="72" y1="58" x2="62" y2="110" stroke="#B89150" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <line x1="168" y1="58" x2="178" y2="110" stroke="#B89150" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ originX: "72px", originY: "58px" }}
          >
            <ellipse cx="62" cy="118" rx="28" ry="8" fill="#F5EDD9" stroke="#B89150" strokeWidth="1.5" />
            <path d="M34 118 Q62 132 90 118" stroke="#B89150" strokeWidth="1.5" fill="none" />
          </motion.g>

          <motion.g
            animate={{ rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ originX: "168px", originY: "58px" }}
          >
            <ellipse cx="178" cy="112" rx="28" ry="8" fill="#F0F2F8" stroke="#1A2238" strokeWidth="1.5" />
            <path d="M150 112 Q178 126 206 112" stroke="#1A2238" strokeWidth="1.5" fill="none" />
          </motion.g>

          <rect x="88" y="196" width="64" height="6" rx="3" fill="#1A2238" opacity="0.4" />
          <rect x="100" y="202" width="40" height="4" rx="2" fill="#1A2238" opacity="0.25" />

          {([
            [40, 40], [200, 30], [220, 160], [30, 170], [130, 220],
          ] as [number, number][]).map(([cx, cy], i) => (
            <motion.circle
              key={i} cx={cx} cy={cy} r="3"
              fill="#B89150" opacity={0.4}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Document card 1 (top-right) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          position: "absolute", top: 28, right: 0, width: 172,
          background: "white", borderRadius: 14, padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(26,34,56,0.10)", border: "1px solid #E8ECF2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, background: "#F5EDD9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10 }}>⚖️</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1A2238" }}>판례 검색 결과</span>
        </div>
        {[100, 80, 92, 60].map((w, i) => (
          <div key={i} style={{ height: 5, background: i === 0 ? "#F5EDD9" : "#F1F5F9", borderRadius: 3, marginBottom: 5, width: `${w}%` }} />
        ))}
        <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
          {["[1]", "[2]"].map(c => (
            <span key={c} style={{ fontSize: 9, fontWeight: 800, color: "white", background: "#B89150", padding: "2px 5px", borderRadius: 4 }}>{c}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Document card 2 (bottom-left) ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          position: "absolute", bottom: 60, left: 0, width: 176,
          background: "white", borderRadius: 14, padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(26,34,56,0.10)", border: "1px solid #E8ECF2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, background: "#F5EDD9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10 }}>📄</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1A2238" }}>계약서 리스크</span>
        </div>
        {[88, 100, 72, 84].map((w, i) => (
          <div key={i} style={{ height: 5, background: i === 1 ? "#FEE2E2" : "#F1F5F9", borderRadius: 3, marginBottom: 5, width: `${w}%` }} />
        ))}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, background: "#EF4444", borderRadius: "50%" }} />
          <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>독소 조항 2건 탐지</span>
        </div>
      </motion.div>

      {/* ── Stat badge (top-left) ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        style={{
          position: "absolute", top: 110, left: 10,
          background: "linear-gradient(135deg, #1A2238, #2A3A5C)",
          borderRadius: 14, padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(26,34,56,0.3)", color: "white", minWidth: 120,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: "#B89150" }}>3초</div>
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>평균 판례 검색</div>
        <motion.div
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
          style={{ height: 2, background: "#B89150", borderRadius: 999, marginTop: 8 }}
        />
      </motion.div>

      {/* ── Accuracy badge (bottom-right) ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        style={{
          position: "absolute", bottom: 30, right: 12,
          background: "white", border: "1px solid #E8ECF2",
          borderRadius: 14, padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(26,34,56,0.08)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 900, color: "#B89150", letterSpacing: "-0.02em" }}>99.2%</div>
        <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>출처 정확도</div>
      </motion.div>

      {/* Connecting dotted lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 520 540" preserveAspectRatio="none">
        <motion.line x1="172" y1="80" x2="210" y2="180" stroke="#D4B483" strokeWidth="1.5" strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
        <motion.line x1="176" y1="370" x2="230" y2="300" stroke="#D4B483" strokeWidth="1.5" strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.4 }} />
      </svg>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
export default function LegalHero({ onConsult }: LegalHeroProps) {
  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #ffffff 0%, #F8FAFC 50%, #F0F2F8 100%)",
      overflow: "hidden", paddingTop: 80,
    }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(26,34,56,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,56,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Gold accent line top */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(184,145,80,0.3), transparent)", pointerEvents: "none" }} />

      {/* Decorative blurs */}
      <div style={{ position: "absolute", top: "-8%", right: "28%", width: 500, height: 500, background: "radial-gradient(circle, rgba(26,34,56,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 360, height: 360, background: "radial-gradient(circle, rgba(184,145,80,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          {/* ── Left: Text ─────────────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(184,145,80,0.08)", border: "1px solid rgba(184,145,80,0.3)", borderRadius: 999, marginBottom: 28 }}
            >
              <Shield style={{ width: 13, height: 13, color: "#B89150" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#B89150", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Legal AI · Vision AI 법률 솔루션
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.2rem)", fontWeight: 900, color: "#0D1117", lineHeight: 1.16, letterSpacing: "-0.03em", marginBottom: 24 }}
            >
              법률 지식과 AI의 결합,
              <br />
              <span style={{ color: "#1A2238" }}>단순 검색을 넘어</span>
              <br />
              <span style={{
                background: "linear-gradient(90deg, #B89150, #D4A853)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>추론의 영역으로.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.05rem)", color: "#4A5568", lineHeight: 1.9, marginBottom: 40, maxWidth: 500, letterSpacing: "0.01em" }}
            >
              수만 건의 판례와 조항을 3초 안에 검색하고,<br />
              환각 없는 정확한 출처로 법률 의견서를 완성합니다.<br />
              법무법인의 데이터는 폐쇄망 안에서 완전히 보호됩니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 56 }}
            >
              <button
                onClick={onConsult}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", background: "#B89150", color: "white",
                  fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none",
                  cursor: "pointer", boxShadow: "0 8px 28px rgba(184,145,80,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#A07D40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#B89150"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                무료 데모 신청하기 <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", background: "transparent", color: "#1A2238",
                  fontSize: 15, fontWeight: 700, borderRadius: 12,
                  border: "2px solid #1A2238", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(26,34,56,0.05)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <Download style={{ width: 16, height: 16 }} /> 기술 백서 다운로드
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 36, paddingTop: 28, borderTop: "1px solid rgba(26,34,56,0.1)" }}
            >
              {[
                { val: "3초", desc: "평균 판례 검색 속도" },
                { val: "99.2%", desc: "출처 정확도" },
                { val: "85%", desc: "업무 시간 단축" },
                { val: "0건", desc: "데이터 유출 사례" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#1A2238", letterSpacing: "-0.02em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2, letterSpacing: "0.01em" }}>{s.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Illustration ─────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <LegalIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
