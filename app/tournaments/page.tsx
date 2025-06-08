import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">Tournaments</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CICA organizes various tournament formats throughout the year, catering to different skill levels and
              preferences. From indoor winter leagues to outdoor summer championships, there's something for every
              cricket enthusiast.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <Card className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardTitle className="text-2xl">Indoor Tournaments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <h3 className="text-lg font-semibold text-purple-700 mb-1">CPL Indoor</h3>
                    <p className="text-gray-600">
                      Premier indoor tournament featuring the best teams in Central Illinois with fast-paced action
                    </p>
                  </li>
                  <li className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <h3 className="text-lg font-semibold text-purple-700 mb-1">CICA Indoor</h3>
                    <p className="text-gray-600">
                      Community-focused indoor tournament welcoming players of all skill levels
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
              style={{ animationDelay: "200ms" }}
            >
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-2xl">Outdoor Tournaments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">CPL</h3>
                    <p className="text-gray-600">
                      High-intensity outdoor cricket with professional-level competition and live streaming
                    </p>
                  </li>
                  <li className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">Mains</h3>
                    <p className="text-gray-600">
                      The flagship outdoor tournament showcasing the highest level of cricket in Central Illinois
                    </p>
                  </li>
                  <li className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">Mini</h3>
                    <p className="text-gray-600">
                      Perfect for newcomers and younger players to experience competitive cricket
                    </p>
                  </li>
                  <li className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">Challenger</h3>
                    <p className="text-gray-600">
                      Developmental tournament designed to bridge the gap between recreational and competitive play
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card
            className="hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0"
            style={{ animationDelay: "400ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rules & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                All tournament rules, regulations, and code of conduct documents are maintained in our official Google
                Drive folder. This includes detailed format specifications, player eligibility criteria, and
                disciplinary procedures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link
                    href="https://drive.google.com/drive/u/1/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Rules & Regulations
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Scores on CricClubs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
