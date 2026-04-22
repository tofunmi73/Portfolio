"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Calendar } from "lucide-react"

interface Education {
  title: string
  institution: string
  year: string
}

interface Exhibition {
  title: string
  venue: string
  year: string
  type: string
}

interface AboutData {
  profileImage: string
  name: string
  bio: string
  location: string
  activeSince: string
  email: string
  singulartUrl: string
  photoCaption: string
  photoSubcaption: string
  statementParagraphs: string[]
  education: Education[]
  selectedExhibitions: Exhibition[]
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data) })
      .catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-16 space-y-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="h-6 w-24 bg-muted animate-pulse rounded-sm" />
              <div className="h-20 w-3/4 bg-muted animate-pulse rounded-sm" />
              <div className="h-32 bg-muted animate-pulse rounded-sm" />
            </div>
            <div className="aspect-square bg-muted animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-7">
            <div>
              <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4 font-sans">Artist</p>
              <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground leading-tight">
                {data.name.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{data.bio}</p>

            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{data.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Active since {data.activeSince}</span>
              </div>
            </div>

            {data.singulartUrl && (
              <div>
                <a
                  href={data.singulartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#0b08c8",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#c8c6ff" }}>
                    Verified artist on Singulart
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-sm shadow-xl">
              <Image
                src={data.profileImage || "/placeholder.jpg"}
                alt={`${data.name} — Artist Portrait`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
                unoptimized={data.profileImage?.includes("i.imgur.com")}
              />
            </div>
            {(data.photoCaption || data.photoSubcaption) && (
              <div className="absolute -bottom-4 -right-4 bg-card border border-border p-4 shadow-sm">
                {data.photoCaption && (
                  <p className="text-xs font-sans text-muted-foreground tracking-wide">{data.photoCaption}</p>
                )}
                {data.photoSubcaption && (
                  <p className="text-xs text-muted-foreground/60">{data.photoSubcaption}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Artist Statement */}
        {data.statementParagraphs?.length > 0 && (
          <div className="mb-20 border-l-2 border-accent pl-8 py-2 max-w-3xl">
            <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-6 font-sans">Statement</p>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {data.statementParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Education & Exhibitions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {data.education?.length > 0 && (
            <Card className="bg-card border-border rounded-sm">
              <CardContent className="p-8">
                <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-6 font-sans">Education</p>
                <div className="space-y-5">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      {i > 0 && <div className="w-6 h-px bg-border mb-5" />}
                      <h4 className="font-serif text-lg font-light">{edu.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {[edu.institution, edu.year].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.selectedExhibitions?.length > 0 && (
            <Card className="bg-card border-border rounded-sm">
              <CardContent className="p-8">
                <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-6 font-sans">
                  Selected Exhibitions
                </p>
                <div className="space-y-5">
                  {data.selectedExhibitions.map((ex, i) => (
                    <div key={i}>
                      {i > 0 && <div className="w-6 h-px bg-border mb-5" />}
                      <h4 className="font-serif text-lg font-light">{ex.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {ex.venue}{ex.year ? `, ${ex.year}` : ""}
                      </p>
                      {ex.type && (
                        <Badge variant="secondary" className="text-xs mt-1 rounded-none font-sans tracking-wide">
                          {ex.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact */}
        <Card className="bg-card border-border rounded-sm max-w-lg">
          <CardContent className="p-8">
            <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-6 font-sans">Get in Touch</p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Interested in commissioning a piece, purchasing artwork, or collaborating? I'd love to hear from you.
            </p>
            <div className="space-y-3 mb-8 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{data.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{data.location}</span>
              </div>
            </div>
            <Button asChild className="rounded-none px-8 font-sans tracking-wide">
              <a href={`mailto:${data.email}?subject=Commission Inquiry&body=Hi, I'm interested in your artwork...`}>
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </a>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
