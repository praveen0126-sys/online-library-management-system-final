import React, { useEffect, useState } from 'react'
import BookCoverManager from '../components/BookCoverManager'
import { BooksAPI } from '../services/api'

const empty = { title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 }

export default function AdminDashboard() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [coverManagerBook, setCoverManagerBook] = useState(null)

  const load = async () => {
    const res = await BooksAPI.list()
    setBooks(res.data)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (editing) {
      await BooksAPI.update(editing, form)
    } else {
      await BooksAPI.create(form)
    }
    setForm(empty)
    setEditing(null)
    await load()
  }

  const edit = (b) => {
    setEditing(b.id)
    setForm({ title: b.title, author: b.author, isbn: b.isbn, category: b.category, totalCopies: b.totalCopies, availableCopies: b.availableCopies })
  }

  const remove = async (id) => {
    if (confirm('Delete this book?')) {
      await BooksAPI.remove(id)
      await load()
    }
  }

  const handleCoverUpdate = (newCoverUrl) => {
    // Update the book in the local state
    setBooks(books.map(book => 
      book.id === coverManagerBook.id 
        ? { ...book, coverImageUrl: newCoverUrl }
        : book
    ))
  }

  const bulkFetchCovers = async () => {
    if (!confirm('This will fetch covers for all books. Continue?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/admin/book-covers/fetch-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Bulk fetch completed: ${result.updated} covers updated, ${result.failed} failed`)
        await load() // Reload books to show updated covers
      } else {
        alert('Failed to bulk fetch covers')
      }
    } catch (error) {
      console.error('Bulk fetch error:', error)
      alert('Failed to bulk fetch covers')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🛡️</h1>
              <p className="text-gray-300 text-lg">Manage your library system and monitor activities</p>
            </div>
          </div>
        </div>
        {/* Add/Edit Book Form */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {editing ? 'Edit Book' : 'Add New Book'}
            </h3>
            <p className="text-blue-100">{editing ? 'Update book information' : 'Add a new book to your library'}</p>
          </div>
          <div className="p-6">
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                value={form.title} 
                onChange={e=>setForm(f=>({...f,title:e.target.value}))} 
                placeholder="Book Title" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <input 
                value={form.author} 
                onChange={e=>setForm(f=>({...f,author:e.target.value}))} 
                placeholder="Author Name" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <input 
                value={form.isbn} 
                onChange={e=>setForm(f=>({...f,isbn:e.target.value}))} 
                placeholder="ISBN Number" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <input 
                value={form.category} 
                onChange={e=>setForm(f=>({...f,category:e.target.value}))} 
                placeholder="Category" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <input 
                type="number" 
                min={1} 
                value={form.totalCopies} 
                onChange={e=>setForm(f=>({...f,totalCopies:Number(e.target.value)}))} 
                placeholder="Total Copies" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <input 
                type="number" 
                min={0} 
                value={form.availableCopies} 
                onChange={e=>setForm(f=>({...f,availableCopies:Number(e.target.value)}))} 
                placeholder="Available Copies" 
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <div className="md:col-span-3 flex gap-3">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {editing ? '✏️ Update Book' : '➕ Add Book'}
                </button>
                {editing && (
                  <button 
                    type="button" 
                    onClick={()=>{setEditing(null);setForm(empty)}} 
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Admin Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Books</p>
                <p className="text-3xl font-bold">{books.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Available Books</p>
                <p className="text-3xl font-bold">{books.filter(b => b.availableCopies > 0).length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Out of Stock</p>
                <p className="text-3xl font-bold">{books.filter(b => b.availableCopies === 0).length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Categories</p>
                <p className="text-3xl font-bold">{new Set(books.map(b => b.category)).size}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Book Management
                </h3>
                <p className="text-gray-300">Manage your library collection</p>
              </div>
              <button 
                onClick={bulkFetchCovers}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                🎨 Bulk Fetch Covers
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(b => (
              <div key={b.id} className="border rounded p-3">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={b.coverImageUrl} 
                      alt={b.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400/e5e7eb/6b7280?text=No+Cover'
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{b.title}</div>
                    <div className="text-sm text-gray-600 truncate">{b.author}</div>
                    <div className="text-xs mt-1 text-blue-600">{b.category}</div>
                    <div className="text-sm mt-1">
                      <span className={b.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                        {b.availableCopies}
                      </span>
                      <span className="text-gray-500"> / {b.totalCopies}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button onClick={()=>edit(b)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Edit</button>
                  <button onClick={()=>setCoverManagerBook(b)} className="px-2 py-1 text-xs bg-purple-600 text-white rounded">Cover</button>
                  <button onClick={()=>remove(b.id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cover Manager Modal */}
        {coverManagerBook && (
          <BookCoverManager
            book={coverManagerBook}
            onCoverUpdate={handleCoverUpdate}
            onClose={() => setCoverManagerBook(null)}
          />
        )}
      </div>
    </div>
  )
}
