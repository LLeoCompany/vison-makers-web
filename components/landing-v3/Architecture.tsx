"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Abstract Light Line Component
const LightLine = ({
  delay,
  duration,
  startX,
  startY,
  midX,
  midY,
  endX,
  endY,
}: {
  delay: number;
  duration: number;
  startX: string;
  startY: string;
  midX: string;
  midY: string;
  endX: string;
  endY: string;
}) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-[#007AFF]"
      style={{
        left: startX,
        top: startY,
        boxShadow: "0 0 20px 5px rgba(0, 122, 255, 0.6)",
      }}
      animate={{
        left: [startX, midX, endX, midX, startX],
        top: [startY, midY, endY, midY, startY],
        opacity: [0.3, 1, 0.8, 1, 0.3],
        scale: [0.8, 1.2, 1, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Trail Effect
const LightTrail = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.5 }}
    >
      {/* Circular Path */}
      <svg width="400" height="400" className="absolute -left-[200px] -top-[200px]">
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="url(#blueGradient)"
          strokeWidth="1"
          strokeDasharray="10 20"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay }}
        />
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007AFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#007AFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#007AFF" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// Central Server Core
const ServerCore = () => {
  return (
    <motion.div
      className="relative w-32 h-32 md:w-40 md:h-40"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#007AFF]/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-[#007AFF]/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Core */}
      <motion.div
        className="absolute inset-8 rounded-full bg-[#007AFF]/20 flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 30px rgba(0, 122, 255, 0.3)",
            "0 0 60px rgba(0, 122, 255, 0.5)",
            "0 0 30px rgba(0, 122, 255, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-[#007AFF]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Pulse Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-[#007AFF]"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 3,
            delay: i * 1,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
};

const Architecture = () => {
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
      {/* Light Lines - Data Circulation */}
      <div className="absolute inset-0 pointer-events-none">
        <LightLine
          delay={0}
          duration={8}
          startX="20%"
          startY="30%"
          midX="50%"
          midY="50%"
          endX="80%"
          endY="70%"
        />
        <LightLine
          delay={1}
          duration={10}
          startX="70%"
          startY="20%"
          midX="50%"
          midY="50%"
          endX="30%"
          endY="80%"
        />
        <LightLine
          delay={2}
          duration={9}
          startX="15%"
          startY="60%"
          midX="50%"
          midY="50%"
          endX="85%"
          endY="40%"
        />
        <LightLine
          delay={0.5}
          duration={11}
          startX="40%"
          startY="15%"
          midX="50%"
          midY="50%"
          endX="60%"
          endY="85%"
        />
        <LightLine
          delay={1.5}
          duration={7}
          startX="85%"
          startY="50%"
          midX="50%"
          midY="50%"
          endX="15%"
          endY="50%"
        />

        {/* Trail Effects */}
        <LightTrail delay={0} />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center mb-16 tracking-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#007AFF]">폐쇄망</span> 순환
        </motion.h2>

        {/* Central Visualization */}
        <ServerCore />

        {/* Caption */}
        <motion.p
          className="mt-16 text-white/50 text-lg md:text-xl font-light text-center max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          인터넷 없이도 작동하는
          <br />
          <span className="text-white">완벽한 폐쇄형 지능</span>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Architecture;
