/**
 * 관리자 로그인 페이지
 * 고정 비밀번호 인증: sh6130lim
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ADMIN_PASSWORD = 'sh6130lim';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminAuth') === 'true';
    if (isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 간단한 지연 효과 (실제 인증하는 것처럼)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // 세션에 인증 상태 저장
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminLoginTime', new Date().toISOString());

      // 대시보드로 리다이렉트
      router.push('/admin/dashboard');
    } else {
      setError('비밀번호가 틀렸습니다.');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-placeholder">VM</div>
          <h1 className="login-title">관리자 로그인</h1>
          <p className="login-subtitle">상담 관리 시스템에 접속하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="관리자 비밀번호를 입력하세요"
              required
              autoFocus
            />
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="login-button"
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="security-notice">
            <span className="security-icon">🔒</span>
            보안 연결로 보호됩니다
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo-placeholder {
          height: 48px;
          width: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: white;
          margin: 0 auto 16px auto;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .login-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: #ef4444;
          font-size: 14px;
        }

        .error-icon {
          font-size: 16px;
        }

        .login-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .login-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff40;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
        }

        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        .security-icon {
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }

          .login-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}