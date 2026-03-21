import { useState } from 'react'
import { COLORS } from '../templates'

const SLOT_LABELS = ['COLOR 1', 'COLOR 2', 'COLOR 3', 'COLOR 4']

export default function StepColors({ colors, onChange, numColors = 4 }) {
  const [slot, setSlot] = useState(0)
  const [hovered, setHovered] = useState(null)

  return (
    <div>
      <div className="tabs">
        {Array.from({ length: numColors }, (_, i) => (
          <button
            key={i}
            className={`tab ${slot === i ? 'active' : ''}`}
            onClick={() => setSlot(i)}
          >
            {SLOT_LABELS[i]}
          </button>
        ))}
      </div>
      <div className="color-grid">
        {COLORS.map(c => {
          const sel = colors[slot] === c.hex
          return (
            <div
              key={c.hex}
              className={`swatch ${sel ? 'selected' : ''}`}
              style={{ background: c.hex }}
              onClick={() => {
                const next = [...colors]
                next[slot] = c.hex
                onChange(next)
              }}
              onMouseEnter={() => setHovered(c.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {sel && (
                <span className="swatch-check">
                  <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="2,7 6,11 12,3" />
                  </svg>
                </span>
              )}
              {hovered === c.name && <span className="swatch-tip">{c.name}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
