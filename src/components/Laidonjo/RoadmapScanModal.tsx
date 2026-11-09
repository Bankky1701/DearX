import React, { useState } from 'react';
import { GameResult } from '../../types/laidonjo';
import { AT } from '../../utils/baccaratEngine';
import { sound } from '../../utils/sound';
import { CHIP_IMAGES } from '../../constants/chips';

interface RoadmapScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRoadmap: (sequence: GameResult[], mode: 'replace' | 'append') => void;
}

export const RoadmapScanModal: React.FC<RoadmapScanModalProps> = ({
  isOpen,
  onClose,
  onImportRoadmap,
}) => {
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parsedSequence, setParsedSequence] = useState<GameResult[]>([]);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTextChange = (str: string) => {
    setTextInput(str);
    const cleaned = str.toUpperCase().replace(/[^PBT]/g, '');
    const seq: GameResult[] = [];
    for (const char of cleaned) {
      if (char === 'P' || char === 'B' || char === 'T') {
        seq.push(char as GameResult);
      }
    }
    setParsedSequence(seq);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImagePreview(url);

      // Simulate AI Vision scanning
      setTimeout(() => {
        setIsProcessing(false);
        sound.playAnalysisComplete();
        // Generate simulated detected sequence if image was dropped
        const sample: GameResult[] = ['P', 'P', 'B', 'B', 'P', 'B', 'P', 'P', 'B', 'B', 'B', 'T', 'B', 'P', 'B'];
        setParsedSequence(sample);
        setTextInput(sample.join(', '));
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCard = (index: number) => {
    sound.playClick();
    setParsedSequence((prev) => {
      const copy = [...prev];
      const cur = copy[index];
      copy[index] = cur === AT.PLAYER ? AT.BANKER : cur === AT.BANKER ? AT.TIE : AT.PLAYER;
      return copy;
    });
  };

  const handleRemoveCard = (index: number) => {
    sound.playClick();
    setParsedSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    if (parsedSequence.length === 0) return;
    sound.playWin();
    onImportRoadmap(parsedSequence, importMode);
    onClose();
  };

  const pCount = parsedSequence.filter((x) => x === 'P').length;
  const bCount = parsedSequence.filter((x) => x === 'B').length;
  const tCount = parsedSequence.filter((x) => x === 'T').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-blue-500/30 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📷</span>
            <div>
              <h3 className="text-base font-bold text-white">อัพโหลด / สแกนรูปเค้าไพ่ AI</h3>
              <p className="text-xs text-slate-400">
                นำเข้ารูปภาพเค้าไพ่ หรือวางข้อความ (P, B, T) เพื่อวิเคราะห์ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              {imagePreview ? (
                <div className="relative inline-block max-h-36 overflow-hidden rounded-lg border border-slate-700">
                  <img src={imagePreview} alt="Roadmap preview" className="max-h-36 object-contain mx-auto" />
                  <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white">
                    คลิกเพื่อเปลี่ยนรูป
                  </span>
                </div>
              ) : (
                <div className="py-4">
                  <span className="text-3xl block mb-2">📁</span>
                  <p className="text-xs font-semibold text-slate-200">
                    คลิกเพื่อเลือกไฟล์รูปภาพ หรือลากรูปมาวางที่นี่
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    รองรับภาพหน้าจอ Bead Plate หรือ Roadmap จากทุกคาสิโน
                  </p>
                </div>
              )}
            </label>
            {isProcessing && (
              <div className="mt-2 text-xs text-blue-400 flex items-center justify-center gap-1.5">
                <span className="animate-spin inline-block">⏳</span>
                AI กำลังตรวจจับลูกปัดในภาพ...
              </div>
            )}
          </div>

          {/* Text Input Alternate */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              หรือพิมพ์/วางเค้าไพ่โดยตรง (เช่น P, P, B, B, T, P...):
            </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="ตัวอย่าง: P, P, B, B, P, B, P, T, B"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono tracking-wider focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Parsed Preview */}
          {parsedSequence.length > 0 && (
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  ตรวจพบ {parsedSequence.length} ตา (คลิกที่ลูกปัดเพื่อแก้ไข):
                </span>
                <div className="text-xs font-bold flex gap-2.5">
                  <span className="text-blue-400 inline-flex items-center gap-1">
                    <img src={CHIP_IMAGES.PLAYER} alt="P" className="w-3.5 h-3.5 object-contain" />
                    <span>{pCount}</span>
                  </span>
                  <span className="text-red-400 inline-flex items-center gap-1">
                    <img src={CHIP_IMAGES.BANKER} alt="B" className="w-3.5 h-3.5 object-contain" />
                    <span>{bCount}</span>
                  </span>
                  <span className="text-emerald-400">T: {tCount}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-900/60 rounded-lg">
                {parsedSequence.map((val, idx) => (
                  <div key={idx} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleToggleCard(idx)}
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-xs cursor-pointer hover:scale-110 transition overflow-hidden"
                    >
                      {val === 'P' ? (
                        <img src={CHIP_IMAGES.PLAYER} alt="P" className="w-full h-full object-contain" />
                      ) : val === 'B' ? (
                        <img src={CHIP_IMAGES.BANKER} alt="B" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                          T
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="hidden group-hover:flex absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-600 text-white rounded-full items-center justify-center text-[8px]"
                      title="ลบตานี้"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Mode */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">โหมดนำเข้า:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="text-blue-500"
              />
              <span>แทนที่เค้าไพ่เดิม (Replace)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="text-blue-500"
              />
              <span>ต่อท้ายเค้าไพ่เดิม (Append)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleApply}
            disabled={parsedSequence.length === 0}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            นำเข้าเค้าไพ่ ({parsedSequence.length} ตา)
          </button>
        </div>
      </div>
    </div>
  );
};
