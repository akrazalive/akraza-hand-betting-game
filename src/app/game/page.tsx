'use client'

import { useRouter } from 'next/navigation'
import GameBoard from '@/components/game/GameBoard'
import { supabase } from '@/lib/supabase/client'

export default function GamePage() {
  const router = useRouter()

  const handleExit = async (finalScore?: number) => {
    // Save score to leaderboard if we have player name and score
    const playerName = localStorage.getItem('playerName')
    
    if (playerName && finalScore !== undefined) {
      await supabase.from('scores').insert({
        player_name: playerName,
        score: finalScore
      })
    }
    
    router.push('/')
  }

  return (
    <div>
      <GameBoard onExit={handleExit} />
    </div>
  )
}