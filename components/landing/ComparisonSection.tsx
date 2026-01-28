"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Cloud,
  Server,
  Brain,
  BookOpen,
  XCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

type ComparisonItem = {
  category: string;
  external: { text: string; detail: string };
  visionMakers: { text: string; detail: string };
};

const comparisonData: ComparisonItem[] = [
  {
    category: "데이터 처리",
    external: {
      text: "외부 서버로 전송",
      detail: "데이터가 제3자 서버에서 처리되어 유출 위험 상존",
    },
    visionMakers: {
      text: "사내 서버 독립 구축",
      detail: "모든 데이터가 귀사 인프라 내에서만 처리",
    },
  },
  {
    category: "학습 정책",
    external: {
      text: "데이터 학습 활용 위험",
      detail: "입력 데이터가 AI 모델 개선에 사용될 수 있음",
    },
    visionMakers: {
      text: "학습 원천 차단",
      detail: "귀사 데이터는 어떤 형태로도 학습에 활용되지 않음",
    },
  },
  {
    category: "답변 신뢰성",
    external: {
      text: "환각(Hallucination) 현상",
      detail: "없는 정보를 그럴듯하게 생성하는 문제 빈발",
    },
    visionMakers: {
      text: "근거(출처) 기반 답변",
      detail: "모든 답변에 원본 문서 출처 명시, 검증 가능",
    },
  },
];

const ComparisonSection = () => {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#EF4444]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#00D1FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block text-[#00D1FF] text-sm font-medium mb-4 tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            WHY VISION-MAKERS
          </motion.span>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            일반 AI vs{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]">
              Vision-Makers
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            외부 AI 서비스와의 명확한 차이를 확인하세요.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="relative">
          {/* Header Row */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-500 font-medium text-sm pl-4">비교 항목</div>
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-[#EF4444] font-semibold">일반 AI</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-[#00D1FF]" />
              <span className="text-[#00D1FF] font-semibold">Vision-Makers</span>
            </div>
          </motion.div>

          {/* Comparison Rows */}
          {comparisonData.map((item, idx) => (
            <motion.div
              key={idx}
              className="grid grid-cols-3 gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category */}
              <div className="flex items-center">
                <span className="text-white font-medium text-sm md:text-base pl-4">
                  {item.category}
                </span>
              </div>

              {/* External AI */}
              <motion.div
                className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl p-4 hover:border-[#EF4444]/40 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <span className="text-[#EF4444] font-medium text-sm">
                    {item.external.text}
                  </span>
                </div>
                <p className="text-gray-500 text-xs pl-6">{item.external.detail}</p>
              </motion.div>

              {/* Vision-Makers */}
              <motion.div
                className="bg-[#00D1FF]/5 border border-[#00D1FF]/20 rounded-xl p-4 hover:border-[#00D1FF]/40 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#48BB78] flex-shrink-0 mt-0.5" />
                  <span className="text-[#48BB78] font-medium text-sm">
                    {item.visionMakers.text}
                  </span>
                </div>
                <p className="text-gray-400 text-xs pl-6">{item.visionMakers.detail}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Visual Comparison - Icons */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* External AI Visual */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative p-8 rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/20"
              whileHover={{ borderColor: "rgba(239, 68, 68, 0.4)" }}
            >
              <Cloud className="w-16 h-16 text-[#EF4444]/60" />
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            <p className="mt-4 text-gray-500 text-sm">외부 클라우드 의존</p>
          </div>

          {/* Vision-Makers Visual */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative p-8 rounded-2xl bg-[#00D1FF]/5 border border-[#00D1FF]/20"
              whileHover={{ borderColor: "rgba(0, 209, 255, 0.4)" }}
            >
              <Server className="w-16 h-16 text-[#00D1FF]/60" />
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#48BB78] rounded-full flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(72, 187, 120, 0.4)",
                    "0 0 0 10px rgba(72, 187, 120, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Shield className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            <p className="mt-4 text-gray-400 text-sm">귀사 전용 인프라</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
