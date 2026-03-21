import { useState } from 'react'
import { COLORS } from '../templates'

export default function StepColors({ colors, onChange, numColors = 4 }) {
  const [activeSlot, setActiveSlot] = useState(0)
  const [hoveredColor, setHoveredColor] = useState(null)

  const slots = Array.from({ length: numColors }, (_, i) => i)
  const slotLabels = ['COLOR 1', 'COLOR 2', 'COLOR 3', 'COLOR 4']

  function selectColor(hex) {
    const next = [...colors]
    next[activeSlot] = hex
    onChange(next)
  }

  return (
    <div>
      {/* Color slot tabs */}
      <div className="tabs">
        {slots.map(i => (
          <button
            key={i}
            className={`tab-btn ${activeSlot === i ? 'active' : ''}`}
            onClick={() => setActiveSlot(i)}
          >
            {slotLabels[i]}
          </button>
        ))}
      </div>

      {/* Swatch grid */}
      <div className="color-grid">
        {COLORS.map(color => {
          const isSelected = colors[activeSlot] === color.hex
          return (
            <div
              key={color.name}
              className={`color-swatch ${isSelected ? 'selected' : ''}`}
              style={{ background: color.hex }}
              onClick={() => selectColor(color.hex)}
              onMouseEnter={() => setHoveredColor(color.name)}
              onMouseLeave={() => setHoveredColor(null)}
              title={color.name}
            >
              {isSelected && (
                <span className="check">
                  <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="2,7 6,11 12,3" />
                  </svg>
                </span>
              )}
              {hoveredColor === color.name && (
                <span className="color-tooltip">{color.name}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
