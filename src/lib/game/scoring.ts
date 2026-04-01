import { Hand } from './types'
import { getTileValue } from './tileDeck'

export function calculateHandTotalValue(
  hand: Hand, 
  nonNumberValues: Map<string, number>
): number {
  return hand.tiles.reduce((sum, tile) => sum + getTileValue(tile, nonNumberValues), 0)
}

export function calculateBetResult(
  betType: 'higher' | 'lower',
  predictedValue: number,
  actualValue: number,
  currentScore: number
): { newScore: number; isWin: boolean; pointsChanged: number } {
  let isWin = false
  let pointsChanged = 0
  
  if (betType === 'higher' && actualValue > predictedValue) {
    isWin = true
    pointsChanged = actualValue
  } else if (betType === 'lower' && actualValue < predictedValue) {
    isWin = true
    pointsChanged = actualValue
  } else {
    isWin = false
    pointsChanged = -actualValue
  }
  
  return {
    newScore: currentScore + pointsChanged,
    isWin,
    pointsChanged
  }
}

export function shouldEndGame(
  nonNumberValues: Map<string, number>,
  reshuffleCount: number,
  maxReshuffles: number = 3
): { shouldEnd: boolean; reason?: 'tileValue' | 'reshuffleLimit'; tileId?: string } {
  // Check tile values
  for (const [tileId, value] of nonNumberValues.entries()) {
    if (value <= 0 || value >= 10) {
      return { shouldEnd: true, reason: 'tileValue', tileId }
    }
  }
  
  // Check reshuffle limit
  if (reshuffleCount >= maxReshuffles) {
    return { shouldEnd: true, reason: 'reshuffleLimit' }
  }
  
  return { shouldEnd: false }
}