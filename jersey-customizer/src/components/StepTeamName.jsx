export default function StepTeamName({ teamName, onChange }) {
  return (
    <div className="input-group">
      <label className="input-label" htmlFor="team-name">Team Name</label>
      <input
        id="team-name"
        className="text-input"
        type="text"
        value={teamName}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. Thunder"
        maxLength={30}
        autoFocus
      />
    </div>
  )
}
