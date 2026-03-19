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

// Single track with GitHub Release URL
const TRACK = {
  name: 'Shehnai',
  artist: 'Wedding Classic',
  file: 'https://github.com/subashsankar99/wedding-invitation/releases/download/v1.0/shehnai.mp3',
  emoji: '🎺'
};

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const hasAutoPlayed = useRef(false);
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

  // Autoplay on page load
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4;

    const attemptAutoplay = async () => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;

      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
        setIsLoading(false);
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
          } catch (e) {
            console.log('Play after interaction failed:', e);
          }
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
          document.removeEventListener('keydown', startOnInteraction);
          document.removeEventListener('scroll', startOnInteraction);
        };

        document.addEventListener('click', startOnInteraction, { once: false });
        document.addEventListener('touchstart', startOnInteraction, { once: false });
        document.addEventListener('keydown', startOnInteraction, { once: false });
        document.addEventListener('scroll', startOnInteraction, { once: false });
      }
    };

    attemptAutoplay();
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = true; // Loop the single track continuously

    const handleTimeUpdate = () => {
      const prog = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(prog) ? 0 : prog);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = (e) => {
      console.error('Audio loading error:', e);
      setError('Failed to load music. Please check your connection.');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [volume, isMuted]);

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
        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      console.log('Audio play failed:', err);
      setIsPlaying(false);
      setError('Failed to play music');
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
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={TRACK.file} 
        preload="auto"
        crossOrigin="anonymous"
      />

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
            marginBottom: '8px'
          }}>
            {error}
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
            Loading music...
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

        {/* Controls — only play/pause, no next/prev needed */}
        <div className="music-controls">
          <button
            className={`play-btn ${isPlaying ? 'active' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            disabled={isLoading}
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
