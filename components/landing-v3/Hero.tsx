"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden snap-start"
    >
      {/* Content */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Main Title - Extra Bold */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          우리 서버 안에
          <br />
          <span className="text-[#007AFF]">AI를 심다.</span>
        </motion.h1>

        {/* Sub Copy */}
        <motion.p
          className="text-lg md:text-xl text-white/60 mb-12 max-w-md mx-auto font-light"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          데이터는 밖으로 나가지 않습니다.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Link href="/consultation/start">
            <motion.button
              className="bg-[#007AFF] hover:bg-[#0066DD] text-white font-semibold px-10 py-4 rounded-full text-lg transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              도입 상담
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
