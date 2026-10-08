import type { Metadata } from "next"
import OrganizerTools from "./organizer-tools"

export const metadata: Metadata = {
  title: "Organizer tools | CICA",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AdminPage() {
  return <OrganizerTools />
}
