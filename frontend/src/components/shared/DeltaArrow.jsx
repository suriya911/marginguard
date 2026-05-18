import clsx from 'clsx'

export default function DeltaArrow({ delta }) {
  if (delta === 0) return <span className="text-gray-500 font-mono text-sm">—</span>
  const up = delta > 0
  return (
    <span className={clsx('font-mono text-sm font-semibold', up ? 'text-profit' : 'text-danger')}>
      {up ? '▲' : '▼'} ${Math.abs(delta).toFixed(0)}/day
    </span>
  )
}
