/**
 * A/B 테스트 훅
 * 실시간 최적화 및 사용자 세그먼트 기반 변형 할당
 */

import { useState, useEffect } from "react";

// A/B 테스트 설정 인터페이스
interface ABTestConfig {
  testName: string;
  variants: Record<string, any>;
  trafficAllocation?: number; // 0-100, 테스트에 참여할 트래픽 비율
  userSegments?: string[]; // 특정 사용자 세그먼트만 대상
  startDate?: Date;
  endDate?: Date;
}

// 사용자 세그먼트 타입
type UserSegment =
  | "new_visitor"
  | "returning_visitor"
  | "mobile_user"
  | "desktop_user"
  | "organic_traffic"
  | "paid_traffic"
  | "high_intent"
  | "low_intent";

// A/B 테스트 결과 인터페이스
interface ABTestResult {
  variant: any;
  variantName: string;
  isParticipating: boolean;
  trackConversion: (conversionType: string, value?: number) => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

// 사전 정의된 A/B 테스트들
export const AB_TESTS: Record<string, ABTestConfig> = {
  // 헤드라인 테스트
  headline_test: {
    testName: "headline_test",
    variants: {
      CONTROL: "웹사이트 제작 전문 업체 LeoFitTech",
      BENEFIT_FOCUSED: "웹사이트 제작비 50% 절약하는 방법",
      PROBLEM_FOCUSED: "웹사이트 제작, 복잡하고 비싸서 고민이세요?",
      URGENCY_FOCUSED: "이번 달 한정! 웹사이트 제작 특가 이벤트",
      SOCIAL_PROOF: "1,247개 기업이 선택한 웹사이트 제작 서비스",
    },
    trafficAllocation: 80,
  },

  // CTA 버튼 테스트
  cta_test: {
    testName: "cta_test",
    variants: {
      CONTROL: "상담 신청하기",
      BENEFIT: "지금 무료 상담 받기",
      URGENCY: "5분만에 견적 확인하기",
      EMOJI: "💬 무료로 상담받기",
      SPECIFIC: "맞춤 견적서 받기",
      ACTION: "프로젝트 시작하기",
    },
    trafficAllocation: 100,
  },

  // 폼 길이 테스트
  form_length_test: {
    testName: "form_length_test",
    variants: {
      CONTROL: "standard_form", // 기본 4단계
      SHORT: "minimal_form", // 2단계로 축소
      LONG: "detailed_form", // 6단계로 확장
    },
    trafficAllocation: 60,
    userSegments: ["new_visitor"],
  },

  // 가격 표시 테스트
  pricing_display_test: {
    testName: "pricing_display_test",
    variants: {
      CONTROL: "range_pricing", // 범위로 표시 (300-800만원)
      STARTING_FROM: "starting_pricing", // ~부터 표시 (300만원부터)
      COMPARISON: "comparison_pricing", // 비교 표시 (타사 대비 50% 절약)
    },
    trafficAllocation: 70,
  },

  // 사회적 증거 테스트
  social_proof_test: {
    testName: "social_proof_test",
    variants: {
      CONTROL: "testimonials_only",
      NUMBERS: "statistics_focused",
      LIVE_ACTIVITY: "real_time_activity",
      EXPERT_ENDORSEMENT: "expert_recommendation",
    },
    trafficAllocation: 85,
  },
};

export const useABTest = (
  testName: string,
  customVariants?: Record<string, any>
): ABTestResult => {
  const [selectedVariant, setSelectedVariant] = useState<string>("CONTROL");
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const testConfig = AB_TESTS[testName];
  const variants = customVariants ||
    testConfig?.variants || { CONTROL: "control" };

  useEffect(() => {
    const initializeTest = async () => {
      try {
        // 사용자 세그먼트 확인
        const userSegment = await getUserSegment();

        // 테스트 참여 자격 확인
        const shouldParticipate = shouldUserParticipate(
          testConfig,
          userSegment
        );

        if (shouldParticipate) {
          // 기존 할당 확인
          const existingAssignment = getStoredAssignment(testName);

          if (existingAssignment && variants[existingAssignment]) {
            setSelectedVariant(existingAssignment);
          } else {
            // 새로운 변형 할당
            const assignedVariant = assignVariant(
              testName,
              userSegment,
              variants
            );
            setSelectedVariant(assignedVariant);
            storeAssignment(testName, assignedVariant);
          }

          setIsParticipating(true);

          // 테스트 노출 이벤트 기록
          trackTestExposure(testName, selectedVariant, userSegment);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("A/B test initialization failed:", error);
        setSelectedVariant("CONTROL");
        setIsInitialized(true);
      }
    };

    initializeTest();
  }, [testName]);

  const trackConversion = (conversionType: string, value: number = 1) => {
    if (!isParticipating) return;

    // Google Analytics 이벤트
    gtag("event", "ab_test_conversion", {
      event_category: "AB Test",
      event_label: `${testName}_${selectedVariant}`,
      test_name: testName,
      variant: selectedVariant,
      conversion_type: conversionType,
      value: value,
    });

    // 내부 A/B 테스트 분석 API 호출
    sendToAnalytics({
      type: "conversion",
      testName,
      variant: selectedVariant,
      conversionType,
      value,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
    });
  };

  const trackEvent = (
    eventName: string,
    properties: Record<string, any> = {}
  ) => {
    if (!isParticipating) return;

    gtag("event", "ab_test_event", {
      event_category: "AB Test",
      event_label: `${testName}_${selectedVariant}`,
      test_name: testName,
      variant: selectedVariant,
      custom_event: eventName,
      ...properties,
    });

    sendToAnalytics({
      type: "event",
      testName,
      variant: selectedVariant,
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
    });
  };

  return {
    variant: variants[selectedVariant],
    variantName: selectedVariant,
    isParticipating,
    trackConversion,
    trackEvent,
  };
};

// 사용자 세그먼트 확인
const getUserSegment = async (): Promise<UserSegment> => {
  // 기존 방문자 여부 확인
  const isReturningVisitor =
    localStorage.getItem("returning_visitor") === "true";

  // 디바이스 타입 확인
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);

  // 트래픽 소스 확인
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source");
  const utm_medium = urlParams.get("utm_medium");

  let trafficType: "organic" | "paid" = "organic";
  if (
    utm_medium === "cpc" ||
    utm_source?.includes("google") ||
    utm_source?.includes("facebook")
  ) {
    trafficType = "paid";
  }

  // 사용자 의도 파악 (페이지 체류 시간, 스크롤 깊이 등)
  const intent = await determineUserIntent();

  // 첫 번째 일치하는 세그먼트 반환
  if (!isReturningVisitor) return "new_visitor";
  if (isReturningVisitor) return "returning_visitor";
  if (isMobile) return "mobile_user";
  if (!isMobile) return "desktop_user";
  if (trafficType === "paid") return "paid_traffic";
  if (intent === "high") return "high_intent";

  return "organic_traffic";
};

// 사용자 의도 파악
const determineUserIntent = (): Promise<"high" | "low"> => {
  return new Promise((resolve) => {
    // 페이지 로드 후 10초 후에 판단
    setTimeout(() => {
      const timeOnPage = performance.now();
      const scrollDepth = (window.scrollY / document.body.scrollHeight) * 100;

      // 10초 이상 체류하고 50% 이상 스크롤했으면 고의도
      if (timeOnPage > 10000 && scrollDepth > 50) {
        resolve("high");
      } else {
        resolve("low");
      }
    }, 10000);
  });
};

// 테스트 참여 자격 확인
const shouldUserParticipate = (
  config: ABTestConfig | undefined,
  userSegment: UserSegment
): boolean => {
  if (!config) return false;

  // 트래픽 할당 확인
  if (
    config.trafficAllocation &&
    Math.random() * 100 > config.trafficAllocation
  ) {
    return false;
  }

  // 사용자 세그먼트 확인
  if (config.userSegments && !config.userSegments.includes(userSegment)) {
    return false;
  }

  // 날짜 범위 확인
  const now = new Date();
  if (config.startDate && now < config.startDate) return false;
  if (config.endDate && now > config.endDate) return false;

  return true;
};

// 변형 할당 (가중치 기반)
const assignVariant = (
  testName: string,
  userSegment: UserSegment,
  variants: Record<string, any>
): string => {
  const variantKeys = Object.keys(variants);

  // 사용자 ID 기반 일관성 있는 할당
  const userId = getUserId();
  const seed = hashString(`${testName}_${userId}`);
  const randomValue = (seed % 100) / 100;

  // 균등 분배 (향후 가중치 기능 추가 가능)
  const segmentSize = 1 / variantKeys.length;
  const assignedIndex = Math.floor(randomValue / segmentSize);

  return variantKeys[Math.min(assignedIndex, variantKeys.length - 1)];
};

// 문자열 해시 함수
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash);
};

// 할당 정보 저장
const storeAssignment = (testName: string, variant: string): void => {
  try {
    const assignments = JSON.parse(
      localStorage.getItem("ab_assignments") || "{}"
    );
    assignments[testName] = {
      variant,
      assignedAt: new Date().toISOString(),
    };
    localStorage.setItem("ab_assignments", JSON.stringify(assignments));
  } catch (error) {
    console.error("Failed to store A/B test assignment:", error);
  }
};

// 저장된 할당 정보 조회
const getStoredAssignment = (testName: string): string | null => {
  try {
    const assignments = JSON.parse(
      localStorage.getItem("ab_assignments") || "{}"
    );
    return assignments[testName]?.variant || null;
  } catch (error) {
    console.error("Failed to get stored A/B test assignment:", error);
    return null;
  }
};

// 테스트 노출 이벤트 추적
const trackTestExposure = (
  testName: string,
  variant: string,
  userSegment: UserSegment
): void => {
  gtag("event", "ab_test_exposure", {
    event_category: "AB Test",
    event_label: `${testName}_${variant}`,
    test_name: testName,
    variant: variant,
    user_segment: userSegment,
  });

  sendToAnalytics({
    type: "exposure",
    testName,
    variant,
    userSegment,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    sessionId: getSessionId(),
  });
};

// 분석 API로 데이터 전송
const sendToAnalytics = async (data: any): Promise<void> => {
  try {
    await fetch("/api/analytics/ab-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to send A/B test analytics:", error);
  }
};

// 유틸리티 함수들
const getUserId = (): string => {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("user_id", userId);
  }
  return userId;
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

// A/B 테스트 관리 훅 (관리자용)
export const useABTestManager = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const getTestResults = async (testName: string) => {
    try {
      const response = await fetch(
        `/api/analytics/ab-test-results?test=${testName}`
      );
      const results = await response.json();
      setTestResults((prev) => ({ ...prev, [testName]: results }));
      return results;
    } catch (error) {
      console.error("Failed to fetch A/B test results:", error);
      return null;
    }
  };

  const endTest = async (testName: string, winningVariant: string) => {
    try {
      await fetch("/api/analytics/ab-test-end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testName, winningVariant }),
      });

      // 로컬에서 테스트 제거
      const assignments = JSON.parse(
        localStorage.getItem("ab_assignments") || "{}"
      );
      delete assignments[testName];
      localStorage.setItem("ab_assignments", JSON.stringify(assignments));
    } catch (error) {
      console.error("Failed to end A/B test:", error);
    }
  };

  return {
    testResults,
    getTestResults,
    endTest,
  };
};

export default useABTest;
