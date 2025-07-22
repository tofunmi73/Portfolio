"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Link from "next/link"

interface Artwork {
  _id: string
  title: string
  year: number
  medium: string
  dimensions: string
  series: string
  image: string
  description: string
}

export function FeaturedWorks() {
  const [featuredWorks, setFeaturedWorks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock data fallback
  const mockFeaturedWorks: Artwork[] = [
    {
      _id: "1",
      title: "Ethereal Waves",
      year: 2024,
      medium: "Acrylic on Canvas",
      dimensions: '48" x 36"',
      series: "Ocean Dreams",
      image: "/placeholder.svg?height=600&width=800",
      description:
        "A flowing composition that captures the essence of ocean movement through vibrant blues and whites.",
    },
    {
      _id: "2",
      title: "Urban Pulse",
      year: 2024,
      medium: "Mixed Media",
      dimensions: '60" x 40"',
      series: "City Life",
      image: "/placeholder.svg?height=600&width=800",
      description: "Dynamic energy of city life expressed through bold geometric forms and electric colors.",
    },
    {
      _id: "3",
      title: "Sunset Reverie",
      year: 2023,
      medium: "Oil on Canvas",
      dimensions: '36" x 24"',
      series: "Natural Light",
      image: "/placeholder.svg?height=600&width=800",
      description: "Warm hues blend seamlessly to create a meditative landscape of color and light.",
    },
  ]

  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      try {
        const response = await fetch("/api/artworks/featured")
        if (response.ok) {
          const data = await response.json()
          // console.log('API response:', data)
          setFeaturedWorks(data.data || mockFeaturedWorks)
        } else {
          setFeaturedWorks(mockFeaturedWorks)
        }
      } catch (error) {
        console.error("Error fetching featured works:", error)
        setFeaturedWorks(mockFeaturedWorks)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedWorks()
  }, [])

  // Auto-advance featured artwork every 3 seconds
  useEffect(() => {
    if (featuredWorks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWorks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredWorks])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredWorks.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredWorks.length) % featuredWorks.length)
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading featured works...</p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredWorks.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Works</h2>
            <p className="text-xl text-muted-foreground">No featured works available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const currentWork = featuredWorks[currentIndex]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest creations that push the boundaries of contemporary art
          </p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-2xl" style={{ width: 1068, height: 520, maxWidth: '100%' }}>
            <div className="grid md:grid-cols-2 gap-0 h-full">
              <div className="relative flex items-center justify-center bg-black/5" style={{ minHeight: 520, minWidth: 534, maxWidth: 534, maxHeight: 520 }}>
                <Image
                  src={currentWork.image || "/placeholder.svg"}
                  alt={currentWork.title}
                  width={534}
                  height={520}
                  className="object-cover rounded-lg"
                  style={{ width: 534, height: 520 }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              <CardContent className="p-8 flex flex-col justify-center h-full overflow-hidden">
                <Badge className="w-fit mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {currentWork.series}
                </Badge>

                <h3 className="text-3xl font-bold mb-4 truncate" title={currentWork.title}>{currentWork.title}</h3>

                <p className="text-muted-foreground mb-6 leading-relaxed overflow-auto max-h-52">{currentWork.description}</p>

                <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Medium:</span> {currentWork.medium}
                  </p>
                  <p>
                    <span className="font-medium">Dimensions:</span> {currentWork.dimensions}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span> {currentWork.year}
                  </p>
                </div>

                <Link href={`/artwork/${currentWork._id}`}>
                  <Button className="w-full md:w-auto">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {featuredWorks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
