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

  React.useEffect(() => {
    if (activeIndex !== -1 && containerRef.current) {
      const activeElement = containerRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="flex-1 overflow-y-auto py-16 px-6 md:px-24 relative h-full flex flex-col text-left">
      <div 
        className="max-w-4xl mx-auto w-full pb-[40vh] relative z-10 flex flex-col space-y-5"
        ref={containerRef}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;
          
          return (
            <p 
              key={idx}
              className={`font-display transition-all duration-500 ease-out cursor-pointer tracking-tight
                ${isActive 
                  ? 'text-4xl md:text-5xl font-black text-blue-600 scale-[1.01] origin-left' 
                  : isPast
                    ? 'text-2xl md:text-3xl text-slate-400/50 font-medium hover:text-slate-400'
                    : 'text-2xl md:text-3xl text-slate-300 font-medium hover:text-slate-400'}
              `}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default LyricsView;
