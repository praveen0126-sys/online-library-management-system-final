import React, { useState, useEffect } from 'react'

export default function SearchBar({ onSearch, fetchCategories }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    (async () => {
      if (fetchCategories) {
        const list = await fetchCategories()
        setCategories(list)
      }
    })()
  }, [fetchCategories])

  const submit = (e) => {
    e.preventDefault()
    console.log('Search submitted:', { q, category }) // Debug log
    onSearch({ q, category })
  }

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value
    setCategory(newCategory)
    // Trigger search immediately when category changes
    onSearch({ q, category: newCategory })
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search by title, author, or ISBN..." 
            className="w-full px-6 py-4 bg-white/90 border border-gray-200 rounded-2xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 shadow-lg" 
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <select 
          value={category} 
          onChange={handleCategoryChange} 
          className="px-6 py-4 bg-white/90 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 min-w-[200px] shadow-lg"
        >
          <option value="" className="text-gray-900">All Categories</option>
          {categories.map(c => <option key={c} value={c} className="text-gray-900">{c}</option>)}
        </select>
        
        <button 
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          🔍 Search
        </button>
        
        {(q || category) && (
          <button 
            type="button"
            onClick={() => {
              setQ('')
              setCategory('')
              onSearch({ q: '', category: '' })
            }}
            className="px-6 py-4 bg-white/90 text-gray-900 font-semibold rounded-2xl shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105"
          >
            ✨ Clear
          </button>
        )}
      </form>
    </div>
  )
}
