import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const AuthAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (payload) => api.post('/auth/register', payload),
}

export const BooksAPI = {
  list: () => api.get('/books'),
  get: (id) => api.get(`/books/${id}`),
  search: (q) => api.get(`/books/search`, { params: { q } }),
  categories: () => api.get('/books/categories'),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  remove: (id) => api.delete(`/books/${id}`),
}

export const BorrowAPI = {
  borrow: (bookId) => api.post(`/borrow/borrow/${bookId}`),
  returnBook: (bookId) => api.post(`/borrow/return/${bookId}`),
  history: () => api.get('/borrow/history'),
}

export const ReservationsAPI = {
  reserve: (bookId) => api.post(`/reservations/reserve/${bookId}`),
  cancel: (bookId) => api.post(`/reservations/cancel/${bookId}`),
  list: () => api.get('/reservations'),
}

export const AdminAPI = {
  reports: () => api.get('/admin/reports'),
}

export default api
