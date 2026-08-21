const tones = {
  Customer: 'badge-teal',
  Lead: 'badge-ink',
  Qualified: 'badge-amber',
  Won: 'badge-teal',
  Lost: 'badge-rose',
  Proposal: 'badge-amber',
  Negotiation: 'badge-ink',
  Email: 'badge-ink',
  Call: 'badge-teal',
  Meeting: 'badge-amber',
  Task: 'badge-ink',
}

export default function StatusBadge({ label }) {
  return <span className={`badge ${tones[label] || 'badge-ink'}`}>{label}</span>
}
