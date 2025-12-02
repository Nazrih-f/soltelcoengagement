import { useState } from 'react'
import { BookOpen, History, ArrowLeft, Trophy } from 'lucide-react'

export default function NameInput({ onStart, onViewHistory, onBack }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    onStart(name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-2 hover:bg-purple-100 rounded-lg transition transform hover:scale-110"
      >
        <ArrowLeft className="w-6 h-6 text-purple-600" />
      </button>

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-slideInUp">
        <div className="flex justify-center mb-6">
          <div className="animate-bounce-custom">
            <Trophy className="w-16 h-16 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 animate-fadeInDown">
          Soltelco Engagement
        </h1>
        <p className="text-center text-gray-600 mb-2 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
          Register to compete
        </p>
        <p className="text-center text-purple-600 font-semibold mb-6 animate-fadeInDown" style={{ animationDelay: '0.15s' }}>
          🎯 Answer 10 questions correctly to WIN! 🎯
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-lg"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1 animate-shake">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg animate-slideInUp text-lg"
            style={{ animationDelay: '0.3s' }}
          >
            🚀 Start Competition
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 animate-slideInUp" style={{ animationDelay: '0.35s' }}>
          <p className="text-yellow-800 text-sm font-semibold">⚠️ Warning:</p>
          <p className="text-yellow-700 text-sm">One wrong answer = Game Over!</p>
        </div>

        <button
          onClick={onViewHistory}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 animate-slideInUp"
          style={{ animationDelay: '0.4s' }}
        >
          <History className="w-5 h-5" />
          View Winners & History
        </button>
      </div>
    </div>
  )
}
