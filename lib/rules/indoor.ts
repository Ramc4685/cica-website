// Indoor rules, reproduced from two documents in the rules folder (see lib/documents.ts):
// - "CICA INDOOR 2025.docx" (officialDocuments.indoor2025, updated Jan 10, 2025). Its fielding-zone,
//   boundary and ceiling diagrams are photos inside the .docx; the site points to the source for them.
// - "2025 CPL Indoor Tournament Rules" (officialDocuments.cplIndoor2025, updated Mar 16, 2025).
// Wording is the documents'. Obvious typos fixed: "theWide" → "the Wide", "BTTproperty" → "BTT
// property", "Sf 2" → "SF2", "circumstancesTime do not allow" → "circumstances or time do not allow",
// and "5 bowlers must be used" was split from the sentence it ran into. Because the photos are not
// shown here, "(Pic below)" / "as pictured below" read "pictured in the source document", and the
// shorturl link to the general rule doc points to /rules/#general-rules. Amounts and penalties unchanged.

import type { RuleBlock, RuleItem, RuleSection } from "@/lib/rules/types"

const p = (text: string): RuleBlock => ({ kind: "p", text })
const ul = (...items: RuleItem[]): RuleBlock => ({ kind: "list", items })
const group = (label: string, ...blocks: RuleBlock[]): RuleBlock => ({ kind: "group", label, blocks })
const figure = (description: string): RuleBlock => ({ kind: "figure", description })

export const bttVenue = {
  name: "Bloomington Table Tennis (BTT)",
  address: "4101 Wicker Rd, Bloomington, IL 61704",
  waiverUrl: "https://www.yourcourts.com/security/registerforclubaccess?accessCode=607681&status",
} as const

export const cicaIndoor2025Sections: readonly RuleSection[] = [
  {
    id: "indoor-format", title: "Tournament format",
    blocks: [
      p(`**Game location:** BTT - ${bttVenue.address}`),
      p("**Groups:** 10 teams, divided into two groups (Group A and Group B), with 5 teams in each."),
      group("League Stage", ul(
        "Same pool play: Each team in one Group plays against other teams in the same Group.",
        "Total matches in League Stage: 4 Matches per team",
      )),
      group("QF (Opposite Pool)", ul(
        "After the league stage, Top 4 teams from each pool will move to the QF based on points and NRR.",
        "A1 Vs B4, A2 Vs B3, A3 Vs B2, A4 Vs B1",
        "The lowest-ranked team in each pool will be eliminated.",
      )),
      group("SF Matches", ul(
        "SF1 Winner of A1 Vs B4 Vs A3 Vs B2",
        "SF2 Winner of A2 Vs B3 Vs A4 Vs B1",
      )),
      group("Tournament Final", p("Winner of SF1 Vs SF2")),
      group("Roster", ul(
        "14 Players per team.",
        "Replacement fee $20, Replaced players can not join back in the tournament.",
        "A Player needs to play a **minimum of 1** game to qualify for playoffs. Failure to do so will result in direct disqualification of the team from the tournament.",
      )),
      group("Total Matches", p("Grand Total: 27 matches")),
    ],
  },
  {
    id: "indoor-rules", title: "Rules",
    blocks: [ul(
      { text: "In the event of any incident or rule not explicitly outlined in the Indoor rules or CICA rule book document, CICA Committee will engage in internal deliberations and subsequently inform the Captains accordingly.", items: [
        "CICA MAINS/General Rule Doc - [CICA General Rules](/rules/#general-rules)",
      ] },
      "Total Overs - 13 overs,",
      "Max 3 bowlers can bowl a max of 3 overs. (Min 5 Bowlers to be used.)",
      "**Power Play** - Bowling PP - 1 & 2 overs, Batting PP- 1 over anytime between 3-13 overs. Default to 13th over.",
      "A Player can go out of field and come back without waiting to bowl an over.",
      "Bails are recommended for Indoor games.",
      "No Reschedule requests are allowed. Please plan accordingly.",
      "All ICC rules prevail unless specially mentioned by CICA.",
    )],
  },
  {
    id: "indoor-bowl-out", title: "Bowl Out",
    blocks: [
      ul(
        "This tournament exclusively employs bowl-outs for match resolution, **omitting** the use of **Super Over** due to lack of time allocated per game.",
        "During League Stages - No Bowl-outs and Points will be split between the teams.",
      ),
      group("Knock outs", ul(
        "Bowl-outs will be played if time permits on the same game day immediately after the conclusion of the main match.",
        { text: "If circumstances or time do not allow for a bowl-outs to be conducted on the same day, CICA will try to schedule it for another suitable date and time based on ground availability,", items: [
          "It is mandatory for both participating teams to be present for the scheduled bowl-outs. Failure of any team to appear will result in the opposing team being awarded the victory.",
        ] },
        "In the event of ground unavailability or any unforeseen circumstances preventing the conduct of the bowl-outs on the scheduled date, the higher-ranked team will progress forward in the tournament.",
      )),
      group("Bowl Out Rule", p("Five bowlers from each side deliver one ball each at an unguarded Wicket (three stumps). If each team has hit the same number of wickets after the first five bowlers per side, the bowling continues and is decided by [sudden death](https://en.wikipedia.org/wiki/Sudden_death_(sport)).")),
    ],
  },
  {
    id: "indoor-game-time", title: "Game Time",
    blocks: [ul(
      "Each Game is allocated a total of 2 hrs.",
      "Toss for League Stages will be completed Week before the game.",
      { text: "Teams should start their game within 5 minutes of allocated time.", items: [
        { text: "Failure to do so", items: [
          "1st offense - may result in a fine to the teams causing the delay.",
          "2nd Offense - Fine and Captain Suspension for the next game.",
        ] },
      ] },
      "Teams should start their game irrespective of Umpires availability.",
      "Each team is allocated 55 minutes to finish their 13 overs.",
      "Innings break duration are limited to 5 minutes; umpires to enforce with captains accountable for adherence",
      "Teams are required arrive early to complete game setup in CRICCLUBS app before game scheduled start time",
      "Teams are required to arrive early Collect Stumps and complete the markings prior to the start of the game.",
      { text: "Unable to finish the game on time will result in DLS being implemented to find a winner.", items: [
        "Intentional delay: In case of Intentional delay resulting in the match to not finish on time, the Match will be awarded to opponents and the team will be given a demerit point.",
        "Decision will be based on the inputs of 3 umpires and CICA",
      ] },
      "**LBW and Leg byes are NOT applicable in the tournament.**",
    )],
  },
  {
    id: "indoor-btt-ground-rules", title: "BTT Ground Rules",
    blocks: [ul(
      { text: "Teams should enter the turf only at the allocated time. Failing to do so will result as follows:", items: [
        "-1 Point for team,",
        "Captain Suspended for next game.",
        "Charge the amount that BTT charges to CICA to the Teams.",
        "Repeated offense will lead to Team Suspension for rest of the tournament with no refunds",
      ] },
      `BTT requires all players to sign a waiver, Ensure your team players Waiver is complete and signed to avoid delays at the location: [BTT waiver](${bttVenue.waiverUrl})`,
      "Playing Teams ensure Stumps, Marking cones are kept back in storage after the game is complete.",
      "Only players, organizers, and match officials are permitted within the playing area (Field); unauthorized individuals are restricted from entry.",
      "In case of any concern, Only captain is allowed to go to the playing area.",
      "Usage of Tennis Courts is strictly prohibited.",
      "Spectators are required to occupy the designated seating area for viewing; loitering is not tolerated.",
      "Children accompanying spectators must remain in close proximity to their parents or guardians and refrain from misusing any BTT property.",
      "Teams/spectators should use designated Parking areas to park their vehicles.",
      "Smoking is strictly prohibited within the BTT premises.",
      "Teams must come and vacate the BTT premises within the time they are allocated.",
      "Please note that violation of the above rules may result in disciplinary action, including potential expulsion from the tournament, at the discretion of the CICA.",
    )],
  },
  {
    id: "indoor-game-rules", title: "Game Rules",
    blocks: [
      group("Batting", ul(
        "Batting will be done towards the End of BTT ground",
        "Both Captains need to mark the Wide, Bowling lines before the start of the game.",
      )),
      group("Players", ul({ text: "Batting Team captain must ensure the next batsman is in the crease **within 90 seconds** of the batsman declared out.", items: [
        "Failure to do so may result in the incoming batsman being declared timed out.",
      ] })),
    ],
  },
  {
    id: "indoor-fielding", title: "Fielding Restrictions and Zones",
    blocks: [
      group("Non Power Plays",
        ul(
          "A Total of 10 fielders can field in the ground. 1 person sits out as a replacement.",
          "A Maximum of 3 fielders are allowed in the 2 Zone.",
        ),
        figure("Diagram of zone 1 and zone 2 on the BTT turf"),
        ul(
          "3 Fielders are allowed in the 1 zone after batting wicket till 2 zone line.",
          "3 fielders allowed behind the wicket (Including Wicket Keeper)",
          { text: "2 Zone Restrictions:", items: [
            "Two fielders allowed to stand anywhere in the 2 zone (including at the boundary line) but can not be in the imaginary (Soccer D) line as pictured in the source document",
            "1 Fielder is allowed to be in 2 zones but has to be in one of the boxes on the off side or leg side when the ball is delivered. (Pictured in the source document)",
          ] },
        ),
        figure("Diagrams of the Soccer D line and the off-side and leg-side boxes"),
        ul("Anytime during the game No Fielders are allowed to stand on the batting track (Imaginary Wide Line for both Left and Right handers) from Batting to Bowling"),
      ),
      group("Power Plays",
        ul(
          "A Total of 9 Fielders on the Ground",
          "2 Fielders (Including WK) need to be behind the Stumps.",
          "A Max of 1 Fielder allowed in 2 Zone, And field anywhere right except goal box D",
          "Remaining fielders need to be in 1 zone only",
          "No Fielders are allowed to stand on the batting track (Imaginary Wide Line for both Left and Right handers) from Batting to Bowling",
        ),
        figure("Diagram of power play field positions"),
      ),
    ],
  },
  {
    id: "indoor-boundaries", title: "Boundaries, Net and Back Wall",
    blocks: [
      ul(
        { text: "Boundary has been extended (pictured in the source document). Teams need to come before time and place cones to mark the boundary.", items: [
          "Ball touching the net will automatically be a boundary.",
        ] },
        { text: "Ball hitting the roof without bouncing after the steel metal plate (pictured in the source document) will be considered a 6 at the sole discretion of the Umpire.", items: [
          "Ball hitting the net will be considered a declared zone and awarded 2 runs.",
          "Ball touching the net and hitting (without bounce) after the steel metal plate will be considered 6.",
          "Ball hitting after the net (after the steel metal plate) will be considered 6.",
        ] },
        { text: "Ball hitting the back Wall (behind WK)", items: [
          "This will be considered in play. Batsmen need to run to score and run out rules apply.",
          "If the ball Falls on the AC vent behind WK or is unreachable then WK/Fielder need to raise their hand up immediately and it will be declared 1. (Judgement lies on Umpire)",
          "In case the ball hits the back wall of wk and goes to 1 zone or 2 zone (unless overthrow). Either 1 or 2 will be declared. (Batsman can't claim that he ran 2 runs while the ball goes to either zone).",
        ] },
      ),
      figure("Photos of the extended boundary and the steel metal plate"),
    ],
  },
  {
    id: "indoor-ceiling", title: "Roof/Ceiling Rules",
    blocks: [
      p("Ceiling has been separated to 3 Zones - **Red**, **Yellow**, **Green**"),
      figure("Ceiling zone map, including the extended Yellow zone"),
      group("Ball hits the Red zone", ul(
        "**Ball becomes dead immediately.**",
        "Batsman will be considered 1 out. Batsman hitting the red zone 3 times will be considered out. Ball will be counted and considered 0 Run",
        "In the event of a batsman hitting the red zone of a no-ball or free hit, then it will be considered as no strike. (It won't be in the count for hitting 3 times in the Red zone to get out)",
      )),
      group("Ball hits the Yellow zone", ul(
        "**Ball in Play, (not dead)**",
        "Batsman needs to keep running till the ball is dead or declared runs (1, 2, 4) are achieved.",
        "Ball hits the Inflatable Goal posts will be considered as declared runs.",
        "There will be no 6 if the ball hits the yellow zone. If the ball hits the yellow zone and goes for a 6. It will be declared 4.",
        "A batsman won't be declared out Caught, if the ball hits anything in the ceiling before a player takes a catch. Game is still in play and a batsman can still run till the ball is declared dead.",
      )),
      group("Ball hits the Green zone",
        ul(
          "**Ball becomes dead immediately.**",
          "**Ball hitting the Green Wall and below,** will be declared based on the 1 zone/2 zone rules (pictured in the source document).",
          "Runs will be declared based on the zones the ball made the first impact.",
          "Ball hitting the Inflatable Goal Posts will be declared runs and the ball will be considered dead.",
          "Batsmen need to change sides if it's Declared 1.",
        ),
        p("(Anything above Green wall Batsman needs to run to score runs.)"),
        figure("Green wall and zone markings"),
      ),
      ul(
        "If the ball gets stuck in the ceiling or net, it will be declared runs.",
        "The decision of where the ball made the first impact remains on the umpires.",
      ),
    ],
  },
  {
    id: "indoor-umpires", title: "Umpires",
    blocks: [ul(
      "Umpiring team Captains responsibility to ensure their umpiring slots and send umpires accordingly.",
      "Leg Umpire Recording is a Must.",
      "Side Return crease No balls are applicable for Bowlers.",
      "CICA has **introduced a 3rd umpire** for **Indoors only** to check on Ball hitting the roof, Players Position and movement before ball is delivered, Boundary decisions and be a third eye for the Main and leg umpires. 3rd umpire needs to be on the boundary line.",
      { text: "Failure to send umpires will result in **$100 for first offence and -1 Point for next offence** if reported. No exceptions will be made! Failure to make the payment will result in -1 Point in league stage and Captain Suspension for next game.", items: [
        "Report should only be made through an email to info@cicainfo.com",
        "Report should be made within 24 hours of umpires not showing up for the game.",
      ] },
      "Umpires need to be available 10 minutes prior to Match Scheduled start time to Ensure Markings, toss and cricclubs scoreboard setup are complete. (NO EXCEPTIONS)",
      "Repeated offenses will result in a captain's suspension.",
      "CICA Advises teams to send umpires with good knowledge of the ICC and CICA Indoor rules.",
      "CICA strongly suggests, Umpires to record every ball for better decision making.",
    )],
  },
]

export const cplIndoor2025Sections: readonly RuleSection[] = [
  {
    id: "cpl-structure", title: "1. Tournament Structure",
    blocks: [
      p(`**Game location:** ${bttVenue.name} | ${bttVenue.address}`),
      group("Teams and Format", ul("Teams: 8", "Format: Single pool, round-robin. Each team plays every other team once.")),
      group("Playoff Structure", ul(
        { text: "Qualifier 1: 1st vs. 2nd ranked teams", items: ["Winner advances directly to the Final.", "Loser proceeds to Qualifier 2."] },
        { text: "Eliminator 1: 3rd vs. 4th ranked teams", items: ["Winner advances to Qualifier 2.", "Loser is eliminated."] },
        { text: "Qualifier 2: Loser of Qualifier 1 vs. Winner of Eliminator 1", items: ["Winner advances to the Final."] },
        "Final: Winner of Qualifier 1 vs. Winner of Qualifier 2",
      )),
    ],
  },
  {
    id: "cpl-match-format", title: "2. Match Format",
    blocks: [ul(
      "Overs: 13 overs per team",
      "Bowling Restrictions: Maximum 3 overs per bowler, maximum of 3 bowlers allowed to bowl 3 overs each. 5 bowlers must be used",
      { text: "Power Plays:", items: [
        "Bowling Power Play: Overs 1 and 2",
        "Batting Power Play: 1 over, chosen between overs 3–13 (defaults to the 13th over if not selected earlier)",
      ] },
    )],
  },
  {
    id: "cpl-player-requirements", title: "3. Player Requirements",
    blocks: [
      group("Minimum Matches for Playoff Eligibility", ul("Youth Players: At least 1 match", "Other Players: At least 2 matches")),
      group("Penalties for Non-Compliance", ul(
        { text: "Playoff Qualifying Teams:", items: [
          "First violation: Captain and vice-captain suspended for 1 playoff game.",
          "Additional violations: Additional 1-game suspension per violation for captain and vice-captain.",
        ] },
        { text: "Non-Playoff Teams:", items: ["$50 fine per player failing to meet minimum requirements."] },
      )),
      group("Exceptions", ul(
        "Injuries or justified unavailability (requires written confirmation).",
        "Impact players (from the submitted list of 12) count toward minimum game requirements.",
      )),
    ],
  },
  {
    id: "cpl-game-conduct", title: "4. Game Conduct",
    blocks: [
      ul(
        "Duration: 2 hours per match",
        "Start Time: Matches must begin within 5 minutes of the scheduled time.",
        "Innings Duration: 55 minutes per team to complete 13 overs.",
        "Innings Break: 5 minutes",
      ),
      group("Penalties for Delays", ul("1st Offense: Fine", "2nd Offense: Fine + captain suspended for the next game")),
      group("Intentional Delays", ul("Match awarded to the opposing team.", "Offending team receives 1 demerit point.")),
    ],
  },
  {
    id: "cpl-impact-player", title: "5. Impact Player Rules",
    blocks: [ul(
      "Teams must submit a list of 12 players before the match.",
      "Impact players must arrive within the first 4 overs; otherwise, they cannot participate.",
    )],
  },
  {
    id: "cpl-ground-rules", title: "6. Ground Rules (refer - CICA Indoor Rules)",
    blocks: [ul(
      "Field Markings: Wide and Bowling lines must be clearly marked before the match begins.",
      { text: "Boundaries:", items: [
        "Ball touching the net: Boundary (4 runs).",
        "Ball hitting the roof beyond the metal plate directly (no bounce): 6 runs (umpire’s discretion).",
      ] },
      { text: "Field Restrictions:", items: [
        "Maximum 10 players on the field (9 fielders + 1 wicketkeeper).",
        "Follow CICA indoor zoning standards.",
      ] },
    )],
  },
  {
    id: "cpl-umpiring", title: "7. Umpiring",
    blocks: [
      ul("Captains are responsible for ensuring umpire availability."),
      group("Penalties for Umpire No-Show", ul("1st Offense: $100 fine", "2nd Offense: $100 fine + captain suspended for the next game")),
    ],
  },
  {
    id: "cpl-miscellaneous", title: "8. Miscellaneous Rules",
    blocks: [ul(
      "Bails are recommended.",
      "No rescheduling allowed (except emergencies authorized by CICA).",
      "Spectators restricted to designated areas; no use of tennis courts.",
      "All players must sign the BTT waiver.",
    )],
  },
  {
    id: "cpl-tie-breaker", title: "9. Tie-Breaker Rules",
    blocks: [ul(
      "League Stage: Points shared in case of a tie.",
      "Knockout Matches: Bowl-out to determine the winner.",
    )],
  },
  {
    id: "cpl-general", title: "10. General and Additional Rules",
    blocks: [
      ul(
        "Captains are responsible for fulfilling umpiring duties.",
        "Leg umpire must record every ball.",
        "ICC and CICA Indoor Rules apply unless explicitly modified by this document.",
        "Decisions by the CICA Committee are final in case of ambiguity.",
      ),
      p("For additional details, refer to the official CICA Indoor Rules and General Rules documents linked above. All teams and players are expected to adhere to these regulations to ensure a fair and enjoyable tournament."),
    ],
  },
]
