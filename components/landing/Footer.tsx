"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    solutions: [
      { label: "RAG 시스템 구축", href: "#" },
      { label: "AI 챗봇 개발", href: "#" },
      { label: "추천 시스템", href: "#" },
      { label: "맞춤 컨설팅", href: "#" },
    ],
    industries: [
      { label: "법률", href: "#" },
      { label: "의료", href: "#" },
      { label: "제조", href: "#" },
      { label: "공공기관", href: "#" },
    ],
    company: [
      { label: "회사 소개", href: "#" },
      { label: "채용", href: "#" },
      { label: "블로그", href: "#" },
      { label: "문의하기", href: "/consultation/start" },
    ],
    legal: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "/privacy-policy" },
      { label: "보안정책", href: "#" },
    ],
  };

  return (
    <footer className="bg-[#0a0a0f] border-t border-[#00D1FF]/10">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00D1FF] to-[#60A5FA] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-bold text-lg">Vision-Makers</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              기업 전용 Private RAG AI 솔루션. 귀사의 데이터를 성벽 안에 가두고,
              오직 지능만 활용합니다.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:contact@vision-makers.io"
                className="flex items-center gap-2 text-gray-500 hover:text-[#00D1FF] transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@vision-makers.io
              </a>
              <a
                href="tel:+82-10-9915-4724"
                className="flex items-center gap-2 text-gray-500 hover:text-[#00D1FF] transition-colors"
              >
                <Phone className="w-4 h-4" />
                010-9915-4724
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">솔루션</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#00D1FF] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-white font-semibold mb-4">산업별</h4>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#00D1FF] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">회사</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#00D1FF] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#00D1FF]/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} Vision-Makers. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="bg-[#0f0f1a] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield className="w-4 h-4 text-[#48BB78]" />
              <span>SOC2 Type II</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield className="w-4 h-4 text-[#48BB78]" />
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield className="w-4 h-4 text-[#48BB78]" />
              <span>ISMS-P</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield className="w-4 h-4 text-[#48BB78]" />
              <span>AES-256 암호화</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
