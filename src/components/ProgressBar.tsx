import './ProgressBar.css'

interface Props {
  value: number
  label?: string
}

export function ProgressBar({ value, label }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="progress" aria-label={label ?? 'Progress'}>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
