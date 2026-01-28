"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Stethoscope,
  Factory,
  Rocket,
  Megaphone,
  Building,
  Store,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type IndustryItem = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  useCase: string;
  color: string;
};

const industries: IndustryItem[] = [
  {
    id: "legal",
    name: "법률",
    icon: Scale,
    description: "판례 검색 및 법률 문서 자동 분석",
    useCase: "계약서 리스크 자동 검토",
    color: "#00D1FF",
  },
  {
    id: "medical",
    name: "의료",
    icon: Stethoscope,
    description: "의료 기록 기반 진단 보조 AI",
    useCase: "환자 상담 자동화",
    color: "#48BB78",
  },
  {
    id: "manufacturing",
    name: "제조",
    icon: Factory,
    description: "설비 매뉴얼 검색 및 품질 관리",
    useCase: "불량 원인 자동 분석",
    color: "#F59E0B",
  },
  {
    id: "startup",
    name: "스타트업",
    icon: Rocket,
    description: "내부 지식 베이스 구축 및 온보딩",
    useCase: "빠른 신규 입사자 적응",
    color: "#EF4444",
  },
  {
    id: "advertising",
    name: "광고/마케팅",
    icon: Megaphone,
    description: "캠페인 데이터 분석 및 인사이트",
    useCase: "성과 리포트 자동 생성",
    color: "#A855F7",
  },
  {
    id: "public",
    name: "공공기관",
    icon: Building,
    description: "민원 자동 응대 및 문서 처리",
    useCase: "규정 기반 정확한 안내",
    color: "#60A5FA",
  },
  {
    id: "franchise",
    name: "프랜차이즈",
    icon: Store,
    description: "가맹점 매뉴얼 검색 및 CS 자동화",
    useCase: "본사 문의 90% 자동 처리",
    color: "#EC4899",
  },
  {
    id: "education",
    name: "교육",
    icon: GraduationCap,
    description: "학습 콘텐츠 기반 개인화 튜터링",
    useCase: "24시간 학습 도우미",
    color: "#14B8A6",
  },
];

const IndustryCard = ({
  industry,
  index,
}: {
  industry: IndustryItem;
  index: number;
}) => {
  const Icon = industry.icon;

  return (
    <motion.div
      className="group relative bg-gradient-to-b from-[#1a1a2e]/80 to-[#0f0f1a]/80 rounded-2xl p-6 border border-[#00D1FF]/10 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${industry.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Border Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${industry.color}50`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${industry.color}15` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-6 h-6" style={{ color: industry.color }} />
        </motion.div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00D1FF] transition-colors">
          {industry.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-3">{industry.description}</p>

        {/* Use Case Tag */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: industry.color }}
          />
          {industry.useCase}
        </div>

        {/* Arrow on Hover */}
        <motion.div
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <ArrowRight className="w-5 h-5" style={{ color: industry.color }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const IndustrySolutions = () => {
  return (
    <section id="solutions" className="relative py-24 px-4 bg-[#0a0a0f]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#00D1FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#60A5FA]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block text-[#00D1FF] text-sm font-medium mb-4 tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            INDUSTRY SOLUTIONS
          </motion.span>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            업종별{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]">
              맞춤 솔루션
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            각 산업의 특성을 깊이 이해한 도메인 전문가가
            <br className="hidden md:block" />
            귀사에 최적화된 Private RAG를 구축합니다.
          </p>
        </motion.div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((industry, idx) => (
            <IndustryCard key={industry.id} industry={industry} index={idx} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/consultation/start">
            <motion.button
              className="inline-flex items-center gap-2 text-[#00D1FF] font-medium hover:underline"
              whileHover={{ x: 5 }}
            >
              우리 업종 맞춤 데모 신청하기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustrySolutions;
