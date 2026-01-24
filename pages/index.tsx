"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Database,
  Brain,
  MessageSquare,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Target,
  ChevronRight,
  Search,
  FileText,
  Bot,
  Sparkles,
  BarChart3,
  Send,
  Lock,
  Server,
  Eye,
  KeyRound,
  ShieldCheck,
  Building2,
  Stethoscope,
  Factory,
  Headphones,
  X,
  ExternalLink,
  Cpu,
  Layers,
  GitBranch,
  ChevronLeft,
  Award,
  BadgeCheck,
  Settings,
  Rocket,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

// Tech Stack Data
const techLogos = [
  { name: "LangChain", icon: "🔗" },
  { name: "OpenAI", icon: "🤖" },
  { name: "AWS", icon: "☁️" },
  { name: "Next.js", icon: "▲" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Redis", icon: "🔴" },
  { name: "Docker", icon: "🐳" },
  { name: "Kubernetes", icon: "☸️" },
];

// Service Data for Drawer (v13.0 Enhanced)
const serviceData = {
  rag: {
    id: "rag",
    title: "RAG 시스템 구축",
    subtitle: "사내 데이터를 AI 자산으로",
    badge: "보안 99.9%",
    badgeColor: "#48BB78",
    icon: Database,
    // Big Metrics (v13.0)
    bigMetrics: [
      { value: 92, suffix: "%", label: "답변 정확도", color: "#48BB78" },
      { value: 99.9, suffix: "%", label: "데이터 보안", color: "#00BFFF" },
      { value: 8, suffix: "주", label: "구축 기간", color: "#E94560" },
      { value: 100000, suffix: "+", label: "검증 유저", color: "#48BB78" },
    ],
    caseStudy: {
      title: "DevGym 지식 베이스 구축 사례",
      metric: "92%",
      metricLabel: "답변 정확도",
      description: "10만+ 회원의 운동/영양 데이터를 벡터화하여 실시간 AI 상담 시스템 구축",
      screenshots: [
        { title: "관리자 대시보드", desc: "실시간 질의 모니터링 및 정확도 분석" },
        { title: "벡터 DB 구조", desc: "도메인 최적화된 임베딩 파이프라인" },
        { title: "API 연동 화면", desc: "기존 시스템과 원활한 통합" },
      ],
    },
    steps: [
      { icon: FileText, title: "데이터 수집", desc: "PDF, DB, API 등 다양한 소스 통합" },
      { icon: Cpu, title: "엔진 커스텀", desc: "귀사 도메인에 최적화된 임베딩" },
      { icon: Zap, title: "실전 배포", desc: "8주 내 프로덕션 환경 배포" },
    ],
    techSpecs: [
      { key: "Engine", value: "Hybrid RAG (BM25 + Dense)" },
      { key: "Accuracy", value: "92% on domain queries" },
      { key: "Latency", value: "<1.2s P95" },
      { key: "Security", value: "AES-256, TLS 1.3, SOC2" },
    ],
    ctaText: "사내 데이터 AI 자산화 진단받기",
    formPlaceholder: "어떤 데이터를 AI로 활용하고 싶으신가요?",
  },
  chatbot: {
    id: "chatbot",
    title: "AI 챗봇 개발",
    subtitle: "CS 비용 절감의 시작",
    badge: "자동화 78%",
    badgeColor: "#00BFFF",
    icon: MessageSquare,
    // Big Metrics (v13.0)
    bigMetrics: [
      { value: 50, suffix: "%", label: "CS 비용 절감", color: "#48BB78" },
      { value: 78, suffix: "%", label: "자동화율", color: "#00BFFF" },
      { value: 1.2, suffix: "s", label: "평균 응답", color: "#E94560" },
      { value: 24, suffix: "/7", label: "무중단 서비스", color: "#48BB78" },
    ],
    caseStudy: {
      title: "DevGym CS 자동화 사례",
      metric: "50%",
      metricLabel: "CS 비용 절감",
      description: "반복 문의의 78%를 AI가 즉시 응대, 상담원은 복잡한 케이스에 집중",
      screenshots: [
        { title: "챗봇 대화 UI", desc: "자연스러운 대화 흐름과 빠른 응답" },
        { title: "CS 분석 대시보드", desc: "문의 유형별 자동화율 모니터링" },
        { title: "상담원 핸드오프", desc: "복잡한 케이스의 원활한 인계" },
      ],
    },
    steps: [
      { icon: MessageSquare, title: "대화 설계", desc: "귀사 CS 패턴 분석 및 시나리오 구축" },
      { icon: Brain, title: "AI 학습", desc: "FAQ/매뉴얼 기반 지식 베이스 구축" },
      { icon: Users, title: "운영 배포", desc: "1.2초 응답, 24/7 무중단 서비스" },
    ],
    techSpecs: [
      { key: "Response", value: "1.2s average latency" },
      { key: "Automation", value: "78% of inquiries" },
      { key: "Handoff", value: "Seamless agent transfer" },
      { key: "Integration", value: "Slack, Teams, Web SDK" },
    ],
    ctaText: "인건비 절감 시뮬레이션 신청",
    formPlaceholder: "현재 월 CS 문의량은 얼마나 되시나요?",
  },
  recommend: {
    id: "recommend",
    title: "AI 추천 시스템",
    subtitle: "매출 성장의 엔진",
    badge: "ROI 3배",
    badgeColor: "#E94560",
    icon: TrendingUp,
    // Big Metrics (v13.0)
    bigMetrics: [
      { value: 300, suffix: "%", label: "ROI 증가", color: "#E94560" },
      { value: 42, suffix: "%", label: "이탈률 감소", color: "#48BB78" },
      { value: 3, suffix: "x", label: "재구매율", color: "#00BFFF" },
      { value: 35, suffix: "%", label: "매출 상승", color: "#E94560" },
    ],
    caseStudy: {
      title: "DevGym 개인화 추천 사례",
      metric: "42%",
      metricLabel: "이탈률 감소",
      description: "유저 행동 데이터 기반 개인화 추천으로 재구매율 3배, 이탈률 42% 감소",
      screenshots: [
        { title: "개인화 추천 피드", desc: "유저별 맞춤 콘텐츠 큐레이션" },
        { title: "A/B 테스트 대시보드", desc: "실시간 성과 비교 및 최적화" },
        { title: "전환율 분석", desc: "추천 경로별 구매 전환 추적" },
      ],
    },
    steps: [
      { icon: BarChart3, title: "데이터 분석", desc: "유저 행동/구매 패턴 심층 분석" },
      { icon: Target, title: "알고리즘 설계", desc: "협업 필터링 + 콘텐츠 기반 하이브리드" },
      { icon: TrendingUp, title: "A/B 테스트", desc: "지속적 최적화로 ROI 극대화" },
    ],
    techSpecs: [
      { key: "Algorithm", value: "Hybrid CF + Content-based" },
      { key: "Real-time", value: "Sub-100ms inference" },
      { key: "Scale", value: "10M+ items supported" },
      { key: "A/B Test", value: "Automated optimization" },
    ],
    ctaText: "매출 향상 엔진 설계 문의",
    formPlaceholder: "현재 어떤 방식으로 추천을 제공하고 계신가요?",
  },
};

type ServiceKey = keyof typeof serviceData;

// Big Metric CountUp Component for Drawer (v13.0)
const DrawerCountUp = ({
  end,
  suffix = "",
  color,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  color: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const startTime = Date.now();
      const overshoot = 1.12;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let springValue;
        if (progress < 0.7) {
          const p = progress / 0.7;
          springValue = p * p * overshoot;
        } else if (progress < 0.85) {
          const p = (progress - 0.7) / 0.15;
          springValue = overshoot - (overshoot - 0.98) * p;
        } else {
          const p = (progress - 0.85) / 0.15;
          springValue = 0.98 + 0.02 * p;
        }

        const current = springValue * end;
        if (progress >= 1) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="font-mono" style={{ color }}>
      {displayValue}{suffix}
    </span>
  );
};

// Circular Gauge Component (v14.0)
const CircleGauge = ({
  value,
  maxValue = 100,
  color,
  size = 120,
  strokeWidth = 10,
  label,
  suffix = "%",
}: {
  value: number;
  maxValue?: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  suffix?: string;
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedValue = Math.min(value, maxValue);
  const progress = (animatedValue / maxValue) * circumference;

  useEffect(() => {
    if (isInView) {
      const duration = 1800;
      const startTime = Date.now();
      const overshoot = 1.08;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);

        let springValue;
        if (p < 0.75) {
          springValue = (p / 0.75) * (p / 0.75) * overshoot;
        } else {
          const decay = (p - 0.75) / 0.25;
          springValue = overshoot - (overshoot - 1) * decay;
        }

        setAnimatedValue(springValue * normalizedValue);

        if (p >= 1) {
          setAnimatedValue(normalizedValue);
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, normalizedValue]);

  return (
    <div ref={ref} className="circle-gauge">
      <svg width={size} height={size} className="gauge-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        />
      </svg>
      <div className="gauge-content">
        <span className="gauge-value font-mono" style={{ color }}>
          {Math.floor(animatedValue)}{suffix}
        </span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
};

// v17.5 Funnel Modal - 4-Step Slide Storytelling
const FunnelModal = ({
  isOpen,
  onClose,
  serviceKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceKey: ServiceKey | null;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ company: "", contact: "", field: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const service = serviceKey ? serviceData[serviceKey] : null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStep(1);
      setSubmitted(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (!service) return null;

  const stepLabels = ["성과 확인", "실전 사례", "프로세스", "상담 신청"];

  // Step 1: Impact Metrics - Before/After Comparison
  const Step1Impact = () => (
    <motion.div
      className="funnel-step-content"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="step-header">
        <span className="step-badge font-mono" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
          STEP 1: IMPACT
        </span>
        <h2 className="step-title">수익을 만드는 엔진</h2>
        <p className="step-subtitle">압도적인 성과, 숫자로 증명합니다</p>
      </div>

      <div className="impact-metrics-grid">
        {/* Before/After Comparison Bars */}
        <div className="comparison-section">
          <div className="comparison-item">
            <div className="comparison-label">
              <span className="label-text">운영 비용</span>
              <span className="comparison-badge font-mono" style={{ color: "#48BB78" }}>65% 절감</span>
            </div>
            <div className="comparison-bars">
              <div className="bar-row">
                <span className="bar-label font-mono">BEFORE</span>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill before"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                </div>
                <span className="bar-value font-mono">100%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label font-mono">AFTER</span>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill after"
                    style={{ background: `linear-gradient(90deg, ${service.badgeColor}, ${service.badgeColor}88)` }}
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
                <span className="bar-value font-mono" style={{ color: service.badgeColor }}>35%</span>
              </div>
            </div>
          </div>

          <div className="comparison-item">
            <div className="comparison-label">
              <span className="label-text">인건비 효율화</span>
              <span className="comparison-badge font-mono" style={{ color: "#00BFFF" }}>9.3배 향상</span>
            </div>
            <div className="comparison-bars">
              <div className="bar-row">
                <span className="bar-label font-mono">BEFORE</span>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill before"
                    initial={{ width: 0 }}
                    animate={{ width: "11%" }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  />
                </div>
                <span className="bar-value font-mono">1x</span>
              </div>
              <div className="bar-row">
                <span className="bar-label font-mono">AFTER</span>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill after"
                    style={{ background: `linear-gradient(90deg, #00BFFF, #00BFFF88)` }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </div>
                <span className="bar-value font-mono" style={{ color: "#00BFFF" }}>9.3x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Gauges */}
        <div className="gauges-row">
          {service.bigMetrics.slice(0, 3).map((metric, i) => (
            <motion.div
              key={i}
              className="gauge-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <CircleGauge
                value={metric.value}
                maxValue={metric.value > 100 ? metric.value * 1.2 : 100}
                color={metric.color}
                size={isMobile ? 80 : 100}
                strokeWidth={isMobile ? 6 : 8}
                label={metric.label}
                suffix={metric.suffix}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Visual Proof - DevGym Screenshot
  const Step2Proof = () => (
    <motion.div
      className="funnel-step-content"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="step-header">
        <span className="step-badge font-mono" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
          STEP 2: PROOF
        </span>
        <h2 className="step-title">10만 유저가 검증한 실제 구동 화면</h2>
        <p className="step-subtitle">DevGym SaaS에서 실시간 운영 중인 RAG 챗봇</p>
      </div>

      <div className="proof-visual">
        <div className="chatbot-mockup">
          <div className="mockup-header">
            <div className="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="mockup-title font-mono">DevGym AI Assistant</span>
            <div className="live-badge">
              <span className="live-dot"></span>
              <span className="font-mono">LIVE</span>
            </div>
          </div>
          <div className="chat-content">
            <motion.div
              className="chat-message user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span>벤치프레스 자세 교정에 대해 알려주세요</span>
            </motion.div>
            <motion.div
              className="chat-message bot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bot-header">
                <Bot size={16} />
                <span className="font-mono">AI Assistant</span>
                <span className="response-time font-mono">0.8s</span>
              </div>
              <p>벤치프레스 자세 교정을 위해 다음 3가지를 확인해주세요:</p>
              <ul>
                <li>견갑골 후인 및 하강 유지</li>
                <li>손목 중립 포지션</li>
                <li>발바닥 지면 접촉 안정화</li>
              </ul>
              <div className="source-tag font-mono">
                <FileText size={12} />
                출처: 피트니스 가이드 v3.2
              </div>
            </motion.div>
            <motion.div
              className="chat-message user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span>관련 영상 추천해줘</span>
            </motion.div>
            <motion.div
              className="chat-typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span></span><span></span><span></span>
            </motion.div>
          </div>
        </div>

        <div className="proof-stats">
          <motion.div
            className="proof-stat-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="stat-icon" style={{ background: `${service.badgeColor}20` }}>
              <Users size={20} style={{ color: service.badgeColor }} />
            </span>
            <div className="stat-info">
              <span className="stat-value font-mono">100,000+</span>
              <span className="stat-label">월간 활성 유저</span>
            </div>
          </motion.div>
          <motion.div
            className="proof-stat-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="stat-icon" style={{ background: "rgba(72, 187, 120, 0.2)" }}>
              <MessageSquare size={20} style={{ color: "#48BB78" }} />
            </span>
            <div className="stat-info">
              <span className="stat-value font-mono">2.5M+</span>
              <span className="stat-label">누적 대화 건수</span>
            </div>
          </motion.div>
          <motion.div
            className="proof-stat-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="stat-icon" style={{ background: "rgba(233, 69, 96, 0.2)" }}>
              <Zap size={20} style={{ color: "#E94560" }} />
            </span>
            <div className="stat-info">
              <span className="stat-value font-mono">0.9s</span>
              <span className="stat-label">평균 응답 시간</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  // Step 3: Process Map
  const Step3Process = () => (
    <motion.div
      className="funnel-step-content"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="step-header">
        <span className="step-badge font-mono" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
          STEP 3: PROCESS
        </span>
        <h2 className="step-title">검증된 경험, 안전한 이식</h2>
        <p className="step-subtitle">3단계 프로세스로 빠르고 안전하게 구축합니다</p>
      </div>

      <div className="process-map">
        <motion.div
          className="process-step"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="process-icon" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
            <Search size={28} strokeWidth={1.5} />
          </div>
          <div className="process-number font-mono">01</div>
          <h3>데이터 분석</h3>
          <p>귀사의 데이터 구조와 도메인 특성을 심층 분석하여 최적의 RAG 설계안을 도출합니다</p>
          <ul className="process-checklist">
            <li><CheckCircle size={14} /> 데이터 품질 진단</li>
            <li><CheckCircle size={14} /> 도메인 용어 추출</li>
            <li><CheckCircle size={14} /> 임베딩 전략 수립</li>
          </ul>
        </motion.div>

        <div className="process-arrow">
          <ArrowRight size={24} strokeWidth={1.5} />
        </div>

        <motion.div
          className="process-step"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="process-icon" style={{ background: "rgba(0, 191, 255, 0.2)", color: "#00BFFF" }}>
            <Settings size={28} strokeWidth={1.5} />
          </div>
          <div className="process-number font-mono">02</div>
          <h3>맞춤 엔진 튜닝</h3>
          <p>DevGym에서 검증된 엔진을 귀사 요구사항에 맞게 파인튜닝합니다</p>
          <ul className="process-checklist">
            <li><CheckCircle size={14} /> 하이브리드 RAG 적용</li>
            <li><CheckCircle size={14} /> 도메인 최적화</li>
            <li><CheckCircle size={14} /> 성능 벤치마크</li>
          </ul>
        </motion.div>

        <div className="process-arrow">
          <ArrowRight size={24} strokeWidth={1.5} />
        </div>

        <motion.div
          className="process-step"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="process-icon" style={{ background: "rgba(72, 187, 120, 0.2)", color: "#48BB78" }}>
            <Rocket size={28} strokeWidth={1.5} />
          </div>
          <div className="process-number font-mono">03</div>
          <h3>즉시 이식 & 배포</h3>
          <p>8주 내 프로덕션 환경에 안전하게 배포하고 모니터링을 시작합니다</p>
          <ul className="process-checklist">
            <li><CheckCircle size={14} /> 보안 격리 환경</li>
            <li><CheckCircle size={14} /> 24/7 모니터링</li>
            <li><CheckCircle size={14} /> 지속 최적화</li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        className="security-assurance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Shield size={20} strokeWidth={1.5} />
        <span>모든 데이터는 격리된 보안 환경에서 처리됩니다</span>
        <div className="security-badges">
          <span className="security-badge font-mono">AES-256</span>
          <span className="security-badge font-mono">TLS 1.3</span>
          <span className="security-badge font-mono">SOC 2</span>
        </div>
      </motion.div>
    </motion.div>
  );

  // Step 4: Contact Form
  const Step4Contact = () => (
    <motion.div
      className="funnel-step-content"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="step-header">
        <span className="step-badge font-mono" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
          STEP 4: ACTION
        </span>
        <h2 className="step-title">예상 수익 리포트 무료 신청</h2>
        <p className="step-subtitle">24시간 내 전문가가 맞춤 분석 리포트를 전달합니다</p>
      </div>

      {submitted ? (
        <motion.div
          className="submit-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="success-icon">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          <h3>신청이 완료되었습니다!</h3>
          <p>24시간 내 전문가가 연락드리겠습니다.</p>
          <button className="success-close-btn" onClick={onClose}>
            닫기
          </button>
        </motion.div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Building2 size={16} />
              기업명
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="회사명을 입력해주세요"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Users size={16} />
              연락처 (이메일 또는 전화번호)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="example@company.com"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Target size={16} />
              관심 분야
            </label>
            <select
              className="form-select"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              required
            >
              <option value="">선택해주세요</option>
              <option value="rag">RAG 시스템 구축</option>
              <option value="chatbot">AI 챗봇 개발</option>
              <option value="recommend">AI 추천 시스템</option>
              <option value="consulting">AI 도입 컨설팅</option>
              <option value="other">기타</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="submit-cta-btn"
            style={{ background: `linear-gradient(135deg, ${service.badgeColor}, ${service.badgeColor}cc)` }}
            whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${service.badgeColor}60` }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-dots">
                <span></span><span></span><span></span>
              </span>
            ) : (
              <>
                <span>무료 ROI 리포트 신청하기</span>
                <Send size={18} strokeWidth={2} />
              </>
            )}
          </motion.button>

          <p className="form-note font-mono">
            <Lock size={12} />
            제출된 정보는 상담 목적으로만 사용됩니다
          </p>
        </form>
      )}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with deep blur */}
          <motion.div
            className="funnel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="funnel-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`funnel-modal ${isMobile ? "mobile-fullscreen" : ""}`}
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Close Button */}
              <button onClick={onClose} className="funnel-close">
                <X size={20} strokeWidth={2} />
              </button>

              {/* Step Indicator */}
              <div className="step-indicator">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    className={`step-dot ${currentStep === step ? "active" : ""} ${currentStep > step ? "completed" : ""}`}
                    onClick={() => goToStep(step)}
                  >
                    <span className="step-num font-mono">{step}</span>
                    <span className="step-label">{stepLabels[step - 1]}</span>
                  </button>
                ))}
                <div className="step-progress">
                  <motion.div
                    className="step-progress-fill"
                    style={{ background: service.badgeColor }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="funnel-content">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && <Step1Impact key="step1" />}
                  {currentStep === 2 && <Step2Proof key="step2" />}
                  {currentStep === 3 && <Step3Process key="step3" />}
                  {currentStep === 4 && <Step4Contact key="step4" />}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="funnel-nav">
                <button
                  className="nav-btn prev"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft size={18} />
                  <span>이전</span>
                </button>
                <div className="nav-dots">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`nav-dot ${currentStep === step ? "active" : ""}`}
                      style={currentStep === step ? { background: service.badgeColor } : {}}
                    />
                  ))}
                </div>
                {currentStep < 4 ? (
                  <button className="nav-btn next" onClick={nextStep}>
                    <span>다음</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button className="nav-btn next skip" onClick={onClose}>
                    <span>닫기</span>
                    <X size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Legacy ServicePopup reference - now using FunnelModal
const ServicePopup = FunnelModal;

// Drawer Component for Technical Details (Legacy - kept for compatibility)
const TechDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="tech-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="drawer-header">
            <h3>Technical Specifications</h3>
            <button onClick={onClose} className="drawer-close">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <div className="drawer-content">
            <div className="spec-group">
              <div className="spec-icon">
                <Cpu size={24} strokeWidth={1.5} />
              </div>
              <h4>하이브리드 RAG 엔진</h4>
              <p>Keyword + Semantic 검색을 결합하여 전문 용어 인식률 95% 달성</p>
              <ul>
                <li>BM25 + Dense Retrieval 앙상블</li>
                <li>Custom Embedding 모델 적용</li>
                <li>Multi-vector 인덱싱</li>
              </ul>
            </div>
            <div className="spec-group">
              <div className="spec-icon">
                <Layers size={24} strokeWidth={1.5} />
              </div>
              <h4>자체 최적화 파이프라인</h4>
              <p>Llama-3 기반 파인튜닝으로 지연시간 80% 감소</p>
              <ul>
                <li>vLLM 추론 엔진</li>
                <li>KV-Cache 최적화</li>
                <li>배치 처리 자동화</li>
              </ul>
            </div>
            <div className="spec-group">
              <div className="spec-icon">
                <GitBranch size={24} strokeWidth={1.5} />
              </div>
              <h4>실전 검증 알고리즘</h4>
              <p>1.2억 건 로그 데이터 기반 지속적 개선</p>
              <ul>
                <li>A/B 테스트 자동화</li>
                <li>피드백 루프 반영</li>
                <li>Drift Detection 모니터링</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Tech Logo Cloud Component
const TechLogoCloud = () => (
  <div className="tech-cloud">
    <div className="tech-cloud-label font-mono">POWERED BY</div>
    <div className="tech-logos">
      {techLogos.map((tech, i) => (
        <motion.div
          key={tech.name}
          className="tech-logo-item"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <span className="tech-icon">{tech.icon}</span>
          <span className="tech-name">{tech.name}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// Industry Demo Data
const industryDemos = {
  contract: {
    icon: Building2,
    label: "계약서",
    color: "#00BFFF",
    query: "갑과 을의 계약 해지 조건은?",
    response:
      "계약서 제12조에 따르면, 갑은 30일 전 서면 통보로 해지 가능하며, 을은 미납 시 즉시 해지권이 있습니다. 단, 제15조의 손해배상 조항이 적용됩니다.",
    sources: [
      { title: "용역계약서_2024.pdf", page: "p.12" },
      { title: "계약해지조항_법률검토.docx", page: "Section 3" },
    ],
  },
  log: {
    icon: Server,
    label: "로그",
    color: "#48BB78",
    query: "지난 주 서버 다운타임 원인은?",
    response:
      "분석 결과, 11월 15일 03:24 메모리 누수로 인한 OOM Kill이 원인입니다. Node.js 힙 메모리가 8GB 한도 초과 후 프로세스가 강제 종료되었습니다.",
    sources: [
      { title: "server_error_log_1115.json", page: "Line 2847" },
      { title: "kubernetes_events.yaml", page: "Pod restart" },
    ],
  },
  emr: {
    icon: Stethoscope,
    label: "EMR",
    color: "#E94560",
    query: "환자 김OO의 최근 혈압 추이는?",
    response:
      "최근 30일 평균 혈압은 138/88mmHg로 경계성 고혈압 단계입니다. 11월 10일 복약 변경 후 5mmHg 감소 추세를 보이고 있습니다.",
    sources: [
      { title: "환자차트_김OO.pdf", page: "혈압 기록" },
      { title: "투약이력_2024.xlsx", page: "11월 처방" },
    ],
  },
  support: {
    icon: Headphones,
    label: "상담기록",
    color: "#00BFFF",
    query: "고객 불만 패턴 TOP 3는?",
    response:
      "최근 90일 분석 결과: 1) 배송 지연 (32%) 2) 상품 품질 (24%) 3) 교환/환불 절차 (18%). 배송 지연은 특정 물류센터에 집중되어 있습니다.",
    sources: [
      { title: "CS_티켓분석_Q4.pdf", page: "p.8" },
      { title: "VOC_Dashboard.xlsx", page: "Summary" },
    ],
  },
};

type IndustryKey = keyof typeof industryDemos;

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="skeleton-container">
    <div className="skeleton-line skeleton-short"></div>
    <div className="skeleton-line skeleton-long"></div>
    <div className="skeleton-line skeleton-medium"></div>
    <div className="skeleton-line skeleton-long"></div>
  </div>
);

// Typing Demo Component with Industry Selection
const IndustryDemo = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>("contract");
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [showSource, setShowSource] = useState(false);
  const [phase, setPhase] = useState<"query" | "response" | "sources">("query");

  const demo = industryDemos[selectedIndustry];

  const handleIndustryChange = (industry: IndustryKey) => {
    if (industry === selectedIndustry) return;
    setIsLoading(true);
    setDisplayText("");
    setShowSource(false);
    setPhase("query");

    setTimeout(() => {
      setSelectedIndustry(industry);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (isLoading) return;

    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (phase === "query") {
      let i = 0;
      interval = setInterval(() => {
        if (i <= demo.query.length) {
          setDisplayText(demo.query.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          timeout = setTimeout(() => setPhase("response"), 500);
        }
      }, 50);
    } else if (phase === "response") {
      setDisplayText("");
      let i = 0;
      interval = setInterval(() => {
        if (i <= demo.response.length) {
          setDisplayText(demo.response.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          timeout = setTimeout(() => setPhase("sources"), 300);
        }
      }, 15);
    } else if (phase === "sources") {
      setShowSource(true);
      timeout = setTimeout(() => {
        setShowSource(false);
        setDisplayText("");
        setPhase("query");
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [phase, isLoading, demo]);

  return (
    <div className="demo-window">
      {/* Industry Tabs */}
      <div className="demo-tabs">
        {(Object.keys(industryDemos) as IndustryKey[]).map((key) => {
          const Icon = industryDemos[key].icon;
          return (
            <button
              key={key}
              onClick={() => handleIndustryChange(key)}
              className={`demo-tab ${selectedIndustry === key ? "active" : ""}`}
              style={{
                "--tab-color": industryDemos[key].color,
              } as React.CSSProperties}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span>{industryDemos[key].label}</span>
            </button>
          );
        })}
      </div>

      {/* Mac Window Frame */}
      <div className="demo-header">
        <div className="demo-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="demo-title font-mono text-xs">RAG Engine v2.0</span>
      </div>

      <div className="demo-content">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader />
            </motion.div>
          ) : (
            <motion.div
              key={selectedIndustry}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {phase === "query" && (
                <div className="demo-query">
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={14} strokeWidth={1.5} className="text-cyan" />
                    <span className="text-xs text-gray-400">Query</span>
                  </div>
                  <p className="font-mono text-sm text-white">
                    {displayText}
                    <span className="cursor">|</span>
                  </p>
                </div>
              )}

              {(phase === "response" || phase === "sources") && (
                <div className="demo-response">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} strokeWidth={1.5} style={{ color: demo.color }} />
                    <span className="text-xs text-gray-400">AI Response</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {displayText}
                    {phase === "response" && <span className="cursor">|</span>}
                  </p>
                </div>
              )}

              {showSource && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="demo-sources"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} strokeWidth={1.5} className="text-green" />
                    <span className="text-xs text-gray-400">Source Trace</span>
                  </div>
                  {demo.sources.map((source, i) => (
                    <div key={i} className="source-item">
                      <span className="font-mono text-xs" style={{ color: demo.color }}>
                        [{i + 1}]
                      </span>
                      <span className="text-gray-300 text-xs">{source.title}</span>
                      <span className="text-gray-500 text-xs">{source.page}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// CountUp Animation with Spring Effect
const CountUp = ({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const startTime = Date.now();
      const overshoot = 1.15; // 15% overshoot for spring effect

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Spring animation: overshoot then settle
        let springValue;
        if (progress < 0.7) {
          // Phase 1: Accelerate to overshoot (0 to 70% of time)
          const p = progress / 0.7;
          springValue = p * p * overshoot;
        } else if (progress < 0.85) {
          // Phase 2: Bounce back (70% to 85% of time)
          const p = (progress - 0.7) / 0.15;
          springValue = overshoot - (overshoot - 0.97) * p;
        } else {
          // Phase 3: Settle to target (85% to 100% of time)
          const p = (progress - 0.85) / 0.15;
          springValue = 0.97 + 0.03 * p;
        }

        const current = springValue * end;

        if (progress >= 1) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

// Comparison Bar Component
const ComparisonBar = ({
  label,
  oldValue,
  oldLabel,
  newValue,
  newLabel,
  unit,
  reverse = false,
}: {
  label: string;
  oldValue: number;
  oldLabel: string;
  newValue: number;
  newLabel: string;
  unit: string;
  reverse?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const maxValue = Math.max(oldValue, newValue);
  const oldPercent = (oldValue / maxValue) * 100;
  const newPercent = (newValue / maxValue) * 100;

  return (
    <div ref={ref} className="comparison-bar-container">
      <div className="comparison-label">{label}</div>
      <div className="comparison-bars">
        {/* Old Way */}
        <div className="bar-row">
          <span className="bar-label old">기존 방식</span>
          <div className="bar-wrapper">
            <motion.div
              className="bar old-bar"
              initial={{ width: 0 }}
              animate={isInView ? { width: `${oldPercent}%` } : { width: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <span className="bar-value old font-mono">{oldLabel}</span>
        </div>
        {/* Vision-Makers */}
        <div className="bar-row">
          <span className="bar-label new">Vision-Makers</span>
          <div className="bar-wrapper">
            <motion.div
              className={`bar new-bar ${reverse ? "reverse" : ""}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${newPercent}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <span className="bar-value new font-mono">{newLabel}</span>
        </div>
      </div>
    </div>
  );
};

// Comparison Section Component
const ComparisonSection = () => (
  <div className="comparison-section">
    <div className="comparison-header">
      <span className="comparison-badge font-mono">VS COMPARISON</span>
      <h3>왜 Vision-Makers인가?</h3>
    </div>
    <div className="comparison-grid">
      <ComparisonBar
        label="응답 속도"
        oldValue={120}
        oldLabel="120분"
        newValue={0.02}
        newLabel="1.2초"
        unit="분"
      />
      <ComparisonBar
        label="운영 비용"
        oldValue={100}
        oldLabel="100%"
        newValue={35}
        newLabel="35%"
        unit="%"
        reverse
      />
    </div>
    <div className="comparison-summary">
      <div className="summary-item">
        <span className="summary-value font-mono text-cyan">6,000x</span>
        <span className="summary-label">더 빠른 응답</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-value font-mono text-green">65%</span>
        <span className="summary-label">비용 절감</span>
      </div>
    </div>
  </div>
);

// Bento Item with Achievement Tag
const BentoProofItem = ({
  icon: Icon,
  metric,
  metricSuffix,
  metricPrefix,
  label,
  desc,
  hoverText,
  className,
  decimals,
  achievementTag,
}: {
  icon: React.ElementType;
  metric: number;
  metricSuffix?: string;
  metricPrefix?: string;
  label: string;
  desc?: string;
  hoverText?: string;
  className?: string;
  decimals?: number;
  achievementTag?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...fadeInUp}
      className={`bento-item ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {achievementTag && (
        <div className="achievement-tag">
          <CheckCircle size={12} strokeWidth={2} />
          <span className="font-mono">{achievementTag}</span>
        </div>
      )}
      <div className="bento-content">
        <Icon size={className?.includes("large") ? 32 : 24} strokeWidth={1.5} className="text-cyan" />
        <div className="bento-metric">
          <CountUp end={metric} suffix={metricSuffix} prefix={metricPrefix} decimals={decimals} />
        </div>
        <span className="bento-label">{label}</span>
        {desc && (
          <p className="bento-desc">
            <AnimatePresence mode="wait">
              {isHovered && hoverText ? (
                <motion.span
                  key="hover"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-cyan"
                >
                  {hoverText}
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {desc}
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Security Card Component
const SecurityCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) => (
  <motion.div {...fadeInUp} className="security-card">
    <div className="security-icon" style={{ background: `${color}15`, color }}>
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h4 className="security-title">{title}</h4>
    <p className="security-desc">{description}</p>
  </motion.div>
);

// Solution Card Component
const SolutionCard = ({
  icon: Icon,
  title,
  description,
  highlight,
  stats,
  isCenter,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
  stats: string;
  isCenter?: boolean;
}) => (
  <motion.div
    {...fadeInUp}
    className={`solution-card ${isCenter ? "solution-card-highlight" : ""}`}
  >
    <div className="solution-icon">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 className="solution-title">{title}</h3>
    <p className="solution-description">{description}</p>
    {highlight && (
      <span className="solution-highlight">
        {highlight}
        <span className="highlight-bounce"></span>
      </span>
    )}
    <div className="solution-stats font-mono">{stats}</div>
  </motion.div>
);

// Flow Step Component
const FlowStep = ({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div {...fadeInUp} className="flow-step">
    <div className="flow-number font-mono">{String(number).padStart(2, "0")}</div>
    <div className="flow-icon">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h4 className="flow-title">{title}</h4>
    <p className="flow-description">{description}</p>
  </motion.div>
);

// Form with Progress Bar
const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    services: [] as string[],
    industry: "",
  });

  const requiredFields = ["name", "email", "phone", "industry"];
  const filledFields = requiredFields.filter(
    (field) => formData[field as keyof typeof formData] !== ""
  ).length;
  const hasServices = formData.services.length > 0;
  const totalSteps = requiredFields.length + 1;
  const completedSteps = filledFields + (hasServices ? 1 : 0);
  const progress = (completedSteps / totalSteps) * 100;
  const isComplete = completedSteps === totalSteps;

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="cta-form-wrapper">
      {/* Progress Bar */}
      <div className="form-progress">
        <div className="progress-header">
          <span className="progress-text font-mono">
            {completedSteps}/{totalSteps} 단계 완료
          </span>
          <span className="progress-percent font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form className="cta-form">
        <div className="form-group">
          <label>담당자명 *</label>
          <input
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>이메일 *</label>
          <input
            type="email"
            placeholder="example@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>연락처 *</label>
          <input
            type="tel"
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>관심 서비스</label>
          <div className="checkbox-group">
            {["RAG 시스템 구축", "AI 챗봇", "추천 시스템"].map((service) => (
              <label
                key={service}
                className={`checkbox-item ${
                  formData.services.includes(service) ? "checked" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>산업군 *</label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          >
            <option value="">선택해주세요</option>
            <option value="finance">금융</option>
            <option value="healthcare">의료/헬스케어</option>
            <option value="manufacturing">제조</option>
            <option value="retail">유통/커머스</option>
            <option value="other">기타</option>
          </select>
        </div>

        <button
          type="submit"
          className={`submit-btn ${isComplete ? "complete" : ""}`}
          disabled={!isComplete}
        >
          무료 상담 신청
          <Send size={18} strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
};

// Mobile Sticky CTA (v12.0 Glassmorphism)
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="sticky-cta"
        >
          <Link href="#contact" className="sticky-cta-btn">
            ROI 3배 무료 진단 신청
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function RAGLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceKey | null>(null);
  const [mobileServiceTab, setMobileServiceTab] = useState<ServiceKey>("rag");

  const openServicePopup = (service: ServiceKey) => {
    setActiveService(service);
  };

  const closeServicePopup = () => {
    setActiveService(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="rag-landing">
        {/* Noise Texture Overlay */}
        <div className="noise-overlay" />

      {/* Particle Background */}
      <div className="particles-bg">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Service Drawer */}
      <ServicePopup
        isOpen={activeService !== null}
        onClose={closeServicePopup}
        serviceKey={activeService}
      />

      {/* Tech Drawer */}
      <TechDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header */}
      <header className={`rag-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="rag-nav">
            <Link href="/" className="rag-logo">
              <Sparkles size={24} strokeWidth={1.5} className="text-cyan" />
              <span>Vision-Makers</span>
            </Link>

            <div className="nav-links">
              <a href="#solutions">서비스</a>
              <a href="#architecture">기술</a>
              <a href="#identity">회사소개</a>
            </div>

            <button onClick={() => openServicePopup("rag")} className="nav-cta">
              무료 AI 진단
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </nav>
        </div>
      </header>

      {/* NEW HERO: 검증된 RAG 기술 섹션을 최상단 메인 배너로 */}
      <section id="solutions" className="hero-funnel-section">
        <div className="container">
          {/* Grid Pattern Background */}
          <div className="grid-pattern" />

          {/* Main Hero Message */}
          <motion.div {...fadeInUp} className="hero-funnel-message">
            <div className="hero-funnel-badges">
              <div className="hero-badge-item cyan">
                <span className="font-mono">보안 99.9%</span>
              </div>
              <div className="hero-badge-item green">
                <span className="font-mono">정확도 92%</span>
              </div>
              <div className="hero-badge-item crimson">
                <span className="font-mono">ROI 300%↑</span>
              </div>
            </div>

            <h1 className="hero-funnel-title">
              검증된 <span className="text-cyan">RAG 기술</span>을{" "}
              <span className="text-glow">귀사</span>에 맞게{" "}
              <span className="text-glow">구축</span>합니다
            </h1>

            <p className="hero-funnel-subtitle">
              10만 회원이 검증한 엔진을 8주 내 귀사 비즈니스에 이식합니다.
              <br />
              카드를 클릭하여 맞춤형 솔루션을 확인하세요.
            </p>
          </motion.div>

          {/* 3-Action Cards (Bento Grid) - v14.0 with floating guide */}
          <div className="hero-cards-grid desktop-only">
            {(["rag", "chatbot", "recommend"] as ServiceKey[]).map((key, index) => {
              const service = serviceData[key];
              const Icon = service.icon;
              return (
                <motion.button
                  key={key}
                  className={`hero-service-card ${key === "chatbot" ? "hero-card-highlight" : ""}`}
                  onClick={() => openServicePopup(key)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  {key === "chatbot" && (
                    <div className="most-popular-badge">
                      <span className="font-mono">Most Popular</span>
                    </div>
                  )}
                  <div className="hero-card-badge" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
                    <span className="font-mono">{service.badge}</span>
                  </div>
                  <div className="hero-card-icon" style={{ background: `${service.badgeColor}15`, color: service.badgeColor }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="hero-card-title">{service.title}</h3>
                  <p className="hero-card-subtitle">{service.subtitle}</p>
                  <div className="hero-card-metrics font-mono">
                    {key === "rag" && "데이터 보안 99.9% / 정확도 92%"}
                    {key === "chatbot" && "인건비 50%↓ / 1.2s 응답"}
                    {key === "recommend" && "ROI 300%↑ / 유저 유지율 강화"}
                  </div>
                  {/* v17.5 Floating CTA Guide */}
                  <div className="card-guide-text floating-cta">
                    <span className="guide-pulse"></span>
                    <span>무료 성과 리포트 보기</span>
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile: Vertical Stack */}
          <div className="hero-cards-stack mobile-only">
            {(["rag", "chatbot", "recommend"] as ServiceKey[]).map((key, index) => {
              const service = serviceData[key];
              const Icon = service.icon;
              return (
                <motion.button
                  key={key}
                  className={`hero-service-card-mobile ${key === "chatbot" ? "hero-card-highlight" : ""}`}
                  onClick={() => openServicePopup(key)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {key === "chatbot" && (
                    <div className="most-popular-badge">
                      <span className="font-mono">Most Popular</span>
                    </div>
                  )}
                  <div className="mobile-card-left">
                    <div className="hero-card-icon" style={{ background: `${service.badgeColor}15`, color: service.badgeColor }}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="mobile-card-content">
                    <div className="hero-card-badge" style={{ background: `${service.badgeColor}20`, color: service.badgeColor }}>
                      <span className="font-mono">{service.badge}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.subtitle}</p>
                  </div>
                  <ArrowRight size={20} strokeWidth={1.5} className="mobile-card-arrow" />
                </motion.button>
              );
            })}
          </div>

          {/* Stats Row */}
          <motion.div {...fadeInUp} className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-value font-mono">
                <CountUp end={92} suffix="%" />
              </span>
              <span className="stat-label">답변 정확도</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value font-mono">
                <CountUp end={1.2} suffix="s" decimals={1} />
              </span>
              <span className="stat-label">평균 응답시간</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value font-mono">
                <CountUp end={78} suffix="%" />
              </span>
              <span className="stat-label">업무 자동화율</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value font-mono">
                <CountUp end={100000} suffix="+" />
              </span>
              <span className="stat-label">검증 유저</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* v16.5: The Engine - Vision RAG Pipeline */}
      <section id="architecture" className="pipeline-section-v16">
        <div className="pipeline-glow-bg" />
        <div className="data-flow-lines" />
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <div className="engine-badge font-mono">
              <Cpu size={14} strokeWidth={2} />
              <span>THE ENGINE</span>
            </div>
            <h2 className="section-title">
              Vision <span className="text-cyan">RAG</span> Pipeline
            </h2>
            <p className="section-subtitle">
              수집 → 검색 → 생성, 데이터가 지능으로 변환되는 과정
            </p>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            className="pipeline-security-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Shield size={16} strokeWidth={2} />
            <span>데이터 보안 격리 구축</span>
            <span className="badge-verified font-mono">VERIFIED</span>
          </motion.div>

          {/* Desktop Pipeline (Horizontal) */}
          <div className="pipeline-flow desktop-only">
            {/* Step 1: Data Ingestion */}
            <motion.div
              className="pipeline-step"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
            >
              <div className="step-number font-mono">01</div>
              <div className="step-icon-box">
                <FileText size={28} strokeWidth={1.5} />
              </div>
              <h4>Data Ingestion</h4>
              <div className="step-tags font-mono">
                <span>PDF</span>
                <span>DB</span>
                <span>API</span>
              </div>
            </motion.div>

            <div className="pipeline-arrow">
              <motion.div
                className="arrow-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <ChevronRight size={20} strokeWidth={2} />
            </div>

            {/* Step 2: Embedding */}
            <motion.div
              className="pipeline-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            >
              <div className="step-number font-mono">02</div>
              <div className="step-icon-box">
                <Cpu size={28} strokeWidth={1.5} />
              </div>
              <h4>Embedding</h4>
              <div className="step-tags font-mono">
                <span>Vector</span>
                <span>Chunk</span>
              </div>
            </motion.div>

            <div className="pipeline-arrow">
              <motion.div
                className="arrow-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
              <ChevronRight size={20} strokeWidth={2} />
            </div>

            {/* Step 3: Vector DB */}
            <motion.div
              className="pipeline-step step-highlight"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            >
              <div className="step-number font-mono">03</div>
              <div className="step-icon-box">
                <Database size={28} strokeWidth={1.5} />
              </div>
              <h4>Vector DB</h4>
              <div className="step-tags font-mono">
                <span>Pinecone</span>
                <span>Qdrant</span>
              </div>
            </motion.div>

            <div className="pipeline-arrow">
              <motion.div
                className="arrow-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
              <ChevronRight size={20} strokeWidth={2} />
            </div>

            {/* Step 4: Retrieval */}
            <motion.div
              className="pipeline-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
            >
              <div className="step-number font-mono">04</div>
              <div className="step-icon-box">
                <Search size={28} strokeWidth={1.5} />
              </div>
              <h4>Retrieval</h4>
              <div className="step-tags font-mono">
                <span>Semantic</span>
                <span>Hybrid</span>
              </div>
            </motion.div>

            <div className="pipeline-arrow">
              <motion.div
                className="arrow-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <ChevronRight size={20} strokeWidth={2} />
            </div>

            {/* Step 5: LLM Response */}
            <motion.div
              className="pipeline-step"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
            >
              <div className="step-number font-mono">05</div>
              <div className="step-icon-box">
                <Bot size={28} strokeWidth={1.5} />
              </div>
              <h4>LLM Response</h4>
              <div className="step-tags font-mono">
                <span>Prompt Eng.</span>
                <span>GPT-4</span>
              </div>
            </motion.div>
          </div>

          {/* Mobile Pipeline (Vertical) */}
          <div className="pipeline-flow-mobile mobile-only">
            {[
              { num: "01", icon: FileText, title: "Data Ingestion", tags: ["PDF", "DB", "API"] },
              { num: "02", icon: Cpu, title: "Embedding", tags: ["Vector", "Chunk"] },
              { num: "03", icon: Database, title: "Vector DB", tags: ["Pinecone", "Qdrant"], highlight: true },
              { num: "04", icon: Search, title: "Retrieval", tags: ["Semantic", "Hybrid"] },
              { num: "05", icon: Bot, title: "LLM Response", tags: ["Prompt Eng.", "GPT-4"] },
            ].map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={i}
                  className={`pipeline-step-mobile ${step.highlight ? "step-highlight" : ""}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  <div className="step-left">
                    <div className="step-number font-mono">{step.num}</div>
                    {i < 4 && <div className="step-line" />}
                  </div>
                  <div className="step-right">
                    <div className="step-icon-box">
                      <StepIcon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="step-info">
                      <h4>{step.title}</h4>
                      <div className="step-tags font-mono">
                        {step.tags.map((tag, j) => (
                          <span key={j}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tech Highlights */}
          <motion.div
            {...fadeInUp}
            className="pipeline-highlights"
          >
            <div className="highlight-item font-mono">
              <span className="highlight-label">Accuracy</span>
              <span className="highlight-value text-cyan">92%</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item font-mono">
              <span className="highlight-label">Latency</span>
              <span className="highlight-value text-green">&lt;1.2s</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item font-mono">
              <span className="highlight-label">Security</span>
              <span className="highlight-value text-crimson">AES-256</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="logo-cloud-section">
        <div className="container">
          <TechLogoCloud />
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="security-section">
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <span className="section-label font-mono">ENTERPRISE SECURITY</span>
            <h2 className="section-title">
              <span className="text-green">엔터프라이즈급</span>
              <br />
              보안 레이어
            </h2>
            <p className="section-subtitle">
              AI는 위험하지 않습니다. 기존 보안보다 더 안전합니다.
            </p>
          </motion.div>

          <div className="security-grid">
            <SecurityCard
              icon={Server}
              title="독립 공간"
              description="고객별 벡터 DB 완전 격리. 데이터 혼재 위험 제로."
              color="#00BFFF"
            />
            <SecurityCard
              icon={Eye}
              title="비학습 원칙"
              description="외부 LLM 학습에 귀사 데이터 사용 완전 차단."
              color="#E94560"
            />
            <SecurityCard
              icon={KeyRound}
              title="권한 제어"
              description="RBAC 기반 문서 접근 필터링. 역할별 정보 노출 제한."
              color="#48BB78"
            />
            <SecurityCard
              icon={Lock}
              title="철저 암호화"
              description="원문 데이터 AES-256 암호화 저장. 전송 시 TLS 1.3."
              color="#00BFFF"
            />
          </div>

          <motion.div {...fadeInUp} className="security-badge">
            <ShieldCheck size={20} strokeWidth={1.5} />
            <span>SOC 2 Type II 준수 | ISO 27001 인증 예정</span>
          </motion.div>
        </div>
      </section>

      {/* v17.5: Company Identity - Enhanced with Badges */}
      <section id="identity" className="identity-section-v16">
        <div className="identity-gradient-bg" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="identity-content-v16"
          >
            {/* Partner Badge */}
            <motion.div
              className="identity-partner-badge"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Award size={16} strokeWidth={1.5} />
              <span className="font-mono">ENTERPRISE AI PARTNER</span>
            </motion.div>

            {/* Strong One-Line Slogan */}
            <motion.h2
              className="identity-slogan"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <span className="slogan-main">RAG 전문 외주사</span>
              <span className="slogan-accent">Vision-Makers</span>
            </motion.h2>

            <motion.p
              className="identity-tagline"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              DevGym SaaS에서 10만 유저가 검증한 RAG 엔진을<br />
              귀사 비즈니스에 맞춤 이식합니다
            </motion.p>

            {/* Certification Badges */}
            <motion.div
              className="identity-certifications"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
            >
              <div className="cert-badge">
                <ShieldCheck size={16} strokeWidth={1.5} />
                <span className="font-mono">SOC 2 Type II</span>
              </div>
              <div className="cert-badge">
                <BadgeCheck size={16} strokeWidth={1.5} />
                <span className="font-mono">ISO 27001</span>
              </div>
              <div className="cert-badge">
                <Lock size={16} strokeWidth={1.5} />
                <span className="font-mono">AES-256</span>
              </div>
            </motion.div>

            {/* 3 Key Stats */}
            <div className="identity-stats-row">
              <motion.div
                className="identity-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <span className="stat-number font-mono" style={{ color: "#48BB78" }}>100K+</span>
                <span className="stat-text">검증 유저</span>
              </motion.div>
              <div className="stat-divider-v16"></div>
              <motion.div
                className="identity-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              >
                <span className="stat-number font-mono" style={{ color: "#00BFFF" }}>8주</span>
                <span className="stat-text">MVP 구축</span>
              </motion.div>
              <div className="stat-divider-v16"></div>
              <motion.div
                className="identity-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              >
                <span className="stat-number font-mono" style={{ color: "#E94560" }}>99.9%</span>
                <span className="stat-text">보안 격리</span>
              </motion.div>
            </div>

            {/* DevGym Reference */}
            <motion.div
              className="identity-reference"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.75 }}
            >
              <span className="ref-label">레퍼런스</span>
              <span className="ref-logo font-mono">DevGym</span>
              <span className="ref-desc">10만 유저 피트니스 SaaS 플랫폼</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              {...fadeInUp}
              className="identity-cta"
            >
              <button
                onClick={() => openServicePopup("rag")}
                className="identity-cta-button"
              >
                <span>무료 기술 진단 받기</span>
                <ArrowRight size={20} strokeWidth={2} />
              </button>
              <span className="identity-cta-note font-mono">24시간 내 전문가 회신</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rag-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Sparkles size={20} strokeWidth={1.5} className="text-cyan" />
                <span>Vision-Makers</span>
              </div>
              <p>ROI 3배, 10만 유저가 검증한 RAG 플랫폼</p>
            </div>

            <div className="footer-links">
              <a href="#solutions">서비스</a>
              <a href="#architecture">기술</a>
              <a href="#identity">회사소개</a>
            </div>

            <div className="footer-contact">
              <span>contact@vision-makers.ai</span>
              <span className="font-mono">24h 내 회신 보장</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Vision-Makers. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/privacy-policy">개인정보처리방침</Link>
              <Link href="/terms">이용약관</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <StickyCTA />

      <style jsx global>{`
        :root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #12121a;
          --bg-tertiary: #1a1a24;
          --cyan: #00bfff;
          --cyan-dim: rgba(0, 191, 255, 0.1);
          --green: #48bb78;
          --green-dim: rgba(72, 187, 120, 0.1);
          --crimson: #e94560;
          --crimson-dim: rgba(233, 69, 96, 0.1);
          --text-primary: #ffffff;
          --text-secondary: #a0a0b0;
          --text-tertiary: #606070;
          --border-color: rgba(255, 255, 255, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: "Pretendard Variable", -apple-system, BlinkMacSystemFont,
            system-ui, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .font-mono {
          font-family: "JetBrains Mono", monospace;
        }

        .text-cyan {
          color: var(--cyan);
        }

        .text-green {
          color: var(--green);
        }

        .text-crimson {
          color: var(--crimson);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Noise Overlay */
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.02;
          background: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            rgba(255,255,255,0.03) 1px,
            transparent 2px
          );
        }

        /* Particles Background */
        .particles-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--cyan);
          border-radius: 50%;
          opacity: 0.2;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        /* Drawer Overlay */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1100;
        }

        /* Service Drawer */
        .service-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 480px;
          max-width: 95vw;
          height: 100vh;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 15, 0.98) 0%,
            rgba(18, 18, 26, 0.99) 100%
          );
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--border-color);
          z-index: 1200;
          overflow-y: auto;
        }

        .drawer-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drawer-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .drawer-subtitle {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        .section-tag {
          display: inline-block;
          font-size: 0.65rem;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .case-study-section {
          margin-bottom: 32px;
        }

        .case-study-card {
          padding: 24px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .case-metric {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
        }

        .metric-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .case-study-card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .case-study-card p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .build-steps-section {
          margin-bottom: 32px;
        }

        .build-steps {
          display: flex;
          gap: 12px;
        }

        .build-step {
          flex: 1;
          padding: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          text-align: center;
        }

        .step-number {
          font-size: 0.7rem;
          color: var(--cyan);
          margin-bottom: 8px;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border-radius: 10px;
          color: var(--cyan);
          margin: 0 auto 8px;
        }

        .build-step h5 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .build-step p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        .quick-contact-section {
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .quick-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quick-form input,
        .quick-form textarea {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .quick-form input:focus,
        .quick-form textarea:focus {
          outline: none;
          border-color: var(--cyan);
        }

        .quick-form input::placeholder,
        .quick-form textarea::placeholder {
          color: var(--text-tertiary);
        }

        .quick-form textarea {
          resize: none;
        }

        .quick-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        /* Tech Drawer */
        .tech-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 90vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(18, 18, 26, 0.95) 0%,
            rgba(26, 26, 36, 0.98) 100%
          );
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--border-color);
          z-index: 1200;
          overflow-y: auto;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .drawer-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .drawer-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .drawer-close:hover {
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .drawer-content {
          padding: 24px;
        }

        .spec-group {
          padding: 24px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .spec-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border-radius: 12px;
          color: var(--cyan);
          margin-bottom: 16px;
        }

        .spec-group h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .spec-group p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .spec-group ul {
          list-style: none;
          padding: 0;
        }

        .spec-group li {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          padding: 6px 0;
          padding-left: 16px;
          position: relative;
        }

        .spec-group li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--cyan);
        }

        /* Hero Badges */
        .hero-badges {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .hero-badge-item {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .hero-badge-item.crimson {
          background: var(--crimson-dim);
          border: 1px solid var(--crimson);
          color: var(--crimson);
        }

        .hero-badge-item.green {
          background: var(--green-dim);
          border: 1px solid var(--green);
          color: var(--green);
        }

        .hero-badge-item.cyan {
          background: var(--cyan-dim);
          border: 1px solid var(--cyan);
          color: var(--cyan);
        }

        /* Tech Specs Button */
        .tech-specs-btn-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .tech-specs-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 100px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tech-specs-btn:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: var(--cyan-dim);
        }

        /* Tech Logo Cloud */
        .tech-cloud {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border-color);
        }

        .tech-cloud-label {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        /* Main Message Section */
        .main-message-section {
          padding: 80px 0;
          position: relative;
          z-index: 1;
        }

        .main-message {
          text-align: center;
        }

        .main-message h2 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 16px;
        }

        .main-message p {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .text-glow {
          color: var(--cyan);
          text-shadow:
            0 0 20px rgba(0, 191, 255, 0.5),
            0 0 40px rgba(0, 191, 255, 0.3),
            0 0 60px rgba(0, 191, 255, 0.1);
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(0, 191, 255, 0.5),
              0 0 40px rgba(0, 191, 255, 0.3),
              0 0 60px rgba(0, 191, 255, 0.1);
          }
          50% {
            text-shadow:
              0 0 30px rgba(0, 191, 255, 0.7),
              0 0 60px rgba(0, 191, 255, 0.5),
              0 0 90px rgba(0, 191, 255, 0.3);
          }
        }

        /* Service Cards */
        .service-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-8px);
          border-color: var(--cyan);
          box-shadow: 0 20px 60px rgba(0, 191, 255, 0.15);
        }

        .service-card-highlight {
          border-color: var(--cyan);
          background: linear-gradient(
            135deg,
            var(--bg-secondary) 0%,
            rgba(0, 191, 255, 0.05) 100%
          );
        }

        .service-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .service-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .service-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .service-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .service-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--cyan);
          font-weight: 500;
        }

        /* Mobile Service Tabs */
        .mobile-service-tabs {
          display: none;
        }

        .tab-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--bg-secondary);
          border-color: var(--tab-color);
          color: var(--tab-color);
        }

        .tab-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
        }

        .tab-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .tab-content > p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .tab-case {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          line-height: 1.6;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: 12px;
        }

        .tab-content .service-badge {
          position: static;
          display: inline-block;
          margin-bottom: 16px;
        }

        .tab-content .service-icon {
          margin: 0 auto 16px;
        }

        .tab-content .service-cta {
          justify-content: center;
        }

        .desktop-only {
          display: grid;
        }

        .mobile-only {
          display: none;
        }

        .tech-logos {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .tech-logo-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          filter: grayscale(100%);
          opacity: 0.6;
          transition: all 0.3s;
        }

        .tech-logo-item:hover {
          filter: grayscale(0%);
          opacity: 1;
        }

        .tech-icon {
          font-size: 1.2rem;
        }

        .tech-name {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Header */
        .rag-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all 0.3s ease;
        }

        .rag-header.scrolled {
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
        }

        .rag-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rag-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 40px;
        }

        .nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: var(--cyan);
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--crimson);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-cta:hover {
          background: #d63d55;
          transform: translateY(-2px);
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          position: relative;
          z-index: 1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--green-dim);
          border: 1px solid var(--green);
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--green);
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: var(--crimson);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #d63d55;
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(233, 69, 96, 0.3);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: transparent;
          color: var(--text-primary);
          text-decoration: none;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--cyan);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Comparison Section */
        .comparison-section {
          margin-top: 80px;
          padding: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
        }

        .comparison-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .comparison-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--crimson-dim);
          border: 1px solid var(--crimson);
          border-radius: 100px;
          color: var(--crimson);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .comparison-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .comparison-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
          margin-bottom: 40px;
        }

        .comparison-bar-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comparison-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .comparison-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 120px 1fr 80px;
          align-items: center;
          gap: 16px;
        }

        .bar-label {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .bar-label.old {
          color: var(--text-tertiary);
        }

        .bar-label.new {
          color: var(--cyan);
        }

        .bar-wrapper {
          height: 32px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .bar {
          height: 100%;
          border-radius: 8px;
          position: relative;
        }

        .old-bar {
          background: linear-gradient(90deg, #3a3a4a, #4a4a5a);
        }

        .new-bar {
          background: linear-gradient(90deg, var(--cyan), #00d4ff);
          box-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
        }

        .new-bar.reverse {
          background: linear-gradient(90deg, var(--green), #5ce096);
          box-shadow: 0 0 20px rgba(72, 187, 120, 0.3);
        }

        .bar-value {
          font-size: 0.9rem;
          font-weight: 600;
          text-align: right;
        }

        .bar-value.old {
          color: var(--text-tertiary);
        }

        .bar-value.new {
          color: var(--cyan);
        }

        .comparison-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          padding: 24px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .summary-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .summary-divider {
          width: 1px;
          height: 48px;
          background: var(--border-color);
        }

        /* Demo Window */
        .demo-window {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .demo-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 12px 0;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .demo-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: none;
          border-radius: 8px 8px 0 0;
          color: var(--text-tertiary);
          font-size: 0.8rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-tab:hover {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
        }

        .demo-tab.active {
          background: var(--bg-secondary);
          color: var(--tab-color, var(--cyan));
          border: 1px solid var(--border-color);
          border-bottom: 1px solid var(--bg-secondary);
          margin-bottom: -1px;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .demo-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red {
          background: #ff5f57;
        }
        .dot.yellow {
          background: #febc2e;
        }
        .dot.green {
          background: #28c840;
        }

        .demo-title {
          color: var(--text-tertiary);
        }

        .demo-content {
          padding: 24px;
          min-height: 280px;
        }

        .demo-query,
        .demo-response,
        .demo-sources {
          margin-bottom: 20px;
        }

        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .source-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border-radius: 6px;
          margin-top: 8px;
        }

        /* Skeleton Loading */
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-line {
          height: 14px;
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-short {
          width: 40%;
        }
        .skeleton-medium {
          width: 70%;
        }
        .skeleton-long {
          width: 100%;
        }

        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Section Styles */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-label {
          display: inline-block;
          font-size: 0.85rem;
          color: var(--cyan);
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        /* Solutions Section */
        .solutions-section {
          padding: 160px 0;
          position: relative;
          z-index: 1;
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .solution-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }

        .solution-card:hover {
          transform: scale(1.05);
          border-color: var(--crimson);
          box-shadow: 0 20px 60px rgba(233, 69, 96, 0.15);
        }

        .solution-card-highlight {
          border-color: var(--cyan);
          background: linear-gradient(
            135deg,
            var(--bg-secondary) 0%,
            rgba(0, 191, 255, 0.05) 100%
          );
          box-shadow: 0 0 60px rgba(0, 191, 255, 0.1);
        }

        .solution-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border-radius: 14px;
          color: var(--cyan);
          margin-bottom: 20px;
        }

        .solution-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .solution-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .solution-highlight {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: var(--crimson);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 16px;
          animation: highlight-bounce 2s ease-in-out infinite;
        }

        @keyframes highlight-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .solution-stats {
          font-size: 0.9rem;
          color: var(--cyan);
          font-weight: 600;
        }

        /* Proof Section */
        .proof-section {
          padding: 160px 0;
          background: var(--bg-secondary);
          position: relative;
          z-index: 1;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: 20px;
        }

        .bento-item {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .bento-item:hover {
          border-color: var(--cyan);
        }

        .bento-item:hover .achievement-tag {
          transform: translateY(0);
          opacity: 1;
        }

        /* Achievement Tag */
        .achievement-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: linear-gradient(
            135deg,
            rgba(72, 187, 120, 0.9) 0%,
            rgba(72, 187, 120, 0.7) 100%
          );
          backdrop-filter: blur(8px);
          border: 1px solid rgba(72, 187, 120, 0.5);
          border-radius: 8px;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
          transform: translateY(-4px);
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .bento-large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .bento-wide {
          grid-column: span 2;
        }

        .bento-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .bento-metric {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 12px 0 8px;
        }

        .bento-large .bento-metric {
          font-size: 3.5rem;
        }

        .bento-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .bento-desc {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          margin-top: auto;
          padding-top: 16px;
          min-height: 40px;
        }

        /* Security Section */
        .security-section {
          padding: 160px 0;
          position: relative;
          z-index: 1;
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .security-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s;
        }

        .security-card:hover {
          transform: translateY(-8px);
          border-color: var(--cyan);
        }

        .security-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          margin: 0 auto 16px;
        }

        .security-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .security-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: var(--green-dim);
          border: 1px solid var(--green);
          border-radius: 100px;
          color: var(--green);
          font-size: 0.9rem;
          max-width: max-content;
          margin: 0 auto;
        }

        /* Flow Section */
        .flow-section {
          padding: 160px 0;
          background: var(--bg-secondary);
          position: relative;
          z-index: 1;
        }

        .flow-grid {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 16px;
        }

        .flow-step {
          flex: 1;
          max-width: 200px;
          text-align: center;
          padding: 24px 16px;
        }

        .flow-number {
          font-size: 0.85rem;
          color: var(--cyan);
          margin-bottom: 16px;
        }

        .flow-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border: 1px solid var(--cyan);
          border-radius: 16px;
          color: var(--cyan);
          margin: 0 auto 16px;
        }

        .flow-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .flow-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .flow-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--border-color);
          padding-top: 60px;
        }

        /* Trust Section */
        .trust-section {
          padding: 160px 0;
          position: relative;
          z-index: 1;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }

        .trust-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          text-align: center;
        }

        .trust-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 16px 0 12px;
        }

        .trust-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .testimonial {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 48px;
        }

        .testimonial-content p {
          font-size: 1.25rem;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border-radius: 50%;
          color: var(--cyan);
          font-weight: 700;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
        }

        .author-company {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        /* CTA Section */
        .cta-section {
          padding: 160px 0;
          background: var(--bg-secondary);
          position: relative;
          z-index: 1;
        }

        .cta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 16px;
        }

        .cta-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .cta-benefits {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }

        .cta-form-wrapper {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 32px;
        }

        /* Form Progress */
        .form-progress {
          margin-bottom: 24px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .progress-percent {
          font-size: 0.85rem;
          color: var(--cyan);
        }

        .progress-bar {
          height: 6px;
          background: var(--bg-primary);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          border-radius: 3px;
        }

        .cta-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--cyan);
        }

        .form-group input::placeholder {
          color: var(--text-tertiary);
        }

        .checkbox-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .checkbox-item:hover {
          border-color: var(--cyan);
        }

        .checkbox-item.checked {
          border-color: var(--cyan);
          background: var(--cyan-dim);
        }

        .checkbox-item input {
          width: auto;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          background: var(--text-tertiary);
          color: var(--bg-primary);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: not-allowed;
          transition: all 0.3s;
          margin-top: 8px;
        }

        .submit-btn.complete {
          background: var(--green);
          cursor: pointer;
          animation: pulse-green 2s infinite;
        }

        .submit-btn.complete:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(72, 187, 120, 0.3);
        }

        @keyframes pulse-green {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(72, 187, 120, 0);
          }
        }

        /* Sticky CTA (Mobile) - Glassmorphism */
        .sticky-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 24px 28px;
          background: linear-gradient(
            to top,
            rgba(10, 10, 15, 0.95) 0%,
            rgba(10, 10, 15, 0.8) 60%,
            transparent 100%
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 999;
        }

        .sticky-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 18px;
          background: linear-gradient(
            135deg,
            rgba(233, 69, 96, 0.9) 0%,
            rgba(233, 69, 96, 0.7) 100%
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(233, 69, 96, 0.5);
          box-shadow:
            0 8px 32px rgba(233, 69, 96, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .sticky-cta-btn:active {
          transform: scale(0.98);
        }

        /* ===== v15.5 Identity Section ===== */
        .identity-section {
          padding: 120px 0;
          position: relative;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .identity-glow-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0, 191, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 80%, rgba(72, 187, 120, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(233, 69, 96, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .identity-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .identity-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--cyan-dim);
          border: 1px solid rgba(0, 191, 255, 0.3);
          border-radius: 30px;
          color: var(--cyan);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        .identity-headline {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 20px;
        }

        .identity-subtext {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.7;
        }

        .identity-strengths {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .strength-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .strength-card:hover {
          border-color: var(--cyan);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .strength-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: 16px;
          margin: 0 auto 20px;
        }

        .strength-card h4 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .strength-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .strength-metric {
          display: inline-block;
          padding: 6px 14px;
          background: var(--bg-tertiary);
          border-radius: 20px;
          color: var(--cyan);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .identity-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .identity-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          background: linear-gradient(135deg, var(--cyan) 0%, #0099cc 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 191, 255, 0.3);
        }

        .identity-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 191, 255, 0.4);
        }

        .identity-cta-note {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        /* Footer */
        .rag-footer {
          padding: 60px 0 40px;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border-color);
          position: relative;
          z-index: 1;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .footer-brand p {
          color: var(--text-tertiary);
          font-size: 0.9rem;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--cyan);
        }

        .footer-contact {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .footer-bottom p {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .footer-legal {
          display: flex;
          gap: 24px;
        }

        .footer-legal a {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-stats {
            flex-wrap: wrap;
            gap: 20px;
          }

          .stat-divider {
            display: none;
          }

          .nav-links {
            display: none;
          }

          .solutions-grid {
            grid-template-columns: 1fr;
          }

          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: block !important;
          }

          .mobile-service-tabs {
            display: block;
          }

          .main-message h2 {
            font-size: 1.75rem;
          }

          .main-message-section {
            padding: 60px 0;
          }

          .build-steps {
            flex-direction: column;
          }

          .bento-grid {
            grid-template-columns: 1fr;
          }

          .bento-large,
          .bento-wide {
            grid-column: span 1;
            grid-row: span 1;
          }

          .security-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .flow-grid {
            flex-direction: column;
            align-items: center;
          }

          .flow-connector {
            transform: rotate(90deg);
            padding: 0;
            margin: 8px 0;
          }

          .trust-grid {
            grid-template-columns: 1fr;
          }

          .cta-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .cta-title {
            font-size: 1.75rem;
          }

          .footer-content {
            flex-direction: column;
            gap: 32px;
          }

          .footer-contact {
            text-align: left;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .sticky-cta {
            display: block;
          }

          .rag-footer {
            padding-bottom: 100px;
          }

          /* Comparison Section Mobile */
          .comparison-section {
            margin-top: 48px;
            padding: 24px;
          }

          .bar-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .bar-label {
            font-size: 0.75rem;
          }

          .bar-value {
            text-align: left;
            font-size: 0.85rem;
          }

          .comparison-summary {
            flex-direction: column;
            gap: 20px;
          }

          .summary-divider {
            width: 48px;
            height: 1px;
          }

          .summary-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 375px) {
          .demo-content {
            min-height: 280px;
            height: 280px;
          }

          .demo-tabs {
            flex-wrap: wrap;
            gap: 4px;
          }

          .demo-tab {
            padding: 6px 10px;
            font-size: 0.7rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .security-grid {
            grid-template-columns: 1fr;
          }

          .checkbox-group {
            flex-direction: column;
          }

          .checkbox-item {
            width: 100%;
          }
        }

        .rag-landing {
          position: relative;
        }

        /* ===== v12.0 Hero Funnel Styles ===== */

        /* Grid Pattern Background */
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(0, 191, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .hero-funnel-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 140px 0 100px;
          position: relative;
          z-index: 1;
          background: linear-gradient(
            180deg,
            var(--bg-primary) 0%,
            rgba(10, 10, 15, 0.95) 100%
          );
        }

        .hero-funnel-message {
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-funnel-badges {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .hero-funnel-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .hero-funnel-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Hero Cards Grid (Desktop) */
        .hero-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }

        .hero-service-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          text-align: left;
          width: 100%;
          font-family: inherit;
          overflow: hidden;
        }

        .hero-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .hero-service-card:hover::before {
          background: linear-gradient(
            135deg,
            var(--cyan) 0%,
            rgba(0, 191, 255, 0.3) 100%
          );
          opacity: 1;
        }

        .hero-service-card:hover {
          border-color: var(--cyan);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(0, 191, 255, 0.15);
        }

        .hero-card-highlight {
          border-color: var(--cyan);
          background: linear-gradient(
            135deg,
            var(--bg-secondary) 0%,
            rgba(0, 191, 255, 0.08) 100%
          );
        }

        .most-popular-badge {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 16px;
          background: linear-gradient(135deg, var(--cyan) 0%, #00d4ff 100%);
          color: #0a0a0f;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 0 0 12px 12px;
          animation: badge-bounce 2s ease-in-out infinite;
        }

        @keyframes badge-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(3px); }
        }

        .hero-card-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .hero-card-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          margin-bottom: 20px;
        }

        .hero-card-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .hero-card-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .hero-card-metrics {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin-bottom: 20px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        .hero-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: var(--cyan);
          font-weight: 600;
        }

        /* Hero Stats Row */
        .hero-stats-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 48px;
          padding: 32px 48px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        /* Mobile Cards Stack */
        .hero-cards-stack {
          display: none;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .hero-service-card-mobile {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .hero-service-card-mobile:hover {
          border-color: var(--cyan);
        }

        .hero-service-card-mobile .most-popular-badge {
          top: -1px;
          left: 20px;
          transform: none;
          border-radius: 0 0 8px 8px;
          padding: 4px 10px;
          font-size: 0.65rem;
        }

        .mobile-card-left {
          flex-shrink: 0;
        }

        .mobile-card-left .hero-card-icon {
          width: 56px;
          height: 56px;
          margin-bottom: 0;
        }

        .mobile-card-content {
          flex: 1;
          min-width: 0;
        }

        .mobile-card-content .hero-card-badge {
          margin-bottom: 8px;
          padding: 4px 10px;
          font-size: 0.7rem;
        }

        .mobile-card-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .mobile-card-content p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .mobile-card-arrow {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        /* Demo Section */
        .demo-section {
          padding: 120px 0;
          position: relative;
          z-index: 1;
          background: var(--bg-secondary);
        }

        .demo-wrapper {
          max-width: 700px;
          margin: 0 auto 60px;
        }

        /* Tech Specs in Drawer */
        .tech-specs-section {
          margin-bottom: 32px;
        }

        .tech-specs-card {
          padding: 20px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .tech-spec-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.8rem;
        }

        .tech-spec-item:last-child {
          border-bottom: none;
        }

        .spec-key {
          color: var(--text-tertiary);
        }

        .spec-value {
          color: var(--cyan);
        }

        /* v12.0 Responsive */
        @media (max-width: 1024px) {
          .hero-cards-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-funnel-title {
            font-size: 2.5rem;
          }

          .hero-stats-row {
            flex-wrap: wrap;
            gap: 24px;
            padding: 24px;
          }

          .hero-stats-row .stat-divider {
            display: none;
          }

          .hero-stats-row .stat-item {
            width: calc(50% - 12px);
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero-funnel-section {
            padding: 120px 0 80px;
          }

          .hero-funnel-title {
            font-size: 2rem;
          }

          .hero-funnel-subtitle {
            font-size: 1rem;
          }

          .hero-cards-grid {
            display: none;
          }

          .hero-cards-stack {
            display: flex;
          }

          .hero-stats-row {
            gap: 16px;
            padding: 20px;
          }

          .hero-stats-row .stat-item {
            width: calc(50% - 8px);
          }

          .hero-stats-row .stat-value {
            font-size: 1.25rem;
          }

          .hero-stats-row .stat-label {
            font-size: 0.75rem;
          }

          .demo-section {
            padding: 80px 0;
          }

          .build-steps {
            flex-direction: column;
          }
        }

        @media (max-width: 375px) {
          .hero-funnel-title {
            font-size: 1.75rem;
          }

          .hero-funnel-badges {
            gap: 8px;
          }

          .hero-badge-item {
            padding: 6px 12px;
            font-size: 0.75rem;
          }

          .hero-stats-row .stat-item {
            width: 100%;
          }
        }

        /* ===== v13.0 Enhanced Drawer Styles ===== */

        /* Backdrop with stronger blur */
        .drawer-overlay-v13 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1100;
        }

        /* Service Drawer v13 */
        .service-drawer-v13 {
          position: fixed;
          top: 0;
          right: 0;
          width: 560px;
          max-width: 100vw;
          height: 100vh;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 15, 0.98) 0%,
            rgba(18, 18, 26, 0.99) 100%
          );
          border-left: 1px solid var(--border-color);
          z-index: 1200;
          display: flex;
          flex-direction: column;
        }

        .service-drawer-v13.mobile-fullscreen {
          width: 100vw;
          border-left: none;
        }

        .drawer-header-v13 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          flex-shrink: 0;
        }

        .drawer-icon-v13 {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .drawer-header-v13 h3 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .drawer-close-v13 {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .drawer-close-v13:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          transform: scale(1.05);
        }

        .drawer-scroll-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        /* Big Metrics Grid (v13.0) */
        .big-metrics-section {
          margin-bottom: 32px;
        }

        .big-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .big-metric-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s;
        }

        .big-metric-card:hover {
          border-color: var(--cyan);
          transform: translateY(-2px);
        }

        .big-metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 8px;
        }

        .big-metric-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        /* Case Screenshots (v13.0) */
        .case-screenshots-section {
          margin-bottom: 32px;
        }

        .case-study-header {
          margin-bottom: 20px;
        }

        .case-study-header h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .case-study-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .screenshots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .screenshot-card {
          text-align: center;
        }

        .screenshot-placeholder {
          aspect-ratio: 4/3;
          background: var(--bg-tertiary);
          border: 2px dashed;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
        }

        .screenshot-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 191, 255, 0.03) 0%,
            transparent 50%
          );
        }

        .screenshot-icon {
          opacity: 0.5;
        }

        .screenshot-number {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        .screenshot-card h5 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .screenshot-card p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        /* Tech Specs v13 */
        .tech-specs-section-v13 {
          margin-bottom: 32px;
        }

        .tech-specs-list {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px 20px;
        }

        .tech-spec-row {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.85rem;
        }

        .tech-spec-row:last-child {
          border-bottom: none;
        }

        .spec-key-v13 {
          color: var(--text-tertiary);
          width: 100px;
          flex-shrink: 0;
        }

        .spec-divider {
          color: var(--text-tertiary);
          margin: 0 12px;
        }

        .spec-value-v13 {
          flex: 1;
        }

        /* Build Process v13 */
        .build-process-section {
          margin-bottom: 24px;
        }

        .build-steps-v13 {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .build-step-v13 {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .build-step-v13:hover {
          border-color: var(--cyan);
        }

        .step-number-v13 {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .step-icon-v13 {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .step-content-v13 h5 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .step-content-v13 p {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        /* Direct Form (Fixed at bottom) */
        .direct-form-section {
          padding: 20px 24px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .direct-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .direct-form input {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .direct-form input:focus {
          outline: none;
          border-color: var(--cyan);
        }

        .direct-form input::placeholder {
          color: var(--text-tertiary);
        }

        .direct-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
        }

        .direct-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        /* Logo Cloud Section */
        .logo-cloud-section {
          padding: 60px 0;
          position: relative;
          z-index: 1;
          background: var(--bg-secondary);
        }

        /* Enhanced Glow Effect (v13.0) */
        .text-glow {
          color: var(--cyan);
          text-shadow:
            0 0 10px rgba(0, 191, 255, 0.8),
            0 0 20px rgba(0, 191, 255, 0.6),
            0 0 30px rgba(0, 191, 255, 0.4),
            0 0 40px rgba(0, 191, 255, 0.2);
          animation: glow-pulse-v13 2.5s ease-in-out infinite;
        }

        @keyframes glow-pulse-v13 {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(0, 191, 255, 0.8),
              0 0 20px rgba(0, 191, 255, 0.6),
              0 0 30px rgba(0, 191, 255, 0.4),
              0 0 40px rgba(0, 191, 255, 0.2);
          }
          50% {
            text-shadow:
              0 0 15px rgba(0, 191, 255, 1),
              0 0 30px rgba(0, 191, 255, 0.8),
              0 0 45px rgba(0, 191, 255, 0.6),
              0 0 60px rgba(0, 191, 255, 0.4);
          }
        }

        /* Nav CTA as button */
        .nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--crimson);
          color: white;
          text-decoration: none;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-cta:hover {
          background: #d63d55;
          transform: translateY(-2px);
        }

        /* v13.0 Mobile Responsive */
        @media (max-width: 768px) {
          .big-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .big-metric-value {
            font-size: 2rem;
          }

          .screenshots-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .screenshot-placeholder {
            aspect-ratio: 16/9;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .drawer-scroll-content {
            padding: 20px 16px;
          }

          .direct-form-section {
            padding: 16px;
          }

          .logo-cloud-section {
            padding: 40px 0;
          }
        }

        /* ===== v15.5 Premium Report Popup Styles ===== */

        .popup-overlay-v15 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1100;
        }

        .popup-center-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 20px;
        }

        .service-popup-v15 {
          width: 100%;
          max-width: 900px;
          max-height: calc(100vh - 40px);
          background: linear-gradient(
            180deg,
            rgba(10, 10, 15, 0.98) 0%,
            rgba(18, 18, 26, 0.99) 100%
          );
          border: 1px solid var(--border-color);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7);
        }

        .service-popup-v15.mobile-fullscreen {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        .popup-center-wrapper:has(.mobile-fullscreen) {
          padding: 0;
        }

        /* v15.5 Header */
        .popup-header-v15 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          flex-shrink: 0;
        }

        .popup-icon-v15 {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .popup-header-v15 h2 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .popup-header-v15 p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }

        .popup-close-v15 {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .popup-close-v15:hover {
          border-color: var(--crimson);
          color: var(--crimson);
          background: rgba(233, 69, 96, 0.1);
        }

        /* v15.5 Body: Two Column Layout */
        .popup-body-v15 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* Left: Visual Column */
        .popup-visual-col {
          padding: 20px;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          overflow-y: auto;
        }

        .case-visual-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .case-visual-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .visual-tag {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
        }

        .visual-badge {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .case-visual-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .case-screenshots-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .screenshot-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .screenshot-card:hover {
          border-color: var(--cyan);
          transform: translateX(4px);
        }

        .screenshot-visual {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid;
          border-radius: 10px;
        }

        .screenshot-icon-large {
          opacity: 0.8;
        }

        .screenshot-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .screenshot-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .screenshot-desc {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        /* Right: Data Column */
        .popup-data-col {
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .data-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px;
        }

        .data-section-header {
          margin-bottom: 10px;
        }

        .data-tag {
          font-size: 0.65rem;
          color: var(--cyan);
          letter-spacing: 0.1em;
        }

        /* Metrics Grid */
        .metrics-grid-v15 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .metric-card-v15 {
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          text-align: center;
        }

        .metric-value-v15 {
          font-size: 1.4rem;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        .metric-label-v15 {
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        /* Tech List */
        .tech-list-v15 {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tech-item-v15 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .tech-key {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .tech-val {
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Outcome List */
        .outcome-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .outcome-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .outcome-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .outcome-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .outcome-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .outcome-desc {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        /* Bottom CTA Bar */
        .popup-cta-bar {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .popup-cta-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .popup-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 191, 255, 0.3);
        }

        /* Popup Title Group - shared */
        .popup-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Card Guide Text (v14.0) */
        .card-guide-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 16px;
          background: linear-gradient(135deg, var(--cyan-dim) 0%, rgba(0, 191, 255, 0.05) 100%);
          border: 1px solid rgba(0, 191, 255, 0.3);
          border-radius: 10px;
          color: var(--cyan);
          font-size: 0.85rem;
          font-weight: 500;
          animation: guide-float 3s ease-in-out infinite;
        }

        .guide-pulse {
          width: 8px;
          height: 8px;
          background: var(--cyan);
          border-radius: 50%;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes guide-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(0, 191, 255, 0);
          }
        }

        /* ===== v16.5 Technical Report Popup ===== */

        .popup-overlay-v16 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 5, 15, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 1100;
        }

        .report-popup-v16 {
          width: 100%;
          max-width: 960px;
          max-height: calc(100vh - 40px);
          background: linear-gradient(
            180deg,
            rgba(10, 10, 20, 0.98) 0%,
            rgba(15, 15, 25, 0.99) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 191, 255, 0.1),
            0 40px 80px -20px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .report-popup-v16.mobile-fullscreen {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.3);
        }

        .report-title-area {
          flex: 1;
        }

        .report-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .report-header h2 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .report-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .report-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .report-close:hover {
          border-color: var(--crimson);
          color: var(--crimson);
        }

        .report-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* Dashboard Mockup Panel */
        .report-visual-panel {
          padding: 20px;
          background: radial-gradient(ellipse at top left, rgba(0, 191, 255, 0.03) 0%, transparent 50%);
          border-right: 1px solid var(--border-color);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-mockup {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--border-color);
        }

        .mockup-dots span:first-child { background: #ff5f56; }
        .mockup-dots span:nth-child(2) { background: #ffbd2e; }
        .mockup-dots span:nth-child(3) { background: #27ca3f; }

        .mockup-title {
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        .mockup-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mockup-chart-area {
          background: var(--bg-tertiary);
          border-radius: 10px;
          padding: 12px;
        }

        .mini-chart-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          margin-bottom: 10px;
        }

        .mini-bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 60px;
        }

        .mini-bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          min-height: 10px;
        }

        .mockup-stats {
          display: flex;
          gap: 12px;
        }

        .mockup-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .mockup-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        .flow-node {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .flow-node.active {
          background: rgba(0, 191, 255, 0.1);
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .flow-arrow {
          color: var(--text-tertiary);
          font-size: 0.8rem;
        }

        .security-trust-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%);
          border: 1px solid rgba(72, 187, 120, 0.3);
          border-radius: 12px;
          color: var(--green);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .trust-check {
          font-size: 1rem;
        }

        /* Data Panel */
        .report-data-panel {
          padding: 20px;
          background: radial-gradient(ellipse at bottom right, rgba(233, 69, 96, 0.03) 0%, transparent 50%);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .report-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px;
        }

        .section-header-v16 {
          margin-bottom: 12px;
        }

        .section-tag-v16 {
          font-size: 0.65rem;
          color: var(--cyan);
          letter-spacing: 0.1em;
        }

        .performance-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 14px;
        }

        .perf-bar-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .perf-bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .perf-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .perf-value {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .perf-bar-track {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .perf-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .metric-chips {
          display: flex;
          gap: 10px;
        }

        .metric-chip {
          flex: 1;
          padding: 10px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          text-align: center;
        }

        .chip-value {
          font-size: 1.1rem;
          font-weight: 700;
          display: block;
          margin-bottom: 2px;
        }

        .chip-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
        }

        .tech-terms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .tech-term-card {
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        .term-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .term-name {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .term-tooltip-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 50%;
          font-size: 0.6rem;
          color: var(--text-tertiary);
          cursor: help;
        }

        .term-desc {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        /* CTA Bar with Pulse */
        .report-cta-bar {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.3);
        }

        .report-cta-pulse {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px 28px;
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1.05rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          animation: cta-pulse 2s ease-in-out infinite;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        @keyframes cta-pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 4px 30px rgba(0, 191, 255, 0.4), 0 0 20px rgba(0, 191, 255, 0.2);
          }
        }

        /* ===== v17.5 Funnel Modal Styles ===== */

        .funnel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 5, 15, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 1100;
        }

        .funnel-modal-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1101;
        }

        .funnel-modal {
          width: 100%;
          max-width: 900px;
          max-height: calc(100vh - 40px);
          background: linear-gradient(
            180deg,
            rgba(10, 10, 20, 0.99) 0%,
            rgba(15, 15, 25, 1) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 191, 255, 0.1),
            0 40px 80px -20px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .funnel-modal.mobile-fullscreen {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        .funnel-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .funnel-close:hover {
          border-color: var(--crimson);
          color: var(--crimson);
          background: rgba(233, 69, 96, 0.1);
        }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 24px 60px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.4;
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .step-dot.active,
        .step-dot.completed {
          opacity: 1;
        }

        .step-num {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .step-dot.active .step-num {
          background: var(--cyan);
          border-color: var(--cyan);
          color: white;
          box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
        }

        .step-dot.completed .step-num {
          background: var(--green);
          border-color: var(--green);
          color: white;
        }

        .step-label {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          white-space: nowrap;
        }

        .step-dot.active .step-label {
          color: var(--cyan);
        }

        .step-progress {
          position: absolute;
          left: 60px;
          right: 60px;
          top: 40px;
          height: 2px;
          background: var(--border-color);
          z-index: 0;
        }

        .step-progress-fill {
          height: 100%;
          border-radius: 2px;
        }

        /* Funnel Content */
        .funnel-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .funnel-step-content {
          min-height: 100%;
        }

        .step-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .step-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .step-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .step-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        /* Circle Gauge Component */
        .circle-gauge {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          transform: rotate(0deg);
        }

        .gauge-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .gauge-value {
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .gauge-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        /* Step 1: Impact Metrics */
        .impact-metrics-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .comparison-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .comparison-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px 24px;
        }

        .comparison-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .label-text {
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .comparison-badge {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .comparison-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-label {
          width: 60px;
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        .bar-track {
          flex: 1;
          height: 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 6px;
        }

        .bar-fill.before {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        }

        .bar-value {
          width: 50px;
          text-align: right;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .gauges-row {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .gauge-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Step 2: Visual Proof */
        .proof-visual {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .chatbot-mockup {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
        }

        .chatbot-mockup .mockup-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
          padding: 4px 10px;
          background: rgba(72, 187, 120, 0.15);
          border-radius: 20px;
          font-size: 0.65rem;
          color: var(--green);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: var(--green);
          border-radius: 50%;
          animation: live-pulse 1.5s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .chat-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 280px;
        }

        .chat-message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .chat-message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-message.bot {
          align-self: flex-start;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 4px;
          color: var(--text-primary);
        }

        .bot-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .response-time {
          margin-left: auto;
          color: var(--green);
        }

        .chat-message.bot p {
          margin-bottom: 8px;
        }

        .chat-message.bot ul {
          margin: 0;
          padding-left: 16px;
          font-size: 0.85rem;
        }

        .chat-message.bot li {
          margin-bottom: 4px;
        }

        .source-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 6px 10px;
          background: rgba(0, 191, 255, 0.1);
          border-radius: 6px;
          font-size: 0.7rem;
          color: var(--cyan);
        }

        .chat-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          width: fit-content;
        }

        .chat-typing span {
          width: 8px;
          height: 8px;
          background: var(--text-tertiary);
          border-radius: 50%;
          animation: typing-bounce 1s ease-in-out infinite;
        }

        .chat-typing span:nth-child(2) { animation-delay: 0.1s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.2s; }

        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .proof-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .proof-stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 20px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-info .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
        }

        .stat-info .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Step 3: Process Map */
        .process-map {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .process-step {
          flex: 1;
          min-width: 220px;
          max-width: 280px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          position: relative;
        }

        .process-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          margin: 0 auto 16px;
        }

        .process-number {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        .process-step h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }

        .process-step p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .process-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }

        .process-checklist li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding: 6px 0;
          border-top: 1px solid var(--border-color);
        }

        .process-checklist li:first-child {
          border-top: none;
        }

        .process-checklist svg {
          color: var(--green);
          flex-shrink: 0;
        }

        .process-arrow {
          display: flex;
          align-items: center;
          color: var(--text-tertiary);
          padding-top: 60px;
        }

        .security-assurance {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 32px;
          padding: 20px 24px;
          background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(72, 187, 120, 0.05));
          border: 1px solid rgba(72, 187, 120, 0.2);
          border-radius: 14px;
          color: var(--green);
          font-size: 0.9rem;
        }

        .security-badges {
          display: flex;
          gap: 8px;
        }

        .security-badge {
          padding: 4px 10px;
          background: rgba(72, 187, 120, 0.2);
          border-radius: 6px;
          font-size: 0.7rem;
          color: var(--green);
        }

        /* Step 4: Contact Form */
        .contact-form {
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .form-input,
        .form-select {
          padding: 14px 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--cyan);
          box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23888%27 stroke-width=%272%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .form-select option {
          background: var(--bg-primary);
          color: white;
        }

        .submit-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 18px 28px;
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.3s;
        }

        .submit-cta-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-dots {
          display: flex;
          gap: 6px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loading-bounce 0.6s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.1s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.2s; }

        @keyframes loading-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.6); }
        }

        .form-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-align: center;
        }

        .submit-success {
          text-align: center;
          padding: 48px 24px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(72, 187, 120, 0.15);
          border-radius: 50%;
          margin: 0 auto 24px;
          color: var(--green);
        }

        .submit-success h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .submit-success p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .success-close-btn {
          padding: 14px 40px;
          background: var(--cyan);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .success-close-btn:hover {
          background: #00d4ff;
        }

        /* Funnel Navigation */
        .funnel-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-top: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.3);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover:not(:disabled) {
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-btn.next {
          background: var(--cyan);
          border-color: var(--cyan);
          color: white;
        }

        .nav-btn.next:hover {
          background: #00d4ff;
        }

        .nav-btn.skip {
          background: var(--bg-secondary);
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        .nav-dots {
          display: flex;
          gap: 8px;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-color);
          transition: all 0.3s;
        }

        .nav-dot.active {
          width: 24px;
          border-radius: 4px;
        }

        /* Floating CTA Animation - Enhanced */
        .card-guide-text.floating-cta {
          animation: float-cta-enhanced 3s ease-in-out infinite;
          background: linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 191, 255, 0.08) 100%);
          border-color: rgba(0, 191, 255, 0.4);
        }

        @keyframes float-cta-enhanced {
          0%, 100% {
            transform: translateY(0);
            box-shadow: 0 4px 20px rgba(0, 191, 255, 0.2);
          }
          50% {
            transform: translateY(-8px);
            box-shadow: 0 12px 35px rgba(0, 191, 255, 0.35);
          }
        }

        /* Identity Section Enhancements */
        .identity-partner-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(138, 43, 226, 0.1));
          border: 1px solid rgba(0, 191, 255, 0.3);
          border-radius: 30px;
          color: var(--cyan);
          font-size: 0.7rem;
          margin-bottom: 20px;
        }

        .identity-certifications {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .cert-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(72, 187, 120, 0.1);
          border: 1px solid rgba(72, 187, 120, 0.3);
          border-radius: 8px;
          color: var(--green);
          font-size: 0.75rem;
        }

        .identity-reference {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
          padding: 16px 24px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .ref-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          padding: 4px 10px;
          background: rgba(0, 191, 255, 0.1);
          border-radius: 6px;
        }

        .ref-logo {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--cyan);
        }

        .ref-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Mobile Responsive for Funnel Modal */
        @media (max-width: 768px) {
          .funnel-content {
            padding: 24px 16px;
          }

          .step-indicator {
            padding: 16px;
            gap: 8px;
          }

          .step-label {
            display: none;
          }

          .step-progress {
            display: none;
          }

          .step-title {
            font-size: 1.4rem;
          }

          .proof-visual {
            grid-template-columns: 1fr;
          }

          .process-map {
            flex-direction: column;
            align-items: center;
          }

          .process-arrow {
            transform: rotate(90deg);
            padding: 0;
          }

          .process-step {
            max-width: 100%;
          }

          .gauges-row {
            gap: 12px;
          }

          .gauge-card {
            padding: 12px;
          }

          .security-assurance {
            flex-direction: column;
            text-align: center;
          }

          .funnel-nav {
            padding: 12px 16px;
          }

          .nav-btn span {
            display: none;
          }

          .nav-btn {
            padding: 12px;
          }

          .identity-certifications {
            gap: 8px;
          }

          .identity-reference {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }
        }

        /* ===== v16.5 Pipeline Section ===== */

        .pipeline-section-v16 {
          padding: 120px 0;
          position: relative;
          z-index: 1;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .pipeline-glow-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse 50% 40% at 20% 20%, rgba(138, 43, 226, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0, 191, 255, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .data-flow-lines {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--cyan) 50%, transparent 100%);
          opacity: 0.1;
          animation: flow-pulse 3s ease-in-out infinite;
        }

        @keyframes flow-pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }

        .engine-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 30px;
          color: #a78bfa;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }

        .pipeline-security-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%);
          border: 1px solid rgba(72, 187, 120, 0.3);
          border-radius: 12px;
          color: var(--green);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 40px;
        }

        .badge-verified {
          padding: 4px 8px;
          background: rgba(72, 187, 120, 0.2);
          border-radius: 6px;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
        }

        /* ===== v16.5 Identity Section ===== */

        .identity-section-v16 {
          padding: 140px 0;
          position: relative;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .identity-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0, 191, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 80%, rgba(138, 43, 226, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 80%, rgba(233, 69, 96, 0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .identity-content-v16 {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .identity-slogan {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .slogan-main {
          display: block;
          background: linear-gradient(135deg, #ffffff 0%, #a0a0b0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slogan-accent {
          display: block;
          background: linear-gradient(135deg, var(--cyan) 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 40px rgba(0, 191, 255, 0.3);
        }

        .identity-tagline {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 48px;
        }

        .identity-stats-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin-bottom: 48px;
        }

        .identity-stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
          margin-bottom: 8px;
        }

        .stat-text {
          font-size: 0.9rem;
          color: var(--text-tertiary);
        }

        .stat-divider-v16 {
          width: 1px;
          height: 60px;
          background: var(--border-color);
        }

        /* ===== Pipeline Section (v14.0) ===== */

        .pipeline-section {
          padding: 120px 0;
          position: relative;
          z-index: 1;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .pipeline-circuit-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(0, 191, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(72, 187, 120, 0.03) 0%, transparent 50%),
            linear-gradient(rgba(0, 191, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
          animation: circuit-flow 20s linear infinite;
          pointer-events: none;
        }

        @keyframes circuit-flow {
          0% {
            background-position: 0 0, 0 0, 0 0, 0 0;
          }
          100% {
            background-position: 0 0, 0 0, 40px 40px, 40px 40px;
          }
        }

        .pipeline-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-top: 60px;
        }

        .pipeline-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          min-width: 140px;
          transition: all 0.3s;
        }

        .pipeline-step:hover {
          border-color: var(--cyan);
          transform: translateY(-4px);
        }

        .pipeline-step.step-highlight {
          border-color: var(--cyan);
          background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(0, 191, 255, 0.1) 100%);
          box-shadow: 0 0 40px rgba(0, 191, 255, 0.15);
        }

        .pipeline-step .step-number {
          font-size: 0.7rem;
          color: var(--cyan);
          margin-bottom: 12px;
        }

        .step-icon-box {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border-radius: 14px;
          color: var(--cyan);
          margin: 0 auto 12px;
        }

        .pipeline-step h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .step-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }

        .step-tags span {
          padding: 4px 8px;
          background: var(--bg-tertiary);
          border-radius: 6px;
          font-size: 0.65rem;
          color: var(--text-tertiary);
        }

        .pipeline-arrow {
          display: flex;
          align-items: center;
          color: var(--cyan);
          padding: 0 8px;
          position: relative;
        }

        .arrow-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan) 0%, rgba(0, 191, 255, 0.3) 100%);
          transform-origin: left;
          margin-right: -8px;
        }

        .pipeline-highlights {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 48px;
          margin-top: 60px;
          padding: 24px 48px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight-item {
          text-align: center;
        }

        .highlight-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }

        .highlight-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .highlight-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Mobile Pipeline */
        .pipeline-flow-mobile {
          display: none;
          flex-direction: column;
          gap: 0;
          margin-top: 40px;
        }

        .pipeline-step-mobile {
          display: flex;
          gap: 16px;
        }

        .pipeline-step-mobile .step-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 40px;
        }

        .pipeline-step-mobile .step-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cyan-dim);
          border: 1px solid var(--cyan);
          border-radius: 50%;
          color: var(--cyan);
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .pipeline-step-mobile .step-line {
          flex: 1;
          width: 2px;
          background: linear-gradient(180deg, var(--cyan) 0%, transparent 100%);
          margin: 8px 0;
        }

        .pipeline-step-mobile .step-right {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 24px;
        }

        .pipeline-step-mobile .step-icon-box {
          width: 48px;
          height: 48px;
          margin: 0;
          flex-shrink: 0;
        }

        .pipeline-step-mobile .step-info h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .pipeline-step-mobile.step-highlight .step-number {
          background: var(--cyan);
          color: var(--bg-primary);
        }

        /* v14.0 Responsive */
        @media (max-width: 900px) {
          .popup-body {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 16px;
          }

          .gauges-grid {
            gap: 16px;
          }

          .screenshots-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
        }

        @media (max-width: 768px) {
          /* v15.5 Popup Mobile */
          .popup-body-v15 {
            grid-template-columns: 1fr;
          }

          .popup-visual-col {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            padding: 16px;
          }

          .popup-data-col {
            padding: 16px;
          }

          .metrics-grid-v15 {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .metric-value-v15 {
            font-size: 1.2rem;
          }

          .pipeline-flow {
            display: none;
          }

          .pipeline-flow-mobile {
            display: flex;
          }

          .pipeline-section {
            padding: 80px 0;
          }

          .pipeline-highlights {
            flex-direction: column;
            gap: 20px;
            padding: 24px;
          }

          .highlight-divider {
            width: 60px;
            height: 1px;
          }

          .card-guide-text {
            font-size: 0.8rem;
            padding: 10px 12px;
          }

          /* Identity Section Mobile */
          .identity-section {
            padding: 80px 0;
          }

          .identity-headline {
            font-size: 1.8rem;
          }

          .identity-subtext {
            font-size: 0.95rem;
            margin-bottom: 32px;
          }

          .identity-strengths {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .strength-card {
            padding: 24px 20px;
          }

          .strength-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
          }

          .identity-cta-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 900px) {
          .popup-body-v15 {
            grid-template-columns: 1fr;
          }

          .popup-visual-col {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }

          /* v16.5 Report Popup Mobile */
          .report-body {
            grid-template-columns: 1fr;
          }

          .report-visual-panel {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }

          .tech-terms-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          /* v16.5 Mobile Styles */
          .report-header h2 {
            font-size: 1.1rem;
          }

          .report-header p {
            font-size: 0.8rem;
          }

          .report-visual-panel,
          .report-data-panel {
            padding: 16px;
          }

          .mockup-content {
            padding: 12px;
          }

          .perf-value {
            font-size: 1rem;
          }

          .metric-chips {
            flex-direction: column;
            gap: 8px;
          }

          .report-cta-pulse {
            font-size: 0.95rem;
            padding: 14px 20px;
          }

          /* v16.5 Pipeline Mobile */
          .pipeline-section-v16 {
            padding: 80px 0;
          }

          .engine-badge {
            font-size: 0.6rem;
            padding: 6px 12px;
          }

          .pipeline-security-badge {
            font-size: 0.8rem;
            padding: 10px 16px;
          }

          /* v16.5 Identity Mobile */
          .identity-section-v16 {
            padding: 100px 0;
          }

          .identity-slogan {
            font-size: 2rem;
          }

          .identity-tagline {
            font-size: 1rem;
            margin-bottom: 32px;
          }

          .identity-stats-row {
            flex-direction: column;
            gap: 24px;
          }

          .stat-divider-v16 {
            width: 60px;
            height: 1px;
          }

          .stat-number {
            font-size: 2rem;
          }
        }
      `}</style>
      </div>
    </>
  );
}
