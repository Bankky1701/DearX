import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { BaccaratService } from '../services/baccaratService';
import { FormulaList, RoomData, User } from '../types/baccarat';

interface FormulaViewProps {
  roomId: number;
  user: User;
  onBackToLobby: () => void;
  onOpenRedeem: () => void;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const FormulaView: React.FC<FormulaViewProps> = ({
  roomId,
  user,
  onBackToLobby,
  onOpenRedeem,
  showNotification,
}) => {
  const [room, setRoom] = useState<RoomData | undefined>(() => BaccaratService.getRoom(roomId));
  const [selectedIdea, setSelectedIdea] = useState<number>(1);
  const [formulaLists, setFormulaLists] = useState<FormulaList[]>([]);
  const [isAutoDealing, setIsAutoDealing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<'B' | 'P' | 'T' | 'W'>('W');
  const [matchedPattern, setMatchedPattern] = useState<string | undefined>();
  const [scoreData, setScoreData] = useState(() => BaccaratService.getRoomScoreSummary(roomId, user.user));

  // 72 cells array mapping (12 cols x 6 rows, column-first arrangement as in original PHP)
  // [0,6,12,18,24,30,36,42,48,54,60,66, 1,7,13,...]
  const cellIndices = useMemo(() => {
    const indices: number[] = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 12; c++) {
        indices.push(c * 6 + r);
      }
    }
    return indices;
  }, []);

  // Recalculate formula prediction
  const runPrediction = (currentData: string[], idea: number) => {
    const res = BaccaratService.calculateFormula(roomId, currentData, idea);
    setPrediction(res.fm);
    setMatchedPattern(res.matchPattern);

    if (res.refill) {
      showNotification('warning', 'เครดิตหมด', 'เครดิตของคุณหมดแล้ว กรุณาเติมเครดิตเพื่อดูสูตรต่อไป');
    }

    // Refresh scores
    setScoreData(BaccaratService.getRoomScoreSummary(roomId, user.user));
  };

  useEffect(() => {
    const r = BaccaratService.getRoom(roomId);
    setRoom(r);
    setFormulaLists(BaccaratService.getFormulaList());

    if (r) {
      runPrediction(r.data, selectedIdea);
    }
  }, [roomId, selectedIdea]);

  // Live Auto Deal Simulation ticker
  useEffect(() => {
    if (!isAutoDealing) return;

    const interval = setInterval(() => {
      const outcomes: ('b' | 'p' | 't')[] = ['b', 'b', 'p', 'p', 'b', 'p', 't'];
      const nextCard = outcomes[Math.floor(Math.random() * outcomes.length)];
      handleAddCard(nextCard, false);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoDealing, room, selectedIdea]);

  const handleAddCard = (card: 'b' | 'p' | 't', triggerConfetti = true) => {
    try {
      const updated = BaccaratService.addCardToRoom(roomId, card);
      setRoom({ ...updated });
      runPrediction(updated.data, selectedIdea);

      // Confetti effect if prediction was correct
      if (prediction !== 'W' && prediction.toLowerCase() === card.toLowerCase() && triggerConfetti) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearRoad = () => {
    const updated = BaccaratService.clearRoomCards(roomId);
    setRoom({ ...updated });
    runPrediction([], selectedIdea);
    showNotification('info', 'รีเซ็ตโต๊ะสำเร็จ', 'ล้างข้อมูลเค้าไพ่เรียบร้อยแล้ว');
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Dealing':
        return 'กำลังเปิดไพ่';
      case 'Waiting':
        return 'กำลังรอตาถัดไป';
      case 'Player':
        return 'ผู้เล่นชนะ (Player)';
      case 'Banker':
        return 'เจ้ามือชนะ (Banker)';
      case 'Tie':
        return 'เกมเสมอ (Tie)';
      case 'Shuffle':
        return 'สับไพ่ใหม่';
      default:
        return 'เปิดไพ่';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Player':
        return 'text-blue-400 border-blue-500/50 bg-blue-950/40';
      case 'Banker':
        return 'text-red-400 border-red-500/50 bg-red-950/40';
      case 'Tie':
        return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
      default:
        return 'text-amber-300 border-amber-500/50 bg-amber-950/40';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top Navigation & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-black/60 p-3 rounded-xl border border-[#b68933]/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="px-3.5 py-1.5 rounded-lg bg-[#38060a] hover:bg-[#5c0a10] border border-[#b68933] text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            ← กลับหน้ารวมห้อง
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-[#ffd700] tracking-wider leading-none">
              {room?.name || `ROOM : ${String(roomId).padStart(3, '0')}`}
            </h2>
            <span className="text-[11px] text-gray-300">
              เค้าไพ่ปัจจุบัน: {room?.data.length || 0} ตา
            </span>
          </div>
        </div>

        {/* Live Dealer Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-2 ${getStatusColor(
              room?.status
            )}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            สถานะโต๊ะ: {getStatusText(room?.status)}
          </div>

          <button
            onClick={() => setIsAutoDealing((prev) => !prev)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              isAutoDealing
                ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                : 'bg-zinc-800 text-gray-300 border-gray-600 hover:bg-zinc-700'
            }`}
            title="จำลองการเปิดไพ่สดอัตโนมัติ"
          >
            {isAutoDealing ? '⏸️ กำลังจำลองสด...' : '▶️ เปิดบอทจำลองสด'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stats & Bead Plate Road (Cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-5 shadow-2xl relative">
            {/* Top Cards: Win Rate & Next Bet */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Win Chance */}
              <div className="p-3 rounded-lg bg-black/40 border border-[#b68933]/30">
                <span className="block text-xs text-gray-300 mb-1 font-medium">อัตราการชนะ</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#ffd700] tracking-tight drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">
                  {room?.percent || 88}%
                </div>
                <span className="text-[10px] text-amber-200/80">คำนวณจากสถิติ AI</span>
              </div>

              {/* Next Bet */}
              <div className="p-3 rounded-lg bg-black/40 border border-[#b68933]/30 flex flex-col justify-center items-center">
                <span className="block text-xs text-gray-300 mb-1 font-medium">ตาถัดไปแทง</span>
                <div className="h-14 flex items-center justify-center">
                  {prediction === 'W' ? (
                    <div className="text-lg font-bold text-gray-300 animate-pulse bg-black/60 px-3 py-1 rounded border border-gray-600">
                      รอสูตร (Waiting)
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 animate-bounce">
                      <img
                        src={`/img/${prediction.toUpperCase()}.png`}
                        alt={prediction}
                        className="h-12 w-12 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]"
                      />
                      <div className="text-left leading-tight">
                        <span className="block text-xs font-bold text-white uppercase">
                          {prediction === 'B' ? 'เจ้ามือ (Banker)' : prediction === 'P' ? 'ผู้เล่น (Player)' : 'เสมอ (Tie)'}
                        </span>
                        {matchedPattern && (
                          <span className="text-[10px] text-[#ffd700] font-mono">
                            สูตร: {matchedPattern}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffd700] to-transparent my-4" />

            {/* Baccarat Bead Plate Road (12 x 6 = 72 cells) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <span>📊</span> ตารางเค้าไพ่หลัก (Bead Plate Road - 72 ช่อง)
                </span>
                <span className="text-[10px] text-gray-300">
                  แดง: เจ้ามือ (B) | น้ำเงิน: ผู้เล่น (P) | เขียว: เสมอ (T)
                </span>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="grid grid-cols-12 grid-rows-6 gap-1 p-2 bg-[#f8f8f8] rounded-lg border-2 border-[#b68933] w-full min-w-[340px] max-w-[440px] mx-auto shadow-inner">
                  {cellIndices.map((slotIndex) => {
                    const card = room?.data[slotIndex];
                    return (
                      <div
                        key={slotIndex}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center p-0.5 shadow-xs overflow-hidden transition-transform hover:scale-110"
                      >
                        {card ? (
                          <img
                            src={`/img/${card.toUpperCase()}.png`}
                            alt={card}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[9px] text-gray-300 select-none">
                            {slotIndex + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Manual Road Input Buttons */}
            <div className="bg-black/40 rounded-lg p-3 border border-amber-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-amber-200 font-semibold">
                  ป้อนผลไพ่ด้วยตนเอง (Manual Input):
                </span>
                <button
                  onClick={handleClearRoad}
                  className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  ล้างตาราง (Clear)
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddCard('b')}
                  className="py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border border-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <img src="/img/B.png" alt="B" className="w-5 h-5 object-contain" />
                  <span>เจ้ามือ (Banker)</span>
                </button>
                <button
                  onClick={() => handleAddCard('p')}
                  className="py-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border border-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <img src="/img/p.png" alt="P" className="w-5 h-5 object-contain" />
                  <span>ผู้เล่น (Player)</span>
                </button>
                <button
                  onClick={() => handleAddCard('t')}
                  className="py-2 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 border border-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <img src="/img/t.png" alt="T" className="w-5 h-5 object-contain" />
                  <span>เสมอ (Tie)</span>
                </button>
              </div>
            </div>

            {/* Formula Preset Selector */}
            <div className="mt-4 flex items-center justify-between gap-3 bg-black/40 p-2.5 rounded-lg border border-[#b68933]/30">
              <span className="text-xs text-amber-200 font-semibold">ชุดสูตรที่ใช้คำนวณ:</span>
              <select
                value={selectedIdea}
                onChange={(e) => setSelectedIdea(Number(e.target.value))}
                className="bg-black text-amber-300 border border-[#b68933] rounded px-3 py-1 text-xs font-bold focus:outline-hidden"
              >
                {formulaLists.map((fl) => (
                  <option key={fl.id} value={fl.id}>
                    สูตรที่ {fl.id} (Pattern Set {fl.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Graph (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Win / Loss Summary & Score Table */}
          <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-4 shadow-xl text-white">
            <h3 className="text-base font-bold text-[#ffd700] mb-3 flex items-center gap-2">
              <span>📈</span> กราฟแสดงสถิติคะแนนสูตร
            </h3>

            {/* SVG Trend Line Chart */}
            <div className="bg-black/60 rounded-xl p-3 border border-[#b68933]/30 mb-4">
              <div className="h-40 w-full relative flex items-end">
                {scoreData.chartData.bottom.length > 1 ? (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Points & Lines */}
                    {(() => {
                      const data = scoreData.chartData.bottom;
                      const max = Math.max(3, ...data);
                      const points = data.map((val, idx) => {
                        const x = (idx / (data.length - 1)) * 100;
                        const y = 60 - (val / max) * 48 - 6;
                        return `${x},${y}`;
                      });
                      const linePath = `M ${points.join(' L ')}`;
                      const areaPath = `M ${points[0]} L ${points.join(' L ')} L 100,60 L 0,60 Z`;
                      return (
                        <>
                          <path d={areaPath} fill="url(#chartGrad)" />
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#ffd700"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {data.map((val, idx) => {
                            const x = (idx / (data.length - 1)) * 100;
                            const y = 60 - (val / max) * 48 - 6;
                            return (
                              <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="#fffb80"
                                stroke="#b68933"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    กำลังบันทึกสถิติรอบไพ่...
                  </div>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                <span>เริ่มต้น</span>
                <span>แนวโน้มผลชนะสุทธิ</span>
                <span>ล่าสุด</span>
              </div>
            </div>

            {/* Win/Loss Badges */}
            <div className="grid grid-cols-2 gap-2 text-center py-2 px-3 rounded-lg bg-[#ae8f37] text-white font-bold mb-3 shadow-md">
              <div className="flex items-center justify-center gap-2">
                <span>สูตรชนะ:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm">
                  {scoreData.win}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>สูตรแพ้:</span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-sm">
                  {scoreData.lose}
                </span>
              </div>
            </div>

            {/* Rounds Table */}
            <div className="rounded-lg border border-white/20 bg-black/40 overflow-hidden">
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-xs text-left text-white">
                  <thead className="bg-black/80 text-amber-200 uppercase text-[10px] sticky top-0 border-b border-white/10">
                    <tr>
                      <th className="px-3 py-2 text-center">รอบที่</th>
                      <th className="px-3 py-2 text-center">จำนวนไม้</th>
                      <th className="px-3 py-2 text-center">ผลที่ได้</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {scoreData.history.length > 0 ? (
                      scoreData.history.map((h, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-3 py-2 text-center font-mono">{h.lapNumber}</td>
                          <td className="px-3 py-2 text-center font-medium">{h.sticks}</td>
                          <td className="px-3 py-2 text-center">
                            {h.status === 'win' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-600/90 text-white font-bold text-[11px]">
                                ชนะ
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-600/90 text-white font-bold text-[11px]">
                                แพ้
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-3 py-6 text-center text-gray-400">
                          ยังไม่มีรอบที่คำนวณจบในห้องนี้<br />
                          <span className="text-[10px] text-amber-200/70">
                            (เมื่อสูตรคำนวณและมีผลไพ่ ระบบจะสรุปสถิติรอบอัตโนมัติ)
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
