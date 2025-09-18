/**
 * API 유효성 검증 테스트
 * 스키마 검증, 보안 검증, 성능 검증 등
 */

import { ConsultationRequestSchema } from '@/schemas/consultation';
import { extractApiVersion, ResponseTransformer, withApiVersion } from '@/utils/apiVersioning';
import { MemoryRateLimiter } from '@/utils/rateLimiter';
import { MemoryCache } from '@/utils/cache';
import { logger } from '@/utils/logger';
import { performanceMonitor } from '@/utils/monitoring';

describe('API 유효성 검증', () => {
  describe('스키마 검증', () => {
    describe('상담 신청 스키마', () => {
      const validData = {
        type: 'guided' as const,
        contact: {
          name: '홍길동',
          email: 'hong@example.com',
          phone: '010-1234-5678',
          company: '테스트 회사',
          preferredContactTime: 'morning' as const,
        },
        serviceType: 'web_development' as const,
        projectSize: 'medium' as const,
        budget: 'medium' as const,
        timeline: '1-3months' as const,
        importantFeatures: ['responsive_design', 'cms'] as const,
        additionalRequests: '추가 요청사항입니다.',
      };

      test('유효한 가이드 상담 데이터', () => {
        const result = ConsultationRequestSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.type).toBe('guided');
          expect(result.data.contact.name).toBe('홍길동');
        }
      });

      test('유효한 자유 상담 데이터', () => {
        const freeData = {
          type: 'free' as const,
          contact: {
            name: '김철수',
            email: 'kim@example.com',
            phone: '010-9876-5432',
          },
          projectDescription: '웹사이트 개발 프로젝트입니다.',
          budget: '500만원 내외',
          timeline: '6개월 이내',
        };

        const result = ConsultationRequestSchema.safeParse(freeData);
        expect(result.success).toBe(true);
      });

      test('필수 필드 누락', () => {
        const incompleteData = {
          type: 'guided' as const,
          contact: {
            name: '홍길동',
            // email 누락
            phone: '010-1234-5678',
          },
        };

        const result = ConsultationRequestSchema.safeParse(incompleteData);
        expect(result.success).toBe(false);
        if (!result.success) {
          const emailError = result.error.issues.find(
            issue => issue.path.includes('email')
          );
          expect(emailError).toBeDefined();
        }
      });

      test('잘못된 이메일 형식', () => {
        const invalidEmailData = {
          ...validData,
          contact: {
            ...validData.contact,
            email: 'invalid-email',
          },
        };

        const result = ConsultationRequestSchema.safeParse(invalidEmailData);
        expect(result.success).toBe(false);
      });

      test('잘못된 전화번호 형식', () => {
        const invalidPhoneData = {
          ...validData,
          contact: {
            ...validData.contact,
            phone: '123', // 너무 짧음
          },
        };

        const result = ConsultationRequestSchema.safeParse(invalidPhoneData);
        expect(result.success).toBe(false);
      });

      test('XSS 공격 시도 데이터', () => {
        const xssData = {
          ...validData,
          contact: {
            ...validData.contact,
            name: '<script>alert("xss")</script>',
          },
          additionalRequests: '<img src="x" onerror="alert(1)">',
        };

        const result = ConsultationRequestSchema.safeParse(xssData);
        // 스키마 자체는 통과하지만, sanitization에서 처리됨
        expect(result.success).toBe(true);
      });

      test('SQL Injection 시도 데이터', () => {
        const sqlInjectionData = {
          ...validData,
          contact: {
            ...validData.contact,
            name: "'; DROP TABLE consultations; --",
            email: "test@example.com'; DELETE FROM users; --",
          },
        };

        const result = ConsultationRequestSchema.safeParse(sqlInjectionData);
        // 스키마는 통과하지만 parameterized queries로 보호
        expect(result.success).toBe(true);
      });
    });

    describe('데이터 크기 제한', () => {
      test('너무 긴 텍스트 필드', () => {
        const longTextData = {
          type: 'guided' as const,
          contact: {
            name: 'A'.repeat(101), // 100자 초과
            email: 'test@example.com',
            phone: '010-1234-5678',
          },
          serviceType: 'web_development' as const,
          projectSize: 'medium' as const,
          budget: 'medium' as const,
          timeline: '1-3months' as const,
          importantFeatures: ['responsive_design'] as const,
          additionalRequests: 'A'.repeat(2001), // 2000자 초과
        };

        const result = ConsultationRequestSchema.safeParse(longTextData);
        expect(result.success).toBe(false);
      });

      test('빈 문자열 필드', () => {
        const emptyFieldData = {
          type: 'guided' as const,
          contact: {
            name: '',
            email: 'test@example.com',
            phone: '010-1234-5678',
          },
          serviceType: 'web_development' as const,
          projectSize: 'medium' as const,
          budget: 'medium' as const,
          timeline: '1-3months' as const,
          importantFeatures: ['responsive_design'] as const,
        };

        const result = ConsultationRequestSchema.safeParse(emptyFieldData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('API 버전 관리 검증', () => {
    test('지원되는 모든 버전의 응답 형식', () => {
      const testData = {
        id: '123',
        name: 'test',
        status: 'active',
      };

      // v1 응답
      const v1Response = ResponseTransformer.transform(testData, 'v1');
      expect(v1Response).toEqual(testData);

      // v2 응답
      const v2Response = ResponseTransformer.transform(testData, 'v2');
      expect(v2Response).toHaveProperty('success', true);
      expect(v2Response).toHaveProperty('data', testData);
      expect(v2Response).toHaveProperty('timestamp');
      expect(typeof v2Response.timestamp).toBe('string');
    });

    test('에러 응답 변환', () => {
      const v2ErrorData = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '유효하지 않은 데이터입니다.',
        },
        timestamp: '2024-12-17T10:30:00.000Z',
      };

      const v1Error = ResponseTransformer.transform(v2ErrorData, 'v1');
      expect(v1Error).toEqual({
        error: '유효하지 않은 데이터입니다.',
        code: 'VALIDATION_ERROR',
      });
    });

    test('버전 추출 정확성', () => {
      const testCases = [
        { url: '/api/v2/test', expected: 'v2' },
        { url: '/api/v1/consultation-submit', expected: 'v1' },
        { url: '/api/test', expected: 'v1' }, // 기본값
        { headers: { 'api-version': 'v2' }, expected: 'v2' },
        { query: { version: 'v1' }, expected: 'v1' },
        { headers: { accept: 'application/vnd.visionmakers.v2+json' }, expected: 'v2' },
      ];

      testCases.forEach(testCase => {
        const req = {
          url: testCase.url || '/api/test',
          headers: testCase.headers || {},
          query: testCase.query || {},
        } as any;

        const version = extractApiVersion(req);
        expect(version).toBe(testCase.expected);
      });
    });
  });

  describe('레이트 리미팅 검증', () => {
    test('기본 레이트 리미팅 동작', () => {
      const limiter = new MemoryRateLimiter();
      const config = {
        maxRequests: 3,
        windowMs: 60000, // 1분
      };

      // 허용된 요청 수 내에서는 성공
      for (let i = 0; i < 3; i++) {
        const result = limiter.check('test-ip', config);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(2 - i);
      }

      // 초과 시 거부
      const exceededResult = limiter.check('test-ip', config);
      expect(exceededResult.allowed).toBe(false);
      expect(exceededResult.remaining).toBe(0);
    });

    test('시간 윈도우 재설정', () => {
      const limiter = new MemoryRateLimiter();
      const config = {
        maxRequests: 2,
        windowMs: 100, // 100ms
      };

      // 첫 번째 요청
      const first = limiter.check('test-ip-2', config);
      expect(first.allowed).toBe(true);

      // 두 번째 요청 (한계 도달)
      const second = limiter.check('test-ip-2', config);
      expect(second.allowed).toBe(true);

      // 세 번째 요청 (거부)
      const third = limiter.check('test-ip-2', config);
      expect(third.allowed).toBe(false);

      // 시간 경과 후 재시도
      return new Promise(resolve => {
        setTimeout(() => {
          const afterTimeout = limiter.check('test-ip-2', config);
          expect(afterTimeout.allowed).toBe(true);
          resolve(undefined);
        }, 150); // 윈도우 시간 초과
      });
    });
  });

  describe('캐싱 시스템 검증', () => {
    test('캐시 기본 동작', () => {
      const cache = new MemoryCache<string>();

      // 데이터 저장
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');

      // 존재하지 않는 키
      expect(cache.get('nonexistent')).toBeNull();

      // 키 존재 확인
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);

      // 캐시 크기
      expect(cache.size()).toBe(1);

      // 삭제
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
      expect(cache.size()).toBe(0);
    });

    test('TTL (Time To Live) 기능', () => {
      const cache = new MemoryCache<string>();

      // 짧은 TTL로 데이터 저장
      cache.set('ttl-key', 'ttl-value', 50); // 50ms

      // 즉시 조회는 성공
      expect(cache.get('ttl-key')).toBe('ttl-value');

      // TTL 경과 후 조회
      return new Promise(resolve => {
        setTimeout(() => {
          expect(cache.get('ttl-key')).toBeNull();
          expect(cache.has('ttl-key')).toBe(false);
          resolve(undefined);
        }, 100);
      });
    });

    test('LRU (Least Recently Used) 제거', () => {
      const cache = new MemoryCache<string>({ maxSize: 3 });

      // 캐시 채우기
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      expect(cache.size()).toBe(3);

      // key1 접근 (최근 사용으로 표시)
      cache.get('key1');

      // 새로운 키 추가 (key2가 제거되어야 함)
      cache.set('key4', 'value4');

      expect(cache.size()).toBe(3);
      expect(cache.has('key1')).toBe(true); // 최근 사용됨
      expect(cache.has('key2')).toBe(false); // LRU로 제거됨
      expect(cache.has('key3')).toBe(true);
      expect(cache.has('key4')).toBe(true);
    });
  });

  describe('모니터링 시스템 검증', () => {
    test('성능 메트릭 기록', () => {
      const metric = {
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'GET',
        duration: 150,
        statusCode: 200,
        memoryUsage: process.memoryUsage(),
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        apiVersion: 'v2',
      };

      // 메트릭 기록 전 통계
      const statsBefore = performanceMonitor.getStats();

      // 메트릭 기록
      performanceMonitor.recordMetric(metric);

      // 메트릭 기록 후 통계 확인
      const statsAfter = performanceMonitor.getStats();

      expect(statsAfter.totalRequests).toBe(statsBefore.totalRequests + 1);
    });

    test('에러 메트릭 기록', () => {
      const errorMetric = {
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'POST',
        errorCode: 'VALIDATION_ERROR',
        errorMessage: '테스트 에러입니다.',
        statusCode: 400,
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        apiVersion: 'v2',
      };

      const statsBefore = performanceMonitor.getStats();
      performanceMonitor.recordError(errorMetric);
      const statsAfter = performanceMonitor.getStats();

      expect(statsAfter.totalErrors).toBe(statsBefore.totalErrors + 1);
    });

    test('알림 시스템', () => {
      const alertsBefore = performanceMonitor.getAlerts().length;

      // 느린 응답으로 알림 유발
      const slowMetric = {
        timestamp: Date.now(),
        endpoint: '/api/slow',
        method: 'GET',
        duration: 5000, // 5초 (임계값 초과)
        statusCode: 200,
        memoryUsage: process.memoryUsage(),
      };

      performanceMonitor.recordMetric(slowMetric);

      const alertsAfter = performanceMonitor.getAlerts();
      expect(alertsAfter.length).toBeGreaterThan(alertsBefore);

      // 최신 알림 확인
      const latestAlert = alertsAfter[0];
      expect(latestAlert.level).toBe('warning');
      expect(latestAlert.title).toContain('Slow');
    });
  });

  describe('로깅 시스템 검증', () => {
    test('로그 레벨별 출력', () => {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;

      let logOutput: string[] = [];

      // 콘솔 출력 캡처
      console.log = (message: string) => logOutput.push(`LOG: ${message}`);
      console.error = (message: string) => logOutput.push(`ERROR: ${message}`);
      console.warn = (message: string) => logOutput.push(`WARN: ${message}`);

      try {
        logger.info('테스트 정보 로그');
        logger.error('테스트 에러 로그');
        logger.warn('테스트 경고 로그');

        expect(logOutput.length).toBeGreaterThan(0);
      } finally {
        // 원래 콘솔 복원
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
      }
    });
  });

  describe('보안 검증', () => {
    test('JWT 토큰 형식', () => {
      // JWT 토큰이 올바른 형식인지 확인
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      // JWT 형식 확인 (3개 부분으로 구성, base64 인코딩)
      const parts = mockToken.split('.');
      expect(parts).toHaveLength(3);

      // 각 부분이 base64로 디코딩 가능한지 확인
      parts.forEach(part => {
        expect(() => {
          Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        }).not.toThrow();
      });
    });

    test('입력 데이터 sanitization', () => {
      const { sanitizeInput } = require('@/schemas/consultation');

      const dangerousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '<img src="x" onerror="alert(1)">',
        '<iframe src="javascript:alert(1)">',
        'SELECT * FROM users WHERE id = 1; DROP TABLE users;',
      ];

      dangerousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('<iframe');
        expect(sanitized).not.toContain('onerror');
      });
    });
  });
});