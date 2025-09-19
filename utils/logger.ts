/**
 * 구조화된 로깅 시스템
 * VisionMakers API 로그 관리 (Winston 없이 구현)
 */

import { NextApiRequest } from 'next';

// 로그 레벨 정의
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

// 로그 컨텍스트 인터페이스
export interface LogContext {
  requestId?: string;
  userId?: string;
  userRole?: string;
  action?: string;
  resource?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  metadata?: Record<string, any>;
}

// 로그 엔트리 인터페이스
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  service: string;
  environment: string;
}

// 로거 클래스
export class Logger {
  private static instance: Logger;
  private service: string = 'visionmakers-api';
  private environment: string = process.env.NODE_ENV || 'development';
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // 로그 레벨 우선순위 확인
  private shouldLog(level: LogLevel): boolean {
    const levels = {
      [LogLevel.ERROR]: 0,
      [LogLevel.WARN]: 1,
      [LogLevel.INFO]: 2,
      [LogLevel.HTTP]: 3,
      [LogLevel.DEBUG]: 4,
    };

    return levels[level] <= levels[this.logLevel];
  }

  // 로그 엔트리 생성
  private createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      service: this.service,
      environment: this.environment,
    };
  }

  // 로그 출력
  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const logString = JSON.stringify(entry, null, this.environment === 'development' ? 2 : 0);

    // 개발 환경에서는 콘솔에 색상과 함께 출력
    if (this.environment === 'development') {
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // 빨간색
        [LogLevel.WARN]: '\x1b[33m',  // 노란색
        [LogLevel.INFO]: '\x1b[36m',  // 청록색
        [LogLevel.HTTP]: '\x1b[35m',  // 자주색
        [LogLevel.DEBUG]: '\x1b[37m', // 흰색
      };
      const reset = '\x1b[0m';

      console.log(`${colors[entry.level]}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} ${entry.message}`);
      if (entry.context) {
        console.log(`${colors[entry.level]}Context:${reset}`, entry.context);
      }
    } else {
      // 프로덕션에서는 JSON 형태로 출력
      console.log(logString);
    }

    // 프로덕션 환경에서 에러는 별도 처리
    if (entry.level === LogLevel.ERROR && this.environment === 'production') {
      console.error(logString);
    }
  }

  // 기본 로그 메서드들
  public error(message: string, context?: LogContext): void {
    this.writeLog(this.createLogEntry(LogLevel.ERROR, message, context));
  }

  public warn(message: string, context?: LogContext): void {
    this.writeLog(this.createLogEntry(LogLevel.WARN, message, context));
  }

  public info(message: string, context?: LogContext): void {
    this.writeLog(this.createLogEntry(LogLevel.INFO, message, context));
  }

  public http(message: string, context?: LogContext): void {
    this.writeLog(this.createLogEntry(LogLevel.HTTP, message, context));
  }

  public debug(message: string, context?: LogContext): void {
    this.writeLog(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  // 특수한 로깅 메서드들
  public apiRequest(req: NextApiRequest, context?: Partial<LogContext>): void {
    this.http('API Request', {
      method: req.method,
      url: req.url,
      ip: this.getClientIP(req),
      userAgent: req.headers['user-agent'],
      ...context,
    });
  }

  public apiResponse(
    req: NextApiRequest,
    statusCode: number,
    duration: number,
    context?: Partial<LogContext>
  ): void {
    this.http('API Response', {
      method: req.method,
      url: req.url,
      statusCode,
      duration,
      ip: this.getClientIP(req),
      ...context,
    });
  }

  public apiError(
    error: Error,
    req?: NextApiRequest,
    context?: Partial<LogContext>
  ): void {
    this.error('API Error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      method: req?.method,
      url: req?.url,
      ip: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers['user-agent'],
      ...context,
    });
  }

  public authEvent(
    event: 'login' | 'logout' | 'token_refresh' | 'auth_failed',
    userId?: string,
    req?: NextApiRequest,
    context?: Partial<LogContext>
  ): void {
    const level = event === 'auth_failed' ? LogLevel.WARN : LogLevel.INFO;
    this.writeLog(this.createLogEntry(level, `Auth Event: ${event}`, {
      action: event,
      userId,
      method: req?.method,
      url: req?.url,
      ip: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers['user-agent'],
      ...context,
    }));
  }

  public businessEvent(
    event: string,
    resource: string,
    context?: Partial<LogContext>
  ): void {
    this.info(`Business Event: ${event}`, {
      action: event,
      resource,
      ...context,
    });
  }

  public performanceMetric(
    operation: string,
    duration: number,
    context?: Partial<LogContext>
  ): void {
    this.info(`Performance: ${operation}`, {
      action: operation,
      duration,
      ...context,
    });
  }

  public securityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    req?: NextApiRequest,
    context?: Partial<LogContext>
  ): void {
    const level = severity === 'critical' || severity === 'high' ? LogLevel.ERROR : LogLevel.WARN;
    this.writeLog(this.createLogEntry(level, `Security Event: ${event}`, {
      action: event,
      severity,
      method: req?.method,
      url: req?.url,
      ip: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers['user-agent'],
      ...context,
    }));
  }

  public databaseEvent(
    operation: string,
    table: string,
    duration?: number,
    context?: Partial<LogContext>
  ): void {
    this.debug(`Database: ${operation}`, {
      action: operation,
      resource: table,
      duration,
      ...context,
    });
  }

  public externalServiceEvent(
    service: string,
    operation: string,
    success: boolean,
    duration?: number,
    context?: Partial<LogContext>
  ): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    this.writeLog(this.createLogEntry(level, `External Service: ${service} - ${operation}`, {
      action: operation,
      resource: service,
      success,
      duration,
      ...context,
    }));
  }

  // 헬퍼 메서드들
  private getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || 'unknown';
    return ip;
  }
}

// 싱글톤 인스턴스 export
export const logger = Logger.getInstance();

// 요청 ID 생성 헬퍼
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

// API 로깅 미들웨어
export function withLogging<T extends any[]>(
  handler: (...args: T) => Promise<any> | any,
  operationName?: string
) {
  return async (...args: T) => {
    const start = Date.now();
    const requestId = generateRequestId();

    // 첫 번째 인자가 Request인 경우
    const req = args[0] as any;
    const isApiRequest = req && typeof req === 'object' && 'method' in req && 'url' in req;

    if (isApiRequest) {
      logger.apiRequest(req, { requestId, action: operationName });
    }

    try {
      const result = await handler(...args);

      const duration = Date.now() - start;

      if (isApiRequest) {
        // 응답 상태 코드는 res에서 가져와야 함
        const res = args[1] as any;
        const statusCode = res?.statusCode || 200;
        logger.apiResponse(req, statusCode, duration, { requestId, action: operationName });
      } else if (operationName) {
        logger.performanceMetric(operationName, duration, { requestId });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;

      if (isApiRequest) {
        logger.apiError(error as Error, req, { requestId, action: operationName, duration });
      } else {
        logger.error(`Operation failed: ${operationName || 'unknown'}`, {
          requestId,
          duration,
          error: {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        });
      }

      throw error;
    }
  };
}

// 로그 수집기 클래스 (배치 처리용)
export class LogCollector {
  private logs: LogEntry[] = [];
  private maxBatchSize: number = 100;
  private flushInterval: number = 5000; // 5초
  private timer?: NodeJS.Timeout;

  constructor(maxBatchSize: number = 100, flushInterval: number = 5000) {
    this.maxBatchSize = maxBatchSize;
    this.flushInterval = flushInterval;
    this.scheduleFlush();
  }

  public collect(level: LogLevel, message: string, context?: LogContext): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      service: 'visionmakers-api',
      environment: process.env.NODE_ENV || 'development',
    };

    this.logs.push(entry);

    if (this.logs.length >= this.maxBatchSize) {
      this.flush();
    }
  }

  public flush(): void {
    if (this.logs.length === 0) return;

    const logsToSend = [...this.logs];
    this.logs = [];

    // 실제 환경에서는 외부 로그 수집 서비스로 전송
    // (예: Elasticsearch, Splunk, CloudWatch 등)
    logger.debug('Flushing logs to external service', {
      count: logsToSend.length,
      metadata: { logs: logsToSend },
    });
  }

  private scheduleFlush(): void {
    this.timer = setTimeout(() => {
      this.flush();
      this.scheduleFlush();
    }, this.flushInterval);
  }

  public destroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.flush(); // 남은 로그 전송
  }
}

// 기본 로그 수집기 인스턴스
export const logCollector = new LogCollector();

// 프로세스 종료 시 로그 수집기 정리
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => {
    logCollector.destroy();
  });

  process.on('SIGINT', () => {
    logCollector.destroy();
  });
}

// 편의 함수들 (기존 코드와의 호환성)
export const log = {
  error: (message: string, context?: LogContext) => logger.error(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  http: (message: string, context?: LogContext) => logger.http(message, context),
};

export default logger;