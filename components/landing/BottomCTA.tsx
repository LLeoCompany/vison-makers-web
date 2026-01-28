"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Shield, Sparkles, CheckCircle } from "lucide-react";

const BottomCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch {
      setError("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 px-4 bg-[#0a0a0f] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D1FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#60A5FA]/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 209, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 209, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Glassmorphism Card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />

          {/* Border Glow */}
          <div className="absolute inset-0 rounded-3xl border border-[#00D1FF]/30" />

          {/* Inner Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/5 via-transparent to-[#60A5FA]/5"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            {/* Badge */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-[#00D1FF]/10 px-4 py-2 rounded-full border border-[#00D1FF]/30">
                <Sparkles className="w-4 h-4 text-[#00D1FF]" />
                <span className="text-[#00D1FF] text-sm font-medium">
                  무료 보안 진단
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-white text-center mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              이미 준비된 귀사의 데이터를
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#60A5FA]">
                안전한 지능
              </span>
              으로 바꿀 차례입니다.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              className="text-gray-400 text-center mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              이메일을 입력하시면, 전문 컨설턴트가 귀사의 보안 리스크를 무료로
              진단해드립니다.
            </motion.p>

            {/* Form */}
            {!isSubmitted ? (
              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Email Input */}
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="업무용 이메일 주소"
                    className="w-full pl-12 pr-4 py-4 bg-[#1a1a2e]/80 border border-[#00D1FF]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF]/50 transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D1FF] to-[#60A5FA] text-black font-semibold px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>처리 중...</span>
                    </>
                  ) : (
                    <>
                      <span>보안 진단 요청</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-[#48BB78]/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#48BB78]" />
                </div>
                <p className="text-white font-medium text-lg">
                  요청이 접수되었습니다!
                </p>
                <p className="text-gray-400 text-sm">
                  24시간 이내에 전문 컨설턴트가 연락드리겠습니다.
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.p
                className="text-[#EF4444] text-sm text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-4 h-4 text-[#48BB78]" />
                <span>SSL 암호화</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-4 h-4 text-[#48BB78]" />
                <span>정보 보호 약속</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-4 h-4 text-[#48BB78]" />
                <span>스팸 발송 없음</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BottomCTA;
