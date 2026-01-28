"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  Lock,
  Shield,
  Database,
  Filter,
  User,
  Eye,
  EyeOff,
  Server,
  CheckCircle,
} from "lucide-react";

// Animated Document Icon Component
const AnimatedDocument = ({
  delay,
  startX,
}: {
  delay: number;
  startX: number;
}) => {
  return (
    <motion.div
      className="absolute"
      initial={{ x: startX, opacity: 0, scale: 0.5 }}
      animate={{
        x: [startX, startX + 80, startX + 160],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.8],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    >
      <div className="bg-[#1a1a2e] border border-[#00D1FF]/30 rounded-lg p-2">
        <FileText className="w-5 h-5 text-[#00D1FF]" />
      </div>
    </motion.div>
  );
};

// Lock Gate Animation
const LockGate = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-2 border-[#00D1FF]/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Lock Icon */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-[#00D1FF]/20 to-[#60A5FA]/20 rounded-full p-4 border border-[#00D1FF]/50"
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 209, 255, 0.3)",
            "0 0 40px rgba(0, 209, 255, 0.5)",
            "0 0 20px rgba(0, 209, 255, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Lock className="w-8 h-8 text-[#00D1FF]" />
      </motion.div>
    </motion.div>
  );
};

// Castle Wall / Fortress Component
const CastleWall = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      {/* Castle Wall Stones - Top */}
      <div className="absolute -top-4 left-0 right-0 flex justify-center gap-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-8 h-6 bg-gradient-to-b from-[#2a2a4a] to-[#1a1a2e] rounded-t-sm border-t border-x border-[#00D1FF]/20"
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        ))}
      </div>

      {/* Main Fortress Wall */}
      <motion.div
        className="relative bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f] border-2 border-[#00D1FF]/30 rounded-2xl p-8 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Corner Towers */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#1a1a2e] border border-[#00D1FF]/40 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a2e] border border-[#00D1FF]/40 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#1a1a2e] border border-[#00D1FF]/40 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#1a1a2e] border border-[#00D1FF]/40 rounded-br-lg" />

        {/* Inner Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/5 via-transparent to-[#00D1FF]/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>

      {/* Castle Wall Stones - Bottom */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="w-8 h-6 bg-gradient-to-t from-[#2a2a4a] to-[#1a1a2e] rounded-b-sm border-b border-x border-[#00D1FF]/20"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

// Vector DB Pulse Animation
const VectorDBCore = () => {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pulse Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#00D1FF]/30"
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Core Database Icon */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-[#00D1FF]/30 to-[#60A5FA]/30 rounded-2xl p-6 border border-[#00D1FF]/50"
        animate={{
          boxShadow: [
            "0 0 30px rgba(0, 209, 255, 0.2)",
            "0 0 60px rgba(0, 209, 255, 0.4)",
            "0 0 30px rgba(0, 209, 255, 0.2)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Database className="w-12 h-12 text-[#00D1FF]" />
      </motion.div>

      {/* Label */}
      <motion.p
        className="mt-4 text-[#00D1FF] font-semibold text-lg"
        animate={{
          textShadow: [
            "0 0 10px rgba(0, 209, 255, 0.5)",
            "0 0 20px rgba(0, 209, 255, 0.8)",
            "0 0 10px rgba(0, 209, 255, 0.5)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Vector DB
      </motion.p>
    </motion.div>
  );
};

// PII Filter Animation
const PIIFilter = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Visualization */}
      <div className="relative">
        {/* Filter Lines */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 bg-gradient-to-r from-[#EF4444] to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>

        {/* Main Filter Box */}
        <motion.div
          className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-[#60A5FA]/50 rounded-xl p-4"
          animate={{
            borderColor: ["rgba(96, 165, 250, 0.5)", "rgba(0, 209, 255, 0.8)", "rgba(96, 165, 250, 0.5)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Filter className="w-8 h-8 text-[#60A5FA]" />
        </motion.div>

        {/* Output Lines */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 bg-gradient-to-l from-[#48BB78] to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Data Masking Visualization
const DataMaskingDemo = () => {
  const maskingExamples = [
    { original: "홍길동", masked: "홍**" },
    { original: "010-1234-5678", masked: "010-****-****" },
    { original: "hong@email.com", masked: "h***@***.com" },
  ];

  return (
    <motion.div
      className="bg-[#0f0f1a]/80 rounded-lg p-4 border border-[#00D1FF]/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
        <EyeOff className="w-3 h-3" />
        실시간 PII 필터링
      </p>
      {maskingExamples.map((example, idx) => (
        <motion.div
          key={idx}
          className="flex items-center gap-3 text-sm mb-2 last:mb-0"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + idx * 0.15 }}
        >
          <span className="text-[#EF4444] line-through opacity-60 font-mono text-xs">
            {example.original}
          </span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
          <span className="text-[#48BB78] font-mono text-xs">{example.masked}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Security Badge Component
const SecurityBadge = ({
  icon: Icon,
  text,
  delay,
}: {
  icon: React.ElementType;
  text: string;
  delay: number;
}) => {
  return (
    <motion.div
      className="flex items-center gap-2 bg-[#1a1a2e]/80 px-4 py-2 rounded-full border border-[#00D1FF]/30"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, borderColor: "rgba(0, 209, 255, 0.6)" }}
    >
      <Icon className="w-4 h-4 text-[#00D1FF]" />
      <span className="text-sm text-gray-300">{text}</span>
    </motion.div>
  );
};

// Main Security Architecture Component
const SecurityArchitecture = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-4 overflow-hidden bg-[#0a0a0f]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 209, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 209, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#00D1FF]/10 px-4 py-2 rounded-full mb-6 border border-[#00D1FF]/30"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-5 h-5 text-[#00D1FF]" />
            <span className="text-[#00D1FF] font-medium">The Vault</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            보안 아키텍처:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]">
              성벽 안의 데이터
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            귀사의 데이터는 절대 내부망을 벗어나지 않습니다. <br />
            오직 지능만이 성벽을 넘어 비즈니스 가치를 창출합니다.
          </p>
        </motion.div>

        {/* Main Architecture Diagram */}
        <div className="relative">
          {/* Flow Container */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Input Section */}
            <motion.div
              className="lg:col-span-1 flex flex-col items-center gap-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">데이터 수집</h3>
              <div className="relative h-32 w-full flex items-center justify-center">
                {/* Document Icons Animation */}
                <AnimatedDocument delay={0} startX={-20} />
                <AnimatedDocument delay={1} startX={-20} />
                <AnimatedDocument delay={2} startX={-20} />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs bg-[#1a1a2e] px-2 py-1 rounded text-gray-400">
                  PDF
                </span>
                <span className="text-xs bg-[#1a1a2e] px-2 py-1 rounded text-gray-400">
                  DB
                </span>
                <span className="text-xs bg-[#1a1a2e] px-2 py-1 rounded text-gray-400">
                  API
                </span>
              </div>
            </motion.div>

            {/* Lock Gate */}
            <motion.div
              className="lg:col-span-1 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LockGate />
              <p className="mt-4 text-sm text-gray-400">암호화 게이트</p>
            </motion.div>

            {/* Central Fortress - Vector DB */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CastleWall>
                <VectorDBCore />
              </CastleWall>
            </motion.div>

            {/* Filter Section */}
            <motion.div
              className="lg:col-span-1 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PIIFilter />
              <p className="mt-4 text-sm text-gray-400">PII 필터</p>
            </motion.div>

            {/* Output Section */}
            <motion.div
              className="lg:col-span-1 flex flex-col items-center gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">안전한 응답</h3>
              <motion.div
                className="bg-gradient-to-br from-[#48BB78]/20 to-[#48BB78]/10 rounded-xl p-4 border border-[#48BB78]/40"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(72, 187, 120, 0.2)",
                    "0 0 40px rgba(72, 187, 120, 0.3)",
                    "0 0 20px rgba(72, 187, 120, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CheckCircle className="w-10 h-10 text-[#48BB78]" />
              </motion.div>
              <DataMaskingDemo />
            </motion.div>
          </div>

          {/* Connection Lines (Desktop) */}
          <svg
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-4 hidden lg:block pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <motion.line
              x1="15%"
              y1="50%"
              x2="85%"
              y2="50%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#00D1FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#48BB78" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Security Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SecurityBadge icon={Lock} text="AES-256 암호화" delay={0.7} />
          <SecurityBadge icon={Server} text="전용 VPC 독립 구축" delay={0.8} />
          <SecurityBadge icon={Eye} text="실시간 PII 필터링" delay={0.9} />
          <SecurityBadge icon={Shield} text="SOC2 Type II 준수" delay={1.0} />
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityArchitecture;
