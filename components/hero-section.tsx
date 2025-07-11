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

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      opacity: number
      pulse: number
    }> = []

    const colors =
      theme === "dark"
        ? ["#93c5fd", "#c4b5fd", "#fbcfe8", "#fdba74", "#86efac", "#fca5a5"]
        : ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"]

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8,
        },
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    let animationFrame: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1

        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.velocity.x += (dx / distance) * force * 0.01
          particle.velocity.y += (dy / distance) * force * 0.01
        }

        particle.pulse += 0.02
        const pulseRadius = particle.radius + Math.sin(particle.pulse) * 0.5

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2)

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, pulseRadius)
        gradient.addColorStop(
          0,
          particle.color +
            Math.floor(particle.opacity * 255)
              .toString(16)
              .padStart(2, "0"),
        )
        gradient.addColorStop(1, particle.color + "00")

        ctx.fillStyle = gradient
        ctx.fill()

        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            const connectionOpacity = theme === "dark" ? 0.15 : 0.1
            ctx.strokeStyle = `rgba(255, 255, 255, ${connectionOpacity * (1 - distance / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrame)
    }
  }, [mousePosition, theme, mounted])

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
          My paintings explore the distorted reflections we see in rippled water--where reality bends and reveals new truths
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
