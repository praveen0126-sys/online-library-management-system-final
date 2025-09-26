import React, { useEffect, useState } from 'react'

export default function Notifications({ history=[] }) {
  const [overdue, setOverdue] = useState([])

  useEffect(() => {
    const now = new Date()
    const list = history.filter(r => r.status === 'BORROWED').filter(r => {
      const due = new Date(new Date(r.borrowDate).getTime() + 14*24*60*60*1000)
      return now > due
    })
    setOverdue(list.map(r => ({ id: r.id, title: r.book?.title, dueDate: new Date(new Date(r.borrowDate).getTime() + 14*24*60*60*1000).toISOString().slice(0,10) })))
  }, [history])

  if (!overdue.length) return null

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
      <h4 className="font-semibold mb-2">Overdue reminders</h4>
      <ul className="list-disc ml-6">
        {overdue.map(o => (
          <li key={o.id}>"{o.title}" was due on {o.dueDate}. Please return as soon as possible.</li>
        ))}
      </ul>
    </div>
  )
}
