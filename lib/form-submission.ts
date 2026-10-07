import { z } from "zod"

export const nameField = (label: string, maximum = 100) => z.string().trim().min(1, `${label} is required`).max(maximum, `${label} must be ${maximum} characters or fewer`)
export const emailField = z.string().trim().email("Invalid email address").max(254, "Email is too long")
export const phoneField = z.string().trim().max(30, "Phone number is too long").refine(value => !value || (/^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15), "Enter a phone number with 7–15 digits, or leave it blank")
export const messageField = z.string().trim().min(10, "Message must be at least 10 characters").max(3000, "Message must be 3,000 characters or fewer")

export const UNCERTAIN_SUBMISSION = "We could not confirm your request. It may already have been saved. Before submitting again, email organizers@cicainfo.com so we can check."

export type FormType = "contact" | "updates" | "sponsor"

// Same-origin requests keep personal information on the CICA hosting account.
export async function submitForm(type: FormType, values: object): Promise<void> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch("/forms/submit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...values }),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(UNCERTAIN_SUBMISSION)
    const result: unknown = await response.json()
    if (!result || typeof result !== "object" || !("success" in result) || result.success !== true) {
      throw new Error(UNCERTAIN_SUBMISSION)
    }
  } catch {
    // Network failures can occur after the server saves a row: avoid blind retries.
    throw new Error(UNCERTAIN_SUBMISSION)
  } finally {
    clearTimeout(timeout)
  }
}
