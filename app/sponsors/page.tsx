"use client"

import { useState } from "react"
import { SponsorSpotlight } from "@/components/sponsor-spotlight"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2 } from "lucide-react"
import { nameField, emailField, phoneField, messageField, submitForm, UNCERTAIN_SUBMISSION } from "@/lib/form-submission"

const formSchema = z.object({ website: z.string().max(200), fullName: nameField("Full name"), company: nameField("Company name", 200), email: emailField, phone: phoneField, interest: nameField("Sponsorship interest", 200), message: messageField })
type FormValues = z.infer<typeof formSchema>
const fields = [
  { name: "fullName", label: "Full Name", type: "text", autoComplete: "name", maximum: 100 },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", maximum: 200 },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", maximum: 254 },
  { name: "phone", label: "Phone (Optional)", type: "tel", autoComplete: "tel", maximum: 30 },
  { name: "interest", label: "Sponsorship Interest", type: "text", autoComplete: "off", maximum: 200 },
  { name: "message", label: "Message", type: "textarea", autoComplete: "off", maximum: 3000 },
] satisfies readonly { name: keyof FormValues; label: string; type: string; autoComplete: string; maximum: number }[]

export default function SponsorsPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema), defaultValues: { website: "", fullName: "", company: "", email: "", phone: "", interest: "", message: "" },
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const onSubmit = async (values: FormValues) => {
    setSubmissionError(null)
    try {
      await submitForm("sponsor", values)
      setSubmitSuccess(true)
      reset()
    } catch {
      setSubmissionError(UNCERTAIN_SUBMISSION)
    }
  }

  return (
    <div className="page-shell">
      <header className="page-hero mb-10">
        <p className="eyebrow">Community partnerships</p>
        <h1 className="mt-5 mx-auto max-w-4xl">Support the moments that bring us together.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Help cricket thrive in Central Illinois. Let us explore a partnership that makes sense for your organization and our community.</p>
      </header>
      <SponsorSpotlight />
      <div className="grid items-start gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="editorial-panel h-fit p-6 sm:p-8"><p className="eyebrow">Built around community</p><h2 className="mt-4 text-3xl">A partnership with purpose.</h2><p className="mt-5 text-muted-foreground">Connect with people who share a love of cricket. Talk with CICA about tournament support, equipment, or community events.</p><p className="mt-5 text-muted-foreground">Availability, recognition and partnership terms are agreed directly with the organizers. Send an inquiry to start the conversation.</p><a className="mt-6 inline-flex break-all font-semibold underline underline-offset-4" href="mailto:organizers@cicainfo.com?subject=Sponsorship%20inquiry">Email the organizers</a><div className="mt-8 border-t pt-6"><p className="eyebrow">Our community in action</p><a className="mt-3 inline-flex font-semibold underline underline-offset-4" href="https://www.facebook.com/cicacric/" target="_blank" rel="noopener noreferrer">Visit CICA on Facebook ↗</a></div></aside>
        <section className="editorial-panel p-6 sm:p-8" aria-labelledby="form-heading">
          <p className="eyebrow">Let us know</p>
          <h2 id="form-heading" className="mt-4 text-3xl">Become a Sponsor</h2>
          <p className="mt-4 mb-7 text-sm text-muted-foreground">All fields are required except phone. We use these details to handle your request. <Link className="underline underline-offset-4" href="/privacy/">Read our privacy notice.</Link></p>
          {submitSuccess ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6" role="status" aria-live="polite">
              <CheckCircle className="mb-4 h-8 w-8 text-green-800" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-green-950">Your sponsorship inquiry has been recorded.</h3>
              <p className="mt-3 text-green-950">Thank you for your interest. The organizers can discuss opportunities and confirm the details of a potential partnership.</p>
              <Button className="mt-6" variant="outline" type="button" onClick={() => { setSubmitSuccess(false); reset() }}>Send another request</Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-busy={isSubmitting}>
              <div hidden aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>
              {fields.map(field => (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea id={field.name} rows={5} maxLength={field.maximum} autoComplete={field.autoComplete} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} {...register(field.name)} />
                  ) : (
                    <Input id={field.name} type={field.type} maxLength={field.maximum} autoComplete={field.autoComplete} inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} {...register(field.name)} />
                  )}
                  {errors[field.name] && <p id={`${field.name}-error`} className="text-sm text-red-800" role="alert">{errors[field.name]?.message}</p>}
                </div>
              ))}
              {submissionError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-950" role="alert"><p>{submissionError}</p><a className="mt-2 inline-flex break-all font-semibold underline underline-offset-4" href="mailto:organizers@cicainfo.com">Email the organizers</a></div>}
              <Button type="submit" className="w-full min-h-12" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Sending request…</> : "Submit Sponsorship Inquiry"}</Button>
              <p className="text-sm text-muted-foreground">Prefer email? <a className="break-all underline underline-offset-4" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a></p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
