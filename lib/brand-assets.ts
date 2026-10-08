import sponsorsFile from "@/content/sponsors.json"
import teamsFile from "@/content/teams.json"
import { parseContent, sponsorsFileSchema, teamsFileSchema } from "@/lib/content-schema"
import { logoUrl, smallLogoUrl } from "@/lib/media"

export interface BrandLogo { id: string; name: string; /** Full-size logo URL. */ logo: string; /** Small logo URL for tiles. */ small: string }
const resolve = (item: { id: string; name: string; logo: string }): BrandLogo => ({ id: item.id, name: item.name, logo: logoUrl(item.logo), small: smallLogoUrl(item.logo) })

/** CPL teams and team sponsors are edited through Pages CMS in content/teams.json and content/sponsors.json. */
export const cplTeams: readonly BrandLogo[] = parseContent(teamsFileSchema, teamsFile, "teams.json").teams.map(resolve)
export const cplSponsors: readonly BrandLogo[] = parseContent(sponsorsFileSchema, sponsorsFile, "sponsors.json").cplSponsors.map(resolve)

/** The seven CICA identities, ordered for the About family wall. Files: public/images/cica-logo-<id>.webp (transparent) and public/images/logos-family/cica-logo-<id>-{blue,yellow}.webp. */
export const cicaIdentities = [
  { id: "main", name: "CICA" },
  { id: "mains", name: "CICA Mains" },
  { id: "cpl", name: "CPL" },
  { id: "mini", name: "CICA Mini" },
  { id: "indoor", name: "CICA Indoor" },
  { id: "tournaments", name: "CICA Tournaments" },
  { id: "100", name: "CICA 100" },
] as const
export type CicaIdentityId = (typeof cicaIdentities)[number]["id"]
