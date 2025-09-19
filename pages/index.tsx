import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

const Index = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="header-nav">
            <Link href="/" className="logo">
              VisionMakers
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
        <div className="container">
          <div className="hero-content">
            <Fade direction="up">
              <h1 className="text-hero">
                기획부터 디자인, 개발까지{" "}
                <span className="text-red">한 번에</span>
              </h1>
            </Fade>
            <Fade direction="up" delay={200}>
              <p className="text-body-lg hero-subtitle">
                500+ 기업이 선택한 신뢰할 수 있는 웹 개발 파트너
                <br />
                전담 기획자와 함께 성공적인 프로젝트를 만들어보세요
              </p>
            </Fade>
            <Fade direction="up" delay={400}>
              <div className="hero-actions">
                <Link
                  href="/consultation/start"
                  className="btn btn-primary btn-lg"
                >
                  🚀 5분만에 무료 견적받기
                </Link>
                <Link href="#portfolio" className="btn btn-secondary btn-lg">
                  포트폴리오 보기
                </Link>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      {/* Problem-Solution Section */}
      <section id="services" className="section bg-gray">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-xl">
            <Fade direction="left">
              <div>
                <h2 className="text-h2 m-md">😰 이런 고민 있으시죠?</h2>
                <div className="grid gap-md">
                  <div className="card-simple">
                    <p className="text-body">
                      ❌ 홈페이지는 있는데 문의가 안 들어온다
                    </p>
                  </div>
                  <div className="card-simple">
                    <p className="text-body">
                      ❌ 경쟁사보다 우리 사이트가 구식으로 보인다
                    </p>
                  </div>
                  <div className="card-simple">
                    <p className="text-body">
                      ❌ 모바일에서 제대로 안 보여서 고객을 놓친다
                    </p>
                  </div>
                  <div className="card-simple">
                    <p className="text-body">
                      ❌ 관리가 어려워서 업데이트를 못하고 있다
                    </p>
                  </div>
                </div>
              </div>
            </Fade>
            <Fade direction="right">
              <div>
                <h2 className="text-h2 text-green m-md">
                  ✅ VisionMakers 솔루션
                </h2>
                <div className="grid gap-md">
                  <div className="card">
                    <h3 className="text-h3 text-green">
                      매월 평균 30% 더 많은 문의 유치
                    </h3>
                    <p className="text-secondary">전환율 최적화된 UX/UI 설계</p>
                  </div>
                  <div className="card">
                    <h3 className="text-h3 text-green">
                      모던하고 전문적인 디자인
                    </h3>
                    <p className="text-secondary">
                      브랜드 가치를 높이는 차별화된 디자인
                    </p>
                  </div>
                  <div className="card">
                    <h3 className="text-h3 text-green">
                      완벽한 반응형 웹사이트
                    </h3>
                    <p className="text-secondary">
                      모든 디바이스에서 최적화된 사용자 경험
                    </p>
                  </div>
                  <div className="card">
                    <h3 className="text-h3 text-green">직관적 관리자 시스템</h3>
                    <p className="text-secondary">
                      누구나 쉽게 업데이트할 수 있는 CMS
                    </p>
                  </div>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      {/* Process Section */}
      <section id="process" className="section">
        <div className="container">
          <div className="text-center">
            <Fade direction="up">
              <h2 className="text-h2">🚀 VisionMakers만의 3가지 차별점</h2>
              <p className="text-body-lg text-secondary m-lg">
                500+ 프로젝트 경험으로 검증된 성공 프로세스
              </p>
            </Fade>
          </div>

          <div className="feature-grid">
            <Fade direction="up" delay={100}>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title text-h3">데이터 기반 설계</h3>
                <p className="feature-description">
                  구글 애널리틱스 분석으로 최적화된 전환율 설계
                  <br />
                  사용자 행동 패턴을 반영한 UX/UI
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="feature-card">
                <div className="feature-icon">👤</div>
                <h3 className="feature-title text-h3">전담 PM 배정</h3>
                <p className="feature-description">
                  프로젝트 시작부터 완료까지 한 명이 책임지고 관리
                  <br />
                  체계적인 소통과 일정 관리
                </p>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="feature-card">
                <div className="feature-icon">🛠️</div>
                <h3 className="feature-title text-h3">6개월 무료 지원</h3>
                <p className="feature-description">
                  런칭 후 6개월간 무료 수정 및 기술지원
                  <br />
                  안정적인 서비스 운영 보장
                </p>
              </div>
            </Fade>
          </div>

          <div className="text-center m-xl">
            <h2 className="text-h2 m-lg">프로젝트 진행 과정</h2>
            <div className="process-steps">
              <Fade direction="up" delay={100}>
                <div className="process-step">
                  <div className="process-number">1</div>
                  <h3 className="process-title text-h3">무료 컨설팅</h3>
                  <p className="process-description">
                    프로젝트 범위, 예산, 일정 논의
                    <br />
                    초기 아이디어 구체화
                  </p>
                </div>
              </Fade>

              <Fade direction="up" delay={200}>
                <div className="process-step">
                  <div className="process-number">2</div>
                  <h3 className="process-title text-h3">전문 기획</h3>
                  <p className="process-description">
                    전담 기획자와 상세 기획안 작성
                    <br />
                    목표와 실행 계획 명확화
                  </p>
                </div>
              </Fade>

              <Fade direction="up" delay={300}>
                <div className="process-step">
                  <div className="process-number">3</div>
                  <h3 className="process-title text-h3">디자인 & 개발</h3>
                  <p className="process-description">
                    최신 기술 스택으로 개발
                    <br />
                    지속적인 테스트와 품질 관리
                  </p>
                </div>
              </Fade>

              <Fade direction="up" delay={400}>
                <div className="process-step">
                  <div className="process-number">4</div>
                  <h3 className="process-title text-h3">배포 & 지원</h3>
                  <p className="process-description">
                    안정적 배포 및 런칭
                    <br />
                    6개월 무료 지원 서비스
                  </p>
                </div>
              </Fade>
            </div>
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
      {/* Social Proof Section */}
      <section id="portfolio" className="section bg-gray">
        <div className="container">
          <div className="text-center">
            <Fade direction="up">
              <h2 className="text-h2">🎖️ 고객들의 실제 후기</h2>
              <p className="text-body-lg text-secondary m-lg">
                500+ 기업이 선택한 이유가 있습니다
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-3 gap-xl">
            <Fade direction="up" delay={100}>
              <div className="card">
                <div className="text-yellow text-h3 m-sm">⭐⭐⭐⭐⭐</div>
                <p className="text-body m-md">
                  "3개월 만에 매출이 180% 증가했습니다. 정말 놀라운 결과에요!"
                </p>
                <div className="text-caption">- 김대표, 스타트업 A사</div>
              </div>
            </Fade>

            <Fade direction="up" delay={200}>
              <div className="card">
                <div className="text-yellow text-h3 m-sm">⭐⭐⭐⭐⭐</div>
                <p className="text-body m-md">
                  "관리가 이렇게 쉬울 줄 몰랐어요. 직원들도 금방 배웠습니다."
                </p>
                <div className="text-caption">- 박차장, 중소기업 B사</div>
              </div>
            </Fade>

            <Fade direction="up" delay={300}>
              <div className="card">
                <div className="text-yellow text-h3 m-sm">⭐⭐⭐⭐⭐</div>
                <p className="text-body m-md">
                  "문의가 3배나 늘었고, 고객들이 '사이트가 전문적'이라고 해요."
                </p>
                <div className="text-caption">- 이대표, 제조업 C사</div>
              </div>
            </Fade>
          </div>

          <div className="text-center m-xl">
            <div className="text-h3 text-primary">
              평균 만족도 4.8/5 ⭐⭐⭐⭐⭐
            </div>
            <div className="text-body text-secondary">(127개 리뷰 기준)</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <div className="cta-content">
              <Fade direction="up">
                <h2 className="cta-title text-h2">
                  🎉 지금 시작하면 특별 혜택!
                </h2>
                <p className="cta-subtitle text-body-lg">
                  💰 런칭 기념 20% 할인 (이달 한정)
                  <br />
                  📞 24시간 내 1:1 무료 컨설팅
                  <br />
                  🎯 경쟁사 분석 리포트 무료 제공
                </p>
                <div className="hero-actions">
                  <Link
                    href="/consultation/start"
                    className="cta-button btn btn-lg"
                  >
                    🔥 특별혜택 받고 상담 신청하기
                  </Link>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="section bg-primary-dark text-white">
        <div className="container">
          <div className="grid grid-cols-4 gap-xl">
            <div>
              <h3 className="text-h3 text-white m-md">VisionMakers</h3>
              <p className="text-body text-gray-300">
                대한민국 최고의 웹 솔루션 파트너
              </p>
              <div className="text-caption text-gray-400 m-sm">
                🏆 2024 우수 웹에이전시 선정
                <br />
                한국웹산업협회
              </div>
            </div>

            <div>
              <h4 className="text-h3 text-white m-md">연락처</h4>
              <div className="text-body text-gray-300">
                ☎️ 010-9915-4724
                <br />
                📧 contact@visionmakers.co.kr
                <br />
                📍 서울시 강남구 테헤란로
              </div>
            </div>

            <div>
              <h4 className="text-h3 text-white m-md">바로가기</h4>
              <div className="text-body text-gray-300">
                •{" "}
                <Link
                  href="#portfolio"
                  className="text-gray-300 hover:text-white"
                >
                  포트폴리오
                </Link>
                <br />•{" "}
                <Link
                  href="#process"
                  className="text-gray-300 hover:text-white"
                >
                  성공사례
                </Link>
                <br />•{" "}
                <Link href="#about" className="text-gray-300 hover:text-white">
                  요금안내
                </Link>
                <br />•{" "}
                <Link
                  href="#contact"
                  className="text-gray-300 hover:text-white"
                >
                  고객후기
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-h3 text-white m-md">📞 마지막 기회!</h4>
              <p className="text-body text-gray-300 m-sm">
                놓치기 전에 상담받으세요
              </p>
              <Link href="/consultation/start" className="btn btn-primary">
                지금 무료 상담 신청하기
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4 mt-8 text-center">
            <p className="text-caption text-gray-400">
              © 2024 VisionMakers. All rights reserved. | 고객 만족도 4.8/5
              ⭐⭐⭐⭐⭐
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
