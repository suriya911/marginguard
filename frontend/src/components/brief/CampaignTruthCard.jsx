import clsx from 'clsx'
import RiskBadge from '../shared/RiskBadge'

export default function CampaignTruthCard({ truth }) {
  const isProfitable = truth.is_profitable
  const isStockout   = truth.anomaly_flags.some((f) => f.includes('STOCKOUT'))

  return (
    <div className={clsx(
      'bg-surface border rounded-lg p-4',
      !isProfitable ? 'border-danger/40' : isStockout ? 'border-warning/40' : 'border-border'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white text-sm">{truth.product_name}</div>
          <div className="text-xs text-gray-500 font-mono mt-0.5">{truth.campaign_id}</div>
        </div>
        <RiskBadge severity={truth.anomaly_severity} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Reported</div>
          <div className="font-mono text-sm text-profit font-semibold">{truth.reported_roas.toFixed(2)}x</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">True ROAS</div>
          <div className={clsx('font-mono text-sm font-semibold', truth.true_profit_roas < 1 ? 'text-danger' : truth.true_profit_roas < 2 ? 'text-warning' : 'text-profit')}>
            {truth.true_profit_roas.toFixed(2)}x
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Daily Margin</div>
          <div className={clsx('font-mono text-sm font-semibold', truth.true_contribution_margin_daily < 0 ? 'text-danger' : 'text-gray-300')}>
            ${truth.true_contribution_margin_daily.toFixed(0)}
          </div>
        </div>
      </div>

      {truth.anomaly_flags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {truth.anomaly_flags.map((f) => (
            <span key={f} className="font-mono text-xs px-2 py-0.5 bg-red-950/40 text-danger/80 rounded">{f}</span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 italic">{truth.recommended_action}</p>
    </div>
  )
}
