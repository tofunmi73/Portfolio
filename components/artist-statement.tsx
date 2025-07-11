import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function ArtistStatement() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-12 text-center">
            <Quote className="w-12 h-12 text-purple-400 mx-auto mb-6" />

            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8">
              "Art is not what you see, but what you make others see. Through my work, I strive to create emotional
              landscapes that invite viewers into a dialogue between color, form, and feeling."
            </blockquote>

            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"></div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My artistic journey explores the intersection of contemporary techniques with timeless emotional
              expression. Each piece is a meditation on the human experience, translated through vibrant colors and
              dynamic compositions that speak to the soul's deepest resonances.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
