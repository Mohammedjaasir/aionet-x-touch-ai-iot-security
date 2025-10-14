"use client"

import { motion } from "framer-motion"
import { FileText, CheckCircle, AlertTriangle, Zap, Clock, Shield, Cpu, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Image from "next/image"

interface LogEntry {
  id: number
  type: "recovery" | "threat" | "scan" | "info"
  title: string
  description: string
  timestamp: string
  status: "completed" | "in-progress" | "pending"
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      type: "recovery",
      title: "Auto-Recovery Initiated",
      description: "Temperature sensor anomaly detected. Calibration sequence started.",
      timestamp: "2 min ago",
      status: "in-progress",
    },
    {
      id: 2,
      type: "threat",
      title: "Threat Neutralized",
      description: "Blocked unauthorized access attempt on Smart Door Lock. Security protocols enhanced.",
      timestamp: "5 min ago",
      status: "completed",
    },
    {
      id: 3,
      type: "scan",
      title: "AI Security Scan Complete",
      description: "Full system scan completed. 3 minor issues resolved automatically.",
      timestamp: "12 min ago",
      status: "completed",
    },
    {
      id: 4,
      type: "recovery",
      title: "Self-Healing Protocol Executed",
      description: "Camera feed restored. Network optimization completed successfully.",
      timestamp: "18 min ago",
      status: "completed",
    },
    {
      id: 5,
      type: "info",
      title: "System Update",
      description: "AI models updated to latest version. Performance improved by 15%.",
      timestamp: "25 min ago",
      status: "completed",
    },
    {
      id: 6,
      type: "threat",
      title: "Suspicious Activity Detected",
      description: "Multiple failed authentication attempts. Account temporarily locked.",
      timestamp: "32 min ago",
      status: "completed",
    },
  ])

  const [recoveryStats, setRecoveryStats] = useState({
    totalRecoveries: 23,
    successRate: 98.5,
    avgResponseTime: "1.2s",
    activeThreats: 1,
  })

  useEffect(() => {
    // Simulate new log entries
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: logs.length + 1,
        type: ["recovery", "threat", "scan", "info"][Math.floor(Math.random() * 4)] as any,
        title: "New System Event",
        description: "Real-time system activity detected and processed.",
        timestamp: "Just now",
        status: "in-progress",
      }
      setLogs(prev => [newLog, ...prev.slice(0, 9)])
    }, 15000)

    return () => clearInterval(interval)
  }, [logs.length])

  const getLogIcon = (type: string) => {
    switch (type) {
      case "recovery":
        return Zap
      case "threat":
        return AlertTriangle
      case "scan":
        return Cpu
      default:
        return Activity
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case "recovery":
        return "var(--safe-green)"
      case "threat":
        return "var(--threat-red)"
      case "scan":
        return "var(--neon-blue)"
      default:
        return "var(--cyber-purple)"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "Completed", color: "var(--safe-green)" }
      case "in-progress":
        return { text: "In Progress", color: "#ffa500" }
      default:
        return { text: "Pending", color: "var(--neon-blue)" }
    }
  }

  return (
    <div className="min-h-screen cyber-gradient grid-pattern p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[var(--safe-green)] mb-2" style={{ textShadow: "0 0 20px rgba(0, 255, 136, 0.5)" }}>
            System Logs & Recovery
          </h1>
          <p className="text-gray-400">Real-time system healing and threat response monitoring</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: Zap,
              label: "Auto-Recoveries",
              value: recoveryStats.totalRecoveries,
              color: "var(--safe-green)",
            },
            {
              icon: CheckCircle,
              label: "Success Rate",
              value: `${recoveryStats.successRate}%`,
              color: "var(--neon-blue)",
            },
            {
              icon: Clock,
              label: "Avg Response",
              value: recoveryStats.avgResponseTime,
              color: "var(--neon-cyan)",
            },
            {
              icon: AlertTriangle,
              label: "Active Threats",
              value: recoveryStats.activeThreats,
              color: "var(--threat-red)",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      boxShadow: `0 0 20px ${stat.color}30`,
                    }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-[var(--neon-blue)]" />
                  <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
                  <Badge variant="outline" className="bg-[var(--safe-green)]/20 text-[var(--safe-green)] border-0 ml-auto">
                    Live
                  </Badge>
                </div>

                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                  {logs.map((log, index) => {
                    const LogIcon = getLogIcon(log.type)
                    const statusBadge = getStatusBadge(log.status)

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        {/* Timeline line */}
                        {index < logs.length - 1 && (
                          <div
                            className="absolute left-[19px] top-10 w-[2px] h-full"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          />
                        )}

                        <div className="flex gap-4">
                          <div
                            className="relative z-10 p-2 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: `${getLogColor(log.type)}20`,
                              boxShadow: `0 0 15px ${getLogColor(log.type)}40`,
                            }}
                          >
                            <LogIcon className="w-5 h-5" style={{ color: getLogColor(log.type) }} />
                          </div>

                          <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-white">{log.title}</h3>
                              <Badge
                                variant="outline"
                                className="border-0 text-xs"
                                style={{
                                  backgroundColor: `${statusBadge.color}20`,
                                  color: statusBadge.color,
                                }}
                              >
                                {statusBadge.text}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{log.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {log.timestamp}
                            </div>

                            {/* Progress indicator for in-progress items */}
                            {log.status === "in-progress" && (
                              <div className="mt-3">
                                <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-[var(--safe-green)] rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "70%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recovery Status & System Visual */}
          <div className="space-y-6">
            {/* Recovery Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[var(--safe-green)]" />
                  <h3 className="text-lg font-semibold text-white">Recovery Status</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[var(--safe-green)]"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm text-[var(--safe-green)] font-medium">Auto-Healing Active</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      System monitoring all devices for anomalies and auto-correcting issues in real-time.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Network Stability", value: 98 },
                      { name: "Device Health", value: 94 },
                      { name: "AI Response Time", value: 99 },
                    ].map((metric, index) => (
                      <div key={metric.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{metric.name}</span>
                          <span className="text-[var(--safe-green)]">{metric.value}%</span>
                        </div>
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-[var(--safe-green)] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* System Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Security Center</h3>
                <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop"
                    alt="Security monitoring center"
                    fill
                    className="object-cover opacity-60"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Scanning grid */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Status indicator */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded p-3 border border-[var(--safe-green)]/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[var(--safe-green)]" />
                        <span className="text-sm text-white">All Systems Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}