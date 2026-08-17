import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Welcome } from './pages/Welcome'
import { ModuleCatalog } from './pages/ModuleCatalog'
import { LearningModule } from './pages/LearningModule'
import { AgentCatalog } from './pages/AgentCatalog'
import { AgentWorkspace } from './pages/AgentWorkspace'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="pathways" element={<ModuleCatalog />} />
          <Route path="modules/:moduleId" element={<LearningModule />} />
          <Route path="agents" element={<AgentCatalog />} />
          <Route path="agents/:agentId" element={<AgentWorkspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
