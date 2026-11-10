import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function EditModule() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [existingDocUrl, setExistingDocUrl] = useState('')
  const [existingVideoUrl, setExistingVideoUrl] = useState('')
  
  const [newDocFile, setNewDocFile] = useState(null)
  const [newVideoFile, setNewVideoFile] = useState(null)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [videoType, setVideoType] = useState('keep') // 'keep', 'file', 'url'
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchModule() {
      const { data, error } = await supabase.from('modules').select('*').eq('id', id).single()
      if (error) {
        alert("Error loading module")
        navigate('/lessons')
        return
      }
      setTitle(data.title)
      setDescription(data.description)
      setExistingDocUrl(data.document_url || '')
      setExistingVideoUrl(data.video_url || '')
      setLoading(false)
    }
    fetchModule()
  }, [id, navigate])

  const getStoragePath = (url) => {
    if (!url) return null;
    const parts = url.split('/modules/');
    return parts.length > 1 ? parts[1] : null;
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      let finalDocUrl = existingDocUrl
      let finalVideoUrl = existingVideoUrl

      // 1. Handle New Document Upload
      if (newDocFile) {
        // Delete old doc
        if (existingDocUrl) await supabase.storage.from('modules').remove([getStoragePath(existingDocUrl)])
        // Upload new doc
        const docPath = `docs/${Date.now()}-${newDocFile.name}`
        const { error } = await supabase.storage.from('modules').upload(docPath, newDocFile)
        if (error) throw error
        const { data } = supabase.storage.from('modules').getPublicUrl(docPath)
        finalDocUrl = data.publicUrl
      }

      // 2. Handle New Video Upload / URL
      if (videoType === 'file' && newVideoFile) {
        if (existingVideoUrl) await supabase.storage.from('modules').remove([getStoragePath(existingVideoUrl)])
        const vidPath = `videos/${Date.now()}-${newVideoFile.name}`
        const { error } = await supabase.storage.from('modules').upload(vidPath, newVideoFile)
        if (error) throw error
        const { data } = supabase.storage.from('modules').getPublicUrl(vidPath)
        finalVideoUrl = data.publicUrl
      } else if (videoType === 'url' && newVideoUrl) {
        finalVideoUrl = newVideoUrl
      } else if (videoType === 'remove') {
        if (existingVideoUrl) await supabase.storage.from('modules').remove([getStoragePath(existingVideoUrl)])
        finalVideoUrl = ''
      }

      // 3. Update Database
      const { error: dbError } = await supabase.from('modules').update({
        title, description, document_url: finalDocUrl, video_url: finalVideoUrl
      }).eq('id', id)

      if (dbError) throw dbError

      navigate('/lessons')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-center font-bold text-[#7a3e00]">Loading...</div>

  return (
    <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)] max-w-2xl mx-auto mt-6">
      <div className="mb-4">
        <Link to="/lessons" className="text-sm text-[#7a3e00] font-bold hover:underline">← Back to Lessons</Link>
      </div>
      
      <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">EDIT TOOL</span>
      <h1 className="text-2xl text-[#7a3e00] font-bold mb-6">Edit Module</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1">Module Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]" />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full p-3 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]" />
        </div>
        
        <div className="bg-[#faf8f6] p-4 border border-[#ddd] rounded-lg">
          <label className="block text-sm font-bold mb-2">Document (Leave blank to keep existing)</label>
          <input type="file" onChange={e => setNewDocFile(e.target.files[0])} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
          {existingDocUrl && <p className="text-xs text-green-600 mt-1">Current document is attached.</p>}
        </div>

        <div className="bg-[#faf8f6] p-4 border border-[#ddd] rounded-lg">
          <label className="block text-sm font-bold mb-2">Video Lesson</label>
          <div className="flex gap-4 mb-3">
            <label className="cursor-pointer text-sm"><input type="radio" checked={videoType === 'keep'} onChange={() => setVideoType('keep')} className="mr-1"/> Keep Existing</label>
            <label className="cursor-pointer text-sm"><input type="radio" checked={videoType === 'file'} onChange={() => setVideoType('file')} className="mr-1"/> Upload New File</label>
            <label className="cursor-pointer text-sm"><input type="radio" checked={videoType === 'url'} onChange={() => setVideoType('url')} className="mr-1"/> Update Link</label>
          </div>
          
          {videoType === 'file' && (
            <input type="file" accept="video/mp4" onChange={e => setNewVideoFile(e.target.files[0])} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
          )}
          {videoType === 'url' && (
            <input type="url" placeholder="https://youtube.com/..." value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} className="w-full p-2 border border-[#ccc] rounded-lg bg-white" />
          )}
        </div>

        <button disabled={saving} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold hover:opacity-90">
          {saving ? 'Saving Changes...' : 'Update Module'}
        </button>
      </form>
    </div>
  )
}