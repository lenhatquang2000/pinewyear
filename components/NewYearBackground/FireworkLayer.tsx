'use client';

import React, { useEffect, useRef } from 'react';

interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
}

interface Firework {
    x: number;
    y: number;
    targetY: number;
    vy: number;
    sparks: Spark[];
    exploded: boolean;
    color: string;
}

const COLORS = ['#FFD700', '#FF4500', '#FF69B4', '#00FFFF', '#ADFF2F', '#FFFFFF', '#FF8C00'];

export const FireworkLayer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fireworks = useRef<Firework[]>([]);
    const animationFrameId = useRef<number>(0);
    const lastBurstTime = useRef<number>(0);
    const celebrationMode = useRef<boolean>(false);
    const celebrationEndTime = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };

        const createFirework = (x?: number, y?: number, targetY?: number) => {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            fireworks.current.push({
                x: x ?? Math.random() * window.innerWidth,
                y: y ?? window.innerHeight,
                targetY: targetY ?? Math.random() * (window.innerHeight * 0.5),
                vy: -Math.random() * 4 - 4,
                sparks: [],
                exploded: false,
                color,
            });
        };

        const explode = (fw: Firework) => {
            const isMobile = window.innerWidth < 768;
            // Increased spark count for celebration
            const sparkCount = celebrationMode.current ? (isMobile ? 40 : 80) : (isMobile ? 20 : 35);

            for (let i = 0; i < sparkCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * (celebrationMode.current ? 4 : 2) + 1;
                fw.sparks.push({
                    x: fw.x,
                    y: fw.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color: fw.color,
                });
            }
        };

        const explodeBigBang = (fw: Firework) => {
            const isMobile = window.innerWidth < 768;
            const sparkCount = isMobile ? 150 : 300; // MUCH larger spark count

            for (let i = 0; i < sparkCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 2; // Much faster
                fw.sparks.push({
                    x: fw.x,
                    y: fw.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    // Use a brilliant golden/white color for the big bang
                    color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
                });
            }
        };

        const handleCelebration = () => {
            celebrationMode.current = true;
            celebrationEndTime.current = Date.now() + 10000;

            // 1. Launch a SINGLE GIANT FIREWORK in the center
            const bigBang: Firework = {
                x: window.innerWidth / 2,
                y: window.innerHeight,
                targetY: window.innerHeight * 0.4,
                vy: -7,
                sparks: [],
                exploded: false,
                color: '#FFD700',
            };

            // Add a special behavior to explodeBigBang when it reaches target
            const checkExplosion = () => {
                if (!bigBang.exploded && bigBang.y <= bigBang.targetY) {
                    bigBang.exploded = true;
                    explodeBigBang(bigBang);
                } else if (!bigBang.exploded) {
                    bigBang.y += bigBang.vy;
                    requestAnimationFrame(checkExplosion);
                }
            };

            fireworks.current.push(bigBang);

            // 2. IMMEDIATE Supporting Burst
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    createFirework(
                        Math.random() * window.innerWidth,
                        window.innerHeight,
                        Math.random() * (window.innerHeight * 0.6)
                    );
                }, i * 200 + 1000); // Start after the big one gets halfway
            }
        };

        const animate = (time: number) => {
            if (document.hidden) {
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }

            // Check if celebration is still active
            if (celebrationMode.current && Date.now() > celebrationEndTime.current) {
                celebrationMode.current = false;
            }

            // Spawning logic
            const spawnInterval = celebrationMode.current ? 200 : 1200;
            if (time - lastBurstTime.current > spawnInterval + Math.random() * (celebrationMode.current ? 300 : 1800)) {
                const count = celebrationMode.current ? (window.innerWidth < 768 ? 2 : 4) : (Math.random() > 0.7 ? 3 : (Math.random() > 0.4 ? 2 : 1));
                for (let k = 0; k < count; k++) {
                    createFirework();
                }
                lastBurstTime.current = time;
            }

            // High-performance trail effect
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = fireworks.current.length - 1; i >= 0; i--) {
                const fw = fireworks.current[i];
                if (!fw.exploded) {
                    fw.y += fw.vy;
                    if (fw.y <= fw.targetY) {
                        fw.exploded = true;
                        explode(fw);
                    } else {
                        ctx.beginPath();
                        ctx.arc(fw.x, fw.y, 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = fw.color;
                        ctx.fill();
                    }
                } else {
                    for (let j = fw.sparks.length - 1; j >= 0; j--) {
                        const s = fw.sparks[j];
                        s.x += s.vx;
                        s.y += s.vy;
                        s.vy += 0.06; // Gravity
                        s.alpha -= celebrationMode.current ? 0.01 : 0.015; // Longer lasting sparks in celebration

                        if (s.alpha <= 0) {
                            fw.sparks.splice(j, 1);
                        } else {
                            ctx.beginPath();
                            ctx.arc(s.x, s.y, celebrationMode.current ? 1.5 : 1, 0, Math.PI * 2);
                            ctx.globalAlpha = s.alpha;
                            ctx.fillStyle = s.color;
                            ctx.fill();
                        }
                    }
                    ctx.globalAlpha = 1;

                    if (fw.sparks.length === 0) {
                        fireworks.current.splice(i, 1);
                    }
                }
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('countdown-finished', handleCelebration);
        handleResize();
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('countdown-finished', handleCelebration);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    if (typeof window === 'undefined') return null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 100, // Overlay everything
            }}
        />
    );
};
