import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Bot } from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import { AGENT_CATALOG } from '../data/agents'
import './Welcome.css'

export function Welcome() {
  const pilotCourse = LEARNING_MODULES.find((m) => m.status === 'pilot')
  const pilotAgent = AGENT_CATALOG.find((a) => a.status === 'pilot')
  const upcomingCourses = LEARNING_MODULES.filter((m) => m.status === 'planned').slice(0, 3)

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Dairy SME Programme</p>
          <h1 className="home-title">
            Learn dairy operations skills, then apply them with AI agents on your data
          </h1>
          <p className="home-lede">
            Guided training courses for plant teams, plus operational agents that analyse CSV
            exports — forecasts, risks, and recommendations you can review before acting.
          </p>
          <div className="home-cta-row">
            <Link to="/pathways" className="btn btn-primary btn-lg">
              Browse training
            </Link>
            <Link to="/agents" className="btn btn-secondary btn-lg">
              Open agents
            </Link>
          </div>
        </div>

        <aside className="home-hero-visual" aria-label="Programme steps">
          <div className="flow-card">
            <p className="flow-kicker">How the programme works</p>
            <ol className="flow-nodes">
              {[
                { t: 'Training', d: 'Practice with realistic dairy data' },
                { t: 'Knowledge check', d: 'Confirm what you learned' },
                { t: 'Your files', d: 'Upload a company CSV' },
                { t: 'Agent run', d: 'Get forecasts and recommendations' },
                { t: 'Decision', d: 'A person reviews before acting' },
              ].map((node, i) => (
                <li key={node.t}>
                  <span className="flow-index">{i + 1}</span>
                  <div>
                    <strong>{node.t}</strong>
                    <span>{node.d}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <section className="home-split">
        <div className="pathway-card">
          <div className="pathway-icon" aria-hidden>
            <BookOpen size={20} />
          </div>
          <h2>Training courses</h2>
          <p>
            Self-paced modules with practice tables, exercises, and a knowledge check — then the
            same agent on a company file.
          </p>
          {pilotCourse && (
            <Link to={`/modules/${pilotCourse.id}`} className="featured-course">
              <div>
                <span className="pill">Available</span>
                <h3>{pilotCourse.title}</h3>
                <p>{pilotCourse.duration}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          )}
          <Link to="/pathways" className="btn btn-secondary">
            All courses
          </Link>
        </div>

        <div className="pathway-card">
          <div className="pathway-icon" aria-hidden>
            <Bot size={20} />
          </div>
          <h2>Operational agents</h2>
          <p>
            Already have numbers? Upload a CSV, run a specialist agent, and ask follow-up questions
            about the results.
          </p>
          {pilotAgent && (
            <Link to={`/agents/${pilotAgent.id}`} className="btn btn-primary">
              Open demand forecasting
              <ArrowRight size={16} />
            </Link>
          )}
          <Link to="/agents" className="btn btn-secondary">
            All agents
          </Link>
        </div>
      </section>

      <section className="home-upcoming">
        <div className="home-section-head row">
          <h2>More courses after consultation</h2>
          <Link to="/pathways" className="text-link">
            View catalogue
          </Link>
        </div>
        <div className="upcoming-grid">
          {upcomingCourses.map((mod) => (
            <article key={mod.id} className="upcoming-card">
              <span className="upcoming-num">Module {mod.number}</span>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
