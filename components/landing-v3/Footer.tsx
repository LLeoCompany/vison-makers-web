"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const footerGroups = [
  {
    title: "서비스",
    links: [
      { label: "RAG 시스템", href: "#" },
      { label: "AI 챗봇", href: "#" },
      { label: "추천 엔진", href: "#" },
    ],
  },
  {
    title: "산업",
    links: [
      { label: "법률", href: "#" },
      { label: "의료", href: "#" },
      { label: "제조", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "문의", href: "/consultation/start" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "/privacy-policy" },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Section - Brand */}
        <div className="pt-20 pb-16 border-b border-white/10">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Vision-Makers
          </motion.h2>
          <motion.p
            className="text-white/40 text-base md:text-lg max-w-md font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            귀사의 데이터를 성벽 안에 가두고,
            <br />
            오직 지능만 활용합니다.
          </motion.p>
        </div>

        {/* Middle Section - Links */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {footerGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <h4 className="text-white font-semibold mb-5 text-sm">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-[#007AFF] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="py-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-sm">
            <a
              href="mailto:contact@vision-makers.io"
              className="text-white/40 hover:text-[#007AFF] transition-colors"
            >
              contact@vision-makers.io
            </a>
            <a
              href="tel:+82-10-9915-4724"
              className="text-white/40 hover:text-[#007AFF] transition-colors"
            >
              010-9915-4724
            </a>
          </div>
          <p className="text-white/30 text-sm">
            © {currentYear} Vision-Makers
          </p>
        </div>

        {/* Extra Whitespace */}
        <div className="h-12" />
      </div>
    </footer>
  );
};

export default Footer;
