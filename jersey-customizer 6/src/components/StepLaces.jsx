import { LACES } from '../templates'

export default function StepLaces({ selected, onSelect }) {
  return (
    <div className="laces-row">
      {LACES.map(l => (
        <div key={l.id} className={`lace-opt ${selected === l.id ? 'selected' : ''}`} onClick={() => onSelect(l.id)}>
          <div className="lace-thumb">
            {l.id === 'none'
              ? <div className="lace-none" />
              : <img src={l.file} alt={l.label} />
            }
          </div>
          <span className="lace-label">{l.label}</span>
        </div>
      ))}
    </div>
  )
}
