import clsx from 'clsx'

const SEVERITY = {
  none:     null,
  low:      { label: 'LOW',      classes: 'bg-gray-700 text-gray-300' },
  medium:   { label: 'MEDIUM',   classes: 'bg-yellow-900/50 text-warning' },
  high:     { label: 'HIGH',     classes: 'bg-orange-900/50 text-orange-400' },
  critical: { label: 'CRITICAL', classes: 'bg-red-900/40 text-danger' },
}

export default function RiskBadge({ severity }) {
  const cfg = SEVERITY[severity]
  if (!cfg) return null
  return (
    <span className={clsx('font-mono text-xs px-2 py-0.5 rounded font-semibold tracking-wider', cfg.classes)}>
      {cfg.label}
    </span>
  )
}
