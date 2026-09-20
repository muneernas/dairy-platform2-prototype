import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Sparkles,
  Target,
} from 'lucide-react'
import { OptionChips } from '../components/OptionChips'
import { ProgressBar } from '../components/ProgressBar'
import { CompanyApplyStep } from '../components/CompanyApplyStep'
import { AgentFollowUpChat } from '../components/AgentFollowUpChat'
import { getModuleDetail } from '../data/learningModules'
import { runForecastAgentOnPractice } from '../lib/forecastAgent'
import type { CompanyAnalysis } from '../lib/companyForecast'
import {
  MODULE_STEPS,
  type AgentInsight,
  type ModuleDetail,
  type ModuleStepId,
} from '../types/platform2'
import './Platform2.css'
import './LearningModule.css'

type Phase = 'intro' | 'learning' | 'complete'

export function LearningModule() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = moduleId ? getModuleDetail(moduleId) : undefined

  if (!module) {
    return <Navigate to="/pathways" replace />
  }

  return <LearningModuleRunner module={module} />
}

function LearningModuleRunner({ module }: { module: ModuleDetail }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [assessmentIndex, setAssessmentIndex] = useState(0)
  const [showFullData, setShowFullData] = useState(false)
  const [agentRevealed, setAgentRevealed] = useState(false)
  const [agentRunning, setAgentRunning] = useState(false)
  const [liveInsight, setLiveInsight] = useState<AgentInsight | null>(null)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({})
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({})
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})
  const [assessmentFeedback, setAssessmentFeedback] = useState<Record<string, boolean>>({})
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysis | null>(null)

  const currentStep = MODULE_STEPS[stepIndex]
  const progress = phase === 'learning' ? ((stepIndex + 1) / MODULE_STEPS.length) * 100 : 0
  const currentExercise = module.exercises[exerciseIndex]
  const currentAssessment = module.assessment[assessmentIndex]

  const assessmentComplete = module.assessment.every((q) => assessmentAnswers[q.id])

  const assessmentScore = useMemo(() => {
    const correct = module.assessment.filter((q) => assessmentAnswers[q.id] === q.correctValue)
    return Math.round((correct.length / module.assessment.length) * 100)
  }, [module, assessmentAnswers])

  function handleExerciseSelect(value: string) {
    const ex = currentExercise
    const isCorrect = value === ex.correctValue
    setExerciseAnswers((prev) => ({ ...prev, [ex.id]: value }))
    setExerciseFeedback((prev) => ({ ...prev, [ex.id]: isCorrect ? 'correct' : 'incorrect' }))
  }

  function handleAssessmentSelect(value: string) {
    const q = currentAssessment
    setAssessmentAnswers((prev) => ({ ...prev, [q.id]: value }))
    setAssessmentFeedback((prev) => ({ ...prev, [q.id]: value === q.correctValue }))
  }

  const insight = liveInsight ?? module.agentInsight

  async function handleRunForecastAgent() {
    setAgentRunning(true)
    await new Promise((r) => window.setTimeout(r, 1100))
    const result = runForecastAgentOnPractice(
      module.simulatedData,
      module.externalSignals,
      module.companyProfile.name,
    )
    setLiveInsight(result.insight)
    setAgentRevealed(true)
    setAgentRunning(false)
  }

  const practiceChatContext = [
    `Company: ${module.companyProfile.name}`,
    `Headline: ${insight.headline}`,
    `Summary: ${insight.summary}`,
    insight.forecasts?.length
      ? `Forecasts:\n${insight.forecasts
          .map((f) => `- ${f.sku}: ${f.forecastUnits} (${f.trend}) for ${f.nextPeriod}`)
          .join('\n')}`
      : '',
    insight.recommendations?.length
      ? `Recommendations: ${insight.recommendations.join('; ')}`
      : '',
    insight.risks?.length ? `Risks: ${insight.risks.join('; ')}` : '',
    insight.externalSignalsUsed?.length
      ? `Signals used:\n${insight.externalSignalsUsed
          .map((s) => `- ${s.period} ${s.eventName} → ${s.linkedSkus}`)
          .join('\n')}`
      : '',
    'Recent sales rows:',
    module.simulatedData
      .slice(-8)
      .map((r) => `${r.period} ${r.sku}: ${r.unitsSold} (${r.channel})`)
      .join('\n'),
    module.externalSignals?.length
      ? `External signals calendar:\n${module.externalSignals
          .map((e) => `${e.period} ${e.eventName} (${e.eventType})`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n')

  function canAdvanceStep(): boolean {
    switch (currentStep.id) {
      case 'exercise':
        return Boolean(exerciseAnswers[currentExercise.id])
      case 'assessment':
        return Boolean(assessmentAnswers[currentAssessment.id])
      case 'agent-analysis':
        return agentRevealed
      case 'apply-company':
        return Boolean(companyAnalysis)
      default:
        return true
    }
  }

  function goNextStep() {
    if (currentStep.id === 'exercise' && exerciseIndex < module.exercises.length - 1) {
      setExerciseIndex((i) => i + 1)
      return
    }
    if (currentStep.id === 'assessment' && assessmentIndex < module.assessment.length - 1) {
      setAssessmentIndex((i) => i + 1)
      return
    }
    if (stepIndex >= MODULE_STEPS.length - 1) {
      setPhase('complete')
      return
    }
    setStepIndex((i) => i + 1)
    setExerciseIndex(0)
    setAssessmentIndex(0)
    setShowFullData(false)
    setAgentRevealed(false)
    setLiveInsight(null)
  }

  function goPrevStep() {
    if (currentStep.id === 'exercise' && exerciseIndex > 0) {
      setExerciseIndex((i) => i - 1)
      return
    }
    if (currentStep.id === 'assessment' && assessmentIndex > 0) {
      setAssessmentIndex((i) => i - 1)
      return
    }
    if (stepIndex === 0) {
      setPhase('intro')
      return
    }
    const prev = stepIndex - 1
    setStepIndex(prev)
    if (MODULE_STEPS[prev].id === 'exercise') setExerciseIndex(module.exercises.length - 1)
    if (MODULE_STEPS[prev].id === 'assessment') setAssessmentIndex(module.assessment.length - 1)
  }

  function renderStep(stepId: ModuleStepId) {
    switch (stepId) {
      case 'objectives':
        return (
          <div className="lm-body">
            <p className="lm-lead">
              By the end of this course, your team will use an AI forecasting agent to support
              production planning and reduce waste or stockouts.
            </p>
            <ul className="lm-obj-grid">
              {module.learningObjectives.map((obj) => (
                <li key={obj}>
                  <Target size={16} aria-hidden />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
            <div className="lm-case">
              <p className="lm-info-label">Training case</p>
              <h3>{module.companyProfile.name}</h3>
              <p>
                {module.companyProfile.type} · {module.companyProfile.location}
              </p>
              <p className="cb-muted">{module.companyProfile.note}</p>
            </div>
          </div>
        )

      case 'simulated-data':
        return (
          <div className="lm-body">
            <p className="lm-lead">
              Review weekly sales <strong>and</strong> the external signals calendar. Link spikes in
              the sales table to holidays, school terms, and promotions before the guided exercise.
            </p>
            <div className="lm-stats">
              <div className="lm-stat">
                <span>Weeks</span>
                <strong>8</strong>
              </div>
              <div className="lm-stat">
                <span>SKUs</span>
                <strong>4</strong>
              </div>
              <div className="lm-stat">
                <span>Signals</span>
                <strong>{module.externalSignals?.length ?? 0}</strong>
              </div>
              <div className="lm-stat">
                <span>Highest volatility</span>
                <strong>Yogurt</strong>
              </div>
            </div>

            {module.externalSignals && module.externalSignals.length > 0 && (
              <div className="lm-panel-block">
                <h3>External signals calendar</h3>
                <p className="cb-muted">
                  Holidays, school terms, promotions, Ramadan — the same optional file you can upload
                  later.
                </p>
                <div className="cb-table-wrap">
                  <table className="cb-table cb-table-compact">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Event</th>
                        <th>Type</th>
                        <th>Expected impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {module.externalSignals.map((row) => (
                        <tr key={`${row.period}-${row.eventName}`}>
                          <td>{row.period}</td>
                          <td>{row.eventName}</td>
                          <td>
                            <span className="cb-signal-type">{row.eventType.replace(/_/g, ' ')}</span>
                          </td>
                          <td>{row.expectedImpact?.replace(/_/g, ' ') ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="button"
              className="cb-expand-btn"
              onClick={() => setShowFullData((v) => !v)}
              aria-expanded={showFullData}
            >
              {showFullData ? 'Hide weekly sales table' : 'View weekly sales table'}
              <ChevronDown size={16} className={showFullData ? 'is-open' : ''} />
            </button>
            {showFullData && (
              <div className="cb-table-wrap">
                <p className="lm-info-label">Weekly sales by SKU</p>
                <table className="cb-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Units</th>
                      <th>Channel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {module.simulatedData.map((row, idx) => (
                      <tr key={`${row.period}-${row.sku}-${idx}`}>
                        <td>{row.period}</td>
                        <td>{row.sku}</td>
                        <td>{row.category}</td>
                        <td>{row.unitsSold.toLocaleString()}</td>
                        <td>{row.channel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )

      case 'exercise':
        return (
          <div className="lm-body">
            <p className="lm-q-meta">
              Question {exerciseIndex + 1} of {module.exercises.length}
            </p>
            <h3 className="lm-question">{currentExercise.prompt}</h3>
            {currentExercise.context && <p className="cb-muted">{currentExercise.context}</p>}
            <OptionChips
              options={currentExercise.options}
              onSelect={handleExerciseSelect}
              disabled={Boolean(exerciseAnswers[currentExercise.id])}
              selectedValue={exerciseAnswers[currentExercise.id]}
              correctValue={currentExercise.correctValue}
              revealed={Boolean(exerciseFeedback[currentExercise.id])}
            />
            {exerciseFeedback[currentExercise.id] && (
              <div
                className={`lm-feedback ${exerciseFeedback[currentExercise.id] === 'correct' ? 'ok' : 'warn'}`}
              >
                {exerciseFeedback[currentExercise.id] === 'correct'
                  ? currentExercise.feedback.correct
                  : currentExercise.feedback.incorrect}
              </div>
            )}
          </div>
        )

      case 'agent-analysis':
        return (
          <div className="lm-body">
            {!agentRevealed ? (
              <div className="lm-agent-launch">
                <div className="lm-agent-launch-icon" aria-hidden>
                  <Sparkles size={22} />
                </div>
                <p>
                  Run the forecasting agent on the practice sales table and external signals. Same
                  file-in → insights-out pattern as production — then chat about the results.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => void handleRunForecastAgent()}
                  disabled={agentRunning}
                >
                  {agentRunning ? 'Running agent…' : 'Run forecast analysis'}
                </button>
                {agentRunning && (
                  <p className="cb-muted">
                    Reading sales + signals, linking spikes, building next-week forecast…
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="cb-agent-engine">
                  Forecast agent · practice run · chat uses live LLM + knowledge base when configured
                </p>
                <div className="lm-case">
                  <p className="lm-info-label">{insight.headline}</p>
                  <p>{insight.summary}</p>
                </div>
                {insight.externalSignalsUsed && insight.externalSignalsUsed.length > 0 && (
                  <div className="lm-panel-block">
                    <h3>External signals used</h3>
                    <div className="cb-table-wrap">
                      <table className="cb-table cb-table-compact">
                        <thead>
                          <tr>
                            <th>Period</th>
                            <th>Event</th>
                            <th>Type</th>
                            <th>Linked to sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insight.externalSignalsUsed.map((row) => (
                            <tr key={`${row.period}-${row.eventName}`}>
                              <td>{row.period}</td>
                              <td>{row.eventName}</td>
                              <td>
                                <span className="cb-signal-type">
                                  {row.eventType.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td>{row.linkedSkus}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="cb-forecast-grid">
                  {insight.forecasts.map((f) => (
                    <div key={f.sku} className="cb-forecast-card">
                      <h4>{f.sku}</h4>
                      <p>
                        {f.nextPeriod}: <strong>{f.forecastUnits.toLocaleString()}</strong> units
                      </p>
                      <span className={`cb-trend ${f.trend}`}>{f.trend}</span>
                    </div>
                  ))}
                </div>
                <div className="cb-split">
                  <div>
                    <p className="lm-info-label">Recommendations</p>
                    <ul className="cb-list">
                      {insight.recommendations.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="lm-info-label">Risks to monitor</p>
                    <ul className="cb-list">
                      {insight.risks.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <AgentFollowUpChat runContext={practiceChatContext} />
              </>
            )}
          </div>
        )

      case 'assessment':
        return (
          <div className="lm-body">
            <p className="lm-q-meta">
              Question {assessmentIndex + 1} of {module.assessment.length}
            </p>
            <h3 className="lm-question">{currentAssessment.prompt}</h3>
            <OptionChips
              options={currentAssessment.options}
              onSelect={handleAssessmentSelect}
              disabled={Boolean(assessmentAnswers[currentAssessment.id])}
              selectedValue={assessmentAnswers[currentAssessment.id]}
              correctValue={currentAssessment.correctValue}
              revealed={assessmentFeedback[currentAssessment.id] !== undefined}
            />
            {assessmentFeedback[currentAssessment.id] !== undefined && (
              <div
                className={`lm-feedback ${assessmentFeedback[currentAssessment.id] ? 'ok' : 'warn'}`}
              >
                {assessmentFeedback[currentAssessment.id]
                  ? `Correct. ${currentAssessment.ragExplanation}`
                  : `Review: ${currentAssessment.ragExplanation}`}
              </div>
            )}
            {assessmentComplete && assessmentIndex === module.assessment.length - 1 && (
              <p className="lm-score-pill">Score: {assessmentScore}%</p>
            )}
          </div>
        )

      case 'apply-company':
        return (
          <CompanyApplyStep
            items={module.applyItems}
            analysis={companyAnalysis}
            onAnalysis={setCompanyAnalysis}
          />
        )

      default:
        return null
    }
  }

  if (phase === 'intro') {
    return (
      <div className="lm lm-intro">
        <Link to="/pathways" className="lm-back">
          <ArrowLeft size={16} /> Back to courses
        </Link>

        <motion.section
          className="lm-intro-hero"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="lm-eyebrow">Course {module.number}</p>
            <h1>{module.title}</h1>
            <p className="lm-intro-desc">{module.description}</p>
            <div className="lm-meta-row">
              <span className="lm-meta-pill">
                <Clock3 size={14} /> Demo: {module.duration}
              </span>
              {module.fullDuration && (
                <span className="lm-meta-pill">
                  <Target size={14} /> Full course: {module.fullDuration}
                </span>
              )}
              <span className="lm-meta-pill">
                <MapPin size={14} /> {module.companyProfile.location}
              </span>
            </div>
            <div className="lm-intro-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setPhase('learning')}
              >
                Begin course <ArrowRight size={18} />
              </button>
              <Link to={`/agents/${module.id}`} className="lm-skip">
                Skip to agent with company files →
              </Link>
            </div>
          </div>
        </motion.section>

        <div className="lm-intro-panels">
          <div className="lm-panel">
            <h2>You will learn to</h2>
            <ul className="lm-obj-list">
              {module.learningObjectives.slice(0, 4).map((obj) => (
                <li key={obj}>
                  <CheckCircle2 size={16} aria-hidden />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lm-panel">
            <h2>Course path</h2>
            <ol className="lm-path">
              {MODULE_STEPS.map((step, i) => (
                <li key={step.id}>
                  <span className="lm-path-num">{i + 1}</span>
                  {step.label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="lm">
        <motion.div
          className="lm-complete"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="lm-complete-icon" aria-hidden>
            <CheckCircle2 size={28} />
          </div>
          <h1>Course complete</h1>
          <p>
            You practised on sales plus external signals, then ran the forecasting agent on company
            files
            {companyAnalysis ? ` (${companyAnalysis.companyLabel})` : ''}. Use the same
            export-and-review loop each week before locking production.
          </p>
          <p className="lm-score-pill">Knowledge check: {assessmentScore}%</p>
          <div className="lm-complete-actions">
            <Link to={`/agents/${module.id}`} className="btn btn-primary">
              <Bot size={16} /> Use this agent on new data
            </Link>
            <Link to="/pathways" className="btn btn-secondary">
              Back to courses
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setPhase('intro')
                setStepIndex(0)
                setExerciseIndex(0)
                setAssessmentIndex(0)
                setCompanyAnalysis(null)
              }}
            >
              Review course
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const nextLabel =
    (currentStep.id === 'exercise' && exerciseIndex < module.exercises.length - 1) ||
    (currentStep.id === 'assessment' && assessmentIndex < module.assessment.length - 1)
      ? 'Continue'
      : stepIndex >= MODULE_STEPS.length - 1
        ? 'Finish course'
        : 'Continue'

  return (
    <div className="lm">
      <div className="lm-runner">
        <aside className="lm-side">
          <Link to="/pathways" className="lm-back">
            <ArrowLeft size={16} /> Exit course
          </Link>
          <p className="lm-side-kicker">Course {module.number}</p>
          <h2>{module.title.replace(/^Learning to /, '')}</h2>
          <ProgressBar value={progress} label={`${Math.round(progress)}% complete`} />
          <ol className="lm-steps">
            {MODULE_STEPS.map((step, idx) => {
              const state = idx < stepIndex ? 'done' : idx === stepIndex ? 'current' : undefined
              return (
                <li key={step.id} className={state}>
                  <span className="lm-step-dot" aria-hidden>
                    {idx < stepIndex ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </li>
              )
            })}
          </ol>
        </aside>

        <section className="lm-main">
          <div className="lm-main-head">
            <p className="lm-eyebrow">
              Step {stepIndex + 1} of {MODULE_STEPS.length}
            </p>
            <h1>{currentStep.label}</h1>
            <p>{currentStep.description}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep.id}-${exerciseIndex}-${assessmentIndex}-${agentRevealed}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {renderStep(currentStep.id)}
            </motion.div>
          </AnimatePresence>

          <div className="lm-nav">
            <button type="button" className="btn btn-ghost" onClick={goPrevStep}>
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={goNextStep}
              disabled={!canAdvanceStep()}
            >
              {nextLabel} <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
