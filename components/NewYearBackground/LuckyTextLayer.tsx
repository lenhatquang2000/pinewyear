'use client';

import React, { useEffect, useRef } from 'react';

/**
 * LuckyTextLayer
 * Renders 'PHÚC - LỘC - THỌ' and 'AN KHANG THỊNH VƯỢNG - VẠN SỰ NHƯ Ý' 
 * as subtle glowing red and gold particles in the background.
 */
export const LuckyTextLayer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let globalTime = 0;

        const PALETTE = ['#FF0000', '#FFD700', '#FF4500', '#FFDAB9'];

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            color: string;
            opacity: number;
            angle: number;
            pulseSpeed: number;

            constructor(x: number, y: number, color: string) {
                this.x = x + (Math.random() - 0.5) * 40;
                this.y = y + (Math.random() - 0.5) * 40;
                this.baseX = x;
                this.baseY = y;
                this.size = Math.random() * 1.0 + 0.5;
                this.color = color;
                this.opacity = Math.random() * 0.4 + 0.3;
                this.angle = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.05 + 0.02;
            }

            draw() {
                const alpha = this.opacity * (0.6 + Math.sin(this.angle) * 0.4);
                ctx!.globalAlpha = alpha;

                const g = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                g.addColorStop(0, this.color);
                g.addColorStop(1, 'transparent');
                ctx!.fillStyle = g;

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx!.fill();
            }

            update(t: number) {
                this.angle += this.pulseSpeed;
                const swayX = Math.sin(t * 0.5 + this.baseX * 0.01) * 8;
                const swayY = Math.cos(t * 0.4 + this.baseY * 0.01) * 12;

                this.x = this.baseX + swayX;
                this.y = this.baseY + swayY;
            }
        }

        const sampleText = (text: string, xPos: number, yPos: number, color: string, fontSize: number = 80) => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = window.innerWidth;
            tempCanvas.height = window.innerHeight;
            const tCtx = tempCanvas.getContext('2d');
            if (!tCtx) return;

            tCtx.fillStyle = 'white';
            tCtx.font = `bold ${fontSize}px "Times New Roman", serif`;
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            tCtx.fillText(text, xPos, yPos);

            const data = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            // Increased step for better performance with more text
            const step = window.innerWidth < 768 ? 10 : 7;

            for (let y = 0; y < tempCanvas.height; y += step) {
                for (let x = 0; x < tempCanvas.width; x += step) {
                    if (data.data[(Math.floor(y) * 4 * tempCanvas.width) + (Math.floor(x) * 4) + 3] > 128) {
                        particles.push(new Particle(x, y, color));
                    }
                }
            }
        }

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);

            particles = [];
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Centered stacked for small mobile
                sampleText('PHÚC', window.innerWidth * 0.5, window.innerHeight * 0.08, '#FFD700', 50);
                sampleText('LỘC', window.innerWidth * 0.5, window.innerHeight * 0.15, '#FF0000', 50);
                sampleText('THỌ', window.innerWidth * 0.5, window.innerHeight * 0.22, '#FFD700', 50);

                sampleText('AN KHANG THỊNH VƯỢNG', window.innerWidth * 0.5, window.innerHeight * 0.85, '#FF0000', 24);
                sampleText('VẠN SỰ NHƯ Ý', window.innerWidth * 0.5, window.innerHeight * 0.92, '#FFD700', 24);
            } else {
                // Desktop / Tablet
                const isTablet = window.innerWidth < 1024;

                sampleText('PHÚC', window.innerWidth * 0.1, window.innerHeight * 0.15, '#FFD700', isTablet ? 60 : 90);
                sampleText('LỘC', window.innerWidth * 0.5, window.innerHeight * 0.1, '#FF0000', isTablet ? 60 : 90);
                sampleText('THỌ', window.innerWidth * 0.9, window.innerHeight * 0.15, '#FFD700', isTablet ? 60 : 90);

                // Bottom Wishes
                sampleText('AN KHANG THỊNH VƯỢNG', window.innerWidth * 0.5, window.innerHeight * 0.82, '#FF0000', isTablet ? 35 : 45);
                sampleText('VẠN SỰ NHƯ Ý', window.innerWidth * 0.5, window.innerHeight * 0.92, '#FFD700', isTablet ? 35 : 45);

                // Hide side wishes on tablet to avoid clutter
                if (!isTablet) {
                    sampleText('VẠN SỰ', window.innerWidth * 0.1, window.innerHeight * 0.85, '#FFD700', 40);
                    sampleText('NHƯ Ý', window.innerWidth * 0.9, window.innerHeight * 0.85, '#FF0000', 40);
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalCompositeOperation = 'lighter';

            globalTime += 0.02;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(globalTime);
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: -1,
            }}
        />
    );
};
