import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Shield,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  getSolutionConfig,
  getAllSolutionFields,
  type SolutionConfig,
  type SolutionField,
} from "@/config/solutionsConfig";
import ConsultationSidebar from "@/components/home/ConsultationSidebar";

interface SolutionPageProps {
  config: SolutionConfig;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
} as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

export default function SolutionPage({ config }: SolutionPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`${config.nameKo} AI 솔루션 | Vision AI`}</title>
        <meta name="description" content={config.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${config.nameKo} AI 솔루션 | Vision AI`} />
        <meta property="og:description" content={config.description} />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={config.primaryHex} />
      </Head>

      <ConsultationSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-white">
        {/* ── Sticky Top Bar ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                홈으로
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-400">분야별 AI</span>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-semibold text-gray-900">{config.nameKo}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {config.ctaText}
            </button>
          </div>
        </header>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 py-20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-white/80 mb-5">
                {config.tagline}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 whitespace-pre-line leading-tight">
                {config.headline}
              </h1>
              <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-2xl">
                {config.subheadline}
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                {config.ctaText}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── KPI Grid ───────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              {config.kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-blue-700 mb-1">
                    {kpi.value}
                    {kpi.suffix && (
                      <span className="text-2xl">{kpi.suffix}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{kpi.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* ── Pain Points ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {config.nameKo} 업계의 페인 포인트
                </h2>
              </div>
              <div className="space-y-4">
                {config.painPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-red-50/50 border border-red-100 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-500">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Use Cases ────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Vision AI 적용 사례</h2>
              </div>
              <div className="space-y-3">
                {config.useCases.map((useCase, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{useCase}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── AI Demo ────────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">실제 AI 응답 미리보기</h2>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  DEMO
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm max-w-3xl">
                {/* Chat header */}
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Vision AI – {config.nameKo} 전문 Agent</span>
                </div>

                <div className="p-6 space-y-4">
                  {/* User query */}
                  <div className="flex justify-end">
                    <div className="max-w-sm bg-blue-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                      {config.demo.query}
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-xs">AI</span>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {config.demo.response}
                      </pre>
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="pl-11 space-y-1">
                    <p className="text-xs text-gray-400 font-semibold">출처 (Sources)</p>
                    {config.demo.sources.map((src, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-blue-600">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        {src}
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                      <Shield className="w-3 h-3" />
                      신뢰도: {(config.demo.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA Bottom ─────────────────────────────────────────────── */}
        <section className="py-20 bg-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {config.nameKo} 업계의 AI 혁신,
                <br />
                지금 바로 시작하세요
              </h2>
              <p className="text-blue-200 mb-8 text-sm sm:text-base">
                전문 컨설턴트가 귀사 상황에 맞는 맞춤형 솔루션을 제안해드립니다.
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
              >
                {config.ctaText}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Simple Footer ──────────────────────────────────────────── */}
        <footer className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="font-bold text-white">
                Vision<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">© 2024 Vision-Makers. All rights reserved.</p>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        html,
        body {
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
            system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const CUSTOM_PAGES = ["legal", "marketing", "advertising", "food"];
  const fields = getAllSolutionFields().filter((f) => !CUSTOM_PAGES.includes(f));
  return {
    paths: fields.map((field) => ({ params: { field } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SolutionPageProps> = async ({ params }) => {
  const field = params?.field as string;
  const config = getSolutionConfig(field);
  if (!config) return { notFound: true };
  return { props: { config } };
};
