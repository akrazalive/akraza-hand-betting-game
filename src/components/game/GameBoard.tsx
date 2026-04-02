'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import Tile from './Tile'
import HandHistory from './HandHistory'
import GameOverModal from './GameOverModal'
import { AnimatePresence, motion } from 'framer-motion'
import GameLog from './GameLog'
import { soundService } from '@/lib/sound/soundService'

interface GameBoardProps {
  onExit: (score: number) => void
}

export default function GameBoard({ onExit }: GameBoardProps) {
  const { gameState, isLoading, placeBet, resolveCurrentHand, resetGame } = useGame()
  const [predictedValue, setPredictedValue] = useState<number>(0)
  const [betPlaced, setBetPlaced] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showResult, setShowResult] = useState<{ type: 'win' | 'loss', value: number } | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSound = () => {
    const enabled = soundService.toggleSound()
    setSoundEnabled(enabled)
  }

  if (isLoading || !gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    )
  }

  if (gameState.gameOver) {
    return (
      <GameOverModal
        score={gameState.score}
        reason={gameState.gameOverReason}
        tileId={gameState.gameOverTileId}
        onPlayAgain={resetGame}
        onExit={() => onExit(gameState.score)}
      />
    )
  }

  const handlePlaceBet = (type: 'higher' | 'lower') => {
    if (predictedValue <= 0) {
      alert('Please enter a valid predicted value')
      return
    }
    console.log('🎵 Placing bet, playing sound...')
    placeBet(type, predictedValue)
    setBetPlaced(true)
    soundService.playBet()
  }

  const handleResolve = () => {
    console.log('🎵 Resolving hand...')
    const result = resolveCurrentHand()
    if (result) {
      console.log(`🎵 Result: ${result.isWin ? 'WIN' : 'LOSS'}, playing sound...`)
      
      // Play sound based on result
      if (result.isWin) {
        soundService.playWin();
      } else {
        soundService.playLose();
      }

      setShowResult({ type: result.isWin ? 'win' : 'loss', value: result.actualValue })
      setTimeout(() => setShowResult(null), 2000)
    }
    setBetPlaced(false)
    setPredictedValue(0)
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Stack on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-8">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Hand Betting Game</h1>
            {/* Stats grid - 2 columns on mobile, row on desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-6 mt-2 text-xs sm:text-sm text-gray-600">
              <div className="bg-white rounded-lg p-2 sm:p-0 sm:bg-transparent">
                <span className="font-medium">Score:</span>{' '}
                <strong className="text-base sm:text-2xl text-green-600">{gameState.score}</strong>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-0 sm:bg-transparent">
                <span className="font-medium">Draw:</span> {gameState.drawPile.length}
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-0 sm:bg-transparent">
                <span className="font-medium">Discard:</span> {gameState.discardPile.length}
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-0 sm:bg-transparent">
                <span className="font-medium">Reshuffles:</span> {gameState.reshuffleCount}/3
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={toggleSound}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              {soundEnabled ? '🔊 Sound' : '🔇 Mute'}
            </button>
            <button
              onClick={() => onExit(gameState.score)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Exit Game
            </button>
          </div>
        </div>

        {/* Current Hand with Animation */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-base sm:text-xl font-semibold mb-3 sm:mb-4"
          >
            🎴 Current Hand
          </motion.h2>
          
          <motion.div 
            className="flex gap-2 sm:gap-3 flex-wrap justify-center mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {gameState.currentHand?.tiles.map((tile, index) => (
              <Tile key={tile.id} tile={tile} size={isMobile ? 'sm' : 'lg'} delay={index * 0.1} />
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm sm:text-lg">
              Hand Total Value:{' '}
              <motion.strong 
                key={gameState.currentHand?.totalValue}
                initial={{ scale: 1.5, color: '#3b82f6' }}
                animate={{ scale: 1, color: '#1e3a8a' }}
                className="text-xl sm:text-2xl text-blue-600 inline-block"
              >
                {gameState.currentHand?.totalValue}
              </motion.strong>
            </p>
          </motion.div>
        </div>

        {/* Result Animation Overlay */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${
                showResult.type === 'win' ? 'bg-green-500' : 'bg-red-500'
              } text-white px-8 py-4 rounded-2xl shadow-2xl text-center`}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-2"
              >
                {showResult.type === 'win' ? '🎉 WIN! 🎉' : '😢 LOSS! 😢'}
              </motion.div>
              <div className="text-2xl font-bold">
                {showResult.type === 'win' ? `+${showResult.value}` : `-${showResult.value}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!betPlaced ? (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base sm:text-xl font-semibold mb-3 sm:mb-4"
            >
              💰 Place Your Bet
            </motion.h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">
                  Predict Hand Value:
                </label>
                <motion.input
                  type="number"
                  value={predictedValue}
                  onChange={(e) => setPredictedValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter predicted value"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#16a34a" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlaceBet('higher')}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  ⬆️ Bet Higher
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlaceBet('lower')}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  ⬇️ Bet Lower
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <motion.p 
              className="text-sm sm:text-lg mb-3 sm:mb-4 text-gray-700"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎲 Bet placed! Ready to see the result?
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResolve}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
            >
              ✨ Resolve Hand
            </motion.button>
          </motion.div>
        )}

        {/* History */}
        <HandHistory history={gameState.handHistory} />
      </div>
      <GameLog logs={gameState.gameLogs} />
    </motion.div>
  )
}