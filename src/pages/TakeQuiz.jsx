import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function TakeQuiz() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    async function loadQuiz() {
      const { data: q } = await supabase.from('quizzes').select('*').eq('id', id).single()
      const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', id).order('position')
      setQuiz(q)
      setQuestions(qs || [])
    }
    loadQuiz()
  }, [id])

  const handleSelect = (qId, optionIndex) => setAnswers({ ...answers, [qId]: optionIndex })

    const handleSubmit = async () => {
    let score = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_index) score++
    })
    
    // Save the attempt to Supabase
    try {
      await supabase.from('attempts').insert({
        quiz_id: quiz.id,
        score: score,
        total: questions.length
      })
    } catch (error) {
      console.error("Error saving score:", error)
    }

    setResult({ score, total: questions.length })
  }

  if (!quiz) return <div className="p-10 text-center">Loading Quiz...</div>

  if (result) {
    return (
      <div className="bg-white max-w-xl mx-auto mt-10 p-8 rounded-[15px] shadow-lg text-center">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-4 py-2 text-sm font-bold mb-4">RESULT</span>
        <h2 className="text-3xl font-bold text-[#7a3e00] mb-4">You scored {result.score} / {result.total}</h2>
        <Link to="/dashboard" className="bg-[#7a3e00] text-white px-6 py-3 rounded-lg font-bold">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
      <h1 className="text-2xl font-bold text-[#7a3e00] mb-6">{quiz.title}</h1>
      
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="p-4 border border-[#ddd] rounded-lg bg-[#faf8f6]">
            <p className="font-bold mb-3">{i + 1}. {q.prompt}</p>
            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <label key={oIndex} className="flex items-center gap-3 p-3 bg-white border border-[#ddd] rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name={`q-${q.id}`} onChange={() => handleSelect(q.id, oIndex)} className="w-4 h-4" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length} className="mt-8 w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
        Submit Quiz
      </button>
    </div>
  )
}