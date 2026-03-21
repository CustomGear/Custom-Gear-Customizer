import { TEMPLATES } from '../templates'

export default function StepPattern({ selectedId, onSelect }) {
  return (
    <div className="pattern-grid">
      {TEMPLATES.map(t => (
        <div
          key={t.id}
          className={`pattern-thumb ${selectedId === t.id ? 'selected' : ''}`}
          onClick={() => onSelect(t.id)}
          title={t.name}
        >
          <img
            src={`/templates/${t.folder}/thumb.png`}
            alt={t.name}
            loading="lazy"
            onError={e => {
              // Show color block if thumb missing
              e.target.style.display = 'none'
              e.target.parentElement.style.background = '#e8e8e8'
            }}
          />
          <span className="pattern-thumb-label">{t.name}</span>
        </div>
      ))}
    </div>
  )
}
