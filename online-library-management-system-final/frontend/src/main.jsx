import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookListPage from './pages/BookListPage'
import BookDetailsPage from './pages/BookDetailsPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminReportsPage from './pages/AdminReportsPage'
import ProtectedRoute from './routes/ProtectedRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="books" element={<BookListPage />} />
          <Route path="books/:id" element={<BookDetailsPage />} />
          <Route path="user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="dashboard" element={<Navigate to="/user" />} />
          <Route path="admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReportsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
