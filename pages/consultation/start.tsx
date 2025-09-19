/**
 * VisionMakers 상담 시작 페이지 - Toss UI 스타일
 * 설계 문서 4.2 UI/UX 플로우 기반 + Toss 디자인 패턴 적용
 */

import React from "react";
import { useRouter } from "next/router";
import { useConsultation } from "../../contexts/ConsultationContext";
import { TrackType } from "../../types/consultation";

const ConsultationStartPage: React.FC = () => {
  const router = useRouter();
  const { setTrackType } = useConsultation();

  const handleTrackSelection = (trackType: TrackType) => {
    setTrackType(trackType);

    if (trackType === "guided") {
      router.push("/consultation/guided/step1");
    } else {
      router.push("/consultation/free");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤로 섹션 - Toss 스타일 */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
              프로젝트 상담을
              <br />
              <span className="text-blue-500">시작해보세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
              VisionMakers와 함께 여러분의 아이디어를 현실로 만들어보세요.
              <br />
              정확하고 빠른 상담을 위한 두 가지 방법을 준비했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 상담 방법 선택 섹션 - Toss 카드 스타일 */}
      <div className="relative bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              어떤 방법으로 상담받으시겠어요?
            </h2>
            <p className="text-lg text-gray-600">
              프로젝트에 맞는 상담 방법을 선택해주세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 가이드 상담 - Toss 카드 스타일 */}
            <div
              className="bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-blue-200 group"
              onClick={() => handleTrackSelection("guided")}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    가이드 상담
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    단계별 질문을 통해 정확한 견적과
                    <br />
                    맞춤형 제안을 받을 수 있어요
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    정확한 견적 제공
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    맞춤형 기능 추천
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    소요시간 5-10분
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg mt-auto">
                  가이드 상담 시작하기
                </button>
              </div>
            </div>

            {/* 자유 상담 - Toss 카드 스타일 */}
            <div
              className="bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-green-200 group"
              onClick={() => handleTrackSelection("free")}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    자유 상담
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    프로젝트를 자유롭게 설명하고
                    <br />
                    전문가와 직접 상담하세요
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    복잡한 프로젝트 적합
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    전문가 직접 상담
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    소요시간 2-3분
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-lg mt-auto">
                  자유 상담 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 신뢰도 및 특징 섹션 - Toss 스타일 */}
      <div className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              VisionMakers가 <span className="text-blue-500">특별한 이유</span>
            </h2>
            <p className="text-lg text-gray-600">
              10년 이상의 경험과 전문성으로 최고의 서비스를 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                빠른 응답
              </h3>
              <p className="text-gray-600 leading-relaxed">
                24시간 이내 전문가가
                <br />
                직접 연락드립니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                무료 상담
              </h3>
              <p className="text-gray-600 leading-relaxed">
                상담 및 견적은
                <br />
                완전 무료입니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-100 transition-colors">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">전문성</h3>
              <p className="text-gray-600 leading-relaxed">
                10년 이상 경험의
                <br />
                개발 전문가
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 하단 섹션 - Toss 스타일 */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            아직 고민중이신가요?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            궁금한 점이 있으시면 언제든 연락주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/")}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              ← 홈페이지로 돌아가기
            </button>
            <div className="w-px h-6 bg-gray-600 hidden sm:block"></div>
            <a
              href="tel:02-1234-5678"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              전화 상담 02-1234-5678
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationStartPage;
