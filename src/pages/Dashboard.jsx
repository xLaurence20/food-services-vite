import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [modules, setModules] = useState([])

  useEffect(() => {
    fetchModules()
  }, [])

  async function fetchModules() {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error(error)
    else setModules(data)
  }

  const getStoragePath = (url) => {
    if (!url) return null;
    const parts = url.split('/modules/');
    return parts.length > 1 ? parts[1] : null;
  }

  async function handleDelete(id, docUrl, vidUrl) {
    if (!window.confirm("Are you sure you want to delete this module?")) return
    try {
      const pathsToDelete = []
      if (docUrl) pathsToDelete.push(getStoragePath(docUrl))
      if (vidUrl) pathsToDelete.push(getStoragePath(vidUrl))
      
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('modules').remove(pathsToDelete)
      }

      await supabase.from('modules').delete().eq('id', id)
      fetchModules()
    } catch (err) {
      alert("Error deleting module: " + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* WELCOME CARD */}
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">WELCOME</span>
        <h2 className="text-2xl text-[#7a3e00] font-bold mb-2">Welcome, Grade 9 Learner!</h2>
        <p className="mb-4">This prototype provides organized Food Services lessons, guided activities, digital-supported explanations, quizzes, and reflection tasks.</p>
        <div className="bg-[#fff7e8] border-l-4 border-[#d98b3a] p-4 rounded mb-4 text-sm">
          <strong>Important:</strong> Digital tools are a learning support. They do not replace your teacher. Always verify information with your teacher and use the validated module content as your main learning guide.
        </div>
        <button className="bg-[#7a3e00] text-white px-4 py-2 rounded-lg font-bold hover:opacity-90" onClick={() => document.getElementById('lessons-section').scrollIntoView({behavior: 'smooth'})}>
          Start Learning
        </button>
      </div>

      {/* TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">📚 Learn</h3><p className="text-sm">Read structured Food Services lessons.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">🧩 Practice</h3><p className="text-sm">Complete activities and apply what you learned.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">💡 Digital Support</h3><p className="text-sm">Ask for simpler explanations and guided hints.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">📊 Assess</h3><p className="text-sm">Check your understanding through quizzes.</p></div>
      </div>

      {/* LEARNING FLOW CARD */}
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <h2 className="text-xl text-[#7a3e00] font-bold mb-2">Learning Flow</h2>
        <p className="font-bold">Learn → Practice → Ask → Apply → Assess → Reflect</p>
      </div>

      {/* LESSONS SECTION */}
      <div id="lessons-section" className="pt-6">
        <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)] mb-6">
          <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">LESSONS</span>
          <h2 className="text-2xl text-[#7a3e00] font-bold mb-2">Food Services Lessons</h2>
          <p className="text-sm text-[#6d625c]">The lesson set below is a working prototype. Open a module to view the video and document materials.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-[#f6eadf] p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-[#663716] font-bold text-lg mb-2">{mod.title}</h3>
                <p className="text-sm text-[#2d241f] line-clamp-2">{mod.description}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/module/${mod.id}`} className="flex-1 bg-[#7a3e00] text-white text-center px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90">
                  Open
                </Link>
                <button onClick={() => handleDelete(mod.id, mod.document_url, mod.video_url)} className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {modules.length === 0 && <p className="text-gray-500 italic">No modules uploaded yet.</p>}
        </div>
      </div>
    </div>
  )
}