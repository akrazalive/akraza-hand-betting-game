export type TileSuit = 'dots' | 'bamboo' | 'characters' | 'dragon' | 'wind'
export type TileType = 'number' | 'dragon' | 'wind'
export type DragonType = 'red' | 'green' | 'white'
export type WindType = 'east' | 'south' | 'west' | 'north'

export interface Tile {
  id: string
  type: TileType
  suit: TileSuit
  value: number
  displayValue: string
  sortOrder: number
}

export interface Hand {
  tiles: Tile[]
  totalValue: number
  isWin: boolean
}

export interface GameState {
  score: number
  currentHand: Hand | null
  handHistory: Hand[]
  drawPile: Tile[]
  discardPile: Tile[]
  reshuffleCount: number
  nonNumberTileValues: Map<string, number>
  gameOver: boolean
  gameOverReason?: 'tileValue' | 'reshuffleLimit'
  gameOverTileId?: string
}

export interface BetType {
  type: 'higher' | 'lower'
  predictedHandValue: number
}

export interface ScoreEntry {
  id?: string
  player_name: string
  score: number
  created_at?: string
}