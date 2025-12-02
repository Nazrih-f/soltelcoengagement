import { Award, RotateCcw, Home } from 'lucide-react'

export default function Results({ quizData, questions, onRetake, onHome }) {
  const percentage = Math.round((quizData.score / quizData.totalQuestions) * 100)
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const gradeInfo = getGrade(percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-slideInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="animate-bounce-custom mb-4">
            <Award className="w-16 h-16 text-purple-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fadeInDown">Quiz Complete!</h1>
          <p className="text-gray-600 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>Great job, <span className="font-bold text-purple-600">{quizData.playerName}</span>!</p>
        </div>

        {/* Score Card */}
        <div className={`${gradeInfo.bg} rounded-2xl p-8 text-center mb-8 animate-scaleIn`}>
          <p className={`text-5xl font-bold ${gradeInfo.color} mb-2`}>
            {quizData.score}/{quizData.totalQuestions}
          </p>
          <p className={`text-2xl font-bold ${gradeInfo.color} mb-2`}>
            {percentage}%
          </p>
          <p className={`text-lg font-semibold ${gradeInfo.color}`}>
            Grade: <span className="text-3xl">{gradeInfo.grade}</span>
          </p>
        </div>

        {/* Performance Message */}
        <div className="bg-purple-50 rounded-lg p-6 mb-8 border-l-4 border-purple-500 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-700 text-center font-semibold text-lg">
            {percentage >= 90 && "🌟 Outstanding! You're a quiz master!"}
            {percentage >= 80 && percentage < 90 && "👏 Excellent work! You really know your stuff!"}
            {percentage >= 70 && percentage < 80 && "📚 Good job! Keep practicing to improve!"}
            {percentage >= 60 && percentage < 70 && "💪 Not bad! Review the material and try again!"}
            {percentage < 60 && "🚀 Keep learning! Every attempt makes you better!"}
          </p>
        </div>

        {/* Answer Review */}
        <div className="mb-8 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Answer Review</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {quizData.answers.map((answer, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 transition transform hover:scale-105 ${
                  answer.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">
                  Q{index + 1}: {questions[index]?.question}
                </p>
                <p className={`text-sm mt-1 ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Your answer: <span className="font-semibold">{questions[index]?.options[answer.selected]}</span>
                </p>
                {!answer.isCorrect && (
                  <p className="text-sm text-green-700 mt-1">
                    ✓ Correct answer: <span className="font-semibold">{questions[index]?.options[answer.correct]}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={onRetake}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
