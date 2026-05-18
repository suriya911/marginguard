import BrandHeader from '../components/dashboard/BrandHeader'
import MetricBar from '../components/dashboard/MetricBar'
import TruthLayerToggle from '../components/dashboard/TruthLayerToggle'
import CampaignTable from '../components/dashboard/CampaignTable'
import ConstraintInput from '../components/dashboard/ConstraintInput'

// Beat 3 components (Sabari Day 3) — imported as stubs for now
// import AgentRunnerPanel from '../components/dashboard/AgentRunnerPanel'
// import PipelineProgress from '../components/pipeline/PipelineProgress'

export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Beat 1 + 2 */}
      <BrandHeader />
      <MetricBar />
      <div className="mb-4">
        <TruthLayerToggle />
      </div>
      <CampaignTable />

      {/* Beat 3 inputs — Sabari wires these up */}
      <div className="mt-6 border border-border rounded-lg p-4 bg-surface">
        <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4">
          Gemini Agent Pipeline
        </div>
        <ConstraintInput />
        {/* AgentRunnerPanel goes here — Sabari Day 3 */}
        <div className="mt-4 py-4 border-t border-border text-center text-gray-600 text-sm font-mono">
          [ AgentRunnerPanel — wired by Sabari ]
        </div>
      </div>
    </main>
  )
}
