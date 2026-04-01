'use client'

import { useState } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hand Betting Game</h1>
            <div className="flex gap-6 mt-2 text-sm text-gray-600">
              <span>Score: <strong className="text-2xl text-green-600">{gameState.score}</strong></span>
              <span>Draw Pile: {gameState.drawPile.length}</span>
              <span>Discard Pile: {gameState.discardPile.length}</span>
              <span>Reshuffles: {gameState.reshuffleCount}/3</span>
            </div>
          </div>
          <button
            onClick={() => onExit(gameState.score)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Exit Game
          </button>
        </div>

        {/* Current Hand */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Hand</h2>
          <div className="flex gap-3 flex-wrap justify-center mb-4">
            {gameState.currentHand?.tiles.map((tile) => (
              <Tile key={tile.id} tile={tile} size="lg" />
            ))}
          </div>
          <div className="text-center">
            <p className="text-lg">
              Hand Total Value: <strong className="text-2xl text-blue-600">{gameState.currentHand?.totalValue}</strong>
            </p>
          </div>
        </div>

        {/* Betting Interface */}
        {!betPlaced ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Place Your Bet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Predict Hand Value:
                </label>
                <input
                  type="number"
                  value={predictedValue}
                  onChange={(e) => setPredictedValue(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter predicted value"
                />
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlaceBet('higher')}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Bet Higher
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlaceBet('lower')}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Bet Lower
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-lg mb-4">Bet placed! Ready to see the result?</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResolve}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
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