"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogIn, LogOut, UserIcon, Plus, Save, Trash2, Edit, AlertCircle } from "lucide-react"

interface Artwork {
  _id?: string
  title: string
  year: number
  medium: string
  dimensions: string
  series: string
  image: string
  description: string
  featured: boolean
  tags: string[]
}

interface BlogPost {
  _id?: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  image: string
  tags: string[]
  featured: boolean
}

interface Exhibition {
  _id?: string
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
  featured: boolean
}

interface Stat {
  _id?: string
  label: string
  value: number
  suffix: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

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
  videoUrl?: string
}

interface MaterialCategory {
  _id?: string
  category: string
  items: string[]
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Artworks state
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artworkForm, setArtworkForm] = useState<Artwork>({
    title: "",
    year: new Date().getFullYear(),
    medium: "",
    dimensions: "",
    series: "",
    image: "",
    description: "",
    featured: false,
    tags: [],
  })
  const [editingArtwork, setEditingArtwork] = useState<string | null>(null)
  // Pagination state for artworks
  const [artworksPage, setArtworksPage] = useState(1)
  const [artworksLimit, setArtworksLimit] = useState(12)
  const [artworksTotal, setArtworksTotal] = useState(0)

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [blogForm, setBlogForm] = useState<BlogPost>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    readTime: "",
    image: "",
    tags: [],
    featured: false,
  })
  const [editingBlog, setEditingBlog] = useState<string | null>(null)

  // Exhibitions state
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [exhibitionForm, setExhibitionForm] = useState<Exhibition>({
    title: "",
    venue: "",
    location: "",
    startDate: "",
    endDate: "",
    type: "Solo Exhibition",
    status: "upcoming",
    description: "",
    artworksDisplayed: [],
    images: [],
    featured: false,
  })
  const [editingExhibition, setEditingExhibition] = useState<string | null>(null)

  // Stats state
  const [stats, setStats] = useState<Stat[]>([
    { label: "Artworks Created", value: 0, suffix: "+" },
    { label: "Exhibitions", value: 4, suffix: "" },
    { label: "Years Active", value: 6, suffix: "" },
    { label: "Awards Won", value: 0, suffix: "" },
  ])
  
  // Process state
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [processStepForm, setProcessStepForm] = useState<ProcessStep>({
    id: 1,
    title: "",
    description: "",
    image: "",
    details: "",
    tools: [],
  })
  const [editingProcessStep, setEditingProcessStep] = useState<string | null>(null)

  const [studioImages, setStudioImages] = useState<StudioImage[]>([])
  const [studioImageForm, setStudioImageForm] = useState<StudioImage>({
    title: "",
    image: "",
    description: "",
  })
  const [editingStudioImage, setEditingStudioImage] = useState<string | null>(null)

  const [timelapseVideos, setTimelapseVideos] = useState<TimelapseVideo[]>([])
  const [videoForm, setVideoForm] = useState<TimelapseVideo>({
    title: "",
    thumbnail: "",
    duration: "",
    description: "",
    videoUrl: "",
  })
  const [editingVideo, setEditingVideo] = useState<string | null>(null)

  const [materials, setMaterials] = useState<MaterialCategory[]>([])
  const [materialForm, setMaterialForm] = useState<MaterialCategory>({
    category: "",
    items: [],
  })
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  // Check if user is already logged in on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isLoggedIn && adminUser) {
      fetchAllData()
      // Set author name for blog posts
      setBlogForm((prev) => ({ ...prev, author: adminUser.name }))
    }
  }, [isLoggedIn, adminUser])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setAdminUser(data.user)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    }
  }

  const fetchAllData = async () => {
    await Promise.all([
      fetchArtworks(artworksPage, artworksLimit),
      fetchBlogPosts(),
      fetchExhibitions(),
      fetchStats(),
      fetchProcessSteps(),
      fetchStudioImages(),
      fetchTimelapseVideos(),
      fetchMaterials(),
    ])
  }

  const fetchArtworks = async (page = artworksPage, limit = artworksLimit) => {
    try {
      const response = await fetch(`/api/artworks?page=${page}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setArtworks(data.data || [])
        setArtworksTotal(data.total || 0)
      }
    } catch (error) {
      console.error("Error fetching artworks:", error)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    }
  }

  const fetchExhibitions = async () => {
    try {
      const response = await fetch("/api/exhibitions")
      if (response.ok) {
        const data = await response.json()
        setExhibitions(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching exhibitions:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.data ?? stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (response.ok) {
        setAdminUser(data.user)
        setIsLoggedIn(true)
        setLoginForm({ email: "", password: "" })
      } else {
        setLoginError(data.error || "Login failed")
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
      console.error("Login error:", error)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsLoggedIn(false)
      setAdminUser(null)
      setLoginForm({ email: "", password: "" })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Artwork handlers
  const handleArtworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingArtwork ? `/api/artworks/${editingArtwork}` : "/api/artworks"
      const method = editingArtwork ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artworkForm),
      })

      if (response.ok) {
        await fetchArtworks()
        await updateSeriesCollection(artworkForm)
        resetArtworkForm()
        setEditingArtwork(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving artwork:", error)
      alert("Error saving artwork")
    } finally {
      setLoading(false)
    }
  }

  const resetArtworkForm = () => {
    setArtworkForm({
      title: "",
      year: new Date().getFullYear(),
      medium: "",
      dimensions: "",
      series: "",
      image: "",
      description: "",
      featured: false,
      tags: [],
    })
  }

  const handleEditArtwork = (artwork: Artwork) => {
    setArtworkForm(artwork)
    setEditingArtwork(artwork._id || "")
  }

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return

    try {
      const response = await fetch(`/api/artworks/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchArtworks()
      }
    } catch (error) {
      console.error("Error deleting artwork:", error)
    }
  }

  // Blog post handlers
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingBlog ? `/api/blog/${editingBlog}` : "/api/blog"
      const method = editingBlog ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogForm),
      })

      if (response.ok) {
        await fetchBlogPosts()
        resetBlogForm()
        setEditingBlog(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Error saving blog post")
    } finally {
      setLoading(false)
    }
  }

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      author: adminUser?.name || "",
      date: new Date().toISOString().split("T")[0],
      readTime: "",
      image: "",
      tags: [],
      featured: false,
    })
  }

  const handleEditBlog = (blog: BlogPost) => {
    setBlogForm(blog)
    setEditingBlog(blog._id || "")
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchBlogPosts()
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
    }
  }

  // Exhibition handlers
  const handleExhibitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingExhibition ? `/api/exhibitions/${editingExhibition}` : "/api/exhibitions"
      const method = editingExhibition ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exhibitionForm),
      })

      if (response.ok) {
        await fetchExhibitions()
        resetExhibitionForm()
        setEditingExhibition(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving exhibition:", error)
      alert("Error saving exhibition")
    } finally {
      setLoading(false)
    }
  }

  const resetExhibitionForm = () => {
    setExhibitionForm({
      title: "",
      venue: "",
      location: "",
      startDate: "",
      endDate: "",
      type: "Solo Exhibition",
      status: "upcoming",
      description: "",
      artworksDisplayed: [],
      images: [],
      featured: false,
    })
  }

  const handleEditExhibition = (exhibition: Exhibition) => {
    setExhibitionForm(exhibition)
    setEditingExhibition(exhibition._id || "")
  }

  const handleDeleteExhibition = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return

    try {
      const response = await fetch(`/api/exhibitions/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchExhibitions()
      }
    } catch (error) {
      console.error("Error deleting exhibition:", error)
    }
  }

  // Stats handlers
  const handleStatsUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      })

      if (response.ok) {
        alert("Stats updated successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating stats:", error)
      alert("Error updating stats")
    } finally {
      setLoading(false)
    }
  }

  const updateStatValue = (index: number, field: keyof Stat, value: string | number) => {
    setStats((prev) => prev.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)))
  }
  // Process fetch functions
  const fetchProcessSteps = async () => {
    try {
      const response = await fetch("/api/process/steps")
      if (response.ok) {
        const data = await response.json()
        setProcessSteps(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching process steps:", error)
    }
  }

  const fetchStudioImages = async () => {
    try {
      const response = await fetch("/api/process/studio")
      if (response.ok) {
        const data = await response.json()
        setStudioImages(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching studio images:", error)
    }
  }

  const fetchTimelapseVideos = async () => {
    try {
      const response = await fetch("/api/process/videos")
      if (response.ok) {
        const data = await response.json()
        setTimelapseVideos(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    }
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/process/materials")
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
    }
  }

  // Process step handlers
  const handleProcessStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingProcessStep ? `/api/process/steps/${editingProcessStep}` : "/api/process/steps"
      const method = editingProcessStep ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processStepForm),
      })

      if (response.ok) {
        await fetchProcessSteps()
        resetProcessStepForm()
        setEditingProcessStep(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving process step:", error)
      alert("Error saving process step")
    } finally {
      setLoading(false)
    }
  }

  const resetProcessStepForm = () => {
    setProcessStepForm({
      id: processSteps.length + 1,
      title: "",
      description: "",
      image: "",
      details: "",
      tools: [],
    })
  }

  const handleEditProcessStep = (step: ProcessStep) => {
    setProcessStepForm(step)
    setEditingProcessStep(step._id || "")
  }

  const handleDeleteProcessStep = async (id: string) => {
    if (!confirm("Are you sure you want to delete this process step?")) return

    try {
      const response = await fetch(`/api/process/steps/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchProcessSteps()
      }
    } catch (error) {
      console.error("Error deleting process step:", error)
    }
  }

  // Studio image handlers
  const handleStudioImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingStudioImage ? `/api/process/studio/${editingStudioImage}` : "/api/process/studio"
      const method = editingStudioImage ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studioImageForm),
      })

      if (response.ok) {
        await fetchStudioImages()
        resetStudioImageForm()
        setEditingStudioImage(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving studio image:", error)
      alert("Error saving studio image")
    } finally {
      setLoading(false)
    }
  }

  const resetStudioImageForm = () => {
    setStudioImageForm({
      title: "",
      image: "",
      description: "",
    })
  }

  const handleEditStudioImage = (image: StudioImage) => {
    setStudioImageForm(image)
    setEditingStudioImage(image._id || "")
  }

  const handleDeleteStudioImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this studio image?")) return

    try {
      const response = await fetch(`/api/process/studio/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchStudioImages()
      }
    } catch (error) {
      console.error("Error deleting studio image:", error)
    }
  }

  // Video handlers
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingVideo ? `/api/process/videos/${editingVideo}` : "/api/process/videos"
      const method = editingVideo ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      })

      if (response.ok) {
        await fetchTimelapseVideos()
        resetVideoForm()
        setEditingVideo(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving video:", error)
      alert("Error saving video")
    } finally {
      setLoading(false)
    }
  }

  const resetVideoForm = () => {
    setVideoForm({
      title: "",
      thumbnail: "",
      duration: "",
      description: "",
      videoUrl: "",
    })
  }

  const handleEditVideo = (video: TimelapseVideo) => {
    setVideoForm(video)
    setEditingVideo(video._id || "")
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      const response = await fetch(`/api/process/videos/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchTimelapseVideos()
      }
    } catch (error) {
      console.error("Error deleting video:", error)
    }
  }

  // Material handlers
  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingMaterial ? `/api/process/materials/${editingMaterial}` : "/api/process/materials"
      const method = editingMaterial ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialForm),
      })

      if (response.ok) {
        await fetchMaterials()
        resetMaterialForm()
        setEditingMaterial(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error saving material:", error)
      alert("Error saving material")
    } finally {
      setLoading(false)
    }
  }

  const resetMaterialForm = () => {
    setMaterialForm({
      category: "",
      items: [],
    })
  }

  const handleEditMaterial = (material: MaterialCategory) => {
    setMaterialForm(material)
    setEditingMaterial(material._id || "")
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material category?")) return

    try {
      const response = await fetch(`/api/process/materials/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchMaterials()
      }
    } catch (error) {
      console.error("Error deleting material:", error)
    }
  }

  const updateSeriesCollection = async (artworkData) => {
    if (!artworkData.series || artworkData.series.toLowerCase() === 'n/a') {
      return // Don't create series for N/A
    }
  
    try {
      const response = await fetch('/api/series/update-from-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesTitle: artworkData.series,
          artworkData: artworkData
        })
      })
  
      if (!response.ok) {
        console.error('Failed to update series collection')
      }
    } catch (error) {
      console.error('Error updating series collection:', error)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <UserIcon className="w-6 h-6" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  disabled={loginLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  disabled={loginLoading}
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loginLoading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loginLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Welcome back, {adminUser?.name}! Manage your portfolio content</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="artworks">
          <TabsList className="grid w-full grid-cols-5 bg-card">
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="blog">Journal</TabsTrigger>
            <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Artworks Tab */}
          <TabsContent value="artworks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Artworks</h2>
              <Button
                onClick={() => {
                  resetArtworkForm()
                  setEditingArtwork(null)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Artwork
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{editingArtwork ? "Edit Artwork" : "Add New Artwork"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleArtworkSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="artwork-title">Title</Label>
                      <Input
                        id="artwork-title"
                        value={artworkForm.title}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Artwork title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="artwork-year">Year</Label>
                      <Input
                        id="artwork-year"
                        type="number"
                        value={artworkForm.year}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="artwork-medium">Medium</Label>
                      <Input
                        id="artwork-medium"
                        value={artworkForm.medium}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, medium: e.target.value }))}
                        placeholder="e.g., Acrylic on Canvas"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="artwork-dimensions">Dimensions</Label>
                      <Input
                        id="artwork-dimensions"
                        value={artworkForm.dimensions}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                        placeholder='e.g., 48" x 36"'
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="artwork-series">Series</Label>
                      <Input
                        id="artwork-series"
                        value={artworkForm.series}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, series: e.target.value }))}
                        placeholder="e.g., Ocean Dreams"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="artwork-image">Image URL</Label>
                      <Input
                        id="artwork-image"
                        value={artworkForm.image}
                        onChange={(e) => setArtworkForm((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="Image URL"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="artwork-description">Description</Label>
                    <Textarea
                      id="artwork-description"
                      value={artworkForm.description}
                      onChange={(e) => setArtworkForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Artwork description and story"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="artwork-tags">Tags (comma-separated)</Label>
                    <Input
                      id="artwork-tags"
                      value={artworkForm.tags.join(", ")}
                      onChange={(e) =>
                        setArtworkForm((prev) => ({
                          ...prev,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="abstract, ocean, blue, movement"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="artwork-featured"
                      checked={artworkForm.featured}
                      onCheckedChange={(checked) => setArtworkForm((prev) => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="artwork-featured">Featured artwork</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : editingArtwork ? "Update Artwork" : "Save Artwork"}
                    </Button>

                    {editingArtwork && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetArtworkForm()
                          setEditingArtwork(null)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Artworks ({artworksTotal})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artworks.map((artwork) => (
                    <div key={artwork._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{artwork.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {artwork.year} • {artwork.medium} • {artwork.series}
                          {artwork.featured && <span className="ml-2 text-purple-600">★ Featured</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditArtwork(artwork)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => artwork._id && handleDeleteArtwork(artwork._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={artworksPage === 1}
                    onClick={() => setArtworksPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {artworksPage} of {Math.ceil(artworksTotal / artworksLimit) || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={artworksPage >= Math.ceil(artworksTotal / artworksLimit)}
                    onClick={() => setArtworksPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog/Journal Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Journal Posts</h2>
              <Button
                onClick={() => {
                  resetBlogForm()
                  setEditingBlog(null)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Post
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blog-title">Title</Label>
                      <Input
                        id="blog-title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Blog post title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-readtime">Read Time</Label>
                      <Input
                        id="blog-readtime"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, readTime: e.target.value }))}
                        placeholder="e.g., 5 min read"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="blog-excerpt">Excerpt</Label>
                    <Textarea
                      id="blog-excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea
                      id="blog-content"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Full blog post content"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blog-image">Image URL</Label>
                      <Input
                        id="blog-image"
                        value={blogForm.image}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="Featured image URL"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-date">Date</Label>
                      <Input
                        id="blog-date"
                        type="date"
                        value={blogForm.date}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                    <Input
                      id="blog-tags"
                      value={blogForm.tags.join(", ")}
                      onChange={(e) =>
                        setBlogForm((prev) => ({
                          ...prev,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="process, inspiration, technique"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="blog-featured"
                      checked={blogForm.featured}
                      onCheckedChange={(checked) => setBlogForm((prev) => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="blog-featured">Featured post</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : editingBlog ? "Update Post" : "Save Post"}
                    </Button>

                    {editingBlog && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetBlogForm()
                          setEditingBlog(null)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Blog Posts ({blogPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.date).toLocaleDateString()} • {post.readTime}
                          {post.featured && <span className="ml-2 text-purple-600">★ Featured</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditBlog(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => post._id && handleDeleteBlog(post._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exhibitions Tab */}
          <TabsContent value="exhibitions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Exhibitions</h2>
              <Button
                onClick={() => {
                  resetExhibitionForm()
                  setEditingExhibition(null)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Exhibition
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{editingExhibition ? "Edit Exhibition" : "Add New Exhibition"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExhibitionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exhibition-title">Title</Label>
                      <Input
                        id="exhibition-title"
                        value={exhibitionForm.title}
                        onChange={(e) => setExhibitionForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Exhibition title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibition-venue">Venue</Label>
                      <Input
                        id="exhibition-venue"
                        value={exhibitionForm.venue}
                        onChange={(e) => setExhibitionForm((prev) => ({ ...prev, venue: e.target.value }))}
                        placeholder="Gallery or museum name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exhibition-location">Location</Label>
                      <Input
                        id="exhibition-location"
                        value={exhibitionForm.location}
                        onChange={(e) => setExhibitionForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State/Country"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibition-type">Type</Label>
                      <Select
                        value={exhibitionForm.type}
                        onValueChange={(value) => setExhibitionForm((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solo Exhibition">Solo Exhibition</SelectItem>
                          <SelectItem value="Group Exhibition">Group Exhibition</SelectItem>
                          <SelectItem value="Art Fair">Art Fair</SelectItem>
                          <SelectItem value="Gallery Show">Gallery Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="exhibition-start">Start Date</Label>
                      <Input
                        id="exhibition-start"
                        type="date"
                        value={exhibitionForm.startDate}
                        onChange={(e) => setExhibitionForm((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibition-end">End Date</Label>
                      <Input
                        id="exhibition-end"
                        type="date"
                        value={exhibitionForm.endDate}
                        onChange={(e) => setExhibitionForm((prev) => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibition-status">Status</Label>
                      <Select
                        value={exhibitionForm.status}
                        onValueChange={(value) => setExhibitionForm((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="past">Past</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exhibition-description">Description</Label>
                    <Textarea
                      id="exhibition-description"
                      value={exhibitionForm.description}
                      onChange={(e) => setExhibitionForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Exhibition description"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="exhibition-artworks">Artworks Displayed (comma-separated)</Label>
                    <Input
                      id="exhibition-artworks"
                      value={exhibitionForm.artworksDisplayed.join(", ")}
                      onChange={(e) =>
                        setExhibitionForm((prev) => ({
                          ...prev,
                          artworksDisplayed: e.target.value
                            .split(",")
                            .map((artwork) => artwork.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="Artwork titles"
                    />
                  </div>

                  <div>
                    <Label htmlFor="exhibition-images">Image URLs (comma-separated)</Label>
                    <Input
                      id="exhibition-images"
                      value={exhibitionForm.images.join(", ")}
                      onChange={(e) =>
                        setExhibitionForm((prev) => ({
                          ...prev,
                          images: e.target.value
                            .split(",")
                            .map((url) => url.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="Image URLs"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exhibition-featured"
                      checked={exhibitionForm.featured}
                      onCheckedChange={(checked) => setExhibitionForm((prev) => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="exhibition-featured">Featured exhibition</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : editingExhibition ? "Update Exhibition" : "Save Exhibition"}
                    </Button>

                    {editingExhibition && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetExhibitionForm()
                          setEditingExhibition(null)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Exhibitions ({exhibitions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exhibitions.map((exhibition) => (
                    <div key={exhibition._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{exhibition.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exhibition.venue} • {exhibition.status}
                          {exhibition.featured && <span className="ml-2 text-purple-600">★ Featured</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditExhibition(exhibition)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => exhibition._id && handleDeleteExhibition(exhibition._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-6">
            <h2 className="text-2xl font-semibold">Manage Process Content</h2>

            <Tabs defaultValue="steps" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card">
                <TabsTrigger value="steps">Process Steps</TabsTrigger>
                <TabsTrigger value="studio">Studio Images</TabsTrigger>
                <TabsTrigger value="videos">Timelapse Videos</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>

              {/* Process Steps */}
              <TabsContent value="steps" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Process Steps</h3>
                  <Button
                    onClick={() => {
                      resetProcessStepForm()
                      setEditingProcessStep(null)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Process Step
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{editingProcessStep ? "Edit Process Step" : "Add Process Step"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProcessStepSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="step-id">Step Number</Label>
                          <Input
                            id="step-id"
                            type="number"
                            value={processStepForm.id}
                            onChange={(e) =>
                              setProcessStepForm((prev) => ({ ...prev, id: Number.parseInt(e.target.value) }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="step-title">Title</Label>
                          <Input
                            id="step-title"
                            value={processStepForm.title}
                            onChange={(e) => setProcessStepForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Step title"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="step-description">Description</Label>
                        <Textarea
                          id="step-description"
                          value={processStepForm.description}
                          onChange={(e) => setProcessStepForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="step-details">Details</Label>
                        <Textarea
                          id="step-details"
                          value={processStepForm.details}
                          onChange={(e) => setProcessStepForm((prev) => ({ ...prev, details: e.target.value }))}
                          placeholder="Detailed explanation"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="step-image">Image URL</Label>
                        <Input
                          id="step-image"
                          value={processStepForm.image}
                          onChange={(e) => setProcessStepForm((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="Image URL"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="step-tools">Tools & Materials (comma-separated)</Label>
                        <Input
                          id="step-tools"
                          value={processStepForm.tools.join(", ")}
                          onChange={(e) =>
                            setProcessStepForm((prev) => ({
                              ...prev,
                              tools: e.target.value
                                .split(",")
                                .map((tool) => tool.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Brushes, Canvas, Acrylic Paint"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : editingProcessStep ? "Update Step" : "Save Step"}
                        </Button>
                        {editingProcessStep && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetProcessStepForm()
                              setEditingProcessStep(null)
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Process Steps ({processSteps.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {processSteps
                        .sort((a, b) => a.id - b.id)
                        .map((step) => (
                          <div key={step._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                Step {step.id}: {step.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProcessStep(step)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => step._id && handleDeleteProcessStep(step._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Studio Images */}
              <TabsContent value="studio" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Studio Images</h3>
                  <Button
                    onClick={() => {
                      resetStudioImageForm()
                      setEditingStudioImage(null)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Studio Image
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{editingStudioImage ? "Edit Studio Image" : "Add Studio Image"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStudioImageSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="studio-title">Title</Label>
                        <Input
                          id="studio-title"
                          value={studioImageForm.title}
                          onChange={(e) => setStudioImageForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Image title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="studio-image">Image URL</Label>
                        <Input
                          id="studio-image"
                          value={studioImageForm.image}
                          onChange={(e) => setStudioImageForm((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="Image URL"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="studio-description">Description</Label>
                        <Textarea
                          id="studio-description"
                          value={studioImageForm.description}
                          onChange={(e) => setStudioImageForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Image description"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : editingStudioImage ? "Update Image" : "Save Image"}
                        </Button>
                        {editingStudioImage && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetStudioImageForm()
                              setEditingStudioImage(null)
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Studio Images ({studioImages.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studioImages.map((image) => (
                        <div key={image._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{image.title}</h4>
                            <p className="text-sm text-muted-foreground">{image.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditStudioImage(image)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => image._id && handleDeleteStudioImage(image._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timelapse Videos */}
              <TabsContent value="videos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Timelapse Videos</h3>
                  <Button
                    onClick={() => {
                      resetVideoForm()
                      setEditingVideo(null)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{editingVideo ? "Edit Video" : "Add Video"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="video-title">Title</Label>
                        <Input
                          id="video-title"
                          value={videoForm.title}
                          onChange={(e) => setVideoForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Video title"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
                          <Input
                            id="video-thumbnail"
                            value={videoForm.thumbnail}
                            onChange={(e) => setVideoForm((prev) => ({ ...prev, thumbnail: e.target.value }))}
                            placeholder="Thumbnail image URL"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="video-duration">Duration</Label>
                          <Input
                            id="video-duration"
                            value={videoForm.duration}
                            onChange={(e) => setVideoForm((prev) => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g., 3:45"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="video-url">Video URL (optional)</Label>
                        <Input
                          id="video-url"
                          value={videoForm.videoUrl || ""}
                          onChange={(e) => setVideoForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="YouTube, Vimeo, or direct video URL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="video-description">Description</Label>
                        <Textarea
                          id="video-description"
                          value={videoForm.description}
                          onChange={(e) => setVideoForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Video description"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : editingVideo ? "Update Video" : "Save Video"}
                        </Button>
                        {editingVideo && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetVideoForm()
                              setEditingVideo(null)
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Videos ({timelapseVideos.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timelapseVideos.map((video) => (
                        <div key={video._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{video.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {video.duration} • {video.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditVideo(video)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => video._id && handleDeleteVideo(video._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials */}
              <TabsContent value="materials" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Materials & Tools</h3>
                  <Button
                    onClick={() => {
                      resetMaterialForm()
                      setEditingMaterial(null)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material Category
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{editingMaterial ? "Edit Material Category" : "Add Material Category"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMaterialSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="material-category">Category Name</Label>
                        <Input
                          id="material-category"
                          value={materialForm.category}
                          onChange={(e) => setMaterialForm((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Paints, Brushes, Canvas"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="material-items">Items (comma-separated)</Label>
                        <Textarea
                          id="material-items"
                          value={materialForm.items.join(", ")}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              items: e.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Golden Heavy Body Acrylics, Liquitex Professional, Daniel Smith Watercolors"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : editingMaterial ? "Update Category" : "Save Category"}
                        </Button>
                        {editingMaterial && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetMaterialForm()
                              setEditingMaterial(null)
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Material Categories ({materials.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {materials.map((material) => (
                        <div key={material._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{material.category}</h4>
                            <p className="text-sm text-muted-foreground">{material.items.length} items</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditMaterial(material)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => material._id && handleDeleteMaterial(material._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-semibold">Manage Statistics</h2>

            <Card>
              <CardHeader>
                <CardTitle>Update Homepage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStatValue(index, "label", e.target.value)}
                        placeholder="Stat label"
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={stat.value}
                        onChange={(e) => updateStatValue(index, "value", Number.parseInt(e.target.value) || 0)}
                        placeholder="Number"
                      />
                    </div>
                    <div>
                      <Label>Suffix</Label>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => updateStatValue(index, "suffix", e.target.value)}
                        placeholder="+ or empty"
                      />
                    </div>
                  </div>
                ))}

                <Button onClick={handleStatsUpdate} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Updating..." : "Update Statistics"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
