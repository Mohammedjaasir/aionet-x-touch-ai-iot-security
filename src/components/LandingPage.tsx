"use client"

import { motion } from "framer-motion"
import { Shield, Cpu, Eye, Activity, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onStartSimulation: () => void
}

export default function LandingPage({ onStartSimulation }: LandingPageProps) {
  return (
    <div className="min-h-screen cyber-gradient grid-pattern relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-[var(--neon-blue)] rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--cyber-purple)] rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--neon-blue)] blur-2xl opacity-40 rounded-full" />
            <Shield className="w-24 h-24 text-[var(--neon-blue)] relative z-10" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-center mb-4 text-glow-blue"
          style={{ color: "var(--neon-blue)" }}
        >
          AIONet-X Touch
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl md:text-3xl text-center mb-4 text-[var(--neon-cyan)] font-light"
        >
          The Future of Smart Security
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-xl text-center text-gray-400 max-w-3xl mb-12"
        >
          Emotion-Aware, GenAI-Powered Self-Healing IoT Security Platform
          <br />
          <span className="text-sm text-gray-500 mt-2 block">
            Real-time threat detection • Emotional intelligence • Automatic recovery
          </span>
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 w-full max-w-5xl"
        >
          {[
            { icon: Cpu, label: "AI Detection", color: "var(--neon-blue)" },
            { icon: Eye, label: "Emotion Sensing", color: "var(--neon-cyan)" },
            { icon: Zap, label: "Self-Healing", color: "var(--safe-green)" },
            { icon: Activity, label: "Live Monitoring", color: "var(--cyber-purple)" },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
              whileHover={{ y: -5, boxShadow: `0 10px 30px ${feature.color}40` }}
            >
              <feature.icon
                className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform"
                style={{ color: feature.color }}
              />
              <p className="text-sm text-gray-300">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <Button
            onClick={onStartSimulation}
            size="lg"
            className="group relative overflow-hidden bg-[var(--neon-blue)] hover:bg-[var(--neon-cyan)] text-black font-semibold px-8 py-6 text-lg rounded-full glow-blue hover:glow-cyan transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Simulation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Button>
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>Powered by Advanced AI • Neural Networks • Machine Learning</p>
        </motion.div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[var(--neon-blue)]/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[var(--neon-blue)]/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[var(--neon-blue)]/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[var(--neon-blue)]/30" />
    </div>
  )
}