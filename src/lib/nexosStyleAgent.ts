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
  /** Set when live LLM was configured but failed, so the UI can explain the fallback */
  fallbackReason?: string
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
}): Promise<{ text: string | null; error?: string }> {
  const base = opts.baseUrl.replace(/\/$/, '')
  let res: Response
  try {
    res = await fetch(`${base}/chat/completions`, {
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
        max_tokens: 800,
        temperature: 0.3,
      }),
    })
  } catch (err) {
    return { text: null, error: err instanceof Error ? err.message : 'Network error calling LLM' }
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return {
      text: null,
      error: `LLM HTTP ${res.status}${detail ? `: ${detail.slice(0, 180)}` : ''}`,
    }
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string; reasoning?: string } }[]
  }
  const message = data.choices?.[0]?.message
  const content = message?.content?.trim()
  if (content) return { text: content }

  // Some Groq "oss" models fill reasoning first; content can be empty if max_tokens is tight
  const reasoning = message?.reasoning?.trim()
  if (reasoning) {
    const trimmed = reasoning.replace(/^[\s\S]*?(?=\n\n|[A-Z])/u, '').trim()
    return { text: trimmed || reasoning.slice(0, 500) }
  }

  return { text: null, error: 'LLM returned an empty message' }
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
    const result = await callOpenAiCompatible({
      baseUrl: 'https://api.nexos.ai/v1',
      apiKey: nexosKey,
      model: (import.meta.env.VITE_NEXOS_MODEL as string | undefined) ?? 'GPT 5 mini',
      system,
      user,
    })
    if (result.text) return { content: result.text, source: 'nexos', knowledgeUsed }
  }

  const llmKey = (import.meta.env.VITE_LLM_API_KEY as string | undefined)?.trim()
  if (llmKey) {
    const result = await callOpenAiCompatible({
      baseUrl:
        (import.meta.env.VITE_LLM_BASE_URL as string | undefined) ??
        'https://api.groq.com/openai/v1',
      apiKey: llmKey,
      model: (import.meta.env.VITE_LLM_MODEL as string | undefined) ?? 'qwen/qwen3.8-27b',
      system,
      user,
    })
    if (result.text) return { content: result.text, source: 'stand-in', knowledgeUsed }
    return {
      content: offlineForecastAnswer(userQuestion, knowledge),
      source: 'mock',
      knowledgeUsed,
      fallbackReason: result.error ?? 'Live LLM returned no text',
    }
  }

  return {
    content: offlineForecastAnswer(userQuestion, knowledge),
    source: 'mock',
    knowledgeUsed,
    fallbackReason:
      'No VITE_LLM_API_KEY in this build (GitHub Pages has no key — use npm run dev locally)',
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
