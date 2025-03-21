"use client"

import { useEffect, useRef } from "react"
import {
  Code,
  Layout,
  Layers,
  FileCode,
  Settings,
  User,
  Bell,
  Search,
  ChevronRight,
  BarChart3,
  Zap,
} from "lucide-react"

export default function DashboardMockup() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 500

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#0f172a")
    gradient.addColorStop(1, "#1e293b")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw sidebar
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, 70, canvas.height)

    // Draw sidebar items
    const sidebarIcons = [
      { y: 30, color: "#3b82f6" },
      { y: 100, color: "#64748b" },
      { y: 160, color: "#64748b" },
      { y: 220, color: "#64748b" },
      { y: 280, color: "#64748b" },
      { y: 450, color: "#64748b" },
    ]

    sidebarIcons.forEach((icon) => {
      ctx.fillStyle = icon.color
      ctx.beginPath()
      ctx.arc(35, icon.y, 15, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw header
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(70, 0, canvas.width - 70, 60)

    // Draw search bar
    ctx.fillStyle = "#0f172a"
    ctx.beginPath()
    ctx.roundRect(100, 15, 300, 30, 15)
    ctx.fill()

    // Draw user icon
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(canvas.width - 30, 30, 15, 0, Math.PI * 2)
    ctx.fill()

    // Draw notification icon
    ctx.fillStyle = "#64748b"
    ctx.beginPath()
    ctx.arc(canvas.width - 70, 30, 12, 0, Math.PI * 2)
    ctx.fill()

    // Draw main content area
    // Title
    ctx.fillStyle = "#f8fafc"
    ctx.font = "bold 24px Arial"
    ctx.fillText("Dashboard", 100, 100)

    // Subtitle
    ctx.fillStyle = "#94a3b8"
    ctx.font = "16px Arial"
    ctx.fillText("Welcome back! Here's an overview of your projects", 100, 130)

    // Draw stats cards
    const cards = [
      { x: 100, y: 160, width: 200, height: 120, color: "#3b82f6", title: "Total Projects", value: "24" },
      { x: 320, y: 160, width: 200, height: 120, color: "#8b5cf6", title: "Completed", value: "18" },
      { x: 540, y: 160, width: 200, height: 120, color: "#06b6d4", title: "In Progress", value: "6" },
    ]

    cards.forEach((card) => {
      // Card background
      ctx.fillStyle = card.color + "20" // Add transparency
      ctx.beginPath()
      ctx.roundRect(card.x, card.y, card.width, card.height, 10)
      ctx.fill()

      // Card border
      ctx.strokeStyle = card.color + "40"
      ctx.lineWidth = 1
      ctx.stroke()

      // Card icon
      ctx.fillStyle = card.color
      ctx.beginPath()
      ctx.arc(card.x + 30, card.y + 30, 15, 0, Math.PI * 2)
      ctx.fill()

      // Card title
      ctx.fillStyle = "#94a3b8"
      ctx.font = "14px Arial"
      ctx.fillText(card.title, card.x + 20, card.y + 70)

      // Card value
      ctx.fillStyle = "#f8fafc"
      ctx.font = "bold 28px Arial"
      ctx.fillText(card.value, card.x + 20, card.y + 100)
    })

    // Draw recent projects section
    ctx.fillStyle = "#f8fafc"
    ctx.font = "bold 20px Arial"
    ctx.fillText("Recent Projects", 100, 320)

    // Draw project list
    const projects = [
      { y: 350, title: "E-commerce Website", status: "In Progress", color: "#06b6d4" },
      { y: 390, title: "Mobile Banking App", status: "Completed", color: "#10b981" },
      { y: 430, title: "Dashboard Redesign", status: "In Progress", color: "#06b6d4" },
    ]

    projects.forEach((project) => {
      // Project row
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.roundRect(100, project.y, 640, 30, 5)
      ctx.fill()

      // Project icon
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(120, project.y + 15, 8, 0, Math.PI * 2)
      ctx.fill()

      // Project title
      ctx.fillStyle = "#f8fafc"
      ctx.font = "14px Arial"
      ctx.fillText(project.title, 140, project.y + 20)

      // Project status
      ctx.fillStyle = project.color
      ctx.beginPath()
      ctx.roundRect(600, project.y + 5, 80, 20, 10)
      ctx.fill()

      ctx.fillStyle = "#0f172a"
      ctx.font = "bold 12px Arial"
      ctx.fillText(project.status, 610, project.y + 19)
    })

    // Draw chart area
    ctx.fillStyle = "#1e293b"
    ctx.beginPath()
    ctx.roundRect(100, 480, 640, 150, 10)
    ctx.fill()

    // Draw chart title
    ctx.fillStyle = "#f8fafc"
    ctx.font = "bold 16px Arial"
    ctx.fillText("Activity Overview", 120, 510)

    // Draw chart
    const chartData = [20, 40, 30, 70, 50, 60, 80]
    const chartWidth = 600
    const chartHeight = 80
    const barWidth = chartWidth / chartData.length - 10

    chartData.forEach((value, index) => {
      const x = 120 + index * (barWidth + 10)
      const barHeight = (value / 100) * chartHeight
      const y = 600 - barHeight

      const gradient = ctx.createLinearGradient(0, y, 0, 600)
      gradient.addColorStop(0, "#3b82f6")
      gradient.addColorStop(1, "#3b82f680")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 5)
      ctx.fill()
    })

    // Add some visual noise/texture
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2

      ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [])

  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-2xl" />

      {/* Overlay elements for better visual appeal */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[15px] left-[110px] flex items-center text-gray-400">
          <Search className="h-4 w-4" />
          <span className="ml-2 text-xs">Search projects...</span>
        </div>

        <div className="absolute top-[15px] right-[100px]">
          <Bell className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[15px] right-[30px]">
          <User className="h-5 w-5 text-white" />
        </div>

        <div className="absolute top-[30px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <Layout className="h-6 w-6 text-blue-500" />
        </div>

        <div className="absolute top-[100px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <Layers className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[160px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <FileCode className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[220px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[280px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <Settings className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[450px] left-[35px] transform -translate-x-1/2 -translate-y-1/2">
          <User className="h-5 w-5 text-gray-400" />
        </div>

        <div className="absolute top-[160px] left-[130px]">
          <Layers className="h-6 w-6 text-blue-500" />
        </div>

        <div className="absolute top-[160px] left-[350px]">
          <Zap className="h-6 w-6 text-purple-500" />
        </div>

        <div className="absolute top-[160px] left-[570px]">
          <Code className="h-6 w-6 text-cyan-500" />
        </div>

        <div className="absolute top-[320px] right-[100px] text-xs text-blue-500 flex items-center">
          <span>View all</span>
          <ChevronRight className="h-3 w-3 ml-1" />
        </div>

        <div className="absolute top-[350px] left-[120px]">
          <Code className="h-4 w-4 text-blue-500" />
        </div>

        <div className="absolute top-[390px] left-[120px]">
          <Code className="h-4 w-4 text-blue-500" />
        </div>

        <div className="absolute top-[430px] left-[120px]">
          <Code className="h-4 w-4 text-blue-500" />
        </div>
      </div>
    </div>
  )
}

