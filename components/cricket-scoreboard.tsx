"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target } from "lucide-react"

const matches = [
  {
    team1: "BloomBoys",
    team2: "Spartans",
    score1: "156/4",
    score2: "142/7",
    overs1: "20.0",
    overs2: "20.0",
    status: "BloomBoys won by 14 runs",
    tournament: "CICA Indoor 2025",
  },
  {
    team1: "Hunters",
    team2: "Bloom Bulls",
    score1: "178/6",
    score2: "165/8",
    overs1: "20.0",
    overs2: "20.0",
    status: "Hunters won by 13 runs",
    tournament: "CPL Indoor 2025",
  },
  {
    team1: "Techie Brains",
    team2: "Eagles",
    score1: "189/5",
    score2: "187/9",
    overs1: "20.0",
    overs2: "20.0",
    status: "Techie Brains won by 2 runs",
    tournament: "CPL Outdoor 2024",
  },
]

export function CricketScoreboard() {
  const [currentMatch, setCurrentMatch] = useState(0)
  const [animateScore, setAnimateScore] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateScore(true)
      setTimeout(() => {
        setCurrentMatch((prev) => (prev + 1) % matches.length)
        setAnimateScore(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const match = matches[currentMatch]

  return (
    <Card className="bg-gradient-to-br from-green-900 to-green-800 text-white border-0 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-400 animate-pulse" />
          Live Cricket Updates
        </CardTitle>
        <Badge variant="secondary" className="w-fit bg-yellow-400 text-green-900 font-semibold">
          {match.tournament}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 relative overflow-hidden">
        {/* Animated Background Logos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 opacity-10 animate-float">
            <img src="/images/cica-logo-main.jpg" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute top-12 right-8 w-6 h-6 opacity-10 animate-float" style={{ animationDelay: "1s" }}>
            <img src="/images/cica-logo-cpl.jpg" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-8 left-12 w-7 h-7 opacity-10 animate-float" style={{ animationDelay: "2s" }}>
            <img src="/images/cica-logo-indoor.jpg" alt="" className="w-full h-full object-contain" />
          </div>
          <div
            className="absolute bottom-4 right-4 w-5 h-5 opacity-10 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <img src="/images/cica-logo-mains.jpg" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Cricket Ball Animation */}
          <div className="absolute top-1/2 left-0 w-3 h-3 bg-red-500 rounded-full opacity-20 animate-cricket-ball"></div>
        </div>

        <div className="relative z-10 space-y-6">
          {/* CricClubs Live Widget */}
          <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400 animate-pulse" />
                Live Tournament Portal
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-white/20 hover:border-white/40 transition-all duration-300">
              <iframe
                src="https://cricclubs.com/CICA"
                className="w-full h-80"
                title="CICA Live Tournament Portal"
                frameBorder="0"
                allowFullScreen
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-blue-200">Real-time scores & updates</span>
              <a
                href="https://cricclubs.com/CICA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
              >
                <Target className="h-3 w-3" />
                Open Full View
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
