"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const logos = [
  {
    src: "/images/cica-logo-main.jpg",
    alt: "CICA Main Logo",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    title: "CICA Main",
    description: "Central Illinois Cricket Association",
  },
  {
    src: "/images/cica-logo-tournaments.jpg",
    alt: "CICA Tournaments Logo",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    title: "Tournaments",
    description: "All Tournament Formats",
  },
  {
    src: "/images/cica-logo-mains.jpg",
    alt: "CICA Mains Logo",
    bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    title: "CICA Mains",
    description: "Premier Outdoor Tournament",
  },
  {
    src: "/images/cica-logo-cpl.jpg",
    alt: "CICA CPL Logo",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    title: "CPL",
    description: "Cricket Premier League",
  },
  {
    src: "/images/cica-logo-indoor.jpg",
    alt: "CICA Indoor Logo",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    title: "Indoor Cricket",
    description: "Winter Indoor Tournaments",
  },
  {
    src: "/images/cica-logo-mini.jpg",
    alt: "CICA Mini Logo",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    title: "Mini Tournament",
    description: "Entry Level Competition",
  },
]

export function LogoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + logos.length) % logos.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 4000)
    return () => clearInterval(interval)
  }, [currentIndex, isAnimating])

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">Our Tournament Formats</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Explore the different cricket formats we organize throughout the year, each with its unique identity and
            competitive spirit
          </p>
        </div>

        <div className="relative w-full max-w-2xl mx-auto">
          <div
            className={`relative h-96 w-full rounded-3xl overflow-hidden ${logos[currentIndex].bgColor} transition-all duration-500 shadow-2xl border-4 border-white`}
          >
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <div className="relative h-56 w-56 mb-6 transform hover:scale-110 transition-transform duration-300">
                <Image
                  src={logos[currentIndex].src || "/placeholder.svg"}
                  alt={logos[currentIndex].alt}
                  fill
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                />
              </div>
              <div className="text-center px-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{logos[currentIndex].title}</h3>
                <p className="text-gray-600 font-medium">{logos[currentIndex].description}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-2 hover:scale-110 transition-all duration-200"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-2 hover:scale-110 transition-all duration-200"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {logos.map((_, index) => (
              <button
                key={index}
                className={`h-4 w-4 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 scale-125 shadow-lg" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
