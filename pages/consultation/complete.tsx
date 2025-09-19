/**
 * VisionMakers 상담 시스템 - 완료 페이지
 * 설계 문서 2.7 완료 페이지 기반 구현
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import { formatDate } from '@/utils/consultation';

interface ConsultationCompleteData {
  consultationId: string;
  consultationNumber: string;
  type: 'guided' | 'free';
  estimatedContactTime: string;
  submittedAt: string;
}

export default function ConsultationComplete() {
  const router = useRouter();
  const [consultationData, setConsultationData] = useState<ConsultationCompleteData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { consultationId, consultationNumber, type } = router.query;

    if (!consultationId || !consultationNumber) {
      // 필수 데이터가 없으면 홈으로 리다이렉트
      router.replace('/');
      return;
    }

    // 상담 완료 데이터 설정
    setConsultationData({
      consultationId: consultationId as string,
      consultationNumber: consultationNumber as string,
      type: (type as 'guided' | 'free') || 'free',
      estimatedContactTime: type === 'guided' ? '2-4시간 내' : '4-8시간 내',
      submittedAt: new Date().toISOString()
    });

    // 완료 이벤트 추적
    gtag('event', 'consultation_completed', {
      event_category: 'Conversion',
      event_label: type as string,
      consultation_type: type as string,
      consultation_id: consultationId as string
    });

    // Facebook Pixel 완료 이벤트
    if (typeof fbq !== 'undefined') {
      fbq('track', 'CompleteRegistration', {
        content_category: 'consultation',
        content_name: `consultation_${type}`,
        status: 'completed'
      });
    }
  }, [router]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  if (!consultationData) {
    return (
      <ConsultationLayout title="상담 신청 완료">
        <div className="container">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
          </div>
        </div>
      </ConsultationLayout>
    );
  }

  const nextSteps = [
    {
      number: 1,
      title: '신청 접수 완료',
      description: '고객님의 상담 신청을 접수했습니다',
      status: 'completed',
      icon: '✓'
    },
    {
      number: 2,
      title: '상담 준비',
      description: '담당자가 프로젝트를 검토하고 상담을 준비합니다',
      status: 'current',
      icon: '📋'
    },
    {
      number: 3,
      title: '전화 상담',
      description: '선택하신 시간에 전화로 상세 상담을 진행합니다',
      status: 'pending',
      icon: '📞'
    },
    {
      number: 4,
      title: '제안서 발송',
      description: '상담 결과를 바탕으로 맞춤 제안서를 보내드립니다',
      status: 'pending',
      icon: '📋'
    }
  ];

  return (
    <>
      <Head>
        <title>상담 신청 완료 | VisionMakers</title>
        <meta name="description" content="VisionMakers 상담 신청이 완료되었습니다. 곧 연락드리겠습니다." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <ConsultationLayout title="상담 신청 완료" showProgress={false}>
        <div className="container">
          <div className="card max-w-4xl mx-auto">
            {/* 성공 헤더 */}
            <div className="text-center m-xl">
              <div className="text-6xl m-md">✅</div>
              <h1 className="text-h1 text-primary m-md">
                상담 신청이 완료되었습니다!
              </h1>
              <p className="text-body-lg text-secondary">
                소중한 시간을 내어 상담을 신청해주셔서 감사합니다.<br />
                곧 담당자가 연락드리겠습니다.
              </p>
            </div>

            {/* 상담 정보 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md m-xl">
              <div className="card-simple">
                <div className="text-center">
                  <div className="text-body-sm text-secondary m-xs">상담 번호</div>
                  <div className="flex items-center justify-center gap-sm">
                    <span className="text-h3 text-primary font-mono">
                      {consultationData.consultationNumber}
                    </span>
                    <button
                      className="btn-icon text-gray-500 hover:text-red"
                      onClick={() => copyToClipboard(consultationData.consultationNumber)}
                      title="복사하기"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                  {copied && (
                    <div className="text-body-sm text-green mt-xs">복사되었습니다!</div>
                  )}
                </div>
              </div>

              <div className="card-simple">
                <div className="text-center">
                  <div className="text-body-sm text-secondary m-xs">신청 일시</div>
                  <div className="text-h3 text-primary">
                    {formatDate(consultationData.submittedAt, 'full')}
                  </div>
                </div>
              </div>

              <div className="card-simple">
                <div className="text-center">
                  <div className="text-body-sm text-secondary m-xs">예상 연락 시간</div>
                  <div className="text-h3 text-red">
                    {consultationData.estimatedContactTime}
                  </div>
                </div>
              </div>
            </div>

            {/* 다음 단계 안내 */}
            <div className="m-xl">
              <h2 className="text-h2 text-primary text-center m-lg">
                🗺️ 앞으로의 진행 과정
              </h2>

              <div className="space-y-md">
                {nextSteps.map((step, index) => (
                  <div key={step.number} className="relative">
                    {/* 연결선 */}
                    {index < nextSteps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                    )}

                    <div className={`flex items-start gap-md p-md rounded-xl border-2 transition-all ${
                      step.status === 'completed'
                        ? 'border-green bg-green/5'
                        : step.status === 'current'
                        ? 'border-red bg-red/5'
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      {/* 단계 번호 */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        step.status === 'completed'
                          ? 'bg-green text-white'
                          : step.status === 'current'
                          ? 'bg-red text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? '✓' : step.number}
                      </div>

                      {/* 단계 내용 */}
                      <div className="flex-1">
                        <h3 className="text-h3 text-primary m-xs">
                          {step.title}
                        </h3>
                        <p className="text-body text-secondary">
                          {step.description}
                        </p>
                      </div>

                      {/* 상태 아이콘 */}
                      <div className="flex-shrink-0 text-2xl">
                        {step.status === 'completed' ? '✅' :
                         step.status === 'current' ? '🔄' : step.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="card-simple" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <div className="text-center m-lg">
                <h3 className="text-h3 text-blue m-md">
                  📞 문의사항이 있으시면
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="flex items-center justify-center gap-sm">
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="text-body-sm text-secondary">전화</div>
                      <div className="text-h3 text-primary">02-1234-5678</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-sm">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <div className="text-body-sm text-secondary">이메일</div>
                      <div className="text-h3 text-primary">contact@visionmakers.co.kr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-md justify-center items-stretch sm:items-center m-xl">
              <button
                className="btn btn-outline btn-lg"
                onClick={() => router.push('/')}
              >
                🏠 홈으로 돌아가기
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => router.push('/portfolio')}
              >
                🎨 포트폴리오 보기
              </button>
            </div>

            {/* 추가 안내사항 */}
            <div className="text-center m-xl p-md bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-body text-yellow-800">
                <strong>💡 안내:</strong> 상담 번호는 추후 문의 시 필요하니 저장해두시기 바랍니다.<br />
                영업시간(평일 9시-18시) 외 신청 시 다음 영업일에 연락드립니다.
              </p>
            </div>
          </div>
        </div>
      </ConsultationLayout>
    </>
  );
}