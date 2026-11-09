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
  shoePhase?: string;
  supercomputerScore?: number;
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

import {
  getClientFallbackSourceStatus,
  getClientFallbackTableById,
  getClientFallbackTables,
  syncClientLiveTables,
} from './clientLiveEngine';

export const liveCasinoApi = {
  getTablesSync(): ApiLiveTable[] {
    return getClientFallbackTables();
  },

  async getTables(): Promise<ApiLiveTable[]> {
    try {
      const res = await fetch(`/api/tables?_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.status === 'ok' && Array.isArray(data.tables) && data.tables.length > 0) {
            syncClientLiveTables(data.tables);
            return data.tables;
          }
        }
      }
    } catch (e) {
      console.warn('API /api/tables request error, switching to real client fallback:', e);
    }
    return getClientFallbackTables();
  },

  async getRecommendedRooms(): Promise<ApiLiveTable[]> {
    try {
      const res = await fetch(`/api/recommended-rooms?_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.status === 'ok' && Array.isArray(data.rooms) && data.rooms.length > 0) {
            return data.rooms;
          }
        }
      }
    } catch (e) {
      console.warn('API /api/recommended-rooms error, switching to real client fallback:', e);
    }
    return getClientFallbackTables();
  },

  async getTableById(id: number | string): Promise<ApiLiveTable | null> {
    try {
      // First try query parameter (which works on all Vercel/Express setups without custom routing)
      const res = await fetch(`/api/tables?id=${id}&_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.status === 'ok' && data.table) {
            return data.table;
          }
        }
      }
    } catch (e) {
      // Fallback
    }

    try {
      const res = await fetch(`/api/tables/${id}?_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.status === 'ok' && data.table) {
            return data.table;
          }
        }
      }
    } catch (e) {
      console.warn(`API /api/tables/${id} error, switching to real client fallback:`, e);
    }

    return getClientFallbackTableById(id);
  },

  async getSourceStatus(): Promise<SourceStatus | null> {
    try {
      const res = await fetch(`/api/source-status?_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          return data;
        }
      }
    } catch (e) {
      console.warn('API /api/source-status error, switching to real client fallback:', e);
    }
    return getClientFallbackSourceStatus();
  },

  async forceSync(): Promise<boolean> {
    try {
      const res = await fetch(`/api/sync-live-sexy?_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          return data.status === 'ok';
        }
      }
    } catch (e) {
      console.warn('API /api/sync-live-sexy error:', e);
    }
    return true;
  },
};
