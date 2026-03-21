import { LACES } from '../templates'

export default function StepLaces({ selected, onSelect }) {
  return (
    <div className="laces-options">
      {LACES.map(lace => (
        <div
          key={lace.id}
          className={`lace-option ${selected === lace.id ? 'selected' : ''}`}
          onClick={() => onSelect(lace.id)}
        >
          <div className="lace-thumb">
            {lace.id === 'none' ? (
              <div className="lace-none-icon" />
            ) : (
              <img src={lace.file} alt={lace.label} />
            )}
          </div>
          <span className="lace-label">{lace.label}</span>
        </div>
      ))}
    </div>
  )
}
