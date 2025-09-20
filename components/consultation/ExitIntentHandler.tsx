/**
 * 이탈 방지 핸들러 컴포넌트
 * 손실 회피 심리학을 활용한 Exit Intent 팝업
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useConsultationSubmit } from '@/hooks/useConsultationSubmit';

interface ExitIntentHandlerProps {
  onClose?: () => void;
}

export const ExitIntentHandler: React.FC<ExitIntentHandlerProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitConsultation } = useConsultationSubmit();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // 마우스가 브라우저 상단을 벗어날 때만 트리거
      if (e.clientY <= 0 && !hasShown && !showModal) {
        setShowModal(true);
        setHasShown(true);

        // 분석 이벤트 추적
        gtag('event', 'exit_intent_triggered', {
          event_category: 'User Behavior',
          event_label: 'Exit Intent Popup',
          time_on_page: Math.round(performance.now() / 1000)
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShown) {
        // 페이지 떠나기 전 마지막 기회
        setShowModal(true);
        setHasShown(true);

        gtag('event', 'exit_intent_beforeunload', {
          event_category: 'User Behavior'
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasShown, showModal]);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 간단한 이메일 상담 신청
      await submitConsultation({
        type: 'free',
        projectDescription: '이메일을 통한 견적서 요청',
        contact: {
          name: '견적서 요청',
          email: email,
          phone: '추후 제공',
          preferredContactTime: 'anytime'
        }
      });

      // 성공 상태로 변경
      setShowModal(false);

      // 성공 이벤트 추적
      gtag('event', 'exit_intent_conversion', {
        event_category: 'Conversion',
        event_label: 'Email Capture',
        value: 1
      });

      // 성공 메시지 표시
      showSuccessMessage();

    } catch (error) {
      console.error('Exit intent submission failed:', error);

      gtag('event', 'exit_intent_error', {
        event_category: 'Error',
        event_label: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessMessage = () => {
    // 간단한 성공 알림
    const successDiv = document.createElement('div');
    successDiv.className = 'exit-intent-success';
    successDiv.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✅</span>
        <span class="success-text">견적서를 이메일로 보내드릴게요!</span>
      </div>
    `;
    document.body.appendChild(successDiv);

    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  };

  const handleClose = () => {
    setShowModal(false);

    gtag('event', 'exit_intent_dismissed', {
      event_category: 'User Behavior',
      event_label: 'Modal Closed'
    });

    onClose?.();
  };

  if (!showModal) return null;

  return (
    <div className="exit-intent-overlay">
      <div className="exit-intent-modal">
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="닫기"
        >
          ×
        </button>

        <div className="modal-content">
          {/* 손실 회피 메시지 */}
          <div className="headline">
            <span className="attention-icon">⚠️</span>
            <h2>잠깐! 떠나시기 전에...</h2>
          </div>

          <div className="offer">
            <div className="offer-icon">🎁</div>
            <div className="offer-text">
              <p>무료 견적서만이라도</p>
              <p className="highlight">이메일로 받아보세요</p>
            </div>
          </div>

          {/* 손실 강조 */}
          <div className="loss-prevention">
            <div className="loss-item">
              <span className="loss-icon">💸</span>
              <span className="loss-text">놓치면 <strong>30% 할인 혜택</strong> 사라져요</span>
            </div>
            <div className="loss-item">
              <span className="loss-icon">⏰</span>
              <span className="loss-text">다음 달까지 <strong>대기</strong>하셔야 해요</span>
            </div>
          </div>

          {/* 빠른 이메일 폼 */}
          <form onSubmit={handleQuickSubmit} className="quick-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={!email || isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? '전송 중...' : '무료 견적서 받기'}
              </button>
            </div>
          </form>

          {/* 안심 요소 */}
          <div className="benefit-list">
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">맞춤 견적서 무료 제공</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">영업 전화 없음</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">언제든 취소 가능</span>
            </div>
          </div>

          {/* 사회적 증거 */}
          <div className="social-proof">
            <div className="proof-text">
              <strong>오늘 23명</strong>이 견적서를 받아갔어요
            </div>
            <div className="proof-avatars">
              <div className="avatar">👨</div>
              <div className="avatar">👩</div>
              <div className="avatar">👨‍💼</div>
              <div className="avatar">+20</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .exit-intent-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .exit-intent-modal {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f5f5f5;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #e0e0e0;
          transform: scale(1.1);
        }

        .modal-content {
          text-align: center;
        }

        .headline {
          margin-bottom: 24px;
        }

        .attention-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 12px;
        }

        .headline h2 {
          font-size: 28px;
          font-weight: 800;
          color: #2D3748;
          margin: 0;
        }

        .offer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #FFF5F2 0%, #FFE8E1 100%);
          border-radius: 16px;
        }

        .offer-icon {
          font-size: 48px;
        }

        .offer-text p {
          margin: 0;
          font-size: 18px;
          color: #4A5568;
        }

        .offer-text .highlight {
          font-size: 22px;
          font-weight: 700;
          color: #FF6B35;
        }

        .loss-prevention {
          margin-bottom: 32px;
          padding: 20px;
          background: #FEF5E7;
          border-radius: 12px;
          border-left: 4px solid #F6AD55;
        }

        .loss-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .loss-item:last-child {
          margin-bottom: 0;
        }

        .loss-icon {
          font-size: 20px;
        }

        .loss-text {
          font-size: 16px;
          color: #744210;
        }

        .quick-form {
          margin-bottom: 24px;
        }

        .input-group {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }

        @media (min-width: 480px) {
          .input-group {
            flex-direction: row;
          }
        }

        .email-input {
          flex: 1;
          padding: 16px;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        .email-input:focus {
          outline: none;
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .submit-button {
          padding: 16px 24px;
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .benefit-list {
          margin-bottom: 24px;
        }

        .benefit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #4A5568;
        }

        .benefit-icon {
          color: #48BB78;
          font-weight: bold;
        }

        .social-proof {
          padding-top: 20px;
          border-top: 1px solid #E2E8F0;
        }

        .proof-text {
          font-size: 14px;
          color: #718096;
          margin-bottom: 12px;
        }

        .proof-avatars {
          display: flex;
          justify-content: center;
          gap: 4px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F7FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .exit-intent-success {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #48BB78;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(72, 187, 120, 0.3);
          z-index: 10001;
          animation: successSlideIn 0.3s ease-out;
        }

        @keyframes successSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .success-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .success-icon {
          font-size: 20px;
        }

        .success-text {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ExitIntentHandler;