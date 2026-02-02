"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  ShieldOff,
  UserX,
  Shield,
  Lock,
  CheckCircle,
  Database,
  Key,
  Server,
  XCircle,
} from "lucide-react";

interface ComparisonItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const legacyItems: ComparisonItem[] = [
  {
    icon: AlertTriangle,
    title: "환각 위험",
    description: "검증되지 않은 답변, 출처 불명",
  },
  {
    icon: ShieldOff,
    title: "데이터 유출",
    description: "외부 API로 기밀 정보 전송",
  },
  {
    icon: UserX,
    title: "권한 제어 없음",
    description: "누구나 모든 데이터 접근",
  },
];

const visionItems: ComparisonItem[] = [
  {
    icon: Database,
    title: "Private RAG",
    description: "내부 데이터만 활용, 출처 명시",
  },
  {
    icon: Key,
    title: "Permission-Aware",
    description: "역할 기반 접근 제어 (RBAC)",
  },
  {
    icon: Server,
    title: "Enterprise Security",
    description: "On-Premise 폐쇄망 구축",
  },
];

// Legacy Card Component
const LegacyCard = ({ inView }: { inView: boolean }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1F1F1F 0%, #2D2D2D 50%, #1A1A1A 100%)",
          }}
        />

        {/* Red Accent Glow */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #DC2626 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm font-medium">Risk</span>
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Legacy AI
            </h3>
            <p className="text-gray-500 text-sm">
              일반 ChatGPT / 공개 LLM API
            </p>
          </div>

          {/* Items */}
          <div className="flex-1 space-y-6">
            {legacyItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 group"
                custom={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={itemVariants}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Warning Footer */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-red-400/80 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>기업 도입 시 보안 리스크 발생</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600/50 via-red-500/30 to-transparent" />
      </div>
    </motion.div>
  );
};

// Vision Card Component
const VisionCard = ({ inView }: { inView: boolean }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0A192F 0%, #0F2847 50%, #0A1628 100%)",
          }}
        />

        {/* Blue/Green Accent Glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #1E3A8A 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-sm font-medium">Secured</span>
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Vision AI
            </h3>
            <p className="text-gray-400 text-sm">
              Enterprise RAG + 권한 제어 + 폐쇄망
            </p>
          </div>

          {/* Items */}
          <div className="flex-1 space-y-6">
            {visionItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 group"
                custom={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={itemVariants}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Success Footer */}
          <motion.div
            className="mt-8 pt-6 border-t border-[#1E3A8A]/50"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-emerald-400/80 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>기업 보안 요건 완벽 충족</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-[#1E3A8A]/50" />
      </div>
    </motion.div>
  );
};

// Center Divider
const CenterDivider = ({ inView }: { inView: boolean }) => {
  return (
    <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center z-20">
      {/* Vertical Line */}
      <motion.div
        className="w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"
        initial={{ height: 0, opacity: 0 }}
        animate={inView ? { height: "100%", opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      {/* VS Badge */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#111827] border-2 border-gray-600 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.5,
          delay: 0.6,
          type: "spring",
          stiffness: 200,
        }}
      >
        <span className="text-white font-bold text-lg">VS</span>
      </motion.div>

      {/* Animated Pulse Ring */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-gray-500"
        initial={{ scale: 1, opacity: 0 }}
        animate={
          inView
            ? {
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </div>
  );
};

// Mobile VS Badge
const MobileVSBadge = ({ inView }: { inView: boolean }) => {
  return (
    <motion.div
      className="lg:hidden flex justify-center my-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
    >
      <div className="w-14 h-14 rounded-full bg-[#111827] border-2 border-gray-600 flex items-center justify-center">
        <span className="text-white font-bold">VS</span>
      </div>
    </motion.div>
  );
};

// Main Comparison Section
const ComparisonSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block text-[#10B981] text-sm font-mono tracking-wider uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Why Vision AI
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            기존 AI의 한계를 넘어
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            보안과 신뢰성, 두 마리 토끼를 잡은 Enterprise AI
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="relative">
          {/* Desktop: Side by Side */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <LegacyCard inView={isInView} />
            <VisionCard inView={isInView} />
          </div>

          {/* Center Divider - Desktop */}
          <CenterDivider inView={isInView} />

          {/* Mobile VS Badge */}
          <div className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <MobileVSBadge inView={isInView} />
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-gray-500 mb-6">
            아직도 데이터 유출 걱정하며 AI 도입을 미루고 계신가요?
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6200] text-white font-semibold rounded-lg hover:bg-[#FF6200]/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lock className="w-5 h-5" />
            안전한 AI 도입 상담
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
