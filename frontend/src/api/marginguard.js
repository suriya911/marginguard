import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || ''
const api = axios.create({ baseURL: BASE })

export const getGlownestData = () => api.get('/api/data/glownest').then((r) => r.data)
export const runPipeline = (brand_constraint) =>
  api.post('/api/pipeline/run', { brand_constraint }).then((r) => r.data)
export const healthCheck = () => api.get('/api/health').then((r) => r.data)
