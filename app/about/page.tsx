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
              Jesutofunmi is a Lagos-based artist who explores what people hold onto for strength and meaning 
              in life. He looks at how these guiding forces have changed over time and across different cultures. 
              Using abstract art and stylized portraits, he creates work that sparks conversations about the 
              different ways people find stability and purpose, encouraging both personal reflection and shared 
              understanding. His recent series, "Hi," focuses on how quiet, introverted voices maintain their 
              sense of self through creative work, even when they feel overlooked or unheard. His art has been 
              shown at exhibitions including Athens Open Art, Coal City Art Exhibition, and October Rain 
              Exhibition, among others.
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
              <Image src="https://i.imgur.com/jMvaK9e.jpeg" alt="Artist Portrait" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg">
              <p className="text-sm font-medium text-muted-foreground">Studio Portrait</p>
              <p className="text-xs text-muted-foreground">Lagos, 2023</p>
            </div>
          </div>
        </div>

        {/* Artist Statement */}
        <Card className="mb-16 bg-card/70 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Artist Statement</h2>
            <div className="prose prose-lg max-w-none text-foreground space-y-6">
              <p>
              My art explores how people find things to hold onto in life, looking at how these guiding forces 
              have changed over time and across different cultures. The unspoken questions we face about what 
              truly grounds us amidst life's constant flux, directly fuel the conceptual core of my work.
              </p>
              <p>
              I translate these themes onto canvas using abstraction and abstracted portraiture, often 
              incorporating intricate patterns with intentional exaggeration to draw the viewer deeply into the 
              conversation. Through this visual language, I aim to open a dialogue about the diverse forms and 
              historical shifts of these vital anchors, inviting personal contemplation and collective 
              understanding. 
              </p>
              <p>
              My artistic research explores these ideas within West African cultures, particularly those 
              connected to the Niger River. I look into how our traditions help us find what to hold onto, not just 
              to keep our rich history alive, but also to start new conversations about being strong and knowing 
              who we are today.
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
