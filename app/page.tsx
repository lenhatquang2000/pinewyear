'use client';

import React, { useState, useEffect } from 'react';
import { NewYearBackground } from '@/components/NewYearBackground';

export default function Home() {
  const [showWish, setShowWish] = useState(false);
  const [wishData, setWishData] = useState({
    text: '✨ 𝐇𝐚𝐩𝐩𝐲 𝐍𝐞𝐰 𝐘𝐞𝐚𝐫 𝟐𝟎𝟐𝟔 ✨\nGửi tới ný ngầu nhất dải ngân hà 🪐💫\n\nChúc ný năm mới:\n🌸 Nhan sắc: Cứ giữ vững phong độ "đỉnh chóp", lúc nào cũng rạng rỡ.\n💪 Cá tính: Cứ việc mạnh mẽ, quyết đoán như "tổng tài" nhoa ní 😆\n💰 Túi tiền: Lúc nào cũng rủng rỉnh để... dẫn tui đi ăn cả thế giới (hứa sẽ ngoan mà).😗\n\nMong rằng năm nay ný sẽ bớt "cọc" với chị lại một xíu, nhưng iu thương thì dành cho chị phải tăng thêm nhiều xíu nhaaa! Mãi iu! 💖₊˚⊹♡',
    image: ''
  });

  useEffect(() => {
    // Sync settings from Server API
    const updateWishData = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.familyWish || data.familyImage) {
            setWishData({
              text: data.familyWish || wishData.text,
              image: data.familyImage || wishData.image
            });
            // Update countdown reference in localStorage so particle layer can pick it up
            if (data.countdownStart) {
              localStorage.setItem('countdownStart', data.countdownStart.toString());
            }
          }
        })
        .catch(err => console.error('Failed to sync settings:', err));
    };

    updateWishData();

    // Listen for countdown events
    const handleStart = () => setShowWish(false);
    const handleFinish = () => {
      updateWishData();
      setShowWish(true);
    };

    window.addEventListener('countdown-started', handleStart);
    window.addEventListener('countdown-finished', handleFinish);

    return () => {
      window.removeEventListener('countdown-started', handleStart);
      window.removeEventListener('countdown-finished', handleFinish);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans">
      <NewYearBackground />
      {/* Premium Background Glows & Bokeh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large static glows */}
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-indigo-900/20 blur-[180px]" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-rose-900/10 blur-[120px] animate-pulse-slow" />

        {/* Dynamic Bokeh Spots */}
        <div className="absolute top-[15%] left-[25%] h-32 w-32 rounded-full bg-white/5 blur-2xl animate-float-slow" />
        <div className="absolute bottom-[20%] left-[10%] h-48 w-48 rounded-full bg-gold-500/5 blur-3xl animate-float" />
        <div className="absolute top-[60%] right-[15%] h-40 w-40 rounded-full bg-amber-200/5 blur-2xl animate-float-reverse" />
      </div>



      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">


        {/* Personal Wish Card - Premium 'Tết' Theme */}
        {showWish && (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 w-full max-w-lg overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-red-600/20 via-black/40 to-amber-600/20 p-[1px] md:p-[2px] backdrop-blur-3xl border border-amber-500/30 shadow-[0_0_100px_rgba(220,38,38,0.2)] animate-glow-shimmer mt-4 md:mt-8 group relative mx-auto">

            {/* Decorative Horse Silhouettes (Year of the Horse 2026) */}
            <div className="absolute top-0 left-0 p-4 md:p-6 opacity-60 pointer-events-none z-20">
              <img
                src="/z7536414554090_a8eef6981e15bcf407762f518a7bd877-removebg-preview.png"
                alt="Decorative Icon"
                className="w-12 h-12 md:w-16 md:h-16 object-contain animate-float-icon drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-4 md:p-8 opacity-60 pointer-events-none z-20">
              <img
                src="/z7536414554090_a8eef6981e15bcf407762f518a7bd877-removebg-preview.png"
                alt="Decorative Icon"
                className="w-14 h-14 md:w-20 md:h-20 object-contain animate-float-icon-reverse drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              />
            </div>

            <div className="bg-black/40 rounded-[1.95rem] md:rounded-[2.9rem] overflow-hidden">
              <div className="p-8 md:p-12 relative min-h-[300px] flex flex-col justify-center">
                {/* Greeting Header */}
                <div className="mb-8 text-center">
                  <span className="px-5 py-2 rounded-full bg-red-600/20 text-red-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase backdrop-blur-sm border border-red-500/30">
                    Happy New Year 2026
                  </span>
                </div>

                {/* Traditional Silk Texture Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div className="text-base md:text-xl font-serif font-medium leading-[1.8] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-pre-line px-2 text-center">
                  {wishData.text}
                </div>

                <div className="mt-8 md:mt-10 flex items-center justify-center gap-3 md:gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                  <div className="flex gap-1.5 md:gap-2">
                    <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
                    <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
