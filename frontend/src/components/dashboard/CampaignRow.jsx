import CountUp from 'react-countup'
import clsx from 'clsx'
import RiskBadge from '../shared/RiskBadge'

function StockoutBadge() {
  return (
    <span className="ml-2 font-mono text-xs px-2 py-0.5 rounded bg-warning/20 text-warning font-semibold animate-pulse">
      STOCKOUT 12d
    </span>
  )
}

export default function CampaignRow({ campaign, truthActive }) {
  const isUnprofitable = truthActive && !campaign.is_profitable
  const isStockout = truthActive && campaign.inventory_days <= 12

  return (
    <tr
      className={clsx(
        'border-b border-border transition-colors duration-400',
        isUnprofitable && 'bg-red-950/30',
        !isUnprofitable && isStockout && 'bg-yellow-950/20',
        !isUnprofitable && !isStockout && 'hover:bg-surface'
      )}
    >
      {/* Campaign name */}
      <td className="px-4 py-3 text-sm text-white font-medium">
        {campaign.product_name}
        {isStockout && <StockoutBadge />}
      </td>

      {/* Daily spend */}
      <td className="px-4 py-3 font-mono text-sm text-gray-300">
        ${campaign.daily_spend.toLocaleString()}/day
      </td>

      {/* Reported ROAS — always shown */}
      <td className="px-4 py-3 font-mono text-sm text-profit font-semibold">
        {campaign.reported_roas.toFixed(2)}x
      </td>

      {/* True ROAS — only in truth view */}
      <td className="px-4 py-3 font-mono text-sm font-semibold">
        {truthActive ? (
          <span className={clsx(
            'transition-colors duration-800',
            campaign.true_profit_roas < 1.0 ? 'text-danger' :
            campaign.true_profit_roas < 2.0 ? 'text-warning' : 'text-profit'
          )}>
            <CountUp
              start={campaign.reported_roas}
              end={campaign.true_profit_roas}
              duration={campaign.true_profit_roas < 1.0 ? 0.8 : 0.5}
              decimals={2}
              suffix="x"
            />
          </span>
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </td>

      {/* Anomaly / status */}
      <td className="px-4 py-3">
        {truthActive ? (
          <RiskBadge severity={campaign.anomaly_severity} />
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-profit">
            <span className="w-1.5 h-1.5 rounded-full bg-profit inline-block" />
            Enabled
          </span>
        )}
      </td>

      {/* Inventory */}
      <td className="px-4 py-3 font-mono text-sm text-gray-400">
        {truthActive
          ? <span className={campaign.inventory_days <= 12 ? 'text-warning' : 'text-gray-400'}>
              {campaign.inventory_days}d
            </span>
          : '—'}
      </td>
    </tr>
  )
}
