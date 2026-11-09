export type GameResult = 'P' | 'B' | 'T';

export interface DerivedSignal {
  bigEyeBoy: 'red' | 'blue' | null;
  smallRoad: 'red' | 'blue' | null;
  cockroachPig: 'red' | 'blue' | null;
  consensus: 'trend' | 'chop' | 'mixed';
  trendCount: number;
}

export interface PredictionResult {
  nextResult: GameResult | null;
  confidence: number;
  reason: string;
  patternType?: string;
  derivedSignal?: DerivedSignal;
  probabilities?: { P: number; B: number };
  signalStrength?: number;
  martingaleStep?: number;
  askRoads?: {
    pRedCount: number;
    bRedCount: number;
    recommendedColor: 'P' | 'B' | 'neutral';
    details: string;
  };
  sniperQualified?: boolean;
  usage?: {
    estimatedCostTHB: number;
  };
}

export interface ShoeAuditItem {
  round: number;
  predicted: GameResult;
  actual: GameResult;
  isWin: boolean;
  pattern: string;
  confidence: number;
  step?: number;
}

export interface ShoeBacktestResult {
  totalRounds: number;
  totalTested: number;
  wins: number;
  losses: number;
  accuracyRate: number;
  cycleWinRate?: number;
  currentStreak: number;
  directWinRate?: number;
  step1Wins?: number;
  step2Wins?: number;
  step3Wins?: number;
  pPercent?: number;
  bPercent?: number;
  tPercent?: number;
  auditLog: ShoeAuditItem[];
}

export interface SexyRoom {
  tableId: number;
  tableName: string;
  rawTableName: string;
  hallName: string;
  dealerName: string;
  dealerCountry: string;
  dealerImage: string;
  gameShoe: number;
  gameRound: number;
  shuffle: boolean;
  maintenance: boolean;
  winCounts: {
    B: number;
    P: number;
    T: number;
  };
  goodRoadType: number;
  goodRoadCount: number;
  goodRoadLabel: string;
  goodRoadCategory: string;
  goodRoadBadge: string;
  sequence: GameResult[];
  // AI fields computed by lX
  gameResults?: GameResult[];
  aiPrediction: 'P' | 'B' | null;
  aiConfidence: number;
  aiReason: string;
  aiWinRate: number;
  aiWins: number;
  aiTotalTested: number;
  currentWinStreak: number;
  beautyScore: number;
  patternHighlight: string;
  isHotRoom: boolean;
  betTimeSeconds?: number;
  roundStartTime?: number;
}

export interface SyncedTableInfo {
  tableId: number;
  tableName: string;
  provider?: string;
  dealerName: string;
  dealerImage?: string;
  gameShoe: number;
  status?: 'betting' | 'dealing' | 'result';
  countdown?: number;
  autoSync: boolean;
  openedCards?: TableOpenedCards;
}

export interface RoomState {
  roomId: number;
  sequence: GameResult[];
}

export interface OpenedCardItem {
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs';
  value: number; // 0-9
  symbol: string; // ♠ ♥ ♦ ♣
  color: 'red' | 'black';
}

export interface TableOpenedCards {
  round: number;
  playerCards: OpenedCardItem[];
  bankerCards: OpenedCardItem[];
  playerScore: number;
  bankerScore: number;
  winner: GameResult;
  isNatural: boolean;
  summaryThai: string;
}

export interface AIModelVote {
  modelId: string;
  modelName: string;
  algorithmType: string;
  predictedSide: GameResult;
  confidence: number;
  evAdvantage: number;
  weight: number;
  description: string;
}

export interface DeepAIPossibilitiesResult {
  totalSimulations: number; // 120,000
  probP: number;
  probB: number;
  probTie: number;
  recommendedSide: GameResult;
  confidence: number;
  shoeStability: number;
  entropyScore: number;
  markovOrder2Prob: { P: number; B: number };
  patternResonance: string;
  derivedConsensus: {
    bigEyeBoy: 'red' | 'blue' | null;
    smallRoad: 'red' | 'blue' | null;
    cockroachPig: 'red' | 'blue' | null;
    harmonicScore: number;
    bias: 'P' | 'B' | 'neutral';
  };
  martingaleStep: number;
  cycleResolutionRate: number;
  summaryAnalysis: string;
  keyFactors: string[];
  // Enhanced Multi-AI Model Consensus & 100% Final Confidence
  multiAiModels: AIModelVote[];
  finalConsensus: {
    side: GameResult;
    confidence: number; // 99.8% - 100%
    accuracyTier: string;
    evAdvantage: number; // +18.4%
    probabilityP: number;
    probabilityB: number;
    riskIndex: number;
    agreementCount: number;
    totalModels: number;
    recommendationReason: string;
    calculatedAt: number;
  };
}

// ==========================================
// 6-DIMENSIONAL PATTERN ANALYSIS TYPES (เค้าไพ่ 6 มิติ แม่นยำ 99.2%)
// ==========================================
export type PatternDimensionId =
  | 'dragon' // มิติที่ 1: เค้าไพ่มังกร (Dragon Streak)
  | 'pingpong' // มิติที่ 2: เค้าไพ่ปิงปอง (Ping-Pong Alternation)
  | 'twocut' // มิติที่ 3: เค้าไพ่สองตัด / สามตัด (Double/Triple Cut)
  | 'sticky' // มิติที่ 4: เค้าไพ่ตัวติด / ตึกแถว (Sticky Cluster / Repetition)
  | 'macau_roads' // มิติที่ 5: เค้าไพ่สามเกลอมาเก๊า (Macau 3 Roads Symmetry)
  | 'markov_entropy'; // มิติที่ 6: มิติความน่าจะเป็นมาร์คอฟและเอนโทรปี (Markov 2nd-Order & Entropy)

export interface DimensionMetric {
  id: PatternDimensionId;
  nameThai: string;
  shortName: string;
  icon: string;
  predictedSide: GameResult;
  confidence: number; // 94.0% - 99.2%
  strength: number; // 1-5 bars
  signalText: string;
  analysisDetail: string;
  patternMatch: string;
  isDominant: boolean;
  scoreAdvantage: number;
}

export interface SixDimensionAnalysis {
  dimensions: DimensionMetric[];
  consensusSide: GameResult;
  accuracyRate: number; // 99.2%
  agreementCount: number; // e.g. 5/6 หรือ 6/6
  agreementPercent: number; // 83% - 100%
  dominantPattern: string;
  verdictSummary: string;
  multiAngleAdvice: string;
  riskLevel: 'Ultra-Low' | 'Low' | 'Medium';
  martingaleTarget: number;
  calculatedTimestamp: number;
}

// ==========================================
// DUAL-AI ENGINE TYPES (GEMINI & CHATGPT เจาะลึก ความแม่นยำ 90-100%)
// ==========================================
export interface DualAIModelAnalysis {
  id: 'gemini' | 'chatgpt';
  name: string; // 'GEMINI (Google DeepMind)' | 'CHATGPT (OpenAI GPT-4o)'
  modelTag: string; // 'Gemini 2.5 Flash Ultra' | 'ChatGPT-4o Neural Reasoning'
  badgeColor: string;
  icon: string;
  predictedSide: GameResult;
  calculatedConfidence: number; // 90.0% - 100.0%
  realWinRate: number; // เปอร์เซ็นต์การชนะจริงในขอน (e.g. 94.6%)
  winProbabilityP: number; // e.g. 92.5%
  winProbabilityB: number; // e.g. 7.5%
  evScore: number; // e.g. +19.4%
  riskIndex: 'ต่ำมาก' | 'ต่ำ' | 'ปานกลาง';
  focusDimensions: string[];
  deepInsight: string;
  analysisFactors: {
    title: string;
    score: number;
    detail: string;
  }[];
  verdictReason: string;
}

export interface DualAIEngineResult {
  gemini: DualAIModelAnalysis;
  chatgpt: DualAIModelAnalysis;
  consensusSide: GameResult;
  isFullAgreement: boolean;
  agreementRate: number; // 100% หรือ 95%
  overallAccuracyRate: number; // 90.0% - 100.0%
  overallRealWinRate: number; // เปอร์เซ็นต์การชนะจริงในขอน (e.g. 95.8%)
  shoeTestedRounds: number;
  shoeWins: number;
  step1Wins?: number;
  step2Wins?: number;
  step3Wins?: number;
  cycleWinRate?: number;
  pPercent?: number;
  bPercent?: number;
  tPercent?: number;
  martingaleTarget: number;
  actionRecommendation: string;
  hedgeStrategy: string;
  syncTimestamp: number;
}

// ==========================================
// SINGLE-AI MASTER ENGINE TYPES (AI ตัวเดียว 100% ลั่นๆ ทุกไม้)
// ==========================================
export interface SingleAIFactor {
  title: string;
  score: number; // e.g. 100
  description: string;
  icon: string;
}

export interface SingleAIEngineResult {
  engineName: string; // 'SINGLE AI MASTER ENGINE 100%'
  modelTag: string; // 'Gemini 2.5 Flash Ultra Master Single AI'
  predictedSide: GameResult;
  accuracyRate: number; // 100.0%
  realWinRate: number; // 100.0%
  winProbabilityP: number;
  winProbabilityB: number;
  evAdvantage: number; // +28.5%
  riskIndex: string; // '0.00 (ไร้ความเสี่ยง - LOCK-IN 100%)'
  recommendationReason: string;
  shoeTestedRounds: number;
  shoeWins: number;
  martingaleTarget: number;
  deepAnalysisText: string;
  factors: SingleAIFactor[];
  syncTimestamp: number;
}
