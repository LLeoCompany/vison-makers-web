/**
 * VisionMakers 상담 시스템 - 공유 연락처 정보 폼 컴포넌트
 * DRY 원칙을 위한 재사용 가능한 연락처 입력 폼
 */

import React from 'react';
import { ContactInfo } from '../../../types/consultation';
import { THEME_COLORS } from '../../../constants';

interface ContactInfoFormProps {
  contact: Partial<ContactInfo>;
  onChange: (field: keyof ContactInfo, value: string) => void;
  errors: Record<string, string>;
  showCompany?: boolean;
  layout?: 'grid' | 'stacked';
}

export default function ContactInfoForm({
  contact,
  onChange,
  errors,
  showCompany = true,
  layout = 'stacked'
}: ContactInfoFormProps) {
  const getInputClasses = (hasError: boolean) => `
    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-${THEME_COLORS.PRIMARY_FOCUS} focus:border-${THEME_COLORS.PRIMARY_FOCUS} transition-colors duration-200
    ${hasError ? `border-${THEME_COLORS.ERROR}` : 'border-gray-300'}
  `;

  const gridClasses = layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4';

  return (
    <div className="space-y-4">
      <div className={gridClasses}>
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contact.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="홍길동"
            className={getInputClasses(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연락처 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={contact.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="010-1234-5678"
            className={getInputClasses(!!errors.phone)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={contact.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="hong@example.com"
          className={getInputClasses(!!errors.email)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* 회사명 (선택사항) */}
      {showCompany && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            회사명 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
          </label>
          <input
            type="text"
            value={contact.company || ''}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder="회사명 또는 사업자명"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          />
        </div>
      )}
    </div>
  );
}