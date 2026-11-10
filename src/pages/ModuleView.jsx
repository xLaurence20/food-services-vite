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

  // Smart URL embedder for popular video platforms
  const getEmbedUrl = (url) => {
    if (!url) return ''
    
    // 1. YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    
    // 2. Google Drive
    const gdRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/i;
    const gdMatch = url.match(gdRegex);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    
    // 3. Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    // 4. Facebook Video
    if (url.includes('facebook.com') && url.includes('/videos/')) {
       return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
    }

    // Fallback for direct embed links
    return url;
  }

  // Check if it's a direct video file (mp4, webm, ogg)
  const isDirectVideo = mod.video_url && (mod.video_url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) !== null);
  
  // Get the formatted URL for iframes
  const embedUrl = mod.video_url ? getEmbedUrl(mod.video_url) : '';

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
            // Embed YouTube, Drive, Vimeo, etc.
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#eee]">
              <iframe 
                src={embedUrl} 
                className="w-full h-full" 
                allowFullScreen 
                title="Video Lesson"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          {/* Fallback link in case the iframe is still blocked */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Video not loading?</p>
            <a href={mod.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#315f8a] underline font-bold">
              Open Video in New Tab
            </a>
          </div>
        </div>
      )}

      {mod.document_url && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd]">
          <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Document</h2>
          <iframe src={mod.document_url} className="w-full h-[600px] border rounded-lg" title="Document Viewer" />
          <div className="mt-4 text-center">
            <a href={mod.document_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#315f8a] underline font-bold">
              Download / View Document
            </a>
          </div>
        </div>
      )}
    </div>
  )
}