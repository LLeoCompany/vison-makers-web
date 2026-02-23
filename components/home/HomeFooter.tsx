"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { dropdownMenuItems } from "@/config/solutionsConfig";

export default function HomeFooter() {
  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg">
                Vision<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              보안 기반 도메인 특화 RAG 솔루션으로
              <br />
              귀사의 데이터를 강력한 지능으로 만듭니다.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                010-9915-4724
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                contact@vision-makers.io
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                Vision-Makers
              </div>
            </div>
          </div>

          {/* 분야별 AI */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">분야별 AI</h4>
            <ul className="space-y-2.5">
              {dropdownMenuItems.map((item) => (
                <li key={item.field}>
                  <Link
                    href={`/solutions/${item.field}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-xs">{item.emoji}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">서비스</h4>
            <ul className="space-y-2.5">
              {[
                { label: "RAG 솔루션 소개", href: "#services" },
                { label: "보안 체계", href: "#security" },
                { label: "도입 사례", href: "#cases" },
                { label: "무료 상담", href: "#consultation" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">회사</h4>
            <ul className="space-y-2.5">
              {[
                { label: "회사소개", href: "#about" },
                { label: "LLM이란?", href: "#system-intro" },
                { label: "개인정보처리방침", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("#") ? (
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2024 Vision-Makers. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            ISO 27001 보안 인증 · 개인정보보호법 준수
          </div>
        </div>
      </div>
    </footer>
  );
}
