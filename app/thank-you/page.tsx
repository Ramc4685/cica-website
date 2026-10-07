import type { Metadata } from "next"
import Link from "next/link"

// Landing page for form posts made without JavaScript (submit.php redirects here with ?ref=).
export const metadata: Metadata = {
  title: "Request received | CICA",
  description: "Your request was received by CICA.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function ThankYouPage() {
  return (
    <section className="page-hero">
      <div className="page-shell">
        <p className="eyebrow">Request received</p>
        <h1>Thank you. We have it.</h1>
        <p>An organizer will follow up using the email address you gave. If you need to reach us sooner, email <a className="text-link" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>.</p>
        <Link href="/" className="premium-button mt-8">Back to home</Link>
      </div>
    </section>
  )
}
