/**
 * VisionMakers 스크롤 트리거 CTA 컴포넌트
 * 사용자 스크롤 행동에 따른 동적 CTA 표시
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScrollTriggeredCTAProps {
  threshold?: number;
  variant?: 'default' | 'urgent' | 'discount';
  message?: string;
  buttonText?: string;
  href?: string;
}

export default function ScrollTriggeredCTA({
  threshold = 50,
  variant = 'default',
  message,
  buttonText = '무료 상담 신청',
  href = '/consultation/start'
}: ScrollTriggeredCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(progress > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return 'bg-red-500 hover:bg-red-600 text-white animate-pulse';
      case 'discount':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getDefaultMessage = () => {
    switch (variant) {
      case 'urgent':
        return '⚡ 24시간 내 연락드립니다!';
      case 'discount':
        return '🎉 런칭 기념 20% 할인!';
      default:
        return '📞 전문가 상담 받기';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`scroll-triggered-cta ${isVisible ? 'visible' : ''}`}>
        <div className="cta-content">
          <div className="message">
            {message || getDefaultMessage()}
          </div>
          <Link
            href={href}
            className={`cta-button ${getVariantStyles()}`}
          >
            {buttonText}
          </Link>
        </div>

        {/* 스크롤 진행률 표시 */}
        <div className="scroll-progress">
          <div
            className="progress-bar"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .scroll-triggered-cta {
          position: fixed;
          bottom: -100px;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: bottom 0.3s ease-in-out;
          padding: 1rem;
        }

        .scroll-triggered-cta.visible {
          bottom: 0;
        }

        .cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          gap: 1rem;
        }

        .message {
          font-weight: 600;
          color: #374151;
          flex: 1;
        }

        .cta-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .scroll-progress {
          height: 3px;
          background: #f3f4f6;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          transition: width 0.1s ease;
        }

        @media (max-width: 768px) {
          .cta-content {
            flex-direction: column;
            gap: 0.75rem;
          }

          .message {
            text-align: center;
            font-size: 0.9rem;
          }

          .cta-button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}