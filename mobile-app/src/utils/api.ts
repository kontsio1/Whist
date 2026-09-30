import axios from 'axios';
import {
  User,
  CallsGetRequest,
  CallsPostRequest,
  TricksGetRequest,
  TricksPostRequest,
  ScoresGetRequest,
  DealerGetRequest,
  DealerPostRequest,
  StatsGetRequest,
} from '../types';

// Configure base URL - update this for your environment
// For iOS simulator: http://localhost:8080
// For Android emulator: http://10.0.2.2:8080
// For physical device: use your computer's local IP
const BASE_URL = __DEV__ 
  ? 'http://localhost:8080'  // Change to your local IP for physical device testing
  : 'https://your-production-url.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  postUsers: async (users: User[]): Promise<string[]> => {
    const response = await api.post('/users', users);
    return response.data;
  },
};

export const callsService = {
  getCalls: async (): Promise<CallsGetRequest[]> => {
    const response = await api.get('/calls');
    return response.data;
  },

  postCall: async (call: CallsPostRequest): Promise<void> => {
    await api.post('/call', call);
  },
};

export const tricksService = {
  getTricks: async (): Promise<TricksGetRequest[]> => {
    const response = await api.get('/tricks');
    return response.data;
  },

  postTrick: async (trick: TricksPostRequest): Promise<void> => {
    await api.post('/trick', trick);
  },
};

export const scoresService = {
  getScores: async (): Promise<ScoresGetRequest[]> => {
    const response = await api.get('/scores');
    return response.data;
  },
};

export const dealerService = {
  getDealers: async (): Promise<DealerGetRequest[]> => {
    const response = await api.get('/dealer');
    return response.data;
  },

  postFirstDealer: async (dealer: DealerPostRequest): Promise<string> => {
    const response = await api.post('/dealer', dealer);
    return response.data;
  },
};

export const statsService = {
  getPlayerStats: async (player: string): Promise<StatsGetRequest> => {
    const response = await api.get(`/stats/${player}`);
    return response.data;
  },
};

export default api;

