"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Eye, FileText, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "emotion", label: "Emotion AI", icon: Eye },
    { id: "logs", label: "System Logs", icon: FileText },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--neon-blue)] blur-xl opacity-40 rounded-full" />
                <Shield className="w-8 h-8 text-[var(--neon-blue)] relative z-10" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--neon-blue)] text-glow-blue">AIONet-X</h1>
                <p className="text-xs text-gray-500">Smart Security</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  variant="ghost"
                  className={`flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] glow-blue"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg md:hidden"
          style={{ top: "73px" }}
        >
          <div className="p-6 space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id)
                  setMobileMenuOpen(false)
                }}
                variant="ghost"
                className={`w-full flex items-center gap-3 justify-start py-6 text-lg ${
                  activeTab === tab.id
                    ? "bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] glow-blue"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed navigation */}
      <div className="h-[73px]" />
    </>
  )
}