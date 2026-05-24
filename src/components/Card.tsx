"use client";

import React, { useRef, useState } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl glass-panel group transition-all duration-300 ${
        onClick ? "cursor-pointer hover:translate-y-[-2px]" : ""
      } ${className}`}
    >
      {/* Background Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.03), transparent 80%)`,
        }}
      />
      
      {/* Border Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.12)",
          WebkitMaskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black, transparent)`,
          maskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black, transparent)`,
        }}
      />

      {/* Decorative corner glow when hovered */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}
