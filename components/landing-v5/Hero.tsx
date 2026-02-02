"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { ArrowRight, Play, Shield, Database, Cpu } from "lucide-react";

// Particle Network Background
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position with floating effect
        particle.x += particle.vx;
        particle.y += particle.vy + Math.sin(Date.now() * 0.001 + i) * 0.1;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(30, 58, 138, 0.6)";
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(30, 58, 138, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
};

// Infrastructure Graphic
const InfrastructureGraphic = () => {
  const nodes = [
    { icon: Database, label: "Data", x: 20, y: 30 },
    { icon: Shield, label: "Security", x: 50, y: 15 },
    { icon: Cpu, label: "AI Engine", x: 80, y: 30 },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Central RAG Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#1E3A8A]/30" />
          <motion.div
            className="absolute inset-2 rounded-full border border-[#1E3A8A]/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-[#10B981]/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 30px rgba(30, 58, 138, 0.4)",
              "0 0 60px rgba(30, 58, 138, 0.6)",
              "0 0 30px rgba(30, 58, 138, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white font-mono text-sm md:text-base font-bold">RAG</span>
        </motion.div>
      </motion.div>

      {/* Floating Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 1 + index * 0.2 },
            y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[#0A192F]/80 border border-[#1E3A8A]/50 flex items-center justify-center backdrop-blur-sm">
              <node.icon className="w-6 h-6 md:w-8 md:h-8 text-[#10B981]" />
            </div>
            <span className="text-xs md:text-sm text-gray-400 font-mono">{node.label}</span>
          </div>
        </motion.div>
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, index) => (
          <motion.line
            key={`line-${index}`}
            x1={`${node.x}%`}
            y1={`${node.y + 10}%`}
            x2="50%"
            y2="50%"
            stroke="#1E3A8A"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
          />
        ))}
      </svg>

      {/* Data Flow Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-[#10B981]"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

// Button Component (shadcn/ui style)
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

const Button = ({ children, variant = "primary", onClick, className = "" }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-lg transition-all duration-200 min-h-[56px]";

  const variants = {
    primary: "bg-[#FF6200] text-white hover:bg-[#FF6200]/90 shadow-lg shadow-[#FF6200]/25",
    secondary: "bg-transparent text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/5",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

// Main Hero Component
const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0A192F 0%, #020617 100%)",
        }}
      />

      {/* Particle Network */}
      <ParticleNetwork />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text Content */}
            <motion.div
              className="order-2 lg:order-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 text-[#10B981] text-sm font-mono mb-6">
                  <Shield className="w-4 h-4" />
                  Enterprise Knowledge, Secured.
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                대기업은 이미 가졌습니다.
                <br />
                <span className="text-[#10B981]">중소기업 차례입니다.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-400 mb-10 max-w-xl"
              >
                Enterprise RAG &amp; LLM 인프라
                <br />
                <span className="text-white/80">SMB를 위해 재설계</span>
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button variant="primary">
                  2주 POC 신청
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary">
                  <Play className="w-5 h-5" />
                  데모 보기
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>On-Premise 배포</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>데이터 유출 제로</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>2주 내 구축</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Infrastructure Graphic */}
            <motion.div
              className="order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <InfrastructureGraphic />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
