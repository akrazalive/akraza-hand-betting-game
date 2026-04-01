import { GameState, Hand, BetType, Tile } from './types'
import { 
  createFullDeck, 
  shuffleDeck, 
  initializeNonNumberTileValues,
  getTileValue
} from './tileDeck'
import { calculateHandTotalValue, calculateBetResult, shouldEndGame } from './scoring'

// Re-export calculateHandTotalValue so it can be imported from gameEngine
export { calculateHandTotalValue }

export function initializeGame(): GameState {
  const fullDeck = createFullDeck()
  const shuffledDeck = shuffleDeck(fullDeck)
  const nonNumberValues = initializeNonNumberTileValues(fullDeck)
  
  const initialHand = drawHand(shuffledDeck, 3, nonNumberValues)
  
  return {
    score: 1000,
    currentHand: initialHand,
    handHistory: [],
    drawPile: shuffledDeck.slice(initialHand.tiles.length),
    discardPile: [],
    reshuffleCount: 0,
    nonNumberTileValues: nonNumberValues,
    gameOver: false
  }
}

export function drawHand(deck: Tile[], count: number, nonNumberValues: Map<string, number>): Hand {
  const drawnTiles = deck.slice(0, count)
  const hand: Hand = { tiles: drawnTiles, totalValue: 0, isWin: false }
  const totalValue = calculateHandTotalValue(hand, nonNumberValues)
  
  return {
    tiles: drawnTiles,
    totalValue,
    isWin: false
  }
}

export function resolveBet(
  gameState: GameState,
  bet: BetType,
  actualHandValue: number
): { newScore: number; isWin: boolean; pointsChanged: number } {
  return calculateBetResult(
    bet.type,
    bet.predictedHandValue,
    actualHandValue,
    gameState.score
  )
}

export function updateNonNumberTileValues(
  hand: Hand,
  nonNumberValues: Map<string, number>,
  isWin: boolean
): Map<string, number> {
  const newValues = new Map(nonNumberValues)
  
  hand.tiles.forEach(tile => {
    if (tile.type !== 'number') {
      const currentValue = newValues.get(tile.id) || 5
      let newValue = currentValue
      
      if (isWin) {
        newValue = Math.min(currentValue + 1, 10)
      } else {
        newValue = Math.max(currentValue - 1, 0)
      }
      
      newValues.set(tile.id, newValue)
      // Update the tile's value reference
      tile.value = newValue
    }
  })
  
  return newValues
}

export function checkGameOver(
  nonNumberValues: Map<string, number>,
  reshuffleCount: number
): { isOver: boolean; reason?: 'tileValue' | 'reshuffleLimit'; tileId?: string } {
  const result = shouldEndGame(nonNumberValues, reshuffleCount)
  return {
    isOver: result.shouldEnd,
    reason: result.reason,
    tileId: result.tileId
  }
}

export function reshuffle(gameState: GameState): GameState {
  const newDrawPile = shuffleDeck([...gameState.discardPile, ...createFullDeck()])
  
  return {
    ...gameState,
    drawPile: newDrawPile,
    discardPile: [],
    reshuffleCount: gameState.reshuffleCount + 1
  }
}

// FIX: Remove history addition from drawNextHand
// Now it ONLY draws the next hand without modifying history
export function drawNextHand(gameState: GameState): GameState {
  if (gameState.drawPile.length < 3) {
    const reshuffledState = reshuffle(gameState)
    return drawNextHand(reshuffledState)
  }
  
  const newHand = drawHand(gameState.drawPile, 3, gameState.nonNumberTileValues)
  const remainingDrawPile = gameState.drawPile.slice(3)
  
  // IMPORTANT: Do NOT add currentHand to history here
  // History is only updated in resolveCurrentHand to prevent duplicates
  return {
    ...gameState,
    currentHand: newHand,
    drawPile: remainingDrawPile,
    // Keep history unchanged - no addition here
    handHistory: gameState.handHistory
  }
}