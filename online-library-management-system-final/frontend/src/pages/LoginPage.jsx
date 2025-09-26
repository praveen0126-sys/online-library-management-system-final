import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthAPI } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState('user')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await AuthAPI.login(email, password)
      const { token, id, name, role, email: em } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ id, name, email: em, role }))
      
      if (role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (type) => {
    if (type === 'admin') {
      setEmail('admin@library.com')
      setPassword('password123')
      setLoginType('admin')
    } else {
      setEmail('user@library.com')
      setPassword('password123')
      setLoginType('user')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h2>
          <p className="text-purple-200 text-lg">Choose your login type to continue</p>
        </div>

        {/* Login Type Selector */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => quickLogin('user')}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              loginType === 'user'
                ? 'border-purple-400 bg-purple-500/20 shadow-2xl'
                : 'border-purple-300/30 bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">User Login</h3>
              <p className="text-purple-200 text-sm mt-1">Browse & Borrow Books</p>
            </div>
          </button>

          <button
            onClick={() => quickLogin('admin')}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              loginType === 'admin'
                ? 'border-yellow-400 bg-yellow-500/20 shadow-2xl'
                : 'border-yellow-300/30 bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Admin Login</h3>
              <p className="text-yellow-200 text-sm mt-1">Manage Library System</p>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-200 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-2xl placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Email address"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-2xl placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${loginType === 'admin' ? 'Admin' : 'User'}`
              )}
            </button>

            <div className="text-center">
              <Link 
                to="/register" 
                className="text-purple-200 hover:text-white transition-colors duration-300 font-medium"
              >
                Don't have an account? <span className="text-purple-300 underline">Sign up here</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Quick Access Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 text-center">Quick Access Demo</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-purple-200">👤 User Demo</p>
              <p className="text-white/70">user@library.com</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-200">🛡️ Admin Demo</p>
              <p className="text-white/70">admin@library.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
