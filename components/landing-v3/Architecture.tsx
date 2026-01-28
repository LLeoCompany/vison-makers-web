"use client";
import React from "react";
import { motion } from "framer-motion";

// Abstract Light Particles
const LightParticle = ({ delay, x, y }: { delay: number; x: string; y: string }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-[#007AFF]"
      style={{
        left: x,
        top: y,
        boxShadow: "0 0 20px 8px rgba(0, 122, 255, 0.4)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        x: ["0%", "50%", "0%"],
        y: ["0%", "50%", "0%"],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Central Core
const ServerCore = () => {
  return (
    <div className="relative w-40 h-40 md:w-56 md:h-56">
      {/* Pulse Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-[#007AFF]/30"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 2.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Rotating Ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-dashed border-[#007AFF]/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Core Center */}
      <motion.div
        className="absolute inset-8 md:inset-12 rounded-full bg-[#007AFF]/20 flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 40px rgba(0, 122, 255, 0.3)",
            "0 0 80px rgba(0, 122, 255, 0.5)",
            "0 0 40px rgba(0, 122, 255, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#007AFF]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

const Architecture = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden py-20">
      {/* Light Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        <LightParticle delay={0} x="20%" y="30%" />
        <LightParticle delay={0.5} x="80%" y="25%" />
        <LightParticle delay={1} x="15%" y="70%" />
        <LightParticle delay={1.5} x="75%" y="65%" />
        <LightParticle delay={2} x="50%" y="20%" />
        <LightParticle delay={2.5} x="30%" y="80%" />
        <LightParticle delay={3} x="70%" y="75%" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center mb-16 tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#007AFF]">폐쇄망</span> 순환
        </motion.h2>

        {/* Central Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ServerCore />
        </motion.div>

        {/* Caption */}
        <motion.p
          className="mt-16 text-white/50 text-lg md:text-xl font-light text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          인터넷 없이도 작동하는
          <br />
          <span className="text-white font-normal">완벽한 폐쇄형 지능</span>
        </motion.p>
      </div>
    </section>
  );
};

export default Architecture;
