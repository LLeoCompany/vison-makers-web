// Example: Consultation Form Component
// VisionMakers - Direct Supabase Usage Example

'use client';

import React, { useState } from 'react';
import {
  createGuidedConsultation,
  createFreeConsultation,
  validateGuidedConsultationForm,
  validateFreeConsultationForm,
} from '@/services/consultation';
import type {
  GuidedConsultationForm,
  FreeConsultationForm,
  ServiceType,
  ProjectSize,
  BudgetRange,
  Timeline,
  ContactTimePreference,
} from '@/types/database';

interface ConsultationFormProps {
  onSuccess?: (consultationNumber: string) => void;
  onError?: (error: string) => void;
}

export default function ConsultationForm({ onSuccess, onError }: ConsultationFormProps) {
  const [type, setType] = useState<'guided' | 'free'>('guided');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state for guided consultation
  const [guidedForm, setGuidedForm] = useState<GuidedConsultationForm>({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_company: '',
    preferred_contact_time: 'anytime',
    service_type: 'web_development',
    project_size: 'medium',
    budget: '1000_to_3000',
    timeline: '1_3_months',
    important_features: [],
    additional_requests: '',
  });

  // Form state for free consultation
  const [freeForm, setFreeForm] = useState<FreeConsultationForm>({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_company: '',
    preferred_contact_time: 'anytime',
    project_description: '',
    budget_range: '',
    timeline_preference: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Get client metadata
      const metadata = {
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // In real app, get from API
        referrerUrl: document.referrer,
      };

      let result;

      if (type === 'guided') {
        // Validate guided form
        const validation = validateGuidedConsultationForm(guidedForm);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }

        // Submit guided consultation
        result = await createGuidedConsultation(guidedForm, metadata);
      } else {
        // Validate free form
        const validation = validateFreeConsultationForm(freeForm);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return;
        }

        // Submit free consultation
        result = await createFreeConsultation(freeForm, metadata);
      }

      if (result.success && result.data) {
        onSuccess?.(result.data.consultationNumber);
        // Reset form
        if (type === 'guided') {
          setGuidedForm({
            contact_name: '',
            contact_phone: '',
            contact_email: '',
            contact_company: '',
            preferred_contact_time: 'anytime',
            service_type: 'web_development',
            project_size: 'medium',
            budget: '1000_to_3000',
            timeline: '1_3_months',
            important_features: [],
            additional_requests: '',
          });
        } else {
          setFreeForm({
            contact_name: '',
            contact_phone: '',
            contact_email: '',
            contact_company: '',
            preferred_contact_time: 'anytime',
            project_description: '',
            budget_range: '',
            timeline_preference: '',
          });
        }
      } else {
        onError?.(result.error?.message || '상담 신청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">상담 신청</h2>

      {/* Type Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setType('guided')}
            className={`px-4 py-2 rounded-lg font-medium ${
              type === 'guided'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            가이드 상담
          </button>
          <button
            type="button"
            onClick={() => setType('free')}
            className={`px-4 py-2 rounded-lg font-medium ${
              type === 'free'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            자유 상담
          </button>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">입력 오류</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              id="contact_name"
              value={type === 'guided' ? guidedForm.contact_name : freeForm.contact_name}
              onChange={(e) => {
                if (type === 'guided') {
                  setGuidedForm({ ...guidedForm, contact_name: e.target.value });
                } else {
                  setFreeForm({ ...freeForm, contact_name: e.target.value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
              연락처 *
            </label>
            <input
              type="tel"
              id="contact_phone"
              value={type === 'guided' ? guidedForm.contact_phone : freeForm.contact_phone}
              onChange={(e) => {
                if (type === 'guided') {
                  setGuidedForm({ ...guidedForm, contact_phone: e.target.value });
                } else {
                  setFreeForm({ ...freeForm, contact_phone: e.target.value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 *
            </label>
            <input
              type="email"
              id="contact_email"
              value={type === 'guided' ? guidedForm.contact_email : freeForm.contact_email}
              onChange={(e) => {
                if (type === 'guided') {
                  setGuidedForm({ ...guidedForm, contact_email: e.target.value });
                } else {
                  setFreeForm({ ...freeForm, contact_email: e.target.value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_company" className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <input
              type="text"
              id="contact_company"
              value={type === 'guided' ? guidedForm.contact_company : freeForm.contact_company}
              onChange={(e) => {
                if (type === 'guided') {
                  setGuidedForm({ ...guidedForm, contact_company: e.target.value });
                } else {
                  setFreeForm({ ...freeForm, contact_company: e.target.value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="preferred_contact_time" className="block text-sm font-medium text-gray-700 mb-2">
            선호 연락 시간
          </label>
          <select
            id="preferred_contact_time"
            value={type === 'guided' ? guidedForm.preferred_contact_time : freeForm.preferred_contact_time}
            onChange={(e) => {
              const value = e.target.value as ContactTimePreference;
              if (type === 'guided') {
                setGuidedForm({ ...guidedForm, preferred_contact_time: value });
              } else {
                setFreeForm({ ...freeForm, preferred_contact_time: value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="anytime">언제든지</option>
            <option value="morning">오전 (9-12시)</option>
            <option value="afternoon">오후 (12-18시)</option>
            <option value="evening">저녁 (18-21시)</option>
          </select>
        </div>

        {/* Guided Consultation Fields */}
        {type === 'guided' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                  서비스 타입 *
                </label>
                <select
                  id="service_type"
                  value={guidedForm.service_type}
                  onChange={(e) => setGuidedForm({ ...guidedForm, service_type: e.target.value as ServiceType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="web_development">웹 개발</option>
                  <option value="mobile_app">모바일 앱</option>
                  <option value="desktop_app">데스크탑 앱</option>
                  <option value="ai_ml">AI/ML</option>
                  <option value="blockchain">블록체인</option>
                  <option value="iot">IoT</option>
                  <option value="consulting">컨설팅</option>
                  <option value="maintenance">유지보수</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label htmlFor="project_size" className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 규모 *
                </label>
                <select
                  id="project_size"
                  value={guidedForm.project_size}
                  onChange={(e) => setGuidedForm({ ...guidedForm, project_size: e.target.value as ProjectSize })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="small">소규모</option>
                  <option value="medium">중규모</option>
                  <option value="large">대규모</option>
                  <option value="enterprise">엔터프라이즈</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  예산 범위 *
                </label>
                <select
                  id="budget"
                  value={guidedForm.budget}
                  onChange={(e) => setGuidedForm({ ...guidedForm, budget: e.target.value as BudgetRange })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="under_1000">100만원 미만</option>
                  <option value="1000_to_3000">100-300만원</option>
                  <option value="3000_to_5000">300-500만원</option>
                  <option value="5000_to_10000">500-1000만원</option>
                  <option value="over_10000">1000만원 초과</option>
                  <option value="negotiable">협의</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  타임라인 *
                </label>
                <select
                  id="timeline"
                  value={guidedForm.timeline}
                  onChange={(e) => setGuidedForm({ ...guidedForm, timeline: e.target.value as Timeline })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="asap">최대한 빨리</option>
                  <option value="1_month">1개월 이내</option>
                  <option value="1_3_months">1-3개월</option>
                  <option value="3_6_months">3-6개월</option>
                  <option value="6_12_months">6-12개월</option>
                  <option value="over_1_year">1년 이상</option>
                  <option value="flexible">유연함</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중요한 기능 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'responsive_design',
                  'cms',
                  'seo_optimization',
                  'cross_platform',
                  'push_notifications',
                  'offline_support',
                  'payment_integration',
                  'user_authentication',
                  'admin_panel',
                  'analytics',
                  'social_login',
                  'file_upload',
                ].map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={guidedForm.important_features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGuidedForm({
                            ...guidedForm,
                            important_features: [...guidedForm.important_features, feature],
                          });
                        } else {
                          setGuidedForm({
                            ...guidedForm,
                            important_features: guidedForm.important_features.filter((f) => f !== feature),
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="additional_requests" className="block text-sm font-medium text-gray-700 mb-2">
                추가 요청사항
              </label>
              <textarea
                id="additional_requests"
                value={guidedForm.additional_requests}
                onChange={(e) => setGuidedForm({ ...guidedForm, additional_requests: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Free Consultation Fields */}
        {type === 'free' && (
          <>
            <div>
              <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 설명 *
              </label>
              <textarea
                id="project_description"
                value={freeForm.project_description}
                onChange={(e) => setFreeForm({ ...freeForm, project_description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트에 대해 자세히 설명해주세요..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
                  예산 범위
                </label>
                <input
                  type="text"
                  id="budget_range"
                  value={freeForm.budget_range}
                  onChange={(e) => setFreeForm({ ...freeForm, budget_range: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: 300-500만원"
                />
              </div>

              <div>
                <label htmlFor="timeline_preference" className="block text-sm font-medium text-gray-700 mb-2">
                  희망 완성 시기
                </label>
                <input
                  type="text"
                  id="timeline_preference"
                  value={freeForm.timeline_preference}
                  onChange={(e) => setFreeForm({ ...freeForm, timeline_preference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: 3개월 이내"
                />
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? '제출 중...' : '상담 신청하기'}
          </button>
        </div>
      </form>
    </div>
  );
}