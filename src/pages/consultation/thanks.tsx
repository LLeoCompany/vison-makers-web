/**
 * VisionMakers 상담 시스템 - 상담 완료 페이지
 * 설계 문서 5.1 완료 페이지 기반
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
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
      <div className="container">
        <div className="card text-center">
          {/* 성공 아이콘 */}
          <div className="m-xl">
            <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto m-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h1 className="text-h1 text-primary m-md">
              🎉 상담 신청이 완료되었습니다!
            </h1>
            <p className="text-body-lg text-secondary">
              소중한 시간을 내어 신청해주셔서 감사합니다.
            </p>
          </div>

          {/* 신청 정보 */}
          {consultationId && (
            <div className="card-simple" style={{ background: '#f9fafb' }}>
              <p className="text-body-sm text-secondary m-xs">상담 신청 번호</p>
              <p className="text-h3 text-primary" style={{ fontFamily: 'monospace' }}>
                {consultationId}
              </p>
            </div>
          )}

          {/* 다음 단계 안내 */}
          <div className="m-xl">
            <h2 className="text-h2 text-primary m-lg">
              📞 다음 단계
            </h2>
            <div className="grid gap-lg text-left">
              <div className="flex items-start gap-md">
                <div className="flex-shrink-0 w-8 h-8 bg-red text-white rounded-full flex items-center justify-center text-body-sm">
                  1
                </div>
                <div>
                  <p className="text-h3 text-primary">내부 검토</p>
                  <p className="text-body text-secondary">전문 상담사가 신청 내용을 꼼꼼히 검토합니다</p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="flex-shrink-0 w-8 h-8 bg-red text-white rounded-full flex items-center justify-center text-body-sm">
                  2
                </div>
                <div>
                  <p className="text-h3 text-primary">전화 상담</p>
                  <p className="text-body text-secondary">1-2일 내에 연락드려 자세한 상담을 진행합니다</p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="flex-shrink-0 w-8 h-8 bg-red text-white rounded-full flex items-center justify-center text-body-sm">
                  3
                </div>
                <div>
                  <p className="text-h3 text-primary">맞춤 제안</p>
                  <p className="text-body text-secondary">고객님께 최적화된 솔루션과 견적을 제안드립니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* 중요 안내 */}
          <div className="card-simple" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div className="flex items-start gap-md text-left">
              <div className="text-2xl">📱</div>
              <div>
                <p className="text-body text-blue">
                  <strong>연락이 안 될 경우</strong><br />
                  혹시 저희 연락을 받지 못하셨거나 급하신 경우,
                  언제든 <span className="text-red">010-9915-4724</span>로 연락주세요.
                  평일 오전 9시~오후 6시에 상담 가능합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 추가 서비스 안내 */}
          <div className="card-simple" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <div className="flex items-start gap-md text-left">
              <div className="text-2xl">✨</div>
              <div>
                <p className="text-body text-yellow">
                  <strong>무료 서비스</strong><br />
                  상담은 무료이며, 프로젝트 진행이 확정된 후에만 비용이 발생합니다.
                  부담 없이 상담받아보세요!
                </p>
              </div>
            </div>
          </div>

          {/* 소셜 링크 */}
          <div className="m-xl">
            <p className="text-body text-secondary m-md">
              VisionMakers의 다양한 소식을 만나보세요
            </p>
            <div className="flex justify-center gap-lg">
              <a
                href="https://www.instagram.com/visionmakers_official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-red hover:underline transition-colors"
              >
                📷 Instagram
              </a>
              <a
                href="https://blog.naver.com/visionmakers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-green hover:underline transition-colors"
              >
                📝 Blog
              </a>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col gap-md justify-center m-xl">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGoHome}
            >
              🏠 홈페이지로 가기
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleNewConsultation}
            >
              ➕ 다른 상담 신청하기
            </button>
          </div>

          {/* 하단 메시지 */}
          <div className="m-xl" style={{ borderTop: '1px solid var(--border-gray)', paddingTop: 'var(--spacing-xl)' }}>
            <p className="text-body text-secondary">
              상담 신청해주셔서 진심으로 감사드립니다. <br />
              고객님의 성공적인 비즈니스를 위해 최선을 다하겠습니다.
            </p>
            <p className="text-caption m-sm">
              © 2024 VisionMakers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}