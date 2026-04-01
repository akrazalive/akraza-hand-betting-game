'use client'

import { Tile as TileType } from '@/lib/game/types'
import { motion } from 'framer-motion'

interface TileProps {
  tile: TileType
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-12 h-16 text-xs',
  md: 'w-16 h-20 text-sm',
  lg: 'w-20 h-24 text-base'
}

export default function Tile({ tile, size = 'md', showValue = true, onClick }: TileProps) {
  const getTileSymbol = () => {
    switch (tile.suit) {
      case 'dots':
        return `● ${tile.displayValue}`
      case 'bamboo':
        return `│ ${tile.displayValue}`
      case 'characters':
        return `萬 ${tile.displayValue}`
      case 'dragon':
        const dragonSymbol = tile.displayValue === 'red' ? '中' : tile.displayValue === 'green' ? '發' : '白'
        return dragonSymbol
      case 'wind':
        const windSymbol: Record<string, string> = {
          east: '東',
          south: '南',
          west: '西',
          north: '北'
        }
        return windSymbol[tile.displayValue] || tile.displayValue
      default:
        return tile.displayValue
    }
  }

  const getTileColor = () => {
    if (tile.type === 'number') {
      if (tile.suit === 'dots') return 'bg-blue-100 border-blue-400 text-blue-800'
      if (tile.suit === 'bamboo') return 'bg-green-100 border-green-400 text-green-800'
      return 'bg-red-100 border-red-400 text-red-800'
    }
    return 'bg-purple-100 border-purple-400 text-purple-800'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]}
        ${getTileColor()}
        relative rounded-lg border-2 shadow-md
        flex flex-col items-center justify-center
        font-bold cursor-pointer transition-all
      `}
      onClick={onClick}
    >
      <div className="text-2xl">{getTileSymbol()}</div>
      {showValue && (
        <div className="absolute bottom-1 right-1 text-xs font-semibold">
          {tile.value}
        </div>
      )}
    </motion.div>
  )
}