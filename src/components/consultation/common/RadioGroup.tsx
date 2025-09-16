/**
 * VisionMakers 상담 시스템 라디오 그룹 컴포넌트
 * 설계 문서 3. 사용자 인터페이스 설계 기반 - 일관된 선택 UI
 */

import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  recommended?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  error?: string;
}

export default function RadioGroup({
  name,
  value,
  onChange,
  options,
  className = '',
  error
}: RadioGroupProps) {
  return (
    <div className={className}>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${value === option.value
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${error ? 'border-red-300' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />

            {/* 커스텀 라디오 버튼 */}
            <div className={`
              flex-shrink-0 w-5 h-5 mt-0.5 mr-3 border-2 rounded-full transition-all duration-200
              ${value === option.value
                ? 'border-red-500 bg-red-500'
                : 'border-gray-300'
              }
            `}>
              {value === option.value && (
                <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className={`
                  font-medium text-base
                  ${value === option.value ? 'text-red-700' : 'text-gray-900'}
                `}>
                  {option.label}
                </span>
                {option.recommended && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">
                    ⭐ 추천
                  </span>
                )}
              </div>
              {option.description && (
                <p className={`
                  mt-1 text-sm
                  ${value === option.value ? 'text-red-600' : 'text-gray-500'}
                `}>
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}