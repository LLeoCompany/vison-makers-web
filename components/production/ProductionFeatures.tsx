"use client";
import React from "react";
import { motion } from "framer-motion";

/* ── Minimal line-art SVG icons ── */
function GeoTarget() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="40" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.35" />
      <circle cx="48" cy="48" r="26" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.5" />
      <circle cx="48" cy="48" r="12" stroke="#0EA5E9" strokeWidth="1" opacity="0.7" />
      <circle cx="48" cy="48" r="3" fill="#0EA5E9" opacity="0.9" />
      <line x1="48" y1="8" x2="48" y2="22" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <line x1="48" y1="74" x2="48" y2="88" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <line x1="8" y1="48" x2="22" y2="48" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <line x1="74" y1="48" x2="88" y2="48" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
    </svg>
  );
}
function GeoScript() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect x="18" y="14" width="60" height="68" rx="3" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <line x1="30" y1="30" x2="66" y2="30" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.6" />
      <line x1="30" y1="40" x2="66" y2="40" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.6" />
      <line x1="30" y1="50" x2="54" y2="50" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.6" />
      <line x1="30" y1="60" x2="66" y2="60" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <line x1="30" y1="70" x2="48" y2="70" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.4" />
      <rect x="28" y="14" width="8" height="4" rx="1" fill="#0EA5E9" opacity="0.5" />
      <rect x="60" y="14" width="8" height="4" rx="1" fill="#0EA5E9" opacity="0.5" />
    </svg>
  );
}
function GeoEye() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <path d="M12 48 C24 28, 72 28, 84 48 C72 68, 24 68, 12 48 Z" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.45" fill="none" />
      <circle cx="48" cy="48" r="14" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.65" />
      <circle cx="48" cy="48" r="6" stroke="#0EA5E9" strokeWidth="1" opacity="0.85" />
      <line x1="12" y1="48" x2="20" y2="48" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.3" />
      <line x1="76" y1="48" x2="84" y2="48" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.3" />
      <line x1="48" y1="28" x2="48" y2="36" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.3" />
      <line x1="48" y1="60" x2="48" y2="68" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.3" />
    </svg>
  );
}

const FEATURES = [
  {
    num: "01", geo: GeoTarget,
    tag: "Concept Generation",
    title: "크리에이티브\n브레인스토밍",
    desc: "캠페인 키워드 하나에서 수백 개의 콘셉트 방향성을 즉시 생성합니다. 전 세계 광고제 수상작 데이터를 학습한 AI가 클리셰를 넘어 예상치 못한 아이디어를 제안합니다.",
    items: ["콘셉트 맵 자동 생성", "감성어 클러스터링", "경쟁 캠페인 차별화 포인트 도출"],
  },
  {
    num: "02", geo: GeoScript,
    tag: "Script Writing",
    title: "AI 시나리오\n라이팅",
    desc: "씬 구성부터 나레이션, BGM 방향까지 CF 스크립트 전체를 구조화된 형태로 생성합니다. 15초·30초·60초 버전을 동시에 제안하며 편집 템포 가이드라인도 포함됩니다.",
    items: ["씬별 비주얼 디렉션", "나레이션 보이스 옵션", "편집 템포 가이드라인"],
  },
  {
    num: "03", geo: GeoEye,
    tag: "Visual Curation",
    title: "비주얼 레퍼런스\n큐레이션",
    desc: "촬영 레퍼런스, 색보정 스타일, 카메라 워킹 예시를 AI가 큐레이션합니다. 감독과 클라이언트 사이의 비주얼 언어를 정렬하는 가장 빠른 방법입니다.",
    items: ["촬영 레퍼런스 무드보드", "컬러 그레이딩 스타일", "카메라 워크 추천"],
  },
];

export default function ProductionFeatures() {
  return (
    <>
    <section className="pf-section" style={{ background: "white", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: 80 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: "1px solid #E2E8F0", borderRadius: 4, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Core Capabilities</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", maxWidth: 560 }}>
            제작 팀을 위한<br />세 가지 AI 엔진
          </h2>
        </motion.div>

        {/* Feature rows */}
        <div>
          {FEATURES.map((f, i) => {
            const Geo = f.geo;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.65 }}
                className="pf-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "72px 1fr 120px",
                  gap: "0 56px",
                  padding: "56px 0",
                  borderTop: "1px solid #F1F5F9",
                  alignItems: "center",
                }}
              >
                {/* Large dim number */}
                <div className="pf-num" style={{
                  fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900,
                  color: "#F1F5F9", letterSpacing: "-0.04em", lineHeight: 1,
                  userSelect: "none", alignSelf: "start", paddingTop: 4,
                }}>
                  {f.num}
                </div>

                {/* Content */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                    {f.tag}
                  </div>
                  <h3 style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 900, color: "#0F172A",
                    letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 18, whiteSpace: "pre-line",
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", color: "#64748B", lineHeight: 1.9, maxWidth: 520, marginBottom: 20 }}>
                    {f.desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {f.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 20, height: 1, background: "#0EA5E9", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line art */}
                <div className="pf-icon" style={{ display: "flex", justifyContent: "center" }}>
                  <Geo />
                </div>
              </motion.div>
            );
          })}
          <div style={{ borderTop: "1px solid #F1F5F9" }} />
        </div>
      </div>
    </section>
    <style>{`
      @media (max-width: 768px) {
        .pf-section { padding: 60px 16px !important; }
        .pf-row { display: block !important; padding: 40px 0 !important; }
        .pf-num { font-size: 2.5rem !important; margin-bottom: 12px !important; display: block !important; }
        .pf-icon { display: none !important; }
      }
    `}</style>
    </>
  );
}
