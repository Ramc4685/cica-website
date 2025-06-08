import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const boardMembers = [
  {
    name: "Ayaskant Rout",
    role: "Director, Organizing Board",
    experience: "Helping CICA from 2018",
    bio: "Ayaskant brings extensive experience in tournament organization and community building. His leadership has been instrumental in expanding CICA's reach across Central Illinois.",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    name: "RamC Venkatasamy",
    role: "Director, Organizing Board",
    experience: "Helping CICA from 2012",
    bio: "As one of CICA's founding members, RamC has been the backbone of our organization. His dedication and vision have shaped CICA into what it is today.",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    name: "Senthil Krishnan",
    role: "Volunteer, Organizing Board",
    experience: "Helping CICA from 2020",
    bio: "Senthil's enthusiasm and fresh perspectives have brought new energy to our organization. His contributions to player development and community outreach are invaluable.",
    image: "/placeholder.svg?height=150&width=150",
  },
]

export default function BoardPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Board of Directors</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Meet the dedicated individuals who lead CICA and work tirelessly to promote cricket in Central Illinois. Our
          board combines years of experience with passion for the sport.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {boardMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="text-2xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <p className="text-sm text-gray-500">{member.experience}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
