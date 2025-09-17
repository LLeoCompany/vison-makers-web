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
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-h2 text-primary m-md">
              어떤 방식으로 상담받으시겠어요?
            </h1>
            <p className="text-body text-secondary m-lg">
              두 방식 모두 같은 품질의 상담을 받으실 수 있어요!
            </p>
          </div>

          {/* 트랙 선택 카드들 */}
          <div className="grid gap-xl">
            {/* 가이드 트랙 */}
            <div
              className="card cursor-pointer transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1"
              onClick={() => handleTrackSelection('guided')}
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                border: '2px solid #fecaca'
              }}
            >
              <div className="flex items-start gap-lg">
                <div className="text-6xl">🎯</div>
                <div className="flex-1">
                  <div className="flex items-center gap-md m-sm">
                    <h2 className="text-h3 text-primary">
                      간단한 질문 답변
                    </h2>
                    <span className="bg-red text-white px-md py-sm text-body-sm rounded-full">
                      추천
                    </span>
                  </div>
                  <div className="m-md">
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-green rounded-full"></span>
                      4개 질문으로 정확한 상담
                    </div>
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-green rounded-full"></span>
                      예상 소요시간: 2-3분
                    </div>
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-green rounded-full"></span>
                      더 구체적인 제안 받기
                    </div>
                  </div>
                  <div className="m-md">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelection('guided');
                      }}
                    >
                      🚀 질문 답변하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 자유 트랙 */}
            <div
              className="card cursor-pointer transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1"
              onClick={() => handleTrackSelection('free')}
              style={{
                background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                border: '2px solid #e5e7eb'
              }}
            >
              <div className="flex items-start gap-lg">
                <div className="text-6xl">📝</div>
                <div className="flex-1">
                  <h2 className="text-h3 text-primary m-sm">
                    자유롭게 작성하기
                  </h2>
                  <div className="m-md">
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-blue rounded-full"></span>
                      원하는 대로 자세히 설명
                    </div>
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-blue rounded-full"></span>
                      예상 소요시간: 1-2분
                    </div>
                    <div className="flex items-center text-secondary gap-sm m-xs">
                      <span className="w-2 h-2 bg-blue rounded-full"></span>
                      전화로 자세한 논의
                    </div>
                  </div>
                  <div className="m-md">
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelection('free');
                      }}
                    >
                      ✍️ 자유롭게 작성하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="card-simple" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div className="flex gap-md items-start">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-body text-blue">
                  <strong>어떤 방식을 선택해도 괜찮아요!</strong><br />
                  전문 상담사가 꼼꼼히 검토한 후, 가장 적합한 솔루션을 제안해드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* 도움말 */}
          <div className="text-center">
            <p className="text-body-sm text-secondary">
              선택이 어려우시면 <span className="text-red">📞 010-9915-4724</span>로 바로 연락주세요
            </p>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}