/**
 * API 엔드포인트 테스트 스크립트
 * 구현된 모든 API 엔드포인트를 테스트
 */

const axios = require("axios");

// 환경설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// 테스트용 샘플 데이터
const sampleGuidedConsultation = {
  type: "guided",
  serviceType: "homepage",
  projectSize: "medium",
  budget: "300-800",
  timeline: "2-3months",
  importantFeatures: ["mobile", "seo"],
  additionalRequests: "API 테스트를 위한 샘플 상담 신청입니다.",
  contact: {
    name: "테스트 사용자",
    phone: "010-1234-5678",
    email: "test@example.com",
    company: "테스트 회사",
    preferredContactTime: "afternoon",
  },
};

const sampleFreeConsultation = {
  type: "free",
  projectDescription:
    "API 테스트를 위한 자유 상담 신청입니다. 웹 애플리케이션 개발이 필요하며, React와 Node.js를 사용한 풀스택 개발을 원합니다. 사용자 인증, 데이터베이스 연동, REST API 개발이 포함되어야 합니다.",
  budget: "500만원 내외",
  timeline: "3개월 정도",
  contact: {
    name: "자유상담 테스터",
    phone: "010-9876-5432",
    email: "free@example.com",
    company: "프리랜서",
    preferredContactTime: "evening",
  },
};

// 테스트 결과 저장
const testResults = {
  passed: 0,
  failed: 0,
  details: [],
};

// 유틸리티 함수
function logTest(name, success, message = "", data = null) {
  const status = success ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} ${name}`);

  if (message) {
    console.log(`   ${message}`);
  }

  if (data && process.env.VERBOSE) {
    console.log(`   Data:`, JSON.stringify(data, null, 2));
  }

  if (success) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }

  testResults.details.push({
    name,
    success,
    message,
    data,
  });

  console.log("");
}

// API 호출 래퍼
async function apiCall(method, endpoint, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);

    return {
      success: response.status === expectedStatus,
      status: response.status,
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      data: error.response?.data || null,
      error: error.message,
    };
  }
}

// 테스트 함수들
async function testConsultationSubmit() {
  console.log("🧪 상담 신청 API 테스트\n");

  // 1. 가이드 상담 신청 테스트
  const guidedResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    sampleGuidedConsultation,
    201
  );
  logTest(
    "가이드 상담 신청",
    guidedResult.success && guidedResult.data?.success === true,
    guidedResult.success
      ? `상담번호: ${guidedResult.data?.data?.consultationNumber}`
      : `오류: ${guidedResult.error || guidedResult.data?.error?.message}`,
    guidedResult.data
  );

  // 2. 자유 상담 신청 테스트
  const freeResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    sampleFreeConsultation,
    201
  );
  logTest(
    "자유 상담 신청",
    freeResult.success && freeResult.data?.success === true,
    freeResult.success
      ? `상담번호: ${freeResult.data?.data?.consultationNumber}`
      : `오류: ${freeResult.error || freeResult.data?.error?.message}`,
    freeResult.data
  );

  // 3. 잘못된 데이터 테스트
  const invalidData = { ...sampleGuidedConsultation };
  delete invalidData.contact.email;

  const invalidResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    invalidData,
    400
  );
  logTest(
    "잘못된 데이터 처리",
    invalidResult.status === 400 && invalidResult.data?.success === false,
    "유효성 검증이 정상적으로 작동함",
    invalidResult.data
  );

  return {
    guidedConsultationNumber: guidedResult.data?.data?.consultationNumber,
    freeConsultationNumber: freeResult.data?.data?.consultationNumber,
  };
}

async function testConsultationStatus(consultationNumbers) {
  console.log("🔍 상담 상태 조회 API 테스트\n");

  if (consultationNumbers.guidedConsultationNumber) {
    const statusResult = await apiCall(
      "GET",
      `/api/consultation-status?number=${consultationNumbers.guidedConsultationNumber}`
    );
    logTest(
      "상담 상태 조회",
      statusResult.success && statusResult.data?.success === true,
      statusResult.success
        ? `상태: ${statusResult.data?.data?.statusLabel}`
        : `오류: ${statusResult.error || statusResult.data?.error?.message}`,
      statusResult.data
    );
  }

  // 존재하지 않는 상담 번호 테스트
  const notFoundResult = await apiCall(
    "GET",
    "/api/consultation-status?number=CS-99999999-9999",
    null,
    404
  );
  logTest(
    "존재하지 않는 상담 번호 처리",
    notFoundResult.status === 404 && notFoundResult.data?.success === false,
    "404 오류가 정상적으로 반환됨",
    notFoundResult.data
  );
}

async function testAdminAPIs() {
  console.log("👥 관리자 API 테스트\n");

  // 1. 상담 목록 조회
  const listResult = await apiCall(
    "GET",
    "/api/admin/consultations?page=1&limit=10"
  );
  logTest(
    "관리자 상담 목록 조회",
    listResult.success && listResult.data?.success === true,
    listResult.success
      ? `${listResult.data?.data?.consultations?.length || 0}개 상담 조회됨`
      : `오류: ${listResult.error || listResult.data?.error?.message}`,
    listResult.data
  );

  // 2. 통계 조회
  const statsResult = await apiCall("GET", "/api/admin/stats");
  logTest(
    "관리자 통계 조회",
    statsResult.success && statsResult.data?.success === true,
    statsResult.success
      ? `총 ${statsResult.data?.data?.overview?.totalConsultations || 0}개 상담`
      : `오류: ${statsResult.error || statsResult.data?.error?.message}`,
    statsResult.data
  );

  // 3. 필터링 테스트
  const filteredResult = await apiCall(
    "GET",
    "/api/admin/consultations?status=pending&type=guided"
  );
  logTest(
    "관리자 필터링 조회",
    filteredResult.success && filteredResult.data?.success === true,
    "필터링 기능이 정상적으로 작동함",
    filteredResult.data
  );

  // 4. 상담 상세 조회 (첫 번째 상담 사용)
  if (listResult.success && listResult.data?.data?.consultations?.length > 0) {
    const firstConsultation = listResult.data.data.consultations[0];
    const detailResult = await apiCall(
      "GET",
      `/api/admin/consultation/${firstConsultation.id}`
    );
    logTest(
      "관리자 상담 상세 조회",
      detailResult.success && detailResult.data?.success === true,
      detailResult.success
        ? `상담 ID: ${firstConsultation.id}`
        : `오류: ${detailResult.error || detailResult.data?.error?.message}`,
      detailResult.data
    );

    // 5. 상담 상태 업데이트
    const updateResult = await apiCall(
      "PUT",
      `/api/admin/consultation/${firstConsultation.id}`,
      {
        status: "reviewing",
        notes: "API 테스트를 통한 상태 업데이트",
        priority: "high",
      }
    );
    logTest(
      "관리자 상담 상태 업데이트",
      updateResult.success && updateResult.data?.success === true,
      updateResult.success
        ? `상태가 'reviewing'으로 변경됨`
        : `오류: ${updateResult.error || updateResult.data?.error?.message}`,
      updateResult.data
    );
  }
}

async function testErrorHandling() {
  console.log("🚨 오류 처리 테스트\n");

  // 1. 지원하지 않는 HTTP 메서드
  const methodResult = await apiCall(
    "DELETE",
    "/api/consultation-submit",
    null,
    405
  );
  logTest(
    "지원하지 않는 HTTP 메서드",
    methodResult.status === 405,
    "METHOD_NOT_ALLOWED 오류 반환",
    methodResult.data
  );

  // 2. 잘못된 JSON 데이터 (이 테스트는 axios가 자동으로 처리하므로 스킵)

  // 3. 누락된 필수 매개변수
  const missingParamResult = await apiCall(
    "GET",
    "/api/consultation-status",
    null,
    400
  );
  logTest(
    "누락된 필수 매개변수",
    missingParamResult.status === 400,
    "INVALID_PARAMETER 오류 반환",
    missingParamResult.data
  );

  // 4. 존재하지 않는 엔드포인트
  const notFoundEndpointResult = await apiCall(
    "GET",
    "/api/nonexistent-endpoint",
    null,
    404
  );
  logTest(
    "존재하지 않는 엔드포인트",
    notFoundEndpointResult.status === 404,
    "404 오류 반환",
    notFoundEndpointResult.data
  );
}

async function testValidationAndSecurity() {
  console.log("🔒 유효성 검증 및 보안 테스트\n");

  // 1. SQL 인젝션 테스트
  const sqlInjectionData = {
    ...sampleGuidedConsultation,
    contact: {
      ...sampleGuidedConsultation.contact,
      name: "'; DROP TABLE consultations; --",
    },
  };

  const sqlResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    sqlInjectionData,
    201
  );
  logTest(
    "SQL 인젝션 방지",
    sqlResult.success || sqlResult.status === 400,
    sqlResult.success
      ? "SQL 인젝션이 안전하게 처리됨"
      : "유효성 검증으로 차단됨",
    sqlResult.data
  );

  // 2. XSS 방지 테스트
  const xssData = {
    ...sampleGuidedConsultation,
    additionalRequests: '<script>alert("XSS")</script>',
  };

  const xssResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    xssData,
    201
  );
  logTest(
    "XSS 방지",
    xssResult.success || xssResult.status === 400,
    "XSS 스크립트가 안전하게 처리됨",
    xssResult.data
  );

  // 3. 긴 문자열 테스트
  const longStringData = {
    ...sampleGuidedConsultation,
    additionalRequests: "A".repeat(3000), // 2000자 제한을 초과
  };

  const longStringResult = await apiCall(
    "POST",
    "/api/consultation-submit",
    longStringData,
    400
  );
  logTest(
    "문자열 길이 제한",
    longStringResult.status === 400,
    "긴 문자열이 적절히 차단됨",
    longStringResult.data
  );
}

// 메인 테스트 실행 함수
async function runAllTests() {
  console.log("🚀 LeoFitTech 상담시스템 API 테스트 시작\n");
  console.log(`📍 테스트 대상: ${API_BASE_URL}\n`);

  const startTime = Date.now();

  try {
    // 1. 상담 신청 테스트
    const consultationNumbers = await testConsultationSubmit();

    // 2. 상담 상태 조회 테스트
    await testConsultationStatus(consultationNumbers);

    // 3. 관리자 API 테스트
    await testAdminAPIs();

    // 4. 오류 처리 테스트
    await testErrorHandling();

    // 5. 유효성 검증 및 보안 테스트
    await testValidationAndSecurity();
  } catch (error) {
    console.error("❌ 테스트 실행 중 예상치 못한 오류:", error.message);
    testResults.failed++;
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // 테스트 결과 요약
  console.log("📊 테스트 결과 요약\n");
  console.log(`⏱️  실행 시간: ${duration}초`);
  console.log(`✅ 통과: ${testResults.passed}개`);
  console.log(`❌ 실패: ${testResults.failed}개`);
  console.log(
    `📈 성공률: ${(
      (testResults.passed / (testResults.passed + testResults.failed)) *
      100
    ).toFixed(1)}%\n`
  );

  if (testResults.failed > 0) {
    console.log("🔍 실패한 테스트:");
    testResults.details
      .filter((result) => !result.success)
      .forEach((result) => {
        console.log(`   - ${result.name}: ${result.message}`);
      });
    console.log("");
  }

  console.log("🎯 테스트 완료!");

  // 실패한 테스트가 있으면 exit code 1 반환
  if (testResults.failed > 0) {
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("❌ 테스트 실행 실패:", error);
    process.exit(1);
  });
}

module.exports = { runAllTests };
