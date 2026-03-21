export default function StepTeamName({ value, onChange }) {
  return (
    <div className="input-wrap">
      <label className="input-label" htmlFor="team-name">Team Name</label>
      <input
        id="team-name"
        className="text-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. Thunder"
        maxLength={28}
        autoFocus
      />
    </div>
  )
}
