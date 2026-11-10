import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ModuleView() {
  const { id } = useParams()
  const [mod, setMod] = useState(null)

  useEffect(() => {
    supabase.from('modules').select('*').eq('id', id).single().then(({ data }) => setMod(data))
  }, [id])

  if (!mod) return <div className="p-10 text-center text-xl font-bold text-[#7a3e00]">Loading...</div>

  const getEmbedUrl = (url) => {
    if (!url) return ''
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    
    const gdRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/i;
    const gdMatch = url.match(gdRegex);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    
    return url;
  }

  const isDirectVideo = mod.video_url && (mod.video_url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) !== null);
  const embedUrl = mod.video_url ? getEmbedUrl(mod.video_url) : '';

  const getDocumentViewerUrl = (url) => {
    if (!url) return '';
    if (url.toLowerCase().includes('.pdf')) {
       return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    if (url.toLowerCase().match(/\.(doc|docx|ppt|pptx|xls|xlsx)$/)) {
       return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    }
    return url;
  }

  const documentViewerUrl = getDocumentViewerUrl(mod.document_url);

  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="text-sm text-[#7a3e00] font-bold hover:underline inline-block">← Back to Lessons</Link>
      
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">LESSON</span>
        <h1 className="text-2xl text-[#7a3e00] font-bold">{mod.title}</h1>
        <p className="text-gray-600 mt-2">{mod.description}</p>
      </div>

      {mod.video_url && (
        <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
          <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Video Lesson</h2>
          {isDirectVideo ? (
            <video controls className="w-full rounded-lg border border-[#eee]" src={mod.video_url} />
          ) : (
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#eee]">
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video Lesson" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          )}
          <div className="mt-4 text-center">
            <a href={mod.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#315f8a] underline font-bold">Open Video in New Tab</a>
          </div>
        </div>
      )}

      {mod.document_url && (
        <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#7a3e00] font-bold">Document Viewer</h2>
            <a href={mod.document_url} target="_blank" rel="noopener noreferrer" className="bg-[#315f8a] text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90">Download File</a>
          </div>
          <div className="w-full h-[700px] border border-[#eee] rounded-lg overflow-hidden bg-gray-50">
            <iframe src={documentViewerUrl} className="w-full h-full" title="Document Viewer" />
          </div>
        </div>
      )}
    </div>
  )
}