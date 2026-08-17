import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react'
import { OptionChips } from '../components/OptionChips'
import { ProgressBar } from '../components/ProgressBar'
import { CompanyApplyStep } from '../components/CompanyApplyStep'
import { getModuleDetail } from '../data/learningModules'
import { askForecastAgent } from '../lib/nexosClient'
import type { CompanyAnalysis } from '../lib/companyForecast'
import { MODULE_STEPS, type ModuleDetail, type ModuleStepId } from '../types/platform2'
import './Platform2.css'

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
  const [showAgentAsk, setShowAgentAsk] = useState(false)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({})
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({})
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})
  const [assessmentFeedback, setAssessmentFeedback] = useState<Record<string, boolean>>({})
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysis | null>(null)
  const [agentQuestion, setAgentQuestion] = useState('')
  const [agentReply, setAgentReply] = useState<{ content: string; source: 'nexos' | 'mock' } | null>(
    null,
  )
  const [agentLoading, setAgentLoading] = useState(false)

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

  async function handleAskAgent() {
    if (!agentQuestion.trim()) return
    setAgentLoading(true)
    const context = [
      module.companyProfile.name,
      module.agentInsight.summary,
      module.simulatedData
        .slice(-8)
        .map((r) => `${r.period} ${r.sku}: ${r.unitsSold}`)
        .join('\n'),
    ].join('\n')
    const reply = await askForecastAgent(agentQuestion, context)
    setAgentReply(reply)
    setAgentLoading(false)
  }

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
    if (currentStep.id === 'exercise') {
      if (exerciseIndex < module.exercises.length - 1) {
        setExerciseIndex((i) => i + 1)
        return
      }
    }
    if (currentStep.id === 'assessment') {
      if (assessmentIndex < module.assessment.length - 1) {
        setAssessmentIndex((i) => i + 1)
        return
      }
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
    setShowAgentAsk(false)
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
          <div className="cb-step-body">
            <p>
              By the end of this module, your team will be able to use an AI forecasting agent to
              support production planning and reduce waste or stockouts.
            </p>
            <ul className="cb-objectives">
              {module.learningObjectives.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
            <div className="cb-info-box">
              <p className="cb-info-label">Training case</p>
              <h3>{module.companyProfile.name}</h3>
              <p>{module.companyProfile.type} · {module.companyProfile.location}</p>
              <p className="cb-muted">{module.companyProfile.note}</p>
            </div>
          </div>
        )

      case 'simulated-data':
        return (
          <div className="cb-step-body">
            <p>
              Review the simulated sales history. Look for patterns by SKU and channel before moving
              to the guided exercise.
            </p>
            <div className="cb-stat-row">
              <div className="cb-stat">
                <span className="cb-stat-label">Weeks of data</span>
                <strong>8</strong>
              </div>
              <div className="cb-stat">
                <span className="cb-stat-label">SKUs</span>
                <strong>4</strong>
              </div>
              <div className="cb-stat">
                <span className="cb-stat-label">Highest volatility</span>
                <strong>Plain yogurt</strong>
              </div>
            </div>
            <button
              type="button"
              className="cb-expand-btn"
              onClick={() => setShowFullData((v) => !v)}
              aria-expanded={showFullData}
            >
              {showFullData ? 'Hide full dataset' : 'View full dataset'}
              <ChevronDown size={16} className={showFullData ? 'is-open' : ''} />
            </button>
            {showFullData && (
              <div className="cb-table-wrap">
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
          <div className="cb-step-body">
            <p className="cb-step-counter">
              Question {exerciseIndex + 1} of {module.exercises.length}
            </p>
            <h3 className="cb-step-question">{currentExercise.prompt}</h3>
            {currentExercise.context && <p className="cb-muted">{currentExercise.context}</p>}
            <OptionChips
              options={currentExercise.options}
              onSelect={handleExerciseSelect}
              disabled={Boolean(exerciseAnswers[currentExercise.id])}
            />
            {exerciseFeedback[currentExercise.id] && (
              <div
                className={`cb-feedback ${exerciseFeedback[currentExercise.id] === 'correct' ? 'ok' : 'warn'}`}
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
          <div className="cb-step-body">
            {!agentRevealed ? (
              <div className="cb-agent-intro">
                <Sparkles size={28} aria-hidden />
                <p>
                  Run the AI forecasting agent on the simulated data to see Week 9 projections and
                  planning recommendations.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setAgentRevealed(true)}>
                  Run forecast analysis
                </button>
              </div>
            ) : (
              <>
                <p>{module.agentInsight.summary}</p>
                <div className="cb-forecast-grid">
                  {module.agentInsight.forecasts.map((f) => (
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
                    <p className="cb-info-label">Recommendations</p>
                    <ul className="cb-list">
                      {module.agentInsight.recommendations.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="cb-info-label">Risks to monitor</p>
                    <ul className="cb-list">
                      {module.agentInsight.risks.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  className="cb-expand-btn"
                  onClick={() => setShowAgentAsk((v) => !v)}
                  aria-expanded={showAgentAsk}
                >
                  {showAgentAsk ? 'Hide follow-up question' : 'Ask a follow-up question'}
                  <ChevronDown size={16} className={showAgentAsk ? 'is-open' : ''} />
                </button>
                {showAgentAsk && (
                  <div className="cb-ask">
                    <textarea
                      value={agentQuestion}
                      onChange={(e) => setAgentQuestion(e.target.value)}
                      placeholder="e.g. Why is yogurt flagged as high volatility?"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleAskAgent}
                      disabled={agentLoading || !agentQuestion.trim()}
                    >
                      {agentLoading ? 'Thinking…' : 'Submit question'}
                    </button>
                    {agentReply && <div className="cb-agent-reply">{agentReply.content}</div>}
                  </div>
                )}
              </>
            )}
          </div>
        )

      case 'assessment':
        return (
          <div className="cb-step-body">
            <p className="cb-step-counter">
              Question {assessmentIndex + 1} of {module.assessment.length}
            </p>
            <h3 className="cb-step-question">{currentAssessment.prompt}</h3>
            <OptionChips
              options={currentAssessment.options}
              onSelect={handleAssessmentSelect}
              disabled={Boolean(assessmentAnswers[currentAssessment.id])}
            />
            {assessmentFeedback[currentAssessment.id] !== undefined && (
              <div className={`cb-feedback ${assessmentFeedback[currentAssessment.id] ? 'ok' : 'warn'}`}>
                {assessmentFeedback[currentAssessment.id]
                  ? `Correct. ${currentAssessment.ragExplanation}`
                  : `Review: ${currentAssessment.ragExplanation}`}
              </div>
            )}
            {assessmentComplete && assessmentIndex === module.assessment.length - 1 && (
              <p className="cb-score">Score: {assessmentScore}%</p>
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
      <div className="cb-page cb-module-intro">
        <Link to="/pathways" className="cb-back">
          <ArrowLeft size={16} /> Back to modules
        </Link>
        <div className="cb-card cb-intro-card">
          <p className="cb-kicker">Module {module.number}</p>
          <h1>{module.title}</h1>
          <p className="cb-muted">{module.description}</p>
          <p className="cb-duration">This walkthrough: {module.duration}</p>
          {module.workshopDuration && (
            <p className="cb-muted">
              A facilitated session with your team and live company data is typically{' '}
              {module.workshopDuration}.
            </p>
          )}
          <div className="cb-intro-objectives">
            <p className="cb-info-label">You will learn to</p>
            <ul>
              {module.learningObjectives.slice(0, 3).map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setPhase('learning')}>
            Begin module <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="cb-page cb-complete">
        <div className="cb-card cb-complete-card">
          <CheckCircle2 size={40} className="cb-complete-icon" aria-hidden />
          <h1>Module complete</h1>
          <p>
            You practised on simulated data, then ran the forecasting agent on company files
            {companyAnalysis
              ? ` (${companyAnalysis.companyLabel}).`
              : '.'}{' '}
            Use the same export-and-review loop each week before locking production.
          </p>
          <p className="cb-score">Knowledge check: {assessmentScore}%</p>
          <div className="cb-complete-actions">
            <Link to="/pathways" className="btn btn-primary">
              Back to modules
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => {
              setPhase('intro')
              setStepIndex(0)
              setExerciseIndex(0)
              setAssessmentIndex(0)
              setCompanyAnalysis(null)
            }}>
              Review module
            </button>
          </div>
        </div>
      </div>
    )
  }

  const nextLabel =
    (currentStep.id === 'exercise' && exerciseIndex < module.exercises.length - 1) ||
    (currentStep.id === 'assessment' && assessmentIndex < module.assessment.length - 1)
      ? 'Continue'
      : stepIndex >= MODULE_STEPS.length - 1
        ? 'Finish module'
        : 'Continue'

  return (
    <div className="cb-page cb-runner">
      <div className="cb-runner-shell">
        <aside className="cb-runner-side">
          <Link to="/pathways" className="cb-back">
            <ArrowLeft size={16} /> Exit module
          </Link>
          <p className="cb-kicker">Module {module.number}</p>
          <h2>{module.title.replace(/^Learning to /, '')}</h2>
          <ProgressBar value={progress} label={`${Math.round(progress)}% complete`} />
          <ol className="cb-progress-steps">
            {MODULE_STEPS.map((step, idx) => (
              <li
                key={step.id}
                className={
                  idx < stepIndex ? 'done' : idx === stepIndex ? 'current' : undefined
                }
              >
                {step.label}
              </li>
            ))}
          </ol>
        </aside>

        <section className="cb-card cb-runner-main">
          <p className="cb-kicker">
            Step {stepIndex + 1} of {MODULE_STEPS.length}
          </p>
          <h1>{currentStep.label}</h1>
          <p className="cb-muted">{currentStep.description}</p>
          {renderStep(currentStep.id)}

          <div className="cb-runner-nav">
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
