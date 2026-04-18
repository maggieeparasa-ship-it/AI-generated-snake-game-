import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types.ts';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DISTORTION_V1',
    artist: 'CYBER_WAIFU_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#06b6d4' // Cyan
  },
  {
    id: '2',
    title: 'SYSTEM_ERROR_FUNK',
    artist: 'KERNEL_PANIC',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#db2777' // Magenta
  },
  {
    id: '3',
    title: 'GLITCHED_LULLABY',
    artist: 'VOID_WALKER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#7c3aed' // Violet
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div id="music-player-container" className="glitch-border bg-black/40 backdrop-blur-md p-6 w-full max-w-md relative overflow-hidden group">
      {/* Background visualizer effect */}
      <div 
        id="playback-progress-bar"
        className="absolute bottom-0 left-0 h-1 transition-all duration-300"
        style={{ width: `${progress}%`, backgroundColor: currentTrack.color, boxShadow: `0 0 15px ${currentTrack.color}` }}
      />
      
      <audio 
        id="audio-stream"
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div id="player-core-layout" className="flex items-center gap-6">
        {/* Album Art / Glyph */}
        <div id="track-visual-module" className="relative w-24 h-24 flex-shrink-0">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-full h-full border-2 p-1 border-dashed"
            style={{ borderColor: currentTrack.color }}
          >
            <div 
              id="track-glyph"
              className="w-full h-full flex items-center justify-center font-bold text-4xl overflow-hidden"
              style={{ color: currentTrack.color, textShadow: `0 0 10px ${currentTrack.color}` }}
            >
              {currentTrack.title.charAt(0)}
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-gradient-to-t from-transparent via-current to-transparent animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div id="track-metadata-module" className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 id="track-title" className="text-xl font-bold truncate glitch" style={{ color: currentTrack.color }}>
                {currentTrack.title}
              </h3>
              <p id="track-artist" className="text-xs text-cyan-700 uppercase tracking-[0.2em] mt-1 font-bold">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div id="playback-controls" className="mt-4 flex items-center gap-4">
            <button 
              id="prev-btn"
              onClick={skipBackward}
              className="p-2 hover:text-magenta-500 transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button 
              id="play-pause-btn"
              onClick={togglePlay}
              className="p-3 border-2 border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button 
              id="next-btn"
              onClick={skipForward}
              className="p-2 hover:text-magenta-500 transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>

      <div id="volume-module" className="mt-6 flex items-center gap-3">
        <Volume2 size={16} className="text-cyan-700" />
        <div id="volume-rail" className="flex-1 h-1 bg-cyan-950 relative">
          <div 
            id="volume-indicator"
            className="absolute h-full bg-cyan-400" 
            style={{ width: '80%' }} 
          />
        </div>
        <span id="volume-value" className="text-[10px] text-cyan-700 tabular-nums font-bold">80%_VOL</span>
      </div>
    </div>
  );
}
