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

    // Calculate actual value of the hand
    const actualValue = calculateHandTotalValue(gameState.currentHand, gameState.nonNumberTileValues)
    const { newScore, isWin } = resolveBet(gameState, currentBet, actualValue)
    
    // Update non-number tile values based on win/loss
    const updatedNonNumberValues = updateNonNumberTileValues(
      gameState.currentHand,
      gameState.nonNumberTileValues,
      isWin
    )
    
    // Create updated hand with win status
    const updatedHand = {
      ...gameState.currentHand,
      isWin
    }
    
    // FIX: Add the resolved hand to history ONCE here
    const updatedHistory = [...gameState.handHistory, updatedHand]
    
    // Create new game state with updated score and history
    let newGameState: GameState = {
      ...gameState,
      score: newScore,
      currentHand: updatedHand,
      nonNumberTileValues: updatedNonNumberValues,
      handHistory: updatedHistory  // History added only once
    }
    
    // Check if game over conditions are met
    const gameOverCheck = checkGameOver(updatedNonNumberValues, newGameState.reshuffleCount)
    
    if (gameOverCheck.isOver) {
      // Game over - don't draw next hand
      newGameState = {
        ...newGameState,
        gameOver: true,
        gameOverReason: gameOverCheck.reason,
        gameOverTileId: gameOverCheck.tileId
      }
      setGameState(newGameState)
      setCurrentBet(null)
      return { isWin, newScore, actualValue }
    }
    
    // Draw next hand - drawNextHand will NOT add to history again
    const nextState = drawNextHand(newGameState)
    
    setGameState(nextState)
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