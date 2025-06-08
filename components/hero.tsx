import { Button } from "@/components/ui/button"
import { MessageCircle, Users, Trophy, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CricketScoreboard } from "./cricket-scoreboard"

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated cricket field pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-pulse-slow"></div>
        <div
          className="absolute top-20 right-20 w-24 h-24 border-2 border-white rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left">
              <div className="mb-8 animate-fade-in">
                <div className="relative w-40 h-40 mx-auto lg:mx-0 mb-6">
                  <Image
                    src="/images/cica-logo-main.jpg"
                    alt="CICA Logo"
                    fill
                    className="object-contain drop-shadow-2xl animate-float"
                    priority
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
                Central Illinois Cricket Association
              </h1>

              <p
                className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                Developing cricket and building community in Bloomington/Normal, Illinois since 1998
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-slide-up"
                style={{ animationDelay: "400ms" }}
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  asChild
                >
                  <a href="https://chat.whatsapp.com/Ij7GEOEkGJK9DCY2LDPFj8" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Join WhatsApp Community
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200 bg-white/10 backdrop-blur-sm shadow-lg"
                  asChild
                >
                  <Link href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">
                    <Trophy className="h-5 w-5 mr-2" />
                    View Live Scores
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                  <Users className="h-12 w-12 mx-auto lg:mx-0 mb-4 text-blue-200 animate-bounce-slow" />
                  <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                  <p className="text-blue-100 text-sm">
                    Developing local cricket talent and building lasting friendships
                  </p>
                </div>
                <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                  <Trophy
                    className="h-12 w-12 mx-auto lg:mx-0 mb-4 text-blue-200 animate-bounce-slow"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <h3 className="text-xl font-semibold mb-2">Multiple Tournaments</h3>
                  <p className="text-blue-100 text-sm">Indoor and outdoor formats year-round for all skill levels</p>
                </div>
                <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
                  <TrendingUp
                    className="h-12 w-12 mx-auto lg:mx-0 mb-4 text-blue-200 animate-bounce-slow"
                    style={{ animationDelay: "1s" }}
                  />
                  <h3 className="text-xl font-semibold mb-2">Growing Strong</h3>
                  <p className="text-blue-100 text-sm">25+ years of cricket excellence in Central Illinois</p>
                </div>
              </div>
            </div>

            {/* Right Column - Cricket Scoreboard */}
            <div className="animate-fade-in-up" style={{ animationDelay: "1200ms" }}>
              <CricketScoreboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
