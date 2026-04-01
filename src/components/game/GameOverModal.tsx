'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RefreshCw, Home } from 'lucide-react'

interface GameOverModalProps {
  score: number
  reason?: 'tileValue' | 'reshuffleLimit'
  tileId?: string
  onPlayAgain: () => void
  onExit: (score: number) => void
}

export default function GameOverModal({
  score,
  reason,
  onPlayAgain,
  onExit
}: GameOverModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        >
          <div className="text-center">
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <p className="text-gray-600 mb-4">
              {reason === 'tileValue' 
                ? 'A tile reached its limit (0 or 10)!'
                : 'You ran out of reshuffles!'}
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Final Score</p>
              <p className="text-4xl font-bold text-blue-600">{score}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onPlayAgain}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={() => onExit(score)}
                className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Exit
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}