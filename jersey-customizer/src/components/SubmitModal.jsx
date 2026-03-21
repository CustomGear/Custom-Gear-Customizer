import { useState } from 'react'

export default function SubmitModal({ teamName, onClose }) {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [team, setTeam]           = useState(teamName)
  const [logoPermission, setLogoPermission] = useState(false)
  const [newsletter, setNewsletter]         = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  async function handleSubmit() {
    if (!name || !email) return
    setLoading(true)
    try {
      // POST to Netlify function
      await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, teamName: team, newsletter }),
      })
    } catch (e) {
      // Still show success even if network issue
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-success">
            <div className="modal-success-icon">🏒</div>
            <div className="modal-success-title">We're on it!</div>
            <p className="modal-success-msg">
              Thanks {name}! We've received your design for <strong>{team}</strong>.<br/>
              Our team will reach out to {email} shortly to bring your jersey to life.
            </p>
            <button className="header-submit-btn" style={{ marginTop: 20 }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Submit Your Design</div>
        <div className="modal-subtitle">Fill out the form and we'll get your order started.</div>

        <div className="modal-fields">
          <div className="modal-field">
            <span className="modal-field-label">Your Name</span>
            <input
              className="modal-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder=""
              autoFocus
            />
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Your Email</span>
            <input
              className="modal-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Your Team Name</span>
            <input
              className="modal-input"
              value={team}
              onChange={e => setTeam(e.target.value)}
            />
          </div>
        </div>

        <label className="modal-checkbox-row">
          <input
            type="checkbox"
            checked={logoPermission}
            onChange={e => setLogoPermission(e.target.checked)}
          />
          <span className="modal-checkbox-label">
            I have permission to use the logo — it's not from a pro/ncaa team
          </span>
        </label>

        <label className="modal-checkbox-row">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
          />
          <span className="modal-checkbox-label">
            Add me to the newsletter for deals and new jersey drops
          </span>
        </label>

        <p className="modal-footer-note">
          Keep an eye on your inbox. Our team will email you shortly. We're pumped to bring this design to life!
        </p>

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>CANCEL</button>
          <button
            className="modal-submit-btn"
            onClick={handleSubmit}
            disabled={!name || !email || loading}
            style={{ opacity: (!name || !email) ? 0.5 : 1 }}
          >
            {loading ? 'Sending…' : 'SUBMIT'}
          </button>
        </div>
      </div>
    </div>
  )
}
