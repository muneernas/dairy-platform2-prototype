import type { OptionChoice } from '../types/ui'
import './OptionChips.css'

interface Props {
  options: OptionChoice[]
  onSelect: (value: string) => void
  disabled?: boolean
  selectedValue?: string
  /** When set, highlights correct vs incorrect after answering */
  correctValue?: string
  revealed?: boolean
}

export function OptionChips({
  options,
  onSelect,
  disabled,
  selectedValue,
  correctValue,
  revealed,
}: Props) {
  return (
    <div className="chips" role="listbox" aria-label="Answer options">
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value
        let stateClass = ''
        if (revealed && correctValue) {
          if (opt.value === correctValue) stateClass = 'is-correct'
          else if (isSelected) stateClass = 'is-wrong'
        } else if (isSelected) {
          stateClass = 'is-selected'
        }

        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`chip ${stateClass}`.trim()}
            disabled={disabled}
            onClick={() => onSelect(opt.value)}
          >
            <span className="chip-label">{opt.label}</span>
            {opt.description && <span className="chip-desc">{opt.description}</span>}
          </button>
        )
      })}
    </div>
  )
}
