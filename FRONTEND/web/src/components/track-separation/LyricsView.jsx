import React, { useEffect, useRef } from 'react';

const LyricsView = ({ lyrics, currentTime }) => {
  const containerRef = useRef(null);
  
  // Find index of currently active line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time && (!lyrics[i+1] || currentTime < lyrics[i+1].time)) {
      activeIndex = i;
      break;
    }
  }

  // Auto-scroll logic
  useEffect(() => {
    if (activeIndex !== -1 && containerRef.current) {
      const activeElement = containerRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="flex-1 overflow-y-auto py-32 px-4 md:px-20 text-center relative h-full">
      <div 
        className="space-y-6 max-w-4xl mx-auto pb-40 relative z-10"
        ref={containerRef}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;
          
          return (
            <p 
              key={idx}
              className={`font-display font-bold transition-all duration-500 ease-out cursor-pointer leading-tight
                ${isActive ? 'text-4xl md:text-[56px] text-blue-600 scale-105 my-8' : 
                  isPast ? 'text-2xl md:text-5xl text-slate-200 font-semibold' : 
                  'text-2xl md:text-5xl text-slate-300/80 font-semibold'}
              `}
            >
              {line.text}
            </p>
          );
        })}
      </div>
      {/* Overlay to fade edges */}
      <div className="fixed top-[150px] bottom-[120px] left-0 right-0 pointer-events-none md:ml-64 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 z-20"></div>
    </div>
  );
};

export default LyricsView;
