export interface CompanySalesRow {
  period: string
  sku: string
  category: string
  unitsSold: number
  channel: string
}

export interface CalendarEvent {
  period: string
  event: string
}

export interface SkuForecast {
  sku: string
  lastPeriod: string
  lastUnits: number
  forecastUnits: number
  trend: 'up' | 'down' | 'stable'
  volatility: 'high' | 'moderate' | 'low'
}

export interface CompanyAnalysis {
  companyLabel: string
  source: 'demo' | 'upload'
  rowCount: number
  skuCount: number
  periodCount: number
  forecasts: SkuForecast[]
  recommendations: string[]
  risks: string[]
  eventsUsed: string[]
}

const SALES_ALIASES = {
  period: ['period', 'week', 'date', 'week_number'],
  sku: ['sku', 'product', 'item', 'product_name'],
  category: ['category', 'family', 'product_group'],
  units: ['units', 'unitssold', 'qty', 'quantity', 'sales', 'units_sold'],
  channel: ['channel', 'outlet', 'customer_type'],
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    if (row[key]) return row[key]
  }
  return ''
}

export function rowsToSales(rows: Record<string, string>[]): CompanySalesRow[] {
  return rows
    .map((row) => ({
      period: pick(row, SALES_ALIASES.period),
      sku: pick(row, SALES_ALIASES.sku),
      category: pick(row, SALES_ALIASES.category) || 'Unspecified',
      unitsSold: Number(pick(row, SALES_ALIASES.units).replace(/,/g, '')),
      channel: pick(row, SALES_ALIASES.channel) || 'Unspecified',
    }))
    .filter((row) => row.period && row.sku && Number.isFinite(row.unitsSold))
}

export function rowsToEvents(rows: Record<string, string>[]): CalendarEvent[] {
  return rows
    .map((row) => ({
      period: pick(row, ['period', 'week', 'date']),
      event: pick(row, ['event', 'note', 'tag', 'calendar_event']),
    }))
    .filter((row) => row.period && row.event)
}

export function analyseCompanySales(
  sales: CompanySalesRow[],
  events: CalendarEvent[],
  source: 'demo' | 'upload',
  companyLabel: string,
): CompanyAnalysis {
  const bySku = new Map<string, CompanySalesRow[]>()
  for (const row of sales) {
    const list = bySku.get(row.sku) ?? []
    list.push(row)
    bySku.set(row.sku, list)
  }

  const forecasts: SkuForecast[] = [...bySku.entries()].map(([sku, rows]) => {
    const ordered = [...rows].sort((a, b) => a.period.localeCompare(b.period, undefined, { numeric: true }))
    const units = ordered.map((r) => r.unitsSold)
    const last = units[units.length - 1] ?? 0
    const prev = units[units.length - 2] ?? last
    const recent = units.slice(-3)
    const avgRecent = recent.reduce((s, n) => s + n, 0) / Math.max(recent.length, 1)
    const forecastUnits = Math.round(avgRecent * 0.7 + last * 0.3)
    const change = last === 0 ? 0 : (last - prev) / last
    const spread = Math.max(...units) - Math.min(...units)
    const mean = units.reduce((s, n) => s + n, 0) / Math.max(units.length, 1)
    const volRatio = mean === 0 ? 0 : spread / mean

    return {
      sku,
      lastPeriod: ordered[ordered.length - 1]?.period ?? '',
      lastUnits: last,
      forecastUnits,
      trend: change > 0.04 ? 'up' : change < -0.04 ? 'down' : 'stable',
      volatility: volRatio > 0.28 ? 'high' : volRatio > 0.14 ? 'moderate' : 'low',
    }
  })

  const highVol = forecasts.filter((f) => f.volatility === 'high')
  const rising = forecasts.filter((f) => f.trend === 'up')
  const eventsUsed = events.map((e) => `${e.period}: ${e.event}`)

  const recommendations = [
    highVol.length
      ? `Use a forecast band (not a single number) for ${highVol.map((f) => f.sku).join(', ')} — perishable SKUs with high volatility.`
      : 'Volatility is moderate across SKUs. Keep a short weekly review before locking production.',
    rising.length
      ? `Confirm capacity and milk intake for rising SKUs: ${rising.map((f) => f.sku).join(', ')}.`
      : 'No sharp upward SKUs this period — watch for under-production if orders rebound.',
    eventsUsed.length
      ? `Calendar events were included (${eventsUsed.length}). Recheck the next-week plan against those dates.`
      : 'No calendar file was attached. Tag holidays, school terms, and promotions next time to improve the forecast.',
  ]

  const risks = [
    ...highVol.map((f) => `Waste risk: ${f.sku} (high volatility, last ${f.lastUnits.toLocaleString()} units)`),
    ...forecasts
      .filter((f) => f.trend === 'down')
      .map((f) => `Stockout risk if ${f.sku} rebounds after a dip (forecast ${f.forecastUnits.toLocaleString()} units)`),
  ]

  const periods = new Set(sales.map((r) => r.period))

  return {
    companyLabel,
    source,
    rowCount: sales.length,
    skuCount: bySku.size,
    periodCount: periods.size,
    forecasts,
    recommendations,
    risks: risks.length ? risks : ['No major risk flags from this dataset — still review with sales before locking the plan.'],
    eventsUsed,
  }
}
