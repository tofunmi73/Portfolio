"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return
    let ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame: number
    let ripples: Array<{
      x: number
      y: number
      radius: number
      maxRadius: number
      opacity: number
      speed: number
    }> = []

    // Fill the background with ripples at random intervals
    function spawnRipple() {
      if (!canvas) return
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const maxRadius = Math.random() * 220 + 180 // Increased size
      const speed = Math.random() * 1.2 + 0.6 // Slightly faster
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius,
        opacity: 0.22 + Math.random() * 0.18,
        speed,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw and update ripples
      ripples.forEach((ripple, i) => {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${theme === "dark" ? "96,165,250" : "37,99,235"},${ripple.opacity})`
        ctx.lineWidth = 2 + (ripple.maxRadius - ripple.radius) * 0.03
        ctx.stroke()
        ripple.radius += ripple.speed
        ripple.opacity *= 0.985
      })
      // Remove faded/finished ripples
      ripples = ripples.filter(r => r.radius < r.maxRadius && r.opacity > 0.02)
      // Increase spawn rate for higher density
      for (let i = 0; i < 3; i++) {
        if (Math.random() < 0.25) spawnRipple()
      }
      animationFrame = requestAnimationFrame(animate)
    }

    // Responsive canvas
    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx = canvas.getContext("2d")
    }
    resize()
    window.addEventListener("resize", resize)
    animate()
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [theme, mounted])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hero-bg-light dark:hero-bg-dark" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-4 h-4 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <div className="w-6 h-6 bg-pink-400/30 rounded-full"></div>
        </div>
        <div className="absolute top-60 right-40 animate-float-delayed">
          <Sparkles className="w-6 h-6 text-purple-300/40" />
        </div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Abstracted
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient">
              Portraiture
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up-delayed">
          Painting the enduring anchors that steady us,
          tracing their ripples across West African history
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delayed-2">
            <Link href="/gallery">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
              >
                Explore Gallery
              </Button>
            </Link>
            <Link href="/process">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black dark:hover:bg-gray-800 dark:hover:text-white bg-transparent transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Process
            </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white opacity-70" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up 1s ease-out 0.3s both;
        }
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 1s ease-out 0.6s both;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
