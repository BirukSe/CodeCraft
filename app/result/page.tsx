"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Menu, ChevronLeft, Code, Home, Upload, Pencil, Settings, HelpCircle, LogOut, Copy, Download, ExternalLink, Check, Sparkles, Layers, Play, Edit, Github, Terminal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function ResultPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [generatedCode, setGeneratedCode] = useState("")
  const [displayedCode, setDisplayedCode] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const [copied, setCopied] = useState(false)
  const [navExpanded, setNavExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const previewIframeRef = useRef<HTMLIFrameElement>(null)
  const codeContainerRef = useRef<HTMLPreElement>(null)

  // Navigation items
  const navItems = [
      { icon: Home, label: "Dashboard", href: "/dashboard", active:true },
      { icon: Upload, label: "Design", href: "/design" },
   
    ]
 

  // Toggle navigation
  const toggleNav = () => {
    setNavExpanded(!navExpanded)
  }

  // Load code from localStorage
  useEffect(() => {
    const storedCode = localStorage.getItem("code")
    if (storedCode) {
      setGeneratedCode(storedCode)
      
      // Start the typing animation
      let i = 0
      const typeCode = () => {
        if (i < storedCode.length) {
          setDisplayedCode(storedCode.substring(0, i + 1))
          i++
          setTimeout(typeCode, Math.random() * 5 + 1) // Random typing speed for effect
        } else {
          setIsTyping(false)
        }
      }
      
      typeCode()
    }
  }, [])

  // Update preview when code changes or tab changes
  useEffect(() => {
    if (activeTab === "preview" && previewIframeRef.current) {
      const iframe = previewIframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(generatedCode)
        iframeDoc.close()
      }
    }
  }, [generatedCode, activeTab])

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Download code as HTML file
  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedCode], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = "generated-code.html"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Go back to convert page
  const handleBack = () => {
    router.push("/convert")
  }

  // Format code with line numbers
  const formatCodeWithLineNumbers = (code: string) => {
    if (!code) return []
    
    return code.split('\n').map((line, index) => ({
      number: index + 1,
      content: line || ' ' // Use space for empty lines
    }))
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      {/* Collapsible sidebar */}
      <div 
        className={cn(
          "bg-[#1e293b] border-r border-[#334155] transition-all duration-300 flex flex-col h-full shadow-md z-10",
          navExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center h-16 border-b border-[#334155] px-4">
          <div className={cn(
            "flex items-center transition-all duration-300",
            navExpanded ? "justify-between w-full" : "justify-center"
          )}>
            {navExpanded ? (
              <>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <span className="ml-2 font-bold text-white">CodeCraft</span>
                </div>
                <button 
                  onClick={toggleNav}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={toggleNav}
                className="text-gray-400 hover:text-white transition-colors"
              >
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
                    item.active 
                      ? "bg-[#0f172a] text-cyan-400" 
                      : "text-gray-300 hover:bg-[#0f172a]/50",
                    navExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "flex-shrink-0",
                    navExpanded ? "w-5 h-5 mr-3" : "w-6 h-6"
                  )} />
                  <span className={cn(
                    "transition-opacity duration-200",
                    navExpanded ? "opacity-100" : "opacity-0 absolute"
                  )}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {session && (
          <div className="border-t border-[#334155] p-4">
            <div className={cn(
              "flex items-center",
              navExpanded ? "justify-start" : "justify-center"
            )}>
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
                  <p className="text-sm font-medium text-white truncate">
                    {session.user?.name}
                  </p>
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
          <h1 className="text-xl font-bold text-white">Generated Code</h1>
          {session && (
            <div className="ml-auto text-sm text-gray-300">
              Welcome, {session.user?.name}
            </div>
          )}
        </header>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto bg-[#0f172a]">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Success message */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6 shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Code Generated Successfully!</h2>
                  <p className="text-gray-300">Your wireframe has been converted to clean, production-ready code.</p>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    className="border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                    onClick={handleBack}
                  >
                    Create Another
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Tabs and content */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-lg overflow-hidden">
              <Tabs defaultValue="code" onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between border-b border-[#334155] px-6 py-3">
                  <TabsList className="bg-[#0f172a] border border-[#334155]">
                    <TabsTrigger 
                      value="code" 
                      className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                    >
                      <Terminal className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview" 
                      className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="code" className="p-0 m-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-black border-b border-[#22c55e] flex items-center px-4">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="ml-4 text-xs text-[#22c55e] font-mono flex items-center">
                        <Terminal className="w-3 h-3 mr-1" />
                        root@codecraft:~/generated-code.html
                      </div>
                    </div>
                    
                    {/* Terminal-style code display */}
                    <div 
                      className="bg-black p-4 pt-14 h-[500px] overflow-auto relative"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(0, 150, 0, 0.05) 1px, transparent 0)',
                        backgroundSize: '15px 15px',
                        backgroundPosition: '-7px -7px',
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-10 overflow-hidden">
                        <div className="animate-scan w-full h-[5px] bg-[#22c55e]/30"></div>
                      </div>
                      
                      <pre ref={codeContainerRef} className="font-mono text-sm relative">
                        <div className="flex flex-col">
                          {formatCodeWithLineNumbers(displayedCode).map((line, index) => (
                            <div key={index} className="flex">
                              <div className="w-10 text-right pr-4 select-none text-[#22c55e]/50 border-r border-[#22c55e]/20 mr-4">
                                {line.number}
                              </div>
                              <div className="flex-1 text-[#22c55e]">
                                {line.content}
                              </div>
                            </div>
                          ))}
                        </div>
                        {isTyping && (
                          <span className="inline-block w-2 h-4 bg-[#22c55e] animate-blink ml-1"></span>
                        )}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="p-0 m-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-[#0f172a] border-b border-[#334155] flex items-center px-4">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="ml-4 text-xs text-gray-400">Preview</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                        onClick={() => previewIframeRef.current?.contentWindow?.location.reload()}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    <div className="h-[500px] pt-10 bg-white">
                      <iframe 
                        ref={previewIframeRef}
                        className="w-full h-full border-0"
                        title="Code Preview"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mr-3">
                    <Edit className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Edit Code</h3>
                    <p className="text-gray-400 text-sm mb-3">Customize the generated code to fit your specific needs.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                    >
                      Open Editor
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mr-3">
                    <ExternalLink className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Deploy</h3>
                    <p className="text-gray-400 text-sm mb-3">Deploy your code to a live website with one click.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                    >
                      Deploy to Vercel
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mr-3">
                    <Github className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Save to GitHub</h3>
                    <p className="text-gray-400 text-sm mb-3">Push your code to a GitHub repository for version control.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#334155] hover:bg-[#0f172a] hover:text-cyan-400 text-gray-300"
                    >
                      Connect to GitHub
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
