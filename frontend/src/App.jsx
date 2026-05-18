import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import DashboardPage from './pages/DashboardPage'
import BriefPage from './pages/BriefPage'
import ArchitecturePage from './pages/ArchitecturePage'
import useMarginStore from './store/useMarginStore'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || ''

export default function App() {
  const setCampaignData = useMarginStore((s) => s.setCampaignData)

  useEffect(() => {
    axios.get(`${BASE}/api/data/glownest`)
      .then((r) => setCampaignData(r.data))
      .catch(() => {/* backend may not be up yet — Beat 2 works without it */})
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy">
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/brief" element={<BriefPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
