"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageIcon, ArrowRight } from "lucide-react"

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
}

// Parse year string like "2024" or "2023–2024" → latest year as number for sorting
function parseYear(year: string): number {
  const matches = (year || "").match(/\d{4}/g)
  if (!matches) return 0
  return Math.max(...matches.map(Number))
}

export default function SeriesPage() {
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/series")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.data)) setSeriesData(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Sort by year descending (latest first)
  const sorted = [...seriesData].sort((a, b) => parseYear(b.year) - parseYear(a.year))
  const featured = sorted.find((s) => s.featured)
  const rest = sorted.filter((s) => !s.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-3 font-sans">Works</p>
            <div className="h-10 w-48 bg-muted animate-pulse rounded-sm mx-auto mb-3" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-muted animate-pulse aspect-[4/3]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (seriesData.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl font-light text-muted-foreground mb-2">No series yet</p>
          <p className="text-sm text-muted-foreground">Series will appear here once artworks are grouped.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">

        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-3 font-sans">Works</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-3">Series & Collections</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Thematic collections representing different periods and explorations in my artistic journey
          </p>
        </div>

        {/* Featured series */}
        {featured && (
          <div className="mb-16 border border-border rounded-sm overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto min-h-[320px]">
                <Image
                  src={featured.coverImage || "/placeholder.svg"}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground rounded-none text-xs tracking-widest uppercase font-sans">
                  Featured
                </Badge>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center bg-card">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5 font-sans tracking-wide">
                  <span>{featured.year}</span>
                  <span className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {featured.artworkCount} {featured.artworkCount === 1 ? "work" : "works"}
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-light mb-4">{featured.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{featured.description}</p>

                {featured.statement && (
                  <blockquote className="border-l-2 border-accent pl-4 italic text-foreground/80 text-sm mb-6 leading-relaxed">
                    "{featured.statement}"
                  </blockquote>
                )}

                {featured.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-7">
                    {featured.images.map((img, i) => (
                      <div key={i} className="aspect-square relative overflow-hidden rounded-sm bg-muted">
                        <Image src={img || "/placeholder.svg"} alt="" fill sizes="30vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <Link href={`/series/${featured._id}`}>
                  <Button className="rounded-none font-sans tracking-wide">
                    Explore Series
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* All other series — sorted by year descending */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((series) => (
            <Link key={series._id} href={`/series/${series._id}`}>
              <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 h-full rounded-sm border-border overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={series.coverImage || "/placeholder.svg"}
                    alt={series.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <span>{series.year}</span>
                      <span className="opacity-50">·</span>
                      <ImageIcon className="w-3 h-3 opacity-70" />
                      <span>{series.artworkCount} {series.artworkCount === 1 ? "work" : "works"}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-light mb-2 group-hover:text-accent transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {series.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
