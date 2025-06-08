import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, FileText, AlertTriangle, Shield } from "lucide-react"
import Link from "next/link"

export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Rules & Documentation</h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          CICA follows standard cricket rules with specific adaptations for our tournaments. All players are expected to
          understand and adhere to these rules to ensure fair play and sportsmanship.
        </p>

        <div className="mb-8 text-center">
          <Button size="lg" asChild>
            <Link href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-5 w-5 mr-2" />
              Visit Official Tournament Website
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rules & Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              All tournament rules, regulations, and code of conduct documents are maintained in our official Google
              Drive folder. Please refer to these documents for detailed information about tournament formats, player
              eligibility, and match regulations.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link
                href="https://drive.google.com/drive/u/1/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Access Rules & Documentation
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">General Rules</TabsTrigger>
            <TabsTrigger value="indoor">Indoor Format</TabsTrigger>
            <TabsTrigger value="outdoor">Outdoor Format</TabsTrigger>
            <TabsTrigger value="conduct">Code of Conduct</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  General Tournament Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  These rules apply to all CICA tournaments and events. Specific tournament formats may have additional
                  rules that supersede these general guidelines.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Player Eligibility</h3>
                    <p className="text-sm text-gray-600">
                      All players must be registered with CICA before participating in any tournament. Registration
                      includes providing personal information and paying applicable fees.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Team Composition</h3>
                    <p className="text-sm text-gray-600">
                      Teams must register a minimum of 11 players and a maximum of 15 players for outdoor tournaments.
                      Indoor tournaments allow 8-10 players per team.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Match Officials</h3>
                    <p className="text-sm text-gray-600">
                      CICA will appoint neutral umpires for all matches. Teams may be required to provide scorers on a
                      rotational basis.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Scoring and Results</h3>
                    <p className="text-sm text-gray-600">
                      All match scores must be recorded on the official CricClubs platform. Team captains are
                      responsible for verifying scores after each match.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indoor" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Indoor Cricket Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Indoor cricket is played during winter months in an enclosed facility. The format is designed for
                  fast-paced, action-packed matches with modified rules to suit indoor conditions.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Match Duration</h3>
                    <p className="text-sm text-gray-600">
                      Indoor matches consist of 12 overs per side, with each match lasting approximately 2 hours.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Playing Area</h3>
                    <p className="text-sm text-gray-600">
                      The indoor facility has specific boundaries and zones that affect scoring. Hitting certain walls
                      may result in automatic runs or wickets.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Special Rules</h3>
                    <p className="text-sm text-gray-600">
                      - Batsmen retire at 25 runs but may return if all other batsmen are out
                      <br />- No LBW rule applies unless the batsman deliberately blocks the wicket
                      <br />- Each bowler can bowl a maximum of 3 overs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outdoor" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Outdoor Cricket Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Outdoor cricket follows more traditional cricket rules with adaptations for local conditions and time
                  constraints. Different tournaments (Mains, CPL) have specific variations.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Match Duration</h3>
                    <p className="text-sm text-gray-600">
                      - CICA Mains: 20 overs per side
                      <br />- CPL Outdoor: 20 overs per side with power play rules
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Playing Conditions</h3>
                    <p className="text-sm text-gray-600">
                      Matches are played on grass or artificial turf depending on venue availability. Boundary sizes are
                      standardized for each venue.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Weather Interruptions</h3>
                    <p className="text-sm text-gray-600">
                      In case of rain or bad light, the Duckworth-Lewis-Stern method will be used to calculate revised
                      targets. Minimum 5 overs per side constitute a valid match.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conduct" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Code of Conduct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    All players, officials, and spectators are expected to uphold the spirit of cricket and adhere to
                    this code of conduct. Violations may result in penalties, suspensions, or expulsion from CICA
                    events.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="font-semibold mb-1">Respect for Officials</h3>
                    <p className="text-sm text-gray-600">
                      Players must respect the decisions of umpires and match officials. Dissent or aggressive behavior
                      towards officials will not be tolerated.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Sportsmanship</h3>
                    <p className="text-sm text-gray-600">
                      Players are expected to play in the spirit of the game, showing respect to opponents and
                      celebrating success appropriately without excessive aggression.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Disciplinary Process</h3>
                    <p className="text-sm text-gray-600">
                      Violations will be reviewed by the CICA Disciplinary Committee. Players have the right to appeal
                      decisions according to the process outlined in the bylaws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
