/**
 * API 버전 관리 시스템 테스트
 */

import { NextApiRequest } from 'next';
import { extractApiVersion, ResponseTransformer, getVersionInfo, isVersionCompatible } from '@/utils/apiVersioning';

// Mock 요청 생성 헬퍼
function createMockRequest(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return {
    method: 'GET',
    url: '/api/test',
    headers: {},
    query: {},
    body: {},
    ...overrides,
  } as NextApiRequest;
}

describe('API 버전 관리 시스템', () => {
  describe('extractApiVersion', () => {
    test('URL 경로에서 버전 추출', () => {
      const req = createMockRequest({ url: '/api/v2/consultation-submit' });
      expect(extractApiVersion(req)).toBe('v2');
    });

    test('헤더에서 버전 추출', () => {
      const req = createMockRequest({
        headers: { 'api-version': 'v2' }
      });
      expect(extractApiVersion(req)).toBe('v2');
    });

    test('쿼리 파라미터에서 버전 추출', () => {
      const req = createMockRequest({
        query: { version: 'v2' }
      });
      expect(extractApiVersion(req)).toBe('v2');
    });

    test('Accept 헤더에서 버전 추출', () => {
      const req = createMockRequest({
        headers: {
          accept: 'application/vnd.visionmakers.v2+json'
        }
      });
      expect(extractApiVersion(req)).toBe('v2');
    });

    test('기본 버전 반환 (버전 정보 없음)', () => {
      const req = createMockRequest();
      expect(extractApiVersion(req)).toBe('v1');
    });

    test('지원되지 않는 버전은 기본 버전 반환', () => {
      const req = createMockRequest({
        headers: { 'api-version': 'v3' }
      });
      expect(extractApiVersion(req)).toBe('v1');
    });
  });

  describe('ResponseTransformer', () => {
    const testData = {
      consultationId: 'test-123',
      consultationNumber: 'CON-20241217-001',
      estimatedContactTime: '1-2일',
    };

    test('v2 형식으로 변환', () => {
      const result = ResponseTransformer.toV2Format(testData);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data', testData);
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    test('v1 형식으로 변환 (v2 데이터에서)', () => {
      const v2Data = {
        success: true,
        data: testData,
        timestamp: '2024-12-17T10:30:00.000Z',
      };

      const result = ResponseTransformer.toV1Format(v2Data);
      expect(result).toEqual(testData);
    });

    test('에러 데이터 v1으로 변환', () => {
      const v2Error = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력 데이터가 유효하지 않습니다.',
        },
        timestamp: '2024-12-17T10:30:00.000Z',
      };

      const result = ResponseTransformer.toV1Format(v2Error);
      expect(result).toEqual({
        error: '입력 데이터가 유효하지 않습니다.',
        code: 'VALIDATION_ERROR',
      });
    });

    test('transform 메소드로 버전별 변환', () => {
      const v1Result = ResponseTransformer.transform(testData, 'v1');
      const v2Result = ResponseTransformer.transform(testData, 'v2');

      expect(v1Result).toEqual(testData);
      expect(v2Result).toHaveProperty('success', true);
      expect(v2Result).toHaveProperty('data', testData);
    });
  });

  describe('getVersionInfo', () => {
    test('v1 버전 정보', () => {
      const info = getVersionInfo('v1');

      expect(info.version).toBe('v1');
      expect(info.isSupported).toBe(true);
      expect(info.isDeprecated).toBe(true);
      expect(info.isLatest).toBe(false);
      expect(info.sunsetDate).toBeDefined();
      expect(info.migrationGuide).toContain('v1-to-v2');
    });

    test('v2 버전 정보', () => {
      const info = getVersionInfo('v2');

      expect(info.version).toBe('v2');
      expect(info.isSupported).toBe(true);
      expect(info.isDeprecated).toBe(false);
      expect(info.isLatest).toBe(true);
    });
  });

  describe('isVersionCompatible', () => {
    test('v2는 v1과 호환', () => {
      expect(isVersionCompatible('v2', 'v1')).toBe(true);
    });

    test('v1은 v2와 호환되지 않음', () => {
      expect(isVersionCompatible('v1', 'v2')).toBe(false);
    });

    test('동일 버전은 호환', () => {
      expect(isVersionCompatible('v1', 'v1')).toBe(true);
      expect(isVersionCompatible('v2', 'v2')).toBe(true);
    });
  });
});

// 통합 테스트
describe('API 버전 관리 통합 테스트', () => {
  test('전체 워크플로우 테스트', () => {
    // 1. v1 요청 처리
    const v1Req = createMockRequest({
      headers: { 'api-version': 'v1' }
    });

    const v1Version = extractApiVersion(v1Req);
    expect(v1Version).toBe('v1');

    const testData = { id: '123', name: 'test' };
    const v1Response = ResponseTransformer.transform(testData, v1Version);
    expect(v1Response).toEqual(testData);

    // 2. v2 요청 처리
    const v2Req = createMockRequest({
      url: '/api/v2/test'
    });

    const v2Version = extractApiVersion(v2Req);
    expect(v2Version).toBe('v2');

    const v2Response = ResponseTransformer.transform(testData, v2Version);
    expect(v2Response).toHaveProperty('success', true);
    expect(v2Response).toHaveProperty('data', testData);

    // 3. 버전 정보 확인
    const v1Info = getVersionInfo(v1Version);
    const v2Info = getVersionInfo(v2Version);

    expect(v1Info.isDeprecated).toBe(true);
    expect(v2Info.isLatest).toBe(true);
  });
});