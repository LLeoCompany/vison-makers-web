/**
 * Supabase 프로젝트 설정 자동화 스크립트
 * Node.js 스크립트로 Supabase 프로젝트 초기 설정
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 환경변수 로드
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.log('다음 환경변수를 .env 파일에 설정해주세요:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  console.log('🚀 Supabase 프로젝트 설정을 시작합니다...\n');

  try {
    // 1. 연결 테스트
    console.log('1️⃣ 데이터베이스 연결 테스트...');
    const { data, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (connectionError) {
      throw new Error(`연결 실패: ${connectionError.message}`);
    }
    console.log('✅ 데이터베이스 연결 성공\n');

    // 2. 마이그레이션 실행
    console.log('2️⃣ 데이터베이스 스키마 생성...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');

    if (!fs.existsSync(migrationPath)) {
      throw new Error('마이그레이션 파일을 찾을 수 없습니다: ' + migrationPath);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // SQL을 세미콜론으로 분할하여 각각 실행
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      try {
        await supabase.rpc('exec_sql', { sql_query: statement });
      } catch (error) {
        // 이미 존재하는 테이블/함수 등은 무시
        if (!error.message.includes('already exists')) {
          console.warn(`⚠️ SQL 실행 경고: ${error.message}`);
        }
      }
    }

    console.log('✅ 데이터베이스 스키마 생성 완료\n');

    // 3. 시드 데이터 삽입
    console.log('3️⃣ 샘플 데이터 삽입...');
    const seedPath = path.join(__dirname, '../supabase/seed.sql');

    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf-8');
      const seedStatements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of seedStatements) {
        try {
          await supabase.rpc('exec_sql', { sql_query: statement });
        } catch (error) {
          // 중복 데이터는 무시
          if (!error.message.includes('duplicate') && !error.message.includes('already exists')) {
            console.warn(`⚠️ 시드 데이터 삽입 경고: ${error.message}`);
          }
        }
      }
      console.log('✅ 샘플 데이터 삽입 완료\n');
    } else {
      console.log('ℹ️ 시드 파일이 없어 샘플 데이터를 건너뜁니다.\n');
    }

    // 4. 테이블 생성 확인
    console.log('4️⃣ 테이블 생성 확인...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'consultations',
        'guided_consultations',
        'free_consultations',
        'consultation_logs',
        'consultation_stats'
      ]);

    if (tablesError) {
      throw new Error(`테이블 확인 실패: ${tablesError.message}`);
    }

    const expectedTables = ['consultations', 'guided_consultations', 'free_consultations', 'consultation_logs', 'consultation_stats'];
    const actualTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(table => !actualTables.includes(table));

    if (missingTables.length > 0) {
      console.warn(`⚠️ 일부 테이블이 생성되지 않았습니다: ${missingTables.join(', ')}`);
    } else {
      console.log('✅ 모든 테이블이 정상적으로 생성되었습니다.');
    }

    actualTables.forEach(table => {
      console.log(`   - ${table}`);
    });
    console.log('');

    // 5. RLS 정책 확인
    console.log('5️⃣ RLS 정책 확인...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname')
      .in('tablename', expectedTables);

    if (policiesError) {
      console.warn(`⚠️ RLS 정책 확인 실패: ${policiesError.message}`);
    } else {
      console.log('✅ RLS 정책이 적용되었습니다:');
      policies.forEach(policy => {
        console.log(`   - ${policy.tablename}: ${policy.policyname}`);
      });
    }
    console.log('');

    // 6. API 테스트
    console.log('6️⃣ API 기능 테스트...');

    // 상담 데이터 조회 테스트
    const { data: consultations, error: consultationError } = await supabase
      .from('consultations')
      .select('count');

    if (consultationError) {
      console.warn(`⚠️ 상담 데이터 조회 테스트 실패: ${consultationError.message}`);
    } else {
      console.log('✅ 상담 데이터 조회 성공');
    }

    // 통계 데이터 조회 테스트
    const { data: stats, error: statsError } = await supabase
      .from('consultation_stats')
      .select('count');

    if (statsError) {
      console.warn(`⚠️ 통계 데이터 조회 테스트 실패: ${statsError.message}`);
    } else {
      console.log('✅ 통계 데이터 조회 성공');
    }

    console.log('\n🎉 Supabase 프로젝트 설정이 완료되었습니다!');
    console.log('\n다음 단계:');
    console.log('1. 프론트엔드에서 API 테스트');
    console.log('2. 상담 신청 폼 동작 확인');
    console.log('3. 관리자 대시보드 연동');

  } catch (error) {
    console.error('❌ 설정 중 오류 발생:', error.message);
    console.log('\n문제 해결 방법:');
    console.log('1. Supabase 프로젝트 URL과 키가 올바른지 확인');
    console.log('2. 서비스 롤 키에 충분한 권한이 있는지 확인');
    console.log('3. 네트워크 연결 상태 확인');
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  setupSupabase();
}

module.exports = { setupSupabase };