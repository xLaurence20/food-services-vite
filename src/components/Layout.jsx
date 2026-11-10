import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  
  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Load role from local storage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('app_role') || 'student'
    setRole(savedRole)
  }, [])

  const handleSwitchClick = () => {
    if (role === 'teacher') {
      // Switching back to student is instant
      setRole('student')
      localStorage.setItem('app_role', 'student')
      navigate('/home')
    } else {
      // Switching to teacher requires login
      setShowLoginModal(true)
      setError('')
      setUsername('')
      setPassword('')
    }
  }

  const handleTeacherLogin = (e) => {
    e.preventDefault()
    if (username === 'teacher1' && password === 'teacher1') {
      setRole('teacher')
      localStorage.setItem('app_role', 'teacher')
      setShowLoginModal(false)
      navigate('/home')
    } else {
      setError('Invalid username or password')
    }
  }

  const studentNav = [
    { name: 'Home', path: '/home' },
    { name: 'Lessons', path: '/lessons' },
    { name: 'Activities', path: '/activities' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Assessment', path: '/assessment' },
    { name: 'Feedback', path: '/feedback' },
  ]

  const teacherNav = [
    { name: 'Home', path: '/home' },
    { name: 'Manage Lessons', path: '/lessons' },
    { name: 'Upload Module', path: '/upload' },
    { name: 'Create Quiz', path: '/create-quiz' },
    { name: 'Assessments', path: '/assessments' },
    { name: 'Statistics', path: '/stats' },
  ]

  const navItems = role === 'student' ? studentNav : teacherNav

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#2d241f] font-sans flex flex-col">
      <header className="bg-gradient-to-br from-[#6d3500] to-[#b96b2d] text-white py-10 px-4 text-center relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Digital Learning Module</h1>
        <p className="font-bold">Food Services • Grade 9</p>
        <p className="text-sm opacity-90 mt-1">Revised K–10 Curriculum | Thesis Prototype</p>
        
        {/* ROLE TOGGLE BUTTON */}
        <button 
          onClick={handleSwitchClick}
          className="absolute top-4 right-4 bg-white text-[#7a3e00] px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-100 transition-colors"
        >
          Switch to {role === 'student' ? 'Teacher' : 'Student'} Mode
        </button>
      </header>

      <nav className="sticky top-0 z-10 bg-white border-b border-[#ddd] flex flex-wrap justify-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`px-4 py-3 font-bold transition-colors ${
              location.pathname === item.path ? 'bg-[#f6eadf] text-[#7a3e00]' : 'text-[#7a3e00] hover:bg-[#f6eadf]'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <main className="flex-grow max-w-[1100px] w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="bg-[#2d241f] text-white text-center p-6 mt-10">
        <p className="font-bold text-lg">Digital Learning Module for Food Services</p>
        <p className="text-sm opacity-80 mt-1">Grade 9 • Revised K–10 Curriculum • Research Prototype</p>
        <p className="text-xs opacity-60 mt-2">Digital tools are intended as a learning support and should be teacher-guided and validated.</p>
      </footer>

      {/* TEACHER LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[15px] p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl text-[#7a3e00] font-bold mb-4 text-center">Teacher Login</h2>
            
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]"
                  placeholder="Enter teacher username"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2 border border-[#ccc] rounded-lg focus:outline-[#7a3e00]"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 p-2 rounded-lg font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#7a3e00] text-white p-2 rounded-lg font-bold hover:opacity-90"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}