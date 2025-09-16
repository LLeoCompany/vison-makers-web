/**
 * VisionMakers 상담 시스템 - 상담 완료 페이지
 * 설계 문서 5.1 완료 페이지 기반
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import { useConsultation } from '@/contexts/ConsultationContext';

export default function ConsultationThanks() {
  const router = useRouter();
  const { clearConsultation } = useConsultation();
  const [consultationId, setConsultationId] = useState<string>('');

  useEffect(() => {
    const { id } = router.query;
    if (id && typeof id === 'string') {
      setConsultationId(id);
    }
  }, [router.query]);

  useEffect(() => {
    // 상담 완료 후 상태 초기화
    clearConsultation();
  }, [clearConsultation]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleNewConsultation = () => {
    router.push('/consultation/start');
  };

  return (
    <ConsultationLayout
      title="상담 신청 완료"
      showProgress={false}
      showHeader={false}
    >
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        {/* 성공 아이콘 */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 상담 신청이 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600">
            소중한 시간을 내어 신청해주셔서 감사합니다.
          </p>
        </div>

        {/* 신청 정보 */}
        {consultationId && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">상담 신청 번호</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {consultationId}
            </p>
          </div>
        )}

        {/* 다음 단계 안내 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📞 다음 단계
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">내부 검토</p>
                <p className="text-sm text-gray-600">전문 상담사가 신청 내용을 꼼꼼히 검토합니다</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">전화 상담</p>
                <p className="text-sm text-gray-600">1-2일 내에 연락드려 자세한 상담을 진행합니다</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">맞춤 제안</p>
                <p className="text-sm text-gray-600">고객님께 최적화된 솔루션과 견적을 제안드립니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 중요 안내 */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-xl">📱</span>
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm text-blue-800">
                <strong>연락이 안 될 경우</strong><br />
                혹시 저희 연락을 받지 못하셨거나 급하신 경우,
                언제든 <span className="font-semibold">010-9915-4724</span>로 연락주세요.
                평일 오전 9시~오후 6시에 상담 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 추가 서비스 안내 */}
        <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 text-xl">✨</span>
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm text-yellow-800">
                <strong>무료 서비스</strong><br />
                상담은 무료이며, 프로젝트 진행이 확정된 후에만 비용이 발생합니다.
                부담 없이 상담받아보세요!
              </p>
            </div>
          </div>
        </div>

        {/* 소셜 링크 */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-3">
            VisionMakers의 다양한 소식을 만나보세요
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.instagram.com/visionmakers_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              📷 Instagram
            </a>
            <a
              href="https://blog.naver.com/visionmakers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              📝 Blog
            </a>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            variant="primary"
            onClick={handleGoHome}
            className="flex items-center justify-center"
          >
            🏠 홈페이지로 가기
          </Button>
          <Button
            variant="outline"
            onClick={handleNewConsultation}
            className="flex items-center justify-center"
          >
            ➕ 다른 상담 신청하기
          </Button>
        </div>

        {/* 하단 메시지 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            상담 신청해주셔서 진심으로 감사드립니다. <br />
            고객님의 성공적인 비즈니스를 위해 최선을 다하겠습니다.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2024 VisionMakers. All rights reserved.
          </p>
        </div>
      </div>
    </ConsultationLayout>
  );
}