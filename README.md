# Hand Betting Game - Mahjong Tile Betting

A strategic betting game built with Next.js, TypeScript, and Supabase.

🔴 **Live Demo**: [https://bahrain-steel.vercel.app/](https://bahrain-steel.vercel.app/)

## Features

- 🎮 Bet on whether the next hand will be higher or lower
- 🀄 Dynamic Mahjong tile values that change based on wins/losses
- 📊 Real-time leaderboard with Supabase
- 🎨 Beautiful animations with Framer Motion
- 📱 Fully responsive design


## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React


## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a Supabase project and run the migration in `supabase/migrations/`
4. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
5. Run the development server: `npm run dev`

## AI Usage Note

This project was developed with assistance from AI for:
- Project structure and setup
- Game logic implementation
- Component architecture
- TypeScript type definitions

All code has been reviewed and tested.

Your Game Flow:
User clicks "New Game" → Game starts → Player bets → Resolves hand → Updates score → Game over → Save score

┌─────────────────────────────────────────────────────────────┐
│                    APP LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│ app/page.tsx          → Landing page (New Game button + Leaderboard)
│ app/game/page.tsx     → Game page (shows GameBoard)
│ app/api/scores/route.ts → Saves/loads scores from database
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENTS LAYER (UI)                      │
├─────────────────────────────────────────────────────────────┤
│ GameBoard.tsx         → Main game screen (bets, resolve, animations)
│ Tile.tsx              → Single tile display with animations
│ HandHistory.tsx       → Shows previous hands
│ GameOverModal.tsx     → Popup when game ends
│ GameLog.tsx           → Shows game events log
│ WarningPopup.tsx      → Error messages (like invalid bet)
│ Leaderboard.tsx       → Shows top 5 scores
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    HOOKS LAYER (Logic)                      │
├─────────────────────────────────────────────────────────────┤
│ useGame.ts            → Manages game state, connects UI to engine
│                         - placeBet(), resolveCurrentHand()
│                         - resetGame(), tracks score
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    LIB LAYER (Core Rules)                   │
├─────────────────────────────────────────────────────────────┤
│ gameEngine.ts         → Main game rules:
│                         - initializeGame() starts game
│                         - drawNextHand() gets new tiles
│                         - reshuffle() when deck empty
│                         - checkGameOver() checks end conditions
│
│ scoring.ts            → Math rules:
│                         - calculateHandTotalValue()
│                         - calculateBetResult() (win/loss)
│                         - shouldEndGame() (tile values 0/10, reshuffle 3x)
│
│ tileDeck.ts           → Tile creation:
│                         - createFullDeck() makes 136 tiles
│                         - shuffleDeck() randomizes
│                         - getTileValue() returns tile points
│
│ types.ts              → Defines data shapes (Tile, Hand, GameState)
│
│ soundService.ts       → Plays win/lose/bet sounds
│ supabase/client.ts    → Database connection for leaderboard
└─────────────────────────────────────────────────────────────┘

🔄 How Data Flows (Simple Example)
User clicks "Bet Higher":

GameBoard.tsx calls handlePlaceBet('higher')

→ Calls placeBet() from useGame.ts

→ Saves bet type and predicted value

User clicks "Resolve Hand":

GameBoard.tsx calls handleResolve()

→ Calls resolveCurrentHand() from useGame.ts

→ useGame.ts calls resolveBet() from scoring.ts to calculate win/loss

→ Calls updateNonNumberTileValues() from gameEngine.ts to update tile values

→ Calls checkGameOver() to see if game should end

→ Calls drawNextHand() for new tiles if game continues

→ Updates state, UI re-renders automatically
