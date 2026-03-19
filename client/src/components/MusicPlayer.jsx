import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaMusic,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes
} from 'react-icons/fa';
import './MusicPlayer.css';

// Try multiple URLs as fallback
const TRACK = {
  name: 'Shehnai',
  artist: 'Wedding Classic',
  files: [
    '/audio/shehnai.mp3', // Try local first
    'https://cdn.jsdelivr.net/gh/subashsankar99/wedding-invitation@main/public/audio/shehnai.mp3', // Fallback 1
    'https://raw.githubusercontent.com/subashsankar99/wedding-invitation/main/public/audio/shehnai.mp3' // Fallback 2
  ],
  emoji: '🎺'
};

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const hasAutoPlayed = useRef(false);
  const currentFileIndex = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPrompt, setShowPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Try next audio source on error
  const tryNextSource = useCallback(() => {
    currentFileIndex.current += 1;
    if (currentFileIndex.current < TRACK.files.length) {
      console.log(`Trying fallback source ${currentFileIndex.current + 1}...`);
      audioRef.current.src = TRACK.files[currentFileIndex.current];
      audioRef.current.load();
    } else {
      setError('Unable to load music from any source');
      setIsLoading(false);
    }
  }, []);

  // Autoplay on page load
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4;

    const attemptAutoplay = async () => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;

      // Wait a bit for the audio to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.log('Autoplay blocked by browser, waiting for interaction…');
        setIsPlaying(false);
        setIsLoading(false);

        const startOnInteraction = async () => {
          try {
            audio.volume = 0.4;
            await audio.play();
            setIsPlaying(true);
            setShowPrompt(false);
            setError(null);
          } catch (e) {
            console.log('Play after interaction failed:', e);
            setError('Click the play button to start music');
          }
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
          document.removeEventListener('keydown', startOnInteraction);
        };

        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
      }
    };

    attemptAutoplay();
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;

    const handleTimeUpdate = () => {
      const prog = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(prog) ? 0 : prog);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
      setIsLoading(false);
      console.log('Audio loaded successfully');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      console.log('Audio ready to play');
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      console.error('Error details:', audio.error);
      
      // Try next source if available
      if (currentFileIndex.current < TRACK.files.length - 1) {
        tryNextSource();
      } else {
        setError('Failed to load music. Please try refreshing the page.');
        setIsLoading(false);
        setIsPlaying(false);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log('Loading audio from:', audio.src);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [volume, isMuted, tryNextSource]);

  // Play / Pause
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    setShowPrompt(false);

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.volume = isMuted ? 0 : volume;
        
        // Wait for audio to be ready
        if (audio.readyState < 2) {
          setIsLoading(true);
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
            audio.addEventListener('canplay', () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });
          });
        }
        
        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      console.log('Audio play failed:', err);
      setIsPlaying(false);
      setError('Failed to play music. Click play again.');
      setIsLoading(false);
    }
  }, [isPlaying, volume, isMuted]);

  // Volume change (capped at 40%)
  const handleVolumeChange = (e) => {
    let vol = parseFloat(e.target.value);
    if (vol > 0.4) vol = 0.4;
    setVolume(vol);
    audioRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  // Mute toggle
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume || 0.4;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Progress bar click
  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  // Toggle panel
  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
    setShowPrompt(false);
  };

  return (
    <>
      {/* Hidden audio element with multiple sources */}
      <audio 
        ref={audioRef} 
        preload="auto"
      >
        {TRACK.files.map((file, index) => (
          <source key={index} src={file} type="audio/mpeg" />
        ))}
        Your browser does not support the audio element.
      </audio>

      {/* Initial prompt bubble */}
      {showPrompt && (
        <div className="music-prompt" onClick={togglePanel}>
          <span>🎵 Play Wedding Music?</span>
          <button
            className="prompt-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowPrompt(false);
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Floating music button */}
      <button
        className={`music-fab ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={togglePanel}
        title="Toggle Music Player"
      >
        <FaMusic className="music-fab-icon" />

        {isPlaying && !isLoading && (
          <div className="audio-waves">
            <span className="wave wave-1"></span>
            <span className="wave wave-2"></span>
            <span className="wave wave-3"></span>
            <span className="wave wave-4"></span>
          </div>
        )}
      </button>

      {/* Expanded panel */}
      <div className={`music-panel ${isPanelOpen ? 'open' : ''}`}>
        <button className="panel-close" onClick={togglePanel}>
          <FaTimes />
        </button>

        {/* Track info */}
        <div className="track-info">
          <span className="track-emoji">{TRACK.emoji}</span>
          <div className="track-details">
            <h4 className="track-name">{TRACK.name}</h4>
            <p className="track-artist">{TRACK.artist}</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-message" style={{ 
            color: '#ff6b6b', 
            fontSize: '12px', 
            textAlign: 'center', 
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '4px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-message" style={{ 
            textAlign: 'center', 
            fontSize: '12px', 
            opacity: 0.7,
            marginBottom: '8px'
          }}>
            ⏳ Loading music...
          </div>
        )}

        {/* Progress bar */}
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="time-display">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="music-controls">
          <button
            className={`play-btn ${isPlaying ? 'active' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            disabled={isLoading && !isPlaying}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>

        {/* Volume */}
        <div className="volume-container">
          <button className="volume-btn" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      {/* Overlay when panel is open */}
      {isPanelOpen && (
        <div className="music-overlay" onClick={togglePanel} />
      )}
    </>
  );
};

export default MusicPlayer;
