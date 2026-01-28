"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const footerGroups = [
  {
    title: "서비스",
    links: [
      { label: "RAG 시스템", href: "#" },
      { label: "AI 챗봇", href: "#" },
      { label: "추천 엔진", href: "#" },
      { label: "맞춤 개발", href: "#" },
    ],
  },
  {
    title: "산업",
    links: [
      { label: "법률", href: "#" },
      { label: "의료", href: "#" },
      { label: "제조", href: "#" },
      { label: "스타트업", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "채용", href: "#" },
      { label: "블로그", href: "#" },
      { label: "문의", href: "/consultation/start" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "/privacy-policy" },
      { label: "보안정책", href: "#" },
    ],
  },
];

const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="relative bg-black border-t border-white/10 snap-start"
    >
      <motion.div style={{ opacity, y }} className="max-w-6xl mx-auto px-6">
        {/* Top Section - Brand */}
        <div className="pt-24 pb-20 border-b border-white/10">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Vision-Makers
          </motion.h2>
          <motion.p
            className="text-white/40 text-lg md:text-xl max-w-lg font-light"
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
        <div className="py-20 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {footerGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-6 text-sm tracking-wide">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section - Contact & Copyright */}
        <div className="py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Contact */}
          <motion.div
            className="flex flex-col md:flex-row gap-6 md:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <a
              href="mailto:contact@vision-makers.io"
              className="text-white/40 hover:text-[#007AFF] transition-colors text-sm"
            >
              contact@vision-makers.io
            </a>
            <a
              href="tel:+82-10-9915-4724"
              className="text-white/40 hover:text-[#007AFF] transition-colors text-sm"
            >
              010-9915-4724
            </a>
          </motion.div>

          {/* Copyright */}
          <motion.p
            className="text-white/30 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {currentYear} Vision-Makers. All rights reserved.
          </motion.p>
        </div>

        {/* Extra Whitespace - Toss Style */}
        <div className="h-24" />
      </motion.div>
    </footer>
  );
};

export default Footer;
