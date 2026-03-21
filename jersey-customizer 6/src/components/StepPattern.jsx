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
            src={t.file}
            alt={t.name}
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
          <span className="pattern-thumb-name">{t.name}</span>
        </div>
      ))}
    </div>
  )
}
