"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const features = [
  {
    title: "보안",
    subtitle: "성벽 안의 지능",
    description: "데이터 유출 제로",
  },
  {
    title: "속도",
    subtitle: "압도적 실시간",
    description: "로컬 망 처리",
  },
  {
    title: "정확",
    subtitle: "우리 회사 맞춤",
    description: "92% 정밀 답변",
  },
];

// Animated Background Fallback
const AnimatedFeatureBackground = () => {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Moving gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,240,255,0.08) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
};

// Separate component for FeatureCard to use hooks properly
const FeatureCard = ({
  feature,
  index,
  progress,
  totalFeatures,
}: {
  feature: (typeof features)[0];
  index: number;
  progress: MotionValue<number>;
  totalFeatures: number;
}) => {
  // Each feature takes up 1/totalFeatures of the scroll, with overlap for transitions
  const segmentSize = 1 / totalFeatures;
  const start = index * segmentSize;
  const peak = start + segmentSize * 0.5;
  const end = start + segmentSize;

  const opacity = useTransform(
    progress,
    [start, start + 0.05, peak, end - 0.05, end],
    [0, 1, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + 0.05, peak, end - 0.05, end],
    [80, 0, 0, 0, -80]
  );
  const scale = useTransform(
    progress,
    [start, start + 0.05, peak, end - 0.05, end],
    [0.9, 1, 1, 1, 0.9]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y, scale }}
    >
      <div className="text-center">
        <motion.p className="text-[#00F0FF] text-lg md:text-xl font-medium mb-4 tracking-widest">
          {feature.subtitle}
        </motion.p>
        <motion.h2 className="text-6xl md:text-8xl lg:text-[140px] font-black text-white leading-none tracking-tighter mb-6">
          {feature.title}
        </motion.h2>
        <motion.p className="text-white/50 text-xl md:text-2xl font-light">
          {feature.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Separate component for Progress Indicator Item to use hooks properly
const ProgressIndicatorItem = ({
  index,
  progress,
  totalFeatures,
}: {
  index: number;
  progress: MotionValue<number>;
  totalFeatures: number;
}) => {
  const segmentSize = 1 / totalFeatures;
  const start = index * segmentSize;
  const end = start + segmentSize;
  const fillProgress = useTransform(progress, [start, end], [0, 100]);
  const fillHeight = useTransform(fillProgress, (v) => `${Math.min(v, 100)}%`);

  return (
    <motion.div className="w-1 h-12 bg-white/20 overflow-hidden">
      <motion.div
        className="w-full bg-[#00F0FF]"
        style={{ height: fillHeight }}
      />
    </motion.div>
  );
};

const VideoFeatures = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Animated Background (always visible) */}
        <AnimatedFeatureBackground />

        {/* Video Background removed - using animated background instead */}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Features */}
        <div className="relative z-10 h-full">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              index={idx}
              progress={scrollYProgress}
              totalFeatures={features.length}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col gap-4">
            {features.map((_, idx) => (
              <ProgressIndicatorItem
                key={idx}
                index={idx}
                progress={scrollYProgress}
                totalFeatures={features.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeatures;
