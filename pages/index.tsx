import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="header-nav">
            <Link href="/" className="logo">
              LeoFitTech
            </Link>

            {/* Desktop Navigation */}
            <ul className="nav-menu hidden md:flex">
              <li>
                <a href="#services" className="nav-link">
                  서비스
                </a>
              </li>
              <li>
                <a href="#process" className="nav-link">
                  진행과정
                </a>
              </li>
              <li>
                <a href="#portfolio" className="nav-link">
                  포트폴리오
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link">
                  회사소개
                </a>
              </li>
              <li>
                <Link
                  href="/consultation/start"
                  className="btn btn-primary btn-sm"
                >
                  무료 상담받기
                </Link>
              </li>
            </ul>

            {/* Mobile CTA Button */}
            <div className="md:hidden">
              <Link
                href="/consultation/start"
                className="btn btn-primary btn-sm"
              >
                상담신청
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Animated Background Elements */}
        <div className="hero-bg-elements">
          {/* Floating Code Blocks - Left */}
          <div
            className="floating-element"
            style={{
              position: "absolute",
              left: "5%",
              top: "20%",
              animation: "float 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
                fontFamily: "monospace",
                fontSize: "13px",
                color: "var(--gray-600)",
              }}
            >
              <div style={{ color: "var(--primary)", marginBottom: "4px" }}>
                {"const"}{" "}
                <span style={{ color: "var(--gray-800)" }}>project</span> = {"{"}
              </div>
              <div style={{ paddingLeft: "12px", color: "var(--gray-500)" }}>
                success:{" "}
                <span style={{ color: "var(--success-green)" }}>true</span>
              </div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Floating Code Blocks - Right */}
          <div
            className="floating-element"
            style={{
              position: "absolute",
              right: "8%",
              top: "25%",
              animation: "floatSlow 8s ease-in-out infinite",
              animationDelay: "1s",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            >
              <div style={{ color: "var(--secondary)" }}>
                {"<"}
                <span style={{ color: "var(--primary)" }}>Component</span>
                {" />"}
              </div>
            </div>
          </div>

          {/* Terminal Window - Left Bottom */}
          <div
            className="floating-element"
            style={{
              position: "absolute",
              left: "3%",
              bottom: "15%",
              animation: "floatSlow 7s ease-in-out infinite",
              animationDelay: "2s",
            }}
          >
            <div
              style={{
                background: "var(--gray-900)",
                borderRadius: "12px",
                padding: "12px 16px",
                minWidth: "200px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#eab308",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "var(--gray-400)",
                }}
              >
                <div>
                  <span style={{ color: "var(--success-green)" }}>$</span> npm
                  run build
                </div>
                <div style={{ color: "var(--success-green)" }}>
                  Build successful
                </div>
              </div>
            </div>
          </div>

          {/* Floating Icons - Right Bottom */}
          <div
            className="floating-element"
            style={{
              position: "absolute",
              right: "5%",
              bottom: "20%",
              animation: "float 5s ease-in-out infinite",
              animationDelay: "0.5s",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 8px 32px rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--primary-gradient)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <span role="img" aria-label="rocket">
                  🚀
                </span>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <span role="img" aria-label="check">
                  ✓
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Dots */}
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "60%",
              width: "8px",
              height: "8px",
              background: "var(--primary)",
              borderRadius: "50%",
              opacity: 0.4,
              animation: "pulse 3s infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "20%",
              top: "40%",
              width: "6px",
              height: "6px",
              background: "var(--secondary)",
              borderRadius: "50%",
              opacity: 0.3,
              animation: "pulse 4s infinite",
              animationDelay: "1s",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "25%",
              bottom: "30%",
              width: "10px",
              height: "10px",
              background: "var(--accent-purple)",
              borderRadius: "50%",
              opacity: 0.25,
              animation: "pulse 5s infinite",
              animationDelay: "2s",
            }}
          />
        </div>

        <div className="container">
          <div className="hero-content">
            <Fade direction="up">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                앱 스토어 출시 5회 이상
              </div>
            </Fade>
            <Fade direction="up" delay={100}>
              <h1 className="text-hero">
                기획부터 런칭까지
                <br />
                <span style={{ color: "var(--primary)" }}>
                  함께 성장하는 개발 파트너
                </span>
              </h1>
            </Fade>
            <Fade direction="up" delay={200}>
              <p className="text-body-lg hero-subtitle">
                Flutter 전문 개발팀이 웹, 앱, 백엔드까지 원스톱으로 해결합니다.
                <br />
                MVP 최소 3주 완성, 앱 스토어 출시까지 책임집니다.
              </p>
            </Fade>
            <Fade direction="up" delay={300}>
              <div className="hero-actions">
                <Link
                  href="/consultation/start"
                  className="btn btn-primary btn-lg"
                >
                  무료 상담 시작하기
                </Link>
                <Link href="#portfolio" className="btn btn-secondary btn-lg">
                  포트폴리오 보기
                </Link>
              </div>
            </Fade>
            <Fade direction="up" delay={400}>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value">5+</div>
                  <div className="hero-stat-label">앱 스토어 출시</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">3주</div>
                  <div className="hero-stat-label">MVP 완성</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">10년</div>
                  <div className="hero-stat-label">테크 리더 경력</div>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section
        id="services"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/services-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center">
            <Fade direction="up">
              <p
                className="text-body-sm"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Our Services
              </p>
              <h2 className="text-h2">
                비즈니스 성장을 위한
                <br />
                <span style={{ color: "var(--primary)" }}>올인원 솔루션</span>
              </h2>
              <p
                className="text-body-lg text-secondary"
                style={{
                  marginTop: "var(--spacing-md)",
                  marginBottom: "var(--spacing-3xl)",
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                복잡한 IT 프로젝트, 이제 한 팀에서 모두 해결하세요
              </p>
            </Fade>
          </div>

          <div className="feature-grid">
            <Fade direction="up" delay={100}>
              <div className="feature-card">
                <div className="feature-icon feature-icon-gradient">
                  <span style={{ fontSize: "1.5rem" }}>📱</span>
                </div>
                <h3 className="feature-title text-h3">모바일 앱 개발</h3>
                <p className="feature-description">
                  Flutter로 iOS/Android 동시 개발
                  <br />
                  앱 스토어 출시 및 심사 대응까지 완벽 지원
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="feature-card">
                <div className="feature-icon feature-icon-gradient">
                  <span style={{ fontSize: "1.5rem" }}>🌐</span>
                </div>
                <h3 className="feature-title text-h3">웹 개발</h3>
                <p className="feature-description">
                  React, Next.js 기반 반응형 웹사이트
                  <br />
                  관리자 페이지, 랜딩 페이지, 커머스 플랫폼
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="feature-card">
                <div className="feature-icon feature-icon-gradient">
                  <span style={{ fontSize: "1.5rem" }}>⚙️</span>
                </div>
                <h3 className="feature-title text-h3">백엔드 개발</h3>
                <p className="feature-description">
                  Node.js, NestJS로 안정적인 서버 구축
                  <br />
                  AWS 인프라, CI/CD 파이프라인 구성
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={400}>
              <div className="feature-card">
                <div className="feature-icon feature-icon-gradient">
                  <span style={{ fontSize: "1.5rem" }}>🔔</span>
                </div>
                <h3 className="feature-title text-h3">네이티브 기능</h3>
                <p className="feature-description">
                  푸시 알림, 소셜 로그인, 결제 연동
                  <br />
                  GPS 위치, 카카오 알림톡, 실시간 알림
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--gray-50)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/why-us-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center">
            <Fade direction="up">
              <p
                className="text-body-sm"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Why Choose Us
              </p>
              <h2 className="text-h2">
                LeoFitTech를 선택하는 이유
              </h2>
              <p
                className="text-body-lg text-secondary"
                style={{
                  marginTop: "var(--spacing-md)",
                  marginBottom: "var(--spacing-3xl)",
                }}
              >
                앱 스토어 출시 5회 이상, 검증된 실력으로 신뢰를 드립니다
              </p>
            </Fade>
          </div>

          <div className="feature-grid">
            <Fade direction="up" delay={100}>
              <div className="feature-card">
                <div className="feature-icon">
                  <span style={{ fontSize: "1.5rem" }}>🚀</span>
                </div>
                <h3 className="feature-title text-h3">앱 스토어 출시 전문</h3>
                <p className="feature-description">
                  Google Play, App Store 출시 경험 5회 이상
                  <br />
                  심사 가이드라인 숙지, 리젝 대응 경험 풍부
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="feature-card">
                <div className="feature-icon">
                  <span style={{ fontSize: "1.5rem" }}>⚡</span>
                </div>
                <h3 className="feature-title text-h3">빠른 개발 속도</h3>
                <p className="feature-description">
                  MVP 최소 3주 완성, 1개월 풀패키지 가능
                  <br />
                  효율적인 프로세스와 템플릿 활용
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="feature-card">
                <div className="feature-icon">
                  <span style={{ fontSize: "1.5rem" }}>🔒</span>
                </div>
                <h3 className="feature-title text-h3">책임감 있는 A/S</h3>
                <p className="feature-description">
                  출시 후 1~3개월 무상 유지보수 제공
                  <br />
                  긴급 버그 24시간 대응, 약속한 일정 준수
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/process-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center">
            <Fade direction="up">
              <p
                className="text-body-sm"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Process
              </p>
              <h2 className="text-h2">프로젝트 진행 과정</h2>
              <p
                className="text-body-lg text-secondary"
                style={{
                  marginTop: "var(--spacing-md)",
                  marginBottom: "var(--spacing-3xl)",
                }}
              >
                체계적인 프로세스로 성공적인 결과를 보장합니다
              </p>
            </Fade>
          </div>

          <div className="process-steps">
            <Fade direction="up" delay={100}>
              <div className="process-step">
                <div className="process-number">1</div>
                <h3 className="process-title text-h3">상담 및 견적</h3>
                <p className="process-description">
                  프로젝트 목표 파악, 요구사항 정리
                  <br />
                  기술 스택 제안 및 견적서 제공
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="process-step">
                <div className="process-number">2</div>
                <h3 className="process-title text-h3">기획 & 설계</h3>
                <p className="process-description">
                  화면 설계서, DB 설계(ERD)
                  <br />
                  API 명세서 및 개발 일정 수립
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="process-step">
                <div className="process-number">3</div>
                <h3 className="process-title text-h3">개발 & 테스트</h3>
                <p className="process-description">
                  애자일 방식, 주간 미팅
                  <br />
                  테크 리더 코드 리뷰로 품질 보장
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={400}>
              <div className="process-step">
                <div className="process-number">4</div>
                <h3 className="process-title text-h3">배포 & A/S</h3>
                <p className="process-description">
                  앱 스토어 등록 및 심사 대응
                  <br />
                  1~3개월 무상 유지보수 지원
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      {/* <FullpageSection name="content04">
          <div className="content content04">
            <div className="content-box">
              <div className="title-box">
                <Fade direction="up">
                  <h2 className="title">
                    비용결제 <span className="primaryColor">ZERO</span>!
                  </h2>
                </Fade>
                <Fade delay={100} direction="up">
                  <p className="sub-text">
                    프로젝트 시작부터 매월 안정적인 금액을 납부하면서 <br />
                    대표님의 비즈니스를 성장시킬 수 있습니다.
                  </p>
                </Fade>
              </div>
              <div className="list">
                <Fade delay={200} direction="up">
                  <div className="item">
                    <div>
                      <Image
                        fetchPriority="high"
                        src="/images/Piggybank-2.png"
                        alt="Piggybank"
                        width={100}
                        height={90}
                      />
                      <div className="text">
                        <h2>2천만원 이하</h2>
                        <span>12개월 분납 가능</span>
                      </div>
                    </div>
                    <div>
                      <Image
                        fetchPriority="high"
                        src="/images/Isolation_Mode.png"
                        alt="Isolation Mode"
                        width={100}
                        height={50}
                        className="object-contain"
                      />
                      <div className="text">
                        <h2>2천만원 이상</h2>
                        <span>
                          선납금 30% 이후
                          <br />
                          12개월 분납 가능
                        </span>
                      </div>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </FullpageSection> */}
      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--gray-50)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/testimonials-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center">
            <Fade direction="up">
              <p
                className="text-body-sm"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Portfolio
              </p>
              <h2 className="text-h2">실제 출시된 프로젝트</h2>
              <p
                className="text-body-lg text-secondary"
                style={{
                  marginTop: "var(--spacing-md)",
                  marginBottom: "var(--spacing-3xl)",
                }}
              >
                앱 스토어에 출시된 실제 서비스들을 확인하세요
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-3 gap-xl">
            <Fade direction="up" delay={100}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>🏋️</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    브로 (체육관 관리 앱)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Flutter (iOS/Android)</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    회원 관리, 출석 체크, 푸시 알림 기능을 갖춘 체육관 통합 관리 솔루션
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>Supabase</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>FCM</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>1.5개월</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 앱 스토어 출시 완료
                  </div>
                </div>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>🌍</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    Playplanet (상점 탐색)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Flutter (iOS/Android)</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    위치 기반 피드, 포인트 시스템, NICEPAY/PASS 결제 연동
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>NICEPAY</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>PASS 인증</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>2개월</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 앱 스토어 출시 완료
                  </div>
                </div>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>📍</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    우링 (실시간 위치 추적)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Flutter (iOS/Android)</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    WebSocket 실시간 통신, 푸시 알림, 1인 풀스택 개발
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>WebSocket</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>GPS</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>1개월</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 앱 스토어 출시 완료
                  </div>
                </div>
              </div>
            </Fade>

            <Fade direction="up" delay={400}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>⛳</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    골프링 (골프장 예약)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>반응형 웹</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    검색, 예약 시스템, 카카오 알림톡, Slack API 실시간 로그
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>알림톡</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>Slack</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>3주</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 실제 서비스 운영 중
                  </div>
                </div>
              </div>
            </Fade>

            <Fade direction="up" delay={500}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>📰</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    AboutKorea (글로벌 뉴스)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Next.js + Flutter</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    소셜 로그인, 관리자 페이지, 다국어 지원 글로벌 서비스
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>다국어</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>OAuth</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>1.5개월</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 앱 스토어 출시 완료
                  </div>
                </div>
              </div>
            </Fade>

            <Fade direction="up" delay={600}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    padding: "var(--spacing-xl)",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>💪</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "var(--spacing-xs)" }}>
                    DevGym (자사 SaaS)
                  </h3>
                  <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>웹 + Flutter</p>
                </div>
                <div style={{ padding: "var(--spacing-lg)" }}>
                  <p className="text-body-sm" style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
                    체육관 통합 관리 SaaS, 관리자 웹 + 회원 앱 + 출석 앱
                  </p>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>SaaS</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>투자유치</span>
                    <span style={{ background: "var(--gray-100)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>3개월</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", color: "var(--success-green)", fontSize: "0.875rem" }}>
                    <span>✓</span> 100만원 투자 유치
                  </div>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div className="text-center">
            <Fade direction="up">
              <p
                className="text-body-sm"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Pricing
              </p>
              <h2 className="text-h2">투명한 가격 정책</h2>
              <p
                className="text-body-lg text-secondary"
                style={{
                  marginTop: "var(--spacing-md)",
                  marginBottom: "var(--spacing-3xl)",
                }}
              >
                프로젝트 규모에 맞는 최적의 상품을 선택하세요
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-3 gap-xl">
            <Fade direction="up" delay={100}>
              <div className="card" style={{ textAlign: "center", position: "relative" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--spacing-sm)", color: "var(--text-primary)" }}>
                  STANDARD
                </h3>
                <p className="text-body-sm" style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)" }}>
                  스타트업 MVP, 간단한 웹사이트
                </p>
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>80</span>
                  <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>만원~</span>
                </div>
                <ul style={{ textAlign: "left", marginBottom: "var(--spacing-xl)", listStyle: "none", padding: 0 }}>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 반응형 웹사이트
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 5-7 페이지
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 개발 기간 2주
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 수정 3회
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> A/S 1개월
                  </li>
                </ul>
                <Link href="/consultation/start" className="btn btn-secondary" style={{ width: "100%" }}>
                  상담 신청
                </Link>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="card" style={{ textAlign: "center", position: "relative", border: "2px solid var(--primary)", transform: "scale(1.05)" }}>
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--primary)", color: "white", padding: "4px 16px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>
                  추천
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--spacing-sm)", color: "var(--primary)" }}>
                  DELUXE
                </h3>
                <p className="text-body-sm" style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)" }}>
                  중소기업, 커뮤니티 앱
                </p>
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>180</span>
                  <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>만원~</span>
                </div>
                <ul style={{ textAlign: "left", marginBottom: "var(--spacing-xl)", listStyle: "none", padding: 0 }}>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 웹 + iOS/Android 앱
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 10-15 페이지
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 개발 기간 4주
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 푸시 알림, 소셜 로그인
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 앱 스토어 출시 포함
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> A/S 2개월
                  </li>
                </ul>
                <Link href="/consultation/start" className="btn btn-primary" style={{ width: "100%" }}>
                  상담 신청
                </Link>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="card" style={{ textAlign: "center", position: "relative" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--spacing-sm)", color: "var(--text-primary)" }}>
                  PREMIUM
                </h3>
                <p className="text-body-sm" style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)" }}>
                  대기업, 대규모 커머스
                </p>
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>350</span>
                  <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>만원~</span>
                </div>
                <ul style={{ textAlign: "left", marginBottom: "var(--spacing-xl)", listStyle: "none", padding: 0 }}>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 웹 + 앱 + 관리자
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 20+ 페이지
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 개발 기간 8주
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 결제, 정산 시스템
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> 전담 PM 배정
                  </li>
                  <li style={{ padding: "var(--spacing-sm) 0", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <span style={{ color: "var(--success-green)" }}>✓</span> A/S 3개월
                  </li>
                </ul>
                <Link href="/consultation/start" className="btn btn-secondary" style={{ width: "100%" }}>
                  상담 신청
                </Link>
              </div>
            </Fade>
          </div>

          <Fade direction="up" delay={400}>
            <div style={{ marginTop: "var(--spacing-3xl)", textAlign: "center" }}>
              <p className="text-body-sm" style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-md)" }}>
                추가 옵션
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-lg)", flexWrap: "wrap" }}>
                <span style={{ background: "var(--gray-100)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.875rem" }}>
                  결제 기능 +50만원
                </span>
                <span style={{ background: "var(--gray-100)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.875rem" }}>
                  실시간 채팅 +80만원
                </span>
                <span style={{ background: "var(--gray-100)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.875rem" }}>
                  소셜 로그인 +20만원
                </span>
                <span style={{ background: "var(--gray-100)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.875rem" }}>
                  푸시 알림 +40만원
                </span>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <div className="cta-content">
              <Fade direction="up">
                <h2 className="cta-title text-h2">
                  지금 바로 시작하세요
                </h2>
                <p className="cta-subtitle text-body-lg">
                  무료 상담을 통해 프로젝트 견적과 일정을 확인해보세요.
                  <br />
                  전문 컨설턴트가 24시간 내 연락드립니다.
                </p>
                <div className="hero-actions">
                  <Link
                    href="/consultation/start"
                    className="cta-button btn btn-lg"
                  >
                    무료 상담 신청하기
                  </Link>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer
        style={{
          background: "var(--gray-900)",
          color: "var(--text-inverse)",
          padding: "var(--spacing-4xl) 0 var(--spacing-xl)",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-4 gap-xl">
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--white)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                LeoFitTech
              </h3>
              <p
                style={{
                  color: "var(--gray-400)",
                  lineHeight: 1.7,
                  marginBottom: "var(--spacing-md)",
                }}
              >
                기획부터 런칭까지
                <br />
                함께 성장하는 개발 파트너
              </p>
              <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
                <span style={{ background: "var(--gray-800)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--gray-400)" }}>Flutter</span>
                <span style={{ background: "var(--gray-800)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--gray-400)" }}>React</span>
                <span style={{ background: "var(--gray-800)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--gray-400)" }}>Node.js</span>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontWeight: 600,
                  color: "var(--white)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                서비스
              </h4>
              <div style={{ color: "var(--gray-400)", lineHeight: 2 }}>
                <Link
                  href="#services"
                  style={{ color: "var(--gray-400)", textDecoration: "none" }}
                >
                  모바일 앱 개발
                </Link>
                <br />
                <Link
                  href="#services"
                  style={{ color: "var(--gray-400)", textDecoration: "none" }}
                >
                  웹 개발
                </Link>
                <br />
                <Link
                  href="#services"
                  style={{ color: "var(--gray-400)", textDecoration: "none" }}
                >
                  백엔드 개발
                </Link>
                <br />
                <Link
                  href="#services"
                  style={{ color: "var(--gray-400)", textDecoration: "none" }}
                >
                  앱 스토어 출시
                </Link>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontWeight: 600,
                  color: "var(--white)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                연락처
              </h4>
              <div style={{ color: "var(--gray-400)", lineHeight: 2 }}>
                contact@leofittech.com
                <br />
                전라북도 전주시
                <br />
                <span style={{ fontSize: "0.875rem" }}>영업시간: 평일 09:00 - 18:00</span>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontWeight: 600,
                  color: "var(--white)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                상담 문의
              </h4>
              <p
                style={{
                  color: "var(--gray-400)",
                  marginBottom: "var(--spacing-md)",
                  lineHeight: 1.6,
                }}
              >
                프로젝트에 대해 상담받고 싶으시다면
                <br />
                24시간 내 연락드립니다.
              </p>
              <Link href="/consultation/start" className="btn btn-primary btn-sm">
                무료 상담 신청
              </Link>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--gray-800)",
              paddingTop: "var(--spacing-xl)",
              marginTop: "var(--spacing-3xl)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--spacing-md)",
            }}
          >
            <p style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>
              © 2024 LeoFitTech. All rights reserved.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-lg)",
                fontSize: "0.875rem",
              }}
            >
              <Link
                href="/privacy-policy"
                style={{ color: "var(--gray-500)", textDecoration: "none" }}
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                style={{ color: "var(--gray-500)", textDecoration: "none" }}
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
