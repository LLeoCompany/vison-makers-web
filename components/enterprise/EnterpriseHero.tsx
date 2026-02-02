"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Database } from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Network Node Animation Background
const NetworkBackground = () => {
  const [nodes, setNodes] = useState<
    Array<{ id: number; x: number; y: number; vx: number; vy: number }>
  >([]);

  useEffect(() => {
    // Generate nodes on client only
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
    }));
    setNodes(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(30, 58, 138, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), linear-gradient(180deg, #020617 0%, #0A192F 50%, #020617 100%)",
        }}
      />

      {/* Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated Nodes */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connections */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 25) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${otherNode.x}%`}
                  y2={`${otherNode.y}%`}
                  stroke="#1E3A8A"
                  strokeWidth="1"
                  strokeOpacity={0.3 * (1 - distance / 25)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
              );
            }
            return null;
          })
        )}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="#10B981"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </svg>

      {/* Floating Data Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#10B981] rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

// Real-time Metrics Panel
const MetricsPanel = () => {
  const metrics = [
    {
      value: 2847293,
      label: "Documents Processed",
      suffix: "",
      prefix: "",
      decimals: 0,
    },
    {
      value: 99.2,
      label: "Accuracy Rate",
      suffix: "%",
      prefix: "",
      decimals: 1,
    },
    {
      value: 0.3,
      label: "Avg Response Time",
      suffix: "s",
      prefix: "<",
      decimals: 1,
    },
    {
      value: 100,
      label: "Data Security",
      suffix: "%",
      prefix: "",
      decimals: 0,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="text-center p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + index * 0.1 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            <AnimatedCounter
              end={metric.value}
              suffix={metric.suffix}
              prefix={metric.prefix}
              decimals={metric.decimals}
            />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {metric.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main Hero Component
const EnterpriseHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20">
      {/* Animated Background */}
      <NetworkBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 text-[#10B981] text-sm font-mono">
                <Shield className="w-4 h-4" />
                Enterprise-Grade Knowledge Infrastructure
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              대기업은 이미 가졌습니다.
              <br />
              <span className="bg-gradient-to-r from-[#1E3A8A] via-[#10B981] to-[#1E3A8A] bg-clip-text text-transparent">
                이제 당신 차례입니다.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Fortune 500이 사용하는 Enterprise RAG 인프라를
              <br />
              <span className="text-white">중소기업도 도입할 수 있습니다.</span>
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {[
                { icon: Shield, text: "On-Premise 배포" },
                { icon: Zap, text: "2주 내 구축" },
                { icon: Database, text: "데이터 주권 보장" },
              ].map((feature) => (
                <span
                  key={feature.text}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
                >
                  <feature.icon className="w-4 h-4 text-[#10B981]" />
                  {feature.text}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/consultation/start">
                <motion.button
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#10B981] text-white font-semibold rounded-xl text-lg shadow-lg shadow-[#10B981]/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  무료 PoC 시작하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                데모 영상 보기
              </motion.button>
            </motion.div>

            {/* Real-time Metrics */}
            <MetricsPanel />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
    </section>
  );
};

export default EnterpriseHero;
