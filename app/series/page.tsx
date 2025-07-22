"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ImageIcon, ArrowRight } from "lucide-react"

interface Series {
  _id: string
  title: string
  description: string
  statement: string
  year: string
  artworkCount: number
  coverImage: string
  images: string[]
  featured: boolean
  createdAt?: string
  updatedAt?: string
}

export default function SeriesPage() {
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data fallback
  const mockSeriesData: Series[] = [
    {
      _id: "1",
      title: "Ocean Dreams",
      description:
        "A meditation on the eternal dance between water and light, capturing the ocean's ever-changing moods through fluid brushstrokes and translucent layers.",
      statement:
        "This series emerged from countless dawn walks along the Pacific coast, where I witnessed the ocean's daily transformation from darkness to light.",
      year: "2024",
      artworkCount: 12,
      coverImage: "/placeholder.svg?height=800&width=600",
      images: [
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
      ],
      featured: true,
    },
    {
      _id: "2",
      title: "Urban Pulse",
      description:
        "Dynamic geometric compositions that capture the energy and rhythm of contemporary city life through bold colors and angular forms.",
      statement:
        "Living in San Francisco, I'm constantly inspired by the city's vertical landscape and the interplay of architecture with human movement.",
      year: "2024",
      artworkCount: 8,
      coverImage: "/placeholder.svg?height=800&width=600",
      images: [
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
      ],
      featured: false,
    },
  ]

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch("/api/series")
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data.data)) {
            const processedData = await Promise.all(
              data.data.map(async (series: Series) => {
                try {
                  // Fetch artworks for this series to get cover image and count
                  const artworksResponse = await fetch(`/api/artworks?series=${encodeURIComponent(series.title)}`)
                  if (artworksResponse.ok) {
                    const artworksData = await artworksResponse.json()
                    const artworks = artworksData.data || []
                    
                    return {
                      ...series,
                      coverImage: series.coverImage || artworks[0]?.image || "/placeholder.svg",
                      artworkCount: artworks.length,
                      images: artworks.slice(0, 3).map((artwork: any) => artwork.image || "/placeholder.svg")
                    }
                  } else {
                    console.error(`Failed to fetch artworks for series: ${series.title}`)
                    return {
                      ...series,
                      coverImage: series.coverImage || "/placeholder.svg",
                      artworkCount: 0,
                      images: []
                    }
                  }
                } catch (error) {
                  console.error("Error fetching artworks for series:", error)
                  return {
                    ...series,
                    coverImage: series.coverImage || "/placeholder.svg",
                    artworkCount: 0,
                    images: []
                  }
                }
              })
            )
            setSeriesData(processedData)
          } else {
            console.error("Invalid data format received from API")
            setSeriesData(mockSeriesData)
          }
        } else {
          console.error("Failed to fetch series")
          setSeriesData(mockSeriesData)
        }
      } catch (error) {
        console.error("Error fetching series:", error)
        setSeriesData(mockSeriesData)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  // Sort seriesData from most recent to least recent by updatedAt, then createdAt, then year
  const sortedSeriesData = [...seriesData].sort((a, b) => {
    const dateA = new Date(b.updatedAt || b.createdAt || b.year).getTime();
    const dateB = new Date(a.updatedAt || a.createdAt || a.year).getTime();
    return dateA - dateB;
  });
  const featuredSeries = sortedSeriesData.find((series) => series.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Art Series & Collections</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore thematic collections that represent different periods and explorations in my artistic journey
          </p>
        </div>

        {featuredSeries && (
          <Card className="mb-16 overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto">
                <Image
                  src={featuredSeries.coverImage || "/placeholder.svg"}
                  alt={featuredSeries.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-purple-600">Featured Series</Badge>
              </div>

              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {featuredSeries.year}
                  </div>
                  <div className="flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    {featuredSeries.artworkCount || 0} artworks
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">{featuredSeries.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{featuredSeries.description}</p>

                {featuredSeries.statement && (
                  <blockquote className="border-l-4 border-purple-400 pl-4 italic text-foreground mb-6">
                    "{featuredSeries.statement}"
                  </blockquote>
                )}

                {featuredSeries.images && featuredSeries.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {featuredSeries.images.map((image, index) => (
                      <div key={index} className="aspect-square relative overflow-hidden rounded">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${featuredSeries.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Link href={`/series/${featuredSeries._id}`}>
                  <Button size="lg">
                    Explore Series
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedSeriesData
            .filter((series) => !series.featured)
            .map((series) => (
              <Link key={series._id} href={`/series/${series._id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={series.coverImage || "/placeholder.svg"}
                      alt={series.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{series.year}</span>
                        <ImageIcon className="w-4 h-4 ml-2" />
                        <span>{series.artworkCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {series.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{series.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}