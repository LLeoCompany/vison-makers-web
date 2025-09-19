/**
 * 사회적 증거 showcase 컴포넌트
 * 실시간 활동, 고객 후기, 성과 지표를 통한 신뢰도 구축
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 실시간 활동 시뮬레이션을 위한 데이터
const LIVE_ACTIVITIES = [
  {
    id: 1,
    type: 'consultation',
    customerName: '김○○',
    action: '상담 신청',
    timeAgo: 2,
    location: '서울'
  },
  {
    id: 2,
    type: 'completion',
    customerName: '박○○',
    action: '프로젝트 완료',
    timeAgo: 37,
    location: '부산'
  },
  {
    id: 3,
    type: 'consultation',
    customerName: '이○○',
    action: '상담 신청',
    timeAgo: 12,
    location: '대구'
  },
  {
    id: 4,
    type: 'contract',
    customerName: '최○○',
    action: '계약 체결',
    timeAgo: 45,
    location: '인천'
  },
  {
    id: 5,
    type: 'consultation',
    customerName: '정○○',
    action: '상담 신청',
    timeAgo: 8,
    location: '광주'
  }
];

// 고객 후기 데이터
const TESTIMONIALS = [
  {
    id: 1,
    customerName: '김소영',
    company: '소영카페',
    business: '카페 운영',
    avatar: '/testimonials/customer1.jpg',
    rating: 5,
    content: '300만원 예산으로 홈페이지와 예약시스템까지 만들어주셨어요. 덕분에 매출이 30% 증가했습니다!',
    metrics: [
      { label: '예약 증가', value: '+200%' },
      { label: '매출 증가', value: '+30%' },
      { label: '제작 기간', value: '4주' }
    ],
    projectType: 'homepage',
    beforeAfter: {
      before: '전화 예약만 가능',
      after: '24시간 온라인 예약'
    }
  },
  {
    id: 2,
    customerName: '박진우',
    company: '미소치과',
    business: '치과 운영',
    avatar: '/testimonials/customer2.jpg',
    rating: 5,
    content: '다른 업체는 2천만원이라고 했는데, 여기서는 800만원에 더 좋은 결과를 만들어주셨어요.',
    metrics: [
      { label: '비용 절약', value: '1,200만원' },
      { label: '환자 증가', value: '+40%' },
      { label: '예약률', value: '95%' }
    ],
    projectType: 'booking',
    beforeAfter: {
      before: '수기 예약 관리',
      after: '자동 예약 시스템'
    }
  },
  {
    id: 3,
    customerName: '최민정',
    company: '민정샵',
    business: '온라인 쇼핑몰',
    avatar: '/testimonials/customer3.jpg',
    rating: 5,
    content: '쇼핑몰 오픈 후 첫 달에 500만원 매출! 모바일에서도 완벽하게 작동해서 만족해요.',
    metrics: [
      { label: '첫 달 매출', value: '500만원' },
      { label: '모바일 비율', value: '78%' },
      { label: '재구매율', value: '35%' }
    ],
    projectType: 'shopping',
    beforeAfter: {
      before: '오프라인 판매만',
      after: '24시간 온라인 판매'
    }
  },
  {
    id: 4,
    customerName: '이현수',
    company: '현수헬스',
    business: '피트니스센터',
    avatar: '/testimonials/customer4.jpg',
    rating: 5,
    content: '회원 관리가 이렇게 쉬울 줄 몰랐어요. 관리 시간은 50% 줄고, 신규 회원은 두 배로 늘었습니다.',
    metrics: [
      { label: '신규 회원', value: '+100%' },
      { label: '관리 시간', value: '-50%' },
      { label: '만족도', value: '98%' }
    ],
    projectType: 'membership',
    beforeAfter: {
      before: '엑셀로 수기 관리',
      after: '자동 회원 관리 시스템'
    }
  }
];

// 성과 지표 데이터
const ACHIEVEMENTS = [
  {
    number: '1,247',
    label: '프로젝트 완성',
    period: '2019-2024',
    icon: '🚀',
    trend: '+23% (작년 대비)'
  },
  {
    number: '98%',
    label: '고객 만족도',
    period: '5점 기준 4.9점',
    icon: '⭐',
    trend: '6개월 연속 98% 이상'
  },
  {
    number: '24시간',
    label: '평균 응답시간',
    period: '최대 48시간',
    icon: '⚡',
    trend: '업계 최고 수준'
  },
  {
    number: '50%',
    label: '비용 절감',
    period: '타 업체 대비',
    icon: '💰',
    trend: '평균 2,000만원 절약'
  }
];

// 클라이언트 로고 데이터
const CLIENT_LOGOS = [
  { name: '소영카페', logo: '/logos/client1.png' },
  { name: '미소치과', logo: '/logos/client2.png' },
  { name: '민정샵', logo: '/logos/client3.png' },
  { name: '현수헬스', logo: '/logos/client4.png' },
  { name: '한빛학원', logo: '/logos/client5.png' },
  { name: '바다펜션', logo: '/logos/client6.png' },
  { name: '행복병원', logo: '/logos/client7.png' },
  { name: '꿈의미용실', logo: '/logos/client8.png' }
];

export const SocialProofShowcase: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    consultationsToday: 23,
    projectsCompleted: 1247,
    activeUsers: 156
  });

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // 실시간 활동 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);

      // 통계 랜덤 업데이트 (소폭)
      setLiveStats(prev => ({
        consultationsToday: prev.consultationsToday + Math.floor(Math.random() * 2),
        projectsCompleted: prev.projectsCompleted,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="social-proof-showcase">
      {/* 실시간 활동 표시 */}
      <LiveActivitySection
        activities={LIVE_ACTIVITIES}
        currentIndex={currentActivityIndex}
        stats={liveStats}
      />

      {/* 고객 성공 사례 */}
      <TestimonialsSection testimonials={TESTIMONIALS} />

      {/* 성과 지표 */}
      <AchievementsSection achievements={ACHIEVEMENTS} />

      {/* 클라이언트 로고 */}
      <ClientLogosSection logos={CLIENT_LOGOS} />

      {/* 업계 전문가 추천 */}
      <ExpertEndorsementSection />
    </div>
  );
};

// 실시간 활동 섹션
interface LiveActivitySectionProps {
  activities: typeof LIVE_ACTIVITIES;
  currentIndex: number;
  stats: typeof liveStats;
}

const LiveActivitySection: React.FC<LiveActivitySectionProps> = ({
  activities,
  currentIndex,
  stats
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '💬';
      case 'completion': return '✅';
      case 'contract': return '📄';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'consultation': return '#4299E1';
      case 'completion': return '#48BB78';
      case 'contract': return '#FF6B35';
      default: return '#718096';
    }
  };

  return (
    <section className="live-activity-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="live-indicator">🔴</span>
            실시간 활동
          </h2>
          <p className="section-description">지금 이 순간에도 계속되고 있어요</p>
        </div>

        <div className="live-content">
          {/* 현재 활동 */}
          <div className="current-activity">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`activity-item ${index === currentIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  opacity: index === currentIndex ? 1 : 0
                }}
              >
                <div
                  className="activity-icon"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.customerName}님</strong>이{' '}
                    <span className="time">{activity.timeAgo}분 전</span>{' '}
                    {activity.action}했습니다
                  </div>
                  <div className="activity-location">📍 {activity.location}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 실시간 통계 */}
          <div className="live-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.consultationsToday}</div>
              <div className="stat-label">오늘 상담 신청</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.projectsCompleted.toLocaleString()}</div>
              <div className="stat-label">총 프로젝트</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.activeUsers}</div>
              <div className="stat-label">현재 접속자</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 고객 후기 섹션
interface TestimonialsSectionProps {
  testimonials: typeof TESTIMONIALS;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">고객들이 말하는 VisionMakers</h2>
          <p className="section-description">실제 고객들의 솔직한 후기입니다</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            }
          }}
          className="testimonials-slider"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.customerName}
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="30" cy="30" r="30" fill="#E2E8F0"/>
                              <text x="30" y="35" text-anchor="middle" fill="#4A5568" font-size="18">
                                ${testimonial.customerName[0]}
                              </text>
                            </svg>
                          `)}`;
                        }}
                      />
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">{testimonial.customerName} 대표</div>
                      <div className="customer-company">{testimonial.company}</div>
                      <div className="customer-business">{testimonial.business}</div>
                    </div>
                  </div>

                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                </div>

                <div className="testimonial-content">
                  <blockquote className="testimonial-text">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="testimonial-metrics">
                    {testimonial.metrics.map((metric, index) => (
                      <div key={index} className="metric">
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-label">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="before-after">
                    <div className="before-after-item">
                      <div className="before-after-label">이전</div>
                      <div className="before-after-content">{testimonial.beforeAfter.before}</div>
                    </div>
                    <div className="arrow">→</div>
                    <div className="before-after-item">
                      <div className="before-after-label">이후</div>
                      <div className="before-after-content">{testimonial.beforeAfter.after}</div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

// 성과 지표 섹션
interface AchievementsSectionProps {
  achievements: typeof ACHIEVEMENTS;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector('.achievements-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="achievements-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">숫자로 보는 VisionMakers</h2>
          <p className="section-description">검증된 실력과 경험</p>
        </div>

        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-card ${isVisible ? 'animate' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-number">
                <CountUpNumber
                  target={achievement.number}
                  isVisible={isVisible}
                />
              </div>
              <div className="achievement-label">{achievement.label}</div>
              <div className="achievement-period">{achievement.period}</div>
              <div className="achievement-trend">{achievement.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 숫자 카운트업 컴포넌트
const CountUpNumber: React.FC<{ target: string; isVisible: boolean }> = ({
  target,
  isVisible
}) => {
  const [current, setCurrent] = useState('0');

  useEffect(() => {
    if (!isVisible) return;

    // 숫자인 경우에만 카운트업 애니메이션
    const numericValue = target.replace(/[^0-9]/g, '');
    if (numericValue) {
      const targetNum = parseInt(numericValue);
      const duration = 2000;
      const steps = 60;
      const increment = targetNum / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const currentNum = Math.min(Math.floor(increment * step), targetNum);
        setCurrent(target.replace(numericValue, currentNum.toLocaleString()));

        if (step >= steps) {
          clearInterval(timer);
          setCurrent(target);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setCurrent(target);
    }
  }, [target, isVisible]);

  return <span>{current}</span>;
};

// 클라이언트 로고 섹션
interface ClientLogosSectionProps {
  logos: typeof CLIENT_LOGOS;
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ logos }) => {
  return (
    <section className="client-logos-section">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">함께한 브랜드들</h3>
          <p className="section-description">다양한 업종의 1,200+ 고객사</p>
        </div>

        <div className="logos-container">
          <div className="logos-grid">
            {logos.map((client, index) => (
              <div key={index} className="logo-item">
                <img
                  src={client.logo}
                  alt={client.name}
                  onError={(e) => {
                    // 이미지 로드 실패 시 텍스트로 대체
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback" style={{ display: 'none' }}>
                  {client.name}
                </div>
              </div>
            ))}
          </div>

          <div className="more-clients">
            <span className="plus-icon">+</span>
            <span className="more-text">200개 브랜드</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 업계 전문가 추천 섹션
const ExpertEndorsementSection: React.FC = () => {
  return (
    <section className="expert-endorsement-section">
      <div className="container">
        <div className="endorsement-card">
          <div className="expert-profile">
            <div className="expert-photo">
              <img
                src="/experts/digital-marketing-expert.jpg"
                alt="이현수 전문가"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="40" r="40" fill="#4299E1"/>
                      <text x="40" y="45" text-anchor="middle" fill="white" font-size="24">이</text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            <div className="expert-info">
              <div className="expert-name">이현수</div>
              <div className="expert-title">디지털마케팅 전문가</div>
              <div className="expert-credentials">前 네이버 마케팅팀장</div>
              <div className="expert-experience">15년 경력</div>
            </div>
          </div>

          <blockquote className="endorsement-text">
            "VisionMakers는 중소기업에게 가장 적합한 웹 솔루션을 제공합니다.
            <span className="highlight">합리적인 가격에 높은 품질</span>을 원한다면 강력 추천합니다."
          </blockquote>

          <div className="endorsement-credentials">
            <div className="credential">
              <span className="credential-icon">📜</span>
              <span className="credential-text">Google 공인 전문가</span>
            </div>
            <div className="credential">
              <span className="credential-icon">🏆</span>
              <span className="credential-text">디지털마케팅 대상 수상</span>
            </div>
            <div className="credential">
              <span className="credential-icon">📚</span>
              <span className="credential-text">『웹마케팅 성공법칙』 저자</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofShowcase;