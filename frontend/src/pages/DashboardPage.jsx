import BrandHeader from '../components/dashboard/BrandHeader'
import MetricBar from '../components/dashboard/MetricBar'
import TruthLayerToggle from '../components/dashboard/TruthLayerToggle'
import CampaignTable from '../components/dashboard/CampaignTable'
import ConstraintInput from '../components/dashboard/ConstraintInput'
import AgentRunnerPanel from '../components/dashboard/AgentRunnerPanel'
import PipelineProgress from '../components/pipeline/PipelineProgress'
import StreamingOutput from '../components/pipeline/StreamingOutput'
import useMarginStore from '../store/useMarginStore'

export default function DashboardPage() {
  const pipelineStatus = useMarginStore((s) => s.pipelineStatus)
  const showPipeline   = pipelineStatus !== 'idle'

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Beat 1 + 2 — never call API */}
      <BrandHeader />
      <MetricBar />
      <div className="mb-4">
        <TruthLayerToggle />
      </div>
      <CampaignTable />

      {/* Beat 3 — Gemini pipeline */}
      <div className="mt-6 border border-border rounded-lg p-5 bg-surface">
        <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4">
          Gemini Agent Pipeline
        </div>
        <ConstraintInput />
        <AgentRunnerPanel />

        {showPipeline && (
          <div className="mt-6 space-y-4">
            <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">
              Pipeline Progress
            </div>
            <PipelineProgress />
            <StreamingOutput />
          </div>
        )}
      </div>
    </main>
  )
}
