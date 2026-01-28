"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "성벽 안의 지능",
    highlight: "데이터 유출 0건",
    color: "#00D1FF",
  },
  {
    icon: Zap,
    title: "압도적 속도",
    highlight: "로컬 망 내 실시간 처리",
    color: "#60A5FA",
  },
  {
    icon: Target,
    title: "우리 회사 맞춤",
    highlight: "92% 이상 정밀 답변",
    color: "#48BB78",
  },
];

const CoreValue = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a1628] overflow-hidden snap-start">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            로컬 AI의 강점
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00D1FF] to-[#60A5FA] mx-auto rounded-full" />
        </motion.div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <motion.div
                  className="relative bg-[#0f2240]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center h-full"
                  whileHover={{
                    borderColor: value.color,
                    y: -8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${value.color}10 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${value.color}15` }}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: value.color }}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>

                  {/* Highlight */}
                  <p
                    className="text-lg font-medium"
                    style={{ color: value.color }}
                  >
                    {value.highlight}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValue;
