'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TransparentImageProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * A component that loads an image and removes its white/near-white background
 * using a Canvas and JavaScript.
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, alt, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.src = src;
        image.crossOrigin = "anonymous"; // Handle potential CORS issues

        image.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas size to match image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw image to canvas
            ctx.drawImage(image, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Threshold for "whitish" pixels (0-255)
            // Pixels where R, G, and B are all above this value will be made transparent
            const threshold = 220;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // data[i + 3] is alpha

                // If the pixel is close to white, make it transparent
                if (r > threshold && g > threshold && b > threshold) {
                    data[i + 3] = 0;
                }
            }

            // Put the modified data back
            ctx.putImageData(imageData, 0, 0);
            setIsProcessed(true);
        };
    }, [src]);

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <canvas
                ref={canvasRef}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: isProcessed ? 'block' : 'none',
                    objectFit: 'contain'
                }}
                aria-label={alt}
            />
            {!isProcessed && <div className="animate-pulse bg-white/10 rounded-full w-full h-full" />}
        </div>
    );
};
