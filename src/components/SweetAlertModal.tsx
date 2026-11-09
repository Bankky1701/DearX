import React from 'react';

export interface AlertState {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const SweetAlertModal: React.FC<{
  alert: AlertState;
  onClose: () => void;
}> = ({ alert, onClose }) => {
  if (!alert.isOpen) return null;

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (alert.onCancel) {
      alert.onCancel();
    }
    onClose();
  };

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return (
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emerald-400 flex items-center justify-center text-emerald-300 text-3xl font-bold animate-bounce">
            ✓
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-red-500 flex items-center justify-center text-red-400 text-3xl font-bold">
            ✕
          </div>
        );
      case 'warning':
        return (
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-amber-400 flex items-center justify-center text-amber-300 text-3xl font-bold">
            !
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-yellow-300 flex items-center justify-center text-yellow-200 text-3xl font-bold">
            i
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-xl border border-[#b68933] bg-[#0f0708]/95 p-6 text-center shadow-2xl">
        {getIcon()}
        <h3 className="text-xl font-bold text-[#fffb80] mb-2">{alert.title}</h3>
        <p className="text-sm text-gray-200 mb-6 whitespace-pre-line">{alert.message}</p>

        <div className="flex items-center justify-center gap-3">
          {alert.cancelText && (
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
            >
              {alert.cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-full text-sm font-bold text-black bg-gradient-to-b from-[#fdf0bc] via-[#E4BA42] to-[#ae8e3f] hover:brightness-110 shadow-md transition-all active:scale-95"
          >
            {alert.confirmText || 'ตกลง'}
          </button>
        </div>
      </div>
    </div>
  );
};
