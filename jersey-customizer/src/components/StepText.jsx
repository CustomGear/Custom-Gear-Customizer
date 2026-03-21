import { useState } from 'react'
import { FONTS, COLORS } from '../templates'

export default function StepText({
  playerName, playerNumber, fontName, textColor, strokeColor,
  onNameChange, onNumberChange, onFontChange, onTextColorChange, onStrokeColorChange,
}) {
  const [activeTab, setActiveTab] = useState('name')

  return (
    <div>
      <div className="tabs">
        {['name', 'number', 'color1', 'color2'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'name' ? 'NAME' : tab === 'number' ? 'NUMBER' : tab === 'color1' ? 'TEXT COLOR' : 'OUTLINE'}
          </button>
        ))}
      </div>

      {activeTab === 'name' && (
        <div className="text-fields">
          <div className="field-group" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Player Name</label>
            <input
              className="text-input"
              value={playerName}
              onChange={e => onNameChange(e.target.value)}
              placeholder="PLAYER"
              maxLength={16}
            />
          </div>
          <div className="field-group" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Font</label>
            <select
              className="text-input"
              value={fontName}
              onChange={e => onFontChange(e.target.value)}
            >
              {FONTS.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeTab === 'number' && (
        <div className="text-fields">
          <div className="field-group" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Player Number</label>
            <input
              className="text-input"
              value={playerNumber}
              onChange={e => onNumberChange(e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="97"
              maxLength={2}
              inputMode="numeric"
            />
          </div>
          <div className="field-group" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Font</label>
            <select
              className="text-input"
              value={fontName}
              onChange={e => onFontChange(e.target.value)}
            >
              {FONTS.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {(activeTab === 'color1' || activeTab === 'color2') && (
        <ColorPicker
          selected={activeTab === 'color1' ? textColor : strokeColor}
          onSelect={activeTab === 'color1' ? onTextColorChange : onStrokeColorChange}
          label={activeTab === 'color1' ? 'Text Color' : 'Outline Color'}
        />
      )}
    </div>
  )
}

function ColorPicker({ selected, onSelect, label }) {
  return (
    <div>
      <div style={{ padding: '8px 12px 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>{label}</div>
      <div className="color-grid">
        {COLORS.map(color => (
          <div
            key={color.name}
            className={`color-swatch ${selected === color.hex ? 'selected' : ''}`}
            style={{ background: color.hex }}
            onClick={() => onSelect(color.hex)}
            title={color.name}
          >
            {selected === color.hex && (
              <span className="check">
                <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="2,7 6,11 12,3" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
