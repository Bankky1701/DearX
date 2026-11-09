import React from 'react';
import { User } from '../types/baccarat';

interface NavbarProps {
  user: User;
  onOpenRedeem: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onToggleBackend?: () => void;
  isBackendView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenRedeem,
  onLogout,
  onNavigateHome,
  onToggleBackend,
  isBackendView = false,
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full px-3 py-2 bg-gradient-to-r from-[#2a0406]/95 via-[#4a080c]/95 to-[#2a0406]/95 border-b border-[#b68933]/40 shadow-lg backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            title="กลับสู่หน้าหลักห้องบาคาร่า"
          >
            <img src="/img/sagame.png" alt="SA Game" className="h-9 object-contain" />
            <div className="hidden sm:block text-left">
              <span className="block text-xs uppercase tracking-widest text-[#ffd700] font-bold">
                Bacarrathack
              </span>
              <span className="block text-[10px] text-gray-300">
                AI Casino Formula 2026
              </span>
            </div>
          </button>
        </div>

        {/* Right: User Stats, Credits, Refill, Backend & Logout */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* User Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 rounded-md border border-[#b68933]/50 text-white shadow-inner">
            <img src="/img/user.png" alt="User" className="h-5 w-5 object-contain" />
            <span className="font-semibold text-amber-200">{user.user}</span>
            {user.rank === 'admin' && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-red-600/90 text-white rounded font-bold uppercase">
                Admin
              </span>
            )}
          </div>

          {/* Credits */}
          <button
            onClick={onOpenRedeem}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 hover:bg-black rounded-md border border-[#b68933]/50 text-white cursor-pointer transition-all hover:scale-105"
            title="คลิกเพื่อเติมเครดิต"
          >
            <img src="/img/bitcoin.png" alt="Credits" className="h-5 w-5 object-contain" />
            <span className="font-bold text-[#ffd700]">
              {Number(user.credit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-gray-400">฿</span>
          </button>

          {/* Refill Button Image */}
          <button
            onClick={onOpenRedeem}
            className="hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="เติมเครดิตด้วยโค้ด"
          >
            <img src="/img/refill.png" alt="เติมเครดิต" className="h-7 object-contain drop-shadow" />
          </button>

          {/* Admin Switch Button */}
          {user.rank === 'admin' && onToggleBackend && (
            <button
              onClick={onToggleBackend}
              className={`px-3 py-1.5 rounded-md font-bold text-xs tracking-wide transition-all border shadow-sm cursor-pointer ${
                isBackendView
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400 hover:brightness-110'
                  : 'bg-[#5c0a10] text-[#ffd700] border-[#b68933] hover:bg-[#7c0e16]'
              }`}
            >
              {isBackendView ? '🎮 กลับหน้าสูตร' : '⚙️ หลังบ้าน (Admin)'}
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="hover:brightness-125 active:scale-95 transition-all cursor-pointer p-0.5"
            title="ออกจากระบบ"
          >
            <img src="/img/logout.png" alt="ออกจากระบบ" className="h-7 object-contain drop-shadow" />
          </button>
        </div>
      </div>
    </nav>
  );
};
