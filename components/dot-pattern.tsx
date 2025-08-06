"use client";

import React, { useRef, useEffect, useCallback } from 'react';

interface DotPatternProps {
  dotSize?: number; // Size of each square dot
  spacing?: number; // Space between dot centers
  opacity?: number; // Overall opacity of the pattern (0-1)
}

const DotPattern: React.FC<DotPatternProps> = ({
  dotSize = 8,
  spacing = 10,
  opacity = 1, // Default to full opacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to fill parent
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        // Use random for varied shades, simulating static GitHub activity
        const randomFactor = Math.random();

        let baseAlpha = 0.2; // Base opacity for inactive
        if (randomFactor > 0.8) {
          baseAlpha = 0.5; // Darker shade
        } else if (randomFactor > 0.6) {
          baseAlpha = 0.4; // Medium shade
        } else if (randomFactor > 0.4) {
          baseAlpha = 0.3; // Lighter shade
        }

        // Apply overall opacity
        const finalAlpha = baseAlpha * opacity;

        ctx.beginPath();
        ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        ctx.fill();
      }
    }
  }, [dotSize, spacing, opacity]);

  useEffect(() => {
    // Initial draw and redraw on resize
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(drawDots);
    resizeObserver.observe(canvas);

    // Initial draw
    drawDots();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawDots]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_70%)]"> {/* Ensure it covers the whole background and is not interactive */}
      <canvas ref={canvasRef} className="w-full h-full blur-[0.5px]" />
    </div>
  );
};

export default DotPattern;
