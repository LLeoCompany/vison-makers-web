"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, Star } from "lucide-react";

const cases = [
  {
    industry: "법률",
    company: "A 법무법인",
    result: "계약 검토 85% 단축",
    detail: "수천 건의 판례와 계약서를 3초 만에 분석. 법무팀 업무 효율 40% 향상.",
    metric: "85%",
    metricLabel: "업무 시간 절감",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "border-blue-200 bg-blue-50/30",
    iconBg: "bg-blue-100 text-blue-700",
    tag: "Type B",
  },
  {
    industry: "제조",
    company: "B 제조기업",
    result: "설비 문제 해결 70% 단축",
    detail: "30년치 기술 문서를 AI가 즉시 검색. 신입 교육 기간 35% 단축, 불량률 23% 감소.",
    metric: "70%",
    metricLabel: "대응 시간 단축",
    icon: <Clock className="w-5 h-5" />,
    color: "border-indigo-200 bg-indigo-50/30",
    iconBg: "bg-indigo-100 text-indigo-700",
    tag: "Type A",
  },
  {
    industry: "프랜차이즈",
    company: "C 프랜차이즈",
    result: "본사 문의 50% 자동화",
    detail: "전국 가맹점 운영 매뉴얼 통합. 24/7 AI 응대로 가맹점 이탈률 15% 감소.",
    metric: "50%",
    metricLabel: "문의 자동화율",
    icon: <Users className="w-5 h-5" />,
    color: "border-sky-200 bg-sky-50/30",
    iconBg: "bg-sky-100 text-sky-700",
    tag: "Type C",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

export default function CaseStudySection() {
  return (
    <section id="cases" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
            <Star className="w-3.5 h-3.5" />
            도입 사례
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            실제 기업이 경험한 <span className="text-blue-700">변화</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            다양한 산업에서 Vision AI가 만들어낸 실질적인 성과를 확인하세요.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {cases.map((c, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`relative rounded-2xl border p-7 ${c.color} hover:shadow-lg transition-all duration-300 group`}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {c.industry}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.iconBg}`}
                >
                  {c.tag}
                </span>
              </div>

              {/* Metric */}
              <div className="flex items-end gap-2 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}
                >
                  {c.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{c.metric}</div>
                  <div className="text-xs text-gray-400">{c.metricLabel}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">{c.company}</div>
                <h4 className="font-bold text-gray-900">{c.result}</h4>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">{c.detail}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-blue-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-white text-center sm:text-left">
            <div className="text-xl font-bold mb-1">귀사에도 같은 변화가 가능합니다</div>
            <div className="text-blue-200 text-sm">지금 무료 진단을 통해 ROI를 미리 확인하세요.</div>
          </div>
          <button
            onClick={() =>
              document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex-shrink-0 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            무료 상담 시작 →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
