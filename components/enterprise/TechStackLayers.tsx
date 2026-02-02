"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Layers,
  Database,
  FileText,
  Globe,
  Search,
  GitBranch,
  Bot,
  Monitor,
  Smartphone,
  Settings,
  Cpu,
  Shield,
  Zap,
  X,
} from "lucide-react";

interface TechSpec {
  name: string;
  value: string;
}

interface LayerData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  technologies: string[];
  specs: TechSpec[];
  description: string;
}

const layers: LayerData[] = [
  {
    id: "interface",
    title: "Agentic Interface",
    subtitle: "User Interaction Layer",
    icon: Bot,
    color: "#10B981",
    gradient: "from-[#10B981]/20 to-[#10B981]/5",
    technologies: ["Web App", "Mobile SDK", "Admin Console", "API Gateway"],
    specs: [
      { name: "Response Time", value: "<300ms" },
      { name: "Concurrent Users", value: "10,000+" },
      { name: "API Calls/sec", value: "5,000" },
    ],
    description:
      "웹, 모바일, 관리자 콘솔을 통한 통합 사용자 인터페이스. RESTful API와 WebSocket을 통한 실시간 통신 지원.",
  },
  {
    id: "core",
    title: "Vision RAG Core",
    subtitle: "Intelligence Engine",
    icon: Cpu,
    color: "#1E3A8A",
    gradient: "from-[#1E3A8A]/20 to-[#1E3A8A]/5",
    technologies: ["Hybrid Search", "GraphRAG", "Self-Correction", "RBAC"],
    specs: [
      { name: "Accuracy", value: "99.2%" },
      { name: "Faithfulness", value: "0.94" },
      { name: "Context Window", value: "128K" },
    ],
    description:
      "하이브리드 검색(BM25 + Dense Vector)과 GraphRAG를 결합한 핵심 검색 엔진. 자가 교정 메커니즘으로 환각 최소화.",
  },
  {
    id: "ingestion",
    title: "Data Ingestion",
    subtitle: "Data Processing Layer",
    icon: Database,
    color: "#6366F1",
    gradient: "from-[#6366F1]/20 to-[#6366F1]/5",
    technologies: ["PDF Parser", "DB Connector", "API Integration", "OCR"],
    specs: [
      { name: "File Types", value: "50+" },
      { name: "Processing Speed", value: "1000 docs/min" },
      { name: "Max File Size", value: "500MB" },
    ],
    description:
      "PDF, Word, Excel, 데이터베이스, API 등 다양한 소스에서 데이터를 수집하고 정제. 멀티모달 OCR 지원.",
  },
];

// Layer Card Component
const LayerCard = ({
  layer,
  index,
  isExpanded,
  onToggle,
}: {
  layer: LayerData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const Icon = layer.icon;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <motion.div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
          isExpanded ? "ring-2 ring-offset-2 ring-offset-[#020617]" : ""
        }`}
        style={{
          borderColor: isExpanded ? layer.color : "transparent",
          "--tw-ring-color": layer.color,
        } as React.CSSProperties}
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${layer.gradient}`}
        />
        <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-sm" />

        {/* Border */}
        <div
          className="absolute inset-0 rounded-2xl border transition-colors"
          style={{ borderColor: `${layer.color}30` }}
        />

        {/* Content */}
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between">
            {/* Left: Info */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${layer.color}20`,
                  border: `1px solid ${layer.color}40`,
                }}
              >
                <Icon className="w-7 h-7" style={{ color: layer.color }} />
              </div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${layer.color}20`,
                      color: layer.color,
                    }}
                  >
                    LAYER {layers.length - index}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {layer.title}
                </h3>
                <p className="text-gray-500 text-sm">{layer.subtitle}</p>
              </div>
            </div>

            {/* Right: Technologies */}
            <div className="hidden md:flex flex-wrap gap-2 max-w-[300px] justify-end">
              {layer.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-white/10">
                  {/* Description */}
                  <p className="text-gray-400 mb-6">{layer.description}</p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {layer.specs.map((spec) => (
                      <div
                        key={spec.name}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                      >
                        <div
                          className="text-2xl font-bold mb-1"
                          style={{ color: layer.color }}
                        >
                          {spec.value}
                        </div>
                        <div className="text-xs text-gray-500">{spec.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Technologies */}
                  <div className="md:hidden flex flex-wrap gap-2 mt-4">
                    {layer.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expand Indicator */}
        <div className="absolute bottom-4 right-4">
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${layer.color}20` }}
            >
              <span style={{ color: layer.color }} className="text-xl">
                +
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Connector Line */}
      {index < layers.length - 1 && (
        <div className="flex justify-center py-2">
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5 + index * 0.15 }}
          />
        </div>
      )}
    </motion.div>
  );
};

// Main Component
const TechStackLayers = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  const toggleLayer = (layerId: string) => {
    setExpandedLayer(expandedLayer === layerId ? null : layerId);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background */}
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

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
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
            <Layers className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#10B981] text-sm font-mono">
              The Technology Stack
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            엔터프라이즈급 기술 스택
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            각 레이어를 클릭하여 상세 스펙을 확인하세요
          </p>
        </motion.div>

        {/* Layer Stack */}
        <div className="max-w-4xl mx-auto space-y-0">
          {layers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              index={index}
              isExpanded={expandedLayer === layer.id}
              onToggle={() => toggleLayer(layer.id)}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-500 text-sm">
            모든 레이어는 On-Premise 환경에서 완전히 독립적으로 운영됩니다
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackLayers;
