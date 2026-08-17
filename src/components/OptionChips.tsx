import type { OptionChoice } from '../types/ui'
import './OptionChips.css'

interface Props {
  options: OptionChoice[]
  onSelect: (value: string) => void
  disabled?: boolean
}

export function OptionChips({ options, onSelect, disabled }: Props) {
  return (
    <div className="chips" role="listbox" aria-label="Answer options">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="chip"
          disabled={disabled}
          onClick={() => onSelect(opt.value)}
        >
          <span className="chip-label">{opt.label}</span>
          {opt.description && <span className="chip-desc">{opt.description}</span>}
        </button>
      ))}
    </div>
  )
}
