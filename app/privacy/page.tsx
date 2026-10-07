import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { pageMetadata } from "@/lib/site-metadata"
import styles from "./privacy.module.css"
export const metadata = pageMetadata("Privacy & your information", "Understand the information collected through CICA’s website forms and how to contact organizers about your details.", "/privacy/")
// TODO(organizers): set the exact effective date, e.g. "October 7, 2026". Shown as pending until set.
const effectiveDate: string | null = null
// TODO(organizers): choose a retention period (e.g. "24 months"). The server implements no automatic deletion, so the page says so until a period is set and enforced.
const retentionPeriod: string | null = null

const formDetails = [
  { form: "Contact form", fields: "first and last name, email address, optional phone number, subject and message" },
  { form: "Community updates form", fields: "name, email address and optional phone number" },
  { form: "Sponsorship form", fields: "full name, company, email address, optional phone number, area of interest and message" },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHero tag="Your information" title={"A clear explanation.\nA direct way to *ask.*"}
        intro="How information submitted through this website is used, and where to go with a question.">
        <p className={styles.effective}>Effective date: {effectiveDate ?? "being confirmed with the organizers"}</p>
      </PageHero>
      <article className={`page-shell ${styles.article}`}>
        <div className={styles.prose}>
          <section>
            <h2>What each form collects</h2>
            <ul>
              {formDetails.map(item => <li key={item.form}><span><strong>{item.form}:</strong> {item.fields}.</span></li>)}
            </ul>
            <p>Please do not include sensitive personal information in a message. The website does not use these forms to take payments or tournament registrations.</p>
          </section>
          <section>
            <h2>Why we ask</h2>
            <p>Contact information is used to respond to inquiries, discuss sponsorship or handle requests for community updates. An updates request is not tournament registration. If you want to stop receiving updates, email the organizers.</p>
          </section>
          <section>
            <h2>Where submissions go</h2>
            <p>Each submission is saved as a private record on CICA’s Namecheap hosting account, outside the public website files, and is emailed to the organizers at organizers@cicainfo.com. You receive a reference number you can quote when you contact us. Earlier submissions may remain in the Google Sheets used by the previous forms.</p>
          </section>
          <section>
            <h2>Spam protection</h2>
            <p>To limit abuse, the server counts requests per visitor using a salted, hashed form of your network address rather than the address itself. The raw address is not stored with your submission, and the counts expire automatically.</p>
          </section>
          <section>
            <h2>How long we keep it</h2>
            <p>{retentionPeriod ? `We keep submissions for ${retentionPeriod}, then delete them.` : "Records are kept until an organizer deletes them; no automatic deletion happens yet. The organizers are confirming a fixed retention period."} You can ask for your record to be exported or removed at any time.</p>
          </section>
          <section>
            <h2>Children</h2>
            <p>These forms are for adults and for parents or guardians. Do not submit a form if you are under 13; a parent or guardian can write to us on your behalf.</p>
          </section>
          <section>
            <h2>External services</h2>
            <p>This website links to CricClubs, Google documents, Facebook, YouTube and WhatsApp. When you open an external service, its privacy practices apply. CICA does not control those services.</p>
          </section>
          <section>
            <h2>Questions, corrections or removal</h2>
            <p>Email <a href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a> to ask about information you have submitted, request a correction or removal, or stop community updates. Include your reference number if you have one, but do not send passwords or sensitive documents.</p>
            <CapsuleLink href="/contact/" variant="outline" className={styles.cta}>Contact CICA</CapsuleLink>
          </section>
        </div>
      </article>
    </>
  )
}
