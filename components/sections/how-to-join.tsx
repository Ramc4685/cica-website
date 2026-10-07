"use client"

import Image from "next/image"
import { useId, type ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityPhotos, photoFocusStyle, type CommunityPhoto } from "@/lib/community-photos"
import { cn } from "@/lib/utils"
import { joinSteps, type JoinStep } from "./join-steps"
import { useRovingTabs } from "./use-roving-tabs"
import styles from "./how-to-join.module.css"

export interface HowToJoinProps {
  steps?: readonly JoinStep[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

const photoFor = (id: string): CommunityPhoto | undefined => communityPhotos.find(photo => photo.id === id)

/** Green panel with a four-step tablist (click or arrow keys). Steps never advance on scroll. */
export function HowToJoin({ steps = joinSteps, tag = "Your first step", title = "Good things start\nwith a *connection.*", subtitle = "You don’t need to know every rule or belong to a team to start a conversation.", headingId = "how-to-join-title", className }: HowToJoinProps) {
  const { active, setActive, onKeyDown, registerTab } = useRovingTabs(steps.length)
  const baseId = useId()
  if (steps.length === 0) return null
  return <section className={cn(styles.section, className)} data-tone="green" aria-labelledby={headingId}>
    <div className="page-shell">
      <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} tone="dark" reveal />
      <div className={styles.layout}>
        <div className={styles.rail} role="tablist" aria-orientation="vertical" aria-label="Steps to join" onKeyDown={onKeyDown}>
          {steps.map((step, index) => <button key={step.id} ref={registerTab(index)} type="button" role="tab" id={`${baseId}-tab-${index}`}
            aria-selected={index === active} aria-controls={`${baseId}-panel-${index}`} tabIndex={index === active ? 0 : -1}
            className={styles.step} onClick={() => setActive(index)}>
            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>{step.title}</span>
          </button>)}
        </div>
        {steps.map((step, index) => {
          const photo = photoFor(step.photoId)
          return <div key={step.id} role="tabpanel" id={`${baseId}-panel-${index}`} aria-labelledby={`${baseId}-tab-${index}`} hidden={index !== active} className={styles.panel}>
            {photo && <figure className={styles.photo}><Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} className="community-photo" style={photoFocusStyle(photo)} sizes="(max-width: 900px) 100vw, 40vw" /></figure>}
            <div className={styles.copy}>
              <p className={styles.stepCount}>Step {index + 1} of {steps.length}</p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
              <CapsuleLink href={step.cta.href} external={step.cta.external} tone="cream">{step.cta.label}</CapsuleLink>
            </div>
          </div>
        })}
      </div>
    </div>
  </section>
}
