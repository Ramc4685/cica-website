"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { CapsuleChevrons } from "@/components/ui/capsule-link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { emailField, nameField, phoneField, submitForm, SubmissionError, UNCERTAIN_SUBMISSION, type FormType } from "@/lib/form-submission"
import { cn } from "@/lib/utils"
import styles from "./community-form.module.css"

export interface CommunityFieldOption {
  value: string
  label: string
  /** Extra key matched by `prefillParam`, e.g. a tier id in `?interest=premium`. */
  slug?: string
}

/** Plain data so server pages can pass it to this client island. */
export interface CommunityField {
  /** Must match the field name public/forms/submit.php expects for this form kind. */
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  /** Character limit; keep in step with the submit.php schema. */
  maxLength: number
  autoComplete?: string
  /** Name used in the "is required" message when it differs from the label. */
  errorLabel?: string
  options?: readonly CommunityFieldOption[]
  /** First, empty option for a select. */
  placeholder?: string
}

export interface CommunityFormProps {
  kind: FormType
  fields: readonly CommunityField[]
  tag: string
  title: string
  submitLabel: string
  successCopy: { title?: string; body: string }
  /** Name of a select field to prefill from the matching query parameter on load. */
  prefillParam?: string
  /** Prefill a free-text field from a query value, e.g. `?topic=update` sets the subject to a fixed sentence. Unknown values are ignored. */
  topicPrefill?: { param: string; field: string; values: Readonly<Record<string, string>> }
  className?: string
}

type Values = Record<string, string>
type Outcome = { phase: "idle" } | { phase: "success"; reference: string }

const ORGANIZERS = "organizers@cicainfo.com"

// Mirrors submit.php: every field but phone is required, limits are character counts, phone needs 7+ digits.
function schemaFor(fields: readonly CommunityField[]) {
  const shape: Record<string, z.ZodTypeAny> = { website: z.string().max(200) }
  for (const field of fields) {
    if (field.type === "email") shape[field.name] = emailField
    else if (field.type === "tel") shape[field.name] = phoneField
    else shape[field.name] = nameField(field.errorLabel ?? field.label, field.maxLength)
  }
  return z.object(shape)
}

const subscribeNothing = () => () => {}

export function CommunityForm({ kind, fields, tag, title, submitLabel, successCopy, prefillParam, topicPrefill, className }: CommunityFormProps) {
  const schema = useMemo(() => schemaFor(fields), [fields])
  const defaultValues = useMemo(() => Object.fromEntries([["website", ""], ...fields.map(field => [field.name, ""])]) as Values, [fields])
  const { register, handleSubmit, reset, setValue, setFocus, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues })
  const [outcome, setOutcome] = useState<Outcome>({ phase: "idle" })
  const [failure, setFailure] = useState<{ message: string; uncertain: boolean } | null>(null)
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const focusFirstField = useRef(false)
  const ids = { section: `${kind}-form`, heading: `${kind}-form-heading`, failure: `${kind}-form-failure` }

  useEffect(() => {
    if (!prefillParam) return
    const field = fields.find(item => item.name === prefillParam)
    const wanted = new URLSearchParams(window.location.search).get(prefillParam)?.trim().toLowerCase()
    const match = wanted && field?.options?.find(option => [option.value, option.slug].some(key => key?.toLowerCase() === wanted))
    if (match) setValue(prefillParam, match.value)
  }, [fields, prefillParam, setValue])

  useEffect(() => {
    if (!topicPrefill) return
    const wanted = new URLSearchParams(window.location.search).get(topicPrefill.param)?.trim().toLowerCase()
    const text = wanted ? topicPrefill.values[wanted] : undefined
    if (text) setValue(topicPrefill.field, text)
  }, [topicPrefill, setValue])

  useEffect(() => {
    if (outcome.phase === "success") successHeading.current?.focus()
    else if (focusFirstField.current) {
      focusFirstField.current = false
      setFocus(fields[0].name)
    }
  }, [outcome, fields, setFocus])

  const onSubmit = async (values: Values) => {
    setFailure(null)
    try {
      const { reference } = await submitForm(kind, values)
      reset()
      setOutcome({ phase: "success", reference })
    } catch (error) {
      setFailure(error instanceof SubmissionError
        ? { message: error.message, uncertain: error.uncertain }
        : { message: UNCERTAIN_SUBMISSION, uncertain: true })
    }
  }

  const sendAnother = () => {
    focusFirstField.current = true
    setOutcome({ phase: "idle" })
  }

  const status = isSubmitting ? "Sending your request…"
    : outcome.phase === "success" ? `Request sent.${outcome.reference ? ` Your reference is ${outcome.reference}.` : ""}`
    : ""

  return (
    <section id={ids.section} aria-labelledby={ids.heading} className={cn(styles.card, className)}>
      <p className="tag-row">{tag}</p>
      <h2 id={ids.heading} className={styles.title}>{title}</h2>
      {/* Always mounted so screen readers announce changes to its text. */}
      <p role="status" aria-live="polite" className="sr-only">{status}</p>

      {outcome.phase === "success" ? (
        <div className={styles.success} data-tone="green">
          <h3 ref={successHeading} tabIndex={-1} className={styles.successTitle}>{successCopy.title ?? "Thanks, we'll be in touch."}</h3>
          <p className="mt-4 text-[color:var(--cica-on-dark-muted)]">{successCopy.body}</p>
          {outcome.reference && (
            <p className={styles.reference}>Reference <span className="font-mono tracking-wide text-cream">{outcome.reference}</span></p>
          )}
          <button type="button" className={styles.again} onClick={sendAnother}>Send another request</button>
        </div>
      ) : (
        <>
          <p className="mb-7 mt-4 text-sm text-[color:var(--cica-green-soft)]">
            All fields are required except phone. We use these details to handle your request.{" "}
            <Link className="underline underline-offset-4" href="/privacy/">Read our privacy notice.</Link>
          </p>
          {/* method/action keep the form working before hydration or without JavaScript; submit.php redirects to /thank-you/. */}
          <form method="post" action="/forms/submit.php" noValidate onSubmit={handleSubmit(onSubmit)}
            className={cn("space-y-5", styles.form)} data-hydrated={hydrated ? "" : undefined} aria-busy={isSubmitting}
            aria-describedby={failure ? ids.failure : undefined}>
            <input type="hidden" name="type" value={kind} />
            <div hidden aria-hidden="true">
              <label htmlFor={`${kind}-website`}>Website</label>
              <input id={`${kind}-website`} tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            {fields.map(field => {
              const id = `${kind}-${field.name}`
              const error = errors[field.name]?.message
              const describedBy = error ? `${id}-error` : undefined
              const common = { id, "aria-invalid": !!error, "aria-describedby": describedBy, ...register(field.name) }
              return (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={id}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea rows={5} maxLength={field.maxLength} autoComplete={field.autoComplete ?? "off"} {...common} />
                  ) : field.type === "select" ? (
                    <Select {...common}>
                      <option value="">{field.placeholder ?? "Choose one"}</option>
                      {field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </Select>
                  ) : (
                    <Input type={field.type} maxLength={field.maxLength} autoComplete={field.autoComplete ?? "off"}
                      inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"} {...common} />
                  )}
                  {error && <p id={`${id}-error`} className="text-sm font-medium text-destructive">{error}</p>}
                </div>
              )
            })}
            {failure && (
              <div id={ids.failure} role="alert" className="rounded-2xl border border-destructive/50 bg-destructive/5 p-4 text-ink">
                <p>{failure.message}</p>
                {failure.uncertain && <a className="mt-2 inline-flex break-all font-semibold text-green underline underline-offset-4" href={`mailto:${ORGANIZERS}`}>Email the organizers</a>}
              </div>
            )}
            {/* Full width on forms, but the same capsule anatomy as every CapsuleLink: chevron circle + serif label. */}
            <button type="submit" className={cn("capsule", styles.submit)} data-tone="green" data-variant="filled" data-size="block" disabled={isSubmitting}>
              <span className="capsule-icon">{isSubmitting ? <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <CapsuleChevrons />}</span>
              <span className="capsule-label">{isSubmitting ? "Sending…" : submitLabel}</span>
            </button>
            <p className="text-sm text-[color:var(--cica-green-soft)]">
              Prefer email? <a className="break-all underline underline-offset-4" href={`mailto:${ORGANIZERS}`}>{ORGANIZERS}</a>
            </p>
          </form>
        </>
      )}
    </section>
  )
}
