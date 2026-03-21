import { useState } from 'react'
import { FONTS, COLORS } from '../templates'

export default function StepText({
  playerName, playerNumber, fontName,
  textColor, strokeColor,
  onNameChange, onNumberChange, onFontChange,
  onTextColorChange, onStrokeColorChange,
}) {
  const [tab, setTab] = useState('name')

  return (
    <div>
      <div className="tabs">
        {['name', 'number', 'color1', 'color2'].map(t => (
          <button
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'name' ? 'NAME' : t === 'number' ? 'NUMBER' : t === 'color1' ? 'TEXT' : 'OUTLINE'}
          </button>
        ))}
      </div>

      {tab === 'name' && (
        <div className="text-fields">
          <div className="field-group" style={{ gridColumn: '1/-1' }}>
            <label className="field-label">Player Name</label>
            <input className="text-input" value={playerName} onChange={e => onNameChange(e.target.value)} placeholder="PLAYER" maxLength={16} />
          </div>
          <div className="field-group" style={{ gridColumn: '1/-1' }}>
            <label className="field-label">Font</label>
            <select className="text-input" value={fontName} onChange={e => onFontChange(e.target.value)}>
              {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {tab === 'number' && (
        <div className="text-fields">
          <div className="field-group" style={{ gridColumn: '1/-1' }}>
            <label className="field-label">Player Number</label>
            <input className="text-input" value={playerNumber} onChange={e => onNumberChange(e.target.value.replace(/\D/g,'').slice(0,2))} placeholder="97" maxLength={2} inputMode="numeric" />
          </div>
          <div className="field-group" style={{ gridColumn: '1/-1' }}>
            <label className="field-label">Font</label>
            <select className="text-input" value={fontName} onChange={e => onFontChange(e.target.value)}>
              {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {(tab === 'color1' || tab === 'color2') && (
        <ColorPicker
          selected={tab === 'color1' ? textColor : strokeColor}
          onSelect={tab === 'color1' ? onTextColorChange : onStrokeColorChange}
        />
      )}
    </div>
  )
}

function ColorPicker({ selected, onSelect }) {
  return (
    <div className="color-grid" style={{ padding: '10px' }}>
      {COLORS.map(c => (
        <div
          key={c.hex}
          className={`swatch ${selected === c.hex ? 'selected' : ''}`}
          style={{ background: c.hex }}
          onClick={() => onSelect(c.hex)}
          title={c.name}
        >
          {selected === c.hex && (
            <span className="swatch-check">
              <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="2,7 6,11 12,3" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
