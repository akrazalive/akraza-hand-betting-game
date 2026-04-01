'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ScoreEntry } from '@/lib/game/types'
import { Trophy, Medal } from 'lucide-react'
import { motion } from 'framer-motion'

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
      .limit(5)

    if (!error && data) {
      setScores(data)
    }
    setIsLoading(false)
  }

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Top 5 High Scores
      </h2>
      {scores.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 text-center">
                  {getMedalIcon(index) || <span className="text-gray-400">#{index + 1}</span>}
                </div>
                <span className="font-medium">{score.player_name}</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{score.score}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}