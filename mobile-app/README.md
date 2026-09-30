# Whist Mobile App

A React Native mobile app for tracking Whist card game scores. Built with Expo and designed with a modern, mobile-first user experience.

## 🎮 Features

- **Game Setup**: Add 2-6 players with a clean, card-based interface
- **Score Tracking**: Record calls, tricks, and view calculated scores
- **Statistics**: Analyze player performance with radar charts and detailed metrics
- **Rules Reference**: Accordion-style rules guide with all game information

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React Context
- **Animations**: React Native Reanimated + Gesture Handler
- **Charts**: Victory Native
- **UI Components**: Custom components with Haptic feedback
- **Icons**: Expo Vector Icons (Ionicons)

## 📱 Screens

1. **Home** - Landing screen with start game action
2. **Game Setup** - Add players, select dealer
3. **Game Screen** - Main game with round cards and score bubbles
4. **End Game** - Winner display with final standings
5. **Statistics** - Player list for detailed stats
6. **Player Stats** - Individual performance metrics with radar chart
7. **Rules** - Complete game rules in accordion sections

## 🎨 Color Scheme

Based on the original web app palette:
- Primary: `#046865` (Teal)
- Secondary: `#97d8c4` (Mint)
- Accent: `#694873` (Purple)
- Highlight: `#dcccff` (Lavender)
- Dark: `#100b00` (Near black)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or Expo Go app

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

### Backend Connection

Update the API base URL in `src/utils/api.ts`:

```typescript
// For iOS Simulator
const BASE_URL = 'http://localhost:8080';

// For Android Emulator
const BASE_URL = 'http://10.0.2.2:8080';

// For physical device - use your computer's local IP
const BASE_URL = 'http://192.168.x.x:8080';
```

## 📁 Project Structure

```
mobile-app/
├── App.tsx                 # Main entry point
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── PlayerCard.tsx
│   │   ├── ScoreBubble.tsx
│   │   ├── RoundCard.tsx
│   │   ├── CallsTricksSheet.tsx
│   │   └── SkeletonLoader.tsx
│   ├── screens/            # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── GameSetupScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── EndGameScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── PlayerStatsScreen.tsx
│   │   └── RulesScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── context/            # React Context providers
│   │   └── GameContext.tsx
│   ├── theme/              # Colors, spacing, typography
│   │   ├── colors.ts
│   │   └── spacing.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utilities and API
│       ├── api.ts
│       └── helpers.ts
└── assets/                 # Images and fonts
```

## 🔗 API Endpoints

The app connects to the existing Whist backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all players |
| POST | `/users` | Add players (start game) |
| GET | `/scores` | Get round scores |
| GET | `/calls` | Get player calls |
| POST | `/call` | Submit a call |
| GET | `/tricks` | Get tricks won |
| POST | `/trick` | Submit tricks |
| GET | `/dealer` | Get dealer rotation |
| POST | `/dealer` | Set first dealer |
| GET | `/stats/:player` | Get player statistics |

## 📝 License

Same as the main Whist project.

