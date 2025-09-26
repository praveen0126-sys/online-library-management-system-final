import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BooksAPI } from '../services/api'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import { BorrowAPI, ReservationsAPI } from '../services/api'

export default function BookListPage() {
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await BooksAPI.list()
    setBooks(res.data)
  }

  const onSearch = async ({ q, category }) => {
    if (q) {
      const res = await BooksAPI.search(q)
      let list = res.data
      if (category) list = list.filter(b => b.category.toLowerCase() === category.toLowerCase())
      setBooks(list)
    } else if (category) {
      const res = await BooksAPI.list()
      setBooks(res.data.filter(b => b.category.toLowerCase() === category.toLowerCase()))
    } else {
      load()
    }
  }

  const fetchCategories = async () => {
    const res = await BooksAPI.categories()
    return res.data
  }

  const checkAuthentication = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    console.log('Authentication check in BookListPage:', { token: !!token, user: !!user })
    return token && user
  }

  const onBorrow = async (book) => {
    console.log('onBorrow called for book:', book.title)
    if (!checkAuthentication()) {
      console.log('User not authenticated, showing login prompt')
      if (window.confirm('You need to login to borrow books. Would you like to login now?')) {
        navigate('/login')
      }
      return
    }

    try {
      console.log('Attempting to borrow book:', book.id, book.title)
      const response = await BorrowAPI.borrow(book.id)
      console.log('Borrow response:', response)
      await load()
      alert(`Book "${book.title}" borrowed successfully! You have 14 days to return it. Book price: ₹${book.price || 'N/A'}`)
      
      // Trigger a custom event to notify dashboard to refresh
      console.log('Dispatching borrowingUpdated event')
      window.dispatchEvent(new CustomEvent('borrowingUpdated'))
      
      // Also trigger a storage event as backup
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { type: 'borrowingUpdate' } 
      }))
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else if (error.response?.status === 400) {
        alert('This book is not available for borrowing or you have already borrowed it.')
      } else {
        alert('Failed to borrow book. Please try again.')
      }
      console.error('Borrow error:', error)
    }
  }

  const onReserve = async (book) => {
    if (!checkAuthentication()) {
      if (window.confirm('You need to login to reserve books. Would you like to login now?')) {
        navigate('/login')
      }
      return
    }

    try {
      await ReservationsAPI.reserve(book.id)
      alert('Book reserved successfully! You will be notified when it becomes available.')
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else if (error.response?.status === 400) {
        alert('This book is already reserved by you or not available for reservation.')
      } else {
        alert('Failed to reserve book. Please try again.')
      }
      console.error('Reserve error:', error)
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

      <div className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Amazing Books 📚
          </h1>
          <p className="text-purple-200 text-xl">
            Explore our collection of {books.length} carefully curated books
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={onSearch} fetchCategories={fetchCategories} />
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.length > 0 ? (
            books.map(b => (
              <div key={b.id} className="transform hover:scale-105 transition-all duration-300">
                <BookCard book={b} onBorrow={onBorrow} onReserve={onReserve} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto">
                <svg className="mx-auto h-16 w-16 text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-2">No Books Found</h3>
                <p className="text-purple-200">Try adjusting your search criteria or browse all categories</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
