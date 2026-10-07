import { getMetrics, type Metric } from "@/lib/season"
import { cn } from "@/lib/utils"
import styles from "./metrics-strip.module.css"

export interface MetricsStripProps {
  /** Verifiable figures only. Defaults to getMetrics() (founded, competitions, seasons recorded, titles awarded). */
  metrics?: readonly Metric[]
  /** Accessible name for the strip. */
  label?: string
  className?: string
}

function MetricItem({ metric, copy = false }: { metric: Metric; copy?: boolean }) {
  return <li className={cn(styles.item, copy && styles.copy)} aria-hidden={copy || undefined}>
    <span className={styles.value}>{metric.value}</span> <span className={styles.label}>/ {metric.label}</span>
  </li>
}

/**
 * Serif numerals with a "/ label" on ink. With motion running the list drifts as a CSS marquee
 * that stops on hover or focus; paused or reduced motion shows one static, wrapped row.
 */
export function MetricsStrip({ metrics = getMetrics(), label = "CICA in numbers", className }: MetricsStripProps) {
  if (metrics.length === 0) return null
  return <section className={cn(styles.strip, className)} data-tone="ink" aria-label={label}>
    <div className={styles.viewport}>
      <ul className={styles.track}>
        {metrics.map(metric => <MetricItem key={metric.id} metric={metric} />)}
        {/* Second run makes the loop seamless; hidden from assistive tech and from the static layout. */}
        {metrics.map(metric => <MetricItem key={`${metric.id}-copy`} metric={metric} copy />)}
      </ul>
    </div>
  </section>
}
