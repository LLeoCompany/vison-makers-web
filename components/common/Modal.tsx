/**
 * 디자인된 모달 팝업 컴포넌트
 * alert() 대신 사용하는 커스텀 모달
 */

import React, { useEffect, useCallback } from "react";

export type ModalType = "success" | "error" | "info" | "warning";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title: string;
  message: string;
  subMessage?: string;
  buttonText?: string;
  onConfirm?: () => void;
}

const iconMap: Record<ModalType, { icon: string; bgColor: string; textColor: string }> = {
  success: {
    icon: "✓",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  error: {
    icon: "✕",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  info: {
    icon: "i",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  warning: {
    icon: "!",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
};

export default function Modal({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  subMessage,
  buttonText = "확인",
  onConfirm,
}: ModalProps) {
  const { icon, bgColor, textColor } = iconMap[type];

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-modal-in"
        style={{
          animation: "modalIn 0.3s ease-out forwards",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8 text-center">
          {/* 아이콘 */}
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-full ${bgColor} flex items-center justify-center`}
          >
            <span className={`text-3xl font-bold ${textColor}`}>{icon}</span>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>

          {/* 메시지 */}
          <p className="text-gray-600 mb-2 whitespace-pre-line">{message}</p>

          {/* 부가 메시지 */}
          {subMessage && (
            <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">
              {subMessage}
            </p>
          )}

          {/* 버튼 */}
          <button
            onClick={handleConfirm}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              type === "success"
                ? "bg-green-500 hover:bg-green-600"
                : type === "error"
                ? "bg-red-500 hover:bg-red-600"
                : type === "warning"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
