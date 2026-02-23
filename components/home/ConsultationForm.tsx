"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  MessageSquare,
  Cloud,
  Server,
  Database,
  Building2,
  User,
  Phone,
  Mail,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// ─── Step 1 Data ──────────────────────────────────────────────────────────────
const purposes = [
  {
    id: "internal",
    icon: <BookOpen className="w-6 h-6" />,
    title: "사내 지식 관리",
    description: "매뉴얼·문서 통합 및 직원 활용 효율화",
  },
  {
    id: "professional",
    icon: <Brain className="w-6 h-6" />,
    title: "전문 분야 분석",
    description: "법률·금융·제조 전문 문서 심층 분석",
  },
  {
    id: "customer",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "고객 응대 자동화",
    description: "24/7 AI 상담원으로 고객 만족도 향상",
  },
];

// ─── Step 2 Data ──────────────────────────────────────────────────────────────
const dataSizes = [
  { id: "small", label: "소규모", desc: "1,000개 미만 문서" },
  { id: "medium", label: "중규모", desc: "1,000 ~ 10,000개" },
  { id: "large", label: "대규모", desc: "10,000개 이상" },
];

const environments = [
  {
    id: "cloud",
    icon: <Cloud className="w-5 h-5" />,
    label: "Cloud",
    desc: "빠른 도입, 유연한 확장",
  },
  {
    id: "on-premise",
    icon: <Server className="w-5 h-5" />,
    label: "On-Premise",
    desc: "완벽한 데이터 주권",
  },
  {
    id: "hybrid",
    icon: <Database className="w-5 h-5" />,
    label: "Hybrid",
    desc: "유연성과 보안 동시에",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

// ─── Sub Components ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < current
                ? "bg-blue-700 text-white"
                : i === current
                ? "bg-blue-100 text-blue-700 ring-2 ring-blue-700 ring-offset-2"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 transition-all duration-500 ${
                i < current ? "bg-blue-700" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">도입 목적을 선택해주세요</h3>
      <p className="text-sm text-gray-500 mb-6">귀사의 주요 RAG 도입 목적을 선택하세요.</p>
      <div className="space-y-3">
        {purposes.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              value === p.id
                ? "border-blue-700 bg-blue-50"
                : "border-gray-100 bg-white hover:border-blue-200"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                value === p.id ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {p.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{p.title}</div>
              <div className="text-sm text-gray-500">{p.description}</div>
            </div>
            {value === p.id && (
              <CheckCircle2 className="w-5 h-5 text-blue-700 ml-auto flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({
  dataSize,
  env,
  onDataSize,
  onEnv,
}: {
  dataSize: string;
  env: string;
  onDataSize: (v: string) => void;
  onEnv: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">데이터 환경을 알려주세요</h3>
      <p className="text-sm text-gray-500 mb-6">보유 데이터 규모와 운영 환경을 선택하세요.</p>

      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          보유 데이터 규모
        </label>
        <div className="grid grid-cols-3 gap-3">
          {dataSizes.map((d) => (
            <button
              key={d.id}
              onClick={() => onDataSize(d.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                dataSize === d.id
                  ? "border-blue-700 bg-blue-50"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div className="font-semibold text-sm text-gray-900">{d.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          운영 환경
        </label>
        <div className="space-y-3">
          {environments.map((e) => (
            <button
              key={e.id}
              onClick={() => onEnv(e.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                env === e.id
                  ? "border-blue-700 bg-blue-50"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  env === e.id ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {e.icon}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">{e.label}</div>
                <div className="text-xs text-gray-500">{e.desc}</div>
              </div>
              {env === e.id && (
                <CheckCircle2 className="w-5 h-5 text-blue-700 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({
  form,
  onChange,
}: {
  form: { company: string; name: string; phone: string; email: string; date: string };
  onChange: (key: string, val: string) => void;
}) {
  const fields = [
    { key: "company", label: "회사명", icon: <Building2 className="w-4 h-4" />, placeholder: "주식회사 Vision Makers", type: "text" },
    { key: "name", label: "담당자명", icon: <User className="w-4 h-4" />, placeholder: "홍길동", type: "text" },
    { key: "phone", label: "연락처", icon: <Phone className="w-4 h-4" />, placeholder: "010-0000-0000", type: "tel" },
    { key: "email", label: "이메일", icon: <Mail className="w-4 h-4" />, placeholder: "contact@company.com", type: "email" },
    { key: "date", label: "희망 미팅 날짜", icon: <CalendarDays className="w-4 h-4" />, placeholder: "", type: "date" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">기업 정보를 입력해주세요</h3>
      <p className="text-sm text-gray-500 mb-6">입력하신 정보로 전문 컨설턴트가 연락드립니다.</p>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              {f.label}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {f.icon}
              </div>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-blue-700" />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">상담 신청 완료!</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        전문 컨설턴트가 <span className="font-semibold text-blue-700">24시간 이내</span>에
        연락드리겠습니다. Vision AI와 함께 데이터 혁신을 시작하세요.
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [purpose, setPurpose] = useState("");
  const [dataSize, setDataSize] = useState("");
  const [env, setEnv] = useState("");
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    date: "",
  });

  const steps = ["도입 목적", "데이터 환경", "기업 정보"];

  const canNext = () => {
    if (step === 0) return !!purpose;
    if (step === 1) return !!dataSize && !!env;
    if (step === 2) return !!(form.company && form.name && form.phone && form.email);
    return false;
  };

  const goNext = () => {
    if (step < 2) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setSubmitted(true);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  return (
    <section id="consultation" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-5">
              무료 도입 진단
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              지금 바로 <span className="text-blue-700">무료 상담</span>을
              <br />
              신청하세요
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              3단계 간단 입력으로 귀사에 최적화된
              <br />
              RAG 솔루션 도입 방안을 제안드립니다.
            </p>

            <div className="space-y-4">
              {[
                { title: "24시간 이내 연락", desc: "전문 컨설턴트가 신속하게 연락드립니다." },
                { title: "맞춤형 솔루션 제안", desc: "귀사 환경에 최적화된 아키텍처 설계" },
                { title: "무료 파일럿 제공", desc: "실제 데이터로 2주 무료 POC 진행" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8"
          >
            {!submitted ? (
              <>
                <StepIndicator current={step} total={steps.length} />

                <div className="overflow-hidden" style={{ minHeight: 380 }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {step === 0 && (
                        <Step1 value={purpose} onChange={setPurpose} />
                      )}
                      {step === 1 && (
                        <Step2
                          dataSize={dataSize}
                          env={env}
                          onDataSize={setDataSize}
                          onEnv={setEnv}
                        />
                      )}
                      {step === 2 && (
                        <Step3
                          form={form}
                          onChange={(k, v) =>
                            setForm((prev) => ({ ...prev, [k]: v }))
                          }
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={goBack}
                    className={`flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors ${
                      step === 0 ? "invisible" : ""
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    이전
                  </button>

                  <button
                    onClick={goNext}
                    disabled={!canNext()}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      canNext()
                        ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/20 hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {step < 2 ? "다음 단계" : "상담 신청하기"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <SuccessScreen />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
