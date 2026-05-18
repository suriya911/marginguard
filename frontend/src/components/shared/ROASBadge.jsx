import clsx from 'clsx'

export default function ROASBadge({ value, isTrue = false }) {
  const num = parseFloat(value)
  const color = !isTrue
    ? 'text-profit'
    : num < 1.0
    ? 'text-danger'
    : num < 2.0
    ? 'text-warning'
    : 'text-profit'

  return (
    <span className={clsx('font-mono font-semibold tabular-nums', color)}>
      {num.toFixed(2)}x
    </span>
  )
}
