import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import ModuleView from './pages/ModuleView'
import CreateQuiz from './pages/CreateQuiz' // <-- ADD
import TakeQuiz from './pages/TakeQuiz'     // <-- ADD

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="create-quiz" element={<CreateQuiz />} /> {/* <-- ADD */}
          <Route path="module/:id" element={<ModuleView />} />
          <Route path="quiz/:id" element={<TakeQuiz />} />       {/* <-- ADD */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App