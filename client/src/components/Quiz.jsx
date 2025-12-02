import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, ChevronRight, HelpCircle, Clock } from 'lucide-react'

const funnyMessages = {
  correct: [
    '🎉 Aad baad u fiicantahay!',
    '⭐ Waad mahadsantahay!',
    '🚀 Cajiib!',
    '💯 Jawaab sax ah!',
    '🏆 Guuleyste!',
    '✨ Waxaad tahay xariif!',
    '🎯 Sax!',
    '👑 Aad baad u fiicantahay!'
  ],
  wrong: [
    '😅 Waa khalad!',
    '🤔 Jawaab khalad ah!',
    '💭 Isku day mar kale!',
    '😬 Waa isku day fiican!',
    '🎪 Jawaab khalad!',
    '🎭 Nasiib darro!',
    '🌪️ Ciyaarta waa dhamaatay!',
    '🎲 Game Over!'
  ]
}

export default function Quiz({ questions, playerName, onWin, onFail, playWrongAudio }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAnswer, setPendingAnswer] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(true)

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || showFeedback || isGameOver || showConfirmModal) return

    if (timeLeft <= 0) {
      // Time's up - treat as wrong answer
      setTimerActive(false)
      setIsGameOver(true)
      if (playWrongAudio) playWrongAudio()
      setTimeout(() => {
        onFail(score, currentQuestion + 1)
      }, 2500)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, timerActive, showFeedback, isGameOver, showConfirmModal])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30)
    setTimerActive(true)
  }, [currentQuestion])

  if (!questions || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">Please ask the admin to upload questions first.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const totalQuestions = Math.min(questions.length, 10)

  const handleAnswerClick = (optionIndex) => {
    if (showFeedback || isGameOver || showConfirmModal) return
    
    // Show confirmation modal
    setPendingAnswer(optionIndex)
    setShowConfirmModal(true)
  }

  const handleConfirmAnswer = () => {
    setShowConfirmModal(false)
    setSelectedAnswer(pendingAnswer)
    setTimerActive(false) // Stop timer when answer is confirmed
    
    const correct = pendingAnswer === question.correct
    setIsCorrect(correct)
    
    const messages = correct ? funnyMessages.correct : funnyMessages.wrong
    setFeedbackMessage(messages[Math.floor(Math.random() * messages.length)])
    setShowFeedback(true)

    if (correct) {
      const newScore = score + 1
      setScore(newScore)
      setShowCelebration(true)
      
      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 2000)
      
      // Check if won (10 correct answers)
      if (newScore >= totalQuestions) {
        setTimeout(() => {
          onWin(newScore)
        }, 2500)
      }
    } else {
      // Wrong answer - game over
      setIsGameOver(true)
      if (playWrongAudio) playWrongAudio() // Play wrong sound
      setTimeout(() => {
        onFail(score, currentQuestion + 1)
      }, 2500)
    }
  }

  const handleCancelAnswer = () => {
    setShowConfirmModal(false)
    setPendingAnswer(null)
  }

  const handleNext = () => {
    if (isGameOver) return
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setFeedbackMessage('')
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '🎊', '✨', '💫', '🌟', '🎯', '💯'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <HelpCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ma hubtaa?</h3>
              <p className="text-gray-600 mb-6">Ma hubtaa inaad su'aashaa dooratay?</p>
              
              {/* Selected Answer Preview */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-800 font-semibold">
                  {String.fromCharCode(65 + pendingAnswer)}) {question.options[pendingAnswer]}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCancelAnswer}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Maya (Cancel)
                </button>
                <button
                  onClick={handleConfirmAnswer}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Haa (Yes)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-slideInUp ${isGameOver ? 'animate-wrongShake' : ''} ${showCelebration ? 'animate-pulse' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="animate-slideInLeft">
            <p className="text-sm text-gray-600">Ciyaartoy: <span className="font-bold text-purple-600">{playerName}</span></p>
            <p className="text-xs text-gray-500">Su'aal {currentQuestion + 1} ka mid ah {totalQuestions}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
              timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}>
              <Clock className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-lg">{timeLeft}s</span>
            </div>
            {/* Score */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 rounded-full shadow-lg">
              <span className="font-bold text-white text-lg">{score}/{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Question Numbers */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {[...Array(totalQuestions)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < currentQuestion
                  ? 'bg-green-500 text-white scale-100'
                  : i === currentQuestion
                  ? 'bg-purple-600 text-white scale-110 animate-pulse shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 h-4 rounded-full transition-all duration-500 relative"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
          </div>
        </div>

        {/* Question Number Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-custom">
            Su'aal {currentQuestion + 1}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center animate-fadeInDown leading-relaxed">
          {question.question}
        </h2>

        {/* Options - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={showFeedback}
              className={`p-4 text-left rounded-xl border-2 transition-all duration-300 font-medium transform ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-800 animate-correctFlash scale-105'
                    : 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-800 animate-wrongShake'
                  : showFeedback && index === question.correct
                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-800 animate-correctFlash'
                  : pendingAnswer === index
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-200 hover:border-purple-400 text-gray-800 hover:bg-purple-50 hover:shadow-lg'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : showFeedback && index === question.correct
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 pt-2">{option}</span>
                {selectedAnswer === index && showFeedback && (
                  isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600 animate-bounce flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600 animate-bounce flex-shrink-0" />
                  )
                )}
                {showFeedback && index === question.correct && selectedAnswer !== index && (
                  <CheckCircle className="w-8 h-8 text-green-600 animate-bounce flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Next Button - Only show for correct answers */}
        {showFeedback && isCorrect && currentQuestion < totalQuestions - 1 && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-xl animate-scaleIn"
          >
            Su'aasha Xigta
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
