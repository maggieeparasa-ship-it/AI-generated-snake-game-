import { useState } from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div id="main-container" className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-black selection:bg-magenta-500">
      <div className="noise" />
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden mix-blend-screen z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.1)_50%),_linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <header id="site-header" className="fixed top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
        <div id="brand-module" className="pointer-events-auto">
          <h1 id="app-title" className="text-3xl md:text-5xl font-bold glitch tracking-tighter text-cyan-400">
            SNAKE_SYNTH<span className="text-magenta-500">.v1</span>
          </h1>
          <p id="app-subtitle" className="text-[10px] text-cyan-800 uppercase tracking-[0.4em] mt-1 ml-1">
            NEON_TERMINAL_INTERFACE // BY_GRID_OPERATOR
          </p>
        </div>

        <div id="score-module" className="pointer-events-auto flex flex-col items-end">
          <div className="text-[10px] text-cyan-700 mb-1 uppercase tracking-widest font-bold">SESSION_SCORE</div>
          <div id="score-display" className="text-5xl font-bold tabular-nums text-magenta-500 drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]">
            {score.toString().padStart(6, '0')}
          </div>
        </div>
      </header>

      <main id="primary-viewport" className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Left Side Info (Desktop) */}
        <div id="system-diagnostic" className="hidden lg:flex flex-col gap-6 w-64 text-left">
          <div id="status-card" className="p-4 border-l-2 border-cyan-900 bg-cyan-950/20 tear-effect">
            <h4 className="text-xs font-bold text-cyan-600 mb-2 uppercase tracking-tight">SYSTEM_STATUS:</h4>
            <div className="space-y-1 text-[10px] text-cyan-700">
              <p>CPU_LOAD: <span className="text-cyan-400">NORMAL</span></p>
              <p>AUDIO_DRV: <span className="text-cyan-400">READY</span></p>
              <p>GRID_SYNC: <span className="text-magenta-500">GLITCHED</span></p>
              <p>KERNEL: <span className="text-cyan-400">0x8F2A-01</span></p>
            </div>
          </div>
          
          <div id="log-card" className="p-4 border-l-2 border-magenta-900 bg-magenta-950/20 tear-effect">
            <h4 className="text-xs font-bold text-magenta-600 mb-2 uppercase tracking-tight">LOG_OUTPUT:</h4>
            <div className="space-y-2 text-[9px] text-magenta-800 font-mono italic">
              <p>{'>'} USER_CONNECTED_0522</p>
              <p>{'>'} LOADING_NEURAL_SNAKE</p>
              <p>{'>'} BUFFERING_SYNTH_TRACKS</p>
              <p className="animate-pulse">{'>'} AWAITING_INPUT...</p>
            </div>
          </div>
        </div>

        {/* Center Game */}
        <motion.div 
          id="game-viewport"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center justify-center p-4"
        >
          <SnakeGame onScoreChange={setScore} />
        </motion.div>

        {/* Music Controls */}
        <motion.div 
          id="audio-viewport"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full flex-shrink-0 lg:w-96 flex flex-col gap-4"
        >
          <div className="text-[10px] text-cyan-800 uppercase tracking-[0.2em] mb-1 px-1">
            AUDIO_PROCESSING_UNIT
          </div>
          <MusicPlayer />
          
          <div id="notice-card" className="mt-4 p-4 border border-cyan-900 bg-cyan-950/10 text-[10px] text-cyan-700 leading-loose">
            <p className="border-b border-cyan-900 pb-1 mb-2 uppercase font-bold">TERMINAL_NOTICE</p>
            ENSURE_INPUT_FOCUS_FOR_MOVEMENT. PLAY_MUSIC_TO_SYNC_REFLEXES. SCORE_MULTIPLIER_ACTIVE_DURING_PEAK_FREQUENCIES. 
          </div>
        </motion.div>
      </main>

      <footer id="site-footer" className="fixed bottom-0 left-0 right-0 p-4 border-t border-cyan-950 bg-black/80 flex justify-between items-center z-30">
        <div id="footer-metrics" className="flex gap-4 text-[9px] text-cyan-900 uppercase tracking-widest">
          <span>LATENCY: 5MS</span>
          <span>BPM_SYNC: 128</span>
          <span className="text-magenta-950 animate-pulse">ENCRYPTION: ACTIVE</span>
        </div>
        <div id="legal-module" className="text-[9px] text-cyan-900 uppercase">
          © 2026_NEURAL_SLITHER_CORP
        </div>
      </footer>
    </div>
  );
}
