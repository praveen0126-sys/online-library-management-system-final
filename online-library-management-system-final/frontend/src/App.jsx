import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6 flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        <Link to="/">Online Library</Link> · Built with React + Tailwind
      </footer>
    </div>
  )
}
