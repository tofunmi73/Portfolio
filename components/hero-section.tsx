"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen -mt-16 flex flex-col justify-center overflow-hidden bg-background dark:bg-[#0D0C09]">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto w-full py-32">
        {/* Identity line */}
        <p className="text-[11px] tracking-[0.45em] text-foreground/35 dark:text-white/35 uppercase mb-10 font-sans font-light">
          Jesutofunmi Ogidan &nbsp;·&nbsp; Lagos, Nigeria
        </p>

        {/* Main headline */}
        <h1 className="font-serif font-light leading-[0.9] mb-6">
          <span className="block text-[clamp(4rem,12vw,9rem)] text-foreground dark:text-white">
            Abstracted
          </span>
          <span className="block text-[clamp(4rem,12vw,9rem)] italic text-foreground/45 dark:text-white/55">
            Portraiture
          </span>
        </h1>

        {/* Hairline */}
        <div className="w-12 h-px bg-foreground/20 dark:bg-white/25 mb-8" />

        {/* Tagline */}
        <p className="text-foreground/55 dark:text-white/50 text-base md:text-lg max-w-md leading-relaxed mb-12 font-sans font-light">
          Painting the enduring anchors that steady us,
          tracing their ripples across West African history.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/gallery">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-none px-8 font-sans font-medium tracking-wide"
            >
              Explore Gallery
            </Button>
          </Link>
          <Link href="/process">
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 dark:border-white/25 text-foreground/65 dark:text-white/75 hover:text-foreground dark:hover:text-white hover:border-foreground/40 dark:hover:bg-white/8 rounded-none px-8 bg-transparent font-sans font-light tracking-wide"
            >
              <Play className="w-3.5 h-3.5 mr-2 opacity-70" />
              Watch Process
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.4em] text-foreground/25 dark:text-white/25 uppercase font-sans">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-foreground/20 dark:from-white/25 to-transparent" />
      </div>
    </section>
  )
}
