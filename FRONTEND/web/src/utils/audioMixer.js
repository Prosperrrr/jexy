

// Convert Float32Array from AudioBuffer to Int16Array for lamejs
function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
}

export async function mixStemsClientSide(stems) {
  // stems: [{ name: 'Vocals', url: 'https...', volume: 100 }, ...]
  
  if (!stems || stems.length === 0) {
    throw new Error('No stems provided for mixing');
  }

  // 1. Fetch and decode all audio files
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  const decodedBuffers = await Promise.all(
    stems.map(async (stem) => {
      const response = await fetch(stem.url, { mode: 'cors' });
      if (!response.ok) throw new Error(`Failed to fetch ${stem.name}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      return {
        name: stem.name,
        buffer: audioBuffer,
        volume: stem.volume ?? 100,
      };
    })
  );

  // 2. Find longest duration
  let maxDuration = 0;
  decodedBuffers.forEach(b => {
    if (b.buffer.duration > maxDuration) {
      maxDuration = b.buffer.duration;
    }
  });

  const sampleRate = 44100;
  
  // 3. Create OfflineAudioContext (Stereo, 44100Hz)
  const offlineCtx = new OfflineAudioContext(
    2,
    Math.ceil(sampleRate * maxDuration),
    sampleRate
  );

  // 4. Mix tracks with exact volumes
  decodedBuffers.forEach(({ buffer, volume }) => {
    const sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = buffer;

    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = volume / 100.0;

    sourceNode.connect(gainNode);
    gainNode.connect(offlineCtx.destination);
    
    sourceNode.start(0);
  });

  // 5. Render
  const renderedBuffer = await offlineCtx.startRendering();

  // 6. Encode to MP3 using lamejs
  const left = renderedBuffer.getChannelData(0);
  const right = renderedBuffer.numberOfChannels > 1 
    ? renderedBuffer.getChannelData(1) 
    : renderedBuffer.getChannelData(0);

  const sampleBlockSize = 1152; 
  // Initialize MP3 Encoder (Channels: 2, SampleRate: 44100, Bitrate: 192)
  const mp3encoder = new window.lamejs.Mp3Encoder(2, sampleRate, 192); 
  const mp3Data = [];

  const leftInt16 = new Int16Array(left.length);
  const rightInt16 = new Int16Array(right.length);
  
  floatTo16BitPCM(left, leftInt16);
  floatTo16BitPCM(right, rightInt16);

  let iterations = 0;
  for (let i = 0; i < leftInt16.length; i += sampleBlockSize) {
    const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
    const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    // Yield to the main thread every 100 blocks so the browser doesn't freeze
    iterations++;
    if (iterations % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  // 7. Create Blob
  const blob = new Blob(mp3Data, { type: 'audio/mp3' });
  return blob;
}
