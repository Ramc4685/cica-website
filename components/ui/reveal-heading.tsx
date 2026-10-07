import { Fragment, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface RevealHeadingProps {
  /** Heading text. "\n" starts a new line; wrap words in *asterisks* to render them as <em>. */
  text: string
  as?: "h1" | "h2" | "h3"
  id?: string
  className?: string
}

/**
 * Server-rendered masked word reveal. Words stay in reading order and are fully visible
 * by default; site-motion.tsx only lowers them while the heading waits below the fold
 * with motion running, then each word rises once (60ms stagger).
 */
export function RevealHeading({ text, as = "h2", id, className }: RevealHeadingProps) {
  const Heading = as
  let index = 0
  let emphasis = false
  return <Heading id={id} className={cn("reveal-heading", className)}>
    {text.split("\n").map((line, lineIndex) => <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/\s+/).filter(Boolean).map((raw, wordIndex) => {
        const opens = raw.startsWith("*")
        const closes = raw.endsWith("*") && raw.length > 1
        if (opens) emphasis = true
        const word = raw.replace(/^\*|\*$/g, "")
        const isEm = emphasis
        if (closes) emphasis = false
        const style = { "--word-index": index++ } as CSSProperties
        return <Fragment key={wordIndex}>
          {wordIndex > 0 && " "}
          <span className="reveal-word"><span style={style}>{isEm ? <em>{word}</em> : word}</span></span>
        </Fragment>
      })}
    </Fragment>)}
  </Heading>
}
