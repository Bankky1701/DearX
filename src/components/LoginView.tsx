import React, { useState } from 'react';
import { BaccaratService } from '../services/baccaratService';
import { User } from '../types/baccarat';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  showNotification,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRepass, setRegRepass] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const res = BaccaratService.login(username, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      showNotification('success', 'สำเร็จ', res.message);
      onLoginSuccess(res.user);
    } else {
      showNotification('error', 'ผิดพลาด', res.message);
    }
  };

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const res = BaccaratService.register({
      user: regUser,
      pass: regPass,
      repass: regRepass,
      email: regEmail,
    });
    setIsSubmitting(false);

    if (res.success && res.user) {
      showNotification('success', 'สำเร็จ', res.message);
      setIsRegisterOpen(false);
      onLoginSuccess(res.user);
    } else {
      showNotification('error', 'ผิดพลาด', res.message);
    }
  };

  const fillQuickAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    const res = BaccaratService.login(user, pass);
    if (res.success && res.user) {
      showNotification('success', 'เข้าสู่ระบบสำเร็จ', `เข้าใช้งานในฐานะ: ${user}`);
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[#240306]">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'url("https://previews.123rf.com/images/hobbitfoot/hobbitfoot1709/hobbitfoot170900696/85929960-big-win-slots-777-banner-casino-on-the-red-background-vector-illustration.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a060a]/90 via-[#1f0204]/95 to-[#120102] pointer-events-none" />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="text-center mb-4">
          <img src="/img/sagame.png" alt="SA Game" className="h-16 mx-auto drop-shadow-lg mb-2 object-contain" />
          <h1 className="text-2xl font-bold tracking-wider text-[#ffd700] drop-shadow">
            BACARRATHACK
          </h1>
          <p className="text-xs text-amber-200/80">ระบบสูตรบาคาร่า AI วิเคราะห์เค้าไพ่เรียลไทม์</p>
        </div>

        <div className="rounded-xl border-2 border-[#a67a2e] bg-[#5c0a10]/95 p-6 shadow-2xl backdrop-blur-md">
          <h3 className="text-center text-lg font-bold text-white mb-3">
            LOGIN / เข้าสู่ระบบ
          </h3>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mb-5" />

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-32 text-xs sm:text-sm font-bold text-white uppercase tracking-wider drop-shadow">
                USERNAME :
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ชื่อผู้ใช้"
                className="flex-1 px-4 py-2 text-center rounded-md bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-32 text-xs sm:text-sm font-bold text-white uppercase tracking-wider drop-shadow">
                PASSWORD :
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="flex-1 px-4 py-2 text-center rounded-md bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                required
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="เข้าสู่ระบบ"
              >
                <img src="/img/btnlogin.png" alt="Login" className="h-14 object-contain drop-shadow-md" />
              </button>

              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="สมัครสมาชิกใหม่"
              >
                <img src="/img/btnregister.png" alt="Register" className="h-14 object-contain drop-shadow-md" />
              </button>
            </div>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="mt-6 pt-4 border-t border-[#b68933]/30">
            <p className="text-[11px] text-center text-amber-200/90 mb-2 font-medium">
              💡 ทดลองเข้าสู่ระบบทันที:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin', '1234')}
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-700 hover:to-amber-800 border border-[#b68933] text-amber-200 font-semibold transition-all cursor-pointer text-center"
              >
                👑 แอดมิน (admin)
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('member', '1234')}
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-gray-600 text-gray-200 font-semibold transition-all cursor-pointer text-center"
              >
                👤 สมาชิก (member)
              </button>
            </div>
          </div>
        </div>

        {/* Line Support Info */}
        <div className="mt-4 text-center">
          <span className="text-white text-xs block mb-1">ติดต่อเราได้ที่ไลน์</span>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full border border-amber-800/60">
            <img src="/img/linem.png" alt="Line" className="w-6 h-6 object-contain" />
            <span className="text-[#ffd700] text-sm font-semibold tracking-wide">
              Line : @Bacarrathack
            </span>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold p-1 leading-none cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-center text-white mb-1">สมัครสมาชิก</h3>
            <p className="text-center text-xs text-amber-200 mb-4">รับเครดิตทดลองฟรี 50 เครดิตทันที</p>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white mb-1">ชื่อผู้ใช้ (Username)</label>
                <input
                  type="text"
                  value={regUser}
                  onChange={(e) => setRegUser(e.target.value)}
                  placeholder="เช่น user99"
                  className="w-full px-3 py-2 rounded-md bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white mb-1">รหัสผ่าน (Password)</label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="รหัสผ่านอย่างน้อย 4 ตัวอักษร"
                  className="w-full px-3 py-2 rounded-md bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white mb-1">ยืนยันรหัสผ่าน (Confirm Password)</label>
                <input
                  type="password"
                  value={regRepass}
                  onChange={(e) => setRegRepass(e.target.value)}
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  className="w-full px-3 py-2 rounded-md bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white mb-1">อีเมล (Email)</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-3 py-2 rounded-md bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ffd700]"
                  required
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-full text-sm font-bold text-[#ebd876] bg-[#300e05] hover:bg-[#c09d3e] hover:text-black border-1.5 border-[#c09d3e] shadow-md transition-all cursor-pointer"
                >
                  สมัครสมาชิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
