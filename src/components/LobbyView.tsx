import React, { useEffect, useState } from 'react';
import { BaccaratService } from '../services/baccaratService';
import { RoomData } from '../types/baccarat';

interface LobbyViewProps {
  onSelectRoom: (roomId: number) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState<RoomData[]>([]);

  useEffect(() => {
    // Load initial rooms
    setRooms(BaccaratService.getRooms());

    // Interval to simulate live percent changes & dealer activity
    const interval = setInterval(() => {
      const currentRooms = BaccaratService.getRooms();
      // Minor periodic win rate fluctuation to simulate live casino updates
      const updated = currentRooms.map((r) => {
        const delta = (Math.random() - 0.5) * 4;
        const newPercent = Math.min(99, Math.max(68, Math.round(r.percent + delta)));
        return {
          ...r,
          percent: newPercent,
        };
      });
      setRooms(updated);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full pb-16">
      {/* Header Banner */}
      <section className="relative w-full py-16 px-4 text-center overflow-hidden bg-cover bg-center shadow-inner"
        style={{
          backgroundImage:
            'url("https://1.bp.blogspot.com/-pol24ALCE8M/VgfZAVCZtPI/AAAAAAAAAFM/U6GiiZBu3cU/s1600/kartandtinki1_roulette-wallpaper_01.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-widest text-white drop-shadow-md mb-2">
            Bacarrathack
          </h1>
          <h2 className="text-sm sm:text-lg text-amber-200 font-medium">
            บริการสูตรบาคาร่า AI คำนวณเค้าไพ่แม่นยำ พร้อมอัตราการชนะเรียลไทม์
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              เชื่อมต่อโต๊ะ SA Gaming สด 16 ห้อง
            </span>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#b68933]/40">
          <h3 className="text-lg font-bold text-[#ffd700] flex items-center gap-2">
            <span>🎰</span> เลือกห้องบาคาร่าเพื่อดูสูตร
          </h3>
          <span className="text-xs text-gray-400">
            อัปเดตอัตโนมัติทุก 1 วินาที
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => {
            const isHighChance = room.percent >= 85;
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="group relative cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Room Frame Box */}
                <div
                  className="rounded-xl overflow-hidden border border-[#b68933]/60 bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-3 text-white shadow-lg relative min-h-[110px] flex items-center justify-between"
                  style={{
                    backgroundImage: 'url(/img/frame.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Left Column: SA Game Logo & Room Label */}
                  <div className="flex flex-col justify-between h-full w-1/2 pr-2">
                    <img
                      src="/img/sagame.png"
                      alt="SAGAME"
                      className="h-8 object-contain self-start opacity-90 group-hover:opacity-100"
                    />
                    <div className="mt-2">
                      <span className="block text-sm sm:text-base font-bold tracking-wider text-white">
                        {room.name}
                      </span>
                      <span className="text-[10px] text-amber-200/80 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                        เปิดไพ่แล้ว {room.data.length} ตา
                      </span>
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div
                    className="w-[2px] h-20 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: 'url(/img/line_.png)' }}
                  />

                  {/* Right Column: Win Rate & CTA */}
                  <div className="w-1/2 pl-2 text-center flex flex-col justify-center items-center">
                    <div className="text-[11px] text-gray-200 font-medium tracking-wide">
                      อัตราการชนะ
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        isHighChance ? 'text-[#ffd700] drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]' : 'text-amber-100'
                      }`}
                    >
                      {room.percent}%
                    </div>
                    <span className="mt-1 text-[10px] px-2 py-0.5 rounded bg-black/60 text-amber-300 font-semibold group-hover:bg-[#ffd700] group-hover:text-black transition-colors">
                      เข้าดูสูตร →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
