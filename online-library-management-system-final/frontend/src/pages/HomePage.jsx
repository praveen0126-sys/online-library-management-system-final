import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import { BooksAPI } from '../services/api'
import BookCard from '../components/BookCard'
import { BorrowAPI, ReservationsAPI } from '../services/api'

export default function HomePage() {
  const [books, setBooks] = useState([])

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

  const onBorrow = async (book) => {
    await BorrowAPI.borrow(book.id)
    await load()
    alert('Borrowed successfully!')
  }

  const onReserve = async (book) => {
    await ReservationsAPI.reserve(book.id)
    alert('Reserved successfully!')
  }

  return (
    <div className="space-y-6">
      <SearchBar onSearch={onSearch} fetchCategories={fetchCategories} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(b => (
          <BookCard key={b.id} book={b} onBorrow={onBorrow} onReserve={onReserve} />
        ))}
      </div>
    </div>
  )
}
