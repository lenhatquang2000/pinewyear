'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [showWish, setShowWish] = useState(false);
  const [wishData, setWishData] = useState({
    text: 'Chúc gia đình một năm mới Vạn Sự Như Ý, An Khang Thịnh Vượng!',
    image: 'https://images.unsplash.com/photo-1546271027-3367f08df1e5?q=80&w=1000&auto=format&fit=crop'
  });

  useEffect(() => {
    // Sync settings from localStorage
    const updateWishData = () => {
      const savedWish = localStorage.getItem('familyWish');
      const savedImg = localStorage.getItem('familyImage');
      if (savedWish || savedImg) {
        setWishData({
          text: savedWish || wishData.text,
          image: savedImg || wishData.image
        });
      }
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

      {/* Settings Link */}
      <div className="absolute top-6 right-6 z-20">
        <a
          href="/setting"
          className="rounded-full bg-white/5 p-3 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors group"
          title="Cài đặt"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-white transition-colors">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </a>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Happy New Year Text - Moves up when wish is shown */}
        <div className={`transition-all duration-1000 ease-in-out ${showWish ? 'mb-8 translate-y-[-20px]' : 'mt-[200px]'}`}>
          <p className="text-lg font-bold tracking-[0.8em] text-white/40 uppercase">
            <span className="bg-gradient-to-r from-amber-200 via-white to-orange-200 bg-clip-text text-transparent">
              Happy New Year
            </span>
          </p>
        </div>

        {/* Family Wish Card - Premium 'Tết' Theme */}
        {showWish && (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 w-full max-w-4xl overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-600/20 via-black/40 to-amber-600/20 p-[2px] backdrop-blur-3xl border border-amber-500/30 shadow-[0_0_100px_rgba(220,38,38,0.2)] mt-8 group relative">

            {/* Decorative Corner Blossoms (SVG) */}
            <div className="absolute top-0 left-0 p-4 opacity-60 pointer-events-none z-20">
              <svg width="60" height="60" viewBox="0 0 100 100" className="text-amber-400 rotate-[-15deg]">
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                {[0, 72, 144, 216, 288].map(a => (
                  <ellipse key={a} cx="50" cy="30" rx="15" ry="22" fill="currentColor" transform={`rotate(${a} 50 50)`} />
                ))}
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 p-4 opacity-60 pointer-events-none z-20">
              <svg width="80" height="80" viewBox="0 0 100 100" className="text-red-500 rotate-[165deg]">
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                {[0, 72, 144, 216, 288].map(a => (
                  <ellipse key={a} cx="50" cy="30" rx="15" ry="22" fill="currentColor" transform={`rotate(${a} 50 50)`} />
                ))}
              </svg>
            </div>

            <div className="bg-black/40 rounded-[2.9rem] overflow-hidden">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-t-[2rem]">
                <img
                  src={wishData.image}
                  alt="Family Wish"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Greeting Overlay */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="px-6 py-1 rounded-full bg-red-600/80 text-white text-xs font-bold tracking-[0.3em] uppercase backdrop-blur-sm border border-amber-400/30">
                    Chúc Mừng Năm Mới
                  </span>
                </div>
              </div>

              <div className="p-10 md:p-16 relative">
                {/* Traditional Silk Texture Pattern (Optional/Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] italic">
                  "{wishData.text}"
                </h2>

                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
                    <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
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
