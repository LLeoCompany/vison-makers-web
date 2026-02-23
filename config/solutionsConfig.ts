// Solutions Configuration – 분야별 AI 솔루션

export type SolutionField =
  | "legal"
  | "advertising"
  | "food"
  | "tax"
  | "manufacturing"
  | "medical";

export interface SolutionKPI {
  value: string;
  label: string;
  suffix?: string;
}

export interface SolutionDemo {
  query: string;
  response: string;
  sources: string[];
  confidence: number;
}

export interface SolutionConfig {
  field: SolutionField;
  nameKo: string;
  nameEn: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  icon: string;          // lucide icon name
  accentColor: string;   // tailwind text color
  accentBg: string;      // tailwind bg color
  primaryHex: string;    // hex for meta theme
  painPoints: string[];
  kpis: SolutionKPI[];
  demo: SolutionDemo;
  useCases: string[];
  ctaText: string;
}

export const solutionsConfig: Record<SolutionField, SolutionConfig> = {
  legal: {
    field: "legal",
    nameKo: "법률/법무",
    nameEn: "Legal",
    tagline: "Legal AI",
    headline: "판례 검색부터 계약 검토까지\nAI가 법무팀을 강화합니다",
    subheadline: "수천 건의 판례와 계약서를 즉시 분석하는 Enterprise RAG",
    description: "법률 문서의 정확한 분석과 출처 명시로 법무 업무의 신뢰성을 높입니다.",
    icon: "Scale",
    accentColor: "text-blue-700",
    accentBg: "bg-blue-50",
    primaryHex: "#1E3A8A",
    painPoints: [
      "방대한 판례 데이터베이스 수동 검색에 소요되는 시간",
      "계약서 조항의 리스크 식별 누락으로 인한 법적 분쟁",
      "전문 법률 지식 보유 인력 부족 및 외부 자문 비용",
    ],
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

  advertising: {
    field: "advertising",
    nameKo: "광고/마케팅",
    nameEn: "Advertising",
    tagline: "Ad & Marketing AI",
    headline: "캠페인 기획부터 성과 분석까지\nAI가 마케팅을 혁신합니다",
    subheadline: "브랜드 데이터 기반 초개인화 마케팅 자동화 솔루션",
    description: "방대한 소비자 데이터와 과거 캠페인 인사이트로 마케팅 ROI를 극대화합니다.",
    icon: "Megaphone",
    accentColor: "text-orange-600",
    accentBg: "bg-orange-50",
    primaryHex: "#EA580C",
    painPoints: [
      "광고 소재 제작에 소요되는 반복적인 시간과 비용",
      "타깃 오디언스 분석의 정확도 부족으로 인한 광고 낭비",
      "경쟁사 대비 트렌드 대응 속도 저하",
    ],
    kpis: [
      { value: "60", label: "소재 제작 시간 단축", suffix: "%" },
      { value: "3.5x", label: "광고 ROI 향상" },
      { value: "45", label: "타깃 정확도 향상", suffix: "%" },
      { value: "2배", label: "캠페인 A/B 테스트 속도" },
    ],
    demo: {
      query: "20대 여성 타깃 여름 뷰티 캠페인 카피 3개 작성해줘",
      response:
        "여름 뷰티 캠페인 카피 제안:\n\n1. **감성**: '당신의 여름, 빛나게 하세요 ✨ – 끈적임 없이 24시간 지속되는 선크림'\n2. **기능**: '피부과 추천 SPF 50+, 자외선 완벽 차단 – 피부 걱정 끝'\n3. **MZ 감성**: '선케어도 트렌디하게 🌊 올여름엔 X 브랜드와 함께'\n\n📊 타깃 분석: 인스타그램 20-28세 여성, 뷰티/라이프스타일 관심사",
      sources: ["2024_뷰티_트렌드_리포트.pdf", "자사_캠페인_성과_데이터.xlsx"],
      confidence: 0.92,
    },
    useCases: ["광고 카피 자동 생성", "경쟁사 분석", "캠페인 성과 예측", "소비자 인사이트 도출"],
    ctaText: "마케팅 AI 도입 상담",
  },

  food: {
    field: "food",
    nameKo: "식품/유통",
    nameEn: "Food & Distribution",
    tagline: "Food & Distribution AI",
    headline: "레시피 관리부터 유통 최적화까지\nAI가 식품 산업을 혁신합니다",
    subheadline: "식품 안전 데이터와 유통 이력을 통합 관리하는 Enterprise RAG",
    description: "원재료 이력부터 최종 소비자까지 안전한 식품 공급망을 AI로 관리합니다.",
    icon: "UtensilsCrossed",
    accentColor: "text-green-700",
    accentBg: "bg-green-50",
    primaryHex: "#15803D",
    painPoints: [
      "식품 안전 관련 규정 준수 및 이력 추적의 복잡성",
      "유통 기한 관리 실패로 인한 폐기 비용 증가",
      "원재료 원산지 및 알레르기 정보 수동 관리의 위험성",
    ],
    kpis: [
      { value: "40", label: "식품 폐기율 감소", suffix: "%" },
      { value: "95", label: "이력 추적 정확도", suffix: "%" },
      { value: "30", label: "유통 비용 절감", suffix: "%" },
      { value: "100", label: "위생 검사 자동화", suffix: "%" },
    ],
    demo: {
      query: "제품번호 F-2024-0892 원산지 및 알레르기 정보 확인해줘",
      response:
        "제품 F-2024-0892 (된장찌개 소스) 정보:\n\n🌾 **원산지**: 국내산 대두 100%, 국내산 소금\n⚠️ **알레르기**: 대두, 밀 함유\n📅 **유통기한**: 2025.06.30\n🏭 **생산지**: 충북 음성 제2공장 (HACCP 인증)\n\n✅ 현재 유통 가능 상태 | 재고: 1,240개",
      sources: ["제품_이력관리_시스템.db", "HACCP_관리일지_2024.pdf"],
      confidence: 0.98,
    },
    useCases: ["식품 이력 추적", "유통기한 알림 자동화", "레시피 원가 계산", "안전 규정 준수 체크"],
    ctaText: "식품 AI 도입 상담",
  },

  tax: {
    field: "tax",
    nameKo: "세무/회계",
    nameEn: "Tax & Accounting",
    tagline: "Tax & Accounting AI",
    headline: "세무 신고부터 재무 분석까지\nAI가 회계 업무를 자동화합니다",
    subheadline: "수천 건의 세법 조항과 판례를 즉시 검색하는 Enterprise RAG",
    description: "복잡한 세법 해석과 신고 오류를 AI가 사전에 검토하여 세무 리스크를 제거합니다.",
    icon: "Calculator",
    accentColor: "text-purple-700",
    accentBg: "bg-purple-50",
    primaryHex: "#7E22CE",
    painPoints: [
      "매년 개정되는 세법 조항 파악 및 적용의 어려움",
      "세무 신고 오류로 인한 가산세 및 세무조사 리스크",
      "재무제표 분석에 소요되는 방대한 시간과 인력",
    ],
    kpis: [
      { value: "90", label: "세무 신고 오류 감소", suffix: "%" },
      { value: "70", label: "세무 업무 시간 절감", suffix: "%" },
      { value: "5초", label: "세법 조항 검색 속도" },
      { value: "100", label: "세법 개정 자동 업데이트", suffix: "%" },
    ],
    demo: {
      query: "2024년 소규모 법인 법인세 신고 시 적용 세율과 공제 항목 알려줘",
      response:
        "2024년 소규모 법인 법인세 정보:\n\n💼 **세율**: 과세표준 2억 이하 9%, 2억~200억 19%\n\n✅ **적용 가능 공제 항목**:\n1. 중소기업 특별세액감면 (최대 20%)\n2. 고용증가 인원 세액공제\n3. 설비투자 세액공제\n4. 연구개발비 세액공제\n\n⚠️ 납부기한: 사업연도 종료 후 3개월 이내",
      sources: ["법인세법_2024_개정판.pdf (p.23)", "국세청_고시_2024-15호.pdf"],
      confidence: 0.97,
    },
    useCases: ["세법 조항 즉시 검색", "세무 신고 오류 사전 검토", "재무제표 자동 분석", "세금 절세 전략 도출"],
    ctaText: "세무 AI 도입 상담",
  },

  manufacturing: {
    field: "manufacturing",
    nameKo: "제조/생산",
    nameEn: "Manufacturing",
    tagline: "Manufacturing AI",
    headline: "설비 매뉴얼부터 품질 관리까지\nAI가 제조 현장을 지원합니다",
    subheadline: "수십 년의 기술 문서를 즉시 검색하는 Enterprise RAG",
    description: "제조 노하우와 설비 정보를 체계화하여 현장 대응력을 극대화합니다.",
    icon: "Factory",
    accentColor: "text-slate-700",
    accentBg: "bg-slate-50",
    primaryHex: "#334155",
    painPoints: [
      "설비 고장 시 방대한 매뉴얼 수동 검색으로 인한 생산 지연",
      "숙련 기술자 은퇴 후 암묵지 손실 문제",
      "품질 이슈 원인 분석의 지연으로 불량률 증가",
    ],
    kpis: [
      { value: "70", label: "설비 문제 해결 시간 단축", suffix: "%" },
      { value: "5", label: "기술 문서 검색 소요 시간", suffix: "초" },
      { value: "35", label: "신입 교육 기간 단축", suffix: "%" },
      { value: "23", label: "불량률 감소", suffix: "%" },
    ],
    demo: {
      query: "CNC 가공기 A-203 알람 코드 E-4521 원인과 조치 방법 알려줘",
      response:
        "CNC 가공기 A-203 알람 코드 E-4521 분석:\n\n🔴 **알람 원인**: 스핀들 과열 감지\n\n**즉시 조치사항**:\n1. 가공 즉시 중단 및 스핀들 정지\n2. 냉각수 순환 상태 확인\n3. 스핀들 베어링 온도 체크 (정상: 60°C 이하)\n\n⚠️ 반복 발생 시 스핀들 베어링 교체 검토 필요",
      sources: ["CNC_A시리즈_매뉴얼.pdf (p.234)", "설비_정비이력_2024.xlsx"],
      confidence: 0.98,
    },
    useCases: ["설비 매뉴얼 검색", "품질 이슈 분석", "작업 표준서 조회", "신입 교육 지원"],
    ctaText: "제조 AI 도입 상담",
  },

  medical: {
    field: "medical",
    nameKo: "의료/헬스케어",
    nameEn: "Medical & Healthcare",
    tagline: "Medical AI",
    headline: "의료 문서부터 환자 상담까지\nAI가 의료 현장을 혁신합니다",
    subheadline: "최신 임상 가이드라인과 의학 문헌을 즉시 검색하는 Enterprise RAG",
    description: "방대한 의학 정보를 안전하게 분석하여 의료진의 의사결정을 지원합니다.",
    icon: "Stethoscope",
    accentColor: "text-red-700",
    accentBg: "bg-red-50",
    primaryHex: "#B91C1C",
    painPoints: [
      "방대한 의학 문헌 검색에 소요되는 의료진 시간",
      "최신 임상 가이드라인 파악 지연으로 인한 치료 품질 저하",
      "환자 기록 및 검사 결과 수동 분석의 비효율",
    ],
    kpis: [
      { value: "60", label: "의학 문헌 검색 시간 단축", suffix: "%" },
      { value: "40", label: "오진 리스크 감소", suffix: "%" },
      { value: "3초", label: "임상 가이드라인 검색" },
      { value: "95", label: "문서 정확도", suffix: "%" },
    ],
    demo: {
      query: "65세 남성 당뇨 환자 혈압 약 처방 시 주의사항 확인해줘",
      response:
        "65세 남성 당뇨 환자 혈압 처방 가이드:\n\n💊 **권장 1차 약제**: ACE 억제제 또는 ARB 계열\n(당뇨성 신증 보호 효과)\n\n⚠️ **주의 사항**:\n1. RAAS 차단제 병용 금기\n2. eGFR 30 미만 시 메트포르민 중단 고려\n3. 저혈압 위험 모니터링 필수\n\n📋 목표 혈압: 130/80 mmHg 미만 (ADA 2024 기준)",
      sources: ["ADA_Standards_2024.pdf (p.89)", "대한의학회_고혈압_가이드라인.pdf"],
      confidence: 0.95,
    },
    useCases: ["임상 가이드라인 검색", "약물 상호작용 체크", "환자 교육 자료 생성", "의료 문서 요약"],
    ctaText: "의료 AI 도입 상담",
  },
};

export const getSolutionConfig = (field: string): SolutionConfig | null => {
  if (field in solutionsConfig) {
    return solutionsConfig[field as SolutionField];
  }
  return null;
};

export const getAllSolutionFields = (): SolutionField[] =>
  Object.keys(solutionsConfig) as SolutionField[];

// Dropdown menu items for Navbar
export const dropdownMenuItems = [
  { field: "legal" as SolutionField, label: "법률/법무", emoji: "⚖️" },
  { field: "advertising" as SolutionField, label: "광고/마케팅", emoji: "📢" },
  { field: "food" as SolutionField, label: "식품/유통", emoji: "🍽️" },
  { field: "tax" as SolutionField, label: "세무/회계", emoji: "🧮" },
  { field: "manufacturing" as SolutionField, label: "제조/생산", emoji: "🏭" },
  { field: "medical" as SolutionField, label: "의료/헬스케어", emoji: "🏥" },
];
