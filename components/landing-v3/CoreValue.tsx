"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const values = [
  { keyword: "보안", desc: "성벽 안의 지능" },
  { keyword: "속도", desc: "로컬 망 실시간" },
  { keyword: "정확", desc: "92% 정밀 답변" },
];

const CoreValue = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden snap-start"
    >
      <motion.div
        style={{ opacity, y }}
        className="max-w-6xl mx-auto px-6 w-full"
      >
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center mb-20 tracking-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          왜 <span className="text-[#007AFF]">로컬</span>인가
        </motion.h2>

        {/* Values - Large Typography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              {/* Large Keyword */}
              <motion.p
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tighter"
                whileHover={{ color: "#007AFF" }}
                transition={{ duration: 0.3 }}
              >
                {value.keyword}
              </motion.p>

              {/* Description */}
              <p className="text-white/50 text-lg font-light">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CoreValue;
