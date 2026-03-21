import { useState, useRef } from 'react'

const POSITIONS = [
  { key: 'center', label: 'CENTER' },
  { key: 'left',   label: 'LEFT SHOULDER' },
  { key: 'right',  label: 'RIGHT SHOULDER' },
]

export default function StepLogo({ logos, onLogoChange }) {
  const [pos, setPos] = useState('center')
  const [over, setOver] = useState(false)
  const fileRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onLogoChange(pos, e.target.result)
    reader.readAsDataURL(file)
  }

  const current = logos[pos]

  return (
    <div>
      <div className="tabs">
        {POSITIONS.map(p => (
          <button key={p.key} className={`tab ${pos === p.key ? 'active' : ''}`} onClick={() => setPos(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      {current ? (
        <div className="logo-preview">
          <img src={current} alt="Logo" />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Logo uploaded</p>
            <button className="logo-remove" onClick={() => onLogoChange(pos, null)}>Remove</button>
          </div>
        </div>
      ) : (
        <div
          className={`logo-drop ${over ? 'over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files[0]) }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4"/>
          </svg>
          <p>Click to upload or drag logo here<br/><span style={{fontSize:10}}>PNG, JPG, SVG</span></p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}
