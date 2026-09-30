import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  User,
  CallsGetRequest,
  TricksGetRequest,
  ScoresGetRequest,
  DealerGetRequest,
  CallsPostRequest,
  TricksPostRequest,
  DealerPostRequest,
  PlayerCard,
} from '../types';
import {
  userService,
  callsService,
  tricksService,
  scoresService,
  dealerService,
} from '../utils/api';

interface GameContextType {
  // Player setup state
  players: PlayerCard[];
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  clearPlayers: () => void;

  // Active game state
  activeUsers: User[];
  playerCalls: CallsGetRequest[];
  playerTricks: TricksGetRequest[];
  playerScores: ScoresGetRequest[];
  dealerAndCards: DealerGetRequest[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  startGame: () => Promise<boolean>;
  refreshGameData: () => Promise<void>;
  submitCall: (roundNo: number, player: string, value: number) => Promise<boolean>;
  submitTrick: (roundNo: number, player: string, value: number) => Promise<boolean>;
  setFirstDealer: (playerId: number) => Promise<boolean>;
  loadExistingGame: () => Promise<boolean>;
  
  // Total scores calculation
  totalScores: number[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Setup state
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  
  // Game state
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [playerCalls, setPlayerCalls] = useState<CallsGetRequest[]>([]);
  const [playerTricks, setPlayerTricks] = useState<TricksGetRequest[]>([]);
  const [playerScores, setPlayerScores] = useState<ScoresGetRequest[]>([]);
  const [dealerAndCards, setDealerAndCards] = useState<DealerGetRequest[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add player to setup
  const addPlayer = useCallback((name: string) => {
    if (players.length < 6 && name.trim()) {
      setPlayers((prev) => [...prev, new PlayerCard(name.trim())]);
    }
  }, [players.length]);

  // Remove player from setup
  const removePlayer = useCallback((index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all players
  const clearPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  // Start a new game
  const startGame = useCallback(async (): Promise<boolean> => {
    if (players.length < 2) {
      setError('Need at least 2 players to start');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const usersRequest = players.map((p) => ({ username: p.username }));
      await userService.postUsers(usersRequest);
      
      // Load the game data
      const users = await userService.getUsers();
      setActiveUsers(users);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to start game');
      setIsLoading(false);
      return false;
    }
  }, [players]);

  // Load existing game
  const loadExistingGame = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const users = await userService.getUsers();
      if (users.length === 0) {
        setIsLoading(false);
        return false;
      }
      
      setActiveUsers(users);
      await refreshGameData();
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('No existing game found');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Refresh all game data
  const refreshGameData = useCallback(async () => {
    try {
      const [calls, tricks, scores, dealers] = await Promise.all([
        callsService.getCalls(),
        tricksService.getTricks(),
        scoresService.getScores(),
        dealerService.getDealers(),
      ]);

      setPlayerCalls(calls);
      setPlayerTricks(tricks);
      setPlayerScores(scores);
      setDealerAndCards(dealers);
    } catch (err) {
      console.error('Failed to refresh game data:', err);
    }
  }, []);

  // Submit a call
  const submitCall = useCallback(async (
    roundNo: number,
    player: string,
    value: number
  ): Promise<boolean> => {
    try {
      const callData: CallsPostRequest = { roundNo, [player]: value };
      await callsService.postCall(callData);
      await refreshGameData();
      return true;
    } catch (err) {
      setError('Failed to submit call');
      return false;
    }
  }, [refreshGameData]);

  // Submit a trick
  const submitTrick = useCallback(async (
    roundNo: number,
    player: string,
    value: number
  ): Promise<boolean> => {
    try {
      const trickData: TricksPostRequest = { roundNo, [player]: value };
      await tricksService.postTrick(trickData);
      await refreshGameData();
      return true;
    } catch (err) {
      setError('Failed to submit trick');
      return false;
    }
  }, [refreshGameData]);

  // Set first dealer
  const setFirstDealer = useCallback(async (playerId: number): Promise<boolean> => {
    try {
      const dealerData: DealerPostRequest = { firstToDeal: playerId };
      await dealerService.postFirstDealer(dealerData);
      await refreshGameData();
      return true;
    } catch (err) {
      setError('Failed to set dealer');
      return false;
    }
  }, [refreshGameData]);

  // Calculate total scores
  const totalScores = React.useMemo(() => {
    if (playerScores.length === 0 || activeUsers.length === 0) {
      return Array(activeUsers.length).fill(0);
    }

    const sortedScores = [...playerScores].sort((a, b) => a.roundNo - b.roundNo);
    const playerKeys = activeUsers.map((_, i) => `player${i + 1}`);

    return playerKeys.map((key) =>
      sortedScores.reduce((acc, score) => {
        const val = score[key as keyof ScoresGetRequest];
        return acc + (typeof val === 'number' ? val : 0);
      }, 0)
    );
  }, [playerScores, activeUsers]);

  const value: GameContextType = {
    players,
    addPlayer,
    removePlayer,
    clearPlayers,
    activeUsers,
    playerCalls,
    playerTricks,
    playerScores,
    dealerAndCards,
    isLoading,
    error,
    startGame,
    refreshGameData,
    submitCall,
    submitTrick,
    setFirstDealer,
    loadExistingGame,
    totalScores,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

