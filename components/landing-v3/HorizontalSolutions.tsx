"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const industries = [
  { emoji: "⚖️", name: "법률", desc: "판례 검색" },
  { emoji: "🩺", name: "의료", desc: "진단 보조" },
  { emoji: "🏭", name: "제조", desc: "불량 분석" },
  { emoji: "🚀", name: "스타트업", desc: "지식 베이스" },
  { emoji: "📢", name: "마케팅", desc: "캠페인 분석" },
  { emoji: "🏛️", name: "공공", desc: "민원 자동화" },
];

const HorizontalSolutions = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-black snap-start"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ opacity }} className="w-full">
          {/* Section Title - Fixed */}
          <motion.h2
            className="absolute top-20 left-6 md:left-12 text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            업종별 <span className="text-[#007AFF]">AI 비서</span>
          </motion.h2>

          {/* Horizontal Scroll Container */}
          <motion.div
            style={{ x }}
            className="flex items-center gap-8 md:gap-12 pl-6 md:pl-12 pt-20"
          >
            {industries.map((industry, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-[280px] md:w-[350px] h-[400px] md:h-[450px] bg-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-white/10 hover:border-[#007AFF]/50 transition-colors group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Emoji */}
                <motion.div
                  className="text-6xl md:text-7xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {industry.emoji}
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-[#007AFF] transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-white/50 text-lg font-light">
                    {industry.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div
              className="flex-shrink-0 w-[280px] md:w-[350px] h-[400px] md:h-[450px] bg-[#007AFF] rounded-3xl p-8 md:p-10 flex flex-col justify-between"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-6xl md:text-7xl">→</div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                  우리 업종은?
                </h3>
                <p className="text-white/80 text-lg font-light">
                  맞춤 상담 받기
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalSolutions;
