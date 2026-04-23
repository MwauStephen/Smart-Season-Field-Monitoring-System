"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ChevronLeft, ChevronRight } from "lucide-react";

interface BannerCarouselProps {
  userName: string;
  role: string;
}

const images = [
  "/hero-banner-slider-one.png",
  "/hero-bg.png",
];

export function BannerCarousel({ userName, role }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[240px] md:h-[300px] rounded-3xl overflow-hidden shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-brand-green/20 backdrop-blur-md px-3 py-1 rounded-full border border-brand-green/30 text-brand-green-foreground">
            <Sprout className="w-4 h-4 text-brand-green" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Smart Monitoring System</span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Welcome back, <span className="text-brand-green">{userName}!</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base font-medium max-w-md">
              {role === 'admin' 
                ? "You have full control over the field infrastructure and agent assignments." 
                : "Monitor your assigned fields and log growth progress in real-time."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-8 flex items-center gap-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-green hover:border-brand-green transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-green hover:border-brand-green transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-brand-green' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
