/**
 * Agent chat entry point for Module 2.
 * Prefers real nexos → free LLM stand-in + KB → offline mock.
 */

export {
  askNexosStyleForecastAgent as askForecastAgent,
  type AgentChatReply as AgentResponse,
  type AgentReplySource as AgentResponseSource,
} from './nexosStyleAgent'
