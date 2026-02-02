"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { IndustryConfig } from "@/config/industryConfig";

interface IndustryCTAProps {
  config: IndustryConfig;
}

const IndustryCTA = ({ config }: IndustryCTAProps) => {
  const { theme, nameKo, ctaText } = config;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefits = [
    { icon: Clock, text: "2주 내 POC 구축" },
    { icon: Shield, text: "데이터 유출 제로" },
    { icon: Users, text: "전담 엔지니어 배정" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, #0A192F 0%, ${theme.primary}20 50%, #020617 100%)`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ backgroundColor: theme.glowColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: `1px solid ${theme.primary}40`,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Top Accent Line */}
            <div
              className="h-1"
              style={{ background: theme.gradient }}
            />

            <div className="p-8 md:p-12 lg:p-16">
              {/* Header */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    border: `1px solid ${theme.primary}40`,
                  }}
                >
                  <Calendar className="w-4 h-4" style={{ color: theme.secondary }} />
                  <span style={{ color: theme.secondary }} className="text-sm font-mono">
                    무료 상담 예약
                  </span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {nameKo} AI 도입,
                  <br />
                  <span style={{ color: theme.secondary }}>지금 시작하세요</span>
                </h2>

                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                  전문 컨설턴트가 귀사의 업무 환경을 분석하고
                  <br className="hidden md:block" />
                  맞춤형 AI 솔루션을 제안해드립니다
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: theme.secondary }}
                    />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link href="/consultation/start">
                  <motion.button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all"
                    style={{
                      backgroundColor: theme.primary,
                      boxShadow: `0 10px 40px ${theme.glowColor}`,
                    }}
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: theme.secondary,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                <motion.button
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg border-2 transition-all"
                  style={{ borderColor: `${theme.primary}60` }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: theme.secondary,
                    backgroundColor: `${theme.primary}20`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-5 h-5" />
                  전화 상담
                </motion.button>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>02-1234-5678</span>
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600" />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@visionai.kr</span>
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>평일 09:00 - 18:00</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Note */}
          <motion.p
            className="text-center text-gray-600 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            상담 신청 시 수집되는 정보는 상담 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default IndustryCTA;
