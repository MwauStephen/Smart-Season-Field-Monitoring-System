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
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden shadow-2xl bg-brand-dark group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 100, damping: 20 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/40 to-transparent" />
          
          {/* Content Overlay - Inside motion.div so it slides too */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-brand-green/20 backdrop-blur-md px-3 py-1 rounded-full border border-brand-green/30">
                <Sprout className="w-4 h-4 text-brand-green" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Field Monitoring System</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Welcome back, <br className="md:hidden" />
                  <span className="text-brand-green">{userName}!</span>
                </h1>
                <p className="text-white/80 text-sm md:text-lg font-medium max-w-md leading-relaxed">
                  {role === 'admin' 
                    ? "Manage your agricultural infrastructure and oversee agent operations from your command center." 
                    : "Track your assigned field units and submit real-time growth reports."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 right-10 flex items-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button 
          onClick={() => paginate(-1)}
          className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-brand-green hover:border-brand-green hover:scale-105 transition-all shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => paginate(1)}
          className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-brand-green hover:border-brand-green hover:scale-105 transition-all shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-16 flex gap-3 z-20">
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-brand-green' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
