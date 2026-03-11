"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type PixelGridBackgroundProps = {
    gridCols?: number;
    gridRows?: number;
    maxElevation?: number;
    elevationSmoothing?: number;
    backgroundColor?: string;
    gridColor?: string;
    gapRatio?: number;
    borderColor?: string;
    borderOpacity?: number;
    className?: string;
    interactiveRadius?: number;
};

export const PixelGridBackground: React.FC<PixelGridBackgroundProps> = ({
    gridCols = 40,
    gridRows = 30,
    maxElevation = 20,
    elevationSmoothing = 0.1,
    backgroundColor = "#030303",
    gridColor = "#1a1a1a",
    gapRatio = 0.1,
    borderColor = "#ffffff",
    borderOpacity = 0.05,
    className,
    interactiveRadius = 150,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const elevationsRef = useRef<number[][]>([]);
    const animationRef = useRef<number>(0);

    // Initialize elevations
    useEffect(() => {
        elevationsRef.current = Array.from({ length: gridRows }, () =>
            Array.from({ length: gridCols }, () => 0)
        );
    }, [gridCols, gridRows]);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Clear background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        const cellSize = Math.max(width / gridCols, height / gridRows);
        const gap = cellSize * gapRatio;

        const gridWidth = cellSize * gridCols;
        const gridHeight = cellSize * gridRows;
        const offsetXGrid = (width - gridWidth) / 2;
        const offsetYGrid = (height - gridHeight) / 2;

        const borderRGB = {
            r: parseInt(borderColor.slice(1, 3), 16) || 255,
            g: parseInt(borderColor.slice(3, 5), 16) || 255,
            b: parseInt(borderColor.slice(5, 7), 16) || 255,
        };

        const gridRGB = {
            r: parseInt(gridColor.slice(1, 3), 16) || 26,
            g: parseInt(gridColor.slice(3, 5), 16) || 26,
            b: parseInt(gridColor.slice(5, 7), 16) || 26,
        };

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const x = offsetXGrid + col * cellSize;
                const y = offsetYGrid + row * cellSize;
                const centerX = x + cellSize / 2;
                const centerY = y + cellSize / 2;

                const dist = Math.sqrt(
                    Math.pow(centerX - mouseRef.current.x, 2) +
                    Math.pow(centerY - mouseRef.current.y, 2)
                );

                const targetElevation = dist < interactiveRadius
                    ? (1 - dist / interactiveRadius) * maxElevation
                    : 0;

                elevationsRef.current[row][col] +=
                    (targetElevation - elevationsRef.current[row][col]) * elevationSmoothing;

                const elevation = elevationsRef.current[row][col];
                const offsetX = -elevation * 0.8;
                const offsetY = -elevation * 1.2;

                if (elevation > 0.1) {
                    // Shadow
                    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.4, elevation * 0.05)})`;
                    ctx.fillRect(
                        x + gap / 2 + elevation * 1,
                        y + gap / 2 + elevation * 1.5,
                        cellSize - gap,
                        cellSize - gap
                    );

                    // Sides
                    ctx.fillStyle = `rgb(${Math.max(0, gridRGB.r - 10)}, ${Math.max(0, gridRGB.g - 10)}, ${Math.max(0, gridRGB.b - 10)})`;
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize - gap / 2 + offsetX, y + gap / 2 + offsetY);
                    ctx.lineTo(x + cellSize - gap / 2, y + gap / 2);
                    ctx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
                    ctx.lineTo(x + cellSize - gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = `rgb(${Math.max(0, gridRGB.r - 5)}, ${Math.max(0, gridRGB.g - 5)}, ${Math.max(0, gridRGB.b - 5)})`;
                    ctx.beginPath();
                    ctx.moveTo(x + gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
                    ctx.lineTo(x + gap / 2, y + cellSize - gap / 2);
                    ctx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
                    ctx.lineTo(x + cellSize - gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
                    ctx.closePath();
                    ctx.fill();
                }

                // Top face
                const brightness = 1 + elevation * 0.05;
                ctx.fillStyle = `rgb(${Math.min(255, Math.round(gridRGB.r * brightness))}, ${Math.min(255, Math.round(gridRGB.g * brightness))}, ${Math.min(255, Math.round(gridRGB.b * brightness))})`;
                ctx.fillRect(
                    x + gap / 2 + offsetX,
                    y + gap / 2 + offsetY,
                    cellSize - gap,
                    cellSize - gap
                );

                // Border
                ctx.strokeStyle = `rgba(${borderRGB.r}, ${borderRGB.g}, ${borderRGB.b}, ${borderOpacity + elevation * 0.01})`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(
                    x + gap / 2 + offsetX,
                    y + gap / 2 + offsetY,
                    cellSize - gap,
                    cellSize - gap
                );
            }
        }

        animationRef.current = requestAnimationFrame(render);
    }, [
        gridCols,
        gridRows,
        maxElevation,
        elevationSmoothing,
        backgroundColor,
        gridColor,
        gapRatio,
        borderColor,
        borderOpacity,
        interactiveRadius,
    ]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationRef.current);
    }, [render]);

    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const handlePointerLeave = () => {
        mouseRef.current = { x: -1000, y: -1000 };
    };

    return (
        <div className={cn("relative h-full w-full", className)}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                className="h-full w-full block"
            />
        </div>
    );
};
