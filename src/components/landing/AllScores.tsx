// components/landing/AllScores.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ScoreEntry } from '@/lib/game/types'
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Calendar, 
  User,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ITEMS_PER_PAGE =7

export default function AllScores() {
  const [allScores, setAllScores] = useState<ScoreEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchAllScores()
  }, [])

  const fetchAllScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })

    if (!error && data) {
      setAllScores(data)
    }
    setIsLoading(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAllScores()
    setCurrentPage(1)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  // Pagination calculations
  const totalPages = Math.ceil(allScores.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentScores = allScores.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore
    if (percentage >= 0.8) return 'from-emerald-500 to-green-500'
    if (percentage >= 0.6) return 'from-blue-500 to-cyan-500'
    if (percentage >= 0.4) return 'from-amber-500 to-orange-500'
    return 'from-rose-500 to-red-500'
  }

  const getScoreBadgeColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore
    if (percentage >= 0.8) return 'bg-emerald-100 text-emerald-700'
    if (percentage >= 0.6) return 'bg-blue-100 text-blue-700'
    if (percentage >= 0.4) return 'bg-amber-100 text-amber-700'
    return 'bg-rose-100 text-rose-700'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading all scores...</span>
        </div>
      </div>
    )
  }

  const maxScore = allScores.length > 0 ? Math.max(...allScores.map(s => s.score)) : 1000

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">All Scores</h2>
              <p className="text-xs text-gray-400">
                {allScores.length} player{allScores.length !== 1 ? 's' : ''} ranked
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Stats Bar */}
      {allScores.length > 0 && (
        <div className="px-5 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-gray-500">Top Score:</span>
              <span className="font-bold text-green-600">{maxScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">Latest updates</span>
            </div>
          </div>
        </div>
      )}

      {/* Scores Table */}
      {allScores.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">No scores recorded yet</p>
          <p className="text-xs text-gray-300 mt-1">Play a game to appear here!</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-50">
            <AnimatePresence mode="wait">
              {currentScores.map((score, idx) => {
                const globalRank = startIndex + idx + 1
                const isTop3 = globalRank <= 3
                const scorePercentage = (score.score / maxScore) * 100
                
                return (
                  <motion.div
                    key={`${score.id}-${currentPage}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className={`px-5 py-3 hover:bg-gray-50/80 transition-colors ${
                      isTop3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Rank */}
                      <div className="w-10">
                        {isTop3 ? (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            globalRank === 1 ? 'bg-yellow-400 text-white shadow-sm' :
                            globalRank === 2 ? 'bg-gray-300 text-white' :
                            'bg-amber-600 text-white'
                          }`}>
                            {globalRank}
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">#{globalRank}</span>
                        )}
                      </div>

                      {/* Player Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium text-gray-700 text-sm truncate">
                            {score.player_name}
                          </span>
                        </div>
                      </div>

                      {/* Score with progress bar */}
                      <div className="flex-1 max-w-[120px]">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBadgeColor(score.score, maxScore)}`}>
                            {score.score}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${scorePercentage}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score.score, maxScore)}`}
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="hidden sm:block text-right">
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {formatDate(score.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl transition-all ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    if (pageNum > totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl transition-all ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Page info */}
              <div className="text-center mt-2">
                <span className="text-[11px] text-gray-400">
                  Page {currentPage} of {totalPages} • {allScores.length} total entries
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}