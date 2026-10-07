import { z } from "zod"

export const nameField = (label: string, maximum = 100) => z.string().trim().min(1, `${label} is required`).max(maximum, `${label} must be ${maximum} characters or fewer`)
export const emailField = z.string().trim().email("Invalid email address").max(254, "Email is too long")
export const phoneField = z.string().trim().max(30, "Phone number is too long").refine(value => !value || (/^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15), "Enter a phone number with 7–15 digits, or leave it blank")
export const messageField = z.string().trim().min(10, "Message must be at least 10 characters").max(3000, "Message must be 3,000 characters or fewer")

export const UNCERTAIN_SUBMISSION = "We could not confirm your request. It may already have been saved. Before submitting again, email organizers@cicainfo.com so we can check."

export type FormType = "contact" | "updates" | "sponsor"

/** `uncertain` means the server may have stored the request; otherwise it definitely did not. `message` is always safe to show. */
export class SubmissionError extends Error {
  constructor(message: string, readonly uncertain: boolean, readonly retryAfterSeconds?: number) {
    super(message)
    this.name = "SubmissionError"
  }
}

const FALLBACK_REJECTION = "We could not accept your request. Check the form and try again, or email organizers@cicainfo.com."

function waitText(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  return minutes <= 1 ? "about a minute" : `${minutes} minutes`
}

async function rejection(response: Response): Promise<SubmissionError> {
  let message = FALLBACK_REJECTION
  try {
    const body: unknown = await response.json()
    if (body && typeof body === "object" && "message" in body && typeof body.message === "string" && body.message) message = body.message
  } catch {
    // Non-JSON 4xx (for example a host error page): keep the generic text.
  }
  if (response.status === 429) {
    const seconds = Number.parseInt(response.headers.get("Retry-After") ?? "", 10)
    if (Number.isFinite(seconds) && seconds > 0) {
      return new SubmissionError(`Too many requests. Please wait ${waitText(seconds)} and try again, or email organizers@cicainfo.com.`, false, seconds)
    }
  }
  return new SubmissionError(message, false)
}

// Same-origin requests keep personal information on the CICA hosting account.
export async function submitForm(type: FormType, values: object): Promise<{ reference: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch("/forms/submit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...values }),
      signal: controller.signal,
    })
    if (response.status >= 400 && response.status < 500) throw await rejection(response)
    if (!response.ok) throw new SubmissionError(UNCERTAIN_SUBMISSION, true)
    const result: unknown = await response.json()
    if (!result || typeof result !== "object" || !("success" in result) || result.success !== true) {
      throw new SubmissionError(UNCERTAIN_SUBMISSION, true)
    }
    const reference = "reference" in result && typeof result.reference === "string" ? result.reference : ""
    return { reference }
  } catch (error) {
    if (error instanceof SubmissionError) throw error
    // Network failures, timeouts and bad bodies can follow a successful save: avoid blind retries.
    throw new SubmissionError(UNCERTAIN_SUBMISSION, true)
  } finally {
    clearTimeout(timeout)
  }
}
