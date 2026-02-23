"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search, Shield, Database, ArrowRight, Zap, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Vision RAG Core",
    subtitle: "하이브리드 검색 엔진",
    description:
      "시맨틱 검색과 키워드 검색을 결합한 하이브리드 방식으로 최적의 답변을 제공합니다. 자가 수정(Self-RAG) 엔진이 답변 품질을 실시간으로 검증합니다.",
    points: ["하이브리드 벡터 + 키워드 검색", "Self-RAG 자가 수정 메커니즘", "정확한 출처(Source) 인용"],
    color: "bg-blue-700",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "보안 아키텍처",
    subtitle: "5계층 방어 체계",
    description:
      "AES-256 암호화, 접근 제어, 온프레미스 격리, 감사 로그, AI 출력 필터링까지 5단계 보안 레이어로 기업 데이터를 완벽히 보호합니다.",
    points: ["ISO 27001 보안 인증", "On-Premise 구축 가능", "Zero Trust 아키텍처"],
    color: "bg-indigo-700",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "데이터 주권",
    subtitle: "완전 폐쇄형 LLM",
    description:
      "귀사의 데이터는 외부로 한 바이트도 나가지 않습니다. 폐쇄형 환경에서 LLM을 운영하여 핵심 지식 자산의 완전한 소유권을 보장합니다.",
    points: ["데이터 외부 유출 Zero", "폐쇄망 구성 지원", "기업 데이터 완전 소유권"],
    color: "bg-sky-700",
    textColor: "text-sky-700",
    bgColor: "bg-sky-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

export default function SystemIntroSection() {
  return (
    <section id="system-intro" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            <Zap className="w-3.5 h-3.5" />
            LLM이란? · 시스템 소개
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Vision AI를 <span className="text-blue-700">선택해야 하는</span> 이유
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            단순한 챗봇이 아닙니다. 귀사의 지식 자산을 AI 인프라로 전환하는
            <br />
            완전한 엔터프라이즈 솔루션입니다.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group bg-white border border-gray-100 rounded-2xl p-7 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/60 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${f.color} text-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {f.icon}
              </div>
              <div className="mb-1">
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className={`text-xs font-semibold ${f.textColor} mb-3`}>{f.subtitle}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.description}</p>
              <ul className="space-y-2">
                {f.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full ${f.color} flex-shrink-0`} />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="bg-slate-50 rounded-2xl p-8 lg:p-10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                일반 ChatGPT vs <span className="text-blue-700">Vision AI</span>
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                범용 AI와 Vision AI의 가장 큰 차이는
                <strong className="text-gray-900"> &ldquo;귀사 데이터 기반 답변&rdquo;</strong>입니다.
              </p>
              <div className="space-y-3">
                {[
                  { item: "귀사 내부 문서 참조", general: false, vision: true },
                  { item: "정확한 출처 명시", general: false, vision: true },
                  { item: "데이터 보안 보장", general: false, vision: true },
                  { item: "업종별 특화 학습", general: false, vision: true },
                  { item: "온프레미스 설치", general: false, vision: true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="flex-1 text-gray-700">{row.item}</span>
                    <span
                      className={`w-16 text-center text-xs font-medium py-1 rounded-full ${
                        row.general
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-400"
                      }`}
                    >
                      {row.general ? "✓ 가능" : "✗ 불가"}
                    </span>
                    <span className="w-16 text-center text-xs font-medium py-1 rounded-full bg-blue-50 text-blue-700">
                      ✓ 가능
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex-1" />
                  <span className="w-16 text-center font-semibold">일반 AI</span>
                  <span className="w-16 text-center font-semibold text-blue-700">Vision AI</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <Globe className="w-5 h-5" />,
                  title: "범용 LLM의 한계",
                  desc: "인터넷 기반 학습 데이터로 귀사 내부 문서를 알지 못합니다. 보안 데이터를 외부 서버에 전송해야 합니다.",
                  dark: false,
                },
                {
                  icon: <Lock className="w-5 h-5" />,
                  title: "Vision AI의 강점",
                  desc: "귀사 문서로 학습된 전용 AI가 내부 망에서 작동합니다. 데이터는 단 한 바이트도 외부로 나가지 않습니다.",
                  dark: true,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-5 rounded-xl ${
                    card.dark ? "bg-blue-700 text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      card.dark ? "bg-white/20" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm mb-1 ${
                        card.dark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {card.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${card.dark ? "text-blue-200" : "text-gray-500"}`}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
