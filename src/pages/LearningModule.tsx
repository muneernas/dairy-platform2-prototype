import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { OptionChips } from '../components/OptionChips'
import { ProgressBar } from '../components/ProgressBar'
import { getModuleDetail } from '../data/learningModules'
import { askForecastAgent } from '../lib/nexosClient'
import { MODULE_STEPS, type ModuleDetail, type ModuleStepId } from '../types/platform2'
import './Platform2.css'

export function LearningModule() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = moduleId ? getModuleDetail(moduleId) : undefined

  if (!module) {
    return <Navigate to="/" replace />
  }

  return <LearningModuleRunner module={module} />
}

function LearningModuleRunner({ module }: { module: ModuleDetail }) {

  const [stepIndex, setStepIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({})
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({})
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})
  const [assessmentFeedback, setAssessmentFeedback] = useState<Record<string, boolean>>({})
  const [checklist, setChecklist] = useState<Record<number, boolean>>({})
  const [agentQuestion, setAgentQuestion] = useState('')
  const [agentReply, setAgentReply] = useState<{ content: string; source: 'nexos' | 'mock' } | null>(
    null,
  )
  const [agentLoading, setAgentLoading] = useState(false)

  const currentStep = MODULE_STEPS[stepIndex]
  const progress = ((stepIndex + 1) / MODULE_STEPS.length) * 100

  const assessmentScore = useMemo(() => {
    const answered = module.assessment.filter((q) => assessmentAnswers[q.id] === q.correctValue)
    return Math.round((answered.length / module.assessment.length) * 100)
  }, [module, assessmentAnswers])

  const currentExercise = module.exercises[exerciseIndex]

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, MODULE_STEPS.length - 1))
  }

  function goPrev() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function handleExerciseSelect(value: string) {
    const ex = currentExercise
    const isCorrect = value === ex.correctValue
    setExerciseAnswers((prev) => ({ ...prev, [ex.id]: value }))
    setExerciseFeedback((prev) => ({ ...prev, [ex.id]: isCorrect ? 'correct' : 'incorrect' }))
  }

  function handleAssessmentSelect(questionId: string, value: string) {
    const q = module.assessment.find((item) => item.id === questionId)
    if (!q) return
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: value }))
    setAssessmentFeedback((prev) => ({ ...prev, [questionId]: value === q.correctValue }))
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

  function renderStep(stepId: ModuleStepId) {
    switch (stepId) {
      case 'objectives':
        return (
          <div className="p2-step-panel">
            <p>
              This module builds company capability in <strong>demand forecasting</strong> — using
              historical sales and order signals to plan production and reduce waste or stockouts.
            </p>
            <ul className="p2-objectives">
              {module.learningObjectives.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
            <div className="p2-company-card">
              <h4>{module.companyProfile.name}</h4>
              <p>
                <strong>Type:</strong> {module.companyProfile.type}
              </p>
              <p>
                <strong>Location:</strong> {module.companyProfile.location}
              </p>
              <p>{module.companyProfile.note}</p>
            </div>
          </div>
        )

      case 'simulated-data':
        return (
          <div className="p2-step-panel">
            <p>
              Explore eight weeks of simulated sales by SKU. Notice seasonality, channel mix, and
              which products are most volatile — this is the data the forecasting agent uses.
            </p>
            <div className="p2-data-table-wrap">
              <table className="p2-data-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Units sold</th>
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
          </div>
        )

      case 'exercise':
        return (
          <div className="p2-step-panel p2-exercise">
            <p className="eyebrow">
              Exercise {exerciseIndex + 1} of {module.exercises.length}
            </p>
            <h4>{currentExercise.prompt}</h4>
            {currentExercise.context && <p>{currentExercise.context}</p>}
            <OptionChips
              options={currentExercise.options}
              onSelect={handleExerciseSelect}
              disabled={Boolean(exerciseAnswers[currentExercise.id])}
            />
            {exerciseFeedback[currentExercise.id] && (
              <div
                className={`p2-feedback ${exerciseFeedback[currentExercise.id] === 'correct' ? 'ok' : 'no'}`}
              >
                {exerciseFeedback[currentExercise.id] === 'correct'
                  ? currentExercise.feedback.correct
                  : currentExercise.feedback.incorrect}
              </div>
            )}
            <div className="p2-nav-row">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={exerciseIndex === 0}
                onClick={() => setExerciseIndex((i) => i - 1)}
              >
                Previous exercise
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={exerciseIndex >= module.exercises.length - 1}
                onClick={() => setExerciseIndex((i) => i + 1)}
              >
                Next exercise
              </button>
            </div>
          </div>
        )

      case 'agent-analysis':
        return (
          <div className="p2-step-panel">
            <p>{module.agentInsight.summary}</p>
            <div className="p2-agent-grid">
              {module.agentInsight.forecasts.map((f) => (
                <div key={f.sku} className="p2-forecast-card">
                  <h5>{f.sku}</h5>
                  <p className="meta">
                    {f.nextPeriod}: {f.forecastUnits.toLocaleString()} units
                  </p>
                  <span className={`p2-trend ${f.trend}`}>{f.trend} vs prior week</span>
                </div>
              ))}
            </div>
            <div>
              <p className="eyebrow">Recommendations</p>
              <ul className="p2-list">
                {module.agentInsight.recommendations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Risks to monitor</p>
              <ul className="p2-list">
                {module.agentInsight.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="p2-ask-box">
              <p className="eyebrow">Ask the forecasting agent (optional)</p>
              <textarea
                value={agentQuestion}
                onChange={(e) => setAgentQuestion(e.target.value)}
                placeholder="e.g. Why is yogurt flagged as high volatility?"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAskAgent}
                disabled={agentLoading || !agentQuestion.trim()}
              >
                {agentLoading ? 'Calling nexos.ai…' : 'Get agent answer'}
              </button>
              {agentReply && (
                <div className="p2-agent-reply">
                  <span className={`p2-source-tag ${agentReply.source}`}>
                    {agentReply.source === 'nexos' ? 'nexos.ai Gateway' : 'Demo fallback'}
                  </span>
                  <p>{agentReply.content}</p>
                </div>
              )}
            </div>
          </div>
        )

      case 'assessment':
        return (
          <div className="p2-step-panel">
            {module.assessment.map((q) => (
              <div key={q.id} className="p2-assessment-item">
                <p>
                  <strong>{q.prompt}</strong>
                </p>
                <OptionChips
                  options={q.options}
                  onSelect={(value) => handleAssessmentSelect(q.id, value)}
                  disabled={Boolean(assessmentAnswers[q.id])}
                />
                {assessmentFeedback[q.id] !== undefined && (
                  <div className={`p2-feedback ${assessmentFeedback[q.id] ? 'ok' : 'no'}`}>
                    {assessmentFeedback[q.id]
                      ? `Correct. ${q.ragExplanation}`
                      : `Not quite. ${q.ragExplanation}`}
                  </div>
                )}
              </div>
            ))}
            {Object.keys(assessmentAnswers).length === module.assessment.length && (
              <p className="p2-score">Knowledge check score: {assessmentScore}%</p>
            )}
          </div>
        )

      case 'apply-company':
        return (
          <div className="p2-step-panel">
            <p>
              Complete this checklist to bridge from the simulated case to your company&apos;s own
              operational data — the third step of the Platform 2 learning model.
            </p>
            <div className="p2-checklist">
              {module.applyChecklist.map((item, idx) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={Boolean(checklist[idx])}
                    onChange={(e) =>
                      setChecklist((prev) => ({ ...prev, [idx]: e.target.checked }))
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <p className="p2-note">
              <CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              In production, this step links to the company&apos;s ERP export or spreadsheet upload
              using the same agent workflow.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p2-module">
      <Link to="/" className="btn btn-ghost">
        <ArrowLeft size={16} /> Back to modules
      </Link>

      <section className="p2-module-header panel">
        <p className="eyebrow">Module {module.number} — Pilot demo</p>
        <h2>{module.title}</h2>
        <p>{module.description}</p>
        <ProgressBar value={progress} label={`Step ${stepIndex + 1} of ${MODULE_STEPS.length}`} />
        <div className="p2-stepper" role="tablist" aria-label="Module steps">
          {MODULE_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={idx === stepIndex}
              className={`p2-step-tab ${idx === stepIndex ? 'is-active' : ''} ${idx < stepIndex ? 'is-done' : ''}`}
              onClick={() => setStepIndex(idx)}
            >
              {idx + 1}. {step.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{currentStep.label}</p>
        <p className="p2-note">{currentStep.description}</p>
        {renderStep(currentStep.id)}
      </section>

      <div className="p2-nav-row">
        <button type="button" className="btn btn-ghost" disabled={stepIndex === 0} onClick={goPrev}>
          <ArrowLeft size={16} /> Previous step
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={stepIndex >= MODULE_STEPS.length - 1}
          onClick={goNext}
        >
          Next step <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
