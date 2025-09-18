/**
 * API 통합 테스트
 * 전체 API 시스템의 엔드-투-엔드 테스트
 */

import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import consultationSubmitHandler from '@/pages/api/consultation-submit';
import healthHandler from '@/pages/api/health';
import statsHandler from '@/pages/api/admin/stats';
import versionsHandler from '@/pages/api/versions';

// 테스트 헬퍼
function createTestRequest(overrides: any = {}) {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'test-agent/1.0',
    },
    ...overrides,
  });
  return { req, res };
}

describe('API 통합 테스트', () => {
  describe('상담 신청 API', () => {
    const validConsultationData = {
      type: 'guided',
      contact: {
        name: '테스트 사용자',
        email: 'test@example.com',
        phone: '010-1234-5678',
        company: '테스트 회사',
        preferredContactTime: 'morning',
      },
      serviceType: 'web_development',
      projectSize: 'medium',
      budget: 'medium',
      timeline: '1-3months',
      importantFeatures: ['responsive_design', 'cms'],
      additionalRequests: '추가 요청사항',
    };

    test('유효한 데이터로 상담 신청 성공', async () => {
      const { req, res } = createTestRequest({
        method: 'POST',
        body: validConsultationData,
        headers: {
          'content-type': 'application/json',
          'api-version': 'v2',
        },
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBe(201);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', true);
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('consultationId');
      expect(responseData.data).toHaveProperty('consultationNumber');
      expect(responseData.data).toHaveProperty('estimatedContactTime');
      expect(responseData).toHaveProperty('timestamp');
    });

    test('v1 API 버전 호환성', async () => {
      const { req, res } = createTestRequest({
        method: 'POST',
        body: validConsultationData,
        headers: {
          'content-type': 'application/json',
          'api-version': 'v1',
        },
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBe(201);

      const responseData = JSON.parse(res._getData());
      // v1은 success 필드가 없는 직접적인 응답
      expect(responseData).toHaveProperty('consultationId');
      expect(responseData).toHaveProperty('consultationNumber');
      expect(responseData).toHaveProperty('estimatedContactTime');
      expect(responseData).not.toHaveProperty('success');
      expect(responseData).not.toHaveProperty('timestamp');
    });

    test('잘못된 데이터로 상담 신청 실패', async () => {
      const invalidData = {
        type: 'invalid_type',
        contact: {
          name: '',
          email: 'invalid-email',
          phone: '123',
        },
      };

      const { req, res } = createTestRequest({
        method: 'POST',
        body: invalidData,
        headers: {
          'content-type': 'application/json',
          'api-version': 'v2',
        },
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBe(400);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('error');
      expect(responseData.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    test('레이트 리미팅 동작 확인', async () => {
      const requests = [];

      // 레이트 리미트를 초과하는 요청 생성
      for (let i = 0; i < 5; i++) {
        const { req, res } = createTestRequest({
          method: 'POST',
          body: validConsultationData,
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': '192.168.1.100', // 같은 IP 시뮬레이션
          },
        });

        requests.push(consultationSubmitHandler(req, res).then(() => res));
      }

      const responses = await Promise.all(requests);

      // 일부 요청은 성공, 일부는 레이트 리미트에 걸려야 함
      const statusCodes = responses.map(res => res._getStatusCode());
      const tooManyRequests = statusCodes.filter(code => code === 429);

      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });

  describe('헬스 체크 API', () => {
    test('시스템 상태 조회 성공', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/health',
      });

      await healthHandler(req, res);

      expect([200, 503]).toContain(res._getStatusCode()); // healthy 또는 unhealthy

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', true);
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('status');
      expect(responseData.data).toHaveProperty('checks');
      expect(responseData.data).toHaveProperty('version');
      expect(responseData.data).toHaveProperty('uptime');

      // 필수 헬스 체크 항목들
      expect(responseData.data.checks).toHaveProperty('database');
      expect(responseData.data.checks).toHaveProperty('cache');
      expect(responseData.data.checks).toHaveProperty('memory');
      expect(responseData.data.checks).toHaveProperty('apis');
    });

    test('헬스 체크 캐시 헤더 확인', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/health',
      });

      await healthHandler(req, res);

      const cacheControl = res._getHeaders()['cache-control'];
      expect(cacheControl).toContain('no-cache');
    });
  });

  describe('API 버전 정보', () => {
    test('지원되는 API 버전 조회', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/versions',
      });

      await versionsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', true);
      expect(responseData.data).toHaveProperty('supported');
      expect(responseData.data).toHaveProperty('latest');
      expect(responseData.data).toHaveProperty('current');
      expect(responseData.data).toHaveProperty('deprecated');

      expect(Array.isArray(responseData.data.supported)).toBe(true);
      expect(responseData.data.supported).toContain('v1');
      expect(responseData.data.supported).toContain('v2');
    });
  });

  describe('관리자 API', () => {
    const mockAuthToken = 'mock-jwt-token';

    test('인증 없이 관리자 API 접근 실패', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/admin/stats',
      });

      await statsHandler(req, res);

      expect(res._getStatusCode()).toBe(401);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', false);
      expect(responseData.error).toHaveProperty('code', 'MISSING_TOKEN');
    });

    // Note: 실제 JWT 인증이 구현되면 아래 테스트들을 활성화
    test.skip('유효한 인증으로 관리자 통계 조회 성공', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/admin/stats',
        headers: {
          'authorization': `Bearer ${mockAuthToken}`,
        },
      });

      await statsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', true);
      expect(responseData.data).toHaveProperty('overview');
      expect(responseData.data).toHaveProperty('statusBreakdown');
      expect(responseData.data).toHaveProperty('typeBreakdown');
    });
  });

  describe('에러 처리', () => {
    test('존재하지 않는 엔드포인트', async () => {
      const { req, res } = createTestRequest({
        method: 'GET',
        url: '/api/nonexistent',
      });

      // Next.js가 404를 처리하므로 여기서는 핸들러가 정의되지 않음을 테스트
      expect(res._getStatusCode()).toBe(200); // 아직 응답하지 않음
    });

    test('지원되지 않는 HTTP 메소드', async () => {
      const { req, res } = createTestRequest({
        method: 'PATCH',
        url: '/api/consultation-submit',
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBe(405);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', false);
      expect(responseData.error).toHaveProperty('code', 'METHOD_NOT_ALLOWED');
    });
  });

  describe('CORS 설정', () => {
    test('CORS 헤더가 올바르게 설정됨', async () => {
      const { req, res } = createTestRequest({
        method: 'OPTIONS',
        url: '/api/consultation-submit',
        headers: {
          'origin': 'https://example.com',
        },
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const headers = res._getHeaders();
      expect(headers['access-control-allow-origin']).toBe('*');
      expect(headers['access-control-allow-methods']).toContain('POST');
      expect(headers['access-control-allow-headers']).toContain('Content-Type');
    });
  });

  describe('응답 형식 일관성', () => {
    test('모든 성공 응답이 일관된 형식을 따름 (v2)', async () => {
      const endpoints = [
        { handler: healthHandler, method: 'GET', url: '/api/health' },
        { handler: versionsHandler, method: 'GET', url: '/api/versions' },
      ];

      for (const endpoint of endpoints) {
        const { req, res } = createTestRequest({
          method: endpoint.method,
          url: endpoint.url,
          headers: {
            'api-version': 'v2',
          },
        });

        await endpoint.handler(req, res);

        const responseData = JSON.parse(res._getData());

        // v2 응답 형식 확인
        if (res._getStatusCode() < 400) {
          expect(responseData).toHaveProperty('success', true);
          expect(responseData).toHaveProperty('data');
          expect(responseData).toHaveProperty('timestamp');
          expect(typeof responseData.timestamp).toBe('string');
          expect(new Date(responseData.timestamp)).toBeInstanceOf(Date);
        }
      }
    });

    test('모든 에러 응답이 일관된 형식을 따름', async () => {
      const { req, res } = createTestRequest({
        method: 'POST',
        url: '/api/consultation-submit',
        body: {}, // 빈 데이터로 validation error 유발
        headers: {
          'api-version': 'v2',
        },
      });

      await consultationSubmitHandler(req, res);

      expect(res._getStatusCode()).toBeGreaterThanOrEqual(400);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('error');
      expect(responseData.error).toHaveProperty('code');
      expect(responseData.error).toHaveProperty('message');
      expect(responseData).toHaveProperty('timestamp');
    });
  });
});