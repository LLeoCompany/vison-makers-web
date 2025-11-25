/**
 * LeoFitTech 희소성 및 긴급성 컴포넌트
 * 행동경제학의 희소성 원리와 긴급성을 활용한 전환율 최적화
 */

import React, { useState, useEffect } from "react";

interface ScarcityUrgencyComponentProps {
  variant?: "slots" | "time" | "discount" | "queue";
  intensity?: "low" | "medium" | "high";
}

export default function ScarcityUrgencyComponent({
  variant = "slots",
  intensity = "medium",
}: ScarcityUrgencyComponentProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 32,
  });
  const [availableSlots, setAvailableSlots] = useState(3);
  const [queueCount, setQueueCount] = useState(7);

  // 카운트다운 타이머
  useEffect(() => {
    if (variant === "time" || variant === "discount") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          let { hours, minutes, seconds } = prev;

          if (seconds > 0) {
            seconds--;
          } else if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [variant]);

  // 실시간 슬롯 변화 시뮬레이션
  useEffect(() => {
    if (variant === "slots") {
      const slotTimer = setInterval(() => {
        if (Math.random() < 0.1) {
          // 10% 확률로 슬롯 변경
          setAvailableSlots((prev) =>
            Math.max(1, Math.min(5, prev + (Math.random() > 0.6 ? 1 : -1)))
          );
        }
      }, 15000);

      return () => clearInterval(slotTimer);
    }
  }, [variant]);

  const getIntensityColor = () => {
    switch (intensity) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50";
      case "medium":
        return "text-orange-600 border-orange-200 bg-orange-50";
      case "low":
        return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default:
        return "text-orange-600 border-orange-200 bg-orange-50";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "slots":
        return "🔥";
      case "time":
        return "⏰";
      case "discount":
        return "💰";
      case "queue":
        return "👥";
      default:
        return "⚡";
    }
  };

  const renderContent = () => {
    switch (variant) {
      case "slots":
        return (
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {getIcon()} 이번 달 상담 가능 슬롯
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {availableSlots}개 남음
            </div>
            <div className="text-sm">현재 많은 분들이 문의주고 계십니다</div>
          </div>
        );

      case "time":
        return (
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {getIcon()} 오늘 마감까지
            </div>
            <div className="flex justify-center gap-2 mb-2">
              <div className="bg-gray-800 text-white px-3 py-2 rounded">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="self-center">:</div>
              <div className="bg-gray-800 text-white px-3 py-2 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="self-center">:</div>
              <div className="bg-gray-800 text-white px-3 py-2 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
            <div className="text-sm">24시간 내 연락 보장 서비스</div>
          </div>
        );

      case "discount":
        return (
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {getIcon()} 런칭 기념 특가 마감까지
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className="text-sm">
              <span className="line-through text-gray-500">정가 1,000만원</span>
              <span className="ml-2 font-bold text-red-600">
                → 600만원 (40% 할인)
              </span>
            </div>
          </div>
        );

      case "queue":
        return (
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {getIcon()} 실시간 대기열
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {queueCount}명이 상담 대기중
            </div>
            <div className="text-sm">평균 대기시간: 2-3시간</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`scarcity-urgency-component ${getIntensityColor()}`}>
      <div className="component-content">
        {renderContent()}

        {intensity === "high" && <div className="pulse-effect" />}
      </div>

      <style jsx>{`
        .scarcity-urgency-component {
          border: 2px solid;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
          position: relative;
          overflow: hidden;
        }

        .component-content {
          position: relative;
          z-index: 2;
        }

        .pulse-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(239, 68, 68, 0.1),
            transparent
          );
          animation: pulse-slide 2s infinite;
        }

        @keyframes pulse-slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 768px) {
          .scarcity-urgency-component {
            padding: 1rem;
            margin: 0.75rem 0;
          }
        }
      `}</style>
    </div>
  );
}
