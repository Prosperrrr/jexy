import React from 'react';

const TimelineRuler = ({ duration }) => {
  const markers = [];
  // Add markers every 30 seconds
  for (let i = 0; i <= duration; i += 30) {
    const mins = Math.floor(i / 60);
    const secs = i % 60;
    markers.push({
      time: i,
      label: `${mins}:${secs.toString().padStart(2, '0')}`
    });
  }

  return (
    <div className="relative h-8 flex items-end pb-2 w-full pt-4 px-4 sm:px-8">
      {markers.map((marker, index) => {
        const position = duration > 0 ? (marker.time / duration) * 100 : 0;
        // Adjust alignment for the first and last items so they don't overflow
        const transform = position === 0 ? 'none' : position === 100 ? 'translateX(-100%)' : 'translateX(-50%)';
        
        return (
          <div 
            key={index} 
            className="absolute text-[10px] font-bold text-slate-300 font-display pb-1"
            style={{ left: `${position}%`, transform }}
          >
            {marker.label}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineRuler;
