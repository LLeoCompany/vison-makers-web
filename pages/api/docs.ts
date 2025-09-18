/**
 * API 문서화 엔드포인트
 * GET /api/docs
 *
 * API 버전별 차이점과 마이그레이션 가이드를 제공합니다.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { extractApiVersion, ResponseTransformer, VERSION_COMPATIBILITY, SUPPORTED_VERSIONS, LATEST_VERSION } from '@/utils/apiVersioning';
import { createSuccessResponse } from '@/utils/apiWrapper';
import { withPublicApi } from '@/utils/combinedMiddleware';

interface ApiDocsResponse {
  success: true;
  data: {
    overview: {
      currentVersion: string;
      supportedVersions: string[];
      latestVersion: string;
      defaultVersion: string;
    };
    versionDetails: Record<string, {
      releaseDate: string;
      supportedUntil: string;
      sunsetDate?: string;
      breaking_changes?: string[];
      migrationPath?: string[];
      features: string[];
    }>;
    endpoints: Record<string, {
      path: string;
      method: string;
      description: string;
      supportedVersions: string[];
      examples: Record<string, any>;
    }>;
    migrationGuide: {
      v1ToV2: {
        overview: string;
        changes: string[];
        examples: {
          before: any;
          after: any;
        };
      };
    };
  };
}

async function apiDocsHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiDocsResponse>
) {
  const docs = {
    overview: {
      currentVersion: extractApiVersion(req),
      supportedVersions: SUPPORTED_VERSIONS,
      latestVersion: LATEST_VERSION,
      defaultVersion: 'v1',
    },
    versionDetails: {
      v1: {
        releaseDate: '2024-01-01',
        supportedUntil: VERSION_COMPATIBILITY.v1.supportedUntil,
        sunsetDate: VERSION_COMPATIBILITY.v1.sunsetDate,
        breaking_changes: VERSION_COMPATIBILITY.v1.breaking_changes,
        migrationPath: VERSION_COMPATIBILITY.v1.migrationPath,
        features: [
          '기본 상담 신청 기능',
          '간단한 응답 형식',
          '기본 에러 처리',
        ],
      },
      v2: {
        releaseDate: '2024-12-01',
        supportedUntil: VERSION_COMPATIBILITY.v2.supportedUntil,
        features: [
          '표준화된 응답 형식 (success, data, timestamp)',
          '향상된 에러 처리 및 세부 정보',
          'ISO 8601 날짜 형식 표준화',
          '개선된 로깅 및 모니터링',
          '캐싱 및 성능 최적화',
        ],
      },
    },
    endpoints: {
      consultationSubmit: {
        path: '/api/consultation-submit',
        method: 'POST',
        description: '상담 신청을 처리합니다',
        supportedVersions: ['v1', 'v2'],
        examples: {
          v1: {
            request: {
              type: 'guided',
              contact: {
                name: '홍길동',
                email: 'hong@example.com',
                phone: '010-1234-5678',
              },
              serviceType: 'web_development',
              budget: 'medium',
            },
            response: {
              consultationId: 'uuid-123',
              consultationNumber: 'CON-20241217-001',
              estimatedContactTime: '영업일 기준 1-2일 내',
            },
          },
          v2: {
            request: {
              type: 'guided',
              contact: {
                name: '홍길동',
                email: 'hong@example.com',
                phone: '010-1234-5678',
              },
              serviceType: 'web_development',
              budget: 'medium',
            },
            response: {
              success: true,
              data: {
                consultationId: 'uuid-123',
                consultationNumber: 'CON-20241217-001',
                estimatedContactTime: '영업일 기준 1-2일 내',
                status: 'pending',
              },
              timestamp: '2024-12-17T10:30:00.000Z',
            },
          },
        },
      },
      adminStats: {
        path: '/api/admin/stats',
        method: 'GET',
        description: '관리자용 통계 데이터를 조회합니다',
        supportedVersions: ['v1', 'v2'],
        examples: {
          v1: {
            response: {
              overview: {
                totalConsultations: 150,
                todayConsultations: 5,
                completedConsultations: 120,
              },
            },
          },
          v2: {
            response: {
              success: true,
              data: {
                overview: {
                  totalConsultations: 150,
                  todayConsultations: 5,
                  completedConsultations: 120,
                },
              },
              timestamp: '2024-12-17T10:30:00.000Z',
            },
          },
        },
      },
    },
    migrationGuide: {
      v1ToV2: {
        overview: 'v2는 모든 응답을 표준화된 형식으로 래핑하고, 타임스탬프와 성공 상태를 포함합니다.',
        changes: [
          '모든 성공 응답이 { success: true, data: {...}, timestamp: "..." } 형식으로 변경',
          '에러 응답이 { success: false, error: { code: "...", message: "..." }, timestamp: "..." } 형식으로 변경',
          '날짜 형식이 ISO 8601로 표준화',
          '추가적인 메타데이터 포함 (status, timestamp 등)',
        ],
        examples: {
          before: {
            consultationId: 'uuid-123',
            consultationNumber: 'CON-20241217-001',
            estimatedContactTime: '영업일 기준 1-2일 내',
          },
          after: {
            success: true,
            data: {
              consultationId: 'uuid-123',
              consultationNumber: 'CON-20241217-001',
              estimatedContactTime: '영업일 기준 1-2일 내',
              status: 'pending',
            },
            timestamp: '2024-12-17T10:30:00.000Z',
          },
        },
      },
    },
  };

  // API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(docs),
    apiVersion
  );

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // 1시간 캐시
  return res.status(200).json(versionedResponse);
}

export default withPublicApi(apiDocsHandler, {
  enableRateLimit: true,
  rateLimitConfig: {
    windowMs: 60 * 1000, // 1분
    maxRequests: 60, // 분당 60회
  },
});