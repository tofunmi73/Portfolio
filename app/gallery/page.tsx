"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

interface Artwork {
  _id?: string
  title: string
  year: number
  medium: string
  series: string
  dimensions?: string
  image: string
  tags: string[]
}

interface FilterOptions {
  years: number[]
  mediums: string[]
  series: string[]
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ years: [], mediums: [], series: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedMedium, setSelectedMedium] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12
  const [total, setTotal] = useState(0)

  // Fetch filter options once on mount (reads from the full collection, not just current page)
  useEffect(() => {
    fetch("/api/artworks/filters")
      .then((r) => r.json())
      .then((data) => { if (data.success) setFilterOptions(data.data) })
      .catch(() => {})
  }, [])

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1)
  }, [selectedYear, selectedMedium, selectedSeries, searchTerm])

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

        const response = await fetch(`/api/artworks?${params}`)
        if (response.ok) {
          const data = await response.json()
          setArtworks(data.data || [])
          setTotal(data.total || 0)
        } else {
          setArtworks([])
          setTotal(0)
        }
      } catch {
        setArtworks([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [page, selectedYear, selectedMedium, selectedSeries, searchTerm])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">

        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-3 font-sans text-center">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-center mb-3">Gallery</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            Explore the complete collection of works
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 rounded-sm border-border">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-sm"
                />
              </div>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {filterOptions.years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="All Mediums" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mediums</SelectItem>
                  {filterOptions.mediums.map((medium) => (
                    <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="All Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  {filterOptions.series.map((series) => (
                    <SelectItem key={series} value={series}>{series}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${total} artwork${total !== 1 ? "s" : ""}`}
          </p>
          {(selectedYear !== "all" || selectedMedium !== "all" || selectedSeries !== "all" || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectedYear("all")
                setSelectedMedium("all")
                setSelectedSeries("all")
                setSearchTerm("")
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-muted animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-light text-muted-foreground mb-2">No artworks found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <Link key={artwork._id} href={`/artwork/${artwork._id}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 rounded-sm border-border overflow-hidden">
                  <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg font-light group-hover:text-accent transition-colors leading-tight">
                        {artwork.title}
                      </h3>
                      <span className="text-xs text-muted-foreground font-sans ml-2 shrink-0">{artwork.year}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{artwork.medium}</p>
                    <p className="text-xs text-muted-foreground/70">{artwork.series}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
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
                className="rounded-sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
