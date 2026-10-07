import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Award, Target } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Board of Directors & Leadership Team - CICA",
  description: "Meet the dedicated individuals who lead the Central Illinois Cricket Association and work to promote cricket in the region.",
  keywords: "CICA board, cricket organizers, cricket leadership, Central Illinois Cricket Association board, cricket management",
  openGraph: {
    title: "CICA Leadership Team",
    description: "Meet the passionate individuals leading cricket development in Central Illinois",
    images: ["/images/cica-logo-main.jpg"],
  },
}

const boardMembers = [
  {
    name: "RamC Venkatasamy",
    role: "Director",
    bio: "One of CICA's oldest organizers still actively contributing since 2012. Though not a founding member, RamC has been instrumental in transforming CICA through key innovations and facility acquisitions.",
    image: "/images/board/ramc-venkatasamy.jpg",
    specialties: ["Ground Management", "Tournament Innovation", "Facility Development"],
    achievements: [
      "Long-standing service and leadership since 2012",
      "Established multiple cricket divisions to enhance competitive structure",
      "Modernized tournament play by transitioning to the 20-over format",
      "Spearheaded the acquisition of Baywood ground through a city partnership",
      "Pioneered and managed the CPL player auctions",
      "Secured indoor facilities, enabling year-round cricket for the community"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Ayaskant Rout",
    role: "Director",
    bio: "Dedicated community builder and tournament organizer who has been helping CICA grow since 2019. Focused on expanding cricket participation and organizing competitive events.",
    image: "/images/board/ayaskant-rout.jpg",
    specialties: ["Community Building", "Tournament Organization"],
    achievements: [
      "Contributing since 2019",
      "Community engagement leader",
      "Tournament coordination"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Senthil Krishnan",
    role: "CICA Organizing Committee",
    bio: "Tournament organization specialist who joined the organizing team in 2021. Focuses on scheduling and coordinating cricket tournaments to ensure smooth operations.",
    image: "/images/board/senthil-krishnan.jpg",
    specialties: ["Tournament Organization", "Scheduling"],
    achievements: [
      "Organizing since 2021",
      "Tournament scheduling expert",
      "Event coordination"
    ],
    playerRole: "Organizer"
  }
]

export default function BoardPage() {
  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-blue-50 px-4 flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-4xl font-bold">Our Leadership Team</h1>
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 italic">
          Meet the dedicated individuals who lead CICA and work tirelessly to promote cricket in Central Illinois. Our
          board combines years of experience with passion for the sport.
        </p>

        <div className="flex justify-center mb-12">
          <Badge className="text-md py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
            <Users className="h-5 w-5 mr-2" />
            The Heart and Soul of CICA Since 1998
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {boardMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all border-0 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
              <CardHeader className="pt-8 relative">
                <div className="cricket-field-pattern absolute inset-0 opacity-5 -z-10">
                  <div className="w-32 h-32 border-2 border-blue-500 rounded-full absolute -top-10 -left-10"></div>
                  <div className="w-20 h-20 border-2 border-blue-500 rounded-full absolute -bottom-10 -right-10"></div>
                </div>
                <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-offset-2 ring-blue-500 group-hover:ring-green-500 transition-all duration-300">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="text-2xl bg-blue-100">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                <Badge variant="outline" className="mt-2">
                  <Target className="h-3 w-3 mr-1" />
                  {member.playerRole}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {member.specialties?.map((specialty, i) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Key Achievements</span>
                    </div>
                    <div className="space-y-1">
                      {Array.isArray(member.achievements) ? (
                        member.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-xs text-gray-600 leading-relaxed">{achievement}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-gray-600 leading-relaxed">{member.achievements}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Volunteer With Us</h2>
          <p className="text-center text-gray-700 mb-6">
            Passionate about cricket and community? We're always looking for dedicated <span className="font-semibold">volunteers</span> to help
            grow the sport in Central Illinois. Volunteer positions are separate from our Board of Directors and Organizing team roles.
            Contact us to learn more about volunteering opportunities.
          </p>
          <div className="text-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1">
              <Target className="h-3 w-3 mr-1" />
              Volunteer Positions Only
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
