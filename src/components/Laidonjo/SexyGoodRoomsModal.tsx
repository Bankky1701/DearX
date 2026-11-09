import React, { useEffect, useMemo, useState } from 'react';
import { GameResult, SexyRoom } from '../../types/laidonjo';
import { fetchLiveSexyRooms } from '../../utils/baccaratEngine';
import { sound } from '../../utils/sound';
import { CHIP_IMAGES } from '../../constants/chips';

interface SexyGoodRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSyncedTableId?: number;
  onSelectRoom: (room: SexyRoom) => void;
}

// Mini 10x6 Bead Plate component
const MiniRoadmapGrid: React.FC<{ sequence: GameResult[] }> = ({ sequence }) => {
  const slice = sequence.length > 60 ? sequence.slice(-60) : sequence;
  const grid: (GameResult | null)[][] = Array.from({ length: 6 }, () =>
    Array(10).fill(null)
  );

  slice.forEach((val, idx) => {
    const col = Math.floor(idx / 6);
    const row = idx % 6;
    if (col < 10) {
      grid[row][col] = val;
    }
  });

  return (
    <div className="bg-slate-950/90 border border-slate-800/90 rounded-lg p-1.5 overflow-x-auto">
      <div
        className="grid gap-[3px] mx-auto"
        style={{
          gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
          width: '100%',
          maxWidth: '220px',
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isLatest = cIdx * 6 + rIdx === slice.length - 1 && slice.length > 0;
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className="aspect-square rounded-xs bg-slate-900/70 flex items-center justify-center overflow-hidden"
              >
                {cell && (
                  cell === 'P' ? (
                    <img
                      src={CHIP_IMAGES.PLAYER}
                      alt="P"
                      className={`w-[17px] h-[17px] object-contain rounded-full shadow-xs ${
                        isLatest ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''
                      }`}
                    />
                  ) : cell === 'B' ? (
                    <img
                      src={CHIP_IMAGES.BANKER}
                      alt="B"
                      className={`w-[17px] h-[17px] object-contain rounded-full shadow-xs ${
                        isLatest ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-[15px] h-[15px] rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-xs bg-green-600 ${
                        isLatest ? 'ring-2 ring-yellow-400 animate-pulse' : ''
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
  );
};

export const SexyGoodRoomsModal: React.FC<SexyGoodRoomsModalProps> = ({
  isOpen,
  onClose,
  activeSyncedTableId,
  onSelectRoom,
}) => {
  const [rooms, setRooms] = useState<SexyRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hot' | 'streak' | 'chop' | 'all'>('hot');

  const loadRooms = async (force = false) => {
    setLoading(true);
    try {
      const res = await fetchLiveSexyRooms(force);
      if (res.status === 'ok') {
        setRooms(res.rooms);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadRooms(false);

    // Auto refresh every 8s as in original bundle
    const interval = setInterval(() => {
      loadRooms(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const filteredRooms = useMemo(() => {
    if (activeTab === 'hot') {
      const hot = rooms.filter((r) => r.isHotRoom && !r.shuffle && !r.maintenance);
      return hot.length > 0 ? hot : rooms.filter((r) => !r.shuffle && !r.maintenance).slice(0, 12);
    }
    if (activeTab === 'streak') {
      return rooms.filter(
        (r) =>
          !r.shuffle &&
          !r.maintenance &&
          (r.goodRoadCategory === 'streak' || r.patternHighlight.includes('มังกร'))
      );
    }
    if (activeTab === 'chop') {
      return rooms.filter(
        (r) =>
          !r.shuffle &&
          !r.maintenance &&
          (r.goodRoadCategory === 'chop' || r.patternHighlight.includes('ปิงปอง') || r.goodRoadCategory === 'pair')
      );
    }
    return rooms;
  }, [rooms, activeTab]);

  const hotCount = useMemo(
    () => rooms.filter((r) => r.isHotRoom && !r.shuffle && !r.maintenance).length,
    [rooms]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-xl">📡</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  เรดาร์แนะนำห้องสวย Sexy Baccarat
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SOCKET
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                สแกนขอนไพ่สด 37 โต๊ะจาก Sexy Gaming (AE Sexy) คัดห้องมังกร-ปิงปองที่ AI แม่นยำสูงสุดแบบเรียลไทม์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                loadRooms(true);
              }}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              title="รีเฟรชขอนไพ่สด"
            >
              <span className={loading ? 'animate-spin inline-block text-amber-400' : ''}>🔄</span>
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Filter Bar */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('hot');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'hot'
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>🔥 ห้องสวยแนะนำ</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-[10px] text-amber-200">
                {hotCount}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('streak');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'streak'
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>🐉 ขอนไพ่มังกร</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('chop');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'chop'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>🏓 เค้าไพ่ปิงปอง / คู่</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-700 border border-slate-500 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>โต๊ะทั้งหมด ({rooms.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>แสดง {filteredRooms.length} ห้อง</span>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          {filteredRooms.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <span className="text-3xl block mb-2">🔍</span>
              ไม่พบโต๊ะที่ตรงกับเงื่อนไขในขณะนี้ กำลังรอการอัปเดตรอบไพ่สด...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredRooms.map((room) => {
                const isSelected = activeSyncedTableId === room.tableId;
                return (
                  <div
                    key={room.tableId}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all bg-slate-900/90 shadow-md ${
                      isSelected
                        ? 'border-emerald-500 shadow-emerald-950/40'
                        : room.isHotRoom
                        ? 'border-amber-500/50 hover:border-amber-400'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Dealer & Table Info */}
                    <div className="flex items-center justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border-2 border-amber-500/40 shrink-0">
                          <img
                            src={room.dealerImage}
                            alt={room.dealerName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // fallback avatar if image fails
                              (e.target as any).src = 'https://ui-avatars.com/api/?name=Sexy&background=ef4444&color=fff';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{room.tableName}</span>
                            <span className="text-[10px] text-slate-400">({room.hallName})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>ดีลเลอร์ {room.dealerName}</span>
                            <span>• ขอนที่ {room.gameShoe}</span>
                          </div>
                        </div>
                      </div>

                      {/* Beauty Score Badge */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">คะแนนห้องสวย</span>
                        <span className="text-sm font-extrabold text-[#ffd700]">
                          {room.beautyScore} <span className="text-[9px] text-slate-500">/99</span>
                        </span>
                      </div>
                    </div>

                    {/* Pattern Badge */}
                    <div className="mb-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        {room.patternHighlight}
                      </span>
                    </div>

                    {/* Mini Roadmap Grid */}
                    <div className="mb-2.5">
                      <MiniRoadmapGrid sequence={room.sequence} />
                    </div>

                    {/* Score Bar & Prediction */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-800/80 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-blue-400 font-bold inline-flex items-center gap-1">
                          <img src={CHIP_IMAGES.PLAYER} alt="P" className="w-3.5 h-3.5 object-contain" />
                          <span>{room.winCounts.P}</span>
                        </span>
                        <span className="text-red-400 font-bold inline-flex items-center gap-1">
                          <img src={CHIP_IMAGES.BANKER} alt="B" className="w-3.5 h-3.5 object-contain" />
                          <span>{room.winCounts.B}</span>
                        </span>
                        <span className="text-emerald-400 font-bold">T: {room.winCounts.T}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">AI แนะนำ:</span>
                        {room.aiPrediction ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-extrabold text-xs text-white shadow-sm ${
                              room.aiPrediction === 'P'
                                ? 'bg-blue-600/90 border border-blue-400/50 shadow-blue-500/20'
                                : 'bg-red-600/90 border border-red-400/50 shadow-red-500/20'
                            }`}
                          >
                            <img
                              src={room.aiPrediction === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER}
                              alt={room.aiPrediction}
                              className="w-4 h-4 object-contain rounded-full shadow-xs shrink-0"
                            />
                            <span>{room.aiPrediction === 'P' ? 'PLAYER' : 'BANKER'} ({room.aiConfidence}%)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">รอสูตร</span>
                        )}
                      </div>
                    </div>

                    {/* Connect Button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectRoom(room);
                        onClose();
                      }}
                      className={`w-full py-2 rounded-lg font-bold text-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-500'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-md'
                      }`}
                    >
                      <span>{isSelected ? '✓ กำลังเชื่อมต่อโต๊ะนี้' : 'เชื่อมต่อโต๊ะนี้ (Connect)'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
