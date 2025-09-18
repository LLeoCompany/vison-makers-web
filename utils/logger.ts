/**
 * 구조화된 로깅 시스템
 * VisionMakers API 로그 관리
 */

import winston from 'winston';
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

// Winston 로거 설정
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

// 로거 생성
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'visionmakers-api',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // 에러 로그 파일
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 모든 로그 파일
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    // HTTP 로그 파일
    new winston.transports.File({
      filename: 'logs/http.log',
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 개발 환경에서는 콘솔에도 출력
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    })
  );
}

// 로거 클래스
export class Logger {
  private static instance: Logger;
  private winston: winston.Logger;

  private constructor() {
    this.winston = winstonLogger;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // 기본 로그 메서드들
  public error(message: string, context?: LogContext): void {
    this.winston.error(message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.winston.warn(message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.winston.info(message, context);
  }

  public http(message: string, context?: LogContext): void {
    this.winston.http(message, context);
  }

  public debug(message: string, context?: LogContext): void {
    this.winston.debug(message, context);
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
    this.winston.log(level, `Auth Event: ${event}`, {
      action: event,
      userId,
      method: req?.method,
      url: req?.url,
      ip: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers['user-agent'],
      ...context,
    });
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
    this.winston.log(level, `Security Event: ${event}`, {
      action: event,
      severity,
      method: req?.method,
      url: req?.url,
      ip: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers['user-agent'],
      ...context,
    });
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
    this.winston.log(level, `External Service: ${service} - ${operation}`, {
      action: operation,
      resource: service,
      success,
      duration,
      ...context,
    });
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
  private logs: any[] = [];
  private maxBatchSize: number = 100;
  private flushInterval: number = 5000; // 5초
  private timer?: NodeJS.Timeout;

  constructor(maxBatchSize: number = 100, flushInterval: number = 5000) {
    this.maxBatchSize = maxBatchSize;
    this.flushInterval = flushInterval;
    this.scheduleFlush();
  }

  public collect(level: LogLevel, message: string, context?: LogContext): void {
    this.logs.push({
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    });

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
process.on('SIGTERM', () => {
  logCollector.destroy();
});

process.on('SIGINT', () => {
  logCollector.destroy();
});

// 편의 함수들 (기존 코드와의 호환성)
export const log = {
  error: (message: string, context?: LogContext) => logger.error(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  http: (message: string, context?: LogContext) => logger.http(message, context),
};

export default logger;