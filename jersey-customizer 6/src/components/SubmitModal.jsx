import { useState } from 'react'

export default function SubmitModal({ teamName, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [team, setTeam] = useState(teamName || '')
  const [logo, setLogo] = useState(false)
  const [news, setNews] = useState(true)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!name || !email) return
    setLoading(true)
    try {
      await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, teamName: team, newsletter: news }),
      })
    } catch {}
    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-success">
          <div className="modal-success-icon">🏒</div>
          <div className="modal-success-title">We're on it!</div>
          <p className="modal-success-msg">Thanks {name}! We've received your design for <strong>{team}</strong>.<br/>We'll reach out to {email} shortly.</p>
          <button className="btn-submit" style={{ marginTop: 18 }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Submit Your Design</div>
        <div className="modal-sub">Fill out the form to get your order started.</div>
        <div className="modal-fields">
          <div className="modal-field">
            <span className="modal-field-label">Your Name</span>
            <input className="modal-input" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Your Email</span>
            <input className="modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Team Name</span>
            <input className="modal-input" value={team} onChange={e => setTeam(e.target.value)} />
          </div>
        </div>
        <label className="modal-check">
          <input type="checkbox" checked={logo} onChange={e => setLogo(e.target.checked)} />
          <span>I have permission to use this logo — it's not from a pro/NCAA team</span>
        </label>
        <label className="modal-check">
          <input type="checkbox" checked={news} onChange={e => setNews(e.target.checked)} />
          <span>Add me to the newsletter for deals and new jersey drops</span>
        </label>
        <p className="modal-note">Our team will email you shortly to bring your design to life!</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>CANCEL</button>
          <button className="modal-go" onClick={submit} disabled={!name || !email || loading}>
            {loading ? 'Sending…' : 'SUBMIT'}
          </button>
        </div>
      </div>
    </div>
  )
}
