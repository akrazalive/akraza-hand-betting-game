'use client'

import { Hand } from '@/lib/game/types'
import Tile from './Tile'
import { motion, AnimatePresence } from 'framer-motion'

interface HandHistoryProps {
  history: Hand[]
}

export default function HandHistory({ history }: HandHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Hand History</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {history.slice().reverse().map((hand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-lg border ${
                hand.isWin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {hand.isWin ? '✓ Win' : '✗ Loss'}
                </span>
                <span className="text-sm font-bold">
                  Total: {hand.totalValue}
                </span>
              </div>
              <div className="flex gap-1 overflow-x-auto">
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