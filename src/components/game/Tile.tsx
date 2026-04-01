'use client'

import { Tile as TileType } from '@/lib/game/types'
import { motion, AnimatePresence } from 'framer-motion'

interface TileProps {
  tile: TileType
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  onClick?: () => void
  delay?: number
}

const sizeClasses = {
  sm: 'w-14 h-20 text-xs',
  md: 'w-20 h-28 text-sm',
  lg: 'w-24 h-32 text-base'
}

export default function Tile({ tile, size = 'md', showValue = true, onClick, delay = 0 }: TileProps) {
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
      if (tile.suit === 'dots') return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
      if (tile.suit === 'bamboo') return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
      return 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
    }
    return 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      transition={{ 
        duration: 0.3, 
        delay,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.2 } }}
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
      <motion.div 
        className="text-2xl sm:text-3xl"
        animate={{ scale: showValue ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {getTileSymbol()}
      </motion.div>
      {showValue && (
        <motion.div 
          className="absolute bottom-1 right-1 text-xs font-semibold bg-white/50 px-1 rounded"
          animate={tile.type !== 'number' ? { 
            scale: [1, 1.2, 1],
            color: ['#000', '#3b82f6', '#000']
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {tile.value}
        </motion.div>
      )}
    </motion.div>
  )
}