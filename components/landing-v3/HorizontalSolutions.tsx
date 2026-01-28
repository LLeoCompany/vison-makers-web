"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const industries = [
  { emoji: "⚖️", name: "법률", desc: "판례 검색" },
  { emoji: "🩺", name: "의료", desc: "진단 보조" },
  { emoji: "🏭", name: "제조", desc: "불량 분석" },
  { emoji: "🚀", name: "스타트업", desc: "지식 베이스" },
  { emoji: "📢", name: "마케팅", desc: "캠페인 분석" },
  { emoji: "🏛️", name: "공공", desc: "민원 자동화" },
];

const HorizontalSolutions = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-16 tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          업종별 <span className="text-[#007AFF]">AI 비서</span>
        </motion.h2>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {industries.map((industry, idx) => (
            <motion.div
              key={idx}
              className="flex-shrink-0 w-[280px] md:w-[320px] h-[380px] bg-white/5 rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-[#007AFF]/50 transition-all duration-300 group cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              {/* Emoji */}
              <motion.div
                className="text-5xl md:text-6xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {industry.emoji}
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-[#007AFF] transition-colors">
                  {industry.name}
                </h3>
                <p className="text-white/50 text-base font-light">
                  {industry.desc}
                </p>
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <Link href="/consultation/start">
            <motion.div
              className="flex-shrink-0 w-[280px] md:w-[320px] h-[380px] bg-[#007AFF] rounded-3xl p-8 flex flex-col justify-between cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-5xl md:text-6xl">→</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                  우리 업종은?
                </h3>
                <p className="text-white/80 text-base font-light">
                  맞춤 상담 받기
                </p>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Scroll Hint */}
        <motion.p
          className="text-white/30 text-sm mt-4 text-center md:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          ← 옆으로 스크롤하세요 →
        </motion.p>
      </div>

      {/* Hide scrollbar style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default HorizontalSolutions;
