import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Calendar, History, Clock } from "lucide-react"
import Image from "next/image"

const featuredTournaments = [
  {
    name: "CICA Mains",
    type: "Outdoor",
    status: "Legacy",
    description:
      "Our flagship tournament running since the early 2000s. The premier 20-over format competition that showcases the highest level of cricket talent in Central Illinois.",
    logo: "/images/cica-logo-mains.jpg",
    season: "June - September",
    format: "20 overs",
    legacy: "Running since early 2000s",
    color: "from-blue-600 to-blue-700",
  },
  {
    name: "CPL",
    type: "Indoor & Outdoor",
    status: "Franchise Model",
    description:
      "IPL-style franchise tournament with famous player auctions. Eight franchises compete in both indoor (13-over) and outdoor (15-over) formats with professional-level competition.",
    logo: "/images/cica-logo-cpl.jpg",
    season: "Nov - Jan & May - June",
    format: "13 overs (Indoor) / 15 overs (Outdoor)",
    legacy: "Premier franchise tournament",
    color: "from-purple-600 to-purple-700",
  },
  {
    name: "CICA Indoor",
    type: "Indoor",
    status: "Winter Season",
    description:
      "Fast-paced indoor cricket played during winter months featuring the best teams in Central Illinois with exciting 13-over matches.",
    logo: "/images/cica-logo-indoor.jpg",
    season: "January - March",
    format: "13 overs",
    legacy: "Winter cricket tradition",
    color: "from-green-600 to-green-700",
  },
  {
    name: "Mini Tournament",
    type: "Mixed Divisions",
    status: "Community Building",
    description:
      "Unique format allowing Division 1 and Division 2 players to combine and form teams, creating balanced competition and fostering community integration in a 12-over format.",
    logo: "/images/cica-logo-mini.jpg",
    season: "August - September",
    format: "12 overs",
    legacy: "Building cricket community",
    color: "from-yellow-600 to-yellow-700",
  },
  {
    name: "Challengers",
    type: "Outdoor",
    status: "T14 Format",
    description:
      "The Challengers tournament features a unique 14-over format designed to bridge the gap between recreational and competitive play with exciting, fast-paced matches.",
    logo: "/images/cica-logo-tournaments.jpg",
    season: "September - October",
    format: "14 overs",
    legacy: "T14 outdoor competition",
    color: "from-orange-600 to-orange-700",
  },
]

export function FeaturedTournaments() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Cricket field pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-600 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-blue-600 rounded-full"></div>
      </div>

      {/* Floating cricket balls */}
      <div className="absolute top-1/4 left-10 w-6 h-6 bg-red-500 rounded-full opacity-10 animate-float"></div>
      <div
        className="absolute bottom-1/4 right-10 w-8 h-8 bg-red-500 rounded-full opacity-10 animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">Tournament Legacy & History</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Since the early 2000s, CICA has been organizing premier cricket tournaments in Central Illinois, building a
            rich legacy of competitive cricket across multiple formats
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
          {featuredTournaments.slice(0, 3).map((tournament, index) => (
            <Card
              key={index}
              className="hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 animate-fade-in-up border-0 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className={`text-center pb-4 bg-gradient-to-r ${tournament.color} text-white`}>
                <div className="relative w-24 h-24 mx-auto mb-4 bg-white rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={tournament.logo || "/placeholder.svg"}
                    alt={tournament.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <CardTitle className="text-xl group-hover:scale-105 transition-transform">{tournament.name}</CardTitle>
                <div className="flex justify-center gap-2 flex-wrap mt-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                    {tournament.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-white/70 text-white">
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{tournament.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <History className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{tournament.legacy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>Format: {tournament.format}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Season: {tournament.season}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Tournament Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-7xl mx-auto">
          {featuredTournaments.slice(3, 5).map((tournament, index) => (
            <Card
              key={index}
              className="hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 animate-fade-in-up border-0 overflow-hidden"
              style={{ animationDelay: `${(index + 3) * 150}ms` }}
            >
              <CardHeader className={`text-center pb-4 bg-gradient-to-r ${tournament.color} text-white`}>
                <div className="relative w-24 h-24 mx-auto mb-4 bg-white rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={tournament.logo || "/placeholder.svg"}
                    alt={tournament.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <CardTitle className="text-xl group-hover:scale-105 transition-transform">{tournament.name}</CardTitle>
                <div className="flex justify-center gap-2 flex-wrap mt-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                    {tournament.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-white/70 text-white">
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{tournament.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <History className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{tournament.legacy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>Format: {tournament.format}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Season: {tournament.season}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Tournament Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
