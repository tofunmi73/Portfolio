import { HeroSection } from "@/components/hero-section"
import { FeaturedWorks } from "@/components/featured-works"
import { ArtistStatement } from "@/components/artist-statement"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { AnimatedStats } from "@/components/animated-stats"

export default function HomePage() {
  return (
    <div className="smooth-scroll">
      <HeroSection />
      <AnimatedStats />
      <FeaturedWorks />
      <ArtistStatement />
      <NewsletterSignup />
    </div>
  )
}
