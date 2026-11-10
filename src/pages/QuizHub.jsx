import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function QuizHub() {
  const [modules, setModules] = useState([])
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    supabase.from('modules').select('id, title').then(({ data }) => setModules(data || []))
  }, [])

  const handleModuleSelect = async (e) => {
    const mId = e.target.value
    setSelectedModuleId(mId)
    if (!mId) return setQuizzes([])

    const { data } = await supabase.from('quizzes').select('*').eq('module_id', mId)
    setQuizzes(data || [])
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">QUIZZES</span>
        <h2 className="text-2xl text-[#7a3e00] font-bold mb-4">Select a Module to Take its Quiz</h2>
        
        <label className="block text-sm font-bold mb-2">Choose a Module:</label>
        <select onChange={handleModuleSelect} className="w-full p-3 border border-[#ccc] rounded-lg bg-white mb-6">
          <option value="">-- Select Module --</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>

        {selectedModuleId && (
          <div className="space-y-3">
            <h3 className="font-bold text-[#7a3e00]">Available Quizzes:</h3>
            {quizzes.length > 0 ? quizzes.map(q => (
              <Link key={q.id} to={`/quiz/${q.id}`} className="block bg-[#f6eadf] p-4 rounded-lg border border-[#ddd] hover:bg-[#ebd9c5]">
                <h4 className="font-bold text-[#663716]">{q.title}</h4>
                <p className="text-sm text-[#7a3e00] mt-1">Start Quiz →</p>
              </Link>
            )) : <p className="text-gray-500 italic">No quizzes uploaded for this module yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}