"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  Database,
  Shield,
  FileText,
  ChevronDown,
  Layers,
  Bot,
  Search,
  Lock,
  Building2,
  Factory,
  ShoppingCart,
  Briefcase,
  BookOpen,
  FileCode,
  Map,
  Phone,
  Sparkles,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface MegaMenuData {
  [key: string]: MenuCategory[];
}

const megaMenuData: MegaMenuData = {
  Platform: [
    {
      title: "Core Technology",
      items: [
        {
          label: "Vision RAG Engine",
          href: "/platform/rag-engine",
          icon: Search,
          description: "하이브리드 검색 + GraphRAG",
        },
        {
          label: "Agentic Orchestrator",
          href: "/platform/orchestrator",
          icon: Bot,
          description: "자율 에이전트 오케스트레이션",
        },
        {
          label: "Knowledge Graph",
          href: "/platform/knowledge-graph",
          icon: Layers,
          description: "엔터프라이즈 지식 그래프",
        },
      ],
    },
    {
      title: "Infrastructure",
      items: [
        {
          label: "Data Ingestion",
          href: "/platform/ingestion",
          icon: Database,
          description: "PDF, DB, API 통합",
        },
        {
          label: "Vector Database",
          href: "/platform/vector-db",
          icon: Cpu,
          description: "고성능 벡터 스토리지",
        },
        {
          label: "Admin Console",
          href: "/platform/admin",
          icon: Sparkles,
          description: "통합 관리 대시보드",
        },
      ],
    },
  ],
  Solutions: [
    {
      title: "By Industry",
      items: [
        {
          label: "E-commerce",
          href: "/industry/franchise",
          icon: ShoppingCart,
          description: "상품 검색 & CS 자동화",
        },
        {
          label: "Professional Services",
          href: "/industry/legal",
          icon: Briefcase,
          description: "법률, 회계, 컨설팅",
        },
        {
          label: "Manufacturing",
          href: "/industry/manufacturing",
          icon: Factory,
          description: "설비 매뉴얼 & 품질 관리",
        },
        {
          label: "Healthcare",
          href: "/industry/fitness",
          icon: Building2,
          description: "의료 정보 & 환자 관리",
        },
      ],
    },
  ],
  "Governance & Security": [
    {
      title: "Security",
      items: [
        {
          label: "Data Sovereignty",
          href: "/security/data-sovereignty",
          icon: Shield,
          description: "데이터 주권 & 프라이버시",
        },
        {
          label: "Access Control (RBAC)",
          href: "/security/rbac",
          icon: Lock,
          description: "역할 기반 접근 제어",
        },
        {
          label: "Compliance",
          href: "/security/compliance",
          icon: FileText,
          description: "ISO 27001, GDPR 준수",
        },
      ],
    },
  ],
  Resources: [
    {
      title: "Documentation",
      items: [
        {
          label: "Technical Whitepaper",
          href: "/resources/whitepaper",
          icon: BookOpen,
          description: "기술 아키텍처 상세",
        },
        {
          label: "API Documentation",
          href: "/resources/api-docs",
          icon: FileCode,
          description: "개발자 API 레퍼런스",
        },
        {
          label: "Implementation Roadmap",
          href: "/resources/roadmap",
          icon: Map,
          description: "도입 로드맵 가이드",
        },
      ],
    },
  ],
};

const MegaNavigation = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Nav Bar */}
      <nav className="relative bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-tight">
                  Vision AI
                </span>
                <span className="hidden md:block text-[10px] text-gray-500 uppercase tracking-widest">
                  Enterprise RAG Platform
                </span>
              </div>
            </Link>

            {/* Menu Items */}
            <div className="hidden lg:flex items-center gap-1">
              {Object.keys(megaMenuData).map((menuKey) => (
                <div
                  key={menuKey}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(menuKey)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    <span className="text-sm font-medium">{menuKey}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeMenu === menuKey ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
              <Link href="/consultation/start">
                <motion.button
                  className="px-5 py-2.5 bg-[#10B981] text-white text-sm font-semibold rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free PoC
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-[#0A192F]/95 backdrop-blur-xl border-b border-white/10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setActiveMenu(activeMenu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container mx-auto px-6 lg:px-12 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {megaMenuData[activeMenu]?.map((category, catIdx) => (
                    <div key={catIdx}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        {category.title}
                      </h3>
                      <ul className="space-y-1">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={item.href}
                              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E3A8A]/30 transition-colors">
                                <item.icon className="w-5 h-5 text-[#10B981]" />
                              </div>
                              <div>
                                <span className="block text-white font-medium text-sm group-hover:text-[#10B981] transition-colors">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="block text-gray-500 text-xs mt-0.5">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Quick Stats Panel */}
                  <div className="hidden lg:block">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Platform Metrics
                    </h3>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#1E3A8A]/20 to-[#10B981]/10 border border-white/10">
                      <div className="space-y-4">
                        <div>
                          <span className="text-2xl font-bold text-[#10B981]">
                            99.2%
                          </span>
                          <span className="block text-xs text-gray-400 mt-1">
                            Answer Accuracy
                          </span>
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-white">
                            {"<"}0.5s
                          </span>
                          <span className="block text-xs text-gray-400 mt-1">
                            Query Response
                          </span>
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-white">
                            100%
                          </span>
                          <span className="block text-xs text-gray-400 mt-1">
                            On-Premise Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default MegaNavigation;
