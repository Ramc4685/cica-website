/** Owner-supplied CICA / CPL artwork. Names transcribed from the actual logos. */
export const cplTeams = [
  { id: "archrivals", name: "RCS Archrivals" },
  { id: "bloom-barista-bulls", name: "Bloom Barista Bulls" },
  { id: "bloom-events-eagles", name: "Bloom Events Eagles" },
  { id: "my-craft-barn-challengers", name: "My Craft Barn Challengers" },
  { id: "gnr-systems-lions", name: "GNR Systems Lions" },
  { id: "gpt-shers", name: "GPT Shers" },
  { id: "techie-brains-legends", name: "Techie Brains Legends" },
  { id: "parke-regency-thalaivas", name: "Parke Regency Thalaivas" },
] as const
export const cplSponsors = [
  { id: "bloom-barista", name: "Bloom Barista" },
  { id: "bloom-bazaar", name: "Bloom Bazaar" },
  { id: "bloom-events", name: "Bloom Events" },
  { id: "global-prime-taxation", name: "Global Prime Taxation LLC" },
  { id: "gnr-systems", name: "GNR Systems" },
  { id: "my-craft-barn", name: "My Craft Barn" },
  { id: "parke-regency", name: "Parke Regency Hotel & Conference Center" },
  { id: "techie-brains", name: "Techie Brains Inc." },
] as const

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
