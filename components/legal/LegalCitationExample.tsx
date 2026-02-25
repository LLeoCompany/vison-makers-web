"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, FileText, X, ExternalLink } from "lucide-react";

interface Source {
  id: string;
  label: string;
  type: "판결" | "법령";
  detail: string;
  link?: string;
}

const SOURCES: Record<string, Source> = {
  S1: {
    id: "S1",
    label: "대법원 2021.09.15 선고 2021다55890 판결",
    type: "판결",
    detail:
      "임대인의 보증금 반환채무와 임차인의 목적물 인도의무는 동시이행 관계에 있으므로, 임차인이 목적물을 인도하지 아니한 채 보증금 반환을 청구하는 경우 임대인은 동시이행의 항변권을 행사할 수 있다.",
  },
  S2: {
    id: "S2",
    label: "민법 제618조",
    type: "법령",
    detail:
      "임대차는 당사자 일방이 상대방에게 목적물을 사용·수익하게 할 것을 약정하고 상대방이 이에 대하여 차임을 지급할 것을 약정함으로써 그 효력이 생긴다.",
  },
  S3: {
    id: "S3",
    label: "주택임대차보호법 제3조의2 제1항",
    type: "법령",
    detail:
      "임대차가 종료된 경우에도 임차인이 보증금을 반환받을 때까지는 임대차 관계가 존속되는 것으로 본다. 임차인은 임대인에 대하여 보증금의 반환을 청구할 수 있다.",
  },
  S4: {
    id: "S4",
    label: "대법원 2023.03.16 선고 2022다283725 판결",
    type: "판결",
    detail:
      "임대차 종료 후 보증금을 반환받지 못한 임차인은 임차 목적물의 명도를 거부할 수 있으며, 명도 거부가 권리 남용에 해당하지 않는 한 그 상당한 이익을 임대인에게 부당이득으로 반환할 필요가 없다.",
  },
};

const SENTENCES: Array<{ text: string; sourceId: string | null }> = [
  {
    text: "임대인은 임대차 종료 시 원칙적으로 보증금 전액을 반환할 의무가 있습니다. 다만 임차인이 목적물에 손해를 입힌 경우 해당 금액을 공제한 후 반환할 수 있습니다.",
    sourceId: "S2",
  },
  {
    text: "목적물 인도 의무와 보증금 반환 의무는 동시이행 관계에 있어, 임차인이 목적물을 먼저 반환하지 않는 한 임대인은 보증금 반환을 정당하게 거절할 수 있습니다.",
    sourceId: "S1",
  },
  {
    text: "임대차 종료 후에도 임차인이 보증금을 반환받을 때까지 임대차 관계는 존속하는 것으로 간주되며, 임차인은 이 기간 동안 목적물 명도를 적법하게 거부할 수 있습니다.",
    sourceId: "S3",
  },
  {
    text: "따라서 임차인의 명도 거부가 권리남용에 해당하지 않는 한, 임차인은 이로 인해 발생하는 이익을 부당이득으로 반환할 필요가 없습니다.",
    sourceId: "S4",
  },
];

function CitationBadge({
  source,
  isActive,
  onClick,
}: {
  source: Source;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginLeft: 6,
        padding: "2px 8px",
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        border: "1px solid",
        transition: "all 0.15s",
        verticalAlign: "middle",
        lineHeight: 1.5,
        background: isActive ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)",
        borderColor: isActive ? "rgba(37,99,235,0.5)" : "rgba(37,99,235,0.25)",
        color: isActive ? "#1D4ED8" : "#2563EB",
        boxShadow: isActive ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
      }}
    >
      <FileText style={{ width: 9, height: 9 }} />
      {source.label}
    </button>
  );
}

export default function LegalCitationExample() {
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const toggle = (id: string) =>
    setActiveSource(prev => (prev === id ? null : id));

  const activeSrc = activeSource ? SOURCES[activeSource] : null;

  return (
    <section style={{ background: "#FFFFFF", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* Subtle top rule */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #E2E8F0, transparent)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)", borderRadius: 999, marginBottom: 20 }}>
            <Scale style={{ width: 12, height: 12, color: "#2563EB" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Answer Preview · 실제 답변 예시
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            출처가 살아있는 법률 AI 답변
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            모든 문장 끝에 판결문·법령 출처가 자동으로 연결됩니다.<br />
            클릭하면 해당 원문을 즉시 확인하세요.
          </p>
        </motion.div>

        {/* Demo window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          {/* Browser chrome */}
          <div style={{ background: "#1E293B", borderRadius: "20px 20px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                <div key={c} style={{ width: 11, height: 11, background: c, borderRadius: "50%" }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 16px", borderRadius: 7 }}>
                <Scale style={{ width: 11, height: 11, color: "#B89150" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Vision AI Legal · 법률 전용 챗</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", borderRadius: "0 0 20px 20px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "32px 32px 24px" }}>

              {/* User question */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 }}
                style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}
              >
                <div style={{
                  maxWidth: "72%", background: "rgba(184,145,80,0.14)",
                  border: "1px solid rgba(184,145,80,0.3)",
                  borderRadius: "18px 18px 4px 18px", padding: "14px 18px",
                }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: 0 }}>
                    임대인이 임대차 종료 후 보증금 반환을 거부할 수 있는 법적 근거는 무엇인가요?
                  </p>
                </div>
              </motion.div>

              {/* AI response */}
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1A2238, #2A3A5C)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Scale style={{ width: 16, height: 16, color: "#B89150" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#B89150", marginBottom: 8, letterSpacing: "0.04em" }}>Vision AI Legal</div>

                  <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: 0.2 }}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px 18px 18px 18px", padding: "20px 22px" }}
                  >
                    {/* Sentences with inline citations */}
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 2, letterSpacing: "0.01em" }}>
                      {SENTENCES.map((seg, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 * i + 0.3 }}
                        >
                          {seg.text}
                          {seg.sourceId && (
                            <CitationBadge
                              source={SOURCES[seg.sourceId]}
                              isActive={activeSource === seg.sourceId}
                              onClick={() => toggle(seg.sourceId!)}
                            />
                          )}
                          {i < SENTENCES.length - 1 && " "}
                        </motion.span>
                      ))}
                    </div>

                    {/* Expanded citation panel */}
                    <AnimatePresence>
                      {activeSrc && (
                        <motion.div
                          key={activeSrc.id}
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 18 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#2563EB", background: "rgba(37,99,235,0.12)", padding: "2px 7px", borderRadius: 4 }}>
                                  {activeSrc.type}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA" }}>{activeSrc.label}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <ExternalLink style={{ width: 12, height: 12, color: "#60A5FA", cursor: "pointer" }} />
                                <button onClick={() => setActiveSource(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex" }}>
                                  <X style={{ width: 13, height: 13 }} />
                                </button>
                              </div>
                            </div>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
                              {activeSrc.detail}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Source chips row */}
                  <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: 0.9 }}
                    style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 4 }}>출처</span>
                    {Object.values(SOURCES).map(src => (
                      <button key={src.id}
                        onClick={() => toggle(src.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                          background: activeSource === src.id ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)",
                          border: "1px solid",
                          borderColor: activeSource === src.id ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.08)",
                          color: activeSource === src.id ? "#60A5FA" : "rgba(255,255,255,0.35)",
                          transition: "all 0.15s",
                        }}
                      >
                        <FileText style={{ width: 9, height: 9 }} />
                        {src.label.length > 20 ? src.label.slice(0, 20) + "…" : src.label}
                      </button>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ padding: "12px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                내부 법령·판례 DB 기반 · 외부 인터넷 미연결
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: "#22C55E", borderRadius: "50%" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>4개 출처 자동 연결됨</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
