'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Leaderboard from '@/components/landing/Leaderboard'
import AllScores from '@/components/landing/AllScores'
import { motion } from 'framer-motion'
import { Gamepad2, Trophy } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('')

  const startNewGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }
    localStorage.setItem('playerName', playerName)
    router.push('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            Hand Betting Game
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Predict higher or lower, master the Mahjong tiles!
          </p>
        </motion.div>

        {/* 3-Column Grid: Desktop (3), Tablet (2), Mobile (1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Column 1: New Game Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-fit"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Gamepad2 className="w-7 h-7 md:w-8 md:h-8 text-blue-500" />
                <h2 className="text-xl md:text-2xl font-bold">New Game</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    onKeyPress={(e) => e.key === 'Enter' && startNewGame()}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewGame}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Start Game
                </motion.button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm md:text-base">How to Play:</h3>
                <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                  <li>• You start with 1000 points</li>
                  <li>• Each hand shows 3 Mahjong tiles</li>
                  <li>• Bet if the next hand's value will be higher or lower</li>
                  <li>• Win: Add hand value to score | Lose: Subtract hand value</li>
                  <li>• Non-number tiles (Dragons/Winds) change value based on wins/losses</li>
                  <li>• Game ends if any tile reaches 0 or 10, or after 3 reshuffles</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Top 5 Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit"
          >
            <Leaderboard />
          </motion.div>

          {/* Column 3: All Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 md:col-span-2 lg:col-span-1"
          >
            <AllScores />
          </motion.div>
        </div>
      </div>
    </div>
  )
}