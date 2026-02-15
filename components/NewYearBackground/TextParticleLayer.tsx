'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * TextParticleLayer
 * Highly optimized particle text with a premium radial glow (quang sáng).
 * Handles '2026', a 'BẮT ĐẦU' button, and a countdown timer.
 * Optimized for smooth transitions and perfect centering.
 */
export const TextParticleLayer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [count, setCount] = useState(0);

    // Core refs
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameId = useRef<number>(0);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const globalTimeRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const currentTargetRef = useRef<string>('2026');

    const spriteCache: Record<string, HTMLCanvasElement> = {};
    const PALETTE = ['#FFFFFF', '#FFD700', '#FFF8E1', '#FFAB00'];

    const createParticleSprite = (color: string, size: number) => {
        const cacheKey = `${color}-${size.toFixed(1)}`;
        if (spriteCache[cacheKey]) return spriteCache[cacheKey];

        const spriteCanvas = document.createElement('canvas');
        const spriteSize = Math.max(1, size * 6);
        spriteCanvas.width = spriteSize;
        spriteCanvas.height = spriteSize;
        const sCtx = spriteCanvas.getContext('2d');
        if (sCtx) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            const grad = sCtx.createRadialGradient(
                spriteSize / 2, spriteSize / 2, 0,
                spriteSize / 2, spriteSize / 2, spriteSize / 2
            );
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
            grad.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.8)`);
            grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            sCtx.fillStyle = grad;
            sCtx.beginPath();
            sCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
            sCtx.fill();
        }
        spriteCache[cacheKey] = spriteCanvas;
        return spriteCanvas;
    };

    class Particle {
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        targetX: number;
        targetY: number;
        size: number;
        density: number;
        color: string;
        opacity: number;
        angle: number;
        pulseSpeed: number;
        sprite: HTMLCanvasElement;
        active: boolean = true;

        constructor(x: number, y: number) {
            const isMobile = window.innerWidth < 768;
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.baseX = x;
            this.baseY = y;
            this.targetX = x;
            this.targetY = y;
            this.size = (Math.random() * 1.5 + 0.8) * (isMobile ? 1.4 : 1);
            this.density = Math.random() * 20 + 5;
            this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            this.opacity = isMobile ? (Math.random() * 0.3 + 0.7) : (Math.random() * 0.5 + 0.5);
            this.angle = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.1 + 0.05;
            this.sprite = createParticleSprite(this.color, this.size);
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (!this.active) return;
            const alpha = this.opacity * (0.4 + Math.sin(this.angle) * 0.3); // Reduced brightness and pulse range
            ctx.globalAlpha = alpha;
            const drawSize = this.sprite.width;
            ctx.drawImage(
                this.sprite,
                this.x - drawSize / 2,
                this.y - drawSize / 2
            );
        }

        update(mouseX: number, mouseY: number, currentTargetX: number, currentTargetY: number) {
            this.angle += this.pulseSpeed;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * this.density;
                this.y -= (dy / distance) * force * this.density;
            } else {
                this.x -= (this.x - currentTargetX) * 0.4;
                this.y -= (this.y - currentTargetY) * 0.4;
            }
        }
    }

    const getSamplePoints = (text: string, font: string, x: number, y: number, step: number) => {
        if (!ctxRef.current || !canvasRef.current) return [];
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const dpr = window.devicePixelRatio || 1;

        // Use a temporary high-res buffer for sampling to ensure centering
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tCtx = tempCanvas.getContext('2d');
        if (!tCtx) return [];

        tCtx.scale(dpr, dpr);
        tCtx.fillStyle = 'white';
        tCtx.font = font;
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        tCtx.fillText(text, x, y);

        const textData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const points = [];

        for (let py = 0; py < textData.height; py += step) {
            for (let px = 0; px < textData.width; px += step) {
                const index = (Math.floor(py) * 4 * textData.width) + (Math.floor(px) * 4) + 3;
                if (textData.data[index] > 128) {
                    points.push({ x: px / dpr, y: py / dpr });
                }
            }
        }
        return points;
    };

    const updateParticleTargets = (text: string) => {
        if (!canvasRef.current) return;

        currentTargetRef.current = text;
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isButtonNeeded = !isCountdownActive && text === '2026';

        // Responsive Font Sizes
        const mainFontSize = isMobile ? (text.length > 2 ? '110px' : '160px') : '220px';
        const buttonFontSize = isMobile ? '36px' : '40px';
        const buttonYOffset = isMobile ? 120 : 180;
        const step = isMobile ? 8 : 7; // Increased step to reduce particle density

        // Target points for main text
        const mainPoints = getSamplePoints(
            text,
            `900 ${mainFontSize} Arial Black, sans-serif`,
            width / 2,
            window.innerHeight / 2,
            step
        );

        // Target points for button
        let buttonPoints: { x: number, y: number }[] = [];
        if (isButtonNeeded) {
            buttonPoints = getSamplePoints(
                'BẮT ĐẦU',
                `900 ${buttonFontSize} Arial Black, sans-serif`,
                width / 2,
                window.innerHeight / 2 + buttonYOffset,
                step + 1 // Even less density for the button to look cleaner
            );
        }

        const allTargetPoints = [...mainPoints, ...buttonPoints];

        // Reuse existing particles
        let i = 0;
        for (; i < allTargetPoints.length; i++) {
            if (particlesRef.current[i]) {
                const p = particlesRef.current[i];
                p.baseX = allTargetPoints[i].x;
                p.baseY = allTargetPoints[i].y;
                p.active = true;
            } else {
                const p = new Particle(allTargetPoints[i].x, allTargetPoints[i].y);
                particlesRef.current.push(p);
            }
        }

        // Deactivate unused particles
        for (; i < particlesRef.current.length; i++) {
            particlesRef.current[i].active = false;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctxRef.current = ctx;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            updateParticleTargets(isCountdownActive ? count.toString() : '2026');
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleClick = (e: MouseEvent) => {
            if (isCountdownActive || currentTargetRef.current !== '2026') return;

            // Responsive hit detection for the button
            const width = window.innerWidth;
            const isMobile = width < 768;
            const bx = width / 2;
            const buttonYOffset = isMobile ? 120 : 180;
            const by = window.innerHeight / 2 + buttonYOffset;

            const dx = e.clientX - bx;
            const dy = e.clientY - by;

            // Larger hit area for touch/mobile
            const hitW = isMobile ? 80 : 120;
            const hitH = isMobile ? 30 : 40;

            if (Math.abs(dx) < hitW && Math.abs(dy) < hitH) {
                const startValue = parseInt(localStorage.getItem('countdownStart') || '10', 10);
                setCount(startValue);
                setIsCountdownActive(true);
                // Notify other components
                window.dispatchEvent(new CustomEvent('countdown-started'));
            }
        };

        const animate = () => {
            if (!ctxRef.current) return;
            const ctx = ctxRef.current;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalCompositeOperation = 'lighter';

            globalTimeRef.current += 0.02;
            const t = globalTimeRef.current;

            const globalSwayX = Math.sin(t) * 12;
            const globalSwayY = Math.cos(t * 1.5) * 8;

            particlesRef.current.forEach(p => {
                if (!p.active) return;

                // Responsive Sway logic
                const isMobile = window.innerWidth < 768;
                const buttonYLimit = window.innerHeight / 2 + (isMobile ? 80 : 100);
                const isButtonPart = p.baseY > buttonYLimit;
                const swayMult = isButtonPart ? 0.3 : 1.0;

                const individualSwayX = Math.sin(t * 0.8 + p.baseX * 0.05) * (isButtonPart ? 2 : (isMobile ? 3 : 5));
                const individualSwayY = Math.cos(t * 0.6 + p.baseY * 0.05) * (isButtonPart ? 2 : (isMobile ? 3 : 5));

                const targetX = p.baseX + globalSwayX * swayMult + individualSwayX;
                const targetY = p.baseY + globalSwayY * swayMult + individualSwayY;

                p.update(mouseRef.current.x, mouseRef.current.y, targetX, targetY);
                p.draw(ctx);
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const handleTouchEnd = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);

        handleResize(); // Initial setup
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    // Handle countdown logic
    useEffect(() => {
        if (isCountdownActive) {
            updateParticleTargets(count.toString());

            if (count > 0) {
                const timer = setTimeout(() => setCount(c => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setIsCountdownActive(false);
                    updateParticleTargets('2026');
                    // Notify that countdown is finished
                    window.dispatchEvent(new CustomEvent('countdown-finished'));
                }, 4000); // Give some time for the '0' to be seen
                return () => clearTimeout(timer);
            }
        }
    }, [count, isCountdownActive]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'auto',
                zIndex: 5,
                cursor: isCountdownActive ? 'default' : 'pointer'
            }}
        />
    );
};
