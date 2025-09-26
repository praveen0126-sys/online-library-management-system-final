import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BorrowHistoryTable from '../components/BorrowHistoryTable'
import ReservationTable from '../components/ReservationTable'
import Notifications from '../components/Notifications'
import { BorrowAPI, ReservationsAPI } from '../services/api'

export default function UserDashboard() {
  const [history, setHistory] = useState([])
  const [reservations, setReservations] = useState([])
  const [user, setUser] = useState(null)

  const load = async () => {
    try {
      const [h, r] = await Promise.all([BorrowAPI.history(), ReservationsAPI.list()])
      console.log('Borrow history data:', h.data)
      console.log('Reservations data:', r.data)
      setHistory(h.data)
      setReservations(r.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log('Authentication failed, redirecting to login...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
  }

  useEffect(() => {
    load()
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Listen for borrowing updates
    const handleBorrowingUpdate = () => {
      console.log('Dashboard received borrowingUpdated event, reloading data...')
      load()
    }
    
    const handleStorageUpdate = (event) => {
      if (event.detail?.type === 'borrowingUpdate') {
        console.log('Dashboard received storage event, reloading data...')
        load()
      }
    }
    
    // Set up periodic refresh as fallback (every 30 seconds)
    const intervalId = setInterval(() => {
      console.log('Periodic dashboard refresh...')
      load()
    }, 30000)
    
    window.addEventListener('borrowingUpdated', handleBorrowingUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    
    // Cleanup listeners and interval on unmount
    return () => {
      window.removeEventListener('borrowingUpdated', handleBorrowingUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
      clearInterval(intervalId)
    }
  }, [])

  const cancel = async (res) => {
    await ReservationsAPI.cancel(res.book.id)
    await load()
  }

  // Calculate statistics
  const currentlyBorrowed = history.filter(item => item.status === 'BORROWED')
  const overdueBooks = history.filter(item => item.overdue && item.status === 'BORROWED')
  const totalFines = history.reduce((sum, item) => sum + (item.fineAmount || 0), 0)
  const unpaidFines = history.filter(item => item.fineAmount > 0 && !item.finePaid).reduce((sum, item) => sum + item.fineAmount, 0)

  // Debug logging
  console.log('History array:', history)
  console.log('Currently borrowed count:', currentlyBorrowed.length)
  console.log('Currently borrowed items:', currentlyBorrowed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-purple-100 text-lg">Here's your library activity overview</p>
              </div>
              <button
                onClick={() => {
                  console.log('Manual refresh triggered')
                  load()
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Currently Borrowed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Currently Borrowed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{currentlyBorrowed.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Books in your possession</p>
          </div>

          {/* Overdue Books */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Overdue Books</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{overdueBooks.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Return immediately to avoid fines</p>
          </div>

          {/* Active Reservations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Reservations</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{reservations.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Books waiting for you</p>
          </div>

          {/* Outstanding Fines */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Outstanding Fines</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">₹{unpaidFines}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Pay to avoid restrictions</p>
          </div>
        </div>

        {/* My Books Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Currently Borrowed Books */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                My Borrowed Books
              </h3>
              <p className="text-blue-100">Books you currently have</p>
            </div>
            <div className="p-6">
              {currentlyBorrowed.length > 0 ? (
                <div className="space-y-4">
                  {currentlyBorrowed.map((item) => (
                    <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.book.title}</h4>
                        <p className="text-sm text-gray-600">{item.book.author}</p>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.overdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                          {item.fineAmount > 0 && (
                            <span className="ml-2 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                              Fine: ₹{item.fineAmount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 mt-2">No books currently borrowed</p>
                  <Link to="/books" className="text-blue-600 hover:text-blue-700 font-medium">Browse books to borrow</Link>
                </div>
              )}
            </div>
          </div>

          {/* Active Reservations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                My Reservations
              </h3>
              <p className="text-purple-100">Books waiting for you</p>
            </div>
            <div className="p-6">
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((item) => (
                    <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.book.title}</h4>
                        <p className="text-sm text-gray-600">{item.book.author}</p>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          Reserved: {new Date(item.reservationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => cancel(item)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-gray-500 mt-2">No active reservations</p>
                  <Link to="/books" className="text-purple-600 hover:text-purple-700 font-medium">Reserve popular books</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/books"
              className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div>
                <h4 className="font-semibold">Browse Books</h4>
                <p className="text-sm text-blue-100">Discover new reads</p>
              </div>
            </Link>

            <button className="flex items-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div>
                <h4 className="font-semibold">Pay Fines</h4>
                <p className="text-sm text-green-100">Clear outstanding dues</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold">Return Books</h4>
                <p className="text-sm text-orange-100">Return borrowed items</p>
              </div>
            </button>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="space-y-8">
          <Notifications history={history} />
          
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Complete Borrow History</h3>
            </div>
            <div className="p-6">
              <BorrowHistoryTable items={history} onReturn={load} />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>
            </div>
            <div className="p-6">
              <ReservationTable items={reservations} onCancel={cancel} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
