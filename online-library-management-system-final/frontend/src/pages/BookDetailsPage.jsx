import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BooksAPI, BorrowAPI, ReservationsAPI } from '../services/api'

export default function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  const load = async () => {
    const res = await BooksAPI.get(id)
    setBook(res.data)
  }

  useEffect(() => { load() }, [id])

  if (!book) return <div>Loading...</div>

  const onBorrow = async () => {
    await BorrowAPI.borrow(book.id)
    await load()
    alert('Borrowed successfully!')
  }

  const onReserve = async () => {
    await ReservationsAPI.reserve(book.id)
    alert('Reserved successfully!')
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-semibold">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="mt-2">Category: {book.category}</p>
      <p>ISBN: {book.isbn}</p>
      <p className="mt-2">Available: {book.availableCopies} / {book.totalCopies}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={onBorrow} className="px-3 py-1 bg-gray-900 text-white rounded disabled:opacity-50" disabled={book.availableCopies<=0}>Borrow</button>
        <button onClick={onReserve} className="px-3 py-1 bg-blue-600 text-white rounded">Reserve</button>
      </div>
    </div>
  )
}
