import { useEffect } from 'react'
import { RefreshCw, Home, VolumeX } from 'lucide-react'

export default function GameOver({ playerName, score, onTryAgain, onHome, stopAudio, isAudioPlaying }) {

  // Auto-stop sound after 40 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stopAudio) stopAudio()
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [stopAudio])

  const handleTryAgain = () => {
    if (stopAudio) stopAudio()
    onTryAgain()
  }

  const handleHome = () => {
    if (stopAudio) stopAudio()
    onHome()
  }

  // Multiple fun emojis for background
  const emojis = ['😆', '🤣', '😹', '🙈', '😜', '😂']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex flex-col items-center justify-between px-4 py-8 overflow-hidden relative animate-gradient">
      
      {/* Animated Background with Big Fun Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              opacity: 0.7
            }}
          >
            <span className="text-5xl md:text-6xl">{emojis[Math.floor(Math.random() * emojis.length)]}</span>
          </div>
        ))}
      </div>

      {/* Top Spacer */}
      <div></div>

      {/* Center Content - NO CARD */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* BIG Pointing Finger Image */}
        <div className={`${isAudioPlaying ? 'animate-bounce' : 'animate-float'}`}>
          <img 
            src="/finger.png" 
            alt="Pointing Finger" 
            className="w-[180px] h-[180px] md:w-[280px] md:h-[280px] object-contain drop-shadow-2xl"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = '<div class="text-[180px] md:text-[280px]">👉</div>'
            }}
          />
        </div>
        
        {/* Game Over Text */}
        <h1 className="text-3xl md:text-5xl font-black text-purple-600 mt-4 animate-pulse">
          CIYAARTU WAA DHAMAATAY!
        </h1>
        
        {/* Player Info */}
        <p className="text-xl md:text-2xl text-gray-700 mt-2">
          <span className="font-bold text-orange-500">{playerName}</span>
        </p>

        {/* Score Card with Gradient */}
        <div className="mt-6 bg-gradient-to-br from-white to-purple-50 backdrop-blur-sm rounded-3xl px-10 py-6 shadow-2xl border-4 border-purple-200 animate-scaleIn">
          <p className="text-purple-600 text-base font-bold uppercase tracking-wide">DHIBCAHAAGU</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{score}</span>
            <span className="text-2xl text-gray-400 font-bold">/10</span>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="relative z-10 w-full max-w-md space-y-3">
        <button
          onClick={handleTryAgain}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 shadow-xl text-lg"
        >
          <RefreshCw className="w-6 h-6" />
          Isku Day Mar Kale
        </button>
        
        <button
          onClick={handleHome}
          className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 shadow-lg text-lg border border-gray-200"
        >
          <Home className="w-6 h-6" />
          Guriga
        </button>

        {/* Stop Audio Button */}
        {isAudioPlaying && (
          <button
            onClick={stopAudio}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 animate-pulse"
          >
            <VolumeX className="w-5 h-5" />
            Jooji Codka
          </button>
        )}
      </div>
    </div>
  )
}
