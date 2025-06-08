"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, Users, Trophy, Calendar } from "lucide-react"

const stats = [
  {
    icon: Trophy,
    label: "Tournaments Organized",
    value: 150,
    suffix: "+",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: Users,
    label: "Active Players",
    value: 300,
    suffix: "+",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Calendar,
    label: "Years of Excellence",
    value: 26,
    suffix: "",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: TrendingUp,
    label: "Matches Played",
    value: 1200,
    suffix: "+",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

export function CricketStats() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0))

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const increment = stat.value / 50
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timers[index])
        }

        setAnimatedValues((prev) => {
          const newValues = [...prev]
          newValues[index] = Math.floor(current)
          return newValues
        })
      }, 50)
    })

    return () => timers.forEach((timer) => clearInterval(timer))
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">CICA by the Numbers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our journey in developing cricket in Central Illinois speaks through these achievements
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={`text-4xl font-bold ${stat.color} mb-2 animate-pulse`}>
                    {animatedValues[index]}
                    {stat.suffix}
                  </div>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
