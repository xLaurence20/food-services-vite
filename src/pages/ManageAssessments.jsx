import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ManageAssessments() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    setLoading(true)
    // Fetch submissions and join the related module title
    const { data, error } = await supabase
      .from('submissions')
      .select('*, modules(title)')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setSubmissions(data || [])
    
    setLoading(false)
  }

  if (loading) return <div className="p-10 text-center font-bold text-[#7a3e00]">Loading Submissions...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">ASSESSMENTS</span>
        <h1 className="text-2xl text-[#7a3e00] font-bold mb-2">Student Performance Tasks</h1>
        <p className="text-sm text-[#6d625c]">Review the files and outputs submitted by your students.</p>
      </div>

      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f6eadf]">
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Date Submitted</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Student Name</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Module</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#faf8f6]">
                  <td className="border border-[#ddd] p-3 text-gray-500">
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                  <td className="border border-[#ddd] p-3 font-bold text-[#315f8a]">
                    {sub.student_name}
                  </td>
                  <td className="border border-[#ddd] p-3 font-medium">
                    {sub.modules?.title || 'Unknown Module'}
                  </td>
                  <td className="border border-[#ddd] p-3">
                    <a 
                      href={sub.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-[#7a3e00] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:opacity-90"
                    >
                      View / Download File
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 italic">
                    No student assessments uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}