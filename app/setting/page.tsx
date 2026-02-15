'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SettingPage() {
    const [countdownStart, setCountdownStart] = useState(10);
    const [familyWish, setFamilyWish] = useState('Chúc bạn một năm mới đong đầy hạnh phúc, trọn vẹn bình an và luôn tỏa sáng với những đam mê của chính mình!');
    const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546271027-3367f08df1e5?q=80&w=1000&auto=format&fit=crop');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedCount = localStorage.getItem('countdownStart');
        const savedWish = localStorage.getItem('familyWish');
        const savedImg = localStorage.getItem('familyImage');

        if (savedCount) setCountdownStart(parseInt(savedCount, 10));
        if (savedWish) setFamilyWish(savedWish);
        if (savedImg) setImageUrl(savedImg);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImageUrl(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        localStorage.setItem('countdownStart', countdownStart.toString());
        localStorage.setItem('familyWish', familyWish);
        localStorage.setItem('familyImage', imageUrl);
        alert('Đã lưu cài đặt thành công!');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white font-sans">
            <div className="w-full max-w-md rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">
                    Cài đặt Lễ hội
                </h1>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white/60 uppercase tracking-widest">
                            Thời gian đếm ngược (giây)
                        </label>
                        <input
                            type="number"
                            value={countdownStart}
                            onChange={(e) => setCountdownStart(parseInt(e.target.value, 10) || 0)}
                            className="w-full rounded-lg bg-white/10 p-3 text-white border border-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white/60 uppercase tracking-widest">
                            Câu chúc cá nhân
                        </label>
                        <textarea
                            value={familyWish}
                            onChange={(e) => setFamilyWish(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg bg-white/10 p-3 text-white border border-white/20 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white/60 uppercase tracking-widest">
                            Ảnh cá nhân
                        </label>

                        <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400/50 transition-all">
                            {imageUrl ? (
                                <div className="relative aspect-video w-full bg-black/40">
                                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg text-sm"
                                        >
                                            Thay đổi ảnh
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-8 gap-3 text-white/40 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    <span className="text-sm font-medium">Tải ảnh lên từ máy tính</span>
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Optional URL input still available below */}
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Hoặc dán link ảnh tại đây..."
                            className="w-full rounded-lg bg-white/5 p-2 text-xs text-white/40 border border-white/10 focus:outline-none focus:border-amber-400/30 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 p-3 font-bold text-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                        >
                            Lưu cài đặt
                        </button>
                        <Link
                            href="/"
                            className="w-full rounded-lg bg-white/5 p-3 text-center text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
