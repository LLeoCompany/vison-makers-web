/**
 * LeoFitTech 자유 상담 페이지 - Toss UI 스타일
 * 설계 문서 4.2 UI/UX 플로우 기반 + Toss 디자인 패턴 적용
 */

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useConsultation } from "../../contexts/ConsultationContext";
import { ContactInfo } from "../../types/consultation";
import Modal from "../../components/common/Modal";

const FreeConsultationPage: React.FC = () => {
  const router = useRouter();
  const { state, setFreeDescription, setContact } = useConsultation();
  const [formData, setFormData] = useState({
    description: state.free.description || "",
    name: state.free.contact.name || "",
    phone: state.free.contact.phone || "",
    email: state.free.contact.email || "",
    company: state.free.contact.company || "",
    preferredContactTime:
      state.free.contact.preferredContactTime || ("anytime" as const),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    subMessage?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "프로젝트 설명을 입력해주세요.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "프로젝트에 대해 최소 10자 이상 설명해주세요.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "성함을 입력해주세요.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요.";
    } else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 (Slack 알림)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "free",
          contact: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            company: formData.company || undefined,
            preferredContactTime: formData.preferredContactTime,
          },
          projectDescription: formData.description,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "상담 신청 중 오류가 발생했습니다.");
      }

      // 성공 시 모달 표시
      setModal({
        isOpen: true,
        type: "success",
        title: "상담 신청이 완료되었습니다!",
        message: `상담 번호: ${result.data.consultationNumber}`,
        subMessage: "영업일 기준 24시간 이내에 연락드리겠습니다.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        description: error instanceof Error ? error.message : "상담 신청 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactTimeOptions = [
    { value: "morning", label: "오전 (9-12시)" },
    { value: "afternoon", label: "오후 (1-6시)" },
    { value: "evening", label: "저녁 (6-8시)" },
    { value: "anytime", label: "언제든" },
  ];

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (modal.type === "success") {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 성공/에러 모달 */}
      <Modal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        subMessage={modal.subMessage}
        buttonText={modal.type === "success" ? "홈으로 돌아가기" : "확인"}
        onConfirm={handleModalClose}
      />

      {/* 헤더 - Toss 스타일 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/consultation/start")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            프로젝트를
            <br />
            <span className="text-green-500">자유롭게</span> 설명해주세요
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            원하시는 프로젝트에 대해 편하게 설명해주시면,
            <br />
            전문가가 직접 연락드려 상세한 상담을 진행해드려요.
          </p>
        </div>

        {/* 상담 폼 - Toss 스타일 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 프로젝트 설명 */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                프로젝트 설명
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  rows={6}
                  className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-colors focus:outline-none ${
                    errors.description
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="어떤 프로젝트를 계획하고 계신가요?

예를 들어:
• 온라인 쇼핑몰을 만들고 싶어요
• 상품 등록, 주문 관리, 결제 기능이 필요해요
• 예산은 500만원 내외로 생각하고 있어요
• 3개월 내에 완성했으면 좋겠어요

자세히 설명해주실수록 정확한 상담이 가능해요."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {formData.description.length}/2000
                </div>
              </div>
              {errors.description ? (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  최소 10자 이상 입력해주세요. 자세할수록 정확한 상담이
                  가능해요.
                </p>
              )}
            </div>

            {/* 연락처 정보 - Toss 스타일 */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                연락처 정보
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 성함 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    성함
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-colors focus:outline-none ${
                      errors.name
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 연락처 */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-colors focus:outline-none ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* 이메일 */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-colors focus:outline-none ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 회사명 */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    회사명 <span className="text-gray-400">(선택)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-colors focus:outline-none focus:border-green-500"
                    placeholder="회사명 또는 개인"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* 연락 선호 시간 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  연락 선호 시간
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {contactTimeOptions.map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContactTime"
                        value={option.value}
                        checked={formData.preferredContactTime === option.value}
                        onChange={(e) =>
                          handleInputChange(
                            "preferredContactTime",
                            e.target.value
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`text-center py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                          formData.preferredContactTime === option.value
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {option.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 제출 버튼 - Toss 스타일 */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-12 py-4 rounded-xl font-semibold transition-colors text-lg flex items-center ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? "처리 중..." : "상담 신청하기"}
                  {!isSubmitting && (
                    <svg
                      className="w-5 h-5 ml-2"
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
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 추가 안내 - Toss 스타일 */}
        <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">
                상담 진행 안내
              </h4>
              <p className="text-sm text-green-800 leading-relaxed">
                신청해주신 내용을 바탕으로 <strong>24시간 이내</strong>에
                전문가가 연락드립니다. 상담은 <strong>완전 무료</strong>이며,
                프로젝트에 대한 구체적인 제안서와 견적을 제공해드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeConsultationPage;
