import { Tile } from './types'

const NUMBER_SUITS = ['dots', 'bamboo', 'characters'] as const
const DRAGONS: string[] = ['red', 'green', 'white']
const WINDS: string[] = ['east', 'south', 'west', 'north']

let tileIdCounter = 0

function generateId(): string {
  return `tile_${Date.now()}_${tileIdCounter++}`
}

export function createNumberTiles(): Tile[] {
  const tiles: Tile[] = []
  for (const suit of NUMBER_SUITS) {
    for (let value = 1; value <= 9; value++) {
      for (let i = 0; i < 4; i++) {
        tiles.push({
          id: generateId(),
          type: 'number',
          suit,
          value,
          displayValue: value.toString(),
          sortOrder: value
        })
      }
    }
  }
  return tiles
}

export function createNonNumberTiles(): Tile[] {
  const tiles: Tile[] = []
  
  for (const dragon of DRAGONS) {
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: generateId(),
        type: 'dragon',
        suit: 'dragon',
        value: 5,
        displayValue: dragon,
        sortOrder: 10 + DRAGONS.indexOf(dragon)
      })
    }
  }
  
  for (const wind of WINDS) {
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: generateId(),
        type: 'wind',
        suit: 'wind',
        value: 5,
        displayValue: wind,
        sortOrder: 20 + WINDS.indexOf(wind)
      })
    }
  }
  
  return tiles
}

export function createFullDeck(): Tile[] {
  return [...createNumberTiles(), ...createNonNumberTiles()]
}

export function shuffleDeck(deck: Tile[]): Tile[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function initializeNonNumberTileValues(deck: Tile[]): Map<string, number> {
  const valueMap = new Map<string, number>()
  deck.forEach(tile => {
    if (tile.type !== 'number') {
      valueMap.set(tile.id, 5)
    }
  })
  return valueMap
}

export function getTileValue(tile: Tile, nonNumberValues: Map<string, number>): number {
  if (tile.type === 'number') {
    return tile.value
  }
  return nonNumberValues.get(tile.id) || 5
}