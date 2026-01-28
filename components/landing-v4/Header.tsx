"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/90 backdrop-blur-xl" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between h-20 px-8 md:px-16">
          {/* Logo */}
          <Link href="/">
            <motion.span
              className="text-xl md:text-2xl font-black text-white tracking-tight"
              whileHover={{ opacity: 0.7 }}
            >
              VM<span className="text-[#00F0FF]">.</span>
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            <Link
              href="#features"
              className="text-white/60 hover:text-white transition-colors text-sm tracking-wide"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-white/60 hover:text-white transition-colors text-sm tracking-wide"
            >
              Solutions
            </Link>
            <Link href="/consultation/start">
              <motion.span
                className="text-[#00F0FF] font-semibold text-sm tracking-wide cursor-pointer"
                whileHover={{ opacity: 0.7 }}
              >
                Contact →
              </motion.span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                href="#features"
                className="text-white text-4xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#solutions"
                className="text-white text-4xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="/consultation/start"
                className="text-[#00F0FF] text-4xl font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact →
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
