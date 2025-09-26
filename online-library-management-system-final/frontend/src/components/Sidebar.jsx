import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()
  const linkClass = (path) => `block px-4 py-2 rounded ${pathname===path?'bg-gray-900 text-white':'hover:bg-gray-100'}`
  return (
    <aside className="w-64 shrink-0 border-r bg-white h-full p-4">
      <nav className="space-y-2">
        <Link className={linkClass('/user')} to="/user">My Dashboard</Link>
        <Link className={linkClass('/books')} to="/books">Browse Books</Link>
        <Link className={linkClass('/admin')} to="/admin">Admin</Link>
        <Link className={linkClass('/admin/reports')} to="/admin/reports">Reports</Link>
      </nav>
    </aside>
  )
}
