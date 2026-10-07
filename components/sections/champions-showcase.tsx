"use client"

import Image from "next/image"
import { useId, type ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { competitions as allCompetitions, computeChampionStats, recordsUpdated, type Competition } from "@/lib/champions"
import { cn } from "@/lib/utils"
import { buildChampionHighlights, formatIsoDate, smallLogo, tournamentForCompetition } from "./competition-meta"
import { useRovingTabs } from "./use-roving-tabs"
import styles from "./champions-showcase.module.css"

export interface ChampionsShowcaseProps {
  /** Defaults to every competition in lib/champions. */
  competitions?: readonly Competition[]
  /** `full` (the /champions archive) adds the season table; `compact` (home "Recent champions") shows only competitions with records and links to /champions. */
  variant?: "full" | "compact"
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  /** `label` drops the display heading for a small tag-row heading (use straight under a PageHero). */
  introVariant?: "display" | "label"
  className?: string
}

/** "Archive last updated <date>" once organizers confirm a date, otherwise the newest recorded season. */
function archiveStatus(list: readonly Competition[]) {
  if (recordsUpdated) return `Archive last updated ${formatIsoDate(recordsUpdated)}.`
  const { latestSeason } = computeChampionStats(list)
  return latestSeason ? `Records run through the ${latestSeason} season.` : undefined
}

/** Pill tab track over a feature card per competition, with the season archive below in the full variant. */
export function ChampionsShowcase({ competitions = allCompetitions, variant = "full", tag, title, subtitle, headingId = "champions-title", introVariant = "display", className }: ChampionsShowcaseProps) {
  const compact = variant === "compact"
  const list = compact ? competitions.filter(competition => competition.records.length > 0) : competitions
  const { active, setActive, onKeyDown, registerTab } = useRovingTabs(list.length)
  const baseId = useId()
  if (list.length === 0) return null
  const tabId = (index: number) => `${baseId}-tab-${index}`
  const panelId = (index: number) => `${baseId}-panel-${index}`
  const status = archiveStatus(list)
  const intro = subtitle ?? "Champions as recorded by CICA. Missing seasons are being confirmed with organizers."
  return <section className={cn(styles.section, "page-shell", className)} data-variant={variant} aria-labelledby={headingId}>
    <SectionIntro
      tag={tag ?? (compact ? "Recent champions" : "Roll of honour")}
      title={title ?? (compact ? "Proud names on\nthe *trophy.*" : "Every recorded\n*champion.*")}
      subtitle={status ? <>{intro} <span className={styles.status}>{status}</span></> : intro}
      id={headingId}
      variant={introVariant}
      reveal
    />
    <div className={styles.track} role="tablist" aria-label="Competitions" onKeyDown={onKeyDown}>
      {list.map((competition, index) => <button key={competition.id} ref={registerTab(index)} type="button" role="tab" id={tabId(index)}
        aria-selected={index === active} aria-controls={panelId(index)} tabIndex={index === active ? 0 : -1}
        className={styles.tab} onClick={() => setActive(index)}>{competition.title}</button>)}
    </div>
    {list.map((competition, index) => <div key={competition.id} role="tabpanel" id={panelId(index)} aria-labelledby={tabId(index)} hidden={index !== active} className={styles.panel}>
      <ChampionFeature competition={competition} />
      {!compact && competition.records.length > 0 && <ChampionTable competition={competition} />}
    </div>)}
    {compact && <div className={styles.more}><CapsuleLink href="/champions/">See every champion</CapsuleLink></div>}
  </section>
}

function ChampionFeature({ competition }: { competition: Competition }) {
  const { latest, pills } = buildChampionHighlights(competition)
  const logo = tournamentForCompetition(competition.id)?.logo
  return <article className={styles.feature} data-tone="green" aria-label={`${competition.title} highlights`}>
    {logo && <span className={styles.logo}><Image src={smallLogo(logo)} alt="" width={72} height={72} /></span>}
    {latest
      ? <div className={styles.featureCopy}>
          <p className="tag-row">{competition.title} · {latest.season}</p>
          <p className={styles.champion}>{latest.champion}</p>
          <ul className={styles.pills} aria-label="Highlights">{pills.map(pill => <li key={pill}>{pill}</li>)}</ul>
        </div>
      : <div className={styles.featureCopy}>
          <p className="tag-row">{competition.title}</p>
          <p className={cn(styles.champion, styles.pending)}>Results being confirmed with organizers</p>
          <p className={styles.note}>Champions for {competition.title} will appear here once organizers confirm them.</p>
          <CapsuleLink href="/contact/" tone="cream" variant="outline">Ask an organizer</CapsuleLink>
        </div>}
  </article>
}

function ChampionTable({ competition }: { competition: Competition }) {
  const showRunnerUp = competition.records.some(record => record.runnerUp)
  const showNotes = competition.records.some(record => record.notes)
  return <div className={styles.tableWrap}>
    <table className={styles.table}>
      <caption className="sr-only">{competition.title} champions by season, newest first</caption>
      <thead><tr><th scope="col">Season</th><th scope="col">Champion</th>{showRunnerUp && <th scope="col">Runner-up</th>}{showNotes && <th scope="col">Notes</th>}</tr></thead>
      <tbody>{competition.records.map(record => <tr key={record.season}>
        <th scope="row">{record.season}</th>
        <td>{record.champion}</td>
        {showRunnerUp && <td>{record.runnerUp ?? <span className={styles.muted}>Not recorded</span>}</td>}
        {showNotes && <td>{record.notes ?? ""}</td>}
      </tr>)}</tbody>
    </table>
  </div>
}
