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

## Project Structure

├───app
│   │   globals.css
│   │   layout.tsx
│   │   page.tsx
│   │
│   ├───api
│   │   └───scores
│   │           route.ts
│   │
│   ├───game
│   │       page.tsx
│   │
│   └───test-supabase
│           page.tsx
│
├───components
│   ├───game
│   │       GameBoard.tsx
│   │       GameLog.tsx
│   │       GameOverModal.tsx
│   │       HandHistory.tsx
│   │       Tile.tsx
│   │
│   ├───landing
│   │       Leaderboard.tsx
│   │
│   └───ui
│           WarningPopup.tsx
│
├───hooks
│       useGame.ts
│
└───lib
    ├───game
    │       gameEngine.ts
    │       scoring.ts
    │       tileDeck.ts
    │       types.ts
    │
    ├───sound
    │       soundService.ts
    │
    └───supabase
            client.ts