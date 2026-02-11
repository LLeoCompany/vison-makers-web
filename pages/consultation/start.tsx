/**
 * 간단한 상담 신청 페이지
 * 회사명, 전화번호, 이메일, 회사 타입만 수집
 */

import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface FormData {
  companyName: string;
  phone: string;
  email: string;
  companyType: string;
}

const COMPANY_TYPES = [
  { value: "startup", label: "스타트업" },
  { value: "sme", label: "중소기업" },
  { value: "enterprise", label: "대기업" },
  { value: "agency", label: "에이전시" },
  { value: "individual", label: "개인사업자" },
  { value: "public", label: "공공기관" },
  { value: "other", label: "기타" },
];

const ConsultationStartPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    phone: "",
    email: "",
    companyType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      setError("회사명을 입력해주세요.");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요.");
      return false;
    }
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(formData.phone.replace(/-/g, ""))) {
      setError("올바른 전화번호를 입력해주세요.");
      return false;
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("올바른 이메일을 입력해주세요.");
      return false;
    }
    if (!formData.companyType) {
      setError("회사 타입을 선택해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/consultation-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/consultation/thanks");
      } else {
        setError(result.error?.message || "신청 중 오류가 발생했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>상담 신청 | Vision-Makers</title>
        <meta name="description" content="Vision-Makers RAG 솔루션 상담 신청" />
      </Head>

      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              상담 신청
            </h1>
            <p className="text-gray-400">
              간단한 정보를 입력하시면
              <br />
              전문 컨설턴트가 연락드립니다.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 회사명 */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  회사명 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="회사명을 입력하세요"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  전화번호 <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  이메일 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>

              {/* 회사 타입 */}
              <div>
                <label
                  htmlFor="companyType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  회사 타입 <span className="text-red-400">*</span>
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#10B981] transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="" className="bg-[#0a192f]">
                    선택하세요
                  </option>
                  {COMPANY_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-[#0a192f]"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    신청 중...
                  </span>
                ) : (
                  "상담 신청하기"
                )}
              </button>
            </form>

            {/* Privacy Notice */}
            <p className="mt-6 text-center text-xs text-gray-500">
              신청하시면{" "}
              <a href="/privacy-policy" className="text-[#10B981] hover:underline">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← 홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultationStartPage;
