"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Send,
  FileText,
  CheckCircle,
  Loader2,
  Sparkles,
  Database,
  Shield,
} from "lucide-react";
import type { IndustryConfig } from "@/config/industryConfig";

interface IndustryDemoProps {
  config: IndustryConfig;
}

const IndustryDemo = ({ config }: IndustryDemoProps) => {
  const { theme, demo } = config;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [isTyping, setIsTyping] = useState(false);
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const typeResponse = useCallback(() => {
    let responseIndex = 0;
    const responseInterval = setInterval(() => {
      if (responseIndex < demo.response.length) {
        setDisplayedResponse(demo.response.slice(0, responseIndex + 1));
        responseIndex++;
      } else {
        clearInterval(responseInterval);
        setTimeout(() => setShowSources(true), 300);
      }
    }, 15);
  }, [demo.response]);

  const startDemo = useCallback(() => {
    setIsTyping(true);
    setDisplayedQuery("");
    setShowResponse(false);
    setDisplayedResponse("");
    setShowSources(false);

    // Type query
    let queryIndex = 0;
    const queryInterval = setInterval(() => {
      if (queryIndex < demo.query.length) {
        setDisplayedQuery(demo.query.slice(0, queryIndex + 1));
        queryIndex++;
      } else {
        clearInterval(queryInterval);
        setIsTyping(false);

        // Show response after delay
        setTimeout(() => {
          setShowResponse(true);
          typeResponse();
        }, 800);
      }
    }, 40);
  }, [demo.query, typeResponse]);

  // Auto-start demo when in view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      startDemo();
    }
  }, [isInView, hasStarted, startDemo]);

  const resetDemo = useCallback(() => {
    setHasStarted(false);
    setIsTyping(false);
    setDisplayedQuery("");
    setShowResponse(false);
    setDisplayedResponse("");
    setShowSources(false);
    setTimeout(() => {
      setHasStarted(true);
      startDemo();
    }, 100);
  }, [startDemo]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${theme.primary}20`,
              border: `1px solid ${theme.primary}40`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.secondary }} />
            <span style={{ color: theme.secondary }} className="text-sm font-mono">
              Live Demo
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            실제 업무에서 이렇게 작동합니다
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {config.nameKo} 업종에 최적화된 AI 응답을 경험해보세요
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)",
              borderColor: `${theme.primary}30`,
            }}
          >
            {/* Demo Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-gray-400 text-sm font-mono">
                  Vision AI - {config.nameKo} Assistant
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.secondary,
                  }}
                >
                  <Shield className="w-3 h-3" />
                  Private Mode
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-6 min-h-[400px] space-y-6">
              {/* User Query */}
              <AnimatePresence>
                {displayedQuery && (
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <p className="text-white">{displayedQuery}</p>
                      {isTyping && (
                        <span className="inline-block w-1 h-4 ml-1 bg-white animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Response */}
              <AnimatePresence>
                {showResponse && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-[90%] space-y-4">
                      {/* Response Content */}
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/50 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}30` }}
                          >
                            <Sparkles
                              className="w-3 h-3"
                              style={{ color: theme.secondary }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm">Vision AI</span>
                        </div>
                        <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                          {displayedResponse}
                          {displayedResponse.length < demo.response.length && (
                            <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Sources */}
                      <AnimatePresence>
                        {showSources && (
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Confidence Score */}
                            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 text-sm">
                                신뢰도 {Math.round(demo.confidence * 100)}%
                              </span>
                              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald-400 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${demo.confidence * 100}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                />
                              </div>
                            </div>

                            {/* Source Documents */}
                            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                              <Database className="w-4 h-4 text-gray-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                                  참조 문서
                                </p>
                                <div className="space-y-1.5">
                                  {demo.sources.map((source, index) => (
                                    <motion.div
                                      key={source}
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 * index }}
                                    >
                                      <FileText
                                        className="w-3 h-3"
                                        style={{ color: theme.secondary }}
                                      />
                                      <span className="text-gray-300 text-sm">
                                        {source}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              {!isTyping && displayedQuery && !showResponse && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        style={{ color: theme.secondary }}
                      />
                      <span className="text-gray-400 text-sm">분석 중...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area (Decorative) */}
            <div
              className="px-6 py-4 border-t"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-500 text-sm">
                  질문을 입력하세요...
                </div>
                <motion.button
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: theme.primary }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetDemo}
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Replay Button */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={showSources ? { opacity: 1 } : {}}
          >
            <button
              onClick={resetDemo}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ↻ 데모 다시 보기
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryDemo;
