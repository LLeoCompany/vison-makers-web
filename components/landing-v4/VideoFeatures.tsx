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

// Separate component for FeatureCard to use hooks properly
const FeatureCard = ({
  feature,
  index,
  progress,
}: {
  feature: (typeof features)[0];
  index: number;
  progress: MotionValue<number>;
}) => {
  const start = index * 0.25;
  const end = start + 0.3;

  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.1, end - 0.1, end], [100, 0, 0, -100]);
  const scale = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y, scale }}
    >
      <div className="text-center">
        <motion.p className="text-[#00F0FF] text-lg md:text-xl font-medium mb-4 tracking-widest">
          {feature.subtitle}
        </motion.p>
        <motion.h2 className="text-6xl md:text-8xl lg:text-[150px] font-black text-white leading-none tracking-tighter mb-6">
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
}: {
  index: number;
  progress: MotionValue<number>;
}) => {
  const start = index * 0.25;
  const fillProgress = useTransform(progress, [start, start + 0.25], [0, 100]);

  return (
    <motion.div className="w-1 h-12 bg-white/20 overflow-hidden">
      <motion.div
        className="w-full bg-[#00F0FF]"
        style={{ height: useTransform(fillProgress, (v) => `${v}%`) }}
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

  // Video brightness based on scroll
  const videoBrightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.15, 0.3]);
  const videoFilter = useTransform(videoBrightness, (v) => `brightness(${v})`);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      {/* Sticky Video Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video Background */}
        <motion.div
          className="absolute inset-0"
          style={{ filter: videoFilter }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/features-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Features */}
        <div className="relative z-10 h-full">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              index={idx}
              progress={scrollYProgress}
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeatures;
