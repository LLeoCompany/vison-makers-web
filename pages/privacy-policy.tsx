/**
 * LeoFitTech 개인정보 보호정책 페이지
 * 설계 문서 기반 UI 구현
 */

import React, { useState } from "react";
import Head from "next/head";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200">{children}</div>
      )}
    </div>
  );
}

function DataTable({
  data,
}: {
  data: Array<{
    항목: string;
    수집방법: string;
    수집목적: string;
    보관기간: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              수집 항목
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              수집 방법
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              수집 목적
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              보관 기간
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{row.항목}</td>
              <td className="border border-gray-300 px-4 py-2">
                {row.수집방법}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.수집목적}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.보관기간}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "2024년 12월 19일";

  const requiredData = [
    {
      항목: "성명",
      수집방법: "상담 신청 폼",
      수집목적: "상담 서비스 제공, 본인 확인",
      보관기간: "3년",
    },
    {
      항목: "전화번호",
      수집방법: "상담 신청 폼",
      수집목적: "상담 연락, 서비스 안내",
      보관기간: "3년",
    },
    {
      항목: "이메일 주소",
      수집방법: "상담 신청 폼",
      수집목적: "상담 결과 발송, 서비스 안내",
      보관기간: "3년",
    },
  ];

  const optionalData = [
    {
      항목: "회사명",
      수집방법: "상담 신청 폼",
      수집목적: "맞춤형 상담 서비스 제공",
      보관기간: "3년",
    },
    {
      항목: "프로젝트 설명",
      수집방법: "상담 신청 폼",
      수집목적: "상담 품질 향상",
      보관기간: "3년",
    },
    {
      항목: "예산 범위",
      수집방법: "상담 신청 폼",
      수집목적: "적합한 솔루션 제안",
      보관기간: "3년",
    },
  ];

  const automaticData = [
    {
      항목: "IP 주소",
      수집방법: "서버 로그",
      수집목적: "보안, 통계 분석",
      보관기간: "1년",
    },
    {
      항목: "브라우저 정보",
      수집방법: "User-Agent",
      수집목적: "서비스 최적화",
      보관기간: "1년",
    },
    {
      항목: "접속 시간",
      수집방법: "서버 로그",
      수집목적: "서비스 이용 패턴 분석",
      보관기간: "1년",
    },
    {
      항목: "페이지 경로",
      수집방법: "웹 분석 도구",
      수집목적: "사용자 경험 개선",
      보관기간: "1년",
    },
    {
      항목: "쿠키 ID",
      수집방법: "브라우저",
      수집목적: "맞춤형 서비스 제공",
      보관기간: "1년",
    },
  ];

  return (
    <>
      <Head>
        <title>개인정보 보호정책 | LeoFitTech</title>
        <meta
          name="description"
          content="LeoFitTech의 개인정보 보호정책을 확인하세요. 투명하고 안전한 개인정보 처리 방침을 제공합니다."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                개인정보 보호정책
              </h1>
              <p className="text-gray-600">
                LeoFitTech는 고객의 개인정보를 소중히 여기며, 안전하게
                보호합니다.
              </p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                최종 업데이트: {lastUpdated}
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 목차 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              📋 목차
            </h2>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                개인정보 수집 및 이용 내역
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                개인정보 보호 기술적 조치
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                개인정보 제3자 제공
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                이용자 권리 및 행사 방법
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                쿠키 및 추적 기술
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                개인정보 보호책임자
              </li>
            </ul>
          </div>

          {/* 회사 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🏢 회사 정보
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">회사명</h3>
                <p className="text-gray-600">LeoFitTech Co., Ltd.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">대표자</h3>
                <p className="text-gray-600">홍길동</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">주소</h3>
                <p className="text-gray-600">서울특별시 강남구 테헤란로 123</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">연락처</h3>
                <p className="text-gray-600">02-1234-5678</p>
              </div>
            </div>
          </div>

          {/* 개인정보 수집 및 이용 */}
          <CollapsibleSection
            title="🔍 개인정보 수집 및 이용 내역"
            defaultOpen={true}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  1. 필수 수집 정보
                </h4>
                <p className="text-gray-600 mb-3">
                  상담 서비스 제공을 위해 반드시 필요한 정보입니다.
                </p>
                <DataTable data={requiredData} />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  2. 선택 수집 정보
                </h4>
                <p className="text-gray-600 mb-3">
                  더 나은 서비스 제공을 위해 선택적으로 수집하는 정보입니다.
                </p>
                <DataTable data={optionalData} />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  3. 자동 수집 정보
                </h4>
                <p className="text-gray-600 mb-3">
                  서비스 이용 과정에서 자동으로 수집되는 정보입니다.
                </p>
                <DataTable data={automaticData} />
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <h4 className="font-semibold text-amber-800 mb-2">
                  ⚠️ 수집 목적별 안내
                </h4>
                <ul className="text-amber-700 space-y-1">
                  <li>
                    • <strong>상담 서비스 제공:</strong> 고객 문의 접수, 맞춤형
                    상담, 견적서 발송
                  </li>
                  <li>
                    • <strong>서비스 개선:</strong> 이용 패턴 분석, 품질 향상,
                    사용자 경험 최적화
                  </li>
                  <li>
                    • <strong>마케팅 및 광고:</strong> 맞춤형 광고, 서비스 안내,
                    이벤트 정보 제공
                  </li>
                  <li>
                    • <strong>법적 의무 이행:</strong> 전자상거래법상 기록 보관,
                    분쟁 해결
                  </li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* 보안 조치 */}
          <CollapsibleSection title="🛡️ 개인정보 보호 기술적 조치">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  1. 데이터 암호화
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • <strong>전송 중 암호화:</strong> HTTPS (TLS 1.3)
                      프로토콜 사용
                    </li>
                    <li>
                      • <strong>저장 시 암호화:</strong> AES-256-GCM 알고리즘
                      적용
                    </li>
                    <li>
                      • <strong>데이터베이스 암호화:</strong> 민감 정보 필드별
                      암호화
                    </li>
                    <li>
                      • <strong>백업 암호화:</strong> 모든 백업 데이터 암호화
                      저장
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  2. 접근 제어
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • <strong>역할 기반 접근 제어:</strong> 직책별 차등 권한
                      부여
                    </li>
                    <li>
                      • <strong>다단계 인증:</strong> 관리자 계정 2FA 필수
                    </li>
                    <li>
                      • <strong>IP 주소 제한:</strong> 특정 네트워크에서만 접근
                      허용
                    </li>
                    <li>
                      • <strong>세션 관리:</strong> 자동 로그아웃, 동시 접속
                      제한
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  3. 모니터링 및 감사
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • <strong>실시간 모니터링:</strong> 24/7 보안 모니터링
                      시스템
                    </li>
                    <li>
                      • <strong>접근 로그:</strong> 모든 개인정보 접근 기록 보관
                    </li>
                    <li>
                      • <strong>정기 감사:</strong> 월 1회 보안 취약점 점검
                    </li>
                    <li>
                      • <strong>침입 탐지:</strong> 비정상 접근 시도 자동 차단
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 제3자 제공 */}
          <CollapsibleSection title="🤝 개인정보 제3자 제공">
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-800 font-semibold">
                  ✅ LeoFitTech는 원칙적으로 고객의 개인정보를 제3자에게
                  제공하지 않습니다.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  예외적 제공 사유
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 법령에 의해 제공이 의무화된 경우</li>
                  <li>
                    • 수사기관의 수사목적으로 법령에 정해진 절차에 따른 요구가
                    있는 경우
                  </li>
                  <li>• 고객이 사전에 동의한 경우</li>
                  <li>
                    • 생명, 신체의 위험으로부터 고객을 보호하기 위해 불가피한
                    경우
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  업무 위탁 현황
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          수탁업체
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          위탁업무
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          보유기간
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Amazon Web Services
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          클라우드 호스팅 서비스
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          위탁계약 종료시까지
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Google Analytics
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          웹사이트 분석 서비스
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          26개월
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 이용자 권리 */}
          <CollapsibleSection title="⚖️ 이용자 권리 및 행사 방법">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  개인정보 자기결정권
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">열람권</h5>
                    <p className="text-blue-700 text-sm">
                      본인의 개인정보 처리 현황을 확인할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      정정·삭제권
                    </h5>
                    <p className="text-blue-700 text-sm">
                      잘못된 정보의 수정이나 삭제를 요구할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      처리정지권
                    </h5>
                    <p className="text-blue-700 text-sm">
                      개인정보 처리 중단을 요구할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      손해배상청구권
                    </h5>
                    <p className="text-blue-700 text-sm">
                      개인정보 침해로 인한 손해 배상을 청구할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  권리 행사 방법
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • <strong>온라인:</strong> 웹사이트 내 개인정보 관리
                      페이지
                    </li>
                    <li>
                      • <strong>이메일:</strong> privacy@LeoFitTech.com
                    </li>
                    <li>
                      • <strong>전화:</strong> 02-1234-5678 (평일 09:00-18:00)
                    </li>
                    <li>
                      • <strong>우편:</strong> 서울특별시 강남구 테헤란로 123,
                      LeoFitTech 개인정보보호팀
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <h4 className="font-semibold text-amber-800 mb-2">
                  📝 처리 절차
                </h4>
                <ol className="text-amber-700 space-y-1">
                  <li>1. 본인 확인 절차 (신분증 등)</li>
                  <li>2. 요청 내용 검토 및 처리 (10일 이내)</li>
                  <li>3. 처리 결과 통보</li>
                  <li>4. 필요시 거부 사유 상세 설명</li>
                </ol>
              </div>
            </div>
          </CollapsibleSection>

          {/* 쿠키 정책 */}
          <CollapsibleSection title="🍪 쿠키 및 추적 기술">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  쿠키 사용 목적
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">
                      필수 쿠키
                    </h5>
                    <p className="text-purple-700 text-sm">
                      웹사이트 기본 기능 제공
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">
                      기능 쿠키
                    </h5>
                    <p className="text-purple-700 text-sm">사용자 설정 기억</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">
                      분석 쿠키
                    </h5>
                    <p className="text-purple-700 text-sm">
                      사이트 이용 패턴 분석
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  쿠키 관리 방법
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • <strong>Chrome:</strong> 설정 {`>`} 개인정보 및 보안{" "}
                      {`>`} 쿠키 및 기타 사이트 데이터
                    </li>
                    <li>
                      • <strong>Firefox:</strong> 설정 {`>`} 개인 정보 및 보안{" "}
                      {`>`} 쿠키 및 사이트 데이터
                    </li>
                    <li>
                      • <strong>Safari:</strong> 환경설정 {`>`} 개인정보 보호{" "}
                      {`>`} 쿠키 및 웹사이트 데이터
                    </li>
                    <li>
                      • <strong>Edge:</strong> 설정 {`>`} 쿠키 및 사이트 권한{" "}
                      {`>`} 쿠키 및 저장된 데이터
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  ⚠️ 쿠키 거부 시 영향
                </h4>
                <p className="text-red-700">
                  필수 쿠키를 거부할 경우, 웹사이트의 일부 기능이 정상적으로
                  작동하지 않을 수 있습니다. 분석 쿠키 거부는 서비스 이용에
                  영향을 주지 않습니다.
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* 개인정보 보호책임자 */}
          <CollapsibleSection title="👤 개인정보 보호책임자">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  개인정보 보호책임자
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-600">성명:</span>
                    <span className="ml-2 text-gray-800">김개인</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">직책:</span>
                    <span className="ml-2 text-gray-800">개인정보보호팀장</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">연락처:</span>
                    <span className="ml-2 text-gray-800">02-1234-5679</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">이메일:</span>
                    <span className="ml-2 text-gray-800">
                      privacy@LeoFitTech.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  개인정보 보호담당자
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-600">성명:</span>
                    <span className="ml-2 text-gray-800">이보호</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">직책:</span>
                    <span className="ml-2 text-gray-800">
                      개인정보보호팀 대리
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">연락처:</span>
                    <span className="ml-2 text-gray-800">02-1234-5680</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">이메일:</span>
                    <span className="ml-2 text-gray-800">
                      privacy-support@LeoFitTech.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 하단 안내 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold mb-3">
              📞 개인정보 침해신고센터
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">개인정보보호위원회</h4>
                <p>privacy.korea.kr</p>
                <p>국번없이 182</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">개인정보 침해신고센터</h4>
                <p>privacy.go.kr</p>
                <p>국번없이 182</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  대검찰청 사이버범죄수사단
                </h4>
                <p>www.spo.go.kr</p>
                <p>국번없이 1301</p>
              </div>
            </div>
          </div>

          {/* 최종 업데이트 정보 */}
          <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-sm">
              본 개인정보 보호정책은 <strong>{lastUpdated}</strong>에 최종
              업데이트되었습니다.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              정책 변경 시 웹사이트를 통해 공지하며, 중요한 변경사항은 이메일로
              개별 통지합니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
