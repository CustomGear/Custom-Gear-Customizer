import { useState, useMemo } from 'react'
import { TEMPLATES, FONTS, LACES } from './templates'
import JerseyPreview  from './components/JerseyPreview'
import StepTeamName  from './components/StepTeamName'
import StepColors    from './components/StepColors'
import StepPattern   from './components/StepPattern'
import StepText      from './components/StepText'
import StepLogo      from './components/StepLogo'
import StepLaces     from './components/StepLaces'
import SubmitModal   from './components/SubmitModal'

const STEPS = [
  { id: 'teamName', label: 'Team Name' },
  { id: 'colors',   label: 'Colors'    },
  { id: 'pattern',  label: 'Pattern'   },
  { id: 'text',     label: 'Text'      },
  { id: 'logo',     label: 'Logo'      },
  { id: 'laces',    label: 'Laces'     },
]

function getInit() {
  const t = TEMPLATES[0]
  return {
    teamName: '',
    templateId: t.id,
    colors: [...t.defaultColors],
    playerName: 'PLAYER',
    playerNumber: '97',
    fontName: FONTS[0].name,
    textColor: '#ffffff',
    strokeColor: '#1a1a1a',
    logos: { center: null, left: null, right: null },
    lace: 'none',
  }
}

// ── Icons ───────────────────────────────────
const Ic = {
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3"/></svg>,
  info:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  reset:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  left:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  right:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  down:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  menu:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  puck:   <svg viewBox="0 0 20 20"><ellipse cx="10" cy="11" rx="9" ry="5" fill="white"/><ellipse cx="10" cy="9" rx="9" ry="5" fill="none" stroke="white" strokeWidth="1.5"/></svg>,
}

export default function App() {
  const [state, setState]   = useState(getInit)
  const [step, setStep]     = useState(0)
  const [menu, setMenu]     = useState(false)
  const [modal, setModal]   = useState(false)
  const [banner, setBanner] = useState(true)

  const template = useMemo(
    () => TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0],
    [state.templateId]
  )

  const update = patch => setState(s => ({ ...s, ...patch }))

  function selectTemplate(id) {
    const t = TEMPLATES.find(t => t.id === id)
    if (!t) return
    setState(s => ({ ...s, templateId: t.id, colors: [...t.defaultColors] }))
  }

  function reset() { setState(getInit()); setStep(0); setMenu(false) }

  const cur = STEPS[step]

  return (
    <div className="app">
      {/* Announcement */}
      {banner && (
        <div className="announcement">
          Get your team jerseys custom-made — submit your design to get started
          <button className="announcement-close" onClick={() => setBanner(false)}>{Ic.close}</button>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo-circle">{Ic.puck}</div>
          <div className="header-brand-text">
            <div className="header-brand-name">Jersey Customizer</div>
            <div className="header-brand-sub">Design Your Team Kit</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-icon" title="Pricing">{Ic.dollar}</button>
          <button className="header-icon" title="Info">{Ic.info}</button>
          <button className="header-icon" title="Start Over" onClick={reset}>{Ic.reset}</button>
          <button className="btn-submit" onClick={() => setModal(true)}>SUBMIT</button>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Jerseys</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-cur">Customize</span>
      </nav>

      {/* Body */}
      <div className="app-body">
        {/* Preview */}
        <div className="preview">
          <div className="team-name-display">{state.teamName || '[TEAM NAME]'}</div>
          <div className="brand-byline">
            <div className="brand-dot">{Ic.puck}</div>
            Jersey Customizer
          </div>

          {/* 2×2 grid — front, back, pant, sock */}
          <div className="preview-grid">
            <div className="preview-cell">
              <JerseyPreview template={template} colors={state.colors} />
            </div>
            <div className="preview-cell">
              <JerseyPreview template={template} colors={state.colors} />
            </div>
            <div className="preview-cell" style={{ opacity: 0.85 }}>
              <JerseyPreview template={template} colors={state.colors} />
            </div>
            <div className="preview-cell" style={{ opacity: 0.85 }}>
              <JerseyPreview template={template} colors={state.colors} />
            </div>
          </div>
        </div>

        {/* Step Panel */}
        <div className="step-panel">
          <div className="step-header">
            <button className="step-menu-btn" onClick={() => setMenu(m => !m)}>{Ic.menu}</button>
            <div>
              <div className="step-counter">{step + 1}/{STEPS.length}</div>
              <div className="step-label">{cur.label}</div>
            </div>
            <button className="step-nav" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>{Ic.left}</button>
            <button className="step-nav" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>{Ic.right}</button>
            <button className="step-expand">{Ic.down}</button>
          </div>

          <div className="step-content">
            {cur.id === 'teamName' && (
              <StepTeamName value={state.teamName} onChange={v => update({ teamName: v })} />
            )}
            {cur.id === 'colors' && (
              <StepColors colors={state.colors} onChange={colors => update({ colors })} numColors={template.numColors} />
            )}
            {cur.id === 'pattern' && (
              <StepPattern selectedId={state.templateId} onSelect={selectTemplate} />
            )}
            {cur.id === 'text' && (
              <StepText
                playerName={state.playerName}
                playerNumber={state.playerNumber}
                fontName={state.fontName}
                textColor={state.textColor}
                strokeColor={state.strokeColor}
                onNameChange={v => update({ playerName: v })}
                onNumberChange={v => update({ playerNumber: v })}
                onFontChange={v => update({ fontName: v })}
                onTextColorChange={v => update({ textColor: v })}
                onStrokeColorChange={v => update({ strokeColor: v })}
              />
            )}
            {cur.id === 'logo' && (
              <StepLogo
                logos={state.logos}
                onLogoChange={(pos, url) => update({ logos: { ...state.logos, [pos]: url } })}
              />
            )}
            {cur.id === 'laces' && (
              <StepLaces selected={state.lace} onSelect={v => update({ lace: v })} />
            )}
          </div>
        </div>
      </div>

      {/* Menu Drawer */}
      {menu && (
        <div className="menu-overlay" onClick={() => setMenu(false)}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`menu-item ${i === step ? 'active' : ''}`}
                onClick={() => { setStep(i); setMenu(false) }}
              >
                {s.label}
              </button>
            ))}
            <button className="menu-start-over" onClick={reset}>{Ic.reset} Start Over</button>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {modal && <SubmitModal teamName={state.teamName} onClose={() => setModal(false)} />}
    </div>
  )
}
