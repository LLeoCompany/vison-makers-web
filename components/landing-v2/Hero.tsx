"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a1628] overflow-hidden snap-start">
      {/* Spotlight Effect */}
      <div className="absolute inset-0">
        {/* Central Spotlight */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,209,255,0.15) 0%, rgba(0,209,255,0.05) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Main Copy */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          우리 서버 안에 직접 심는,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]">
            가장 똑똑한 AI 사내 비서.
          </span>
        </motion.h1>

        {/* Sub Copy */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          데이터 유출 걱정 없는 로컬 인프라 기반 맞춤형 AI 이식.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Primary CTA */}
          <Link href="/consultation/start">
            <motion.button
              className="group flex items-center gap-3 bg-[#00D1FF] hover:bg-[#00b8e6] text-[#0a1628] font-semibold px-8 py-4 rounded-full transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>비서 도입 상담</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          {/* Secondary CTA - Ghost Button */}
          <Link href="#cases">
            <motion.button
              className="flex items-center gap-3 border border-white/30 hover:border-white/60 text-white font-medium px-8 py-4 rounded-full transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>구축 사례</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div className="w-1 h-2 bg-[#00D1FF] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
