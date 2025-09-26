import React from 'react'

export default function ReservationTable({ items=[], onCancel }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Title</th>
            <th className="p-3">Reserved On</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0">
              <td className="p-3">{r.book?.title}</td>
              <td className="p-3">{r.reservationDate}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">
                {r.status === 'ACTIVE' && (
                  <button onClick={() => onCancel?.(r)} className="px-2 py-1 text-sm bg-red-600 text-white rounded">Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
