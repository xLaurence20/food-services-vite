import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ModuleView() {
  const { id } = useParams()
  const [mod, setMod] = useState(null)

  useEffect(() => {
    supabase.from('modules').select('*').eq('id', id).single().then(({ data }) => setMod(data))
  }, [id])

  if (!mod) return <div className="p-10 text-center">Loading...</div>

  const getEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] p-6 max-w-[1100px] mx-auto">
      <Link to="/dashboard" className="text-sm text-[#7a3e00] font-bold underline mb-4 inline-block">← Back to Lessons</Link>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] mb-6">
        <h1 className="text-2xl text-[#7a3e00] font-bold">{mod.title}</h1>
        <p className="text-gray-600">{mod.description}</p>
      </div>

      {mod.video_url && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] mb-6">
          <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Video Lesson</h2>
          {mod.video_url.includes('youtube') || mod.video_url.includes('youtu.be') ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe src={getEmbedUrl(mod.video_url)} className="w-full h-full" allowFullScreen />
            </div>
          ) : (
            <video controls className="w-full rounded-lg" src={mod.video_url} />
          )}
        </div>
      )}

      {mod.document_url && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd]">
          <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Document</h2>
          <iframe src={mod.document_url} className="w-full h-[600px] border rounded-lg" title="Document Viewer" />
        </div>
      )}
    </div>
  )
}