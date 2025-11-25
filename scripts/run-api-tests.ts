/**
 * API 테스트 실행 스크립트
 * 모든 API 테스트를 실행하고 결과를 리포트합니다.
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

interface TestResult {
  category: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  details: string;
}

class TestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log("🚀 LeoFitTech API 테스트 시작...\n");

    const testCategories = [
      {
        name: "API 버전 관리",
        pattern: "tests/api-versioning.test.ts",
      },
      {
        name: "API 통합 테스트",
        pattern: "tests/integration/api-integration.test.ts",
      },
      {
        name: "API 유효성 검증",
        pattern: "tests/validation/api-validation.test.ts",
      },
    ];

    for (const category of testCategories) {
      await this.runTestCategory(category.name, category.pattern);
    }

    this.printSummary();
  }

  private async runTestCategory(name: string, pattern: string): Promise<void> {
    console.log(`📋 ${name} 테스트 실행 중...`);

    const startTime = Date.now();

    try {
      // Jest를 사용한 테스트 실행
      const command = `npx jest ${pattern} --verbose --json`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
      });

      const duration = Date.now() - startTime;
      const result = this.parseJestOutput(stdout, name, duration);

      this.results.push(result);

      if (result.failed > 0) {
        console.log(`❌ ${name}: ${result.failed}개 실패`);
        console.log(stderr);
      } else {
        console.log(`✅ ${name}: 모든 테스트 통과 (${duration}ms)`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        category: name,
        passed: 0,
        failed: 1,
        skipped: 0,
        duration,
        details: error instanceof Error ? error.message : "Unknown error",
      };

      this.results.push(result);
      console.log(`❌ ${name}: 테스트 실행 실패`);
      console.error(error);
    }

    console.log(""); // 빈 줄
  }

  private parseJestOutput(
    output: string,
    category: string,
    duration: number
  ): TestResult {
    try {
      const jsonOutput = JSON.parse(output);

      return {
        category,
        passed: jsonOutput.numPassedTests || 0,
        failed: jsonOutput.numFailedTests || 0,
        skipped: jsonOutput.numPendingTests || 0,
        duration,
        details: output,
      };
    } catch {
      // JSON 파싱 실패 시 기본값 반환
      return {
        category,
        passed: 0,
        failed: 1,
        skipped: 0,
        duration,
        details: output,
      };
    }
  }

  private printSummary(): void {
    console.log("📊 테스트 결과 요약");
    console.log("=".repeat(50));

    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalDuration = 0;

    this.results.forEach((result) => {
      totalPassed += result.passed;
      totalFailed += result.failed;
      totalSkipped += result.skipped;
      totalDuration += result.duration;

      const status = result.failed > 0 ? "❌" : "✅";
      console.log(
        `${status} ${result.category}: ${result.passed}개 통과, ${result.failed}개 실패, ${result.skipped}개 스킵 (${result.duration}ms)`
      );
    });

    console.log("=".repeat(50));
    console.log(`📈 전체 결과:`);
    console.log(`   - 통과: ${totalPassed}개`);
    console.log(`   - 실패: ${totalFailed}개`);
    console.log(`   - 스킵: ${totalSkipped}개`);
    console.log(`   - 총 소요시간: ${totalDuration}ms`);

    const successRate =
      totalPassed + totalFailed > 0
        ? Math.round((totalPassed / (totalPassed + totalFailed)) * 100)
        : 0;

    console.log(`   - 성공률: ${successRate}%`);

    if (totalFailed > 0) {
      console.log(
        `\n⚠️  ${totalFailed}개의 테스트가 실패했습니다. 상세 내용을 확인해주세요.`
      );
      process.exit(1);
    } else {
      console.log("\n🎉 모든 테스트가 성공적으로 통과했습니다!");
    }
  }

  async runHealthCheck(): Promise<void> {
    console.log("🏥 API 헬스 체크 실행 중...\n");

    const healthChecks = [
      {
        name: "데이터베이스 연결",
        check: this.checkDatabase,
      },
      {
        name: "캐시 시스템",
        check: this.checkCache,
      },
      {
        name: "API 엔드포인트",
        check: this.checkApiEndpoints,
      },
    ];

    for (const healthCheck of healthChecks) {
      try {
        await healthCheck.check();
        console.log(`✅ ${healthCheck.name}: 정상`);
      } catch (error) {
        console.log(
          `❌ ${healthCheck.name}: 오류 - ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  private async checkDatabase(): Promise<void> {
    // 데이터베이스 연결 테스트
    const { supabaseAdmin } = await import("@/lib/supabase");

    const { error } = await supabaseAdmin
      .from("consultations")
      .select("id")
      .limit(1);

    if (error) {
      throw new Error(`데이터베이스 연결 실패: ${error.message}`);
    }
  }

  private async checkCache(): Promise<void> {
    // 캐시 시스템 테스트
    const { caches } = await import("@/utils/cache");

    // 테스트 데이터로 캐시 확인
    const testKey = "health-check-test";
    const testValue = { timestamp: Date.now() };

    caches.apiResponses.set(testKey, testValue);
    const retrieved = caches.apiResponses.get(testKey);

    if (!retrieved || retrieved.timestamp !== testValue.timestamp) {
      throw new Error("캐시 읽기/쓰기 실패");
    }

    caches.apiResponses.delete(testKey);
  }

  private async checkApiEndpoints(): Promise<void> {
    // 핵심 API 엔드포인트 확인
    const { extractApiVersion } = await import("@/utils/apiVersioning");

    // 테스트용 모의 요청
    const mockReq = {
      url: "/api/test",
      headers: { "api-version": "v2" },
      query: {},
    } as any;

    const version = extractApiVersion(mockReq);
    if (version !== "v2") {
      throw new Error("API 버전 추출 실패");
    }
  }
}

// 스크립트 실행
async function main(): Promise<void> {
  const runner = new TestRunner();

  const command = process.argv[2];

  switch (command) {
    case "health":
      await runner.runHealthCheck();
      break;
    case "test":
    default:
      await runner.runAllTests();
      break;
  }
}

// 에러 핸들링
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

if (require.main === module) {
  main().catch((error) => {
    console.error("테스트 실행 중 오류 발생:", error);
    process.exit(1);
  });
}

export default TestRunner;
