"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const navigation = [
  { name: "Gallery", href: "/gallery" },
  { name: "Series", href: "/series" },
  { name: "Exhibitions", href: "/exhibitions" },
  { name: "Process", href: "/process" },
  { name: "Journal", href: "/journal" },
  { name: "About", href: "/about" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  // On the homepage, nav starts transparent over the dark hero
  const isHome = pathname === "/"
  const transparent = isHome && !scrolled

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-background/95 backdrop-blur border-b border-border",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className={cn(
            "font-serif text-xl font-light tracking-wide transition-colors",
            transparent ? "text-foreground/80 dark:text-white/90 hover:text-foreground dark:hover:text-white" : "text-foreground hover:text-foreground/80",
          )}
        >
          Jesutofunmi
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-7">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-xs tracking-widest uppercase font-sans transition-colors",
                transparent
                  ? pathname === item.href
                    ? "text-foreground dark:text-white"
                    : "text-foreground/50 dark:text-white/55 hover:text-foreground dark:hover:text-white"
                  : pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn("h-8 w-8", transparent && "text-foreground/50 dark:text-white/60 hover:text-foreground dark:hover:text-white hover:bg-foreground/8 dark:hover:bg-white/10")}
            >
              <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn("h-8 w-8", transparent && "text-foreground/50 dark:text-white/60 hover:text-foreground dark:hover:text-white hover:bg-foreground/8 dark:hover:bg-white/10")}
            >
              <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(transparent && "text-foreground/50 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-foreground/8 dark:hover:bg-white/10")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <div className="flex flex-col space-y-6 mt-10">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="font-serif text-2xl font-light text-foreground"
                >
                  Jesutofunmi
                </Link>
                <div className="w-8 h-px bg-border" />
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-xs tracking-widest uppercase font-sans transition-colors",
                      pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
