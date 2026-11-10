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
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let docUrl = ''
      let vidUrl = ''

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
    <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)] max-w-2xl mx-auto mt-6">
      <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">UPLOAD TOOL</span>
      <h1 className="text-2xl text-[#7a3e00] font-bold mb-6">Upload New Module</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1">Module Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-none focus:border-[#7a3e00]" />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-none focus:border-[#7a3e00]" />
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

        <button disabled={loading} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
          {loading ? 'Uploading...' : 'Create Module'}
        </button>
      </form>
    </div>
  )
}