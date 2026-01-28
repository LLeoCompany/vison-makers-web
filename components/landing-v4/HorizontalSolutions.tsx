"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const industries = [
  {
    id: "legal",
    name: "법률",
    desc: "판례 검색 및 리스크 검토",
    icon: "⚖️",
  },
  {
    id: "medical",
    name: "의료",
    desc: "진단 보조 및 환자 상담",
    icon: "🩺",
  },
  {
    id: "manufacturing",
    name: "제조",
    desc: "매뉴얼 검색 및 불량 분석",
    icon: "🏭",
  },
  {
    id: "startup",
    name: "스타트업",
    desc: "지식 베이스 구축",
    icon: "🚀",
  },
  {
    id: "marketing",
    name: "마케팅",
    desc: "캠페인 분석 및 인사이트",
    icon: "📢",
  },
  {
    id: "public",
    name: "공공",
    desc: "민원 자동화 시스템",
    icon: "🏛️",
  },
];

// 3D Icon Component
const Icon3D = ({ emoji, isHovered }: { emoji: string; isHovered: boolean }) => {
  return (
    <motion.div
      className="relative text-7xl md:text-8xl"
      animate={{
        rotateY: isHovered ? 15 : 0,
        rotateX: isHovered ? -10 : 0,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <span
        style={{
          textShadow: isHovered
            ? "0 20px 40px rgba(0, 240, 255, 0.3)"
            : "0 10px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        {emoji}
      </span>
    </motion.div>
  );
};

const SolutionCard = ({
  industry,
  index,
}: {
  industry: (typeof industries)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] md:w-[500px] h-[70vh] md:h-[600px] relative group cursor-pointer"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card */}
      <motion.div
        className="absolute inset-4 bg-white/[0.03] backdrop-blur-sm border border-white/10 flex flex-col justify-between p-8 md:p-12"
        animate={{
          borderColor: isHovered ? "rgba(0, 240, 255, 0.5)" : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* 3D Icon */}
        <Icon3D emoji={industry.icon} isHovered={isHovered} />

        {/* Content */}
        <div>
          <motion.h3
            className="text-4xl md:text-5xl font-black text-white mb-4"
            animate={{ color: isHovered ? "#00F0FF" : "#FFFFFF" }}
            transition={{ duration: 0.3 }}
          >
            {industry.name}
          </motion.h3>
          <p className="text-white/50 text-lg md:text-xl font-light">
            {industry.desc}
          </p>
        </div>

        {/* Hover Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 100px rgba(0, 240, 255, 0.1)"
              : "inset 0 0 0 rgba(0, 240, 255, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

const HorizontalSolutions = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-75%"]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Section Title */}
        <motion.div
          className="px-8 md:px-16 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#00F0FF] text-sm md:text-base font-medium tracking-widest mb-4">
            INDUSTRY SOLUTIONS
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            업종별 AI 비서
          </h2>
        </motion.div>

        {/* Horizontal Scroll Cards */}
        <motion.div className="flex gap-0" style={{ x }}>
          {/* Spacer */}
          <div className="flex-shrink-0 w-8 md:w-16" />

          {industries.map((industry, idx) => (
            <SolutionCard key={industry.id} industry={industry} index={idx} />
          ))}

          {/* CTA Card */}
          <motion.div
            className="flex-shrink-0 w-[85vw] md:w-[500px] h-[70vh] md:h-[600px] relative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/consultation/start" className="block h-full">
              <motion.div
                className="absolute inset-4 bg-[#00F0FF] flex flex-col justify-between p-8 md:p-12 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-7xl md:text-8xl">→</div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-black text-black mb-4">
                    우리 업종은?
                  </h3>
                  <p className="text-black/70 text-lg md:text-xl font-light">
                    맞춤 상담 받기
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Spacer */}
          <div className="flex-shrink-0 w-[20vw]" />
        </motion.div>

        {/* Scroll Progress */}
        <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16">
          <div className="h-[2px] bg-white/10">
            <motion.div
              className="h-full bg-[#00F0FF]"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalSolutions;
