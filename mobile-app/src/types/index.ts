/**
 * API Types - Ported from whist-game/src/Constants.ts
 */

export interface User {
  id?: number;
  username: string;
}

export interface CallsGetRequest {
  roundno: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  player5?: number;
  player6?: number;
}

export interface CallsPostRequest {
  roundNo: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  player5?: number;
  player6?: number;
}

export interface TricksGetRequest {
  roundno: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  player5?: number;
  player6?: number;
}

export interface TricksPostRequest {
  roundNo: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  player5?: number;
  player6?: number;
}

export interface ScoresGetRequest {
  roundNo: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  player5?: number;
  player6?: number;
}

export interface DealerGetRequest {
  roundno: number;
  cards: number;
  dealerplayer: string;
}

export interface DealerPostRequest {
  firstToDeal: number;
}

export interface StatsGetRequest {
  accuracy: number;
  precision: number[];
  recall: number[];
  F1Score: number[];
}

// Game state types
export interface CellCoords {
  roundNo: number;
  player: string;
}

export interface MaxCallsTricksForCell {
  calls: number;
  tricks: number;
}

// Player card for setup
export class PlayerCard {
  username: string;

  constructor(playerName: string) {
    this.username = playerName;
  }
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  GameSetup: undefined;
  Game: undefined;
  EndGame: undefined;
  PlayerStats: { player: string };
  StatsMain: undefined;
};

export type TabParamList = {
  Home: undefined;
  GameTab: undefined;
  Stats: undefined;
  Rules: undefined;
};
