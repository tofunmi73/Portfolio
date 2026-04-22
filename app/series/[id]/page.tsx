"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"

// Use the same Series interface, but some fields might be optional
interface Series {
  _id: string
  title: string
  description: string
  statement: string
  year: string
  images: string[]
}

// This component receives `params` which contains the dynamic route segment
export default function SingleSeriesPage({ params }: { params: { id: string } }) {
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) {
      setError("No series ID provided")
      setLoading(false)
      return
    }

    const fetchSeriesDetails = async () => {
      try {
        console.log("Fetching series with ID:", params.id)
        
        // Fetch series details
        const seriesResponse = await fetch(`/api/series/${params.id}`)
        
        if (!seriesResponse.ok) {
          if (seriesResponse.status === 404) {
            setError("Series not found")
          } else {
            setError(`Failed to fetch series: ${seriesResponse.status}`)
          }
          setLoading(false)
          return
        }

        const seriesData = await seriesResponse.json()
        console.log("Series data received:", seriesData)
        
        if (!seriesData.data) {
          setError("Invalid series data received")
          setLoading(false)
          return
        }

        // Since your DB already has images array, just use it directly
        setSeries({
          ...seriesData.data,
          images: seriesData.data.images || []
        })

      } catch (error) {
        console.error("Error fetching series details:", error)
        setError("Failed to load series details")
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">
          {error || "Series Not Found"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {error === "Series not found" 
            ? "The series you are looking for does not exist." 
            : "There was an error loading the series details. Please try again."}
        </p>
        <Link href="/series">
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Series
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/series" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Series
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{series.title}</h1>
          <div className="flex items-center justify-center text-lg text-muted-foreground">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{series.year}</span>
          </div>
        </div>

        {series.description && (
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">{series.description}</p>
          </div>
        )}

        {series.statement && (
          <blockquote className="max-w-3xl mx-auto text-center border-l-4 border-primary pl-6 italic text-xl text-foreground my-12">
            "{series.statement}"
          </blockquote>
        )}

        {/* Artworks Gallery */}
        {series.images && series.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {series.images.map((image, index) => (
              <div key={index} className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md group">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${series.title} artwork ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No artworks found for this series.</p>
          </div>
        )}
      </div>
    </div>
  )
}