import React from 'react';

const TimelineRuler = ({ duration }) => {
  const markers = [];
  for (let i = 0; i <= duration; i += 30) {
    const mins = Math.floor(i / 60);
    const secs = i % 60;
    markers.push({
      time: i,
      label: `${mins}:${secs.toString().padStart(2, '0')}`
    });
  }

  return (
    <div className="relative h-14 flex items-end pb-3 w-full border-b border-slate-200/50 mb-2">
      {markers.map((marker, index) => {
        const position = duration > 0 ? (marker.time / duration) * 100 : 0;
        const transform = position === 0 ? 'none' : position === 100 ? 'translateX(-100%)' : 'translateX(-50%)';
        
        return (
          <div 
            key={index} 
            className="absolute text-[10px] font-bold text-slate-400/80 tracking-widest font-display pb-2 transition-colors hover:text-slate-600"
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
