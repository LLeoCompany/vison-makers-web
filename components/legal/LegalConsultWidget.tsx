"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, CheckCircle2, ArrowRight } from "lucide-react";

const SCALE_OPTIONS = ["100건 미만", "100~1,000건", "1,000~10,000건", "10,000건 이상"];
const INTEREST_OPTIONS = ["유사 판례 검색", "계약서 리스크 검토", "법률 상담 자동화", "기타 법무 업무"];

interface Form {
  name: string;
  firm: string;
  scale: string;
  interest: string;
  date: string;
}

export default function LegalConsultWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Form>({ name: "", firm: "", scale: "", interest: "", date: "" });

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => { setStep(1); setDone(false); setForm({ name: "", firm: "", scale: "", interest: "", date: "" }); }, 400);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 22 }}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 32, right: 28, zIndex: 200,
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
          border: "none", cursor: "pointer", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(30,58,138,0.45)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="무료 상담 신청"
      >
        <MessageCircle style={{ width: 26, height: 26 }} />
        {/* Ping */}
        <span style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, background: "#EF4444", borderRadius: "50%", border: "2px solid white" }} />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      {/* Slide-in sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(480px, 100vw)", zIndex: 400,
              background: "white", overflowY: "auto",
              boxShadow: "-12px 0 48px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1E3A8A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Legal AI · Vision AI</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>무료 데모 상담 신청</div>
              </div>
              <button onClick={reset} style={{ width: 36, height: 36, background: "#F1F5F9", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X style={{ width: 16, height: 16, color: "#64748B" }} />
              </button>
            </div>

            {/* Progress */}
            {!done && (
              <div style={{ padding: "16px 28px 0", display: "flex", alignItems: "center", gap: 8 }}>
                {[1, 2].map(s => (
                  <React.Fragment key={s}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#1E3A8A" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: step >= s ? "white" : "#94A3B8", transition: "all 0.3s" }}>{s}</div>
                    {s < 2 && <div style={{ flex: 1, height: 2, background: step >= 2 ? "#1E3A8A" : "#E2E8F0", transition: "all 0.3s" }} />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Body */}
            <div style={{ flex: 1, padding: "24px 28px 32px" }}>
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingTop: 60, textAlign: "center" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    >
                      <CheckCircle2 style={{ width: 64, height: 64, color: "#22C55E" }} />
                    </motion.div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>신청이 완료되었습니다!</h3>
                    <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>
                      영업일 기준 1일 내에<br />
                      담당자가 연락드릴 예정입니다.
                    </p>
                    <button
                      onClick={reset}
                      style={{ marginTop: 16, padding: "12px 28px", background: "#1E3A8A", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 12, border: "none", cursor: "pointer" }}
                    >
                      닫기
                    </button>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>기본 정보를 입력해주세요</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <Field label="성함 *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="홍길동" />
                      <Field label="법무법인 / 기관명 *" value={form.firm} onChange={v => setForm(f => ({ ...f, firm: v }))} placeholder="OO 법무법인" />
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, display: "block" }}>관리 데이터 규모 *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {SCALE_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, scale: opt }))}
                              style={{
                                padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                                border: form.scale === opt ? "2px solid #1E3A8A" : "1px solid #E2E8F0",
                                background: form.scale === opt ? "#EFF6FF" : "white",
                                color: form.scale === opt ? "#1E3A8A" : "#64748B",
                                cursor: "pointer", transition: "all 0.15s",
                              }}
                            >{opt}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!form.name || !form.firm || !form.scale}
                      style={{
                        width: "100%", marginTop: 28, padding: "15px", borderRadius: 12,
                        background: form.name && form.firm && form.scale ? "linear-gradient(135deg, #1E3A8A, #3B82F6)" : "#E2E8F0",
                        color: form.name && form.firm && form.scale ? "white" : "#94A3B8",
                        fontSize: 15, fontWeight: 700, border: "none", cursor: form.name && form.firm && form.scale ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
                      }}
                    >
                      다음 단계 <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>상담 세부 정보</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, display: "block" }}>관심 솔루션 *</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {INTEREST_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, interest: opt }))}
                              style={{
                                padding: "11px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: "left",
                                border: form.interest === opt ? "2px solid #1E3A8A" : "1px solid #E2E8F0",
                                background: form.interest === opt ? "#EFF6FF" : "white",
                                color: form.interest === opt ? "#1E3A8A" : "#64748B",
                                cursor: "pointer", transition: "all 0.15s",
                              }}
                            >{opt}</button>
                          ))}
                        </div>
                      </div>
                      <Field label="미팅 희망일" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} placeholder="예: 2025년 2월 10일 오후 2시" />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={{ padding: "15px 20px", borderRadius: 12, border: "1px solid #E2E8F0", background: "white", color: "#64748B", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                      >
                        이전
                      </button>
                      <button
                        type="submit"
                        disabled={!form.interest}
                        style={{
                          flex: 1, padding: "15px", borderRadius: 12,
                          background: form.interest ? "linear-gradient(135deg, #1E3A8A, #3B82F6)" : "#E2E8F0",
                          color: form.interest ? "white" : "#94A3B8",
                          fontSize: 15, fontWeight: 700, border: "none",
                          cursor: form.interest ? "pointer" : "not-allowed", transition: "all 0.2s",
                        }}
                      >
                        상담 신청 완료
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, display: "block" }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
          border: "1px solid #E2E8F0", outline: "none", color: "#0F172A",
          transition: "border-color 0.15s", background: "white",
          boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = "#1E3A8A"; e.target.style.boxShadow = "0 0 0 3px rgba(30,58,138,0.08)"; }}
        onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}
