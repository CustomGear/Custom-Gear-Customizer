import { useState, useRef } from 'react'

const POSITIONS = [
  { key: 'center',        label: 'CENTER' },
  { key: 'leftShoulder',  label: 'LEFT SHOULDER' },
  { key: 'rightShoulder', label: 'RIGHT SHOULDER' },
]

export default function StepLogo({ logos, onLogoChange }) {
  const [activePos, setActivePos] = useState('center')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.match(/image\/(png|jpe?g|gif|svg\+xml|webp)/)) return
    const reader = new FileReader()
    reader.onload = e => {
      onLogoChange(activePos, e.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const currentLogo = logos[activePos]

  return (
    <div>
      <div className="tabs">
        {POSITIONS.map(p => (
          <button
            key={p.key}
            className={`tab-btn ${activePos === p.key ? 'active' : ''}`}
            onClick={() => setActivePos(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {currentLogo ? (
        <div className="logo-preview-row">
          <img src={currentLogo} alt="Logo" className="logo-preview-img" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Logo uploaded</p>
            <button className="logo-remove-btn" onClick={() => onLogoChange(activePos, null)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`logo-upload-zone ${dragging ? 'drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Click to upload or drag logo here<br/><span style={{fontSize:11}}>(.png, .jpg, .svg)</span></p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
