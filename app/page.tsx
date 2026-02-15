'use client';

import React, { useState, useEffect } from 'react';
import { NewYearBackground } from '@/components/NewYearBackground';

export default function Home() {
  const [showWish, setShowWish] = useState(false);
  const [wishData, setWishData] = useState({
    text: 'Chúc bạn một năm mới đong đầy hạnh phúc, trọn vẹn bình an và luôn tỏa sáng với những đam mê của chính mình!',
    image: 'https://images.unsplash.com/photo-1546271027-3367f08df1e5?q=80&w=1000&auto=format&fit=crop'
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
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <img
                  src={wishData.image}
                  alt="Personal Wish"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                {/* Greeting Overlay */}
                <div className="absolute bottom-3 md:bottom-4 left-0 right-0 text-center">
                  <span className="px-4 md:px-6 py-0.5 md:py-1 rounded-full bg-red-600/80 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase backdrop-blur-sm border border-amber-400/30">
                    Chúc Mừng Năm Mới
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 relative">
                {/* Traditional Silk Texture Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <h2 className="text-lg md:text-2xl font-serif font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] italic px-2 animate-ping-pong">
                  "{wishData.text}"
                </h2>

                <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 md:gap-4">
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
