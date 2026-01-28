"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Target, ShieldCheck } from "lucide-react";

// CountUp Animation Hook
const useCountUp = (end: number, duration: number = 2, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (startOnView && isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, hasStarted]);

  return { count, ref };
};

// Single Metric Component
const MetricCard = ({
  value,
  suffix,
  label,
  icon: Icon,
  color,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) => {
  const { count, ref } = useCountUp(value, 2.5);

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center p-8 rounded-2xl bg-gradient-to-b from-[#1a1a2e]/50 to-transparent border border-[#00D1FF]/10 hover:border-[#00D1FF]/30 transition-colors"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Icon */}
      <motion.div
        className="mb-4 p-3 rounded-xl"
        style={{ backgroundColor: `${color}15` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </motion.div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className="text-4xl md:text-5xl font-bold"
          style={{ color }}
        >
          {count.toLocaleString()}
        </motion.span>
        <span className="text-2xl md:text-3xl font-bold text-gray-400">
          {suffix}
        </span>
      </div>

      {/* Divider */}
      <motion.div
        className="w-12 h-0.5 my-4 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
        viewport={{ once: true }}
      />

      {/* Label */}
      <p className="text-gray-400 text-center">{label}</p>
    </motion.div>
  );
};

const SocialProof = () => {
  const metrics = [
    {
      value: 100000,
      suffix: "+",
      label: "DevGym 실증 유저",
      sublabel: "시스템 안정성 검증",
      icon: Users,
      color: "#00D1FF",
    },
    {
      value: 92,
      suffix: "%",
      label: "답변 정확도",
      sublabel: "RAG 최적화 기술력",
      icon: Target,
      color: "#48BB78",
    },
    {
      value: 0,
      suffix: "",
      label: "데이터 외부 유출 사고",
      sublabel: "철저한 보안성",
      icon: ShieldCheck,
      color: "#60A5FA",
      displayAs: "ZERO",
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-[#0a0a0f]">
      {/* Background Accent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D1FF]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D1FF]/30 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Label */}
        <motion.p
          className="text-center text-[#00D1FF] text-sm font-medium mb-12 tracking-wider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          TRUSTED BY ENTERPRISES
        </motion.p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, idx) => (
            <MetricCard
              key={idx}
              value={metric.value}
              suffix={metric.suffix}
              label={metric.label}
              icon={metric.icon}
              color={metric.color}
              delay={idx * 0.15}
            />
          ))}
        </div>

        {/* Special handling for ZERO display */}
        <style jsx global>{`
          .zero-override {
            font-variant-numeric: normal !important;
          }
        `}</style>
      </div>
    </section>
  );
};

// Bar Metric Item Component (to properly use hooks)
const BarMetricItem = ({
  value,
  suffix,
  label,
  sublabel,
  delay,
  showDivider,
}: {
  value?: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  delay: number;
  showDivider: boolean;
}) => {
  const { count, ref } = useCountUp(value || 0, 2);

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <span className="text-3xl md:text-4xl font-bold text-[#00D1FF]">
        {value ? `${count.toLocaleString()}${suffix}` : label}
      </span>
      <div className="text-left">
        <p className="text-gray-300 text-sm">{value ? label : sublabel}</p>
      </div>
      {showDivider && (
        <div className="hidden md:block w-px h-8 bg-[#00D1FF]/20 ml-8" />
      )}
    </motion.div>
  );
};

// Alternative: Horizontal Bar Version
export const SocialProofBar = () => {
  const metrics = [
    { value: 100000, suffix: "+", label: "DevGym 실증 유저" },
    { value: 92, suffix: "%", label: "답변 정확도" },
    { label: "ZERO", sublabel: "데이터 유출 사고" },
  ];

  return (
    <section className="relative py-8 px-4 bg-[#0f0f1a] border-y border-[#00D1FF]/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {metrics.map((metric, idx) => (
            <BarMetricItem
              key={idx}
              value={metric.value}
              suffix={metric.suffix}
              label={metric.label}
              sublabel={metric.sublabel}
              delay={idx * 0.1}
              showDivider={idx < metrics.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
