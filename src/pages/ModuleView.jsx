import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ModuleView() {
  const { id } = useParams()
  const [mod, setMod] = useState(null)

  useEffect(() => {
    supabase.from('modules').select('*').eq('id', id).single().then(({ data }) => setMod(data))
  }, [id])

  if (!mod) return <div className="p-10 text-center text-xl font-bold">Loading...</div>

  // Smart URL embedder for YouTube, Google Drive, and Vimeo
  const getEmbedUrl = (url) => {
    if (!url) return ''
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // Google Drive (Turns share link into preview link)
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    
    return url;
  }

  // Check if the link is a direct video file (mp4, webm, etc.)
  const isDirectVideo = mod.video_url && (mod.video_url.match(/\.(mp4|webm|ogg)$/i) !== null);

  return (
    <div className="min-h-screen bg-[#faf8f6] p-6 max-w-[1100px] mx-auto text-[#2d241f]">
      <Link to="/dashboard" className="text-sm text-[#7a3e00] font-bold underline mb-4 inline-block">← Back to Lessons</Link>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] mb-6">
        <h1 className="text-2xl text-[#7a3e00] font-bold">{mod.title}</h1>
        <p className="text-gray-600 mt-2">{mod.description}</p>
      </div>

      {mod.video_url && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] mb-6">
          <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Video Lesson</h2>
          
          {isDirectVideo ? (
            // Play direct video files (mp4, webm)
            <video controls className="w-full rounded-lg border border-[#eee]" src={mod.video_url} />
          ) : (
            // Embed YouTube, Drive, Vimeo, or other links
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#eee]">
              <iframe 
                src={getEmbedUrl(mod.video_url)} 
                className="w-full h-full" 
                allowFullScreen 
                title="Video Lesson"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
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