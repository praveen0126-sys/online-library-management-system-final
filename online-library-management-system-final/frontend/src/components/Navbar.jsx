import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onLogout }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-white hover:text-purple-200 transition-colors duration-300">
          <div className="h-10 w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            Online Library
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/books" 
            className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            📚 Books
          </Link>
          
          {user?.role === 'ADMIN' && (
            <>
              <Link 
                to="/admin" 
                className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 rounded-xl hover:bg-orange-100/50 transition-all duration-300 transform hover:scale-105"
              >
                🛡️ Admin
              </Link>
              <Link 
                to="/admin/reports" 
                className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 rounded-xl hover:bg-orange-100/50 transition-all duration-300 transform hover:scale-105"
              >
                📊 Reports
              </Link>
            </>
          )}
          
          {token ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/user" 
                className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 rounded-xl hover:bg-purple-100/50 transition-all duration-300 transform hover:scale-105"
              >
                👤 Dashboard
              </Link>
              
              <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-800 font-medium">{user?.name}</span>
                {user?.role === 'ADMIN' && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              
              <button 
                onClick={onLogout} 
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🔑 Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
              >
                ✨ Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
