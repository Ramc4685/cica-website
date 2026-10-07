import { communityLinks } from "@/lib/content"

export interface JoinStep {
  id: string
  title: string
  text: string
  cta: { href: string; label: string; external?: boolean }
  photoId: string
}

export const joinSteps: readonly JoinStep[] = [
  { id: "format", title: "Pick a format", text: "Outdoor seasons, indoor cricket and the Cricket Premier League each run a little differently. Browse the competitions and see which suits you.", cta: { href: "/tournaments/", label: "Explore competitions" }, photoId: "indoor-community" },
  { id: "organizer", title: "Talk to an organizer", text: "Tell the organizers about your experience and what you are looking for. They confirm current dates, eligibility and fees for each competition.", cta: { href: "/contact/", label: "Contact organizers" }, photoId: "team-gathering" },
  { id: "team", title: "Join a team or register", text: "Organizers can point you towards a team looking for players, or explain how to register a team of your own.", cta: { href: "/get-involved/", label: "Find your place" }, photoId: "outdoor-teams" },
  { id: "play", title: "Play the season", text: "Follow fixtures and scores on CricClubs, turn up on matchday and enjoy the cricket with the community.", cta: { href: communityLinks.scores, label: "Fixtures & scores", external: true }, photoId: "community-on-field" },
]
