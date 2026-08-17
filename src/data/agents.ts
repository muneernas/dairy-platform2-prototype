import { LEARNING_MODULES } from './learningModules'

export interface AgentCatalogItem {
  id: string
  number: number
  name: string
  purpose: string
  status: 'pilot' | 'planned'
}

const AGENT_COPY: Record<string, { name: string; purpose: string }> = {
  'ai-platforms': {
    name: 'Simple agent builder',
    purpose: 'Prepare data and instructions for a first operational agent.',
  },
  'demand-forecast': {
    name: 'Demand forecasting agent',
    purpose: 'Upload weekly sales by SKU to estimate next-period demand and flag waste or stockout risk.',
  },
  'sales-orders': {
    name: 'Sales and orders agent',
    purpose: 'Analyse confirmed and pending orders by product, customer, channel, and delivery date.',
  },
  'production-planning': {
    name: 'Production planning agent',
    purpose: 'Turn forecast and orders into a feasible production plan given capacity and materials.',
  },
  'production-sequencing': {
    name: 'Production sequencing agent',
    purpose: 'Organise runs to reduce changeovers, cleaning time, delays, and product loss.',
  },
  inventory: {
    name: 'Inventory agent',
    purpose: 'Track stock across batches and locations to spot shortages, excess, and slow movers.',
  },
  'shelf-life': {
    name: 'Shelf-life agent',
    purpose: 'Monitor remaining life and batch age to support FEFO dispatch and cut expiry losses.',
  },
  procurement: {
    name: 'Milk procurement agent',
    purpose: 'Support purchasing of milk, ingredients, cultures, and packaging using price, lead time, and quality.',
  },
  'predictive-maintenance': {
    name: 'Predictive maintenance agent',
    purpose: 'Use downtime, alarms, and asset records to flag equipment at risk of failure.',
  },
  'costing-margin': {
    name: 'Costing and margin agent',
    purpose: 'Estimate product, customer, or channel profitability from prices, costs, and utilities.',
  },
  complaints: {
    name: 'Complaints agent',
    purpose: 'Organise quality, packaging, delivery, and expiry complaints and link them to batches.',
  },
}

export const AGENT_CATALOG: AgentCatalogItem[] = LEARNING_MODULES.map((mod) => {
  const copy = AGENT_COPY[mod.id]
  return {
    id: mod.id,
    number: mod.number,
    name: copy?.name ?? mod.title,
    purpose: copy?.purpose ?? mod.description,
    status: mod.status,
  }
})

export function getAgent(id: string): AgentCatalogItem | undefined {
  return AGENT_CATALOG.find((agent) => agent.id === id)
}
