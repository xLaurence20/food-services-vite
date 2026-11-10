import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function Stats() {
  const [stats, setStats] = useState({ modules: 0, quizzes: 0, attempts: 0 })
  const [recentAttempts, setRecentAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    
    // 1. Get total modules
    const { count: moduleCount } = await supabase.from('modules').select('*', { count: 'exact', head: true })
    
    // 2. Get total quizzes
    const { count: quizCount } = await supabase.from('quizzes').select('*', { count: 'exact', head: true })
    
    // 3. Get recent attempts with quiz titles
    const { data: attemptsData } = await supabase
      .from('attempts')
      .select('*, quizzes(title)')
      .order('created_at', { ascending: false })
      .limit(20)

    setStats({
      modules: moduleCount || 0,
      quizzes: quizCount || 0,
      attempts: attemptsData?.length || 0
    })
    
    setRecentAttempts(attemptsData || [])
    setLoading(false)
  }

  if (loading) return <div className="p-10 text-center text-xl text-[#7a3e00] font-bold">Loading Statistics...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">SYSTEM DASHBOARD</span>
        <h1 className="text-2xl text-[#7a3e00] font-bold mb-2">Overview & Statistics</h1>
        <p className="text-sm text-[#6d625c]">Monitor system usage and student quiz scores.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f6eadf] border border-[#ddd] p-6 rounded-xl">
          <h3 className="text-sm font-bold text-[#7a3e00]">Total Modules</h3>
          <p className="text-4xl font-bold text-[#2d241f] mt-2">{stats.modules}</p>
        </div>
        <div className="bg-[#f6eadf] border border-[#ddd] p-6 rounded-xl">
          <h3 className="text-sm font-bold text-[#7a3e00]">Total Quizzes</h3>
          <p className="text-4xl font-bold text-[#2d241f] mt-2">{stats.quizzes}</p>
        </div>
        <div className="bg-[#f6eadf] border border-[#ddd] p-6 rounded-xl">
          <h3 className="text-sm font-bold text-[#7a3e00]">Total Quiz Attempts</h3>
          <p className="text-4xl font-bold text-[#2d241f] mt-2">{stats.attempts}</p>
        </div>
      </div>

      {/* RECENT SCORES TABLE */}
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <h2 className="text-xl text-[#7a3e00] font-bold mb-4">Recent Quiz Scores</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f6eadf]">
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Date</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Quiz Name</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Score</th>
                <th className="border border-[#ddd] p-3 text-left text-[#7a3e00]">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {recentAttempts.length > 0 ? recentAttempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total) * 100)
                return (
                  <tr key={attempt.id} className="hover:bg-[#faf8f6]">
                    <td className="border border-[#ddd] p-3 text-gray-500">
                      {new Date(attempt.created_at).toLocaleDateString()}
                    </td>
                    <td className="border border-[#ddd] p-3 font-medium">
                      {attempt.quizzes?.title || 'Unknown Quiz'}
                    </td>
                    <td className="border border-[#ddd] p-3 font-bold text-[#39733d]">
                      {attempt.score} / {attempt.total}
                    </td>
                    <td className="border border-[#ddd] p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${percentage >= 75 ? 'bg-green-100 text-green-800' : percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500 italic">
                    No quiz attempts recorded yet.
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