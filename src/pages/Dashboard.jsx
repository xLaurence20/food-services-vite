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

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#2d241f] font-sans">
      <header className="bg-gradient-to-br from-[#6d3500] to-[#b96b2d] text-white p-10 text-center">
        <h1 className="text-3xl font-bold mb-2">AI-Integrated Digital Learning Module</h1>
        <p className="font-bold">Food Services • Grade 9</p>
      </header>

      <nav className="bg-white border-b border-[#ddd] flex justify-center p-4 gap-6 font-bold text-[#7a3e00]">
        <Link to="/dashboard" className="hover:bg-[#f6eadf] px-4 py-2 rounded">Home</Link>
        <Link to="/upload" className="hover:bg-[#f6eadf] px-4 py-2 rounded">Upload Module</Link>
      </nav>

      <main className="max-w-[1100px] mx-auto p-6">
        <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Available Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-[#f6eadf] p-6 rounded-xl flex flex-col justify-between border border-[#ddd]">
              <div>
                <h3 className="text-[#663716] font-bold text-lg mb-2">{mod.title}</h3>
                <p className="text-sm text-[#2d241f] line-clamp-2">{mod.description}</p>
              </div>
              <Link to={`/module/${mod.id}`} className="mt-4 bg-[#7a3e00] text-white text-center px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90">
                Open Lesson
              </Link>
            </div>
          ))}
          {modules.length === 0 && <p className="text-gray-500 italic">No modules uploaded yet.</p>}
        </div>
      </main>
    </div>
  )
}