import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book, onBorrow, onReserve }) {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    console.log('Authentication check:', { token: !!token, user: !!user })
    return token && user
  }

  const handleBorrow = () => {
    console.log('Borrow button clicked for book:', book.title)
    onBorrow?.(book)
  }

  const handleReserve = () => {
    console.log('Reserve button clicked for book:', book.title)
    onReserve?.(book)
  }
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Book Cover Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {book.coverImageUrl ? (
          <img 
            src={book.coverImageUrl} 
            alt={book.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to themed placeholder based on category
              const category = book.category?.toLowerCase() || ''
              if (category.includes('children')) {
                e.target.src = 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('science')) {
                e.target.src = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('history')) {
                e.target.src = 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('poetry')) {
                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('philosophy')) {
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('fiction')) {
                e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80'
              } else if (category.includes('biography')) {
                e.target.src = 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop&auto=format&q=80'
              } else {
                e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format&q=80'
              }
            }}
          />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm">No Cover</div>
          </div>
        )}
      </div>
      
      {/* Book Details */}
      <div className="p-4 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <p className="text-xs mb-3 inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{book.category}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Available:</span>
              <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.availableCopies} / {book.totalCopies}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-bold text-green-600">₹{book.price || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link 
            to={`/books/${book.id}`} 
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-center text-sm transition-colors"
          >
            Details
          </Link>
          <button 
            onClick={handleBorrow} 
            className="flex-1 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
            disabled={book.availableCopies <= 0}
            title={!isAuthenticated() ? 'Login required to borrow books' : book.availableCopies > 0 ? 'Borrow this book' : 'Book not available'}
          >
            {book.availableCopies > 0 ? (isAuthenticated() ? 'Borrow' : 'Login to Borrow') : 'Unavailable'}
          </button>
          <button 
            onClick={handleReserve} 
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            title={!isAuthenticated() ? 'Login required to reserve books' : 'Reserve this book for later'}
          >
            {isAuthenticated() ? 'Reserve' : 'Login to Reserve'}
          </button>
        </div>
      </div>
    </div>
  )
}
