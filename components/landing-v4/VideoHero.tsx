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

// Space Stars Background - 우주 별 애니메이션
const SpaceStars = () => {
  const [isClient, setIsClient] = useState(false);

  // 별 데이터 - 시드 기반으로 일관된 값 생성
  const [stars] = useState(() => {
    return [...Array(150)].map((_, i) => ({
      id: i,
      // 시드 기반 pseudo-random (i를 사용하여 일관된 값)
      x: ((i * 17 + 23) % 100),
      y: ((i * 31 + 47) % 100),
      size: ((i * 13) % 20) / 10 + 0.5,
      opacity: ((i * 7) % 70) / 100 + 0.3,
      duration: ((i * 11) % 30) / 10 + 2,
      delay: ((i * 19) % 50) / 10,
    }));
  });

  // 유성 데이터 - 시드 기반
  const [shootingStars] = useState(() => {
    return [...Array(5)].map((_, i) => ({
      id: i,
      startX: ((i * 37 + 13) % 100),
      startY: ((i * 23 + 7) % 30),
      delay: i * 4 + ((i * 17) % 30) / 10,
    }));
  });

  // 큰 별 데이터 - 시드 기반
  const [bigStars] = useState(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: ((i * 41 + 29) % 100),
      y: ((i * 53 + 17) % 100),
      duration: ((i * 19) % 20) / 10 + 3,
      delay: ((i * 13) % 40) / 10,
    }));
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 정적 별 배경 (깊은 우주) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)`,
        }}
      />

      {/* 반짝이는 별들 */}
      {isClient && stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 큰 별들 (더 밝게 반짝임) */}
      {isClient && bigStars.map((star) => (
        <motion.div
          key={`big-star-${star.id}`}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          {/* 십자 모양 별빛 */}
          <div
            className="absolute w-[1px] h-4 bg-gradient-to-b from-transparent via-white to-transparent"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          />
          <div
            className="absolute h-[1px] w-4 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
        </motion.div>
      ))}

      {/* 유성 (Shooting Stars) */}
      {isClient && shootingStars.map((meteor) => (
        <motion.div
          key={`meteor-${meteor.id}`}
          className="absolute w-[100px] h-[1px]"
          style={{
            left: `${meteor.startX}%`,
            top: `${meteor.startY}%`,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(0,240,255,1) 100%)`,
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            transform: 'rotate(45deg)',
          }}
          animate={{
            x: [0, 300],
            y: [0, 300],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: meteor.delay,
            repeatDelay: 8,
            ease: "easeIn",
          }}
        />
      ))}

      {/* 느리게 움직이는 별 필드 (깊이감) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 200,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1.5px 1.5px at 160px 120px, white, transparent)
          `,
          backgroundSize: '200px 200px',
        }}
      />

      {/* 성운 효과 (Nebula) - 미세한 색상 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(0, 100, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(100, 0, 150, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 60%)
          `,
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
