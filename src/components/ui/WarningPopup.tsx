'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface WarningPopupProps {
  message: string
  isVisible: boolean
  onClose: () => void
  autoHideDuration?: number
}

export default function WarningPopup({ 
  message, 
  isVisible, 
  onClose, 
  autoHideDuration = 2000 
}: WarningPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -100 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl shadow-2xl p-6 min-w-[300px] sm:min-w-[400px]">
              <motion.div
                animate={{ 
                  rotate: [0, -15, 15, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6 }}
                className="text-center mb-4"
              >
                <div className="text-7xl mb-2">⚠️</div>
                <div className="text-3xl font-bold">Warning!</div>
              </motion.div>
              
              <p className="text-center text-lg font-medium mb-6">
                {message}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition"
              >
                Got it
              </motion.button>
              
              {/* Progress Ring */}
              <motion.div
                initial={{ pathLength: 1 }}
                animate={{ pathLength: 0 }}
                transition={{ duration: autoHideDuration / 1000, ease: "linear" }}
                className="absolute bottom-3 right-3 w-8 h-8"
              >
                <svg viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{ duration: autoHideDuration / 1000, ease: "linear" }}
                    style={{ rotate: -90 }}
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}