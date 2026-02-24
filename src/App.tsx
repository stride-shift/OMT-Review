import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToolProvider } from './lib/ToolContext'
import Layout from './components/Layout'
import ApplicationsPage from './pages/ApplicationsPage'
import CompletenessPage from './pages/CompletenessPage'
import AlignmentPage from './pages/AlignmentPage'
import PrimerPage from './pages/PrimerPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToolProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ApplicationsPage />} />
            <Route path="/completeness" element={<CompletenessPage />} />
            <Route path="/alignment" element={<AlignmentPage />} />
            <Route path="/primer" element={<PrimerPage />} />
          </Route>
        </Routes>
      </ToolProvider>
    </BrowserRouter>
  )
}
