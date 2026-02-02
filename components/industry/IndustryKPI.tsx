"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Award, BarChart3, Target } from "lucide-react";
import type { IndustryConfig, IndustryKPI as KPIType } from "@/config/industryConfig";

interface IndustryKPIProps {
  config: IndustryConfig;
}

// Animated Counter Component
const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2,
  inView,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  inView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// KPI Card Component
const KPICard = ({
  kpi,
  index,
  theme,
  inView,
}: {
  kpi: KPIType;
  index: number;
  theme: IndustryConfig["theme"];
  inView: boolean;
}) => {
  const icons = [TrendingUp, Award, BarChart3, Target];
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className="relative h-full p-8 rounded-2xl border transition-all duration-300 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${theme.glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-6"
          style={{
            backgroundColor: `${theme.primary}20`,
            border: `1px solid ${theme.primary}40`,
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Icon className="w-7 h-7" style={{ color: theme.secondary }} />
        </motion.div>

        {/* Value */}
        <div className="relative mb-2">
          <span
            className="text-5xl md:text-6xl font-bold"
            style={{ color: theme.secondary }}
          >
            <AnimatedCounter
              value={parseFloat(kpi.value)}
              suffix={kpi.suffix}
              inView={inView}
            />
          </span>
        </div>

        {/* Label */}
        <p className="relative text-gray-400 text-lg">{kpi.label}</p>

        {/* Decorative Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full"
          style={{ backgroundColor: theme.primary }}
          initial={{ width: 0 }}
          animate={inView ? { width: "40%" } : {}}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
        />
      </div>
    </motion.div>
  );
};

// Main KPI Section
const IndustryKPI = ({ config }: IndustryKPIProps) => {
  const { theme, kpis, nameKo } = config;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #020617 0%, #0A192F 50%, #020617 100%)`,
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: theme.glowColor, opacity: 0.1 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${theme.primary}20`,
              border: `1px solid ${theme.primary}40`,
            }}
          >
            <BarChart3 className="w-4 h-4" style={{ color: theme.secondary }} />
            <span style={{ color: theme.secondary }} className="text-sm font-mono">
              Proven Results
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {nameKo} 업종 도입 효과
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Vision AI를 도입한 기업들의 실제 성과입니다
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard
              key={kpi.label}
              kpi={kpi}
              index={index}
              theme={theme}
              inView={isInView}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-gray-300">
              2024년 {nameKo} 업종 고객사 평균 데이터 기준
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryKPI;
