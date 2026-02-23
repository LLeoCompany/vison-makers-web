"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Building2,
  Mail,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Send,
} from "lucide-react";
import { dropdownMenuItems } from "@/config/solutionsConfig";

interface ConsultationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm = {
  name: "",
  phone: "",
  company: "",
  email: "",
  field: "",
  message: "",
};

export default function ConsultationSidebar({ isOpen, onClose }: ConsultationSidebarProps) {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setForm(initialForm);
      }, 400);
    }
  }, [isOpen]);

  const handleChange = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const canSubmit = !!(form.name && form.phone && form.company);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-blue-950/30 backdrop-blur-sm"
          />

          {/* Sidebar Panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">V</span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">상담 신청</h2>
                </div>
                <p className="text-xs text-gray-400">
                  전문 컨설턴트가 24시간 이내 연락드립니다
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="px-6 py-6 space-y-5"
                  >
                    {/* Name */}
                    <FieldWrapper
                      label="이름 *"
                      icon={<User className="w-4 h-4" />}
                    >
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="홍길동"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FieldWrapper>

                    {/* Phone */}
                    <FieldWrapper
                      label="연락처 *"
                      icon={<Phone className="w-4 h-4" />}
                    >
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="010-0000-0000"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FieldWrapper>

                    {/* Company */}
                    <FieldWrapper
                      label="회사명 *"
                      icon={<Building2 className="w-4 h-4" />}
                    >
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="주식회사 Vision Makers"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FieldWrapper>

                    {/* Email */}
                    <FieldWrapper
                      label="이메일"
                      icon={<Mail className="w-4 h-4" />}
                    >
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="contact@company.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FieldWrapper>

                    {/* Field select */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        관심 분야
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                        <select
                          value={form.field}
                          onChange={(e) => handleChange("field", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">분야를 선택해주세요</option>
                          {dropdownMenuItems.map((item) => (
                            <option key={item.field} value={item.field}>
                              {item.emoji} {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        문의 내용
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="도입 목적, 현재 상황, 궁금한 점 등을 자유롭게 작성해주세요."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Privacy note */}
                    <p className="text-xs text-gray-400 leading-relaxed">
                      입력하신 정보는 상담 목적으로만 사용되며,{" "}
                      <span className="text-blue-600 underline cursor-pointer">
                        개인정보처리방침
                      </span>
                      에 따라 안전하게 보호됩니다.
                    </p>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!canSubmit || loading}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        canSubmit && !loading
                          ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/20"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          전송 중...
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          상담 신청하기
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full px-6 py-20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-blue-700" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      상담 신청 완료!
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                      전문 컨설턴트가{" "}
                      <span className="font-semibold text-blue-700">24시간 이내</span>에
                      연락드리겠습니다.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                    >
                      닫기
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper component
function FieldWrapper({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        {children}
      </div>
    </div>
  );
}
