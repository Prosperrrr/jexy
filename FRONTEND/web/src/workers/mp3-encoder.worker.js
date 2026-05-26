self.onmessage = function(e) {
  const { left, right, numChannels, sampleRate, length } = e.data;
  
  try {
    const buffer = new ArrayBuffer(44 + length * 4); // 44 byte header + 16-bit stereo data (4 bytes per sample)
    const view = new DataView(buffer);
    
    // Write WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 4, true); // file length - 8
    writeString(8, 'WAVE');
    
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // format = PCM
    view.setUint16(22, 2, true); // channels = stereo (force stereo for export)
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * 4, true); // byte rate (sampleRate * blockAlign)
    view.setUint16(32, 4, true); // block align (channels * 2)
    view.setUint16(34, 16, true); // bits per sample
    
    writeString(36, 'data');
    view.setUint32(40, length * 4, true); // data chunk size
    
    // Interleave channels and convert to 16-bit
    let offset = 44;
    for (let i = 0; i < length; i++) {
      // Left channel
      let sL = Math.max(-1, Math.min(1, left[i]));
      view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7FFF, true);
      offset += 2;
      
      // Right channel
      let sR = Math.max(-1, Math.min(1, right[i]));
      view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7FFF, true);
      offset += 2;
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    self.postMessage({ success: true, blob });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};
