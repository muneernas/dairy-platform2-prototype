/**
 * Stand-in for a nexos agent knowledge base.
 * In production these chunks would be files attached to the nexos agent.
 */

export interface KnowledgeChunk {
  id: string
  title: string
  tags: string[]
  body: string
}

export const FORECAST_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'sku-level',
    title: 'Why dairy SMEs forecast at SKU level',
    tags: ['sku', 'forecast', 'waste', 'stockout', 'yogurt', 'milk', 'cheese'],
    body: `Dairy products spoil at different rates. Yogurt and fresh milk are high-volatility and short shelf-life; cheese and UHT are slower. A plant-level total forecast hides which SKU will waste or stock out. Always forecast by SKU (and ideally by channel: retail vs food service), then roll up for milk intake planning.`,
  },
  {
    id: 'external-signals',
    title: 'External signals that move dairy demand',
    tags: ['signal', 'external', 'school', 'holiday', 'ramadan', 'promo', 'promotion', 'weather', 'calendar'],
    body: `External signals are calendar events outside the sales export that explain spikes and dips. Typical Jordan dairy signals: school term start/end (breakfast yogurt and single-serve milk), public holidays (shorter retail week), Ramadan and pre-Ramadan stock-up (channel shift to evening/horeca; labneh and cheese patterns change), promotions, and heat waves (cold drinks and some fresh products). Link the event week to SKUs that moved ≥8% vs the prior week before locking production.`,
  },
  {
    id: 'bands-not-points',
    title: 'Use a forecast band on volatile SKUs',
    tags: ['volatility', 'band', 'yogurt', 'waste', 'overproduction', 'planning'],
    body: `For high-volatility perishable SKUs (especially plain and flavoured yogurt), never treat a single point forecast as a production order. Use a ± band, review with sales for 10–15 minutes, then lock. Overproduction on yogurt becomes waste within days; underproduction loses shelf slots. Cheese can tolerate a tighter point estimate.`,
  },
  {
    id: 'decision-loop',
    title: 'How the SME should use the agent output',
    tags: ['decision', 'manager', 'apply', 'company', 'erp', 'review'],
    body: `The agent advises; it does not write to ERP or start production. Recommended loop: (1) export weekly sales by SKU/channel, (2) attach an external-signals calendar, (3) run the agent, (4) human reviews headline, table, recommendations, and risks, (5) adjust and lock the plan. Compare forecast error weekly to improve.`,
  },
  {
    id: 'file-rules',
    title: 'Required sales file columns',
    tags: ['csv', 'file', 'column', 'upload', 'data', 'missing'],
    body: `Sales file should include: period (e.g. Week 5), sku, category, unitsSold, channel. Missing weeks or blank units must be flagged - do not invent volumes. External signals file (optional): period, eventName, eventType (school_term, holiday, ramadan, promotion, weather, other), expectedImpact. Wrong column names should stop the run with a clear error.`,
  },
  {
    id: 'waste-risk',
    title: 'Forecast error and waste',
    tags: ['waste', 'spoil', 'expiry', 'over', 'yogurt', 'fresh'],
    body: `Forecast error on perishable SKUs drives waste faster than on cheese or UHT. Highest waste risk usually sits on the highest-volatility fresh SKU when production is locked to a point forecast after a promo or school-driven spike. Prefer a cautious uplift and FEFO discipline on finished goods.`,
  },
]

export function retrieveKnowledge(question: string, limit = 3): KnowledgeChunk[] {
  const tokens = question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2)

  const scored = FORECAST_KNOWLEDGE_BASE.map((chunk) => {
    const hay = `${chunk.title} ${chunk.tags.join(' ')} ${chunk.body}`.toLowerCase()
    let score = 0
    for (const t of tokens) {
      if (chunk.tags.includes(t)) score += 3
      else if (hay.includes(t)) score += 1
    }
    return { chunk, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const top = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.chunk)
  if (top.length) return top
  // Always ground the agent in core SOP chunks if the question is vague
  return FORECAST_KNOWLEDGE_BASE.filter((c) =>
    ['sku-level', 'decision-loop', 'bands-not-points'].includes(c.id),
  )
}
