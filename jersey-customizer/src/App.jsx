import { useState, useMemo } from 'react'
import { TEMPLATES, FONTS, LACES } from './templates'
import JerseyCanvas      from './components/JerseyCanvas'
import StepTeamName      from './components/StepTeamName'
import StepColors        from './components/StepColors'
import StepPattern       from './components/StepPattern'
import StepText          from './components/StepText'
import StepLogo          from './components/StepLogo'
import StepLaces         from './components/StepLaces'
import SubmitModal       from './components/SubmitModal'

// ─── STEPS DEFINITION ───────────────────────────────────────────────
const STEPS = [
  { id: 'teamName', label: 'Team Name' },
  { id: 'colors',   label: 'Colors'    },
  { id: 'pattern',  label: 'Pattern'   },
  { id: 'text',     label: 'Text'      },
  { id: 'logo',     label: 'Logo'      },
  { id: 'laces',    label: 'Laces'     },
]

// ─── INITIAL STATE ───────────────────────────────────────────────────
function getInitialState() {
  const t = TEMPLATES[0]
  return {
    teamName:     '',
    templateId:   t.id,
    colors:       [...(t.defaultColors || ['#1a3a6b','#ffffff','#c8a84b','#1a1a1a'])],
    playerName:   'PLAYER',
    playerNumber: '97',
    fontName:     FONTS[0].name,
    textColor:    t.defaultTextColor  || '#ffffff',
    strokeColor:  t.defaultStrokeColor || '#1a1a1a',
    logos: { center: null, leftShoulder: null, rightShoulder: null },
    lace:         'none',
  }
}

// ─── ICONS ───────────────────────────────────────────────────────────
const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12M9 9c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3"/>
  </svg>
)
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
)
const IconReset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
)
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconPuck = () => (
  <svg viewBox="0 0 20 20" fill="white">
    <ellipse cx="10" cy="10" rx="9" ry="6"/>
    <ellipse cx="10" cy="8" rx="9" ry="6" fill="none" stroke="white" strokeWidth="1"/>
  </svg>
)

// ─── APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState]             = useState(getInitialState)
  const [stepIndex, setStepIndex]     = useState(0)
  const [showMenu, setShowMenu]       = useState(false)
  const [showSubmit, setShowSubmit]   = useState(false)
  const [showBanner, setShowBanner]   = useState(true)

  const template = useMemo(
    () => TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0],
    [state.templateId]
  )

  const fontUrl = useMemo(
    () => FONTS.find(f => f.name === state.fontName)?.file
      ? `/fonts/${FONTS.find(f => f.name === state.fontName).file}`
      : null,
    [state.fontName]
  )

  const laceFile = useMemo(
    () => LACES.find(l => l.id === state.lace)?.file || null,
    [state.lace]
  )

  // Canvas layout: 2 col × 2 row (front, back, pant, sock)
  const canvases = [
    { part: 'front', w: 500, h: 600 },
    { part: 'back',  w: 500, h: 600 },
    { part: 'pant',  w: 400, h: 480 },
    { part: 'sock',  w: 320, h: 400 },
  ]

  const logoCenter = state.logos.center
    ? { dataUrl: state.logos.center, ...template.logoPosition }
    : null
  const logoLeft = state.logos.leftShoulder
    ? { dataUrl: state.logos.leftShoulder, ...template.logoLeftShoulder }
    : null
  const logoRight = state.logos.rightShoulder
    ? { dataUrl: state.logos.rightShoulder, ...template.logoRightShoulder }
    : null

  // ── State updaters ──
  const update = patch => setState(s => ({ ...s, ...patch }))

  function handleTemplateSelect(id) {
    const t = TEMPLATES.find(t => t.id === id)
    if (!t) return
    setState(s => ({
      ...s,
      templateId:  t.id,
      colors:      [...(t.defaultColors || s.colors)],
      textColor:   t.defaultTextColor  || s.textColor,
      strokeColor: t.defaultStrokeColor || s.strokeColor,
    }))
  }

  function handleReset() {
    setState(getInitialState())
    setStepIndex(0)
    setShowMenu(false)
  }

  const step = STEPS[stepIndex]

  return (
    <div className="app-layout">
      {/* ── Announcement bar ── */}
      {showBanner && (
        <div className="announcement-bar">
          Get your team jerseys custom-made — submit your design to get started
          <button className="announcement-close" onClick={() => setShowBanner(false)}>
            <IconClose />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">
          <div style={{ width: 40, height: 40, background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPuck />
          </div>
          <div className="header-logo-text">
            Jersey Customizer
            <div className="header-logo-sub">Design Your Team Kit</div>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-icon-btn" title="Pricing"><IconDollar /></button>
          <button className="header-icon-btn" title="Info"><IconInfo /></button>
          <button className="header-icon-btn" title="Start Over" onClick={handleReset}><IconReset /></button>
          <button className="header-submit-btn" onClick={() => setShowSubmit(true)}>SUBMIT</button>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <span>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Jerseys</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-active">Customize</span>
      </div>

      {/* ── Main body ── */}
      <div className="app-body">

        {/* ── Preview ── */}
        <div className="preview-area">
          <div className="team-name-display">
            {state.teamName || '[TEAM NAME]'}
          </div>
          <div className="brand-byline">
            <div className="brand-byline-dot"><IconPuck /></div>
            Jersey Customizer
          </div>

          <div className="preview-canvases">
            {canvases.map(({ part, w, h }) => (
              <JerseyCanvas
                key={part}
                template={template}
                part={part}
                colors={state.colors}
                playerName={state.playerName}
                playerNumber={state.playerNumber}
                fontName={state.fontName}
                fontUrl={fontUrl}
                textColor={state.textColor}
                strokeColor={state.strokeColor}
                logoCenter={logoCenter}
                logoLeft={logoLeft}
                logoRight={logoRight}
                laceFile={laceFile}
                width={w}
                height={h}
              />
            ))}
          </div>
        </div>

        {/* ── Step Panel ── */}
        <div className="step-panel">
          <div className="step-panel-header">
            {/* Menu button */}
            <button className="step-menu-btn" onClick={() => setShowMenu(m => !m)}>
              <IconMenu />
            </button>

            {/* Counter + label */}
            <div>
              <div className="step-counter">{stepIndex + 1}/{STEPS.length}</div>
              <div className="step-label">{step.label}</div>
            </div>

            {/* Prev / Next */}
            <button
              className="step-nav-btn"
              onClick={() => setStepIndex(i => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              <IconChevronLeft />
            </button>
            <button
              className="step-nav-btn"
              onClick={() => setStepIndex(i => Math.min(STEPS.length - 1, i + 1))}
              disabled={stepIndex === STEPS.length - 1}
            >
              <IconChevronRight />
            </button>

            {/* Expand placeholder */}
            <button className="step-expand-btn">
              <IconChevronDown />
            </button>
          </div>

          {/* Step content */}
          <div className="step-content">
            {step.id === 'teamName' && (
              <StepTeamName
                teamName={state.teamName}
                onChange={v => update({ teamName: v })}
              />
            )}
            {step.id === 'colors' && (
              <StepColors
                colors={state.colors}
                onChange={colors => update({ colors })}
                numColors={template.numColors}
              />
            )}
            {step.id === 'pattern' && (
              <StepPattern
                selectedId={state.templateId}
                onSelect={handleTemplateSelect}
              />
            )}
            {step.id === 'text' && (
              <StepText
                playerName={state.playerName}
                playerNumber={state.playerNumber}
                fontName={state.fontName}
                textColor={state.textColor}
                strokeColor={state.strokeColor}
                onNameChange={v   => update({ playerName: v })}
                onNumberChange={v => update({ playerNumber: v })}
                onFontChange={v   => update({ fontName: v })}
                onTextColorChange={v   => update({ textColor: v })}
                onStrokeColorChange={v => update({ strokeColor: v })}
              />
            )}
            {step.id === 'logo' && (
              <StepLogo
                logos={state.logos}
                onLogoChange={(pos, dataUrl) =>
                  update({ logos: { ...state.logos, [pos]: dataUrl } })
                }
              />
            )}
            {step.id === 'laces' && (
              <StepLaces
                selected={state.lace}
                onSelect={v => update({ lace: v })}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Step menu drawer ── */}
      {showMenu && (
        <div className="step-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="step-menu-drawer" onClick={e => e.stopPropagation()}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`step-menu-item ${i === stepIndex ? 'active' : ''}`}
                onClick={() => { setStepIndex(i); setShowMenu(false) }}
              >
                {s.label}
              </button>
            ))}
            <button className="step-menu-start-over" onClick={handleReset}>
              <IconReset /> Start Over
            </button>
          </div>
        </div>
      )}

      {/* ── Submit modal ── */}
      {showSubmit && (
        <SubmitModal
          teamName={state.teamName}
          onClose={() => setShowSubmit(false)}
        />
      )}
    </div>
  )
}
