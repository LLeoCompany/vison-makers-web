"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Stethoscope, Factory, Rocket } from "lucide-react";

const industries = [
  {
    id: "legal",
    icon: Scale,
    emoji: "⚖️",
    name: "법률",
    desc: "판례 검색 및 리스크 검토",
    color: "#00D1FF",
  },
  {
    id: "medical",
    icon: Stethoscope,
    emoji: "🩺",
    name: "의료",
    desc: "진단 보조 및 환자 상담 자동화",
    color: "#48BB78",
  },
  {
    id: "manufacturing",
    icon: Factory,
    emoji: "🏭",
    name: "제조",
    desc: "매뉴얼 검색 및 불량 원인 분석",
    color: "#F59E0B",
  },
  {
    id: "startup",
    icon: Rocket,
    emoji: "🚀",
    name: "스타트업",
    desc: "지식 베이스 구축 및 온보딩",
    color: "#EF4444",
  },
];

const IndustrySolutions = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a1628] overflow-hidden snap-start">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#0d1d35]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            업종별 AI 비서
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00D1FF] to-[#60A5FA] mx-auto rounded-full" />
        </motion.div>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {industries.map((industry, idx) => {
            const Icon = industry.icon;
            const isActive = activeId === industry.id;

            return (
              <motion.button
                key={industry.id}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 border-[#00D1FF]"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveId(isActive ? null : industry.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Emoji */}
                <motion.div
                  className="text-4xl mb-3"
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {industry.emoji}
                </motion.div>

                {/* Name */}
                <p
                  className={`font-semibold transition-colors ${
                    isActive ? "text-[#00D1FF]" : "text-white"
                  }`}
                >
                  {industry.name}
                </p>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00D1FF] rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Description Panel */}
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                key={activeId}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg text-gray-300">
                  {industries.find((i) => i.id === activeId)?.desc}
                </p>
              </motion.div>
            )}
            {!activeId && (
              <motion.p
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                아이콘을 클릭하여 자세히 보기
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions;
