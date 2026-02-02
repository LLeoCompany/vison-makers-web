"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Lock,
  Server,
  FileCheck,
  Globe,
  CheckCircle,
  Building2,
} from "lucide-react";

interface Badge {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
}

const badges: Badge[] = [
  {
    icon: Shield,
    title: "ISO 27001",
    subtitle: "Information Security",
    description: "국제 정보보안 관리체계 인증",
  },
  {
    icon: Globe,
    title: "GDPR",
    subtitle: "Data Privacy",
    description: "EU 개인정보보호 규정 준수",
  },
  {
    icon: Lock,
    title: "SOC 2 Type II",
    subtitle: "Security Controls",
    description: "보안 통제 감사 인증",
  },
  {
    icon: Server,
    title: "On-Premise",
    subtitle: "Deployment Ready",
    description: "완전한 폐쇄망 구축 지원",
  },
  {
    icon: FileCheck,
    title: "ISMS-P",
    subtitle: "Korean Standard",
    description: "국내 정보보호 관리체계",
  },
  {
    icon: Building2,
    title: "Air-Gapped",
    subtitle: "Network Isolation",
    description: "물리적 네트워크 분리",
  },
];

const SecurityBadges = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-[#020617] overflow-hidden"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(30, 58, 138, 0.05) 50%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Enterprise Security & Compliance
          </h3>
          <p className="text-gray-500 text-sm">
            글로벌 보안 표준을 준수하는 엔터프라이즈급 보안 인프라
          </p>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative p-6 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-[#1E3A8A]/50 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#1E3A8A]/30 transition-colors">
                  <badge.icon className="w-6 h-6 text-[#10B981]" />
                </div>

                {/* Text */}
                <div className="text-center">
                  <h4 className="text-white font-bold text-sm mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-gray-500 text-xs">{badge.subtitle}</p>
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-[#0A192F] border border-[#1E3A8A]/30 rounded-lg px-3 py-2 whitespace-nowrap">
                    <p className="text-gray-300 text-xs">{badge.description}</p>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1E3A8A]/30" />
                </div>

                {/* Check Mark */}
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-4 h-4 text-[#10B981]/50" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner */}
        <motion.div
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#1E3A8A]/20 via-[#10B981]/10 to-[#1E3A8A]/20 border border-[#1E3A8A]/30"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">
                  100% On-Premise Deployment Available
                </h4>
                <p className="text-gray-400 text-sm">
                  고객사 데이터센터에 완전한 폐쇄망 구축이 가능합니다. 외부로
                  데이터가 유출될 가능성이 전혀 없습니다.
                </p>
              </div>
            </div>
            <motion.button
              className="px-6 py-3 bg-[#10B981] text-white font-semibold rounded-lg whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              보안 백서 다운로드
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityBadges;
