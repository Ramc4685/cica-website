import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Crown, Award } from "lucide-react"
import Image from "next/image"

// Champions data
const mainsChampions = [
  { year: "2024", team: "BloomBoys" },
  { year: "2023", team: "BloomBulls" },
  { year: "2022", team: "Peoria Marvels" },
  { year: "2021", team: "Moghals" },
  { year: "2019", team: "Moghals" },
  { year: "2018", team: "Hunters" },
  { year: "2017", team: "Bloomboys" },
  { year: "2016", team: "Bashers" },
  { year: "2015", team: "Moghals" },
  { year: "2014", team: "Bradley Bulls" },
  { year: "2013", team: "Klasic" },
  { year: "2012", team: "Sarkaar" },
]

const cicaIndoorChampions = [
  { year: "2025", team: "Hunters", runner: "Bloom Bulls" },
  { year: "2024", team: "Spartans", runner: "Bloom Bulls" },
  { year: "2023", team: "Raiders" },
  { year: "2021", team: "Spartans" },
  { year: "2019", team: "Hunters" },
  { year: "2018", team: "Moghals" },
  { year: "2017", team: "Spartans" },
  { year: "2016", team: "Spartans" },
  { year: "2015", team: "BCC" },
]

const cplIndoorChampions = [
  { year: "2025", team: "TECHIE BRAINS LEGENDS", runner: "BLOOM BARISTA BULLS" },
  { year: "2023", team: "Sysintelli Strikers", runner: "Parke Regency Thalaivas" },
]

const cplOutdoorChampions = [{ year: "2024", team: "TECHIE BRAINS LEGENDS", runner: "BLOOM EVENTS EAGLES" }]

export default function ChampionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">CICA Champions</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Celebrating the teams that have achieved excellence in our tournaments over the years. These champions
              have demonstrated exceptional skill, teamwork, and sportsmanship in developing cricket in Central
              Illinois.
            </p>
          </div>

          <Tabs defaultValue="mains" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
              <TabsTrigger value="mains" className="relative overflow-hidden group py-3">
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-data-[state=active]:opacity-10 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">CICA Mains</span>
                  <span className="sm:hidden">Mains</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="cica-indoor" className="relative overflow-hidden group py-3">
                <div className="absolute inset-0 bg-purple-600 opacity-0 group-data-[state=active]:opacity-10 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span className="hidden sm:inline">CICA Indoor</span>
                  <span className="sm:hidden">Indoor</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="cpl-indoor" className="relative overflow-hidden group py-3">
                <div className="absolute inset-0 bg-green-600 opacity-0 group-data-[state=active]:opacity-10 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">CPL Indoor</span>
                  <span className="sm:hidden">CPL-I</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="cpl-outdoor" className="relative overflow-hidden group py-3">
                <div className="absolute inset-0 bg-orange-600 opacity-0 group-data-[state=active]:opacity-10 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">CPL Outdoor</span>
                  <span className="sm:hidden">CPL-O</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mains" className="animate-fade-in">
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Trophy className="h-8 w-8" />
                      CICA Mains Champions
                    </CardTitle>
                    <div className="relative h-16 w-16">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="CICA Mains Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                    {mainsChampions.map((champion, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 text-center hover:bg-blue-50 transition-colors hover-lift group"
                      >
                        <Trophy className="h-8 w-8 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                        <p className="text-3xl font-bold text-blue-600 mb-2">{champion.year}</p>
                        <p className="font-semibold text-gray-800">{champion.team}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cica-indoor" className="animate-fade-in">
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Crown className="h-8 w-8" />
                      CICA Indoor Champions
                    </CardTitle>
                    <div className="relative h-16 w-16">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="CICA Indoor Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                    {cicaIndoorChampions.map((champion, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 text-center hover:bg-purple-50 transition-colors hover-lift group"
                      >
                        <Crown className="h-8 w-8 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
                        <p className="text-3xl font-bold text-purple-600 mb-2">{champion.year}</p>
                        <p className="font-semibold text-gray-800 mb-1">{champion.team}</p>
                        {champion.runner && <p className="text-sm text-gray-500">Runner-up: {champion.runner}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cpl-indoor" className="animate-fade-in">
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Award className="h-8 w-8" />
                      CPL Indoor Champions
                    </CardTitle>
                    <div className="relative h-16 w-16">
                      <Image src="/placeholder.svg?height=64&width=64" alt="CPL Logo" fill className="object-contain" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                    {cplIndoorChampions.map((champion, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 text-center hover:bg-green-50 transition-colors hover-lift group"
                      >
                        <Award className="h-8 w-8 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                        <p className="text-3xl font-bold text-green-600 mb-2">{champion.year}</p>
                        <p className="font-semibold text-gray-800 mb-1">{champion.team}</p>
                        {champion.runner && <p className="text-sm text-gray-500">Runner-up: {champion.runner}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cpl-outdoor" className="animate-fade-in">
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Trophy className="h-8 w-8" />
                      CPL Outdoor Champions
                    </CardTitle>
                    <div className="relative h-16 w-16">
                      <Image src="/placeholder.svg?height=64&width=64" alt="CPL Logo" fill className="object-contain" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                    {cplOutdoorChampions.map((champion, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 text-center hover:bg-orange-50 transition-colors hover-lift group"
                      >
                        <Trophy className="h-8 w-8 mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
                        <p className="text-3xl font-bold text-orange-600 mb-2">{champion.year}</p>
                        <p className="font-semibold text-gray-800 mb-1">{champion.team}</p>
                        {champion.runner && <p className="text-sm text-gray-500">Runner-up: {champion.runner}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
