import useMarginStore from '../../store/useMarginStore'
import AgentStep from './AgentStep'

export default function PipelineProgress() {
  const agentStatuses    = useMarginStore((s) => s.agentStatuses)
  const agentTimings     = useMarginStore((s) => s.agentTimings)
  const audit            = useMarginStore((s) => s.auditReport)
  const reallocation     = useMarginStore((s) => s.reallocationPlan)
  const experiment       = useMarginStore((s) => s.experimentBrief)
  const optimization     = useMarginStore((s) => s.optimizationReport)

  const stats = {
    audit:        audit        ? `${audit.campaigns_unprofitable} unprofitable · ${audit.campaigns_at_risk} at risk` : null,
    reallocation: reallocation ? `+$${Math.round(reallocation.projected_weekly_profit_delta)}/wk projected` : null,
    experiment:   experiment   ? experiment.product_name : null,
    optimization: optimization ? `${optimization.total_suggestions} suggestions · +$${Math.round(optimization.estimated_total_weekly_profit_impact)}/wk` : null,
  }

  return (
    <div className="space-y-2">
      {(['audit', 'reallocation', 'experiment', 'optimization']).map((agent) => (
        <AgentStep
          key={agent}
          agent={agent}
          status={agentStatuses[agent]}
          timing={agentTimings[agent]}
          stat={stats[agent]}
        />
      ))}
    </div>
  )
}
