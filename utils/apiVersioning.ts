/**
 * API 버전 관리 시스템
 * LeoFitTech API 버전 호환성 및 마이그레이션 관리
 */

import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./errors";
import { logger } from "./logger";

// 지원되는 API 버전들
export const SUPPORTED_VERSIONS = ["v1", "v2"] as const;
export type ApiVersion = (typeof SUPPORTED_VERSIONS)[number];

// 기본 버전
export const DEFAULT_VERSION: ApiVersion = "v1";

// 최신 버전
export const LATEST_VERSION: ApiVersion = "v2";

// Deprecated 버전들
export const DEPRECATED_VERSIONS: ApiVersion[] = ["v1"];

// 버전 정보 인터페이스
export interface VersionInfo {
  version: ApiVersion;
  isSupported: boolean;
  isDeprecated: boolean;
  isLatest: boolean;
  deprecationDate?: string;
  sunsetDate?: string;
  migrationGuide?: string;
}

// 버전 호환성 매트릭스
export const VERSION_COMPATIBILITY: Record<
  ApiVersion,
  {
    supportedUntil: string;
    sunsetDate?: string;
    migrationPath?: ApiVersion[];
    breaking_changes?: string[];
  }
> = {
  v1: {
    supportedUntil: "2025-12-31",
    sunsetDate: "2026-06-30",
    migrationPath: ["v2"],
    breaking_changes: [
      "Response format changed to include success field",
      "Error response structure updated",
      "Date format standardized to ISO 8601",
    ],
  },
  v2: {
    supportedUntil: "2026-12-31",
    breaking_changes: [],
  },
};

/**
 * 요청에서 API 버전 추출
 */
export function extractApiVersion(req: NextApiRequest): ApiVersion {
  // 1. URL 경로에서 버전 추출 (/api/v1/*, /api/v2/*)
  const pathVersion = extractVersionFromPath(req.url || "");
  if (pathVersion) {
    return pathVersion;
  }

  // 2. 헤더에서 버전 추출
  const headerVersion = req.headers["api-version"] as string;
  if (
    headerVersion &&
    SUPPORTED_VERSIONS.includes(headerVersion as ApiVersion)
  ) {
    return headerVersion as ApiVersion;
  }

  // 3. 쿼리 파라미터에서 버전 추출
  const queryVersion = req.query.version as string;
  if (queryVersion && SUPPORTED_VERSIONS.includes(queryVersion as ApiVersion)) {
    return queryVersion as ApiVersion;
  }

  // 4. Accept 헤더에서 버전 추출 (application/vnd.LeoFitTech.v1+json)
  const acceptVersion = extractVersionFromAcceptHeader(
    req.headers.accept || ""
  );
  if (acceptVersion) {
    return acceptVersion;
  }

  // 기본 버전 반환
  return DEFAULT_VERSION;
}

/**
 * URL 경로에서 버전 추출
 */
function extractVersionFromPath(path: string): ApiVersion | null {
  const versionMatch = path.match(/\/api\/(v\d+)\//);
  if (
    versionMatch &&
    SUPPORTED_VERSIONS.includes(versionMatch[1] as ApiVersion)
  ) {
    return versionMatch[1] as ApiVersion;
  }
  return null;
}

/**
 * Accept 헤더에서 버전 추출
 */
function extractVersionFromAcceptHeader(
  acceptHeader: string
): ApiVersion | null {
  const versionMatch = acceptHeader.match(
    /application\/vnd\.LeoFitTech\.(v\d+)\+json/
  );
  if (
    versionMatch &&
    SUPPORTED_VERSIONS.includes(versionMatch[1] as ApiVersion)
  ) {
    return versionMatch[1] as ApiVersion;
  }
  return null;
}

/**
 * 버전 정보 조회
 */
export function getVersionInfo(version: ApiVersion): VersionInfo {
  const compatibility = VERSION_COMPATIBILITY[version];

  return {
    version,
    isSupported: SUPPORTED_VERSIONS.includes(version),
    isDeprecated: DEPRECATED_VERSIONS.includes(version),
    isLatest: version === LATEST_VERSION,
    deprecationDate: compatibility.sunsetDate
      ? new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
    sunsetDate: compatibility.sunsetDate,
    migrationGuide: `https://docs.LeoFitTech.com/api/migration/${version}-to-${LATEST_VERSION}`,
  };
}

/**
 * 버전 호환성 체크 미들웨어
 */
export function withApiVersion(
  supportedVersions: ApiVersion[] = SUPPORTED_VERSIONS.slice()
) {
  return (req: NextApiRequest, res: NextApiResponse): boolean => {
    const requestedVersion = extractApiVersion(req);
    const versionInfo = getVersionInfo(requestedVersion);

    // 지원되지 않는 버전
    if (!supportedVersions.includes(requestedVersion)) {
      throw new ApiError(
        `API 버전 ${requestedVersion}는 이 엔드포인트에서 지원되지 않습니다.`,
        "VERSION_NOT_SUPPORTED",
        400,
        {
          requestedVersion,
          supportedVersions,
          latestVersion: LATEST_VERSION,
        }
      );
    }

    // 만료된 버전
    const compatibility = VERSION_COMPATIBILITY[requestedVersion];
    if (
      compatibility.sunsetDate &&
      new Date() > new Date(compatibility.sunsetDate)
    ) {
      throw new ApiError(
        `API 버전 ${requestedVersion}는 ${compatibility.sunsetDate}에 종료되었습니다.`,
        "VERSION_SUNSET",
        410,
        {
          requestedVersion,
          sunsetDate: compatibility.sunsetDate,
          migrationPath: compatibility.migrationPath,
          latestVersion: LATEST_VERSION,
        }
      );
    }

    // 응답 헤더 설정
    res.setHeader("API-Version", requestedVersion);
    res.setHeader("API-Supported-Versions", SUPPORTED_VERSIONS.join(", "));
    res.setHeader("API-Latest-Version", LATEST_VERSION);

    // Deprecated 경고
    if (versionInfo.isDeprecated) {
      res.setHeader(
        "Warning",
        `299 - "API version ${requestedVersion} is deprecated. Please migrate to ${LATEST_VERSION}"`
      );

      // Deprecated 버전 사용 로깅
      logger.warn("Deprecated API version used", {
        action: "deprecated_version_used",
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"] as string,
        ip: getClientIP(req),
        metadata: {
          requestedVersion,
          latestVersion: LATEST_VERSION,
        },
      });
    }

    // 성공적인 버전 체크 로깅
    logger.debug("API version validated", {
      action: "version_validated",
      metadata: {
        requestedVersion,
        isDeprecated: versionInfo.isDeprecated,
        isLatest: versionInfo.isLatest,
      },
    });

    // 요청 객체에 버전 정보 추가
    (req as any).apiVersion = requestedVersion;
    (req as any).versionInfo = versionInfo;

    return true;
  };
}

/**
 * 버전별 응답 변환기
 */
export class ResponseTransformer {
  /**
   * v1 형식으로 응답 변환
   */
  static toV1Format(data: any): any {
    // v1은 success 필드가 없는 구 형식
    if (data && typeof data === "object" && "success" in data) {
      if (data.success) {
        return data.data;
      } else {
        // 에러 형식도 구 형식으로 변환
        return {
          error: data.error?.message || "An error occurred",
          code: data.error?.code || "UNKNOWN_ERROR",
        };
      }
    }
    return data;
  }

  /**
   * v2 형식으로 응답 변환 (현재 표준)
   */
  static toV2Format(data: any): any {
    // 이미 v2 형식이면 그대로 반환
    if (data && typeof data === "object" && "success" in data) {
      return data;
    }

    // v1 형식을 v2로 변환
    if (data && typeof data === "object" && "error" in data) {
      return {
        success: false,
        error: {
          code: data.code || "UNKNOWN_ERROR",
          message: data.error,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 일반 데이터를 v2 성공 형식으로 래핑
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 요청된 버전에 따라 적절한 형식으로 변환
   */
  static transform(data: any, version: ApiVersion): any {
    switch (version) {
      case "v1":
        return this.toV1Format(data);
      case "v2":
        return this.toV2Format(data);
      default:
        return data;
    }
  }
}

/**
 * 버전별 응답 변환 미들웨어
 */
export function withVersionTransform() {
  return (req: NextApiRequest, res: NextApiResponse, data: any): any => {
    const version = (req as any).apiVersion || DEFAULT_VERSION;
    return ResponseTransformer.transform(data, version);
  };
}

/**
 * API 버전 정보 조회 API 헬퍼
 */
export function getApiVersionsInfo(): {
  current: ApiVersion;
  supported: ApiVersion[];
  deprecated: ApiVersion[];
  latest: ApiVersion;
  versions: { [key in ApiVersion]: VersionInfo };
} {
  const versions = {} as { [key in ApiVersion]: VersionInfo };

  for (const version of SUPPORTED_VERSIONS) {
    versions[version] = getVersionInfo(version);
  }

  return {
    current: DEFAULT_VERSION,
    supported: SUPPORTED_VERSIONS.slice(),
    deprecated: DEPRECATED_VERSIONS.slice(),
    latest: LATEST_VERSION,
    versions,
  };
}

/**
 * 클라이언트 IP 추출 헬퍼
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"] as string;
  return forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";
}

/**
 * 버전 호환성 체크 함수
 */
export function isVersionCompatible(
  requestedVersion: ApiVersion,
  minimumVersion: ApiVersion
): boolean {
  const versionNumbers = {
    v1: 1,
    v2: 2,
  };

  return versionNumbers[requestedVersion] >= versionNumbers[minimumVersion];
}

/**
 * 마이그레이션 경고 생성
 */
export function createMigrationWarning(
  currentVersion: ApiVersion,
  targetVersion: ApiVersion
): string {
  const compatibility = VERSION_COMPATIBILITY[currentVersion];
  const changes = compatibility.breaking_changes || [];

  let warning = `API ${currentVersion} is deprecated. Please migrate to ${targetVersion}.`;

  if (changes.length > 0) {
    warning += ` Breaking changes: ${changes.join(", ")}.`;
  }

  if (compatibility.sunsetDate) {
    warning += ` Support ends on ${compatibility.sunsetDate}.`;
  }

  return warning;
}

// 편의 상수들
export const VERSION_PATTERNS = {
  URL_PATH: /\/api\/(v\d+)\//,
  ACCEPT_HEADER: /application\/vnd\.LeoFitTech\.(v\d+)\+json/,
  CONTENT_TYPE: (version: ApiVersion) =>
    `application/vnd.LeoFitTech.${version}+json`,
} as const;
