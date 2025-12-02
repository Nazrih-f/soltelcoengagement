import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, Users } from 'lucide-react'

export default function History({ onBack }) {
  const [attempts, setAttempts] = useState([])
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('winners')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [attemptsRes, winnersRes] = await Promise.all([
        fetch('/api/attempts'),
        fetch('/api/winners')
      ])
      const attemptsData = await attemptsRes.json()
      const winnersData = await winnersRes.json()
      setAttempts(attemptsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      setWinners(winnersData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full animate-slideInUp">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-slideInLeft">
          <button
            onClick={onBack}
            className="p-2 hover:bg-purple-100 rounded-lg transition transform hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6 text-purple-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Hall of Fame</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('winners')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'winners'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Winners 🏆
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'attempts'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <Users className="w-5 h-5" />
            All Attempts
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-bounce-custom text-purple-600 text-xl font-bold">Loading...</div>
          </div>
        ) : activeTab === 'winners' ? (
          /* Winners Tab */
          winners.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No winners yet!</p>
              <p className="text-gray-500">Be the first to answer all 10 questions correctly!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition transform hover:scale-105 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-400' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-purple-200 text-purple-700'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-lg">{winner.playerName}</p>
                    <p className="text-gray-500 text-sm">{formatDate(winner.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-xl">{winner.score}/10</p>
                    <p className="text-green-500 text-sm">Perfect! ✨</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* All Attempts Tab */
          attempts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No attempts yet!</p>
              <p className="text-gray-500">Start your first quiz!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-300 bg-purple-50">
                    <th className="text-left py-3 px-4 font-bold text-purple-700">Player</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-700">Score</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-700">Result</th>
                    <th className="text-left py-3 px-4 font-bold text-purple-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr
                      key={attempt.id}
                      className={`border-b border-gray-200 hover:bg-purple-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-800 font-semibold">
                        {attempt.playerName}
                        {attempt.isWinner && <span className="ml-2">🏆</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="py-3 px-4">
                        {attempt.isWinner ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                            Winner! 🎉
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                            Game Over
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(attempt.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 text-center border-l-4 border-yellow-500">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-600">{winners.length}</p>
            <p className="text-gray-600 text-sm">Winners</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border-l-4 border-blue-500">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{attempts.length}</p>
            <p className="text-gray-600 text-sm">Total Attempts</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border-l-4 border-green-500">
            <p className="text-2xl font-bold text-green-600">
              {attempts.length > 0 ? Math.round((winners.length / attempts.length) * 100) : 0}%
            </p>
            <p className="text-gray-600 text-sm">Win Rate</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
