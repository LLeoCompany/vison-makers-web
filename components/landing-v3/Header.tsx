"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/90 backdrop-blur-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Text Only */}
            <Link href="/">
              <motion.span
                className="text-white font-black text-xl tracking-tight"
                whileHover={{ opacity: 0.7 }}
              >
                VM
              </motion.span>
            </Link>

            {/* Desktop Nav - Minimal */}
            <nav className="hidden md:flex items-center gap-12">
              <Link
                href="#value"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                강점
              </Link>
              <Link
                href="#solutions"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                솔루션
              </Link>
              <Link
                href="#architecture"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                보안
              </Link>
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
              <Link href="/consultation/start">
                <motion.button
                  className="text-[#007AFF] font-semibold text-sm hover:text-white transition-colors"
                  whileHover={{ x: 3 }}
                >
                  상담 →
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              className="flex flex-col items-center justify-center h-full gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Link
                href="#value"
                className="text-white text-3xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                강점
              </Link>
              <Link
                href="#solutions"
                className="text-white text-3xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                솔루션
              </Link>
              <Link
                href="#architecture"
                className="text-white text-3xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                보안
              </Link>
              <Link
                href="/consultation/start"
                className="text-[#007AFF] text-3xl font-black mt-8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                상담 →
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
