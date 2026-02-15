'use client';

import React, { useEffect, useState } from 'react';
import { ParticleLayer } from './ParticleLayer';
import { FireworkLayer } from './FireworkLayer';
import { TextParticleLayer } from './TextParticleLayer';
import { LuckyTextLayer } from './LuckyTextLayer';

/**
 * NewYearBackground Component
 * 
 * Orchestrates all visual layers for the New Year theme.
 */
export const NewYearBackground: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div aria-hidden="true">
            {/* Deep Background Gradient Layer */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -2,
                    background: 'radial-gradient(circle at center, #0a0e1a 0%, #000000 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Background Decorations (Behind content) */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
                <ParticleLayer />
                <LuckyTextLayer />
            </div>

            {/* Interactive Particle Layer (Centered, z-index managed inside) */}
            <TextParticleLayer />

            {/* Firework Layer (Overlaid via its own z-index 100) */}
            <FireworkLayer />
        </div>
    );
};
