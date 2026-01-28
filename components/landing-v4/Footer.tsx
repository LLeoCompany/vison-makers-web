"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const menuLinks = [
  { label: "서비스", href: "#" },
  { label: "솔루션", href: "#solutions" },
  { label: "회사 소개", href: "#" },
  { label: "블로그", href: "#" },
  { label: "채용", href: "#" },
];

const legalLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "/privacy-policy" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black min-h-screen flex flex-col">
      {/* Main CTA Section */}
      <motion.div
        className="flex-1 flex items-center justify-center px-8 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center max-w-4xl">
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            귀사의 데이터를
            <br />
            <span className="text-[#00F0FF]">지능으로</span> 바꿀
            <br />
            준비가 되셨나요?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/consultation/start">
              <motion.button
                className="group relative overflow-hidden bg-[#00F0FF] text-black font-bold px-12 py-6 text-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">무료 상담 시작하기</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Content - Giantstep Style Split */}
      <div className="border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side - Company Info */}
          <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <h3 className="text-3xl md:text-4xl font-black text-white mb-8">
                Vision-Makers
              </h3>

              {/* Tagline */}
              <p className="text-white/40 text-base md:text-lg mb-12 max-w-md leading-relaxed">
                귀사의 데이터를 성벽 안에 가두고,
                <br />
                오직 지능만 활용합니다.
              </p>

              {/* Contact */}
              <div className="space-y-4">
                <a
                  href="mailto:contact@vision-makers.io"
                  className="block text-white/60 hover:text-[#00F0FF] transition-colors text-sm md:text-base"
                >
                  contact@vision-makers.io
                </a>
                <a
                  href="tel:+82-10-9915-4724"
                  className="block text-white/60 hover:text-[#00F0FF] transition-colors text-sm md:text-base"
                >
                  010-9915-4724
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Navigation */}
          <div className="p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {/* Menu Links */}
              <div className="mb-12">
                <p className="text-[#00F0FF] text-xs font-medium tracking-widest mb-6">
                  MENU
                </p>
                <ul className="space-y-4">
                  {menuLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors text-lg md:text-xl font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <p className="text-[#00F0FF] text-xs font-medium tracking-widest mb-6">
                  LEGAL
                </p>
                <ul className="space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/40 hover:text-white/60 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-8 md:px-16 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {currentYear} Vision-Makers. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Designed with passion for AI innovation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
