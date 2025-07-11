"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto max-w-2xl text-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <Mail className="w-12 h-12 text-white mx-auto mb-6" />

            <h3 className="text-3xl font-bold text-white mb-4">Stay Connected</h3>

            <p className="text-white/90 mb-8 text-lg">
              Get exclusive updates on new artworks, exhibitions, and behind-the-scenes content
            </p>

            {isSubscribed ? (
              <div className="flex items-center justify-center text-white">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Button type="submit" disabled={isLoading} className="bg-white text-purple-600 hover:bg-gray-100">
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
