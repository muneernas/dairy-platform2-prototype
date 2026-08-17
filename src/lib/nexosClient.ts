/**
 * Option B architecture: custom learning platform calls nexos.ai Gateway API
 * (OpenAI-compatible). Falls back to structured mock responses when no API key.
 */

export type AgentResponseSource = 'nexos' | 'mock'

export interface AgentResponse {
  content: string
  source: AgentResponseSource
}

const NEXOS_BASE = 'https://api.nexos.ai/v1'

export async function askForecastAgent(
  userQuestion: string,
  moduleContext: string,
): Promise<AgentResponse> {
  const apiKey = import.meta.env.VITE_NEXOS_API_KEY as string | undefined
  const model = (import.meta.env.VITE_NEXOS_MODEL as string | undefined) ?? 'GPT 5 mini'

  if (apiKey) {
    try {
      const res = await fetch(`${NEXOS_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are a dairy SME demand forecasting tutor. Answer briefly in plain language. Ground answers in the provided simulated dataset context. Do not invent plant-specific facts beyond the context.',
            },
            {
              role: 'user',
              content: `Context:\n${moduleContext}\n\nLearner question: ${userQuestion}`,
            },
          ],
          max_tokens: 400,
        }),
      })

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[]
        }
        const text = data.choices?.[0]?.message?.content?.trim()
        if (text) return { content: text, source: 'nexos' }
      }
    } catch {
      // fall through to mock
    }
  }

  return { content: mockForecastAnswer(userQuestion), source: 'mock' }
}

function mockForecastAnswer(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('yogurt') || q.includes('spike') || q.includes('week 5')) {
    return 'The plain yogurt spike in weeks 5–6 is consistent with a seasonal retail lift. In production planning, treat yogurt as the highest-volatility SKU this period and use a forecast band rather than a single number.'
  }
  if (q.includes('waste') || q.includes('overproduction')) {
    return 'Forecast error on perishable SKUs drives waste faster than on cheese or UHT products. Combine AI forecast with a short sales review before locking volume — especially for yogurt and fresh milk.'
  }
  if (q.includes('real') || q.includes('company') || q.includes('apply')) {
    return 'To apply this module: export your SKU-level sales history, tag calendar events, run the same agent workflow on your data, and compare forecast error weekly. The simulated case teaches the decision loop — your data makes it operational.'
  }
  return 'Use the simulated table to compare week-over-week trends by SKU. The agent highlights yogurt volatility and recommends a cross-functional review before production lock — that is the core capability this module builds.'
}
