import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, History, Heart, ExternalLink, FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">About CICA</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Developing cricket excellence and building community in Bloomington/Normal since 1998
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="h-6 w-6 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-lg">
                  The Central Illinois Cricket Association (CICA) was founded in 1998 with a clear and focused mission:
                  <strong className="text-blue-600">
                    {" "}
                    to develop and promote cricket in the Bloomington/Normal area
                  </strong>
                  . We are dedicated to providing opportunities for local players to participate in cricket, fostering
                  talent development, and creating a thriving cricket ecosystem in Central Illinois through organized
                  tournaments, coaching programs, and community engagement.
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
              style={{ animationDelay: "200ms" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <History className="h-6 w-6 text-green-600" />
                  Our History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Founded in 1998, CICA emerged from the vision of cricket enthusiasts who recognized the need for
                  organized cricket in Central Illinois. Over 25+ years, we have grown from a small group of passionate
                  players to a thriving organization that hosts multiple tournaments throughout the year, built strong
                  partnerships with local communities, and continues to expand our reach across the region.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card
            className="mb-16 hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
            style={{ animationDelay: "400ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Heart className="h-6 w-6 text-red-600" />
                Our Values & Purpose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Local Development</h3>
                  <p className="text-gray-600">
                    Focused on developing cricket talent specifically in the Bloomington/Normal area and providing
                    pathways for local players to excel
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                  <p className="text-gray-600">
                    Creating lasting friendships and connections through cricket while fostering a welcoming environment
                    for all backgrounds
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                  <p className="text-gray-600">
                    Striving for the highest standards in tournament organization, player development, and community
                    engagement
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-blue-800">Why CICA Was Created</h4>
                <p className="text-blue-700 leading-relaxed">
                  CICA was specifically formed to address the lack of organized cricket opportunities in the
                  Bloomington/Normal area. Our founders recognized that local cricket enthusiasts needed a structured
                  platform to play, compete, and develop their skills. By creating CICA, we established a foundation for
                  cricket development that serves not just as a recreational outlet, but as a pathway for players to
                  grow, compete at higher levels, and contribute to the broader cricket community in Illinois.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="mb-16 hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
            style={{ animationDelay: "600ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Trophy className="h-6 w-6 text-yellow-600" />
                CICA Tournament Legacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Since the early 2000s, the Central Illinois Cricket Association has been at the forefront of
                  developing cricket in the region. Our flagship <strong>CICA Mains</strong> tournament has been the
                  cornerstone of our cricket calendar for over two decades, providing the classic 20-over format that
                  cricket enthusiasts love.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 text-lg">
                  As cricket evolved globally, so did CICA's tournament offerings. The introduction of the{" "}
                  <strong>CPL</strong> (Cricket Premier League) brought the excitement of franchise cricket to Central
                  Illinois, complete with player auctions and team ownership, mirroring the popular IPL format with both
                  indoor (13-over) and outdoor (15-over) competitions.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 text-lg">
                  Our <strong>CICA Indoor</strong> tournaments keep cricket alive during the winter months, while the{" "}
                  <strong>Mini Tournament</strong> creates unique opportunities for players of different skill levels to
                  compete together. The <strong>Challengers T14</strong> format rounds out our diverse cricket
                  offerings, ensuring there's cricket for everyone throughout the year.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 text-blue-800">Tournament Calendar</h4>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>
                        <strong>CICA Mains:</strong> June - September
                      </li>
                      <li>
                        <strong>CPL:</strong> November - January & May - June
                      </li>
                      <li>
                        <strong>CICA Indoor:</strong> January - March
                      </li>
                      <li>
                        <strong>Mini Tournament:</strong> August - September
                      </li>
                      <li>
                        <strong>Challengers:</strong> September - October
                      </li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 text-green-800">Tournament Formats</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>
                        <strong>20 overs:</strong> CICA Mains (Flagship)
                      </li>
                      <li>
                        <strong>15 overs:</strong> CPL Outdoor
                      </li>
                      <li>
                        <strong>14 overs:</strong> Challengers T14
                      </li>
                      <li>
                        <strong>13 overs:</strong> CPL Indoor, CICA Indoor
                      </li>
                      <li>
                        <strong>12 overs:</strong> Mini Tournament
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
            style={{ animationDelay: "600ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <FileText className="h-6 w-6 text-indigo-600" />
                Official Bylaws
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Our bylaws outline the governance structure, membership requirements, and operational procedures of
                CICA. These documents ensure transparency and fair play in all our activities while maintaining our
                focus on local cricket development.
              </p>

              <div className="border rounded-lg overflow-hidden h-96 mb-6">
                <iframe
                  src="https://docs.google.com/document/d/1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg/preview"
                  className="w-full h-full"
                  title="CICA Bylaws"
                ></iframe>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <a
                  href="https://docs.google.com/document/d/1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Bylaws Document
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
