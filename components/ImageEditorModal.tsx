
import React, { useState, useEffect } from 'react';

interface ImageEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    originalPrompt: string;
    onRegenerate: (instruction: string) => void;
    sceneTitle: string;
}

const QUICK_FIXES = [
    { label: "Đối tượng quá to", instruction: "Make the main subject smaller to fit better in the composition." },
    { label: "Đối tượng quá nhỏ", instruction: "Make the main subject larger and more prominent." },
    { label: "Sai màu sắc", instruction: "Correct the colors to match the reference product exactly." },
    { label: "Xóa chi tiết thừa", instruction: "Remove any extra objects, artifacts, or clutter." },
    { label: "Sửa lỗi Text", instruction: "Fix the text spelling and ensure it is clearly visible." },
    { label: "Làm nét ảnh", instruction: "Upscale and sharpen details, improve lighting and textures." },
];

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, imageUrl, originalPrompt, onRegenerate, sceneTitle }) => {
    const [instruction, setInstruction] = useState('');
    const [activeFix, setActiveFix] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setInstruction('');
            setActiveFix(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFixClick = (fix: { label: string, instruction: string }) => {
        setInstruction(fix.instruction);
        setActiveFix(fix.label);
    };

    const handleRegenerate = () => {
        if (!instruction.trim()) return;
        onRegenerate(instruction);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
            <div
                className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all border border-white/10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* LEFT: Image View */}
                <div className="flex-1 bg-black/50 p-6 flex flex-col justify-center items-center relative border-r border-white/5">
                    <h3 className="absolute top-6 left-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        Đang chỉnh sửa: <span className="text-white">{sceneTitle}</span>
                    </h3>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={imageUrl}
                            alt="Editing"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/5">
                            <p className="text-[10px] text-slate-400 font-medium line-clamp-2">
                                <strong className="text-indigo-400 uppercase tracking-wider mr-2">Prompt Gốc:</strong>
                                {originalPrompt}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Tools Panel */}
                <div className="w-[350px] bg-slate-900/50 flex flex-col border-l border-white/5">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-1">Công cụ chỉnh sửa</h2>
                        <p className="text-[10px] text-slate-500 font-medium">Chọn lỗi cần sửa hoặc nhập yêu cầu</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Quick Fixes */}
                        <div className="mb-8">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Sửa nhanh (AI Presets)</label>
                            <div className="grid grid-cols-1 gap-2">
                                {QUICK_FIXES.map((fix) => (
                                    <button
                                        key={fix.label}
                                        onClick={() => handleFixClick(fix)}
                                        className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group
                      ${activeFix === fix.label
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                                : 'bg-slate-800/50 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-white/10'
                                            }`}
                                    >
                                        <span className="text-[11px] font-bold uppercase tracking-wide">{fix.label}</span>
                                        {activeFix === fix.label && (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Manual Instruction */}
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Yêu cầu cụ thể</label>
                            <textarea
                                value={instruction}
                                onChange={(e) => {
                                    setInstruction(e.target.value);
                                    setActiveFix(null); // Clear preset selection if typing manually
                                }}
                                className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                                placeholder="VD: Làm cho cái hộp màu đỏ hơn, xóa cái ghế ở góc..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm">
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRegenerate}
                                disabled={!instruction.trim()}
                                className="flex-[2] py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Tạo lại ảnh</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;
