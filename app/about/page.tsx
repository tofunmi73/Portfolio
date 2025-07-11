import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, MapPin, Calendar } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-foreground">About the Artist</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Jesutofunmi translates his unique perspective into deeply evocative portraits.
              Through meticulous layering of acrylic paint, he unveils not only the physical 
              features of his subjects but also the rich tapestry of their inner lives—their emotions, 
              their psychology, their humanity. Intimate compositions and vibrant color palettes draw the 
              viewer into a contemplation of connection, vulnerability, and the shared human condition.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Based in Lagos, NG</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Active since 2016</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-2xl shadow-2xl">
              <Image src="https://images.saatchiart.com/saatchi/2084411/profile/inside-the-studio/7b0bee617a84eca9cb63f58cea6150c9d3215d7a-7.jpg" alt="Artist Portrait" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg">
              <p className="text-sm font-medium text-muted-foreground">Studio Portrait</p>
              <p className="text-xs text-muted-foreground">Lagos, 2024</p>
            </div>
          </div>
        </div>

        {/* Artist Statement */}
        <Card className="mb-16 bg-card/70 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Artist Statement</h2>
            <div className="prose prose-lg max-w-none text-foreground space-y-6">
              <p>
              I paint faces, but not the way you might expect. Working with oils and acrylics, I'm more interested in 
              what lies beneath the surface—the thoughts we carry, the connections we make, the quiet moments when we're most ourselves.
              </p>
              <p>
              Each painting starts with something I can't quite put into words. Maybe it's a feeling from a conversation, 
              or the way someone looked when they thought no one was watching. I begin with spiral patterns that become 
              the foundation, then slowly build layers of paint until something true emerges.
              </p>
              <p>
              What draws me most are those in-between spaces—the pause before we speak, the moment when our guard comes down, 
              the split second when we really see each other. My portraits aren't trying to capture perfect likenesses. Instead, 
              they're asking: what does it feel like to be human? What do we share when everything else is stripped away?
              </p>
              <p>
              The spirals that appear in my work aren't just technique—they're about how we move through life, circling back to 
              the same questions, the same hopes, never quite arriving but always reaching.
              When you look at my paintings, I want you to see something familiar. Not necessarily the face itself, 
              but the feeling behind it. The way we all carry similar fears and dreams, even when we think we're completely alone.

              </p>
              <p>
              I paint because I believe there's something we all recognize in each other, something that connects us despite our differences. 
              My work is my way of saying: look, here it is—this thing we share, this pulse of being alive and trying to understand what that means.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Education</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">BTech Marine Science and Technology</h4>
                  <p className="text-muted-foreground">Federal University of Technology Akure, 2019</p>
                  {/* <p className="text-sm text-muted-foreground">Concentration: Contemporary Painting</p> */}
                </div>
                <div>
                  {/* <h4 className="font-semibold text-lg">Bachelor of Arts</h4> */}
                  <p className="text-muted-foreground">Artists’ Connect Workshop, Lagos, 2020</p>
                  <p className="text-sm text-muted-foreground">Studied under Seyi Alabi, 2016</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Selected Exhibitions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">CROSS CURRENTS</h4>
                  <p className="text-muted-foreground">Society of Nigerian Artists 17th Annual Juried Art Exhibition (2023)</p>
                  <Badge variant="secondary" className="text-xs">
                    Group Show
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold">ASCENSION</h4>
                  <p className="text-muted-foreground">Society of Nigerian Artists 16th Annual Juried Art Exhibition (2022)</p>
                  <Badge variant="secondary" className="text-xs">
                    Group Show
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Athens Open Art</h4>
                  <p className="text-muted-foreground">Art Number 23 Athens (2021)</p>
                  <Badge variant="secondary" className="text-xs">
                    Group Show
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Awards & Recognition */}
        <Card className="mb-16 bg-card/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Awards & Recognition</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Coming soon...</h4>
                  {/* <p className="text-muted-foreground">San Francisco Arts Commission (2024)</p> */}
                </div>
                <div>
                  {/* <h4 className="font-semibold">Best in Show</h4> */}
                  {/* <p className="text-muted-foreground">Bay Area Contemporary Art Fair (2023)</p> */}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  {/* <h4 className="font-semibold">Dean's List</h4> */}
                  {/* <p className="text-muted-foreground">California College of the Arts (2019-2020)</p> */}
                </div>
                <div>
                  {/* <h4 className="font-semibold">Student Excellence Award</h4> */}
                  {/* <p className="text-muted-foreground">UC Berkeley Art Department (2018)</p> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & CV */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Interested in commissioning a piece, purchasing artwork, or collaborating? I'd love to hear from you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                    <span>jesutofunmiogidan@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-6">
                  <a href="mailto:jesutofunmiogidan@gmail.com?subject=Commission Inquiry&body=Hi, I'm interested in your artwork...">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Professional Materials</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Download my complete CV and artist statement for press, gallery submissions, or professional
                  inquiries.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Artist Statement (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    High-Res Portfolio Images
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
