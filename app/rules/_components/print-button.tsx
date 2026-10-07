"use client"

import { Printer } from "lucide-react"

/** Opens the browser's print dialog in the capsule anatomy (printer icon in the circle); the print
 * stylesheet in documents.module.css drops the site chrome. */
export function PrintButton({ label = "Print" }: { label?: string }) {
  return <button type="button" className="capsule" data-tone="green" data-variant="outline" onClick={() => window.print()}>
    <span className="capsule-icon"><Printer aria-hidden="true" /></span>
    <span className="capsule-label">{label}</span>
  </button>
}
