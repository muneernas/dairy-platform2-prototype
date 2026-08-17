import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Play, Upload } from 'lucide-react'
import {
  analyseCompanySales,
  rowsToEvents,
  rowsToSales,
  type CompanyAnalysis,
} from '../lib/companyForecast'
import { downloadTextFile, parseCsv } from '../lib/parseCsv'
import type { ApplyDataItem } from '../types/platform2'

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
      setError(`Could not read ${file.name}. Use a CSV with a header row, or load the demo file.`)
      return
    }
    if (item.id === 'sales' && rowsToSales(rows).length === 0) {
      setError(
        `${file.name} needs columns such as period, sku, and units. Download the demo file to see the format.`,
      )
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
      setError('Load weekly sales first — use your file or the demo export.')
      return
    }
    setRunning(true)
    setError(null)
    window.setTimeout(() => {
      const salesRows = rowsToSales(parseCsv(loaded.sales.csv))
      const eventRows = loaded.events ? rowsToEvents(parseCsv(loaded.events.csv)) : []
      if (!salesRows.length) {
        setError('The sales file did not contain usable period / SKU / units rows.')
        setRunning(false)
        return
      }
      const result = analyseCompanySales(
        salesRows,
        eventRows,
        loaded.sales.source,
        loaded.sales.source === 'demo' ? salesItem.demoLabel : loaded.sales.fileLabel,
      )
      onAnalysis(result)
      setRunning(false)
    }, 700)
  }

  return (
    <div className="cb-step-body">
      <p>
        {intro ??
          'Attach the operational files your company would export. If you do not have a live file yet, load the demo company export to see how the same forecasting agent runs on “real” data.'}
      </p>

      <ol className="cb-apply-items">
        {items.map((item) => {
          const current = loaded[item.id]
          return (
            <li key={item.id} className={`cb-apply-item ${current ? 'is-ready' : ''}`}>
              <div className="cb-apply-item-head">
                <span className="cb-apply-num">{item.required ? 'Required' : 'Optional'}</span>
                <h3>{item.title}</h3>
              </div>
              <p className="cb-muted">{item.description}</p>
              {current && (
                <p className="cb-file-ready">
                  <FileSpreadsheet size={14} /> {current.fileLabel}
                  {current.source === 'demo' ? ' · demo data' : ' · uploaded'}
                </p>
              )}
              <div className="cb-apply-actions">
                <button type="button" className="btn btn-ghost" onClick={() => loadDemo(item)}>
                  Use demo file
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => downloadTextFile(item.demoFileName, item.demoCsv)}
                >
                  <Download size={16} /> Download template
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => fileRefs.current[item.id]?.click()}
                >
                  <Upload size={16} /> Upload CSV
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
        <p>
          {salesReady
            ? runHint ??
              'Sales file is ready. Run the forecasting agent on this dataset — not the training table from earlier in the module.'
            : 'Load the required sales file (demo or upload) to enable analysis.'}
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={runAnalysis}
          disabled={!requiredReady || running}
        >
          <Play size={16} /> {running ? 'Running analysis…' : 'Run analysis on this data'}
        </button>
      </div>

      {analysis && (
        <div className="cb-company-result">
          <p className="cb-info-label">Results for {analysis.companyLabel}</p>
          <div className="cb-stat-row">
            <div className="cb-stat">
              <span className="cb-stat-label">Rows</span>
              <strong>{analysis.rowCount}</strong>
            </div>
            <div className="cb-stat">
              <span className="cb-stat-label">SKUs</span>
              <strong>{analysis.skuCount}</strong>
            </div>
            <div className="cb-stat">
              <span className="cb-stat-label">Periods</span>
              <strong>{analysis.periodCount}</strong>
            </div>
          </div>
          <div className="cb-forecast-grid">
            {analysis.forecasts.map((f) => (
              <div key={f.sku} className="cb-forecast-card">
                <h4>{f.sku}</h4>
                <p>
                  Next period: <strong>{f.forecastUnits.toLocaleString()}</strong> units
                </p>
                <span className={`cb-trend ${f.trend}`}>{f.trend}</span>
                <span className={`cb-trend ${f.volatility === 'high' ? 'down' : 'stable'}`}>
                  {f.volatility} volatility
                </span>
              </div>
            ))}
          </div>
          {analysis.eventsUsed.length > 0 && (
            <div>
              <p className="cb-info-label">Calendar signals used</p>
              <ul className="cb-list">
                {analysis.eventsUsed.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="cb-split">
            <div>
              <p className="cb-info-label">Recommendations</p>
              <ul className="cb-list">
                {analysis.recommendations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="cb-info-label">Risks to monitor</p>
              <ul className="cb-list">
                {analysis.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
