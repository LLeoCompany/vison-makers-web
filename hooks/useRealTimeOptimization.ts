/**
 * 실시간 최적화 훅
 * 전환율 모니터링, 자동 개선 제안, 실시간 조정
 */

import { useState, useEffect, useCallback } from 'react';

// 최적화 메트릭 인터페이스
interface OptimizationMetrics {
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  ctaClickRate: number;
  formAbandonmentRate: number;
  scrollDepth: number;
  exitIntentRate: number;
  mobileConversionRate: number;
  desktopConversionRate: number;
}

// 개선 제안 인터페이스
interface OptimizationRecommendation {
  id: string;
  type: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  expectedImprovement: string;
  implementation: 'immediate' | 'testing' | 'development';
  priority: number;
  category: 'ui' | 'content' | 'flow' | 'technical';
}

// 실시간 최적화 훅
export const useRealTimeOptimization = () => {
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    conversionRate: 0,
    bounceRate: 0,
    avgTimeOnPage: 0,
    ctaClickRate: 0,
    formAbandonmentRate: 0,
    scrollDepth: 0,
    exitIntentRate: 0,
    mobileConversionRate: 0,
    desktopConversionRate: 0
  });

  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  // 실시간 메트릭 수집
  useEffect(() => {
    const collectMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/real-time-metrics');
        const data = await response.json();

        if (data.success) {
          setMetrics(data.metrics);

          // 메트릭이 임계값 이하일 때 최적화 제안 생성
          if (data.metrics.conversionRate < 2.0) {
            generateOptimizationRecommendations(data.metrics);
          }
        }
      } catch (error) {
        console.error('Failed to collect real-time metrics:', error);
      }
    };

    // 초기 로드
    collectMetrics();

    // 30초마다 메트릭 업데이트
    const interval = setInterval(collectMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  // 페이지 레벨 최적화 추천 생성
  const generateOptimizationRecommendations = useCallback((currentMetrics: OptimizationMetrics) => {
    const newRecommendations: OptimizationRecommendation[] = [];

    // 전환율이 낮은 경우
    if (currentMetrics.conversionRate < 1.5) {
      newRecommendations.push({
        id: 'low_conversion_rate',
        type: 'critical',
        title: '전환율 개선 필요',
        description: '현재 전환율이 업계 평균(2.5%) 대비 낮습니다. CTA 버튼 최적화를 권장합니다.',
        expectedImprovement: '+50% 전환율 증가',
        implementation: 'immediate',
        priority: 1,
        category: 'ui'
      });
    }

    // 이탈률이 높은 경우
    if (currentMetrics.bounceRate > 60) {
      newRecommendations.push({
        id: 'high_bounce_rate',
        type: 'important',
        title: '이탈률 개선 필요',
        description: '방문자의 60% 이상이 첫 페이지에서 이탈하고 있습니다. 헤드라인과 첫 인상을 개선해야 합니다.',
        expectedImprovement: '-30% 이탈률 감소',
        implementation: 'testing',
        priority: 2,
        category: 'content'
      });
    }

    // CTA 클릭률이 낮은 경우
    if (currentMetrics.ctaClickRate < 5) {
      newRecommendations.push({
        id: 'low_cta_click_rate',
        type: 'important',
        title: 'CTA 버튼 최적화',
        description: 'CTA 클릭률이 5% 미만입니다. 버튼 색상, 크기, 위치를 조정해보세요.',
        expectedImprovement: '+100% CTA 클릭률 증가',
        implementation: 'immediate',
        priority: 3,
        category: 'ui'
      });
    }

    // 폼 포기율이 높은 경우
    if (currentMetrics.formAbandonmentRate > 30) {
      newRecommendations.push({
        id: 'high_form_abandonment',
        type: 'critical',
        title: '상담신청 폼 단순화',
        description: '30% 이상의 사용자가 폼 작성을 포기하고 있습니다. 입력 항목을 줄이거나 단계를 나누어보세요.',
        expectedImprovement: '+40% 폼 완료율 증가',
        implementation: 'development',
        priority: 1,
        category: 'flow'
      });
    }

    // 스크롤 깊이가 낮은 경우
    if (currentMetrics.scrollDepth < 50) {
      newRecommendations.push({
        id: 'low_scroll_depth',
        type: 'suggestion',
        title: '콘텐츠 참여도 개선',
        description: '사용자들이 페이지의 50% 미만만 읽고 있습니다. 더 매력적인 콘텐츠나 시각적 요소가 필요합니다.',
        expectedImprovement: '+25% 페이지 참여도 증가',
        implementation: 'testing',
        priority: 4,
        category: 'content'
      });
    }

    // 모바일 전환율이 낮은 경우
    if (currentMetrics.mobileConversionRate < currentMetrics.desktopConversionRate * 0.7) {
      newRecommendations.push({
        id: 'mobile_optimization',
        type: 'important',
        title: '모바일 최적화 필요',
        description: '모바일 전환율이 데스크톱 대비 현저히 낮습니다. 모바일 UX를 개선해야 합니다.',
        expectedImprovement: '+80% 모바일 전환율 증가',
        implementation: 'development',
        priority: 2,
        category: 'technical'
      });
    }

    // 우선순위 순으로 정렬
    newRecommendations.sort((a, b) => a.priority - b.priority);

    setRecommendations(newRecommendations);
  }, []);

  // 자동 최적화 실행
  const executeAutoOptimization = useCallback(async () => {
    setIsOptimizing(true);

    try {
      // 즉시 적용 가능한 최적화들만 실행
      const immediateOptimizations = recommendations.filter(
        rec => rec.implementation === 'immediate'
      );

      for (const optimization of immediateOptimizations) {
        await applyOptimization(optimization);
      }

      setLastOptimization(new Date());

      // 최적화 적용 이벤트 추적
      gtag('event', 'auto_optimization_applied', {
        event_category: 'Optimization',
        optimization_count: immediateOptimizations.length,
        applied_optimizations: immediateOptimizations.map(opt => opt.id)
      });

    } catch (error) {
      console.error('Auto optimization failed:', error);

      gtag('event', 'auto_optimization_failed', {
        event_category: 'Error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

    } finally {
      setIsOptimizing(false);
    }
  }, [recommendations]);

  // 개별 최적화 적용
  const applyOptimization = async (optimization: OptimizationRecommendation) => {
    switch (optimization.id) {
      case 'low_conversion_rate':
        // CTA 버튼 스타일 동적 변경
        updateCtaButtonStyle();
        break;

      case 'low_cta_click_rate':
        // CTA 버튼 위치 및 크기 조정
        enhanceCtaVisibility();
        break;

      case 'low_scroll_depth':
        // 스크롤 인센티브 추가
        addScrollIncentives();
        break;

      default:
        console.log(`No auto-implementation for optimization: ${optimization.id}`);
    }
  };

  // CTA 버튼 스타일 최적화
  const updateCtaButtonStyle = () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
      const element = button as HTMLElement;

      // 더 눈에 띄는 색상으로 변경
      element.style.background = 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)';
      element.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'all 0.3s ease';

      // 펄스 애니메이션 추가
      element.classList.add('pulse-animation');
    });

    // CSS 애니메이션 추가
    if (!document.querySelector('#optimization-styles')) {
      const style = document.createElement('style');
      style.id = 'optimization-styles';
      style.textContent = `
        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4); }
          50% { box-shadow: 0 8px 24px rgba(255, 107, 53, 0.8); }
          100% { box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4); }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // CTA 가시성 강화
  const enhanceCtaVisibility = () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
      const element = button as HTMLElement;

      // 크기 증가
      element.style.padding = '20px 40px';
      element.style.fontSize = '20px';
      element.style.fontWeight = '800';

      // 주변 여백 증가로 더 눈에 띄게
      element.style.margin = '40px auto';

      // 스티키 위치로 변경 (스크롤 시에도 보이게)
      if (element.classList.contains('hero-cta')) {
        element.style.position = 'sticky';
        element.style.top = '20px';
        element.style.zIndex = '100';
      }
    });
  };

  // 스크롤 인센티브 추가
  const addScrollIncentives = () => {
    // 스크롤 진행률 표시기 추가
    if (!document.querySelector('#scroll-progress')) {
      const progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #FF6B35, #F7931E);
        z-index: 9999;
        transition: width 0.3s ease;
      `;
      document.body.appendChild(progressBar);

      // 스크롤 이벤트 리스너
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      });
    }

    // 스크롤 깊이별 리워드 메시지
    const scrollMilestones = [25, 50, 75];
    scrollMilestones.forEach(milestone => {
      window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / document.body.scrollHeight) * 100;

        if (scrolled >= milestone && !sessionStorage.getItem(`milestone_${milestone}`)) {
          sessionStorage.setItem(`milestone_${milestone}`, 'true');
          showScrollReward(milestone);
        }
      });
    });
  };

  // 스크롤 리워드 메시지 표시
  const showScrollReward = (milestone: number) => {
    const messages = {
      25: '좋아요! 계속 읽어보세요 📖',
      50: '반쯤 왔네요! 조금만 더 💪',
      75: '거의 다 봤어요! 마지막까지 🎯'
    };

    const reward = document.createElement('div');
    reward.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #48BB78;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.5s ease;
      box-shadow: 0 8px 24px rgba(72, 187, 120, 0.3);
    `;
    reward.textContent = messages[milestone as keyof typeof messages];
    document.body.appendChild(reward);

    // 애니메이션
    setTimeout(() => reward.style.transform = 'translateX(0)', 100);
    setTimeout(() => reward.style.transform = 'translateX(100%)', 3000);
    setTimeout(() => document.body.removeChild(reward), 3500);
  };

  // 수동 최적화 제안 적용
  const applyRecommendation = useCallback(async (recommendationId: string) => {
    const recommendation = recommendations.find(rec => rec.id === recommendationId);
    if (!recommendation) return;

    try {
      await applyOptimization(recommendation);

      // 적용된 추천 제거
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));

      gtag('event', 'manual_optimization_applied', {
        event_category: 'Optimization',
        optimization_id: recommendationId
      });

    } catch (error) {
      console.error('Failed to apply recommendation:', error);
    }
  }, [recommendations]);

  // 실시간 성능 모니터링
  const monitorPerformance = useCallback(() => {
    // Core Web Vitals 측정
    if ('web-vital' in window) {
      // LCP (Largest Contentful Paint)
      (window as any).webVitals.getLCP((metric: any) => {
        if (metric.value > 2500) { // 2.5초 초과
          setRecommendations(prev => [...prev, {
            id: 'slow_lcp',
            type: 'critical',
            title: '페이지 로딩 속도 개선',
            description: 'LCP가 2.5초를 초과합니다. 이미지 최적화나 서버 응답 시간 개선이 필요합니다.',
            expectedImprovement: '+20% 전환율 증가',
            implementation: 'development',
            priority: 1,
            category: 'technical'
          }]);
        }
      });

      // FID (First Input Delay)
      (window as any).webVitals.getFID((metric: any) => {
        if (metric.value > 100) { // 100ms 초과
          setRecommendations(prev => [...prev, {
            id: 'slow_fid',
            type: 'important',
            title: '인터랙션 반응 속도 개선',
            description: 'FID가 100ms를 초과합니다. JavaScript 실행 시간을 줄여야 합니다.',
            expectedImprovement: '+15% 사용자 만족도 증가',
            implementation: 'development',
            priority: 2,
            category: 'technical'
          }]);
        }
      });
    }
  }, []);

  // 성능 모니터링 시작
  useEffect(() => {
    monitorPerformance();
  }, [monitorPerformance]);

  return {
    metrics,
    recommendations,
    isOptimizing,
    lastOptimization,
    executeAutoOptimization,
    applyRecommendation
  };
};

export default useRealTimeOptimization;