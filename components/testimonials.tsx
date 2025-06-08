import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { getFeaturedTestimonials } from "@/lib/content-data"

const testimonials = getFeaturedTestimonials()

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from players, parents, and sponsors about their CICA experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 animate-fade-in-up border-0"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-400 mb-4" />

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Testimonials can be managed through the{" "}
            <a href="/admin" className="text-blue-600 hover:underline">
              Admin Panel
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
