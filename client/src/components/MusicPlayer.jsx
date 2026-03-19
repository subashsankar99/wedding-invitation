import { useState, useRef, useEffect } from 'react';
import {
  FaMusic,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes
} from 'react-icons/fa';
import './MusicPlayer.css';

const TRACK = {
  name: 'Shehnai',
  artist: 'Wedding Classic',
  // ✅ Direct GitHub Release URL
  file: 'https://github.com/subashsankar99/wedding-invitation/releases/download/v1.0/shehnai.mp3',
  emoji: '🎺'
};

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPrompt, setShowPrompt] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Audio event listeners ───
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.loop = true;

    const handleTimeUpdate = () => {
      const prog = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(prog) ? 0 : prog);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
      setIsLoaded(true);
      setError(null);
      console.log('✅ Audio metadata loaded. Duration:', formatTime(audio.duration));
    };

    const handleCanPlayThrough = () => {
      console.log('✅ Audio ready to play through');
      setIsLoaded(true);
      setError(null);
    };

    const handleError = () => {
      const errorCode = audio.error?.code;
      const errorMessages = {
        1: 'Audio loading was aborted.',
        2: 'Network error while loading audio. Check your connection.',
        3: 'Audio decoding failed. The file may be corrupted.',
        4: 'Audio file not found or format not supported.'
      };

      const message = errorMessages[errorCode] || 'Unknown audio error occurred.';
      console.error(`❌ Audio error (code ${errorCode}):`, message);
      setError(message);
      setIsPlaying(false);
      setIsLoaded(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // ─── Auto-play attempt (only after loaded) ───
  useEffect(() => {
    if (!isLoaded) return;

    const attemptPlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
        console.log('✅ Autoplay successful');
      } catch (err) {
        console.log('⚠️ Autoplay blocked:', err.message);
        setShowPrompt(true);

        const playOnInteraction = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            setShowPrompt(false);
          } catch (e) {
            console.error('Failed to play on interaction:', e.message);
          }
        };

        window.addEventListener('click', playOnInteraction, { once: true });
        window.addEventListener('touchstart', playOnInteraction, { once: true });

        return () => {
          window.removeEventListener('click', playOnInteraction);
          window.removeEventListener('touchstart', playOnInteraction);
        };
      }
    };

    const timer = setTimeout(attemptPlay, 500);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    setShowPrompt(false);

    if (!isLoaded) {
      try {
        audio.load();
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          setTimeout(reject, 5000);
        });
        setIsLoaded(true);
      } catch (e) {
        setError('Audio failed to load. Please try again.');
        return;
      }
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      console.error('Play error:', err);
      setError('Failed to play. Click again.');
    }
  };

  const handleVolumeChange = (e) => {
    let vol = parseFloat(e.target.value);
    if (vol > 0.4) vol = 0.4;
    setVolume(vol);
    audioRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume || 0.4;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!isLoaded) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
  };

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
    setShowPrompt(false);
  };

  return (
    <>
      {/* ✅ crossOrigin needed for external URLs */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="auto">
        <source src={TRACK.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {showPrompt && !error && (
        <div className="music-prompt" onClick={togglePlay}>
          <span>🎵 Click to Play Wedding Music</span>
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

      <button
        className={`music-fab ${isPlaying ? 'playing' : ''}`}
        onClick={togglePanel}
        title="Toggle Music Player"
      >
        <FaMusic className="music-fab-icon" />
        {isPlaying && (
          <div className="audio-waves">
            <span className="wave wave-1"></span>
            <span className="wave wave-2"></span>
            <span className="wave wave-3"></span>
            <span className="wave wave-4"></span>
          </div>
        )}
      </button>

      <div className={`music-panel ${isPanelOpen ? 'open' : ''}`}>
        <button className="panel-close" onClick={togglePanel}>
          <FaTimes />
        </button>

        <div className="track-info">
          <span className="track-emoji">{TRACK.emoji}</span>
          <div className="track-details">
            <h4 className="track-name">{TRACK.name}</h4>
            <p className="track-artist">{TRACK.artist}</p>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: '#ff6b6b',
              fontSize: '12px',
              textAlign: 'center',
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '6px',
              lineHeight: '1.4'
            }}
          >
            <div>⚠️ {error}</div>
            <button
              onClick={() => {
                setError(null);
                setIsLoaded(false);
                audioRef.current?.load();
              }}
              style={{
                marginTop: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: '4px',
                color: '#ff6b6b',
                cursor: 'pointer'
              }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div className="progress-thumb" style={{ left: `${progress}%` }} />
          </div>
          <div className="time-display">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        <div className="music-controls">
          <button
            className={`play-btn ${isPlaying ? 'active' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>

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

      {isPanelOpen && <div className="music-overlay" onClick={togglePanel} />}
    </>
  );
};

export default MusicPlayer;
