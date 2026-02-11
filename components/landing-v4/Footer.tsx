"use client";
import React from "react";
import Link from "next/link";

const menuLinks = [
  { label: "서비스", href: "#" },
  { label: "솔루션", href: "#solutions" },
  { label: "회사 소개", href: "#" },
];

const legalLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "/privacy-policy" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top - Links */}
        <div className="flex gap-16 mb-10">
          {/* Menu */}
          <div>
            <p className="text-[#00F0FF] text-xs font-medium tracking-widest mb-4">
              MENU
            </p>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[#00F0FF] text-xs font-medium tracking-widest mb-4">
              LEGAL
            </p>
            <ul className="space-y-2">
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
        </div>

        {/* Bottom - Company Info */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Vision-Makers
              </h3>
              <p className="text-white/40 text-xs">
                귀사의 데이터를 성벽 안에 가두고, 오직 지능만 활용합니다.
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <a
                href="mailto:contact@vision-makers.io"
                className="text-white/50 hover:text-[#00F0FF] transition-colors"
              >
                contact@vision-makers.io
              </a>
              <a
                href="tel:+82-10-9915-4724"
                className="text-white/50 hover:text-[#00F0FF] transition-colors"
              >
                010-9915-4724
              </a>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-white/30 text-xs">
              © {currentYear} Vision-Makers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
