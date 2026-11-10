import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [docFile, setDocFile] = useState(null)
  const [videoType, setVideoType] = useState('file')
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  
  // NEW: Quiz States
  const [addQuiz, setAddQuiz] = useState(false)
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState([{ prompt: '', options: ['', '', '', ''], correct_index: 0 }])
  
  const navigate = useNavigate()

  // Functions to handle dynamic questions
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
  const addQuestion = () => setQuestions([...questions, { prompt: '', options: ['', '', '', ''], correct_index: 0 }])
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let docUrl = ''
      let vidUrl = ''

      // 1. Upload Files
      if (docFile) {
        const docPath = `docs/${Date.now()}-${docFile.name}`
        const { error: docErr } = await supabase.storage.from('modules').upload(docPath, docFile)
        if (docErr) throw docErr
        const { data: { publicUrl } } = supabase.storage.from('modules').getPublicUrl(docPath)
        docUrl = publicUrl
      }

      if (videoType === 'file' && videoFile) {
        const vidPath = `videos/${Date.now()}-${videoFile.name}`
        const { error: vidErr } = await supabase.storage.from('modules').upload(vidPath, videoFile)
        if (vidErr) throw vidErr
        const { data: { publicUrl } } = supabase.storage.from('modules').getPublicUrl(vidPath)
        vidUrl = publicUrl
      } else if (videoType === 'url' && videoUrl) {
        vidUrl = videoUrl
      }

      // 2. Save Module to DB
      const { data: moduleData, error: dbErr } = await supabase.from('modules').insert({
        title, description, document_url: docUrl, video_url: vidUrl
      }).select('id').single()
      
      if (dbErr) throw dbErr

      // 3. Save Quiz if requested
      if (addQuiz && moduleData) {
        const { data: quizData, error: quizErr } = await supabase.from('quizzes').insert({
          module_id: moduleData.id,
          title: quizTitle || `${title} Quiz`
        }).select('id').single()

        if (quizErr) throw quizErr

        if (quizData) {
          const formattedQuestions = questions.map((q, i) => ({
            quiz_id: quizData.id,
            prompt: q.prompt,
            options: q.options,
            correct_index: q.correct_index,
            position: i
          }))
          const { error: qErr } = await supabase.from('questions').insert(formattedQuestions)
          if (qErr) throw qErr
        }
      }

      navigate('/dashboard')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)] max-w-2xl mx-auto mt-6">
      <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">UPLOAD TOOL</span>
      <h1 className="text-2xl text-[#7a3e00] font-bold mb-6">Upload New Module</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1">Module Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]" />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]" />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Document (PDF, DOCX, PPTX)</label>
          <input type="file" onChange={e => setDocFile(e.target.files[0])} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
        </div>

        <div className="bg-[#faf8f6] p-4 border border-[#ddd] rounded-lg">
          <label className="block text-sm font-bold mb-2">Video Lesson</label>
          <div className="flex gap-4 mb-3">
            <label className="cursor-pointer"><input type="radio" checked={videoType === 'file'} onChange={() => setVideoType('file')} className="mr-2"/> Upload File</label>
            <label className="cursor-pointer"><input type="radio" checked={videoType === 'url'} onChange={() => setVideoType('url')} className="mr-2"/> Paste Link</label>
          </div>
          {videoType === 'file' ? (
            <input type="file" accept="video/mp4" onChange={e => setVideoFile(e.target.files[0])} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
          ) : (
            <input type="url" placeholder="https://youtube.com/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
          )}
        </div>

        {/* --- NEW: QUIZ BUILDER TOGGLE --- */}
        <div className="border-t border-[#ddd] pt-5 mt-5">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-[#7a3e00]">
            <input type="checkbox" checked={addQuiz} onChange={e => setAddQuiz(e.target.checked)} className="w-5 h-5" />
            Add a Quiz for this Module
          </label>

          {addQuiz && (
            <div className="mt-4 space-y-4 bg-[#faf8f6] p-4 rounded-lg border border-[#ddd]">
              <input placeholder="Quiz Title (optional)" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
              
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white p-3 rounded-lg border border-[#ddd]">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Question {qIndex + 1}</span>
                    {questions.length > 1 && <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm">Remove</button>}
                  </div>
                  <input placeholder="Type question here..." value={q.prompt} onChange={e => updateQuestion(qIndex, 'prompt', e.target.value)} className="w-full p-2 border border-[#ccc] rounded-lg mb-2 text-sm" required />
                  
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2 mb-1">
                      <input type="radio" name={`correct-${qIndex}`} checked={q.correct_index === oIndex} onChange={() => updateQuestion(qIndex, 'correct_index', oIndex)} className="w-4 h-4" />
                      <input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} className="w-full p-1 border border-[#ccc] rounded text-sm" required />
                    </div>
                  ))}
                </div>
              ))}
              <button type="button" onClick={addQuestion} className="text-sm font-bold text-[#315f8a] hover:underline">+ Add Another Question</button>
            </div>
          )}
        </div>

        <button disabled={loading} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
          {loading ? 'Saving...' : 'Create Module'}
        </button>
      </form>
    </div>
  )
}