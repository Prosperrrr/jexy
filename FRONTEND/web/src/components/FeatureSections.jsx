import FadeIn from './FadeIn';

export default function FeatureSections() {
  return (
    <>
      <section className="py-24 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" delay={0.2}>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Analysis: Event Classification</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">YAMNet Analysis</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Before processing begins, the YAMNet model performs real-time classification of the audio stream. By detecting the presence of speech, music, or environmental noise, the pipeline intelligently routes the signal to the most effective enhancement modules.
              </p>
              <div className="font-mono text-xs md:text-sm text-slate-500 bg-slate-50 dark:bg-[#0f0f0f] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap">
                &gt; analyzing_stream...
                <br /> &gt; primary_class: speech (98.2%)
                <br /> &gt; secondary_class: music (1.5%)
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>SPEECH CONFIDENCE</span>
                      <span>98%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[98%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>MUSIC CONFIDENCE</span>
                      <span>1.5%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full w-[1.5%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>AMBIENT NOISE</span>
                      <span>0.3%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full w-[0.3%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <FadeIn direction="right" delay={0.4} className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-2 border border-slate-200 dark:border-slate-800">
                <div className="bg-black rounded-xl overflow-hidden relative aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full flex items-center justify-center space-x-1">
                      <div className="w-1 h-12 bg-slate-700 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-16 bg-slate-700 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-8 bg-slate-700 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-20 bg-slate-700 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-10 bg-slate-700 rounded-full animate-[pulse_1.1s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  <div className="z-10 grid grid-rows-4 gap-6 w-3/4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-500 w-12 text-right">SRC</span>
                      <div className="h-1 bg-slate-800 rounded-full flex-grow relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-full bg-slate-600/30"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-500 w-12 text-right">VOC</span>
                      <div className="h-1 bg-slate-800 rounded-full flex-grow relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-3/4 bg-white"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-500 w-12 text-right">DRM</span>
                      <div className="h-1 bg-slate-800 rounded-full flex-grow relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/2 bg-slate-400"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-500 w-12 text-right">BAS</span>
                      <div className="h-1 bg-slate-800 rounded-full flex-grow relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/4 bg-slate-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="order-1 lg:order-2">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Architecture: Hybrid Transformer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Source Separation</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Jexy implements the Demucs v4 architecture, utilizing a U-Net structure with a hybrid spectrogram/waveform domain approach. This dual-path analysis allows for minimal phase artifacts during the reconstruction of isolated stems.
              </p>
              <div className="font-mono text-sm text-slate-500 bg-slate-50 dark:bg-[#0f0f0f] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                &gt; separating_sources... done (1.2s)<br />
                &gt; artifact_reduction: enabled<br />
                &gt; output_format: flac_24bit
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" delay={0.2} className="relative">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Algorithm: Deep Filtering</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Spectral Denoising</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Leveraging DeepFilterNet, the system processes audio in the complex frequency domain. It estimates complex ideal ratio masks (cIRM) to effectively suppress environmental noise and reverberation without introducing the musical noise typical of spectral subtraction.
              </p>
              <ul className="space-y-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  ERB-scaled frequency analysis
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Real-time processing capability
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Preservation of speech harmonics
                </li>
              </ul>
            </FadeIn>

            <FadeIn direction="left" delay={0.4}>
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 h-80 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono uppercase text-slate-400 mb-4">
                  <span>Spectrogram Analysis</span>
                  <span>[Input vs Output]</span>
                </div>
                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Input Signal (Noisy)</span>
                      <span>-12dB SNR</span>
                    </div>
                    <div className="h-16 w-full bg-slate-200 dark:bg-slate-900 rounded-md overflow-hidden flex items-end px-1 gap-0.5">
                      {/* Using standard HTML generation logic instead of writing out 50 divs manually to save space, but keeping the visual intact */}
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className={`w-1 bg-slate-400`} style={{ height: `${Math.max(2, ((i * 13) % 16) * 4)}px` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Output Signal (Clean)</span>
                      <span>+24dB SNR</span>
                    </div>
                    <div className="h-16 w-full bg-slate-200 dark:bg-slate-900 rounded-md overflow-hidden flex items-end px-1 gap-0.5">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className={`w-1 bg-slate-800 dark:bg-slate-200`} style={{ height: `${i % 4 !== 0 ? Math.max(1, ((i * 7) % 15) * 4) : 2}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
