"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

// Data Stream Component - flowing binary/hex data
const DataStream = ({ position, delay }: { position: string; delay: number }) => {
  const streamLength = 12;
  const [chars, setChars] = useState<string[]>(Array(streamLength).fill("0"));

  useEffect(() => {
    // 클라이언트에서만 랜덤 값 생성 (hydration 에러 방지)
    setChars(Array(streamLength).fill(0).map(() => Math.random() > 0.5 ? "1" : "0"));
  }, []);

  return (
    <motion.div
      className={`absolute ${position} flex flex-col gap-1 font-mono text-xs text-[#00F0FF]/60`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: [0, 0.8, 0], y: [-50, 150] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "linear" }}
    >
      {chars.map((char, i) => (
        <span key={i} style={{ opacity: 1 - i * 0.08 }}>
          {char}
        </span>
      ))}
    </motion.div>
  );
};

// Neural Network Connection Lines
const NeuralConnections = () => {
  const connections = [
    { x1: "30%", y1: "25%", x2: "50%", y2: "50%" },
    { x1: "70%", y1: "25%", x2: "50%", y2: "50%" },
    { x1: "25%", y1: "50%", x2: "50%", y2: "50%" },
    { x1: "75%", y1: "50%", x2: "50%", y2: "50%" },
    { x1: "30%", y1: "75%", x2: "50%", y2: "50%" },
    { x1: "70%", y1: "75%", x2: "50%", y2: "50%" },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {connections.map((conn, i) => (
        <motion.line
          key={i}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="#00F0FF"
          strokeWidth="1"
          strokeOpacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0], strokeOpacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
      {/* Neural Nodes */}
      {connections.map((conn, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={conn.x1}
          cy={conn.y1}
          r="4"
          fill="#00F0FF"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
};

// Holographic 3D Cube Animation - AI Data Visualization
const HologramCube = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Neural Network Connections */}
      <NeuralConnections />

      {/* Data Streams - Binary flowing into cube */}
      <DataStream position="left-[20%] top-[10%]" delay={0} />
      <DataStream position="left-[35%] top-[5%]" delay={0.5} />
      <DataStream position="right-[20%] top-[10%]" delay={1} />
      <DataStream position="right-[35%] top-[5%]" delay={1.5} />
      <DataStream position="left-[15%] top-[30%]" delay={2} />
      <DataStream position="right-[15%] top-[30%]" delay={2.5} />

      {/* Glow Effect Behind Cube */}
      <motion.div
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px]"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.25) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3D Cube Container - The Data Vault */}
      <motion.div
        className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px]"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 10, 0, -10, 0],
        }}
        transition={{
          rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Cube Faces with Circuit Pattern */}
        {/* Front */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/70"
          style={{
            transform: "translateZ(100px)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.08) 0%, transparent 50%)",
            boxShadow: "0 0 40px rgba(0,240,255,0.4), inset 0 0 40px rgba(0,240,255,0.15)",
          }}
        >
          {/* Circuit Pattern */}
          <div className="absolute inset-4 border border-[#00F0FF]/20" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00F0FF]/20" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#00F0FF]/20" />
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/40"
          style={{
            transform: "translateZ(-100px) rotateY(180deg)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.04) 0%, transparent 50%)",
            boxShadow: "0 0 25px rgba(0,240,255,0.2), inset 0 0 25px rgba(0,240,255,0.08)",
          }}
        />
        {/* Left */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/50"
          style={{
            transform: "rotateY(-90deg) translateZ(100px)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.05) 0%, transparent 50%)",
            boxShadow: "0 0 30px rgba(0,240,255,0.3), inset 0 0 30px rgba(0,240,255,0.1)",
          }}
        />
        {/* Right */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/50"
          style={{
            transform: "rotateY(90deg) translateZ(100px)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.05) 0%, transparent 50%)",
            boxShadow: "0 0 30px rgba(0,240,255,0.3), inset 0 0 30px rgba(0,240,255,0.1)",
          }}
        />
        {/* Top */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/60"
          style={{
            transform: "rotateX(90deg) translateZ(100px)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.08) 0%, transparent 50%)",
            boxShadow: "0 0 40px rgba(0,240,255,0.4), inset 0 0 40px rgba(0,240,255,0.15)",
          }}
        />
        {/* Bottom */}
        <div
          className="absolute inset-0 border-2 border-[#00F0FF]/40"
          style={{
            transform: "rotateX(-90deg) translateZ(100px)",
            background: "linear-gradient(135deg, rgba(0,240,255,0.04) 0%, transparent 50%)",
            boxShadow: "0 0 25px rgba(0,240,255,0.2), inset 0 0 25px rgba(0,240,255,0.08)",
          }}
        />

        {/* Inner AI Core - Pulsing Brain */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[60px] h-[60px] md:w-[80px] md:h-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,240,255,0.6) 0%, rgba(0,240,255,0.2) 40%, transparent 70%)",
            filter: "blur(10px)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Data Processing Indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[40px] h-[40px] md:w-[50px] md:h-[50px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#00F0FF]/80 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[#00F0FF] rounded-full" />
        </motion.div>
      </motion.div>

      {/* Data Particles flowing toward cube */}
      {[...Array(25)].map((_, i) => {
        const angle = (i / 25) * Math.PI * 2;
        const radius = 250 + Math.random() * 100;
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;

        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#00F0FF] rounded-full"
            style={{
              left: "50%",
              top: "50%",
              boxShadow: "0 0 8px #00F0FF, 0 0 15px #00F0FF",
            }}
            animate={{
              x: [startX, 0],
              y: [startY, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeIn",
            }}
          />
        );
      })}

      {/* Scanning Lines */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, #00F0FF, transparent)",
          boxShadow: "0 0 20px #00F0FF",
        }}
        animate={{
          y: [-180, 180],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* HUD Frame - Corner Brackets with Labels */}
      <div className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
        {/* Top Left */}
        <div className="absolute top-0 left-0">
          <motion.div
            className="w-16 h-16 border-l-2 border-t-2 border-[#00F0FF]/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.span
            className="absolute top-4 left-5 text-[10px] font-mono text-[#00F0FF]/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            DATA.IN
          </motion.span>
        </div>
        {/* Top Right */}
        <div className="absolute top-0 right-0">
          <motion.div
            className="w-16 h-16 border-r-2 border-t-2 border-[#00F0FF]/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.span
            className="absolute top-4 right-5 text-[10px] font-mono text-[#00F0FF]/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            SECURE
          </motion.span>
        </div>
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0">
          <motion.div
            className="w-16 h-16 border-l-2 border-b-2 border-[#00F0FF]/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.span
            className="absolute bottom-4 left-5 text-[10px] font-mono text-[#00F0FF]/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            LOCAL
          </motion.span>
        </div>
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0">
          <motion.div
            className="w-16 h-16 border-r-2 border-b-2 border-[#00F0FF]/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          />
          <motion.span
            className="absolute bottom-4 right-5 text-[10px] font-mono text-[#00F0FF]/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
          >
            AI.CORE
          </motion.span>
        </div>
      </div>

      {/* Status Text */}
      <motion.div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 font-mono text-xs text-[#00F0FF]/50 tracking-widest"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        PROCESSING DATA...
      </motion.div>
    </div>
  );
};

// Space Stars Background - 은하수 스타일 우주 배경
const SpaceStars = () => {
  const [isClient, setIsClient] = useState(false);

  // 작은 별 데이터 (많은 수) - 시드 기반
  const [tinyStars] = useState(() => {
    return [...Array(300)].map((_, i) => ({
      id: i,
      x: ((i * 17 + 23) % 100),
      y: ((i * 31 + 47) % 100),
      size: ((i * 7) % 10) / 10 + 0.3,
      opacity: ((i * 11) % 50) / 100 + 0.2,
      duration: ((i * 13) % 40) / 10 + 3,
      delay: ((i * 19) % 80) / 10,
    }));
  });

  // 중간 크기 별 데이터
  const [mediumStars] = useState(() => {
    return [...Array(80)].map((_, i) => ({
      id: i,
      x: ((i * 23 + 17) % 100),
      y: ((i * 41 + 31) % 100),
      size: ((i * 11) % 15) / 10 + 0.8,
      opacity: ((i * 7) % 40) / 100 + 0.4,
      duration: ((i * 17) % 30) / 10 + 2,
      delay: ((i * 13) % 60) / 10,
    }));
  });

  // 밝은 별 데이터 (적은 수, 더 크고 밝음)
  const [brightStars] = useState(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      x: ((i * 47 + 13) % 90) + 5,
      y: ((i * 59 + 23) % 90) + 5,
      size: ((i * 13) % 20) / 10 + 2,
      duration: ((i * 19) % 25) / 10 + 4,
      delay: ((i * 11) % 50) / 10,
    }));
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 깊은 우주 배경 - 중앙 어두움 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, #000000 0%, #020408 40%, #0a1628 100%)
          `,
        }}
      />

      {/* 외곽 은하수 성운 효과 - 상단 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(ellipse 120% 50% at 50% -10%, rgba(59, 130, 180, 0.4) 0%, rgba(30, 80, 120, 0.2) 30%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 30% 0%, rgba(100, 180, 220, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 30% at 70% 5%, rgba(80, 160, 200, 0.2) 0%, transparent 40%)
          `,
        }}
      />

      {/* 외곽 은하수 성운 효과 - 하단 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          background: `
            radial-gradient(ellipse 120% 50% at 50% 110%, rgba(59, 130, 180, 0.35) 0%, rgba(30, 80, 120, 0.15) 30%, transparent 60%),
            radial-gradient(ellipse 70% 35% at 20% 100%, rgba(80, 150, 190, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 50% 25% at 80% 95%, rgba(70, 140, 180, 0.2) 0%, transparent 40%)
          `,
        }}
      />

      {/* 좌우 성운 효과 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          background: `
            radial-gradient(ellipse 40% 80% at -5% 50%, rgba(50, 120, 160, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 40% 80% at 105% 50%, rgba(50, 120, 160, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 30% 50% at 10% 30%, rgba(70, 150, 190, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 30% 50% at 90% 70%, rgba(70, 150, 190, 0.15) 0%, transparent 40%)
          `,
        }}
      />

      {/* 코너 하이라이트 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 0% 0%, rgba(100, 180, 220, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(80, 160, 200, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 100% 0%, rgba(90, 170, 210, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse 40% 30% at 0% 100%, rgba(90, 170, 210, 0.1) 0%, transparent 40%)
          `,
        }}
      />

      {/* 미세한 성운 구름 텍스처 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 25% 15%, rgba(60, 140, 180, 0.15) 0%, transparent 25%),
            radial-gradient(ellipse at 75% 85%, rgba(50, 130, 170, 0.12) 0%, transparent 25%),
            radial-gradient(ellipse at 15% 75%, rgba(70, 150, 190, 0.1) 0%, transparent 20%),
            radial-gradient(ellipse at 85% 25%, rgba(60, 140, 180, 0.1) 0%, transparent 20%)
          `,
        }}
      />

      {/* 작은 별들 (정적 배경 패턴) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(0.5px 0.5px at 10px 20px, rgba(255,255,255,0.6), transparent),
            radial-gradient(0.5px 0.5px at 30px 50px, rgba(255,255,255,0.5), transparent),
            radial-gradient(0.5px 0.5px at 60px 30px, rgba(255,255,255,0.4), transparent),
            radial-gradient(0.5px 0.5px at 80px 70px, rgba(255,255,255,0.6), transparent),
            radial-gradient(0.5px 0.5px at 45px 90px, rgba(255,255,255,0.5), transparent),
            radial-gradient(0.5px 0.5px at 95px 15px, rgba(255,255,255,0.4), transparent),
            radial-gradient(0.8px 0.8px at 25px 75px, rgba(255,255,255,0.7), transparent),
            radial-gradient(0.8px 0.8px at 70px 45px, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* 추가 별 레이어 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(0.4px 0.4px at 15px 35px, rgba(255,255,255,0.5), transparent),
            radial-gradient(0.4px 0.4px at 55px 15px, rgba(255,255,255,0.4), transparent),
            radial-gradient(0.4px 0.4px at 85px 55px, rgba(255,255,255,0.5), transparent),
            radial-gradient(0.6px 0.6px at 35px 85px, rgba(255,255,255,0.6), transparent),
            radial-gradient(0.4px 0.4px at 75px 25px, rgba(255,255,255,0.4), transparent),
            radial-gradient(0.5px 0.5px at 5px 65px, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* 반짝이는 작은 별들 */}
      {isClient && tinyStars.map((star) => (
        <motion.div
          key={`tiny-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 중간 크기 별들 */}
      {isClient && mediumStars.map((star) => (
        <motion.div
          key={`medium-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.5)`,
          }}
          animate={{
            opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 밝은 별들 (글로우 효과) */}
      {isClient && brightStars.map((star) => (
        <motion.div
          key={`bright-${star.id}`}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          {/* 별 코어 */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `
                0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8),
                0 0 ${star.size * 4}px rgba(200, 220, 255, 0.4)
              `,
            }}
          />
          {/* 별빛 광선 */}
          <div
            className="absolute bg-gradient-to-b from-transparent via-white/60 to-transparent"
            style={{
              width: 1,
              height: star.size * 4,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="absolute bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              width: star.size * 4,
              height: 1,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      ))}

      {/* 중앙 비네트 (어두운 중심) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.5) 100%)`,
        }}
      />
    </div>
  );
};

// Animated Background (Fallback when no video)
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 bg-transparent overflow-hidden">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 70%)",
        }}
      />

      {/* Hologram Cube */}
      <HologramCube />
    </div>
  );
};

const VideoHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -150]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <section
      ref={ref}
      className="relative h-[150vh] w-full bg-black overflow-hidden"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Space Stars Background - 전체 배너 뒤 배경 */}
        <div className="absolute inset-0 z-0">
          <SpaceStars />
        </div>

        {/* Video/Animated Background */}
        <motion.div className="absolute inset-0 z-[1]" style={{ opacity: bgOpacity }}>
          {/* Video (if exists) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            poster="/images/hero-poster.jpg"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Animated Fallback */}
          <AnimatedBackground />

          {/* Overlay - 더 투명하게 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 h-full flex flex-col items-center justify-center px-6"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Main Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[120px] font-black text-white text-center leading-[0.9] tracking-tighter mb-8"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            우리 서버 안에
            <br />
            <span className="text-[#00F0FF]">AI를 심다</span>
          </motion.h1>

          {/* Sub Copy */}
          <motion.p
            className="text-lg md:text-2xl text-white/70 text-center max-w-xl font-light mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            데이터 유출 없는 완벽한 폐쇄형 AI
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Link href="/consultation/start">
              <motion.button
                className="group relative overflow-hidden bg-[#00F0FF] text-black font-bold px-10 py-5 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">도입 상담</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: contentOpacity }}
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-8 h-8 text-[#00F0FF]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoHero;
