"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Phone } from "lucide-react";

const footerLinks = [
  {
    title: "서비스",
    links: [
      { label: "사내 지식 기반 RAG", href: "#services" },
      { label: "전문 도메인 특화 RAG", href: "#services" },
      { label: "고객 접점 상담 RAG", href: "#services" },
    ],
  },
  {
    title: "보안",
    links: [
      { label: "5-Layer 보안 체계", href: "#security" },
      { label: "ISO 27001 인증", href: "#security" },
      { label: "On-Premise 구축", href: "#security" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "도입 사례", href: "#cases" },
      { label: "무료 상담", href: "#consultation" },
      { label: "개인정보처리방침", href: "/privacy-policy" },
    ],
  },
];

export default function HomeFooter() {
  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
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
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blue-400" />
                contact@vision-makers.ai
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-blue-400" />
                02-0000-0000
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
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
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2024 Vision Makers. All rights reserved.
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
