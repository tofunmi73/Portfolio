"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, User, ArrowRight } from "lucide-react"

interface BlogPost {
  _id: string
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

export default function JournalPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Mock data fallback
  const mockBlogPosts: BlogPost[] = [
    {
      _id: "1",
      title: "The Dance of Color and Emotion",
      excerpt:
        "Exploring how different color combinations can evoke specific emotional responses and the psychology behind my color choices.",
      content:
        "Color has always been my primary language of expression. In my latest series, I've been experimenting with how warm and cool tones interact...",
      author: "Artist",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["color theory", "emotion", "process"],
      featured: true,
    },
    {
      _id: "2",
      title: "Studio Diary: January Experiments",
      excerpt:
        "A behind-the-scenes look at my current experiments with fluid acrylic techniques and the unexpected discoveries along the way.",
      content:
        "This month has been all about pushing the boundaries of what's possible with fluid acrylics. I've been working on a new technique...",
      author: "Artist",
      date: "2024-01-10",
      readTime: "3 min read",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["studio", "technique", "experimentation"],
      featured: false,
    },
  ]

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append("search", searchTerm)
        if (selectedTag) params.append("tag", selectedTag)

        const response = await fetch(`/api/blog?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setBlogPosts(data.data || mockBlogPosts)
        } else {
          setBlogPosts(mockBlogPosts)
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setBlogPosts(mockBlogPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [searchTerm, selectedTag])

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags || [])))

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const featuredPost = filteredPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artist Journal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights into my creative process, inspirations, and the stories behind the art
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Posts
            </Button>
            {allTags?.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {featuredPost && !selectedTag && !searchTerm && (
          <Card className="mb-12 overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-purple-600">Featured</Badge>
              </div>

              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>

                <p className="text-muted-foreground mb-6 leading-relaxed">{featuredPost.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Link href={`/journal/${featuredPost._id}`}>
                  <Button>
                    Read Full Post
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post._id} href={`/journal/${post._id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed flex-1">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag) => (
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
