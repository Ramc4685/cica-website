import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy } from "lucide-react"
import { getNewsItems } from "@/lib/content-data"

const newsItems = getNewsItems()

export function LatestNews() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">Latest News & Updates</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Stay informed about tournament results, upcoming events, and community news
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
          {newsItems.map((item, index) => {
            // Use the icon from the item, or default to Trophy if not available
            const IconComponent = item.icon || Trophy
            return (
              <Card
                key={item.id || index}
                className="hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 animate-fade-in-up border-0 overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.excerpt}</p>
                  <Button variant="ghost" className="p-0 h-auto text-green-600 hover:text-green-700">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="hover:bg-green-600 hover:text-white transition-colors">
            View All News & Announcements
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            News content can be managed through the{" "}
            <a href="/admin" className="text-blue-600 hover:underline">
              Admin Panel
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
