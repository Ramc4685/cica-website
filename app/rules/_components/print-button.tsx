"use client"

import { Printer } from "lucide-react"
import styles from "./documents.module.css"

/** Opens the browser's print dialog; the print stylesheet in documents.module.css drops the site chrome. */
export function PrintButton({ label = "Print" }: { label?: string }) {
  return <button type="button" className={styles.printButton} onClick={() => window.print()}>
    <Printer size={18} aria-hidden="true" />{label}
  </button>
}
