import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Upload Module', path: '/upload' },
    { name: 'Create Quiz', path: '/create-quiz' }, 
    { name: 'Statistics', path: '/stats' },
  ]

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#2d241f] font-sans flex flex-col">
      <header className="bg-gradient-to-br from-[#6d3500] to-[#b96b2d] text-white py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Digital Learning Module</h1>
        <p className="font-bold">Food Services • Grade 9</p>
        <p className="text-sm opacity-90 mt-1">Revised K–10 Curriculum | Thesis Prototype</p>
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
    </div>
  )
}