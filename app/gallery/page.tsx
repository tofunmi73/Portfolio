"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List } from "lucide-react"
import Link from "next/link"

interface Artwork {
  _id?: string
  id: number
  title: string
  year: number
  medium: string
  series: string
  size: string
  image: string
  tags: string[]
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedMedium, setSelectedMedium] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry")
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [total, setTotal] = useState(0)

  // Mock data fallback
  const mockArtworks: Artwork[] = [
    {
      id: 1,
      title: "Ethereal Waves",
      year: 2024,
      medium: "Acrylic on Canvas",
      series: "Ocean Dreams",
      size: "Large",
      image: "/placeholder.svg?height=400&width=300",
      tags: ["abstract", "blue", "ocean"],
    },
    {
      id: 2,
      title: "Urban Pulse",
      year: 2024,
      medium: "Mixed Media",
      series: "City Life",
      size: "Extra Large",
      image: "/placeholder.svg?height=500&width=400",
      tags: ["geometric", "urban", "colorful"],
    },
    {
      id: 3,
      title: "Sunset Reverie",
      year: 2023,
      medium: "Oil on Canvas",
      series: "Natural Light",
      size: "Medium",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["landscape", "warm", "sunset"],
    },
  ]

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        if (selectedYear !== "all") params.append("year", selectedYear)
        if (selectedMedium !== "all") params.append("medium", selectedMedium)
        if (selectedSeries !== "all") params.append("series", selectedSeries)
        if (searchTerm) params.append("search", searchTerm)
        const response = await fetch(`/api/artworks?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setArtworks(data.data || mockArtworks)
          setTotal(data.total || 0)
        } else {
          setArtworks(mockArtworks)
          setTotal(mockArtworks.length)
        }
      } catch (error) {
        console.error("Error fetching artworks:", error)
        setArtworks(mockArtworks)
        setTotal(mockArtworks.length)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, selectedYear, selectedMedium, selectedSeries, searchTerm])

  const uniqueYears = [...new Set(artworks.map(artwork => artwork.year))].sort((a, b) => b - a)
  const uniqueMediums = [...new Set(artworks.map(artwork => artwork.medium.toLowerCase()))]
  .map(medium => 
    // Capitalize first letter of each word for display
    medium.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  )
  const uniqueSeries = [...new Set(artworks.map(artwork => artwork.series))]

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesYear = selectedYear === "all" || artwork.year.toString() === selectedYear
    const matchesMedium = selectedMedium === "all" || artwork.medium.toLowerCase() === selectedMedium.toLowerCase()
    const matchesSeries = selectedSeries === "all" || artwork.series === selectedSeries

    return matchesSearch && matchesYear && matchesMedium && matchesSeries
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-secondary">Loading gallery...</p>
          </div>
        </div>
      </div>
    )
  }

  // Pagination controls
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Gallery</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Explore the complete collection of contemporary artworks
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                <SelectTrigger>
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mediums</SelectItem>
                  {uniqueMediums.map((medium) => (
                    <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger>
                  <SelectValue placeholder="Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  {uniqueSeries.map((series) => (
                    <SelectItem key={series} value={series}>{series}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "masonry" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("masonry")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {artworks.length} of {total} artworks
          </p>
        </div>

        <div
          className={viewMode === "masonry" ? "masonry-grid" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
        >
          {filteredArtworks.map((artwork) => (
            <Link key={artwork._id || artwork.id} href={`/artwork/${artwork._id || artwork.id}`}>
              <Card
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${viewMode === "masonry" ? "masonry-item" : ""}`}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {artwork.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {artwork.year}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{artwork.medium}</p>
                  <p className="text-sm text-muted-foreground mb-3">{artwork.series}</p>

                  <div className="flex flex-wrap gap-1">
                    {artwork.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No artworks found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
