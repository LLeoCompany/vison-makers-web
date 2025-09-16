/**
 * VisionMakers 상담 시스템 - 공유 유효성 검사 유틸리티
 * Clean Code 및 DRY 원칙을 위한 중앙 집중식 유효성 검사
 */

import { VALIDATION_CONSTANTS } from '@/constants';
import { ContactInfo, GuidedConsultation, FreeConsultation } from '@/types/consultation';

// 유효성 검사 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 개별 필드 유효성 검사기
export const fieldValidators = {
  name: (value: string): string | null => {
    if (!value?.trim()) {
      return '이름을 입력해주세요.';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value?.trim()) {
      return '연락처를 입력해주세요.';
    }
    if (!VALIDATION_CONSTANTS.PHONE_REGEX.test(value)) {
      return '올바른 연락처 형식이 아닙니다.';
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value?.trim()) {
      return '이메일을 입력해주세요.';
    }
    if (!VALIDATION_CONSTANTS.EMAIL_REGEX.test(value)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
    return null;
  },

  projectDescription: (value: string): string | null => {
    if (!value?.trim()) {
      return '프로젝트에 대해 설명해주세요.';
    }
    if (value.trim().length < VALIDATION_CONSTANTS.MIN_DESCRIPTION_LENGTH) {
      return `최소 ${VALIDATION_CONSTANTS.MIN_DESCRIPTION_LENGTH}자 이상 작성해주세요.`;
    }
    return null;
  },

  privacyConsent: (value: boolean): string | null => {
    if (!value) {
      return '개인정보 수집 동의가 필요합니다.';
    }
    return null;
  },

  serviceType: (value?: string): string | null => {
    if (!value) {
      return '서비스 종류를 선택해주세요.';
    }
    return null;
  },

  projectSize: (value?: string): string | null => {
    if (!value) {
      return '프로젝트 규모를 선택해주세요.';
    }
    return null;
  },

  budget: (value?: string): string | null => {
    if (!value) {
      return '예상 예산을 선택해주세요.';
    }
    return null;
  },

  timeline: (value?: string): string | null => {
    if (!value) {
      return '완성 희망 시기를 선택해주세요.';
    }
    return null;
  },

  preferredContactTime: (value?: string): string | null => {
    if (!value) {
      return '연락 희망 시간을 선택해주세요.';
    }
    return null;
  }
};

// 연락처 정보 유효성 검사
export const validateContactInfo = (contact: Partial<ContactInfo>): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = fieldValidators.name(contact.name || '');
  if (nameError) errors.name = nameError;

  const phoneError = fieldValidators.phone(contact.phone || '');
  if (phoneError) errors.phone = phoneError;

  const emailError = fieldValidators.email(contact.email || '');
  if (emailError) errors.email = emailError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 가이드 트랙 단계별 유효성 검사
export const validateGuidedStep = (
  step: number,
  data: Partial<GuidedConsultation>
): ValidationResult => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1:
      const serviceTypeError = fieldValidators.serviceType(data.serviceType);
      if (serviceTypeError) errors.serviceType = serviceTypeError;
      break;

    case 2:
      const projectSizeError = fieldValidators.projectSize(data.projectSize);
      if (projectSizeError) errors.projectSize = projectSizeError;

      const budgetError = fieldValidators.budget(data.budget);
      if (budgetError) errors.budget = budgetError;
      break;

    case 3:
      const timelineError = fieldValidators.timeline(data.timeline);
      if (timelineError) errors.timeline = timelineError;
      break;

    case 4:
      // 연락처 정보 유효성 검사
      const contactValidation = validateContactInfo(data.contact || {});
      Object.assign(errors, contactValidation.errors);

      // 연락 시간 유효성 검사
      const contactTimeError = fieldValidators.preferredContactTime(
        data.contact?.preferredContactTime
      );
      if (contactTimeError) errors.preferredContactTime = contactTimeError;
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 자유 트랙 유효성 검사
export const validateFreeConsultation = (
  data: Partial<FreeConsultation>,
  privacyConsent: boolean
): ValidationResult => {
  const errors: Record<string, string> = {};

  // 프로젝트 설명 유효성 검사
  const descriptionError = fieldValidators.projectDescription(data.projectDescription || '');
  if (descriptionError) errors.projectDescription = descriptionError;

  // 연락처 정보 유효성 검사
  const contactValidation = validateContactInfo(data.contact || {});
  Object.assign(errors, contactValidation.errors);

  // 개인정보 동의 유효성 검사
  const consentError = fieldValidators.privacyConsent(privacyConsent);
  if (consentError) errors.privacyConsent = consentError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 제네릭 유효성 검사 헬퍼
export const createValidator = <T>(
  validatorMap: Record<keyof T, (value: any) => string | null>
) => {
  return (data: Partial<T>): ValidationResult => {
    const errors: Record<string, string> = {};

    Object.entries(validatorMap).forEach(([field, validator]) => {
      const error = validator((data as any)[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
};