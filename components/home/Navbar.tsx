"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, MessageSquare } from "lucide-react";
import { dropdownMenuItems } from "@/config/solutionsConfig";

const navLinks = [
  { label: "회사소개", href: "#about" },
  { label: "LLM이란?", href: "#system-intro" },
];

interface NavbarProps {
  onConsultationOpen: () => void;
  /** "dark" = hero is dark (default, white text before scroll)
   *  "light" = hero is light (dark text even before scroll) */
  heroTheme?: "dark" | "light";
}

export default function Navbar({ onConsultationOpen, heroTheme = "dark" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Responsive detection via JS (more reliable than CSS-only)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openDropdown = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    hoverTimer.current = setTimeout(() => setDropdownOpen(false), 160);
  };

  // Header background based on scroll state + hero theme
  const isLight = heroTheme === "light";
  const headerBg = scrolled
    ? "bg-white shadow-sm border-b border-gray-100"
    : isLight
    ? "bg-white/90 border-b border-gray-100 backdrop-blur-sm"
    : "bg-transparent";

  // Text color based on scroll state + hero theme
  const textColor = scrolled || isLight ? "text-gray-700" : "text-white";
  const hoverText = scrolled || isLight ? "hover:text-blue-700" : "hover:text-blue-200";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
        className={`transition-all duration-300 ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 80,
            }}
          >
            {/* ── Logo ──────────────────────────────────────────────── */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#1E40AF",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>V</span>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: scrolled || isLight ? "#111827" : "#ffffff",
                  transition: "color 0.3s",
                  letterSpacing: "-0.02em",
                }}
              >
                Vision<span style={{ color: "#93C5FD" }}>AI</span>
              </span>
            </Link>

            {/* ── Desktop Nav (JS-based show/hide) ──────────────────── */}
            {!isMobile && (
              <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleAnchor(link.href)}
                    className={`font-medium transition-colors ${textColor} ${hoverText}`}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontSize: 15 }}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Dropdown: 분야별 AI */}
                <div
                  style={{ position: "relative" }}
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={`font-medium transition-colors ${textColor} ${hoverText}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 0",
                      fontSize: 15,
                    }}
                  >
                    분야별 AI
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex" }}
                    >
                      <ChevronDown style={{ width: 16, height: 16 }} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 12px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 260,
                          background: "white",
                          borderRadius: 16,
                          boxShadow: "0 20px 40px rgba(30,64,175,0.12)",
                          border: "1px solid #EFF6FF",
                          overflow: "hidden",
                          zIndex: 100,
                        }}
                      >
                        {/* Dropdown header */}
                        <div
                          style={{
                            padding: "10px 16px",
                            background: "#EFF6FF",
                            borderBottom: "1px solid #DBEAFE",
                          }}
                        >
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            분야별 AI 솔루션
                          </p>
                        </div>

                        {/* Items */}
                        <div style={{ padding: 8 }}>
                          {dropdownMenuItems.map((item, i) => (
                            <motion.div
                              key={item.field}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.035 }}
                            >
                              <Link
                                href={`/solutions/${item.field}`}
                                onClick={() => setDropdownOpen(false)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  borderRadius: 10,
                                  textDecoration: "none",
                                  transition: "background 0.15s",
                                }}
                                className="hover:bg-blue-50 group"
                              >
                                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                                <span
                                  style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                                  className="group-hover:text-blue-700"
                                >
                                  {item.label}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            )}

            {/* ── Desktop CTA Button ─────────────────────────────────── */}
            {!isMobile && (
              <button
                onClick={onConsultationOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  background: "#1E40AF",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(30,64,175,0.35)",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1E3A8A")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#1E40AF")}
              >
                <MessageSquare style={{ width: 16, height: 16 }} />
                상담 신청
              </button>
            )}

            {/* ── Mobile Hamburger ───────────────────────────────────── */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen((v) => !v)}
                style={{
                  padding: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: scrolled || isLight ? "#374151" : "white",
                }}
              >
                {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Drawer ──────────────────────────────────────────── */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: "white", borderTop: "1px solid #F3F4F6", overflow: "hidden" }}
            >
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleAnchor(link.href)}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#374151",
                      padding: "10px 0",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #F9FAFB",
                      cursor: "pointer",
                    }}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Mobile: 분야별 AI */}
                <div>
                  <button
                    onClick={() => setMobileDropdownOpen((v) => !v)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#374151",
                      padding: "10px 0",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #F9FAFB",
                      cursor: "pointer",
                    }}
                  >
                    분야별 AI
                    <motion.span animate={{ rotate: mobileDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown style={{ width: 16, height: 16 }} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden", paddingLeft: 8 }}
                      >
                        {dropdownMenuItems.map((item) => (
                          <Link
                            key={item.field}
                            href={`/solutions/${item.field}`}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 0",
                              textDecoration: "none",
                              fontSize: 13,
                              color: "#6B7280",
                            }}
                          >
                            <span>{item.emoji}</span>
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => { setMobileOpen(false); onConsultationOpen(); }}
                  style={{
                    marginTop: 8,
                    width: "100%",
                    padding: "12px 0",
                    background: "#1E40AF",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <MessageSquare style={{ width: 16, height: 16 }} />
                  상담 신청
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
