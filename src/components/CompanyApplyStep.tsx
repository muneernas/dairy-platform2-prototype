import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Play, Upload } from 'lucide-react'
import {
  rowsToEvents,
  rowsToSales,
  type CompanyAnalysis,
} from '../lib/companyForecast'
import { runForecastAgent } from '../lib/forecastAgent'
import { downloadTextFile, parseCsv } from '../lib/parseCsv'
import type { ApplyDataItem } from '../types/platform2'
import { useI18n } from '../i18n/I18nProvider'
import { AgentFollowUpChat } from './AgentFollowUpChat'

type ItemSource = 'demo' | 'upload'

interface LoadedItem {
  source: ItemSource
  fileLabel: string
  csv: string
}

interface Props {
  items: ApplyDataItem[]
  analysis: CompanyAnalysis | null
  onAnalysis: (result: CompanyAnalysis | null) => void
  intro?: string
  runHint?: string
}

export function CompanyApplyStep({ items, analysis, onAnalysis, intro, runHint }: Props) {
  const { t } = useI18n()
  const [loaded, setLoaded] = useState<Record<string, LoadedItem>>({})
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const salesItem = items.find((item) => item.id === 'sales')
  const salesReady = Boolean(loaded.sales)
  const requiredReady = items.filter((item) => item.required).every((item) => loaded[item.id])

  function loadDemo(item: ApplyDataItem) {
    setError(null)
    onAnalysis(null)
    setLoaded((prev) => ({
      ...prev,
      [item.id]: {
        source: 'demo',
        fileLabel: item.demoLabel,
        csv: item.demoCsv,
      },
    }))
  }

  async function handleUpload(item: ApplyDataItem, file: File | undefined) {
    if (!file) return
    const text = await file.text()
    const rows = parseCsv(text)
    if (!rows.length) {
      setError(t('apply.errorRead', { name: file.name }))
      return
    }
    if (item.id === 'sales' && rowsToSales(rows).length === 0) {
      setError(t('apply.errorCols', { name: file.name }))
      return
    }
    setError(null)
    onAnalysis(null)
    setLoaded((prev) => ({
      ...prev,
      [item.id]: {
        source: 'upload',
        fileLabel: file.name,
        csv: text,
      },
    }))
  }

  function runAnalysis() {
    if (!salesItem || !loaded.sales) {
      setError(t('apply.errorSalesFirst'))
      return
    }
    setRunning(true)
    setError(null)
    window.setTimeout(() => {
      const salesRows = rowsToSales(parseCsv(loaded.sales.csv))
      const eventRows = loaded.events ? rowsToEvents(parseCsv(loaded.events.csv)) : []
      if (!salesRows.length) {
        setError(t('apply.errorNoRows'))
        setRunning(false)
        return
      }
      const result = runForecastAgent({
        sales: salesRows,
        events: eventRows,
        source: loaded.sales.source,
        companyLabel:
          loaded.sales.source === 'demo' ? salesItem.demoLabel : loaded.sales.fileLabel,
      })
      onAnalysis({
        ...result.analysis,
        eventsUsed:
          result.insight.externalSignalsUsed?.map(
            (s) => `${s.period}: ${s.eventName} [${s.eventType}] → ${s.linkedSkus}`,
          ) ?? result.analysis.eventsUsed,
        recommendations: result.insight.recommendations,
        risks: result.insight.risks,
        forecasts: result.analysis.forecasts.map((f, i) => ({
          ...f,
          forecastUnits: result.insight.forecasts[i]?.forecastUnits ?? f.forecastUnits,
          trend: result.insight.forecasts[i]?.trend ?? f.trend,
        })),
      })
      setRunning(false)
    }, 700)
  }

  return (
    <div className="cb-step-body">
      <p>{intro ?? t('apply.intro')}</p>

      <ol className="cb-apply-items">
        {items.map((item) => {
          const current = loaded[item.id]
          return (
            <li key={item.id} className={`cb-apply-item ${current ? 'is-ready' : ''}`}>
              <div className="cb-apply-item-head">
                <span className="cb-apply-num">
                  {item.required ? t('apply.required') : t('apply.optional')}
                </span>
                <h3>{item.title}</h3>
              </div>
              <p className="cb-muted">{item.description}</p>
              {current && (
                <p className="cb-file-ready">
                  <FileSpreadsheet size={14} /> {current.fileLabel}
                  {current.source === 'demo'
                    ? ` · ${t('apply.demoTag')}`
                    : ` · ${t('apply.uploadedTag')}`}
                </p>
              )}
              <div className="cb-apply-actions">
                <button type="button" className="btn btn-ghost" onClick={() => loadDemo(item)}>
                  {t('apply.demo')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => downloadTextFile(item.demoFileName, item.demoCsv)}
                >
                  <Download size={16} /> {t('apply.template')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => fileRefs.current[item.id]?.click()}
                >
                  <Upload size={16} /> {t('apply.upload')}
                </button>
                <input
                  ref={(el) => {
                    fileRefs.current[item.id] = el
                  }}
                  type="file"
                  accept=".csv,text/csv"
                  className="cb-file-input"
                  onChange={(e) => {
                    void handleUpload(item, e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </div>
            </li>
          )
        })}
      </ol>

      {error && <div className="cb-feedback warn">{error}</div>}

      <div className="cb-run-box">
        <p>{salesReady ? (runHint ?? t('apply.readyHint')) : t('apply.loadHint')}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={runAnalysis}
          disabled={!requiredReady || running}
        >
          <Play size={16} /> {running ? t('apply.running') : t('apply.run')}
        </button>
      </div>

      {analysis && (
        <div className="cb-company-result">
          <p className="cb-info-label">{t('apply.resultsFor', { label: analysis.companyLabel })}</p>
          <div className="cb-stat-row">
            <div className="cb-stat">
              <span className="cb-stat-label">{t('apply.rows')}</span>
              <strong>{analysis.rowCount}</strong>
            </div>
            <div className="cb-stat">
              <span className="cb-stat-label">{t('learn.skus')}</span>
              <strong>{analysis.skuCount}</strong>
            </div>
            <div className="cb-stat">
              <span className="cb-stat-label">{t('apply.periods')}</span>
              <strong>{analysis.periodCount}</strong>
            </div>
          </div>
          <div className="cb-forecast-grid">
            {analysis.forecasts.map((f) => (
              <div key={f.sku} className="cb-forecast-card">
                <h4>{f.sku}</h4>
                <p>
                  {t('apply.nextPeriod', { units: f.forecastUnits.toLocaleString() })}
                </p>
                <span className={`cb-trend ${f.trend}`}>{f.trend}</span>
                <span className={`cb-trend ${f.volatility === 'high' ? 'down' : 'stable'}`}>
                  {t('apply.volatility', { level: f.volatility })}
                </span>
              </div>
            ))}
          </div>
          {analysis.eventsUsed.length > 0 && (
            <div>
              <p className="cb-info-label">{t('learn.signalsUsed')}</p>
              <ul className="cb-list">
                {analysis.eventsUsed.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="cb-split">
            <div>
              <p className="cb-info-label">{t('learn.recommendations')}</p>
              <ul className="cb-list">
                {analysis.recommendations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="cb-info-label">{t('learn.risks')}</p>
              <ul className="cb-list">
                {analysis.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
          <AgentFollowUpChat
            runContext={[
              `Company / file: ${analysis.companyLabel}`,
              `Rows: ${analysis.rowCount}, SKUs: ${analysis.skuCount}, periods: ${analysis.periodCount}`,
              `Forecasts:\n${analysis.forecasts
                .map((f) => `- ${f.sku}: ${f.forecastUnits} (${f.trend}, ${f.volatility} volatility)`)
                .join('\n')}`,
              analysis.eventsUsed.length
                ? `External signals:\n${analysis.eventsUsed.map((e) => `- ${e}`).join('\n')}`
                : '',
              `Recommendations: ${analysis.recommendations.join('; ')}`,
              `Risks: ${analysis.risks.join('; ')}`,
            ]
              .filter(Boolean)
              .join('\n')}
          />
        </div>
      )}
    </div>
  )
}
