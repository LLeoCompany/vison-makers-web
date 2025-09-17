/**
 * VisionMakers 상담 시스템 - 자유 트랙: 자유 작성
 * 설계 문서 4.1 자유 트랙 기반
 */

import React, { useState } from "react";
import { useRouter } from "next/router";
import ConsultationLayout from "@/components/consultation/ConsultationLayout";
import { useConsultation } from "@/contexts/ConsultationContext";
import { ContactInfo } from "@/types/consultation";

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  projectDescription?: string;
  privacyConsent?: string;
}

export default function FreeWrite() {
  const router = useRouter();
  const { state, setFreeProject, setContact } = useConsultation();
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const free = state.free;

    if (!free.projectDescription?.trim()) {
      newErrors.projectDescription = "프로젝트에 대해 설명해주세요.";
    } else if (free.projectDescription.trim().length < 20) {
      newErrors.projectDescription = "최소 20자 이상 작성해주세요.";
    }

    if (!free.contact.name?.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!free.contact.phone?.trim()) {
      newErrors.phone = "연락처를 입력해주세요.";
    } else if (!/^[0-9-+\s]+$/.test(free.contact.phone)) {
      newErrors.phone = "올바른 연락처 형식이 아닙니다.";
    }

    if (!free.contact.email?.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(free.contact.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!privacyConsent) {
      newErrors.privacyConsent = "개인정보 수집 동의가 필요합니다.";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const consultationData = {
        type: "free" as const,
        projectDescription: state.free.projectDescription,
        budget: state.free.budget,
        timeline: state.free.timeline,
        contact: state.free.contact as ContactInfo,
      };

      const response = await fetch("/api/consultation-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) {
        throw new Error("상담 신청 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      router.push(`/consultation/thanks?id=${result.consultationId}`);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        name:
          error instanceof Error
            ? error.message
            : "상담 신청 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    router.push("/consultation/start");
  };

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContact({ [field]: value }, "free");
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleProjectDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFreeProject(e.target.value);
    setErrors((prev) => ({ ...prev, projectDescription: undefined }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeProject(state.free.projectDescription, e.target.value);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeProject(
      state.free.projectDescription,
      state.free.budget,
      e.target.value
    );
  };

  return (
    <ConsultationLayout title="자유 작성" showProgress={false}>
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center m-xl">
            <h1 className="text-h2 text-primary">📝 자유롭게 작성해주세요</h1>
            <p className="text-body text-secondary m-md">
              필요한 서비스나 요구사항을 자유롭게 설명해주세요. 전문 상담사가
              검토 후 연락드리겠습니다.
            </p>
          </div>

          {/* 프로젝트 설명 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">🎯 프로젝트 설명</h2>
            <div>
              <label className="text-body text-primary m-sm block">
                어떤 서비스가 필요하신가요? <span className="text-red">*</span>
              </label>
              <div className="card-simple">
                <textarea
                  value={state.free.projectDescription}
                  onChange={handleProjectDescriptionChange}
                  placeholder="예시)&#10;• 카페 홈페이지를 만들고 싶어요. 메뉴 소개와 예약 기능이 필요합니다&#10;• 의류 쇼핑몰을 운영하고 있는데 온라인 판매를 시작하고 싶어요&#10;• 기존 홈페이지가 너무 오래되어서 새로 만들고 싶습니다&#10;&#10;참고하고 싶은 사이트나 특별한 요청사항도 함께 적어주세요!"
                  className="w-full p-0 border-0 text-body text-primary bg-transparent resize-none focus:outline-none"
                  rows={8}
                  maxLength={2000}
                  style={{ fontFamily: "var(--font-family)" }}
                />
                <div className="flex justify-between items-center m-sm">
                  <div>
                    {errors.projectDescription && (
                      <p className="text-red text-body-sm">
                        {errors.projectDescription}
                      </p>
                    )}
                  </div>
                  <span className="text-body-sm text-secondary">
                    {/* {state.free.projectDescription.length}/2000자 */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 예산 및 일정 (선택사항) */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              💰 예산 및 일정{" "}
              <span className="text-body-sm text-secondary">(선택사항)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div>
                <label className="text-body text-primary m-sm block">
                  예상 예산
                </label>
                <div className="card-simple">
                  <input
                    type="text"
                    value={state.free.budget || ""}
                    onChange={handleBudgetChange}
                    placeholder="예) 500만원 내외, 협의 가능"
                    className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                    style={{ fontFamily: "var(--font-family)" }}
                  />
                </div>
              </div>
              <div>
                <label className="text-body text-primary m-sm block">
                  희망 완성 시기
                </label>
                <div className="card-simple">
                  <input
                    type="text"
                    value={state.free.timeline || ""}
                    onChange={handleTimelineChange}
                    placeholder="예) 2개월 내, 급하지 않음"
                    className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                    style={{ fontFamily: "var(--font-family)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">📞 연락처 정보</h2>
            <div className="grid gap-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div>
                  <label className="text-body text-primary m-sm block">
                    이름 <span className="text-red">*</span>
                  </label>
                  <div className="card-simple">
                    <input
                      type="text"
                      value={state.free.contact.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="홍길동"
                      className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                      style={{ fontFamily: "var(--font-family)" }}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red text-body-sm m-sm">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-body text-primary m-sm block">
                    연락처 <span className="text-red">*</span>
                  </label>
                  <div className="card-simple">
                    <input
                      type="tel"
                      value={state.free.contact.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="010-1234-5678"
                      className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                      style={{ fontFamily: "var(--font-family)" }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red text-body-sm m-sm">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-body text-primary m-sm block">
                  이메일 <span className="text-red">*</span>
                </label>
                <div className="card-simple">
                  <input
                    type="email"
                    value={state.free.contact.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="hong@example.com"
                    className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                    style={{ fontFamily: "var(--font-family)" }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red text-body-sm m-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-body text-primary m-sm block">
                  회사명{" "}
                  <span className="text-body-sm text-secondary">
                    (선택사항)
                  </span>
                </label>
                <div className="card-simple">
                  <input
                    type="text"
                    value={state.free.contact.company || ""}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="회사명 또는 사업자명"
                    className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                    style={{ fontFamily: "var(--font-family)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 개인정보 동의 */}
          <div className="m-xl">
            <div className="card-simple">
              <div className="flex items-start gap-md">
                <div
                  className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    privacyConsent ? "border-red bg-red" : "border-gray-300"
                  }`}
                  onClick={() => {
                    setPrivacyConsent(!privacyConsent);
                    setErrors((prev) => ({
                      ...prev,
                      privacyConsent: undefined,
                    }));
                  }}
                >
                  {privacyConsent && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    className="text-body text-primary cursor-pointer"
                    onClick={() => {
                      setPrivacyConsent(!privacyConsent);
                      setErrors((prev) => ({
                        ...prev,
                        privacyConsent: undefined,
                      }));
                    }}
                  >
                    ✅ 개인정보 수집 동의 <span className="text-red">*</span>
                  </label>
                  <p className="text-body-sm text-secondary m-xs">
                    상담을 위한 개인정보 수집에 동의합니다.
                    <br />
                    수집항목: 이름, 연락처, 이메일 | 보관기간: 1년
                  </p>
                  <button
                    type="button"
                    className="text-body-sm text-red hover:underline m-xs"
                    onClick={() => window.open("/privacy-policy", "_blank")}
                  >
                    개인정보처리방침 자세히보기
                  </button>
                </div>
              </div>
            </div>
            {errors.privacyConsent && (
              <p className="text-red text-body-sm m-md">
                {errors.privacyConsent}
              </p>
            )}
          </div>

          {/* 도움말 */}
          <div
            className="card-simple"
            style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}
          >
            <div className="flex gap-md items-start">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-body text-blue">
                  <strong>상담 진행 방식</strong>
                  <br />
                  신청해주신 내용을 검토한 후, 1-2일 내에 전화로 자세한 상담을
                  진행합니다. 궁금한 점이 있으시면 언제든{" "}
                  <span className="text-red">010-9915-4724</span>로 연락주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-md m-xl">
            <button
              className="btn btn-ghost order-2 sm:order-1"
              onClick={handlePrev}
              disabled={isSubmitting}
            >
              ← 이전
            </button>

            <button
              className={`btn btn-lg order-1 sm:order-2 ${
                privacyConsent &&
                state.free.projectDescription &&
                state.free.contact.name &&
                state.free.contact.phone &&
                state.free.contact.email
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !privacyConsent ||
                !state.free.projectDescription ||
                !state.free.contact.name ||
                !state.free.contact.phone ||
                !state.free.contact.email
              }
            >
              {isSubmitting ? "처리 중..." : "🎉 상담 신청 완료!"}
            </button>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}
