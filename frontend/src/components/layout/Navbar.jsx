import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const links = [
  { to: '/',             label: 'Dashboard' },
  { to: '/brief',        label: 'Brief' },
  { to: '/architecture', label: 'Architecture' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="border-b border-border bg-surface px-6 py-3 flex items-center justify-between">
      <span className="font-mono font-semibold text-white tracking-tight">
        Margin<span className="text-danger">Guard</span>
      </span>

      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'px-4 py-1.5 rounded text-sm font-medium transition-colors',
              pathname === to
                ? 'bg-border text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {label}
          </Link>
        ))}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 px-4 py-1.5 rounded text-sm font-medium text-ai border border-ai/30 hover:bg-ai/10 transition-colors"
        >
          API Docs ↗
        </a>
      </div>
    </nav>
  )
}
