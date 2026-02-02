"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Dumbbell,
  Factory,
  Store,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import type { IndustryConfig } from "@/config/industryConfig";

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Dumbbell,
  Factory,
  Store,
};

interface IndustryHeroProps {
  config: IndustryConfig;
}

const IndustryHero = ({ config }: IndustryHeroProps) => {
  const Icon = iconMap[config.icon] || Scale;
  const { theme } = config;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #0A192F 0%, #020617 100%)`,
        }}
      />

      {/* Industry Color Accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{ background: theme.gradient }}
      />

      {/* Animated Glow */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: theme.glowColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono"
                style={{
                  backgroundColor: `${theme.primary}20`,
                  border: `1px solid ${theme.primary}40`,
                  color: theme.secondary,
                }}
              >
                <Icon className="w-4 h-4" />
                {config.tagline}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6 whitespace-pre-line"
            >
              {config.headline.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {i === 1 ? (
                    <span style={{ color: theme.secondary }}>{line}</span>
                  ) : (
                    line
                  )}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl"
            >
              {config.subheadline}
            </motion.p>

            {/* Use Cases */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 mb-10"
            >
              {config.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  {useCase}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all"
                style={{ backgroundColor: theme.primary }}
                whileHover={{ scale: 1.03, backgroundColor: theme.secondary }}
                whileTap={{ scale: 0.98 }}
              >
                {config.ctaText}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5" />
                보안 아키텍처 보기
              </motion.button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span>데이터 외부 유출 Zero</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span>On-Premise 구축</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span>2주 POC 가능</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent" />
    </section>
  );
};

export default IndustryHero;
