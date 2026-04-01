'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameState, BetType } from '@/lib/game/types'
import {
  initializeGame,
  resolveBet,
  updateNonNumberTileValues,
  checkGameOver,
  drawNextHand,
  calculateHandTotalValue
} from '@/lib/game/gameEngine'

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentBet, setCurrentBet] = useState<BetType | null>(null)

  useEffect(() => {
    const init = initializeGame()
    setGameState(init)
    setIsLoading(false)
  }, [])

  const placeBet = useCallback((betType: 'higher' | 'lower', predictedValue: number) => {
    if (!gameState || !gameState.currentHand || gameState.gameOver) return
    setCurrentBet({ type: betType, predictedHandValue: predictedValue })
  }, [gameState])

  const resolveCurrentHand = useCallback(() => {
    if (!gameState || !gameState.currentHand || !currentBet) return

    const actualValue = calculateHandTotalValue(gameState.currentHand, gameState.nonNumberTileValues)
    const { newScore, isWin } = resolveBet(gameState, currentBet, actualValue)
    
    const updatedNonNumberValues = updateNonNumberTileValues(
      gameState.currentHand,
      gameState.nonNumberTileValues,
      isWin
    )
    
    const updatedHand = {
      ...gameState.currentHand,
      isWin
    }
    
    let newGameState: GameState = {
      ...gameState,
      score: newScore,
      currentHand: updatedHand,
      nonNumberTileValues: updatedNonNumberValues,
      handHistory: [...gameState.handHistory, updatedHand]
    }
    
    const gameOverCheck = checkGameOver(updatedNonNumberValues, newGameState.reshuffleCount)
    
    if (gameOverCheck.isOver) {
      newGameState = {
        ...newGameState,
        gameOver: true,
        gameOverReason: gameOverCheck.reason,
        gameOverTileId: gameOverCheck.tileId
      }
    } else {
      newGameState = drawNextHand(newGameState)
    }
    
    setGameState(newGameState)
    setCurrentBet(null)
    
    return { isWin, newScore, actualValue }
  }, [gameState, currentBet])

  const resetGame = useCallback(() => {
    const newGame = initializeGame()
    setGameState(newGame)
    setCurrentBet(null)
  }, [])

  return {
    gameState,
    isLoading,
    currentBet,
    placeBet,
    resolveCurrentHand,
    resetGame
  }
}