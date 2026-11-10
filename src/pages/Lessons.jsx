import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Lessons() {
  const [modules, setModules] = useState([])
  const [role, setRole] = useState('student')

  useEffect(() => {
    setRole(localStorage.getItem('app_role') || 'student')
    fetchModules()
  }, [])

  async function fetchModules() {
    const { data } = await supabase.from('modules').select('*').order('created_at', { ascending: false })
    setModules(data || [])
  }

  // Helper to extract file path from URL for deletion
  const getStoragePath = (url) => {
    if (!url) return null;
    const parts = url.split('/modules/');
    return parts.length > 1 ? parts[1] : null;
  }

  async function handleDelete(id, docUrl, vidUrl) {
    if (!window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) return
    
    try {
      const pathsToDelete = []
      if (docUrl) pathsToDelete.push(getStoragePath(docUrl))
      if (vidUrl) pathsToDelete.push(getStoragePath(vidUrl))
      
      // 1. Delete files from storage
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('modules').remove(pathsToDelete)
      }

      // 2. Delete record from database
      const { error } = await supabase.from('modules').delete().eq('id', id)
      if (error) throw error

      // 3. Refresh list
      fetchModules()
    } catch (err) {
      alert("Error deleting module: " + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">LESSONS</span>
        <h2 className="text-2xl text-[#7a3e00] font-bold mb-2">Food Services Lessons</h2>
        <p className="text-sm text-[#6d625c]">
          {role === 'teacher' 
            ? 'Manage your uploaded modules below.' 
            : 'Open a module to view the video and document materials.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-[#f6eadf] p-5 rounded-xl flex flex-col justify-between border border-[#ddd]">
            <div>
              <h3 className="text-[#663716] font-bold text-lg mb-2">{mod.title}</h3>
              <p className="text-sm text-[#2d241f] line-clamp-2">{mod.description}</p>
            </div>
            
            {/* Buttons Section */}
            <div className="mt-4 space-y-2">
              <Link to={`/module/${mod.id}`} className="block w-full bg-[#7a3e00] text-white text-center px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90">
                Open Lesson
              </Link>

              {/* Show Edit/Delete ONLY if Teacher */}
              {role === 'teacher' && (
                <div className="flex gap-2">
                  <Link to={`/module/edit/${mod.id}`} className="flex-1 bg-[#315f8a] text-white text-center px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(mod.id, mod.document_url, mod.video_url)} 
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {modules.length === 0 && <p className="text-gray-500 italic">No modules uploaded yet.</p>}
      </div>
    </div>
  )
}