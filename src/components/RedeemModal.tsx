import React, { useState } from 'react';
import { BaccaratService } from '../services/baccaratService';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credit: number) => void;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  showNotification,
}) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      showNotification('error', 'ผิดพลาด', 'กรุณากรอก Redeem Code');
      return;
    }

    setIsSubmitting(true);
    const res = BaccaratService.redeemCode(code);
    setIsSubmitting(false);

    if (res.success) {
      showNotification('success', 'สำเร็จ', res.message);
      setCode('');
      if (res.credit !== undefined) {
        onSuccess(res.credit);
      }
      onClose();
    } else {
      showNotification('error', 'ผิดพลาด', res.message);
    }
  };

  const handleQuickCode = (quickCode: string) => {
    setCode(quickCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold p-1 leading-none"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-center text-white mb-2">Redeem Code</h3>
        <p className="text-center text-xs text-amber-200 mb-4">
          เติมเครดิตสำหรับใช้งานสูตรบาคาร่า
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              กรอกโค้ดเติมเงิน
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="กรอก Redeem Code เช่น VIP999"
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-[#b68933] text-white text-center font-bold tracking-wider placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
              autoFocus
            />
          </div>

          <div className="bg-black/40 rounded-lg p-3 text-xs text-amber-100/90 border border-amber-900/40">
            <p className="font-semibold text-amber-300 mb-1">✨ โค้ดฟรีสำหรับทดลองใช้งาน:</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['VIP999', 'BACC888', 'FREE50', 'LUCKY777'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleQuickCode(c)}
                  className="px-2.5 py-1 bg-[#3a060a] hover:bg-[#b68933] hover:text-black rounded border border-[#b68933]/60 text-xs font-mono transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-300">
            *นำโค้ดจากแอดมินหรือ @Line เพื่อนำมาเติมเครดิต
          </p>

          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <img src="/img/refill.png" alt="เติมเครดิต" className="h-12 mx-auto drop-shadow-md" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
