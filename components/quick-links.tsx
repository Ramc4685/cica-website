import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, FileText, Camera, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  {
    title: "Live Scores",
    description: "Follow live matches on CricClubs",
    icon: Trophy,
    href: "https://cricclubs.com/CICA",
    external: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Player Registration",
    description: "Join tournaments and events",
    icon: Users,
    href: "/register",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Rules & Bylaws",
    description: "Tournament rules and organization bylaws",
    icon: FileText,
    href: "/rules",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Photo Gallery",
    description: "Match photos and event highlights",
    icon: Camera,
    href: "/gallery",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "WhatsApp Community",
    description: "Join our active community chat",
    icon: MessageCircle,
    href: "#",
    external: true,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Events Calendar",
    description: "Upcoming matches and events",
    icon: Calendar,
    href: "/events",
    color: "from-orange-500 to-orange-600",
  },
]

export function QuickLinks() {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">Quick Access</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to stay connected with CICA activities and community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon
            const Component = link.external ? "a" : Link
            const props = link.external
              ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: link.href }

            return (
              <Component key={index} {...props}>
                <Card
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 animate-fade-in-up border-0 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className={`h-2 bg-gradient-to-r ${link.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 bg-gradient-to-r ${link.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{link.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Component>
            )
          })}
        </div>
      </div>
    </section>
  )
}
