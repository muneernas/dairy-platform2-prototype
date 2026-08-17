import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, BrainCircuit, Database, LineChart } from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import './Platform2.css'

export function Platform2Home() {
  const pilotCount = LEARNING_MODULES.filter((m) => m.status === 'pilot').length

  return (
    <div className="p2-home">
      <section className="p2-hero panel">
        <p className="eyebrow">Platform 2 — Learning / Capacity Building</p>
        <h2>AI capability building for dairy SMEs through structured learning modules</h2>
        <p className="lede">
          This prototype shows how Platform 2 organises capacity building: SMEs learn to use
          AI-assisted agents for operational decisions, practice on simulated company data first,
          then apply the same approach to their own data. It is not a simulation chat tool — it is
          a module-based learning platform.
        </p>
      </section>

      <section className="panel">
        <p className="eyebrow">Learning model</p>
        <div className="p2-model">
          <div className="p2-model-step">
            <span className="step-num">1</span>
            <h3>AI agent for the business task</h3>
            <p>
              Each module focuses on one operational area (forecasting, inventory, shelf life, etc.)
              with a pre-configured agent grounded in dairy sector knowledge.
            </p>
          </div>
          <div className="p2-model-step">
            <span className="step-num">2</span>
            <h3>Simulated company dataset</h3>
            <p>
              Learners practice on realistic SME data before touching live ERP or spreadsheet
              exports — building confidence and understanding.
            </p>
          </div>
          <div className="p2-model-step">
            <span className="step-num">3</span>
            <h3>Apply to real company data</h3>
            <p>
              The module closes with a clear bridge: how the same workflow works on the company&apos;s
              own operational data for predictions, diagnosis, or optimisation.
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="p2-section-head">
          <div>
            <p className="eyebrow">Eleven learning modules</p>
            <h3>Topics offered to companies (prioritised after SME consultation)</h3>
            <p>
              {pilotCount} pilot demo available now. Remaining modules will follow questionnaire
              results.
            </p>
          </div>
        </div>

        <div className="p2-module-grid">
          {LEARNING_MODULES.map((mod) => {
            const isPilot = mod.status === 'pilot'
            const inner = (
              <>
                <div className="p2-module-top">
                  <span className="p2-module-num">Module {mod.number}</span>
                  <span className={`p2-badge ${mod.status}`}>
                    {isPilot ? 'Pilot demo' : 'After consultation'}
                  </span>
                </div>
                <h4>{mod.title}</h4>
                <p>{mod.description}</p>
                {isPilot && (
                  <span className="mode-cta">
                    Open pilot module <ArrowRight size={14} />
                  </span>
                )}
              </>
            )

            if (isPilot) {
              return (
                <Link key={mod.id} to={`/modules/${mod.id}`} className="p2-module-card panel">
                  {inner}
                </Link>
              )
            }

            return (
              <div key={mod.id} className="p2-module-card panel is-static" aria-disabled="true">
                {inner}
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Technical approach (Option B)</p>
        <div className="p2-model">
          <div className="p2-model-step">
            <LineChart size={18} aria-hidden />
            <h3>Custom learning web platform</h3>
            <p>Module pathways, exercises, assessments, and simulated datasets — learner-focused UX.</p>
          </div>
          <div className="p2-model-step">
            <BrainCircuit size={18} aria-hidden />
            <h3>nexos.ai Gateway API</h3>
            <p>AI agent responses powered through the nexos OpenAI-compatible API (with demo fallback).</p>
          </div>
          <div className="p2-model-step">
            <Database size={18} aria-hidden />
            <h3>Simulated → real data</h3>
            <p>Same module structure applies to company exports after the learning exercise.</p>
          </div>
          <div className="p2-model-step">
            <BookOpen size={18} aria-hidden />
            <h3>Sector knowledge base</h3>
            <p>Assessment feedback grounded in dairy operations publications (RAG in production).</p>
          </div>
        </div>
        <p className="p2-note">
          Learners are not trained on how to use nexos.ai — they learn AI-enabled business
          capabilities through guided modules. nexos powers the agent backend.
        </p>
      </section>
    </div>
  )
}
