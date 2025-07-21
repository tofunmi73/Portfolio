"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Share2, Heart, Download, ZoomIn } from "lucide-react"

interface Artwork {
  _id: string
  title: string
  year: number
  medium: string
  dimensions: string
  series: string
  image: string
  processImages?: string[]
  story?: string
  inspiration?: string
  technique?: string
  tags: string[]
  description?: string
}

export default function ArtworkPage({ params }: { params: { id: string } }) {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [relatedWorks, setRelatedWorks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProcessImage, setSelectedProcessImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Mock data fallback
  const mockArtwork: Artwork = {
    _id: params.id,
    title: "Ethereal Waves",
    year: 2024,
    medium: "Acrylic on Canvas",
    dimensions: '48" x 36"',
    series: "Ocean Dreams",
    image: "/placeholder.svg?height=800&width=600",
    processImages: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    story:
      "This piece emerged from countless hours spent observing the ocean's rhythm during early morning walks along the coast.",
    inspiration:
      "The inspiration came during a particularly stormy morning when the waves seemed to reach toward the sky.",
    technique: "Created using a combination of traditional brush work and fluid acrylic pouring techniques.",
    tags: ["abstract", "ocean", "blue", "movement", "contemporary"],
  }

  const mockRelatedWorks: Artwork[] = [
    {
      _id: "2",
      title: "Ocean Depths",
      image: "/placeholder.svg?height=200&width=150",
      year: 2024,
      medium: "Acrylic",
      dimensions: "24x18",
      series: "Ocean Dreams",
      tags: [],
    },
    {
      _id: "3",
      title: "Tidal Pools",
      image: "/placeholder.svg?height=200&width=150",
      year: 2024,
      medium: "Mixed Media",
      dimensions: "30x24",
      series: "Ocean Dreams",
      tags: [],
    },
    {
      _id: "4",
      title: "Coastal Morning",
      image: "/placeholder.svg?height=200&width=150",
      year: 2023,
      medium: "Oil",
      dimensions: "36x24",
      series: "Natural Light",
      tags: [],
    },
  ]

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artworks/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setArtwork(data.data)

          // Fetch related works from same series
          const relatedResponse = await fetch(`/api/artworks?series=${encodeURIComponent(data.data.series)}&limit=3`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedWorks(relatedData.data.filter((work: Artwork) => work._id !== params.id))
          }
        } else {
          setArtwork(mockArtwork)
          setRelatedWorks(mockRelatedWorks)
        }
      } catch (error) {
        console.error("Error fetching artwork:", error)
        setArtwork(mockArtwork)
        setRelatedWorks(mockRelatedWorks)
      } finally {
        setLoading(false)
      }
    }

    fetchArtwork()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork not found</h1>
          <Link href="/gallery">
            <Button>Back to Gallery</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/gallery">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-100">
                <Image src={artwork.image || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {artwork.processImages && artwork.processImages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Process & Development</h3>
                <div className="grid grid-cols-3 gap-4">
                  {artwork.processImages.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-[4/3] relative overflow-hidden rounded-lg cursor-pointer border-2 transition-colors ${
                        selectedProcessImage === index ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setSelectedProcessImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Process ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <Badge className="mb-4">{artwork.series}</Badge>
              <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>

              {artwork.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-foreground leading-relaxed">{artwork.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                <div>
                  <span className="font-medium">Medium:</span> {artwork.medium}
                </div>
                <div>
                  <span className="font-medium">Year:</span> {artwork.year}
                </div>
                <div>
                  <span className="font-medium">Dimensions:</span> {artwork.dimensions}
                </div>
                <div>
                  <span className="font-medium">Series:</span> {artwork.series}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {artwork.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {artwork.story && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Artist's Story</h2>
                <p className="text-foreground leading-relaxed mb-6">{artwork.story}</p>
              </div>
            )}

            {artwork.inspiration && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Inspiration</h3>
                <p className="text-foreground leading-relaxed mb-6">{artwork.inspiration}</p>
              </div>
            )}

            {artwork.technique && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Technique</h3>
                <p className="text-foreground leading-relaxed mb-6">{artwork.technique}</p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Interested in this piece?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    const message = encodeURIComponent("Hi! I'm interested in purchasing this artwork piece. Could you please provide more details about pricing and availability?")
                    window.open(`https://wa.me/2348145793300?text=${message}`, "_blank")
                  }}
                >
                  Inquire About Purchase
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    const subject = encodeURIComponent("Commission Similar Work")
                    const body = encodeURIComponent("Hi,\n\nI would like to commission a similar piece to the one I viewed on your portfolio. Please let me know:\n\n- Your commission process\n- Pricing and timeline\n- Available sizes and mediums\n\nLooking forward to hearing from you!\n\nBest regards,")
                    window.open(`mailto:jesutofunmiogidan@gmail.com?subject=${subject}&body=${body}`, "_blank")
                  }}
                >
                  Commission Similar Work
                </Button>
              </div>
            </div>
          </div>
        </div>

        {relatedWorks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Related Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedWorks.map((work) => (
                <Link key={work._id} href={`/artwork/${work._id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        src={work.image || "/placeholder.svg"}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{work.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Work
          </Button>
          <Button variant="outline">
            Next Work
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
