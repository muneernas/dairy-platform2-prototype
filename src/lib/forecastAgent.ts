/**
 * Local demand-forecast agent for demos.
 * Same shape as a nexos run: file in → process → structured out.
 * Production can swap this for the nexos Gateway call.
 */

import type { AgentInsight, ExternalSignalRow, ExternalSignalUsed, SimulatedDataRow } from '../types/platform2'
import {
  analyseCompanySales,
  type CalendarEvent,
  type CompanyAnalysis,
  type CompanySalesRow,
} from './companyForecast'

export interface ForecastAgentResult {
  insight: AgentInsight
  analysis: CompanyAnalysis
  engine: 'local-demo'
}

function salesFromSimulated(rows: SimulatedDataRow[]): CompanySalesRow[] {
  return rows.map((r) => ({
    period: r.period,
    sku: r.sku,
    category: r.category,
    unitsSold: r.unitsSold,
    channel: r.channel,
  }))
}

function eventsFromSignals(signals: ExternalSignalRow[]): CalendarEvent[] {
  return signals.map((s) => ({
    period: s.period,
    event: s.eventName,
    eventType: s.eventType,
    expectedImpact: s.expectedImpact,
  }))
}

/** Find which SKUs moved most in a given week vs the prior week. */
function linkEventToSkus(sales: CompanySalesRow[], period: string): string {
  const weekNum = Number(period.replace(/\D/g, '')) || 0
  const prevLabel = period.replace(String(weekNum), String(weekNum - 1))
  const bySku = new Map<string, { curr?: number; prev?: number }>()

  for (const row of sales) {
    const entry = bySku.get(row.sku) ?? {}
    if (row.period === period) entry.curr = row.unitsSold
    if (row.period === prevLabel || row.period.includes(`Week ${weekNum - 1}`)) {
      entry.prev = row.unitsSold
    }
    bySku.set(row.sku, entry)
  }

  const lifts: { sku: string; pct: number; curr: number; prev: number }[] = []
  for (const [sku, v] of bySku) {
    if (v.curr == null || v.prev == null || v.prev === 0) continue
    const pct = ((v.curr - v.prev) / v.prev) * 100
    if (Math.abs(pct) >= 8) {
      lifts.push({ sku, pct, curr: v.curr, prev: v.prev })
    }
  }
  lifts.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
  if (!lifts.length) return 'No large SKU move vs prior week in sales file'
  return lifts
    .slice(0, 2)
    .map((l) => `${l.sku} (${l.pct > 0 ? '+' : ''}${Math.round(l.pct)}% vs prior week)`)
    .join('; ')
}

function nextPeriodLabel(sales: CompanySalesRow[]): string {
  const periods = [...new Set(sales.map((r) => r.period))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )
  const last = periods[periods.length - 1] ?? 'Week 8'
  const n = Number(last.replace(/\D/g, ''))
  if (Number.isFinite(n)) return `Week ${n + 1}`
  return 'Next week'
}

/**
 * Run the forecasting agent on practice or company tables.
 * Mirrors what the nexos agent is instructed to return.
 */
export function runForecastAgent(input: {
  sales: CompanySalesRow[]
  events: CalendarEvent[]
  companyLabel: string
  source: 'demo' | 'upload' | 'practice'
}): ForecastAgentResult {
  const analysis = analyseCompanySales(
    input.sales,
    input.events,
    input.source === 'practice' ? 'demo' : input.source,
    input.companyLabel,
  )

  const nextPeriod = nextPeriodLabel(input.sales)
  const linkedSignals: ExternalSignalUsed[] = input.events.map((e) => ({
    period: e.period,
    eventName: e.event,
    eventType: e.eventType || 'other',
    linkedSkus: linkEventToSkus(input.sales, e.period),
  }))

  const topSignal = linkedSignals[0]
  const highVol = analysis.forecasts.filter((f) => f.volatility === 'high')
  const signalBit = topSignal
    ? ` Main external signal in view: ${topSignal.eventName} (${topSignal.period}) linked to ${topSignal.linkedSkus}.`
    : ' No external signals file was attached — forecast is sales-history only.'

  const insight: AgentInsight = {
    headline: `${nextPeriod} demand forecast — ${analysis.skuCount} products`,
    summary:
      `Based on ${analysis.periodCount} weeks of sales` +
      (input.events.length ? ` plus ${input.events.length} external signal(s)` : '') +
      `, the agent projects ${nextPeriod} volume by SKU.` +
      signalBit +
      (highVol.length
        ? ` Highest volatility: ${highVol.map((f) => f.sku).join(', ')} — use a band, not a single number.`
        : ' Volatility is moderate across SKUs.'),
    externalSignalsUsed: linkedSignals.length ? linkedSignals : undefined,
    forecasts: analysis.forecasts.map((f) => ({
      sku: f.sku,
      nextPeriod,
      forecastUnits: f.forecastUnits,
      trend: f.trend,
    })),
    recommendations: analysis.recommendations,
    risks: analysis.risks,
  }

  return { insight, analysis, engine: 'local-demo' }
}

export function runForecastAgentOnPractice(
  simulatedData: SimulatedDataRow[],
  externalSignals: ExternalSignalRow[] | undefined,
  companyName: string,
): ForecastAgentResult {
  return runForecastAgent({
    sales: salesFromSimulated(simulatedData),
    events: eventsFromSignals(externalSignals ?? []),
    companyLabel: companyName,
    source: 'practice',
  })
}

/** Follow-up answers grounded in the last agent run (demo stand-in for nexos Q&A). */
export function answerForecastFollowUp(
  question: string,
  insight: AgentInsight,
): string {
  const q = question.toLowerCase()
  const yogurt = insight.forecasts.find((f) => /yogurt/i.test(f.sku))
  const signal = insight.externalSignalsUsed?.[0]

  if (q.includes('yogurt') || q.includes('spike') || q.includes('school') || q.includes('promo')) {
    const link = insight.externalSignalsUsed
      ?.map((s) => `${s.period}: ${s.eventName} → ${s.linkedSkus}`)
      .join(' | ')
    return (
      `Yogurt is the volatile SKU in this run` +
      (yogurt ? ` (forecast ${yogurt.forecastUnits.toLocaleString()} units, trend ${yogurt.trend})` : '') +
      `. ` +
      (link
        ? `External signals linked to sales: ${link}. Treat the spike as calendar-driven, then mean-revert unless sales confirms the promo continues.`
        : `Attach an external signals file (school term, promotion, Ramadan) to explain the spike.`)
    )
  }
  if (q.includes('waste') || q.includes('over') || q.includes('spoil')) {
    const risky = insight.risks.filter((r) => /waste/i.test(r)).join(' ')
    return (
      risky ||
      'Waste risk is highest on high-volatility perishable SKUs. Use a ± band on yogurt and confirm with sales before locking the run.'
    )
  }
  if (q.includes('signal') || q.includes('external') || q.includes('calendar') || q.includes('ramadan')) {
    if (!insight.externalSignalsUsed?.length) {
      return 'No external signals were loaded for this run. Upload a calendar CSV (school_term, holiday, promotion, ramadan, weather) so the agent can explain spikes.'
    }
    return (
      `Signals used: ` +
      insight.externalSignalsUsed.map((s) => `${s.period} ${s.eventName} [${s.eventType}]`).join('; ') +
      `. ` +
      (signal ? `Strongest early link: ${signal.eventName} → ${signal.linkedSkus}.` : '')
    )
  }
  if (q.includes('milk')) {
    const milk = insight.forecasts.find((f) => /milk/i.test(f.sku))
    return milk
      ? `Milk forecast ${milk.nextPeriod}: ${milk.forecastUnits.toLocaleString()} units (${milk.trend}). Watch stockout if the downward correction reverses after a holiday week.`
      : insight.summary
  }

  return (
    `${insight.headline}. ${insight.summary} ` +
    `Recommendations: ${insight.recommendations.slice(0, 2).join(' ')}`
  )
}
