'use client'

import { useRouter } from 'next/navigation'
import GameBoard from '@/components/game/GameBoard'
import { supabase } from '@/lib/supabase/client'

export default function GamePage() {
  const router = useRouter()

  const handleExit = async (finalScore?: number) => {
    console.log('========================================')
    console.log('🔵 EXIT HANDLER TRIGGERED')
    console.log('========================================')
    
    // Get player name from localStorage
    const playerName = localStorage.getItem('playerName')
    console.log('📝 Player name from localStorage:', playerName)
    console.log('🎯 Final score from game:', finalScore)
    console.log('📊 Score type:', typeof finalScore)
    console.log('✅ Score is defined?', finalScore !== undefined)
    console.log('✅ Score is positive?', finalScore ? finalScore > 0 : false)
    
    // Save score to leaderboard if we have player name and score
    if (playerName && finalScore !== undefined) {
      console.log('💾 Attempting to save to Supabase...')
      console.log('📦 Data to insert:', {
        player_name: playerName,
        score: finalScore
      })
      
      try {
        const { data, error } = await supabase
          .from('scores')
          .insert({
            player_name: playerName,
            score: finalScore
          })
          .select()
        
        if (error) {
          console.error('❌ SUPABASE ERROR:', error)
          console.error('❌ Error code:', error.code)
          console.error('❌ Error message:', error.message)
          console.error('❌ Error details:', error.details)
        } else {
          console.log('✅ SUCCESS! Score saved to Supabase!')
          console.log('📀 Saved data:', data)
          console.log('🎉 Player:', playerName, '| Score:', finalScore)
        }
      } catch (err) {
        console.error('❌ EXCEPTION CAUGHT:', err)
        console.error('❌ Exception details:', JSON.stringify(err, null, 2))
      }
    } else {
      console.log('⚠️ SKIPPING SAVE - Conditions not met:')
      console.log('   - Has playerName?', !!playerName)
      console.log('   - Has finalScore?', finalScore !== undefined)
      if (playerName === null) {
        console.log('   💡 Tip: Make sure you entered a name on the landing page')
      }
      if (finalScore === undefined) {
        console.log('   💡 Tip: GameBoard is not passing a score to onExit')
      }
    }
    
    console.log('🚪 Redirecting to home page...')
    console.log('========================================\n')
    
    router.push('/')
  }

  return (
    <div>
      <GameBoard onExit={handleExit} />
    </div>
  )
}