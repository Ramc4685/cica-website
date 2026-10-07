"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2 } from "lucide-react"
import { nameField, emailField, phoneField, submitForm, UNCERTAIN_SUBMISSION } from "@/lib/form-submission"

const formSchema = z.object({ website: z.string().max(200), name: nameField("Name"), email: emailField, phone: phoneField })
type FormValues = z.infer<typeof formSchema>
const fields = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name", maximum: 100 },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", maximum: 254 },
  { name: "phone", label: "Phone Number (Optional)", type: "tel", autoComplete: "tel", maximum: 30 },
] satisfies readonly { name: keyof FormValues; label: string; type: string; autoComplete: string; maximum: number }[]

export default function JoinPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema), defaultValues: { website: "", name: "", email: "", phone: "" },
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const onSubmit = async (values: FormValues) => {
    setSubmissionError(null)
    try {
      await submitForm("updates", values)
      setSubmitSuccess(true)
      reset()
    } catch {
      setSubmissionError(UNCERTAIN_SUBMISSION)
    }
  }

  return (
    <div className="page-shell">
      <header className="page-hero mb-10">
        <p className="eyebrow">Community updates</p>
        <h1 className="mt-5 mx-auto max-w-4xl">Keep the community close.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Interested in cricket news and community events? Leave your details to request updates from CICA. For playing or volunteering, talk to an organizer.</p>
      </header>
      <div className="grid items-start gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-5"><div className="editorial-panel p-6 sm:p-8"><p className="eyebrow">01 / Find your next step</p><h2 className="mt-4 text-3xl">New player? Family? Volunteer?</h2><p className="mt-5 text-muted-foreground">Tell the organizers how you would like to take part. Ask about team placement, upcoming events, or ways to support the community.</p><Button asChild className="mt-6"><Link href="/contact/">Talk to an organizer</Link></Button></div><div className="editorial-panel p-6 sm:p-8"><p className="eyebrow">02 / Follow the cricket</p><h2 className="mt-4 text-2xl">Explore before you join.</h2><p className="mt-4 text-muted-foreground">Browse our tournament formats, then ask the organizers about current schedules and registration.</p><Link className="mt-5 inline-flex font-semibold underline underline-offset-4" href="/tournaments/">Explore tournaments</Link></div></aside>
        <section className="editorial-panel p-6 sm:p-8" aria-labelledby="form-heading">
          <p className="eyebrow">Let us know</p>
          <h2 id="form-heading" className="mt-4 text-3xl">Request Community Updates</h2>
          <p className="mt-4 mb-7 text-sm text-muted-foreground">All fields are required except phone. We use these details to handle your request. <Link className="underline underline-offset-4" href="/privacy/">Read our privacy notice.</Link></p>
          {submitSuccess ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6" role="status" aria-live="polite">
              <CheckCircle className="mb-4 h-8 w-8 text-green-800" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-green-950">Your update request has been recorded.</h3>
              <p className="mt-3 text-green-950">This records your interest in CICA news and events. It does not register you for a team or tournament.</p>
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
              <Button type="submit" className="w-full min-h-12" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Sending request…</> : "Request Updates"}</Button>
              <p className="text-sm text-muted-foreground">Prefer email? <a className="break-all underline underline-offset-4" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a></p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
