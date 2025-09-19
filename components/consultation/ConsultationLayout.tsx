/**
 * VisionMakers 상담 시스템 레이아웃 컴포넌트
 * 설계 문서 3. 사용자 인터페이스 설계 기반
 */

import React, { ReactNode } from "react";
import Head from "next/head";
import { useConsultation } from "@/contexts/ConsultationContext";
import Header from "@/components/Header";

interface ConsultationLayoutProps {
  children: ReactNode;
  title?: string;
  showProgress?: boolean;
  showHeader?: boolean;
}

export default function ConsultationLayout({
  children,
  title = "상담 신청",
  showProgress = false,
  showHeader = true,
}: ConsultationLayoutProps) {
  const { state } = useConsultation();

  return (
    <>
      <Head>
        <title>{title} | VisionMakers</title>
        <meta name="description" content="VisionMakers 웹개발 상담 신청" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* {showHeader && <Header />} */}

        {/* 진행률 표시 */}
        {showProgress && state.trackType && (
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-semibold">
                  {state.trackType === "guided"
                    ? "간단한 질문 답변"
                    : "자유롭게 작성하기"}
                </h1>
                {state.trackType === "guided" && (
                  <span className="text-sm text-gray-500">
                    {state.currentStep}/{state.totalSteps} 단계
                  </span>
                )}
              </div>

              {/* 진행률 바 */}
              {state.trackType === "guided" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(state.currentStep / state.totalSteps) * 100}%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">{children}</div>
        </main>

        {/* 푸터 - 간단한 도움말 */}
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-4 text-center">
            <p className="text-sm text-gray-500">
              궁금한 점이 있으시면 언제든{" "}
              <span className="text-red-500 font-medium">010-9915-4724</span>로
              연락주세요
            </p>
          </div>
        </footer>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .container {
          max-width: 1200px;
        }
      `}</style>
    </>
  );
}
