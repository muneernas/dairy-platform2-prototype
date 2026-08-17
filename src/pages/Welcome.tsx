import { Link } from 'react-router-dom'
import { ArrowRight, Layers, LineChart, Target } from 'lucide-react'
import './Platform2.css'

export function Welcome() {
  return (
    <div className="cb-page cb-welcome">
      <section className="cb-hero">
        <p className="cb-kicker">Platform 2 · Learning &amp; capacity building</p>
        <h1>Build AI capability across your dairy operations</h1>
        <p className="cb-lede">
          Structured learning modules help your team use AI-assisted agents for forecasting,
          planning, inventory, procurement, and more — starting with simulated company data, then
          applying the same methods to your own.
        </p>
        <Link to="/pathways" className="btn btn-primary cb-cta">
          Choose a learning module <ArrowRight size={18} />
        </Link>
      </section>

      <section className="cb-card cb-how">
        <h2>How each module works</h2>
        <ol className="cb-steps-list">
          <li>
            <span className="cb-step-icon" aria-hidden>
              <Target size={18} />
            </span>
            <div>
              <strong>Learning objectives</strong>
              <p>See what your team will be able to do after the module.</p>
            </div>
          </li>
          <li>
            <span className="cb-step-icon" aria-hidden>
              <LineChart size={18} />
            </span>
            <div>
              <strong>Simulated company data</strong>
              <p>Practice on realistic SME data before using live operational records.</p>
            </div>
          </li>
          <li>
            <span className="cb-step-icon" aria-hidden>
              <Layers size={18} />
            </span>
            <div>
              <strong>Apply to your company</strong>
              <p>Use the same agent workflow on your data for predictions and better decisions.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  )
}
