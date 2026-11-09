import { GameResult, TableOpenedCards } from '../types/laidonjo';

export interface ApiLiveTable {
  id: number;
  tableCode: string;
  provider: 'Sexy Baccarat';
  tableName: string;
  hallName: 'Sexy Classic' | 'Sexy Asia' | 'Sexy Speed' | 'Sexy VIP' | 'Sexy Insurance';
  dealerName: string;
  dealerCountry: string;
  dealerImage: string;
  gameShoe: number;
  gameRound: number;
  status: 'betting' | 'dealing' | 'result';
  countdown: number;
  betTimeSeconds: number;
  sequence: GameResult[];
  winCounts: { P: number; B: number; T: number };
  winRate: number;
  cycleWinRate: number;
  beautyScore: number;
  patternHighlight: string;
  goodRoadCategory: 'streak' | 'chop' | 'mixed';
  isHotRoom: boolean;
  aiPrediction: 'P' | 'B';
  aiConfidence: number;
  aiReason: string;
  martingaleStep: number;
  currentStreak?: number;
  realWins?: number;
  realTotalTested?: number;
  directWinRate?: number;
  cycleWins?: number;
  cycleTotal?: number;
  pPercent?: number;
  bPercent?: number;
  tPercent?: number;
  step1Wins?: number;
  step2Wins?: number;
  step3Wins?: number;
  lastUpdated: number;
  isLiveStream?: boolean;
  openedCards?: TableOpenedCards;
}

export interface SourceStatus {
  status: string;
  connection: 'connected' | 'connecting' | 'warning' | 'fallback';
  sourceUrl: string;
  cdnUrl: string;
  upstreamGateway: string;
  totalRooms: number;
  activeRooms: number;
  lastSyncTime: number;
  errorMessage: string | null;
  serverTime: number;
}

export const liveCasinoApi = {
  async getTables(): Promise<ApiLiveTable[]> {
    try {
      const res = await fetch(`/api/tables?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.tables)) {
          return data.tables;
        }
      }
    } catch (e) {
      console.warn('API /api/tables request error:', e);
    }
    return [];
  },

  async getRecommendedRooms(): Promise<ApiLiveTable[]> {
    try {
      const res = await fetch(`/api/recommended-rooms?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.rooms)) {
          return data.rooms;
        }
      }
    } catch (e) {
      console.warn('API /api/recommended-rooms request error:', e);
    }
    return [];
  },

  async getTableById(id: number): Promise<ApiLiveTable | null> {
    try {
      const res = await fetch(`/api/tables/${id}?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && data.table) {
          return data.table;
        }
      }
    } catch (e) {
      console.warn(`API /api/tables/${id} request error:`, e);
    }
    return null;
  },

  async getSourceStatus(): Promise<SourceStatus | null> {
    try {
      const res = await fetch(`/api/source-status?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('API /api/source-status request error:', e);
    }
    return null;
  },

  async forceSync(): Promise<boolean> {
    try {
      const res = await fetch(`/api/sync-live-sexy?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        return data.status === 'ok';
      }
    } catch (e) {
      console.warn('API /api/sync-live-sexy request error:', e);
    }
    return false;
  },
};
