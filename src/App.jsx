import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Activities from './pages/Activities'
import QuizHub from './pages/QuizHub'
import Assessment from './pages/Assessment'
import Feedback from './pages/Feedback'
import ModuleView from './pages/ModuleView'
import TakeQuiz from './pages/TakeQuiz'
import Upload from './pages/Upload'
import CreateQuiz from './pages/CreateQuiz'
import Stats from './pages/Stats'
import EditModule from './pages/EditModule'
import ManageAssessments from './pages/ManageAssessments'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          
          {/* Student Routes */}
          <Route path="home" element={<Home />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="activities" element={<Activities />} />
          <Route path="quiz" element={<QuizHub />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="feedback" element={<Feedback />} />
          
          {/* Shared Routes */}
          <Route path="module/:id" element={<ModuleView />} />
          <Route path="module/edit/:id" element={<EditModule />} />
          <Route path="quiz/:id" element={<TakeQuiz />} />

          {/* Teacher Routes */}
          <Route path="upload" element={<Upload />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="stats" element={<Stats />} />
          <Route path="assessments" element={<ManageAssessments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App