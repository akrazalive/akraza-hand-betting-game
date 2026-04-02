// components/landing/Leaderboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ScoreEntry } from '@/lib/game/types'
import { Trophy, Medal, Crown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(7)

    if (!error && data) {
      setScores(data)
    }
    setIsLoading(false)
  }

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 2:
        return <Medal className="w-4 h-4 text-amber-600" />
      default:
        return null
    }
  }

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
      case 2:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-gray-100">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading scores...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Top Players
          </h2>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
      </div>

      {/* Score List */}
      {scores.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-xs text-gray-400">No scores yet</p>
          <p className="text-xs text-gray-300 mt-1">Be the first champion!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${getRankStyles(index)} transition-all duration-200 hover:scale-[1.01] cursor-pointer`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 text-center">
                    {getMedalIcon(index) || (
                      <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                    )}
                  </div>
                  <span className="font-medium text-gray-700 text-sm truncate max-w-[100px]">
                    {score.player_name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-blue-600">{score.score}</span>
                  <span className="text-[10px] text-gray-400">pts</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}