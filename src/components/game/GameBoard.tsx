'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import Tile from './Tile'
import HandHistory from './HandHistory'
import GameOverModal from './GameOverModal'
import { motion } from 'framer-motion'

interface GameBoardProps {
  onExit: (score: number) => void
}

export default function GameBoard({ onExit }: GameBoardProps) {
  const { gameState, isLoading, placeBet, resolveCurrentHand, resetGame } = useGame()
  const [predictedValue, setPredictedValue] = useState<number>(0)
  const [betPlaced, setBetPlaced] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    placeBet(type, predictedValue)
    setBetPlaced(true)
  }

  const handleResolve = () => {
    resolveCurrentHand()
    setBetPlaced(false)
    setPredictedValue(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
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
          <button
            onClick={() => onExit(gameState.score)}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Exit Game
          </button>
        </div>

        {/* Current Hand */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">Current Hand</h2>
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center mb-3 sm:mb-4">
            {gameState.currentHand?.tiles.map((tile) => (
              <Tile key={tile.id} tile={tile} size={isMobile ? 'sm' : 'lg'} />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-lg">
              Hand Total Value:{' '}
              <strong className="text-xl sm:text-2xl text-blue-600">{gameState.currentHand?.totalValue}</strong>
            </p>
          </div>
        </div>

        {/* Betting Interface */}
        {!betPlaced ? (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">Place Your Bet</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">
                  Predict Hand Value:
                </label>
                <input
                  type="number"
                  value={predictedValue}
                  onChange={(e) => setPredictedValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter predicted value"
                />
              </div>
              <div className="flex gap-2 sm:gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlaceBet('higher')}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition text-sm sm:text-base"
                >
                    Bet Higher ⬆️
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlaceBet('lower')}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm sm:text-base"
                >
                    Bet Lower ⬇️
                </motion.button>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="text-center">
              <p className="text-sm sm:text-lg mb-3 sm:mb-4">Bet placed! Ready to see the result?</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResolve}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
              >
                Resolve Hand
              </motion.button>
            </div>
          </div>
        )}

        {/* History */}
        <HandHistory history={gameState.handHistory} />
      </div>
    </div>
  )
}