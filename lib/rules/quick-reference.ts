// Quick-reference cards for /rules/. Every value is taken from the named source document; nothing is
// inferred. Competition labels use the site's current names (user decision 2026-10-07).

import { officialDocuments } from "@/lib/documents"
import type { QuickReference } from "@/lib/rules/types"

export const quickReferences: readonly QuickReference[] = [
  {
    id: "cpl-indoor-2025",
    competition: "CPL Indoor",
    setting: "Indoor",
    season: "2025",
    source: officialDocuments.cplIndoor2025,
    detailsHref: "/rules/indoor/#cpl-indoor-2025",
    facts: [
      { label: "Teams", value: "8, single pool, round robin; top 4 go to Qualifier 1, Eliminator 1, Qualifier 2 and the Final" },
      { label: "Overs", value: "13 per team" },
      { label: "Bowling", value: "Max 3 overs per bowler, max 3 bowlers bowling 3 overs; at least 5 bowlers used" },
      { label: "Power plays", value: "Bowling: overs 1–2. Batting: 1 over chosen between overs 3–13 (defaults to the 13th)" },
      { label: "Impact players", value: "List of 12 submitted before the match; impact players must arrive within the first 4 overs" },
      { label: "Playoff eligibility", value: "Youth players 1 match, other players 2 matches" },
      { label: "Ties", value: "League: points shared. Knockouts: bowl-out" },
    ],
  },
  {
    id: "cica-indoor-2025",
    competition: "CICA Indoor",
    setting: "Indoor",
    season: "2025",
    source: officialDocuments.indoor2025,
    detailsHref: "/rules/indoor/#cica-indoor-2025",
    facts: [
      { label: "Teams", value: "10 in two groups of 5; top 4 per group reach the quarterfinals" },
      { label: "Roster", value: "14 players; $20 replacement fee; replaced players cannot rejoin" },
      { label: "Overs", value: "13 per team" },
      { label: "Bowling", value: "Max 3 bowlers can bowl a max of 3 overs; at least 5 bowlers used" },
      { label: "Power plays", value: "Bowling: overs 1–2. Batting: 1 over between overs 3–13 (defaults to the 13th)" },
      { label: "Playoff eligibility", value: "At least 1 game" },
      { label: "Not applicable", value: "LBW and leg byes" },
      { label: "Ties", value: "League: points split. Knockouts: bowl-out (no Super Over)" },
    ],
  },
  {
    id: "outdoor-general",
    competition: "Outdoor competitions",
    setting: "Outdoor",
    season: "General rules",
    source: officialDocuments.generalRules,
    detailsHref: "/rules/#general-rules",
    facts: [
      { label: "Overs", value: "Set before each tournament; no game under 10 overs unless CICA approves" },
      { label: "Power play (20 overs)", value: "Overs 1–4: max 2 fielders outside the 30-yard circle. Overs 5–6: max 3. Then max 5" },
      { label: "Players to start", value: "At least 7; team list to the umpires 5 minutes before the start" },
      { label: "Grace period", value: "15 minutes, then two overs deducted every 5 minutes from the team causing the delay" },
      { label: "Postseason eligibility", value: "At least 2 games with the same team" },
      { label: "Points", value: "Win +2; draw, tie or no result 1 each; no bonus points" },
      { label: "Ties", value: "League: points shared, no Super Over. Knockouts: Super Over" },
      { label: "Ranking", value: "Head-to-head first, then net run rate" },
    ],
  },
]
