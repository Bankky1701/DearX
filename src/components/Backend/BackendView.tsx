import React, { useState } from 'react';
import { BaccaratService } from '../../services/baccaratService';
import { Formula, RedeemCode, User } from '../../types/baccarat';

interface BackendViewProps {
  onBackToApp: () => void;
  showNotification: (type: 'success' | 'error' | 'warning', title: string, msg: string) => void;
}

export const BackendView: React.FC<BackendViewProps> = ({
  onBackToApp,
  showNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'm_user' | 'm_formula' | 'm_redeemcode'>('home');
  const [users, setUsers] = useState<User[]>(() => BaccaratService.getUsers());
  const [formulas, setFormulas] = useState<Formula[]>(() => BaccaratService.getAllFormulas());
  const [selectedIdea, setSelectedIdea] = useState<number>(1);
  const [codes, setCodes] = useState<RedeemCode[]>(() => BaccaratService.getCodes());

  // Edit User modal / state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCredit, setEditCredit] = useState(0);

  // New Formula state
  const [fm1, setFm1] = useState('B');
  const [fm2, setFm2] = useState('B');
  const [fm3, setFm3] = useState('B');
  const [fm4, setFm4] = useState('P');
  const [fm5, setFm5] = useState('B');
  const [an, setAn] = useState<'B' | 'P' | 'T'>('P');

  // Redeem Generator state
  const [genCredit, setGenCredit] = useState<number>(100);
  const [genCount, setGenCount] = useState<number>(10);
  const [generatedCodesText, setGeneratedCodesText] = useState<string>('');

  const stats = BaccaratService.getBackendStats();

  const handleEditUserClick = (u: User) => {
    setEditingUser(u);
    setEditUsername(u.user);
    setEditPassword(u.pass);
    setEditCredit(u.credit);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: User = {
      ...editingUser,
      user: editUsername.trim(),
      pass: editPassword.trim(),
      credit: Number(editCredit),
    };

    BaccaratService.updateUser(updated);
    setUsers(BaccaratService.getUsers());
    setEditingUser(null);
    showNotification('success', 'สำเร็จ!', 'แก้ไขข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
  };

  const handleDeleteFormula = (id: number) => {
    BaccaratService.deleteFormula(id);
    setFormulas(BaccaratService.getAllFormulas());
    showNotification('success', 'สำเร็จ!', 'ลบสูตรเรียบร้อยแล้ว');
  };

  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    const pattern = `${fm1}${fm2}${fm3}${fm4}${fm5}`;
    BaccaratService.addFormula(pattern, an, selectedIdea);
    setFormulas(BaccaratService.getAllFormulas());
    showNotification('success', 'สำเร็จ!', `เพิ่มสูตร ${pattern} = ${an} เรียบร้อยแล้ว`);
  };

  const handleAddFormulaList = () => {
    const newItem = BaccaratService.addFormulaList();
    setSelectedIdea(newItem.id);
    showNotification('success', 'สำเร็จ!', `เพิ่มชุดสูตรที่ ${newItem.id} เรียบร้อยแล้ว`);
  };

  const handleGenerateCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (genCount <= 0 || genCredit <= 0) {
      showNotification('error', 'ผิดพลาด', 'กรุณาระบุจำนวนเครดิตและจำนวนโค้ดที่ถูกต้อง');
      return;
    }

    const newCodes = BaccaratService.generateCodes(genCredit, genCount);
    setCodes(BaccaratService.getCodes());
    setGeneratedCodesText(newCodes.join('\n'));
    showNotification('success', 'สำเร็จ!', `สร้าง ${newCodes.length} โค้ดเรียบร้อยแล้ว`);
  };

  const handleCopyCodes = () => {
    if (!generatedCodesText) return;
    navigator.clipboard.writeText(generatedCodesText);
    showNotification('success', 'คัดลอกสำเร็จ!', 'คัดลอกโค้ดทั้งหมดลงในคลิปบอร์ดแล้ว');
  };

  const formulaSets = BaccaratService.getFormulaList();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Backend Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-gradient-to-r from-red-950 via-black to-red-950 p-4 rounded-xl border border-[#b68933] shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/img/sagame.png" alt="SA Game" className="h-10 object-contain" />
          <div>
            <h1 className="text-xl font-extrabold text-[#ffd700] tracking-wider leading-none">
              ระบบจัดการหลังบ้าน (BACKEND ADMIN)
            </h1>
            <span className="text-xs text-amber-200">
              จัดการสมาชิก สูตรคำนวณเค้าไพ่ และโค้ดเติมเครดิต
            </span>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
        >
          ← กลับหน้าสูตรบาคาร่า
        </button>
      </div>

      {/* Backend Tab Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('home')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#5c0a10] border-[#ffd700] text-[#ffd700] shadow-lg'
              : 'bg-black/60 border-zinc-700 text-gray-300 hover:bg-black/80'
          }`}
        >
          <img src="/img/m_home.png" alt="Home" className="h-7 w-7 object-contain" />
          <span>แดชบอร์ดสรุป</span>
        </button>

        <button
          onClick={() => setActiveTab('m_user')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'm_user'
              ? 'bg-[#5c0a10] border-[#ffd700] text-[#ffd700] shadow-lg'
              : 'bg-black/60 border-zinc-700 text-gray-300 hover:bg-black/80'
          }`}
        >
          <img src="/img/m_user.png" alt="Users" className="h-7 w-7 object-contain" />
          <span>จัดการผู้ใช้</span>
        </button>

        <button
          onClick={() => setActiveTab('m_formula')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'm_formula'
              ? 'bg-[#5c0a10] border-[#ffd700] text-[#ffd700] shadow-lg'
              : 'bg-black/60 border-zinc-700 text-gray-300 hover:bg-black/80'
          }`}
        >
          <img src="/img/m_formula.png" alt="Formulas" className="h-7 w-7 object-contain" />
          <span>จัดการสูตร AI</span>
        </button>

        <button
          onClick={() => setActiveTab('m_redeemcode')}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'm_redeemcode'
              ? 'bg-[#5c0a10] border-[#ffd700] text-[#ffd700] shadow-lg'
              : 'bg-black/60 border-zinc-700 text-gray-300 hover:bg-black/80'
          }`}
        >
          <img src="/img/m_code.png" alt="Codes" className="h-7 w-7 object-contain" />
          <span>สร้างโค้ดเติมเงิน</span>
        </button>
      </div>

      {/* TAB 1: HOME OVERVIEW */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-4 text-center shadow-lg">
              <img src="/img/bitcoin.png" alt="icon" className="h-7 mx-auto mb-1 object-contain" />
              <span className="text-xs text-gray-300">ยอดวันนี้</span>
              <div className="text-xl font-extrabold text-[#ffd700] mt-1">
                {stats.todayTotal.toLocaleString()} ฿
              </div>
            </div>

            <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-4 text-center shadow-lg">
              <img src="/img/bitcoin.png" alt="icon" className="h-7 mx-auto mb-1 object-contain" />
              <span className="text-xs text-gray-300">ยอดสัปดาห์นี้</span>
              <div className="text-xl font-extrabold text-[#ffd700] mt-1">
                {stats.weekTotal.toLocaleString()} ฿
              </div>
            </div>

            <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-4 text-center shadow-lg">
              <img src="/img/bitcoin.png" alt="icon" className="h-7 mx-auto mb-1 object-contain" />
              <span className="text-xs text-gray-300">ยอดเดือนนี้</span>
              <div className="text-xl font-extrabold text-[#ffd700] mt-1">
                {stats.monthTotal.toLocaleString()} ฿
              </div>
            </div>

            <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-4 text-center shadow-lg">
              <img src="/img/bitcoin.png" alt="icon" className="h-7 mx-auto mb-1 object-contain" />
              <span className="text-xs text-gray-300">ยอดทั้งหมด</span>
              <div className="text-xl font-extrabold text-[#ffd700] mt-1">
                {stats.allTimeTotal.toLocaleString()} ฿
              </div>
            </div>
          </div>

          {/* Secondary 2 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/80 p-5 text-center shadow-lg">
              <span className="text-sm text-gray-200">ผู้ใช้ออนไลน์ในระบบ</span>
              <div className="text-3xl font-extrabold text-[#ffd700] mt-1">
                {stats.onlineUsersCount} <span className="text-sm font-normal text-gray-300">คน</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/80 p-5 text-center shadow-lg">
              <span className="text-sm text-gray-200">จำนวนสูตรที่เข้าเป้าทั้งหมด</span>
              <div className="text-3xl font-extrabold text-[#ffd700] mt-1">
                {stats.totalWins} <span className="text-sm font-normal text-gray-300">ครั้ง</span>
              </div>
            </div>
          </div>

          {/* User Win/Loss Table */}
          <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-5 shadow-xl">
            <h3 className="text-sm font-bold text-[#ffd700] mb-3 flex items-center gap-2">
              <span>👥</span> รายชื่อผู้ใช้งานและสถิติ
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-white">
                <thead className="bg-black/80 text-amber-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">ID</th>
                    <th className="px-4 py-2.5">ผู้ใช้</th>
                    <th className="px-4 py-2.5">เครดิตคงเหลือ</th>
                    <th className="px-4 py-2.5">สถานะ</th>
                    <th className="px-4 py-2.5">ชนะ</th>
                    <th className="px-4 py-2.5">แพ้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((u) => {
                    const uStats = BaccaratService.getStats(undefined, u.user);
                    const win = uStats.filter((s) => s.result === 'win').length;
                    const lose = uStats.filter((s) => s.result === 'lose').length;
                    return (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="px-4 py-2.5 font-mono">{u.id}</td>
                        <td className="px-4 py-2.5 font-bold text-amber-100">{u.user}</td>
                        <td className="px-4 py-2.5 text-[#ffd700] font-bold">
                          {u.credit.toLocaleString()} ฿
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.rank === 'admin' ? 'bg-red-700 text-white' : 'bg-zinc-700 text-gray-200'
                            }`}
                          >
                            {u.rank}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-emerald-400 font-bold">{win}</td>
                        <td className="px-4 py-2.5 text-red-400 font-bold">{lose}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE USERS */}
      {activeTab === 'm_user' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-5 shadow-xl">
            <h3 className="text-base font-bold text-[#ffd700] mb-4 flex items-center gap-2">
              <span>👤</span> จัดการผู้ใช้งานระบบ
            </h3>

            {/* Edit User Modal */}
            {editingUser && (
              <div className="mb-6 p-4 rounded-xl border border-amber-400 bg-black/80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#ffd700]">
                    ✏️ แก้ไขข้อมูลผู้ใช้: {editingUser.user}
                  </h4>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✕ ปิด
                  </button>
                </div>
                <form onSubmit={handleSaveUser} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">ชื่อผู้ใช้</label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-gray-600 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">รหัสผ่าน</label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-gray-600 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">เครดิต (฿)</label>
                    <input
                      type="number"
                      value={editCredit}
                      onChange={(e) => setEditCredit(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-gray-600 text-white text-xs"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded bg-[#ffd700] hover:bg-amber-400 text-black font-bold text-xs cursor-pointer shadow-md"
                    >
                      บันทึกการเปลี่ยนแปลง
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-white">
                <thead className="bg-black/80 text-amber-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">ชื่อผู้ใช้</th>
                    <th className="px-4 py-2.5">รหัสผ่าน</th>
                    <th className="px-4 py-2.5">เครดิต</th>
                    <th className="px-4 py-2.5">อีเมล</th>
                    <th className="px-4 py-2.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="px-4 py-2.5 font-mono">{u.id}</td>
                      <td className="px-4 py-2.5 font-bold text-amber-100">{u.user}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-300">{u.pass}</td>
                      <td className="px-4 py-2.5 text-[#ffd700] font-bold">
                        {u.credit.toLocaleString()} ฿
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">{u.email}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => handleEditUserClick(u)}
                          className="px-3 py-1 rounded-md bg-[#300e05] hover:bg-[#c09d3e] hover:text-black border border-[#c09d3e] text-[#ebd876] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          แก้ไข
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE FORMULAS */}
      {activeTab === 'm_formula' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formula Table (Cols 7) */}
          <div className="lg:col-span-7 rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#ffd700] flex items-center gap-2">
                <span>⚙️</span> รายการสูตรในระบบ (ชุดที่ {selectedIdea})
              </h3>
              <span className="text-xs text-gray-300">
                รวม {formulas.filter((f) => f.idea === selectedIdea).length} สูตร
              </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs text-left text-white">
                <thead className="bg-black/80 text-amber-200 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="px-3 py-2">รูปแบบ 5 ตา (Pattern)</th>
                    <th className="px-3 py-2 text-center">=</th>
                    <th className="px-3 py-2 text-center">ผลลัพธ์แทง</th>
                    <th className="px-3 py-2 text-right">ลบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {formulas
                    .filter((f) => f.idea === selectedIdea)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {item.fm.split('').map((char, cIdx) => (
                              <img
                                key={cIdx}
                                src={`/img/${char.toUpperCase()}.png`}
                                alt={char}
                                className="w-6 h-6 object-contain"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-lg text-amber-200">=</td>
                        <td className="px-3 py-2 text-center">
                          <img
                            src={`/img/${item.an.toUpperCase()}.png`}
                            alt={item.an}
                            className="w-7 h-7 mx-auto object-contain animate-pulse"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleDeleteFormula(item.id)}
                            className="px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                          >
                            ✕ ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Formula & Set Controls (Cols 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Add New Formula */}
            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-5 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-3">➕ จดสูตรใหม่เข้าสู่ระบบ</h4>
              <form onSubmit={handleAddFormula} className="space-y-3">
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: 'ตา 1', val: fm1, set: setFm1 },
                    { label: 'ตา 2', val: fm2, set: setFm2 },
                    { label: 'ตา 3', val: fm3, set: setFm3 },
                    { label: 'ตา 4', val: fm4, set: setFm4 },
                    { label: 'ตา 5', val: fm5, set: setFm5 },
                  ].map((f, i) => (
                    <div key={i}>
                      <span className="block text-[10px] text-gray-300 text-center mb-1">{f.label}</span>
                      <select
                        value={f.val}
                        onChange={(e) => f.set(e.target.value)}
                        className="w-full bg-zinc-900 border border-gray-600 rounded p-1 text-center text-xs font-bold text-white"
                      >
                        <option value="B">B (แดง)</option>
                        <option value="P">P (น้ำเงิน)</option>
                        <option value="T">T (เขียว)</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    ผลลัพธ์ที่แนะนำให้แทง:
                  </label>
                  <select
                    value={an}
                    onChange={(e) => setAn(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-[#b68933] rounded px-3 py-2 text-xs font-bold text-[#ffd700]"
                  >
                    <option value="B">Banker - เจ้ามือ (B)</option>
                    <option value="P">Player - ผู้เล่น (P)</option>
                    <option value="T">Tie - เสมอ (T)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-xs font-bold text-[#ebd876] bg-[#300e05] hover:bg-[#c09d3e] hover:text-black border border-[#c09d3e] shadow-md transition-all cursor-pointer mt-2"
                >
                  บันทึกจดสูตร
                </button>
              </form>
            </div>

            {/* Switch / Add Formula Set */}
            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-5 shadow-xl text-center">
              <span className="block text-xs text-amber-200 font-bold mb-2">เลือกชุดสูตร:</span>
              <select
                value={selectedIdea}
                onChange={(e) => setSelectedIdea(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-[#b68933] rounded px-3 py-2 text-xs font-bold text-white mb-3"
              >
                {formulaSets.map((fs) => (
                  <option key={fs.id} value={fs.id}>
                    สูตรชุดที่ {fs.id}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddFormulaList}
                className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-500 shadow-md transition-all cursor-pointer"
              >
                + เพิ่มชุดสูตรใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE REDEEM CODES */}
      {activeTab === 'm_redeemcode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Existing Codes Table (Cols 7) */}
          <div className="lg:col-span-7 rounded-xl border border-[#b68933] bg-gradient-to-r from-[#38060a] to-[#5c0a10] p-5 shadow-xl">
            <h3 className="text-base font-bold text-[#ffd700] mb-3 flex items-center gap-2">
              <span>🎟️</span> รายการ Redeem Code ในระบบ
            </h3>

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs text-left text-white">
                <thead className="bg-black/80 text-amber-200 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">โค้ด</th>
                    <th className="px-3 py-2">เครดิต</th>
                    <th className="px-3 py-2">สถานะการใช้งาน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {codes.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="px-3 py-2 font-mono">{c.id}</td>
                      <td className="px-3 py-2 font-mono font-bold text-[#ffd700]">{c.code}</td>
                      <td className="px-3 py-2">{c.credit} ฿</td>
                      <td className="px-3 py-2">
                        {c.code_use === 1 ? (
                          <span className="px-2 py-0.5 rounded bg-red-900/80 text-red-200 text-[10px] font-bold">
                            ใช้แล้ว ({c.use_by})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 text-[10px] font-bold">
                            ยังไม่ถูกใช้
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generator (Cols 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-5 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-3">⚡ สร้าง RedeemCode อัตโนมัติ</h4>
              <form onSubmit={handleGenerateCodes} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-200 mb-1">จำนวนเครดิตต่อโค้ด</label>
                  <input
                    type="number"
                    value={genCredit}
                    onChange={(e) => setGenCredit(Number(e.target.value))}
                    placeholder="เช่น 100"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-gray-600 text-white text-xs font-bold"
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-200 mb-1">จำนวนโค้ดที่ต้องการสร้าง</label>
                  <input
                    type="number"
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    placeholder="เช่น 10"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-gray-600 text-white text-xs font-bold"
                    min={1}
                    max={500}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-xs font-bold text-[#ebd876] bg-[#300e05] hover:bg-[#c09d3e] hover:text-black border border-[#c09d3e] shadow-md transition-all cursor-pointer mt-2"
                >
                  สร้างโค้ดทันที
                </button>
              </form>
            </div>

            {/* Generated Codes Output Box */}
            <div className="rounded-xl border border-[#b68933] bg-[#5c0a10]/95 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-200">ผลลัพธ์โค้ดที่สร้าง:</span>
                <span className="text-[10px] text-gray-300">
                  {generatedCodesText ? generatedCodesText.split('\n').filter(Boolean).length : 0} รายการ
                </span>
              </div>
              <textarea
                value={generatedCodesText}
                readOnly
                placeholder="โค้ดที่สร้างเสร็จแล้วจะแสดงที่นี่..."
                className="w-full h-36 p-2 rounded bg-zinc-950 border border-gray-700 text-amber-200 font-mono text-xs focus:outline-hidden"
              />

              <button
                type="button"
                onClick={handleCopyCodes}
                disabled={!generatedCodesText}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-black font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                📋 คัดลอกโค้ดทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
