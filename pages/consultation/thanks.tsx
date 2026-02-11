/**
 * 상담 신청 완료 감사 페이지
 */

import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function ConsultationThanks() {
  return (
    <>
      <Head>
        <title>상담 신청 완료 | Vision-Makers</title>
        <meta
          name="description"
          content="Vision-Makers 상담 신청이 완료되었습니다."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#10B981]/20 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-[#10B981]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              신청이 완료되었습니다
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed">
              소중한 관심에 감사드립니다.
              <br />
              <span className="text-[#10B981] font-medium">
                24시간 내
              </span>
              에 연락드리겠습니다.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">예상 연락 시간</span>
                <span className="text-white font-medium">영업일 기준 24시간 내</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400">문의 전화</span>
                <a
                  href="tel:010-9915-4724"
                  className="text-[#10B981] font-medium hover:underline"
                >
                  010-9915-4724
                </a>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-4 text-left">진행 과정</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "신청 접수 완료", done: true },
                { step: 2, title: "담당자 검토", done: false },
                { step: 3, title: "연락 및 상담", done: false },
                { step: 4, title: "맞춤 제안", done: false },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      item.done
                        ? "bg-[#10B981] text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {item.done ? "✓" : item.step}
                  </div>
                  <span
                    className={
                      item.done ? "text-white" : "text-gray-500"
                    }
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
}
