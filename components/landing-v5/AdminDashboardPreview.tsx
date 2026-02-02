"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield,
  Database,
  Lock,
  CheckCircle,
  Clock,
  User,
  FileText,
  Search,
  AlertCircle,
  TrendingUp,
  Activity,
  Eye,
  ChevronRight,
  Cpu,
  Server,
  HardDrive,
} from "lucide-react";

// Mock Data
const queryLogs = [
  {
    id: 1,
    query: "2024년 매출 실적 보고서 요약해줘",
    user: "김대리",
    department: "영업팀",
    timestamp: "09:42:15",
    status: "completed",
    confidence: 0.94,
    sources: 3,
  },
  {
    id: 2,
    query: "신규 입사자 온보딩 절차 알려줘",
    user: "박과장",
    department: "인사팀",
    timestamp: "09:41:32",
    status: "completed",
    confidence: 0.98,
    sources: 2,
  },
  {
    id: 3,
    query: "고객사 A 계약 조건 확인",
    user: "이부장",
    department: "법무팀",
    timestamp: "09:40:58",
    status: "processing",
    confidence: 0,
    sources: 0,
  },
  {
    id: 4,
    query: "서버 장애 대응 매뉴얼",
    user: "최사원",
    department: "IT팀",
    timestamp: "09:39:45",
    status: "completed",
    confidence: 0.91,
    sources: 4,
  },
  {
    id: 5,
    query: "분기별 KPI 달성률 분석",
    user: "정차장",
    department: "기획팀",
    timestamp: "09:38:22",
    status: "completed",
    confidence: 0.96,
    sources: 5,
  },
];

const sourceDocuments = [
  {
    id: 1,
    title: "2024_Q3_매출실적_보고서.pdf",
    type: "PDF",
    relevance: 0.94,
    highlight: "3분기 총 매출액은 전년 대비 23% 증가한 152억원을 기록했습니다.",
    page: 12,
  },
  {
    id: 2,
    title: "영업팀_주간리포트_W38.docx",
    type: "DOCX",
    relevance: 0.87,
    highlight: "신규 고객 유치 건수 45건, 계약 전환율 67% 달성",
    page: 3,
  },
  {
    id: 3,
    title: "매출_대시보드_데이터.xlsx",
    type: "XLSX",
    relevance: 0.82,
    highlight: "월별 매출 추이 및 제품군별 판매 현황 데이터",
    page: 1,
  },
];

// Security Badge Component
const SecurityBadge = ({
  icon: Icon,
  label,
  status,
}: {
  icon: React.ElementType;
  label: string;
  status: "active" | "secure";
}) => {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-emerald-400 text-xs font-medium">{label}</span>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    </motion.div>
  );
};

// Confidence Meter Component
const ConfidenceMeter = ({ value, label }: { value: number; label: string }) => {
  const percentage = Math.round(value * 100);
  const getColor = () => {
    if (percentage >= 90) return { bar: "#10B981", text: "text-emerald-400" };
    if (percentage >= 70) return { bar: "#F59E0B", text: "text-amber-400" };
    return { bar: "#EF4444", text: "text-red-400" };
  };
  const colors = getColor();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={`font-mono font-bold ${colors.text}`}>{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Query Log Row Component
const QueryLogRow = ({
  log,
  index,
  isSelected,
  onClick,
}: {
  log: (typeof queryLogs)[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.tr
      className={`border-b border-gray-800/50 cursor-pointer transition-colors ${
        isSelected ? "bg-[#1E3A8A]/20" : "hover:bg-white/[0.02]"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {log.status === "completed" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-4 h-4 text-amber-400" />
            </motion.div>
          )}
          <span className="text-gray-300 text-sm truncate max-w-[200px]">
            {log.query}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1E3A8A]/30 flex items-center justify-center">
            <User className="w-3 h-3 text-[#1E3A8A]" />
          </div>
          <div>
            <p className="text-gray-300 text-sm">{log.user}</p>
            <p className="text-gray-600 text-xs">{log.department}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-gray-500 text-xs font-mono">{log.timestamp}</span>
      </td>
      <td className="py-3 px-4">
        {log.status === "completed" ? (
          <span
            className={`text-sm font-mono ${
              log.confidence >= 0.9
                ? "text-emerald-400"
                : log.confidence >= 0.7
                  ? "text-amber-400"
                  : "text-red-400"
            }`}
          >
            {Math.round(log.confidence * 100)}%
          </span>
        ) : (
          <span className="text-gray-600 text-sm">-</span>
        )}
      </td>
      <td className="py-3 px-4">
        <ChevronRight
          className={`w-4 h-4 transition-colors ${
            isSelected ? "text-[#1E3A8A]" : "text-gray-600"
          }`}
        />
      </td>
    </motion.tr>
  );
};

// Source Document Card Component
const SourceDocumentCard = ({
  doc,
  index,
}: {
  doc: (typeof sourceDocuments)[0];
  index: number;
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      case "DOCX":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "XLSX":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  return (
    <motion.div
      className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-[#1E3A8A]/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm font-medium truncate max-w-[180px]">
            {doc.title}
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-mono border ${getTypeColor(doc.type)}`}
        >
          {doc.type}
        </span>
      </div>

      {/* Highlighted Text */}
      <div className="p-3 rounded-lg bg-amber-500/5 border-l-2 border-amber-500/50 mb-3">
        <p className="text-gray-300 text-sm leading-relaxed">
          &ldquo;{doc.highlight}&rdquo;
        </p>
        <p className="text-gray-600 text-xs mt-2">Page {doc.page}</p>
      </div>

      {/* Relevance Score */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs">Relevance Score</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#10B981] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${doc.relevance * 100}%` }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
            />
          </div>
          <span className="text-emerald-400 text-xs font-mono">
            {Math.round(doc.relevance * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// RAG Metrics Component
const RAGMetrics = () => {
  const metrics = [
    { label: "Faithfulness", value: 0.92, icon: CheckCircle },
    { label: "Precision", value: 0.88, icon: Search },
    { label: "Relevance", value: 0.95, icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-gray-400 text-sm font-medium flex items-center gap-2">
        <Activity className="w-4 h-4" />
        RAG Evaluation (RAGAS)
      </h4>
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <ConfidenceMeter key={metric.label} value={metric.value} label={metric.label} />
        ))}
      </div>
    </div>
  );
};

// System Status Component
const SystemStatus = () => {
  const [cpuLoad, setCpuLoad] = useState(34);
  const [memoryUsage, setMemoryUsage] = useState(62);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad((prev) => Math.max(20, Math.min(60, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage((prev) => Math.max(50, Math.min(80, prev + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-[#1E3A8A]" />
          <span className="text-gray-500 text-xs">CPU</span>
        </div>
        <p className="text-white font-mono text-lg">{Math.round(cpuLoad)}%</p>
      </div>
      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-500 text-xs">Memory</span>
        </div>
        <p className="text-white font-mono text-lg">{Math.round(memoryUsage)}%</p>
      </div>
      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-amber-400" />
          <span className="text-gray-500 text-xs">Queries</span>
        </div>
        <p className="text-white font-mono text-lg">1,247</p>
      </div>
    </div>
  );
};

// Main Dashboard Preview Component
const AdminDashboardPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedLog, setSelectedLog] = useState(0);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
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
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Eye className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#10B981] text-sm font-mono">
              Admin Dashboard Preview
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            실시간 운영 대시보드
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            모든 AI 응답을 투명하게 모니터링하고
            <br className="hidden md:block" />
            데이터 접근 이력을 실시간으로 감사합니다
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-gray-800"
          style={{
            background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-4">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-gray-400 text-sm font-mono">
                Vision AI Admin Console
              </span>
            </div>

            {/* Security Badges */}
            <div className="hidden md:flex items-center gap-3">
              <SecurityBadge icon={Lock} label="Encrypted" status="active" />
              <SecurityBadge icon={Database} label="Private DB" status="secure" />
              <SecurityBadge icon={Shield} label="RBAC Active" status="active" />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left Panel - Query Logs (3 cols) */}
            <div className="lg:col-span-3 border-r border-gray-800">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Live Query Logs
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs">Live</span>
                  </div>
                </div>
              </div>

              {/* Query Table */}
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#0D1B2A]">
                    <tr className="text-left border-b border-gray-800">
                      <th className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        Query
                      </th>
                      <th className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        Time
                      </th>
                      <th className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        Conf.
                      </th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryLogs.map((log, index) => (
                      <QueryLogRow
                        key={log.id}
                        log={log}
                        index={index}
                        isSelected={selectedLog === index}
                        onClick={() => setSelectedLog(index)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel - Source Preview & Metrics (2 cols) */}
            <div className="lg:col-span-2 p-6 space-y-6">
              {/* Source Documents */}
              <div>
                <h4 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Source Documents
                </h4>
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                  {sourceDocuments.map((doc, index) => (
                    <SourceDocumentCard key={doc.id} doc={doc} index={index} />
                  ))}
                </div>
              </div>

              {/* RAG Metrics */}
              <div className="pt-4 border-t border-gray-800/50">
                <RAGMetrics />
              </div>

              {/* System Status */}
              <div className="pt-4 border-t border-gray-800/50">
                <h4 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  System Status
                </h4>
                <SystemStatus />
              </div>
            </div>
          </div>

          {/* Dashboard Footer */}
          <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-xs">
                Last updated: <span className="text-gray-400">just now</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>Auto-refresh: 5s</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          * 실제 운영 환경의 대시보드 미리보기입니다. 데이터는 데모용입니다.
        </motion.p>
      </div>
    </section>
  );
};

export default AdminDashboardPreview;
