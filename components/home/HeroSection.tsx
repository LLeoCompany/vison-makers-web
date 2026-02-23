"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileSearch, Shield, Zap } from "lucide-react";

const DataNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 3 + 2,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(30, 64, 175, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(30, 64, 175, 0.35)";
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

const stats = [
  { icon: <Zap className="w-4 h-4" />, value: "3초", label: "평균 응답 속도" },
  { icon: <Shield className="w-4 h-4" />, value: "99.9%", label: "정보 보안 준수율" },
  { icon: <FileSearch className="w-4 h-4" />, value: "85%", label: "업무 효율 향상" },
];

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-16">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/80" />

      {/* Data network canvas */}
      <div className="absolute inset-0 opacity-70">
        <DataNetwork />
      </div>

      {/* Blue accent circle top-right */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Enterprise RAG 솔루션
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4"
          >
            귀사의 데이터를
            <br />
            <span className="text-blue-700">강력한 지능</span>으로.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 mb-3 font-medium"
          >
            보안 기반 도메인 특화 RAG 솔루션
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base text-gray-400 mb-10 max-w-xl leading-relaxed"
          >
            흩어진 사내 문서와 전문 지식을 AI가 즉시 검색·분석합니다.
            데이터 주권을 지키면서, Fortune 500 수준의 지식 인프라를 구축하세요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 mb-16"
          >
            <button
              onClick={() => scrollTo("consultation")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              무료 도입 진단 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("security")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-blue-200 text-blue-700 font-semibold rounded-xl hover:border-blue-700 hover:bg-blue-50 transition-all"
            >
              기술 스펙 보기
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-6"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  {s.icon}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent rounded-full animate-pulse" />
      </motion.div>
    </section>
  );
}
