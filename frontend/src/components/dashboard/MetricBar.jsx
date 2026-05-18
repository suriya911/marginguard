import CountUp from 'react-countup'
import useMarginStore from '../../store/useMarginStore'
import { GLOWNEST_METRICS } from '../../constants/glownest'

function Metric({ label, value, suffix = 'x', color = 'text-white', animateTo = null, active = false }) {
  return (
    <div className="flex flex-col items-center px-8 py-4 border-r border-border last:border-r-0">
      <span className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">{label}</span>
      <span className={`font-mono text-3xl font-semibold ${color} transition-colors duration-400`}>
        {active && animateTo !== null ? (
          <CountUp
            start={GLOWNEST_METRICS.reported_roas}
            end={animateTo}
            duration={0.8}
            decimals={2}
            suffix={suffix}
          />
        ) : (
          `${value}${suffix}`
        )}
      </span>
    </div>
  )
}

export default function MetricBar() {
  const truthLayerActive = useMarginStore((s) => s.truthLayerActive)

  return (
    <div className="flex bg-surface border border-border rounded-lg mb-6 divide-x divide-border overflow-hidden">
      <Metric
        label="Reported ROAS"
        value="4.62"
        color="text-profit"
      />
      <Metric
        label="True Profit ROAS"
        value={truthLayerActive ? GLOWNEST_METRICS.true_profit_roas.toFixed(2) : '—'}
        animateTo={GLOWNEST_METRICS.true_profit_roas}
        active={truthLayerActive}
        color={truthLayerActive ? 'text-danger' : 'text-gray-600'}
        suffix={truthLayerActive ? 'x' : ''}
      />
      <Metric
        label="Unprofitable Campaigns"
        value={truthLayerActive ? GLOWNEST_METRICS.campaigns_unprofitable : '—'}
        suffix=""
        color={truthLayerActive ? 'text-danger' : 'text-gray-600'}
      />
      <Metric
        label="Stockout Risk"
        value={truthLayerActive ? GLOWNEST_METRICS.campaigns_at_risk : '—'}
        suffix=""
        color={truthLayerActive ? 'text-warning' : 'text-gray-600'}
      />
    </div>
  )
}
