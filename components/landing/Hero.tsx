"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";

// Animated Grid Background
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 209, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 209, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Moving Grid Overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 209, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 209, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D1FF]/5 rounded-full blur-3xl" />
    </div>
  );
};

// Floating Particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#00D1FF]/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      <AnimatedGrid />
      <FloatingParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-[#00D1FF] rounded-full animate-pulse" />
          <span className="text-[#00D1FF] text-sm font-medium">
            기업 전용 Private RAG AI 파트너
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
        >
          외부 AI는 유출되지만,
          <br />
          <span className="relative">
            Vision-Makers는{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]"
              animate={{
                textShadow: [
                  "0 0 20px rgba(0, 209, 255, 0.5)",
                  "0 0 40px rgba(0, 209, 255, 0.8)",
                  "0 0 20px rgba(0, 209, 255, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              이식합니다.
            </motion.span>
          </span>
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          사내 문서를{" "}
          <span className="text-[#00D1FF]">성벽 안에 가두고</span>, 오직 지능만
          활용하는
          <br className="hidden md:block" />
          우리 회사 전용 Private RAG 솔루션.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <Link href="/consultation/start">
            <motion.button
              className="group relative flex items-center gap-3 bg-gradient-to-r from-[#00D1FF] to-[#60A5FA] text-black font-semibold px-8 py-4 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <Search className="w-5 h-5" />
              <span>무료 보안 리스크 진단</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <Link href="#solutions">
            <motion.button
              className="flex items-center gap-3 border border-[#00D1FF]/50 text-[#00D1FF] font-semibold px-8 py-4 rounded-xl hover:bg-[#00D1FF]/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>업종별 데모 보기</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#48BB78] rounded-full" />
            <span>ZERO 데이터 유출</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00D1FF] rounded-full" />
            <span>SOC2 Type II 준수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#60A5FA] rounded-full" />
            <span>전용 VPC 구축</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-[#00D1FF]/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-[#00D1FF] rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
