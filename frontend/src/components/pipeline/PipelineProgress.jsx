import useMarginStore from '../../store/useMarginStore'
import AgentStep from './AgentStep'

export default function PipelineProgress() {
  const agentStatuses = useMarginStore((s) => s.agentStatuses)
  const agentTimings  = useMarginStore((s) => s.agentTimings)
  const reallocation  = useMarginStore((s) => s.reallocationPlan)
  const experiment    = useMarginStore((s) => s.experimentBrief)
  const audit         = useMarginStore((s) => s.auditReport)

  const stats = {
    audit:        audit        ? `${audit.campaigns_unprofitable} unprofitable, ${audit.campaigns_at_risk} at risk` : null,
    reallocation: reallocation ? `+$${Math.round(reallocation.projected_weekly_profit_delta)}/wk` : null,
    experiment:   experiment   ? experiment.product_name : null,
  }

  return (
    <div className="space-y-2">
      {(['audit', 'reallocation', 'experiment']).map((agent) => (
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
