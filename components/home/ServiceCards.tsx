"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, MessageSquare, ChevronRight, Check } from "lucide-react";

interface Service {
  type: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  accent: string;
  accentBg: string;
  large?: boolean;
}

const services: Service[] = [
  {
    type: "Type A",
    icon: <BookOpen className="w-6 h-6" />,
    title: "사내 지식 기반 RAG",
    subtitle: "Internal Hub",
    description:
      "흩어진 사내 매뉴얼과 문서를 통합 학습하여 임직원 누구나 즉시 활용할 수 있는 지식 허브를 구축합니다.",
    points: ["인수인계 효율화", "사내 보안 규정 완벽 준수", "온프레미스 구축 가능"],
    accent: "text-blue-700",
    accentBg: "bg-blue-50",
    large: true,
  },
  {
    type: "Type B",
    icon: <Brain className="w-6 h-6" />,
    title: "전문 도메인 특화 RAG",
    subtitle: "Professional Expert",
    description:
      "법률·금융·제조 공정 등 고도의 전문 문서를 분석하여 정확한 출처와 전문가 수준의 추론을 제공합니다.",
    points: ["정확한 출처(Source) 제시", "전문가 수준의 추론 능력", "업종별 맞춤 Fine-tuning"],
    accent: "text-indigo-700",
    accentBg: "bg-indigo-50",
  },
  {
    type: "Type C",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "고객 접점 상담 RAG",
    subtitle: "Customer Specialist",
    description:
      "실시간 DB 연동을 통한 정확한 고객 응대로 브랜드 신뢰도를 높이고 고객 만족을 극대화합니다.",
    points: ["24/7 무중단 대응", "브랜드 맞춤형 톤앤매너", "실시간 DB 연동"],
    accent: "text-sky-700",
    accentBg: "bg-sky-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`relative group bg-white border border-gray-100 rounded-2xl p-7 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/60 transition-all duration-300 flex flex-col ${
        service.large ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      {/* Type badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${service.accentBg} rounded-full text-xs font-bold ${service.accent} mb-4 self-start`}
      >
        {service.type}
      </div>

      {/* Icon */}
      <div
        className={`w-12 h-12 ${service.accentBg} ${service.accent} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {service.icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="mb-1">
          <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
          <p className="text-xs text-gray-400 font-medium">{service.subtitle}</p>
        </div>
        <p className={`text-gray-500 text-sm leading-relaxed mt-3 ${service.large ? "text-base" : ""}`}>
          {service.description}
        </p>

        {/* Points */}
        <ul className="mt-5 space-y-2">
          {service.points.map((p, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className={`w-4 h-4 ${service.accent} flex-shrink-0`} />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA link */}
      <button
        className={`mt-6 flex items-center gap-1 text-sm font-semibold ${service.accent} self-start opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300`}
      >
        자세히 보기 <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function ServiceCards() {
  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            RAG Solution Types
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            비즈니스에 맞는 <span className="text-blue-700">RAG 솔루션</span>을 선택하세요
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            사내 지식 관리부터 전문 분야 분석, 고객 응대까지.
            <br />
            목적에 최적화된 3가지 타입으로 즉시 도입 가능합니다.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
        >
          {services.map((s) => (
            <ServiceCard key={s.type} service={s} />
          ))}

          {/* Stats bento card */}
          <motion.div
            variants={cardVariants}
            className="bg-blue-700 rounded-2xl p-7 text-white flex flex-col justify-between"
          >
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                도입 효과
              </p>
              <div className="space-y-4">
                {[
                  { val: "85%", label: "계약 검토 시간 단축" },
                  { val: "70%", label: "설비 문제 해결 시간 단축" },
                  { val: "50%", label: "고객 응대 자동화" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold">{item.val}</div>
                    <div className="text-blue-200 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-blue-300 text-xs mt-4">
              * 실제 도입 고객사 평균 데이터 기준
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
