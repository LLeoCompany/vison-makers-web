"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
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
  Building2,
  Send,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
};

// Typing Animation Component
const TypingDemo = () => {
  const [displayText, setDisplayText] = useState("");
  const [showSource, setShowSource] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoContent = {
    query: "DevGym의 회원 이탈률 감소 전략은?",
    response:
      "DevGym은 AI 기반 개인화 추천으로 회원 이탈률을 42% 감소시켰습니다. 핵심 전략은 1) 운동 패턴 분석 2) 맞춤형 루틴 제안 3) 실시간 피드백 시스템입니다.",
    sources: [
      { title: "회원관리_데이터분석.pdf", page: "p.23" },
      { title: "AI추천시스템_성과보고서.xlsx", page: "Sheet 3" },
    ],
  };

  useEffect(() => {
    const steps = [
      // Step 1: Type query
      () => {
        let i = 0;
        const typeQuery = setInterval(() => {
          if (i <= demoContent.query.length) {
            setDisplayText(demoContent.query.slice(0, i));
            i++;
          } else {
            clearInterval(typeQuery);
            setTimeout(() => setCurrentStep(1), 500);
          }
        }, 50);
        return () => clearInterval(typeQuery);
      },
      // Step 2: Show response
      () => {
        setDisplayText("");
        let i = 0;
        const typeResponse = setInterval(() => {
          if (i <= demoContent.response.length) {
            setDisplayText(demoContent.response.slice(0, i));
            i++;
          } else {
            clearInterval(typeResponse);
            setTimeout(() => setCurrentStep(2), 300);
          }
        }, 20);
        return () => clearInterval(typeResponse);
      },
      // Step 3: Show sources
      () => {
        setShowSource(true);
        setTimeout(() => {
          setShowSource(false);
          setDisplayText("");
          setCurrentStep(0);
        }, 4000);
      },
    ];

    const cleanup = steps[currentStep]?.();
    return cleanup;
  }, [currentStep]);

  return (
    <div className="demo-window">
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
        {currentStep === 0 && (
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

        {currentStep >= 1 && (
          <div className="demo-response">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} strokeWidth={1.5} className="text-cyan" />
              <span className="text-xs text-gray-400">AI Response</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {displayText}
              {currentStep === 1 && <span className="cursor">|</span>}
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
            {demoContent.sources.map((source, i) => (
              <div key={i} className="source-item">
                <span className="text-cyan font-mono text-xs">
                  [{i + 1}]
                </span>
                <span className="text-gray-300 text-xs">{source.title}</span>
                <span className="text-gray-500 text-xs">{source.page}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// CountUp Animation
const CountUp = ({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

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
    {highlight && <span className="solution-highlight">{highlight}</span>}
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
              <a href="#process">진행 과정</a>
              <a href="#contact">문의</a>
            </div>

            <Link href="#contact" className="nav-cta">
              상담 신청
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Section 1: Hero */}
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
                  <span className="stat-value font-mono">92%</span>
                  <span className="stat-label">답변 정확도</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value font-mono">1.2s</span>
                  <span className="stat-label">평균 응답시간</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value font-mono">78%</span>
                  <span className="stat-label">업무 자동화율</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="hero-demo"
            >
              <TypingDemo />
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
              highlight="추천"
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
            <motion.div {...fadeInUp} className="bento-item bento-large">
              <div className="bento-content">
                <Users size={32} strokeWidth={1.5} className="text-cyan" />
                <div className="bento-metric">
                  <CountUp end={100000} suffix="+" />
                </div>
                <span className="bento-label">활성 회원</span>
                <p className="bento-desc">
                  실제 서비스에서 10만 명 이상의 사용자가 활용 중
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="bento-item">
              <div className="bento-content">
                <Target size={24} strokeWidth={1.5} className="text-green" />
                <div className="bento-metric font-mono">
                  <CountUp end={92} suffix="%" />
                </div>
                <span className="bento-label">답변 정확도</span>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="bento-item">
              <div className="bento-content">
                <Zap size={24} strokeWidth={1.5} className="text-cyan" />
                <div className="bento-metric font-mono">
                  <CountUp end={1} prefix="" suffix=".2s" />
                </div>
                <span className="bento-label">평균 응답시간</span>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="bento-item bento-wide">
              <div className="bento-content">
                <BarChart3 size={24} strokeWidth={1.5} className="text-crimson" />
                <div className="bento-metric font-mono">
                  <CountUp end={42} suffix="%" />
                </div>
                <span className="bento-label">회원 이탈률 감소</span>
                <p className="bento-desc">AI 개인화 추천으로 달성</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="bento-item">
              <div className="bento-content">
                <Clock size={24} strokeWidth={1.5} className="text-cyan" />
                <div className="bento-metric font-mono">
                  <CountUp end={8} suffix="주" />
                </div>
                <span className="bento-label">구축 기간</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: RAG Flow */}
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

      {/* Section 5: Trust Metrics */}
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

      {/* Section 6: CTA Form */}
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

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="cta-form-wrapper">
              <form className="cta-form">
                <div className="form-group">
                  <label>담당자명</label>
                  <input type="text" placeholder="홍길동" />
                </div>

                <div className="form-group">
                  <label>이메일</label>
                  <input type="email" placeholder="example@company.com" />
                </div>

                <div className="form-group">
                  <label>연락처</label>
                  <input type="tel" placeholder="010-1234-5678" />
                </div>

                <div className="form-group">
                  <label>관심 서비스</label>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span>RAG 시스템 구축</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span>AI 챗봇</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span>추천 시스템</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>산업군</label>
                  <select>
                    <option value="">선택해주세요</option>
                    <option value="finance">금융</option>
                    <option value="healthcare">의료/헬스케어</option>
                    <option value="manufacturing">제조</option>
                    <option value="retail">유통/커머스</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  무료 상담 신청
                  <Send size={18} strokeWidth={1.5} />
                </button>
              </form>
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
              <a href="#process">진행 과정</a>
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
          transform: translateY(-8px);
          border-color: var(--cyan);
          box-shadow: 0 20px 60px rgba(0, 191, 255, 0.1);
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
          width: 56px;
          height: 56px;
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
          display: inline-block;
          padding: 4px 12px;
          background: var(--crimson);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 16px;
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
        }

        /* Flow Section */
        .flow-section {
          padding: 120px 0;
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
          background: var(--bg-secondary);
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
          background: var(--bg-tertiary);
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
          background: var(--bg-tertiary);
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
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
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
          background: var(--bg-tertiary);
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
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .checkbox-item:hover {
          border-color: var(--cyan);
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
          background: var(--crimson);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .submit-btn:hover {
          background: #d63d55;
          transform: translateY(-2px);
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
        }

        .rag-landing {
          position: relative;
        }
      `}</style>
    </div>
  );
}
