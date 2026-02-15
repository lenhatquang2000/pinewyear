'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    colorBase: string; // r, g, b components
    opacity: number;
    angle: number;
    pulseSpeed: number;
    isBokeh: boolean;
}

const COLORS = [
    '255, 215, 0',   // Gold
    '255, 255, 240', // Warm White
    '255, 69, 0',    // Red-Orange
    '135, 206, 235', // Sky Blue
];

export const ParticleLayer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number>(0);

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

        const isMobile = window.innerWidth < 768;
        const maxParticles = isMobile ? 60 : 120; // Increased density

        const createParticle = (initial: boolean = false): Particle => {
            const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            const isBokeh = Math.random() > 0.85;
            return {
                x: Math.random() * window.innerWidth,
                y: initial ? Math.random() * window.innerHeight : -20,
                vx: (Math.random() - 0.5) * (isBokeh ? 0.1 : 0.3),
                vy: Math.random() * (isBokeh ? 0.2 : 0.5) + 0.1,
                size: isBokeh ? Math.random() * 40 + 20 : Math.random() * 3 + 1,
                colorBase,
                opacity: isBokeh ? Math.random() * 0.05 + 0.02 : Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                isBokeh,
            };
        };

        // Initialize particles
        particles.current = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.current.push(createParticle(true));
        }

        const animate = () => {
            if (document.hidden) {
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Use lighter for glow
            ctx.globalCompositeOperation = 'lighter';

            particles.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.pulseSpeed;

                // Wrap around
                if (p.x < -100) p.x = window.innerWidth + 100;
                if (p.x > window.innerWidth + 100) p.x = -100;
                if (p.y > window.innerHeight + 100) p.y = -100;

                const currentOpacity = p.opacity * (0.7 + Math.sin(p.angle) * 0.3);

                if (p.isBokeh) {
                    // Large blurred background spots
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                    grad.addColorStop(0, `rgba(${p.colorBase}, ${currentOpacity})`);
                    grad.addColorStop(1, `rgba(${p.colorBase}, 0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Small glowing particles with halo
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                    grad.addColorStop(0, `rgba(${p.colorBase}, ${currentOpacity})`);
                    grad.addColorStop(0.2, `rgba(${p.colorBase}, ${currentOpacity * 0.5})`);
                    grad.addColorStop(1, `rgba(${p.colorBase}, 0)`);

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Core
                    ctx.fillStyle = `rgba(${p.colorBase}, ${currentOpacity * 1.5})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
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
                zIndex: -2, // Deepest layer
            }}
        />
    );
};
