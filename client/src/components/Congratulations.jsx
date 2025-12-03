import { Trophy, Star, PartyPopper, Home, RotateCcw } from 'lucide-react'

export default function Congratulations({ playerName, score, onPlayAgain, onHome }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center px-4 overflow-hidden animate-gradient relative">
      {/* Confetti Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce-custom"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          >
            <span className="text-2xl">
              {['🎉', '🎊', '⭐', '✨', '🏆', '💫', '🌟'][Math.floor(Math.random() * 7)]}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-scaleIn">
        {/* Trophy Icon */}
        <div className="mb-6">
          <div className="relative inline-block">
            <Trophy className="w-24 h-24 text-yellow-500 animate-bounce-custom mx-auto" />
            <div className="absolute -top-2 -right-2">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -top-2 -left-2">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        {/* Congratulations Text */}
        <div className="animate-fadeInDown">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            CONGRATULATIONS!
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">{playerName}</span>
            <PartyPopper className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        {/* Winner Badge */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 rounded-2xl p-6 mb-6 animate-slideInUp shadow-2xl border-4 border-yellow-300">
          <p className="text-white text-lg font-semibold mb-2">You are a</p>
          <p className="text-white text-4xl font-black">WINNER! 🏆</p>
        </div>

        {/* Score */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 animate-slideInUp shadow-lg border-2 border-purple-200" style={{ animationDelay: '0.1s' }}>
          <p className="text-purple-600 font-semibold">Perfect Score</p>
          <p className="text-5xl font-black text-purple-600">{score}/10</p>
          <p className="text-purple-500 text-sm mt-2">All questions answered correctly!</p>
        </div>

        {/* Achievement Message */}
        <div className="mb-8 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-600 text-lg">
            🌟 You've proven yourself as a true champion! 🌟
          </p>
          <p className="text-gray-500 mt-2">
            Your name has been recorded in the Hall of Fame!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 text-sm">
            Developed with <span className="text-red-500 animate-pulse">💜</span> by{' '}
            <span className="font-bold text-yellow-600">Nasri</span>
          </p>
        </div>
      </div>
    </div>
  )
}
