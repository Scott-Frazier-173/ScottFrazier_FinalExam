import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Game setup state
  const [gameStarted, setGameStarted] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Game state
  const [cellValues, setCellValues] = useState([])
  const [gemPosition, setGemPosition] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [message, setMessage] = useState('')
  const [guessInput, setGuessInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [firstMove, setFirstMove] = useState(true)
  const [guessesRemaining, setGuessesRemaining] = useState(0)
  
  // Refs for audio
  const audioRefs = useRef({
    coins: null,
    parrot: null
  })
  
  // Difficulty settings
  const difficultySettings = {
    easy: { gridSize: 3, timeLimit: 60, label: 'Easy (3×3)' },
    medium: { gridSize: 4, timeLimit: 90, label: 'Medium (4×4)' },
    hard: { gridSize: 6, timeLimit: 120, label: 'Hard (6×6)' }
  }
  
  const currentSettings = difficultySettings[difficulty]
  const totalCells = currentSettings.gridSize * currentSettings.gridSize
  
  // Initialize audio with consolidated audio context creation
  useEffect(() => {
    if (soundEnabled) {
      // Centralized audio context factory
      const createAudioContext = () => {
        try {
          return new (window.AudioContext || window.webkitAudioContext)()
        } catch (e) {
          console.log('Audio not available')
          return null
        }
      }

      // Create simple beep sound
      const createBeep = (frequency, duration, type = 'sine') => {
        return () => {
          const audioContext = createAudioContext()
          if (!audioContext) return
          
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = frequency
          oscillator.type = type
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration)
        }
      }
      
      // Create coin jingle sound effect
      audioRefs.current.coins = () => {
        const audioContext = createAudioContext()
        if (!audioContext) return
        
        const frequencies = [523, 659, 784, 1047] // C, E, G, C octave
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            oscillator.frequency.value = freq
            oscillator.type = 'sine'
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
            
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)
          }, index * 100)
        })
      }
      
      // Create parrot squawk sound
      audioRefs.current.parrot = createBeep(800, 0.2, 'square')
    }
  }, [soundEnabled])
  
  // Timer effect - simplified logic
  useEffect(() => {
    if (!timerStarted || timeLeft <= 0 || gameOver) return

    const interval = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft <= 1) {
          setGameOver(true)
          setMessage('⏰ Out of time! The treasure remains hidden...')
          return 0
        }
        return timeLeft - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerStarted, gameOver])
  
  // Reveal treasure when game ends due to timeout
  useEffect(() => {
    if (gameOver && !gameWon && timeLeft <= 0 && gemPosition !== null) {
      setCellValues(prev => {
        const newCells = [...prev]
        if (newCells[gemPosition] === '') {
          newCells[gemPosition] = '💎'
        }
        return newCells
      })
    }
  }, [gameOver, gameWon, timeLeft, gemPosition])
  
  // Play sound effect
  const playSound = useCallback((soundType) => {
    if (soundEnabled && audioRefs.current[soundType]) {
      try {
        audioRefs.current[soundType]()
      } catch (e) {
        console.log('Audio play error:', e)
      }
    }
  }, [soundEnabled])
  
  // Initialize game
  const initGame = useCallback(() => {
    const newCellValues = Array(totalCells).fill('')
    setCellValues(newCellValues)
    setMessage('')
    setGameOver(false)
    setGameWon(false)
    setGuessInput('')
    setTimeLeft(currentSettings.timeLimit)
    setTimerStarted(false)
    setFirstMove(true)
    setGuessesRemaining(totalCells - 1)
    
    // Place the gem randomly
    const min = 0
    const max = totalCells - 1
    const newGemPosition = Math.floor(Math.random() * (max - min + 1)) + min
    setGemPosition(newGemPosition)
  }, [totalCells, currentSettings.timeLimit])
  
  // Start game from modal
  const startGame = useCallback(() => {
    if (playerName.trim()) {
      playSound('parrot')
      setGameStarted(true)
      initGame()
    }
  }, [playerName, initGame, playSound])
  
  // Handle guess by number or click
  const makeGuess = useCallback((cellIndex) => {
    // Safety checks
    if (gameOver || cellIndex < 0 || cellIndex >= totalCells) return
    if (cellValues[cellIndex] !== '') return
    
    // Start timer on first move
    if (firstMove) {
      setTimerStarted(true)
      setFirstMove(false)
    }
    
    const newCellValues = [...cellValues]
    
    if (cellIndex === gemPosition) {
      // Found the gem!
      newCellValues[cellIndex] = '💎'
      setCellValues(newCellValues)
      setMessage(`🎉 Congratulations ${playerName}! You found the treasure!`)
      setGameOver(true)
      setGameWon(true)
      setTimerStarted(false)
      playSound('coins')
    } else {
      // Wrong guess
      newCellValues[cellIndex] = '❌'
      setCellValues(newCellValues)
      const newGuessesRemaining = guessesRemaining - 1
      setGuessesRemaining(newGuessesRemaining)
      
      if (newGuessesRemaining <= 0) {
        setMessage('Out of guesses! The treasure remains hidden...')
        setGameOver(true)
        setTimerStarted(false)
        // Reveal the treasure location when game ends
        newCellValues[gemPosition] = '💎'
        setCellValues(newCellValues)
      } else {
        setMessage('Try again, matey!')
      }
    }
  }, [gameOver, cellValues, gemPosition, firstMove, playerName, playSound, guessesRemaining, totalCells])
  
  // Handle number input guess
  const handleNumberGuess = useCallback(() => {
    if (!guessInput || guessInput.trim() === '') {
      setMessage('Please enter a number.')
      return
    }
    
    const guessValue = parseInt(guessInput)
    
    if (isNaN(guessValue) || guessValue < 1 || guessValue > totalCells) {
      setMessage(`Please enter a valid number between 1 and ${totalCells}.`)
      return
    }
    
    const cellIndex = guessValue - 1
    makeGuess(cellIndex)
    setGuessInput('')
  }, [guessInput, totalCells, makeGuess])
  
  // Handle cell click
  const handleCellClick = useCallback((cellIndex) => {
    makeGuess(cellIndex)
  }, [makeGuess])
  
  // Reset to start screen
  const resetToStart = useCallback(() => {
    playSound('parrot')
    setGameStarted(false)
    setPlayerName('')
    setDifficulty('easy')
    // Reset all game state
    setCellValues([])
    setGemPosition(null)
    setGameOver(false)
    setGameWon(false)
    setMessage('')
    setGuessInput('')
    setTimeLeft(0)
    setTimerStarted(false)
    setFirstMove(true)
    setGuessesRemaining(0)
  }, [playSound])
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Render cell
  const renderCell = (index) => {
    const value = cellValues[index]
    let className = 'treasure-cell'
    let displayValue = value || (index + 1)
    
    if (value === '❌') {
      className += ' scratched-out'
      displayValue = '❌'
    } else if (value === '💎') {
      className += ' treasure-found'
      displayValue = '💎'
    }
    
    return (
      <div
        key={index}
        className={className}
        onClick={() => handleCellClick(index)}
        data-index={index}
      >
        {displayValue}
      </div>
    )
  }
  
  // Start screen modal
  if (!gameStarted) {
    return (
      <div className="app pirate-theme">
        <div className="treasure-modal">
          <div className="modal-content">
            <h1 className="pirate-title">🏴‍☠️ Treasure Hunt 🏴‍☠️</h1>
            <p className="pirate-subtitle">Ahoy! Ready to find the hidden treasure?</p>
            
            <div className="modal-form">
              <div className="form-group">
                <label>⚓ Pirate Name:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your pirate name..."
                  className="pirate-input"
                />
              </div>
              
              <div className="form-group">
                <label>🗺️ Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="pirate-select"
                >
                  <option value="easy">{difficultySettings.easy.label} - {difficultySettings.easy.timeLimit}s</option>
                  <option value="medium">{difficultySettings.medium.label} - {difficultySettings.medium.timeLimit}s</option>
                  <option value="hard">{difficultySettings.hard.label} - {difficultySettings.hard.timeLimit}s</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="sound-toggle">
                  🔊 Sound Effects:
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <button
                onClick={startGame}
                disabled={!playerName.trim()}
                className="start-button"
              >
                🚢 Start Treasure Hunt!
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Main game screen
  return (
    <div className="app pirate-theme">
      <div className="game-header">
        <h1>🏴‍☠️ {playerName}'s Treasure Hunt 🏴‍☠️</h1>
        <div className="game-info">
          <div className="timer">⏰ {formatTime(timeLeft)}</div>
          <div className="difficulty">🗺️ {currentSettings.label}</div>
          <div className="guesses">🎯 Guesses: {guessesRemaining}</div>
        </div>
      </div>
      
      <div className="input-section">
        <input
          type="number"
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleNumberGuess()}
          placeholder={`Enter 1-${totalCells}`}
          min="1"
          max={totalCells}
          disabled={gameOver}
          className="treasure-input"
        />
        <button
          onClick={handleNumberGuess}
          disabled={gameOver}
          className="guess-button"
        >
          🔍 Search Here!
        </button>
      </div>
      
      <div 
        className={`treasure-grid ${difficulty}-difficulty`}
        style={{ 
          gridTemplateColumns: `repeat(${currentSettings.gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: totalCells }, (_, index) => renderCell(index))}
      </div>
      
      <p className="treasure-message">{message}</p>
      
      <div className="game-controls">
        <button onClick={initGame} className="reset-button">
          🔄 New Hunt
        </button>
        <button onClick={resetToStart} className="back-button">
          ⚓ Back to Port
        </button>
      </div>
    </div>
  )
}

export default App
