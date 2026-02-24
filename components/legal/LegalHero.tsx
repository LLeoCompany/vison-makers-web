"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Shield } from "lucide-react";

interface LegalHeroProps {
  onConsult: () => void;
}

/* ── Legal Illustration ───────────────────────────────────────────────────── */
function LegalIllustration() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520, height: 540 }}>

      {/* Glow backdrop */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380, height: 380,
        background: "radial-gradient(circle, rgba(30,58,138,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      {/* ── Scales of Justice (SVG) ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -54%)" }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
          {/* Centre pillar */}
          <rect x="118" y="36" width="4" height="160" rx="2" fill="#1E3A8A" opacity="0.7" />
          {/* Top beam */}
          <rect x="48" y="54" width="144" height="4" rx="2" fill="#1E3A8A" opacity="0.8" />
          {/* Orb top */}
          <circle cx="120" cy="38" r="8" fill="#1E3A8A" />
          <circle cx="120" cy="38" r="4" fill="#3B82F6" />

          {/* Left chain */}
          <line x1="72" y1="58" x2="62" y2="110" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          {/* Right chain */}
          <line x1="168" y1="58" x2="178" y2="110" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

          {/* Left pan */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ originX: "72px", originY: "58px" }}
          >
            <ellipse cx="62" cy="118" rx="28" ry="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
            <path d="M34 118 Q62 132 90 118" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
          </motion.g>

          {/* Right pan */}
          <motion.g
            animate={{ rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ originX: "168px", originY: "58px" }}
          >
            <ellipse cx="178" cy="112" rx="28" ry="8" fill="#EFF6FF" stroke="#1E3A8A" strokeWidth="1.5" />
            <path d="M150 112 Q178 126 206 112" stroke="#1E3A8A" strokeWidth="1.5" fill="none" />
          </motion.g>

          {/* Base */}
          <rect x="88" y="196" width="64" height="6" rx="3" fill="#1E3A8A" opacity="0.5" />
          <rect x="100" y="202" width="40" height="4" rx="2" fill="#1E3A8A" opacity="0.3" />

          {/* Decorative dots around */}
          {[
            [40, 40], [200, 30], [220, 160], [30, 170], [130, 220],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r="3"
              fill="#3B82F6"
              opacity={0.3}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Document card 1 (top-right) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          position: "absolute", top: 28, right: 0,
          width: 172, background: "white",
          borderRadius: 14, padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(30,58,138,0.12)",
          border: "1px solid #DBEAFE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, background: "#EFF6FF", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10 }}>⚖️</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1E3A8A" }}>판례 검색 결과</span>
        </div>
        {/* Text lines */}
        {[100, 80, 92, 60].map((w, i) => (
          <div key={i} style={{ height: 5, background: i === 0 ? "#DBEAFE" : "#F1F5F9", borderRadius: 3, marginBottom: 5, width: `${w}%` }} />
        ))}
        <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
          {["[1]", "[2]"].map(c => (
            <span key={c} style={{ fontSize: 9, fontWeight: 800, color: "white", background: "#1E3A8A", padding: "2px 5px", borderRadius: 4 }}>{c}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Document card 2 (bottom-left) ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          position: "absolute", bottom: 60, left: 0,
          width: 176, background: "white",
          borderRadius: 14, padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(30,58,138,0.12)",
          border: "1px solid #DBEAFE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, background: "#EFF6FF", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10 }}>📄</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1E3A8A" }}>계약서 리스크</span>
        </div>
        {[88, 100, 72, 84].map((w, i) => (
          <div key={i} style={{ height: 5, background: i === 1 ? "#FEE2E2" : "#F1F5F9", borderRadius: 3, marginBottom: 5, width: `${w}%` }} />
        ))}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, background: "#EF4444", borderRadius: "50%" }} />
          <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>독소 조항 2건 탐지</span>
        </div>
      </motion.div>

      {/* ── Stat badge (top-left) ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        style={{
          position: "absolute", top: 110, left: 10,
          background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
          borderRadius: 14, padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(30,58,138,0.28)",
          color: "white",
          minWidth: 120,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" }}>3초</div>
        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>평균 판례 검색</div>
        <motion.div
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
          style={{ height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 999, marginTop: 8 }}
        />
      </motion.div>

      {/* ── Accuracy badge (bottom-right) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        style={{
          position: "absolute", bottom: 30, right: 12,
          background: "white",
          border: "1px solid #DBEAFE",
          borderRadius: 14, padding: "12px 16px",
          boxShadow: "0 8px 24px rgba(30,58,138,0.10)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.02em" }}>99.2%</div>
        <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>출처 정확도</div>
      </motion.div>

      {/* Connecting dotted lines between cards and scales */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 520 540" preserveAspectRatio="none">
        <motion.line
          x1="172" y1="80" x2="210" y2="180"
          stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        <motion.line
          x1="176" y1="370" x2="230" y2="300"
          stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        />
      </svg>
    </div>
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
        background: "linear-gradient(160deg, #ffffff 0%, #EFF6FF 50%, #DBEAFE 100%)",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Subtle grid pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(30,58,138,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Decorative blue blur circles */}
      <div style={{ position: "absolute", top: "-8%", right: "30%", width: 500, height: 500, background: "radial-gradient(circle, rgba(30,58,138,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 360, height: 360, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          {/* ── Left: Text ─────────────────────────────────────────── */}
          <div>
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
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", fontWeight: 900, color: "#0F172A", lineHeight: 1.14, letterSpacing: "-0.03em", marginBottom: 24 }}
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
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.1rem)", color: "#475569", lineHeight: 1.85, marginBottom: 40, maxWidth: 520 }}
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
              style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 56 }}
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
              style={{ display: "flex", flexWrap: "wrap", gap: 36, paddingTop: 28, borderTop: "1px solid rgba(30,58,138,0.12)" }}
            >
              {[
                { val: "3초", desc: "평균 판례 검색 속도" },
                { val: "99.2%", desc: "출처 정확도" },
                { val: "85%", desc: "계약 검토 시간 단축" },
                { val: "0건", desc: "데이터 유출 사례" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.02em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Illustration ────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <LegalIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}
