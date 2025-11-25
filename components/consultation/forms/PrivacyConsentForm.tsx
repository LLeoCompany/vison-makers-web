/**
 * LeoFitTech 상담 시스템 - 개인정보 동의 폼 컴포넌트
 * 재사용 가능한 개인정보 동의 체크박스
 */

import React from "react";

interface PrivacyConsentFormProps {
  consent: boolean;
  onChange: (consent: boolean) => void;
  error?: string;
}

export default function PrivacyConsentForm({
  consent,
  onChange,
  error,
}: PrivacyConsentFormProps) {
  const handlePrivacyPolicyClick = () => {
    window.open("/privacy-policy", "_blank");
  };

  return (
    <div>
      <div className="flex items-start">
        <input
          type="checkbox"
          id="privacy-consent"
          checked={consent}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500"
          aria-invalid={!!error}
          aria-describedby={error ? "consent-error" : "consent-description"}
        />
        <div className="ml-3">
          <label
            htmlFor="privacy-consent"
            className="text-sm font-medium text-gray-900"
          >
            ✅ 개인정보 수집 동의 <span className="text-red-500">*</span>
          </label>
          <p id="consent-description" className="text-sm text-gray-600 mt-1">
            상담을 위한 개인정보 수집에 동의합니다.
            <br />
            수집항목: 이름, 연락처, 이메일 | 보관기간: 3년
          </p>
          <button
            type="button"
            className="text-sm text-red-500 hover:text-red-700 underline mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            onClick={handlePrivacyPolicyClick}
          >
            개인정보처리방침 자세히보기
          </button>
        </div>
      </div>
      {error && (
        <p
          id="consent-error"
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
