"use client"

import { motion } from "framer-motion"
import { Camera, MessageSquare, Send, Smile, Frown, Meh, AlertCircle, User, Bot, Video, VideoOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import * as faceapi from "@vladmandic/face-api"

interface Message {
  id: number
  sender: "user" | "ai"
  text: string
  timestamp: string
}

export default function EmotionDetection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("Neutral")
  const [emotionConfidence, setEmotionConfidence] = useState(0)
  const [emotionScores, setEmotionScores] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
    neutral: 0,
  })
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your AI security assistant powered by emotion detection. Enable your camera to get started, and I can explain system activities based on your emotional state.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model"
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
        console.log("Face-api models loaded successfully")
      } catch (error) {
        console.error("Error loading models:", error)
      }
    }
    loadModels()
  }, [])

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please ensure you have granted camera permissions.")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Detect emotions
  useEffect(() => {
    if (!modelsLoaded || !cameraActive || !videoRef.current) return

    const detectEmotions = async () => {
      if (!videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current

      // Ensure video is ready
      if (video.readyState !== 4) return

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detection) {
        const expressions = detection.expressions
        const scores = {
          happy: Math.round(expressions.happy * 100),
          sad: Math.round(expressions.sad * 100),
          angry: Math.round(expressions.angry * 100),
          fearful: Math.round(expressions.fearful * 100),
          disgusted: Math.round(expressions.disgusted * 100),
          surprised: Math.round(expressions.surprised * 100),
          neutral: Math.round(expressions.neutral * 100),
        }

        setEmotionScores(scores)

        // Find dominant emotion
        const emotions = Object.entries(scores)
        const dominant = emotions.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
        const emotionName = dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1)
        
        setCurrentEmotion(emotionName)
        setEmotionConfidence(dominant[1])

        // Draw detection box
        const displaySize = { width: video.videoWidth, height: video.videoHeight }
        faceapi.matchDimensions(canvas, displaySize)
        
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Draw face box
          const box = resizedDetections.detection.box
          ctx.strokeStyle = "#00ffff"
          ctx.lineWidth = 3
          ctx.strokeRect(box.x, box.y, box.width, box.height)
          
          // Draw corner brackets
          const cornerSize = 20
          ctx.strokeStyle = "#00ffff"
          ctx.lineWidth = 4
          
          // Top-left
          ctx.beginPath()
          ctx.moveTo(box.x, box.y + cornerSize)
          ctx.lineTo(box.x, box.y)
          ctx.lineTo(box.x + cornerSize, box.y)
          ctx.stroke()
          
          // Top-right
          ctx.beginPath()
          ctx.moveTo(box.x + box.width - cornerSize, box.y)
          ctx.lineTo(box.x + box.width, box.y)
          ctx.lineTo(box.x + box.width, box.y + cornerSize)
          ctx.stroke()
          
          // Bottom-left
          ctx.beginPath()
          ctx.moveTo(box.x, box.y + box.height - cornerSize)
          ctx.lineTo(box.x, box.y + box.height)
          ctx.lineTo(box.x + cornerSize, box.y + box.height)
          ctx.stroke()
          
          // Bottom-right
          ctx.beginPath()
          ctx.moveTo(box.x + box.width - cornerSize, box.y + box.height)
          ctx.lineTo(box.x + box.width, box.y + box.height)
          ctx.lineTo(box.x + box.width, box.y + box.height - cornerSize)
          ctx.stroke()
        }
      }
    }

    const interval = setInterval(detectEmotions, 100)
    return () => clearInterval(interval)
  }, [modelsLoaded, cameraActive])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return

    const newUserMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newUserMessage])
    setInputMessage("")
    setIsSending(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          emotion: currentEmotion,
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: "I'm currently processing your request. The system is monitoring all devices and ensuring your security.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      Happy: "#00ff88",
      Sad: "#38bdf8",
      Angry: "#ff0055",
      Fearful: "#ff8500",
      Disgusted: "#a855f7",
      Surprised: "#00ffff",
      Neutral: "#00d4ff",
    }
    return colorMap[emotion] || "#00d4ff"
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return Smile
      case "sad":
      case "fearful":
        return Frown
      case "angry":
      case "disgusted":
        return AlertCircle
      default:
        return Meh
    }
  }

  const emotionsList = [
    { name: "Happy", key: "happy", color: "#00ff88" },
    { name: "Neutral", key: "neutral", color: "#00d4ff" },
    { name: "Sad", key: "sad", color: "#38bdf8" },
    { name: "Angry", key: "angry", color: "#ff0055" },
    { name: "Surprised", key: "surprised", color: "#00ffff" },
    { name: "Fearful", key: "fearful", color: "#ff8500" },
    { name: "Disgusted", key: "disgusted", color: "#a855f7" },
  ]

  return (
    <div className="min-h-screen cyber-gradient grid-pattern p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#a855f7] text-glow-purple mb-2">
            Real-Time Emotion Detection & AI Assistant
          </h1>
          <p className="text-gray-400">Live facial analysis with GenAI-powered support</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotion Detection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Live Camera Feed */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-6 h-6 text-[#00ffff]" />
                <h2 className="text-xl font-semibold text-white">Live Camera Feed</h2>
                <Badge
                  variant="outline"
                  className={`${
                    cameraActive
                      ? "bg-[#00ff88]/20 text-[#00ff88]"
                      : "bg-gray-500/20 text-gray-400"
                  } border-0 ml-auto`}
                >
                  {cameraActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Camera Feed */}
              <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden mb-4 border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current && canvasRef.current) {
                      canvasRef.current.width = videoRef.current.videoWidth
                      canvasRef.current.height = videoRef.current.videoHeight
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
                
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Camera is not active</p>
                      <Button
                        onClick={startCamera}
                        disabled={!modelsLoaded}
                        className="bg-[#00d4ff] hover:bg-[#00ffff] text-black glow-cyan"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {modelsLoaded ? "Enable Camera" : "Loading Models..."}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Scanning line */}
                {cameraActive && (
                  <motion.div
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent opacity-50"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-2">
                {cameraActive ? (
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <VideoOff className="w-4 h-4 mr-2" />
                    Stop Camera
                  </Button>
                ) : (
                  <Button
                    onClick={startCamera}
                    disabled={!modelsLoaded}
                    className="flex-1 bg-[#00d4ff] hover:bg-[#00ffff] text-black"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {modelsLoaded ? "Start Camera" : "Loading..."}
                  </Button>
                )}
              </div>

              {/* Current Emotion */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">Detected Emotion</span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: getEmotionColor(currentEmotion),
                      textShadow: `0 0 20px ${getEmotionColor(currentEmotion)}`,
                    }}
                  >
                    {currentEmotion}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Confidence</span>
                  <span
                    className="font-semibold text-lg"
                    style={{
                      color: getEmotionColor(currentEmotion),
                    }}
                  >
                    {emotionConfidence}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Emotion Analysis */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Emotion Analysis</h3>
              <div className="space-y-3">
                {emotionsList.map((emotion, index) => {
                  const EmotionIcon = getEmotionIcon(emotion.name)
                  const value = emotionScores[emotion.key as keyof typeof emotionScores]
                  
                  return (
                    <motion.div
                      key={emotion.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="p-2 rounded"
                        style={{ backgroundColor: `${emotion.color}20` }}
                      >
                        <EmotionIcon className="w-4 h-4" style={{ color: emotion.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{emotion.name}</span>
                          <span
                            className="font-semibold"
                            style={{ color: emotion.color }}
                          >
                            {value}%
                          </span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: emotion.color,
                              boxShadow: `0 0 10px ${emotion.color}`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* GenAI Chat Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-[#ff006e]" />
                <h2 className="text-xl font-semibold text-white">GenAI Assistant</h2>
                <Badge variant="outline" className="bg-[#ff006e]/20 text-[#ff006e] border-0 ml-auto">
                  AI Powered
                </Badge>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: "600px" }}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.sender === "user"
                          ? "bg-[#00d4ff]/20 glow-blue"
                          : "bg-[#ff006e]/20 glow-pink"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-[#00d4ff]" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#ff006e]" />
                      )}
                    </div>
                    <div className={`flex-1 ${message.sender === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-[#00d4ff]/20 text-white border border-[#00d4ff]/30"
                            : "bg-[#ff006e]/10 text-gray-200 border border-[#ff006e]/30"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me about system security..."
                  disabled={isSending}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#ff006e]/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="bg-gradient-to-r from-[#ff006e] to-[#a855f7] hover:from-[#ff006e]/90 hover:to-[#a855f7]/90 text-white glow-pink"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}