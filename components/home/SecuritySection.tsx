"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Server,
  FileCheck,
  CheckCircle2,
  Award,
} from "lucide-react";

const layers = [
  {
    step: "Layer 1",
    icon: <Lock className="w-5 h-5" />,
    title: "데이터 암호화",
    description: "AES-256 암호화로 저장 및 전송 데이터 완벽 보호",
    color: "bg-blue-700",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    step: "Layer 2",
    icon: <Eye className="w-5 h-5" />,
    title: "접근 권한 제어",
    description: "역할 기반 접근 제어(RBAC)로 민감 정보 열람 차단",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    step: "Layer 3",
    icon: <Server className="w-5 h-5" />,
    title: "온프레미스 격리",
    description: "외부 인터넷 차단 폐쇄망 구성, 데이터 외부 유출 Zero",
    color: "bg-indigo-700",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    step: "Layer 4",
    icon: <FileCheck className="w-5 h-5" />,
    title: "감사 로그 관리",
    description: "모든 접근·질의 기록 완전 보존, 컴플라이언스 대비",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    step: "Layer 5",
    icon: <Shield className="w-5 h-5" />,
    title: "AI 출력 필터링",
    description: "Hallucination 방지 및 개인정보 마스킹 자동 적용",
    color: "bg-sky-700",
    lightColor: "bg-sky-50",
    textColor: "text-sky-700",
  },
];

const certifications = [
  { icon: <Award className="w-5 h-5" />, label: "ISO 27001", sub: "정보보안 인증" },
  { icon: <Shield className="w-5 h-5" />, label: "On-Premise", sub: "자체 서버 구축" },
  { icon: <Lock className="w-5 h-5" />, label: "AES-256", sub: "군사급 암호화" },
  { icon: <CheckCircle2 className="w-5 h-5" />, label: "GDPR Ready", sub: "개인정보 규제 준수" },
  { icon: <Server className="w-5 h-5" />, label: "Zero-Trust", sub: "무신뢰 보안 아키텍처" },
  { icon: <Eye className="w-5 h-5" />, label: "SOC 2", sub: "서비스 보안 감사" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

export default function SecuritySection() {
  return (
    <section id="security" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            <Shield className="w-3.5 h-3.5" />
            Trust &amp; Security
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            기업 데이터를 지키는{" "}
            <span className="text-blue-700">5-Layer 보안 체계</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            단순 비밀번호 보호가 아닙니다. 군사급 보안 아키텍처로
            <br />
            귀사의 핵심 지식 자산을 철저히 보호합니다.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Layer Stack Visualization */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-3"
          >
            {layers.map((layer, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-300"
              >
                {/* Step number + icon */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 ${layer.color} text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    {layer.icon}
                  </div>
                  <span className={`text-[10px] font-bold ${layer.textColor}`}>
                    {layer.step}
                  </span>
                </div>

                <div className="flex-1 pt-0.5">
                  <h4 className="font-semibold text-gray-900 mb-1">{layer.title}</h4>
                  <p className="text-sm text-gray-500">{layer.description}</p>
                </div>

                <CheckCircle2 className={`w-5 h-5 ${layer.textColor} opacity-60 flex-shrink-0 mt-0.5`} />
              </motion.div>
            ))}

            {/* Security bar visualization */}
            <motion.div
              variants={itemVariants}
              className="mt-4 p-4 bg-slate-50 rounded-2xl"
            >
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>보안 수준</span>
                <span className="font-semibold text-blue-700">Enterprise Grade</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "97%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-700 to-sky-400 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Certifications Grid (SecurityBadge component) */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50 rounded-2xl p-8 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">보안 인증 및 준수 기준</h3>
              <p className="text-sm text-gray-500 mb-6">
                국제 표준 및 국내 법률을 모두 충족하는 보안 체계를 갖추고 있습니다.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                      {cert.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{cert.label}</div>
                      <div className="text-xs text-gray-400">{cert.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-blue-700 text-white rounded-2xl p-7"
            >
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-blue-200 text-sm mb-4">데이터 유출 0건 (2022~현재)</div>
              <p className="text-blue-100 text-sm leading-relaxed">
                On-Premise 환경부터 폐쇄망 구성까지, 귀사의 핵심 데이터가
                외부로 한 바이트도 나가지 않도록 설계합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
