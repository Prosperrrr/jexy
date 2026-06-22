import React, { useRef, useEffect, useState } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatSrtTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
};

const TranscriptionSection = ({ transcript, currentTime, filename }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isCopied, setIsCopied] = useState(false);

  const segments = transcript?.segments || [];
  
  const handleCopyText = async () => {
    const fullText = transcript?.plain || segments.map(t => t.text).join('\n\n');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = (format) => {
    let content = '';
    let mimeType = 'text/plain';
    const actualFilename = filename || 'track';
    const cleanFilename = actualFilename.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    let dlFilename = `jexy_transcription_${cleanFilename}.${format}`;

    if (format === 'txt') {
      content = transcript?.plain || segments.map(l => l.text).join('\n\n');
    } else if (format === 'srt') {
      content = segments.map((l, i) => {
        return `${i + 1}\n${formatSrtTime(l.start)} --> ${formatSrtTime(l.end)}\n${l.text}\n\n`;
      }).join('');
    } else if (format === 'json') {
      content = JSON.stringify(transcript, null, 2);
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

  // Auto-scroll only when active segment changes to prevent scroll locking
  useEffect(() => {
    const newActiveIndex = segments.findIndex(t => currentTime >= t.start && currentTime < t.end);
    if (newActiveIndex !== activeIndex && newActiveIndex !== -1) {
      setActiveIndex(newActiveIndex);
      if (scrollRef.current) {
        const activeEl = scrollRef.current.querySelector(`.transcript-item-${newActiveIndex}`);
        if (activeEl) {
          // smooth scroll to keep it in center roughly
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else if (newActiveIndex === -1 && activeIndex !== -1) {
      setActiveIndex(-1);
    }
  }, [currentTime, segments, activeIndex]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          </svg>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Transcription</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCopyText}
            title="Copy Transcript"
            className="text-blue-600 hover:text-blue-700 text-[15px] font-semibold transition-colors focus:outline-none"
          >
            {isCopied ? 'Copied!' : 'Copy text'}
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[20px] p-6 h-[400px] overflow-y-auto"
      >
        <div className="space-y-6">
          {segments.map((item, idx) => {
            const isActive = currentTime >= item.start && currentTime < item.end;
            return (
              <div key={idx} className={`flex gap-4 group transcript-item-${idx} ${isActive ? 'active-transcript' : ''}`}>
                <div className="w-12 shrink-0 pt-0.5">
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-blue-400'}`}>
                    {formatTime(item.start)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-[15px] leading-relaxed transition-colors duration-200 ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-10 pb-4">
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button onClick={() => handleDownload('txt')} title="Download TXT" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">TXT</button>
        <button onClick={() => handleDownload('srt')} title="Download SRT" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">SRT</button>
        <button onClick={() => handleDownload('json')} title="Download JSON" className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">JSON</button>
      </div>
    </div>
  );
};

export default TranscriptionSection;
