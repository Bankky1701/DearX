import { useState } from 'react';
import { LaidonjoApp } from './components/Laidonjo/LaidonjoApp';
import { BackendView } from './components/Backend/BackendView';
import { FormulaView } from './components/FormulaView';
import { LobbyView } from './components/LobbyView';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { RedeemModal } from './components/RedeemModal';
import { AlertState, SweetAlertModal } from './components/SweetAlertModal';
import { BaccaratService } from './services/baccaratService';
import { User } from './types/baccarat';

export default function App() {
  // Mode: 'laidonjo' is the exact https://www.huayzard.com/Bacarat-pre/ app
  // Mode: 'classic' is the original SA Gaming red theme
  const [appMode, setAppMode] = useState<'laidonjo' | 'classic'>('laidonjo');

  // Classic mode states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    BaccaratService.initialize();
    return BaccaratService.getCurrentUser();
  });
  const [activeClassicView, setActiveClassicView] = useState<'lobby' | 'formula' | 'backend'>('lobby');
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const [isRedeemOpen, setIsRedeemOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      confirmText: 'ตกลง',
      onConfirm,
    });
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveClassicView('lobby');
  };

  const handleLogout = () => {
    setAlert({
      isOpen: true,
      type: 'warning',
      title: 'คุณแน่ใจมั้ย?',
      message: 'ที่จะออกจากระบบ!',
      confirmText: 'ตกลง',
      cancelText: 'ยกเลิก',
      onConfirm: () => {
        BaccaratService.logout();
        setCurrentUser(null);
        setActiveClassicView('lobby');
        showAlert('success', 'สำเร็จ!', 'ออกจากระบบแล้ว');
      },
    });
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setActiveClassicView('formula');
  };

  const handleCreditRefillSuccess = (newCredit: number) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, credit: newCredit });
    }
  };

  // Primary mode requested: DearX Bacarat (huayzard.com/Bacarat-pre)
  if (appMode === 'laidonjo') {
    return <LaidonjoApp />;
  }

  // Classic SA Game Mode
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#240306] text-white relative">
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => setAppMode('laidonjo')}
            className="px-3 py-1.5 rounded-full bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-400/40 text-xs font-semibold shadow-xl backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>⚡</span>
            <span>กลับสู่ LAIDONJO AI</span>
          </button>
        </div>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          showNotification={(type, title, msg) => showAlert(type, title, msg)}
        />
        <SweetAlertModal alert={alert} onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-fixed text-white"
      style={{
        backgroundColor: '#2b0407',
        backgroundImage:
          'linear-gradient(rgba(45, 4, 7, 0.94), rgba(45, 4, 7, 0.97)), url("https://previews.123rf.com/images/hobbitfoot/hobbitfoot1709/hobbitfoot170900696/85929960-big-win-slots-777-banner-casino-on-the-red-background-vector-illustration.jpg")',
      }}
    >
      {/* Switcher bar */}
      <div className="w-full bg-black/60 px-4 py-1 text-center text-xs flex items-center justify-between border-b border-amber-900/50">
        <span className="text-gray-400 text-[11px]">โหมดคลาสสิก SA Game</span>
        <button
          onClick={() => setAppMode('laidonjo')}
          className="text-[#ffd700] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>⚡ สลับไปเว็บใหม่ LAIDONJO AI BACARAT →</span>
        </button>
      </div>

      {/* Top Main Navbar */}
      <Navbar
        user={currentUser}
        onOpenRedeem={() => setIsRedeemOpen(true)}
        onLogout={handleLogout}
        onNavigateHome={() => setActiveClassicView('lobby')}
        onToggleBackend={() => setActiveClassicView(activeClassicView === 'backend' ? 'lobby' : 'backend')}
        isBackendView={activeClassicView === 'backend'}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeClassicView === 'lobby' && <LobbyView onSelectRoom={handleSelectRoom} />}

        {activeClassicView === 'formula' && (
          <FormulaView
            roomId={selectedRoomId}
            user={currentUser}
            onBackToLobby={() => setActiveClassicView('lobby')}
            onOpenRedeem={() => setIsRedeemOpen(true)}
            showNotification={(type, title, msg) => showAlert(type, title, msg)}
          />
        )}

        {activeClassicView === 'backend' && (
          <BackendView
            onBackToApp={() => setActiveClassicView('lobby')}
            showNotification={(type, title, msg) => showAlert(type, title, msg)}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-4 text-center text-xs text-amber-200/60 bg-black/70 border-t border-[#b68933]/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Bacarrathack. สงวนลิขสิทธิ์ทั้งหมด สูตรบาคาร่า SA Game AI</span>
          <div className="flex items-center gap-4">
            <span className="text-[#ffd700]">Line ID: @Bacarrathack</span>
            <button
              onClick={() => setIsRedeemOpen(true)}
              className="text-amber-300 hover:underline cursor-pointer"
            >
              เติมเครดิต
            </button>
          </div>
        </div>
      </footer>

      {/* Redeem Code Modal */}
      <RedeemModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
        onSuccess={handleCreditRefillSuccess}
        showNotification={(type, title, msg) => showAlert(type, title, msg)}
      />

      {/* SweetAlert Custom Modal */}
      <SweetAlertModal alert={alert} onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
