import { create } from 'zustand'
import { DEFAULT_CONSTRAINT } from '../constants/glownest'

const BASE = () => import.meta.env.VITE_API_BASE_URL || ''

const useMarginStore = create((set, get) => ({
  // Data
  campaignData: [],

  // UI
  truthLayerActive: false,
  currentPage: 'dashboard',

  // Pipeline — now 4 agents
  constraint: DEFAULT_CONSTRAINT,
  pipelineStatus: 'idle',
  agentStatuses: {
    audit:        'waiting',
    reallocation: 'waiting',
    experiment:   'waiting',
    optimization: 'waiting',
  },
  agentTimings: {},
  streamingChunks: '',

  // Results
  auditReport:      null,
  reallocationPlan: null,
  experimentBrief:  null,
  optimizationReport: null,
  brief: null,

  // Actions
  setCampaignData: (data) => set({ campaignData: data }),
  setConstraint:   (text) => set({ constraint: text }),
  setCurrentPage:  (page) => set({ currentPage: page }),

  activateTruthLayer:  () => set({ truthLayerActive: true }),
  deactivateTruthLayer:() => set({ truthLayerActive: false }),
  toggleTruthLayer:    () => set((s) => ({ truthLayerActive: !s.truthLayerActive })),

  runPipeline: () => {
    const { constraint } = get()
    set({
      pipelineStatus: 'running',
      agentStatuses: { audit: 'running', reallocation: 'waiting', experiment: 'waiting', optimization: 'waiting' },
      streamingChunks: '',
      brief: null,
    })

    const url = `${BASE()}/api/pipeline/stream?brand_constraint=${encodeURIComponent(constraint)}`
    const es  = new EventSource(url)

    es.addEventListener('agent_start', (e) => {
      const d = JSON.parse(e.data)
      set((s) => ({
        agentStatuses:   { ...s.agentStatuses, [d.agent]: 'running' },
        streamingChunks: s.streamingChunks + `\n► [${d.agent.toUpperCase()}] ${d.message}\n`,
      }))
    })

    es.addEventListener('agent_chunk', (e) => {
      const d = JSON.parse(e.data)
      set((s) => ({ streamingChunks: s.streamingChunks + d.chunk }))
    })

    es.addEventListener('agent_complete', (e) => {
      const d = JSON.parse(e.data)
      set((s) => ({
        agentStatuses: { ...s.agentStatuses, [d.agent]: 'complete' },
        agentTimings:  { ...s.agentTimings,  [d.agent]: d.duration_seconds },
      }))
    })

    es.addEventListener('pipeline_complete', (e) => {
      const brief = JSON.parse(e.data)
      es.close()
      set({
        pipelineStatus:    'complete',
        brief,
        auditReport:       brief.audit,
        reallocationPlan:  brief.reallocation,
        experimentBrief:   brief.experiment,
        optimizationReport: brief.optimization,
        currentPage:       'brief',
      })
    })

    es.onerror = () => {
      es.close()
      set({ pipelineStatus: 'error' })
    }
  },

  resetPipeline: () => set({
    pipelineStatus:    'idle',
    agentStatuses:     { audit: 'waiting', reallocation: 'waiting', experiment: 'waiting', optimization: 'waiting' },
    agentTimings:      {},
    streamingChunks:   '',
    brief:             null,
    auditReport:       null,
    reallocationPlan:  null,
    experimentBrief:   null,
    optimizationReport: null,
  }),
}))

export default useMarginStore
