"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  Menu,
  ChevronLeft,
  Code,
  Home,
  Upload,
  Settings,
  HelpCircle,
  LogOut,
  Pencil,
  Eraser,
  Trash2,
  Undo,
  Redo,
  Wand2,
  Loader,
  Palette,
  Minus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export default function DrawPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [description, setDescription] = useState("")
  const [navExpanded, setNavExpanded] = useState(false)
  const [currentTool, setCurrentTool] = useState<"pencil" | "eraser">("pencil")
  const [brushSize, setBrushSize] = useState(2)
  const [brushColor, setBrushColor] = useState("#000000")
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Navigation items
 const navItems = [
     { icon: Home, label: "Dashboard", href: "/dashboard" },
     { icon: Upload, label: "Design", href: "/design", active: true },
   
   ]

  // Toggle navigation
  const toggleNav = () => {
    setNavExpanded(!navExpanded)
  }

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = brushSize
        ctx.strokeStyle = brushColor
        ctx.lineJoin = "round"
        ctx.lineCap = "round"

        // Save initial blank canvas state
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setDrawingHistory([initialState])
        setHistoryIndex(0)
      }
    }
  }, [])

  // Update brush settings when they change
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = brushSize
        ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : brushColor
      }
    }
  }, [brushSize, brushColor, currentTool])

  // Save current state to history
  const saveToHistory = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Remove any states after current index (if we've undone and then drawn something new)
    const newHistory = drawingHistory.slice(0, historyIndex + 1)

    // Add new state and update index
    setDrawingHistory([...newHistory, currentState])
    setHistoryIndex(newHistory.length)
  }

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setDrawing(true)
  }

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    if (drawing) {
      saveToHistory()
      setDrawing(false)
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)

      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.putImageData(drawingHistory[newIndex], 0, 0)
    }
  }

  // Redo
  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)

      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.putImageData(drawingHistory[newIndex], 0, 0)
    }
  }

  // Change tool
  const changeTool = (tool: "pencil" | "eraser") => {
    setCurrentTool(tool)
  }

  // Submit drawing
  const submitDrawing = async () => {
    if (!canvasRef.current) return

    setIsLoading(true)

    try {
      const canvas = canvasRef.current

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      // Create file from blob
      const file = new File([blob], "wireframe.png", { type: "image/png" })

      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("description", description)

      // Send to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result) {
        localStorage.setItem("code", result.generatedCode)
        router.push("/result")
      } else {
        console.error("Failed to convert drawing")
      }
    } catch (error) {
      console.error("Error submitting drawing:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      {/* Collapsible sidebar */}
      <div
        className={cn(
          "bg-[#1e293b] border-r border-[#334155] transition-all duration-300 flex flex-col h-full shadow-md z-10",
          navExpanded ? "w-64" : "w-16",
        )}
      >
        <div className="flex items-center h-16 border-b border-[#334155] px-4">
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              navExpanded ? "justify-between w-full" : "justify-center",
            )}
          >
            {navExpanded ? (
              <>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <span className="ml-2 font-bold text-white">CodeCraft</span>
                </div>
                <button onClick={toggleNav} className="text-gray-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={toggleNav} className="text-gray-400 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg p-2 text-sm font-medium transition-all",
                    item.active ? "bg-[#0f172a] text-cyan-400" : "text-gray-300 hover:bg-[#0f172a]/50",
                    navExpanded ? "justify-start" : "justify-center",
                  )}
                >
                  <item.icon className={cn("flex-shrink-0", navExpanded ? "w-5 h-5 mr-3" : "w-6 h-6")} />
                  <span
                    className={cn(
                      "transition-opacity duration-200",
                      navExpanded ? "opacity-100" : "opacity-0 absolute",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {session && (
          <div className="border-t border-[#334155] p-4">
            <div className={cn("flex items-center", navExpanded ? "justify-start" : "justify-center")}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#334155]">
                  {session.user?.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0f172a] flex items-center justify-center text-cyan-400 font-medium">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>

              {navExpanded && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                  <button className="flex items-center text-xs text-gray-400 hover:text-red-400 mt-1 transition-colors">
                    <LogOut className="w-3 h-3 mr-1" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#1e293b] border-b border-[#334155] flex items-center px-6 shadow-md">
          <h1 className="text-xl font-bold text-white">Draw Your Wireframe</h1>
          {session && <div className="ml-auto text-sm text-gray-300">Welcome, {session.user?.name}</div>}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-[#0f172a]">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left panel - Drawing tools */}
              <div className="lg:w-64 bg-[#1e293b] rounded-xl p-4 shadow-lg border border-[#334155]">
                <h2 className="text-white font-medium mb-4">Drawing Tools</h2>

                <div className="space-y-4">
                  {/* Tool selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className={cn(
                        "border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400",
                        currentTool === "pencil" && "bg-[#0f172a] text-cyan-400 border-cyan-400",
                      )}
                      onClick={() => changeTool("pencil")}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Pencil
                    </Button>
                    <Button
                      variant="outline"
                      className={cn(
                        "border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400",
                        currentTool === "eraser" && "bg-[#0f172a] text-cyan-400 border-cyan-400",
                      )}
                      onClick={() => changeTool("eraser")}
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      Eraser
                    </Button>
                  </div>

                  {/* Brush size */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-300">Brush Size</label>
                      <span className="text-sm text-gray-300">{brushSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Minus className="w-4 h-4 text-gray-400" />
                      <Slider
                        value={[brushSize]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(value) => setBrushSize(value[0])}
                        className="flex-1"
                      />
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Color picker */}
                  {currentTool === "pencil" && (
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Color</label>
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-400" />
                        <input
                          type="color"
                          value={brushColor}
                          onChange={(e) => setBrushColor(e.target.value)}
                          className="w-full h-8 bg-transparent border border-[#334155] rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Canvas actions */}
                  <div className="pt-2">
                    <h3 className="text-sm text-gray-300 mb-2">Canvas Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                      >
                        <Undo className="w-4 h-4 mr-2" />
                        Undo
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400"
                        onClick={redo}
                        disabled={historyIndex >= drawingHistory.length - 1}
                      >
                        <Redo className="w-4 h-4 mr-2" />
                        Redo
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#334155] hover:bg-red-900 hover:text-red-400 col-span-2"
                        onClick={clearCanvas}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Canvas
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main drawing area */}
              <div className="flex-1 flex flex-col">
                <div className="bg-[#1e293b] rounded-xl p-4 shadow-lg border border-[#334155] mb-6">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      className="w-full h-auto cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    ></canvas>
                  </div>
                </div>

                {/* Description and submit */}
                <div className="bg-[#1e293b] rounded-xl p-4 shadow-lg border border-[#334155]">
                  <h2 className="text-white font-medium mb-4">Describe Your Wireframe</h2>
                  <Textarea
                    placeholder="Describe what you're drawing and any specific requirements for the generated code..."
                    className="min-h-[120px] resize-none bg-[#0f172a] border-[#334155] focus:border-cyan-500 focus:ring-cyan-500 text-gray-300 placeholder:text-gray-500 mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-5 rounded-xl text-lg font-medium"
                    onClick={submitDrawing}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Convert Drawing to Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

