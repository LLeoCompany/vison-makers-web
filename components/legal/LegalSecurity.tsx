"use client";
import React from "react";
import { motion } from "framer-motion";
import { Server, Users, ClipboardList, Lock, Shield, Zap } from "lucide-react";

const pillars = [
  {
    icon: Server,
    title: "폐쇄망 On-Premise",
    desc: "Air-gapped 서버에 구축. 귀사의 사건 기록은 외부 인터넷과 물리적으로 차단됩니다.",
    tag: "Air-gapped",
    glow: "rgba(184,145,80,0.15)",
  },
  {
    icon: Users,
    title: "역할 기반 접근 제어",
    desc: "RBAC(Role-Based Access Control)로 담당자별 열람 권한을 세밀하게 설정합니다.",
    tag: "RBAC",
    glow: "rgba(184,145,80,0.12)",
  },
  {
    icon: ClipboardList,
    title: "실시간 감사 로그",
    desc: "모든 질의·열람·수정 이력이 타임스탬프와 함께 저장됩니다. 언제든 감사 대응이 가능합니다.",
    tag: "Audit Log",
    glow: "rgba(184,145,80,0.12)",
  },
  {
    icon: Lock,
    title: "종단간 암호화",
    desc: "AES-256 저장 암호화 및 TLS 1.3 전송 암호화로 데이터를 이중 보호합니다.",
    tag: "AES-256",
    glow: "rgba(184,145,80,0.1)",
  },
  {
    icon: Shield,
    title: "ISO 27001 준수",
    desc: "국제 정보보안 표준을 준수하며 법률 데이터의 기밀성·무결성·가용성을 보장합니다.",
    tag: "ISO 27001",
    glow: "rgba(184,145,80,0.1)",
  },
  {
    icon: Zap,
    title: "Zero Trust 아키텍처",
    desc: "내부 네트워크라도 지속적 인증을 요구. 내부자 위협까지 차단하는 제로 트러스트 설계입니다.",
    tag: "Zero Trust",
    glow: "rgba(184,145,80,0.1)",
  },
];

export default function LegalSecurity() {
  return (
    <section style={{ background: "#0A0F1E", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(184,145,80,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(184,145,80,0.3), transparent)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(184,145,80,0.1)", border: "1px solid rgba(184,145,80,0.3)", borderRadius: 999, marginBottom: 20 }}>
            <Shield style={{ width: 12, height: 12, color: "#B89150" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B89150", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Security First
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
            철저한 데이터 주권
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "rgba(148,163,184,0.9)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            귀사의 사건 기록은 외부로 한 글자도 나가지 않습니다.<br />
            법무법인이 요구하는 최고 수준의 보안 아키텍처를 제공합니다.
          </p>
        </motion.div>

        {/* Big quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "linear-gradient(135deg, #0D1117 0%, #1A2238 60%, #2A3A5C 100%)",
            borderRadius: 24, padding: "48px 56px",
            marginBottom: 64,
            position: "relative", overflow: "hidden",
            boxShadow: "0 24px 64px rgba(26,34,56,0.25)",
          }}
        >
          {/* Decorative rings */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -100, right: -100, width: 360, height: 360, border: "1px solid rgba(255,255,255,0.04)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 64, color: "rgba(255,255,255,0.15)", fontFamily: "serif", lineHeight: 0.6, marginBottom: 20 }}>&ldquo;</div>
            <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "white", lineHeight: 1.6, maxWidth: 700, marginBottom: 24 }}>
              귀사의 사건 기록은 외부로<br />
              <span style={{ color: "#D4A853" }}>한 글자도 나가지 않습니다.</span>
            </p>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { val: "0건", desc: "데이터 유출 사례" },
                { val: "100%", desc: "On-Premise 구축 가능" },
                { val: "24/7", desc: "보안 모니터링" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#D4A853" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pillars grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: `0 16px 40px ${p.glow}` }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "28px",
                cursor: "default", transition: "box-shadow 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: "rgba(184,145,80,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p.icon style={{ width: 20, height: 20, color: "#D4A853" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A86C", background: "rgba(184,145,80,0.12)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(184,145,80,0.3)" }}>{p.tag}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.85)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
