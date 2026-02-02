// Industry Configuration for Vision AI Landing Pages

export type IndustryType = "legal" | "fitness" | "manufacturing" | "franchise";

export interface IndustryTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  glowColor: string;
}

export interface IndustryKPI {
  value: string;
  label: string;
  suffix?: string;
}

export interface IndustryDemo {
  query: string;
  response: string;
  sources: string[];
  confidence: number;
}

export interface IndustryConfig {
  type: IndustryType;
  name: string;
  nameKo: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  theme: IndustryTheme;
  icon: string;
  kpis: IndustryKPI[];
  demo: IndustryDemo;
  useCases: string[];
  ctaText: string;
}

export const industryColors: Record<IndustryType, IndustryTheme> = {
  legal: {
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)",
    glowColor: "rgba(30, 58, 138, 0.4)",
  },
  fitness: {
    primary: "#10B981",
    secondary: "#34D399",
    accent: "#6EE7B7",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
    glowColor: "rgba(16, 185, 129, 0.4)",
  },
  manufacturing: {
    primary: "#4B5563",
    secondary: "#6B7280",
    accent: "#9CA3AF",
    gradient: "linear-gradient(135deg, #374151 0%, #4B5563 50%, #6B7280 100%)",
    glowColor: "rgba(75, 85, 99, 0.4)",
  },
  franchise: {
    primary: "#F59E0B",
    secondary: "#FBBF24",
    accent: "#FCD34D",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
};

export const industryConfigs: Record<IndustryType, IndustryConfig> = {
  legal: {
    type: "legal",
    name: "Legal",
    nameKo: "법률/법무",
    tagline: "Legal AI Infrastructure",
    headline: "판례 검색부터 계약 검토까지\nAI가 법무팀을 강화합니다",
    subheadline: "수천 건의 판례와 계약서를 즉시 분석하는 Enterprise RAG",
    description: "법률 문서의 정확한 분석과 출처 명시로 법무 업무의 신뢰성을 높입니다",
    theme: industryColors.legal,
    icon: "Scale",
    kpis: [
      { value: "85", label: "계약 검토 시간 단축", suffix: "%" },
      { value: "3", label: "판례 검색 소요 시간", suffix: "초" },
      { value: "99.2", label: "출처 정확도", suffix: "%" },
      { value: "40", label: "법무팀 업무 효율 향상", suffix: "%" },
    ],
    demo: {
      query: "A사와의 공급계약서에서 손해배상 조항 검토해줘",
      response:
        "A사 공급계약서 제15조 손해배상 조항 분석 결과:\n\n1. **책임 한도**: 계약금액의 100%로 제한 (업계 평균 대비 적정)\n2. **면책 조항**: 천재지변, 불가항력 사유 명시\n3. **주의 필요**: 간접손해 배상 범위가 모호함\n\n⚠️ 권고사항: 간접손해의 정의를 구체화하는 단서 조항 추가 검토 필요",
      sources: ["A사_공급계약서_2024.pdf (p.12)", "표준계약서_가이드라인.docx (p.45)"],
      confidence: 0.96,
    },
    useCases: ["계약서 자동 검토", "판례 유사도 분석", "법률 자문 초안 작성", "컴플라이언스 체크"],
    ctaText: "법무팀 AI 도입 상담",
  },
  fitness: {
    type: "fitness",
    name: "Fitness",
    nameKo: "피트니스/헬스케어",
    tagline: "Fitness AI Infrastructure",
    headline: "회원 관리부터 PT 상담까지\nAI가 피트니스를 혁신합니다",
    subheadline: "회원 데이터 기반 맞춤형 서비스를 제공하는 Enterprise RAG",
    description: "회원 정보를 안전하게 보호하면서 개인화된 피트니스 경험을 제공합니다",
    theme: industryColors.fitness,
    icon: "Dumbbell",
    kpis: [
      { value: "32", label: "회원 재등록률 향상", suffix: "%" },
      { value: "45", label: "PT 상담 전환율", suffix: "%" },
      { value: "60", label: "CS 응대 시간 단축", suffix: "%" },
      { value: "28", label: "회원 만족도 상승", suffix: "%" },
    ],
    demo: {
      query: "김철수 회원님 운동 기록 분석하고 다음 PT 프로그램 추천해줘",
      response:
        "김철수 회원 (ID: M-2024-0892) 분석 결과:\n\n📊 **최근 3개월 운동 현황**\n- 출석률: 78% (주 4회 평균)\n- 주력 운동: 웨이트 트레이닝 (상체 중심)\n- 체성분 변화: 근육량 +2.3kg, 체지방 -1.8kg\n\n💪 **추천 PT 프로그램**\n하체 강화 + 코어 안정화 프로그램 (8주)\n- 회원님의 상체/하체 불균형 개선 목적\n- 주 2회 PT + 주 2회 자가 운동 권장",
      sources: ["회원_운동기록_김철수.xlsx", "PT_프로그램_가이드.pdf"],
      confidence: 0.94,
    },
    useCases: ["회원 운동 기록 분석", "맞춤형 PT 추천", "식단 상담 자동화", "회원 CS 챗봇"],
    ctaText: "피트니스 AI 도입 상담",
  },
  manufacturing: {
    type: "manufacturing",
    name: "Manufacturing",
    nameKo: "제조/생산",
    tagline: "Manufacturing AI Infrastructure",
    headline: "설비 매뉴얼부터 품질 관리까지\nAI가 제조 현장을 지원합니다",
    subheadline: "수십 년의 기술 문서를 즉시 검색하는 Enterprise RAG",
    description: "제조 노하우와 설비 정보를 체계화하여 현장 대응력을 극대화합니다",
    theme: industryColors.manufacturing,
    icon: "Factory",
    kpis: [
      { value: "70", label: "설비 문제 해결 시간 단축", suffix: "%" },
      { value: "5", label: "기술 문서 검색 소요 시간", suffix: "초" },
      { value: "35", label: "신입 교육 기간 단축", suffix: "%" },
      { value: "23", label: "불량률 감소", suffix: "%" },
    ],
    demo: {
      query: "CNC 가공기 A-203 알람 코드 E-4521 원인과 조치 방법 알려줘",
      response:
        "CNC 가공기 A-203 알람 코드 E-4521 분석:\n\n🔴 **알람 원인**: 스핀들 과열 감지\n\n**즉시 조치사항**:\n1. 가공 즉시 중단 및 스핀들 정지\n2. 냉각수 순환 상태 확인\n3. 스핀들 베어링 온도 체크 (정상: 60°C 이하)\n\n**예방 정비**:\n- 냉각수 필터 교체 주기: 500시간\n- 스핀들 그리스 주입: 1000시간마다\n\n⚠️ 반복 발생 시 스핀들 베어링 교체 검토 필요",
      sources: ["CNC_A시리즈_매뉴얼.pdf (p.234)", "설비_정비이력_2024.xlsx"],
      confidence: 0.98,
    },
    useCases: ["설비 매뉴얼 검색", "품질 이슈 분석", "작업 표준서 조회", "신입 교육 지원"],
    ctaText: "제조 AI 도입 상담",
  },
  franchise: {
    type: "franchise",
    name: "Franchise",
    nameKo: "프랜차이즈/유통",
    tagline: "Franchise AI Infrastructure",
    headline: "가맹점 관리부터 본사 지원까지\nAI가 프랜차이즈를 성장시킵니다",
    subheadline: "전국 가맹점 운영 노하우를 통합하는 Enterprise RAG",
    description: "본사와 가맹점 간 지식 격차를 해소하고 일관된 서비스 품질을 유지합니다",
    theme: industryColors.franchise,
    icon: "Store",
    kpis: [
      { value: "50", label: "본사 문의 응대 자동화", suffix: "%" },
      { value: "25", label: "가맹점 매출 평균 상승", suffix: "%" },
      { value: "80", label: "운영 매뉴얼 검색 시간 단축", suffix: "%" },
      { value: "15", label: "가맹점 이탈률 감소", suffix: "%" },
    ],
    demo: {
      query: "신메뉴 '시그니처 버거' 조리법과 원가 계산 알려줘",
      response:
        "신메뉴 '시그니처 버거' 정보:\n\n🍔 **조리법 (1인분 기준)**\n1. 패티 180g 그릴에서 4분 (뒤집기 1회)\n2. 번 토스팅 30초\n3. 소스 15g 하단 번에 도포\n4. 토핑 순서: 양상추 → 패티 → 치즈 → 토마토 → 소스\n\n💰 **원가 계산**\n- 재료비: 3,850원\n- 판매가: 9,900원\n- 마진율: 61.1%\n\n📦 발주 코드: NM-2024-015",
      sources: ["신메뉴_레시피북_2024.pdf (p.23)", "원가관리_시스템_데이터.xlsx"],
      confidence: 0.97,
    },
    useCases: ["레시피/매뉴얼 검색", "가맹점 FAQ 자동 응대", "매출 분석 리포트", "재고/발주 관리"],
    ctaText: "프랜차이즈 AI 도입 상담",
  },
};

export const getIndustryConfig = (type: string): IndustryConfig | null => {
  if (type in industryConfigs) {
    return industryConfigs[type as IndustryType];
  }
  return null;
};

export const getAllIndustryTypes = (): IndustryType[] => {
  return Object.keys(industryConfigs) as IndustryType[];
};
