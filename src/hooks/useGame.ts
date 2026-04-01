'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameState, BetType, GameLogEntry } from '@/lib/game/types'
import {
  initializeGame,
  resolveBet,
  updateNonNumberTileValues,
  checkGameOver,
  drawNextHand,
  calculateHandTotalValue
} from '@/lib/game/gameEngine'

let logIdCounter = 0

function createLogEntry(message: string, type: GameLogEntry['type']): GameLogEntry {
  return {
    id: `log_${Date.now()}_${logIdCounter++}`,
    message,
    type,
    timestamp: new Date()
  }
}

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
    
    // Create logs for the outcome
    const newLogs = [...gameState.gameLogs]
    
    // Add bet log
    newLogs.push(createLogEntry(
      `🎯 Bet ${currentBet.type.toUpperCase()} on ${currentBet.predictedHandValue}, actual hand value: ${actualValue}`,
      'bet'
    ))
    
    // Add outcome log
    newLogs.push(createLogEntry(
      isWin 
        ? `✅ WIN! You gained +${actualValue} points! New score: ${newScore}`
        : `❌ LOSS! You lost ${actualValue} points! New score: ${newScore}`,
      isWin ? 'win' : 'loss'
    ))
    
    const updatedNonNumberValues = updateNonNumberTileValues(
      gameState.currentHand,
      gameState.nonNumberTileValues,
      isWin
    )
    
    // Log tile value changes
    gameState.currentHand.tiles.forEach(tile => {
      if (tile.type !== 'number') {
        const oldValue = gameState.nonNumberTileValues.get(tile.id) || 5
        const newValue = updatedNonNumberValues.get(tile.id) || 5
        if (oldValue !== newValue) {
          newLogs.push(createLogEntry(
            `🀄 ${tile.displayValue} ${tile.type} tile changed from ${oldValue} to ${newValue} (${isWin ? 'WIN' : 'LOSS'})`,
            'value_change'
          ))
        }
      }
    })
    
    const updatedHand = {
      ...gameState.currentHand,
      isWin
    }
    
    const updatedHistory = [...gameState.handHistory, updatedHand]
    
    let newGameState: GameState = {
      ...gameState,
      score: newScore,
      currentHand: updatedHand,
      nonNumberTileValues: updatedNonNumberValues,
      handHistory: updatedHistory,
      gameLogs: newLogs
    }
    
    const gameOverCheck = checkGameOver(updatedNonNumberValues, newGameState.reshuffleCount)
    
    if (gameOverCheck.isOver) {
      newGameState = {
        ...newGameState,
        gameOver: true,
        gameOverReason: gameOverCheck.reason,
        gameOverTileId: gameOverCheck.tileId
      }
      newGameState.gameLogs.push(createLogEntry(
        `💀 GAME OVER! Final score: ${newScore}`,
        'info'
      ))
    } else {
      newGameState = drawNextHand(newGameState)
      newGameState.gameLogs.push(createLogEntry(
        `🃏 New hand drawn! Current hand value: ${newGameState.currentHand?.totalValue}`,
        'info'
      ))
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