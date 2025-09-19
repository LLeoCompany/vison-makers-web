/**
 * 재시도 유틸리티 함수
 * API 요청 실패 시 자동 재시도 로직 제공
 */

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

/**
 * 함수 실행을 재시도하는 유틸리티
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    baseDelay,
    retryCondition = () => true,
    onRetry
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 마지막 시도인 경우 에러를 던짐
      if (attempt === maxRetries) {
        break;
      }

      // 재시도 조건 확인
      if (!retryCondition(error)) {
        throw error;
      }

      // 재시도 콜백 실행
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // 지수 백오프 지연
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * 지정된 시간만큼 대기
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * HTTP 에러 코드별 재시도 여부 결정
 */
export function shouldRetryHttpError(error: any): boolean {
  // 4xx 클라이언트 에러는 재시도하지 않음
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }

  // 5xx 서버 에러는 재시도
  if (error.response && error.response.status >= 500) {
    return true;
  }

  // 네트워크 에러는 재시도
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return true;
  }

  // 타임아웃은 재시도
  if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
    return true;
  }

  return false;
}

/**
 * API 요청 전용 재시도 래퍼
 */
export async function retryApiRequest<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  return withRetry(apiCall, {
    maxRetries,
    baseDelay: 1000,
    retryCondition: shouldRetryHttpError,
    onRetry: (attempt, error) => {
      console.warn(`API 요청 재시도 ${attempt}/${maxRetries}:`, error.message);
    }
  });
}