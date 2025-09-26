import React, { useState } from 'react'

export default function BookCoverManager({ book, onCoverUpdate, onClose }) {
  const [loading, setLoading] = useState(false)
  const [coverUrl, setCoverUrl] = useState(book.coverImageUrl || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const uploadCover = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/admin/book-covers/upload/${book.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        onCoverUpdate(result.coverUrl)
        alert('Cover uploaded successfully!')
      } else {
        alert('Failed to upload cover')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload cover')
    } finally {
      setLoading(false)
    }
  }

  const fetchCover = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/admin/book-covers/fetch/${book.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        onCoverUpdate(result.coverUrl)
        alert(result.message)
      } else {
        alert('Failed to fetch cover')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to fetch cover')
    } finally {
      setLoading(false)
    }
  }

  const updateCoverUrl = async () => {
    if (!coverUrl.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/admin/book-covers/url/${book.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coverUrl })
      })

      if (response.ok) {
        const result = await response.json()
        onCoverUpdate(result.coverUrl)
        alert('Cover URL updated successfully!')
      } else {
        alert('Failed to update cover URL')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update cover URL')
    } finally {
      setLoading(false)
    }
  }

  const removeCover = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/admin/book-covers/${book.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        onCoverUpdate(result.coverUrl)
        alert(result.message)
      } else {
        alert('Failed to remove cover')
      }
    } catch (error) {
      console.error('Remove error:', error)
      alert('Failed to remove cover')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Book Cover</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">{book.title}</h3>
          <p className="text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
        </div>

        {/* Current Cover */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Current Cover</h4>
          <div className="w-32 h-40 bg-gray-200 rounded overflow-hidden">
            <img 
              src={book.coverImageUrl} 
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400/e5e7eb/6b7280?text=No+Cover'
              }}
            />
          </div>
        </div>

        {/* Upload New Cover */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Upload New Cover</h4>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {previewUrl && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="w-32 h-40 bg-gray-200 rounded overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            
            <button
              onClick={uploadCover}
              disabled={!selectedFile || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Cover'}
            </button>
          </div>
        </div>

        {/* Auto-Fetch Cover */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Auto-Fetch Cover</h4>
          <p className="text-sm text-gray-600 mb-3">
            Automatically fetch cover from Open Library API based on ISBN, title, and author.
          </p>
          <button
            onClick={fetchCover}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch from Open Library'}
          </button>
        </div>

        {/* Manual URL */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Manual Cover URL</h4>
          <div className="space-y-3">
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Enter cover image URL"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={updateCoverUrl}
              disabled={!coverUrl.trim() || loading}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update URL'}
            </button>
          </div>
        </div>

        {/* Remove Cover */}
        <div className="border-t pt-4">
          <button
            onClick={removeCover}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Removing...' : 'Remove Cover (Use Placeholder)'}
          </button>
        </div>
      </div>
    </div>
  )
}
