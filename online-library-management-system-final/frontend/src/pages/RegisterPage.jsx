import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthAPI } from '../services/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await AuthAPI.register({ name, email, password })
      // after register, redirect to login
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full px-3 py-2 border rounded"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-3 py-2 border rounded"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded"/>
        <button className="w-full px-3 py-2 bg-gray-900 text-white rounded">Create Account</button>
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  )
}
