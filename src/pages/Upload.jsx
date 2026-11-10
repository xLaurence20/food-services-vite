import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [docFile, setDocFile] = useState(null)
  const [videoType, setVideoType] = useState('file') // 'file' or 'url'
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let docUrl = ''
      let vidUrl = ''

      // 1. Upload Document
      if (docFile) {
        const docPath = `docs/${Date.now()}-${docFile.name}`
        const { error: docErr } = await supabase.storage.from('modules').upload(docPath, docFile)
        if (docErr) throw docErr
        const { data: { publicUrl } } = supabase.storage.from('modules').getPublicUrl(docPath)
        docUrl = publicUrl
      }

      // 2. Upload Video File (if selected)
      if (videoType === 'file' && videoFile) {
        const vidPath = `videos/${Date.now()}-${videoFile.name}`
        const { error: vidErr } = await supabase.storage.from('modules').upload(vidPath, videoFile)
        if (vidErr) throw vidErr
        const { data: { publicUrl } } = supabase.storage.from('modules').getPublicUrl(vidPath)
        vidUrl = publicUrl
      } else if (videoType === 'url' && videoUrl) {
        vidUrl = videoUrl
      }

      // 3. Save to Database
      const { error: dbErr } = await supabase.from('modules').insert({
        title, description, document_url: docUrl, video_url: vidUrl
      })
      if (dbErr) throw dbErr

      navigate('/dashboard')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#2d241f] p-6 flex justify-center">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ddd] w-full max-w-xl h-fit">
        <h1 className="text-2xl text-[#7a3e00] font-bold mb-6">Upload New Module</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Module Title" className="w-full p-3 border rounded-lg" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-3 border rounded-lg" rows="3" />
          
          <div>
            <label className="block text-sm font-bold mb-1">Document (PDF, DOCX, PPTX)</label>
            <input type="file" onChange={e => setDocFile(e.target.files[0])} className="w-full p-2 border rounded-lg bg-white" />
          </div>

          <div className="p-4 border rounded-lg bg-[#faf8f6]">
            <label className="block text-sm font-bold mb-2">Video Lesson</label>
            <div className="flex gap-4 mb-2">
              <label><input type="radio" checked={videoType === 'file'} onChange={() => setVideoType('file')} /> Upload File</label>
              <label><input type="radio" checked={videoType === 'url'} onChange={() => setVideoType('url')} /> Paste Link</label>
            </div>
            
            {videoType === 'file' ? (
              <input type="file" accept="video/mp4" onChange={e => setVideoFile(e.target.files[0])} className="w-full p-2 border rounded-lg bg-white" />
            ) : (
              <input type="url" placeholder="https://youtube.com/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full p-2 border rounded-lg bg-white" />
            )}
          </div>

          <button disabled={loading} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90">
            {loading ? 'Uploading...' : 'Create Module'}
          </button>
        </form>
      </div>
    </div>
  )
}