import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { AdminAPI } from '../services/api'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts'

const COLORS = ['#22c55e', '#ef4444', '#3b82f6']

export default function AdminReportsPage() {
  const [data, setData] = useState(null)

  const load = async () => {
    const res = await AdminAPI.reports()
    setData(res.data)
  }

  useEffect(()=>{ load() }, [])

  if (!data) return <div>Loading...</div>

  const pieData = [
    { name: 'Available', value: data.totalAvailable },
    { name: 'Borrowed', value: data.totalBorrowed },
    { name: 'Overdue', value: data.totalOverdue },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Total Copies</div><div className="text-2xl font-semibold">{data.totalBooks}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Available</div><div className="text-2xl font-semibold">{data.totalAvailable}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Borrowed</div><div className="text-2xl font-semibold">{data.totalBorrowed}</div></div>
        </section>

        <section className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Inventory Status</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Most Borrowed Books</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={data.mostBorrowed} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" hide/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Borrow Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Title</th>
                  <th className="p-2">Borrowed</th>
                </tr>
              </thead>
              <tbody>
                {data.mostBorrowed.map((m,i)=> (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="p-2">{m.title}</td>
                    <td className="p-2">{m.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
