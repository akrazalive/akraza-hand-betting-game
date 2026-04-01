'use client'

import { Hand } from '@/lib/game/types'
import Tile from './Tile'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface HandHistoryProps {
  history: Hand[]
}

export default function HandHistory({ history }: HandHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (history.length === 0) return null

  const recentHistory = history.slice().reverse().slice(0, isExpanded ? 5 : 2)

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3 sm:mb-4"
      >
        <h3 className="text-base sm:text-xl font-semibold text-gray-800">Hand History</h3>
        {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
      </button>
      
      <div className="space-y-2 sm:space-y-3">
        <AnimatePresence>
          {recentHistory.map((hand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-2 sm:p-3 rounded-lg border ${
                hand.isWin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className={`text-xs sm:text-sm font-semibold px-1.5 sm:px-2 py-0.5 rounded ${
                  hand.isWin ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {hand.isWin ? '✓ WIN' : '✗ LOSS'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-700">
                  Total: {hand.totalValue}
                </span>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-2">
                {hand.tiles.map((tile) => (
                  <Tile key={tile.id} tile={tile} size="sm" />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}