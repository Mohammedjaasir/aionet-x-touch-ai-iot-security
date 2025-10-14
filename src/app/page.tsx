"use client"

import { useState } from "react"
import LandingPage from "@/components/LandingPage"
import Navigation from "@/components/Navigation"
import Dashboard from "@/components/Dashboard"
import EmotionDetection from "@/components/EmotionDetection"
import SystemLogs from "@/components/SystemLogs"

export default function Home() {
  const [showSimulation, setShowSimulation] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!showSimulation) {
    return <LandingPage onStartSimulation={() => setShowSimulation(true)} />
  }

  return (
    <div className="min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "emotion" && <EmotionDetection />}
      {activeTab === "logs" && <SystemLogs />}
    </div>
  )
}