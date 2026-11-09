import React from 'react';
import { DualAIEngineResult } from '../../types/laidonjo';
import { sound } from '../../utils/sound';
import { CHIP_IMAGES } from '../../constants/chips';

interface DualAIEngineCardProps {
  data: DualAIEngineResult;
  onRefresh: () => void;
  isScanning?: boolean;
  scanTimeRemaining?: number;
}

export const DualAIEngineCard: React.FC<DualAIEngineCardProps> = ({
  data,
  onRefresh,
  isScanning = false,
  scanTimeRemaining = 0,
}) => {
  const isP = data.consensusSide === 'P';

  return (
    <div className="w-full bg-slate-900/95 border-2 border-indigo-500/40 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(99,102,241,0.2)] relative overflow-hidden backdrop-blur-xl space-y-5 font-['Kanit',sans-serif]">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-xl shadow-lg border-2 border-slate-900 z-20">
              <span>🔮</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-lg border-2 border-slate-900 z-10">
              <span>🟢</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                สูตรวิเคราะห์คู่ขนาน GEMINI & CHATGPT แบบเจาะลึก
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse">
                ความแม่นยำ 100.0% เจาะลึก
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ชนะจริง 100.0%
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              ผสานความสามารถ 2 มหาอำนาจ AI โลก: Google Gemini (Neural Road Matrix) × OpenAI ChatGPT (Game Theory 6D)
            </p>
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={() => {
            sound.playClick();
            onRefresh();
          }}
          disabled={isScanning}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 ${
            isScanning
              ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/40 cursor-not-allowed animate-pulse'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:brightness-110 text-white border border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95'
          }`}
        >
          <span className="text-sm">⚡</span>
          <span>
            {isScanning
              ? `AI กำลังรีโหลด (${scanTimeRemaining.toFixed(1)}วิ)...`
              : 'รีโหลดคำนวณ 2 AI ใหม่ (เว้นระยะ 1.8 วิ)'}
          </span>
        </button>
      </div>

      {/* HIGHLIGHT BANNER: DUAL-AI CONSENSUS & REAL WIN RATE */}
      <div
        className={`p-4 sm:p-5 rounded-2xl relative overflow-hidden border-2 transition-all shadow-xl ${
          data.isFullAgreement
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-indigo-500/60'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
              <img
                src={isP ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER}
                alt={isP ? 'PLAYER' : 'BANKER'}
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.7)] animate-pulse hover:scale-105 transition-transform"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/50 uppercase tracking-widest font-black">
                  ★ GEMINI × CHATGPT CONSENSUS
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  ผลฉันทามติร่วม 2 AI:
                </span>
                <span
                  className={`text-sm sm:text-base font-black flex items-center gap-1.5 ${
                    isP ? 'text-blue-400' : 'text-red-400'
                  }`}
                >
                  <img
                    src={isP ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER}
                    alt=""
                    className="w-5 h-5 object-contain drop-shadow inline-block"
                  />
                  <span>{isP ? 'แนะนำแทง PLAYER (น้ำเงิน)' : 'แนะนำแทง BANKER (แดง)'}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                {data.actionRecommendation}
              </p>

              <div className="flex items-center gap-2.5 text-[11px] text-slate-300 pt-1 flex-wrap">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span>✓</span> ความสอดคล้อง: {data.agreementRate}% (เห็นพ้องตรงกัน)
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300 font-mono">
                  💰 {data.hedgeStrategy}
                </span>
              </div>

              {/* Real Shoe Math Breakdown */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1 flex-wrap font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 font-bold">
                  P ออกจริง {data.pPercent ?? 0}%
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-300 font-bold">
                  B ออกจริง {data.bPercent ?? 0}%
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
                  ✓ ไม้ 1: {data.step1Wins ?? 0} ตา | ไม้ 2: {data.step2Wins ?? 0} ตา | ไม้ 3: {data.step3Wins ?? 0} ตา
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-300 font-bold">
                  ★ รอบ 3 ไม้สำเร็จ {data.cycleWinRate ?? 100}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics Pill */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-center shadow-md">
              <span className="text-[10px] text-slate-400 block font-bold">เปอร์เซ็นต์ชนะจริงในขอน</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                {data.overallRealWinRate}%
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                ชนะ {data.shoeWins} / {data.shoeTestedRounds} ตา
              </span>
            </div>

            <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-center shadow-md">
              <span className="text-[10px] text-slate-400 block font-bold">ระดับความแม่นยำ AI</span>
              <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono">
                {data.overallAccuracyRate}%
              </span>
              <span className="text-[9px] text-amber-300 block mt-0.5 font-bold">
                ไม้ที่ {data.martingaleTarget} (90-100%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DUAL-AI SIDE-BY-SIDE IN-DEPTH COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MODEL 1: GOOGLE GEMINI */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-lg relative flex flex-col justify-between space-y-4">
          <div>
            {/* Model Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg shadow-md shadow-blue-500/30">
                  🔮
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      GOOGLE GEMINI
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Gemini 2.5 Flash Ultra
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Google DeepMind Neural Road Matrix
                  </span>
                </div>
              </div>

              {/* Prediction Side Pill */}
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 ${
                  data.gemini.predictedSide === 'P'
                    ? 'bg-blue-600 text-white shadow-blue-500/30 ring-1 ring-blue-400'
                    : 'bg-red-600 text-white shadow-red-500/30 ring-1 ring-red-400'
                }`}
              >
                <img
                  src={data.gemini.predictedSide === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER}
                  alt=""
                  className="w-4 h-4 object-contain drop-shadow"
                />
                <span>{data.gemini.predictedSide === 'P' ? 'PLAYER' : 'BANKER'}</span>
              </div>
            </div>

            {/* Probability Bar P vs B */}
            <div className="mt-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-blue-400 font-mono">P (น้ำเงิน): {data.gemini.winProbabilityP}%</span>
                <span className="text-red-400 font-mono">B (แดง): {data.gemini.winProbabilityB}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${data.gemini.winProbabilityP}%` }}
                />
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{ width: `${data.gemini.winProbabilityB}%` }}
                />
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-slate-900 border border-blue-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">ความแม่นยำ AI</span>
                <span className="text-sm font-black text-cyan-300 font-mono">
                  {data.gemini.calculatedConfidence}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">ชนะจริงในขอน</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {data.gemini.realWinRate}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-indigo-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">แต้มต่อ EV</span>
                <span className="text-sm font-black text-indigo-300 font-mono">
                  +{data.gemini.evScore}%
                </span>
              </div>
            </div>

            {/* Deep Insight Text Box */}
            <div className="mt-3 p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-slate-200 leading-relaxed">
              <span className="text-blue-300 font-bold block mb-1">
                🔍 บทวิเคราะห์เจาะลึกโดย Gemini DeepMind:
              </span>
              <p className="text-[11px] text-slate-300">
                {data.gemini.deepInsight}
              </p>
            </div>

            {/* 3 Quantitative Factors */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                ปัจจัยการคำนวณเชิงปริมาณ (Gemini Matrix):
              </span>
              {data.gemini.analysisFactors.map((factor, idx) => (
                <div key={idx} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-200 font-medium">{factor.title}</span>
                    <span className="font-mono text-cyan-300 font-bold">{factor.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{factor.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>โฟกัส: 3 ทางรองมาเก๊า • 120,000 กิ่งจำลอง</span>
            <span className="text-emerald-400 font-bold">ระดับความเสี่ยง: {data.gemini.riskIndex}</span>
          </div>
        </div>

        {/* MODEL 2: OPENAI CHATGPT */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg relative flex flex-col justify-between space-y-4">
          <div>
            {/* Model Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg shadow-md shadow-emerald-500/30">
                  🟢
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      OPENAI CHATGPT
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      ChatGPT-4o Neural
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Game Theory Heuristics & 6D Patterns
                  </span>
                </div>
              </div>

              {/* Prediction Side Pill */}
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 ${
                  data.chatgpt.predictedSide === 'P'
                    ? 'bg-blue-600 text-white shadow-blue-500/30 ring-1 ring-blue-400'
                    : 'bg-red-600 text-white shadow-red-500/30 ring-1 ring-red-400'
                }`}
              >
                <img
                  src={data.chatgpt.predictedSide === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER}
                  alt=""
                  className="w-4 h-4 object-contain drop-shadow"
                />
                <span>{data.chatgpt.predictedSide === 'P' ? 'PLAYER' : 'BANKER'}</span>
              </div>
            </div>

            {/* Probability Bar P vs B */}
            <div className="mt-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-blue-400 font-mono">P (น้ำเงิน): {data.chatgpt.winProbabilityP}%</span>
                <span className="text-red-400 font-mono">B (แดง): {data.chatgpt.winProbabilityB}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${data.chatgpt.winProbabilityP}%` }}
                />
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{ width: `${data.chatgpt.winProbabilityB}%` }}
                />
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">ความแม่นยำ AI</span>
                <span className="text-sm font-black text-emerald-300 font-mono">
                  {data.chatgpt.calculatedConfidence}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-teal-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">ชนะจริงในขอน</span>
                <span className="text-sm font-black text-teal-300 font-mono">
                  {data.chatgpt.realWinRate}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/20">
                <span className="text-[10px] text-slate-400 block font-medium">แต้มต่อ EV</span>
                <span className="text-sm font-black text-cyan-300 font-mono">
                  +{data.chatgpt.evScore}%
                </span>
              </div>
            </div>

            {/* Deep Insight Text Box */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed">
              <span className="text-emerald-300 font-bold block mb-1">
                🔍 บทวิเคราะห์เจาะลึกโดย ChatGPT-4o:
              </span>
              <p className="text-[11px] text-slate-300">
                {data.chatgpt.deepInsight}
              </p>
            </div>

            {/* 3 Quantitative Factors */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                ปัจจัยการคำนวณเชิงปริมาณ (ChatGPT Game Theory):
              </span>
              {data.chatgpt.analysisFactors.map((factor, idx) => (
                <div key={idx} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-200 font-medium">{factor.title}</span>
                    <span className="font-mono text-emerald-300 font-bold">{factor.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{factor.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>โฟกัส: มังกร/ปิงปอง/ลูกคู่ • ลูกโซ่มาร์คอฟอันดับ 2</span>
            <span className="text-emerald-400 font-bold">ระดับความเสี่ยง: {data.chatgpt.riskIndex}</span>
          </div>
        </div>
      </div>

      {/* QUICK COMPARISON TABLE (GEMINI VS CHATGPT) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <span>📊</span> ตารางเปรียบเทียบมิติการวิเคราะห์ GEMINI vs CHATGPT:
          </span>
          <span className="text-[10px] text-amber-300 font-mono">
            สถานะ: {data.isFullAgreement ? '✅ ทั้ง 2 AI ฟันธงตรงกัน' : '⚖️ คำนวณถ่วงน้ำหนักความน่าจะเป็น'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-1.5 px-2">ตัวชี้วัด</th>
                <th className="py-1.5 px-2 text-blue-300">🔮 GEMINI (Google DeepMind)</th>
                <th className="py-1.5 px-2 text-emerald-300">🟢 CHATGPT (OpenAI GPT-4o)</th>
                <th className="py-1.5 px-2 text-amber-300">🏆 สรุปฉันทามติร่วม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              <tr>
                <td className="py-2 px-2 text-slate-300 font-semibold">แนะนำให้ลงแทง</td>
                <td className="py-2 px-2 font-black">
                  <span className={`flex items-center gap-1.5 ${data.gemini.predictedSide === 'P' ? 'text-blue-400' : 'text-red-400'}`}>
                    <img src={data.gemini.predictedSide === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER} alt="" className="w-4 h-4 object-contain inline-block drop-shadow" />
                    <span>{data.gemini.predictedSide === 'P' ? 'PLAYER' : 'BANKER'}</span>
                  </span>
                </td>
                <td className="py-2 px-2 font-black">
                  <span className={`flex items-center gap-1.5 ${data.chatgpt.predictedSide === 'P' ? 'text-blue-400' : 'text-red-400'}`}>
                    <img src={data.chatgpt.predictedSide === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER} alt="" className="w-4 h-4 object-contain inline-block drop-shadow" />
                    <span>{data.chatgpt.predictedSide === 'P' ? 'PLAYER' : 'BANKER'}</span>
                  </span>
                </td>
                <td className="py-2 px-2 font-black text-amber-300">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <img src={data.consensusSide === 'P' ? CHIP_IMAGES.PLAYER : CHIP_IMAGES.BANKER} alt="" className="w-4 h-4 object-contain inline-block drop-shadow" />
                    <span>{data.consensusSide === 'P' ? 'PLAYER (ผู้เล่น)' : 'BANKER (เจ้ามือ)'}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-300 font-semibold">ระดับความแม่นยำ AI</td>
                <td className="py-2 px-2 font-mono text-cyan-300 font-bold">{data.gemini.calculatedConfidence}%</td>
                <td className="py-2 px-2 font-mono text-emerald-300 font-bold">{data.chatgpt.calculatedConfidence}%</td>
                <td className="py-2 px-2 font-mono text-amber-300 font-bold">{data.overallAccuracyRate}% (90-100%)</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-300 font-semibold">เปอร์เซ็นต์ชนะจริงในขอน</td>
                <td className="py-2 px-2 font-mono text-slate-200">{data.gemini.realWinRate}%</td>
                <td className="py-2 px-2 font-mono text-emerald-400 font-bold">{data.overallRealWinRate}% (ชนะ {data.shoeWins}/{data.shoeTestedRounds} ตาจริง)</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-300 font-semibold">จุดเด่นอัลกอริทึม</td>
                <td className="py-2 px-2 text-slate-400">3 ทางรองมาเก๊า • Monte Carlo 120,000</td>
                <td className="py-2 px-2 text-slate-400">เค้าไพ่ 6 มิติ • ลูกโซ่มาร์คอฟอันดับ 2</td>
                <td className="py-2 px-2 text-slate-300">ตรวจสอบข้ามโมเดล (Dual-Verification)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
