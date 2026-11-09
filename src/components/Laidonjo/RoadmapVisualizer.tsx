import React, { useEffect, useRef } from 'react';
import { GameResult } from '../../types/laidonjo';
import { AT } from '../../utils/baccaratEngine';
import { CHIP_IMAGES } from '../../constants/chips';

interface RoadmapVisualizerProps {
  history: GameResult[];
}

export const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({ history }) => {
  const beadScrollRef = useRef<HTMLDivElement>(null);
  const bigScrollRef = useRef<HTMLDivElement>(null);

  // 1. Bead Plate calculation (6 rows x 14 columns = 84 slots for smoother long shoes)
  const beadRows = 6;
  const beadCols = Math.max(12, Math.ceil(history.length / beadRows) + 2);
  const beadGrid: (GameResult | null)[][] = Array.from({ length: beadRows }, () =>
    Array(beadCols).fill(null)
  );

  history.forEach((card, idx) => {
    const col = Math.floor(idx / beadRows);
    const row = idx % beadRows;
    if (col < beadCols) {
      beadGrid[row][col] = card;
    }
  });

  // 2. Big Road (Da Lu) calculation (6 rows x flexible columns)
  const bigCols = 20;
  const bigGrid: ({ color: 'P' | 'B'; tieCount: number } | null)[][] = Array.from(
    { length: 6 },
    () => Array(bigCols).fill(null)
  );

  let currentCol = 0;
  let currentRow = 0;
  let lastOutcome: 'P' | 'B' | null = null;
  let tiesOnLast = 0;

  for (const item of history) {
    if (item === AT.TIE) {
      tiesOnLast++;
      if (lastOutcome !== null && currentCol < bigCols && currentRow < 6) {
        const existing = bigGrid[currentRow][currentCol];
        if (existing) {
          existing.tieCount = tiesOnLast;
        }
      }
    } else {
      const color = item === AT.PLAYER ? 'P' : 'B';

      if (lastOutcome === null) {
        lastOutcome = color;
        currentCol = 0;
        currentRow = 0;
        bigGrid[currentRow][currentCol] = { color, tieCount: tiesOnLast };
      } else if (color === lastOutcome) {
        // Continue down, or turn to the right if blocked
        if (currentRow + 1 < 6 && bigGrid[currentRow + 1][currentCol] === null) {
          currentRow++;
        } else {
          currentCol++;
        }
        if (currentCol < bigCols && currentRow < 6) {
          bigGrid[currentRow][currentCol] = { color, tieCount: tiesOnLast };
        }
      } else {
        // Switch to next column
        lastOutcome = color;
        currentCol++;
        currentRow = 0;
        if (currentCol < bigCols) {
          bigGrid[currentRow][currentCol] = { color, tieCount: tiesOnLast };
        }
      }
      tiesOnLast = 0;
    }
  }

  // Auto scroll to right edge on new data
  useEffect(() => {
    if (beadScrollRef.current) {
      beadScrollRef.current.scrollTo({
        left: beadScrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
    if (bigScrollRef.current) {
      bigScrollRef.current.scrollTo({
        left: bigScrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [history.length]);

  const pCount = history.filter((x) => x === 'P').length;
  const bCount = history.filter((x) => x === 'B').length;
  const tCount = history.filter((x) => x === 'T').length;
  const nonTiesCount = pCount + bCount;
  const pPercent = nonTiesCount > 0 ? ((pCount / nonTiesCount) * 100).toFixed(0) : '50';
  const bPercent = nonTiesCount > 0 ? ((bCount / nonTiesCount) * 100).toFixed(0) : '50';

  return (
    <div className="space-y-4 w-full">
      {/* Bead Plate */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-300 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            จานลูกปัด (Bead Plate)
          </span>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <img src={CHIP_IMAGES.PLAYER} alt="P" className="w-3.5 h-3.5 object-contain inline-block" />
              <span>P: {pCount} ({pPercent}%)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <img src={CHIP_IMAGES.BANKER} alt="B" className="w-3.5 h-3.5 object-contain inline-block" />
              <span>B: {bCount} ({bPercent}%)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              T: {tCount}
            </span>
          </div>
        </div>
        <div
          ref={beadScrollRef}
          className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2 sm:p-2.5 overflow-x-auto scroll-smooth touch-pan-x"
        >
          <div
            className="grid gap-1 sm:gap-1.5 w-max"
            style={{
              gridTemplateColumns: `repeat(${beadCols}, minmax(24px, 28px))`,
            }}
          >
            {beadGrid.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isLatest = cIdx * 6 + rIdx === history.length - 1 && history.length > 0;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-900/80 border border-slate-800/80 flex items-center justify-center p-0.5"
                  >
                    {val && (
                      val === 'P' ? (
                        <img
                          src={CHIP_IMAGES.PLAYER}
                          alt="P"
                          className={`w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-full drop-shadow-[0_0_8px_rgba(37,99,235,0.7)] ${
                            isLatest ? 'ring-2 ring-yellow-400 scale-110 animate-pulse' : ''
                          }`}
                        />
                      ) : val === 'B' ? (
                        <img
                          src={CHIP_IMAGES.BANKER}
                          alt="B"
                          className={`w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-full drop-shadow-[0_0_8px_rgba(220,38,38,0.7)] ${
                            isLatest ? 'ring-2 ring-yellow-400 scale-110 animate-pulse' : ''
                          }`}
                        />
                      ) : (
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-extrabold text-white shadow-xs bg-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.5)] ${
                            isLatest ? 'ring-2 ring-yellow-400 animate-pulse scale-105' : ''
                          }`}
                        >
                          T
                        </div>
                      )
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Big Road (เค้าไพ่หลัก) */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            เค้าไพ่หลัก (Big Road)
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            เลื่อนดูซ้าย-ขวาได้อัตโนมัติ
          </span>
        </div>
        <div
          ref={bigScrollRef}
          className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2 sm:p-2.5 overflow-x-auto scroll-smooth touch-pan-x"
        >
          <div
            className="grid gap-1 sm:gap-1.5 w-max"
            style={{
              gridTemplateColumns: `repeat(${bigCols}, minmax(24px, 28px))`,
            }}
          >
            {bigGrid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-900/80 border border-slate-800/80 flex items-center justify-center relative p-0.5"
                >
                  {cell && (
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center relative ${
                        cell.color === 'P'
                          ? 'border-blue-500 text-blue-400 bg-blue-500/15 shadow-[0_0_6px_rgba(59,130,246,0.3)]'
                          : 'border-red-500 text-red-400 bg-red-500/15 shadow-[0_0_6px_rgba(239,68,68,0.3)]'
                      }`}
                    >
                      {cell.tieCount > 0 && (
                        <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-green-500 text-black px-1 rounded-full leading-tight shadow-xs">
                          {cell.tieCount > 1 ? cell.tieCount : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
