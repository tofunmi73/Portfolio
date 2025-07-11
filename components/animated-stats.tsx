"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Stat {
  _id?: string
  label: string
  value: number
  suffix: string
}

// Mock data fallback
const mockStats: Stat[] = [
  { label: "Artworks Created", value: 150, suffix: "+" },
  { label: "Exhibitions", value: 25, suffix: "" },
  { label: "Years Active", value: 6, suffix: "" },
  { label: "Awards Won", value: 0, suffix: "" },
]

export function AnimatedStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [animatedValues, setAnimatedValues] = useState<number[]>([])

  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          // Add validation here
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setStats(data.data)
            setAnimatedValues(data.data.map(() => 0))
          } else {
            console.warn("Invalid API response structure:", data)
            setStats(mockStats)
            setAnimatedValues(mockStats.map(() => 0))
          }
        } else {
          console.error("API response not ok:", response.status)
          setStats(mockStats)
          setAnimatedValues(mockStats.map(() => 0))
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats(mockStats)
        setAnimatedValues(mockStats.map(() => 0))
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    if (isVisible && stats.length > 0) {
      stats.forEach((stat, index) => {
        let current = 0
        const increment = stat.value / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            current = stat.value
            clearInterval(timer)
          }
          setAnimatedValues((prev) => {
            const newValues = [...prev]
            newValues[index] = Math.floor(current)
            return newValues
          })
        }, 30)
        timers.push(timer)
      })
    }
    
    // Cleanup function
    return () => {
      timers.forEach(timer => clearInterval(timer))
    }
  }, [isVisible, stats])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white">Loading stats...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {animatedValues[index] || 0}
                  {stat.suffix}
                </div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
