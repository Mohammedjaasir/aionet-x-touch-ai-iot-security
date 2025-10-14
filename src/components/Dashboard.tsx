"use client"

import { motion } from "framer-motion"
import { Shield, Camera, Thermometer, Lock, AlertTriangle, CheckCircle, Activity, Cpu, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "threat"
  health: number
  icon: any
  lastActivity: string
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Smart Door Lock", type: "Security", status: "online", health: 98, icon: Lock, lastActivity: "2 min ago" },
    { id: "2", name: "Security Camera", type: "Surveillance", status: "online", health: 95, icon: Camera, lastActivity: "1 min ago" },
    { id: "3", name: "Temperature Sensor", type: "Environment", status: "threat", health: 45, icon: Thermometer, lastActivity: "Just now" },
  ])

  const [alerts, setAlerts] = useState([
    { id: 1, type: "critical", message: "Unusual temperature spike detected", time: "2 min ago", resolved: false },
    { id: 2, type: "warning", message: "Multiple failed authentication attempts on Door Lock", time: "5 min ago", resolved: false },
    { id: 3, type: "info", message: "System auto-recovery initiated", time: "8 min ago", resolved: true },
  ])

  const [systemHealth, setSystemHealth] = useState(87)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(75, Math.min(100, prev + change))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "var(--safe-green)"
      case "threat": return "var(--threat-red)"
      case "offline": return "var(--muted-foreground)"
      default: return "var(--neon-blue)"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "var(--threat-red)"
      case "warning": return "#ffa500"
      case "info": return "var(--neon-blue)"
      default: return "var(--neon-blue)"
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
          <h1 className="text-4xl font-bold text-[var(--neon-blue)] text-glow-blue mb-2">
            Security Dashboard
          </h1>
          <p className="text-gray-400">Real-time monitoring and threat detection</p>
        </motion.div>

        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6 glow-blue">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-[var(--neon-blue)]" />
                <div>
                  <h2 className="text-xl font-semibold text-white">System Health</h2>
                  <p className="text-sm text-gray-400">All systems operational</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[var(--safe-green)]">{systemHealth}%</div>
                <p className="text-xs text-gray-400">Optimal</p>
              </div>
            </div>
            <Progress value={systemHealth} className="h-2" />
          </Card>
        </motion.div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6 hover:bg-white/10 transition-all group cursor-pointer relative overflow-hidden">
                {/* Scanning line effect for threat devices */}
                {device.status === "threat" && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--threat-red)] to-transparent"
                      style={{ top: 0 }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: `${getStatusColor(device.status)}20`,
                        boxShadow: `0 0 20px ${getStatusColor(device.status)}30`,
                      }}
                    >
                      <device.icon className="w-6 h-6" style={{ color: getStatusColor(device.status) }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      <p className="text-xs text-gray-400">{device.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-0"
                    style={{
                      backgroundColor: `${getStatusColor(device.status)}20`,
                      color: getStatusColor(device.status),
                    }}
                  >
                    {device.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Health</span>
                    <span
                      className="font-semibold"
                      style={{ color: device.health > 70 ? "var(--safe-green)" : "var(--threat-red)" }}
                    >
                      {device.health}%
                    </span>
                  </div>
                  <Progress value={device.health} className="h-1" />
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                    <Activity className="w-3 h-3" />
                    {device.lastActivity}
                  </div>
                </div>

                {device.status === "threat" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-2 bg-[var(--threat-red)]/20 border border-[var(--threat-red)]/30 rounded flex items-center gap-2 text-xs"
                  >
                    <AlertTriangle className="w-4 h-4 text-[var(--threat-red)]" />
                    <span className="text-[var(--threat-red)]">Threat detected - Auto-healing initiated</span>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[var(--neon-cyan)]" />
            Security Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="p-2 rounded-full pulse-glow"
                        style={{ backgroundColor: `${getAlertColor(alert.type)}20` }}
                      >
                        {alert.resolved ? (
                          <CheckCircle className="w-4 h-4" style={{ color: getAlertColor(alert.type) }} />
                        ) : (
                          <AlertTriangle className="w-4 h-4" style={{ color: getAlertColor(alert.type) }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                    {alert.resolved && (
                      <Badge variant="outline" className="bg-[var(--safe-green)]/20 text-[var(--safe-green)] border-0">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          {[
            { icon: Cpu, label: "AI Scans", value: "1,247", color: "var(--neon-blue)" },
            { icon: Zap, label: "Auto-Recoveries", value: "23", color: "var(--safe-green)" },
            { icon: Shield, label: "Threats Blocked", value: "156", color: "var(--cyber-purple)" },
          ].map((stat, index) => (
            <Card key={stat.label} className="bg-white/5 backdrop-blur-md border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20`, boxShadow: `0 0 20px ${stat.color}30` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}