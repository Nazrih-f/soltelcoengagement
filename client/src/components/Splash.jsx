import { useState } from 'react'
import { Sparkles, ArrowRight, Settings } from 'lucide-react'

export default function Splash({ onGetStarted, onAdmin }) {
  const [showButton, setShowButton] = useState(false)

  // Show button after animation completes
  setTimeout(() => setShowButton(true), 1500)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Admin Button */}
      <button
        onClick={onAdmin}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition transform hover:scale-110 z-20"
        title="Admin Panel"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-custom"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-custom" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-custom" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎯', '🏆', '⭐', '🎉', '💡', '🚀'].map((emoji, i) => (
          <div
            key={i}
            className="absolute animate-bounce-custom text-4xl"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo/Icon */}
        <div className="animate-fadeInDown mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-24 h-24 text-white animate-bounce-custom" />
              <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="animate-slideInUp">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
            Soltelco
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-purple-100 mb-6 drop-shadow-md">
            Engagement
          </h2>
        </div>

        {/* Subtitle */}
        <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-xl md:text-2xl text-purple-100 mb-4 font-light">
            🎯 Answer 10 Questions Correctly to Win! 🎯
          </p>
          <p className="text-lg text-purple-200 mb-12">
            ⚠️ One wrong answer = Game Over!
          </p>
        </div>

        {/* Get Started Button */}
        {showButton && (
          <div className="animate-scaleIn">
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-12 rounded-full transition transform hover:scale-110 flex items-center justify-center gap-3 mx-auto shadow-2xl text-lg"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Rules */}
        <div className="mt-12 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
            <p className="text-white font-semibold mb-2">📋 Rules:</p>
            <ul className="text-purple-100 text-sm text-left list-disc list-inside space-y-1">
              <li>Answer all 10 questions correctly to win</li>
              <li>One wrong answer ends the game</li>
              <li>Questions are randomly selected</li>
              <li>Winners are recorded in Hall of Fame</li>
            </ul>
          </div>
        </div>

        {/* Decorative text */}
        <div className="mt-8 animate-pulse">
          <p className="text-purple-200 text-sm">
            ✨ Challenge yourself • Win rewards • Have fun ✨
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <p className="text-white text-xl md:text-2xl font-semibold tracking-wide">
          © {new Date().getFullYear()} • Developed with 💜 by{' '}
          <span className="font-black text-white text-2xl md:text-3xl">Nasri</span>
        </p>
      </div>
    </div>
  )
}
