import React from 'react'
import { BorrowAPI } from '../services/api'

export default function BorrowHistoryTable({ items=[], onReturn }) {
  
  const handleReturn = async (borrowRecord) => {
    try {
      await BorrowAPI.returnBook(borrowRecord.book.id)
      alert(`Book "${borrowRecord.book?.title}" returned successfully!`)
      if (onReturn) onReturn()
      // Trigger dashboard update
      window.dispatchEvent(new CustomEvent('borrowingUpdated'))
    } catch (error) {
      alert('Failed to return book. Please try again.')
      console.error('Return error:', error)
    }
  }

  return (
    <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
      <table className="min-w-full">
        <thead>
          <tr className="text-left border-b border-white/20">
            <th className="p-4 text-white font-semibold">Title</th>
            <th className="p-4 text-white font-semibold">Price</th>
            <th className="p-4 text-white font-semibold">Borrowed</th>
            <th className="p-4 text-white font-semibold">Due</th>
            <th className="p-4 text-white font-semibold">Returned</th>
            <th className="p-4 text-white font-semibold">Status</th>
            <th className="p-4 text-white font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
              <td className="p-4 text-white font-medium">{r.book?.title}</td>
              <td className="p-4 text-green-300 font-semibold">₹{r.book?.price || 'N/A'}</td>
              <td className="p-4 text-gray-300">{r.borrowDate}</td>
              <td className="p-4 text-gray-300">{r.borrowDate ? new Date(new Date(r.borrowDate).getTime() + 14*24*60*60*1000).toISOString().slice(0,10) : '-'}</td>
              <td className="p-4 text-gray-300">{r.returnDate || '-'}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  r.status==='OVERDUE' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                  r.status==='BORROWED' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                  'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {r.status}
                </span>
              </td>
              <td className="p-4">
                {r.status === 'BORROWED' && (
                  <button
                    onClick={() => handleReturn(r)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    📚 Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
