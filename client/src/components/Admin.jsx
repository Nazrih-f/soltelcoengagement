import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Upload, Trash2, FileText, Users, Trophy, HelpCircle, RefreshCw, ClipboardPaste } from 'lucide-react'
import API_BASE_URL from '../config'

export default function Admin({ onBack }) {
  const [files, setFiles] = useState([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [stats, setStats] = useState({ totalAttempts: 0, totalWinners: 0, totalQuestions: 0, totalFiles: 0 })
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [pasteText, setPasteText] = useState('')
  const [showPasteInput, setShowPasteInput] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchFiles()
    fetchStats()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/files`)
      const data = await response.json()
      setFiles(data.files || [])
      setTotalQuestions(data.totalQuestions || 0)
    } catch (error) {
      console.error('Failed to fetch files:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setMessage({ type: 'error', text: 'Please upload a Word document (.docx or .doc)' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: `Successfully added ${data.questionsAdded} questions from "${file.name}"` })
        fetchFiles()
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload file' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload file' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/files/${fileId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'File deleted successfully' })
        fetchFiles()
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete file' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete file' })
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL questions? This cannot be undone!')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/questions`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'All questions cleared successfully' })
        fetchFiles()
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to clear questions' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear questions' })
    }
  }

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) {
      setMessage({ type: 'error', text: 'Please paste some questions' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasteText })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: `Successfully added ${data.questionsAdded} questions!` })
        setPasteText('')
        setShowPasteInput(false)
        fetchFiles()
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to parse questions' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add questions' })
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slideInUp">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-purple-100 rounded-lg transition transform hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6 text-purple-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600">Manage quiz questions and view statistics</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-purple-500">
            <HelpCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalQuestions}</p>
            <p className="text-gray-600 text-sm">Total Questions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-blue-500">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalFiles}</p>
            <p className="text-gray-600 text-sm">Files Uploaded</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-500">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalAttempts}</p>
            <p className="text-gray-600 text-sm">Total Attempts</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-yellow-500">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalWinners}</p>
            <p className="text-gray-600 text-sm">Winners</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 animate-scaleIn ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-purple-600" />
            Upload Questions
          </h2>
          
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition">
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {uploading ? 'Uploading...' : 'Click to upload a Word document (.docx)'}
              </p>
              <p className="text-gray-400 text-sm">
                Format: Questions numbered (1. 2. 3.) with options (A. B. C. D.)
              </p>
              <p className="text-gray-400 text-sm">
                Mark correct answer with * (e.g., "B. Paris *")
              </p>
            </label>
          </div>

          {uploading && (
            <div className="flex items-center justify-center mt-4">
              <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
              <span className="ml-2 text-purple-600">Processing file...</span>
            </div>
          )}
        </div>

        {/* Paste Questions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slideInUp" style={{ animationDelay: '0.25s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardPaste className="w-6 h-6 text-purple-600" />
              Paste Questions
            </h2>
            <button
              onClick={() => setShowPasteInput(!showPasteInput)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg transition"
            >
              {showPasteInput ? 'Hide' : 'Show Input'}
            </button>
          </div>
          
          {showPasteInput && (
            <div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Paste your questions here in this format:

1. What is the capital of France?
A) London
B) Paris → (J)
C) Berlin
D) Madrid

2. Which planet is Red?
A) Venus
B) Mars → (J)
C) Jupiter
D) Saturn

Note: Mark correct answer with → (J) or (J)`}
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-sm"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handlePasteSubmit}
                  disabled={uploading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ClipboardPaste className="w-5 h-5" />
                      Add Questions
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPasteText('')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Uploaded Files
            </h2>
            {files.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No files uploaded yet</p>
              <p className="text-sm">Upload a Word document to add questions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {file.questionCount} questions • Uploaded {formatDate(file.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 rounded-2xl p-6 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-purple-800 mb-3">📋 How to Format Your Word Document:</h3>
          <div className="text-purple-700 text-sm space-y-2">
            <p><strong>Example format:</strong></p>
            <div className="bg-white rounded-lg p-4 font-mono text-xs">
              <p>1. What is the capital of France?</p>
              <p>A. London</p>
              <p>B. Paris *</p>
              <p>C. Berlin</p>
              <p>D. Madrid</p>
              <p className="mt-2">2. Which planet is known as the Red Planet?</p>
              <p>A. Venus</p>
              <p>B. Mars *</p>
              <p>C. Jupiter</p>
              <p>D. Saturn</p>
            </div>
            <p className="mt-2">💡 <strong>Tip:</strong> Mark the correct answer with an asterisk (*) after the option text.</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
