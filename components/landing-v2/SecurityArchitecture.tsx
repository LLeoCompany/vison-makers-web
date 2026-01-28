"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, Server, Users } from "lucide-react";

// Castle Wall Animation Component
const CastleWall = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Left Wall */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-16 md:w-24"
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Wall Bricks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`left-${i}`}
            className="absolute w-full"
            style={{ top: `${i * 12.5}%`, height: "12.5%" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="h-full bg-gradient-to-r from-[#1a3a5c] to-transparent border-r border-[#00D1FF]/20" />
          </motion.div>
        ))}
      </motion.div>

      {/* Right Wall */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-16 md:w-24"
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`right-${i}`}
            className="absolute w-full"
            style={{ top: `${i * 12.5}%`, height: "12.5%" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="h-full bg-gradient-to-l from-[#1a3a5c] to-transparent border-l border-[#00D1FF]/20" />
          </motion.div>
        ))}
      </motion.div>

      {/* Top Battlements */}
      <div className="absolute top-0 left-16 right-16 md:left-24 md:right-24 h-8 flex justify-center gap-4">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-6 h-6 bg-[#1a3a5c] border border-[#00D1FF]/20 rounded-t"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.03 }}
          />
        ))}
      </div>

      {/* Ambient Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/5 via-transparent to-[#00D1FF]/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
};

// Flow Node Component
const FlowNode = ({
  icon: Icon,
  label,
  delay,
  isCenter = false,
}: {
  icon: React.ElementType;
  label: string;
  delay: number;
  isCenter?: boolean;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className={`relative rounded-2xl p-6 ${
          isCenter
            ? "bg-gradient-to-br from-[#00D1FF]/20 to-[#60A5FA]/10 border-2 border-[#00D1FF]/50"
            : "bg-white/5 border border-white/20"
        }`}
        whileHover={{ scale: 1.05 }}
        animate={
          isCenter
            ? {
                boxShadow: [
                  "0 0 30px rgba(0,209,255,0.2)",
                  "0 0 50px rgba(0,209,255,0.4)",
                  "0 0 30px rgba(0,209,255,0.2)",
                ],
              }
            : {}
        }
        transition={isCenter ? { duration: 2, repeat: Infinity } : {}}
      >
        <Icon
          className={`w-10 h-10 ${isCenter ? "text-[#00D1FF]" : "text-white/70"}`}
        />

        {/* Pulse Ring for Center */}
        {isCenter && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl border border-[#00D1FF]/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl border border-[#00D1FF]/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.div>

      <motion.p
        className={`mt-4 font-medium ${isCenter ? "text-[#00D1FF]" : "text-gray-400"}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

// Animated Arrow
const FlowArrow = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="flex items-center px-4"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <motion.div
        className="relative w-16 md:w-24 h-0.5 bg-gradient-to-r from-white/20 to-[#00D1FF]/50"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {/* Animated Dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00D1FF] rounded-full"
          animate={{ left: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Arrow Head */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-[#00D1FF]/50 border-y-4 border-y-transparent" />
      </motion.div>
    </motion.div>
  );
};

const SecurityArchitecture = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a1628] overflow-hidden snap-start">
      {/* Castle Wall Background */}
      <CastleWall />

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            성벽 안의 지능
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00D1FF] to-[#60A5FA] mx-auto rounded-full" />
        </motion.div>

        {/* Linear Flow Diagram */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-12">
          <FlowNode icon={FileText} label="사내 문서" delay={0} />
          <FlowArrow delay={0.2} />
          <FlowNode icon={Server} label="로컬 AI 서버" delay={0.4} isCenter />
          <FlowArrow delay={0.6} />
          <FlowNode icon={Users} label="임직원" delay={0.8} />
        </div>

        {/* Key Message */}
        <motion.p
          className="text-center text-lg md:text-xl text-gray-300 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="text-[#00D1FF] font-medium">인터넷 연결 없이도 작동</span>
          하는 완벽한 폐쇄형 지능.
        </motion.p>
      </div>
    </section>
  );
};

export default SecurityArchitecture;
