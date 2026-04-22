"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Palette, Clock } from "lucide-react"

interface ProcessStep {
  _id?: string
  id: number
  title: string
  description: string
  image: string
  details: string
  tools: string[]
}

interface StudioImage {
  _id?: string
  title: string
  image: string
  description: string
}

interface TimelapseVideo {
  _id?: string
  title: string
  thumbnail: string
  duration: string
  description: string
}

interface MaterialCategory {
  _id?: string
  category: string
  items: string[]
}

export default function ProcessPage() {
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [studioImages, setStudioImages] = useState<StudioImage[]>([])
  const [timelapseVideos, setTimelapseVideos] = useState<TimelapseVideo[]>([])
  const [materials, setMaterials] = useState<MaterialCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState(0)

  // Mock data fallbacks
  const mockProcessSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Inspiration & Concept",
      description: "Every piece begins with observation and emotional response to the world around me.",
      image: "/placeholder.svg?height=600&width=400",
      details: "I spend hours observing natural phenomena, urban landscapes, and human interactions.",
      tools: ["Sketchbook", "Watercolor pencils", "Digital camera", "Voice recorder"],
    },
  ]

  const mockStudioImages: StudioImage[] = [
    {
      title: "Main Studio Space",
      image: "/placeholder.svg?height=800&width=600",
      description: "My primary workspace with natural north light and organized tool stations.",
    },
  ]

  const mockTimelapseVideos: TimelapseVideo[] = [
    {
      title: "Ocean Dreams Series - Ethereal Waves",
      thumbnail: "/placeholder.svg?height=400&width=300",
      duration: "3:45",
      description: "Watch the complete creation of 'Ethereal Waves' from blank canvas to finished piece.",
    },
  ]

  const mockMaterials: MaterialCategory[] = [
    {
      category: "Paints",
      items: ["Golden Heavy Body Acrylics", "Liquitex Professional", "Daniel Smith Watercolors"],
    },
  ]

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const [processRes, studioRes, videosRes, materialsRes] = await Promise.all([
          fetch("/api/process/steps"),
          fetch("/api/process/studio"),
          fetch("/api/process/videos"),
          fetch("/api/process/materials"),
        ])

        const processData = processRes.ok ? await processRes.json() : { data: mockProcessSteps }
        const studioData = studioRes.ok ? await studioRes.json() : { data: mockStudioImages }
        const videosData = videosRes.ok ? await videosRes.json() : { data: mockTimelapseVideos }
        const materialsData = materialsRes.ok ? await materialsRes.json() : { data: mockMaterials }

        setProcessSteps(processData.data || mockProcessSteps)
        setStudioImages(studioData.data || mockStudioImages)
        setTimelapseVideos(videosData.data || mockTimelapseVideos)
        setMaterials(materialsData.data || mockMaterials)
      } catch (error) {
        console.error("Error fetching process data:", error)
        setProcessSteps(mockProcessSteps)
        setStudioImages(mockStudioImages)
        setTimelapseVideos(mockTimelapseVideos)
        setMaterials(mockMaterials)
      } finally {
        setLoading(false)
      }
    }

    fetchProcessData()
  }, [])

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Process & Studio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An intimate look into my creative process, studio practice, and the techniques behind the art
          </p>
        </div>

        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="process">Creative Process</TabsTrigger>
            <TabsTrigger value="studio">Studio Tour</TabsTrigger>
            <TabsTrigger value="videos">Time-lapse Videos</TabsTrigger>
            <TabsTrigger value="materials">Materials & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="process" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">My Creative Process</h2>
                {processSteps?.map((step, index) => (
                  <Card
                    key={step._id || step.id}
                    className={`bg-card cursor-pointer transition-all duration-300 ${
                      selectedStep === index ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedStep(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedStep === index ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                          }`}
                        >
                          {step.id}
                        </div>
                        <div>
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {processSteps.length > 0 && (
                <div className="sticky top-8">
                  <Card className="bg-card overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={processSteps[selectedStep]?.image || "/placeholder.svg"}
                        alt={processSteps[selectedStep]?.title || "Process step"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3">{processSteps[selectedStep]?.title}</h3>
                      <p className="text-foreground mb-4 leading-relaxed">{processSteps[selectedStep]?.details}</p>
                      <div>
                        <h4 className="font-semibold mb-2">Tools & Materials:</h4>
                        <div className="flex flex-wrap gap-2">
                          {processSteps[selectedStep]?.tools?.map((tool) => (
                            <Badge key={tool} variant="outline">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="studio" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Studio Tour</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Take a virtual tour of my San Francisco studio space where all the magic happens
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studioImages?.map((studio, index) => (
                <Card key={studio._id || index} className="bg-card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3]">
                    <Image src={studio.image || "/placeholder.svg"} alt={studio.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{studio.title}</h3>
                    <p className="text-sm text-muted-foreground">{studio.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Time-lapse Videos</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Watch the creative process unfold from start to finish
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {timelapseVideos?.map((video, index) => (
                <Card
                  key={video._id || index}
                  className="bg-card overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Materials & Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The carefully selected materials and tools that bring my artistic vision to life
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {materials?.map((category, index) => (
                <Card key={category._id || index} className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Palette className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
