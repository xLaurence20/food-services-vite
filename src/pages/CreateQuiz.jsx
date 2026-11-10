import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function CreateQuiz() {
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState('')
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState([{ prompt: '', options: ['', '', '', ''], correct_index: 0 }])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('modules').select('id, title').order('created_at', { ascending: false }).then(({ data }) => {
      setModules(data || [])
      if (data && data.length > 0) setSelectedModule(data[0].id)
    })
  }, [])

  const updateQuestion = (index, field, value) => {
    const newQs = [...questions]
    newQs[index][field] = value
    setQuestions(newQs)
  }
  const updateOption = (qIndex, oIndex, value) => {
    const newQs = [...questions]
    newQs[qIndex].options[oIndex] = value
    setQuestions(newQs)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: quizData, error: quizErr } = await supabase.from('quizzes').insert({
        module_id: selectedModule,
        title: quizTitle || 'Module Quiz'
      }).select('id').single()

      if (quizErr) throw quizErr

      const formattedQuestions = questions.map((q, i) => ({
        quiz_id: quizData.id,
        prompt: q.prompt,
        options: q.options,
        correct_index: q.correct_index,
        position: i
      }))
      
      const { error: qErr } = await supabase.from('questions').insert(formattedQuestions)
      if (qErr) throw qErr

      navigate('/lessons')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)] max-w-2xl mx-auto mt-6">
      <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">QUIZ TOOL</span>
      <h1 className="text-2xl text-[#7a3e00] font-bold mb-6">Create a Standalone Quiz</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1">Select Module</label>
          <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} className="w-full p-3 border border-[#ccc] rounded-lg bg-white" required>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Quiz Title</label>
          <input placeholder="e.g. Lesson 1 Quiz" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full p-3 border border-[#ccc] rounded-lg" required />
        </div>

        <div className="space-y-4 pt-4 border-t border-[#ddd]">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-[#faf8f6] p-4 rounded-lg border border-[#ddd]">
              <span className="text-sm font-bold text-[#7a3e00]">Question {qIndex + 1}</span>
              <input placeholder="Type question here..." value={q.prompt} onChange={e => updateQuestion(qIndex, 'prompt', e.target.value)} className="w-full p-2 border border-[#ccc] rounded-lg my-2" required />
              
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-1">
                  <input type="radio" name={`correct-${qIndex}`} checked={q.correct_index === oIndex} onChange={() => updateQuestion(qIndex, 'correct_index', oIndex)} className="w-4 h-4" />
                  <input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} className="w-full p-2 border border-[#ccc] rounded bg-white" required />
                </div>
              ))}
            </div>
          ))}
          <button type="button" onClick={() => setQuestions([...questions, { prompt: '', options: ['', '', '', ''], correct_index: 0 }])} className="text-sm font-bold text-[#315f8a] hover:underline">+ Add Another Question</button>
        </div>

        <button disabled={loading} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90">
          {loading ? 'Saving...' : 'Save Quiz'}
        </button>
      </form>
    </div>
  )
}