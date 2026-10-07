import { z } from "zod"

// Pages CMS writes "" for blank optional fields; treat that as "not set".
const blankToUndefined = (value: unknown) => (value === "" ? undefined : value)
const text = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.preprocess(blankToUndefined, z.string().trim().max(max).optional())
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
const httpsUrl = z.string().url().max(500).refine(value => value.startsWith("https://"), "Links must start with https://")
const optionalHttpsUrl = z.preprocess(blankToUndefined, httpsUrl.optional())
const optionalIsoDate = z.preprocess(blankToUndefined, isoDate.optional())
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words joined by hyphens").max(80)
const optionalSlug = z.preprocess(blankToUndefined, slug.optional())
const uploadExt = /\.(?:jpe?g|png|webp)$/i
const imagePath = (folder: RegExp) => z.string().max(200)
  .regex(folder, "Image must be uploaded through the editor")
  .refine(value => !value.includes(".."), "Invalid image path")
  .refine(value => uploadExt.test(value), "Use a JPG, PNG or WebP image")

// Pages CMS deletes keys whose value is "" or [] when it saves, so those keys must be optional or defaulted.
export const championPhotoSchema = z.object({
  src: imagePath(/^\/uploads\/champions\/[A-Za-z0-9._-]+$/),
  alt: text(200),
}).strict()

export const championsFileSchema = z.object({
  recordsUpdated: optionalIsoDate,
  competitions: z.array(z.object({
    id: z.enum(["mains", "cica-indoor", "cpl-indoor", "cpl-outdoor", "mini", "challengers"]),
    title: text(80),
    records: z.array(z.object({
      season: z.number().int().min(1998).max(2100),
      champion: text(80),
      runnerUp: optionalText(80),
      notes: optionalText(300),
      photo: championPhotoSchema.optional(),
    }).strict()).default([]),
  }).strict()).default([]),
}).strict()

export const photosFileSchema = z.object({
  photos: z.array(z.object({
    id: slug,
    src: imagePath(/^\/(?:images\/community|uploads\/photos)\/[A-Za-z0-9._-]+$/),
    alt: text(200),
    caption: text(160),
    objectPosition: z.string().regex(/^\d{1,3}% \d{1,3}%$/, "Use a focal point like 50% 35%"),
    gallery: z.boolean(),
    hero: z.boolean(),
  }).strict()).min(1),
}).strict()

const tbc = z.literal("tbc")
// Pages CMS has no number-or-"tbc" field, so organizers type these as text; "13" becomes 13.
const countOrTbc = (max: number) => z.preprocess(
  value => (typeof value === "string" && /^\d+$/.test(value.trim()) ? Number(value.trim()) : blankToUndefined(value)),
  z.union([z.number().int().min(1).max(max), tbc]).optional(),
)
export const tournamentsFileSchema = z.object({
  tournaments: z.array(z.object({
    id: slug,
    name: text(80),
    setting: z.enum(["Outdoor", "Indoor"]),
    logo: z.string().regex(/^\/images\/cica-logo-[a-z0-9-]+\.webp$/),
    description: text(400),
    registrationStatus: z.enum(["open", "closed", "upcoming", "tbc"]),
    registrationDeadline: optionalIsoDate,
    registrationUrl: optionalHttpsUrl,
    format: z.object({
      overs: countOrTbc(100),
      ballType: z.enum(["leather", "tennis", "tbc"]).optional(),
      squadSize: countOrTbc(40),
      rulesPdf: optionalHttpsUrl,
    }).strict().default({}),
  }).strict()).default([]),
}).strict()

export const seasonFileSchema = z.object({
  events: z.array(z.object({ id: slug, title: text(120), date: isoDate, competitionId: optionalSlug, venueId: optionalSlug, summary: optionalText(400), url: optionalHttpsUrl }).strict()).default([]),
  announcements: z.array(z.object({ id: slug, title: text(120), date: isoDate, body: text(2000), url: optionalHttpsUrl }).strict()).default([]),
  faq: z.array(z.object({ id: slug, question: text(200), answer: text(5000) }).strict()).default([]),
}).strict()

export function parseContent<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, data: unknown, file: string): T {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  const issue = result.error.issues[0]
  throw new Error(`content/${file}: ${issue.path.join(".")}: ${issue.message}`)
}
