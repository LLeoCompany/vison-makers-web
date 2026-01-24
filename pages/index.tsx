"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
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
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

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

// CountUp Animation (2 seconds)
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
      let start = 0;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = easeOut * end;

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

// Bento Item with Hover Text Morphing
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
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...fadeInUp}
      className={`bento-item ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

// Mobile Sticky CTA
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
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
            무료 상담 신청
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function RAGLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="rag-landing">
      {/* Particle Background */}
      <div className="particles-bg">
        {[...Array(50)].map((_, i) => (
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

      {/* Header */}
      <header className={`rag-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="rag-nav">
            <Link href="/" className="rag-logo">
              <Sparkles size={24} strokeWidth={1.5} className="text-cyan" />
              <span>RAG Agency</span>
            </Link>

            <div className="nav-links">
              <a href="#solutions">솔루션</a>
              <a href="#proof">검증된 성과</a>
              <a href="#security">보안</a>
              <a href="#contact">문의</a>
            </div>

            <Link href="#contact" className="nav-cta">
              상담 신청
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Section 1: Hero with Industry Demo */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <motion.div {...fadeInUp} className="hero-content">
              <div className="hero-badge">
                <CheckCircle size={14} strokeWidth={1.5} />
                <span className="font-mono">10만+ 회원 데이터 검증 완료</span>
              </div>

              <h1 className="hero-title">
                이미{" "}
                <span className="text-cyan font-mono">10만 회원</span> 데이터에서
                <br />
                검증된 <span className="text-crimson">RAG LLM</span> 플랫폼
              </h1>

              <p className="hero-subtitle">
                DevGym에서 실전 검증된 RAG 기술력을 귀사의 데이터에 이식합니다.
                <br />
                데이터 보안부터 실시간 검색까지, 엔터프라이즈급 AI 솔루션을
                제공합니다.
              </p>

              <div className="hero-actions">
                <Link href="#contact" className="btn-primary">
                  무료 컨설팅 신청
                  <ArrowRight size={18} strokeWidth={1.5} />
                </Link>
                <a href="#proof" className="btn-secondary">
                  DevGym 성과 보기
                </a>
              </div>

              <div className="hero-stats">
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
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="hero-demo"
            >
              <IndustryDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Solution Cards */}
      <section id="solutions" className="solutions-section">
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <span className="section-label font-mono">SOLUTIONS</span>
            <h2 className="section-title">
              검증된 <span className="text-cyan">RAG 기술</span>을
              <br />
              귀사에 맞게 구축합니다
            </h2>
          </motion.div>

          <div className="solutions-grid">
            <SolutionCard
              icon={Database}
              title="RAG 시스템 구축"
              description="기업 내부 데이터를 안전하게 벡터화하고, 실시간 검색이 가능한 지식 베이스를 구축합니다."
              stats="데이터 보안 99.9%"
            />

            <SolutionCard
              icon={MessageSquare}
              title="AI 챗봇 개발"
              description="DevGym에서 78% 업무 자동화를 달성한 챗봇 로직을 귀사 환경에 맞게 이식합니다."
              highlight="Most Popular"
              stats="자동화율 78%"
              isCenter
            />

            <SolutionCard
              icon={TrendingUp}
              title="추천 시스템"
              description="10만 회원 행동 데이터 기반 추천 알고리즘으로 ROI 3배 향상을 검증했습니다."
              stats="ROI 3배 향상"
            />
          </div>
        </div>
      </section>

      {/* Section 3: DevGym Proof (Bento Grid) */}
      <section id="proof" className="proof-section">
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <span className="section-label font-mono">PROVEN RESULTS</span>
            <h2 className="section-title">
              <span className="text-green">DevGym</span>에서 검증된
              <br />
              실전 성과
            </h2>
            <p className="section-subtitle">
              데이터만 교체하면 8주 내 금융, 의료, 제조 맞춤형 서비스 완성
            </p>
          </motion.div>

          <div className="bento-grid">
            <BentoProofItem
              icon={Users}
              metric={100000}
              metricSuffix="+"
              label="활성 회원"
              desc="피트니스 회원 이탈 예측"
              hoverText="→ 금융 고객 이탈 예측으로 확장"
              className="bento-large"
            />

            <BentoProofItem
              icon={Target}
              metric={92}
              metricSuffix="%"
              label="답변 정확도"
              desc="운동 상담 AI"
              hoverText="→ 의료 상담 AI로 확장"
              className=""
            />

            <BentoProofItem
              icon={Zap}
              metric={1.2}
              metricSuffix="s"
              label="평균 응답시간"
              decimals={1}
              className=""
            />

            <BentoProofItem
              icon={BarChart3}
              metric={42}
              metricSuffix="%"
              label="회원 이탈률 감소"
              desc="AI 개인화 추천"
              hoverText="→ 고객 LTV 증가 전략으로 확장"
              className="bento-wide"
            />

            <BentoProofItem
              icon={Clock}
              metric={8}
              metricSuffix="주"
              label="구축 기간"
              className=""
            />
          </div>
        </div>
      </section>

      {/* Section 4: Security Layer (NEW) */}
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

      {/* Section 5: RAG Flow */}
      <section id="process" className="flow-section">
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <span className="section-label font-mono">HOW IT WORKS</span>
            <h2 className="section-title">
              <span className="text-cyan">RAG</span> 파이프라인
              <br />
              작동 원리
            </h2>
          </motion.div>

          <div className="flow-grid">
            <FlowStep
              number={1}
              icon={FileText}
              title="데이터 유입"
              description="PDF, 문서, DB 등 기업 데이터를 안전하게 수집"
            />
            <div className="flow-connector">
              <ChevronRight size={24} strokeWidth={1.5} />
            </div>
            <FlowStep
              number={2}
              icon={Database}
              title="벡터화"
              description="텍스트를 AI가 이해할 수 있는 벡터로 변환"
            />
            <div className="flow-connector">
              <ChevronRight size={24} strokeWidth={1.5} />
            </div>
            <FlowStep
              number={3}
              icon={Brain}
              title="지식 추출 (RAG)"
              description="질문과 관련된 정보를 실시간으로 검색"
            />
            <div className="flow-connector">
              <ChevronRight size={24} strokeWidth={1.5} />
            </div>
            <FlowStep
              number={4}
              icon={Bot}
              title="AI 답변"
              description="출처와 함께 정확한 답변 생성"
            />
          </div>
        </div>
      </section>

      {/* Section 6: Trust Metrics */}
      <section className="trust-section">
        <div className="container">
          <motion.div {...fadeInUp} className="section-header">
            <span className="section-label font-mono">TRUST</span>
            <h2 className="section-title">
              고객사가 선택한
              <br />
              <span className="text-cyan">신뢰의 이유</span>
            </h2>
          </motion.div>

          <div className="trust-grid">
            <motion.div {...fadeInUp} className="trust-card">
              <Shield size={32} strokeWidth={1.5} className="text-cyan" />
              <h3>데이터 보안</h3>
              <p>
                AWS 기반 엔터프라이즈급 보안
                <br />
                데이터는 귀사 서버에만 저장
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="trust-card">
              <Clock size={32} strokeWidth={1.5} className="text-green" />
              <h3>24시간 지원</h3>
              <p>
                전담 엔지니어 배정
                <br />
                실시간 모니터링 및 대응
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="trust-card">
              <CheckCircle size={32} strokeWidth={1.5} className="text-crimson" />
              <h3>성과 보장</h3>
              <p>
                KPI 미달성 시 추가 개발 무상
                <br />
                명확한 성과 측정 기준 제시
              </p>
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div {...fadeInUp} className="testimonial">
            <div className="testimonial-content">
              <p>
                &ldquo;DevGym의 RAG 시스템 도입 후 CS 문의가{" "}
                <span className="text-cyan font-mono">60%</span> 감소했고, 회원
                만족도는{" "}
                <span className="text-green font-mono">35%</span>{" "}
                상승했습니다. 데이터 기반 의사결정이 가능해졌어요.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">K</div>
                <div className="author-info">
                  <span className="author-name">김** 대표</span>
                  <span className="author-company">피트니스 프랜차이즈 A사</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7: CTA Form */}
      <section id="contact" className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <motion.div {...fadeInUp} className="cta-content">
              <span className="section-label font-mono">GET STARTED</span>
              <h2 className="cta-title">
                지금 바로
                <br />
                <span className="text-cyan">무료 컨설팅</span>을 받아보세요
              </h2>
              <p className="cta-subtitle">
                귀사의 데이터와 목표에 맞는 RAG 솔루션을 제안해 드립니다.
              </p>

              <div className="cta-benefits">
                <div className="benefit-item">
                  <CheckCircle size={18} strokeWidth={1.5} className="text-green" />
                  <span>24시간 내 회신</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={18} strokeWidth={1.5} className="text-green" />
                  <span>계약 의무 없음</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={18} strokeWidth={1.5} className="text-green" />
                  <span>DevGym PDF 가이드 즉시 제공</span>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <ConsultationForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rag-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Sparkles size={20} strokeWidth={1.5} className="text-cyan" />
                <span>RAG Agency</span>
              </div>
              <p>10만 유저가 검증한 실전 RAG 기술력</p>
            </div>

            <div className="footer-links">
              <a href="#solutions">솔루션</a>
              <a href="#proof">검증된 성과</a>
              <a href="#security">보안</a>
              <a href="#contact">문의</a>
            </div>

            <div className="footer-contact">
              <span>contact@ragagency.ai</span>
              <span className="font-mono">24h 내 회신 보장</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 RAG Agency. All rights reserved.</p>
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
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap");

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
          opacity: 0.3;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
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
          padding: 120px 0;
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
          padding: 120px 0;
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
        }

        .bento-item:hover {
          border-color: var(--cyan);
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
          padding: 120px 0;
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
          padding: 120px 0;
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
          padding: 120px 0;
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
          padding: 120px 0;
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

        /* Sticky CTA (Mobile) */
        .sticky-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 24px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-color);
          z-index: 999;
        }

        .sticky-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          background: var(--crimson);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
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
      `}</style>
    </div>
  );
}
