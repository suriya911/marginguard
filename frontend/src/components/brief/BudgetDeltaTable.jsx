import clsx from 'clsx'
import DeltaArrow from '../shared/DeltaArrow'

export default function BudgetDeltaTable({ plan }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Budget Reallocation</span>
        <span className={clsx(
          'text-xs font-mono font-semibold',
          plan.budget_neutral_verified ? 'text-profit' : 'text-danger'
        )}>
          {plan.budget_neutral_verified ? '✓ Budget Neutral' : '✗ Not Neutral'} · ${plan.total_recommended_daily_budget}/day
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Campaign', 'Current', 'Recommended', 'Change', 'Risk'].map((h) => (
              <th key={h} className="px-4 py-2 text-left text-xs text-gray-500 font-mono uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plan.budget_moves.map((m) => (
            <tr key={m.campaign_id} className="border-b border-border/50 hover:bg-border/20">
              <td className="px-4 py-3">
                <div className="text-white text-sm font-medium">{m.product_name}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{m.rationale}</div>
              </td>
              <td className="px-4 py-3 font-mono text-gray-400">${m.current_daily_spend}/d</td>
              <td className="px-4 py-3 font-mono text-white font-semibold">${m.recommended_daily_spend}/d</td>
              <td className="px-4 py-3"><DeltaArrow delta={m.delta_dollars} /></td>
              <td className="px-4 py-3">
                <span className={clsx('font-mono text-xs', {
                  'text-danger':  m.risk_level === 'high',
                  'text-warning': m.risk_level === 'medium',
                  'text-profit':  m.risk_level === 'low',
                  'text-gray-500':m.risk_level === 'none',
                })}>
                  {m.risk_level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-profit/5">
        <span className="text-xs text-gray-400">Projected weekly profit improvement</span>
        <span className="font-mono font-semibold text-profit">+${plan.projected_weekly_profit_delta.toLocaleString()}/week</span>
      </div>
    </div>
  )
}
