import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { CompanyApplyStep } from '../components/CompanyApplyStep'
import { getAgent } from '../data/agents'
import { getModuleDetail } from '../data/learningModules'
import type { CompanyAnalysis } from '../lib/companyForecast'
import './Platform2.css'

export function AgentWorkspace() {
  const { agentId } = useParams<{ agentId: string }>()
  const agent = agentId ? getAgent(agentId) : undefined
  const detail = agentId ? getModuleDetail(agentId) : undefined
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null)

  if (!agent) {
    return <Navigate to="/agents" replace />
  }

  if (agent.status !== 'pilot' || !detail) {
    return (
      <div className="cb-page cb-module-intro">
        <Link to="/agents" className="cb-back">
          <ArrowLeft size={16} /> Back to agents
        </Link>
        <div className="cb-card cb-intro-card">
          <p className="cb-kicker">Agent {agent.number}</p>
          <h1>{agent.name}</h1>
          <p className="cb-muted">{agent.purpose}</p>
          <p>This agent will open after the SME consultation prioritises it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cb-page">
      <Link to="/agents" className="cb-back">
        <ArrowLeft size={16} /> Back to agents
      </Link>
      <section className="cb-card">
        <p className="cb-kicker">Operational agent</p>
        <h1 className="cb-agent-title">{agent.name}</h1>
        <p className="cb-muted">{agent.purpose}</p>
        <p className="cb-agent-learn">
          New to this topic?{' '}
          <Link to={`/modules/${agent.id}`}>
            <BookOpen size={14} /> Open the learning module
          </Link>
        </p>
        <CompanyApplyStep
          items={detail.applyItems}
          analysis={analysis}
          onAnalysis={setAnalysis}
          intro="Upload your company CSV, or use the demo export to try the agent. There is no lesson on this path — the agent runs on the files you attach."
          runHint="Files are ready. Run the agent on this dataset."
        />
      </section>
    </div>
  )
}
