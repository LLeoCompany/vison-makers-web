/**
 * VisionMakers 상담 시스템 - 트랙 선택 페이지
 * 설계 문서 3.1 트랙 선택 페이지 기반
 */

import React from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import { useConsultation } from '@/contexts/ConsultationContext';
import { TrackType } from '@/types/consultation';

export default function ConsultationStart() {
  const router = useRouter();
  const { setTrackType } = useConsultation();

  const handleTrackSelection = (trackType: TrackType) => {
    setTrackType(trackType);

    if (trackType === 'guided') {
      router.push('/consultation/guided/step1');
    } else {
      router.push('/consultation/free/write');
    }
  };

  return (
    <ConsultationLayout title="상담 방식 선택" showHeader={true}>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            어떤 방식으로 상담받으시겠어요?
          </h1>
          <p className="text-gray-600">
            두 방식 모두 같은 품질의 상담을 받으실 수 있어요!
          </p>
        </div>

        {/* 트랙 선택 카드들 */}
        <div className="space-y-6">
          {/* 가이드 트랙 */}
          <div
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
            onClick={() => handleTrackSelection('guided')}
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">🎯</div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-red-700">
                    간단한 질문 답변
                  </h2>
                  <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                    추천
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    4개 질문으로 정확한 상담
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    예상 소요시간: 2-3분
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    더 구체적인 제안 받기
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="group-hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackSelection('guided');
                  }}
                >
                  질문 답변하기
                </Button>
              </div>
            </div>
          </div>

          {/* 자유 트랙 */}
          <div
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
            onClick={() => handleTrackSelection('free')}
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">📝</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  자유롭게 작성하기
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    원하는 대로 자세히 설명
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    예상 소요시간: 1-2분
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    전화로 자세한 논의
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackSelection('free');
                  }}
                >
                  자유롭게 작성하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>어떤 방식을 선택해도 괜찮아요!</strong><br />
                전문 상담사가 꼼꼼히 검토한 후, 가장 적합한 솔루션을 제안해드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* 도움말 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            선택이 어려우시면 <span className="text-red-500 font-medium">010-9915-4724</span>로 바로 연락주세요
          </p>
        </div>
      </div>
    </ConsultationLayout>
  );
}