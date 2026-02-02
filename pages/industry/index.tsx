import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Dumbbell, Factory, Store, ArrowRight, Shield } from "lucide-react";
import {
  industryConfigs,
  type IndustryType,
  type IndustryConfig,
} from "@/config/industryConfig";

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Dumbbell,
  Factory,
  Store,
};

const IndustryCard = ({
  config,
  index,
}: {
  config: IndustryConfig;
  index: number;
}) => {
  const Icon = iconMap[config.icon] || Scale;
  const { theme } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/industry/${config.type}`}>
        <motion.div
          className="group relative h-full rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          whileHover={{
            borderColor: `${theme.primary}60`,
            y: -8,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Hover Glow */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${theme.glowColor} 0%, transparent 70%)`,
            }}
          />

          {/* Top Accent */}
          <div className="h-1" style={{ background: theme.gradient }} />

          <div className="relative p-8">
            {/* Icon */}
            <motion.div
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
              style={{
                backgroundColor: `${theme.primary}20`,
                border: `1px solid ${theme.primary}40`,
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Icon className="w-8 h-8" style={{ color: theme.secondary }} />
            </motion.div>

            {/* Name */}
            <h3 className="text-2xl font-bold text-white mb-2">
              {config.nameKo}
            </h3>
            <p className="text-gray-500 text-sm font-mono mb-4">
              {config.name} Industry
            </p>

            {/* Description */}
            <p className="text-gray-400 mb-6 line-clamp-2">
              {config.description}
            </p>

            {/* Use Cases Preview */}
            <div className="flex flex-wrap gap-2 mb-6">
              {config.useCases.slice(0, 3).map((useCase) => (
                <span
                  key={useCase}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: `${theme.primary}15`,
                    color: theme.secondary,
                    border: `1px solid ${theme.primary}30`,
                  }}
                >
                  {useCase}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
              <span>자세히 보기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const IndustryIndexPage = () => {
  const industries = Object.values(industryConfigs);

  return (
    <>
      <Head>
        <title>업종별 AI 솔루션 | Vision AI - Enterprise RAG Infrastructure</title>
        <meta
          name="description"
          content="법률, 피트니스, 제조, 프랜차이즈 등 다양한 업종에 특화된 Enterprise RAG 솔루션을 만나보세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-[#020617] min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981] text-sm font-mono">
                  Industry Solutions
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                업종별 맞춤형
                <br />
                <span className="text-[#10B981]">AI 솔루션</span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                각 업종의 특성을 깊이 이해하고 최적화된
                <br className="hidden md:block" />
                Enterprise RAG 솔루션을 제공합니다
              </p>
            </motion.div>

            {/* Industry Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((config, index) => (
                <IndustryCard key={config.type} config={config} index={index} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p className="text-gray-500 mb-6">
                찾으시는 업종이 없으신가요? 맞춤 상담을 통해 해결해드립니다.
              </p>
              <Link href="/consultation/start">
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6200] text-white font-semibold rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  맞춤 상담 신청
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default IndustryIndexPage;
