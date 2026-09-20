/**
 * Nexos-style stand-in agent: fixed instructions + knowledge retrieval +
 * OpenAI-compatible chat (Groq / Gemini free tiers, or real nexos later).
 */

import { retrieveKnowledge, type KnowledgeChunk } from '../data/forecastKnowledgeBase'

export type AgentReplySource = 'nexos' | 'stand-in' | 'mock'

export interface AgentChatReply {
  content: string
  source: AgentReplySource
  knowledgeUsed: string[]
}

/** Same four parts you would configure on nexos → Agents → Instructions */
export const FORECAST_AGENT_INSTRUCTIONS = `You are the Platform 2 Demand Forecasting agent for dairy SMEs.

## Job
- Forecast next-period demand by SKU from the provided sales table and optional external signals.
- Answer follow-up questions briefly in plain language (3–6 short sentences).
- A person always reviews before acting. You do not change ERP, production, or stock.

## Dairy context
- Products spoil at different rates; yogurt and fresh milk are volatile; cheese/UHT are slower.
- Jordan-relevant signals: school terms, holidays, Ramadan, promotions, weather.
- Prefer forecast bands on high-volatility perishable SKUs.

## File rules
- Only use facts present in the run context or the knowledge excerpts.
- If data is missing, say what is missing. Do not invent plant-specific numbers.

## Result style
- Stay practical for a small dairy manager.
- When relevant, mention risks (waste/stockout) and one clear next action.`

function buildSystemPrompt(knowledge: KnowledgeChunk[]): string {
  const kb =
    knowledge.length === 0
      ? '(no knowledge excerpts)'
      : knowledge.map((k) => `### ${k.title}\n${k.body}`).join('\n\n')

  return `${FORECAST_AGENT_INSTRUCTIONS}

## Knowledge base excerpts (treat as attached nexos knowledge)
${kb}`
}

async function callOpenAiCompatible(opts: {
  baseUrl: string
  apiKey: string
  model: string
  system: string
  user: string
}): Promise<string | null> {
  const base = opts.baseUrl.replace(/\/$/, '')
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: 'system', content: opts.system },
        { role: 'user', content: opts.user },
      ],
      max_tokens: 450,
      temperature: 0.3,
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  return data.choices?.[0]?.message?.content?.trim() || null
}

/**
 * Ask the forecast agent. Preference order:
 * 1) Real nexos Gateway (if VITE_NEXOS_API_KEY)
 * 2) Free/OpenAI-compatible stand-in (Groq / Gemini) + local KB
 * 3) Offline heuristic mock
 */
export async function askNexosStyleForecastAgent(
  userQuestion: string,
  runContext: string,
): Promise<AgentChatReply> {
  const knowledge = retrieveKnowledge(userQuestion)
  const knowledgeUsed = knowledge.map((k) => k.title)
  const system = buildSystemPrompt(knowledge)
  const user = `## This run's data / insight\n${runContext}\n\n## Learner question\n${userQuestion}`

  const nexosKey = (import.meta.env.VITE_NEXOS_API_KEY as string | undefined)?.trim()
  if (nexosKey) {
    try {
      const text = await callOpenAiCompatible({
        baseUrl: 'https://api.nexos.ai/v1',
        apiKey: nexosKey,
        model: (import.meta.env.VITE_NEXOS_MODEL as string | undefined) ?? 'GPT 5 mini',
        system,
        user,
      })
      if (text) return { content: text, source: 'nexos', knowledgeUsed }
    } catch {
      // fall through
    }
  }

  const llmKey = (import.meta.env.VITE_LLM_API_KEY as string | undefined)?.trim()
  if (llmKey) {
    try {
      const text = await callOpenAiCompatible({
        baseUrl:
          (import.meta.env.VITE_LLM_BASE_URL as string | undefined) ??
          'https://api.groq.com/openai/v1',
        apiKey: llmKey,
        model:
          (import.meta.env.VITE_LLM_MODEL as string | undefined) ?? 'openai/gpt-oss-20b',
        system,
        user,
      })
      if (text) return { content: text, source: 'stand-in', knowledgeUsed }
    } catch {
      // fall through
    }
  }

  return {
    content: offlineForecastAnswer(userQuestion, knowledge),
    source: 'mock',
    knowledgeUsed,
  }
}

function offlineForecastAnswer(question: string, knowledge: KnowledgeChunk[]): string {
  const q = question.toLowerCase()
  const fromKb = knowledge[0]?.body

  if (q.includes('yogurt') || q.includes('spike') || q.includes('week 5')) {
    return (
      'The yogurt spike lines up with an external signal (often school term or promo), not a permanent level shift. ' +
      'Treat yogurt as high-volatility: use a band, confirm with sales, then lock. ' +
      (fromKb ? `KB note: ${fromKb.slice(0, 180)}…` : '')
    )
  }
  if (q.includes('waste') || q.includes('overproduction') || q.includes('spoil')) {
    return (
      'Waste risk is highest when a perishable SKU is locked to a point forecast after a spike. ' +
      'Prefer a cautious band on yogurt/fresh milk and review before production lock. ' +
      (fromKb ? `KB note: ${fromKb.slice(0, 180)}…` : '')
    )
  }
  if (q.includes('signal') || q.includes('ramadan') || q.includes('school') || q.includes('promo')) {
    return (
      'Attach or read the external-signals calendar, then link each event week to SKUs that moved sharply vs the prior week. ' +
      'School terms and Ramadan are common Jordan dairy drivers. ' +
      (fromKb ? `KB note: ${fromKb.slice(0, 180)}…` : '')
    )
  }
  if (q.includes('real') || q.includes('company') || q.includes('apply')) {
    return (
      'Export weekly sales by SKU/channel, optionally add a signals calendar, run the same agent, and have a manager review before locking the plan. ' +
      'The agent does not write back to ERP. ' +
      (fromKb ? `KB note: ${fromKb.slice(0, 180)}…` : '')
    )
  }

  return (
    'Use SKU-level history plus external signals, then review recommendations and risks before locking volume. ' +
    (fromKb ? `From knowledge base (${knowledge[0].title}): ${fromKb.slice(0, 220)}…` : '')
  )
}
