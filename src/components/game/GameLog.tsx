'use client'

import { GameLogEntry } from '@/lib/game/types'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Trophy, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'

interface GameLogProps {
  logs: GameLogEntry[]
}

export default function GameLog({ logs }: GameLogProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <Info className="w-5 h-5" />
      </button>
    )
  }

  const getIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'win':
        return <Trophy className="w-4 h-4 text-green-500" />
      case 'loss':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'value_change':
        return <TrendingUp className="w-4 h-4 text-purple-500" />
      case 'bet':
        return <TrendingDown className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getBgColor = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'win':
        return 'bg-green-50 border-green-200'
      case 'loss':
        return 'bg-red-50 border-red-200'
      case 'value_change':
        return 'bg-purple-50 border-purple-200'
      case 'bet':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const recentLogs = isExpanded ? logs : logs.slice(-3)

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 z-40">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Game Log</h3>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {logs.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {recentLogs.slice().reverse().map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-2 rounded-lg border ${getBgColor(log.type)}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-700">
                      {log.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {logs.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              No events yet. Start playing!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}