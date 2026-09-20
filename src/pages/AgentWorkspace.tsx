import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { CompanyApplyStep } from '../components/CompanyApplyStep'
import { getAgent } from '../data/agents'
import { getModuleDetail } from '../data/learningModules'
import type { CompanyAnalysis } from '../lib/companyForecast'
import { useI18n } from '../i18n/I18nProvider'
import './Platform2.css'

export function AgentWorkspace() {
  const { t } = useI18n()
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
          <ArrowLeft size={16} className="dir-aware-icon" /> {t('agent.back')}
        </Link>
        <div className="cb-card cb-intro-card">
          <p className="cb-kicker">{t('agent.kicker', { number: agent.number })}</p>
          <h1>{agent.name}</h1>
          <p className="cb-muted">{agent.purpose}</p>
          <p>{t('agent.locked')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cb-page">
      <Link to="/agents" className="cb-back">
        <ArrowLeft size={16} className="dir-aware-icon" /> {t('agent.back')}
      </Link>
      <section className="cb-card">
        <p className="cb-kicker">{t('agent.opsKicker')}</p>
        <h1 className="cb-agent-title">{agent.name}</h1>
        <p className="cb-muted">{agent.purpose}</p>
        <p className="cb-agent-learn">
          {t('agent.newToTopic')}{' '}
          <Link to={`/modules/${agent.id}`}>
            <BookOpen size={14} /> {t('agent.openModule')}
          </Link>
        </p>
        <CompanyApplyStep
          items={detail.applyItems}
          analysis={analysis}
          onAnalysis={setAnalysis}
          intro={t('apply.agentIntro')}
          runHint={t('apply.agentRunHint')}
        />
      </section>
    </div>
  )
}
