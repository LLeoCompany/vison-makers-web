"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Mail, Phone } from "lucide-react";

const footerLinks = {
  solutions: [
    { label: "RAG 시스템", href: "#" },
    { label: "AI 챗봇", href: "#" },
    { label: "추천 시스템", href: "#" },
  ],
  company: [
    { label: "회사 소개", href: "#" },
    { label: "블로그", href: "#" },
    { label: "문의하기", href: "/consultation/start" },
  ],
  industries: [
    { label: "법률", href: "#" },
    { label: "의료", href: "#" },
    { label: "제조", href: "#" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#060d18] border-t border-white/10 snap-start">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Logo & Slogan */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00D1FF] to-[#60A5FA] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#0a1628]" />
            </div>
            <span className="text-white font-bold text-xl">Vision-Makers</span>
          </Link>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            귀사의 데이터를 성벽 안에 가두고, 오직 지능만 활용합니다.
          </p>
        </motion.div>

        {/* 3-Column Links */}
        <motion.div
          className="grid grid-cols-3 gap-8 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">솔루션</h4>
            <ul className="space-y-2">
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

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">회사</h4>
            <ul className="space-y-2">
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

          {/* Industries */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">산업별</h4>
            <ul className="space-y-2">
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
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6" />

        {/* Contact & Copyright */}
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a
              href="mailto:contact@vision-makers.io"
              className="flex items-center gap-2 hover:text-[#00D1FF] transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@vision-makers.io
            </a>
            <a
              href="tel:+82-10-9915-4724"
              className="flex items-center gap-2 hover:text-[#00D1FF] transition-colors"
            >
              <Phone className="w-4 h-4" />
              010-9915-4724
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-xs">
            &copy; {currentYear} Vision-Makers. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
