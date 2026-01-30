"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Video (fully visible & responsive) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <video
          className="w-full h-full object-contain"
          src="/hero.mp4" 
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/20" />

  
    </section>
  );
}
