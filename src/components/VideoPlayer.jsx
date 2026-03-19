import React, { useEffect, useRef, useState } from 'react';
import mpegts from 'mpegts.js';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCog, FaExpand } from 'react-icons/fa';

export const VideoPlayer = ({ streamKey, isLive = false, posterUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    // Clean up previous player if exists
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (!isLive || !streamKey || !mpegts.isSupported()) {
      return;
    }

    setHasError(false);

    try {
      const player = mpegts.createPlayer({
        type: 'flv',
        isLive: true,
        url: `http://localhost:8000/live/${streamKey}.flv`,
        hasAudio: true,
        hasVideo: true,
      });

      playerRef.current = player;
      player.attachMediaElement(videoRef.current);
      player.load();
      player.play().catch(e => {
        console.warn('Autoplay prevented or stream error:', e);
        if (e.name === 'NotAllowedError') {
          setIsMuted(true);
          player.play(); // Try again muted
        }
      });

      player.on(mpegts.Events.ERROR, (e) => {
        console.error('FLV Player Error:', e);
        setHasError(true);
      });

    } catch (err) {
      console.error('Failed to init player:', err);
      setHasError(true);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [streamKey, isLive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!isLive || hasError) {
    return (
      <div className="video-player offline relative aspect-video bg-black flex items-center justify-center">
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt="Offline" 
            className="w-full h-full object-cover opacity-50"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Offline</h2>
          <p style={{ color: 'var(--nz-text-muted)' }}>This channel is not currently live.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="video-player aspect-video bg-black relative group"
      onMouseMove={handleMouseMove}
      style={{ width: '100%', paddingBottom: '56.25%', position: 'relative', backgroundColor: '#000' }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      
      {/* Controls Overlay */}
      <div 
        className={`player-controls absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          opacity: showControls ? 1 : 0, transition: 'opacity 0.3s'
        }}
      >
        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={togglePlay} className="text-white hover:text-nz-accent transition-colors">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <div className="flex items-center gap-2 group/volume" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleMute} className="text-white hover:text-nz-accent transition-colors">
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-nz-accent"
              style={{ width: '80px', accentColor: 'var(--nz-accent)' }}
            />
          </div>

          <div className="spacer" style={{ flex: 1 }}></div>

          <button className="text-white hover:text-nz-accent transition-colors">
            <FaCog />
          </button>
          <button onClick={toggleFullScreen} className="text-white hover:text-nz-accent transition-colors">
            <FaExpand />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
