"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  User,
  Shield,
  Search,
  Cpu,
  MessageSquareText,
  Lock,
  Database,
  GitBranch,
  FileCheck,
  ChevronRight,
  Zap,
} from "lucide-react";

interface Layer {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  keywords: string[];
  description: string;
}

const layers: Layer[] = [
  {
    id: 1,
    title: "User Input",
    subtitle: "사용자 질의 입력",
    icon: User,
    color: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.4)",
    keywords: ["Authentication", "Session", "Input Validation"],
    description: "사용자 인증 및 질의 수신",
  },
  {
    id: 2,
    title: "Guardrail Layer",
    subtitle: "보안 검증 레이어",
    icon: Shield,
    color: "#EF4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
    keywords: ["RBAC", "Permission Check", "Content Filter"],
    description: "역할 기반 접근 제어 및 입력 필터링",
  },
  {
    id: 3,
    title: "Hybrid Retrieval",
    subtitle: "하이브리드 검색 엔진",
    icon: Search,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    keywords: ["Vector DB", "Hybrid Search", "BM25 + Dense"],
    description: "의미 검색 + 키워드 검색 결합",
  },
  {
    id: 4,
    title: "Orchestration Layer",
    subtitle: "응답 조율 레이어",
    icon: Cpu,
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    keywords: ["Self Correction", "Chain of Thought", "Context Merge"],
    description: "검색 결과 병합 및 응답 최적화",
  },
  {
    id: 5,
    title: "Answer Generation",
    subtitle: "검증된 응답 생성",
    icon: MessageSquareText,
    color: "#1E3A8A",
    glowColor: "rgba(30, 58, 138, 0.4)",
    keywords: ["Audit Logging", "Source Citation", "Confidence Score"],
    description: "출처 명시 및 신뢰도 표시 응답",
  },
];

// Tooltip Component
const Tooltip = ({
  keywords,
  isVisible,
  color,
}: {
  keywords: string[];
  isVisible: boolean;
  color: string;
}) => {
  return (
    <motion.div
      className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-30"
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative bg-[#0A192F] border rounded-xl p-4 min-w-[200px]"
        style={{ borderColor: `${color}40` }}
      >
        {/* Arrow */}
        <div
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0"
          style={{
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: `8px solid ${color}40`,
          }}
        />

        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono"
              style={{
                backgroundColor: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              <Zap className="w-3 h-3" />
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Layer Card Component
const LayerCard = ({
  layer,
  index,
  isActive,
  isInView,
}: {
  layer: Layer;
  index: number;
  isActive: boolean;
  isInView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = layer.icon;

  return (
    <motion.div
      className="relative flex items-center"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Node on Timeline */}
      <motion.div
        className="absolute left-0 w-4 h-4 rounded-full z-10 -translate-x-1/2"
        style={{ backgroundColor: layer.color }}
        animate={
          isActive
            ? {
                scale: [1, 1.3, 1],
                boxShadow: [
                  `0 0 0 0 ${layer.glowColor}`,
                  `0 0 0 12px transparent`,
                  `0 0 0 0 ${layer.glowColor}`,
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Card */}
      <motion.div
        className="ml-8 flex-1 relative"
        animate={isHovered ? { x: 8 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="relative rounded-xl p-6 backdrop-blur-sm transition-all duration-300 cursor-pointer"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${layer.color}15 0%, transparent 100%)`
              : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
            border: `1px solid ${isHovered || isActive ? layer.color + "60" : "rgba(255,255,255,0.08)"}`,
            boxShadow: isHovered ? `0 0 30px ${layer.glowColor}` : "none",
          }}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${layer.color}20`,
                border: `1px solid ${layer.color}40`,
              }}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-7 h-7" style={{ color: layer.color }} />
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${layer.color}20`,
                    color: layer.color,
                  }}
                >
                  LAYER {layer.id}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">
                {layer.title}
              </h4>
              <p className="text-gray-400 text-sm">{layer.subtitle}</p>

              {/* Expanded Description on Hover */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={isHovered ? { height: "auto", opacity: 1 } : {}}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-gray-500 text-sm mt-3 pt-3 border-t border-gray-700/50">
                  {layer.description}
                </p>
              </motion.div>
            </div>

            {/* Arrow Indicator */}
            <motion.div
              animate={isHovered ? { x: 5, opacity: 1 } : { x: 0, opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </motion.div>
          </div>
        </div>

        {/* Tooltip - Desktop Only */}
        <div className="hidden xl:block">
          <Tooltip
            keywords={layer.keywords}
            isVisible={isHovered}
            color={layer.color}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Flow Connector Component
const FlowConnector = ({
  index,
  isActive,
  color,
  nextColor,
}: {
  index: number;
  isActive: boolean;
  color: string;
  nextColor: string;
}) => {
  return (
    <div className="relative h-16 ml-0">
      {/* Static Line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, ${color}60, ${nextColor}60)`,
        }}
      />

      {/* Animated Flow Particle */}
      {isActive && (
        <motion.div
          className="absolute left-0 w-3 h-3 rounded-full -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, ${color}, ${nextColor})`,
            boxShadow: `0 0 10px ${color}`,
          }}
          initial={{ top: 0, opacity: 0 }}
          animate={{
            top: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.3,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Data Flow Dots */}
      <motion.div
        className="absolute left-0 -translate-x-1/2 flex flex-col items-center justify-around h-full py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: color }}
            animate={
              isActive
                ? {
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }
                : {}
            }
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Main Defense Architecture Component
const DefenseArchitecture = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const activeLayer = useTransform(scrollYProgress, [0.2, 0.8], [0, 5]);
  const [currentActive, setCurrentActive] = useState(0);

  React.useEffect(() => {
    const unsubscribe = activeLayer.on("change", (latest) => {
      setCurrentActive(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [activeLayer]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient Orbs */}
        <div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #1E3A8A 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#10B981] text-sm font-mono">
              5-Layer Defense
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            철벽 보안 RAG 아키텍처
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            사용자 입력부터 응답 생성까지, 모든 단계에서
            <br className="hidden md:block" />
            <span className="text-white">Enterprise급 보안</span>을 적용합니다
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <div className="max-w-2xl mx-auto">
          <div ref={timelineRef} className="relative pl-8">
            {/* Main Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366F1]/30 via-[#10B981]/30 to-[#1E3A8A]/30" />

            {/* Progress Line */}
            <motion.div
              className="absolute left-0 top-0 w-px bg-gradient-to-b from-[#6366F1] via-[#10B981] to-[#1E3A8A]"
              style={{
                height: useTransform(
                  scrollYProgress,
                  [0.2, 0.8],
                  ["0%", "100%"]
                ),
              }}
            />

            {/* Layers */}
            <div className="space-y-0">
              {layers.map((layer, index) => (
                <React.Fragment key={layer.id}>
                  <LayerCard
                    layer={layer}
                    index={index}
                    isActive={currentActive >= index}
                    isInView={isInView}
                  />
                  {index < layers.length - 1 && (
                    <FlowConnector
                      index={index}
                      isActive={currentActive > index}
                      color={layer.color}
                      nextColor={layers[index + 1].color}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { icon: Lock, value: "100%", label: "데이터 보안" },
            { icon: Database, value: "5 Layer", label: "방어 체계" },
            { icon: FileCheck, value: "99.9%", label: "정확도" },
            { icon: GitBranch, value: "실시간", label: "감사 로그" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <stat.icon className="w-6 h-6 text-[#10B981] mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DefenseArchitecture;
