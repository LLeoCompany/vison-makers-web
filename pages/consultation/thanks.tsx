/**
 * VisionMakers 상담 등록 완료 감사 페이지
 * 현대적 UI/UX 및 마케팅 심리학 적용
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { formatDate } from '@/utils/consultation';

interface ThanksPageData {
  consultationId: string;
  consultationNumber: string;
  type: 'guided' | 'free';
  estimatedContactTime: string;
  submittedAt: string;
}

export default function ConsultationThanks() {
  const router = useRouter();
  const [consultationData, setConsultationData] = useState<ThanksPageData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const { id } = router.query;

    if (!id) {
      router.replace('/');
      return;
    }

    // 상담 완료 데이터 설정 (실제로는 API에서 가져와야 함)
    setConsultationData({
      consultationId: id as string,
      consultationNumber: generateConsultationNumber(),
      type: 'guided',
      estimatedContactTime: '24시간 내',
      submittedAt: new Date().toISOString()
    });

    // 성공 애니메이션 효과
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // 완료 이벤트 추적
    if (typeof gtag !== 'undefined') {
      gtag('event', 'consultation_completed', {
        event_category: 'Conversion',
        event_label: 'guided',
        consultation_id: id as string
      });
    }
  }, [router]);

  const generateConsultationNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `CS-${dateStr}-${timeStr}`;
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>상담 신청 완료 - 감사합니다! | VisionMakers</title>
        <meta name="description" content="VisionMakers 상담 신청이 성공적으로 완료되었습니다. 곧 연락드리겠습니다." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* 컨페티 효과 */}
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className={`confetti confetti-${i % 5}`}></div>
            ))}
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold text-blue-600">VisionMakers</div>
            </Link>
          </div>

          {/* 메인 카드 */}
          <div className="max-w-4xl mx-auto">
            {/* 성공 메시지 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
              {/* 장식 요소 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full translate-y-12 -translate-x-12 opacity-10"></div>

              <div className="text-center relative z-10">
                {/* 성공 아이콘 */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  🎉 상담 신청 완료!
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  소중한 시간을 내어 VisionMakers를 선택해주셔서 감사합니다.<br />
                  <span className="text-blue-600 font-semibold">전문 컨설턴트</span>가 곧 연락드리겠습니다.
                </p>

                {/* 상담 번호 하이라이트 */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
                  <div className="text-sm opacity-90 mb-2">상담 번호</div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-wide">
                      {consultationData.consultationNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(consultationData.consultationNumber)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="복사하기"
                    >
                      {copied ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <div className="text-sm mt-2 animate-pulse">📋 복사되었습니다!</div>
                  )}
                </div>
              </div>
            </div>

            {/* 정보 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 예상 연락 시간 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">예상 연락 시간</div>
                  <div className="text-2xl font-bold text-red-600">{consultationData.estimatedContactTime}</div>
                </div>
              </div>

              {/* 신청 일시 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">신청 일시</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatDate(consultationData.submittedAt, 'date')}
                  </div>
                </div>
              </div>

              {/* 상담 유형 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">상담 유형</div>
                  <div className="text-lg font-bold text-purple-600">
                    {consultationData.type === 'guided' ? '가이드 상담' : '자유 상담'}
                  </div>
                </div>
              </div>
            </div>

            {/* 다음 단계 안내 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                🗺️ 앞으로 진행되는 과정
              </h2>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: '신청 접수 완료',
                    description: '고객님의 상담 신청을 성공적으로 접수했습니다',
                    status: 'completed',
                    icon: '✅'
                  },
                  {
                    step: 2,
                    title: '담당자 배정 및 검토',
                    description: '프로젝트 전문가가 배정되어 요구사항을 상세히 검토합니다',
                    status: 'current',
                    icon: '👨‍💼'
                  },
                  {
                    step: 3,
                    title: '전화 상담',
                    description: '담당자가 직접 연락드려 상세한 상담을 진행합니다',
                    status: 'pending',
                    icon: '📞'
                  },
                  {
                    step: 4,
                    title: '맞춤 제안서 발송',
                    description: '상담 결과를 바탕으로 최적화된 제안서를 제공합니다',
                    status: 'pending',
                    icon: '📋'
                  }
                ].map((item, index) => (
                  <div key={item.step} className="relative">
                    {/* 연결선 */}
                    {index < 3 && (
                      <div className="absolute left-6 top-14 w-0.5 h-8 bg-gray-200"></div>
                    )}

                    <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                      item.status === 'completed'
                        ? 'bg-green-50 border-2 border-green-200'
                        : item.status === 'current'
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        item.status === 'completed'
                          ? 'bg-green-500'
                          : item.status === 'current'
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-400'
                      }`}>
                        {item.status === 'completed' ? '✓' : item.step}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-2xl">
                        {item.status === 'current' ? '🔄' : item.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 연락처 및 액션 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 연락처 정보 */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">📞</span>
                  궁금한 점이 있으시면
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">📞</span>
                    <div>
                      <div className="text-sm opacity-90">전화 문의</div>
                      <div className="font-semibold">010-9915-4724</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">✉️</span>
                    <div>
                      <div className="text-sm opacity-90">이메일 문의</div>
                      <div className="font-semibold">sh414lim@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 추가 액션 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🎯 추천 액션
                </h3>
                <div className="space-y-3">
                  <Link href="/portfolio" className="block w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 text-center transition-colors">
                    <span className="mr-2">🎨</span>
                    포트폴리오 둘러보기
                  </Link>
                  <Link href="/blog" className="block w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-3 text-center transition-colors">
                    <span className="mr-2">📚</span>
                    개발 블로그 읽기
                  </Link>
                  <Link href="/" className="block w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg p-3 text-center transition-colors">
                    <span className="mr-2">🏠</span>
                    홈으로 돌아가기
                  </Link>
                </div>
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
              <p className="text-yellow-800">
                <span className="font-semibold">💡 안내:</span> 상담 번호는 추후 문의 시 필요하니 저장해두시기 바랍니다.<br />
                <span className="text-sm">영업시간(평일 9시-18시) 외 신청 시 다음 영업일에 연락드립니다.</span>
              </p>
            </div>
          </div>
        </div>

        {/* 스타일 */}
        <style jsx>{`
          .bg-grid-pattern {
            background-image:
              linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px);
            background-size: 20px 20px;
          }

          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
          }

          .confetti {
            position: absolute;
            top: -10px;
            animation: confetti-fall 3s linear forwards;
          }

          .confetti-0 { left: 10%; background: #ff6b6b; width: 10px; height: 10px; animation-delay: 0s; }
          .confetti-1 { left: 30%; background: #4ecdc4; width: 8px; height: 8px; animation-delay: 0.2s; }
          .confetti-2 { left: 50%; background: #45b7d1; width: 12px; height: 12px; animation-delay: 0.4s; }
          .confetti-3 { left: 70%; background: #96ceb4; width: 9px; height: 9px; animation-delay: 0.6s; }
          .confetti-4 { left: 90%; background: #feca57; width: 11px; height: 11px; animation-delay: 0.8s; }

          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          @media (max-width: 768px) {
            .container {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}