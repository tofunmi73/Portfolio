"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ExternalLink, Clock } from "lucide-react"

interface Exhibition {
  _id: string
  title: string
  venue: string
  location: string
  startDate: string
  endDate: string
  type: string
  status: string
  description: string
  artworksDisplayed: string[]
  images: string[]
  press: Array<{
    title: string
    publication: string
    date: string
    excerpt: string
  }>
  featured: boolean
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Mock data fallback
  const mockExhibitions: Exhibition[] = [
    {
      _id: "1",
      title: "Contemporary Visions",
      venue: "San Francisco Museum of Modern Art",
      location: "San Francisco, CA",
      startDate: "2024-03-15",
      endDate: "2024-06-30",
      type: "Group Exhibition",
      status: "current",
      description:
        "A groundbreaking exhibition featuring emerging contemporary artists who are redefining the boundaries of modern art.",
      artworksDisplayed: ["Ethereal Waves", "Ocean Depths", "Tidal Resonance"],
      images: ["/placeholder.svg?height=800&width=600"],
      press: [
        {
          title: "Emerging Voices in Contemporary Art",
          publication: "Art Forum",
          date: "2024-03-20",
          excerpt: "A compelling showcase of new talent that challenges conventional artistic boundaries...",
        },
      ],
      featured: true,
    },
  ]

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch(`/api/exhibitions${selectedStatus !== "all" ? `?status=${selectedStatus}` : ""}`)
        if (response.ok) {
          const data = await response.json()
          setExhibitions(data.data || mockExhibitions)
        } else {
          setExhibitions(mockExhibitions)
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error)
        setExhibitions(mockExhibitions)
      } finally {
        setLoading(false)
      }
    }

    fetchExhibitions()
  }, [selectedStatus])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "past":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const filteredExhibitions = exhibitions.filter(
    (exhibition) => selectedStatus === "all" || exhibition.status === selectedStatus,
  )

  const currentExhibition = exhibitions.find((ex) => ex.status === "current")

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exhibitions & Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of exhibitions, gallery shows, and artistic milestones
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {[
            { key: "all", label: "All Exhibitions" },
            { key: "current", label: "Current" },
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Past" },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedStatus === filter.key ? "default" : "outline"}
              onClick={() => setSelectedStatus(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {currentExhibition && selectedStatus === "all" && (
          <Card className="mb-16 overflow-hidden shadow-2xl border-2 border-green-200">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto">
                <Image
                  src={currentExhibition.images[0] || "/placeholder.svg"}
                  alt={currentExhibition.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">Currently Showing</Badge>
              </div>

              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <Badge className={getStatusColor(currentExhibition.status)}>{currentExhibition.type}</Badge>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Ends {formatDate(currentExhibition.endDate)}
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-2">{currentExhibition.title}</h2>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {currentExhibition.venue}, {currentExhibition.location}
                  </span>
                </div>

                <p className="text-foreground mb-6 leading-relaxed">{currentExhibition.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Featured Works:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExhibition.artworksDisplayed.map((artwork) => (
                      <Badge key={artwork} variant="outline">
                        {artwork}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="lg">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Exhibition
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          {filteredExhibitions.map((exhibition) => (
            <Card key={exhibition._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-3 gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={exhibition.images[0] || "/placeholder.svg"}
                    alt={exhibition.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="md:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(exhibition.status)}>
                        {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{exhibition.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{exhibition.title}</h3>

                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {exhibition.venue}, {exhibition.location}
                    </span>
                  </div>

                  <p className="text-foreground mb-4 leading-relaxed">{exhibition.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Featured Works:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exhibition.artworksDisplayed.map((artwork) => (
                        <Badge key={artwork} variant="outline" className="text-xs">
                          {artwork}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(exhibition.press?.length || 0) > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-sm">Press Coverage:</h4>
                      {exhibition.press.map((article, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{article.title}</span>
                          <span className="text-muted-foreground"> - {article.publication}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {filteredExhibitions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No exhibitions found</h3>
            <p className="text-muted-foreground">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
