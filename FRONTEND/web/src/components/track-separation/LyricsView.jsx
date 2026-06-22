import React, { useEffect, useRef } from 'react';

const LyricsView = ({ lyrics, currentTime, filename }) => {
  const containerRef = useRef(null);

  if (!Array.isArray(lyrics) || lyrics.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto py-16 px-6 md:px-24 relative h-full flex flex-col items-center justify-center text-center">
        <p className="text-xl md:text-2xl text-slate-300 font-display font-medium">Lyrics not available for this track.</p>
      </div>
    );
  }

  const formatSrtTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
  };

  const handleDownload = (format) => {
    let content = '';
    let mimeType = 'text/plain';
    const actualFilename = filename || 'track';
    const cleanFilename = actualFilename.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    let dlFilename = `jexy_lyrics_${cleanFilename}.${format}`;

    if (format === 'txt') {
      content = lyrics.map(l => l.text).join('\n\n');
    } else if (format === 'srt') {
      content = lyrics.map((l, i) => {
        return `${i + 1}\n${formatSrtTime(l.start)} --> ${formatSrtTime(l.end)}\n${l.text}\n\n`;
      }).join('');
    } else if (format === 'json') {
      content = JSON.stringify(lyrics, null, 2);
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dlFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Find index of currently active line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].start && (!lyrics[i+1] || currentTime < lyrics[i+1].start)) {
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
        
        {/* Download Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-200/20 pt-4">
          <button onClick={() => handleDownload('txt')} title="Download TXT" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">TXT</button>
          <button onClick={() => handleDownload('srt')} title="Download SRT" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">SRT</button>
          <button onClick={() => handleDownload('json')} title="Download JSON" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">JSON</button>
        </div>

        {/* Transcription Disclaimer */}
        <div className="pt-8 pb-8 text-center sm:text-left">
          <p className="text-slate-400 dark:text-slate-500 text-sm italic font-medium">
            Note: Lyrics and transcription might not be 100% accurate. The AI model can occasionally make mistakes or misinterpret words.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LyricsView;
