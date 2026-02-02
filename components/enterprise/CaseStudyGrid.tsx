"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Building2,
  ShoppingCart,
  Factory,
  Briefcase,
} from "lucide-react";

interface CaseStudy {
  id: string;
  industry: string;
  industryIcon: React.ElementType;
  company: string;
  companyType: string;
  problem: string;
  solution: string;
  outcome: {
    metric: string;
    value: string;
    description: string;
  }[];
  color: string;
  featured?: boolean;
}

const caseStudies: CaseStudy[] = [
  {
    id: "reptile-ecommerce",
    industry: "E-commerce",
    industryIcon: ShoppingCart,
    company: "Specialized Domain RAG",
    companyType: "파충류 전문 이커머스",
    problem:
      "수천 종의 파충류 사육 정보에 대한 고객 문의가 폭주. CS팀 업무 과부하와 오답변으로 인한 클레임 발생.",
    solution:
      "파충류 사육 매뉴얼, 상품 정보, FAQ를 통합한 도메인 특화 RAG 시스템 구축. 이미지 기반 종 판별 기능 추가.",
    outcome: [
      { metric: "CS 처리 시간", value: "-78%", description: "자동 응답 처리" },
      { metric: "응답 정확도", value: "96.5%", description: "전문가 수준" },
      { metric: "고객 만족도", value: "+34%", description: "NPS 상승" },
    ],
    color: "#10B981",
    featured: true,
  },
  {
    id: "legal-firm",
    industry: "Professional Services",
    industryIcon: Briefcase,
    company: "Contract Intelligence",
    companyType: "중견 법무법인",
    problem:
      "수십 년간 축적된 계약서와 판례 데이터가 체계화되지 않아 검색에 평균 2시간 소요.",
    solution:
      "계약서 조항 자동 분석 및 유사 판례 추천 시스템 구축. 권한 기반 접근 제어로 기밀 문서 보호.",
    outcome: [
      { metric: "검색 시간", value: "3초", description: "기존 2시간→3초" },
      { metric: "계약 검토", value: "-65%", description: "시간 단축" },
      { metric: "리스크 탐지", value: "99.1%", description: "정확도" },
    ],
    color: "#1E3A8A",
  },
  {
    id: "manufacturing",
    industry: "Manufacturing",
    industryIcon: Factory,
    company: "Equipment Intelligence",
    companyType: "중견 제조기업",
    problem:
      "설비 고장 시 매뉴얼 검색에 30분 이상 소요. 숙련공 퇴직으로 기술 전수 단절 우려.",
    solution:
      "20년치 설비 매뉴얼, 정비 이력, 노하우 문서를 통합. 알람 코드 기반 즉시 대응 가이드 제공.",
    outcome: [
      { metric: "고장 대응", value: "-70%", description: "시간 단축" },
      { metric: "신입 교육", value: "-40%", description: "기간 단축" },
      { metric: "불량률", value: "-23%", description: "품질 향상" },
    ],
    color: "#6366F1",
  },
];

// Case Study Card Component
const CaseStudyCard = ({
  study,
  index,
  isInView,
}: {
  study: CaseStudy;
  index: number;
  isInView: boolean;
}) => {
  const Icon = study.industryIcon;

  return (
    <motion.div
      className={`relative ${study.featured ? "md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="group relative h-full rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-white/[0.15] transition-all duration-300">
        {/* Top Accent */}
        <div
          className="h-1"
          style={{ backgroundColor: study.color }}
        />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${study.color}20`,
                  border: `1px solid ${study.color}40`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: study.color }} />
              </div>
              <div>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${study.color}20`,
                    color: study.color,
                  }}
                >
                  {study.industry}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {study.company}
                </h3>
                <p className="text-gray-500 text-sm">{study.companyType}</p>
              </div>
            </div>

            {study.featured && (
              <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Content Grid */}
          <div className={`grid ${study.featured ? "md:grid-cols-3" : "grid-cols-1"} gap-6`}>
            {/* Problem */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Target className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                  Problem
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {study.problem}
              </p>
            </div>

            {/* Solution */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  Solution
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {study.solution}
              </p>
            </div>

            {/* Outcomes */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  Outcome
                </span>
              </div>
              <div className="space-y-3">
                {study.outcome.map((item) => (
                  <div
                    key={item.metric}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-500 text-sm">{item.metric}</span>
                    <div className="text-right">
                      <span
                        className="text-lg font-bold"
                        style={{ color: study.color }}
                      >
                        {item.value}
                      </span>
                      <span className="text-gray-600 text-xs ml-1">
                        {item.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>구축 기간: 2주</span>
            </div>
            <motion.button
              className="flex items-center gap-2 text-sm font-medium group-hover:text-white transition-colors"
              style={{ color: study.color }}
              whileHover={{ x: 5 }}
            >
              상세 보기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const CaseStudyGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#10B981] text-sm font-mono">
              Success Stories
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            실제 도입 사례
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            다양한 산업군에서 검증된 Enterprise RAG 솔루션의 성과
          </p>
        </motion.div>

        {/* Case Study Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            모든 사례 보기
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyGrid;
