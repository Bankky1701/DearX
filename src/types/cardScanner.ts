export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type CardEdgeType =
  | '0-edge' // ไพ่ไม่มีขอบ / หน้ากริ่ง (A)
  | '1-edge' // 2, 3
  | '2-edge' // 2 ขอบ (4, 5)
  | '3-edge' // 3 ขอบ (6, 7, 8)
  | '4-edge' // 4 ขอบ (9, 10)
  | 'picture'; // ไพ่รูปภาพ / หัวกลวง (J, Q, K - 0 แต้ม)

export interface ScannedCard {
  id: string;
  suit: CardSuit;
  rank: CardRank;
  value: number; // 0 - 9 points in Baccarat
  edgeType: CardEdgeType;
  edgeLabelThai: string;
  isFaceDown: boolean;
  revealed: boolean;
  scanConfidence: number; // 96.5% - 99.9%
  color: 'red' | 'black';
  pipCount?: number;
  notes?: string;
}

export interface LiveRoundCards {
  tableId: number;
  tableCode: string;
  tableName: string;
  dealerName: string;
  gameShoe: number;
  gameRound: number;
  status: 'betting' | 'dealing' | 'peeking' | 'result';
  countdown: number;
  playerCards: ScannedCard[];
  bankerCards: ScannedCard[];
  playerTotal: number;
  bankerTotal: number;
  playerNeedsThirdCard: boolean;
  bankerNeedsThirdCard: boolean;
  winner: 'P' | 'B' | 'T' | null;
  winnerLabelThai: string;
  isNatural: boolean;
  hiddenCardsCount: number;
  shoeRemainingCards: {
    totalRemaining: number;
    burnedCount: number;
    rankDistribution: Record<string, number>;
  };
  telemetryTime: number;
}

export interface ImageScanResult {
  detectedCards: {
    side: 'Player' | 'Banker';
    cardIndex: number;
    rank: CardRank;
    suit: CardSuit;
    value: number;
    edgeType: string;
    confidence: number;
    boundingBox?: { x: number; y: number; w: number; h: number };
  }[];
  playerPoints: number;
  bankerPoints: number;
  projectedWinner: 'P' | 'B' | 'T';
  thirdCardAdvantage: string;
  analysisTimeMs: number;
  rawImagePreview?: string;
}
