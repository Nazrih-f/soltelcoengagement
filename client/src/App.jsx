import { useState, useEffect, useRef } from 'react'
import Splash from './components/Splash'
import NameInput from './components/NameInput'
import Quiz from './components/Quiz'
import Congratulations from './components/Congratulations'
import GameOver from './components/GameOver'
import History from './components/History'
import Admin from './components/Admin'
import API_BASE_URL from './config'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  const [playerName, setPlayerName] = useState('')
  const [questions, setQuestions] = useState([])
  const [finalScore, setFinalScore] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef(null)

  // Initialize audio with preload
  useEffect(() => {
    audioRef.current = new Audio(`${API_BASE_URL}/audio.mp3`)
    audioRef.current.loop = false // Don't loop - play once
    audioRef.current.volume = 0.5 // Medium volume (50%)
    audioRef.current.preload = 'auto' // Preload audio to avoid delay
    
    // When audio ends, update state
    audioRef.current.onended = () => {
      setIsAudioPlaying(false)
    }
    
    // Preload the audio file
    audioRef.current.load()
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playWrongAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      setIsAudioPlaying(true)
    }
  }

  const stopWrongAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsAudioPlaying(false)
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`)
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    }
  }

  const handleGetStarted = () => {
    setCurrentScreen('name')
  }

  const handleStartQuiz = async (name) => {
    setPlayerName(name)
    await fetchQuestions()
    setCurrentScreen('quiz')
  }

  const handleQuizWin = async (score) => {
    setFinalScore(score)
    
    try {
      await fetch(`${API_BASE_URL}/api/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          score,
          totalQuestions: 10,
          answers: [],
          isWinner: true
        })
      })
    } catch (error) {
      console.error('Failed to save winner:', error)
    }

    setCurrentScreen('congratulations')
  }

  const handleQuizFail = async (score, questionNumber) => {
    setFinalScore(score)
    
    try {
      await fetch(`${API_BASE_URL}/api/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          score,
          totalQuestions: questionNumber,
          answers: [],
          isWinner: false
        })
      })
    } catch (error) {
      console.error('Failed to save attempt:', error)
    }

    setCurrentScreen('gameover')
  }

  const handlePlayAgain = () => {
    setPlayerName('')
    setFinalScore(0)
    setCurrentScreen('name')
  }

  const handleViewHistory = () => {
    setCurrentScreen('history')
  }

  const handleBackToHome = () => {
    setCurrentScreen('splash')
    setPlayerName('')
    setFinalScore(0)
  }

  const handleOpenAdmin = () => {
    setCurrentScreen('admin')
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'splash' && (
        <Splash onGetStarted={handleGetStarted} onAdmin={handleOpenAdmin} />
      )}
      {currentScreen === 'name' && (
        <NameInput onStart={handleStartQuiz} onViewHistory={handleViewHistory} onBack={handleBackToHome} />
      )}
      {currentScreen === 'quiz' && (
        <Quiz 
          questions={questions} 
          playerName={playerName} 
          onWin={handleQuizWin}
          onFail={handleQuizFail}
          playWrongAudio={playWrongAudio}
        />
      )}
      {currentScreen === 'congratulations' && (
        <Congratulations 
          playerName={playerName}
          score={finalScore}
          onPlayAgain={handlePlayAgain}
          onHome={handleBackToHome}
        />
      )}
      {currentScreen === 'gameover' && (
        <GameOver 
          playerName={playerName}
          score={finalScore}
          onTryAgain={handlePlayAgain}
          onHome={handleBackToHome}
          stopAudio={stopWrongAudio}
          isAudioPlaying={isAudioPlaying}
        />
      )}
      {currentScreen === 'history' && (
        <History onBack={handleBackToHome} />
      )}
      {currentScreen === 'admin' && (
        <Admin onBack={handleBackToHome} />
      )}
    </div>
  )
}
