import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Assessment() {
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState('')
  const [studentName, setStudentName] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.from('modules').select('id, title').then(({ data }) => {
      setModules(data || [])
      if (data && data.length > 0) setSelectedModule(data[0].id)
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      let fileUrl = ''
      if (file) {
        const path = `submissions/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('modules').upload(path, file)
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage.from('modules').getPublicUrl(path)
        fileUrl = publicUrl
      }

      const { error: dbErr } = await supabase.from('submissions').insert({
        module_id: selectedModule,
        student_name: studentName,
        file_url: fileUrl
      })
      if (dbErr) throw dbErr

      setSuccess(true)
      setStudentName('')
      setFile(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
      <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">ASSESSMENT</span>
      <h2 className="text-2xl text-[#7a3e00] font-bold mb-2">Submit Your Performance Task</h2>
      <p className="text-sm mb-6 text-gray-600">Upload your outputs (e.g., video demonstration, document) for your teacher to grade.</p>

      {success && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 font-bold">File uploaded successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Your Name</label>
          <input required value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-3 border rounded-lg" placeholder="Enter full name" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Select Module</label>
          <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Upload Performance File (Image, Video, Document)</label>
          <input type="file" required onChange={e => setFile(e.target.files[0])} className="w-full p-2 border rounded-lg bg-white" />
        </div>
        <button disabled={loading} className="w-full bg-[#7a3e00] text-white p-3 rounded-lg font-bold">
          {loading ? 'Uploading...' : 'Submit Assessment'}
        </button>
      </form>
    </div>
  )
}