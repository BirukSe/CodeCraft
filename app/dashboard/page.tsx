"use client"

import type React from "react"

import { useState, useEffect, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import {
  Upload,
  FileCode,
  Loader,
  X,
  ImageIcon,
  Code,
  Wand2,
  Menu,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function ConvertPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<any>()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [navExpanded, setNavExpanded] = useState(false)

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const imageUrl = URL.createObjectURL(files[0])
      setFile(files[0])
      setPreviewUrl(imageUrl)
      setActiveStep(2)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const imageUrl = URL.createObjectURL(e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0])
      setPreviewUrl(imageUrl)
      setActiveStep(2)
    }
  }

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/")
    }
  }, [session, isPending, router])

  const changeToCode = async () => {
    try {
      setIsLoading(true)
      setActiveStep(3)
      const formdata = new FormData()
      formdata.append("file", file)
      formdata.append("description", description)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formdata,
      })
      const result = await response.json()
      if (!result) {
        console.log("Something went wrong, please try again")
        setError("Something went wrong, Please try again")
      }

      localStorage.setItem("code", result.generatedCode)
      router.push("/result")
    } catch (error: any) {
      console.log(error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleNav = () => {
    setNavExpanded(!navExpanded)
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Upload, label: "Design", href: "/design", active: true },
  
  ]

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
          <h1 className="text-xl font-bold text-white">Wireframe to Code Converter</h1>
          {session && <div className="ml-auto text-sm text-gray-300">Welcome, {session.user?.name}</div>}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-[#0f172a]">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Steps */}
            <div className="mb-12">
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                {[
                  { num: 1, title: "Upload Wireframe", icon: Upload },
                  { num: 2, title: "Describe Project", icon: FileCode },
                  { num: 3, title: "Generate Code", icon: Wand2 },
                ].map((step) => (
                  <div key={step.num} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all ${
                        activeStep >= step.num
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-[#1e293b] text-gray-400 border border-[#334155]"
                      }`}
                    >
                      <step.icon className="w-7 h-7" />
                    </div>
                    <span className={`text-sm font-medium ${activeStep >= step.num ? "text-white" : "text-gray-400"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative max-w-2xl mx-auto mt-4">
                <div className="absolute top-0 left-[calc(16.67%+8px)] right-[calc(16.67%+8px)] h-1 bg-[#1e293b] rounded-full"></div>
                <div
                  className="absolute top-0 left-[calc(16.67%+8px)] h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                  style={{
                    width: activeStep === 1 ? "0%" : activeStep === 2 ? "50%" : "100%",
                  }}
                ></div>
              </div>
            </div>

            {/* Main form */}
            <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg border border-[#334155]">
              {/* Upload section */}
              <div className={`p-8 ${activeStep !== 1 ? "hidden" : ""}`}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-cyan-400" />
                  Upload Your Wireframe
                </h2>

                <div
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                    dragActive ? "border-cyan-500 bg-[#0f172a]" : "border-[#475569] hover:border-cyan-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-6 w-24 h-24 bg-[#0f172a] rounded-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Drag and drop your wireframe image</h3>
                  <p className="text-gray-300 mb-8 max-w-md">
                    Upload your design mockup or wireframe image to convert it into clean, production-ready code
                  </p>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 rounded-xl text-lg font-medium"
                    onClick={() => document.getElementById("imageSelect")?.click()}
                  >
                    Select Image
                  </Button>
                  <input
                    type="file"
                    id="imageSelect"
                    multiple={false}
                    className="hidden"
                    onChange={handleChangeFile}
                    accept="image/*"
                  />
                  <p className="mt-4 text-sm text-gray-400">Supported formats: PNG, JPG, GIF, SVG</p>
                </div>
              </div>

              {/* Description section */}
              <div className={`p-8 ${activeStep !== 2 ? "hidden" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="w-full md:w-1/3">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <FileCode className="w-5 h-5 mr-2 text-cyan-400" />
                      Describe Your Project
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Tell us about your website's purpose, features, and any specific requirements.
                    </p>

                    {previewUrl && (
                      <div className="relative mt-6 rounded-lg overflow-hidden border border-[#334155] bg-[#0f172a] p-2">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Wireframe preview"
                          className="w-full h-auto rounded"
                        />
                        <button
                          className="absolute top-4 right-4 bg-[#1e293b]/90 p-1 rounded-full hover:bg-[#334155] transition-colors shadow-md"
                          onClick={() => {
                            setFile(null)
                            setPreviewUrl(null)
                            setActiveStep(1)
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}

                    <Button
                      className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white w-full py-5 rounded-xl text-lg font-medium"
                      onClick={changeToCode}
                      disabled={!file || !description || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Code
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="bg-[#0f172a] rounded-xl border border-[#334155] overflow-hidden shadow-md">
                      <div className="p-3 bg-[#1e293b] border-b border-[#334155] flex items-center">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="mx-auto text-sm text-gray-400">project-description.md</div>
                      </div>
                      <Textarea
                        placeholder="# Project Description

Describe your website in detail:
- What is the purpose of your website?
- Who is the target audience?
- What key features do you need?
- Any specific design preferences?
- Any functionality requirements?

The more details you provide, the better the generated code will match your vision."
                        className="min-h-[400px] resize-none bg-[#0f172a] border-0 focus:ring-0 text-gray-300 placeholder:text-gray-500 font-mono text-sm p-4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate section */}
              <div className={`p-8 ${activeStep !== 3 || !isLoading ? "hidden" : ""}`}>
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 rounded-full bg-[#0f172a] flex items-center justify-center mb-6">
                    <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Generating Your Code</h2>
                  <p className="text-gray-300 text-center max-w-md mb-8">
                    Our AI is analyzing your wireframe and description to create clean, production-ready code.
                  </p>
                  <div className="w-full max-w-md bg-[#0f172a] rounded-full overflow-hidden h-2">
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-md text-red-400">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

